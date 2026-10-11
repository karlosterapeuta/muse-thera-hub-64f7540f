import type { ReportData } from '@/data/musicoterapiaTemplate';
import { scaleFieldIds } from '@/data/musicoterapiaTemplate';
import { getSelectedMusicoterapiaApproaches } from '@/data/musicoterapiaApproaches';

/**
 * Avisos de revisão técnico-clínica, não uma validação científica ou diagnóstica.
 * Não altera pontuações, não inventa observações e não impede o uso de relatórios legados.
 */
export function getMusicoterapiaQualityWarnings(report: Partial<ReportData>): string[] {
  const fields = report.fieldValues || {};
  const hasValue = (value: unknown): boolean =>
    Array.isArray(value)
      ? value.some((item) => String(item ?? '').trim().length > 0)
      : value !== null && value !== undefined && String(value).trim().length > 0;

  const warnings: string[] = [];

  if (!hasValue(fields.evaluation_period)) {
    warnings.push('Informe o período avaliado (data inicial e final), quando se tratar de relatório de evolução.');
  }
  if (!hasValue(fields.session_count)) {
    warnings.push('Informe a quantidade de sessões efetivamente realizadas no período.');
  }
  if (hasValue(report.patientDiagnosis || fields.patient_diagnosis || fields.cid_code) && !hasValue(fields.diagnosis_source)) {
    warnings.push('Indique a fonte do diagnóstico informado; o relatório musicoterapêutico não confirma o diagnóstico de TEA.');
  }
  if (!hasValue(fields.baseline_observation) && !hasValue(fields.evolution_compared_baseline)) {
    warnings.push('Registre a linha de base ou explique a impossibilidade de comparação com a avaliação inicial.');
  }
  if (!hasValue(fields.current_observation) && !hasValue(fields.quantitative_indicators)) {
    warnings.push('Descreva os resultados atuais com comportamentos observáveis, frequência, duração ou oportunidades.');
  }
  if ((hasValue(fields.quantitative_indicators) || hasValue(fields.current_observation)) && !hasValue(fields.measurement_method)) {
    warnings.push('Descreva o procedimento de mensuração e as condições de observação.');
  }
  if (scaleFieldIds.some((id) => hasValue(fields[id])) && !hasValue(fields.domain_evidences)) {
    warnings.push('Justifique as pontuações dos domínios com exemplos observados; números isolados não bastam.');
  }
  if (!hasValue(fields.report_limitations)) {
    warnings.push('Registre limitações do período avaliado (ou informe expressamente quando não houver).');
  }
  return warnings;
}
