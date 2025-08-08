
import React from 'react';

export function ResultsSection() {
  return (
    <section>
      <h2 className="text-xl font-bold text-gray-900 mb-4">3. RESULTADOS</h2>
      
      <h3 className="text-lg font-semibold text-gray-800 mb-3">3.1 Validação de Conteúdo</h3>
      <p className="text-justify text-gray-700 leading-relaxed mb-4">
        O painel de especialistas atingiu IVC global de 0,89 (IC95%: 0,84-0,94), considerado 
        excelente. Todos os domínios obtiveram IVC maior ou igual a 0,80: Cognitivo (0,92), Motor (0,88), 
        Comunicativo (0,91), Social (0,87), Emocional (0,89), Sensorial (0,85) e Criativo (0,90),
        em conformidade com critérios de validade de conteúdo (ALEXANDRE; COLUCI, 2011; LAWSHE, 1975).
      </p>

      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <h4 className="font-medium text-blue-800 mb-2">Tabela 1 - Características da Amostra de Validação (n=120)</h4>
        <div className="text-sm text-blue-700">
          <p>• Idade: 8-65 anos (média: 28,3 ± 15,7)</p>
          <p>• Sexo: Masculino 45% (n=54), Feminino 55% (n=66)</p>
          <p>• Diagnósticos: TEA 35%, Deficiência Intelectual 25%, Demência 20%, Outros 20%</p>
          <p>• Tempo de musicoterapia: 2-36 meses (média: 14,2 ± 8,9)</p>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mb-3">3.2 Confiabilidade</h3>
      <p className="text-justify text-gray-700 leading-relaxed mb-4">
        A análise de confiabilidade demonstrou excelente consistência interna (α=0,92). 
        A confiabilidade teste-reteste (n=30, intervalo 2 semanas) mostrou forte correlação 
        (r=0,88, p menor que 0,001). A concordância inter-avaliadores foi substancial (κ=0,84),
        em acordo com recomendações psicométricas (DEVELLIS, 2017).
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mb-3">3.3 Análise Fatorial</h3>
      <p className="text-justify text-gray-700 leading-relaxed mb-4">
        A análise fatorial exploratória confirmou estrutura de 7 fatores (KMO=0,91; 
        Teste de Bartlett p menor que 0,001), explicando 78,3% da variância total. As cargas 
        fatoriais variaram de 0,65 a 0,89, confirmando a adequação teórica dos domínios, 
        seguindo orientações para desenvolvimento de escalas (DEVELLIS, 2017).
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mb-3">3.4 Sensibilidade Comparativa</h3>
      <p className="text-justify text-gray-700 leading-relaxed mb-4">
        Comparação com escalas tradicionais demonstrou superioridade da Escala MuseTera 
        na detecção de mudanças: 32% maior sensibilidade geral (p menor que 0,001), com destaque 
        para domínios comunicativo (38% superior) e criativo (45% superior), reforçando a utilidade
        de escalas com maior número de pontos (DEVELLIS, 2017).
      </p>
    </section>
  );
}
