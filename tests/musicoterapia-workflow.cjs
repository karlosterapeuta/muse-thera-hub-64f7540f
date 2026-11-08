const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const esbuild = require('esbuild');

function loadTs(relativePath) {
  const file = path.resolve(__dirname, '..', relativePath);
  const code = esbuild.buildSync({
    entryPoints: [file], bundle: true, write: false, format: 'cjs', platform: 'node',
    packages: 'external', tsconfig: path.resolve(__dirname, '../tsconfig.app.json'),
  }).outputFiles[0].text;
  const loaded = new Module(file, module);
  loaded.filename = file;
  loaded.paths = Module._nodeModulePaths(__dirname);
  loaded._compile(code, file);
  return loaded.exports;
}

const {
  getMusicoterapiaReportStatus,
  groupMusicoterapiaReportHistory,
  compareMusicoterapiaReportFields,
} = loadTs('src/utils/musicoterapiaReportHistory.ts');

function version(id, patientId, createdAt, content = {}) {
  return { id, patient_id: patientId, created_at: createdAt, content };
}

test('relatórios legados continuam finais; somente status explícito indica rascunho', () => {
  assert.equal(getMusicoterapiaReportStatus(null), 'finalizado');
  assert.equal(getMusicoterapiaReportStatus({ field_values: { clinical_observation: 'Antigo' } }), 'finalizado');
  assert.equal(getMusicoterapiaReportStatus({ document_status: 'rascunho' }), 'rascunho');
  assert.equal(getMusicoterapiaReportStatus({ document_status: 'finalizado' }), 'finalizado');
});

test('histórico agrupa versões do mesmo paciente, preserva originais e ordena sem mutação', () => {
  const entries = [
    version('draft', 'p1', '2026-11-08T10:00:00Z', { document_status: 'rascunho', based_on_report_id: 'final', root_report_id: 'base' }),
    version('other', 'p2', '2026-11-08T12:00:00Z'),
    version('base', 'p1', '2026-11-01T10:00:00Z'),
    version('final', 'p1', '2026-11-05T10:00:00Z', { root_report_id: 'base' }),
  ];
  const before = JSON.stringify(entries);
  const groups = groupMusicoterapiaReportHistory(entries);
  assert.equal(groups.length, 2);
  assert.deepEqual(groups.find(group => group.patientId === 'p1').versions.map(item => item.id), ['draft', 'final', 'base']);
  assert.equal(groups.find(group => group.patientId === 'p2').versions[0].id, 'other');
  assert.equal(JSON.stringify(entries), before);
});

test('raízes filtradas não confundem pacientes nem documentos independentes', () => {
  const entries = [
    version('v1', 'p1', '2026-11-08', { root_report_id: 'external' }),
    version('v2', 'p1', '2026-11-09', { based_on_report_id: 'external' }),
    version('v3', 'p2', '2026-11-10', { root_report_id: 'external' }),
    version('self', 'p3', '2026-11-08', { based_on_report_id: 'self' }),
  ];
  const groups = groupMusicoterapiaReportHistory(entries);
  assert.equal(groups.length, 3);
  assert.deepEqual(groups.find(group => group.patientId === 'p1').versions.map(item => item.id), ['v2', 'v1']);
  assert.equal(groups.find(group => group.patientId === 'p2').versions[0].id, 'v3');
  assert.equal(groups.find(group => group.patientId === 'p3').versions[0].id, 'self');
});

test('diferenças de documento preservam zero, arrays e estrutura clínica original', () => {
  const before = { field_values: { escala_1: 0, objectives: ['communication'], detailed_notes: 'Observação clínica' } };
  const after = { field_values: { escala_1: 2, objectives: ['communication', 'attention'], detailed_notes: 'Observação clínica' } };
  const snapshot = JSON.stringify([before, after]);
  assert.deepEqual(compareMusicoterapiaReportFields(before, after), ['escala_1', 'objectives']);
  assert.deepEqual(compareMusicoterapiaReportFields(after, after), []);
  assert.equal(JSON.stringify([before, after]), snapshot);
});

