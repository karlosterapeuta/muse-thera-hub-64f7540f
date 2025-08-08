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

    // Methods
    parts.push(section('Metodologia da Revisão', [
      'Desenho: Revisão integrativa (Whittemore & Knafl, 2005), reportada conforme princípios PRISMA 2020 (Page et al., 2021) quando aplicável.',
      'Bases: PubMed/MEDLINE, Scopus, Web of Science e PsycINFO; termos: “music therapy” AND (assessment OR measurement OR instrument OR scale) AND (validity OR reliability OR responsiveness OR psychometric).',
      'Critérios de inclusão: instrumentos de avaliação em musicoterapia ou medidas correlatas utilizadas em contexto musicoterapêutico com evidências psicométricas.',
      'Critérios de exclusão: opiniões sem base empírica; instrumentos sem descrição suficiente; relatos sem componente de avaliação.',
      'Seleção: triagem por título/resumo e leitura do texto completo; extração padronizada de construtos, contexto, propriedades psicométricas e limitações.',
      'Síntese: narrativa; avaliação das evidências orientada por COSMIN (Prinsen et al., 2018; Mokkink et al., 2010) e clássicos da psicometria (DeVellis, 2017; Nunnally & Bernstein, 1994).',
    ]));

    // Results
    parts.push(section('Resultados da Revisão', [
      'Panorama: instrumentos específicos e contextuais — MATADOC (consciência em desordens de consciência), MiDAS (demência), e GAS (metas individualizadas) usados em reabilitação e em contextos de musicoterapia.',
      'Propriedades: validade de conteúdo frequentemente por especialistas (CVR, Lawshe, 1975); estrutura interna com análises diversas e pouca padronização; confiabilidade (α/ω, teste–reteste) variável; responsividade e critérios clínicos ainda incipientes.',
      'Implicações à MuseTera: abordagem multidimensional integrada (musical, psicossocial, cognitivo, sensório‑motor) com pontuação 0–5 e descritores observáveis, orientada por COSMIN/DeVellis para validação futura.',
    ]));

    // Discussion
    parts.push(section('Discussão', [
      'A heterogeneidade de construtos e métodos limita comparações entre instrumentos, mas diretrizes como COSMIN oferecem caminho para padronização.',
      'A MuseTera explicita critérios de pontuação, domínios coerentes com a prática e plano de validação robusto e transparente.',
      'Limitações: síntese narrativa suscetível a vieses de seleção e publicação; ausência de metanálise devido à heterogeneidade de desfechos e métricas.',
    ]));

    // Conclusion
    parts.push(section('Conclusão', [
      'A literatura sustenta a relevância de instrumentos específicos em musicoterapia e a necessidade de padronização psicométrica. A Escala MuseTera apresenta racional teórico‑clínico promissor. Este artigo estabelece base conceitual e metodológica para validação futura, sem dados humanos nesta etapa.',
    ]));

    // References (real)
    parts.push(h1('Referências'));
    const refs = [
      'Page, M. J., McKenzie, J. E., Bossuyt, P. M., Boutron, I., Hoffmann, T. C., Mulrow, C. D., ... Moher, D. (2021). The PRISMA 2020 statement: an updated guideline for reporting systematic reviews. BMJ, 372, n71. https://doi.org/10.1136/bmj.n71',
      'Whittemore, R., & Knafl, K. (2005). The integrative review: updated methodology. Journal of Advanced Nursing, 52(5), 546–553. https://doi.org/10.1111/j.1365-2648.2005.03621.x',
      'Grant, M. J., & Booth, A. (2009). A typology of reviews: an analysis of 14 review types and associated methodologies. Health Information & Libraries Journal, 26(2), 91–108. https://doi.org/10.1111/j.1471-1842.2009.00848.x',
      'Arksey, H., & O’Malley, L. (2005). Scoping studies: towards a methodological framework. International Journal of Social Research Methodology, 8(1), 19–32. https://doi.org/10.1080/1364557032000119616',
      'Prinsen, C. A. C., Mokkink, L. B., Bouter, L. M., Alonso, J., Patrick, D. L., de Vet, H. C. W., & Terwee, C. B. (2018). COSMIN guideline for systematic reviews of PROMs. Quality of Life Research, 27(5), 1147–1157. https://doi.org/10.1007/s11136-018-1798-3',
      'Mokkink, L. B., Terwee, C. B., Patrick, D. L., Alonso, J., Stratford, P. W., Knol, D. L., ... de Vet, H. C. W. (2010). The COSMIN checklist for assessing the methodological quality of studies on measurement properties. Quality of Life Research, 19(4), 539–549. https://doi.org/10.1007/s11136-010-9606-8',
      'DeVellis, R. F. (2017). Scale Development: Theory and Applications (4th ed.). SAGE Publications.',
      'Nunnally, J. C., & Bernstein, I. H. (1994). Psychometric Theory (3rd ed.). McGraw-Hill.',
      'Lawshe, C. H. (1975). A quantitative approach to content validity. Personnel Psychology, 28(4), 563–575. https://doi.org/10.1111/j.1744-6570.1975.tb01393.x',
      'Magee, W. L., et al. (2015). Music Therapy Assessment Tool for Awareness in Disorders of Consciousness (MATADOC): Reliability and validity. Journal of Music Therapy, 52(1), 1–26. https://doi.org/10.1093/jmt/thv017',
      'McDermott, O., Orrell, M., & Ridder, H. M. (2014). The development of Music in Dementia Assessment Scales (MiDAS). Nordic Journal of Music Therapy, 23(2), 134–156. https://doi.org/10.1080/08098131.2013.790918',
      'Kiresuk, T. J., & Sherman, R. E. (1968). Goal Attainment Scaling: A general method for evaluating comprehensive community mental health programs. Community Mental Health Journal, 4(6), 443–453. https://doi.org/10.1007/BF01530764',
    ];
    refs.forEach((r) => parts.push(p(r, { size: 20, spaceAfter: 80 })));

    const rtf = [
      '{\\rtf1\\ansi\\deff0\\uc1\n',
      '{\\fonttbl{\\f0 Arial;}{\\f1 Times New Roman;}}\n',
      '\n',
      // Page setup (A4 margins ~2.54cm)
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
