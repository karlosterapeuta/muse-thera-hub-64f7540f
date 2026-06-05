
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { ProfessionalData } from "@/hooks/useProfessionalData";

interface EnhancedMuseteraReportPDFProps {
  categoryData: any[];
  pieData: any[];
  radarData: any[];
  selectedParameters: any;
  overallScore: {
    raw: number;
    max: number;
    percentage: number;
    completionPercentage: number;
    evaluatedDomains: number;
    totalDomains: number;
    evaluatedParameters: number;
    totalParameters: number;
  };
  evaluationDomains: any[];
  patientName?: string;
  professionalData?: ProfessionalData | null;
  evaluationDate?: Date;
  digitalSignatureUrl?: string;
  digitalStampUrl?: string;
  professionalEmail?: string;
  professionalPhone?: string;
  professionalSpecialty?: string;
  professionalPhotoUrl?: string;
  patientData?: {
    age?: number;
    birthDate?: string;
    diagnosis?: string;
    medications?: string;
    musicalPreferences?: string;
    previousTherapies?: string;
    familyHistory?: string;
    developmentConcerns?: string;
  };
}

export const EnhancedMuseteraReportPDF: React.FC<EnhancedMuseteraReportPDFProps> = ({
  categoryData,
  pieData,
  radarData,
  selectedParameters,
  overallScore,
  evaluationDomains,
  patientName = "Paciente",
  professionalData,
  evaluationDate = new Date(),
  digitalSignatureUrl,
  digitalStampUrl,
  professionalEmail,
  professionalPhone,
  professionalSpecialty,
  professionalPhotoUrl,
  patientData = {}
}) => {
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', 'hsl(214 88% 52%)'];
  
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return '#10B981'; // Verde
    if (percentage >= 60) return '#3B82F6'; // Azul
    if (percentage >= 40) return '#F59E0B'; // Amarelo
    if (percentage >= 20) return '#F97316'; // Laranja
    return '#EF4444'; // Vermelho
  };

  const getScoreDescription = (percentage: number) => {
    if (percentage >= 80) return 'Excelente';
    if (percentage >= 60) return 'Bom';
    if (percentage >= 40) return 'Regular';
    if (percentage >= 20) return 'Necessita Atenção';
    return 'Requer Intervenção Imediata';
  };

  const ProgressBar = ({ percentage, label }: { percentage: number; label: string }) => (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '12px', fontWeight: '500', color: '#374151' }}>{label}</span>
        <span style={{ fontSize: '12px', fontWeight: '600', color: getScoreColor(percentage) }}>{percentage}%</span>
      </div>
      <div style={{ width: '100%', height: '8px', backgroundColor: '#F3F4F6', borderRadius: '4px', overflow: 'hidden' }}>
        <div 
          style={{ 
            width: `${percentage}%`, 
            height: '100%', 
            backgroundColor: getScoreColor(percentage),
            background: `linear-gradient(90deg, ${getScoreColor(percentage)} 0%, ${getScoreColor(percentage)}CC 100%)`,
            transition: 'width 0.3s ease'
          }} 
        />
      </div>
    </div>
  );

  const ScoreBadge = ({ score }: { score: number }) => {
    return (
      <div style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        backgroundColor: getScoreColor(score), 
        color: 'white', 
        padding: '6px 12px', 
        borderRadius: '20px', 
        fontSize: '12px', 
        fontWeight: '600',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {score} pontos ({score}%)
      </div>
    );
  };

  const SectionHeader = ({ title, icon }: { title: string; icon: string }) => (
    <div style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '16px 20px',
      borderRadius: '8px',
      marginBottom: '20px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <h2 style={{ 
        margin: '0', 
        fontSize: '18px', 
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{ fontSize: '20px' }}>{icon}</span>
        {title}
      </h2>
    </div>
  );

  return (
    <div style={{ 
      fontFamily: '"Segoe UI", system-ui, -apple-system, sans-serif',
      lineHeight: '1.6',
      color: '#1F2937',
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: '#FFFFFF'
    }}>
      {/* Header Premium */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '40px 30px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ 
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat',
          opacity: '0.1'
        }} />
        
        <div style={{ position: 'relative', zIndex: '1' }}>
          <div style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px',
            backdropFilter: 'blur(10px)'
          }}>
            <h1 style={{ 
              fontSize: '32px', 
              fontWeight: '800', 
              margin: '0 0 8px 0',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              🎵 MuseTera
            </h1>
            <p style={{ 
              fontSize: '16px', 
              opacity: '0.9', 
              margin: '0',
              fontWeight: '300'
            }}>
              Sistema Especializado em Avaliação Musicoterapêutica
            </p>
          </div>
          
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: '700', 
            margin: '0 0 16px 0'
          }}>
            Relatório de Avaliação Completo
          </h2>
          
          <div style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            padding: '16px',
            display: 'inline-block'
          }}>
            <h3 style={{ 
              fontSize: '22px', 
              margin: '0 0 8px 0', 
              fontWeight: '600'
            }}>
              {patientName}
            </h3>
            <p style={{ 
              fontSize: '14px', 
              margin: '0', 
              opacity: '0.9'
            }}>
              📅 {format(evaluationDate, 'dd \'de\' MMMM \'de\' yyyy', { locale: ptBR })}
            </p>
          </div>
        </div>
      </div>

      {/* Sumário Executivo */}
      <div style={{ padding: '30px' }}>
        <SectionHeader title="Sumário Executivo" icon="📊" />
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '20px', 
          marginBottom: '30px' 
        }}>
          <div style={{ 
            backgroundColor: '#F8FAFC',
            border: '2px solid #E2E8F0',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 12px 0', color: '#475569', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase' }}>
              Pontuação Global
            </h3>
            <div style={{ 
              fontSize: '48px', 
              fontWeight: '800', 
              color: getScoreColor(overallScore.percentage),
              margin: '8px 0'
            }}>
              {overallScore.percentage}%
            </div>
            <p style={{ 
              margin: '0', 
              fontSize: '16px', 
              fontWeight: '600',
              color: getScoreColor(overallScore.percentage)
            }}>
              {getScoreDescription(overallScore.percentage)}
            </p>
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#64748B' }}>
              {overallScore.raw} de {overallScore.max} pontos
            </p>
          </div>

          <div style={{ 
            backgroundColor: '#F8FAFC',
            border: '2px solid #E2E8F0',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#475569', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase' }}>
              Perfil por Domínios
            </h3>
            {radarData.map((domain, index) => (
              <ProgressBar 
                key={index}
                percentage={domain.value} 
                label={domain.name} 
              />
            ))}
          </div>
        </div>

        {/* Gráficos */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '30px', 
          marginBottom: '40px' 
        }}>
          <div style={{ 
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
          }}>
            <h3 style={{ 
              margin: '0 0 20px 0', 
              fontSize: '16px', 
              fontWeight: '600',
              color: '#374151',
              textAlign: 'center'
            }}>
              📈 Perfil de Habilidades
            </h3>
            <div style={{ height: '250px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#E5E7EB" />
                  <PolarAngleAxis 
                    dataKey="name" 
                    tick={{ fontSize: 10, fill: '#6B7280' }}
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 100]} 
                    tick={{ fontSize: 8, fill: '#9CA3AF' }}
                  />
                  <Radar 
                    name="Perfil" 
                    dataKey="value" 
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ 
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
          }}>
            <h3 style={{ 
              margin: '0 0 20px 0', 
              fontSize: '16px', 
              fontWeight: '600',
              color: '#374151',
              textAlign: 'center'
            }}>
              🎯 Distribuição de Desenvolvimento
            </h3>
            <div style={{ height: '250px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              {pieData.map((entry, index) => (
                <div key={index} style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  margin: '0 8px', 
                  fontSize: '12px' 
                }}>
                  <div style={{ 
                    width: '12px', 
                    height: '12px', 
                    backgroundColor: COLORS[index % COLORS.length], 
                    borderRadius: '2px', 
                    marginRight: '4px' 
                  }} />
                  {entry.name}: {entry.value}%
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Análise Detalhada por Domínios */}
        <SectionHeader title="Análise Detalhada por Domínios" icon="🔍" />
        
        {evaluationDomains.map((domain, domainIndex) => (
          <div key={domainIndex} style={{ 
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '20px',
              paddingBottom: '12px',
              borderBottom: '2px solid #F3F4F6'
            }}>
              <span style={{ fontSize: '32px', marginRight: '12px' }}>{domain.icon}</span>
              <h3 style={{ 
                margin: '0', 
                fontSize: '20px', 
                fontWeight: '700',
                color: '#1F2937'
              }}>
                {domain.title}
              </h3>
            </div>

            {domain.subdomains.map((subdomain: any, subIndex: number) => (
              <div key={subIndex} style={{ 
                marginBottom: '20px',
                backgroundColor: '#F9FAFB',
                borderRadius: '8px',
                padding: '16px'
              }}>
                <h4 style={{ 
                  margin: '0 0 12px 0', 
                  fontSize: '16px', 
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  {subdomain.title}
                </h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  {subdomain.parameters.map((parameter: string, paramIndex: number) => {
                    const key = `${domain.title}-${subdomain.title}-${parameter}`;
                    const value = selectedParameters[key];
                    const score = value === "nao_observado" ? 0 : 
                                 value === "emergente" ? 20 : 
                                 value === "inconsistente" ? 40 : 
                                 value === "moderado" ? 60 : 
                                 value === "consistente" ? 80 : 
                                 value === "excepcional" ? 100 : 0;
                    
                    return (
                      <div key={paramIndex} style={{ 
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E5E7EB',
                        borderRadius: '6px',
                        padding: '12px'
                      }}>
                        <div style={{ 
                          fontSize: '12px', 
                          fontWeight: '500', 
                          marginBottom: '6px',
                          color: '#374151'
                        }}>
                          {parameter}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ 
                            fontSize: '11px', 
                            color: '#6B7280',
                            textTransform: 'capitalize'
                          }}>
                            {value || 'Não avaliado'}
                          </span>
                          <ScoreBadge score={score} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* Recomendações Terapêuticas */}
        <SectionHeader title="Recomendações Terapêuticas" icon="💡" />
        
        <div style={{ 
          backgroundColor: '#FEF7CD',
          border: '2px solid #FDE047',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '30px'
        }}>
          <h3 style={{ 
            margin: '0 0 16px 0', 
            fontSize: '18px', 
            fontWeight: '600',
            color: '#92400E'
          }}>
            🎯 Objetivos Prioritários
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            {radarData
              .filter(domain => domain.value < 70)
              .sort((a, b) => a.value - b.value)
              .slice(0, 3)
              .map((domain, index) => (
                <div key={index} style={{ 
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #F59E0B',
                  borderRadius: '8px',
                  padding: '16px'
                }}>
                  <h4 style={{ 
                    margin: '0 0 8px 0', 
                    fontSize: '14px', 
                    fontWeight: '600',
                    color: '#92400E'
                  }}>
                    {domain.name}
                  </h4>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#451A03',
                    lineHeight: '1.5'
                  }}>
                    Requer atenção especial para desenvolvimento das habilidades relacionadas.
                  </div>
                  <div style={{ marginTop: '8px' }}>
                    <ProgressBar percentage={domain.value} label="Progresso atual" />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Metodologia */}
        <SectionHeader title="Metodologia e Validação" icon="🔬" />
        
        <div style={{ 
          backgroundColor: '#F0F9FF',
          border: '1px solid #0EA5E9',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '30px'
        }}>
          <p style={{ 
            margin: '0 0 16px 0', 
            fontSize: '14px', 
            lineHeight: '1.6',
            color: '#0C4A6E'
          }}>
            <strong>Base Científica:</strong> Esta avaliação baseia-se em protocolos estabelecidos da musicoterapia clínica, 
            integrando aspectos neurológicos, psicológicos e musicais do desenvolvimento humano.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#0369A1' }}>4</div>
              <div style={{ fontSize: '12px', color: '#0C4A6E' }}>Domínios Avaliados</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#0369A1' }}>8</div>
              <div style={{ fontSize: '12px', color: '#0C4A6E' }}>Subdomínios</div>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#0369A1', textAlign: 'center' }}>
              <div>{evaluationDomains.reduce((total, domain) => total + domain.subdomains.reduce((subTotal: number, subdomain: any) => subTotal + subdomain.parameters.length, 0), 0)}</div>
              <div style={{ fontSize: '12px', color: '#0C4A6E' }}>Parâmetros</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#0369A1' }}>5</div>
              <div style={{ fontSize: '12px', color: '#0C4A6E' }}>Níveis de Avaliação</div>
            </div>
          </div>
        </div>

        {/* Informações do Profissional */}
        <div style={{ 
          border: '3px solid transparent',
          borderImage: 'linear-gradient(135deg, #0d9488, #14b8a6, #06b6d4) 1',
          borderRadius: '16px',
          overflow: 'hidden',
          marginTop: '40px',
          background: '#ffffff',
          boxShadow: '0 8px 24px rgba(13, 148, 136, 0.15)'
        }}>
          {/* Barra Decorativa Superior */}
          <div style={{
            height: '8px',
            background: 'linear-gradient(90deg, #0d9488 0%, #14b8a6 50%, #06b6d4 100%)',
          }}></div>

          {/* Seção Principal com Foto e Carimbo */}
          <div style={{ padding: '32px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '32px',
              alignItems: 'start'
            }}>
              {/* Lado Esquerdo: Foto e Informações do Profissional */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Foto do Profissional com Blur Effect */}
                {professionalPhotoUrl && (
                  <div style={{
                    width: '160px',
                    height: '160px',
                    borderRadius: '50%',
                    position: 'relative',
                    marginBottom: '20px'
                  }}>
                    <div style={{
                      position: 'absolute',
                      inset: '-8px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #14b8a6, #22d3ee, #0d9488)',
                      opacity: 0.4,
                      filter: 'blur(20px)'
                    }} />
                    <img 
                      src={professionalPhotoUrl}
                      alt="Professional"
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '4px solid #ffffff',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                        position: 'relative',
                        zIndex: 1
                      }}
                    />
                  </div>
                )}

                {/* Nome e Badge */}
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <div style={{ 
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#0f766e',
                    marginBottom: '8px',
                    lineHeight: '1.3'
                  }}>
                    {professionalData?.name || 'Profissional'}
                  </div>
                  
                  <div style={{
                    backgroundColor: '#ccfbf1',
                    border: '1px solid #99f6e4',
                    borderRadius: '20px',
                    padding: '4px 12px',
                    display: 'inline-block',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontSize: '11px', color: '#0f766e', fontWeight: '600' }}>
                      🎵 {professionalSpecialty || professionalData?.specialty || 'Musicoterapeuta'}
                    </span>
                  </div>
                </div>

                {/* Informações de Contato */}
                <div style={{ fontSize: '12px', color: '#374151', lineHeight: '1.6', textAlign: 'center' }}>
                  {(professionalData?.register || professionalData?.license_number) && (
                    <div style={{ marginBottom: '4px' }}>
                      <span style={{ marginRight: '4px' }}>📋</span>
                      {professionalData?.register || professionalData?.license_number}
                    </div>
                  )}
                  {(professionalEmail || professionalData?.email) && (
                    <div style={{ marginBottom: '4px' }}>
                      <span style={{ marginRight: '4px' }}>📧</span>
                      {professionalEmail || professionalData?.email}
                    </div>
                  )}
                  {(professionalPhone || professionalData?.phone) && (
                    <div>
                      <span style={{ marginRight: '4px' }}>📞</span>
                      {professionalPhone || professionalData?.phone}
                    </div>
                  )}
                </div>
              </div>

              {/* Lado Direito: Carimbo Digital Circular - Design Programático */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: '280px',
                  height: '280px',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {/* Borda decorativa externa tracejada */}
                  <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    border: '3px dashed #14b8a6',
                    opacity: 0.3
                  }} />
                  
                  {/* Círculo interno com conteúdo */}
                  <div style={{
                    width: '240px',
                    height: '240px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #f0fdfa, #ccfbf1)',
                    border: '4px solid #14b8a6',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    boxShadow: '0 8px 24px rgba(20,184,166,0.2), inset 0 2px 8px rgba(20,184,166,0.1)'
                  }}>
                    {/* Foto do Profissional */}
                    {professionalPhotoUrl ? (
                      <div style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '3px solid #14b8a6',
                        marginBottom: '10px',
                        backgroundColor: '#ffffff'
                      }}>
                        <img 
                          src={professionalPhotoUrl} 
                          alt="Professional"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    ) : (
                      <div style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '50%',
                        backgroundColor: '#ccfbf1',
                        border: '3px solid #14b8a6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '10px',
                        fontSize: '24px'
                      }}>
                        🎵
                      </div>
                    )}

                    {/* Nome do Profissional */}
                    <div style={{
                      fontSize: '13px',
                      fontWeight: 'bold',
                      color: '#0f766e',
                      textAlign: 'center',
                      marginBottom: '6px',
                      lineHeight: '1.2',
                      maxWidth: '180px'
                    }}>
                      {professionalData?.name || 'Profissional'}
                    </div>

                    {/* Linha divisória */}
                    <div style={{
                      width: '80px',
                      height: '2px',
                      background: 'linear-gradient(to right, transparent, #14b8a6, transparent)',
                      marginBottom: '6px'
                    }} />

                    {/* Badge de Especialidade */}
                    <div style={{
                      backgroundColor: '#ccfbf1',
                      border: '1px solid #99f6e4',
                      borderRadius: '16px',
                      padding: '3px 10px',
                      marginBottom: '6px'
                    }}>
                      <span style={{ fontSize: '9px', color: '#0f766e', fontWeight: '600' }}>
                        🎵 {professionalSpecialty || professionalData?.specialty || 'Musicoterapeuta'}
                      </span>
                    </div>

                    {/* Registro */}
                    {(professionalData?.register || professionalData?.license_number) && (
                      <div style={{ fontSize: '10px', color: '#374151', fontWeight: '600' }}>
                        {professionalData?.register || professionalData?.license_number}
                      </div>
                    )}
                  </div>
                </div>

                {/* Badge de Verificação abaixo do carimbo */}
                <div style={{
                  marginTop: '12px',
                  backgroundColor: '#f0fdfa',
                  border: '1px solid #99f6e4',
                  borderRadius: '20px',
                  padding: '6px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{ color: '#0d9488', fontSize: '12px' }}>✓</span>
                  <span style={{ fontSize: '11px', color: '#0f766e', fontWeight: '600' }}>
                    MuseTera Verified
                  </span>
                  <span style={{ fontSize: '12px' }}>🎵</span>
                </div>
              </div>
            </div>

            {/* Verificação Footer */}
            <div style={{
              borderTop: '1px solid #99f6e4',
              background: 'linear-gradient(to right, #f0fdfa, #ecfeff, #f0fdfa)',
              padding: '12px 16px',
              marginTop: '24px'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '8px' 
              }}>
                <span style={{ color: '#0d9488' }}>✓</span>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f766e' }}>
                  Assinatura Digital Verificada
                </span>
                <span style={{ color: '#0d9488' }}>🎵</span>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>
                  Sistema MuseTera
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
