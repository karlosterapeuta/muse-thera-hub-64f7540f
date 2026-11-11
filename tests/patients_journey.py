"""Fluxo de Pacientes com contas e prontuários exclusivamente fictícios."""
import base64
import json
import os
import time
from pathlib import Path
from urllib.parse import urlsplit, parse_qs
from playwright.sync_api import expect, sync_playwright

BASE = "http://127.0.0.1:4173"
HOST = "jztbkimlcrfndooyhohg.supabase.co"
ARTIFACTS = Path("artifacts/patients")
A = "aaaaaaaa-aaaa-4aaa-aaaa-000000000031"
B = "bbbbbbbb-bbbb-4bbb-bbbb-000000000032"

def encoded(value):
    return base64.urlsafe_b64encode(json.dumps(value).encode()).decode().rstrip("=")

def run_case(browser, user_id, name, width, test_write=False):
    user = {"id": user_id, "email": "profissional@exemplo.invalid", "aud": "authenticated",
            "role": "authenticated", "app_metadata": {}, "user_metadata": {}}
    expires = int(time.time()) + 3600
    token = ".".join([encoded({"alg": "HS256", "typ": "JWT"}), encoded({"sub": user_id, "exp": expires, "role": "authenticated"}), "test"])
    session = {"access_token": token, "refresh_token": "synthetic", "expires_at": expires,
               "expires_in": 3600, "token_type": "bearer", "user": user}
    rows = [
      {"id": user_id.replace("0031", "0041").replace("0032", "0042"),
       "name": name, "professional_id": user_id, "created_at": "2026-11-01T12:00:00Z",
       "updated_at": "2026-11-01T12:00:00Z", "birth_date": "2015-01-01",
       "responsible": "Responsável de Teste", "contact": "81999999999",
       "anamnesis": [{"review_status": "finalized"}], "photo_url": None},
      {"id": user_id.replace("0031", "0043").replace("0032", "0044"),
       "name": "Rascunho " + name, "professional_id": user_id, "created_at": "2026-10-01T12:00:00Z",
       "updated_at": "2026-10-01T12:00:00Z", "birth_date": "2014-01-01",
       "responsible": None, "contact": None, "anamnesis": [{"review_status": "draft"}], "photo_url": None},
    ]
    attempts = []
    def backend(route):
        parsed = urlsplit(route.request.url)
        if parsed.hostname == "127.0.0.1":
            return route.continue_()
        if parsed.hostname != HOST:
            return route.abort()
        if parsed.path == "/auth/v1/user":
            return route.fulfill(json=user)
        if "/rest/v1/rpc/" in parsed.path:
            return route.fulfill(json=False)
        table = parsed.path.rsplit("/", 1)[-1]
        if table == "patients":
            owner = parse_qs(parsed.query).get("professional_id", [""])[0]
            if owner and owner != "eq." + user_id:
                return route.fulfill(json=[])
            method = route.request.method
            if method == "POST":
                attempts.append("create")
                if len([x for x in attempts if x == "create"]) == 1:
                    return route.fulfill(status=503, json={"message": "Erro de teste ao cadastrar"})
                payload = json.loads(route.request.post_data)
                created = payload[0] if isinstance(payload, list) else payload
                created["id"] = user_id.replace("0031", "0045").replace("0032", "0046")
                created["created_at"] = "2026-11-11T12:00:00Z"
                created["anamnesis"] = []
                rows.append(created)
                return route.fulfill(json={"id": created["id"]})
            if method == "PATCH":
                attempts.append("update")
                return route.fulfill(status=503, json={"message": "Erro de teste ao editar"})
            return route.fulfill(json=rows)
        if table == "profiles":
            return route.fulfill(json=[{"id": user_id, "name": "Profissional de teste", "status": "active", "expires_at": None}])
        if table in ("professionals", "anamnesis", "sessions", "treatment_plans", "assessments"):
            return route.fulfill(json=[])
        return route.fulfill(json=[])
    ctx = browser.new_context(service_workers="block", viewport={"width": width, "height": 820}, accept_downloads=True)
    ctx.route("**/*", backend)
    ctx.add_init_script("localStorage.setItem('sb-jztbkimlcrfndooyhohg-auth-token', " + json.dumps(json.dumps(session)) + ")")
    page = ctx.new_page()
    page.goto(BASE + "/patients")
    expect(page.get_by_role("heading", name="Pacientes")).to_be_visible(timeout=20000)
    expect(page.get_by_text(name, exact=True).first).to_be_visible(timeout=20000)
    other = "Beto Fictício" if name == "Ana Fictícia" else "Ana Fictícia"
    assert page.get_by_text(other, exact=True).count() == 0, "Paciente de outra conta foi exibido"
    expect(page.get_by_text("Anamneses finalizadas").first).to_be_visible()
    assert page.get_by_text("Limpar banco de pacientes").count() == 0
    page.locator("#patient-status").select_option("draft")
    expect(page.get_by_text("Rascunho " + name, exact=True).first).to_be_visible()
    assert page.get_by_text(name, exact=True).count() == 0
    page.locator("#patient-status").select_option("all")
    if test_write:
        page.get_by_role("button", name="Novo paciente").click()
        expect(page.get_by_role("dialog")).to_be_visible()
        page.get_by_placeholder("Nome do paciente").fill("Paciente Novo Fictício")
        page.get_by_label("Data de Nascimento").fill("2014-04-15")
        page.get_by_role("button", name="Criar Paciente").click()
        expect(page.get_by_role("dialog")).to_be_visible(timeout=15000)
        expect(page.get_by_text("Não foi possível criar o paciente").first).to_be_visible(timeout=15000)
        page.get_by_role("button", name="Criar Paciente").click()
        expect(page.get_by_role("dialog")).to_have_count(0, timeout=15000)
        expect(page.get_by_text("Paciente Novo Fictício", exact=True).first).to_be_visible(timeout=15000)
        page.get_by_role("button", name="Editar cadastro de " + name).click()
        expect(page.get_by_role("dialog")).to_be_visible(timeout=15000)
        page.get_by_role("dialog").get_by_placeholder("Nome do paciente").fill("Alteração Fictícia")
        page.get_by_role("button", name="Salvar Alterações").click()
        expect(page.get_by_role("dialog")).to_be_visible(timeout=15000)
        page.get_by_role("dialog").get_by_placeholder("Nome do paciente").to_have_value("Alteração Fictícia")
        assert "create" in attempts and "update" in attempts
    overflow = page.evaluate("({ width: document.documentElement.scrollWidth, viewport: innerWidth })")
    assert overflow["width"] <= overflow["viewport"] + 2, f"Rolagem horizontal inesperada: {overflow}"
    ARTIFACTS.mkdir(parents=True, exist_ok=True)
    page.screenshot(path=str(ARTIFACTS / f"pacientes-{name.split()[0].lower()}-{width}.png"), full_page=True)
    ctx.close()
    print(f"Pacientes: {name}, {width}px, persistência={test_write} — OK")

def run():
    with sync_playwright() as playwright:
        executable = os.getenv("PLAYWRIGHT_CHROMIUM_EXECUTABLE")
        browser = playwright.chromium.launch(executable_path=executable) if executable else playwright.chromium.launch()
        run_case(browser, A, "Ana Fictícia", 1280, test_write=True)
        run_case(browser, B, "Beto Fictício", 360)
        browser.close()

if __name__ == "__main__":
    run()
