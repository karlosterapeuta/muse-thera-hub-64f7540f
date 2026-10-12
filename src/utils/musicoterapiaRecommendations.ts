import type { MusicoterapiaObjective } from '@/data/musicoterapiaObjectives';
import type { ObjectiveOutcomeStatus } from '@/data/musicoterapiaObjectiveOutcomes';
import type { ApproachResultEntry } from '@/data/musicoterapiaApproachResults';

/**
 * Recomendações de planejamento — não são constatações sobre o paciente.
 * Os recursos e os indicadores procedem do catálogo de objetivos selecionados.
 * Somente a classificação lançada pelo profissional caracteriza o estado atual.
 */
export type ClinicalObjectiveOutcome = {
  objective: MusicoterapiaObjective;
  status: ObjectiveOutcomeStatus;
};

export type RecordedMusicoterapiaApproach = {
  approach: { title: string };
  result: ApproachResultEntry;
};

export type IndividualRecommendation = {
  title: string;
  statusLabel: string;
  guidance: string;
  monitoring: string;
};

const statusGuidance: Record<ObjectiveOutcomeStatus, { label: string; direction: string }> = {
  difficulty: {
    label: 'Com dificuldade',
    direction: 'Rever a complexidade, a acessibilidade e os apoios oferecidos nas próximas propostas, respeitando as respostas observáveis.'
  },
  no_progress: {
    label: 'Sem avanço observado',
    direction: 'Reavaliar a adequação das propostas e dos critérios de observação; essa classificação não indica incapacidade ou impossibilidade de desenvolvimento.'
  },
  progressing: {
    label: 'Em evolução',
    direction: 'Acompanhar o objetivo classificado como em evolução, observando em quais condições ocorrem as respostas, sem presumir autonomia ou aquisição de habilidades.'
  },
  achieved: {
    label: 'Alcançado',
    direction: 'Acompanhar a manutenção das respostas descritas e suas condições de ocorrência, sem presumir generalização para outros contextos.'
  },
  not_assessed: {
    label: 'Não avaliado',
    direction: 'Estabelecer um registro inicial de respostas e níveis de apoio antes de formular conclusões sobre o objetivo.'
  }
};

const withoutTerminalPunctuation = (value: string) =>
  value.trim().replace(/[\\s.!?;:,]+$/gu, '').trim();

const ensurePeriod = (value: string) => {
  const normalized = withoutTerminalPunctuation(value);
  return normalized ? normalized + '.' : '';
};

const isGenericRecommendation = (value: string) =>
  /^manter\\s+o\\s+acompanhamento\\s+musicoterap[eê]utico\\s+e\\s+reavaliar\\s+os\\s+objetivos\\s+periodicamente\\s*\\.?$/iu.test(value.trim());

/** Preserva orientação substantiva redigida pelo profissional, sem reescrita por IA. */
export function getProfessionalRecommendation(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  return normalized && !isGenericRecommendation(normalized) ? normalized : null;
}

/**
 * Gera uma proposta por objetivo sem inventar atividades realizadas.
 * Objetivos novos passam a utilizar automaticamente seus recursos/indicadores.
 */
export function buildIndividualRecommendations(
  outcomes: ClinicalObjectiveOutcome[]
): IndividualRecommendation[] {
  return outcomes.map(({ objective, status }) => {
    const current = statusGuidance[status];
    const resources = typeof objective.resources === 'string' ? withoutTerminalPunctuation(objective.resources) : '';
    const indicator = typeof objective.indicator === 'string' ? withoutTerminalPunctuation(objective.indicator) : '';
    const guidanceParts = [current.direction];
    if (resources) guidanceParts.push('Possibilidades a considerar, conforme pertinência clínica: ' + ensurePeriod(resources));
    return {
      title: objective.title,
      statusLabel: current.label,
      guidance: guidanceParts.join(' '),
      monitoring: indicator ? ensurePeriod(indicator) : 'Documentar respostas observáveis e o nível de apoio em condições identificáveis.'
    };
  });
}

/**
 * Usa apenas respostas efetivamente registradas — não atribui efeitos nem
 * generaliza a resposta a objetivos que ainda não foram avaliados.
 */
export function buildApproachFollowUp(
  recorded: RecordedMusicoterapiaApproach[]
): string | null {
  const observations = recorded
    .filter(({ result }) =>
      result.status !== 'not_applied' &&
      (result.indicators.length > 0 || Boolean(result.note.trim()))
    )
    .map(({ approach }) => approach.title);
  if (!observations.length) return null;
  return 'Considerar, no planejamento futuro, as respostas observadas nas abordagens ' +
    observations.join(', ') +
    ', registrando as condições de participação, as preferências e os apoios necessários. Essas respostas não demonstram, isoladamente, ganhos em outros domínios.';
}
