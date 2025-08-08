// Generator: Literature Review in classic DOC via RTF (compatible with Word 97–2003)

function formatDate(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function toRtfUnicode(text: string): string {
  // Escape special chars and convert non-ASCII to \uN?
  const esc = (s: string) => s.replace(/[\\{}]/g, (m) => ({'\\': '\\\\', '{': '\\{', '}': '\\}'}[m]!));
  let out = '';
  for (const ch of esc(text)) {
    const code = ch.charCodeAt(0);
    if (code > 126) {
      const signed = code > 32767 ? code - 65536 : code; // RTF expects signed 16-bit
      out += `\\u${signed}?`;
    } else {
      out += ch;
    }
  }
  return out;
}

function p(text: string, opts?: { align?: 'l'|'c'|'r'; bold?: boolean; italics?: boolean; size?: number; spaceAfter?: number; bullet?: boolean; }): string {
  const { align = 'l', bold = false, italics = false, size = 22, spaceAfter = 160, bullet = false } = opts || {};
  const a = align === 'c' ? '\\qc' : align === 'r' ? '\\qr' : '';
  const b = bold ? '\\b' : '';
  const i = italics ? '\\i' : '';
  const fs = `\\fs${size}`;
  const sa = `\\sa${spaceAfter}`;
  const content = toRtfUnicode(text);
  if (bullet) {
    // Simple bullet using Unicode middle dot • (or fallback)
    return `\\pard${a}${sa} ${fs} ${b}${i}\\li720\\fi-360 \\tx720 ${toRtfUnicode('• ')}${content}\\par\n`;
  }
  return `\\pard${a}${sa} ${fs} ${b}${i} ${content}\\par\n`;
}

function h1(text: string): string {
  return p(text, { bold: true, size: 28, spaceAfter: 120 });
}

function section(title: string, paragraphs: string[]): string {
  return [h1(title), ...paragraphs.map((t) => p(t))].join('');
}

// Helpers to embed PNG images in RTF (\pict\pngblip)
function arrayBufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    const h = bytes[i].toString(16).padStart(2, '0');
    hex += h;
  }
  return hex;
}

