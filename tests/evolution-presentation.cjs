const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Module = require('node:module');
const esbuild = require('esbuild');

// Bundle the exact production TypeScript module without writing generated files.
const built = esbuild.buildSync({
  entryPoints: [path.resolve(__dirname, '../src/utils/evolutionPresentation.ts')],
  tsconfig: path.resolve(__dirname, '../tsconfig.app.json'),
  bundle: true,
  write: false,
  format: 'cjs',
  platform: 'node',
});
const testModule = new Module(path.resolve(__dirname, 'evolution-presentation.generated.cjs'), module);
testModule.filename = path.resolve(__dirname, 'evolution-presentation.generated.cjs');
testModule.paths = Module._nodeModulePaths(__dirname);
testModule._compile(built.outputFiles[0].text, testModule.filename);

const {
  EVOLUTION_STAGE_KEYS,
  getEvolutionStageKey,
  getRecordedEvaluationScore,
  selectEvaluationsForEvolution,
} = testModule.exports;

const evaluation = (id, date, type, evaluationType, percentage = 50, evaluatedParameters = 8) => ({
  id,
  patient_id: 'paciente-teste',
  date,
  type,
  content: {
    evaluationType,
    overallScore: { percentage, evaluatedParameters, totalParameters: 128 },
    selections: {},
    observations: {},
    domainScores: [],
  },
});

test('normaliza etapas armazenadas por chave ou número, inclusive registros legados', () => {
  const keys = [
    'avaliacao_inicial', 'avaliacao_progresso', 'avaliacao_periodica', 'avaliacao_final',
  ];
  assert.deepEqual([...EVOLUTION_STAGE_KEYS], keys);
  keys.forEach((key, idx) => {
    assert.equal(getEvolutionStageKey(evaluation(`${idx}`, '2026-10-01', key, `${idx + 1}`)), key);
    assert.equal(getEvolutionStageKey(evaluation(`${idx}`, '2026-10-01', 'musetera_evaluation', `${idx + 1}`)), key);
  });
});

test('seleciona uma avaliação mais recente por etapa sem modificar os registros', () => {
  const records = [
    evaluation('progresso-antigo', '2026-03-01', 'avaliacao_progresso', '2'),
    evaluation('inicial', '2026-01-01', 'avaliacao_inicial', '1'),
    evaluation('progresso-recente', '2026-04-01', 'avaliacao_progresso', '2'),
    evaluation('periodica', '2026-07-01', 'avaliacao_periodica', '3'),
    evaluation('final', '2026-10-01', 'avaliacao_final', '4'),
  ];
  const previousIds = records.map((record) => record.id);
  assert.deepEqual(selectEvaluationsForEvolution(records).map((record) => record.id), [
    'inicial', 'progresso-recente', 'periodica', 'final',
  ]);
  assert.deepEqual(records.map((record) => record.id), previousIds);
});

test('mantém fallback histórico quando não existem etapas tipadas', () => {
  const records = [
    evaluation('b', '2026-02-01', 'musetera_evaluation', '0'),
    evaluation('a', '2026-01-01', 'musetera_evaluation', '0'),
  ];
  assert.deepEqual(selectEvaluationsForEvolution(records).map((record) => record.id), ['a', 'b']);
});

test('diferencia ausência de pontuação de zero clínico efetivamente registrado', () => {
  assert.equal(getRecordedEvaluationScore(evaluation('vazio', '2026-01-01', 'avaliacao_inicial', '1', 0, 0)), null);
  assert.equal(getRecordedEvaluationScore(evaluation('zero-real', '2026-01-01', 'avaliacao_inicial', '1', 0, 4)), 0);
  assert.equal(getRecordedEvaluationScore(evaluation('parcial', '2026-01-01', 'avaliacao_inicial', '1', 65, 9)), 65);
  const missing = evaluation('sem-score', '2026-01-01', 'avaliacao_inicial', '1');
  delete missing.content.overallScore;
  assert.equal(getRecordedEvaluationScore(missing), null);
});

test('análise de áreas não transforma domínio ausente em zero', () => {
  const source = esbuild.buildSync({
    entryPoints: [path.resolve(__dirname, '../src/pages/evaluation/utils/suggestionEngine.ts')],
    tsconfig: path.resolve(__dirname, '../tsconfig.app.json'),
    bundle: true, write: false, format: 'cjs', platform: 'node',
  });
  const analysisModule = new Module(path.resolve(__dirname, 'areas.generated.cjs'), module);
  analysisModule.filename = path.resolve(__dirname, 'areas.generated.cjs');
  analysisModule.paths = Module._nodeModulePaths(__dirname);
  analysisModule._compile(source.outputFiles[0].text, analysisModule.filename);

  const first = evaluation('primeira', '2026-01-01', 'avaliacao_inicial', '1');
  const last = evaluation('ultima', '2026-03-01', 'avaliacao_progresso', '2');
  last.content.domainScores = [{ domain: 'Domínio Musical', score: 70 }];
  assert.deepEqual(analysisModule.exports.analyzeAreas([first, last]), {
    improved: [], needsAttention: [],
  });

  first.content.domainScores = [{ domain: 'Domínio Musical', score: 0 }];
  const result = analysisModule.exports.analyzeAreas([first, last]);
  assert.equal(result.improved[0].variation, 70);
  assert.equal(result.needsAttention.length, 0);
});
