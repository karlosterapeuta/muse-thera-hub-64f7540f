const assert = require("node:assert/strict");
const { buildSync } = require("esbuild");
const { mkdtempSync, rmSync } = require("node:fs");
const { tmpdir } = require("node:os");
const { join } = require("node:path");

const folder = mkdtempSync(join(tmpdir(), "musetera-scoring-"));
try {
  for (const [name, file] of Object.entries({
    scoring: "src/utils/museteraScoring.ts",
    normalize: "src/pages/evaluation/utils/normalizeEvaluation.ts",
    longitudinal: "src/utils/evaluationLongitudinal.ts",
    domains: "src/pages/evaluation/utils/domains.ts",
  })) {
    buildSync({ entryPoints: [file], bundle: true, platform: "node", outfile: join(folder, name + ".cjs"), logLevel: "silent" });
  }
  const { levelScore, normalizeSelections, summarizeEvaluation } = require(join(folder, "scoring.cjs"));
  const { evaluationDomains } = require(join(folder, "domains.cjs"));
  const { normalizeEvaluation } = require(join(folder, "normalize.cjs"));
  const { compareMatchedAssessments } = require(join(folder, "longitudinal.cjs"));
  const domain = evaluationDomains[0], sub = domain.subdomains[0];
  const values = ["0", 1, "2", 3, "4", 5, "nao_aplicavel", ""];
  const selections = Object.fromEntries(sub.parameters.map((parameter, i) => [domain.title + "-" + sub.title + "-" + parameter, values[i]]));
  const summary = summarizeEvaluation(selections, evaluationDomains);
  assert.equal(summary.evaluatedParameters, 6);
  assert.equal(summary.percentage, 50);
  assert.equal(summary.notApplicableParameters, 1);
  assert.equal(levelScore(0), 0);
  assert.equal(levelScore("unknown"), null);
  const legacy = { id: "legacy", date: "2026-01-01", content: { selections, overallScore: { percentage: 99 } } };
  const normalized = normalizeEvaluation(legacy);
  assert.equal(normalized.content.overallScore.percentage, 50);
  assert.equal(normalized.content.domainScores[0].score, 50);
  assert.equal(legacy.content.overallScore.percentage, 99);
  assert.equal(normalized.content.selections[Object.keys(selections)[0]], "nao_observado");
  const comparison = compareMatchedAssessments(legacy, { ...legacy, content: { selections: normalizeSelections(selections) } });
  assert.equal(comparison.sharedCount, 6);
  assert.equal(comparison.change, 0);
  console.log("PASS: formatos antigos e atuais, zero, N/A, contagem, leitura sem mutação e comparação.");
} finally {
  rmSync(folder, { recursive: true, force: true });
}
