import React from 'react';

interface EvaluationTextContent {
  sintese_geral: string;
  conquistas: {
    introducao: string;
    por_dominio: Array<{
      dominio: string;
      analise: string;
    }>;
  };
  areas_desenvolvimento: {
    introducao: string;
    por_dominio: Array<{
      dominio: string;
      analise: string;
    }>;
  };
  recomendacoes: string[];
  objetivos: Array<{
    dominio: string;
    objetivo: string;
  }>;
}

interface EvaluationTextPDFProps {
  content: EvaluationTextContent;
  patientName: string;
  patientAge: number | null;
  evaluationDate: string;
  professionalName: string;
  professionalRegister?: string;
  digitalSignatureUrl?: string;
  digitalStampUrl?: string;
  professionalEmail?: string;
  professionalPhone?: string;
  professionalSpecialty?: string;
  professionalPhotoUrl?: string;
  overallScore: {
    percentage: number;
    evaluatedDomains: number;
    totalDomains: number;
    evaluatedParameters: number;
  };
}

export const EvaluationTextPDF: React.FC<EvaluationTextPDFProps> = ({
  content,
  patientName,
  patientAge,
  evaluationDate,
  professionalName,
  professionalRegister,
  digitalSignatureUrl,
  digitalStampUrl,
  professionalEmail,
  professionalPhone,
  professionalSpecialty,
  professionalPhotoUrl,
  overallScore,
}) => {
  return (
    <div 
      id="evaluation-text-pdf" 
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '20mm',
        backgroundColor: '#ffffff',
        fontFamily: 'Arial, sans-serif',
        color: '#1a1a1a',
        fontSize: '11pt',
        lineHeight: '1.6',
      }}
    >
      {/* Cabeçalho */}
      <div style={{ 
        borderBottom: '3px solid #0f766e',
        paddingBottom: '15px',
        marginBottom: '25px',
      }}>
        <h1 style={{
          fontSize: '22pt',
          fontWeight: 'bold',
          color: '#0f766e',
          margin: '0 0 8px 0',
          textAlign: 'center',
        }}>
          RELATÓRIO DE AVALIAÇÃO MUSICOTERAPÊUTICA
        </h1>
        <h2 style={{
          fontSize: '14pt',
          color: '#64748b',
          margin: '0',
          textAlign: 'center',
          fontWeight: 'normal',
        }}>
          Escala MuseTera de Avaliação
        </h2>
      </div>

      {/* Dados do Paciente */}
      <div style={{
        backgroundColor: '#f1f5f9',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '25px',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <strong style={{ color: '#0f766e' }}>Paciente:</strong> {patientName}
          </div>
          <div>
            <strong style={{ color: '#0f766e' }}>Idade:</strong> {patientAge ? `${patientAge} anos` : 'Não informada'}
          </div>
          <div>
            <strong style={{ color: '#0f766e' }}>Data da Avaliação:</strong> {evaluationDate}
          </div>
          <div>
            <strong style={{ color: '#0f766e' }}>Pontuação Global:</strong> {overallScore.percentage}%
          </div>
        </div>
        <div style={{ marginTop: '10px' }}>
          <strong style={{ color: '#0f766e' }}>Domínios Avaliados:</strong> {overallScore.evaluatedDomains}/{overallScore.totalDomains}
          <span style={{ marginLeft: '20px' }}>
            <strong style={{ color: '#0f766e' }}>Parâmetros Avaliados:</strong> {overallScore.evaluatedParameters}
          </span>
        </div>
      </div>

      {/* Síntese Geral */}
      <section style={{ marginBottom: '30px' }}>
        <h3 style={{
          fontSize: '14pt',
          fontWeight: 'bold',
          color: '#0f766e',
          borderBottom: '2px solid #cbd5e1',
          paddingBottom: '8px',
          marginBottom: '15px',
        }}>
          1. SÍNTESE GERAL
        </h3>
        <p style={{ 
          textAlign: 'justify',
          marginBottom: '12px',
          lineHeight: '1.8',
        }}>
          {content.sintese_geral}
        </p>
      </section>

      {/* Conquistas Identificadas */}
      {content.conquistas && content.conquistas.por_dominio && content.conquistas.por_dominio.length > 0 && (
        <section style={{ marginBottom: '30px', pageBreakInside: 'avoid' }}>
          <h3 style={{
            fontSize: '14pt',
            fontWeight: 'bold',
            color: '#0f766e',
            borderBottom: '2px solid #cbd5e1',
            paddingBottom: '8px',
            marginBottom: '15px',
          }}>
            2. CONQUISTAS IDENTIFICADAS
          </h3>
          
          {content.conquistas.introducao && (
            <p style={{ 
              textAlign: 'justify',
              marginBottom: '15px',
              fontStyle: 'italic',
              color: '#475569',
            }}>
              {content.conquistas.introducao}
            </p>
          )}

          {content.conquistas.por_dominio.map((item, index) => (
            <div 
              key={index} 
              style={{ 
                marginBottom: '20px',
                paddingLeft: '15px',
                borderLeft: '4px solid #10b981',
              }}
            >
              <h4 style={{
                fontSize: '12pt',
                fontWeight: 'bold',
                color: '#059669',
                marginBottom: '10px',
              }}>
                {item.dominio}
              </h4>
              <p style={{ 
                textAlign: 'justify',
                marginBottom: '10px',
                lineHeight: '1.8',
              }}>
                {item.analise}
              </p>
            </div>
          ))}
        </section>
      )}

      {/* Áreas Prioritárias para Desenvolvimento */}
      {content.areas_desenvolvimento && content.areas_desenvolvimento.por_dominio && content.areas_desenvolvimento.por_dominio.length > 0 && (
        <section style={{ marginBottom: '30px', pageBreakInside: 'avoid' }}>
          <h3 style={{
            fontSize: '14pt',
            fontWeight: 'bold',
            color: '#0f766e',
            borderBottom: '2px solid #cbd5e1',
            paddingBottom: '8px',
            marginBottom: '15px',
          }}>
            3. ÁREAS PRIORITÁRIAS PARA DESENVOLVIMENTO
          </h3>
          
          {content.areas_desenvolvimento.introducao && (
            <p style={{ 
              textAlign: 'justify',
              marginBottom: '15px',
              fontStyle: 'italic',
              color: '#475569',
            }}>
              {content.areas_desenvolvimento.introducao}
            </p>
          )}

          {content.areas_desenvolvimento.por_dominio.map((item, index) => (
            <div 
              key={index} 
              style={{ 
                marginBottom: '20px',
                paddingLeft: '15px',
                borderLeft: '4px solid #f59e0b',
              }}
            >
              <h4 style={{
                fontSize: '12pt',
                fontWeight: 'bold',
                color: '#d97706',
                marginBottom: '10px',
              }}>
                {item.dominio}
              </h4>
              <p style={{ 
                textAlign: 'justify',
                marginBottom: '10px',
                lineHeight: '1.8',
              }}>
                {item.analise}
              </p>
            </div>
          ))}
        </section>
      )}

      {/* Recomendações Terapêuticas */}
      {content.recomendacoes && content.recomendacoes.length > 0 && (
        <section style={{ marginBottom: '30px', pageBreakInside: 'avoid' }}>
          <h3 style={{
            fontSize: '14pt',
            fontWeight: 'bold',
            color: '#0f766e',
            borderBottom: '2px solid #cbd5e1',
            paddingBottom: '8px',
            marginBottom: '15px',
          }}>
            4. RECOMENDAÇÕES TERAPÊUTICAS
          </h3>
          <ul style={{ 
            paddingLeft: '25px',
            marginBottom: '0',
          }}>
            {content.recomendacoes.map((rec, index) => (
              <li 
                key={index}
                style={{
                  marginBottom: '10px',
                  textAlign: 'justify',
                  lineHeight: '1.8',
                }}
              >
                {rec}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Objetivos Terapêuticos Sugeridos */}
      {content.objetivos && content.objetivos.length > 0 && (
        <section style={{ marginBottom: '30px', pageBreakInside: 'avoid' }}>
          <h3 style={{
            fontSize: '14pt',
            fontWeight: 'bold',
            color: '#0f766e',
            borderBottom: '2px solid #cbd5e1',
            paddingBottom: '8px',
            marginBottom: '15px',
          }}>
            5. OBJETIVOS TERAPÊUTICOS SUGERIDOS
          </h3>
          <div style={{ paddingLeft: '15px' }}>
            {content.objetivos.map((obj, index) => (
              <div 
                key={index}
                style={{
                  marginBottom: '12px',
                  paddingLeft: '10px',
                }}
              >
                <strong style={{ color: '#0f766e' }}>{obj.dominio}:</strong>{' '}
                <span style={{ textAlign: 'justify' }}>{obj.objetivo}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Rodapé Profissional */}
      <div style={{
        marginTop: '50px',
        border: '3px solid transparent',
        borderImage: 'linear-gradient(135deg, #0d9488, #14b8a6, #06b6d4) 1',
        borderRadius: '16px',
        overflow: 'hidden',
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
                  {professionalName}
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
                    🎵 {professionalSpecialty || 'Musicoterapeuta'}
                  </span>
                </div>
              </div>

              {/* Informações de Contato */}
              <div style={{ fontSize: '12px', color: '#374151', lineHeight: '1.6', textAlign: 'center' }}>
                {professionalRegister && (
                  <div style={{ marginBottom: '4px' }}>
                    <span style={{ marginRight: '4px' }}>📋</span>
                    {professionalRegister}
                  </div>
                )}
                {professionalEmail && (
                  <div style={{ marginBottom: '4px' }}>
                    <span style={{ marginRight: '4px' }}>📧</span>
                    {professionalEmail}
                  </div>
                )}
                {professionalPhone && (
                  <div>
                    <span style={{ marginRight: '4px' }}>📞</span>
                    {professionalPhone}
                  </div>
                )}
              </div>
            </div>

            {/* Lado Direito: Carimbo Digital Circular */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {digitalStampUrl ? (
                <>
                  <div style={{
                    width: '280px',
                    height: '280px',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      border: '3px dashed #14b8a6',
                      opacity: 0.3
                    }} />
                    
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
                      boxShadow: '0 8px 24px rgba(20,184,166,0.2), inset 0 2px 8px rgba(20,184,166,0.1)',
                      position: 'relative'
                    }}>
                      <img 
                        src={digitalStampUrl}
                        alt="Digital Stamp"
                        style={{
                          maxWidth: '200px',
                          maxHeight: '200px',
                          objectFit: 'contain'
                        }}
                      />
                    </div>
                  </div>
                  
                  <div style={{
                    marginTop: '16px',
                    textAlign: 'center'
                  }}>
                    <div style={{ 
                      fontSize: '14px', 
                      fontWeight: 'bold', 
                      color: '#0f766e',
                      marginBottom: '4px'
                    }}>
                      {professionalName}
                    </div>
                    <div style={{ fontSize: '12px', color: '#0d9488' }}>
                      🎵 {professionalSpecialty || 'Musicoterapeuta'}
                    </div>
                    {professionalRegister && (
                      <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
                        📋 {professionalRegister}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div style={{ 
                  width: '240px',
                  height: '240px',
                  border: '3px dashed #14b8a6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  color: '#6b7280',
                  backgroundColor: '#f0fdfa'
                }}>
                  🔖 Carimbo Digital
                </div>
              )}
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
  );
};
