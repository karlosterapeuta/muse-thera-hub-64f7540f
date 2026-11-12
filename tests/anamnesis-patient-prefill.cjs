const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const helperPath = "src/pages/anamnesis/utils/patientPrefill.ts";
const source = relative => fs.readFileSync(path.join(root, relative), "utf8");
function loadHelper() {
  const filename = path.join(root, helperPath);
  const compiled = ts.transpileModule(source(helperPath), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const mod = new Module(filename, module);
  mod.filename = filename;
  mod.paths = Module._nodeModulePaths(path.dirname(filename));
  mod._compile(compiled, filename);
  return mod.exports;
}
const patient = (override = {}) => ({
  id: "synthetic-1", name: "Paciente Fictício", birth_date: "2010-02-01",
  responsible: " Responsável Fictício ", contact: "(81) 99999-0000", photo_url: null, ...override
});

test("responsável cadastrado preenche apenas o campo correspondente em uma nova anamnese", () => {
  const { prefillAnamnesisFromPatient } = loadHelper();
  assert.deepEqual(prefillAnamnesisFromPatient({}, patient()), { legal_guardian: "Responsável Fictício" });
});

test("não substitui responsável legal nem informações clínicas anteriores", () => {
  const { prefillAnamnesisFromPatient } = loadHelper();
  const original = { legal_guardian: "Outra pessoa confirmada", clinical_details: "Registro clínico fictício", autism_spectrum: false };
  assert.deepEqual(prefillAnamnesisFromPatient(original, patient()), original);
  assert.equal(original.legal_guardian, "Outra pessoa confirmada");
});

test("não inventa responsável, diagnóstico ou histórico quando o cadastro não contém esses dados", () => {
  const { prefillAnamnesisFromPatient } = loadHelper();
  assert.deepEqual(prefillAnamnesisFromPatient({}, patient({ responsible: null })), {});
  assert.deepEqual(prefillAnamnesisFromPatient({}, patient({ responsible: "  " })), {});
  assert.deepEqual(prefillAnamnesisFromPatient({ patient_musical_history: "Já registrado" }, patient({ responsible: null })),
    { patient_musical_history: "Já registrado" });
});

test("seleção inclui a identidade do paciente e acesso direto por URL, sem migrar dados", () => {
  const wrapper = source("src/pages/anamnesis/AnamnesisFormWrapper.tsx");
  const manager = source("src/pages/anamnesis/AnamnesisManager.tsx");
  const summary = source("src/pages/anamnesis/components/PatientIdentitySummary.tsx");
  assert.match(wrapper, /select\("id, name, birth_date, responsible, contact, photo_url"\)/);
  assert.match(wrapper, /prefillAnamnesisFromPatient\(\{\}, registeredPatient\)/);
  assert.match(wrapper, /prefillAnamnesisFromPatient\(\{\}, preselected\)/);
  assert.match(wrapper, /disabled=\{!!editAnamnesisId\}/);
  assert.match(manager, /patientId && !anamnesisId/);
  assert.match(summary, /Responsável cadastrado/);
  assert.match(summary, /calculateAgeFromBirthDate/);
  assert.match(summary, /onLegalGuardianChange/);
});
