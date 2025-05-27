
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
    if (score === 0) return "Ausente (0)";
    if (score === 1) return "Emergente (1)";
    if (score === 2) return "Inconsistente (2)";
    if (score === 3) return "Consistente (3)";
    if (score === 4) return "Independente (4)";
    return "Não avaliado";
  };

  const getScoreColor = (score: number) => {
    if (score === 0) return "#ef4444"; // red
    if (score === 1) return "#f97316"; // orange
    if (score === 2) return "#eab308"; // yellow
    if (score === 3) return "#3b82f6"; // blue
    if (score === 4) return "#22c55e"; // green
    return "#6b7280"; // gray
  };

  return (
    <div className="bg-white">
      {/* First Page - Header and Charts */}
      <div className="p-8" style={{ width: '100%', maxWidth: '800px', margin: '0 auto', minHeight: '1050px' }}>
        {/* Header Section */}
        <div className="border-b-2 border-gray-200 pb-6 mb-8">
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/86b61f63-0028-428c-90d1-44c71413e24a.png" 
              alt="Logo" 
              style={{ width: '40px', height: 'auto' }} 
            />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-blue-600 mb-3">
              Resultados da Avaliação TEA
            </h1>
            <h2 className="text-lg text-gray-700 mb-2">
              Paciente: {patientName || 'Não informado'}
            </h2>
            <p className="text-sm text-gray-500">
              Data da Avaliação: {new Date().toLocaleDateString('pt-BR')}
            </p>
            {overallScore && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-lg font-semibold text-blue-800">
                  Pontuação Total: {overallScore.raw}/{overallScore.max} ({overallScore.percentage}%)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-2 gap-8">
          {/* Radar Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-center text-gray-800">
              Perfil de Habilidades por Domínio
            </h3>
            <div className="flex justify-center items-center h-[300px]">
              {radarData && (
                <RadarChart width={300} height={300} data={radarData}>
                  <PolarGrid strokeDasharray="3 3" />
                  <PolarAngleAxis dataKey="name" tick={{ fill: '#4B5563', fontSize: 12 }} />
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
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-center text-gray-800">
              Desenvolvimento Geral
            </h3>
            <div className="flex flex-col items-center">
              <div className="h-[300px] flex items-center justify-center">
                <PieChart width={300} height={300}>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                {pieData.map((entry: any, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span className="text-sm text-gray-600">
                      {entry.name} ({entry.value}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* First Page Footer */}
        <div className="border-t-2 border-gray-200 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-500">Página 1/3</p>
        </div>
      </div>

      {/* Second Page - Bar Chart */}
      <div className="p-8" style={{ width: '100%', maxWidth: '800px', margin: '0 auto', minHeight: '1050px' }}>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6 text-center text-gray-800">
            Desempenho por Categoria
          </h3>
          <div className="h-[500px] w-full flex justify-center">
            <BarChart
              width={700}
              height={500}
              data={categoryData}
              margin={{ top: 20, right: 30, left: 30, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={70}
                tick={{ fill: '#4B5563', fontSize: 12 }}
              />
              <YAxis domain={[0, 100]} tick={{ fill: '#4B5563' }} />
              <Bar dataKey="value" fill="#6D28D9">
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

        <div className="border-t-2 border-gray-200 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-500">Página 2/3</p>
        </div>
      </div>

      {/* Third Page - Detailed Parameters */}
      <div className="p-8" style={{ width: '100%', maxWidth: '800px', margin: '0 auto', minHeight: '1050px' }}>
        <h2 className="text-xl font-bold mb-6 text-center text-gray-800">
          Detalhamento dos Parâmetros Avaliados
        </h2>

        {evaluationDomains && evaluationDomains.map((domain, domainIndex) => (
          <div key={domainIndex} className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-blue-700 flex items-center gap-2">
              <span className="text-xl">{domain.icon}</span>
              {domain.title}
            </h3>
            
            {domain.subdomains.map((subdomain: any, subdomainIndex: number) => (
              <div key={subdomainIndex} className="mb-6 ml-4">
                <h4 className="text-base font-medium mb-3 text-gray-700 border-l-4 border-blue-300 pl-3">
                  {subdomain.title}
                </h4>
                
                <div className="grid grid-cols-1 gap-2">
                  {subdomain.parameters.map((parameter: string, paramIndex: number) => {
                    const key = `${domain.title}-${subdomain.title}-${parameter}`;
                    const selectedValue = selectedParameters?.[key];
                    const score = selectedValue === "ausente" ? 0 : 
                                selectedValue === "emergente" ? 1 : 
                                selectedValue === "inconsistente" ? 2 : 
                                selectedValue === "consistente" ? 3 : 
                                selectedValue === "independente" ? 4 : null;
                    
                    return (
                      <div key={paramIndex} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                        <span className="flex-1 text-gray-700">{parameter}</span>
                        <div className="flex items-center gap-2">
                          {score !== null ? (
                            <>
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: getScoreColor(score) }}
                              />
                              <span 
                                className="font-medium text-xs px-2 py-1 rounded"
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

        {/* Legend */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-3 text-gray-800">Legenda dos Níveis de Desenvolvimento:</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Ausente (0) - Habilidade não demonstrada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-400"></div>
              <span>Emergente (1) - Início do desenvolvimento</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <span>Inconsistente (2) - Demonstrada ocasionalmente</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Consistente (3) - Demonstrada regularmente</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Independente (4) - Totalmente desenvolvida</span>
            </div>
          </div>
        </div>

        {/* Third Page Footer */}
        <div className="border-t-2 border-gray-200 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-500 mb-1">
            Documento gerado em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
          </p>
          <p className="text-sm text-gray-500 mb-1">
            Musetera - Sistema de Gestão para Musicoterapia
          </p>
          <p className="text-sm text-gray-500 mb-1">
            Musicoterapeuta: {evaluatorName || 'Não informado'}
          </p>
          <p className="text-sm text-gray-500">
            Email: {evaluatorEmail || 'Não informado'}
          </p>
          <p className="text-sm text-gray-500 mt-2">Página 3/3</p>
        </div>
      </div>
    </div>
  );
};
