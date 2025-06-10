
import React from 'react';
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

interface ParametersGraphsPDFProps {
  categoryData: any[];
  pieData: any[];
  patientName?: string;
  evaluatorName?: string;
  evaluatorEmail?: string;
  radarData?: any[];
  overallScore?: {
    raw: number;
    max: number;
    percentage: number;
  };
}

export const ParametersGraphsPDF: React.FC<ParametersGraphsPDFProps> = ({
  categoryData,
  pieData,
  patientName,
  evaluatorName,
  evaluatorEmail,
  radarData,
  overallScore
}) => {
  const COLORS = ['#4ade80', '#ffa1b5'];

  return (
    <div className="bg-white">
      {/* Página Única - Parâmetros e Gráficos */}
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
              Parâmetros e Gráficos - Avaliação TEA
            </h1>
            <h2 className="text-base text-gray-700 mb-1">
              Paciente: {patientName || 'Não informado'}
            </h2>
            <p className="text-sm text-gray-500 mb-2">
              Data: {new Date().toLocaleDateString('pt-BR')}
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

        {/* Charts Section */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Radar Chart */}
          <Card className="p-4">
            <h3 className="text-base font-semibold mb-3 text-center text-gray-800">
              Perfil por Domínio
            </h3>
            <div className="flex justify-center items-center h-[250px]">
              {radarData && (
                <RadarChart width={280} height={250} data={radarData}>
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
              <div className="h-[250px] flex items-center justify-center">
                <PieChart width={280} height={250}>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
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
              <div className="flex justify-center gap-4 mt-2">
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

        {/* Bar Chart */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4 text-center text-gray-800">
            Desempenho por Subdomínios
          </h3>
          <div className="h-[400px] w-full flex justify-center">
            <BarChart
              width={720}
              height={400}
              data={categoryData}
              margin={{ top: 20, right: 30, left: 30, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fill: '#4B5563', fontSize: 10 }}
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

        {/* Summary Table */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Resumo dos Parâmetros
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {categoryData.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-sm font-medium text-gray-700">{item.name}</span>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ 
                      backgroundColor: item.domain === "Musical" ? "#8884d8" :
                        item.domain === "Psicossocial" ? "#82ca9d" :
                        item.domain === "Cognitivo" ? "#ffc658" : "#ff8042"
                    }}
                  />
                  <span className="text-sm font-semibold text-gray-900">{item.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Footer */}
        <div className="border-t-2 border-gray-200 pt-4 text-center">
          <p className="text-xs text-gray-500 mb-1">
            Documento gerado em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
          </p>
          <p className="text-xs text-gray-500 mb-1">
            MuseTera - Parâmetros e Gráficos
          </p>
          <p className="text-xs text-gray-500 mb-1">
            Musicoterapeuta: {evaluatorName || 'Não informado'}
          </p>
          <p className="text-xs text-gray-500">
            Email: {evaluatorEmail || 'Não informado'}
          </p>
        </div>
      </div>
    </div>
  );
};
