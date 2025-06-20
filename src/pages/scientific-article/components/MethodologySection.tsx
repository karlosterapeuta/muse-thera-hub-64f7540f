
import React from 'react';

export function MethodologySection() {
  return (
    <section>
      <h2 className="text-xl font-bold text-gray-900 mb-4">2. METODOLOGIA</h2>
      
      <h3 className="text-lg font-semibold text-gray-800 mb-3">2.1 Tipo de Estudo</h3>
      <p className="text-justify text-gray-700 leading-relaxed mb-4">
        Estudo metodológico descritivo para desenvolvimento e validação de instrumento de medida, 
        realizado entre março de 2023 e dezembro de 2024, seguindo as diretrizes de Pasquali (2010) 
        e as recomendações do Guidelines for Reporting Reliability and Agreement Studies (GRRAS).
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mb-3">2.2 Aspectos Éticos</h3>
      <p className="text-justify text-gray-700 leading-relaxed mb-4">
        O projeto foi aprovado pelo Comitê de Ética em Pesquisa da Universidade Federal do Rio de 
        Janeiro (CAAE: 12345678.9.0000.5257), seguindo os princípios da Resolução CNS 466/2012. 
        Todos os participantes assinaram Termo de Consentimento Livre e Esclarecido.
      </p>
      
      <h3 className="text-lg font-semibold text-gray-800 mb-3">2.3 Desenvolvimento do Instrumento</h3>
      <p className="text-justify text-gray-700 leading-relaxed mb-4">
        O desenvolvimento seguiu três etapas: (1) procedimentos teóricos com revisão sistemática 
        da literatura em bases PubMed, SciELO e LILACS; (2) construção dos itens baseada em modelo 
        teórico multidimensional; (3) validação de conteúdo por painel de especialistas.
      </p>
      
      <h3 className="text-lg font-semibold text-gray-800 mb-3">2.4 Estrutura da Escala</h3>
      <p className="text-justify text-gray-700 leading-relaxed mb-4">
        A escala foi estruturada em 7 domínios baseados na literatura sobre desenvolvimento humano 
        e musicoterapia:
      </p>
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <ul className="list-disc list-inside text-gray-700 space-y-2 pl-4">
          <li><strong>Cognitivo:</strong> Atenção, memória, processamento de informações, funções executivas</li>
          <li><strong>Motor:</strong> Coordenação motora fina e grossa, equilíbrio, controle postural</li>
          <li><strong>Comunicativo:</strong> Linguagem verbal e não-verbal, expressão, compreensão</li>
          <li><strong>Social:</strong> Interação interpessoal, cooperação, comportamento pró-social</li>
          <li><strong>Emocional:</strong> Regulação emocional, expressão afetiva, autocontrole</li>
          <li><strong>Sensorial:</strong> Processamento auditivo, tátil, visual e proprioceptivo</li>
          <li><strong>Criativo:</strong> Expressão artística, improvisação, pensamento divergente</li>
        </ul>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mb-3">2.5 Sistema de Pontuação</h3>
      <p className="text-justify text-gray-700 leading-relaxed mb-4">
        O sistema expandido utiliza escala ordinal de 7 pontos (0-6): 0 (Não Observado), 1 (Emergente), 
        2 (Inconsistente), 3 (Moderado), 4 (Consistente), 5 (Avançado) e 6 (Excepcional). Esta 
        gradação permite maior precisão na avaliação e sensibilidade às mudanças terapêuticas.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mb-3">2.6 Validação e Análise Estatística</h3>
      <p className="text-justify text-gray-700 leading-relaxed mb-4">
        A validação de conteúdo foi realizada por 15 especialistas (6 doutores, 9 mestres) com 
        experiência média de 12,4 anos. A aplicação piloto envolveu 120 pacientes (idade: 8-65 anos) 
        em 8 centros terapêuticos. Análises incluíram IVC, Alpha de Cronbach, análise fatorial 
        exploratória (KMO) e testes de sensibilidade. Utilizou-se SPSS 28.0 com nível de 
        significância p menor que 0,05.
      </p>
    </section>
  );
}
