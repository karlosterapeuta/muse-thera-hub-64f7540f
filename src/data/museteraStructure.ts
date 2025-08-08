export interface MuseteraSubdomain {
  title: string;
  rows: number; // number of parameters/lines for manual scoring
}

export interface MuseteraDomain {
  title: string;
  subdomains: MuseteraSubdomain[];
}

// Official MuseTera structure: 5 domains, 16 subdomains, 128 parameters (8 per subdomain)
export const museteraStructure: MuseteraDomain[] = [
  {
    title: "Domínio Musical",
    subdomains: [
      { title: "Percepção Musical", rows: 8 },
      { title: "Expressão Musical", rows: 8 },
      { title: "Compreensão Musical", rows: 8 },
    ],
  },
  {
    title: "Domínio Psicossocial",
    subdomains: [
      { title: "Interação Social", rows: 8 },
      { title: "Regulação Emocional", rows: 8 },
      { title: "Autoestima e Autoconceito", rows: 8 },
    ],
  },
  {
    title: "Domínio Cognitivo",
    subdomains: [
      { title: "Funções Executivas", rows: 8 },
      { title: "Processamento da Informação", rows: 8 },
      { title: "Aprendizagem Musical", rows: 8 },
    ],
  },
  {
    title: "Domínio Sensório-Motor",
    subdomains: [
      { title: "Coordenação Motora", rows: 8 },
      { title: "Processamento Sensorial", rows: 8 },
      { title: "Desenvolvimento Motor", rows: 8 },
    ],
  },
  {
    title: "Domínio Comunicativo-Interativo",
    subdomains: [
      { title: "Comunicação Verbal", rows: 8 },
      { title: "Comunicação Não-Verbal", rows: 8 },
      { title: "Pragmática Comunicativa", rows: 8 },
      { title: "Interação Terapêutica", rows: 8 },
    ],
  },
];
