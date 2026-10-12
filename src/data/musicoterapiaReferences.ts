/**
 * Catálogo editorial de referências relevantes à musicoterapia.
 * Fontes: editoras, catálogos de bibliotecas e Oxford Academic.
 * A seleção pelo profissional não constitui prova da eficácia de uma intervenção,
 * nem comprova consulta efetiva à obra: é responsabilidade clínica revisar a citação.
 */
export interface MusicoterapiaReference {
  id: string;
  authors: string;
  shortName: string;
  year: number;
  focus: string;
  relevance: string;
  bibliography: string;
  sourceUrl: string;
  relatedApproachIds: string[];
}

export const musicoterapiaReferences: MusicoterapiaReference[] = [
  {
    id: 'bruscia_2014',
    authors: 'Kenneth E. Bruscia',
    shortName: 'Fundamentos e definição da musicoterapia',
    year: 2014,
    focus: 'Fundamentação da musicoterapia, processos e relações terapêuticas.',
    relevance: 'Referência conceitual ampla, aplicável à descrição profissional das experiências musicoterapêuticas.',
    bibliography: 'BRUSCIA, Kenneth E. Defining Music Therapy. 3. ed. Barcelona Publishers, 2014.',
    sourceUrl: 'https://barcelonapublishers.com/defining-music-therapy-3rd-edition',
    relatedApproachIds: ['ativa', 'receptiva', 'improvisacao', 'recreativa', 'analitica', 'neurologica_nmt', 'comportamental', 'humanista', 'nordoff_robbins', 'bonny_gim']
  },
  {
    id: 'benenzon_1985',
    authors: 'Rolando O. Benenzon',
    shortName: 'Identidade sonora (ISO) e comunicação não verbal',
    year: 1985,
    focus: 'Identidade sonora, vínculo e comunicação sonoro-musical.',
    relevance: 'Base histórica para reflexão sobre identidade sonora e expressão não verbal no contexto terapêutico.',
    bibliography: 'BENENZON, Rolando O. Manual de musicoterapia. Barcelona: Paidós, 1985.',
    sourceUrl: 'https://books.google.com/books/about/Manual_de_musicoterapia.html?id=N8nY0AEACAAJ',
    relatedApproachIds: ['ativa', 'improvisacao', 'humanista']
  },
  {
    id: 'nordoff_robbins_2007',
    authors: 'Paul Nordoff e Clive Robbins',
    shortName: 'Musicoterapia criativa e improvisação clínica',
    year: 2007,
    focus: 'Improvisação relacional, comunicação musical e desenvolvimento do vínculo.',
    relevance: 'Referência clássica para o trabalho clínico improvisacional e possibilidades de participação musical.',
    bibliography: 'NORDOFF, Paul; ROBBINS, Clive. Creative Music Therapy: A Guide to Fostering Clinical Musicianship. 2. ed. Barcelona Publishers, 2007.',
    sourceUrl: 'https://barcelonapublishers.com/creative-music-therapy-a-guide-fostering-clinical-musicianship-second-edition-4-cds',
    relatedApproachIds: ['nordoff_robbins', 'improvisacao', 'ativa']
  },
  {
    id: 'thaut_hoemberg_2025',
    authors: 'Michael H. Thaut e Volker Hömberg (org.)',
    shortName: 'Musicoterapia neurológica (NMT)',
    year: 2025,
    focus: 'Técnicas estruturadas de musicoterapia neurológica e reabilitação funcional.',
    relevance: 'Referência para contextualizar métodos de intervenção musical em processos neurofuncionais, quando apropriados.',
    bibliography: 'THAUT, Michael H.; HÖMBERG, Volker (ed.). Handbook of Neurologic Music Therapy. 2. ed. Oxford: Oxford University Press, 2025. DOI: 10.1093/oso/9780192844491.001.0001.',
    sourceUrl: 'https://academic.oup.com/book/59860',
    relatedApproachIds: ['neurologica_nmt']
  },
  {
    id: 'wigram_2004',
    authors: 'Tony Wigram',
    shortName: 'Técnicas de improvisação musicoterapêutica',
    year: 2004,
    focus: 'Técnicas musicais, interação e documentação de processos de improvisação.',
    relevance: 'Base metodológica para intervenção e observação de comportamentos no fazer musical improvisado.',
    bibliography: 'WIGRAM, Tony. Improvisation: Methods and Techniques for Music Therapy Clinicians, Educators, and Students. London: Jessica Kingsley Publishers, 2004.',
    sourceUrl: 'https://vbn.aau.dk/en/publications/improvisation-methods-and-techniques-for-music-therapy-clinicians/',
    relatedApproachIds: ['improvisacao', 'ativa', 'nordoff_robbins']
  },
  {
    id: 'bonny_2002',
    authors: 'Helen L. Bonny',
    shortName: 'Imagens guiadas e música (GIM)',
    year: 2002,
    focus: 'Música receptiva, imaginação guiada e experiência subjetiva.',
    relevance: 'Referência histórica e teórica para a abordagem Bonny de imagens guiadas e música.',
    bibliography: 'BONNY, Helen L. Music and Consciousness: The Evolution of Guided Imagery and Music. Ed. Lisa Summer. Barcelona Publishers, 2002.',
    sourceUrl: 'https://barcelonapublishers.com/music-consciousness-the-evolution-guided-imagery-music',
    relatedApproachIds: ['bonny_gim', 'receptiva']
  }
];

/** Descartar referências não reconhecidas e preservar a ordem do catálogo. */
export function getSelectedMusicoterapiaReferences(value: unknown): MusicoterapiaReference[] {
  if (!Array.isArray(value)) return [];
  const selected = new Set(value.filter((id): id is string => typeof id === 'string'));
  return musicoterapiaReferences.filter((item) => selected.has(item.id));
}
