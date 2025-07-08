
export const translateApproachType = (value: string): string => {
  const translations: Record<string, string> = {
    'behavioral': 'Musicoterapia Comportamental',
    'nordoff_robbins': 'Modelo Nordoff-Robbins',
    'neurologic': 'Musicoterapia Neurológica (NMT)',
    'analytical': 'Musicoterapia Analítica',
    'creative': 'Processos Criativos em Musicoterapia',
    'gim': 'Imagery Guiada e Música (GIM)',
  };
  return translations[value] || value;
};

export const translateInterventionFrequency = (value: string): string => {
  const translations: Record<string, string> = {
    'twice_week': '2 vezes por semana',
    'weekly': 'Semanal',
    'biweekly': 'Quinzenal',
    'monthly': 'Mensal',
  };
  return translations[value] || value;
};

export const translateSessionDuration = (value: string): string => {
  const translations: Record<string, string> = {
    '30min': '30 minutos',
    '45min': '45 minutos',
    '60min': '60 minutos',
    '90min': '90 minutos',
  };
  return translations[value] || value;
};

export const translateTreatmentModel = (value: string): string => {
  const translations: Record<string, string> = {
    'individual': 'Terapia Individual',
    'group': 'Terapia em Grupo',
    'family': 'Terapia Familiar',
    'mixed': 'Modelo Misto',
  };
  return translations[value] || value;
};

export const translateMusicalMethods = (value: string): string => {
  const translations: Record<string, string> = {
    'improvisation': 'Improvisação Clínica',
    'receptive': 'Escuta Musical Terapêutica',
    'recreation': 'Re-criação Musical',
    'composition': 'Composição Terapêutica',
    'combined': 'Métodos Combinados',
  };
  return translations[value] || value;
};

export const translateTherapeuticFocus = (value: string): string => {
  const translations: Record<string, string> = {
    'emotional': 'Regulação Emocional',
    'cognitive': 'Desenvolvimento Cognitivo',
    'motor': 'Habilidades Motoras',
    'social': 'Interação Social',
    'communication': 'Comunicação',
    'multiple': 'Múltiplos Focos',
  };
  return translations[value] || value;
};

export const translateExpectedOutcomes = (value: string): string => {
  const translations: Record<string, string> = {
    'emotional_regulation': 'Melhora na Regulação Emocional',
    'skill_development': 'Desenvolvimento de Habilidades',
    'social_improvement': 'Progresso na Interação Social',
    'functional_gains': 'Ganhos Funcionais',
    'quality_life': 'Aumento na Qualidade de Vida',
  };
  return translations[value] || value;
};

export const translateInterventionStrategies = (value: string): string => {
  const translations: Record<string, string> = {
    'active_music': 'Musicoterapia Ativa',
    'receptive_music': 'Musicoterapia Receptiva',
    'combined_approach': 'Abordagem Combinada',
    'iso_principle': 'Princípio ISO',
    'entrainment': 'Entrainment',
  };
  return translations[value] || value;
};

export const translateMusicalResources = (value: string): string => {
  const translations: Record<string, string> = {
    'percussion': 'Instrumentos de Percussão',
    'melodic': 'Instrumentos Melódicos',
    'voice': 'Recursos Vocais',
    'technology': 'Tecnologia Musical',
    'mixed_resources': 'Recursos Mistos',
  };
  return translations[value] || value;
};
