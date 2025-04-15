
import React from 'react';
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface TeaScalePDFProps {
  evaluationSections: {
    title: string;
    description: string;
    parameters: string[];
  }[];
  selections: Record<string, string>;
  categoryData: any[];
  pieData: any[];
  patientName?: string;
  evaluatorName?: string;
  evaluatorEmail?: string;
}

export const TeaScalePDF: React.FC<TeaScalePDFProps> = ({
  evaluationSections,
  selections,
  categoryData,
  pieData,
  patientName,
  evaluatorName,
  evaluatorEmail
}) => {
  const COLORS = ['#4ade80', '#ffa1b5'];

  const getLevelColor = (level: string) => {
    switch(level) {
      case "ausente": return "#ea384c";
      case "emergente": return "#f97316";
      case "inconsistente": return "#eab308";
      case "consistente": return "#0ea5e9";
      case "independente": return "#22c55e";
      default: return "#e5e7eb";
    }
  };

  // Para debug no console
  console.log("TeaScalePDF - Selections:", selections);

  return (
    <div className="bg-white p-8" style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #E5E7EB' }}>
        <div style={{ marginBottom: '24px' }}>
          <img src="/lovable-uploads/86b61f63-0028-428c-90d1-44c71413e24a.png" style={{ width: '150px', height: 'auto', margin: '0 auto' }} />
        </div>
        <h1 style={{ color: '#2563EB', fontSize: '24px', fontWeight: 'bold', marginBottom: '12px' }}>
          Escala de Avaliação TEA
        </h1>
        <h2 style={{ color: '#1F2937', fontSize: '18px', marginBottom: '6px' }}>
          Paciente: {patientName || 'Não informado'}
        </h2>
        <p style={{ color: '#6B7280', fontSize: '13px' }}>
          Data da Avaliação: {new Date().toLocaleDateString('pt-BR')}
        </p>
      </div>

      {evaluationSections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">{section.title}</h2>
            <p className="text-sm text-gray-600">{section.description}</p>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[120px]">Parâmetros</TableHead>
                <TableHead className="w-24 text-center">Ausente</TableHead>
                <TableHead className="w-24 text-center">Emergente</TableHead>
                <TableHead className="w-24 text-center">Inconsistente</TableHead>
                <TableHead className="w-24 text-center">Consistente</TableHead>
                <TableHead className="w-24 text-center">Independente</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {section.parameters.map((parameter, index) => (
                <TableRow key={index}>
                  <TableCell>{parameter}</TableCell>
                  {["ausente", "emergente", "inconsistente", "consistente", "independente"].map((level) => {
                    // Aqui está a chave do problema - criando a chave no formato correto
                    const key = `${section.title}-${parameter}`;
                    
                    // Debug para verificar se a seleção existe
                    const selectionValue = selections[key];
                    console.log(`Checking selection for ${key}: ${selectionValue}`);
                    
                    // Verificando se o nível está selecionado para este parâmetro
                    const isSelected = selectionValue === level;
                    
                    // Determinando a cor do círculo
                    const circleColor = getLevelColor(level);
                    
                    return (
                      <TableCell key={level} className="text-center">
                        <div 
                          style={{ 
                            width: '20px', 
                            height: '20px', 
                            borderRadius: '50%', 
                            backgroundColor: isSelected ? circleColor : 'transparent',
                            border: `2px solid ${circleColor}`,
                            display: 'inline-block'
                          }} 
                        />
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}

      <h2 className="text-2xl font-bold mb-6 text-center mt-8">
        Resultados da Escala de Avaliação TEA
      </h2>

      <div className="grid grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-center">
            Habilidades Adquiridas
          </h3>
          <div style={{ width: '100%', height: '200px' }}>
            <PieChart width={300} height={200}>
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

        <Card className="p-6">
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
      </div>

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
