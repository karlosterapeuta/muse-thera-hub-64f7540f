const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const esbuild = require('esbuild');

const root = path.join(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
function loadTs(relative) {
  const filename = path.join(root, relative);
  const result = esbuild.buildSync({
    entryPoints: [filename], bundle: true, write: false, format: 'cjs',
    platform: 'node', packages: 'external', tsconfig: path.join(root, 'tsconfig.app.json'),
  });
  const mod = new Module(filename, module);
  mod.filename = filename;
  mod.paths = Module._nodeModulePaths(path.dirname(filename));
  mod._compile(result.outputFiles[0].text, filename);
  return mod.exports;
}

test('fase 1: trocas de tela e conta não perdem ou misturam registros', () => {
  const page = read('src/pages/processes/musicoterapia/index.tsx');
  const patients = read('src/pages/processes/report/hooks/useReportData.ts');
  assert.match(page, /if \(!confirmDiscard\(\)\) return;\s*setViewMode\('list'\)/);
  assert.match(page, /sessionOwnerRef\.current/);
  assert.match(page, /reportsRequestRef\.current\+\+/);
  assert.match(page, /setReports\(\[\]\)/);
  assert.match(patients, /onAuthStateChange/);
  assert.match(patients, /setPatients\(\[\]\)/);
  assert.match(patients, /request !== generation/);
  assert.doesNotMatch(patients, /console\.log\("Buscando pacientes/);
});

test('fase 1: exclusão exige palavra-chave, propriedade e confirmação de linha', () => {
  const dialog = read('src/pages/processes/reports/components/DeleteReportDialog.tsx');
  assert.match(dialog, /confirmation !== "EXCLUIR"/);
  assert.match(dialog, /supabase\.auth\.getUser\(\)/);
  assert.match(dialog, /\.eq\("user_id", user\.id\)/);
  assert.match(dialog, /\.eq\("professional_id", professional\.id\)/);
  assert.match(dialog, /\.select\("id"\)\s*\.maybeSingle\(\)/);
  assert.match(dialog, /if \(!deleted\?\.id\)/);
  assert.match(dialog, /Keep the dialog open on failure/);
});

test('fase 2: dados do cadastro e Anamnese sem entrada manual sem vínculo', () => {
  const selection = read('src/components/musicoterapia/BasicInformationSection.tsx');
  const wizard = read('src/components/musicoterapia/MusicoterapiaReportWizard.tsx');
  const page = read('src/pages/processes/musicoterapia/index.tsx');
  assert.doesNotMatch(selection, /Novo paciente \(entrada manual\)/);
  assert.match(selection, /página Pacientes/);
  assert.match(selection, /anamnesisSourceDate/);
  assert.match(wizard, /Requisitos das etapas clínicas atendidos/);
  assert.match(wizard, /if \(!reportData\.selectedPatientId\)/);
  assert.match(page, /setAnamnesisSourceDate\(data\.updated_at \|\| data\.created_at/);
  assert.match(page, /previous\.selectedPatientId !== patientId/);
});

test('fase 3: assinatura é recuperada somente da conta autenticada e incluída em dois geradores', () => {
  const helper = read('src/utils/musicoterapiaProfessionalAssets.ts');
  const native = read('src/utils/musicoterapiaNativePdf.ts');
  const legacy = read('src/utils/renderMusicoterapiaSignaturePdf.ts');
  const page = read('src/pages/processes/musicoterapia/index.tsx');
  assert.match(helper, /user\.id !== expectedUserId/);
  assert.match(helper, /\.from\("digital-signatures"\)/);
  assert.match(helper, /\.download\(/);
  assert.match(native, /signature\?: string \| null/);
  assert.match(native, /addImage\(images\.signature,/);
  assert.match(legacy, /Assinatura cadastrada \(imagem\)/);
  assert.match(page, /resolveMusicoterapiaProfessionalAssets\(professionalData, userId\)/);
  assert.match(page, /getPrivateClinicalPdf\(archivedId\)/);
  assert.match(page, /archiveClinicalPdfInR2\(/);
});

test('fase 4: carregamento por páginas e busca explícita sem modificar versões', () => {
  const page = read('src/pages/processes/musicoterapia/index.tsx');
  assert.match(page, /REPORT_PAGE_SIZE = 24/);
  assert.match(page, /\.range\(offset, offset \+ REPORT_PAGE_SIZE - 1\)/);
  assert.match(page, /Carregar mais relatórios/);
  assert.match(page, /Filtrar histórico por situação/);
  assert.match(page, /groupMusicoterapiaReportHistory\(filteredReports\)/);
  assert.match(page, /document_status: 'finalizado', archived_pdf_document_id: archived\.id/);
});

test('PDF A4 com assinatura é texto extraível e usa dados totalmente fictícios', async () => {
  const realJsPDF = require('jspdf').jsPDF;
  const originalLoad = Module._load;
  let exportPdf;
  try {
    Module._load = function(requested, parent, isMain) {
      if (requested === 'jspdf') {
        return function (...args) {
          const doc = new realJsPDF(...args);
          doc.save = () => {};
          return doc;
        };
      }
      return originalLoad.call(this, requested, parent, isMain);
    };
    ({ exportMusicoterapiaNativePdf: exportPdf } = loadTs('src/utils/musicoterapiaNativePdf.ts'));
  } finally {
    Module._load = originalLoad;
  }
  const png = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAADCAIAAADZSiLoAAAAF0lEQVR4nGOUz7NjYGBgYGBgYoABBAsAFo0A0YJ3JSwAAAAASUVORK5CYII=';
  const report = {
    patientName: 'Paciente Fictício',
    sessionDate: '2026-11-12',
    fieldValues: {
      patient_name: 'Paciente Fictício',
      professional_name: 'Profissional Fictício',
      musicoterapia_approach_ids: [],
      therapeutic_objective_ids: [],
    },
  };
  const blob = await exportPdf(report,
    {name: 'Profissional Fictício', email:'exemplo@example.invalid'},
    { signature: png, stamp: png }, 'amostra-ficticia.pdf');
  assert.equal(blob.type, 'application/pdf');
  assert.ok(blob.size > 1000);
  const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const pdf = await getDocument({
    data: new Uint8Array(await blob.arrayBuffer()), useSystemFonts: true, disableFontFace: true
  }).promise;
  let text = '';
  for(let n=1; n<=pdf.numPages; n++) {
    const page=await pdf.getPage(n);
    assert.ok(Math.abs(page.view[2]-595.28)<1 && Math.abs(page.view[3]-841.89)<1);
    text += ' ' + (await page.getTextContent()).items.map(x=>x.str||'').join(' ');
  }
  assert.match(text,/Paciente Fictício/);
  assert.match(text,/Profissional Fictício/);
  assert.match(text,/Assinatura cadastrada \(imagem\)/);
  assert.match(text,/Página 1 de/);
  await pdf.destroy();
});
