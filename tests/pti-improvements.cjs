const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const esbuild = require('esbuild');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

function loadTs(relativePath) {
  const file = path.resolve(__dirname, '..', relativePath);
  const code = esbuild.buildSync({
    entryPoints: [file], bundle: true, write: false, format: 'cjs', platform: 'node',
    tsconfig: path.resolve(__dirname, '../tsconfig.app.json'),
    external: ['react', 'react-dom', 'react-router-dom', 'react/jsx-runtime'],
  }).outputFiles[0].text;
  const loaded = new Module(file, module);
  loaded.filename = file;
  loaded.paths = Module._nodeModulePaths(__dirname);
  loaded._compile(code, file);
  return loaded.exports;
}

const { createDefaultPtiContent, computePtiProgress, getPtiCompletion } = loadTs('src/types/pti.ts');
const { comparePtiVersions } = loadTs('src/utils/ptiVersionComparison.ts');
const { getPtiBaselineValue, ptiScoreLabel } = loadTs('src/utils/ptiReevaluation.ts');

test('campos do formulário contínuo avançam o progresso documental', () => {
  const plan = createDefaultPtiContent();
  plan.identificacao.nome = 'Paciente fictício';
  assert.equal(computePtiProgress(plan), 13);
  plan.formulario.nomeMae = 'Responsável fictícia';
  plan.formulario.resumoClinico = 'Histórico informado';
  plan.formulario.revisaoObjetivos = 'Trimestral';
  plan.formulario.consideracoes = 'Plano de intervenção';
  assert.equal(getPtiCompletion(plan).filled, 5);
  assert.equal(computePtiProgress(plan), 63);
  plan.objetivosEspecificos.push({ id: 'a', descricao: 'Atenção compartilhada', prioridade: '', area: '', prazo: '' });
  plan.metas.push({ id: 'b', descricao: 'Turnos', indicador: '', percentual: '', prazo: '', criterio: '' });
  assert.equal(computePtiProgress(plan), 88);
});

test('PTIs antigos continuam computando os campos legados sem mutação', () => {
  const plan = createDefaultPtiContent();
  plan.queixaPrincipal = 'Demanda registrada';
  plan.historicoClinico.comunicacao = 'Comunicação registrada';
  plan.potencialidades = 'Interesse musical';
  plan.dificuldades = 'Transições';
  plan.objetivoGeral = 'Interação';
  const snapshot = JSON.stringify(plan);
  assert.ok(computePtiProgress(plan) >= 29);
  assert.equal(JSON.stringify(plan), snapshot);
});

test('comparação de versões identifica inclusão, remoção e edição por ID', () => {
  const prior = {
    objetivosEspecificos: [{ id: 'a', descricao: 'Atenção', atividade: 'Teclado' }, { id: 'b', descricao: 'Comunicação' }],
    metas: [{ id: 'm', descricao: 'Turnos', percentual: '2' }],
  };
  const current = {
    objetivosEspecificos: [{ id: 'a', descricao: 'Atenção', atividade: 'Xilofone' }, { id: 'c', descricao: 'Imitação' }],
    metas: [{ id: 'm', descricao: 'Turnos', percentual: '4' }, { id: 'n', descricao: 'Atenção conjunta' }],
  };
  const result = comparePtiVersions(current, prior);
  assert.deepEqual(result.addedObjectives, ['Imitação']);
  assert.deepEqual(result.removedObjectives, ['Comunicação']);
  assert.deepEqual(result.editedObjectives, ['Atenção']);
  assert.deepEqual(result.addedGoals, ['Atenção conjunta']);
  assert.deepEqual(result.editedGoals, ['Turnos']);
  assert.equal(prior.objetivosEspecificos[0].atividade, 'Teclado');
});

test('reavaliação preserva zero explicitamente registrado', () => {
  assert.equal(getPtiBaselineValue('Comunicação', { Comunicação: 0 }, { Comunicação: 4 }), 0);
  assert.equal(getPtiBaselineValue('Comunicação', {}, { Comunicação: 4 }), 4);
  assert.equal(getPtiBaselineValue('Comunicação', {}, {}), 0);
  assert.equal(ptiScoreLabel(0), 'Não avaliado');
  assert.equal(ptiScoreLabel(3), '3/5');
});

test('interface mostra salvamento pendente ou falha e protege ações de remoção', () => {
  const editor = fs.readFileSync(path.resolve(__dirname, '../src/pages/pti/editor.tsx'), 'utf8');
  const form = fs.readFileSync(path.resolve(__dirname, '../src/components/pti/PtiContinuousForm.tsx'), 'utf8');
  const sections = fs.readFileSync(path.resolve(__dirname, '../src/components/pti/PtiScreenshotSections.tsx'), 'utf8');
  assert.match(editor, /beforeunload/);
  assert.match(editor, /guardNavigationLinks/);
  assert.match(editor, /hasPendingChangesRef\.current/);
  assert.match(editor, /queuedSaveCountRef\.current > 0/);
  assert.match(form, /Falha ao salvar/);
  assert.match(form, /Alterações pendentes de salvamento/);
  assert.match(form, /aria-live="polite"/);
  assert.match(sections, /Remover objetivo/);
  assert.match(sections, /window\.confirm\(`Remover meta/);
});

test('formulário renderiza erros de salvamento e progresso acessível', () => {
  const { PtiContinuousForm } = loadTs('src/components/pti/PtiContinuousForm.tsx');
  const markup = renderToStaticMarkup(React.createElement(PtiContinuousForm, {
    content: createDefaultPtiContent(), update: () => {}, patients: [],
    patientId: null, onSelectPatient: () => {}, isPatientLocked: false,
    status: 'rascunho', onStatus: () => {}, professionalName: '',
    lastSaved: null, saveStatus: 'error', saving: false, downloading: false,
    importingClinical: false, onImportClinical: () => {}, onSave: () => {},
    onDownload: () => {}, onNavigate: () => {},
  }));
  assert.match(markup, /Falha ao salvar/);
  assert.match(markup, /aria-live="polite"/);
  assert.match(markup, /aria-label="Preenchimento documental do PTI"/);
  assert.match(markup, /role="progressbar"/);
  assert.match(markup, /Objetivos e metas/);
});
