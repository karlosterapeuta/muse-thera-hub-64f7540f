const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');

test('cache clínico segmentado por usuário, com consultas condicionadas à sessão', () => {
  const counts = read('src/hooks/useDashboardCounts.ts');
  const weekly = read('src/pages/Dashboard/hooks/useDashboardData.ts');
  for (const key of ['patients-count', 'anamnesis-count', 'interventions-count']) {
    assert.match(counts, new RegExp(`queryKey: \\["${key}", userId\\]`));
  }
  assert.match(counts, /\["reports-count", "musicoterapia", userId\]/);
  assert.equal((counts.match(/enabled: Boolean\(userId\)/g) || []).length, 4);
  assert.match(weekly, /\["dashboard-data", userId, weekKey\]/);
  assert.match(read('src/components/dashboard/PlanStatusCard.tsx'), /\["user-plan-status", userId\]/);
  assert.match(read('src/components/dashboard/PendingUsersPanel.tsx'), /\["pending-users", userId\]/);
  assert.match(read('src/pages/Dashboard/hooks/useDashboardIdentity.ts'), /onAuthStateChange/);
});

test('falhas da agenda jamais viram semanas vazias ou estatísticas falsas', () => {
  const service = read('src/pages/Dashboard/services/sessionsService.ts');
  const hook = read('src/pages/Dashboard/hooks/useDashboardData.ts');
  const ui = read('src/pages/Dashboard/index.tsx');
  assert.match(service, /throw error;\s*\}\s*\}/);
  assert.doesNotMatch(hook, /getWeekSessions\([^\n]*\.catch\(\(\) => \[\]\)/);
  assert.match(hook, /metricErrors/);
  assert.match(ui, /Não foi possível consultar os atendimentos/);
});

test('atalhos clínicos selecionam apenas pacientes autorizados', () => {
  const ui = read('src/pages/Dashboard/index.tsx');
  assert.match(ui, /processes\/evolution\?patient_id=/);
  assert.match(ui, /evaluation\/paciente\//);
  assert.match(read('src/pages/processes/evolution/index.tsx'), /\(data \|\| \[\]\)\.find\(patient => patient\.id === patientIdFromDashboard\)/);
  assert.match(read('src/pages/patients.tsx'), /patients\.find\(patient => patient\.id === patientIdFromDashboard\)/);
});

test('a alteração não adiciona exclusões de documentos e mantém pagamento intacto', () => {
  for (const name of ['src/pages/Dashboard/index.tsx', 'src/pages/Dashboard/hooks/useDashboardData.ts', 'src/hooks/useDashboardCounts.ts', 'src/pages/processes/evolution/index.tsx', 'src/pages/patients.tsx']) {
    assert.doesNotMatch(read(name), /supabase\.storage[\s\S]{0,100}\.remove\(/);
  }
  assert.match(read('src/components/dashboard/PlanStatusCard.tsx'), /create-plan-renewal/);
});
