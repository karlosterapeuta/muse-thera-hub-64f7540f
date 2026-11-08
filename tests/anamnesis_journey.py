"""Regressão da anamnese com pacientes fictícios e backend inteiramente interceptado."""
import base64
import json
import subprocess
import tempfile
import time
from pathlib import Path
from urllib.parse import parse_qs, urlsplit

from playwright.sync_api import expect, sync_playwright

BASE = "http://127.0.0.1:4173"
A = "aaaaaaaa-aaaa-4aaa-aaaa-000000000021"
B = "aaaaaaaa-aaaa-4aaa-aaaa-000000000022"
USER = "aaaaaaaa-aaaa-4aaa-aaaa-000000000023"
ANAMNESIS = "aaaaaaaa-aaaa-4aaa-aaaa-000000000024"
user = {"id": USER, "email": "teste@example.invalid", "aud": "authenticated", "role": "authenticated",
        "app_metadata": {}, "user_metadata": {}}
patients = [
    {"id": A, "name": "Ana Teste", "age": 10, "birth_date": "2015-05-01", "responsible": "Responsável Teste", "contact": ""},
    {"id": B, "name": "Beto Teste", "age": 8, "birth_date": "2017-05-01", "responsible": "Responsável Teste", "contact": ""},
]
STAMP = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/TioAAAAASUVORK5CYII="
professional = {"id": USER, "user_id": USER, "name": "Profissional Teste", "email": user["email"],
                "digital_signature_url": STAMP, "digital_stamp_url": STAMP, "stamp_photo_url": STAMP}


def encoded(obj):
    return base64.urlsafe_b64encode(json.dumps(obj).encode()).decode().rstrip("=")


def run():
    records = []
    requests = []

    def backend(route):
        url = urlsplit(route.request.url)
        if url.hostname == "127.0.0.1":
            return route.continue_()
        if url.hostname != "jztbkimlcrfndooyhohg.supabase.co":
            return route.abort()
        table = url.path.split("/")[-1]
        result = []
        status = 200
        if url.path == "/auth/v1/user":
            result = user
        elif table == "patients":
            patient_id = parse_qs(url.query).get("id", [""])[0].removeprefix("eq.")
            result = [p for p in patients if not patient_id or p["id"] == patient_id]
        elif table == "profiles":
            result = [{"id": USER, "name": "Teste", "status": "active"}]
        elif table == "professionals":
            result = [professional]
        elif table == "anamnesis":
            if route.request.method in ("POST", "PATCH"):
                payload = route.request.post_data_json
                requests.append((route.request.method, payload))
                if route.request.method == "POST":
                    record = dict(payload, id=ANAMNESIS, created_at="2026-11-08T10:00:00Z",
                                  updated_at="2026-11-08T10:00:00Z", filled_by_guardian=False)
                    records.append(record)
                    status = 201
                else:
                    record = records[0]
                    record.update(payload)
                    record["updated_at"] = "2026-11-08T10:03:00Z"
                result = [record]
            elif "head=true" in route.request.headers.get("prefer", ""):
                result = []
            elif "limit=1" in url.query and "select=%2A" in url.query:
                # Colunas já migradas, e nenhuma informação clínica real.
                result = []
            elif "patients%28name%29" in url.query:
                result = [dict(record, patients={"name": "Ana Teste"}) for record in records]
            else:
                result = records
        elif table == "anamnesis_revision_log":
            result = []
        elif "/storage/v1/object/list/" in url.path:
            result = []
        if "vnd.pgrst.object" in route.request.headers.get("accept", "") and isinstance(result, list):
            result = result[0] if result else None
        route.fulfill(status=status, json=result if result is not None else {})

    expires = int(time.time()) + 3600
    token = ".".join([encoded({"alg": "HS256", "typ": "JWT"}),
                      encoded({"sub": USER, "exp": expires, "role": "authenticated"}), "test"])
    session = {"access_token": token, "refresh_token": "synthetic", "expires_at": expires,
               "expires_in": 3600, "token_type": "bearer", "user": user}

    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        ctx = browser.new_context(service_workers="block", accept_downloads=True, viewport={"width": 1200, "height": 850})
        ctx.route("**/*", backend)
        ctx.add_init_script("localStorage.setItem('sb-jztbkimlcrfndooyhohg-auth-token', "
                            + json.dumps(json.dumps(session)) + ")")
        page = ctx.new_page()
        page.goto(BASE + "/anamnesis")
        page.get_by_role("button", name="Nova Anamnese").click()
        page.get_by_role("combobox", name="Paciente", exact=True).click()
        page.get_by_role("option", name="Ana Teste").click()
        field = page.locator("#main_clinical_demand")
        field.fill("Demanda fictícia de comunicação em musicoterapia")
        expect(page.get_by_text("Alterações ainda não salvas")).to_be_visible()

        # Trocar de paciente exige confirmação e não perde o conteúdo ao cancelar.
        page.get_by_role("combobox", name="Paciente", exact=True).click()
        page.once("dialog", lambda dialog: dialog.dismiss())
        page.get_by_role("option", name="Beto Teste").click()
        expect(page.get_by_role("combobox", name="Paciente", exact=True)).to_contain_text("Ana Teste")
        expect(field).to_have_value("Demanda fictícia de comunicação em musicoterapia")

        # Um único insert para o primeiro rascunho e atualizações para mudanças posteriores.
        expect(page.get_by_text("Dados salvos no sistema")).to_be_visible(timeout=12000)
        assert len(records) == 1 and requests[0][0] == "POST" and records[0]["patient_id"] == A
        page.get_by_role("button", name="Finalizar anamnese").click()
        expect(page.get_by_text("Anamnese incompleta para finalização")).to_be_visible()
        assert records[0].get("review_status") != "finalized"

        page.get_by_role("tab", name="Histórico Musical").click()
        page.locator("#patient_musical_history").fill("Paciente gosta de teclado e de ritmos suaves")
        page.get_by_role("tab", name="Terapêutico e Comportamental").click()
        page.locator("#therapeutic_goals").fill("Aumentar turnos de interação compartilhada")
        page.get_by_role("button", name="Finalizar anamnese").click()
        expect(page.get_by_text("Situação da anamnese: Finalizada")).to_be_visible(timeout=12000)
        assert records[0]["review_status"] == "finalized"
        assert len([req for req in requests if req[0] == "POST"]) == 1
        assert records[0]["patient_musical_history"].startswith("Paciente gosta")

        # O PDF é gerado com dados sintéticos e inclui duas imagens profissionais.
        with page.expect_download(timeout=90000) as event:
            page.get_by_role("button", name="Exportar PDF").click()
        with tempfile.TemporaryDirectory() as folder:
            pdf = Path(folder) / "anamnesis-synthetic.pdf"
            event.value.save_as(pdf)
            body = subprocess.check_output(["pdftotext", str(pdf), "-"], text=True)
            assert "Ana Teste" in body and "Beto Teste" not in body
            assert "Demanda fictícia" in body and "turnos de interação" in body
            images = subprocess.check_output(["pdfimages", "-list", str(pdf)], text=True)
            assert len(images.splitlines()) >= 4, images
            subprocess.run(["pdftoppm", "-f", "1", "-singlefile", "-scale-to", "900", "-png", str(pdf), str(Path(folder) / "first-page")], check=True)
            assert (Path(folder) / "first-page.png").exists()
        print("Anamnese sintética: troca protegida, 1 insert, autosave, validação, finalização, PDF com 2 imagens — OK")
        browser.close()


if __name__ == "__main__":
    run()
