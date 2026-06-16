
import React from 'react';
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

interface TeaScalePDFProps {
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
}

export const TeaScalePDF: React.FC<TeaScalePDFProps> = ({
  categoryData,
  pieData,
  patientName,
  evaluatorName,
  evaluatorEmail,
  radarData,
  selectedParameters,
  overallScore,
  evaluationDomains
}) => {
  const COLORS = ['#4ade80', '#ffa1b5'];

  const getScoreLabel = (score: number) => {
    if (score === 0) return "Não Observado: 0 pontos (0%)";
    if (score === 20) return "Emergente: 20 pontos (20%)";
    if (score === 40) return "Inconsistente: 40 pontos (40%)";
    if (score === 60) return "Moderado: 60 pontos (60%)";
    if (score === 80) return "Consistente: 80 pontos (80%)";
    if (score === 100) return "Excepcional: 100 pontos (100%)";
    return "Não avaliado";
  };

  const getScoreColor = (score: number) => {
    if (score === 0) return "#ef4444"; // red
    if (score === 20) return "#f97316"; // orange
    if (score === 40) return "#eab308"; // yellow
    if (score === 60) return "#3b82f6"; // blue
    if (score === 80) return "#22c55e"; // green
    if (score === 100) return "#22c55e"; // green
    return "#6b7280"; // gray
  };

  return (
    <div className="bg-white">
      {/* Página 1 - Header e Gráficos Resumidos */}
      <div className="p-6" style={{ width: '100%', maxWidth: '800px', margin: '0 auto', minHeight: '1050px' }}>
        {/* Header Section */}
        <div className="border-b-2 border-gray-200 pb-4 mb-6">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/86b61f63-0028-428c-90d1-44c71413e24a.png" 
              alt="Logo" 
              style={{ width: '35px', height: 'auto' }} 
            />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-blue-600 mb-2">
              Resultados da Avaliação TEA
            </h1>
            <h2 className="text-base text-gray-700 mb-1">
              Paciente: {patientName || 'Não informado'}
            </h2>
            <p className="text-sm text-gray-500 mb-2">
              Data da Avaliação: {new Date().toLocaleDateString('pt-BR')}
            </p>
            {overallScore && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <p className="text-base font-semibold text-blue-800">
                  Pontuação Total: {overallScore.raw}/{overallScore.max} ({overallScore.percentage}%)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Charts Section - Compacto */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Radar Chart */}
          <Card className="p-4">
            <h3 className="text-base font-semibold mb-3 text-center text-gray-800">
              Perfil de Habilidades por Domínio
            </h3>
            <div className="flex justify-center items-center h-[220px]">
              {radarData && (
                <RadarChart width={240} height={220} data={radarData}>
                  <PolarGrid strokeDasharray="3 3" />
                  <PolarAngleAxis dataKey="name" tick={{ fill: '#4B5563', fontSize: 10 }} />
                  <Radar
                    name="Perfil"
                    dataKey="value"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              )}
            </div>
          </Card>

          {/* Pie Chart */}
          <Card className="p-4">
            <h3 className="text-base font-semibold mb-3 text-center text-gray-800">
              Desenvolvimento Geral
            </h3>
            <div className="flex flex-col items-center">
              <div className="h-[220px] flex items-center justify-center">
                <PieChart width={240} height={220}>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </div>
              <div className="flex justify-center gap-4 mt-1">
                {pieData.map((entry: any, index: number) => (
                  <div key={index} className="flex items-center gap-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span className="text-xs text-gray-600">
                      {entry.name} ({entry.value}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Footer Página 1 */}
        <div className="border-t-2 border-gray-200 mt-6 pt-4 text-center">
          <p className="text-sm text-gray-500">Página 1/3</p>
        </div>
      </div>

      {/* Página 2 - Gráfico de Barras Detalhado */}
      <div className="p-6" style={{ width: '100%', maxWidth: '800px', margin: '0 auto', minHeight: '1050px' }}>
        <h2 className="text-xl font-bold mb-6 text-center text-gray-800">
          Desempenho Detalhado por Categoria
        </h2>
        
        {/* Bar Chart Section - Página completa */}
        <Card className="p-6">
          <div className="h-[850px] w-full flex justify-center">
            <BarChart
              width={720}
              height={850}
              data={categoryData}
              margin={{ top: 20, right: 30, left: 30, bottom: 100 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fill: '#4B5563', fontSize: 11 }}
              />
              <YAxis domain={[0, 100]} tick={{ fill: '#4B5563' }} />
              <Bar dataKey="value" fill="hsl(214 88% 52%)">
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={
                    entry.domain === "Musical" ? "#8884d8" :
                    entry.domain === "Psicossocial" ? "#82ca9d" :
                    entry.domain === "Cognitivo" ? "#ffc658" : "#ff8042"
                  } />
                ))}
              </Bar>
            </BarChart>
          </div>
        </Card>

        {/* Footer Página 2 */}
        <div className="border-t-2 border-gray-200 mt-6 pt-4 text-center">
          <p className="text-sm text-gray-500">Página 2/3</p>
        </div>
      </div>

      {/* Página 3 - Parâmetros Detalhados */}
      <div className="p-6" style={{ width: '100%', maxWidth: '800px', margin: '0 auto', minHeight: '1050px' }}>
        <h2 className="text-lg font-bold mb-4 text-center text-gray-800">
          Detalhamento dos Parâmetros Avaliados
        </h2>

        {evaluationDomains && evaluationDomains.map((domain, domainIndex) => (
          <div key={domainIndex} className="mb-6">
            <h3 className="text-base font-semibold mb-3 text-blue-700 flex items-center gap-2">
              <span className="text-lg">{domain.icon}</span>
              {domain.title}
            </h3>
            
            {domain.subdomains.map((subdomain: any, subdomainIndex: number) => (
              <div key={subdomainIndex} className="mb-4 ml-3">
                <h4 className="text-sm font-medium mb-2 text-gray-700 border-l-3 border-blue-300 pl-2">
                  {subdomain.title}
                </h4>
                
                <div className="grid grid-cols-1 gap-1">
                  {subdomain.parameters.map((parameter: string, paramIndex: number) => {
                    const key = `${domain.title}-${subdomain.title}-${parameter}`;
                    const selectedValue = selectedParameters?.[key];
                    const score = selectedValue === "nao_observado" ? 0 : 
                                selectedValue === "emergente" ? 20 : 
                                selectedValue === "inconsistente" ? 40 : 
                                selectedValue === "moderado" ? 60 : 
                                selectedValue === "consistente" ? 80 : 
                                selectedValue === "excepcional" ? 100 : null;
                    
                    return (
                      <div key={paramIndex} className="flex justify-between items-center p-1.5 bg-gray-50 rounded text-xs">
                        <span className="flex-1 text-gray-700">{parameter}</span>
                        <div className="flex items-center gap-1">
                          {score !== null ? (
                            <>
                              <div 
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: getScoreColor(score) }}
                              />
                              <span 
                                className="font-medium text-xs px-1.5 py-0.5 rounded"
                                style={{ 
                                  backgroundColor: getScoreColor(score) + '20',
                                  color: getScoreColor(score)
                                }}
                              >
                                {getScoreLabel(score)}
                              </span>
                            </>
                          ) : (
                            <span className="text-gray-400 text-xs">Não avaliado</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* Legend - Compacta */}
        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2 text-gray-800 text-sm">Legenda dos Níveis:</h4>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
              <span>Não Observado: 0 pontos (0%)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-orange-400"></div>
              <span>Emergente: 20 pontos (20%)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
              <span>Inconsistente: 40 pontos (40%)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
              <span>Moderado: 60 pontos (60%)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              <span>Consistente: 80 pontos (80%)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              <span>Excepcional: 100 pontos (100%)</span>
            </div>
          </div>
        </div>

        {/* Footer Final */}
        <div className="border-t-2 border-gray-200 mt-6 pt-4 text-center">
          <p className="text-xs text-gray-500 mb-1">
            Documento gerado em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
          </p>
          <p className="text-xs text-gray-500 mb-1">
            Musetera - Sistema de Gestão para Musicoterapia
          </p>
          <p className="text-xs text-gray-500 mb-1">
            Musicoterapeuta: {evaluatorName || 'Não informado'}
          </p>
          <p className="text-xs text-gray-500">
            Email: {evaluatorEmail || 'Não informado'}
          </p>
          <p className="text-sm text-gray-500 mt-2">Página 3/3</p>
        </div>
      </div>
    </div>
  );
};
