// Curated job sources for music therapists across Brazil.
// Includes national job boards, music-therapy / autism-specific portals,
// TEA clinic social media searches, and per-state job searches for all 27 UFs.

export type VagaSource = {
  name: string;
  description: string;
  url: string;
};

export type VagaCategory = {
  id: string;
  title: string;
  emoji: string;
  description: string;
  sources: VagaSource[];
};

const q = (s: string) => encodeURIComponent(s);

// ---------------------------------------------------------------------------
// National job boards (filtered for "musicoterapeuta")
// ---------------------------------------------------------------------------
const nationalBoards: VagaSource[] = [
  {
    name: "LinkedIn Vagas",
    description: "Maior rede profissional — vagas de musicoterapia em todo o Brasil",
    url: `https://www.linkedin.com/jobs/search/?keywords=${q("musicoterapeuta")}&location=Brasil`,
  },
  {
    name: "Indeed Brasil",
    description: "Agregador com milhares de vagas atualizadas diariamente",
    url: `https://br.indeed.com/jobs?q=${q("musicoterapeuta")}&l=Brasil`,
  },
  {
    name: "Catho",
    description: "Portal de empregos tradicional com filtros por área e salário",
    url: `https://www.catho.com.br/vagas/?q=${q("musicoterapeuta")}`,
  },
  {
    name: "Vagas.com",
    description: "Um dos maiores portais de vagas do país",
    url: `https://www.vagas.com.br/vagas-de-${q("musicoterapeuta")}`,
  },
  {
    name: "InfoJobs",
    description: "Vagas CLT, PJ e estágio em saúde e educação",
    url: `https://www.infojobs.com.br/vagas-de-emprego-${q("musicoterapeuta")}.aspx`,
  },
  {
    name: "Glassdoor",
    description: "Vagas com avaliações de empresas e faixas salariais",
    url: `https://www.glassdoor.com.br/Vaga/brasil-musicoterapeuta-vagas-SRCH_IL.0,6_IN36_KO7,22.htm`,
  },
  {
    name: "Gupy",
    description: "Plataforma de recrutamento usada por grandes clínicas e redes",
    url: `https://portal.gupy.io/job-search/term=${q("musicoterapeuta")}`,
  },
  {
    name: "Trampos.co",
    description: "Vagas criativas, projetos e oportunidades freelance",
    url: `https://trampos.co/oportunidades/?q=${q("musicoterapeuta")}`,
  },
  {
    name: "SINE / Empregos Públicos",
    description: "Vagas e concursos do Sistema Nacional de Emprego",
    url: `https://www.google.com/search?q=${q("concurso musicoterapeuta edital 2025")}`,
  },
  {
    name: "Empregos.com.br",
    description: "Portal tradicional com vagas em saúde, educação e terapias",
    url: `https://www.empregos.com.br/vagas/${q("musicoterapeuta")}`,
  },
  {
    name: "Jooble",
    description: "Buscador que agrega vagas de centenas de sites num só lugar",
    url: `https://br.jooble.org/empregos-${q("musicoterapeuta")}`,
  },
  {
    name: "SimplyHired Brasil",
    description: "Agregador internacional com vagas de terapias no Brasil",
    url: `https://www.simplyhired.com.br/search?q=${q("musicoterapeuta")}`,
  },
  {
    name: "99empregos / Trabalha Brasil",
    description: "Vagas regionais e de pequenas clínicas em todo o país",
    url: `https://www.trabalhabrasil.com.br/vagas-empregos/${q("musicoterapeuta")}`,
  },
  {
    name: "Concursos Públicos (PCI / JC)",
    description: "Editais de prefeituras, APAEs e secretarias de saúde/educação",
    url: `https://www.pciconcursos.com.br/busca/?q=${q("musicoterapeuta")}`,
  },
];

// ---------------------------------------------------------------------------
// Music therapy & autism-specialized sources
// ---------------------------------------------------------------------------
const specializedSources: VagaSource[] = [
  {
    name: "UBAM — União Brasileira das Associações de Musicoterapia",
    description: "Entidade nacional; divulga oportunidades e eventos da categoria",
    url: "https://ubammusicoterapia.com.br/",
  },
  {
    name: "Grupos de Musicoterapia no Facebook",
    description: "Comunidades profissionais que compartilham vagas e substituições",
    url: `https://www.facebook.com/search/groups/?q=${q("musicoterapia vagas")}`,
  },
  {
    name: "Genial Care",
    description: "Rede de terapias para TEA — contrata terapeutas em vários estados",
    url: "https://genialcare.com.br/carreiras/",
  },
  {
    name: "Conexão TEA",
    description: "Clínicas e atendimento ABA/multidisciplinar para autismo",
    url: `https://www.google.com/search?q=${q("Conexão TEA vagas musicoterapeuta")}`,
  },
  {
    name: "Instituto Inspirar / NeuroSaber",
    description: "Instituições de referência em desenvolvimento infantil e TEA",
    url: `https://www.google.com/search?q=${q("vagas musicoterapeuta clínica TEA neurodesenvolvimento")}`,
  },
  {
    name: "Busca: Clínicas multidisciplinares TEA contratando",
    description: "Pesquisa ampla por clínicas de autismo com vagas abertas",
    url: `https://www.google.com/search?q=${q("clínica TEA contratando musicoterapeuta vaga")}`,
  },
];

