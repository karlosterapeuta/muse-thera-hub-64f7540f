const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const source = fs.readFileSync(
  path.join(__dirname, "../src/pages/anamnesis/components/AnamnesisView.tsx"),
  "utf8"
);

test("visualização Ver mantém uma única seção de identificação", () => {
  assert.equal((source.match(/Identificação do paciente/g) || []).length, 1);
  assert.doesNotMatch(source, /Identificação e Encaminhamento/);
  assert.match(source, /Detalhes clínicos complementares/);
});

test("identificação agrega dados cadastrados sem substituir dados clínicos salvos", () => {
  for (const field of [
    "patient_name", "birth_date", "patient_age", "mother_name", "father_name",
    "legal_guardian", "family_relationship", "patient_contact",
    "referral_professional", "cid_code", "diagnosis_details",
    "diagnosis_date", "support_level", "main_clinical_demand"
  ]) {
    assert.match(source, new RegExp(field));
  }
  assert.match(source, /patient_name: data\.patient_name \|\| patient\?\.name/);
  assert.match(source, /birth_date: data\.birth_date \|\| patient\?\.birth_date/);
});

test("campos clínicos adicionais salvos continuam visíveis e formatados por tipo", () => {
  assert.match(source, /const additionalFields = Object\.entries\(anamnesisData\)/);
  assert.match(source, /Outras informações registradas/);
  assert.match(source, /formattedValue\(value\)/);
  assert.match(source, /Array\.isArray\(value\)/);
  assert.match(source, /typeof value === 'boolean'/);
  assert.match(source, /calming_strategies/);
  assert.match(source, /tea_functional_profile/);
});

test("valores ausentes e datas inválidas não quebram a visualização", () => {
  assert.match(source, /Number\.isNaN\(new Date\(dateString\)\.getTime\(\)\)/);
  assert.match(source, /typeof value === "string" \? value\.trim\(\)/);
  assert.match(source, /typeof value === "object"/);
});

test("status administrativo não aparece como dado clínico adicional", () => {
  assert.match(source, /'review_status', 'finalized_at', 'finalized_by'/);
});
