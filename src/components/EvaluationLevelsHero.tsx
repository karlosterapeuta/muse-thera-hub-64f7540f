import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Info, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile, useIsTablet } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import html2pdf from 'html2pdf.js';
import { generateDOC } from '@/utils/docGenerator';

const developmentLevels = [
  {
    level: 0,
    name: "Não Observado",
    description: "Habilidade não demonstrada ou não observada durante a avaliação",
    color: "border-gray-500 bg-gray-50 text-gray-700",
    circleColor: "bg-gray-500"
  },
  {
    level: 1,
    name: "Emergente", 
    description: "Início do desenvolvimento da habilidade, demonstrações esporádicas",
    color: "border-red-500 bg-red-50 text-red-700",
    circleColor: "bg-red-500"
  },
  {
    level: 2,
    name: "Inconsistente",
    description: "Habilidade demonstrada ocasionalmente, com variação na qualidade",
    color: "border-orange-400 bg-orange-50 text-orange-700",
    circleColor: "bg-orange-400"
  },
  {
    level: 3,
    name: "Moderado",
    description: "Habilidade demonstrada de forma moderada, com apoio ou orientação",
    color: "border-yellow-400 bg-yellow-50 text-yellow-700",
    circleColor: "bg-yellow-400"
  },
  {
    level: 4,
    name: "Consistente",
    description: "Habilidade demonstrada regularmente e de forma independente",
    color: "border-blue-500 bg-blue-50 text-blue-700",
    circleColor: "bg-blue-500"
  },
  {
    level: 5,
    name: "Avançado",
    description: "Habilidade bem desenvolvida, demonstrada com qualidade superior",
    color: "border-green-500 bg-green-50 text-green-700",
    circleColor: "bg-green-500"
  },
  {
    level: 6,
    name: "Excepcional",
    description: "Habilidade altamente desenvolvida, performance exemplar e criativa",
    color: "border-purple-500 bg-purple-50 text-purple-700",
    circleColor: "bg-purple-500"
  }
];

