import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ProfessionalData } from "@/hooks/useProfessionalData";

interface EnhancedMuseteraReportPDFProps {
  categoryData: any[];
  pieData: any[];
  radarData: any[];
  selectedParameters: any;
  overallScore: {
    raw: number;
    max: number;
    percentage: number;
    completionPercentage: number;
    evaluatedDomains: number;
    totalDomains: number;
    evaluatedParameters: number;
    totalParameters: number;
  };
  evaluationDomains: any[];
  patientName?: string;
  professionalData?: ProfessionalData | null;
  evaluationDate?: Date;
  digitalSignatureUrl?: string;
  digitalStampUrl?: string;
  professionalEmail?: string;
  professionalPhone?: string;
  professionalSpecialty?: string;
  professionalPhotoUrl?: string;
  patientData?: {
    age?: number;
    birthDate?: string;
    diagnosis?: string;
    medications?: string;
    musicalPreferences?: string;
    previousTherapies?: string;
    familyHistory?: string;
    developmentConcerns?: string;
  };
}

export const EnhancedMuseteraReportPDF: React.FC<EnhancedMuseteraReportPDFProps> = ({
  categoryData,
  pieData,
  radarData,
  selectedParameters,
  overallScore,
  evaluationDomains,
  patientName = "Paciente",
  professionalData,
  evaluationDate = new Date(),
  digitalSignatureUrl,
  digitalStampUrl,
  professionalEmail,
  professionalPhone,
  professionalSpecialty,
  professionalPhotoUrl,
  patientData = {}
}) => {
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', 'hsl(214 88% 52%)'];
  
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return '#10B981';
    if (percentage >= 60) return '#3B82F6';
    if (percentage >= 40) return '#F59E0B';
    if (percentage >= 20) return '#F97316';
    return '#EF4444';
  };

  const getScoreDescription = (percentage: number) => {
    if (percentage >= 80) return 'Excelente';
    if (percentage >= 60) return 'Bom';
    if (percentage >= 40) return 'Regular';
    if (percentage >= 20) return 'Necessita Atenção';
    return 'Requer Intervenção Imediata';
  };

  const ProgressBar = ({ percentage, label }: { percentage: number; label: string }) => (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '12px', fontWeight: '500', color: '#374151' }}>{label}</span>
        <span style={{ fontSize: '12px', fontWeight: '600', color: getScoreColor(percentage) }}>{percentage}%</span>
      </div>
      <div style={{ width: '100%', height: '8px', backgroundColor: '#F3F4F6', borderRadius: '4px', overflow: 'hidden' }}>
        <div 
          style={{ 
            width: `${percentage}%`, 
            height: '100%', 
            backgroundColor: getScoreColor(percentage),
            background: `linear-gradient(90deg, ${getScoreColor(percentage)} 0%, ${getScoreColor(percentage)}CC 100%)`,
            transition: 'width 0.3s ease'
          }} 
        />
      </div>
    </div>
  );

  const SectionHeader = ({ title, icon }: { title: string; icon: string }) => (
    <div style={{ 
      background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
      color: 'white',
      padding: '12px 18px',
      borderRadius: '6px',
      marginBottom: '15px',
      marginTop: '25px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    }}>
      <h2 style={{ 
        margin: '0', 
        fontSize: '16px', 
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{ fontSize: '18px' }}>{icon}</span>
        {title.toUpperCase()}
      </h2>
    </div>
  );

  const InfoRow = ({ label, value }: { label: string; value: string | number | undefined }) => (
    <div style={{ display: 'flex', marginBottom: '6px', fontSize: '12px' }}>
      <span style={{ fontWeight: '700', color: '#4b5563', width: '180px' }}>{label}:</span>
      <span style={{ color: '#1f2937' }}>{value || '---'}</span>
    </div>
  );

  return (
    <div style={{ 
      fontFamily: '"Segoe UI", system-ui, -apple-system, sans-serif',
      lineHeight: '1.5',
      color: '#1F2937',
      width: '210mm',
      padding: '15mm',
      margin: '0 auto',
      backgroundColor: '#FFFFFF',
      boxSizing: 'border-box'
    }}>
      {/* 1. IDENTIFICAÇÃO DO PACIENTE */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1e3a8a', margin: '0 0 5px 0' }}>RELATÓRIO DE AVALIAÇÃO MUSICOTERAPÊUTICA</h1>
        <div style={{ height: '2px', background: '#3b82f6', width: '100px', margin: '0 auto 20px auto' }}></div>
      </div>

      <SectionHeader title="Identificação" icon="👤" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <InfoRow label="Nome do Paciente" value={patientName} />
          <InfoRow label="Idade" value={patientData?.age ? `${patientData.age} anos` : '---'} />
          <InfoRow label="Data da Avaliação" value={format(evaluationDate, "dd/MM/yyyy", { locale: ptBR })} />
        </div>
        <div>
          <InfoRow label="Terapeuta Responsável" value={professionalData?.name} />
          <InfoRow label="Especialidade" value={professionalSpecialty || professionalData?.specialty} />
          <InfoRow label="Registro Profissional" value={professionalData?.register || professionalData?.license_number} />
        </div>
      </div>

      {/* 2. INSTRUMENTO DE AVALIAÇÃO */}
      <SectionHeader title="Instrumento de Avaliação" icon="📋" />
      <InfoRow label="Nome da Escala" value="Escala MuseTera" />
      <InfoRow label="Objetivo" value="Avaliar o perfil funcional e o desenvolvimento do paciente em diversos domínios através de estímulos musicais." />
      
      {/* 3. CONTEXTO DA AVALIAÇÃO */}
      <SectionHeader title="Contexto da Avaliação" icon="🏥" />
      <InfoRow label="Ambiente Terapêutico" value="Setting Musicoterapêutico especializado" />
      <InfoRow label="Recursos Utilizados" value="Instrumentos de percussão, teclado, violão, recursos tecnológicos e materiais sonoros diversos." />

      {/* 4. ANÁLISE CLÍNICA QUALITATIVA */}
      <SectionHeader title="Análise Clínica Qualitativa" icon="📝" />
      <div style={{ fontSize: '12px', color: '#374151', textAlign: 'justify' }}>
        <p><strong>Resposta aos Elementos Musicais:</strong> 
          O paciente apresenta uma resposta {overallScore.percentage >= 60 ? 'consistente' : 'em desenvolvimento'} aos estímulos de ritmo e melodia. 
          {radarData.find(d => d.name === "Domínio Musical")?.value >= 70 ? ' Demonstra boa percepção rítmica e afinação vocal/instrumental.' : ' Requer maior estímulo para sincronização e percepção melódica.'}
        </p>
        <p><strong>Comunicação e Interação:</strong>
          {radarData.find(d => d.name === "Domínio Comunicativo-Interativo")?.value >= 60 ? 
            'Apresenta iniciativa comunicativa e engajamento adequado com o terapeuta.' : 
            'Demonstra necessidade de suporte para manutenção do contato visual e turnos comunicativos.'}
        </p>
        <p><strong>Atenção e Engajamento:</strong>
          O nível de engajamento nas atividades propostas é de {overallScore.percentage}%, indicando um aproveitamento {getScoreDescription(overallScore.percentage).toLowerCase()} do setting terapêutico.
        </p>
      </div>

      {/* 5. RESULTADOS QUANTITATIVOS */}
      <SectionHeader title="Resultados Quantitativos" icon="📊" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '10px' }}>Pontuação por Domínio</h3>
          {radarData.map((domain, index) => (
            <ProgressBar key={index} percentage={domain.value} label={domain.name} />
          ))}
        </div>
        <div style={{ backgroundColor: '#f9fafb', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '5px' }}>Pontuação Global</h3>
          <div style={{ fontSize: '32px', fontWeight: '800', color: getScoreColor(overallScore.percentage) }}>{overallScore.percentage}%</div>
          <p style={{ fontSize: '12px', fontWeight: '600' }}>{getScoreDescription(overallScore.percentage)}</p>
          <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '10px' }}>({overallScore.raw} de {overallScore.max} pontos totais)</p>
        </div>
      </div>

      {/* 6. INTERPRETAÇÃO CLÍNICA AUTOMÁTICA */}
      <SectionHeader title="Interpretação Clínica" icon="🧠" />
      <div style={{ fontSize: '12px', color: '#374151', textAlign: 'justify' }}>
        <p>Com base nos dados coletados, observa-se que o paciente encontra-se em um estágio de desenvolvimento {overallScore.percentage >= 70 ? 'Avançado' : overallScore.percentage >= 40 ? 'Intermediário' : 'Inicial'}. 
        {radarData.sort((a, b) => b.value - a.value)[0]?.name} destaca-se como o domínio de maior força, enquanto {radarData.sort((a, b) => a.value - b.value)[0]?.name} apresenta maiores desafios e necessidade de intervenção prioritária.</p>
      </div>

      {/* 7. CONCLUSÃO E PLANO TERAPÊUTICO */}
      <SectionHeader title="Conclusão e Recomendações" icon="🎯" />
      <div style={{ fontSize: '12px', color: '#374151' }}>
        <p><strong>Perfil Musical Funcional:</strong> {overallScore.percentage >= 70 ? 'Musicalmente Funcional / Avançado' : overallScore.percentage >= 40 ? 'Em Evolução / Intermediário' : 'Necessita Suporte / Inicial'}</p>
        <p><strong>Foco Terapêutico Futuro:</strong> Priorizar atividades que estimulem o domínio {radarData.sort((a, b) => a.value - b.value)[0]?.name}, utilizando as forças identificadas no domínio {radarData.sort((a, b) => b.value - a.value)[0]?.name} como ponte para o desenvolvimento.</p>
        <p><strong>Sugestões:</strong> Manter a frequência das sessões e integrar atividades musicais no ambiente domiciliar para generalização das habilidades.</p>
      </div>

      {/* ASSINATURA */}
      <div style={{ marginTop: '50px', textAlign: 'center' }}>
        <div style={{ height: '1px', background: '#d1d5db', width: '250px', margin: '0 auto 10px auto' }}></div>
        <p style={{ fontSize: '12px', fontWeight: '700', margin: '0' }}>{professionalData?.name}</p>
        <p style={{ fontSize: '11px', color: '#6b7280', margin: '0' }}>{professionalSpecialty || professionalData?.specialty} - {professionalData?.register || professionalData?.license_number}</p>
        {digitalStampUrl && (
          <img src={digitalStampUrl} style={{ width: '120px', marginTop: '10px' }} alt="Carimbo" />
        )}
      </div>

      <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '10px', fontSize: '9px', color: '#9ca3af', textAlign: 'center' }}>
        Relatório gerado automaticamente pelo Sistema MuseTera em {format(new Date(), "dd/MM/yyyy HH:mm")}.
      </div>
    </div>
  );
};
