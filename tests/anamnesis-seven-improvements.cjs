const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const read = p => fs.readFileSync(path.join(root, p), "utf8");
async function loadCompiled(relative) {
  const filename = path.join(root, relative);
  const result = await esbuild.build({
    entryPoints: [filename], bundle: true, platform: "node", format: "cjs",
    write: false, target: "node22", external: ["jspdf"],
    tsconfig: path.join(root, "tsconfig.json"),
  });
  const mod = new Module(filename, module);
  mod.filename = filename;
  mod.paths = Module._nodeModulePaths(path.dirname(filename));
  mod._compile(result.outputFiles[0].text, filename);
  return mod.exports;
}

test("cache identifica a sessão e exclusão exige profissional e confirmação de linha", () => {
  const hook = read("src/hooks/useAnamnesisData.ts");
  const list = read("src/pages/anamnesis/components/AnamnesisList.tsx");
  assert.match(hook, /queryKey: \[\.\.\.ANAMNESIS_QUERY_KEY, userId\]/);
  assert.match(hook, /removeQueries\(\{ queryKey: ANAMNESIS_QUERY_KEY/);
  assert.match(hook, /user\.id !== userId/);
  assert.match(hook, /\.eq\("professional_id", user\.id\)/);
  assert.match(hook, /\.select\("id"\)\s*\.maybeSingle\(\)/);
  assert.match(hook, /if \(!data\?\.id\)/);
  assert.match(list, /confirmation !== "EXCLUIR"/);
  assert.match(list, /aria-label="Filtrar por situação"/);
  assert.match(list, /PAGE_SIZE = 12/);
});

test("indicadores, abas e histórico não confundem preenchimento com finalização", () => {
  const wrapper = read("src/pages/anamnesis/AnamnesisFormWrapper.tsx");
  const progress = read("src/pages/anamnesis/components/AnamnesisProgressBar.tsx");
  const nav = read("src/pages/anamnesis/components/ModernTabsNavigation.tsx");
  const form = read("src/pages/anamnesis/components/InitialEvaluationForm.tsx");
  assert.match(wrapper, /completionPercentage=\{validation\.completionPercentage\}/);
  assert.match(progress, /não equivale à conclusão clínica/);
  assert.match(nav, /Próxima etapa/);
  assert.match(nav, /pendingTabs/);
  assert.doesNotMatch(form, /Math\.ceil\(fields\.length \* 0\.5\)/);
  assert.match(wrapper, /<ClinicalRevisionHistory/);
});

test("histórico apresenta alteração de campo sem expor JSON bruto", async () => {
  const { changedClinicalFields, clinicalFieldLabel, formatClinicalRevisionValue } =
    await loadCompiled("src/pages/anamnesis/utils/clinicalRevisionPresentation.ts");
  const old = { id:"a", professional_id:"x", current_medication:"Nenhuma", review_status:"draft" };
  const next = { ...old, current_medication:"Informada pelo responsável", review_status:"finalized", updated_at:"2026-11-12" };
  assert.deepEqual(changedClinicalFields(old,next),["current_medication","review_status"]);
  assert.equal(clinicalFieldLabel("current_medication"),"Medicações em uso");
  assert.equal(formatClinicalRevisionValue({communication:"Comunicação não verbal"}),"Communication: Comunicação não verbal");
});

test("PDF nativo preserva texto clínico, paginação A4 e campos adicionais", async () => {
  const { createAnamnesisNativePdf } = await loadCompiled("src/utils/anamnesisNativePDF.ts");
  const data = {
    patient_name: "Paciente Sintético", patient_birth_date: "2017-07-18",
    patient_responsible: "Responsável Exemplo", patient_contact: "(81) 99999-8888",
    created_at: "2026-11-12T10:00:00Z", review_status:"finalized",
    main_clinical_demand: "Demanda clínica fictícia de comunicação",
    autism_spectrum: true, adhd: false,
    patient_musical_history: ("Histórico musical fictício, teclado e improvisação. ").repeat(135),
    therapeutic_goals: "Objetivos terapêuticos observáveis e fictícios",
    calming_sounds: "Sons de instrumentos de cordas",
    tea_functional_profile: { communication: "Comunicação gestual" },
    custom_note_field: "Campo adicional que precisa permanecer no documento",
  };
  const doc = createAnamnesisNativePdf(data,{name:"Profissional de Teste",email:"teste@example.invalid"},"Paciente Sintético");
  assert.ok(doc.getNumberOfPages() >= 2,"Texto longo precisa ser paginado");
  const arrayBuffer=doc.output("arraybuffer");
  const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const pdf = await getDocument({data:new Uint8Array(arrayBuffer),useSystemFonts:true,disableFontFace:true}).promise;
  let text = "";
  for(let i=1;i<=pdf.numPages;i++){
    const page=await pdf.getPage(i);
    const c=await page.getTextContent();
    text += " "+c.items.map(x=>x.str||"").join(" ");
    assert.ok(Math.abs(page.view[2] - 595.28) < 1 && Math.abs(page.view[3] - 841.89) < 1, "Página deve ser A4");
  }
  assert.match(text,/Paciente Sintético/);
  assert.match(text,/Demanda clínica principal/);
  assert.match(text,/Histórico musical fictício/);
  assert.match(text,/Objetivos terapêuticos/);
  assert.match(text,/Campo adicional que precisa permanecer/);
  assert.doesNotMatch(text,/TDAH/,"Marcadores não assinalados não devem ser impressos como diagnóstico");
  assert.match(text,/Página 1 de/);
  assert.match(text,/Assinatura cadastrada/);
  assert.match(text,/Carimbo cadastrado/);
  await pdf.destroy();
});

test("gerador exige assinatura e carimbo e não usa rasterização da página",()=>{
  const source=read("src/utils/anamnesisePDFGenerator.ts");
  const native=read("src/utils/anamnesisNativePDF.ts");
  assert.doesNotMatch(source,/html2pdf|html2canvas/i);
  assert.match(source,/digitalStampBase64/);
  assert.match(source,/digitalSignatureBase64/);
  assert.match(native,/if \(!images\.signature \|\| !images\.stamp\)/);
  assert.doesNotMatch(native,/\.from\("patients"\)\.delete\(/);
});
