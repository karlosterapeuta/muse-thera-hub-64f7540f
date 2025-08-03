
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { evolutionSections } from '@/data/evolutionTemplate';
import type { EvolutionReportData } from '@/hooks/useEvolutionReport';

interface EvolutionReportPreviewProps {
  data: EvolutionReportData;
  professionalName?: string;
  professionalRegister?: string;
}

export const EvolutionReportPreview: React.FC<EvolutionReportPreviewProps> = ({ 
  data, 
  professionalName = "Nome do Profissional",
  professionalRegister = "CRM/XXXX"
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
          RELATÓRIO DE EVOLUÇÃO – MUSETERAPIA
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

      {/* Footer */}
      <div style={{ 
        marginTop: '40px', 
        borderTop: '2px solid #e5e7eb', 
        paddingTop: '20px',
        pageBreakInside: 'avoid'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          <div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Musicoterapeuta Responsável:</strong>
            </div>
            <div style={{ marginBottom: '5px' }}>
              {professionalName}
            </div>
            <div style={{ fontSize: '11px', color: '#6b7280' }}>
              {professionalRegister}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ marginBottom: '15px', fontSize: '11px', color: '#6b7280' }}>
              Relatório gerado em {currentDate}
            </div>
            <div style={{ 
              width: '150px', 
              height: '2px', 
              backgroundColor: '#3b82f6', 
              marginLeft: 'auto',
              marginTop: '20px'
            }}></div>
            <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '5px' }}>
              Assinatura Digital
            </div>
          </div>
        </div>
        
        <div style={{ 
          marginTop: '20px', 
          textAlign: 'center', 
          fontSize: '10px', 
          color: '#6b7280',
          borderTop: '1px solid #e5e7eb',
          paddingTop: '10px'
        }}>
          🎵 Documento gerado pelo Sistema MuseTera - Plataforma Especializada em Musicoterapia
        </div>
      </div>
    </div>
  );
};
