"""Teste visual e funcional da intervenção sem tocar em registros clínicos reais."""
import base64
import json
import os
import subprocess
import time
from pathlib import Path
from urllib.parse import urlsplit

from playwright.sync_api import expect, sync_playwright

BASE = 'http://127.0.0.1:4173'
USER = 'aaaaaaaa-aaaa-4aaa-aaaa-000000000071'
PATIENT = 'aaaaaaaa-aaaa-4aaa-aaaa-000000000072'
ARTIFACTS = Path('artifacts/intervention')


def encoded(value):
    return base64.urlsafe_b64encode(json.dumps(value).encode()).decode().rstrip('=')


def mock_activities():
    return [{
        'id': f'ativ-{i:03d}', 'disorder': 'TEA', 'demand': 'TEA: Comunicação e Linguagem - Pouca intenção comunicativa',
        'specialty': 'Musicoterapia', 'generalObjective': 'Promover trocas musicais',
        'specificObjective': 'Realizar três turnos de interação musical',
        'activityDescription': 'Alternar sons no teclado e aguardar resposta, com pausas sensoriais.',
        'materials': ['Teclado', 'Pandeiro'], 'estimatedTime': '20 minutos',
        'evaluationCriteria': ['Número de turnos'], 'complexityLevel': 'Moderado'
    } for i in range(1, 11)]


