import React from 'react';
import { User, FileText, Target, Music, Users, Clock, CheckCircle, Activity, BarChart, RefreshCw } from 'lucide-react';
import { MusicotherapyTreatmentPlan } from '@/types/musicotherapy-plan';
import { formatBirthDateForDisplay } from '@/utils/dateUtils';

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

  const renderSection = (title: string, icon: React.ElementType, children: React.ReactNode, bgColor = "bg-blue-50") => {
    const IconComponent = icon;
    return (
      <div className={`${bgColor} border-l-4 border-blue-500 p-6 mb-6 rounded-r-lg`}>
        <div className="flex items-center mb-4">
          <IconComponent className="h-6 w-6 text-blue-600 mr-3" />
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        </div>
        {children}
      </div>
    );
  };

  const renderListItems = (items: string[] | undefined, emptyText = "Não especificado") => {
    if (!items || items.length === 0) return <p className="text-gray-600">{emptyText}</p>;
    return (
      <ul className="list-disc list-inside space-y-1">
        {items.map((item, index) => (
          <li key={index} className="text-gray-800">{item}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="bg-white text-black font-serif leading-relaxed max-w-4xl mx-auto p-8" style={{ fontFamily: 'Times New Roman, serif', lineHeight: '1.6' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-8 mb-8 rounded-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Plano de Tratamento Musicoterapêutico</h1>
          <p className="text-blue-100 text-lg">Modelo Profissional Completo</p>
          <div className="mt-4 text-blue-100">
            <p className="text-sm">Data de Emissão: {currentDate}</p>
          </div>
        </div>
      </div>

      {/* 1. Patient Identification */}
      {renderSection("1. Identificação do Paciente", User, (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 font-medium">Nome completo:</p>
            <p className="text-lg text-gray-800">{planData.patient_full_name || 'Não informado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Data de nascimento:</p>
            <p className="text-lg text-gray-800">{formatBirthDateForDisplay(planData.patient_birth_date) || 'Não informado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Idade:</p>
            <p className="text-lg text-gray-800">{planData.patient_age || 'Não informado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Diagnóstico clínico:</p>
            <p className="text-lg text-gray-800">{planData.clinical_diagnosis || 'Não informado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Responsável:</p>
            <p className="text-lg text-gray-800">{planData.responsible_person || 'Não informado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Data de início do plano:</p>
            <p className="text-lg text-gray-800">{formatBirthDateForDisplay(planData.plan_start_date) || 'Não informado'}</p>
          </div>
        </div>
      ), "bg-blue-50")}

      {/* 2. Initial Assessment */}
      {renderSection("2. Avaliação Inicial", FileText, (
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 font-medium mb-1">Histórico clínico e familiar relevante:</p>
            <p className="text-gray-800 leading-relaxed">{planData.clinical_family_history || 'Não informado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium mb-1">Condições físicas, cognitivas, emocionais e sociais:</p>
            <p className="text-gray-800 leading-relaxed">{planData.physical_cognitive_conditions || 'Não informado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium mb-1">Nível de interação e comunicação:</p>
            <p className="text-gray-800 leading-relaxed">{planData.interaction_communication_level || 'Não informado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium mb-1">Interesses musicais:</p>
            <p className="text-gray-800 leading-relaxed">{planData.musical_interests || 'Não informado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium mb-1">Comportamentos observados durante avaliação inicial:</p>
            <p className="text-gray-800 leading-relaxed">{planData.observed_behaviors || 'Não informado'}</p>
          </div>
        </div>
      ), "bg-green-50")}

      {/* 3. General Objectives */}
      {renderSection("3. Objetivos Gerais", Target, (
        <div>
          <p className="text-sm text-gray-600 font-medium mb-2">Propósitos amplos da musicoterapia para este paciente:</p>
          {renderListItems(planData.general_objectives, "Nenhum objetivo geral definido")}
        </div>
      ), "bg-purple-50")}

      {/* 4. Specific Objectives */}
      {renderSection("4. Objetivos Específicos", CheckCircle, (
        <div>
          <p className="text-sm text-gray-600 font-medium mb-2">Objetivos mensuráveis e específicos:</p>
          {renderListItems(planData.specific_objectives, "Nenhum objetivo específico definido")}
        </div>
      ), "bg-yellow-50")}

      {/* 5. Musicotherapy Resources */}
      {renderSection("5. Recursos Musicoterapêuticos", Music, (
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 font-medium mb-2">Instrumentos musicais:</p>
            {renderListItems(planData.musical_instruments)}
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium mb-2">Recursos tecnológicos:</p>
            {renderListItems(planData.technological_resources)}
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium mb-2">Voz e corpo:</p>
            {renderListItems(planData.voice_body_resources)}
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium mb-2">Materiais complementares:</p>
            {renderListItems(planData.complementary_materials)}
          </div>
        </div>
      ), "bg-orange-50")}

      {/* 6. Strategies and Techniques */}
      {renderSection("6. Estratégias e Técnicas", Activity, (
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 font-medium mb-1">Improvisação musical:</p>
            <p className="text-gray-800">{planData.musical_improvisation || 'Não especificado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium mb-1">Recriação musical:</p>
            <p className="text-gray-800">{planData.musical_recreation || 'Não especificado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium mb-1">Composição:</p>
            <p className="text-gray-800">{planData.musical_composition || 'Não especificado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium mb-1">Escuta receptiva:</p>
            <p className="text-gray-800">{planData.receptive_listening || 'Não especificado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium mb-1">Dinâmicas rítmicas:</p>
            <p className="text-gray-800">{planData.rhythmic_dynamics || 'Não especificado'}</p>
          </div>
        </div>
      ), "bg-pink-50")}

      {/* 7. Frequency and Duration */}
      {renderSection("7. Frequência e Duração", Clock, (
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600 font-medium">Sessões semanais:</p>
            <p className="text-lg text-gray-800">{planData.weekly_sessions || 0}x por semana</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Duração de cada sessão:</p>
            <p className="text-lg text-gray-800">{planData.session_duration_minutes || 0} minutos</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Período estimado:</p>
            <p className="text-lg text-gray-800">{planData.estimated_period_months || 0} meses</p>
          </div>
        </div>
      ), "bg-indigo-50")}

      {/* 8. Evaluation Criteria */}
      {renderSection("8. Critérios de Avaliação", BarChart, (
        <div>
          <p className="text-sm text-gray-600 font-medium mb-2">Parâmetros observáveis para medir evolução:</p>
          {renderListItems(planData.evaluation_criteria_list, "Nenhum critério de avaliação definido")}
        </div>
      ), "bg-teal-50")}

      {/* 9. Therapeutic Plan in Action */}
      {renderSection("9. Plano Terapêutico em Ação", Users, (
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 font-medium mb-1">Estrutura das sessões:</p>
            <p className="text-gray-800">{planData.session_structure || 'Não especificado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium mb-1">Sequência das atividades musicais propostas:</p>
            <p className="text-gray-800">{planData.activity_sequence || 'Não especificado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium mb-1">Flexibilidade para ajustes:</p>
            <p className="text-gray-800">{planData.flexibility_adjustments || 'Não especificado'}</p>
          </div>
        </div>
      ), "bg-red-50")}

      {/* 10. Re-evaluation and Evolution */}
      {renderSection("10. Reavaliação e Evolução", RefreshCw, (
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 font-medium mb-1">Frequência da reavaliação:</p>
            <p className="text-gray-800">{planData.reevaluation_frequency || 'Não especificado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium mb-1">Registro da evolução em prontuário:</p>
            <p className="text-gray-800">{planData.evolution_recording || 'Não especificado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium mb-1">Ajustes necessários nos objetivos e técnicas:</p>
            <p className="text-gray-800">{planData.necessary_adjustments || 'Não especificado'}</p>
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
        {/* Decorative 8px TEAL bar at top */}
        <div style={{
          height: '8px',
          background: 'linear-gradient(90deg, #0d9488 0%, #14b8a6 50%, #06b6d4 100%)',
        }}></div>

        {/* Two-column grid with padding */}
        <div style={{ padding: '32px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '32px',
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
                height: '8px',
                background: 'linear-gradient(to right, #0d9488, #14b8a6, #06b6d4)',
              }}></div>

              <div style={{ padding: '16px' }}>
                {/* Horizontal Layout: Photo + Info */}
                <div style={{ display: 'flex', alignItems: 'start', gap: '16px', marginBottom: '16px' }}>
                  {/* Professional Photo with blur effect */}
                  {professionalPhotoUrl && (
                    <div style={{ position: 'relative' }}>
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '50%',
                        filter: 'blur(40px)',
                        opacity: 0.5,
                        background: 'radial-gradient(circle, #14b8a6, #22d3ee, #0d9488)'
                      }}></div>
                      <img 
                        src={professionalPhotoUrl} 
                        alt="Professional" 
                        style={{
                          position: 'relative',
                          width: '80px',
                          height: '80px',
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
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#0f766e',
                      marginBottom: '8px',
                      lineHeight: '1.3'
                    }}>
                      {therapistName || 'Musicoterapeuta'}
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
                </div>

                {/* Contact Information */}
                <div style={{ fontSize: '12px', color: '#374151', lineHeight: '1.6' }}>
                  {professionalRegistry && (
                    <div style={{ marginBottom: '4px' }}>
                      <span style={{ marginRight: '4px' }}>📋</span>
                      {professionalRegistry}
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

              {/* Verification Footer */}
              <div style={{
                borderTop: '1px solid #99f6e4',
                background: 'linear-gradient(to right, #f0fdfa, #ecfeff, #f0fdfa)',
                padding: '12px 16px',
                marginTop: '16px'
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

            {/* Right Side: Stamp Section with Conditional Rendering */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {digitalStampUrl ? (
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
                      {professionalPhotoUrl && (
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
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: '#0f766e',
                        textAlign: 'center',
                        marginBottom: '8px',
                        lineHeight: '1.2'
                      }}>
                        {therapistName || 'Musicoterapeuta'}
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
                          🎵 {professionalSpecialty || 'Musicoterapeuta'}
                        </span>
                      </div>

                      {/* Registry */}
                      {professionalRegistry && (
                        <div style={{
                          fontSize: '11px',
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
        </div>
      </div>
    </div>
  );
};