test('rascunho atualiza o mesmo ID e o PDF original depende do arquivamento confirmado', () => {
  const source = fs.readFileSync(path.resolve(__dirname, '../src/pages/processes/musicoterapia/index.tsx'), 'utf8');
  assert.match(source, /document_status: 'rascunho'/);
  assert.match(source, /\.update\(payload\)[\s\S]*?\.eq\('id', savedId\)[\s\S]*?\.eq\('professional_id', professionalId\)[\s\S]*?\.eq\('patient_id', patientId\)/);
  assert.match(source, /queuedSavesRef\.current \+= 1/);
  assert.match(source, /hasUnsavedChangesRef\.current/);
  assert.match(source, /beforeunload/);
  assert.match(source, /setTimeout\(\(\) => \{ void handleSaveReport\(\{ silent: true \}\); \}, 3000\)/);
  assert.match(source, /archiveClinicalPdfInR2\(/);
  assert.match(source, /document_status: 'finalizado', archived_pdf_document_id: archived\.id/);
  assert.match(source, /getPrivateClinicalPdf\(archivedId\)/);
  assert.match(source, /editRevisionRef\.current === exportRevision/);
  assert.doesNotMatch(source, /savePDFToStorage/);
});

test('assistente tem nove etapas acessíveis, erros específicos e confirmação clínica de exemplos', () => {
  const wizard = fs.readFileSync(path.resolve(__dirname, '../src/components/musicoterapia/MusicoterapiaReportWizard.tsx'), 'utf8');
  const review = fs.readFileSync(path.resolve(__dirname, '../src/components/musicoterapia/FinalReviewSection.tsx'), 'utf8');
  assert.match(wizard, /aria-label="Etapas do relatório"/);
  assert.match(wizard, /aria-current=\{active \? 'step'/);
  assert.match(wizard, /role="progressbar"/);
  assert.match(wizard, /validateCurrentStep\(\)\.slice\(0, 3\)\.map/);
  assert.match(wizard, /Os textos prontos são exemplos, não fatos observados do paciente/);
  assert.match(wizard, /window\.confirm/);
  assert.match(review, /Baixar e arquivar/);
  assert.match(review, /Salvar rascunho/);
  assert.match(wizard, /bg-primary text-primary-foreground/);
});

test('exportador nativo continua gerando um PDF real para dados fictícios', async () => {
  // jsPDF's Node CommonJS export differs from its browser default export.
  // Keep real jsPDF rendering, suppress only its filesystem download side effect.
  const realJsPDF = require('jspdf').jsPDF;
  const originalLoad = Module._load;
  let exportMusicoterapiaNativePdf;
  try {
    Module._load = function (requested, parent, isMain) {
      if (requested === 'jspdf') {
        const BrowserCompatibleJsPDF = function (...args) {
          const pdf = new realJsPDF(...args);
          pdf.save = () => {};
          return pdf;
        };
        return BrowserCompatibleJsPDF;
      }
      return originalLoad.call(this, requested, parent, isMain);
    };
    ({ exportMusicoterapiaNativePdf } = loadTs('src/utils/musicoterapiaNativePdf.ts'));
  } finally {
    Module._load = originalLoad;
  }
  const report = {
    patientName: 'Paciente fictício',
    sessionDate: '2026-11-08',
    fieldValues: { patient_name: 'Paciente fictício', professional_name: 'Profissional fictício' },
  };
  const blob = await exportMusicoterapiaNativePdf(report, { name: 'Profissional fictício' }, {}, 'teste-ficticio.pdf');
  assert.equal(blob.type, 'application/pdf');
  assert.ok(blob.size > 500);
  assert.equal(Buffer.from(await blob.slice(0, 5).arrayBuffer()).toString('ascii'), '%PDF-');
});
