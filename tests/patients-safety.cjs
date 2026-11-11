const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");

test("a consulta de pacientes é isolada por sessão e respeita o proprietário", () => {
  const hook = read("src/hooks/usePatientsData.ts");
  assert.match(hook, /queryKey:\s*\[\.\.\.PATIENTS_QUERY_KEY,\s*userId\]/);
  assert.match(hook, /onAuthStateChange/);
  assert.match(hook, /removeQueries\(\{\s*queryKey:\s*PATIENTS_QUERY_KEY/);
  assert.match(hook, /\.eq\("professional_id",\s*userId\)/);
  assert.match(hook, /enabled:\s*!!userId/);
});

test("o estado de anamnese não interpreta mero registro como finalização", () => {
  const hook = read("src/hooks/usePatientsData.ts");
  assert.match(hook, /review_status === "finalized"/);
  assert.match(hook, /review_status === "draft"/);
  assert.match(hook, /"draft"\s*:\s*"registered"/);
  assert.match(hook, /latestAnamnesis/);
  const patients = read("src/pages/patients.tsx");
  assert.match(patients, /Anamneses finalizadas/);
  assert.match(patients, /isLoading \|\| error \? "—"/);
  assert.doesNotMatch(patients, /Total Ativos/);
});

test("salvamento falho mantém formulários abertos e valida a sessão", () => {
  const forms = read("src/pages/components/patients/PatientDialogs.tsx");
  assert.equal((forms.match(/closeModal\(\);/g) || []).length, 2);
  assert.match(forms, /onDirtyChange/);
  assert.match(forms, /onBusyChange/);
  assert.match(forms, /eq\('professional_id', user.id\)/);
  assert.match(forms, /Não foi possível confirmar o cadastro/);
  const page = read("src/pages/patients.tsx");
  assert.match(page, /Existem alterações não salvas/);
  assert.match(page, /Salvamento em andamento/);
});

test("exclusão em massa não está disponível na lista clínica", () => {
  const page = read("src/pages/patients.tsx");
  assert.doesNotMatch(page, /Limpar banco de pacientes/);
  assert.doesNotMatch(page, /useDeleteAllPatients/);
  const hook = read("src/hooks/usePatientsData.ts");
  assert.match(hook, /Exclusão em massa desativada/);
});

test("upload privado valida formato e tamanho", () => {
  const photo = read("src/pages/components/patients/PatientPhotoUpload.tsx");
  assert.match(photo, /MAX_PHOTO_BYTES = 5 \* 1024 \* 1024/);
  assert.match(photo, /image\/webp/);
  assert.match(photo, /upsert: false/);
  assert.match(photo, /onUploadingChange/);
});

test("jornada clínica, buscas e controles acessíveis existem", () => {
  const menu = read("src/pages/components/patients/PatientCareMenu.tsx");
  for (const route of ["/patient-history", "/anamnesis", "/evaluation", "/pti", "/intervention"]) {
    assert.ok(menu.includes(route), "Rota ausente: " + route);
  }
  const page = read("src/pages/patients.tsx");
  assert.match(page, /patient-status/);
  assert.match(page, /patient-order/);
  assert.match(page, /PAGE_SIZE = 20/);
  assert.match(page, /Não foi possível carregar os pacientes/);
  const list = read("src/pages/components/patients/PatientList.tsx");
  assert.match(list, /aria-label=\{"Editar cadastro de "/);
  assert.match(list, /min-h-11/);
});
