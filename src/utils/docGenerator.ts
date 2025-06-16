
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
      filename: `Relatorio_${patientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.docx`,
      pageOrientation: 'portrait',
      margins: {
        top: 720,
        right: 720,
        bottom: 720,
        left: 720
      },
      ...options
    };

    // Gerar HTML formatado para conversão para DOC
    const htmlContent = generateHTMLForDoc(content, patientName, professionalData, evaluatorEmail, evaluatorName);

    // Usar html-docx-js para converter HTML em DOCX
    const { default: HTMLtoDOCX } = await import('html-docx-js/dist/html-docx');
    
    const docxBlob = HTMLtoDOCX(htmlContent, {
      orientation: defaultOptions.pageOrientation,
      margins: defaultOptions.margins
    });

    // Fazer download do arquivo
    saveAs(docxBlob, defaultOptions.filename);

    console.log("✅ Documento DOC gerado com sucesso!");

  } catch (error) {
    console.error("❌ Erro ao gerar documento DOC:", error);
    throw new Error("Falha ao gerar documento DOC");
  }
};

const generateHTMLForDoc = (
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
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Relatório - ${patientName}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .title {
          font-size: 24px;
          font-weight: bold;
          color: #2c3e50;
          margin-bottom: 10px;
        }
        .subtitle {
          font-size: 18px;
          color: #7f8c8d;
          margin-bottom: 5px;
        }
        .info-section {
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 20px;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .info-label {
          font-weight: bold;
          color: #2c3e50;
        }
        .content-section {
          margin-bottom: 25px;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          color: #2c3e50;
          border-bottom: 1px solid #bdc3c7;
          padding-bottom: 5px;
          margin-bottom: 15px;
        }
        .content-text {
          text-align: justify;
          margin-bottom: 15px;
        }
        .footer {
          border-top: 1px solid #bdc3c7;
          padding-top: 20px;
          margin-top: 40px;
          text-align: center;
          font-size: 12px;
          color: #7f8c8d;
        }
        .signature-section {
          margin-top: 40px;
          text-align: center;
        }
        .signature-line {
          border-top: 1px solid #333;
          width: 300px;
          margin: 40px auto 10px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">RELATÓRIO DE MUSICOTERAPIA</div>
        <div class="subtitle">${getReportTypeName(content.type)}</div>
      </div>

      <div class="info-section">
        <div class="info-row">
          <span class="info-label">Paciente:</span>
          <span>${patientName}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Data do Relatório:</span>
          <span>${reportDate}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Profissional:</span>
          <span>${evaluatorName || professionalData?.name || 'Não informado'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Email:</span>
          <span>${evaluatorEmail || professionalData?.email || 'Não informado'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Data de Geração:</span>
          <span>${currentDate}</span>
        </div>
      </div>

      ${generateContentSections(content.content)}

      <div class="signature-section">
        <div class="signature-line"></div>
        <div>
          <strong>${evaluatorName || professionalData?.name || 'Profissional Responsável'}</strong><br>
          ${professionalData?.specialty || 'Musicoterapeuta'}<br>
          ${professionalData?.license_number ? `CRM: ${professionalData.license_number}` : ''}
        </div>
      </div>

      <div class="footer">
        <p>Documento gerado automaticamente pelo Sistema de Musicoterapia</p>
        <p>Data de geração: ${currentDate}</p>
      </div>
    </body>
    </html>
  `;
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

const generateContentSections = (content: Record<string, any>): string => {
  let sectionsHtml = '';
  
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
      
      sectionsHtml += `
        <div class="content-section">
          <div class="section-title">${sectionTitle}</div>
          <div class="content-text">${value.replace(/\n/g, '<br>')}</div>
        </div>
      `;
    }
  }

  // Se não houver conteúdo específico, mostrar uma mensagem padrão
  if (sectionsHtml === '') {
    sectionsHtml = `
      <div class="content-section">
        <div class="section-title">Conteúdo do Relatório</div>
        <div class="content-text">
          Este relatório foi gerado automaticamente. 
          O conteúdo detalhado pode ser adicionado através da edição deste documento.
        </div>
      </div>
    `;
  }

  return sectionsHtml;
};
