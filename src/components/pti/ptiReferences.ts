/** Obras bibliográficas da musicoterapia para seleção explícita do profissional.
 * Seleção não implica que a fonte sustente automaticamente cada conduta clínica.
 * Dados editoriais conferidos em catálogos bibliográficos e editoras.
 */
export interface PtiBibliographicReference {
  id: string;
  author: string;
  focus: string;
  citation: string;
}
export const PTI_MUSICOTHERAPY_REFERENCES: PtiBibliographicReference[] = [
  {
    id: "bruscia-2014",
    author: "Kenneth E. Bruscia",
    focus: "Conceitos e fundamentos da musicoterapia",
    citation: "BRUSCIA, Kenneth E. Defining Music Therapy. 3. ed. Barcelona Publishers, 2014.",
  },
  {
    id: "benenzon-1981",
    author: "Rolando O. Benenzon",
    focus: "Fundamentos e modelos de musicoterapia",
    citation: "BENENZON, Rolando O. Manual de musicoterapia. Barcelona: Paidós Ibérica, 1981.",
  },
  {
    id: "nordoff-robbins-2007",
    author: "Paul Nordoff e Clive Robbins",
    focus: "Musicoterapia criativa e improvisação clínica",
    citation: "NORDOFF, Paul; ROBBINS, Clive. Creative Music Therapy: A Guide to Fostering Clinical Musicianship. 2. ed., rev. e ampl. Barcelona Publishers, 2007.",
  },
  {
    id: "wigram-pedersen-bonde-2002",
    author: "Tony Wigram, Inge Nygaard Pedersen e Lars Ole Bonde",
    focus: "Teoria, prática clínica e pesquisa",
    citation: "WIGRAM, Tony; PEDERSEN, Inge Nygaard; BONDE, Lars Ole. A Comprehensive Guide to Music Therapy: Theory, Clinical Practice, Research and Training. Jessica Kingsley Publishers, 2002.",
  },
  {
    id: "ruud-2010",
    author: "Even Ruud",
    focus: "Perspectivas humanísticas e socioculturais",
    citation: "RUUD, Even. Music Therapy: A Perspective from the Humanities. Barcelona Publishers, 2010.",
  },
  {
    id: "thaut-hoemberg-2014",
    author: "Michael H. Thaut e Volker Hömberg",
    focus: "Musicoterapia neurológica",
    citation: "THAUT, Michael H.; HÖMBERG, Volker (org.). Handbook of Neurologic Music Therapy. Oxford University Press, 2014.",
  },
];

export function getPtiSelectedReferences(ids: string[] | undefined): string[] {
  const selected = new Set(ids ?? []);
  return PTI_MUSICOTHERAPY_REFERENCES
    .filter((ref) => selected.has(ref.id))
    .map((ref) => ref.citation);
}