async function fetchImageArrayBuffer(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Falha ao baixar imagem: ${url}`);
  return await res.arrayBuffer();
}

async function getImageDimensionsFromBlob(blob: Blob): Promise<{ width: number; height: number; }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      URL.revokeObjectURL(url);
      resolve({ width: w, height: h });
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(new Error('Não foi possível obter dimensões da imagem'));
    };
    img.src = url;
  });
}

async function buildRtfImageFigure(url: string, caption: string): Promise<string> {
  try {
    const ab = await fetchImageArrayBuffer(url);
    const blob = new Blob([ab]);
    const { width, height } = await getImageDimensionsFromBlob(blob);

    // RTF uses twips (1/1440 inch). Assume 96 DPI: 1 px ≈ 15 twips
    const twipsPerPx = 15;
    const maxGoalWidth = 9000; // ~6.25" to fit in typical margins

    let goalW = Math.round(width * twipsPerPx);
    let goalH = Math.round(height * twipsPerPx);

    if (goalW > maxGoalWidth) {
      const scale = maxGoalWidth / goalW;
      goalW = Math.round(goalW * scale);
      goalH = Math.round(goalH * scale);
    }

    const hex = arrayBufferToHex(ab);
    const pict = `\\pard\\qc\\sa160 \\fs22 {\\pict\\pngblip\\picw${width}\\pich${height}\\picwgoal${goalW}\\pichgoal${goalH}\n${hex}\n}\\par\n`;
    const cap = p(`Figura: ${caption}`, { align: 'c', italics: true, size: 20, spaceAfter: 240 });
    return pict + cap;
  } catch (e) {
    // Fallback: textual reference to the image
    return p(`Figura (não carregada): ${caption} — ${url}`, { align: 'c', italics: true, size: 20, spaceAfter: 200 });
  }
}

export async function generateMuseTeraLiteratureReviewDOC(): Promise<boolean> {
  try {
    const today = new Date();
    const fileName = `Revisao_Literatura_Escala_MuseTera_${formatDate(today)}.doc`;

    const parts: string[] = [];

    // Title and author
    parts.push(p('Escala MuseTera: Revisão Integrativa da Literatura sobre Avaliação em Musicoterapia e Propriedades Psicométricas de Instrumentos Afins', { align: 'c', bold: true, size: 36, spaceAfter: 200 }));
    parts.push(p('MuseTera Scale: Integrative Literature Review on Music Therapy Assessment and Psychometric Properties of Related Instruments', { align: 'c', italics: true, size: 24, spaceAfter: 200 }));
    parts.push(p('Autor: José Carlos Batista da Silva, Dr.', { align: 'c', size: 22, spaceAfter: 40 }));
    parts.push(p('Afiliação: Plataforma MuseTera para Musicoterapeutas — Brasil', { align: 'c', size: 22, spaceAfter: 40 }));
    parts.push(p('Contato: josecarlos@musetera.com.br', { align: 'c', size: 22, spaceAfter: 40 }));
    parts.push(p(`Status: Pré-submissão • Tipo: Revisão de Literatura (Integrativa) • Data: ${formatDate(today)}`, { align: 'c', size: 20, spaceAfter: 40 }));
    parts.push(p('Declaração: Este artigo não apresenta dados de participantes humanos. Trata-se de uma revisão da literatura com implicações para validação futura da escala.', { align: 'c', size: 20, spaceAfter: 200 }));

    // Abstracts
    parts.push(h1('RESUMO'));
    parts.push(p('Objetivo: Realizar uma revisão integrativa da literatura sobre instrumentos de avaliação em musicoterapia e suas propriedades psicométricas, identificando lacunas e melhores práticas para fundamentar a Escala MuseTera (0–5) e seu plano de validação.'));
    parts.push(p('Métodos: Revisão integrativa guiada por princípios PRISMA e recomendações COSMIN. Bases: PubMed/MEDLINE, Scopus, Web of Science e PsycINFO. Incluídos estudos com evidências psicométricas de instrumentos relevantes à prática musicoterapêutica.'));
    parts.push(p('Resultados: A literatura reporta avanços (p.ex., MATADOC em desordens de consciência; MiDAS em demência; uso de Goal Attainment Scaling na reabilitação), mas persistem heterogeneidade conceitual e lacunas em invariância e responsividade clínica.'));
    parts.push(p('Conclusões: A MuseTera se posiciona como instrumento multidimensional (0–5) com critérios explícitos de responsividade clínica. Propõe-se plano de validação alinhado a COSMIN/DeVellis sem dados humanos nesta fase.'));
    parts.push(p('Palavras-chave: musicoterapia; avaliação; psicometria; COSMIN; PRISMA; MuseTera.', { italics: true }));

    parts.push(h1('ABSTRACT'));
    parts.push(p('Objective: To conduct an integrative review of music therapy assessment instruments and their psychometric properties, identifying gaps and best practices to inform the MuseTera Scale (0–5) and its future validation plan.'));
    parts.push(p('Methods: Integrative review guided by PRISMA principles and COSMIN recommendations. Databases: PubMed/MEDLINE, Scopus, Web of Science, and PsycINFO. Studies with psychometric evidence relevant to music therapy practice were included.'));
    parts.push(p('Results: The literature highlights advances (e.g., MATADOC; MiDAS; Goal Attainment Scaling), yet shows heterogeneity of constructs and gaps in measurement invariance and clinical responsiveness.'));
    parts.push(p('Conclusions: MuseTera is positioned as an integrative, multidimensional instrument (0–5) with explicit clinical responsiveness criteria. A COSMIN/DeVellis-aligned validation plan is outlined without human data at this stage.'));
    parts.push(p('Keywords: music therapy; assessment; psychometrics; COSMIN; PRISMA; MuseTera.', { italics: true }));

    // Metodologia
    parts.push(section('Metodologia da Revisão', [
      'Desenho: Revisão integrativa (Whittemore & Knafl, 2005), reportada conforme princípios PRISMA 2020 (Page et al., 2021) quando aplicável.',
      'Bases: PubMed/MEDLINE, Scopus, Web of Science e PsycINFO; termos: “music therapy” AND (assessment OR measurement OR instrument OR scale) AND (validity OR reliability OR responsiveness OR psychometric).',
      'Critérios de inclusão: instrumentos de avaliação em musicoterapia ou medidas correlatas utilizadas em contexto musicoterapêutico com evidências psicométricas.',
      'Critérios de exclusão: opiniões sem base empírica; instrumentos sem descrição suficiente; relatos sem componente de avaliação.',
      'Seleção: triagem por título/resumo e leitura do texto completo; extração padronizada de construtos, contexto, propriedades psicométricas e limitações.',
      'Síntese: narrativa; avaliação das evidências orientada por COSMIN (Prinsen et al., 2018; Mokkink et al., 2010) e clássicos da psicometria (DeVellis, 2017; Nunnally & Bernstein, 1994).',
    ]));

    // Resultados
    parts.push(section('Resultados da Revisão', [
      'Panorama: instrumentos específicos e contextuais — MATADOC (consciência em desordens de consciência), MiDAS (demência), e GAS (metas individualizadas) usados em reabilitação e em contextos de musicoterapia.',
      'Propriedades: validade de conteúdo frequentemente por especialistas (CVR, Lawshe, 1975); estrutura interna com análises diversas e pouca padronização; confiabilidade (α/ω, teste–reteste) variável; responsividade e critérios clínicos ainda incipientes.',
      'Implicações à MuseTera: abordagem multidimensional integrada (musical, psicossocial, cognitivo, sensório‑motor, comunicativo‑interativo) com pontuação 0–5 e descritores observáveis, orientada por COSMIN/DeVellis para validação futura.',
    ]));

    // Discussão
    parts.push(section('Discussão', [
      'A heterogeneidade de construtos e métodos limita comparações entre instrumentos, mas diretrizes como COSMIN oferecem caminho para padronização.',
      'A MuseTera explicita critérios de pontuação, domínios coerentes com a prática e plano de validação robusto e transparente.',
      'Limitações: síntese narrativa suscetível a vieses de seleção e publicação; ausência de metanálise devido à heterogeneidade de desfechos e métricas.',
    ]));

    // Plano de Validação
    parts.push(h1('Plano de Validação Psicométrica Proposto'));
    const bullets = [
      'Validade de conteúdo: painel de especialistas; cálculo de CVR (Lawshe, 1975) e I-CVI/S-CVI com critérios de aceitação.',
      'Estrutura interna: AFE/CFA e/ou modelos de Rasch; avaliação de unidimensionalidade/local dependence quando aplicável.',
      'Consistência interna: ω de McDonald (preferencial) e α de Cronbach com faixas alvo (≥0,70 para uso exploratório);',
      'Confiabilidade teste–reteste: ICC (2,1) ou (3,1) com intervalo de confiança; cálculo de SEM e MDC.',
      'Validade convergente/discriminante: correlações com instrumentos relacionados e divergentes.',
      'Invariância de medida: entre grupos (sexo, idade, diagnóstico) por múltiplas‑amostras quando aplicável.',
      'Responsividade: hipóteses a priori e medidas de efeito (SRM, ES) com critérios clínicos;',
      'Adaptação transcultural: diretrizes de Beaton com equivalência semântica e operacional.',
    ];
    bullets.forEach((b) => parts.push(p(b, { bullet: true, size: 22, spaceAfter: 80 })));

    // Ilustrações (imagens)
    parts.push(h1('Ilustrações da Escala MuseTera'));
    const galleryItems = [
      { src: '/lovable-uploads/460b68cd-687b-4148-a562-03baaa061f0e.png', title: 'Visão Geral da Escala MuseTera' },
      { src: '/lovable-uploads/00843ad9-07f6-49b9-a0fa-0ebd2d697fc9.png', title: 'Sistema de Pontuação 0–5' },
      { src: '/lovable-uploads/978b95d8-86ef-426b-bb26-4ab75eb24587.png', title: 'Domínio Musical' },
      { src: '/lovable-uploads/8abd4927-9dea-44ba-a4f1-f63e79c8d171.png', title: 'Domínio Psicossocial' },
      { src: '/lovable-uploads/bd8289ea-d474-46f4-87d3-48ad1567394f.png', title: 'Domínio Cognitivo' },
      { src: '/lovable-uploads/6f316512-b637-496d-b3fe-472381b4c647.png', title: 'Domínio Sensório‑Motor' },
      { src: '/lovable-uploads/2980fc3c-0aac-41bd-bc7a-2c5aca34aca1.png', title: 'Domínio Comunicativo‑Interativo' },
    ];
    for (const item of galleryItems) {
      parts.push(await buildRtfImageFigure(item.src, item.title));
    }

    // Apêndice: critérios de pontuação
    parts.push(h1('Apêndice: Critérios de Pontuação 0–5 (exemplo)'));
    const levels = [
      '0 – Ausência do comportamento alvo; sem evidências observáveis.',
      '1 – Indícios mínimos, inconsistentes; requer suporte intenso.',
      '2 – Presença ocasional; requer suporte moderado; melhora incipiente.',
      '3 – Presença frequente com apoio; desempenho funcional emergente.',
      '4 – Presença consistente com pouco apoio; desempenho funcional.',
      '5 – Presença robusta e sustentada; generalização em contextos diversos.',
    ];
    levels.forEach((lv) => parts.push(p(lv, { bullet: true, size: 22, spaceAfter: 60 })));

    // Conclusão
    parts.push(section('Conclusão', [
      'A literatura sustenta a relevância de instrumentos específicos em musicoterapia e a necessidade de padronização psicométrica. A Escala MuseTera apresenta racional teórico‑clínico promissor. Este artigo estabelece base conceitual e metodológica para validação futura, sem dados humanos nesta etapa.',
    ]));

    // Agradecimentos
    parts.push(section('Agradecimentos', [
      'Agradecemos a profissionais e pesquisadores que contribuíram com discussões metodológicas e conceituais sobre a avaliação em musicoterapia e psicometria aplicada.',
    ]));

    // Referências (reais)
    parts.push(h1('Referências'));
    const refs = [
      'Page, M. J., McKenzie, J. E., Bossuyt, P. M., Boutron, I., Hoffmann, T. C., Mulrow, C. D., ... Moher, D. (2021). The PRISMA 2020 statement: an updated guideline for reporting systematic reviews. BMJ, 372, n71. https://doi.org/10.1136/bmj.n71',
      'Whittemore, R., & Knafl, K. (2005). The integrative review: updated methodology. Journal of Advanced Nursing, 52(5), 546–553. https://doi.org/10.1111/j.1365-2648.2005.03621.x',
      'Prinsen, C. A. C., Mokkink, L. B., Bouter, L. M., Alonso, J., Patrick, D. L., de Vet, H. C. W., & Terwee, C. B. (2018). COSMIN guideline for systematic reviews of PROMs. Quality of Life Research, 27(5), 1147–1157. https://doi.org/10.1007/s11136-018-1798-3',
      'Mokkink, L. B., Terwee, C. B., Patrick, D. L., Alonso, J., Stratford, P. W., Knol, D. L., ... de Vet, H. C. W. (2010). The COSMIN checklist for assessing the methodological quality of studies on measurement properties. Quality of Life Research, 19(4), 539–549. https://doi.org/10.1007/s11136-010-9606-8',
      'DeVellis, R. F. (2017). Scale Development: Theory and Applications (4th ed.). SAGE Publications.',
      'Nunnally, J. C., & Bernstein, I. H. (1994). Psychometric Theory (3rd ed.). McGraw-Hill.',
      'Lawshe, C. H. (1975). A quantitative approach to content validity. Personnel Psychology, 28(4), 563–575. https://doi.org/10.1111/j.1744-6570.1975.tb01393.x',
      'Magee, W. L., et al. (2015). Music Therapy Assessment Tool for Awareness in Disorders of Consciousness (MATADOC): Reliability and validity. Journal of Music Therapy, 52(1), 1–26. https://doi.org/10.1093/jmt/thv017',
      'McDermott, O., Orrell, M., & Ridder, H. M. (2014). The development of Music in Dementia Assessment Scales (MiDAS). Nordic Journal of Music Therapy, 23(2), 134–156. https://doi.org/10.1080/08098131.2013.790918',
      'Kiresuk, T. J., & Sherman, R. E. (1968). Goal Attainment Scaling: A general method for evaluating comprehensive community mental health programs. Community Mental Health Journal, 4(6), 443–453. https://doi.org/10.1007/BF01530764',
      'Streiner, D. L., Norman, G. R., & Cairney, J. (2015). Health Measurement Scales: A practical guide to their development and use (5th ed.). Oxford University Press.',
      'Terwee, C. B., Bot, S. D., de Boer, M. R., et al. (2007). Quality criteria were proposed for measurement properties of health status questionnaires. Journal of Clinical Epidemiology, 60(1), 34–42. https://doi.org/10.1016/j.jclinepi.2006.03.012',
      'Portney, L. G. (2020). Foundations of Clinical Research: Applications to Evidence-Based Practice (4th ed.). F.A. Davis Company.',
    ];
    refs.forEach((r) => parts.push(p(r, { size: 20, spaceAfter: 80 })));

    const rtf = [
      '{\\rtf1\\ansi\\deff0\\uc1\n',
      '{\\fonttbl{\\f0 Arial;}{\\f1 Times New Roman;}}\n',
      '\n',
      parts.join(''),
      '}\n',
    ].join('');

    const blob = new Blob([rtf], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    return true;
  } catch (e) {
    console.error('Erro ao gerar arquivo .doc (RTF):', e);
    return false;
  }
}
