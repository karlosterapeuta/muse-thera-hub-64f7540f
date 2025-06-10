import React from 'react';
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { format } from 'date-fns';

interface MuseteraReportPDFProps {
  categoryData: any[];
  pieData: any[];
  patientName?: string;
  evaluatorName?: string;
  evaluatorEmail?: string;
  radarData?: any[];
  selectedParameters?: any;
  overallScore?: {
    raw: number;
    max: number;
    percentage: number;
  };
  evaluationDomains?: any[];
  evaluationDate?: Date;
}

export const MuseteraReportPDF: React.FC<MuseteraReportPDFProps> = ({
  categoryData,
  pieData,
  patientName,
  evaluatorName,
  evaluatorEmail,
  radarData,
  selectedParameters,
  overallScore,
  evaluationDomains,
  evaluationDate
}) => {
  const COLORS = ['#4ade80', '#ffa1b5'];

  const getInterpretation = (percentage: number) => {
    if (percentage >= 80) return "Excelente desenvolvimento nas habilidades avaliadas";
    if (percentage >= 60) return "Bom desenvolvimento com algumas áreas para aprimoramento";
    if (percentage >= 40) return "Desenvolvimento moderado, necessita intervenção direcionada";
    if (percentage >= 20) return "Desenvolvimento inicial, requer suporte intensivo";
    return "Necessita intervenção especializada e acompanhamento constante";
  };

  const getDomainRecommendations = (domain: any) => {
    const score = categoryData.find(item => item.domain === domain.title.replace("Domínio ", ""))?.value || 0;
    
    if (domain.title.includes("Musical")) {
      if (score >= 70) return "Continuar atividades musicais diversificadas para manutenção das habilidades";
      if (score >= 40) return "Focar em atividades de percepção rítmica e expressão musical";
      return "Iniciar com estímulos musicais simples e repetitivos";
    }
    
    if (domain.title.includes("Psicossocial")) {
      if (score >= 70) return "Promover atividades de liderança musical em grupo";
      if (score >= 40) return "Trabalhar interações sociais através de atividades musicais colaborativas";
      return "Iniciar com atividades musicais individuais progredindo para duplas";
    }
    
    if (domain.title.includes("Cognitivo")) {
      if (score >= 70) return "Introduzir desafios cognitivos complexos através da música";
      if (score >= 40) return "Trabalhar memória e atenção através de sequências musicais";
      return "Focar em atividades musicais simples para estimulação cognitiva básica";
    }
    
    if (domain.title.includes("Sensório-Motor")) {
      if (score >= 70) return "Desenvolver habilidades motoras finas através de instrumentos";
      if (score >= 40) return "Trabalhar coordenação através de atividades rítmicas";
      return "Iniciar com movimentos corporais simples ao som da música";
    }
    
    return "Acompanhamento regular e reavaliação periódica recomendada";
  };

  return (
    <div className="bg-white">
      {/* Página 1 - Header e Resumo Executivo */}
      <div className="p-6" style={{ width: '100%', maxWidth: '800px', margin: '0 auto', minHeight: '1050px' }}>
        <div className="border-b-2 border-gray-200 pb-4 mb-6">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/86b61f63-0028-428c-90d1-44c71413e24a.png" 
              alt="Logo" 
              style={{ width: '40px', height: 'auto' }} 
            />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-blue-600 mb-3">
              Relatório de Avaliação Musicoterapêutica
            </h1>
            <h2 className="text-lg text-gray-700 mb-2">
              Sistema MuseTera
            </h2>
            <div className="bg-blue-50 p-4 rounded-lg mt-4">
              <p className="text-base font-semibold text-blue-800">
                Paciente: {patientName || 'Não informado'}
              </p>
              <p className="text-sm text-gray-600">
                Data da Avaliação: {evaluationDate ? format(evaluationDate, 'dd/MM/yyyy') : format(new Date(), 'dd/MM/yyyy')}
              </p>
              <p className="text-sm text-gray-600">
                Musicoterapeuta: {evaluatorName || 'Não informado'}
              </p>
            </div>
          </div>
        </div>

        {/* Resumo Executivo */}
        <Card className="p-6 mb-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Resumo Executivo</h3>
          {overallScore && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-lg font-semibold text-gray-800 mb-2">
                Pontuação Geral: {overallScore.raw}/{overallScore.max} ({overallScore.percentage}%)
              </p>
              <p className="text-sm text-gray-700">
                {getInterpretation(overallScore.percentage)}
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-gray-700">Perfil de Habilidades</h4>
              <div className="h-[200px]">
                {radarData && (
                  <RadarChart width={250} height={200} data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" tick={{ fontSize: 9 }} />
                    <Radar
                      dataKey="value"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-gray-700">Desenvolvimento Geral</h4>
              <div className="h-[200px] flex items-center justify-center">
                <PieChart width={250} height={200}>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    dataKey="value"
                  >
                    {pieData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </div>
              <div className="flex justify-center gap-3">
                {pieData.map((entry: any, index: number) => (
                  <div key={index} className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                    <span className="text-xs">{entry.name}: {entry.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <div className="text-center text-sm text-gray-500">Página 1/3</div>
      </div>

      {/* Página 2 - Análise por Domínios */}
      <div className="p-6" style={{ width: '100%', maxWidth: '800px', margin: '0 auto', minHeight: '1050px' }}>
        <h2 className="text-xl font-bold mb-6 text-center text-gray-800">
          Análise Detalhada por Domínios
        </h2>

        {evaluationDomains && evaluationDomains.map((domain, index) => {
          const domainScore = categoryData.find(item => item.domain === domain.title.replace("Domínio ", ""));
          return (
            <Card key={index} className="p-5 mb-5">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-2">{domain.icon}</span>
                <h3 className="text-lg font-semibold text-blue-700">{domain.title}</h3>
                {domainScore && (
                  <span className="ml-auto bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {domainScore.value}%
                  </span>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{domain.description}</p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-3">
                <h4 className="font-medium text-gray-800 mb-2">Interpretação:</h4>
                <p className="text-sm text-gray-700">
                  {domainScore ? getInterpretation(domainScore.value) : "Dados insuficientes para interpretação"}
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Recomendações Terapêuticas:</h4>
                <p className="text-sm text-green-700">
                  {getDomainRecommendations(domain)}
                </p>
              </div>
            </Card>
          );
        })}

        <div className="text-center text-sm text-gray-500">Página 2/3</div>
      </div>

      {/* Página 3 - Plano Terapêutico e Observações */}
      <div className="p-6" style={{ width: '100%', maxWidth: '800px', margin: '0 auto', minHeight: '1050px' }}>
        <h2 className="text-xl font-bold mb-6 text-center text-gray-800">
          Plano Terapêutico e Considerações Finais
        </h2>

        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Objetivos Terapêuticos Sugeridos</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium text-blue-700">Curto Prazo (1-3 meses)</h4>
              <ul className="text-sm text-gray-700 mt-2 space-y-1">
                <li>• Estabelecer rapport através de atividades musicais preferidas</li>
                <li>• Desenvolver tolerância a estímulos sonoros variados</li>
                <li>• Iniciar participação em atividades musicais estruturadas</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-medium text-green-700">Médio Prazo (3-6 meses)</h4>
              <ul className="text-sm text-gray-700 mt-2 space-y-1">
                <li>• Ampliar repertório de respostas musicais</li>
                <li>• Desenvolver habilidades de interação social através da música</li>
                <li>• Trabalhar autorregulação emocional com suporte musical</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-medium text-purple-700">Longo Prazo (6+ meses)</h4>
              <ul className="text-sm text-gray-700 mt-2 space-y-1">
                <li>• Promover independência em atividades musicais</li>
                <li>• Generalizar habilidades para outros contextos</li>
                <li>• Manter engajamento musical como recurso de bem-estar</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Observações Clínicas</h3>
          <div className="space-y-3">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Pontos de Atenção:</h4>
              <p className="text-sm text-yellow-700">
                Monitorar resposta sensorial aos estímulos musicais e ajustar intensidade conforme necessário.
                Observar sinais de fadiga durante as sessões.
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Recursos Recomendados:</h4>
              <p className="text-sm text-blue-700">
                Instrumentos de fácil manuseio, músicas familiares, ambiente acusticamente controlado,
                apoio visual para atividades estruturadas.
              </p>
            </div>
          </div>
        </Card>

        <div className="border-t-2 border-gray-200 pt-4 text-center">
          <p className="text-xs text-gray-500 mb-1">
            Relatório gerado pelo Sistema MuseTera em {new Date().toLocaleDateString('pt-BR')}
          </p>
          <p className="text-xs text-gray-500 mb-1">
            Este documento deve ser utilizado como complemento à avaliação clínica
          </p>
          <p className="text-xs text-gray-500 mb-1">
            Próxima reavaliação recomendada em 3-6 meses
          </p>
          <div className="text-center text-sm text-gray-500 mt-3">Página 3/3</div>
        </div>
      </div>
    </div>
  );
};
