import React from "react";

interface DevolutivaTextPDFProps {
  data: {
    patient_name: string;
    session_date: string;
    session_number: number;
    professional_name: string;
    professional_registry: string;
    digital_signature_url?: string;
    digital_stamp_url?: string;
    aiContent: {
      synthesis: string;
      achievements: string;
      attentionAreas: string;
      recommendations: string;
      familyGuidelines: string;
    };
  };
}

export const DevolutivaTextPDF: React.FC<DevolutivaTextPDFProps> = ({ data }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  // Split paragraphs for better formatting
  const splitParagraphs = (text: string) => {
    return text.split('\n').filter(p => p.trim().length > 0);
  };

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      padding: '40px', 
      maxWidth: '800px', 
      margin: '0 auto',
      backgroundColor: '#ffffff',
      color: '#1f2937',
      lineHeight: '1.6'
    }}>
      {/* Header */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '40px',
        paddingBottom: '20px',
        borderBottom: '3px solid #ec4899'
      }}>
        <div style={{ 
          fontSize: '28px', 
          fontWeight: 'bold',
          color: '#ec4899',
          marginBottom: '8px'
        }}>
          Devolutiva Musicoterapia TEA
        </div>
        <div style={{ 
          fontSize: '16px',
          color: '#6b7280',
          fontStyle: 'italic'
        }}>
          Relatório Profissional de Sessão
        </div>
      </div>

      {/* Patient Info */}
      <div style={{ 
        backgroundColor: '#fdf2f8',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px',
        border: '1px solid #fbcfe8'
      }}>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '15px'
        }}>
          <div>
            <strong style={{ color: '#ec4899' }}>Paciente:</strong>
            <div style={{ fontSize: '18px', fontWeight: '600' }}>{data.patient_name}</div>
          </div>
          <div>
            <strong style={{ color: '#ec4899' }}>Data da Sessão:</strong>
            <div style={{ fontSize: '18px', fontWeight: '600' }}>{formatDate(data.session_date)}</div>
          </div>
          <div>
            <strong style={{ color: '#ec4899' }}>Sessão:</strong>
            <div style={{ fontSize: '18px', fontWeight: '600' }}>#{data.session_number}</div>
          </div>
        </div>
      </div>

      {/* Synthesis Section */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#ec4899',
          marginBottom: '15px',
          paddingBottom: '8px',
          borderBottom: '2px solid #fbcfe8'
        }}>
          📊 Síntese do Desempenho na Sessão
        </div>
        <div style={{ 
          fontSize: '14px',
          textAlign: 'justify',
          color: '#374151'
        }}>
          {splitParagraphs(data.aiContent.synthesis).map((paragraph, idx) => (
            <p key={idx} style={{ marginBottom: '12px' }}>{paragraph}</p>
          ))}
        </div>
      </div>

      {/* Achievements Section */}
      {data.aiContent.achievements && (
        <div style={{ marginBottom: '30px' }}>
          <div style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#10b981',
            marginBottom: '15px',
            paddingBottom: '8px',
            borderBottom: '2px solid #d1fae5'
          }}>
            ✅ Conquistas Identificadas
          </div>
          <div style={{ 
            backgroundColor: '#f0fdf4',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #86efac'
          }}>
            <div style={{ 
              fontSize: '14px',
              textAlign: 'justify',
              color: '#374151'
            }}>
              {splitParagraphs(data.aiContent.achievements).map((paragraph, idx) => (
                <p key={idx} style={{ marginBottom: '12px' }}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Attention Areas Section */}
      {data.aiContent.attentionAreas && (
        <div style={{ marginBottom: '30px' }}>
          <div style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#f59e0b',
            marginBottom: '15px',
            paddingBottom: '8px',
            borderBottom: '2px solid #fed7aa'
          }}>
            ⚠️ Áreas que Necessitam Atenção
          </div>
          <div style={{ 
            backgroundColor: '#fffbeb',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #fde68a'
          }}>
            <div style={{ 
              fontSize: '14px',
              textAlign: 'justify',
              color: '#374151'
            }}>
              {splitParagraphs(data.aiContent.attentionAreas).map((paragraph, idx) => (
                <p key={idx} style={{ marginBottom: '12px' }}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recommendations Section */}
      {data.aiContent.recommendations && (
        <div style={{ marginBottom: '30px' }}>
          <div style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#3b82f6',
            marginBottom: '15px',
            paddingBottom: '8px',
            borderBottom: '2px solid #bfdbfe'
          }}>
            💡 Recomendações Terapêuticas
          </div>
          <div style={{ 
            backgroundColor: '#eff6ff',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #93c5fd'
          }}>
            <div style={{ 
              fontSize: '14px',
              textAlign: 'justify',
              color: '#374151'
            }}>
              {splitParagraphs(data.aiContent.recommendations).map((paragraph, idx) => (
                <p key={idx} style={{ marginBottom: '12px' }}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Family Guidelines Section */}
      {data.aiContent.familyGuidelines && (
        <div style={{ marginBottom: '30px' }}>
          <div style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#8b5cf6',
            marginBottom: '15px',
            paddingBottom: '8px',
            borderBottom: '2px solid #ddd6fe'
          }}>
            👨‍👩‍👧‍👦 Orientações para a Família
          </div>
          <div style={{ 
            backgroundColor: '#faf5ff',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #c4b5fd'
          }}>
            <div style={{ 
              fontSize: '14px',
              textAlign: 'justify',
              color: '#374151'
            }}>
              {splitParagraphs(data.aiContent.familyGuidelines).map((paragraph, idx) => (
                <p key={idx} style={{ marginBottom: '12px' }}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ 
        marginTop: '50px',
        background: 'linear-gradient(to bottom, #ffffff, #f8fafc)',
        borderRadius: '16px',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
        padding: '30px',
        borderTop: '4px solid transparent',
        backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #ec4899, #14b8a6)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box'
      }}>
        
        {/* Two-column layout */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          alignItems: 'start'
        }}>
          
          {/* Assinatura Section (Left) */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              borderBottom: '3px solid transparent',
              backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #ec4899, #14b8a6)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box'
            }}>
              {data.digital_signature_url ? (
                <img 
                  src={data.digital_signature_url} 
                  alt="Assinatura Digital" 
                  style={{ 
                    maxHeight: '80px',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    margin: '0 auto 10px',
                    display: 'block'
                  }}
                />
              ) : (
                <div style={{ 
                  height: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '10px'
                }}>
                  <div style={{ fontSize: '14px', color: '#9ca3af', fontStyle: 'italic' }}>
                    Assinatura Digital
                  </div>
                </div>
              )}
              <div style={{
                borderTop: '1px solid #e5e7eb',
                paddingTop: '10px',
                fontSize: '11px',
                color: '#10b981',
                fontWeight: '600'
              }}>
                ✓ Assinatura Digital Verificada
              </div>
            </div>
            <div style={{ 
              marginTop: '12px',
              fontSize: '10px',
              color: '#6b7280'
            }}>
              🎵 Sistema MuseTera
            </div>
          </div>

          {/* Stamp Section (Right) */}
          <div style={{ textAlign: 'center' }}>
            {data.digital_stamp_url ? (
              <div style={{ position: 'relative' }}>
                {/* Outer decorative border */}
                <div style={{
                  width: '160px',
                  height: '160px',
                  margin: '0 auto',
                  borderRadius: '50%',
                  border: '3px dashed #ec4899',
                  padding: '8px',
                  background: 'linear-gradient(135deg, #fdf2f8, #f3e8ff)'
                }}>
                  {/* Inner solid border */}
                  <div style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    border: '4px solid transparent',
                    backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #ec4899, #a855f7)',
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'padding-box, border-box',
                    padding: '4px',
                    boxShadow: '0 4px 16px rgba(236,72,153,0.3)'
                  }}>
                    <img 
                      src={data.digital_stamp_url} 
                      alt="Carimbo Digital" 
                      style={{ 
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        borderRadius: '50%'
                      }}
                    />
                  </div>
                </div>
                {/* Verified badge */}
                <div style={{
                  marginTop: '10px',
                  backgroundColor: '#14b8a6',
                  color: '#ffffff',
                  fontSize: '9px',
                  fontWeight: '700',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  display: 'inline-block',
                  letterSpacing: '0.5px'
                }}>
                  🎵 MUSTETERA VERIFIED ✓
                </div>
              </div>
            ) : (
              <div style={{ position: 'relative' }}>
                {/* Outer decorative border */}
                <div style={{
                  width: '160px',
                  height: '160px',
                  margin: '0 auto',
                  borderRadius: '50%',
                  border: '3px dashed #ec4899',
                  padding: '8px',
                  background: 'linear-gradient(135deg, #fdf2f8, #f3e8ff)'
                }}>
                  {/* Inner solid border */}
                  <div style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    border: '4px solid transparent',
                    backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #ec4899, #a855f7)',
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'padding-box, border-box',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 16px rgba(236,72,153,0.3)'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎵</div>
                      <div style={{ fontSize: '10px', color: '#ec4899', fontWeight: 'bold' }}>
                        MUSICOTERAPIA
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Final Footer */}
        <div style={{
          marginTop: '30px',
          paddingTop: '20px',
          borderTop: '2px solid transparent',
          backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #ec4899, #8b5cf6, #14b8a6)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '12px',
            color: '#6b7280',
            marginBottom: '8px'
          }}>
            <span style={{ fontWeight: '600', color: '#ec4899' }}>🎵 MuseTera</span> - Sistema de Musicoterapia
          </div>
          <div style={{ fontSize: '11px', color: '#9ca3af', fontStyle: 'italic' }}>
            Relatório gerado em: {new Date().toLocaleDateString('pt-BR', { 
              day: '2-digit', 
              month: 'long', 
              year: 'numeric' 
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
