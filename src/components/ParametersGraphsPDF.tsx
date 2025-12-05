
import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { format } from 'date-fns';
import { ProfessionalData } from "@/hooks/useProfessionalData";

interface ParametersGraphsPDFProps {
  categoryData: any[];
  pieData: any[];
  patientName?: string;
  professionalData?: ProfessionalData | null;
  radarData?: any[];
  overallScore?: {
    raw: number;
    max: number;
    percentage: number;
  };
  evaluationDate?: Date;
}

export const ParametersGraphsPDF: React.FC<ParametersGraphsPDFProps> = ({
  categoryData,
  pieData,
  patientName,
  professionalData,
  radarData,
  overallScore,
  evaluationDate
}) => {
  const COLORS = ['#4ade80', '#ffa1b5'];

  // Inline styles
  const cardStyle: React.CSSProperties = {
    padding: '16px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  };

  const cardLargeStyle: React.CSSProperties = {
    ...cardStyle,
    padding: '24px',
    marginBottom: '32px'
  };

  return (
    <div style={{ backgroundColor: '#ffffff', color: '#000000' }}>
      {/* Página Única - Parâmetros e Gráficos */}
      <div style={{ 
        padding: '24px', 
        width: '100%', 
        maxWidth: '800px', 
        margin: '0 auto', 
        minHeight: '1050px',
        backgroundColor: '#ffffff'
      }}>
        {/* Header Section */}
        <div style={{ 
          borderBottom: '2px solid #e5e7eb', 
          paddingBottom: '16px', 
          marginBottom: '24px' 
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <img 
              src="/lovable-uploads/86b61f63-0028-428c-90d1-44c71413e24a.png" 
              alt="Logo" 
              style={{ width: '35px', height: 'auto' }} 
            />
          </div>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ 
              fontSize: '20px', 
              fontWeight: 700, 
              color: '#2563eb', 
              marginBottom: '8px' 
            }}>
              Parâmetros e Gráficos - Avaliação TEA
            </h1>
            <h2 style={{ 
              fontSize: '16px', 
              color: '#374151', 
              marginBottom: '4px',
              fontWeight: 400
            }}>
              Paciente: {patientName || 'Não informado'}
            </h2>
            <p style={{ 
              fontSize: '14px', 
              color: '#6b7280', 
              marginBottom: '8px' 
            }}>
              Data da Avaliação: {evaluationDate ? format(evaluationDate, 'dd/MM/yyyy') : format(new Date(), 'dd/MM/yyyy')}
            </p>
            {overallScore && (
              <div style={{ 
                marginTop: '12px', 
                padding: '12px', 
                backgroundColor: '#eff6ff', 
                borderRadius: '8px' 
              }}>
                <p style={{ 
                  fontSize: '16px', 
                  fontWeight: 600, 
                  color: '#1e40af' 
                }}>
                  Pontuação Total: {overallScore.raw}/{overallScore.max} ({overallScore.percentage}%)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Charts Section */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '24px', 
          marginBottom: '32px' 
        }}>
          {/* Radar Chart */}
          <div style={cardStyle}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: 600, 
              marginBottom: '12px', 
              textAlign: 'center', 
              color: '#1f2937' 
            }}>
              Perfil por Domínio
            </h3>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '250px' 
            }}>
              {radarData && radarData.length > 0 && (
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
          </div>

          {/* Pie Chart */}
          <div style={cardStyle}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: 600, 
              marginBottom: '12px', 
              textAlign: 'center', 
              color: '#1f2937' 
            }}>
              Desenvolvimento Geral
            </h3>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center' 
            }}>
              <div style={{ 
                height: '250px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
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
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '16px', 
                marginTop: '8px' 
              }}>
                {pieData.map((entry: any, index: number) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{ 
                        width: '16px', 
                        height: '16px', 
                        borderRadius: '50%',
                        backgroundColor: COLORS[index]
                      }}
                    />
                    <span style={{ fontSize: '14px', color: '#4b5563' }}>
                      {entry.name} ({entry.value}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div style={cardLargeStyle}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: 600, 
            marginBottom: '16px', 
            textAlign: 'center', 
            color: '#1f2937' 
          }}>
            Desempenho por Subdomínios
          </h3>
          <div style={{ 
            height: '400px', 
            width: '100%', 
            display: 'flex', 
            justifyContent: 'center' 
          }}>
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
              <Bar dataKey="value" fill="#3b82f6">
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
        </div>

        {/* Summary Table */}
        <div style={{ ...cardLargeStyle, marginBottom: '24px' }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: 600, 
            marginBottom: '16px', 
            color: '#1f2937' 
          }}>
            Resumo dos Parâmetros
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '16px' 
          }}>
            {categoryData.map((item, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '12px', 
                backgroundColor: '#f9fafb', 
                borderRadius: '4px' 
              }}>
                <span style={{ 
                  fontSize: '14px', 
                  fontWeight: 500, 
                  color: '#374151' 
                }}>{item.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div 
                    style={{ 
                      width: '12px', 
                      height: '12px', 
                      borderRadius: '50%',
                      backgroundColor: item.domain === "Musical" ? "#8884d8" :
                        item.domain === "Psicossocial" ? "#82ca9d" :
                        item.domain === "Cognitivo" ? "#ffc658" : "#ff8042"
                    }}
                  />
                  <span style={{ 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    color: '#111827' 
                  }}>{item.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ 
          borderTop: '2px solid #e5e7eb', 
          paddingTop: '16px', 
          textAlign: 'center' 
        }}>
          <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
            Documento gerado em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
          </p>
          <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
            MuseTera - Parâmetros e Gráficos
          </p>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            <p style={{ marginBottom: '4px' }}>
              <strong>Musicoterapeuta:</strong> {professionalData?.name || 'Não informado'}
            </p>
            {professionalData?.specialty && (
              <p style={{ marginBottom: '4px' }}>
                <strong>Especialidade:</strong> {professionalData.specialty}
              </p>
            )}
            {professionalData?.email && (
              <p style={{ marginBottom: '4px' }}>
                <strong>Email:</strong> {professionalData.email}
              </p>
            )}
            {professionalData?.phone && (
              <p style={{ marginBottom: '4px' }}>
                <strong>Telefone:</strong> {professionalData.phone}
              </p>
            )}
            {professionalData?.register && (
              <p style={{ marginBottom: '4px' }}>
                <strong>Registro:</strong> {professionalData.register}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
