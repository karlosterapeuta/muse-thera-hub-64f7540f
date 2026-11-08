const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const source = relative => fs.readFileSync(path.join(root, relative), 'utf8');
const validationPath = 'src/pages/anamnesis/hooks/useAnamnesisValidation.ts';

function validationModule() {
  const file = path.join(root, validationPath);
  const compiled = ts.transpileModule(source(validationPath), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const mod = new Module(file, module);
  mod.filename = file;
  mod.paths = Module._nodeModulePaths(path.dirname(file));
  mod._compile(compiled, file);
  return mod.exports;
}

test('finalização usa três critérios clínicos e aceita rascunhos parciais', () => {
  const { missingFinalizationFields } = validationModule();
  const absent = missingFinalizationFields({});
  assert.deepEqual(absent.map(item => item.field), [
    'main_clinical_demand', 'patient_musical_history', 'therapeutic_goals',
  ]);
  assert.deepEqual(absent.map(item => item.section), [1, 5, 12]);
  assert.deepEqual(missingFinalizationFields({
    main_clinical_demand: ' Demanda relatada ',
    patient_musical_history: ' ',
    therapeutic_goals: 'Objetivo observável',
  }).map(item => item.field), ['patient_musical_history']);
  assert.equal(missingFinalizationFields({
    main_clinical_demand: 'Demanda',
    patient_musical_history: 'Histórico',
    therapeutic_goals: 'Objetivo',
  }).length, 0);
});

test('salvamento protege paciente e mantém a mesma anamnese ao atualizar', () => {
  const wrapper = source('src/pages/anamnesis/AnamnesisFormWrapper.tsx');
  assert.match(wrapper, /saveQueueRef\.current\.catch\(/);
  assert.match(wrapper, /existingIdRef\.current = result\.data\[0\]\.id/);
  assert.match(wrapper, /\.eq\("patient_id", patientId\)/);
  assert.match(wrapper, /\.eq\("professional_id", professionalId\)/);
  assert.match(wrapper, /dirtyRef\.current && !window\.confirm\(/);
  assert.match(wrapper, /addEventListener\("beforeunload"/);
  assert.match(wrapper, /}, 3000\)/);
  assert.match(wrapper, /reviewStatus !== "draft"/);
  assert.match(wrapper, /if \(editRevisionRef\.current === saveRevision\)/);
});

test('PDF mantém a assinatura e o carimbo, sem consultar paciente pela coluna errada', () => {
  const wrapper = source('src/pages/anamnesis/AnamnesisFormWrapper.tsx');
  const view = source('src/pages/anamnesis/components/AnamnesisView.tsx');
  const generator = source('src/utils/anamnesisePDFGenerator.ts');
  assert.match(wrapper, /restoreFromOwnStorage\("signature_"\)/);
  assert.match(wrapper, /restoreFromOwnStorage\("stamp_"\)/);
  assert.match(view, /restoreOwnImage\('signature_'\)/);
  assert.match(view, /restoreOwnImage\('stamp_'\)/);
  assert.match(view, /\.eq\('professional_id', user\.id\)/);
  const patientQueries = [...view.matchAll(/\.from\(['"]patients['"]\)([\s\S]*?)\.maybeSingle\(\)/g)];
  assert.ok(patientQueries.length >= 2);
  for (const [, query] of patientQueries) assert.doesNotMatch(query, /\.eq\('user_id'/);
  assert.match(generator, /digitalStampBase64/);
  assert.match(generator, /digitalSignatureBase64/);
});

test('nenhuma operação destrutiva em armazenamento ou históricos foi acrescentada', () => {
  for (const file of [
    'src/pages/anamnesis/AnamnesisFormWrapper.tsx',
    'src/pages/anamnesis/components/AnamnesisView.tsx',
  ]) {
    const code = source(file);
    assert.doesNotMatch(code, /supabase\.storage[\s\S]{0,100}\.remove\(/);
    assert.doesNotMatch(code, /\.from\("anamnesis_revision_log"[^\n]*\.delete\(/);
  }
});
