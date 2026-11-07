"""Local portal regression using two synthetic records and an isolated HTTP backend."""
import base64
import json
import re
import subprocess
import tempfile
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import parse_qs, urlsplit

from playwright.sync_api import expect, sync_playwright

BASE = "http://127.0.0.1:4173"
A, B, USER = [f"aaaaaaaa-aaaa-4aaa-aaaa-{n:012d}" for n in range(1, 4)]
patients = [{"id": pid, "name": name, "birth_date": "2015-05-01", "anamnesis": []}
            for pid, name in [(A, "Ana Teste"), (B, "Beto Teste")]]
user = {"id": USER, "email": "teste@example.invalid", "aud": "authenticated",
        "role": "authenticated", "app_metadata": {}, "user_metadata": {}}


def encoded(obj):
    return base64.urlsafe_b64encode(json.dumps(obj).encode()).decode().rstrip("=")


def run():
    rows = []

    def backend(route):
        url = urlsplit(route.request.url)
        if url.hostname == "127.0.0.1":
            return route.continue_()
        if url.hostname != "jztbkimlcrfndooyhohg.supabase.co":
            return route.abort()
        table = url.path.split("/")[-1]
        result = []
        if url.path == "/auth/v1/user":
            result = user
        elif table == "patients":
            result = patients
        elif table == "profiles":
            result = [{"id": USER, "name": "Teste", "status": "active"}]
        elif table == "professionals":
            result = [{"id": USER, "user_id": USER, "name": "Teste"}]
        elif table == "assessments":
            if route.request.method == "POST":
                row = route.request.post_data_json
                rows.append(dict(row, id="aaaaaaaa-aaaa-4aaa-aaaa-000000000004",
                                 patients=next(p for p in patients if p["id"] == row["patient_id"])))
                return route.fulfill(status=201, body="")
            pid = parse_qs(url.query).get("patient_id", [""])[0].removeprefix("eq.")
            result = [r for r in rows if not pid or r["patient_id"] == pid]
        if "vnd.pgrst.object" in route.request.headers.get("accept", "") and isinstance(result, list):
            result = result[0] if result else None
        route.fulfill(json=result if result is not None else {}, status=200)

    expires = int(time.time()) + 3600
    token = ".".join([encoded({"alg": "HS256", "typ": "JWT"}),
                      encoded({"sub": USER, "exp": expires, "role": "authenticated"}), "test"])
    session = {"access_token": token, "refresh_token": "synthetic", "expires_at": expires,
               "expires_in": 3600, "token_type": "bearer", "user": user}
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        ctx = browser.new_context(service_workers="block", timezone_id="UTC")
        ctx.route("**/*", backend)
        ctx.add_init_script("localStorage.setItem('sb-jztbkimlcrfndooyhohg-auth-token', "
                            + json.dumps(json.dumps(session)) + ")")
        page = ctx.new_page()

        def open_evaluation(patient):
            page.goto(BASE + "/patients")
            page.get_by_role("button", name="Continuar atendimento de " + patient["name"]).click()
            page.get_by_role("menuitem", name="Avaliação", exact=True).click()
            expect(page.get_by_role("combobox", name="Paciente", exact=True)).to_contain_text(patient["name"])

        open_evaluation(patients[0])
        page.get_by_role("button", name=re.compile("^Aplicar atividades")).first.click()
        levels = page.get_by_role("button", name=re.compile(r"Não Obs\., nível 0$"))
        for i in range(8):
            levels.nth(i).click()
        with page.expect_response(lambda r: "/rest/v1/assessments" in r.url and r.request.method == "POST"):
            page.get_by_role("button", name="Salvar Avaliação", exact=True).click()
        assert len(rows) == 1 and rows[0]["patient_id"] == A
        row = rows[0]
        assert row["content"]["overallScore"]["evaluatedParameters"] == 8
        # Simulate loading a historical row without counters, including a legacy zero.
        del row["content"]["overallScore"]
        selections = row["content"]["selections"]
        selections[next(iter(selections))] = "0"
        selections["Indicador não aplicável"] = "nao_aplicavel"
        selections["Indicador em branco"] = ""
        # Leave a distinct unsaved response for A before checking B.
        first = levels.first
        expect(first).to_have_attribute("aria-pressed", "false")
        first.click()
        expect(first).to_have_attribute("aria-pressed", "true")
        page.get_by_role("link", name="Abrir PTI deste paciente").click()
        expect(page.get_by_text("Ana Teste", exact=True).first).to_be_visible()
        page.get_by_role("link", name="Abrir intervenção").click()
        expect(page.get_by_role("combobox", name="Paciente", exact=True)).to_contain_text("Ana Teste")
        open_evaluation(patients[1])
        page.get_by_role("button", name=re.compile("^Aplicar atividades")).first.click()
        expect(levels.first).to_have_attribute("aria-pressed", "false")
        open_evaluation(patients[0])
        page.get_by_role("button", name=re.compile("^Aplicar atividades")).first.click()
        expect(levels.first).to_have_attribute("aria-pressed", "true")
        page.goto(BASE + "/evaluation/paciente/" + A)
        with page.expect_download(timeout=90000) as event:
            page.get_by_role("button", name="Baixar avaliação individual (PDF)").click()
        download = event.value
        assert "Inicial-Ana Teste" in download.suggested_filename
        with tempfile.TemporaryDirectory() as folder:
            pdf = Path(folder) / "avaliacao.pdf"
            download.save_as(pdf)
            subprocess.run(["pdftoppm", "-r", "150", "-png", str(pdf), folder + "/page"], check=True)
            text = " ".join(subprocess.check_output(["tesseract", str(img), "stdout", "-l", "por"],
                            text=True) for img in sorted(Path(folder).glob("page-*.png")))
            text = " ".join(text.split())
            assert "Ana Teste" in text and "Beto Teste" not in text, text
            assert datetime.fromisoformat(row["date"].replace("Z", "+00:00")).astimezone(timezone.utc).strftime("%d/%m/%Y") in text, text
            assert re.search(r"8 parâmetros foram avaliados", text, re.I), text
        browser.close()


if __name__ == "__main__":
    run()
