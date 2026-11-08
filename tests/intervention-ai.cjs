const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const esbuild = require('esbuild');

const root = path.resolve(__dirname, '..');
const corePath = path.join(root, 'supabase/functions/generate-therapy-activities/core.ts');

function loadCore() {
  const code = esbuild.buildSync({ entryPoints: [corePath], bundle: true, write: false, format: 'cjs', platform: 'node' }).outputFiles[0].text;
  const loaded = new Module(corePath, module);
  loaded._compile(code, corePath);
  return loaded.exports;
}

const { ACTIVITY_COUNT, collectDemands, allocateDemands, parseActivities } = loadCore();

function outputFor(allocation) {
  return JSON.stringify({ activities: allocation.flatMap(item => Array.from({ length: item.count }, (_, i) => ({
    demandNumber: item.demandNumber,
    disorder: item.disorder,
    demand: `${item.disorder}: ${item.category} - ${item.label}`,
    generalObjective: `Objetivo ${item.demandNumber}`,
    specificObjective: `Resposta observável ${i + 1}`,
    activityDescription: 'Criar diálogo sonoro em turnos com instrumentos e adaptações de volume.',
    materials: ['Teclado', 'Pandeiro'],
    estimatedTime: '20 minutos',
    evaluationCriteria: ['Número de turnos realizados'],
    complexityLevel: 'Moderado',
  }))) });
}

test('não mistura categorias com nomes iguais entre TEA e DI; inclui autonomia isolada', () => {
  const demands = collectDemands({
    selectedItems: [
      { disorder: 'TEA', category: 'Comunicação e Linguagem', label: 'Pouca intenção comunicativa' },
      { disorder: 'DI', category: 'Comunicação e Linguagem', label: 'Atraso no desenvolvimento da fala' },
    ],
    selectedDemands: { DI: ['Autonomia'] },
  });
  assert.equal(demands.length, 3);
  assert.deepEqual(demands.map(d => d.disorder), ['TEA', 'DI', 'DI']);
  assert.deepEqual(allocateDemands(demands).map(d => d.count), [4, 3, 3]);
});

test('seleções legadas com chave de transtorno são interpretadas; duplicatas são removidas', () => {
  const demands = collectDemands({ selectedSubDemands: { 'TEA::Socioemocional': ['Espera', 'Espera'], 'DI::Socioemocional': ['Espera'] } });
  assert.equal(demands.length, 2);
  assert.notEqual(demands[0].disorder, demands[1].disorder);
});

test('clientes anteriores ainda podem enviar categorias sem prefixo durante a migração', () => {
  const demands = collectDemands({ selectedSubDemands: { 'Comunicação e Linguagem': ['Pouca intenção comunicativa'] } });
  assert.equal(demands[0].disorder, 'TEA');
});

test('retorna exatamente dez atividades completas com IDs consistentes', () => {
  const allocation = allocateDemands(collectDemands({ selectedDemands: { DI: ['Autonomia'] } }));
  const activities = parseActivities('```json\n' + outputFor(allocation) + '\n```');
  assert.equal(ACTIVITY_COUNT, 10);
  assert.equal(activities.length, 10);
  assert.equal(activities[0].id, 'ativ-001');
  assert.equal(activities[9].id, 'ativ-010');
  assert.equal(activities[0].specialty, 'Musicoterapia');
  assert.throws(() => parseActivities(JSON.stringify({ activities: [] })), /10 atividades/);
  assert.throws(() => parseActivities('{"activities":['), /JSON completo/);
});

