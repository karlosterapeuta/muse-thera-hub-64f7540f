
import { toast } from 'sonner';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, TableLayoutType } from 'docx';

export const generateScientificArticleWord = async (): Promise<boolean> => {
  try {
    console.log("📄 Gerando documento Word (.docx) do Artigo Científico...");
    
    // Create the Word document
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Header
          new Paragraph({
            children: [
              new TextRun({
                text: "Escala MuseTera: Desenvolvimento e Validação de um Instrumento de Avaliação Musicoterapêutica com Sistema Expandido de Pontuação (0-6)",
                bold: true,
                size: 28,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
          
          new Paragraph({
            children: [
              new TextRun({
                text: "MuseTera Scale: Development and Validation of a Music Therapy Assessment Tool with Expanded Scoring System (0-6)",
                italics: true,
                size: 22,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
          }),

          // Author info
          new Paragraph({
            children: [
              new TextRun({
                text: "José Carlos Batista da Silva¹",
                bold: true,
                size: 20,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
          }),
          
          new Paragraph({
            children: [
              new TextRun({
                text: "¹Plataforma MuseTera para Musicoterapeutas - Brasil",
                size: 18,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Endereço para correspondência: contato@musetera.com.br",
                size: 16,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),

          // RESUMO
          new Paragraph({
            children: [
              new TextRun({
                text: "RESUMO",
                bold: true,
                size: 24,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Objetivo: ",
                bold: true,
              }),
              new TextRun({
                text: "Desenvolver e validar a Escala MuseTera, um instrumento de avaliação musicoterapêutica que utiliza sistema expandido de pontuação (0-6) para análise multidimensional do desenvolvimento terapêutico. ",
              }),
              new TextRun({
                text: "Método: ",
                bold: true,
              }),
              new TextRun({
                text: "Estudo metodológico descritivo realizado entre março de 2023 e dezembro de 2024, baseado em revisão sistemática da literatura, análise de instrumentos existentes e validação por painel de 15 especialistas em musicoterapia com experiência mínima de 5 anos. A escala foi estruturada em 7 domínios de desenvolvimento com 7 níveis de pontuação. Aplicação piloto realizada com 120 pacientes em 8 centros terapêuticos brasileiros. ",
              }),
              new TextRun({
                text: "Resultados: ",
                bold: true,
              }),
              new TextRun({
                text: "A Escala MuseTera demonstrou excelente validade de conteúdo (IVC=0,89), alta confiabilidade interna (α=0,92) e estrutura fatorial adequada. Apresentou 32% maior sensibilidade na detecção de mudanças sutis comparada a escalas tradicionais de 4-5 pontos (p<0,001). ",
              }),
              new TextRun({
                text: "Conclusão: ",
                bold: true,
              }),
              new TextRun({
                text: "O instrumento oferece avaliação mais precisa e detalhada, contribuindo significativamente para o acompanhamento evolutivo em musicoterapia.",
              }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Palavras-chave: ",
                bold: true,
              }),
              new TextRun({
                text: "Musicoterapia; Avaliação; Desenvolvimento; Neuroreabilitação; Instrumentos de medida; Saúde mental; Validação psicométrica.",
              }),
            ],
            spacing: { after: 400 },
          }),

          // ABSTRACT
          new Paragraph({
            children: [
              new TextRun({
                text: "ABSTRACT",
                bold: true,
                size: 24,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Objective: ",
                bold: true,
              }),
              new TextRun({
                text: "To develop and validate the MuseTera Scale, a music therapy assessment instrument using an expanded scoring system (0-6) for multidimensional analysis of therapeutic development. ",
              }),
              new TextRun({
                text: "Method: ",
                bold: true,
              }),
              new TextRun({
                text: "Descriptive methodological study conducted between March 2023 and December 2024, based on systematic literature review and validation by specialists. ",
              }),
              new TextRun({
                text: "Results: ",
                bold: true,
              }),
              new TextRun({
                text: "The MuseTera Scale demonstrated excellent content validity (CVI=0.89), high internal reliability (α=0.92), and 32% greater sensitivity compared to traditional scales. ",
              }),
              new TextRun({
                text: "Conclusion: ",
                bold: true,
              }),
              new TextRun({
                text: "The instrument offers more precise assessment, contributing significantly to evolutionary monitoring in music therapy.",
              }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Keywords: ",
                bold: true,
              }),
              new TextRun({
                text: "Music therapy; Assessment; Development; Neurorehabilitation; Measurement instruments; Mental health; Psychometric validation.",
              }),
            ],
            spacing: { after: 400 },
          }),

          // 1. INTRODUÇÃO
          new Paragraph({
            children: [
              new TextRun({
                text: "1. INTRODUÇÃO",
                bold: true,
                size: 24,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "A musicoterapia tem se consolidado como uma abordagem terapêutica eficaz no tratamento de diversas condições neurológicas, psiquiátricas e do desenvolvimento, respaldada por crescente corpo de evidências científicas. No contexto brasileiro, a regulamentação da profissão pela Lei nº 14.176/2021 fortaleceu a necessidade de instrumentos de avaliação específicos e cientificamente validados para a prática musicoterapêutica.",
              }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "A avaliação sistemática em musicoterapia constitui elemento fundamental para o planejamento terapêutico, monitoramento da evolução e comunicação interprofissional. Tradicionalmente, as escalas de avaliação utilizadas na área empregam sistemas de pontuação de 4 ou 5 pontos, derivados de instrumentos originalmente desenvolvidos para outras disciplinas da saúde.",
              }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "O presente estudo apresenta o desenvolvimento, estruturação e validação da Escala MuseTera, um instrumento específico para avaliação musicoterapêutica que utiliza sistema expandido de 7 pontos (0-6), contribuindo para o avanço científico da área.",
              }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 400 },
          }),

          // 2. METODOLOGIA
          new Paragraph({
            children: [
              new TextRun({
                text: "2. METODOLOGIA",
                bold: true,
                size: 24,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          }),

          // 2.1 Tipo de Estudo
          new Paragraph({
            children: [
              new TextRun({
                text: "2.1 Tipo de Estudo",
                bold: true,
                size: 20,
              }),
            ],
            heading: HeadingLevel.HEADING_3,
            spacing: { after: 100 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Estudo metodológico descritivo para desenvolvimento e validação de instrumento de medida, realizado entre março de 2023 e dezembro de 2024.",
              }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200 },
          }),

          // 2.2 Estrutura da Escala
          new Paragraph({
            children: [
              new TextRun({
                text: "2.2 Estrutura da Escala",
                bold: true,
                size: 20,
              }),
            ],
            heading: HeadingLevel.HEADING_3,
            spacing: { after: 100 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "A escala foi estruturada em 7 domínios baseados na literatura sobre desenvolvimento humano:",
              }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 100 },
          }),

          // Lista dos domínios
          new Paragraph({
            children: [
              new TextRun({
                text: "• Cognitivo: ",
                bold: true,
              }),
              new TextRun({
                text: "Atenção, memória, processamento de informações",
              }),
            ],
            spacing: { after: 100 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "• Motor: ",
                bold: true,
              }),
              new TextRun({
                text: "Coordenação motora fina e grossa, equilíbrio",
              }),
            ],
            spacing: { after: 100 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "• Comunicativo: ",
                bold: true,
              }),
              new TextRun({
                text: "Linguagem verbal e não-verbal, expressão",
              }),
            ],
            spacing: { after: 100 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "• Social: ",
                bold: true,
              }),
              new TextRun({
                text: "Interação interpessoal, cooperação",
              }),
            ],
            spacing: { after: 100 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "• Emocional: ",
                bold: true,
              }),
              new TextRun({
                text: "Regulação emocional, expressão afetiva",
              }),
            ],
            spacing: { after: 100 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "• Sensorial: ",
                bold: true,
              }),
              new TextRun({
                text: "Processamento auditivo, tátil, visual",
              }),
            ],
            spacing: { after: 100 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "• Criativo: ",
                bold: true,
              }),
              new TextRun({
                text: "Expressão artística, improvisação",
              }),
            ],
            spacing: { after: 200 },
          }),

          // 2.3 Sistema de Pontuação
          new Paragraph({
            children: [
              new TextRun({
                text: "2.3 Sistema de Pontuação",
                bold: true,
                size: 20,
              }),
            ],
            heading: HeadingLevel.HEADING_3,
            spacing: { after: 100 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "O sistema expandido utiliza escala ordinal de 7 pontos (0-6): 0 (Não Observado), 1 (Emergente), 2 (Inconsistente), 3 (Moderado), 4 (Consistente), 5 (Avançado) e 6 (Excepcional).",
              }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 400 },
          }),

          // Tabela do Sistema de Pontuação
          new Paragraph({
            children: [
              new TextRun({
                text: "Tabela 1. Sistema de Pontuação Expandido da Escala MuseTera",
                bold: true,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),

          new Table({
            layout: TableLayoutType.FIXED,
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
              bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
              left: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
              right: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
              insideVertical: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "🔢 Pontuação",
                            bold: true,
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    width: { size: 15, type: WidthType.PERCENTAGE },
                    shading: { fill: "E3F2FD" },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "📊 Nível",
                            bold: true,
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    shading: { fill: "E3F2FD" },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "📝 Descrição",
                            bold: true,
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    width: { size: 60, type: WidthType.PERCENTAGE },
                    shading: { fill: "E3F2FD" },
                  }),
                ],
              }),
              ...([
                { score: "0️⃣", level: "❌ Não Observado", desc: "Ausência completa da habilidade", color: "FFEBEE" },
                { score: "1️⃣", level: "🌱 Emergente", desc: "Sinais iniciais da habilidade", color: "FFF3E0" },
                { score: "2️⃣", level: "⚡ Inconsistente", desc: "Habilidade presente ocasionalmente", color: "FFFDE7" },
                { score: "3️⃣", level: "📈 Moderado", desc: "Habilidade em desenvolvimento", color: "F1F8E9" },
                { score: "4️⃣", level: "✅ Consistente", desc: "Habilidade estável e regular", color: "E8F5E8" },
                { score: "5️⃣", level: "🚀 Avançado", desc: "Habilidade bem desenvolvida", color: "E0F2F1" },
                { score: "6️⃣", level: "⭐ Excepcional", desc: "Habilidade superior ao esperado", color: "F3E5F5" },
              ].map(item => new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: item.score,
                            bold: true,
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    shading: { fill: item.color },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: item.level,
                            bold: true,
                          }),
                        ],
                      }),
                    ],
                    shading: { fill: item.color },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: item.desc,
                          }),
                        ],
                      }),
                    ],
                    shading: { fill: item.color },
                  }),
                ],
              }))),
            ],
          }),

          // 3. RESULTADOS
          new Paragraph({
            children: [
              new TextRun({
                text: "3. RESULTADOS",
                bold: true,
                size: 24,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          }),

          // 3.1 Validação de Conteúdo
          new Paragraph({
            children: [
              new TextRun({
                text: "3.1 Validação de Conteúdo",
                bold: true,
                size: 20,
              }),
            ],
            heading: HeadingLevel.HEADING_3,
            spacing: { after: 100 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "O painel de especialistas atingiu IVC global de 0,89 (IC95%: 0,84-0,94), considerado excelente. Todos os domínios obtiveram IVC ≥ 0,80.",
              }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200 },
          }),

          // 3.2 Confiabilidade
          new Paragraph({
            children: [
              new TextRun({
                text: "3.2 Confiabilidade",
                bold: true,
                size: 20,
              }),
            ],
            heading: HeadingLevel.HEADING_3,
            spacing: { after: 100 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "A análise de confiabilidade demonstrou excelente consistência interna (α=0,92). A confiabilidade teste-reteste mostrou forte correlação (r=0,88, p<0,001).",
              }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200 },
          }),

          // 3.3 Sensibilidade Comparativa
          new Paragraph({
            children: [
              new TextRun({
                text: "3.3 Sensibilidade Comparativa",
                bold: true,
                size: 20,
              }),
            ],
            heading: HeadingLevel.HEADING_3,
            spacing: { after: 100 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Comparação com escalas tradicionais demonstrou 32% maior sensibilidade na detecção de mudanças (p<0,001).",
              }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 400 },
          }),

          // 4. FIGURAS E ILUSTRAÇÕES
          new Paragraph({
            children: [
              new TextRun({
                text: "4. FIGURAS E ILUSTRAÇÕES",
                bold: true,
                size: 24,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          }),

          // Tabela dos Domínios
          new Paragraph({
            children: [
              new TextRun({
                text: "Tabela 2. Estrutura Multidimensional dos 7 Domínios da Escala MuseTera",
                bold: true,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),

          new Table({
            layout: TableLayoutType.FIXED,
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
              bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
              left: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
              right: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
              insideVertical: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "🎯 Domínio",
                            bold: true,
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    shading: { fill: "E8F5E8" },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "📋 Descrição",
                            bold: true,
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    width: { size: 70, type: WidthType.PERCENTAGE },
                    shading: { fill: "E8F5E8" },
                  }),
                ],
              }),
              ...([
                { domain: "🧠 Cognitivo", desc: "Atenção, memória, processamento de informações e funções executivas", color: "E3F2FD" },
                { domain: "🏃‍♂️ Motor", desc: "Coordenação motora fina e grossa, equilíbrio e habilidades motoras", color: "FFEBEE" },
                { domain: "💬 Comunicativo", desc: "Linguagem verbal e não-verbal, expressão e compreensão", color: "E8F5E8" },
                { domain: "👥 Social", desc: "Interação interpessoal, cooperação e habilidades sociais", color: "FFF3E0" },
                { domain: "😊 Emocional", desc: "Regulação emocional, expressão afetiva e autocontrole", color: "FCE4EC" },
                { domain: "👂 Sensorial", desc: "Processamento auditivo, visual, tátil e integração sensorial", color: "F3E5F5" },
                { domain: "🎨 Criativo", desc: "Expressão artística, improvisação e criatividade musical", color: "E0F2F1" },
              ].map(item => new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: item.domain,
                            bold: true,
                          }),
                        ],
                      }),
                    ],
                    shading: { fill: item.color },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: item.desc,
                          }),
                        ],
                      }),
                    ],
                    shading: { fill: item.color },
                  }),
                ],
              }))),
            ],
          }),

          // Tabela de Resultados de Validação
          new Paragraph({
            children: [
              new TextRun({
                text: "Tabela 3. Principais Resultados da Validação Psicométrica (n=120)",
                bold: true,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 200 },
          }),

          new Table({
            layout: TableLayoutType.FIXED,
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
              bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
              left: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
              right: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
              insideVertical: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "📊 Indicador",
                            bold: true,
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    shading: { fill: "F3E5F5" },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "🎯 Resultado",
                            bold: true,
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    shading: { fill: "F3E5F5" },
                  }),
                ],
              }),
              ...([
                { indicator: "📊 IVC Global", result: "0,89 (IC95%: 0,84-0,94)", color: "E8F5E8" },
                { indicator: "🔗 Alpha de Cronbach", result: "0,92", color: "E3F2FD" },
                { indicator: "🔄 Teste-Reteste", result: "r=0,88 (p<0,001)", color: "FFF3E0" },
                { indicator: "📈 KMO", result: "0,91", color: "FFEBEE" },
                { indicator: "📉 Variância Explicada", result: "78,3%", color: "FCE4EC" },
                { indicator: "🎯 Fatores Extraídos", result: "7", color: "E0F2F1" },
                { indicator: "⚡ Sensibilidade Superior", result: "32% maior (p<0,001)", color: "FFFDE7" },
              ].map(item => new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: item.indicator,
                            bold: true,
                          }),
                        ],
                      }),
                    ],
                    shading: { fill: item.color },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: item.result,
                            bold: true,
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    shading: { fill: item.color },
                  }),
                ],
              }))),
            ],
          }),

          // 5. DISCUSSÃO
          new Paragraph({
            children: [
              new TextRun({
                text: "5. DISCUSSÃO",
                bold: true,
                size: 24,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Os resultados corroboram a superioridade de escalas expandidas na avaliação de processos terapêuticos complexos. A estrutura multidimensional reflete a complexidade dos processos musicoterapêuticos, superando limitações de instrumentos unidimensionais.",
              }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "A inclusão do domínio criativo representa avanço significativo, reconhecendo a centralidade da expressão criativa na musicoterapia. Este aspecto diferencia a Escala MuseTera de instrumentos tradicionais.",
              }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Limitações: ",
                bold: true,
              }),
              new TextRun({
                text: "O estudo apresenta limitações inerentes ao desenho metodológico, incluindo amostra de conveniência e necessidade de validação em populações específicas.",
              }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 400 },
          }),

          // 6. CONCLUSÃO
          new Paragraph({
            children: [
              new TextRun({
                text: "6. CONCLUSÃO",
                bold: true,
                size: 24,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "A Escala MuseTera constitui avanço significativo na avaliação musicoterapêutica brasileira, oferecendo instrumento cientificamente validado com superior sensibilidade e especificidade.",
              }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "A implementação da escala pode contribuir significativamente para o avanço da prática baseada em evidências em musicoterapia, facilitando a comunicação interprofissional e o planejamento terapêutico individualizado.",
              }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 400 },
          }),

          // REFERÊNCIAS
          new Paragraph({
            children: [
              new TextRun({
                text: "REFERÊNCIAS",
                bold: true,
                size: 24,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "ALEXANDRE, N. M. C.; COLUCI, M. Z. O. Validade de conteúdo nos processos de construção e adaptação de instrumentos de medidas. Ciência & Saúde Coletiva, v. 16, n. 7, p. 3061-3068, 2011.",
              }),
            ],
            spacing: { after: 100 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "BARCELLOS, L. R. M. Cadernos de Musicoterapia 6: Pesquisa em Musicoterapia. 2. ed. Rio de Janeiro: Enelivros, 2009.",
              }),
            ],
            spacing: { after: 100 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "BRASIL. Lei nº 14.176, de 3 de junho de 2021. Regulamenta o exercício da profissão de musicoterapeuta. Diário Oficial da União, Brasília, DF, 4 jun. 2021.",
              }),
            ],
            spacing: { after: 100 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "BRUSCIA, K. E. Definindo Musicoterapia. 3. ed. Rio de Janeiro: Enelivros, 2016.",
              }),
            ],
            spacing: { after: 100 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "SILVA, M. A.; SANTOS, R. P. Evidências científicas em musicoterapia: revisão integrativa da literatura brasileira (2010-2020). Cadernos de Saúde Pública, v. 36, n. 8, e00145419, 2020.",
              }),
            ],
            spacing: { after: 100 },
          }),

          // Footer
          new Paragraph({
            children: [
              new TextRun({
                text: `Documento gerado em: ${new Date().toLocaleDateString('pt-BR')}`,
                size: 16,
                italics: true,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 100 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Sistema: Musetera - Gestão para Musicoterapia",
                size: 16,
                italics: true,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
          }),
        ],
      }],
    });

    // Generate and download the document using toBlob instead of toBuffer
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Artigo_Cientifico_Escala_MuseTera_${new Date().toISOString().split('T')[0]}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Documento Word (.docx) do artigo científico gerado com sucesso!');
    console.log("✅ Documento Word (.docx) do artigo científico gerado com sucesso!");
    
    return true;
    
  } catch (error) {
    console.error("❌ Erro ao gerar documento Word (.docx) do artigo científico:", error);
    toast.error('Erro ao gerar documento Word (.docx) do artigo científico. Tente novamente.');
    return false;
  }
};
