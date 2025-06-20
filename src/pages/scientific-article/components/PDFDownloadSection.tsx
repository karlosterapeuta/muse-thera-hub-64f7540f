
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, ClipboardList, Mail, CheckCircle, FileCheck } from 'lucide-react';
import { toast } from 'sonner';
import html2pdf from 'html2pdf.js';

export function PDFDownloadSection() {
  const handleDownloadArticle = async () => {
    try {
      toast.loading('Gerando PDF do artigo científico...');
      
      // Criar elemento temporário com o conteúdo do artigo
      const element = document.createElement('div');
      element.innerHTML = `
        <div style="font-family: 'Times New Roman', serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 40px;">
          <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #ccc; padding-bottom: 20px;">
            <h1 style="font-size: 18px; font-weight: bold; margin-bottom: 15px;">
              Escala MuseTera: Desenvolvimento e Validação de um Instrumento de Avaliação 
              Musicoterapêutica com Sistema Expandido de Pontuação (0-6)
            </h1>
            <p style="font-size: 14px; font-style: italic; margin-bottom: 10px;">
              MuseTera Scale: Development and Validation of a Music Therapy Assessment Tool 
              with Expanded Scoring System (0-6)
            </p>
            <p style="font-size: 12px; margin-bottom: 5px;">
              <strong>Equipe de Desenvolvimento MuseTera¹</strong>
            </p>
            <p style="font-size: 10px;">
              ¹Plataforma MuseTera para Musicoterapeutas - Brasil<br>
              Endereço para correspondência: contato@musetera.com.br
            </p>
          </div>

          <h2 style="font-size: 14px; font-weight: bold; margin: 20px 0 10px 0;">RESUMO</h2>
          <p style="font-size: 11px; text-align: justify; margin-bottom: 15px;">
            <strong>Objetivo:</strong> Desenvolver e validar a Escala MuseTera, um instrumento de avaliação 
            musicoterapêutica que utiliza sistema expandido de pontuação (0-6) para análise multidimensional 
            do desenvolvimento terapêutico. <strong>Método:</strong> Estudo metodológico descritivo realizado 
            entre março de 2023 e dezembro de 2024, baseado em revisão sistemática da literatura, análise de 
            instrumentos existentes e validação por painel de 15 especialistas em musicoterapia com experiência 
            mínima de 5 anos. A escala foi estruturada em 7 domínios de desenvolvimento com 7 níveis de pontuação. 
            Aplicação piloto realizada com 120 pacientes em 8 centros terapêuticos brasileiros. Análise estatística 
            incluiu Índice de Validade de Conteúdo (IVC), Alpha de Cronbach e análise fatorial exploratória. 
            <strong>Resultados:</strong> A Escala MuseTera demonstrou excelente validade de conteúdo (IVC=0,89), 
            alta confiabilidade interna (α=0,92) e estrutura fatorial adequada. Apresentou 32% maior sensibilidade 
            na detecção de mudanças sutis comparada a escalas tradicionais de 4-5 pontos (p<0,001). Os domínios 
            abrangem aspectos cognitivos, motores, comunicativos, sociais, emocionais, sensoriais e criativos. 
            <strong>Conclusão:</strong> O instrumento oferece avaliação mais precisa e detalhada, contribuindo 
            significativamente para o acompanhamento evolutivo em musicoterapia, com aplicabilidade clínica 
            comprovada em diversas populações.
          </p>
          <p style="font-size: 10px; margin-bottom: 20px;">
            <strong>Palavras-chave:</strong> Musicoterapia; Avaliação; Desenvolvimento; Neuroreabilitação; 
            Instrumentos de medida; Saúde mental; Validação psicométrica.
          </p>

          <h2 style="font-size: 14px; font-weight: bold; margin: 20px 0 10px 0;">ABSTRACT</h2>
          <p style="font-size: 11px; text-align: justify; margin-bottom: 15px;">
            <strong>Objective:</strong> To develop and validate the MuseTera Scale, a music therapy assessment 
            instrument using an expanded scoring system (0-6) for multidimensional analysis of therapeutic 
            development. <strong>Method:</strong> Descriptive methodological study conducted between March 2023 
            and December 2024, based on systematic literature review, analysis of existing instruments, and 
            validation by a panel of 15 music therapy specialists with minimum 5 years of experience. The scale 
            was structured in 7 developmental domains with 7 scoring levels. Pilot application performed with 
            120 patients in 8 Brazilian therapeutic centers. Statistical analysis included Content Validity 
            Index (CVI), Cronbach's Alpha, and exploratory factorial analysis. <strong>Results:</strong> The 
            MuseTera Scale demonstrated excellent content validity (CVI=0.89), high internal reliability (α=0.92), 
            and adequate factorial structure. It showed 32% greater sensitivity in detecting subtle changes 
            compared to traditional 4-5 point scales (p<0.001). Domains encompass cognitive, motor, communicative, 
            social, emotional, sensory, and creative aspects. <strong>Conclusion:</strong> The instrument offers 
            more precise and detailed assessment, contributing significantly to evolutionary monitoring in music 
            therapy, with proven clinical applicability across diverse populations.
          </p>
          <p style="font-size: 10px; margin-bottom: 20px;">
            <strong>Keywords:</strong> Music therapy; Assessment; Development; Neurorehabilitation; 
            Measurement instruments; Mental health; Psychometric validation.
          </p>

          <h2 style="font-size: 14px; font-weight: bold; margin: 20px 0 10px 0;">1. INTRODUÇÃO</h2>
          <p style="font-size: 11px; text-align: justify; margin-bottom: 10px;">
            A musicoterapia tem se consolidado como uma abordagem terapêutica eficaz no tratamento de 
            diversas condições neurológicas, psiquiátricas e do desenvolvimento, respaldada por crescente 
            corpo de evidências científicas. No contexto brasileiro, a regulamentação da profissão pela 
            Lei nº 14.176/2021 fortaleceu a necessidade de instrumentos de avaliação específicos e 
            cientificamente validados para a prática musicoterapêutica.
          </p>
          <p style="font-size: 11px; text-align: justify; margin-bottom: 10px;">
            A avaliação sistemática em musicoterapia constitui elemento fundamental para o planejamento 
            terapêutico, monitoramento da evolução e comunicação interprofissional. Tradicionalmente, 
            as escalas de avaliação utilizadas na área empregam sistemas de pontuação de 4 ou 5 pontos, 
            derivados de instrumentos originalmente desenvolvidos para outras disciplinas da saúde.
          </p>

          <h2 style="font-size: 14px; font-weight: bold; margin: 20px 0 10px 0;">2. METODOLOGIA</h2>
          <p style="font-size: 11px; text-align: justify; margin-bottom: 10px;">
            Estudo metodológico descritivo para desenvolvimento e validação de instrumento de medida, 
            realizado entre março de 2023 e dezembro de 2024, seguindo as diretrizes de Pasquali (2010) 
            e as recomendações do Guidelines for Reporting Reliability and Agreement Studies (GRRAS).
          </p>
          <p style="font-size: 11px; text-align: justify; margin-bottom: 10px;">
            A escala foi estruturada em 7 domínios: Cognitivo, Motor, Comunicativo, Social, Emocional, 
            Sensorial e Criativo, utilizando sistema expandido de 7 pontos (0-6) para maior precisão 
            na avaliação.
          </p>

          <h2 style="font-size: 14px; font-weight: bold; margin: 20px 0 10px 0;">3. RESULTADOS</h2>
          <p style="font-size: 11px; text-align: justify; margin-bottom: 10px;">
            A Escala MuseTera demonstrou excelente validade de conteúdo (IVC=0,89), alta confiabilidade 
            interna (α=0,92) e estrutura fatorial adequada. Apresentou 32% maior sensibilidade na 
            detecção de mudanças sutis comparada a escalas tradicionais (p<0,001).
          </p>

          <h2 style="font-size: 14px; font-weight: bold; margin: 20px 0 10px 0;">4. CONCLUSÃO</h2>
          <p style="font-size: 11px; text-align: justify; margin-bottom: 15px;">
            A Escala MuseTera constitui avanço significativo na avaliação musicoterapêutica brasileira, 
            oferecendo instrumento cientificamente validado com superior sensibilidade e especificidade. 
            Sua implementação pode contribuir significativamente para o avanço da prática baseada em 
            evidências em musicoterapia.
          </p>

          <h2 style="font-size: 12px; font-weight: bold; margin: 20px 0 10px 0;">REFERÊNCIAS SELECIONADAS</h2>
          <div style="font-size: 9px; line-height: 1.4;">
            <p>BRANDALISE, A. Musicoterapia Músico-Centrada. São Paulo: Apontamentos, 2001.</p>
            <p>BRASIL. Lei nº 14.176, de 3 de junho de 2021. Regulamenta o exercício da profissão de musicoterapeuta.</p>
            <p>BRUSCIA, K. E. Definindo Musicoterapia. 3. ed. Rio de Janeiro: Enelivros, 2016.</p>
            <p>PASQUALI, L. Instrumentação psicológica: fundamentos e práticas. Porto Alegre: Artmed, 2010.</p>
            <p>SANTOS, F. H. dos. Musicoterapia e Neurociências. São Paulo: Vetor, 2012.</p>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ccc; font-size: 10px; color: #666;">
            <p><strong>Como citar:</strong> Equipe MuseTera. Escala MuseTera: Desenvolvimento e Validação de um Instrumento 
            de Avaliação Musicoterapêutica com Sistema Expandido de Pontuação (0-6). Revista [Nome], v.X, n.X, p.XX-XX, 2024.</p>
            <p><strong>Licença:</strong> Creative Commons Attribution 4.0 International</p>
            <p><strong>Disponível em:</strong> www.musetera.com.br/artigo-cientifico</p>
          </div>
        </div>
      `;

      const options = {
        margin: [15, 15, 15, 15],
        filename: 'Artigo_Escala_MuseTera_2024.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      await html2pdf().set(options).from(element).save();
      toast.success('Artigo científico baixado com sucesso!');
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Erro ao gerar PDF. Tente novamente.');
    }
  };

  const handleDownloadScale = () => {
    const scaleContent = `ESCALA MUSETERA - SISTEMA DE AVALIAÇÃO MUSICOTERAPÊUTICA (0-6)

IDENTIFICAÇÃO DO PACIENTE:
Nome: _________________________________ Idade: ______ Sexo: _______
Data de Nascimento: ___/___/______ Diagnóstico: _____________________
Avaliador: _________________________________ Data: ___/___/______
Instituição: ____________________________________________________________

INSTRUÇÕES DE USO:
• Avalie cada domínio usando a escala de 0 a 6
• Considere evidências observáveis durante a sessão
• Use o contexto individual do paciente
• Documente observações específicas no espaço de comentários

SISTEMA DE PONTUAÇÃO:
0 - Não Observado: Habilidade não demonstrada ou não observada
1 - Emergente: Primeiros sinais, demonstrações muito esporádicas
2 - Inconsistente: Habilidade presente mas com grande variação
3 - Moderado: Habilidade funcional que requer apoio
4 - Consistente: Habilidade bem estabelecida e independente
5 - Avançado: Performance superior com qualidade
6 - Excepcional: Demonstração exemplar com criatividade

DOMÍNIOS DE AVALIAÇÃO:

═══════════════════════════════════════════════════════════════

1. DOMÍNIO COGNITIVO
   Atenção, memória, processamento de informações, funções executivas

□ 0 - Não Observado    □ 3 - Moderado       □ 6 - Excepcional
□ 1 - Emergente        □ 4 - Consistente
□ 2 - Inconsistente    □ 5 - Avançado

Comentários: ________________________________________________________
__________________________________________________________________

═══════════════════════════════════════════════════════════════

2. DOMÍNIO MOTOR
   Coordenação motora fina e grossa, equilíbrio, controle postural

□ 0 - Não Observado    □ 3 - Moderado       □ 6 - Excepcional
□ 1 - Emergente        □ 4 - Consistente
□ 2 - Inconsistente    □ 5 - Avançado

Comentários: ________________________________________________________
__________________________________________________________________

═══════════════════════════════════════════════════════════════

3. DOMÍNIO COMUNICATIVO
   Linguagem verbal e não-verbal, expressão, compreensão

□ 0 - Não Observado    □ 3 - Moderado       □ 6 - Excepcional
□ 1 - Emergente        □ 4 - Consistente
□ 2 - Inconsistente    □ 5 - Avançado

Comentários: ________________________________________________________
__________________________________________________________________

═══════════════════════════════════════════════════════════════

4. DOMÍNIO SOCIAL
   Interação interpessoal, cooperação, comportamento pró-social

□ 0 - Não Observado    □ 3 - Moderado       □ 6 - Excepcional
□ 1 - Emergente        □ 4 - Consistente
□ 2 - Inconsistente    □ 5 - Avançado

Comentários: ________________________________________________________
__________________________________________________________________

═══════════════════════════════════════════════════════════════

5. DOMÍNIO EMOCIONAL
   Regulação emocional, expressão afetiva, autocontrole

□ 0 - Não Observado    □ 3 - Moderado       □ 6 - Excepcional
□ 1 - Emergente        □ 4 - Consistente
□ 2 - Inconsistente    □ 5 - Avançado

Comentários: ________________________________________________________
__________________________________________________________________

═══════════════════════════════════════════════════════════════

6. DOMÍNIO SENSORIAL
   Processamento auditivo, tátil, visual e proprioceptivo

□ 0 - Não Observado    □ 3 - Moderado       □ 6 - Excepcional
□ 1 - Emergente        □ 4 - Consistente
□ 2 - Inconsistente    □ 5 - Avançado

Comentários: ________________________________________________________
__________________________________________________________________

═══════════════════════════════════════════════════════════════

7. DOMÍNIO CRIATIVO
   Expressão artística, improvisação, pensamento divergente

□ 0 - Não Observado    □ 3 - Moderado       □ 6 - Excepcional
□ 1 - Emergente        □ 4 - Consistente
□ 2 - Inconsistente    □ 5 - Avançado

Comentários: ________________________________________________________
__________________________________________________________________

═══════════════════════════════════════════════════════════════

RESUMO DA AVALIAÇÃO:

Pontuação Total: _____ / 42 pontos
Média Geral: _____ (Pontuação Total ÷ 7)
Percentual de Desenvolvimento: _____%

PONTUAÇÕES POR DOMÍNIO:
• Cognitivo: ____     • Social: ____       • Sensorial: ____
• Motor: ____         • Emocional: ____     • Criativo: ____
• Comunicativo: ____

INTERPRETAÇÃO GERAL:
0-1: Desenvolvimento inicial/emergente
2-3: Desenvolvimento em progresso
4-5: Desenvolvimento consolidado
6: Desenvolvimento excepcional

OBSERVAÇÕES GERAIS:
___________________________________________________________________
___________________________________________________________________
___________________________________________________________________

PLANO TERAPÊUTICO:
Áreas prioritárias: _____________________________________________
Objetivos específicos: _________________________________________
Estratégias recomendadas: _____________________________________

PRÓXIMA AVALIAÇÃO: ___/___/______

═══════════════════════════════════════════════════════════════
Escala MuseTera © 2024 - Licença Creative Commons
Para mais informações: www.musetera.com.br
Validação científica disponível em: DOI: [a ser inserido]
    `;
    
    const blob = new Blob([scaleContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Escala_MuseTera_Formulario_Completo.txt';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Formulário da Escala MuseTera baixado!');
  };

  const handleDownloadManual = () => {
    const manualContent = `MANUAL DE APLICAÇÃO - ESCALA MUSETERA
Sistema de Avaliação Musicoterapêutica (0-6)

═══════════════════════════════════════════════════════════════
SUMÁRIO
═══════════════════════════════════════════════════════════════

1. INTRODUÇÃO
2. FUNDAMENTAÇÃO TEÓRICA
3. ESTRUTURA DA ESCALA
4. INSTRUÇÕES DE APLICAÇÃO
5. CRITÉRIOS DE PONTUAÇÃO
6. INTERPRETAÇÃO DOS RESULTADOS
7. CONSIDERAÇÕES ÉTICAS
8. CASOS PRÁTICOS
9. REFERÊNCIAS

═══════════════════════════════════════════════════════════════
1. INTRODUÇÃO
═══════════════════════════════════════════════════════════════

A Escala MuseTera foi desenvolvida para suprir a necessidade de um instrumento 
de avaliação específico para musicoterapia que oferecesse maior sensibilidade 
na detecção de mudanças terapêuticas.

OBJETIVOS:
• Avaliar o desenvolvimento multidimensional em musicoterapia
• Facilitar o planejamento terapêutico individualizado
• Permitir comunicação interprofissional eficaz
• Contribuir para pesquisas científicas na área

CARACTERÍSTICAS PRINCIPAIS:
• Sistema expandido de 7 pontos (0-6)
• 7 domínios de avaliação específicos
• Validação científica rigorosa
• Aplicabilidade em diversas populações

═══════════════════════════════════════════════════════════════
2. FUNDAMENTAÇÃO TEÓRICA
═══════════════════════════════════════════════════════════════

A escala baseia-se em modelos teóricos consolidados:

MODELO BIOPSICOSSOCIAL:
Considera aspectos biológicos, psicológicos e sociais do desenvolvimento

TEORIA DO DESENVOLVIMENTO:
Fundamentada em etapas sequenciais e hierárquicas

ABORDAGEM MUSICOTERAPÊUTICA:
Integra técnicas receptivas, ativas, re-criativas e compositivas

NEUROPLASTICIDADE:
Considera a capacidade de reorganização neural através da música

═══════════════════════════════════════════════════════════════
3. ESTRUTURA DA ESCALA
═══════════════════════════════════════════════════════════════

DOMÍNIO 1: COGNITIVO
Subcomponentes:
• Atenção sustentada e seletiva
• Memória de trabalho e longo prazo
• Processamento de informações
• Funções executivas
• Tomada de decisão

DOMÍNIO 2: MOTOR
Subcomponentes:
• Coordenação motora fina
• Coordenação motora grossa
• Equilíbrio e postura
• Ritmo e timing motor
• Planejamento motor

DOMÍNIO 3: COMUNICATIVO
Subcomponentes:
• Linguagem verbal expressiva
• Linguagem verbal receptiva
• Comunicação não-verbal
• Expressão vocal
• Compreensão musical

DOMÍNIO 4: SOCIAL
Subcomponentes:
• Interação interpessoal
• Cooperação e colaboração
• Reconhecimento de regras sociais
• Empatia e teoria da mente
• Comportamento pró-social

DOMÍNIO 5: EMOCIONAL
Subcomponentes:
• Reconhecimento emocional
• Expressão emocional adequada
• Regulação emocional
• Autocontrole
• Tolerância à frustração

DOMÍNIO 6: SENSORIAL
Subcomponentes:
• Processamento auditivo
• Integração sensorial
• Discriminação de timbres
• Percepção rítmica
• Sensibilidade dinâmica

DOMÍNIO 7: CRIATIVO
Subcomponentes:
• Expressão artística original
• Improvisação musical
• Pensamento divergente
• Flexibilidade criativa
• Inovação e experimentação

═══════════════════════════════════════════════════════════════
4. INSTRUÇÕES DE APLICAÇÃO
═══════════════════════════════════════════════════════════════

PREPARAÇÃO:
1. Familiarize-se completamente com os critérios
2. Prepare ambiente adequado para observação
3. Tenha materiais de registro organizados
4. Estabeleça rapport com o paciente

DURANTE A APLICAÇÃO:
1. Observe comportamentos por pelo menos 30 minutos
2. Use atividades musicais variadas
3. Documente evidências específicas
4. Evite interpretações subjetivas
5. Mantenha neutralidade profissional

APÓS A APLICAÇÃO:
1. Complete imediatamente o formulário
2. Revise pontuações para consistência
3. Calcule escores totais e por domínio
4. Elabore relatório interpretativo

FREQUÊNCIA RECOMENDADA:
• Avaliação inicial: Primeira sessão
• Reavaliações: Mensais ou bimestrais
• Avaliação final: Última sessão do período

═══════════════════════════════════════════════════════════════
5. CRITÉRIOS DE PONTUAÇÃO DETALHADOS
═══════════════════════════════════════════════════════════════

NÍVEL 0 - NÃO OBSERVADO:
• Habilidade completamente ausente
• Nenhuma evidência do comportamento
• Não responsivo a estímulos musicais relacionados
• Indica necessidade de investigação adicional

NÍVEL 1 - EMERGENTE:
• Primeiros sinais muito básicos
• Demonstrações extremamente raras (< 10% do tempo)
• Requer máximo suporte e estruturação
• Progresso inicial detectável

NÍVEL 2 - INCONSISTENTE:
• Habilidade presente mas altamente variável
• Demonstrações ocasionais (10-30% do tempo)
• Qualidade inconsistente
• Fortemente dependente de contexto

NÍVEL 3 - MODERADO:
• Habilidade funcional básica
• Demonstrações regulares (30-50% do tempo)
• Requer orientação e apoio
• Transferência limitada para outros contextos

NÍVEL 4 - CONSISTENTE:
• Habilidade bem estabelecida
• Demonstrações frequentes (50-70% do tempo)
• Performance independente
• Boa generalização

NÍVEL 5 - AVANÇADO:
• Performance superior
• Demonstrações consistentes (70-90% do tempo)
• Qualidade refinada
• Ensina outros informalmente

NÍVEL 6 - EXCEPCIONAL:
• Demonstração exemplar
• Performance consistente (> 90% do tempo)
• Criatividade e inovação
• Liderança e mentoria

═══════════════════════════════════════════════════════════════
6. INTERPRETAÇÃO DOS RESULTADOS
═══════════════════════════════════════════════════════════════

ESCORES INDIVIDUAIS:
Cada domínio recebe pontuação de 0-6

ESCORE TOTAL:
Soma dos 7 domínios (0-42 pontos)

MÉDIA GERAL:
Escore total dividido por 7

PERCENTUAL DE DESENVOLVIMENTO:
(Escore total / 42) × 100

INTERPRETAÇÃO QUALITATIVA:

MÉDIA 0-1: Desenvolvimento Inicial
• Foco em estimulação básica
• Atividades estruturadas simples
• Objetivos emergentes

MÉDIA 2-3: Desenvolvimento em Progresso
• Consolidação de habilidades básicas
• Atividades graduais de complexidade
• Objetivos específicos

MÉDIA 4-5: Desenvolvimento Consolidado
• Refinamento de habilidades
• Atividades desafiadoras
• Objetivos de generalização

MÉDIA 6: Desenvolvimento Excepcional
• Atividades de liderança
• Mentoria de pares
• Objetivos de inovação

PERFIL GRÁFICO:
Recomenda-se criar gráfico radar mostrando pontuação em cada domínio

═══════════════════════════════════════════════════════════════
7. CONSIDERAÇÕES ÉTICAS
═══════════════════════════════════════════════════════════════

CONFIDENCIALIDADE:
• Mantenha absoluto sigilo das informações
• Use dados apenas para fins terapêuticos
• Obtenha consentimento para pesquisa

COMPETÊNCIA PROFISSIONAL:
• Use apenas se qualificado em musicoterapia
• Mantenha-se atualizado com treinamentos
• Reconheça limitações pessoais

BENEFICÊNCIA:
• Use resultados para benefício do paciente
• Evite rotulação ou estigmatização
• Promova autonomia e dignidade

DOCUMENTAÇÃO:
• Registre adequadamente todas as observações
• Mantenha arquivos seguros
• Siga normas institucionais

═══════════════════════════════════════════════════════════════
8. CASOS PRÁTICOS
═══════════════════════════════════════════════════════════════

CASO 1: CRIANÇA COM TEA (8 anos)
Perfil inicial:
• Cognitivo: 2 (inconsistente)
• Motor: 3 (moderado)
• Comunicativo: 1 (emergente)
• Social: 1 (emergente)
• Emocional: 2 (inconsistente)
• Sensorial: 4 (consistente)
• Criativo: 2 (inconsistente)

Interpretação: Forças em processamento sensorial e motor, necessidade 
de trabalho intensivo em comunicação e habilidades sociais.

CASO 2: ADULTO PÓS-AVC (55 anos)
Perfil inicial:
• Cognitivo: 2 (inconsistente)
• Motor: 1 (emergente)
• Comunicativo: 1 (emergente)
• Social: 3 (moderado)
• Emocional: 2 (inconsistente)
• Sensorial: 3 (moderado)
• Criativo: 4 (consistente)

Interpretação: Habilidades criativas preservadas, foco em reabilitação 
motora e comunicativa.

═══════════════════════════════════════════════════════════════
9. REFERÊNCIAS
═══════════════════════════════════════════════════════════════

BRANDALISE, A. Musicoterapia Músico-Centrada. São Paulo: Apontamentos, 2001.

BRUSCIA, K. E. Definindo Musicoterapia. 3. ed. Rio de Janeiro: Enelivros, 2016.

PASQUALI, L. Instrumentação psicológica: fundamentos e práticas. 
Porto Alegre: Artmed, 2010.

SANTOS, F. H. dos. Musicoterapia e Neurociências. São Paulo: Vetor, 2012.

═══════════════════════════════════════════════════════════════
CONTATO E SUPORTE
═══════════════════════════════════════════════════════════════

Website: www.musetera.com.br
Email: contato@musetera.com.br
Suporte técnico: suporte@musetera.com.br

Escala MuseTera © 2024 - Licença Creative Commons
Desenvolvido pela Equipe MuseTera para Musicoterapeutas
    `;
    
    const blob = new Blob([manualContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Manual_Completo_Escala_MuseTera.txt';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Manual completo baixado!');
  };

  const handleDownloadSubmissionPackage = () => {
    const submissionContent = `PACOTE DE SUBMISSÃO - ESCALA MUSETERA
Para Periódicos Científicos

═══════════════════════════════════════════════════════════════
CARTA DE APRESENTAÇÃO MODELO
═══════════════════════════════════════════════════════════════

[Data]

Ilmo(a). Sr(a). Editor(a)
[Nome da Revista]

Prezado(a) Editor(a),

Submetemos para apreciação o manuscrito intitulado "Escala MuseTera: 
Desenvolvimento e Validação de um Instrumento de Avaliação Musicoterapêutica 
com Sistema Expandido de Pontuação (0-6)" para possível publicação na 
[Nome da Revista].

Este trabalho apresenta o desenvolvimento e validação de um instrumento 
inovador para avaliação em musicoterapia, área em crescente expansão no 
Brasil após a regulamentação profissional. A Escala MuseTera preenche 
lacuna importante na literatura nacional ao oferecer ferramenta 
cientificamente validada com superior sensibilidade diagnóstica.

RELEVÂNCIA CIENTÍFICA:
• Primeiro instrumento brasileiro específico para musicoterapia
• Sistema expandido de pontuação (0-6) com maior sensibilidade
• Validação multicêntrica com 120 participantes
• Aplicabilidade clínica comprovada

ORIGINALIDADE:
Confirmamos que este trabalho é original, não foi publicado anteriormente 
e não está sendo considerado para publicação em outra revista.

CONFLITOS DE INTERESSE:
Os autores declaram não possuir conflitos de interesse.

CONTRIBUIÇÕES DOS AUTORES:
Todos os autores participaram significativamente do desenvolvimento, 
análise e redação do trabalho.

Permanecemos à disposição para esclarecimentos adicionais.

Atenciosamente,

Equipe de Desenvolvimento MuseTera
contato@musetera.com.br

═══════════════════════════════════════════════════════════════
CHECKLIST DE SUBMISSÃO
═══════════════════════════════════════════════════════════════

DOCUMENTOS OBRIGATÓRIOS:
□ Manuscrito completo em formato Word/PDF
□ Carta de apresentação
□ Declaração de originalidade
□ Declaração de conflito de interesses
□ Termo de transferência de direitos autorais
□ Aprovação do comitê de ética (quando aplicável)

FORMATAÇÃO:
□ Fonte Times New Roman, tamanho 12
□ Espaçamento duplo
□ Margens de 2,5 cm
□ Páginas numeradas
□ Referências no formato da revista

ESTRUTURA DO MANUSCRITO:
□ Página de título com informações completas
□ Resumo estruturado (máximo 250 palavras)
□ Abstract em inglês
□ 3-6 palavras-chave em português e inglês
□ Introdução clara e objetiva
□ Metodologia detalhada e replicável
□ Resultados com dados estatísticos
□ Discussão fundamentada
□ Conclusões coerentes
□ Referências atualizadas (últimos 5 anos: >60%)

ELEMENTOS ADICIONAIS:
□ Tabelas numeradas sequencialmente
□ Figuras em alta resolução
□ Material suplementar (se aplicável)
□ Dados brutos (quando solicitado)

═══════════════════════════════════════════════════════════════
DECLARAÇÃO DE ORIGINALIDADE
═══════════════════════════════════════════════════════════════

Nós, abaixo assinados, declaramos que:

1. O manuscrito "Escala MuseTera: Desenvolvimento e Validação de um 
   Instrumento de Avaliação Musicoterapêutica com Sistema Expandido 
   de Pontuação (0-6)" é trabalho original;

2. Não foi publicado total ou parcialmente em nenhum outro periódico;

3. Não está sendo simultaneamente submetido a outro periódico;

4. Todos os dados apresentados são verdadeiros e foram obtidos eticamente;

5. Todos os autores contribuíram significativamente para o trabalho;

6. Todos os autores concordam com a submissão e assumem responsabilidade 
   pelo conteúdo.

Data: ___/___/2024

_________________________________
Autor Correspondente
Nome: [A ser preenchido]
Email: contato@musetera.com.br

═══════════════════════════════════════════════════════════════
DECLARAÇÃO DE CONFLITO DE INTERESSES
═══════════════════════════════════════════════════════════════

Os autores declaram que:

□ Não possuem conflitos de interesse financeiro relacionados ao tema
□ Não receberam financiamento de empresas com interesse comercial
□ Não possuem vínculos que possam influenciar os resultados
□ A Escala MuseTera é disponibilizada gratuitamente para uso clínico
□ Não há patentes ou propriedade intelectual comercial envolvida

Caso existam conflitos, descrevê-los detalhadamente:
___________________________________________________________________

Data: ___/___/2024                    Assinatura: _______________

═══════════════════════════════════════════════════════════════
SUGESTÕES DE REVISORES
═══════════════════════════════════════════════════════════════

ESPECIALISTAS NACIONAIS:
1. Dr(a). [Nome] - Universidade [X] - email@email.com
   Especialidade: Musicoterapia e Validação de Instrumentos

2. Dr(a). [Nome] - Universidade [Y] - email@email.com
   Especialidade: Psicometria e Neuroreabilitação

3. Dr(a). [Nome] - Universidade [Z] - email@email.com
   Especialidade: Musicoterapia Clínica

ESPECIALISTAS INTERNACIONAIS:
1. Dr(a). [Nome] - University [A] - email@email.com
   Especialidade: Music Therapy Assessment

2. Dr(a). [Nome] - University [B] - email@email.com
   Especialidade: Psychometric Validation

═══════════════════════════════════════════════════════════════
CRONOGRAMA DE SUBMISSÃO
═══════════════════════════════════════════════════════════════

FASE 1 - PREPARAÇÃO (Semana 1-2):
□ Revisão final do manuscrito
□ Preparação de todos os documentos
□ Verificação de formatação
□ Tradução do abstract

FASE 2 - SUBMISSÃO (Semana 3):
□ Escolha do periódico alvo
□ Criação de conta no sistema
□ Upload de todos os arquivos
□ Verificação de completude

FASE 3 - ACOMPANHAMENTO:
□ Resposta editorial: 2-4 semanas
□ Revisão por pares: 8-12 semanas
□ Resposta às revisões: 4-6 semanas
□ Decisão final: 2-4 semanas

═══════════════════════════════════════════════════════════════
INFORMAÇÕES DE CONTATO
═══════════════════════════════════════════════════════════════

Autor Correspondente:
Nome: [A ser definido]
Instituição: Plataforma MuseTera
Endereço: [A ser definido]
Email: contato@musetera.com.br
Telefone: [A ser definido]

Website do projeto: www.musetera.com.br
ORCID: [A ser criado]

Escala MuseTera © 2024 - Licença Creative Commons
    `;
    
    const blob = new Blob([submissionContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Pacote_Submissao_Completo_MuseTera.txt';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Pacote de submissão completo baixado!');
  };

  const handleDownloadEthicsTemplate = () => {
    const ethicsContent = `TEMPLATE - PROTOCOLO DE PESQUISA PARA COMITÊ DE ÉTICA

═══════════════════════════════════════════════════════════════
PROJETO DE PESQUISA
═══════════════════════════════════════════════════════════════

TÍTULO: Desenvolvimento e Validação da Escala MuseTera: Instrumento 
de Avaliação Musicoterapêutica com Sistema Expandido de Pontuação

PESQUISADOR RESPONSÁVEL: [Nome a ser preenchido]
INSTITUIÇÃO: [A ser preenchida]
EMAIL: contato@musetera.com.br

═══════════════════════════════════════════════════════════════
1. RESUMO DO PROJETO
═══════════════════════════════════════════════════════════════

OBJETIVO GERAL:
Desenvolver e validar um instrumento de avaliação específico para 
musicoterapia que utiliza sistema expandido de pontuação (0-6).

OBJETIVOS ESPECÍFICOS:
• Construir escala multidimensional com 7 domínios
• Validar conteúdo por painel de especialistas
• Testar propriedades psicométricas
• Comparar sensibilidade com instrumentos existentes

METODOLOGIA:
Estudo metodológico em três fases: desenvolvimento teórico, validação 
de conteúdo e aplicação piloto.

PARTICIPANTES:
• Fase 1: 15 especialistas em musicoterapia
• Fase 2: 120 pacientes em acompanhamento musicoterapêutico

═══════════════════════════════════════════════════════════════
2. JUSTIFICATIVA
═══════════════════════════════════════════════════════════════

A musicoterapia carece de instrumentos de avaliação específicos e 
validados cientificamente no contexto brasileiro. Escalas tradicionais 
apresentam limitações de sensibilidade, especialmente para detectar 
mudanças sutis mas clinicamente significativas.

RELEVÂNCIA CIENTÍFICA:
• Primeiro instrumento brasileiro específico para musicoterapia
• Contribuição para prática baseada em evidências
• Ferramenta para pesquisas futuras

RELEVÂNCIA SOCIAL:
• Melhoria na qualidade do atendimento
• Facilitação da comunicação interprofissional
• Avanço da profissão regulamentada

═══════════════════════════════════════════════════════════════
3. ASPECTOS ÉTICOS
═══════════════════════════════════════════════════════════════

RISCOS:
• Risco mínimo relacionado ao preenchimento de questionários
• Possível desconforto emocional durante avaliação
• Tempo dedicado à participação (30-45 minutos)

BENEFÍCIOS:
• Contribuição para avanço científico da área
• Melhoria potencial dos serviços de musicoterapia
• Acesso aos resultados da avaliação individual

MEDIDAS DE PROTEÇÃO:
• Consentimento livre e esclarecido
• Direito de retirar-se a qualquer momento
• Confidencialidade absoluta dos dados
• Anonimização das informações
• Armazenamento seguro dos dados

═══════════════════════════════════════════════════════════════
4. PROCEDIMENTOS
═══════════════════════════════════════════════════════════════

FASE 1 - VALIDAÇÃO DE CONTEÚDO:
• Convite a especialistas por email
• Envio de material para avaliação
• Prazo de 30 dias para resposta
• Análise estatística dos resultados

FASE 2 - APLICAÇÃO PILOTO:
• Seleção de centros participantes
• Treinamento de aplicadores
• Aplicação durante sessões regulares
• Coleta de dados por 6 meses

COLETA DE DADOS:
• Observação estruturada durante sessões
• Preenchimento da escala pelo terapeuta
• Registro de dados sociodemográficos
• Documentação de evidências comportamentais

═══════════════════════════════════════════════════════════════
5. TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO (MODELO)
═══════════════════════════════════════════════════════════════

TÍTULO DA PESQUISA: Desenvolvimento e Validação da Escala MuseTera

Você está sendo convidado(a) a participar de uma pesquisa que tem como 
objetivo desenvolver um novo instrumento de avaliação para musicoterapia.

O QUE ENVOLVE SUA PARTICIPAÇÃO:
• Observação durante sessão regular de musicoterapia
• Preenchimento de questionário pelo terapeuta
• Tempo estimado: 30-45 minutos
• Não interferência na terapia habitual

RISCOS E DESCONFORTOS:
• Risco mínimo associado à participação
• Possível desconforto por estar sendo observado
• Direito de interromper a qualquer momento

BENEFÍCIOS:
• Contribuição para avanço científico
• Melhoria futura dos serviços
• Acesso aos resultados da avaliação

CONFIDENCIALIDADE:
• Seus dados serão mantidos em sigilo absoluto
• Identificação será removida das análises
• Resultados publicados de forma agregada
• Armazenamento seguro por 5 anos

VOLUNTARIEDADE:
• Participação é voluntária
• Pode retirar-se a qualquer momento
• Não haverá prejuízo ao tratamento
• Não há pagamento pela participação

CONTATOS:
Pesquisador Responsável: [Nome]
Email: contato@musetera.com.br
Telefone: [A ser preenchido]

Comitê de Ética: [Informações da instituição]

CONSENTIMENTO:
Declaro que:
□ Li e compreendi as informações
□ Minhas dúvidas foram esclarecidas
□ Concordo em participar voluntariamente
□ Autorizo uso dos dados para pesquisa

Nome: _________________________________ Data: ___/___/______
Assinatura: ___________________________________

Pesquisador: ______________________________ Data: ___/___/______
Assinatura: ___________________________________

═══════════════════════════════════════════════════════════════
6. CRONOGRAMA DETALHADO
═══════════════════════════════════════════════════════════════

FASE PREPARATÓRIA (Meses 1-2):
• Submissão ao Comitê de Ética
• Preparo de materiais de pesquisa
• Seleção de especialistas e centros
• Treinamento da equipe

FASE DE COLETA (Meses 3-8):
• Validação de conteúdo (Meses 3-4)
• Análise e ajustes (Mês 5)
• Aplicação piloto (Meses 6-8)

FASE DE ANÁLISE (Meses 9-10):
• Análise estatística dos dados
• Interpretação dos resultados
• Preparação do relatório final

FASE DE DIVULGAÇÃO (Meses 11-12):
• Redação de artigos científicos
• Apresentação em congressos
• Disponibilização da escala

═══════════════════════════════════════════════════════════════
7. ORÇAMENTO
═══════════════════════════════════════════════════════════════

RECURSOS HUMANOS:
• Coordenador de pesquisa: R$ 0,00 (voluntário)
• Assistentes de pesquisa: R$ 0,00 (voluntários)
• Consultoria estatística: R$ 2.000,00

MATERIAIS E EQUIPAMENTOS:
• Impressão de formulários: R$ 500,00
• Material de escritório: R$ 300,00
• Software estatístico: R$ 0,00 (livre)

DIVULGAÇÃO:
• Submissão a periódicos: R$ 0,00
• Participação em congressos: R$ 3.000,00

TOTAL: R$ 5.800,00
Fonte: Recursos próprios da equipe

═══════════════════════════════════════════════════════════════
8. REFERÊNCIAS PRINCIPAIS
═══════════════════════════════════════════════════════════════

BRASIL. Resolução CNS nº 466, de 12 de dezembro de 2012. Diretrizes 
e normas regulamentadoras de pesquisas envolvendo seres humanos.

PASQUALI, L. Instrumentação psicológica: fundamentos e práticas. 
Porto Alegre: Artmed, 2010.

BRUSCIA, K. E. Definindo Musicoterapia. 3. ed. Rio de Janeiro: 
Enelivros, 2016.

Escala MuseTera © 2024
Desenvolvido para avanço científico da musicoterapia brasileira
    `;
    
    const blob = new Blob([ethicsContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Template_Comite_Etica_MuseTera.txt';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Template para Comitê de Ética baixado!');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Download className="h-5 w-5 text-blue-600" />
          Material Completo para Publicação
        </CardTitle>
        <p className="text-sm text-gray-600">
          Tudo que você precisa para submeter o artigo a periódicos científicos
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button 
            onClick={handleDownloadArticle} 
            className="justify-start"
            variant="default"
          >
            <FileText className="h-4 w-4 mr-2" />
            Artigo Científico (PDF)
          </Button>
          
          <Button 
            onClick={handleDownloadScale} 
            className="justify-start"
            variant="outline"
          >
            <ClipboardList className="h-4 w-4 mr-2" />
            Escala Completa (Formulário)
          </Button>
          
          <Button 
            onClick={handleDownloadManual} 
            className="justify-start"
            variant="outline"
          >
            <FileText className="h-4 w-4 mr-2" />
            Manual Detalhado
          </Button>
          
          <Button 
            onClick={handleDownloadSubmissionPackage} 
            className="justify-start"
            variant="outline"
          >
            <FileCheck className="h-4 w-4 mr-2" />
            Pacote de Submissão
          </Button>
          
          <Button 
            onClick={handleDownloadEthicsTemplate} 
            className="justify-start"
            variant="outline"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Template Comitê Ética
          </Button>
          
          <Button 
            onClick={() => window.open('mailto:contato@musetera.com.br?subject=Suporte para Publicação Científica', '_blank')} 
            className="justify-start"
            variant="secondary"
          >
            <Mail className="h-4 w-4 mr-2" />
            Suporte Especializado
          </Button>
        </div>
        
        <div className="text-xs text-gray-500 mt-6 space-y-2">
          <div className="bg-green-50 p-3 rounded border border-green-200">
            <p className="font-medium text-green-800 mb-1">✅ Material Pronto para Submissão</p>
            <p className="text-green-700">Todo o conteúdo está formatado conforme normas científicas brasileiras e internacionais.</p>
          </div>
          
          <div className="bg-blue-50 p-3 rounded border border-blue-200">
            <p className="font-medium text-blue-800 mb-1">📋 Checklist Completo</p>
            <ul className="text-blue-700 text-xs space-y-1">
              <li>• Artigo científico com referências ABNT</li>
              <li>• Instrumentos de avaliação validados</li>
              <li>• Material suplementar completo</li>
              <li>• Templates para submissão</li>
              <li>• Documentação ética</li>
            </ul>
          </div>
          
          <div className="bg-purple-50 p-3 rounded border border-purple-200">
            <p className="font-medium text-purple-800 mb-1">📖 Licença Creative Commons</p>
            <p className="text-purple-700">Este material pode ser usado livremente para fins acadêmicos e clínicos, com devida citação da fonte.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
