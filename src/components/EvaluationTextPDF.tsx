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
        background: 'linear-gradient(to bottom, #ffffff 0%, #f8fafc 100%)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
      }}>
        {/* Barra Decorativa Superior */}
        <div style={{
          height: '6px',
          background: 'linear-gradient(90deg, #0d9488 0%, #14b8a6 50%, #0d9488 100%)',
        }}></div>

        {/* Seção de Assinatura e Carimbo */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 2fr 1fr', 
          gap: '28px', 
          alignItems: 'center',
          padding: '32px',
          borderBottom: '1px solid #e2e8f0'
        }}>
          {/* Assinatura Digital */}
          <div style={{ textAlign: 'center' }}>
            {digitalSignatureUrl ? (
              <div style={{
                backgroundColor: '#ffffff',
                padding: '16px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e5e7eb'
              }}>
                <img 
                  src={digitalSignatureUrl} 
                  alt="Assinatura Digital" 
                  style={{ 
                    maxWidth: '160px', 
                    maxHeight: '90px', 
                    margin: '0 auto',
                    display: 'block',
                    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
                  }} 
                />
                <div style={{ 
                  borderTop: '2px solid #14b8a6', 
                  marginTop: '12px', 
                  paddingTop: '8px',
                  fontSize: '9pt',
                  color: '#64748b',
                  fontStyle: 'italic',
                  fontWeight: '500'
                }}>
                  ✍️ Assinatura Digital
                </div>
              </div>
            ) : (
              <div style={{ 
                height: '120px',
                backgroundColor: '#ffffff',
                padding: '16px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center'
              }}>
                <div style={{ 
                  borderTop: '2px solid #14b8a6', 
                  width: '80%',
                  paddingTop: '8px',
                  fontSize: '9pt',
                  color: '#64748b',
                  fontStyle: 'italic'
                }}>
                  Assinatura
                </div>
              </div>
            )}
          </div>

          {/* Informações do Profissional */}
          <div style={{ 
            textAlign: 'center',
            backgroundColor: '#ffffff',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
            border: '2px solid #14b8a6'
          }}>
            <div style={{
              fontSize: '12pt',
              color: '#0d9488',
              marginBottom: '12px',
              fontWeight: '600'
            }}>
              👨‍⚕️ PROFISSIONAL RESPONSÁVEL
            </div>
            <div style={{ 
              marginBottom: '8px',
              fontSize: '12pt',
              fontWeight: '700',
              color: '#0f766e'
            }}>
              {professionalName}
            </div>
            {professionalRegister && (
              <div style={{ 
                fontSize: '10pt', 
                color: '#475569',
                marginBottom: '6px',
                padding: '6px 12px',
                backgroundColor: '#f0fdfa',
                borderRadius: '6px',
                display: 'inline-block',
                border: '1px solid #ccfbf1'
              }}>
                <strong style={{ color: '#0d9488' }}>📋 Registro:</strong> {professionalRegister}
              </div>
            )}
            <div style={{ 
              fontSize: '10pt', 
              color: '#64748b', 
              marginTop: '12px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              🎵 Musicoterapeuta
            </div>
          </div>

          {/* Carimbo Digital */}
          <div style={{ textAlign: 'center' }}>
            {digitalStampUrl ? (
              <div style={{
                position: 'relative',
                display: 'inline-block'
              }}>
                <div style={{
                  position: 'absolute',
                  inset: '-6px',
                  background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #0d9488 100%)',
                  borderRadius: '50%',
                  opacity: '0.15',
                  filter: 'blur(8px)'
                }}></div>
                <div style={{
                  position: 'relative',
                  padding: '8px',
                  backgroundColor: '#ffffff',
                  borderRadius: '50%',
                  border: '3px solid #14b8a6',
                  boxShadow: '0 4px 12px rgba(13, 148, 136, 0.2)'
                }}>
                  <img 
                    src={digitalStampUrl} 
                    alt="Carimbo Digital" 
                    style={{ 
                      maxWidth: '150px', 
                      maxHeight: '150px', 
                      margin: '0 auto',
                      display: 'block',
                      borderRadius: '50%'
                    }} 
                  />
                </div>
              </div>
            ) : (
              <div style={{ 
                width: '140px',
                height: '140px',
                border: '3px dashed #14b8a6',
                borderRadius: '50%',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10pt',
                color: '#64748b',
                backgroundColor: '#f0fdfa',
                fontWeight: '600',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
              }}>
                🔖 Carimbo
              </div>
            )}
          </div>
        </div>

        {/* Rodapé Final */}
        <div style={{ 
          padding: '24px 32px',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'inline-block',
            backgroundColor: '#ffffff',
            padding: '16px 28px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
          }}>
            <p style={{ 
              margin: '0 0 8px 0',
              color: '#0f766e',
              fontSize: '10pt',
              fontWeight: '600'
            }}>
              🎵 Relatório gerado pela Escala MuseTera
            </p>
            <p style={{ 
              margin: '0',
              color: '#94a3b8',
              fontSize: '9pt',
              fontStyle: 'italic'
            }}>
              📅 Emitido em {new Date().toLocaleDateString('pt-BR', { 
                day: '2-digit', 
                month: 'long', 
                year: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
