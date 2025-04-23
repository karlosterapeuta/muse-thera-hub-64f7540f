
import React from 'react';

interface MonthlyEvolutionPDFProps {
  content: {
    therapeutic_objectives: string;
    achievements: string;
    challenges: string;
    adjustments: string;
    next_steps: string;
  };
  patientName?: string;
  evaluatorName?: string;
  evaluatorEmail?: string;
}

export const MonthlyEvolutionPDF: React.FC<MonthlyEvolutionPDFProps> = ({
  content,
  patientName,
  evaluatorName,
  evaluatorEmail
}) => {
  return (
    <div className="bg-white p-8" style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #E5E7EB' }}>
        <h1 style={{ color: '#2563EB', fontSize: '24px', fontWeight: 'bold', marginBottom: '12px' }}>
          Evolução Mensal
        </h1>
        <h2 style={{ color: '#1F2937', fontSize: '18px', marginBottom: '6px' }}>
          Paciente: {patientName || 'Não informado'}
        </h2>
        <p style={{ color: '#6B7280', fontSize: '13px' }}>
          Data da Avaliação: {new Date().toLocaleDateString('pt-BR')}
        </p>
      </div>

      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ color: '#1F2937', fontSize: '20px', fontWeight: '600', marginBottom: '16px', paddingBottom: '6px', borderBottom: '2px solid #E5E7EB' }}>
          Objetivos Terapêuticos
        </h2>
        <div style={{ backgroundColor: '#F9FAFB', padding: '12px', borderRadius: '4px', border: '1px solid #E5E7EB', fontSize: '14px', lineHeight: '1.6', color: '#1F2937', whiteSpace: 'pre-wrap' }}>
          {content.therapeutic_objectives}
        </div>
      </div>

      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ color: '#1F2937', fontSize: '20px', fontWeight: '600', marginBottom: '16px', paddingBottom: '6px', borderBottom: '2px solid #E5E7EB' }}>
          Conquistas
        </h2>
        <div style={{ backgroundColor: '#F9FAFB', padding: '12px', borderRadius: '4px', border: '1px solid #E5E7EB', fontSize: '14px', lineHeight: '1.6', color: '#1F2937', whiteSpace: 'pre-wrap' }}>
          {content.achievements}
        </div>
      </div>

      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ color: '#1F2937', fontSize: '20px', fontWeight: '600', marginBottom: '16px', paddingBottom: '6px', borderBottom: '2px solid #E5E7EB' }}>
          Desafios
        </h2>
        <div style={{ backgroundColor: '#F9FAFB', padding: '12px', borderRadius: '4px', border: '1px solid #E5E7EB', fontSize: '14px', lineHeight: '1.6', color: '#1F2937', whiteSpace: 'pre-wrap' }}>
          {content.challenges}
        </div>
      </div>

      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ color: '#1F2937', fontSize: '20px', fontWeight: '600', marginBottom: '16px', paddingBottom: '6px', borderBottom: '2px solid #E5E7EB' }}>
          Ajustes Necessários
        </h2>
        <div style={{ backgroundColor: '#F9FAFB', padding: '12px', borderRadius: '4px', border: '1px solid #E5E7EB', fontSize: '14px', lineHeight: '1.6', color: '#1F2937', whiteSpace: 'pre-wrap' }}>
          {content.adjustments}
        </div>
      </div>

      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ color: '#1F2937', fontSize: '20px', fontWeight: '600', marginBottom: '16px', paddingBottom: '6px', borderBottom: '2px solid #E5E7EB' }}>
          Próximos Passos
        </h2>
        <div style={{ backgroundColor: '#F9FAFB', padding: '12px', borderRadius: '4px', border: '1px solid #E5E7EB', fontSize: '14px', lineHeight: '1.6', color: '#1F2937', whiteSpace: 'pre-wrap' }}>
          {content.next_steps}
        </div>
      </div>

      <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '2px solid #E5E7EB', textAlign: 'center' }}>
        <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '4px' }}>
          Documento gerado em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
        </p>
        <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '4px' }}>
          Musicoterapeuta: {evaluatorName || 'Não informado'}
        </p>
        <p style={{ color: '#6B7280', fontSize: '13px' }}>
          Email: {evaluatorEmail || 'Não informado'}
        </p>
      </div>
    </div>
  );
};
