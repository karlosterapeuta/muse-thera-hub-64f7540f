import React from 'react';
import { MusicotherapyTreatmentPlan } from '@/types/musicotherapy-plan';

interface MusicotherapyTreatmentPlanPDFProps {
  planData: MusicotherapyTreatmentPlan;
  therapistName?: string;
  digitalSignatureUrl?: string;
  digitalStampUrl?: string;
  professionalPhotoUrl?: string;
  professionalEmail?: string;
  professionalPhone?: string;
  professionalSpecialty?: string;
  professionalRegistry?: string;
}

export const MusicotherapyTreatmentPlanPDF: React.FC<MusicotherapyTreatmentPlanPDFProps> = ({ 
  planData, 
  therapistName,
  digitalSignatureUrl,
  digitalStampUrl,
  professionalPhotoUrl,
  professionalEmail,
  professionalPhone,
  professionalSpecialty,
  professionalRegistry
}) => {
  const currentDate = new Date().toLocaleDateString('pt-BR');

  const bgColorMap: Record<string, string> = {
    'bg-blue-50': '#eff6ff',
    'bg-green-50': '#f0fdf4',
    'bg-purple-50': '#faf5ff',
    'bg-yellow-50': '#fefce8',
    'bg-orange-50': '#fff7ed',
    'bg-pink-50': '#fdf2f8',
    'bg-indigo-50': '#eef2ff',
    'bg-teal-50': '#f0fdfa',
    'bg-red-50': '#fef2f2',
    'bg-gray-50': '#f9fafb'
  };

  const iconEmojiMap: Record<string, string> = {
    'User': '👤',
    'FileText': '📄',
    'Target': '🎯',
    'Music': '🎵',
    'Users': '👥',
    'Clock': '⏰',
    'CheckCircle': '✓',
    'Activity': '📊',
    'BarChart': '📈',
    'RefreshCw': '🔄'
  };

  const renderSection = (title: string, iconName: string, children: React.ReactNode, bgColor = "bg-blue-50") => {
    const emoji = iconEmojiMap[iconName] || '📌';
    const backgroundColor = bgColorMap[bgColor] || '#eff6ff';
    
    return (
      <div style={{
        backgroundColor,
        borderLeft: '4px solid #3b82f6',
        padding: '24px',
        marginBottom: '24px',
        borderRadius: '0 8px 8px 0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '24px', marginRight: '12px' }}>{emoji}</span>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{title}</h2>
        </div>
        {children}
      </div>
    );
  };

  const renderListItems = (items: string[] | undefined, emptyText = "Não especificado") => {
    if (!items || items.length === 0) return <p style={{ color: '#4b5563' }}>{emptyText}</p>;
    return (
      <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: 0 }}>
        {items.map((item, index) => (
          <li key={index} style={{ color: '#1f2937', marginBottom: '4px' }}>{item}</li>
        ))}
      </ul>
    );
  };

  return (
    <div style={{ 
      backgroundColor: '#ffffff', 
      color: '#000000', 
      fontFamily: 'Times New Roman, serif', 
      lineHeight: '1.6',
      maxWidth: '896px',
      margin: '0 auto',
      padding: '32px'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(to right, #2563eb, #7c3aed)',
        color: '#ffffff',
        padding: '32px',
        marginBottom: '32px',
        borderRadius: '8px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px', margin: 0 }}>Plano de Tratamento Musicoterapêutico</h1>
          <p style={{ color: '#bfdbfe', fontSize: '18px', margin: '8px 0' }}>Modelo Profissional Completo</p>
          <div style={{ marginTop: '16px', color: '#bfdbfe' }}>
            <p style={{ fontSize: '14px', margin: 0 }}>Data de Emissão: {currentDate}</p>
          </div>
        </div>
      </div>

      {/* 1. Patient Identification */}
      {renderSection("1. Identificação do Paciente", "User", (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <p style={{ fontSize: '14px', color: '#4b5563', fontWeight: '500', marginBottom: '4px' }}>Nome completo:</p>
            <p style={{ fontSize: '18px', color: '#1f2937', margin: 0 }}>{planData.patient_full_name || 'Não informado'}</p>
          </div>
          <div>
            <p style={{ fontSize: '14px', color: '#4b5563', fontWeight: '500', marginBottom: '4px' }}>Data de nascimento:</p>
            <p style={{ fontSize: '18px', color: '#1f2937', margin: 0 }}>{planData.patient_birth_date ? new Date(planData.patient_birth_date).toLocaleDateString('pt-BR') : 'Não informado'}</p>
          </div>
          <div>
            <p style={{ fontSize: '14px', color: '#4b5563', fontWeight: '500', marginBottom: '4px' }}>Idade:</p>
            <p style={{ fontSize: '18px', color: '#1f2937', margin: 0 }}>{planData.patient_age || 'Não informado'}</p>
          </div>
          <div>
            <p style={{ fontSize: '14px', color: '#4b5563', fontWeight: '500', marginBottom: '4px' }}>Diagnóstico clínico:</p>
            <p style={{ fontSize: '18px', color: '#1f2937', margin: 0 }}>{planData.clinical_diagnosis || 'Não informado'}</p>
          </div>
          <div>
            <p style={{ fontSize: '14px', color: '#4b5563', fontWeight: '500', marginBottom: '4px' }}>Responsável:</p>
            <p style={{ fontSize: '18px', color: '#1f2937', margin: 0 }}>{planData.responsible_person || 'Não informado'}</p>
          </div>
          <div>
            <p style={{ fontSize: '14px', color: '#4b5563', fontWeight: '500', marginBottom: '4px' }}>Data de início do plano:</p>
            <p style={{ fontSize: '18px', color: '#1f2937', margin: 0 }}>{planData.plan_start_date ? new Date(planData.plan_start_date).toLocaleDateString('pt-BR') : 'Não informado'}</p>
          </div>
        </div>
      ), "bg-blue-50")}

      {/* 2. Initial Assessment */}
      {renderSection("2. Avaliação Inicial", "FileText", (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <p style={{ fontSize: '14px', color: '#4b5563', fontWeight: '500', marginBottom: '4px' }}>Histórico clínico e familiar relevante:</p>
            <p style={{ color: '#1f2937', lineHeight: '1.6', margin: 0 }}>{planData.clinical_family_history || 'Não informado'}</p>
          </div>
          <div>
            <p style={{ fontSize: '14px', color: '#4b5563', fontWeight: '500', marginBottom: '4px' }}>Condições físicas, cognitivas, emocionais e sociais:</p>
            <p style={{ color: '#1f2937', lineHeight: '1.6', margin: 0 }}>{planData.physical_cognitive_conditions || 'Não informado'}</p>
          </div>
          <div>
            <p style={{ fontSize: '14px', color: '#4b5563', fontWeight: '500', marginBottom: '4px' }}>Nível de interação e comunicação:</p>
            <p style={{ color: '#1f2937', lineHeight: '1.6', margin: 0 }}>{planData.interaction_communication_level || 'Não informado'}</p>
          </div>
          <div>
            <p style={{ fontSize: '14px', color: '#4b5563', fontWeight: '500', marginBottom: '4px' }}>Interesses musicais:</p>
            <p style={{ color: '#1f2937', lineHeight: '1.6', margin: 0 }}>{planData.musical_interests || 'Não informado'}</p>
          </div>
          <div>
            <p style={{ fontSize: '14px', color: '#4b5563', fontWeight: '500', marginBottom: '4px' }}>Comportamentos observados durante avaliação inicial:</p>
            <p style={{ color: '#1f2937', lineHeight: '1.6', margin: 0 }}>{planData.observed_behaviors || 'Não informado'}</p>
          </div>
        </div>
      ), "bg-green-50")}

      {/* 3. General Objectives */}
      {renderSection("3. Objetivos Gerais", "Target", (
        <div>
          <p style={{ fontSize: '14px', color: '#4b5563', fontWeight: '500', marginBottom: '8px' }}>Propósitos amplos da musicoterapia para este paciente:</p>
          {renderListItems(planData.general_objectives, "Nenhum objetivo geral definido")}
        </div>
      ), "bg-purple-50")}

      {/* 4. Specific Objectives */}
      {renderSection("4. Objetivos Específicos", "CheckCircle", (
        <div>
          <p style={{ fontSize: '14px', color: '#4b5563', fontWeight: '500', marginBottom: '8px' }}>Objetivos mensuráveis e específicos:</p>
          {renderListItems(planData.specific_objectives, "Nenhum objetivo específico definido")}
        </div>
      ), "bg-yellow-50")}

      {/* 5. Musicotherapy Resources */}
      {renderSection("5. Recursos Musicoterapêuticos", "Music", (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <p style={{ fontSize: '14px', color: '#4b5563', fontWeight: '500', marginBottom: '8px' }}>Instrumentos musicais:</p>
            {renderListItems(planData.musical_instruments)}
          </div>
          <div>
            <p style={{ fontSize: '14px', color: '#4b5563', fontWeight: '500', marginBottom: '8px' }}>Recursos tecnológicos:</p>
            {renderListItems(planData.technological_resources)}
          </div>
          <div>
            <p style={{ fontSize: '14px', color: '#4b5563', fontWeight: '500', marginBottom: '8px' }}>Voz e corpo:</p>
            {renderListItems(planData.voice_body_resources)}
          </div>
          <div>
            <p style={{ fontSize: '14px', color: '#4b5563', fontWeight: '500', marginBottom: '8px' }}>Materiais complementares:</p>
            {renderListItems(planData.complementary_materials)}
          </div>
        </div>
      ), "bg-orange-50")}

      {/* 6. Strategies and Techniques */}
      {renderSection("6. Estratégias e Técnicas", "Activity", (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <p style={{ fontSize: '14px', color: '#4b5563', fontWeight: '500', marginBottom: '4px' }}>Improvisação musical:</p>
            <p style={{ color: '#1f2937', margin: 0 }}>{planData.musical_improvisation || 'Não especificado'}</p>
          </div>
          <div>
            <p style={{ fontSize: '14px', color: '#4b5563', fontWeight: '500', marginBottom: '4px' }}>Recriação musical:</p>
            <p style={{ color: '#1f2937', margin: 0 }}>{planData.musical_recreation || 'Não especificado'}</p>
          </div>
          <div>
            <p style={{ fontSize: '14px', color: '#4b5563', fontWeight: '500', marginBottom: '4px' }}>Composição:</p>
            <p style={{ color: '#1f2937', margin: 0 }}>{planData.musical_composition || 'Não especificado'}</p>
          </div>
          <div>
            <p style={{ fontSize: '14px', color: '#4b5563', fontWeight: '500', marginBottom: '4px' }}>Escuta receptiva:</p>
            <p style={{ color: '#1f2937', margin: 0 }}>{planData.receptive_listening || 'Não especificado'}</p>
          </div>
          <div>
            <p style={{ fontSize: '14px', color: '#4b5563', fontWeight: '500', marginBottom: '4px' }}>Dinâmicas rítmicas:</p>
            <p style={{ color: '#1f2937', margin: 0 }}>{planData.rhythmic_dynamics || 'Não especificado'}</p>
          </div>
        </div>
      ), "bg-pink-50")}

      {/* 7. Frequency and Duration */}
      {renderSection("7. Frequência e Duração", "Clock", (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div>
            <p style={{ fontSize: '14px', color: '#4b5563', fontWeight: '500', marginBottom: '4px' }}>Sessões semanais:</p>
            <p style={{ fontSize: '18px', color: '#1f2937', margin: 0 }}>{planData.weekly_sessions || 0}x por semana</p>
          </div>
          <div>
            <p style={{ fontSize: '14px', color: '#4b5563', fontWeight: '500', marginBottom: '4px' }}>Duração de cada sessão:</p>
            <p style={{ fontSize: '18px', color: '#1f2937', margin: 0 }}>{planData.session_duration_minutes || 0} minutos</p>
          </div>
          <div>
            <p style={{ fontSize: '14px', color: '#4b5563', fontWeight: '500', marginBottom: '4px' }}>Período estimado:</p>
            <p style={{ fontSize: '18px', color: '#1f2937', margin: 0 }}>{planData.estimated_period_months || 0} meses</p>
          </div>
        </div>
      ), "bg-indigo-50")}

      {/* 8. Evaluation Criteria */}
      {renderSection("8. Critérios de Avaliação", "BarChart", (
        <div>
          <p style={{ fontSize: '14px', color: '#4b5563', fontWeight: '500', marginBottom: '8px' }}>Parâmetros observáveis para medir evolução:</p>
          {renderListItems(planData.evaluation_criteria_list, "Nenhum critério de avaliação definido")}
        </div>
      ), "bg-teal-50")}

      {/* 9. Therapeutic Plan in Action */}
      {renderSection("9. Plano Terapêutico em Ação", "Users", (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <p style={{ fontSize: '14px', color: '#4b5563', fontWeight: '500', marginBottom: '4px' }}>Estrutura das sessões:</p>
            <p style={{ color: '#1f2937', margin: 0 }}>{planData.session_structure || 'Não especificado'}</p>
          </div>
          <div>
            <p style={{ fontSize: '14px', color: '#4b5563', fontWeight: '500', marginBottom: '4px' }}>Sequência das atividades musicais propostas:</p>
            <p style={{ color: '#1f2937', margin: 0 }}>{planData.activity_sequence || 'Não especificado'}</p>
          </div>
          <div>
            <p style={{ fontSize: '14px', color: '#4b5563', fontWeight: '500', marginBottom: '4px' }}>Flexibilidade para ajustes:</p>
            <p style={{ color: '#1f2937', margin: 0 }}>{planData.flexibility_adjustments || 'Não especificado'}</p>
          </div>
        </div>
      ), "bg-red-50")}

      {/* 10. Re-evaluation and Evolution */}
      {renderSection("10. Reavaliação e Evolução", "RefreshCw", (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <p style={{ fontSize: '14px', color: '#4b5563', fontWeight: '500', marginBottom: '4px' }}>Frequência da reavaliação:</p>
            <p style={{ color: '#1f2937', margin: 0 }}>{planData.reevaluation_frequency || 'Não especificado'}</p>
          </div>
          <div>
            <p style={{ fontSize: '14px', color: '#4b5563', fontWeight: '500', marginBottom: '4px' }}>Registro da evolução em prontuário:</p>
            <p style={{ color: '#1f2937', margin: 0 }}>{planData.evolution_recording || 'Não especificado'}</p>
          </div>
          <div>
            <p style={{ fontSize: '14px', color: '#4b5563', fontWeight: '500', marginBottom: '4px' }}>Ajustes necessários nos objetivos e técnicas:</p>
            <p style={{ color: '#1f2937', margin: 0 }}>{planData.necessary_adjustments || 'Não especificado'}</p>
          </div>
        </div>
      ), "bg-gray-50")}

      {/* Footer - Digital Signature & Stamp (TEAL Design - Unified with Evaluation) */}
      <div style={{
        marginTop: '50px',
        border: '3px solid transparent',
        borderImage: 'linear-gradient(135deg, #0d9488, #14b8a6, #06b6d4) 1',
        borderRadius: '16px',
        overflow: 'hidden',
        background: '#ffffff',
        boxShadow: '0 8px 24px rgba(13, 148, 136, 0.15)'
      }}>
        {/* Decorative 6px TEAL bar at top */}
        <div style={{
          height: '6px',
          background: 'linear-gradient(90deg, #0d9488 0%, #14b8a6 50%, #06b6d4 100%)',
        }}></div>

        {/* Two-column grid with padding */}
        <div style={{ padding: '20px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            alignItems: 'start'
          }}>
            
            {/* Left Side: NESTED Signature Card */}
            <div style={{
              background: 'linear-gradient(135deg, #f0fdfa, #ccfbf1)',
              border: '2px solid #14b8a6',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(20,184,166,0.15)'
            }}>
              {/* Decorative bar inside card */}
              <div style={{
                height: '6px',
                background: 'linear-gradient(to right, #0d9488, #14b8a6, #06b6d4)',
              }}></div>

              <div style={{ padding: '12px' }}>
                {/* Horizontal Layout: Photo + Info */}
                <div style={{ display: 'flex', alignItems: 'start', gap: '12px', marginBottom: '12px' }}>
                  {/* Professional Photo with blur effect */}
                  {professionalPhotoUrl && (
                    <div style={{ position: 'relative' }}>
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '50%',
                        filter: 'blur(4px)',
                        opacity: 0.75,
                        background: 'linear-gradient(135deg, #14b8a6, #22d3ee, #0d9488)'
                      }}></div>
                      <img 
                        src={professionalPhotoUrl} 
                        alt="Professional" 
                        style={{
                          position: 'relative',
                          width: '60px',
                          height: '60px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '3px solid #14b8a6'
                        }}
                      />
                    </div>
                  )}
                
                  {/* Professional Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: '#0f766e',
                      marginBottom: '6px',
                      lineHeight: '1.3'
                    }}>
                      {therapistName || 'Musicoterapeuta'}
                    </div>
                    
                    <div style={{
                      backgroundColor: '#ccfbf1',
                      border: '1px solid #99f6e4',
                      borderRadius: '20px',
                      padding: '3px 10px',
                      display: 'inline-block',
                      marginBottom: '6px'
                    }}>
                      <span style={{ fontSize: '10px', color: '#0f766e', fontWeight: '600' }}>
                        🎵 {professionalSpecialty || 'Musicoterapeuta'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div style={{ fontSize: '10px', color: '#374151', lineHeight: '1.6' }}>
                  {professionalRegistry && (
                    <div style={{ marginBottom: '3px' }}>
                      <span style={{ marginRight: '4px' }}>📋</span>
                      {professionalRegistry}
                    </div>
                  )}
                  {professionalEmail && (
                    <div style={{ marginBottom: '3px' }}>
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

              {/* Verification Footer */}
              <div style={{
                borderTop: '1px solid #99f6e4',
                background: 'linear-gradient(to right, #f0fdfa, #ecfeff, #f0fdfa)',
                padding: '8px 12px',
                marginTop: '12px'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '8px' 
                }}>
                  <span style={{ color: '#0d9488' }}>✓</span>
                  <span style={{ fontSize: '10px', fontWeight: '600', color: '#0f766e' }}>
                    Assinatura Digital Verificada
                  </span>
                  <span style={{ color: '#0d9488' }}>🎵</span>
                  <span style={{ fontSize: '10px', color: '#6b7280' }}>
                    Sistema MuseTera
                  </span>
                </div>
              </div>
            </div>

            {/* Right Side: Stamp Section with Conditional Rendering */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {digitalStampUrl ? (
                <>
                  {/* Circular Stamp Container */}
                  <div style={{
                    width: '200px',
                    height: '200px',
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
                      width: '160px',
                      height: '160px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #f0fdfa, #ccfbf1)',
                      border: '3px solid #14b8a6',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '14px',
                      boxShadow: '0 8px 24px rgba(20,184,166,0.2), inset 0 2px 8px rgba(20,184,166,0.1)',
                      position: 'relative'
                    }}>
                      {/* Professional Photo in Stamp */}
                      {professionalPhotoUrl && (
                        <div style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          overflow: 'hidden',
                          border: '2px solid transparent',
                          backgroundImage: 'linear-gradient(#fff, #fff), linear-gradient(135deg, #0d9488, #14b8a6)',
                          backgroundOrigin: 'border-box',
                          backgroundClip: 'padding-box, border-box',
                          marginBottom: '8px'
                        }}>
                          <img 
                            src={professionalPhotoUrl} 
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
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: '#0f766e',
                        textAlign: 'center',
                        marginBottom: '6px',
                        lineHeight: '1.2'
                      }}>
                        {therapistName || 'Musicoterapeuta'}
                      </div>

                      {/* Divider */}
                      <div style={{
                        width: '60px',
                        height: '2px',
                        background: 'linear-gradient(to right, transparent, #14b8a6, transparent)',
                        marginBottom: '6px'
                      }} />

                      {/* Specialty Badge */}
                      <div style={{
                        backgroundColor: '#ccfbf1',
                        border: '1px solid #99f6e4',
                        borderRadius: '12px',
                        padding: '3px 10px',
                        marginBottom: '4px'
                      }}>
                        <span style={{ fontSize: '9px', color: '#0f766e', fontWeight: '600' }}>
                          🎵 {professionalSpecialty || 'Musicoterapeuta'}
                        </span>
                      </div>

                      {/* Registry */}
                      {professionalRegistry && (
                        <div style={{
                          fontSize: '9px',
                          color: '#374151',
                          fontWeight: '600'
                        }}>
                          {professionalRegistry}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Verified Badge Below Stamp */}
                  <div style={{
                    marginTop: '12px',
                    background: 'linear-gradient(135deg, #0d9488, #0891b2)',
                    color: 'white',
                    padding: '6px 16px',
                    borderRadius: '20px',
                    fontSize: '10px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 4px 12px rgba(13,148,136,0.3)'
                  }}>
                    <span>✓</span>
                    <span>MuseTera Verified</span>
                    <span>🎵</span>
                  </div>
                </>
              ) : (
                <div style={{ 
                  width: '160px',
                  height: '160px',
                  border: '3px dashed #14b8a6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  color: '#6b7280',
                  backgroundColor: '#f0fdfa'
                }}>
                  🔖 Carimbo Digital
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};