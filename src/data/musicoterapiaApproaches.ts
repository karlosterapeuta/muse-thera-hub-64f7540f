/**
 * Abordagens musicoterapêuticas selecionadas pelo profissional.
 * A seleção registra uma abordagem prevista/adotada, mas não comprova
 * aplicação, habilitação específica nem resultados terapêuticos.
 */
export interface MusicoterapiaApproach {
  id: string;
  title: string;
  description: string;
  goals: string;
  clinicalNote?: string;
}

export const musicoterapiaApproaches: MusicoterapiaApproach[] = [
  {
    id: 'ativa',
    title: 'Musicoterapia ativa',
    description: 'O paciente participa diretamente do fazer musical por meio do canto, da execução de instrumentos, da improvisação ou da criação sonora.',
    goals: 'Busca estimular expressão emocional, comunicação, criatividade, coordenação motora e interação social.'
  },
  {
    id: 'receptiva',
    title: 'Musicoterapia receptiva',
    description: 'Baseia-se na escuta musical mediada ou guiada pelo musicoterapeuta, com repertório e condições adaptados ao paciente.',
    goals: 'Pode favorecer relaxamento, evocação de memórias, regulação emocional e manejo de sinais de ansiedade.',
    clinicalNote: 'A escuta deve respeitar preferências e sensibilidades auditivas.'
  },
  {
    id: 'improvisacao',
    title: 'Musicoterapia de improvisação',
    description: 'O paciente e o musicoterapeuta criam música espontaneamente em experiências sonoras compartilhadas.',
    goals: 'Favorece oportunidades de expressão não verbal, vínculo terapêutico e desenvolvimento emocional.'
  },
  {
    id: 'recreativa',
    title: 'Musicoterapia recreativa',
    description: 'Utiliza atividades musicais prazerosas, como cantar músicas conhecidas, participar de jogos musicais e tocar instrumentos.',
    goals: 'Tem como foco oportunidades de bem-estar, socialização, autoestima e qualidade de vida.',
    clinicalNote: 'A finalidade terapêutica deve ser individualizada e registrada, distinguindo a intervenção de uma atividade apenas recreativa.'
  },
  {
    id: 'analitica',
    title: 'Musicoterapia analítica',
    description: 'É influenciada por referenciais psicodinâmicos e utiliza experiências musicais, inclusive improvisacionais, como meio de exploração subjetiva.',
    goals: 'Busca favorecer a expressão e a elaboração de sentimentos, conflitos internos, relações e aspectos da experiência inconsciente.',
    clinicalNote: 'Empregar técnicas especializadas conforme formação do profissional e indicação clínica.'
  },
  {
    id: 'neurologica_nmt',
    title: 'Musicoterapia neurológica (Neurologic Music Therapy – NMT)',
    description: 'É fundamentada em pesquisas sobre a relação entre música e funcionamento cerebral, com uso de técnicas estruturadas e objetivos funcionais.',
    goals: 'Pode integrar programas de reabilitação da fala, do movimento, da atenção e da memória, conforme a condição clínica e o plano interdisciplinar.',
    clinicalNote: 'Protocolos específicos de NMT exigem capacitação apropriada; não implicam recuperação neurológica garantida.'
  },
  {
    id: 'comportamental',
    title: 'Musicoterapia comportamental',
    description: 'Emprega experiências musicais em intervenções estruturadas com objetivos comportamentais definidos e observáveis.',
    goals: 'Pode apoiar aprendizagem, desenvolvimento de habilidades e mudanças de respostas-alvo em contextos clínicos, educacionais ou de reabilitação.',
    clinicalNote: 'Priorizar objetivos funcionais, consentimento e respeito à autonomia, evitando intervenções aversivas.'
  },
  {
    id: 'humanista',
    title: 'Musicoterapia humanista',
    description: 'É centrada na pessoa e valoriza sua experiência subjetiva, interesses e capacidade de escolha nas relações musicais.',
    goals: 'Favorece autenticidade, expressão pessoal, participação e possibilidades de crescimento por meio da música.'
  },
  {
    id: 'nordoff_robbins',
    title: 'Abordagem Nordoff-Robbins (Musicoterapia Criativa)',
    description: 'É baseada na improvisação clínica e nas possibilidades individuais de participação e resposta musical de cada pessoa.',
    goals: 'Pode favorecer comunicação, relação terapêutica, expressão e participação, inclusive com pessoas com deficiência e transtornos do desenvolvimento.',
    clinicalNote: 'A utilização formal desse modelo deve considerar formação e competências específicas.'
  },
  {
    id: 'bonny_gim',
    title: 'Método Bonny de Imagens Guiadas e Música (GIM – Guided Imagery and Music)',
    description: 'Combina audição de música selecionada, imaginação guiada e elaboração/reflexão sobre a experiência subjetiva.',
    goals: 'Busca aprofundamento emocional, exploração da experiência interna e autoconhecimento.',
    clinicalNote: 'Requer formação específica, avaliação de indicação e cuidados com contraindicações ou necessidades de adaptação.'
  }
];

/** Mantém ordem definida pelo catálogo e descarta valores não reconhecidos. */
export function getSelectedMusicoterapiaApproaches(value: unknown): MusicoterapiaApproach[] {
  if (!Array.isArray(value)) return [];
  const selected = new Set(value.filter((item): item is string => typeof item === 'string'));
  return musicoterapiaApproaches.filter((approach) => selected.has(approach.id));
}
