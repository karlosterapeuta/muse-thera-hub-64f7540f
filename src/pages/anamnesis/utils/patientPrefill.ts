/** Identificação já cadastrada: somente campos realmente presentes em patients. */
export type RegisteredPatient = {
  id: string;
  name: string;
  birth_date: string | null;
  responsible: string | null;
  contact: string | null;
  photo_url?: string | null;
};

/**
 * O cadastro é a fonte dos dados pessoais. Na anamnese, apenas o nome de
 * responsável pode ser sugerido como responsável legal, e só em campo vazio.
 * Nunca inferir vínculo familiar ou copiar diagnósticos/medicação.
 */
export function prefillAnamnesisFromPatient<T extends Record<string, unknown>>(
  current: T,
  patient: RegisteredPatient,
): T & { legal_guardian?: string } {
  const responsible = patient.responsible?.trim();
  if (!responsible || String(current.legal_guardian ?? "").trim()) return { ...current };
  return { ...current, legal_guardian: responsible };
}
