import { getSelectedMusicoterapiaObjectives } from '@/data/musicoterapiaObjectives';
import { getSelectedMusicoterapiaApproaches } from '@/data/musicoterapiaApproaches';
import { getObjectiveOutcomes } from '@/data/musicoterapiaObjectiveOutcomes';
import { getRecordedApproachResults } from '@/data/musicoterapiaApproachResults';

/**
 * Visualizações editoriais e gráficos a partir de registros efetivos. Não
 * representar objetivos planejados como resultados nem percentuais como
 * escalas clínicas ou medidas de eficácia.
 */
type Metric = { label: string; count: number; color: string };
const safePercent = (part: number, total: number) => total ? Math.round((part / total) * 100) : 0;

function renderBars(items: Metric[], total: number, label: string) {
  return `<div class="pdf-chart" aria-label="${label}">
    <div class="pdf-chart-title">${label}</div>
    ${items.map(item => `
      <div class="pdf-chart-row pdf-keep">
        <span class="pdf-chart-label">${item.label}</span>
        <span class="pdf-chart-track"><span class="pdf-chart-fill" style="width:${safePercent(item.count, total)}%;background:${item.color};"></span></span>
        <strong class="pdf-chart-number">${item.count}</strong>
      </div>
    `).join('')}
    <div class="pdf-chart-source">Quantidade de registros • Não corresponde a uma escala clínica.</div>
  </div>`;
}

export function renderMusicoterapiaPdfVisuals(fields: Record<string, unknown>) {
  const goals = getSelectedMusicoterapiaObjectives(fields.therapeutic_objective_ids);
  const approaches = getSelectedMusicoterapiaApproaches(fields.musicoterapia_approach_ids);
  const outcomes = getObjectiveOutcomes(fields.therapeutic_objective_ids, fields.objective_outcomes);
  const approachResults = getRecordedApproachResults(fields.musicoterapia_approach_ids, fields.approach_results);
  if (!outcomes.length && !approachResults.length) return '';

  const completedOutcomes = outcomes.filter(x => x.status !== 'not_assessed');
  const continuing = outcomes.filter(x => ['progressing', 'no_progress', 'difficulty'].includes(x.status));
  const objectiveMetrics: Metric[] = [
    { label: 'Alcançados', count: outcomes.filter(x => x.status === 'achieved').length, color: '#0f766e' },
    { label: 'Em evolução', count: outcomes.filter(x => x.status === 'progressing').length, color: '#0891b2' },
    { label: 'Sem avanço', count: outcomes.filter(x => x.status === 'no_progress').length, color: '#d97706' },
    { label: 'Dificuldade', count: outcomes.filter(x => x.status === 'difficulty').length, color: '#b45309' },
    { label: 'Não avaliados', count: outcomes.filter(x => x.status === 'not_assessed').length, color: '#94a3b8' }
  ];
  const approachMetrics: Metric[] = [
    { label: 'Espontânea', count: approachResults.filter(x => x.result.status === 'independent').length, color: '#0f766e' },
    { label: 'Progresso relatado', count: approachResults.filter(x => x.result.status === 'progress').length, color: '#0891b2' },
    { label: 'Com apoio', count: approachResults.filter(x => x.result.status === 'with_support').length, color: '#64748b' },
    { label: 'Variáveis', count: approachResults.filter(x => x.result.status === 'variable').length, color: '#a16207' },
    { label: 'Dificuldades', count: approachResults.filter(x => x.result.status === 'difficulties').length, color: '#b45309' },
    { label: 'Em observação', count: approachResults.filter(x => x.result.status === 'insufficient_data').length, color: '#7c8da5' },
    { label: 'Não aplicadas', count: approachResults.filter(x => x.result.status === 'not_applied').length, color: '#94a3b8' }
  ];
  const cards = [
    { count: `${completedOutcomes.length}/${goals.length}`, label: 'Objetivos avaliados' },
    { count: continuing.length.toString(), label: 'Demandas em continuidade' },
    { count: `${approachResults.length}/${approaches.length}`, label: 'Abordagens registradas' }
  ];

  return `<section class="pdf-dashboard section-block">
    <div class="pdf-section-heading pdf-keep">
      <span class="pdf-section-index">01</span>
      <div><h2>Painel clínico do período</h2><p>Visualização dos resultados registrados pelo musicoterapeuta</p></div>
    </div>
    <div class="pdf-stat-row">
      ${cards.map(c => `<div class="pdf-stat pdf-keep">
        <strong>${c.count}</strong><span>${c.label}</span>
      </div>`).join('')}
    </div>
    <div class="pdf-chart-grid">
      ${outcomes.length ? renderBars(objectiveMetrics, outcomes.length, 'Situação dos objetivos') : ''}
      ${approachResults.length ? renderBars(approachMetrics, approachResults.length, 'Respostas às abordagens') : ''}
    </div>
    <p class="pdf-context-note">Gráficos descritivos dos registros do profissional. Não são resultados de escala validada, nem demonstram, isoladamente, efeito ou causalidade terapêutica.</p>
  </section>`;
}

/** Ilustração vetorial decorativa - não representa dados de saúde. */
export function renderMusicoterapiaPdfHeaderArt() {
  return `<svg class="pdf-header-art" width="156" height="86" viewBox="0 0 156 86"
    xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Motivo musical decorativo">
    <circle cx="108" cy="43" r="35" fill="#e0f2f1" opacity=".6"/>
    <circle cx="108" cy="43" r="24" fill="none" stroke="#99f6e4" stroke-width="1.4"/>
    <path d="M8 43 Q19 43 24 31 T37 43 T50 43 T63 23 T76 43 T89 43 T102 34 T115 43 T128 43 T146 43"
      stroke="#0f766e" stroke-width="3.2" fill="none" stroke-linecap="round"/>
    <path d="M12 55 Q32 55 46 51 T78 55 T115 52 T146 55"
      stroke="#14b8a6" stroke-width="1.5" fill="none" stroke-linecap="round" opacity=".75"/>
    <circle cx="63" cy="23" r="4.5" fill="#0f766e"/>
    <circle cx="102" cy="34" r="3.8" fill="#14b8a6"/>
  </svg>`;
}
