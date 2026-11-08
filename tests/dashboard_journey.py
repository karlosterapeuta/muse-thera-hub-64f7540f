"""Validação visual, clínica e de isolamento com backend e pacientes 100% fictícios."""
import base64
import json
import os
import time
from datetime import datetime
from pathlib import Path
from urllib.parse import parse_qs, urlsplit
from playwright.sync_api import expect, sync_playwright

BASE = "http://127.0.0.1:4173"
USER_A = "aaaaaaaa-aaaa-4aaa-aaaa-000000000031"
USER_B = "bbbbbbbb-bbbb-4bbb-bbbb-000000000032"
PATIENT_A = "aaaaaaaa-aaaa-4aaa-aaaa-000000000041"
PATIENT_B = "bbbbbbbb-bbbb-4bbb-bbbb-000000000042"
ARTIFACTS = Path("artifacts/dashboard")


def encoded(value):
    return base64.urlsafe_b64encode(json.dumps(value).encode()).decode().rstrip("=")


def run_case(browser, user_id, patient_id, name, width, broken=False):
    user = {"id": user_id, "email": "exemplo@teste.invalid", "aud": "authenticated",
            "role": "authenticated", "app_metadata": {}, "user_metadata": {}}
    expires = int(time.time()) + 3600
    token = ".".join([encoded({"alg": "HS256", "typ": "JWT"}), encoded({"sub": user_id, "exp": expires, "role": "authenticated"}), "test"])
    session = {"access_token": token, "refresh_token": "synthetic", "expires_at": expires,
               "expires_in": 3600, "token_type": "bearer", "user": user}
    today = datetime.now().strftime("%Y-%m-%d")
    rows = {
        "patients": [{"id": patient_id, "name": name, "professional_id": user_id,
                      "created_at": "2026-01-01", "updated_at": "2026-01-01", "birth_date": "2015-01-01",
                      "responsible": "Responsável Fictício", "contact": None, "age": 11}],
        "anamnesis": [], "reports": [], "treatment_plans": [],
        "sessions": [{"id": "cccccccc-cccc-4ccc-cccc-000000000051", "patient_id": patient_id,
                      "date": today, "notes": "Observação fictícia",
                      "patients": {"name": name, "professional_id": user_id}}],
        "financial_records": [], "professionals": [{"id": user_id, "user_id": user_id}],
        "profiles": [{"id": user_id, "name": "Profissional Fictício", "status": "active",
                      "created_at": "2026-01-01", "expires_at": None, "plan_start_date": "2026-01-01"}],
    }
    requests = []

    def backend(route):
        parsed = urlsplit(route.request.url)
        if parsed.hostname == "127.0.0.1":
            return route.continue_()
        if parsed.hostname != "jztbkimlcrfndooyhohg.supabase.co":
            return route.abort()
        table = parsed.path.rsplit("/", 1)[-1]
        if parsed.path == "/auth/v1/user":
            return route.fulfill(json=user)
        if "/rest/v1/rpc/" in parsed.path:
            return route.fulfill(json=False)
        requests.append(table)
        if table == "sessions" and broken:
            return route.fulfill(status=503, json={"message": "Falha temporária"})
        data = rows.get(table, [])
        filters = parse_qs(parsed.query)
        owner_filters = [value for key, values in filters.items() for value in values
                         if key.endswith("professional_id") and value.startswith("eq.")]
        if any(value[3:] != user_id for value in owner_filters):
            data = []
        if route.request.method == "HEAD":
            count = len(data)
            return route.fulfill(status=200, body="", headers={
                "Content-Range": f"0-{max(0, count-1)}/{count}",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Expose-Headers": "Content-Range",
            })
        if "vnd.pgrst.object" in route.request.headers.get("accept", ""):
            return route.fulfill(json=data[0] if data else None)
        return route.fulfill(json=data)

    ctx = browser.new_context(service_workers="block", viewport={"width": width, "height": 800})
    ctx.route("**/*", backend)
    ctx.add_init_script("localStorage.setItem('sb-jztbkimlcrfndooyhohg-auth-token', " + json.dumps(json.dumps(session)) + ")")
    page = ctx.new_page()
    page.goto(BASE + "/dashboard")
    expect(page.get_by_role("heading", name="Visão geral")).to_be_visible(timeout=20000)
    if broken:
        expect(page.get_by_text("Não foi possível consultar os atendimentos.", exact=False)).to_be_visible(timeout=20000)
        assert page.get_by_text("Nenhum atendimento registrado para os próximos dias desta semana").count() == 0
    else:
        expect(page.get_by_text(name).first).to_be_visible(timeout=20000)
        # A resposta sintética representa um paciente existente; nunca exibir zero.
        expect(page.get_by_role("button", name="Abrir Pacientes").get_by_text("1", exact=True)).to_be_visible(timeout=20000)
        assert page.get_by_text("Beto Teste" if name == "Ana Teste" else "Ana Teste").count() == 0
        expect(page.get_by_text("Horário não informado").first).to_be_visible()
        if name == "Ana Teste":
            page.get_by_role("button", name="Registrar evolução").last.click()
            expect(page).to_have_url(f"{BASE}/processes/evolution?patient_id={patient_id}")
            expect(page.get_by_text(name).first).to_be_visible(timeout=20000)
            page.go_back()
            expect(page.get_by_role("heading", name="Visão geral")).to_be_visible(timeout=20000)
    dims = page.evaluate("({ width: document.documentElement.scrollWidth, viewport: window.innerWidth })")
    assert dims["width"] <= dims["viewport"] + 2, f"Rolagem horizontal: {dims}"
    if width <= 360:
        height = page.get_by_role("button", name="Atualizar", exact=True).evaluate("el => el.getBoundingClientRect().height")
        assert height >= 44, f"Alvo de toque menor que 44 px: {height}"
    ARTIFACTS.mkdir(parents=True, exist_ok=True)
    page.screenshot(path=str(ARTIFACTS / f"dashboard-{name.split()[0].lower()}-{width}{'-erro' if broken else ''}.png"), full_page=True)
    assert "sessions" in requests
    ctx.close()
    print(f"Dashboard fictício: {name}, {width}px, falha={broken} — OK")


def run():
    with sync_playwright() as pw:
        executable = os.getenv("PLAYWRIGHT_CHROMIUM_EXECUTABLE")
        browser = pw.chromium.launch(executable_path=executable) if executable else pw.chromium.launch()
        run_case(browser, USER_A, PATIENT_A, "Ana Teste", 1280)
        run_case(browser, USER_B, PATIENT_B, "Beto Teste", 360)
        run_case(browser, USER_A, PATIENT_A, "Ana Teste", 360, broken=True)
        browser.close()


if __name__ == "__main__":
    run()