def run_case(browser, width):
    user = {'id': USER, 'email': 'teste@exemplo.invalid', 'aud': 'authenticated', 'role': 'authenticated',
            'app_metadata': {}, 'user_metadata': {}}
    expires = int(time.time()) + 3600
    token = '.'.join([encoded({'alg': 'HS256', 'typ': 'JWT'}), encoded({'sub': USER, 'exp': expires, 'role': 'authenticated'}), 'test'])
    session = {'access_token': token, 'refresh_token': 'synthetic', 'expires_at': expires,
               'expires_in': 3600, 'token_type': 'bearer', 'user': user}
    generated_requests = []
    plans_saved = []

    def backend(route):
        url = urlsplit(route.request.url)
        if url.hostname == '127.0.0.1':
            return route.continue_()
        if url.hostname != 'jztbkimlcrfndooyhohg.supabase.co':
            return route.abort()
        table = url.path.rsplit('/', 1)[-1]
        if url.path == '/auth/v1/user':
            return route.fulfill(json=user)
        if '/rest/v1/rpc/' in url.path:
            return route.fulfill(json=False)
        if table == 'generate-therapy-activities':
            generated_requests.append(route.request.post_data_json)
            if len(generated_requests) == 1:
                return route.fulfill(status=503, json={'error': 'O provedor de IA está indisponível. Tente novamente.'})
            return route.fulfill(json={'activities': mock_activities(), 'totalDemands': 1, 'consideredDemands': 1})
        if table == 'patients':
            return route.fulfill(json=[{'id': PATIENT, 'name': 'Paciente Fictício'}])
        if table == 'professionals':
            professional = {'id': USER, 'user_id': USER, 'email': user['email'], 'name': 'Musicoterapeuta Teste',
                            'specialty': 'Musicoterapia', 'digital_signature_url': None, 'digital_stamp_url': None, 'stamp_photo_url': None}
            if 'vnd.pgrst.object' in route.request.headers.get('accept', ''):
                return route.fulfill(json=professional)
            return route.fulfill(json=[professional])
        if table == 'treatment_plans':
            if route.request.method == 'POST':
                plans_saved.append(route.request.post_data_json)
                return route.fulfill(status=201, json=[])
            return route.fulfill(json=[])
        if table == 'profiles':
            return route.fulfill(json=[{'id': USER, 'name': 'Musicoterapeuta Teste', 'status': 'active'}])
        return route.fulfill(json=[])

    ctx = browser.new_context(service_workers='block', viewport={'width': width, 'height': 840}, accept_downloads=True)
    ctx.route('**/*', backend)
    ctx.add_init_script("localStorage.setItem('sb-jztbkimlcrfndooyhohg-auth-token', " + json.dumps(json.dumps(session)) + ")")
    page = ctx.new_page()
    page.goto(BASE + '/intervention?patient_id=' + PATIENT)
    expect(page.get_by_role('heading', name='Intervenção Musicoterapêutica')).to_be_visible(timeout=20000)
    expect(page.get_by_role('combobox', name='Paciente')).to_contain_text('Paciente Fictício', timeout=15000)
    assert page.get_by_text('Paciente Real').count() == 0

    page.get_by_text('Comunicação e Linguagem', exact=True).first.click()
    page.get_by_label('Pouca intenção comunicativa').check()
    expect(page.get_by_text('1 demandas selecionadas')).to_be_visible()
    page.get_by_role('tab', name='TDAH').click()
    expect(page.get_by_text('Comunicação e Linguagem', exact=True)).to_have_count(0)
    page.get_by_role('tab', name='TEA').click()
    expect(page.get_by_label('Pouca intenção comunicativa')).to_be_checked()

    page.get_by_role('button', name='3. Gerar Sugestões com IA').click()
    expect(page.get_by_role('alert').filter(has_text='O provedor de IA está indisponível')).to_be_visible(timeout=15000)
    page.get_by_role('button', name='3. Gerar Sugestões com IA').click()
    expect(page.get_by_text('Atividades Sugeridas (10)')).to_be_visible(timeout=15000)
    assert generated_requests[0]['patientId'] == PATIENT
    assert generated_requests[0]['selectedItems'][0]['disorder'] == 'TEA'
    assert generated_requests[0]['selectedItems'][0]['label'] == 'Pouca intenção comunicativa'
    assert 'patientName' not in generated_requests[0]
    page.get_by_role('button', name='Salvar plano').click()
    expect(page.get_by_text('Plano salvo com sucesso!', exact=True)).to_be_visible(timeout=15000)
    assert len(plans_saved) == 1
    objectives = plans_saved[0]['general_objectives']
    assert objectives['selected_sub_demands']['TEA::Comunicação e Linguagem'] == ['Pouca intenção comunicativa']
    assert len(plans_saved[0]['complementary_materials']['activities']) == 10

    page.get_by_role('button', name='Expandir todas').click()
    assert page.locator('button[aria-expanded="true"][aria-controls^="activity-"]').count() == 10
    page.get_by_role('button', name='Recolher todas').click()

    with page.expect_download(timeout=20000) as pdf_event:
        page.get_by_role('button', name='Baixar PDF').first.click()
    pdf_download = pdf_event.value
    ARTIFACTS.mkdir(parents=True, exist_ok=True)
    pdf_path = ARTIFACTS / f'intervencao-ficticia-{width}.pdf'
    pdf_download.save_as(pdf_path)
    extracted = subprocess.run(['pdftotext', '-layout', str(pdf_path), '-'], capture_output=True, text=True, check=True).stdout
    assert 'Paciente Fictício' in extracted, 'Paciente não aparece no texto PDF'
    assert 'ATIVIDADE 01' in extracted and 'ATIVIDADE 10' in extracted, 'Faltaram atividades no PDF'
    assert 'Musicoterapeuta Teste' in extracted, 'Identificação profissional ausente'
    info = subprocess.run(['pdfinfo', str(pdf_path)], capture_output=True, text=True, check=True).stdout
    page_count = int(next(line.split(':', 1)[1] for line in info.splitlines() if line.startswith('Pages:')))
    assert 1 < page_count < 12, f'Paginação não compactada: {page_count}'

    overflow = page.evaluate('({ total: document.documentElement.scrollWidth, viewport: innerWidth })')
    assert overflow['total'] <= overflow['viewport'] + 2, f'Rolagem horizontal: {overflow}'
    button_height = page.get_by_role('button', name='Baixar PDF').first.evaluate('el => el.getBoundingClientRect().height')
    assert button_height >= 44, f'Botão muito pequeno: {button_height}'
    page.screenshot(path=str(ARTIFACTS / f'intervencao-{width}.png'), full_page=True)
    ctx.close()
    print(f'Intervenção fictícia: {width}px, IA/seleções/salvamento/PDF pesquisável ({page_count} páginas) — OK')


if __name__ == '__main__':
    with sync_playwright() as pw:
        executable = os.getenv('PLAYWRIGHT_CHROMIUM_EXECUTABLE')
        browser = pw.chromium.launch(executable_path=executable) if executable else pw.chromium.launch()
        run_case(browser, 1280)
        run_case(browser, 360)
        browser.close()
