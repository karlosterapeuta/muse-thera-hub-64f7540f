
import React, { useEffect } from 'react';
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
    <div className="bg-white p-8" style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #E5E7EB' }}>
        <div style={{ marginBottom: '24px' }}>
          <img src="/lovable-uploads/86b61f63-0028-428c-90d1-44c71413e24a.png" style={{ width: '150px', height: 'auto', margin: '0 auto' }} />
        </div>
        <h1 style={{ color: '#2563EB', fontSize: '24px', fontWeight: 'bold', marginBottom: '12px' }}>
          Resultados da Avaliação TEA
        </h1>
        <h2 style={{ color: '#1F2937', fontSize: '18px', marginBottom: '6px' }}>
          Paciente: {patientName || 'Não informado'}
        </h2>
        <p style={{ color: '#6B7280', fontSize: '13px' }}>
          Data da Avaliação: {new Date().toLocaleDateString('pt-BR')}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-center">
            Perfil de Habilidades
          </h3>
          <div style={{ width: '100%', height: '300px' }}>
            {radarData && (
              <RadarChart width={300} height={300} data={radarData} cy="50%" outerRadius="80%">
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <Radar name="Perfil" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              </RadarChart>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-center">
            Habilidades Adquiridas
          </h3>
          <div style={{ width: '100%', height: '300px' }}>
            <PieChart width={300} height={300}>
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
          <div className="flex justify-center gap-4 mt-4">
            {pieData.map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index] }}
                />
                <span className="text-sm">{entry.name} ({entry.value}%)</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6 mt-8">
        <h3 className="text-lg font-semibold mb-4 text-center">
          Desempenho por Categoria
        </h3>
        <div style={{ width: '100%', height: '200px' }}>
          <BarChart
            width={300}
            height={200}
            data={categoryData}
            margin={{ top: 20, right: 20, left: 20, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={60}
              interval={0}
              fontSize={8}
            />
            <YAxis domain={[0, 100]} />
            <Bar dataKey="value" fill="#6D28D9" />
          </BarChart>
        </div>
      </Card>

      <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '2px solid #E5E7EB', textAlign: 'center' }}>
        <p style={{ color: '#6B7280', fontSize: '11px', marginBottom: '4px' }}>
          Documento gerado em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
        </p>
        <p style={{ color: '#6B7280', fontSize: '11px', marginBottom: '4px' }}>
          Musetera - Sistema de Gestão para Musicoterapia
        </p>
        <p style={{ color: '#6B7280', fontSize: '11px', marginBottom: '4px' }}>
          Musicoterapeuta: {evaluatorName || 'Não informado'}
        </p>
        <p style={{ color: '#6B7280', fontSize: '11px' }}>
          Email: {evaluatorEmail || 'Não informado'}
        </p>
      </div>
    </div>
  );
};

