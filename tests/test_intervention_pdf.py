"""Regressão independente do navegador, apenas com conteúdo e imagens fictícias."""
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'artifacts' / 'intervention'


def call(args):
    return subprocess.run(args, cwd=ROOT, capture_output=True, text=True, check=True).stdout


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    output_script = OUT / 'pdf-fixture-runner.cjs'
    output_pdf = OUT / 'intervencao-ficticia.pdf'
    call([str(ROOT / 'node_modules/.bin/esbuild'), 'tests/intervention_pdf_fixture.ts',
          '--bundle', '--platform=node', '--format=cjs', f'--outfile={output_script}'])
    call(['node', str(output_script), str(output_pdf)])

    text = call(['pdftotext', '-layout', str(output_pdf), '-'])
    for count in range(1, 11):
        assert f'ATIVIDADE {count:02d}' in text, f'Faltou a atividade {count:02d}'
    for term in ('Paciente Fictício de Teste', 'Musicoterapeuta Teste',
                 'Objetivo terapêutico geral', 'Critérios de acompanhamento',
                 'Assinatura cadastrada', 'Carimbo cadastrado', 'Foto cadastrada'):
        assert term in text, f'Faltou conteúdo textual: {term}'

    info = call(['pdfinfo', str(output_pdf)])
    pages = int(next(line.split(':', 1)[1] for line in info.splitlines() if line.startswith('Pages:')))
    assert 1 < pages < 12, f'Esperado PDF mais compacto que o original de 12 páginas; obtido: {pages}'
    assert 'Page size:       595.28 x 841.89 pts (A4)' in info

    images = call(['pdfimages', '-list', str(output_pdf)]).splitlines()[2:]
    assert len(images) == 3, 'As três imagens profissionais não foram incorporadas'
    assert output_pdf.stat().st_size < 1_000_000, 'PDF sintético rasterizado/pesado demais'

    for page in range(1, pages + 1):
        page_text = call(['pdftotext', '-f', str(page), '-l', str(page), str(output_pdf), '-'])
        meaningful = [line.strip() for line in page_text.splitlines()
                      if line.strip() and not line.startswith('MuseTera |') and not line.startswith('Página ')]
        assert len(meaningful) >= 5, f'Página {page} vazia ou quase vazia'

    print(f'PDF de teste: {pages} páginas A4, 10 atividades textuais, 3 imagens profissionais, paginação e conteúdo OK')


if __name__ == '__main__':
    main()
