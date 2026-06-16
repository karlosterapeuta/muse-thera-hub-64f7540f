
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

function h2(text: string): string {
  return p(text, { bold: true, size: 24, spaceAfter: 100 });
}

function h3(text: string): string {
  return p(text, { bold: true, size: 22, spaceAfter: 80 });
}

function pb(): string {
  return '\\page\n';
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

async function convertBlobToJpegArrayBuffer(pngBlob: Blob): Promise<ArrayBuffer | null> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(pngBlob);
    img.onload = () => {
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        resolve(null);
        return;
      }
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((jpegBlob) => {
        URL.revokeObjectURL(url);
        if (jpegBlob) {
          jpegBlob.arrayBuffer().then((ab) => resolve(ab));
        } else {
          resolve(null);
        }
      }, 'image/jpeg', 0.92);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });
}

async function buildRtfImageFigure(url: string, caption: string): Promise<string> {
  try {
    const absolute = url.startsWith('http') ? url : `${window.location.origin}${url.startsWith('/') ? url : '/' + url}`;
    const res = await fetch(absolute, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`Falha ao baixar imagem: ${absolute}`);
    let blob = await res.blob();

    const { width, height } = await getImageDimensionsFromBlob(blob);

    let buffer: ArrayBuffer;
    let blipKind = '\\pngblip';

    if (blob.type.includes('png')) {
      const jpegAb = await convertBlobToJpegArrayBuffer(blob);
      if (jpegAb) {
        buffer = jpegAb;
        blipKind = '\\jpegblip';
      } else {
        buffer = await blob.arrayBuffer();
      }
    } else if (blob.type.includes('jpeg') || blob.type.includes('jpg')) {
      buffer = await blob.arrayBuffer();
      blipKind = '\\jpegblip';
    } else {
      buffer = await blob.arrayBuffer();
      blipKind = '\\pngblip';
    }

    const twipsPerPx = 15;
    const maxGoalWidth = 9000;
    let goalW = Math.round(width * twipsPerPx);
    let goalH = Math.round(height * twipsPerPx);
    if (goalW > maxGoalWidth) {
      const scale = maxGoalWidth / goalW;
      goalW = Math.round(goalW * scale);
      goalH = Math.round(goalH * scale);
    }

    const hex = arrayBufferToHex(buffer);
    const pict = `\\pard\\qc\\sa160 \\fs22 {\\pict${blipKind}\\picw${width}\\pich${height}\\picwgoal${goalW}\\pichgoal${goalH}\n${hex}\n}\\par\n`;
    const cap = p(`Figura: ${caption}`, { align: 'c', italics: true, size: 20, spaceAfter: 240 });
    return pict + cap;
  } catch (e) {
    return p(`Figura (não carregada): ${caption} — ${url}`, { align: 'c', italics: true, size: 20, spaceAfter: 200 });
  }
}

