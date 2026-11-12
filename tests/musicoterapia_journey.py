"""UI/UX regression for musicoterapia: fully mocked clinical backend, synthetic people only."""
import base64
import json
import re
import time
from urllib.parse import urlsplit

from playwright.sync_api import expect, sync_playwright

BASE = "http://127.0.0.1:4173"
SUPABASE_HOST = "jztbkimlcrfndooyhohg.supabase.co"

def encode(value):
    return base64.urlsafe_b64encode(json.dumps(value).encode()).decode().rstrip("=")

def check_case(browser, account_id, patient_id, patient_name, width):
    user = {"id": account_id, "email": "profissional@example.invalid",
            "aud": "authenticated", "role": "authenticated",
            "app_metadata": {}, "user_metadata": {}}
    professional = {"id": account_id, "user_id": account_id, "name": "Profissional Fictício",
                    "phone": "", "email": "exemplo@example.invalid", "register": "TESTE-01",
                    "digital_signature_url": None, "digital_stamp_url": None}
    patient = {"id": patient_id, "name": patient_name, "birth_date": "2015-05-01",
               "age": 11, "responsible": "Responsável Fictício"}
    writes = []

    def backend(route):
        parsed = urlsplit(route.request.url)
        if parsed.hostname == "127.0.0.1":
            return route.continue_()
        if parsed.hostname != SUPABASE_HOST:
            return route.abort()
        table = parsed.path.split("/")[-1]
        response = []
        if parsed.path == "/auth/v1/user":
            response = user
        elif table == "patients":
            response = [patient]
        elif table == "professionals":
            response = [professional]
        elif table == "profiles":
            response = [{"id": account_id, "name": "Profissional Fictício", "status": "active"}]
        elif table == "anamnesis":
            response = []
        elif table == "reports":
            if route.request.method != "GET":
                writes.append(route.request.method)
                response = [{"id": "eeeeeeee-eeee-4eee-eeee-000000000001"}]
            else:
                response = []
        if isinstance(response, list) and "vnd.pgrst.object" in route.request.headers.get("accept", ""):
            response = response[0] if response else None
        return route.fulfill(json=response if response is not None else {}, status=200)

    expires = int(time.time()) + 3600
    token = ".".join([encode({"alg": "HS256", "typ": "JWT"}),
                      encode({"sub": account_id, "exp": expires, "role": "authenticated"}), "fixture"])
    session = {"access_token": token, "refresh_token": "fixture", "expires_at": expires,
               "expires_in": 3600, "token_type": "bearer", "user": user}
    context = browser.new_context(service_workers="block", viewport={"width": width, "height": 850})
    context.route("**/*", backend)
    context.add_init_script("localStorage.setItem('sb-jztbkimlcrfndooyhohg-auth-token', "
                            + json.dumps(json.dumps(session)) + ")")
    page = context.new_page()
    page.goto(BASE + "/processes/musicoterapia")
    expect(page.get_by_role("heading", name="Relatório de Musicoterapia").first).to_be_visible(timeout=15000)
    combo = page.get_by_role("combobox", name="Paciente", exact=True)
    expect(combo).to_be_enabled(timeout=15000)
    combo.click()
    expect(page.get_by_role("option", name="Novo paciente (entrada manual)")).to_have_count(0)
    page.get_by_role("option", name=patient_name).click()
    expect(page.locator("#patient_name")).to_have_value(patient_name)
    expect(page.get_by_text("Não há Anamnese cadastrada para este paciente.")).to_be_visible(timeout=12000)
    assert writes == [], "Selecionar paciente não pode criar relatório automaticamente"
    assert page.evaluate("document.documentElement.scrollWidth <= innerWidth + 2"), "Layout com rolagem horizontal indevida"

    if width > 500:
        page.locator("#patient_diagnosis").fill("Diagnóstico fictício informado")
        page.once("dialog", lambda dlg: dlg.dismiss())
        page.get_by_role("button", name="Ver relatórios salvos").click()
        expect(page.locator("#patient_diagnosis")).to_have_value("Diagnóstico fictício informado")
        page.once("dialog", lambda dlg: dlg.accept())
        page.get_by_role("button", name="Ver relatórios salvos").click()
        expect(page.get_by_text("Nenhum relatório salvo")).to_be_visible(timeout=12000)
        expect(page.get_by_role("combobox", name="Filtrar histórico por situação")).to_be_visible()
    context.close()

def run():
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        check_case(browser,
                   "aaaaaaaa-aaaa-4aaa-aaaa-000000000051",
                   "aaaaaaaa-aaaa-4aaa-aaaa-000000000052",
                   "Ana Paciente Fictícia", 1280)
        check_case(browser,
                   "bbbbbbbb-bbbb-4bbb-bbbb-000000000053",
                   "bbbbbbbb-bbbb-4bbb-bbbb-000000000054",
                   "Beto Paciente Fictício", 360)
        browser.close()
    print("Musicoterapia: seleção autenticada, ausência de entrada manual, proteção do rascunho e mobile 360px — OK")

if __name__ == "__main__":
    run()
