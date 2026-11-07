const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const Module = require('node:module');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { MemoryRouter } = require('react-router-dom');
const esbuild = require('esbuild');

function loadComponent(relativePath) {
  const built = esbuild.buildSync({
    entryPoints: [path.resolve(__dirname, '..', relativePath)],
    tsconfig: path.resolve(__dirname, '../tsconfig.app.json'),
    bundle: true,
    write: false,
    format: 'cjs',
    platform: 'node',
    external: ['react', 'react-dom', 'react-router-dom', 'react/jsx-runtime'],
  });
  const compiled = new Module(path.resolve(__dirname, 'evolution-ui.generated.cjs'), module);
  compiled.filename = path.resolve(__dirname, 'evolution-ui.generated.cjs');
  compiled.paths = Module._nodeModulePaths(__dirname);
  compiled._compile(built.outputFiles[0].text, compiled.filename);
  return compiled.exports;
}

const { PatientEvaluationCards } = loadComponent('src/pages/evaluation/components/PatientEvaluationCards.tsx');
const { EvaluationHistory } = loadComponent('src/pages/evaluation/components/EvaluationHistory.tsx');

const makeEvaluation = (id, percentage, evaluatedParameters) => ({
  id,
  patient_id: 'paciente-exemplo',
  patient_name: 'Paciente Exemplo',
  date: '2026-10-15T12:00:00.000Z',
  type: 'avaliacao_inicial',
  content: {
    evaluationType: '1',
    overallScore: { percentage, evaluatedParameters, totalParameters: 128 },
    selections: {}, observations: {}, domainScores: [],
  },
});

test('cartões exibem rótulos por extenso, ausência de score e navegação sem clique no card', () => {
  const markup = renderToStaticMarkup(React.createElement(
    MemoryRouter, null,
    React.createElement(PatientEvaluationCards, {
      isLoading: false,
      patientsWithEvaluations: [{
        patientId: 'paciente-exemplo', patientName: 'Paciente Exemplo', totalEvaluations: 2,
        evaluationTypes: ['avaliacao_inicial', 'avaliacao_progresso'],
        lastEvaluationDate: '2026-10-15T12:00:00.000Z', averageScore: null,
      }],
    })
  ));
  assert.match(markup, /Inicial/);
  assert.match(markup, /Progresso/);
  assert.match(markup, /Sem pontuação registrada/);
  assert.match(markup, /href="\/evaluation\/paciente\/paciente-exemplo"/);
  assert.match(markup, /Ver evolução/);
  assert.doesNotMatch(markup, /Pontuação: 0%/);
});

test('histórico preserva zero real, sinaliza ausente e disponibiliza PDF individual', () => {
  const markup = renderToStaticMarkup(React.createElement(EvaluationHistory, {
    isLoading: false,
    evaluations: [makeEvaluation('sem-registro', 0, 0), makeEvaluation('zero-real', 0, 3)],
    selectedForComparison: [],
    onToggleComparison: () => {},
    onLoadEvaluation: () => {},
    onDeleteEvaluation: () => {},
    onDownloadEvaluation: () => {},
  }));
  assert.match(markup, /Sem pontuação registrada/);
  assert.match(markup, /Pontuação: 0%/);
  assert.match(markup, /Baixar PDF individual/);
  assert.match(markup, /aria-label="Comparar/);
  assert.match(markup, /Continuar avaliação/);
});

test('botões na cor principal mantêm contraste AA em temas claro e escuro', () => {
  const css = fs.readFileSync(path.resolve(__dirname, '../src/index.css'), 'utf8');
  const [light, dark] = css.split('.dark {');
  const color = (source, token) => {
    const match = source.match(new RegExp(`--${token}:\\s*(\\d+)\\s+(\\d+)%\\s+(\\d+)%`));
    assert.ok(match, `token ${token} deve existir`);
    const h = Number(match[1]), s = Number(match[2]) / 100, l = Number(match[3]) / 100;
    const a = s * Math.min(l, 1 - l);
    const k = (n) => (n + h / 30) % 12;
    return [0, 8, 4].map((n) => Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1)))));
  };
  const luminance = ([r, g, b]) => {
    const channel = (v) => {
      const x = v / 255;
      return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
  };
  const contrast = (a, b) => {
    const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (values[0] + 0.05) / (values[1] + 0.05);
  };
  for (const [name, source] of [['claro', light], ['escuro', dark]]) {
    const ratio = contrast(color(source, 'primary'), color(source, 'primary-foreground'));
    assert.ok(ratio >= 4.5, `tema ${name}: contraste ${ratio.toFixed(2)}:1`);
  }
});
