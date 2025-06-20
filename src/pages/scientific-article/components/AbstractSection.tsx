
import React from 'react';
import { Separator } from '@/components/ui/separator';

export function AbstractSection() {
  return (
    <>
      {/* Resumo */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">RESUMO</h2>
        <p className="text-justify text-gray-700 leading-relaxed mb-4">
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
          na detecção de mudanças sutis comparada a escalas tradicionais de 4-5 pontos (p menor que 0,001). Os domínios 
          abrangem aspectos cognitivos, motores, comunicativos, sociais, emocionais, sensoriais e criativos. 
          <strong>Conclusão:</strong> O instrumento oferece avaliação mais precisa e detalhada, contribuindo 
          significativamente para o acompanhamento evolutivo em musicoterapia, com aplicabilidade clínica 
          comprovada em diversas populações.
        </p>
        <p className="text-sm text-gray-600">
          <strong>Palavras-chave:</strong> Musicoterapia; Avaliação; Desenvolvimento; Neuroreabilitação; 
          Instrumentos de medida; Saúde mental; Validação psicométrica.
        </p>
      </section>

      <Separator />

      {/* Abstract */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">ABSTRACT</h2>
        <p className="text-justify text-gray-700 leading-relaxed mb-4">
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
          compared to traditional 4-5 point scales (p less than 0.001). Domains encompass cognitive, motor, communicative, 
          social, emotional, sensory, and creative aspects. <strong>Conclusion:</strong> The instrument offers 
          more precise and detailed assessment, contributing significantly to evolutionary monitoring in music 
          therapy, with proven clinical applicability across diverse populations.
        </p>
        <p className="text-sm text-gray-600">
          <strong>Keywords:</strong> Music therapy; Assessment; Development; Neurorehabilitation; 
          Measurement instruments; Mental health; Psychometric validation.
        </p>
      </section>
    </>
  );
}