export function EvaluationLevelsHero() {
  const [isExpanded, setIsExpanded] = useState(() => {
    const saved = localStorage.getItem('evaluation-levels-expanded');
    return saved ? JSON.parse(saved) : true;
  });

  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const navigate = useNavigate();

  const toggleExpanded = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    localStorage.setItem('evaluation-levels-expanded', JSON.stringify(newState));
  };

  const getGridCols = () => {
    if (isMobile) return "grid-cols-1";
    if (isTablet) return "grid-cols-2";
    return "grid-cols-3";
  };

  const handleDownloadArticle = async () => {
    try {
      toast.loading('Gerando PDF e Word do artigo científico...');
      
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

          <h2 style="font-size: 14px; font-weight: bold; margin: 20px 0 10px 0;">1. INTRODUÇÃO</h2>
          <p style="font-size: 11px; text-align: justify; margin-bottom: 10px;">
            A musicoterapia tem se consolidado como abordagem terapêutica eficaz no tratamento de 
            diversas condições neurológicas, psiquiátricas e do desenvolvimento, respaldada por crescente 
            corpo de evidências científicas. No contexto brasileiro, a regulamentação da profissão pela 
            Lei nº 14.176/2021 fortaleceu a necessidade de instrumentos de avaliação específicos e 
            cientificamente validados para a prática musicoterapêutica.
          </p>

          <h2 style="font-size: 14px; font-weight: bold; margin: 20px 0 10px 0;">2. METODOLOGIA</h2>
          <p style="font-size: 11px; text-align: justify; margin-bottom: 10px;">
            Estudo metodológico descritivo para desenvolvimento e validação de instrumento de medida, 
            realizado entre março de 2023 e dezembro de 2024, seguindo as diretrizes de Pasquali (2010) 
            e as recomendações do Guidelines for Reporting Reliability and Agreement Studies (GRRAS).
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
          </p>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ccc; font-size: 10px; color: #666;">
            <p><strong>Como citar:</strong> Equipe MuseTera. Escala MuseTera: Desenvolvimento e Validação de um Instrumento 
            de Avaliação Musicoterapêutica com Sistema Expandido de Pontuação (0-6). 2024.</p>
          </div>
        </div>
      `;

      // Gerar PDF
      const pdfOptions = {
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

      await html2pdf().set(pdfOptions).from(element).save();

      // Gerar Word (DOC)
      const articleContent = {
        patient_id: 'article',
        type: 'scientific_article',
        date: new Date(),
        content: {
          title: 'Escala MuseTera: Desenvolvimento e Validação de um Instrumento de Avaliação Musicoterapêutica com Sistema Expandido de Pontuação (0-6)',
          abstract: 'Desenvolvimento e validação da Escala MuseTera, instrumento de avaliação musicoterapêutica com sistema expandido de pontuação (0-6) para análise multidimensional do desenvolvimento terapêutico.',
          introduction: 'A musicoterapia tem se consolidado como abordagem terapêutica eficaz, respaldada por crescente corpo de evidências científicas.',
          methodology: 'Estudo metodológico descritivo realizado entre março de 2023 e dezembro de 2024, seguindo diretrizes estabelecidas.',
          results: 'A Escala MuseTera demonstrou excelente validade de conteúdo (IVC=0,89) e alta confiabilidade interna (α=0,92).',
          conclusion: 'A Escala MuseTera constitui avanço significativo na avaliação musicoterapêutica brasileira.',
          keywords: 'Musicoterapia; Avaliação; Desenvolvimento; Neuroreabilitação; Instrumentos de medida'
        }
      };

      await generateDOC(
        articleContent,
        'Artigo_Escala_MuseTera',
        { name: 'Equipe MuseTera', email: 'contato@musetera.com.br' },
        'contato@musetera.com.br',
        'Equipe de Desenvolvimento MuseTera',
        { filename: 'Artigo_Escala_MuseTera_2024.rtf' }
      );

      toast.success('PDF e Word do artigo científico gerados com sucesso!');
      
    } catch (error) {
      console.error('Erro ao gerar documentos:', error);
      toast.error('Erro ao gerar documentos. Tente novamente.');
    }
  };

  return (
    <Card className="mb-4 sm:mb-6 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-blue-200 shadow-lg">
      <CardContent className="p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 leading-tight">
                Guia de Níveis de Desenvolvimento - Escala MuseTera
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Sistema de pontuação expandido (0-6) para avaliação musicoterapêutica profissional
              </p>
            </div>
          </div>
          <div className="flex gap-2 self-start sm:self-center flex-shrink-0">
            <Button
              onClick={handleDownloadArticle}
              className={cn(
                "relative overflow-hidden",
                "bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700",
                "hover:from-purple-700 hover:via-pink-700 hover:to-purple-800",
                "text-white font-semibold shadow-lg",
                "border-2 border-purple-400",
                "animate-blink-glow",
                "transition-all duration-300 hover:scale-105",
                "motion-reduce:animate-none motion-reduce:transform-none",
                isMobile ? "text-xs px-3 py-2" : "text-sm px-4 py-2"
              )}
              size={isMobile ? "sm" : "default"}
            >
              <div className="relative z-10 flex items-center gap-1">
                <BookOpen className={cn(
                  "animate-icon-bounce motion-reduce:animate-none",
                  isMobile ? "h-3 w-3" : "h-4 w-4"
                )} />
                <span className="font-bold tracking-wide">
                  {isMobile ? "Artigo" : "Artigo Científico"}
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-pink-400/20 animate-pulse" />
            </Button>
            <Button
              variant="ghost"
              size={isMobile ? "sm" : "default"}
              onClick={toggleExpanded}
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  {!isMobile && "Recolher"}
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  {!isMobile && "Expandir"}
                </>
              )}
            </Button>
          </div>
        </div>

        <div className={cn(
          "transition-all duration-300 overflow-hidden",
          isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className={cn("grid gap-3 sm:gap-4 lg:gap-6", getGridCols())}>
            {developmentLevels.map((level) => (
              <div
                key={level.level}
                className={cn(
                  "p-4 sm:p-5 rounded-lg border-2 transition-all duration-200 hover:shadow-md h-auto min-h-[160px] sm:min-h-[180px]",
                  level.color
                )}
              >
                <div className="h-full flex flex-col justify-between">
                  <div className="flex items-start gap-3 mb-3 flex-shrink-0">
                    <div className={cn(
                      "w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0",
                      level.circleColor
                    )}>
                      {level.level}
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base leading-tight flex-1 hyphens-auto">
                      {level.name}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed text-justify hyphens-auto flex-1">
                    {level.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 sm:mt-6 p-4 sm:p-5 bg-white/60 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2 text-sm sm:text-base">
              <Info className="h-4 w-4 text-blue-600 flex-shrink-0" />
              Como usar a Escala MuseTera (0-6):
            </h4>
            <ul className="text-xs sm:text-sm text-gray-700 space-y-2">
              <li className="leading-relaxed">• <strong>0 - Não Observado:</strong> Use quando a habilidade não foi demonstrada ou observada</li>
              <li className="leading-relaxed">• <strong>1 - Emergente:</strong> Primeiros sinais da habilidade, demonstrações muito esporádicas</li>
              <li className="leading-relaxed">• <strong>2 - Inconsistente:</strong> Habilidade presente mas com grande variação na qualidade</li>
              <li className="leading-relaxed">• <strong>3 - Moderado:</strong> Habilidade funcional que requer apoio ou orientação</li>
              <li className="leading-relaxed">• <strong>4 - Consistente:</strong> Habilidade bem estabelecida e demonstrada independentemente</li>
              <li className="leading-relaxed">• <strong>5 - Avançado:</strong> Performance superior com qualidade e refinamento</li>
              <li className="leading-relaxed">• <strong>6 - Excepcional:</strong> Demonstração exemplar com criatividade e maestria</li>
            </ul>
            <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
              <p className="text-xs sm:text-sm text-blue-800 font-medium leading-relaxed">
                💡 <strong>Dica:</strong> Considere o contexto individual de cada paciente e use evidências observáveis para justificar sua pontuação.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
