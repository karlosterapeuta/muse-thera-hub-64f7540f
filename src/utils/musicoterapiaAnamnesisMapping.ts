import type { Database } from '@/integrations/supabase/types';
import type { ReportData } from '@/data/musicoterapiaTemplate';

export type PatientAnamnesis = Database['public']['Tables']['anamnesis']['Row'];
export type MappedPatientAnamnesis = {
  patientGuardian?: string;
  patientDiagnosis?: string;
  fieldValues: Partial<ReportData['fieldValues']>;
};

/**
 * Apenas campos da anamnese que pertencem à identificação e ao contexto
 * clínico inicial. Não copiar o prontuário inteiro nem inferir resultados,
 * intervenções realizadas ou validade de diagnóstico.
 */
export const ANAMNESIS_IDENTIFICATION_FIELD_IDS = [
  'referral_source',
  'referral_reason',
  'cid_code',
  'support_level',
  'current_medications',
  'diagnosis_date',
  'clinical_details',
  'mother_name',
  'father_name',
  'legal_guardian',
  'family_relationship',
  'medication_schedule',
  'medication_effects',
  'calming_strategies',
  'family_support_network'
] as const;

const text = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : '';

export function mapAnamnesisToMusicoterapia(anamnesis: PatientAnamnesis): MappedPatientAnamnesis {
  const fieldValues: Record<string, string> = {};
  const mapping: Array<[string, unknown]> = [
    ['referral_source', anamnesis.referral_professional],
    ['referral_reason', anamnesis.main_clinical_demand],
    ['cid_code', anamnesis.cid_code],
    ['support_level', anamnesis.support_level],
    ['current_medications', anamnesis.current_medication],
    ['diagnosis_date', anamnesis.diagnosis_date],
    ['clinical_details', anamnesis.clinical_details],
    ['mother_name', anamnesis.mother_name],
    ['father_name', anamnesis.father_name],
    ['legal_guardian', anamnesis.legal_guardian],
    ['family_relationship', anamnesis.family_relationship],
    ['medication_schedule', anamnesis.medication_schedule],
    ['medication_effects', anamnesis.medication_effects],
    ['calming_strategies', anamnesis.calming_strategies],
    ['family_support_network', anamnesis.family_support_network]
  ];

  for (const [key, value] of mapping) {
    const normalized = text(value);
    if (normalized) fieldValues[key] = normalized;
  }

  // Na Etapa 01, o campo "Diagnóstico" deve refletir exatamente o CID
  // informado na Anamnese, sem transformá-lo automaticamente em laudo.
  const patientDiagnosis = text(anamnesis.cid_code);
  const patientGuardian = text(anamnesis.legal_guardian);

  return {
    ...(patientDiagnosis ? { patientDiagnosis } : {}),
    ...(patientGuardian ? { patientGuardian } : {}),
    fieldValues
  };
}
