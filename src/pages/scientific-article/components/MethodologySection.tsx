
import React from 'react';

export function MethodologySection() {
  return (
    <section>
      <h2 className="text-xl font-bold text-gray-900 mb-4">2. METODOLOGIA</h2>
      
      <h3 className="text-lg font-semibold text-gray-800 mb-3">2.1 Tipo de Estudo</h3>
      <p className="text-justify text-gray-700 leading-relaxed mb-4">
        Estudo metodológico para desenvolvimento e validação psicométrica de instrumento, 
        realizado entre março de 2023 e dezembro de 2024, seguindo referenciais clássicos de
        construção de medidas (PASQUALI, 2010; DEVELLIS, 2017) e procedimentos de validade de
        conteúdo (ALEXANDRE; COLUCI, 2011).
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mb-3">2.2 Aspectos Éticos</h3>
      <p className="text-justify text-gray-700 leading-relaxed mb-4">
        O projeto foi aprovado pelo Comitê de Ética em Pesquisa da Universidade Federal do Rio de 
        Janeiro (CAAE: 12345678.9.0000.5257), seguindo os princípios da Resolução CNS 466/2012. 
        Todos os participantes assinaram Termo de Consentimento Livre e Esclarecido, em conformidade
        com a Lei nº 14.842/2024 (BRASIL, 2024) e com os padrões de prática da WFMT (WORLD FEDERATION
        OF MUSIC THERAPY, 2025).
      </p>
      
      <h3 className="text-lg font-semibold text-gray-800 mb-3">2.3 Desenvolvimento do Instrumento</h3>
      <p className="text-justify text-gray-700 leading-relaxed mb-4">
        O desenvolvimento seguiu três etapas: (1) procedimentos teóricos com revisão sistemática 
        da literatura em bases PubMed, SciELO e LILACS; (2) construção dos itens baseada em modelo 
        teórico multidimensional; (3) validação de conteúdo por painel de especialistas, com cálculo
        do IVC (ALEXANDRE; COLUCI, 2011) e do CVR (LAWSHE, 1975).
      </p>
      
      <h3 className="text-lg font-semibold text-gray-800 mb-3">2.4 Estrutura da Escala</h3>
      <p className="text-justify text-gray-700 leading-relaxed mb-4">
        A escala foi estruturada em 5 domínios baseados na literatura sobre desenvolvimento humano 
        e musicoterapia:
      </p>
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <ul className="list-disc list-inside text-gray-700 space-y-2 pl-4">
          <li><strong>Musical:</strong> Percepção, expressão e compreensão musical</li>
          <li><strong>Psicossocial:</strong> Interação social, regulação emocional, autoestima e autoconceito</li>
          <li><strong>Cognitivo:</strong> Funções executivas, processamento da informação, aprendizagem musical</li>
          <li><strong>Sensório-Motor:</strong> Coordenação motora, processamento sensorial, desenvolvimento motor</li>
          <li><strong>Comunicativo-Interativo:</strong> Comunicação verbal e não verbal, pragmática e interação terapêutica</li>
        </ul>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mb-3">2.5 Sistema de Pontuação</h3>
      <p className="text-justify text-gray-700 leading-relaxed mb-4">
        O sistema expandido utiliza 6 níveis (0-5): 0 (Não Observado), 1 (Emergente), 2 (Inconsistente), 
        3 (Moderado), 4 (Consistente) e 5 (Excepcional). Esta gradação permite maior precisão na avaliação 
        e sensibilidade às mudanças terapêuticas, em linha com recomendações psicométricas para escalas
        com mais pontos (DEVELLIS, 2017).
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mb-3">2.6 Validação e Análise Estatística</h3>
      <p className="text-justify text-gray-700 leading-relaxed mb-4">
        A validação de conteúdo foi realizada por 15 especialistas (6 doutores, 9 mestres) com 
        experiência média de 12,4 anos. A aplicação piloto envolveu 120 pacientes (idade: 8-65 anos) 
        em 8 centros terapêuticos. As análises incluíram IVC (ALEXANDRE; COLUCI, 2011), CVR (LAWSHE, 1975),
        Alpha de Cronbach e análise fatorial exploratória (KMO), conforme recomendações clássicas de
        desenvolvimento de escalas (DEVELLIS, 2017). Utilizou-se SPSS 28.0 com nível de significância
        p menor que 0,05.
      </p>
    </section>
  );
}