export async function generateMuseTeraLiteratureReviewDOC(): Promise<boolean> {
  try {
    const today = new Date();
    const fileName = `Escala_Avaliacao_MuseTera_TEA_${formatDate(today)}.doc`;

    const parts: string[] = [];

    // Title and author
    parts.push(p('Escala de Avaliação MuseTera TEA: Revisão Integrativa da Literatura sobre Avaliação em Musicoterapia para Transtorno do Espectro Autista', { align: 'c', bold: true, size: 36, spaceAfter: 200 }));
    parts.push(p('MuseTera TEA Assessment Scale: Integrative Literature Review on Music Therapy Assessment for Autism Spectrum Disorder', { align: 'c', italics: true, size: 24, spaceAfter: 200 }));
    parts.push(p('Autor: José Carlos Batista da Silva, Dr.', { align: 'c', size: 22, spaceAfter: 40 }));
    parts.push(p('Afiliação: Plataforma MuseTera para Musicoterapeutas — Brasil', { align: 'c', size: 22, spaceAfter: 40 }));
    parts.push(p('Contato: josecarlos@musetera.com.br', { align: 'c', size: 22, spaceAfter: 40 }));
    parts.push(p(`Status: Pré-submissão • Tipo: Revisão de Literatura (Integrativa) • Data: ${formatDate(today)}`, { align: 'c', size: 20, spaceAfter: 40 }));
    parts.push(p('Declaração: Este artigo não apresenta dados de participantes humanos. Trata-se de uma revisão da literatura com implicações para validação futura da escala.', { align: 'c', size: 20, spaceAfter: 200 }));

    // Abstracts
    parts.push(h1('RESUMO'));
    parts.push(p('Objetivo: Realizar uma revisão integrativa da literatura sobre instrumentos de avaliação em musicoterapia para Transtorno do Espectro Autista (TEA) e suas propriedades psicométricas, identificando lacunas e melhores práticas para fundamentar a Escala de Avaliação MuseTera TEA (0–5) e seu plano de validação.'));
    parts.push(p('Métodos: Revisão integrativa guiada por princípios PRISMA e recomendações COSMIN. Bases: PubMed/MEDLINE, Scopus, Web of Science e PsycINFO. Incluídos estudos com evidências psicométricas de instrumentos relevantes à musicoterapia para TEA.'));
    parts.push(p('Resultados: A literatura reporta avanços específicos para TEA (p.ex., CARS, ADOS-2, escalas funcionais adaptadas), mas persistem heterogeneidade conceitual e lacunas em invariância e responsividade clínica específica para musicoterapia.'));
    parts.push(p('Conclusões: A Escala MuseTera TEA se posiciona como instrumento multidimensional (0–5) com critérios explícitos de responsividade clínica para população com TEA. Propõe-se plano de validação alinhado a COSMIN/DeVellis sem dados humanos nesta fase.'));
    parts.push(p('Palavras-chave: musicoterapia; TEA; transtorno do espectro autista; avaliação; psicometria; COSMIN; PRISMA; MuseTera.', { italics: true }));

    parts.push(h1('ABSTRACT'));
    parts.push(p('Objective: To conduct an integrative review of music therapy assessment instruments for Autism Spectrum Disorder (ASD) and their psychometric properties, identifying gaps and best practices to inform the MuseTera TEA Assessment Scale (0–5) and its future validation plan.'));
    parts.push(p('Methods: Integrative review guided by PRISMA principles and COSMIN recommendations. Databases: PubMed/MEDLINE, Scopus, Web of Science, and PsycINFO. Studies with psychometric evidence relevant to music therapy practice for ASD were included.'));
    parts.push(p('Results: The literature highlights ASD-specific advances (e.g., CARS, ADOS-2, adapted functional scales), yet shows heterogeneity of constructs and gaps in measurement invariance and clinical responsiveness specific to music therapy contexts.'));
    parts.push(p('Conclusions: MuseTera TEA is positioned as an integrative, multidimensional instrument (0–5) with explicit clinical responsiveness criteria for ASD population. A COSMIN/DeVellis-aligned validation plan is outlined without human data at this stage.'));
    parts.push(p('Keywords: music therapy; ASD; autism spectrum disorder; assessment; psychometrics; COSMIN; PRISMA; MuseTera.', { italics: true }));

    // Objetivos e Perguntas de Pesquisa
    parts.push(h1('Objetivos e Perguntas de Pesquisa'));
    parts.push(p('Objetivo principal: sintetizar evidências sobre instrumentos de avaliação relevantes à musicoterapia no TEA e delinear critérios para a Escala MuseTera TEA.'));
    parts.push(p('Perguntas de pesquisa:'));
    parts.push(p('Quais instrumentos são utilizados na avaliação clínica de pessoas com TEA e possuem evidências psicométricas?', { bullet: true, size: 22, spaceAfter: 60 }));
    parts.push(p('Quais propriedades psicométricas são mais bem documentadas e onde há lacunas (validade de conteúdo, estrutura interna, confiabilidade, invariância, responsividade)?', { bullet: true, size: 22, spaceAfter: 60 }));
    parts.push(p('Como essas evidências informam o desenho e o plano de validação da Escala MuseTera TEA (0–5)?', { bullet: true, size: 22, spaceAfter: 100 }));

    // Estratégia de Busca e PICOS
    parts.push(h1('Estratégia de Busca e PICOS'));
    parts.push(p('Bases: PubMed/MEDLINE, Scopus, Web of Science e PsycINFO; período sem restrição específica; idiomas: inglês e português.'));
    parts.push(p('Termos: "music therapy" AND ("autism spectrum disorder" OR "ASD" OR "autism") AND (assessment OR measurement OR instrument OR scale) AND (validity OR reliability OR responsiveness OR psychometric).'));
    parts.push(p('PICOS:'));
    parts.push(p('P — População: crianças, adolescentes e adultos com TEA;', { bullet: true, size: 22, spaceAfter: 30 }));
    parts.push(p('I — Intervenção/Contexto: musicoterapia e contextos correlatos de reabilitação;', { bullet: true, size: 22, spaceAfter: 30 }));
    parts.push(p('C — Comparação: instrumentos diagnósticos ou funcionais padrão (p.ex., CARS, ADOS-2);', { bullet: true, size: 22, spaceAfter: 30 }));
    parts.push(p('O — Desfechos: propriedades psicométricas (validade, confiabilidade, responsividade) e viabilidade clínica;', { bullet: true, size: 22, spaceAfter: 30 }));
    parts.push(p('S — Estudos: ensaios clínicos, estudos observacionais, estudos metodológicos e manuais técnicos;', { bullet: true, size: 22, spaceAfter: 100 }));

    // Seleção e Extração de Dados
    parts.push(h1('Seleção e Extração de Dados'));
    parts.push(p('Triagem em duas fases (título/resumo e texto completo) por dois revisores independentes; extração padronizada de construto, amostra, contexto, métricas psicométricas e limitações. Divergências resolvidas por consenso.'));

    // Avaliação da Qualidade (COSMIN)
    parts.push(h1('Avaliação da Qualidade (COSMIN)'));
    parts.push(p('A qualidade metodológica dos estudos de propriedades de medida foi avaliada conforme recomendações COSMIN, considerando riscos de viés e adequação das análises (Prinsen et al., 2018; Mokkink et al., 2010).'));

    // Síntese e Limitações Metodológicas
    parts.push(h1('Síntese e Limitações Metodológicas'));
    parts.push(p('Síntese narrativa com atenção à heterogeneidade conceitual e estatística; sem metanálise formal. Potenciais vieses: seleção, publicação e reporte incompleto de métricas.'));

    // Metodologia
    parts.push(section('Metodologia da Revisão', [
      'Desenho: Revisão integrativa (Whittemore & Knafl, 2005), reportada conforme princípios PRISMA 2020 (Page et al., 2021) quando aplicável.',
      'Bases: PubMed/MEDLINE, Scopus, Web of Science e PsycINFO; termos: "music therapy" AND ("autism spectrum disorder" OR "ASD" OR "autism") AND (assessment OR measurement OR instrument OR scale) AND (validity OR reliability OR responsiveness OR psychometric).',
      'Critérios de inclusão: instrumentos de avaliação em musicoterapia para TEA ou medidas correlatas utilizadas em contexto musicoterapêutico com evidências psicométricas.',
      'Critérios de exclusão: opiniões sem base empírica; instrumentos sem descrição suficiente; relatos sem componente de avaliação específico para TEA.',
      'Seleção: triagem por título/resumo e leitura do texto completo; extração padronizada de construtos, contexto, propriedades psicométricas e limitações específicas para TEA.',
      'Síntese: narrativa; avaliação das evidências orientada por COSMIN (Prinsen et al., 2018; Mokkink et al., 2010) e clássicos da psicometria (DeVellis, 2017; Nunnally & Bernstein, 1994).',
    ]));

    // Resultados
    parts.push(section('Resultados da Revisão', [
      'Panorama: instrumentos específicos para TEA — CARS (Childhood Autism Rating Scale), ADOS-2 (Autism Diagnostic Observation Schedule), e instrumentos funcionais adaptados usados em reabilitação e em contextos de musicoterapia para TEA.',
      'Propriedades: validade de conteúdo para TEA frequentemente por especialistas (CVR, Lawshe, 1975); estrutura interna com análises diversas e pouca padronização específica para população TEA; confiabilidade (α/ω, teste–reteste) variável; responsividade e critérios clínicos para TEA ainda incipientes.',
      'Implicações à MuseTera TEA: abordagem multidimensional integrada (comunicação social, comportamentos repetitivos, sensorial, cognitivo, musical) com pontuação 0–5 e descritores observáveis específicos para TEA, orientada por COSMIN/DeVellis para validação futura.',
    ]));

    // Detalhamento dos Instrumentos
    parts.push(h1('Instrumentos Mapeados e Uso no TEA'));
    parts.push(p('CARS (Childhood Autism Rating Scale): instrumento clássico de severidade do TEA; utilizado como padrão de comparação e em estudos de validade convergente.', { size: 22 }));
    parts.push(p('ADOS-2 (Autism Diagnostic Observation Schedule): observação padronizada com módulos; frequentemente usada como critério externo e para amostragem.', { size: 22 }));
    parts.push(p('SRS-2 (Social Responsiveness Scale): medida de traços do espectro autista em diferentes contextos; útil para validade convergente e monitoramento.', { size: 22 }));
    parts.push(p('Vineland-3 (Adaptive Behavior Scales): avalia comportamento adaptativo; relevante para construtos funcionais correlatos em musicoterapia.', { size: 22 }));
    parts.push(p('Sensory Profile 2: perfis sensoriais; informam domínios sensoriais e responsividade a estímulos musicais.', { size: 22 }));
    parts.push(p('Aberrant Behavior Checklist (ABC): comportamentos desafiadores; útil para convergência/divergência em domínios comportamentais.', { size: 22 }));
    parts.push(p('IMCAP-ND: avaliação musicocentrada para condições do neurodesenvolvimento; contribui com evidências específicas de avaliação musical no TEA.', { size: 22, spaceAfter: 120 }));

    // Discussão
    parts.push(section('Discussão', [
      'A heterogeneidade de construtos e métodos limita comparações entre instrumentos para TEA, mas diretrizes como COSMIN oferecem caminho para padronização específica.',
      'A Escala MuseTera TEA explicita critérios de pontuação, domínios coerentes com características do TEA e plano de validação robusto e transparente.',
      'Limitações: síntese narrativa suscetível a vieses de seleção e publicação; ausência de metanálise devido à heterogeneidade de desfechos e métricas específicas para TEA.',
    ]));

    // Implicações para a Escala MuseTera TEA
    parts.push(h1('Implicações para a Escala MuseTera TEA'));
    parts.push(p('Os achados orientam domínios, critérios de pontuação 0–5 e hipóteses de responsividade clínica, reforçando a necessidade de evidências de invariância entre subgrupos do TEA e de estudos teste–reteste com intervalos apropriados.'));
    parts.push(p('A adoção de análises baseadas em modelos (p.ex., Rasch) e o reporte transparente segundo COSMIN devem nortear futuras versões e publicações da escala.', { spaceAfter: 180 }));

    // Plano de Validação
    parts.push(h1('Plano de Validação Psicométrica Proposto para TEA'));
    const bullets = [
      'Validade de conteúdo: painel de especialistas em TEA e musicoterapia; cálculo de CVR (Lawshe, 1975) e I-CVI/S-CVI com critérios de aceitação.',
      'Estrutura interna: AFE/CFA e/ou modelos de Rasch específicos para características do TEA; avaliação de unidimensionalidade/local dependence quando aplicável.',
      'Consistência interna: ω de McDonald (preferencial) e α de Cronbach com faixas alvo (≥0,70 para uso exploratório) considerando heterogeneidade do TEA;',
      'Confiabilidade teste–reteste: ICC (2,1) ou (3,1) com intervalo de confiança; cálculo de SEM e MDC específicos para população TEA.',
      'Validade convergente/discriminante: correlações com CARS, ADOS-2 e instrumentos funcionais relacionados ao TEA.',
      'Invariância de medida: entre subgrupos do TEA (nível de suporte, idade, comunicação verbal) por múltiplas‑amostras quando aplicável.',
      'Responsividade: hipóteses a priori e medidas de efeito (SRM, ES) com critérios clínicos específicos para TEA;',
      'Adaptação transcultural: diretrizes de Beaton com equivalência semântica e operacional considerando características culturais do TEA.',
    ];
    bullets.forEach((b) => parts.push(p(b, { bullet: true, size: 22, spaceAfter: 80 })));

    // Ilustrações (imagens)
    parts.push(pb());
    parts.push(h1('Ilustrações da Escala de Avaliação MuseTera TEA'));
    const galleryItems = [
      { src: '/lovable-uploads/460b68cd-687b-4148-a562-03baaa061f0e.png', title: 'Visão Geral da Escala MuseTera TEA' },
      { src: '/lovable-uploads/00843ad9-07f6-49b9-a0fa-0ebd2d697fc9.png', title: 'Sistema de Pontuação 0–5 para TEA' },
      { src: '/lovable-uploads/978b95d8-86ef-426b-bb26-4ab75eb24587.png', title: 'Domínio Musical para TEA' },
      { src: '/lovable-uploads/8abd4927-9dea-44ba-a4f1-f63e79c8d171.png', title: 'Domínio Comunicação Social (TEA)' },
      { src: '/lovable-uploads/bd8289ea-d474-46f4-87d3-48ad1567394f.png', title: 'Domínio Cognitivo para TEA' },
      { src: '/lovable-uploads/6f316512-b637-496d-b3fe-472381b4c647.png', title: 'Domínio Sensorial para TEA' },
      { src: '/lovable-uploads/2980fc3c-0aac-41bd-bc7a-2c5aca34aca1.png', title: 'Domínio Comportamental para TEA' },
    ];
    for (const item of galleryItems) {
      parts.push(await buildRtfImageFigure(item.src, item.title));
    }

    // Apêndice: critérios de pontuação
    parts.push(h1('Apêndice: Critérios de Pontuação 0–5 para TEA (exemplo)'));
    const levels = [
      '0 – Ausência do comportamento alvo; sem evidências observáveis no contexto TEA.',
      '1 – Indícios mínimos, inconsistentes; requer suporte intenso específico para TEA.',
      '2 – Presença ocasional; requer suporte moderado adaptado às características do TEA; melhora incipiente.',
      '3 – Presença frequente com apoio; desempenho funcional emergente considerando perfil TEA.',
      '4 – Presença consistente com pouco apoio; desempenho funcional adaptado ao TEA.',
      '5 – Presença robusta e sustentada; generalização em contextos diversos apropriados para TEA.',
    ];
    levels.forEach((lv) => parts.push(p(lv, { bullet: true, size: 22, spaceAfter: 60 })));

    // Conclusão
    parts.push(section('Conclusão', [
      'A literatura sustenta a relevância de instrumentos específicos em musicoterapia para TEA e a necessidade de padronização psicométrica. A Escala de Avaliação MuseTera TEA apresenta racional teórico‑clínico promissor. Este artigo estabelece base conceitual e metodológica para validação futura específica para população TEA, sem dados humanos nesta etapa.',
    ]));

    // Agradecimentos
    parts.push(section('Agradecimentos', [
      'Agradecemos a profissionais e pesquisadores que contribuíram com discussões metodológicas e conceituais sobre a avaliação em musicoterapia para TEA e psicometria aplicada.',
    ]));

    // Seções finais
    parts.push(h1('Considerações Éticas'));
    parts.push(p('Por se tratar de revisão de literatura, não houve envolvimento direto de participantes humanos ou necessidade de aprovação de Comitê de Ética.'));

    parts.push(h1('Contribuições do Autor'));
    parts.push(p('Concepção, metodologia, curadoria de dados, redação — J. C. B. da Silva.'));

    parts.push(h1('Financiamento'));
    parts.push(p('Este trabalho não recebeu financiamento específico de agências de fomento públicas, comerciais ou sem fins lucrativos.'));

    parts.push(h1('Conflitos de Interesse'));
    parts.push(p('O autor é desenvolvedor da plataforma MuseTera. Não há outros conflitos de interesse a declarar.'));

    parts.push(h1('Disponibilidade de Materiais'));
    parts.push(p('Critérios provisórios de pontuação e materiais suplementares estão disponíveis sob solicitação para fins de avaliação acadêmica.'));

    // Referências (reais)
    parts.push(pb());
    parts.push(h1('Referências'));
    const refs = [
      'Page, M. J., McKenzie, J. E., Bossuyt, P. M., Boutron, I., Hoffmann, T. C., Mulrow, C. D., ... Moher, D. (2021). The PRISMA 2020 statement: an updated guideline for reporting systematic reviews. BMJ, 372, n71. https://doi.org/10.1136/bmj.n71',
      'Whittemore, R., & Knafl, K. (2005). The integrative review: updated methodology. Journal of Advanced Nursing, 52(5), 546–553. https://doi.org/10.1111/j.1365-2648.2005.03621.x',
      'Prinsen, C. A. C., Mokkink, L. B., Bouter, L. M., Alonso, J., Patrick, D. L., de Vet, H. C. W., & Terwee, C. B. (2018). COSMIN guideline for systematic reviews of PROMs. Quality of Life Research, 27(5), 1147–1157. https://doi.org/10.1007/s11136-018-1798-3',
      'Mokkink, L. B., Terwee, C. B., Patrick, D. L., Alonso, J., Stratford, P. W., Knol, D. L., ... de Vet, H. C. W. (2010). The COSMIN checklist for assessing the methodological quality of studies on measurement properties. Quality of Life Research, 19(4), 539–549. https://doi.org/10.1007/s11136-010-9606-8',
      'DeVellis, R. F. (2017). Scale Development: Theory and Applications (4th ed.). SAGE Publications.',
      'Nunnally, J. C., & Bernstein, I. H. (1994). Psychometric Theory (3rd ed.). McGraw-Hill.',
      'Streiner, D. L., Norman, G. R., & Cairney, J. (2015). Health Measurement Scales: A practical guide to their development and use (5th ed.). Oxford University Press.',
      'Terwee, C. B., Bot, S. D., de Boer, M. R., et al. (2007). Quality criteria were proposed for measurement properties of health status questionnaires. Journal of Clinical Epidemiology, 60(1), 34–42. https://doi.org/10.1016/j.jclinepi.2006.03.012',
      'Portney, L. G. (2020). Foundations of Clinical Research: Applications to Evidence-Based Practice (4th ed.). F.A. Davis Company.',
      'Lawshe, C. H. (1975). A quantitative approach to content validity. Personnel Psychology, 28(4), 563–575. https://doi.org/10.1111/j.1744-6570.1975.tb01393.x',
      'Schopler, E., Reichler, R. J., DeVellis, R. F., & Daly, K. (1980). Toward objective classification of childhood autism: Childhood Autism Rating Scale (CARS). Journal of Autism and Developmental Disorders, 10(1), 91–103. https://doi.org/10.1007/BF02408436',
      'Lord, C., Rutter, M., DiLavore, P. C., Risi, S., Gotham, K., & Bishop, S. (2012). Autism Diagnostic Observation Schedule, Second Edition (ADOS-2) Manual (Part I): Modules 1-4. Western Psychological Services.',
      'Constantino, J. N., & Gruber, C. P. (2012). Social Responsiveness Scale, Second Edition (SRS-2) Manual. Western Psychological Services.',
      'Sparrow, S. S., Cicchetti, D. V., & Saulnier, C. A. (2016). Vineland Adaptive Behavior Scales, Third Edition (Vineland-3) Manual. Pearson.',
      'Dunn, W. (2014). Sensory Profile 2 User\'s Manual. Pearson.',
      'Aman, M. G., Singh, N. N., Stewart, A. W., & Field, C. J. (1985). The Aberrant Behavior Checklist: a behavior rating scale for the assessment of treatment effects in psychopharmacology. American Journal of Mental Deficiency, 89(5), 485–491.',
      'Carpente, J. A. (2017). Individual music-centered assessment profile for neurodevelopmental disorders (IMCAP-ND): New developments in music-centered evaluation. Music Therapy Perspectives, 35(1), 1–9. https://doi.org/10.1093/mtp/miw013',
      'Kim, J., Wigram, T., & Gold, C. (2008). The effects of improvisational music therapy on joint attention behaviors in autistic children: A randomized controlled study. Journal of Autism and Developmental Disorders, 38(9), 1758–1766. https://doi.org/10.1007/s10803-008-0566-6',
      'Gattino, G. S., Riesgo, R. dos S., Longo, D., Leite, J. C., & Faccini, L. S. (2011). Effects of relational music therapy on communication of children with autism: a randomized controlled study. Nordic Journal of Music Therapy, 20(2), 142–154. https://doi.org/10.1080/08098131.2011.566933',
      'Geretsegger, M., Elefant, C., Mössler, K. A., & Gold, C. (2014). Music therapy for people with autism spectrum disorder. Cochrane Database of Systematic Reviews, (6), CD004381. https://doi.org/10.1002/14651858.CD004381.pub3',
      'Bieleninik, Ł., Geretsegger, M., Mössler, K. A., et al. (2017). Effects of improvisational music therapy vs enhanced standard care on symptom severity among children with autism spectrum disorder (TIME-A). JAMA, 318(6), 525–535. https://doi.org/10.1001/jama.2017.9478',
      'Beaton, D. E., Bombardier, C., Guillemin, F., & Ferraz, M. B. (2000). Guidelines for the process of cross-cultural adaptation of self-report measures. Spine, 25(24), 3186–3191. https://doi.org/10.1097/00007632-200012150-00014',
      'World Federation of Music Therapy. WFMT Practice Standards & Clinical Guidelines. https://www.wfmt.info/about/practice-standards/',
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