// ---------------------------------------------------------------------------
// Social media (Instagram / TEA clinics) searches
// ---------------------------------------------------------------------------
const socialSources: VagaSource[] = [
  {
    name: "Instagram #vagasmusicoterapia",
    description: "Posts recentes de vagas divulgadas por clínicas e profissionais",
    url: "https://www.instagram.com/explore/tags/vagasmusicoterapia/",
  },
  {
    name: "Instagram #musicoterapiatea",
    description: "Clínicas de TEA que divulgam contratações e parcerias",
    url: "https://www.instagram.com/explore/tags/musicoterapiatea/",
  },
  {
    name: "Instagram #clinicatea",
    description: "Clínicas de autismo — muitas anunciam vagas nos stories/posts",
    url: "https://www.instagram.com/explore/tags/clinicatea/",
  },
  {
    name: "Instagram #vagasterapeuta",
    description: "Oportunidades gerais para terapeutas, incluindo musicoterapia",
    url: "https://www.instagram.com/explore/tags/vagasterapeuta/",
  },
  {
    name: "Instagram #autismobrasil",
    description: "Rede de clínicas e institutos de TEA em todo o país",
    url: "https://www.instagram.com/explore/tags/autismobrasil/",
  },
  {
    name: "Facebook — Vagas para Terapeutas TEA",
    description: "Grupos que reúnem vagas de clínicas de autismo",
    url: `https://www.facebook.com/search/groups/?q=${q("vagas terapeuta autismo TEA")}`,
  },
];

// ---------------------------------------------------------------------------
// Per-state searches (all 27 UFs) grouped by region
// ---------------------------------------------------------------------------
type StateDef = { uf: string; name: string };

const regions: { region: string; states: StateDef[] }[] = [
  {
    region: "Norte",
    states: [
      { uf: "AC", name: "Acre" },
      { uf: "AP", name: "Amapá" },
      { uf: "AM", name: "Amazonas" },
      { uf: "PA", name: "Pará" },
      { uf: "RO", name: "Rondônia" },
      { uf: "RR", name: "Roraima" },
      { uf: "TO", name: "Tocantins" },
    ],
  },
  {
    region: "Nordeste",
    states: [
      { uf: "AL", name: "Alagoas" },
      { uf: "BA", name: "Bahia" },
      { uf: "CE", name: "Ceará" },
      { uf: "MA", name: "Maranhão" },
      { uf: "PB", name: "Paraíba" },
      { uf: "PE", name: "Pernambuco" },
      { uf: "PI", name: "Piauí" },
      { uf: "RN", name: "Rio Grande do Norte" },
      { uf: "SE", name: "Sergipe" },
    ],
  },
  {
    region: "Centro-Oeste",
    states: [
      { uf: "DF", name: "Distrito Federal" },
      { uf: "GO", name: "Goiás" },
      { uf: "MT", name: "Mato Grosso" },
      { uf: "MS", name: "Mato Grosso do Sul" },
    ],
  },
  {
    region: "Sudeste",
    states: [
      { uf: "ES", name: "Espírito Santo" },
      { uf: "MG", name: "Minas Gerais" },
      { uf: "RJ", name: "Rio de Janeiro" },
      { uf: "SP", name: "São Paulo" },
    ],
  },
  {
    region: "Sul",
    states: [
      { uf: "PR", name: "Paraná" },
      { uf: "RS", name: "Rio Grande do Sul" },
      { uf: "SC", name: "Santa Catarina" },
    ],
  },
];

export type StateSource = {
  uf: string;
  name: string;
  linkedin: string;
  indeed: string;
  instagram: string;
};

export const stateSourcesByRegion: { region: string; states: StateSource[] }[] =
  regions.map(({ region, states }) => ({
    region,
    states: states.map(({ uf, name }) => ({
      uf,
      name,
      linkedin: `https://www.linkedin.com/jobs/search/?keywords=${q(
        "musicoterapeuta"
      )}&location=${q(`${name}, Brasil`)}`,
      indeed: `https://br.indeed.com/jobs?q=${q("musicoterapeuta")}&l=${q(name)}`,
      instagram: `https://www.google.com/search?q=${q(
        `clínica TEA ${name} musicoterapeuta vaga instagram`
      )}`,
    })),
  }));

export const vagaCategories: VagaCategory[] = [
  {
    id: "national",
    title: "Portais Nacionais",
    emoji: "🌐",
    description: "Grandes plataformas de emprego com filtro para musicoterapia",
    sources: nationalBoards,
  },
  {
    id: "specialized",
    title: "Musicoterapia & TEA",
    emoji: "🎵",
    description: "Entidades, redes e clínicas especializadas em autismo",
    sources: specializedSources,
  },
  {
    id: "social",
    title: "Redes Sociais",
    emoji: "📱",
    description: "Vagas divulgadas por clínicas de TEA no Instagram e Facebook",
    sources: socialSources,
  },
];
