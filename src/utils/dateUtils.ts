/**
 * Utilitários centralizados para cálculo de idade e manipulação de datas
 * Evita bugs de timezone ao parsear datas no timezone LOCAL
 */

/**
 * Calcula a idade a partir de uma data de nascimento (formato YYYY-MM-DD)
 * Parseia a data no timezone LOCAL para evitar erros de 1 dia causados por UTC
 */
export const calculateAgeFromBirthDate = (birthDate: string | null | undefined): number | null => {
  if (!birthDate) return null;
  
  // Parsear data no timezone LOCAL (evita bug UTC que causa erro de 1 dia)
  const [year, month, day] = birthDate.split('-').map(Number);
  if (!year || !month || !day) return null;
  
  const birthDateObj = new Date(year, month - 1, day); // month é 0-indexed
  if (isNaN(birthDateObj.getTime())) return null;
  
  const today = new Date();
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDiff = today.getMonth() - birthDateObj.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Formata a idade como string (ex: "25 anos")
 * Usa fallback para campo age caso birth_date não esteja disponível
 */
export const formatAgeString = (
  birthDate: string | null | undefined, 
  fallbackAge?: number | null
): string => {
  const age = calculateAgeFromBirthDate(birthDate) ?? fallbackAge;
  return age !== null && age !== undefined ? `${age} anos` : '';
};

/**
 * Calcula e retorna a idade ou fallback, útil para exibição em listas
 */
export const getAgeOrFallback = (
  birthDate: string | null | undefined,
  fallbackAge?: number | null
): number | null => {
  return calculateAgeFromBirthDate(birthDate) ?? fallbackAge ?? null;
};
