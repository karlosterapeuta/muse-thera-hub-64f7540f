import { AlignmentType, Document, HeadingLevel, Packer, Paragraph, TextRun } from 'docx';

function formatDate(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export async function generateMuseTeraLiteratureReviewDOCX(): Promise<boolean> {
  try {
    const today = new Date();
    const fileName = `Revisao_Literatura_Escala_MuseTera_${formatDate(today)}.docx`;

    const title = new Paragraph({
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: 'Escala MuseTera: Revisão Integrativa da Literatura sobre Avaliação em Musicoterapia e Propriedades Psicométricas de Instrumentos Afins',
          bold: true,
        }),
      ],
    });

    const titleEn = new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: 'MuseTera Scale: Integrative Literature Review on Music Therapy Assessment and Psychometric Properties of Related Instruments',
          italics: true,
        }),
      ],
    });

    const authorBlock = new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [
        new TextRun('Autor: José Carlos Batista da Silva, Dr.'),
        new TextRun({ text: ' \u000bAfiliacão: Plataforma MuseTera para Musicoterapeutas — Brasil', break: 1 }),
        new TextRun({ text: 'Contato: josecarlos@musetera.com.br', break: 1 }),
        new TextRun({ text: `Status: Pré-submissão • Tipo: Revisão de Literatura (Integrativa) • Data: ${formatDate(today)}`, break: 1 }),
        new TextRun({ text: 'Declaração: Este artigo não apresenta dados de participantes humanos. Trata-se de uma revisão da literatura com implicações para validação futura da escala.', break: 1 }),
      ],
    });

    const h1 = (text: string) => new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 200, after: 100 }, children: [new TextRun({ text, bold: true })] });
    const h2 = (text: string) => new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 100, after: 60 }, children: [new TextRun({ text, bold: true })] });
    const p = (text: string) => new Paragraph({ spacing: { after: 120 }, children: [new TextRun(text)] });
    const i = (text: string) => new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text, italics: true })] });
    const bullet = (text: string) => new Paragraph({ spacing: { after: 60 }, bullet: { level: 0 }, children: [new TextRun(text)] });

    // Resumo e Abstract
    const resumo = [
      h1('RESUMO'),
      p('Objetivo: Realizar uma revisão integrativa da literatura sobre instrumentos de avaliação em musicoterapia e suas propriedades psicométricas, identificando lacunas e melhores práticas para fundamentar a proposta da Escala MuseTera (0–5) e seu plano de validação.'),
      p('Métodos: Revisão integrativa guiada por princípios PRISMA e recomendações COSMIN para medidas de desfecho. Bases de dados: PubMed/MEDLINE, Scopus, Web of Science e PsycINFO. Foram incluídos estudos sobre instrumentos de avaliação em musicoterapia e medidas relacionadas (funcionais, psicossociais, cognitivo-sensório-motoras), com foco em validade, confiabilidade e responsividade.'),
      p('Resultados: A literatura demonstra avanços importantes (por exemplo, MATADOC para consciência em DOC; MiDAS em demência; uso de Goal Attainment Scaling na reabilitação), mas evidencia heterogeneidade de construtos, lacunas na avaliação de invariância e critérios de sensibilidade clínica. Diretrizes COSMIN e princípios clássicos de psicometria indicam caminhos para padronização.'),
      p('Conclusões: A Escala MuseTera se posiciona como instrumento integrativo multidimensional com sistema de pontuação 0–5 e critérios explícitos de responsividade clínica. Propõe-se um plano de validação psicométrica alinhado a COSMIN/DeVellis, sem uso de dados humanos nesta fase.'),
      i('Palavras-chave: musicoterapia; avaliação; psicometria; COSMIN; PRISMA; MuseTera.'),

      h1('ABSTRACT'),
      p('Objective: To conduct an integrative review of music therapy assessment instruments and their psychometric properties, identifying gaps and best practices to inform the MuseTera Scale (0–5) and its future validation plan.'),
      p('Methods: Integrative review guided by PRISMA principles and COSMIN recommendations. Databases searched included PubMed/MEDLINE, Scopus, Web of Science, and PsycINFO. Studies addressing music therapy assessment tools and related measures (functional, psychosocial, cognitive-sensorimotor) with psychometric evidence were included.'),
      p('Results: The literature highlights important advances (e.g., MATADOC for disorders of consciousness; MiDAS in dementia; use of Goal Attainment Scaling in rehabilitation) but shows heterogeneity of constructs and gaps in measurement invariance and clinical sensitivity.'),
      p('Conclusions: MuseTera is positioned as an integrative, multidimensional instrument with a 0–5 scoring system and explicit clinical responsiveness criteria. A COSMIN/DeVellis-aligned validation plan is outlined without human data at this stage.'),
      i('Keywords: music therapy; assessment; psychometrics; COSMIN; PRISMA; MuseTera.'),
    ];

    // Metodologia da revisão
    const metodologia = [
      h1('Metodologia da Revisão'),
      p('Desenho: Revisão integrativa da literatura (Whittemore & Knafl, 2005), reportada segundo o checklist PRISMA 2020 (Page et al., 2021) quando aplicável.'),
      h2('Bases de dados e estratégia de busca'),
      p('Bases: PubMed/MEDLINE, Scopus, Web of Science e PsycINFO; período sem restrição inicial até a data da busca. Termos combinando “music therapy” AND (assessment OR measurement OR instrument OR scale) AND (validity OR reliability OR responsiveness OR psychometric).'),
      h2('Critérios de elegibilidade'),
      bullet('Inclusão: Estudos que descrevem/validam instrumentos de avaliação em musicoterapia ou medidas correlatas usadas em contextos musicoterapêuticos; artigos com evidências psicométricas (validade, confiabilidade, responsividade).'),
      bullet('Exclusão: Opiniões sem base empírica; instrumentos sem descrição suficiente; relatos sem componente de avaliação.'),
      h2('Seleção dos estudos e extração'),
      p('Seleção em duas etapas (título/resumo; texto completo). Extração padronizada: contexto, população, construtos avaliados, propriedades psicométricas, limitações.'),
      h2('Síntese e avaliação de qualidade'),
      p('Síntese narrativa das evidências. Julgamento das propriedades psicométricas com base nas diretrizes COSMIN (Prinsen et al., 2018; Mokkink et al., 2010) e em princípios clássicos (DeVellis, 2017; Nunnally & Bernstein, 1994).'),
    ];

    // Resultados (síntese)
    const resultados = [
      h1('Resultados da Revisão'),
      h2('Panorama dos instrumentos em musicoterapia'),
      p('Identificam-se instrumentos específicos e adaptados a contextos particulares: o MATADOC apresenta evidências de confiabilidade e validade para avaliação de consciência em desordens de consciência; o MiDAS demonstra propriedades psicométricas promissoras na demência; a Goal Attainment Scaling (GAS) é amplamente utilizada para avaliação de metas individualizadas em reabilitação, inclusive em contextos de musicoterapia.'),
      h2('Propriedades psicométricas: avanços e lacunas'),
      bullet('Validade de conteúdo: frequentemente sustentada por especialistas, com uso clássico de CVR (Lawshe, 1975).'),
      bullet('Estrutura interna: análises fatoriais e modelagem por equações estruturais ainda pouco padronizadas entre instrumentos; invariância entre subgrupos raramente testada.'),
      bullet('Confiabilidade: consistência interna (α/ω) e estabilidade (teste–reteste) variáveis; estudos de erro de medida e MDC/MCID são menos comuns.'),
      bullet('Responsividade: medidas de sensibilidade à mudança e critérios clínicos explícitos ainda são incipientes.'),
      h2('Implicações para a Escala MuseTera (0–5)'),
      p('A MuseTera propõe uma abordagem multidimensional integrada (musical, psicossocial, cognitivo e sensório-motor) com sistema de pontuação 0–5 e descritores comportamentais observáveis, alinhando-se às melhores práticas psicométricas (COSMIN/DeVellis) para futura validação.'),
    ];

    // Discussão
    const discussao = [
      h1('Discussão'),
      p('A revisão evidencia o potencial e os limites dos instrumentos existentes. A heterogeneidade conceitual e metodológica dificulta comparações e metassíntese. Diretrizes COSMIN e princípios psicométricos clássicos oferecem uma base consistente para orientar a construção e a avaliação de instrumentos em musicoterapia.'),
      p('A MuseTera busca preencher lacunas ao explicitar critérios de pontuação, definir domínios coerentes com a prática clínica e articular um plano de validação robusto e transparente.'),
      h2('Limitações da revisão'),
      p('Por ser integrativa e com síntese narrativa, podem existir vieses de seleção e publicação. A ausência de metanálise decorre da heterogeneidade dos desfechos e métricas nos estudos revisados.'),
    ];

    // Conclusão
    const conclusao = [
      h1('Conclusão'),
      p('A literatura sustenta a relevância de instrumentos específicos em musicoterapia e a necessidade de padronização psicométrica. A Escala MuseTera apresenta um racional teórico e clínico promissor para avaliação multidimensional. Este artigo estabelece a base conceitual e metodológica para validação futura, sem uso de dados humanos nesta etapa.'),
    ];

    // Referências reais
    const referencias = [
      h1('Referências'),
      // PRISMA 2020
      p('Page, M. J., McKenzie, J. E., Bossuyt, P. M., Boutron, I., Hoffmann, T. C., Mulrow, C. D., ... Moher, D. (2021). The PRISMA 2020 statement: an updated guideline for reporting systematic reviews. BMJ, 372, n71. https://doi.org/10.1136/bmj.n71'),
      // Integrative review method
      p('Whittemore, R., & Knafl, K. (2005). The integrative review: updated methodology. Journal of Advanced Nursing, 52(5), 546–553. https://doi.org/10.1111/j.1365-2648.2005.03621.x'),
      // Typology of reviews
      p('Grant, M. J., & Booth, A. (2009). A typology of reviews: an analysis of 14 review types and associated methodologies. Health Information & Libraries Journal, 26(2), 91–108. https://doi.org/10.1111/j.1471-1842.2009.00848.x'),
      // Scoping framework
      p("Arksey, H., & O’Malley, L. (2005). Scoping studies: towards a methodological framework. International Journal of Social Research Methodology, 8(1), 19–32. https://doi.org/10.1080/1364557032000119616"),
      // COSMIN guidelines
      p('Prinsen, C. A. C., Mokkink, L. B., Bouter, L. M., Alonso, J., Patrick, D. L., de Vet, H. C. W., & Terwee, C. B. (2018). COSMIN guideline for systematic reviews of patient-reported outcome measures (PROMs). Quality of Life Research, 27(5), 1147–1157. https://doi.org/10.1007/s11136-018-1798-3'),
      p('Mokkink, L. B., Terwee, C. B., Patrick, D. L., Alonso, J., Stratford, P. W., Knol, D. L., ... de Vet, H. C. W. (2010). The COSMIN checklist for assessing the methodological quality of studies on measurement properties. Quality of Life Research, 19(4), 539–549. https://doi.org/10.1007/s11136-010-9606-8'),
      // Psychometric classics
      p('DeVellis, R. F. (2017). Scale Development: Theory and Applications (4th ed.). SAGE Publications.'),
      p('Nunnally, J. C., & Bernstein, I. H. (1994). Psychometric Theory (3rd ed.). McGraw-Hill.'),
      p('Lawshe, C. H. (1975). A quantitative approach to content validity. Personnel Psychology, 28(4), 563–575. https://doi.org/10.1111/j.1744-6570.1975.tb01393.x'),
      // Instruments examples
      p('Magee, W. L., Brumfitt, S. M., Jamison, R., & et al. (2014/2015). Music Therapy Assessment Tool for Awareness in Disorders of Consciousness (MATADOC): Reliability and validity studies. Journal of Music Therapy, 52(1), 1–26. https://doi.org/10.1093/jmt/thv017'),
      p('McDermott, O., Orrell, M., & Ridder, H. M. (2014). The development of Music in Dementia Assessment Scales (MiDAS). Nordic Journal of Music Therapy, 23(2), 134–156. https://doi.org/10.1080/08098131.2013.790918'),
      p('Kiresuk, T. J., & Sherman, R. E. (1968). Goal Attainment Scaling: A general method for evaluating comprehensive community mental health programs. Community Mental Health Journal, 4(6), 443–453. https://doi.org/10.1007/BF01530764'),
    ];

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            title,
            titleEn,
            authorBlock,
            ...resumo,
            ...metodologia,
            ...resultados,
            ...discussao,
            ...conclusao,
            ...referencias,
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    return true;
  } catch (err) {
    console.error('Erro ao gerar DOCX de Revisão de Literatura:', err);
    return false;
  }
}
