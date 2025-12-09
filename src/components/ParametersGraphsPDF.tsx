
import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, Radar, LineChart, Line, Legend, Tooltip } from 'recharts';
import { format } from 'date-fns';
import { ProfessionalData } from "@/hooks/useProfessionalData";
import { SavedEvaluation } from "@/hooks/useEvaluationStorage";
import { generateSuggestions, DomainSuggestion } from "@/pages/evaluation/utils/suggestionEngine";

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
  // Assinatura digital e carimbo
  professionalPhotoBase64?: string;
  digitalStampBase64?: string;
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
  allEvaluations = [],
  professionalPhotoBase64,
  digitalStampBase64,
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

        {/* Evolution & Areas Section - Different display for 1 vs 2+ evaluations */}
        {allEvaluations.length >= 1 && (() => {
          const hasMultipleEvaluations = allEvaluations.length > 1;
          
          if (hasMultipleEvaluations) {
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
          } else {
            // Single evaluation - Show Current Performance Profile + Areas by Score
            const singleEval = allEvaluations[0];
            const domainScores: any[] = singleEval?.content?.domainScores || [];
            const currentScore = singleEval?.content?.overallScore?.percentage || 0;
            
            // Separate areas by score threshold
            const strongAreas = domainScores.filter((d: any) => (d.score || 0) >= 60);
            const priorityAreas = domainScores.filter((d: any) => (d.score || 0) < 60);
            
            // Sort by score
            strongAreas.sort((a, b) => (b.score || 0) - (a.score || 0));
            priorityAreas.sort((a, b) => (a.score || 0) - (b.score || 0));
            
            return (
              <>
                {/* Current Performance Profile */}
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
                    Perfil de Desempenho Atual
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
                    Primeira avaliação do paciente - Score Global: <strong>{currentScore}%</strong>
                  </p>
                  
                  {/* Horizontal Bar Chart by Domain */}
                  <div style={{ width: '100%', height: '200px' }}>
                    <BarChart
                      layout="vertical"
                      width={700}
                      height={180}
                      data={domainScores}
                      margin={{ top: 10, right: 30, left: 100, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        type="number" 
                        domain={[0, 100]} 
                        tick={{ fontSize: 11, fill: '#6b7280' }}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <YAxis 
                        dataKey="domain" 
                        type="category" 
                        tick={{ fontSize: 12, fill: '#374151' }}
                        width={90}
                      />
                      <Tooltip 
                        formatter={(value: number) => [`${value}%`, 'Score']}
                        contentStyle={{ 
                          backgroundColor: '#ffffff', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                      <Bar 
                        dataKey="score" 
                        radius={[0, 4, 4, 0]}
                      >
                        {domainScores.map((entry: any, index: number) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={DOMAIN_COLORS[entry.domain] || '#3b82f6'} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </div>
                  
                  <p style={{ 
                    marginTop: '16px', 
                    fontSize: '12px', 
                    color: '#6b7280', 
                    fontStyle: 'italic',
                    textAlign: 'center',
                    padding: '12px',
                    backgroundColor: '#f0f9ff',
                    borderRadius: '6px'
                  }}>
                    ℹ️ A evolução temporal estará disponível após a próxima avaliação.
                  </p>
                </div>

                {/* Areas by Absolute Score */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '16px',
                  marginBottom: '24px'
                }}>
                  {/* Strong Areas (≥60%) */}
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
                      <span style={{ fontSize: '18px' }}>&#x2B50;</span> Áreas de Destaque
                    </h4>
                    <p style={{ fontSize: '11px', color: '#6b7280', marginBottom: '10px' }}>
                      Domínios com score ≥60%
                    </p>
                    {strongAreas.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {strongAreas.map((area: any, idx: number) => (
                          <div key={idx} style={{ 
                            padding: '10px', 
                            backgroundColor: '#dcfce7', 
                            borderRadius: '6px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <span style={{ 
                              fontSize: '13px', 
                              fontWeight: 600, 
                              color: '#166534' 
                            }}>{area.domain}</span>
                            <span style={{ 
                              fontSize: '14px', 
                              fontWeight: 700, 
                              color: '#15803d',
                              backgroundColor: '#bbf7d0',
                              padding: '4px 10px',
                              borderRadius: '12px'
                            }}>{area.score}%</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ fontSize: '13px', color: '#6b7280', fontStyle: 'italic' }}>
                        Nenhum domínio com score ≥60%
                      </p>
                    )}
                  </div>

                  {/* Priority Areas (<60%) */}
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
                      <span style={{ fontSize: '18px' }}>&#x1F3AF;</span> Áreas Prioritárias
                    </h4>
                    <p style={{ fontSize: '11px', color: '#6b7280', marginBottom: '10px' }}>
                      Domínios com score &lt;60% (foco terapêutico)
                    </p>
                    {priorityAreas.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {priorityAreas.map((area: any, idx: number) => (
                          <div key={idx} style={{ 
                            padding: '10px', 
                            backgroundColor: (area.score || 0) < 40 ? '#fef2f2' : '#fef3c7', 
                            borderRadius: '6px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <span style={{ 
                              fontSize: '13px', 
                              fontWeight: 600, 
                              color: (area.score || 0) < 40 ? '#991b1b' : '#92400e'
                            }}>{area.domain}</span>
                            <span style={{ 
                              fontSize: '14px', 
                              fontWeight: 700, 
                              color: (area.score || 0) < 40 ? '#dc2626' : '#d97706',
                              backgroundColor: (area.score || 0) < 40 ? '#fecaca' : '#fde68a',
                              padding: '4px 10px',
                              borderRadius: '12px'
                            }}>{area.score}%</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ fontSize: '13px', color: '#6b7280', fontStyle: 'italic' }}>
                        Todos os domínios estão acima de 60%
                      </p>
                    )}
                  </div>
                </div>

              </>
            );
          }
        })()}

        {/* Therapeutic Suggestions Section - Works with 1+ evaluations */}
        {allEvaluations.length >= 1 && (() => {
          const suggestions = generateSuggestions(allEvaluations);
          if (suggestions.length === 0) return null;
          
          return (
            <div style={{ 
              ...cardLargeStyle, 
              marginTop: '24px',
              pageBreakBefore: 'always',
              background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #e0e7ff 100%)',
              border: '1px solid #c4b5fd'
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: 700, 
                marginBottom: '8px', 
                color: '#5b21b6',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ fontSize: '20px' }}>&#x1F4A1;</span> Sugestões Terapêuticas
              </h3>
              <p style={{ fontSize: '13px', color: '#7c3aed', marginBottom: '20px' }}>
                Baseadas nos 3 domínios prioritários para intervenção
              </p>
              
              {suggestions.map((suggestion, index) => (
                <div key={index} style={{ 
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                  padding: '16px',
                  marginBottom: index < suggestions.length - 1 ? '16px' : '0',
                  border: '1px solid #ddd6fe',
                  boxShadow: '0 2px 4px rgba(139, 92, 246, 0.1)'
                }}>
                  {/* Domain Header */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                    paddingBottom: '10px',
                    borderBottom: '1px solid #ede9fe'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: index === 0 ? '#ef4444' : index === 1 ? '#f59e0b' : '#3b82f6',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 700
                      }}>
                        {index + 1}
                      </span>
                      <span style={{ 
                        fontSize: '15px', 
                        fontWeight: 600, 
                        color: '#1f2937' 
                      }}>
                        Domínio {suggestion.shortName}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#ffffff',
                        backgroundColor: suggestion.score < 40 ? '#ef4444' : suggestion.score < 60 ? '#f59e0b' : '#22c55e',
                        padding: '3px 10px',
                        borderRadius: '12px'
                      }}>
                        {suggestion.score}%
                      </span>
                      <span style={{
                        fontSize: '11px',
                        color: suggestion.trend === 'improving' ? '#16a34a' : suggestion.trend === 'declining' ? '#dc2626' : '#6b7280'
                      }}>
                        {suggestion.trend === 'improving' ? '↑ Melhorando' : 
                         suggestion.trend === 'declining' ? '↓ Declinando' : '→ Estável'}
                      </span>
                    </div>
                  </div>

                  {/* Therapeutic Objectives */}
                  <div style={{ marginBottom: '14px' }}>
                    <h5 style={{ 
                      fontSize: '13px', 
                      fontWeight: 600, 
                      color: '#5b21b6',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <span>&#x1F3AF;</span> Objetivos Terapêuticos
                    </h5>
                    {suggestion.objectives.slice(0, 2).map((obj, objIdx) => (
                      <div key={objIdx} style={{ 
                        backgroundColor: '#faf5ff',
                        borderRadius: '6px',
                        padding: '10px',
                        marginBottom: objIdx < 1 ? '8px' : '0'
                      }}>
                        <p style={{ 
                          fontSize: '12px', 
                          fontWeight: 600, 
                          color: '#7c3aed',
                          marginBottom: '6px'
                        }}>
                          {obj.objective}
                        </p>
                        <ul style={{ margin: 0, paddingLeft: '16px' }}>
                          {obj.strategies.slice(0, 2).map((strategy, sIdx) => (
                            <li key={sIdx} style={{ 
                              fontSize: '11px', 
                              color: '#4b5563',
                              marginBottom: '2px'
                            }}>
                              {strategy}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Suggested Activities */}
                  {suggestion.activities.length > 0 && (
                    <div style={{ marginBottom: '14px' }}>
                      <h5 style={{ 
                        fontSize: '13px', 
                        fontWeight: 600, 
                        color: '#5b21b6',
                        marginBottom: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <span>&#x1F4CB;</span> Atividades Sugeridas
                      </h5>
                      <div style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: '8px' 
                      }}>
                        {suggestion.activities.slice(0, 3).map((activity, actIdx) => (
                          <div key={actIdx} style={{
                            backgroundColor: '#f0fdf4',
                            border: '1px solid #bbf7d0',
                            borderRadius: '6px',
                            padding: '8px 10px',
                            flex: '1 1 calc(33% - 8px)',
                            minWidth: '140px'
                          }}>
                            <p style={{ 
                              fontSize: '11px', 
                              fontWeight: 600, 
                              color: '#15803d',
                              marginBottom: '2px'
                            }}>
                              {activity.title}
                            </p>
                            <p style={{ 
                              fontSize: '10px', 
                              color: '#4b5563',
                              lineHeight: 1.3
                            }}>
                              {activity.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* MuseTera Games */}
                  {suggestion.games.length > 0 && (
                    <div>
                      <h5 style={{ 
                        fontSize: '13px', 
                        fontWeight: 600, 
                        color: '#5b21b6',
                        marginBottom: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <span>&#x1F3AE;</span> Jogos MuseTera Recomendados
                      </h5>
                      <div style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: '8px' 
                      }}>
                        {suggestion.games.slice(0, 3).map((game, gameIdx) => (
                          <div key={gameIdx} style={{
                            backgroundColor: '#eff6ff',
                            border: '1px solid #bfdbfe',
                            borderRadius: '6px',
                            padding: '8px 10px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            flex: '1 1 calc(33% - 8px)',
                            minWidth: '140px'
                          }}>
                            <span style={{ fontSize: '18px' }}>{game.icon}</span>
                            <div>
                              <p style={{ 
                                fontSize: '11px', 
                                fontWeight: 600, 
                                color: '#1d4ed8'
                              }}>
                                {game.name}
                              </p>
                              <p style={{ 
                                fontSize: '9px', 
                                color: '#6b7280',
                                lineHeight: 1.2
                              }}>
                                {game.benefit}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
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

        {/* Footer TEAL com Assinatura Digital e Carimbo - Design Idêntico à Pré-visualização */}
        <div style={{
          marginTop: '50px',
          border: '3px solid #0d9488',
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundColor: '#ffffff'
        }}>
          {/* Decorative Top Bar - Gradient */}
          <div style={{
            height: '8px',
            background: 'linear-gradient(to right, #0d9488, #14b8a6, #06b6d4)'
          }}></div>
          
          {/* Main Content - Flexbox */}
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '24px 32px',
            gap: '32px',
            background: 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 50%, #ecfeff 100%)'
          }}>
            {/* Left Column - Signature Card */}
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '16px',
              flex: 1
            }}>
              {/* Professional Photo with Gradient Border Effect */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                {/* Blur/Glow Effect */}
                <div style={{
                  position: 'absolute',
                  inset: '-4px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #14b8a6, #06b6d4, #0d9488)',
                  opacity: 0.6
                }}></div>
                <div style={{
                  position: 'relative',
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  border: '4px solid #ffffff',
                  overflow: 'hidden',
                  backgroundColor: '#ccfbf1',
                  boxShadow: '0 4px 15px rgba(13, 148, 136, 0.3)'
                }}>
                  {professionalPhotoBase64 ? (
                    <img
                      src={professionalPhotoBase64}
                      alt="Foto do profissional"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '28px',
                      fontWeight: 'bold',
                      color: '#0d9488'
                    }}>
                      {professionalData?.name?.charAt(0) || 'M'}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Professional Info */}
              <div style={{ flex: 1 }}>
                <p style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#0d9488',
                  marginBottom: '6px'
                }}>
                  {professionalData?.name || 'Musicoterapeuta'}
                </p>
                
                {professionalData?.specialty && (
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#f0fdfa',
                    border: '1px solid #99f6e4',
                    borderRadius: '16px',
                    padding: '4px 12px',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontSize: '12px' }}>♪</span>
                    <span style={{ fontSize: '12px', color: '#0d9488', fontWeight: 600 }}>
                      {professionalData.specialty}
                    </span>
                  </div>
                )}
                
                <div style={{ marginTop: '4px' }}>
                  {professionalData?.register && (
                    <p style={{ fontSize: '11px', color: '#6b7280', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '10px' }}>📋</span> {professionalData.register}
                    </p>
                  )}
                  {professionalData?.email && (
                    <p style={{ fontSize: '11px', color: '#6b7280', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '10px' }}>✉</span> {professionalData.email}
                    </p>
                  )}
                  {professionalData?.phone && (
                    <p style={{ fontSize: '11px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '10px' }}>☎</span> {professionalData.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right Column - Circular Stamp (Redesenhado igual à pré-visualização) */}
            <div style={{
              position: 'relative',
              width: '180px',
              height: '180px',
              flexShrink: 0
            }}>
              {/* Outer Decorative Ring - Dashed */}
              <div style={{
                position: 'absolute',
                inset: '0',
                borderRadius: '50%',
                border: '4px dashed #99f6e4',
                opacity: 0.5
              }}></div>
              
              {/* Second Ring - Solid */}
              <div style={{
                position: 'absolute',
                inset: '8px',
                borderRadius: '50%',
                border: '2px solid #5eead4',
                opacity: 0.7
              }}></div>
              
              {/* Gradient Blur Background */}
              <div style={{
                position: 'absolute',
                inset: '12px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #14b8a6, #06b6d4, #0d9488)',
                opacity: 0.15
              }}></div>
              
              {/* Main Stamp Border */}
              <div style={{
                position: 'absolute',
                inset: '12px',
                borderRadius: '50%',
                border: '6px solid #0d9488',
                backgroundColor: '#f0fdfa',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px',
                boxShadow: '0 4px 20px rgba(13, 148, 136, 0.25)'
              }}>
                {/* Professional Photo with Gradient Effect */}
                <div style={{ position: 'relative', marginBottom: '8px' }}>
                  <div style={{
                    position: 'absolute',
                    inset: '-3px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #14b8a6, #06b6d4, #0d9488)',
                    opacity: 0.7
                  }}></div>
                  <div style={{
                    position: 'relative',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    border: '2px solid #ffffff',
                    overflow: 'hidden',
                    backgroundColor: '#ccfbf1'
                  }}>
                    {professionalPhotoBase64 ? (
                      <img
                        src={professionalPhotoBase64}
                        alt="Foto"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#0d9488'
                      }}>
                        {professionalData?.name?.charAt(0) || 'M'}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Professional Name */}
                <p style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#0d9488',
                  textAlign: 'center',
                  lineHeight: 1.2,
                  maxWidth: '120px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  marginBottom: '4px'
                }}>
                  {professionalData?.name || 'Musicoterapeuta'}
                </p>
                
                {/* Decorative Separator */}
                <div style={{
                  width: '50px',
                  height: '2px',
                  background: 'linear-gradient(to right, transparent, #14b8a6, transparent)',
                  marginBottom: '6px'
                }}></div>
                
                {/* Specialty Badge */}
                {professionalData?.specialty && (
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px',
                    backgroundColor: '#ccfbf1',
                    border: '1px solid #5eead4',
                    borderRadius: '10px',
                    padding: '2px 8px',
                    marginBottom: '4px'
                  }}>
                    <span style={{ fontSize: '8px' }}>♪</span>
                    <span style={{
                      fontSize: '8px',
                      fontWeight: 600,
                      color: '#0d9488',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {professionalData.specialty}
                    </span>
                    <span style={{ fontSize: '8px' }}>♪</span>
                  </div>
                )}
                
                {/* Registration */}
                {professionalData?.register && (
                  <p style={{
                    fontSize: '9px',
                    color: '#6b7280',
                    textAlign: 'center',
                    marginBottom: '6px'
                  }}>
                    {professionalData.register}
                  </p>
                )}
                
                {/* MuseTera Verified Badge */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'linear-gradient(135deg, #0d9488, #06b6d4)',
                  borderRadius: '10px',
                  padding: '3px 8px',
                  boxShadow: '0 2px 8px rgba(13, 148, 136, 0.3)'
                }}>
                  <span style={{ fontSize: '8px', color: '#ffffff' }}>✔</span>
                  <span style={{
                    fontSize: '7px',
                    fontWeight: 700,
                    color: '#ffffff',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    MuseTera Verified
                  </span>
                  <span style={{ fontSize: '8px', color: '#ffffff' }}>♪</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Verification Footer */}
          <div style={{
            borderTop: '1px solid #99f6e4',
            background: 'linear-gradient(to right, #f0fdfa, #ecfeff, #f0fdfa)',
            padding: '10px 16px',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: '#0d9488' }}>✔</span>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#0d9488' }}>
                Assinatura Digital Verificada
              </span>
              <span style={{ fontSize: '12px', color: '#0d9488' }}>♪</span>
              <span style={{ fontSize: '10px', color: '#6b7280' }}>
                Sistema MuseTera
              </span>
            </div>
            <p style={{ fontSize: '9px', color: '#6b7280', marginTop: '4px' }}>
              Documento gerado em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
