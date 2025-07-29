
import { saveAs } from 'file-saver';

interface DocGeneratorOptions {
  filename?: string;
  pageOrientation?: 'portrait' | 'landscape';
  margins?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}

export const generateDOC = async (
  content: {
    patient_id: string;
    type: string;
    date: Date;
    content: Record<string, any>;
  },
  patientName: string,
  professionalData: any,
  evaluatorEmail: string | null,
  evaluatorName: string | null,
  options: DocGeneratorOptions = {}
): Promise<void> => {
  try {
    console.log("📄 Gerando documento DOC...");

    const defaultOptions: DocGeneratorOptions = {
      filename: `Relatorio_${patientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.rtf`,
      pageOrientation: 'portrait',
      margins: {
        top: 720,
        right: 720,
        bottom: 720,
        left: 720
      },
      ...options
    };

    // Gerar conteúdo RTF que pode ser aberto pelo Word
    const rtfContent = generateRTFContent(content, patientName, professionalData, evaluatorEmail, evaluatorName);

    // Criar blob RTF
    const blob = new Blob([rtfContent], { 
      type: 'application/rtf' 
    });

    // Fazer download do arquivo
    saveAs(blob, defaultOptions.filename);

    console.log("✅ Documento DOC gerado com sucesso!");

  } catch (error) {
    console.error("❌ Erro ao gerar documento DOC:", error);
    throw new Error("Falha ao gerar documento DOC");
  }
};

const generateRTFContent = (
  content: {
    patient_id: string;
    type: string;
    date: Date;
    content: Record<string, any>;
  },
  patientName: string,
  professionalData: any,
  evaluatorEmail: string | null,
  evaluatorName: string | null
): string => {
  const reportDate = new Date(content.date).toLocaleDateString('pt-BR');
  const currentDate = new Date().toLocaleDateString('pt-BR');
  
  // RTF header
  let rtf = '{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}';
  
  // Title
  rtf += '\\f0\\fs28\\b RELATÓRIO DE MUSICOTERAPIA\\b0\\par';
  rtf += `\\fs24 ${getReportTypeName(content.type)}\\par\\par`;
  
  // Info section
  rtf += '\\fs20\\b Informações do Relatório\\b0\\par';
  rtf += `Paciente: ${patientName}\\par`;
  rtf += `Data do Relatório: ${reportDate}\\par`;
  rtf += `Profissional: ${evaluatorName || professionalData?.name || 'Não informado'}\\par`;
  rtf += `Email: ${evaluatorEmail || professionalData?.email || 'Não informado'}\\par`;
  rtf += `Data de Geração: ${currentDate}\\par\\par`;
  
  // Content sections
  rtf += generateRTFContentSections(content.content);
  
  // Signature section
  rtf += '\\par\\par\\par';
  rtf += '________________________________\\par';
  rtf += `\\b ${evaluatorName || professionalData?.name || 'Profissional Responsável'}\\b0\\par`;
  rtf += `${professionalData?.specialty || 'Musicoterapeuta'}\\par`;
  if (professionalData?.license_number) {
    rtf += `CRM: ${professionalData.license_number}\\par`;
  }
  
  // Footer
  rtf += '\\par\\par';
  rtf += '\\fs16 Documento gerado automaticamente pelo Relatório MuseTera TEA\\par';
  rtf += `Data de geração: ${currentDate}\\par`;
  
  // RTF footer
  rtf += '}';
  
  return rtf;
};

const getReportTypeName = (type: string): string => {
  const typeNames: Record<string, string> = {
    'individual_session': 'Sessão Individual',
    'group_session': 'Sessão em Grupo',
    'initial_evaluation': 'Avaliação Inicial',
    'progress_report': 'Relatório de Progresso',
    'monthly_evolution': 'Evolução Mensal',
    'semester_evolution': 'Evolução Semestral',
    'daily_evolution': 'Evolução Diária',
    'session_summary': 'Resumo de Sessão',
    'assessment_report': 'Relatório de Avaliação',
    'family_report': 'Relatório Familiar',
    'team_report': 'Relatório de Equipe',
    'technical_report': 'Relatório Técnico',
    'therapeutic_discharge': 'Alta Terapêutica',
    'administrative_discharge': 'Alta Administrativa',
    'discharge_summary': 'Resumo de Alta',
    'tea_scale': 'Escala TEA',
    'ai_key_points': 'Pontos-Chave com IA'
  };
  
  return typeNames[type] || 'Relatório';
};

const generateRTFContentSections = (content: Record<string, any>): string => {
  let rtfSections = '';
  
  // Mapear campos para seções organizadas
  const sectionMapping: Record<string, string> = {
    'objectives': 'Objetivos',
    'activities': 'Atividades Realizadas',
    'observations': 'Observações',
    'progress': 'Progresso',
    'evolution': 'Evolução',
    'recommendations': 'Recomendações',
    'interventions': 'Intervenções',
    'behavior': 'Comportamento',
    'participation': 'Participação',
    'musical_preferences': 'Preferências Musicais',
    'challenges': 'Desafios',
    'achievements': 'Conquistas',
    'next_steps': 'Próximos Passos',
    'family_involvement': 'Envolvimento Familiar',
    'assessment': 'Avaliação',
    'conclusion': 'Conclusão',
    'notes': 'Anotações Adicionais'
  };

  // Gerar seções baseadas no conteúdo
  for (const [key, value] of Object.entries(content)) {
    if (value && typeof value === 'string' && value.trim() !== '') {
      const sectionTitle = sectionMapping[key] || key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
      
      rtfSections += `\\b ${sectionTitle}\\b0\\par`;
      rtfSections += `${value.replace(/\n/g, '\\par')}\\par\\par`;
    }
  }

  // Se não houver conteúdo específico, mostrar uma mensagem padrão
  if (rtfSections === '') {
    rtfSections = '\\b Conteúdo do Relatório\\b0\\par';
    rtfSections += 'Este relatório foi gerado automaticamente. O conteúdo detalhado pode ser adicionado através da edição deste documento.\\par\\par';
  }

  return rtfSections;
};
