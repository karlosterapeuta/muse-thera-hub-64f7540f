
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
      width: '210mm',
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
            <strong>Data:</strong> {data.date ? (() => {
              const [y, m, d] = data.date.split('-').map(Number);
              return format(new Date(y, m - 1, d), 'dd/MM/yyyy');
            })() : currentDate}
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
          Resumo da Sessão
        </h3>
        <div style={{ fontSize: '12px', color: '#374151', lineHeight: '1.6' }}>
          Este relatório documenta a evolução do paciente durante a sessão de musicoterapia,
          registrando aspectos importantes desde sua chegada até sua saída, incluindo recursos utilizados,
          dinâmicas aplicadas e respostas observadas aos estímulos musicoterapêuticos.
        </div>
      </div>

      {/* Footer TEAL - Design 50% menor (igual ao modelo musicoterapia) */}
      <div style={{ 
        marginTop: '25px', 
        border: '2px solid transparent',
        borderRadius: '10px',
        overflow: 'hidden',
        background: '#ffffff',
        backgroundImage: 'linear-gradient(#fff, #fff), linear-gradient(135deg, #0d9488, #14b8a6, #06b6d4)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
        pageBreakInside: 'avoid'
      }}>
        {/* Barra Decorativa Teal 4px */}
        <div style={{ height: '4px', background: 'linear-gradient(90deg, #0d9488 0%, #14b8a6 50%, #06b6d4 100%)' }} />
        
        {/* Seção Principal - padding 16px */}
        <div style={{ padding: '16px' }}>
          {/* Grid Layout 1fr 1fr */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'start' }}>
            
            {/* ESQUERDA: Card de Assinatura - 50% menor */}
            <div style={{ 
              background: 'linear-gradient(135deg, #f0fdfa, #ccfbf1)', 
              border: '1px solid #14b8a6', 
              borderRadius: '8px', 
              overflow: 'hidden'
            }}>
              {/* Barra decorativa 4px */}
              <div style={{ height: '4px', background: 'linear-gradient(to right, #0d9488, #14b8a6, #06b6d4)' }} />
              
              <div style={{ padding: '12px' }}>
                {/* Layout vertical centralizado */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  
                  {/* Foto com Blur 48x48 */}
                  {professionalPhotoUrl && (
                    <div style={{ position: 'relative' }}>
                      <div style={{ 
                        position: 'absolute', 
                        width: '52px', 
                        height: '52px', 
                        borderRadius: '50%', 
                        background: 'linear-gradient(135deg, rgba(20,184,166,0.4), rgba(6,182,212,0.3))', 
                        filter: 'blur(5px)', 
                        top: '-2px', 
                        left: '-2px' 
                      }} />
                      <div style={{ 
                        width: '48px', 
                        height: '48px', 
                        borderRadius: '50%', 
                        overflow: 'hidden', 
                        border: '2px solid #ffffff', 
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)', 
                        position: 'relative',
                        background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
                        padding: '2px'
                      }}>
                        <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden' }}>
                          <img src={professionalPhotoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Professional" />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Info do Profissional */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '9px', fontWeight: 'bold', color: '#0f766e', marginBottom: '6px', lineHeight: '1.3', wordWrap: 'break-word' }}>
                      {professionalName}
                    </div>
                    <div style={{ 
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      backgroundColor: '#ccfbf1', 
                      border: '1px solid #5eead4', 
                      borderRadius: '10px', 
                      padding: '3px 7px',
                      marginBottom: '8px'
                    }}>
                      <span style={{ color: '#0f766e', fontSize: '7px' }}>&#9835;</span>
                      <span style={{ fontSize: '7px', color: '#0f766e', fontWeight: '600' }}>
                        {professionalSpecialty}
                      </span>
                    </div>
                    
                    {/* Contatos */}
                    <div style={{ fontSize: '7px', color: '#374151', lineHeight: '1.8' }}>
                      {professionalRegister && (
                        <div>
                          <strong style={{ color: '#0f766e' }}>Registro:</strong> {professionalRegister}
                        </div>
                      )}
                      {professionalEmail && (
                        <div style={{ wordWrap: 'break-word' }}>
                          <strong style={{ color: '#0f766e' }}>Email:</strong> {professionalEmail}
                        </div>
                      )}
                      {professionalPhone && (
                        <div>
                          <strong style={{ color: '#0f766e' }}>Telefone:</strong> {professionalPhone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Verification Footer */}
              <div style={{ 
                borderTop: '1px solid #5eead4', 
                background: 'linear-gradient(to right, #f0fdfa, #ecfeff, #f0fdfa)', 
                padding: '7px' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <span style={{ color: '#0d9488', fontSize: '8px' }}>&#10004;</span>
                  <span style={{ fontSize: '6px', fontWeight: '600', color: '#0f766e' }}>
                    Assinatura Digital Verificada
                  </span>
                  <span style={{ color: '#0d9488', fontSize: '7px' }}>&#9835;</span>
                  <span style={{ fontSize: '6px', color: '#6b7280' }}>Sistema MuseTera</span>
                </div>
              </div>
            </div>
            
            {/* DIREITA: Carimbo Circular 140x140 - 50% menor */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              
              {professionalPhotoUrl ? (
                <>
                  {/* Container Outer 140x140 */}
                  <div style={{ 
                    width: '140px', 
                    height: '140px', 
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
                      border: '2px dashed #14b8a6', 
                      opacity: 0.3 
                    }} />
                    
                    {/* Secondary Border */}
                    <div style={{ 
                      position: 'absolute', 
                      width: '92%', 
                      height: '92%', 
                      borderRadius: '50%', 
                      border: '1px solid #14b8a6', 
                      opacity: 0.5 
                    }} />
                    
                    {/* Main Stamp Circle 120x120 */}
                    <div style={{ 
                      width: '120px', 
                      height: '120px', 
                      borderRadius: '50%', 
                      background: 'linear-gradient(135deg, #f0fdfa, #ccfbf1)', 
                      border: '3px solid #0d9488', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      padding: '8px',
                      boxShadow: '0 4px 12px rgba(20,184,166,0.25)',
                      position: 'relative'
                    }}>
                      
                      {/* Foto no Carimbo 40x40 */}
                      <div style={{ position: 'relative', marginBottom: '5px' }}>
                        <div style={{ 
                          position: 'absolute', 
                          width: '44px', 
                          height: '44px', 
                          borderRadius: '50%', 
                          background: 'linear-gradient(135deg, rgba(20,184,166,0.4), rgba(6,182,212,0.3))', 
                          filter: 'blur(4px)', 
                          top: '-2px', 
                          left: '-2px' 
                        }} />
                        <div style={{ 
                          width: '40px', 
                          height: '40px', 
                          borderRadius: '50%', 
                          overflow: 'hidden',
                          border: '2px solid #ffffff',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                          position: 'relative'
                        }}>
                          <img src={professionalPhotoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Professional" />
                        </div>
                      </div>
                      
                      {/* Nome */}
                      <div style={{ 
                        fontSize: '7px', 
                        fontWeight: 'bold', 
                        color: '#0f766e', 
                        textAlign: 'center', 
                        marginBottom: '3px',
                        maxWidth: '90px',
                        lineHeight: '1.3',
                        wordWrap: 'break-word'
                      }}>
                        {professionalName}
                      </div>
                      
                      {/* Divider 30px gradient */}
                      <div style={{ 
                        width: '30px', 
                        height: '1px', 
                        background: 'linear-gradient(to right, transparent, #14b8a6, transparent)', 
                        marginBottom: '3px' 
                      }} />
                      
                      {/* Specialty Badge */}
                      <div style={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '2px',
                        backgroundColor: '#ccfbf1', 
                        border: '1px solid #5eead4', 
                        borderRadius: '8px', 
                        padding: '2px 5px',
                        marginBottom: '2px'
                      }}>
                        <span style={{ fontSize: '5px', color: '#0f766e' }}>&#9835;</span>
                        <span style={{ fontSize: '5px', color: '#0f766e', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                          {professionalSpecialty}
                        </span>
                      </div>
                      
                      {/* Registry */}
                      {professionalRegister && (
                        <div style={{ fontSize: '6px', color: '#374151', fontWeight: '600' }}>
                          {professionalRegister}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Verified Badge GRADIENT */}
                  <div style={{ 
                    marginTop: '6px', 
                    background: 'linear-gradient(135deg, #0d9488, #0891b2)', 
                    color: 'white', 
                    padding: '4px 9px', 
                    borderRadius: '10px', 
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px',
                    boxShadow: '0 2px 6px rgba(13,148,136,0.3)'
                  }}>
                    <span style={{ fontSize: '6px' }}>&#10004;</span>
                    <span style={{ fontSize: '6px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.3px' }}>MuseTera Verified</span>
                    <span style={{ fontSize: '6px' }}>&#9835;</span>
                  </div>
                </>
              ) : (
                <div style={{ 
                  width: '120px', 
                  height: '120px', 
                  border: '2px dashed #14b8a6', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '7px', 
                  color: '#6b7280', 
                  background: '#f0fdfa' 
                }}>
                  Carimbo Digital
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
