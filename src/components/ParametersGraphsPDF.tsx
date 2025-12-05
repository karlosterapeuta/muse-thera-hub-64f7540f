
import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, Radar, LineChart, Line, Legend, Tooltip } from 'recharts';
import { format } from 'date-fns';
import { ProfessionalData } from "@/hooks/useProfessionalData";
import { SavedEvaluation } from "@/hooks/useEvaluationStorage";

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
  allEvaluations?: SavedEvaluation[];
}

// Domain colors for line chart
const DOMAIN_COLORS: Record<string, string> = {
  "Musical": "#8884d8",
  "Psicossocial": "#82ca9d",
  "Cognitivo": "#ffc658",
  "Sensório-Motor": "#ff8042",
  "Comunicativo-Interativo": "#00C49F"
};

export const ParametersGraphsPDF: React.FC<ParametersGraphsPDFProps> = ({
  categoryData,
  pieData,
  patientName,
  professionalData,
  radarData,
  overallScore,
  evaluationDate,
  allEvaluations = []
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

        {/* Evolution Timeline Section - Only show if we have multiple evaluations */}
        {allEvaluations.length > 1 && (() => {
          // Sort evaluations by date
          const sortedEvals = [...allEvaluations].sort((a, b) => 
            new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          
          // Prepare chart data
          const chartData = sortedEvals.map(evaluation => {
            const domainScores = evaluation.content?.domainScores || [];
            const dataPoint: Record<string, any> = {
              date: format(new Date(evaluation.date), 'dd/MM/yy'),
              "Score Global": evaluation.content?.overallScore?.percentage || 0
            };
            domainScores.forEach((d: any) => {
              dataPoint[d.domain] = d.score || 0;
            });
            return dataPoint;
          });
          
          // Calculate progress
          const firstScore = sortedEvals[0]?.content?.overallScore?.percentage || 0;
          const lastScore = sortedEvals[sortedEvals.length - 1]?.content?.overallScore?.percentage || 0;
          const variation = lastScore - firstScore;
          
          // Get available domains
          const availableDomains = sortedEvals[0]?.content?.domainScores?.map((d: any) => d.domain) || [];
          
          // Analyze areas
          const areasAnalysis: { improved: any[], attention: any[] } = { improved: [], attention: [] };
          if (sortedEvals.length >= 2) {
            const firstEval = sortedEvals[0];
            const lastEval = sortedEvals[sortedEvals.length - 1];
            const firstDomains = firstEval.content?.domainScores || [];
            const lastDomains = lastEval.content?.domainScores || [];
            
            lastDomains.forEach((lastDomain: any) => {
              const firstDomain = firstDomains.find((d: any) => d.domain === lastDomain.domain);
              if (firstDomain) {
                const domainVariation = (lastDomain.score || 0) - (firstDomain.score || 0);
                if (domainVariation > 5) {
                  areasAnalysis.improved.push({
                    domain: lastDomain.domain,
                    firstScore: firstDomain.score || 0,
                    lastScore: lastDomain.score || 0,
                    variation: domainVariation
                  });
                } else {
                  areasAnalysis.attention.push({
                    domain: lastDomain.domain,
                    firstScore: firstDomain.score || 0,
                    lastScore: lastDomain.score || 0,
                    variation: domainVariation
                  });
                }
              }
            });
          }

          return (
            <>
              {/* Evolution Timeline */}
              <div style={{ 
                ...cardLargeStyle, 
                marginBottom: '24px',
                pageBreakBefore: 'always'
              }}>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: 600, 
                  marginBottom: '8px', 
                  color: '#1f2937' 
                }}>
                  Linha do Tempo de Evolução
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
                  Progresso ao longo de {sortedEvals.length} avaliações
                </p>
                
                {/* Progress Summary */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-around', 
                  padding: '16px', 
                  backgroundColor: '#f0fdf4', 
                  borderRadius: '8px',
                  marginBottom: '16px'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '12px', color: '#6b7280' }}>Primeira Avaliação</p>
                    <p style={{ fontSize: '20px', fontWeight: 700, color: '#374151' }}>{firstScore}%</p>
                    <p style={{ fontSize: '11px', color: '#9ca3af' }}>{format(new Date(sortedEvals[0].date), 'dd/MM/yyyy')}</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '12px', color: '#6b7280' }}>Última Avaliação</p>
                    <p style={{ fontSize: '20px', fontWeight: 700, color: '#374151' }}>{lastScore}%</p>
                    <p style={{ fontSize: '11px', color: '#9ca3af' }}>{format(new Date(sortedEvals[sortedEvals.length - 1].date), 'dd/MM/yyyy')}</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '12px', color: '#6b7280' }}>Variação Total</p>
                    <p style={{ 
                      fontSize: '20px', 
                      fontWeight: 700, 
                      color: variation > 0 ? '#10b981' : variation < 0 ? '#ef4444' : '#6b7280'
                    }}>
                      {variation > 0 ? '+' : ''}{variation.toFixed(1)}%
                    </p>
                    <p style={{ fontSize: '11px', color: '#9ca3af' }}>
                      {variation > 0 ? '↑ Melhora' : variation < 0 ? '↓ Declínio' : '→ Estável'}
                    </p>
                  </div>
                </div>
                
                {/* Line Chart */}
                <div style={{ width: '100%', height: '250px' }}>
                  <LineChart width={700} height={240} data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 11, fill: '#6b7280' }}
                      tickLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis 
                      domain={[0, 100]} 
                      tick={{ fontSize: 11, fill: '#6b7280' }}
                      tickLine={{ stroke: '#e5e7eb' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Score Global" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                    />
                    {availableDomains.map((domain: string) => (
                      <Line 
                        key={domain}
                        type="monotone" 
                        dataKey={domain} 
                        stroke={DOMAIN_COLORS[domain] || '#888888'}
                        strokeWidth={1.5}
                        strokeDasharray="5 5"
                        dot={{ fill: DOMAIN_COLORS[domain] || '#888888', r: 3 }}
                      />
                    ))}
                  </LineChart>
                </div>
                
                {/* Legend */}
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '12px', 
                  justifyContent: 'center',
                  marginTop: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '20px', height: '3px', backgroundColor: '#3b82f6' }}></div>
                    <span style={{ fontSize: '11px', color: '#374151' }}>Score Global</span>
                  </div>
                  {availableDomains.map((domain: string) => (
                    <div key={domain} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ 
                        width: '20px', 
                        height: '2px', 
                        backgroundColor: DOMAIN_COLORS[domain] || '#888888',
                        borderTop: '2px dashed ' + (DOMAIN_COLORS[domain] || '#888888')
                      }}></div>
                      <span style={{ fontSize: '11px', color: '#374151' }}>{domain}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Areas Analysis */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '16px',
                marginBottom: '24px'
              }}>
                {/* Improved Areas */}
                <div style={{ 
                  ...cardStyle, 
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0'
                }}>
                  <h4 style={{ 
                    fontSize: '16px', 
                    fontWeight: 600, 
                    color: '#166534',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '18px' }}>&#x2714;</span> Áreas que Melhoraram
                  </h4>
                  {areasAnalysis.improved.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {areasAnalysis.improved.map((area, idx) => (
                        <div key={idx} style={{ 
                          padding: '10px', 
                          backgroundColor: '#dcfce7', 
                          borderRadius: '6px'
                        }}>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            marginBottom: '4px'
                          }}>
                            <span style={{ 
                              fontSize: '13px', 
                              fontWeight: 600, 
                              color: '#166534' 
                            }}>{area.domain}</span>
                            <span style={{ 
                              fontSize: '12px', 
                              fontWeight: 700, 
                              color: '#15803d',
                              backgroundColor: '#bbf7d0',
                              padding: '2px 8px',
                              borderRadius: '12px'
                            }}>+{area.variation.toFixed(1)}%</span>
                          </div>
                          <p style={{ fontSize: '11px', color: '#4b5563' }}>
                            {area.firstScore}% → {area.lastScore}%
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: '13px', color: '#6b7280', fontStyle: 'italic' }}>
                      Nenhuma área com melhora significativa (&gt;5%)
                    </p>
                  )}
                </div>

                {/* Attention Areas */}
                <div style={{ 
                  ...cardStyle, 
                  backgroundColor: '#fffbeb',
                  border: '1px solid #fde68a'
                }}>
                  <h4 style={{ 
                    fontSize: '16px', 
                    fontWeight: 600, 
                    color: '#92400e',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '18px' }}>&#x26A0;</span> Áreas que Precisam Atenção
                  </h4>
                  {areasAnalysis.attention.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {areasAnalysis.attention.map((area, idx) => (
                        <div key={idx} style={{ 
                          padding: '10px', 
                          backgroundColor: area.variation < 0 ? '#fef2f2' : '#fef3c7', 
                          borderRadius: '6px'
                        }}>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            marginBottom: '4px'
                          }}>
                            <span style={{ 
                              fontSize: '13px', 
                              fontWeight: 600, 
                              color: area.variation < 0 ? '#991b1b' : '#92400e'
                            }}>{area.domain}</span>
                            <span style={{ 
                              fontSize: '12px', 
                              fontWeight: 700, 
                              color: area.variation < 0 ? '#dc2626' : '#d97706',
                              backgroundColor: area.variation < 0 ? '#fecaca' : '#fde68a',
                              padding: '2px 8px',
                              borderRadius: '12px'
                            }}>
                              {area.variation > 0 ? '+' : ''}{area.variation.toFixed(1)}%
                            </span>
                          </div>
                          <p style={{ fontSize: '11px', color: '#4b5563' }}>
                            {area.firstScore}% → {area.lastScore}%
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: '13px', color: '#6b7280', fontStyle: 'italic' }}>
                      Todas as áreas apresentaram melhora significativa
                    </p>
                  )}
                </div>
              </div>
            </>
          );
        })()}

        {/* Message when only one evaluation */}
        {allEvaluations.length === 1 && (
          <div style={{ 
            ...cardStyle, 
            marginBottom: '24px',
            backgroundColor: '#f0f9ff',
            border: '1px solid #bae6fd',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '14px', color: '#0369a1' }}>
              <strong>Nota:</strong> Este é o primeiro registro de avaliação do paciente. 
              As seções de evolução e análise de áreas estarão disponíveis após a segunda avaliação.
            </p>
          </div>
        )}

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
