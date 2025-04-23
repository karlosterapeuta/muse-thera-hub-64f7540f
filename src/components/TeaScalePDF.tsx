
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
}

export const TeaScalePDF: React.FC<TeaScalePDFProps> = ({
  categoryData,
  pieData,
  patientName,
  evaluatorName,
  evaluatorEmail,
  radarData
}) => {
  const COLORS = ['#4ade80', '#ffa1b5'];

  return (
    <div className="bg-white">
      {/* First Page */}
      <div className="p-8" style={{ width: '100%', maxWidth: '800px', margin: '0 auto', minHeight: '1050px' }}>
        {/* Header Section */}
        <div className="border-b-2 border-gray-200 pb-6 mb-8">
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
          </div>
        </div>

        {/* First Page Charts */}
        <div className="grid grid-cols-2 gap-8">
          {/* Radar Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-center text-gray-800">
              Perfil de Habilidades
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
              Habilidades Adquiridas
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
          <p className="text-sm text-gray-500">Página 1/2</p>
        </div>
      </div>

      {/* Second Page */}
      <div className="p-8" style={{ width: '100%', maxWidth: '800px', margin: '0 auto', minHeight: '1050px' }}>
        {/* Bar Chart */}
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

        {/* Second Page Footer */}
        <div className="border-t-2 border-gray-200 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-500 mb-1">
            Documento gerado em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
          </p>
          <p className="text-sm text-gray-500 mb-1">
            Musicoterapeuta: {evaluatorName || 'Não informado'}
          </p>
          <p className="text-sm text-gray-500">
            Email: {evaluatorEmail || 'Não informado'}
          </p>
          <p className="text-sm text-gray-500 mt-2">Página 2/2</p>
        </div>
      </div>
    </div>
  );
};
