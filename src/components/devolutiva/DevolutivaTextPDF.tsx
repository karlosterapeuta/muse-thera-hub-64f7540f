import React from "react";

interface DevolutivaTextPDFProps {
  data: {
    patient_name: string;
    session_date: string;
    session_number: number;
    professional_name: string;
    professional_registry: string;
    professional_email?: string;
    professional_phone?: string;
    professional_specialty?: string;
    professional_photo_url?: string | null;
    digital_signature?: string | null;
    digital_stamp?: string | null;
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

  // Helper to get signature/stamp with backward compatibility
  const signature = data.digital_signature || data.digital_signature_url;
  const stamp = data.digital_stamp || data.digital_stamp_url;

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
        marginTop: '40px',
        padding: '24px',
        background: 'linear-gradient(to bottom, #f0fdfa, #ccfbf1)',
        borderRadius: '16px',
        border: '3px solid transparent',
        backgroundImage: 'linear-gradient(#fff, #fff), linear-gradient(135deg, #0d9488, #14b8a6, #06b6d4)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box'
      }}>
        
        {/* Two-column layout */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '30px',
          alignItems: 'start'
        }}>
          
          {/* Signature Section (Left) */}
          <div>
            {/* Signature Card */}
            <div style={{
              background: 'linear-gradient(135deg, #f0fdfa, #ccfbf1)',
              border: '2px solid #14b8a6',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(20,184,166,0.15)'
            }}>
              {/* Horizontal layout: Photo + Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                {/* Professional Photo */}
                {data.professional_photo_url && (
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '3px solid transparent',
                    backgroundImage: 'linear-gradient(#fff, #fff), linear-gradient(135deg, #0d9488, #14b8a6)',
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'padding-box, border-box',
                    flexShrink: 0
                  }}>
                    <img 
                      src={data.professional_photo_url} 
                      alt="Professional"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                )}
                
                {/* Professional Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#0f766e',
                    marginBottom: '8px',
                    lineHeight: '1.3'
                  }}>
                    {data.professional_name}
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
                      🎵 {data.professional_specialty || 'Musicoterapeuta'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div style={{ fontSize: '12px', color: '#374151', lineHeight: '1.6' }}>
                {data.professional_registry && (
                  <div style={{ marginBottom: '4px' }}>
                    <span style={{ marginRight: '4px' }}>📋</span>
                    {data.professional_registry}
                  </div>
                )}
                {data.professional_email && (
                  <div style={{ marginBottom: '4px' }}>
                    <span style={{ marginRight: '4px' }}>📧</span>
                    {data.professional_email}
                  </div>
                )}
                {data.professional_phone && (
                  <div>
                    <span style={{ marginRight: '4px' }}>📞</span>
                    {data.professional_phone}
                  </div>
                )}
              </div>

              {/* Signature Image */}
              {signature && (
                <div style={{ 
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '2px solid #99f6e4'
                }}>
                  <img 
                    src={signature}
                    alt="Assinatura Digital"
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                      maxHeight: '80px',
                      display: 'block',
                      margin: '0 auto'
                    }}
                  />
                  <div style={{
                    textAlign: 'center',
                    marginTop: '8px',
                    fontSize: '10px',
                    color: '#0d9488',
                    fontWeight: '600'
                  }}>
                    ──────────────────
                  </div>
                </div>
              )}

              {/* Verified Badge */}
              <div style={{
                marginTop: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '10px'
              }}>
                <div style={{ 
                  color: '#059669',
                  fontWeight: '600'
                }}>
                  ✓ Assinatura Digital Verificada
                </div>
                <div style={{ 
                  color: '#6b7280'
                }}>
                  🎵 Sistema MuseTera
                </div>
              </div>
            </div>
          </div>

          {/* Stamp Section (Right) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {stamp ? (
              <>
                {/* Circular Stamp Container */}
                <div style={{
                  width: '280px',
                  height: '280px',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {/* Dashed Border Circle */}
                  <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    border: '3px dashed #14b8a6',
                    opacity: 0.3
                  }} />
                  
                  {/* Main Stamp Circle */}
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
                    {/* Professional Photo in Stamp */}
                    {data.professional_photo_url && (
                      <div style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '3px solid transparent',
                        backgroundImage: 'linear-gradient(#fff, #fff), linear-gradient(135deg, #0d9488, #14b8a6)',
                        backgroundOrigin: 'border-box',
                        backgroundClip: 'padding-box, border-box',
                        marginBottom: '12px'
                      }}>
                        <img 
                          src={data.professional_photo_url} 
                          alt="Professional"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                    )}
                    
                    {/* Professional Name */}
                    <div style={{
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: '#0f766e',
                      textAlign: 'center',
                      marginBottom: '8px',
                      lineHeight: '1.2'
                    }}>
                      {data.professional_name}
                    </div>

                    {/* Divider */}
                    <div style={{
                      width: '80px',
                      height: '2px',
                      background: 'linear-gradient(to right, transparent, #14b8a6, transparent)',
                      marginBottom: '8px'
                    }} />

                    {/* Specialty Badge */}
                    <div style={{
                      backgroundColor: '#ccfbf1',
                      border: '1px solid #99f6e4',
                      borderRadius: '16px',
                      padding: '4px 12px',
                      marginBottom: '6px'
                    }}>
                      <span style={{ fontSize: '10px', color: '#0f766e', fontWeight: '600' }}>
                        🎵 {data.professional_specialty || 'Musicoterapeuta'}
                      </span>
                    </div>

                    {/* Registry */}
                    {data.professional_registry && (
                      <div style={{
                        fontSize: '11px',
                        color: '#374151',
                        fontWeight: '600'
                      }}>
                        {data.professional_registry}
                      </div>
                    )}

                    {/* Actual Stamp Image Overlay */}
                    <div style={{
                      position: 'absolute',
                      top: '0',
                      left: '0',
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0.15,
                      pointerEvents: 'none'
                    }}>
                      <img 
                        src={stamp}
                        alt="Carimbo Digital"
                        style={{
                          maxWidth: '90%',
                          maxHeight: '90%',
                          objectFit: 'contain'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Verified Badge Below Stamp */}
                <div style={{
                  marginTop: '16px',
                  background: 'linear-gradient(135deg, #0d9488, #0891b2)',
                  color: 'white',
                  padding: '8px 20px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(13,148,136,0.3)'
                }}>
                  <span>✓</span>
                  <span>MuseTera Verified</span>
                  <span>🎵</span>
                </div>
              </>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#9ca3af',
                fontSize: '14px'
              }}>
                Carimbo Digital não disponível
              </div>
            )}
          </div>
        </div>

        {/* Final Footer Bar */}
        <div style={{
          marginTop: '24px',
          paddingTop: '16px',
          borderTop: '2px solid #99f6e4',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '11px',
            color: '#6b7280',
            fontWeight: '600'
          }}>
            🎵 MuseTera - Sistema de Musicoterapia
          </div>
          <div style={{
            fontSize: '10px',
            color: '#9ca3af',
            marginTop: '4px'
          }}>
            Gerado em: {formatDate(new Date().toISOString())}
          </div>
        </div>
      </div>
    </div>
  );
};