const edgePath = path.join(root, 'supabase/functions/generate-therapy-activities/index.ts');
let handleRequest;
const edgeSource = fs.readFileSync(edgePath, 'utf8')
  .replace(/import \{ serve \} from "https:\/\/[^\n]+\n/, 'const serve = callback => { globalThis.__testEdgeHandler = callback; };\n')
  .replace(/import \{ createClient \} from "https:\/\/[^\n]+\n/, 'const createClient = (...args) => globalThis.__testCreateClient(...args);\n')
  .replace(/import \{ ACTIVITY_COUNT, allocateDemands, collectDemands, parseActivities \} from "\.\/core\.ts";/,
    'const { ACTIVITY_COUNT, allocateDemands, collectDemands, parseActivities } = globalThis.__testCore;');
global.__testCore = loadCore();
const edgeCode = esbuild.transformSync(edgeSource, { loader: 'ts', format: 'cjs' }).code;

const moduleStub = new Module(edgePath, module);
moduleStub._compile(edgeCode, edgePath);
handleRequest = global.__testEdgeHandler;

async function mockRequest(config = {}) {
  const previous = { fetch: global.fetch, Deno: global.Deno, client: global.__testCreateClient };
  const calls = [];
  const body = { patientId: 'p-owned', selectedDemands: { DI: ['Autonomia'] }, ...config.body };
  global.Deno = { env: { get: name => config.keys?.[name] ?? (name === 'SUPABASE_URL' ? 'https://example.supabase.co' : name === 'SUPABASE_ANON_KEY' ? 'anon' : undefined) } };
  global.__testCreateClient = () => ({
    auth: { getUser: async () => ({ data: { user: config.unauthorized ? null : { id: 'u-owned' } }, error: null }) },
    from: () => ({
      select() { return this; },
      eq() { return this; },
      limit() { return this; },
      async maybeSingle() { return { data: config.noPatient ? null : { id: 'p-owned' }, error: null }; },
    }),
  });
  global.fetch = async (url, options) => {
    calls.push({ url, options });
    if (config.gatewayFails && String(url).includes('lovable')) return new Response('', { status: 503 });
    const data = outputFor(allocateDemands(collectDemands(body)));
    return new Response(JSON.stringify(String(url).includes('lovable')
      ? { choices: [{ message: { content: data } }] }
      : { candidates: [{ content: { parts: [{ text: data }] } }] }), { status: 200 });
  };
  try {
    const result = await handleRequest(new Request('https://example.supabase.co/functions/v1/generate-therapy-activities', {
      method: 'POST',
      headers: { Authorization: 'Bearer test', 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }));
    return { response: result, payload: await result.json(), calls };
  } finally {
    global.fetch = previous.fetch;
    global.Deno = previous.Deno;
    global.__testCreateClient = previous.client;
  }
}

test('gera 10 sugestões se houver só a chave do Gateway (Google opcional); não envia nome do paciente', async () => {
  const { response, payload, calls } = await mockRequest({ keys: { LOVABLE_API_KEY: 'fake' }, body: { patientName: 'Nome Sensível' } });
  assert.equal(response.status, 200);
  assert.equal(payload.activities.length, 10);
  assert.equal(calls.length, 1);
  assert.doesNotMatch(calls[0].options.body, /Nome Sensível/);
});

test('se Gateway falhar, usa Google, sem descartar a seleção clínica', async () => {
  const { response, payload, calls } = await mockRequest({ keys: { LOVABLE_API_KEY: 'fake', GOOGLE_AI_API_KEY: 'fake' }, gatewayFails: true });
  assert.equal(response.status, 200);
  assert.equal(payload.activities.length, 10);
  assert.equal(calls.length, 2);
  assert.match(calls[1].url, /v1beta\/models\/gemini-2.5-flash/);
});

test('sem configuração de IA devolve 503 específico e sem paciente devolve 403', async () => {
  const empty = await mockRequest();
  assert.equal(empty.response.status, 503);
  assert.match(empty.payload.error, /configurado/);
  const forbidden = await mockRequest({ keys: { GOOGLE_AI_API_KEY: 'fake' }, noPatient: true });
  assert.equal(forbidden.response.status, 403);
  assert.equal(forbidden.calls.length, 0);
});

test('interface informa erro da função, preserva dados, fornece PDF e apresenta seleção isolada', () => {
  const page = fs.readFileSync(path.join(root, 'src/pages/intervention/index.tsx'), 'utf8');
  const pdf = fs.readFileSync(path.join(root, 'src/pages/intervention/utils/interventionPdf.ts'), 'utf8');
  assert.match(page, /selectedSubDemands\[`TEA::\$\{category.category\}`\]/);
  assert.match(page, /selectedSubDemands\[`DI::\$\{category.category\}`\]/);
  assert.match(page, /response\.json\(\)/);
  assert.match(page, /setGenerationError\(errorDescription\)/);
  assert.match(page, /selected_sub_demands: selectedSubDemands/);
  assert.match(page, /buildInterventionPdf\(\{ patientName, activities, planDate, professional \}\)/);
  assert.match(pdf, /drawField\('Procedimento \/ descrição da atividade', activity\.activityDescription\)/);
  assert.match(pdf, /input\.professional\.signatureDataUrl/);
  assert.match(pdf, /input\.professional\.stampDataUrl/);
  assert.match(page, /savePDFToStorage\(blob, filename, 'intervention'\)/);
  assert.doesNotMatch(page, /html2pdf\.js/);
});
