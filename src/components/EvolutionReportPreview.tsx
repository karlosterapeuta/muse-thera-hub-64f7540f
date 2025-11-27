
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { evolutionSections } from '@/data/evolutionTemplate';
import type { EvolutionReportData } from '@/hooks/useEvolutionReport';

interface EvolutionReportPreviewProps {
  data: EvolutionReportData;
  professionalName?: string;
  professionalRegister?: string;
  professionalPhotoUrl?: string;
  professionalSpecialty?: string;
  professionalEmail?: string;
  professionalPhone?: string;
  digitalStampUrl?: string;
}

export const EvolutionReportPreview: React.FC<EvolutionReportPreviewProps> = ({ 
  data, 
  professionalName = "Nome do Profissional",
  professionalRegister = "CRM/XXXX",
  professionalPhotoUrl,
  professionalSpecialty = "Musicoterapeuta",
  professionalEmail,
  professionalPhone,
  digitalStampUrl
}) => {
  const currentDate = format(new Date(), 'PPP', { locale: ptBR });

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg" style={{ 
      fontFamily: 'Times New Roman, serif',
      fontSize: '12px',
      lineHeight: '1.6',
      color: '#000000',
      minHeight: '297mm',
      padding: '20mm'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '3px solid #2563eb', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e40af', margin: '0 0 10px 0' }}>
          RELATÓRIO DE EVOLUÇÃO – MUSICOTERAPIA
        </h1>
        <div style={{ fontSize: '14px', color: '#6b7280' }}>
          Sistema MuseTera - Plataforma Especializada em Musicoterapia
        </div>
      </div>

      {/* Patient Info */}
      <div style={{ marginBottom: '25px', padding: '15px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#374151', marginBottom: '10px' }}>
          Informações do Paciente
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <strong>Paciente:</strong> {data.patient_name || 'Nome do Paciente'}
          </div>
          <div>
            <strong>Data:</strong> {data.date ? format(new Date(data.date), 'dd/MM/yyyy') : currentDate}
          </div>
        </div>
      </div>

      {/* Report Sections */}
      {evolutionSections.map((section, index) => {
        const content = data[section.key as keyof EvolutionReportData] as string;
        if (!content) return null;
        
        return (
          <div key={section.key} style={{ marginBottom: '25px', pageBreakInside: 'avoid' }}>
            <div style={{ 
              backgroundColor: '#f1f5f9', 
              padding: '12px 15px', 
              marginBottom: '10px', 
              borderLeft: '4px solid #2563eb',
              borderRadius: '4px' 
            }}>
              <h3 style={{ 
                fontSize: '14px', 
                fontWeight: 'bold', 
                color: '#1e40af', 
                margin: 0,
                textTransform: 'uppercase'
              }}>
                {index + 1}. {section.title}
              </h3>
            </div>
            <div style={{ 
              padding: '15px', 
              backgroundColor: '#ffffff', 
              border: '1px solid #e5e7eb',
              borderRadius: '4px',
              textAlign: 'justify'
            }}>
              {content.split('\n').map((paragraph, pIndex) => (
                <p key={pIndex} style={{ margin: '0 0 10px 0' }}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        );
      })}

      {/* Summary Section */}
      <div style={{ 
        marginTop: '40px', 
        padding: '20px', 
        backgroundColor: '#f8fafc', 
        border: '2px solid #3b82f6',
        borderRadius: '8px',
        pageBreakInside: 'avoid'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e40af', marginBottom: '15px' }}>
          📋 Resumo da Sessão
        </h3>
        <div style={{ fontSize: '12px', color: '#374151', lineHeight: '1.6' }}>
          Este relatório documenta a evolução do paciente durante a sessão de musicoterapia,
          registrando aspectos importantes desde sua chegada até sua saída, incluindo recursos utilizados,
          dinâmicas aplicadas e respostas observadas aos estímulos musicoterapêuticos.
        </div>
      </div>

      {/* Footer - TEAL Design Unificado */}
      <div style={{ 
        marginTop: '50px', 
        border: '3px solid transparent',
        borderImage: 'linear-gradient(135deg, #0d9488, #14b8a6, #06b6d4) 1',
        borderRadius: '16px',
        overflow: 'hidden',
        background: '#ffffff',
        boxShadow: '0 8px 24px rgba(13, 148, 136, 0.15)',
        pageBreakInside: 'avoid'
      }}>
        {/* Barra Decorativa Teal 8px */}
        <div style={{ height: '8px', background: 'linear-gradient(90deg, #0d9488 0%, #14b8a6 50%, #06b6d4 100%)' }} />
        
        {/* Seção Principal - padding 32px */}
        <div style={{ padding: '32px' }}>
          {/* Grid Layout 1fr 1fr */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }}>
            
            {/* ESQUERDA: Card de Assinatura */}
            <div style={{ 
              background: 'linear-gradient(135deg, #f0fdfa, #ccfbf1)', 
              border: '2px solid #14b8a6', 
              borderRadius: '12px', 
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(20,184,166,0.15)'
            }}>
              {/* Barra decorativa 8px */}
              <div style={{ height: '8px', background: 'linear-gradient(to right, #0d9488, #14b8a6, #06b6d4)' }} />
              
              <div style={{ padding: '20px' }}>
                {/* Layout horizontal: Foto + Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  
                  {/* Foto com Blur 80x80 */}
                  <div style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0 }}>
                    <div style={{ 
                      position: 'absolute', 
                      inset: 0, 
                      borderRadius: '50%', 
                      background: 'linear-gradient(135deg, #14b8a6, #22d3ee, #0d9488)', 
                      filter: 'blur(4px)', 
                      opacity: 0.75 
                    }} />
                    <div style={{ 
                      position: 'relative', 
                      width: '100%', 
                      height: '100%', 
                      borderRadius: '50%', 
                      overflow: 'hidden', 
                      border: '3px solid #fff' 
                    }}>
                      {professionalPhotoUrl ? (
                        <img src={professionalPhotoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Professional" />
                      ) : (
                        <div style={{ 
                          width: '100%', 
                          height: '100%', 
                          background: 'linear-gradient(135deg, #14b8a6, #06b6d4)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '32px',
                          fontWeight: 'bold',
                          color: '#fff'
                        }}>
                          {professionalName.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Info do Profissional */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f766e', marginBottom: '8px', lineHeight: '1.3' }}>
                      {professionalName}
                    </div>
                    <div style={{ 
                      backgroundColor: '#ccfbf1', 
                      border: '1px solid #99f6e4', 
                      borderRadius: '20px', 
                      padding: '4px 12px', 
                      display: 'inline-block' 
                    }}>
                      <span style={{ fontSize: '11px', color: '#0f766e', fontWeight: '600' }}>
                        🎵 {professionalSpecialty}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Contatos */}
                <div style={{ fontSize: '12px', color: '#374151', lineHeight: '1.6' }}>
                  <div style={{ marginBottom: '4px' }}>
                    <span>📋</span> {professionalRegister}
                  </div>
                  {professionalEmail && (
                    <div style={{ marginBottom: '4px' }}>
                      <span>📧</span> {professionalEmail}
                    </div>
                  )}
                  {professionalPhone && (
                    <div>
                      <span>📞</span> {professionalPhone}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Verification Footer */}
              <div style={{ 
                borderTop: '1px solid #99f6e4', 
                background: 'linear-gradient(to right, #f0fdfa, #ecfeff, #f0fdfa)', 
                padding: '12px 16px' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span style={{ color: '#0d9488' }}>✓</span>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f766e' }}>
                    Assinatura Digital Verificada
                  </span>
                  <span style={{ color: '#0d9488' }}>🎵</span>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>Sistema MuseTera</span>
                </div>
              </div>
            </div>
            
            {/* DIREITA: Carimbo Circular 280x280 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              
              {/* Container Outer 280x280 */}
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
                
                {/* Main Stamp Circle 240x240 */}
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
                  
                  {/* Foto no Carimbo 70x70 */}
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
                    {professionalPhotoUrl ? (
                      <img src={professionalPhotoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Professional" />
                    ) : (
                      <div style={{ 
                        width: '100%', 
                        height: '100%', 
                        background: 'linear-gradient(135deg, #14b8a6, #06b6d4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '28px',
                        fontWeight: 'bold',
                        color: '#fff'
                      }}>
                        {professionalName.charAt(0)}
                      </div>
                    )}
                  </div>
                  
                  {/* Nome */}
                  <div style={{ 
                    fontSize: '14px', 
                    fontWeight: 'bold', 
                    color: '#0f766e', 
                    textAlign: 'center', 
                    marginBottom: '8px',
                    lineHeight: '1.2'
                  }}>
                    {professionalName}
                  </div>
                  
                  {/* Divider 80px gradient */}
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
                      🎵 {professionalSpecialty}
                    </span>
                  </div>
                  
                  {/* Registry */}
                  <div style={{ fontSize: '11px', color: '#374151', fontWeight: '600' }}>
                    {professionalRegister}
                  </div>
                </div>
              </div>
              
              {/* Verified Badge GRADIENT */}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
