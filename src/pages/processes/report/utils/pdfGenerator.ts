
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import html2pdf from "html2pdf.js";
import { savePDFToStorage } from "@/utils/pdfStorageUtils";
import type { Database } from "@/integrations/supabase/types";

type ReportType = Database["public"]["Enums"]["report_type"];

type ReportFormData = {
  patient_id: string;
  date: Date;
  type: ReportType;
  content: Record<string, any>;
};

type ProfessionalData = {
  name: string;
  phone: string;
  email: string;
};

const generateContentHTML = (content: Record<string, any>, type: ReportType) => {
  const getIcon = (sectionType: string) => {
    const icons = {
      initial_state: "•",
      activities: "♪",
      responses: "→",
      observations: "★",
      therapeutic_objectives: "•", 
      achievements: "✓",
      challenges: "!",
      adjustments: "↻",
      next_steps: "→",
      initial_evaluation: "□",
      therapeutic_process: "○",
      evolution_areas: "↗",
      family_involvement: "👨‍👩‍👧‍👦",
      conclusions: "✓",
      recommendations: "💡",
      treatment_summary: "📝",
      achieved_goals: "🎖",
      objectives: "•",
      patient_response: "💬",
      participants: "👥",
      theme: "📚",
      group_dynamics: "🤝",
      group_response: "🗣"
    };
    return icons[sectionType as keyof typeof icons] || "•";
  };

  const createSection = (title: string, content: string, iconType: string) => `
    <div style="margin-bottom: 25px; page-break-inside: avoid;">
      <div style="background-color: #f8f9fa; padding: 15px; margin-bottom: 15px; border-left: 4px solid #007bff; border-radius: 5px;">
        <h3 style="color: #2c3e50; font-size: 18px; font-weight: bold; margin: 0; display: flex; align-items: center;">
          <span style="margin-right: 10px;">${getIcon(iconType)}</span>
          ${title}
        </h3>
      </div>
      <div style="background-color: #ffffff; padding: 20px; border: 1px solid #dee2e6; border-radius: 5px; line-height: 1.6;">
        <div style="font-size: 14px; color: #495057;">
          ${String(content || '').replace(/\n/g, '<br>')}
        </div>
      </div>
    </div>
  `;

  if (type === "daily_evolution") {
    return `
      ${createSection("Estado Inicial", content.initial_state, "initial_state")}
      ${createSection("Atividades Realizadas", content.activities, "activities")}
      ${createSection("Respostas Observadas", content.responses, "responses")}
      ${createSection("Observações", content.observations, "observations")}
    `;
  } else if (type === "monthly_evolution") {
    return `
      ${createSection("Objetivos Terapêuticos", content.therapeutic_objectives, "therapeutic_objectives")}
      ${createSection("Conquistas", content.achievements, "achievements")}
      ${createSection("Desafios", content.challenges, "challenges")}
      ${createSection("Ajustes Necessários", content.adjustments, "adjustments")}
      ${createSection("Próximos Passos", content.next_steps, "next_steps")}
    `;
  } else if (type === "semester_evolution") {
    return `
      ${createSection("Avaliação Inicial", content.initial_evaluation, "initial_evaluation")}
      ${createSection("Processo Terapêutico", content.therapeutic_process, "therapeutic_process")}
      ${createSection("Áreas de Evolução", content.evolution_areas, "evolution_areas")}
      ${createSection("Envolvimento Familiar", content.family_involvement, "family_involvement")}
      ${createSection("Conclusões", content.conclusions, "conclusions")}
      ${createSection("Recomendações", content.recommendations, "recommendations")}
    `;
  } else if (type === "therapeutic_discharge") {
    return `
      ${createSection("Resumo do Tratamento", content.treatment_summary, "treatment_summary")}
      ${createSection("Objetivos Alcançados", content.achieved_goals, "achieved_goals")}
      ${createSection("Recomendações", content.recommendations, "recommendations")}
    `;
  } else if (type === "individual_session") {
    return `
      ${createSection("Objetivos", content.objectives, "objectives")}
      ${createSection("Atividades Realizadas", content.activities, "activities")}
      ${createSection("Resposta do Paciente", content.patient_response, "patient_response")}
      ${createSection("Observações", content.observations, "observations")}
      ${createSection("Próximos Passos", content.next_steps, "next_steps")}
    `;
  } else if (type === "group_session") {
    return `
      <div style="margin-bottom: 25px;">
        <div style="background-color: #f8f9fa; padding: 15px; margin-bottom: 15px; border-left: 4px solid #007bff; border-radius: 5px;">
          <h3 style="color: #2c3e50; font-size: 18px; font-weight: bold; margin: 0;">
            Dados da Sessão em Grupo
          </h3>
        </div>
        <div style="background-color: #ffffff; padding: 20px; border: 1px solid #dee2e6; border-radius: 5px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="width: 50%; vertical-align: top; padding-right: 15px;">
                <strong style="color: #2c3e50;">Participantes:</strong><br>
                <div style="margin-top: 8px; padding: 10px; background-color: #f8f9fa; border-radius: 3px;">
                  ${String(content.participants || '').replace(/\n/g, '<br>')}
                </div>
              </td>
              <td style="width: 50%; vertical-align: top; padding-left: 15px;">
                <strong style="color: #2c3e50;">Tema:</strong><br>
                <div style="margin-top: 8px; padding: 10px; background-color: #f8f9fa; border-radius: 3px;">
                  ${String(content.theme || '').replace(/\n/g, '<br>')}
                </div>
              </td>
            </tr>
          </table>
        </div>
      </div>

      ${createSection("Dinâmica do Grupo", content.group_dynamics, "group_dynamics")}
      ${createSection("Atividades Realizadas", content.activities, "activities")}
      ${createSection("Resposta do Grupo", content.group_response, "group_response")}
      ${createSection("Observações", content.observations, "observations")}
    `;
  }
  return '';
};

const getReportTypeTitle = (type: ReportType) => {
  const titles = {
    monthly_evolution: "Evolução Mensal",
    daily_evolution: "Evolução Diária", 
    therapeutic_discharge: "Alta Terapêutica",
    individual_session: "Relatório de Sessão Individual",
    group_session: "Relatório de Sessão em Grupo",
    semester_evolution: "Evolução Semestral"
  };
  return titles[type] || "Relatório Musicoterapêutico";
};

export async function generatePDF(
  patientName: string, 
  formValues: ReportFormData, 
  professionalData: ProfessionalData,
  userEmail: string | null,
  userName: string | null
) {
  try {
    console.log("Iniciando geração do PDF...");
    
    const element = document.createElement('div');
    
    // Formatação da data do relatório com destaque especial
    const reportDate = format(formValues.date, 'PPP', { locale: ptBR });
    const reportDateShort = format(formValues.date, "dd/MM/yyyy", { locale: ptBR });
    const currentDateTime = format(new Date(), 'PPP', { locale: ptBR });
    const currentTime = new Date().toLocaleTimeString('pt-BR');
    
    element.innerHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; background: #ffffff; color: #333333;">
        
        <!-- Header -->
        <div style="background-color: #2c3e50; color: white; padding: 30px; text-align: center; margin-bottom: 30px;">
          <div style="margin-bottom: 20px;">
            <h2 style="font-size: 22px; margin-bottom: 10px; font-weight: bold;">
              ${professionalData.name}
            </h2>
            <div style="font-size: 14px; opacity: 0.9;">
              <div style="margin-bottom: 5px;">📞 ${professionalData.phone}</div>
              <div>✉️ ${professionalData.email}</div>
            </div>
          </div>
          
          <h1 style="color: #ffffff; font-size: 28px; font-weight: bold; margin-bottom: 15px;">
            ${getReportTypeTitle(formValues.type)}
          </h1>
          <div style="height: 3px; background-color: #3498db; margin: 0 auto; width: 100px;"></div>
          
          <div style="margin-top: 25px; padding: 20px; background-color: rgba(255,255,255,0.1); border-radius: 8px;">
            <h2 style="color: #ffffff; font-size: 24px; margin: 0 0 15px 0; font-weight: bold;">
              ${patientName}
            </h2>
            
            <!-- Data do Relatório com Destaque Especial -->
            <div style="background-color: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px; margin: 15px 0; border: 2px solid rgba(255,255,255,0.3);">
              <div style="color: #ffffff; font-size: 14px; font-weight: bold; margin-bottom: 8px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 18px; margin-right: 10px;">📅</span>
                <span>DATA DO RELATÓRIO</span>
              </div>
              <div style="color: #ecf0f1; font-size: 20px; font-weight: bold; text-align: center;">
                ${reportDate}
              </div>
            </div>
          </div>
        </div>

        <!-- Seção de Informações do Documento com Data Destacada -->
        <div style="padding: 0 30px; margin-bottom: 30px;">
          <div style="background-color: #f8f9fa; padding: 25px; border: 2px solid #007bff; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="color: #2c3e50; font-size: 20px; font-weight: bold; margin-bottom: 20px; display: flex; align-items: center;">
              <span style="margin-right: 10px; font-size: 24px;">📋</span>
              Informações do Documento
            </h3>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
              <div>
                <div style="color: #6c757d; font-size: 12px; font-weight: bold; text-transform: uppercase; margin-bottom: 5px;">
                  Paciente
                </div>
                <div style="color: #2c3e50; font-size: 16px; font-weight: 600;">
                  ${patientName}
                </div>
              </div>
              <div>
                <div style="color: #6c757d; font-size: 12px; font-weight: bold; text-transform: uppercase; margin-bottom: 5px;">
                  Tipo de Relatório
                </div>
                <div style="color: #2c3e50; font-size: 16px; font-weight: 600;">
                  ${getReportTypeTitle(formValues.type)}
                </div>
              </div>
            </div>
            
            <!-- Data do Relatório em Destaque -->
            <div style="background-color: #007bff; color: white; padding: 15px; border-radius: 6px; margin: 20px 0; text-align: center;">
              <div style="font-size: 14px; font-weight: bold; margin-bottom: 5px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 18px; margin-right: 8px;">📅</span>
                <span>DATA DO RELATÓRIO</span>
              </div>
              <div style="font-size: 18px; font-weight: bold;">
                ${reportDate}
              </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div>
                <div style="color: #6c757d; font-size: 12px; font-weight: bold; text-transform: uppercase; margin-bottom: 5px;">
                  Profissional Responsável
                </div>
                <div style="color: #2c3e50; font-size: 16px; font-weight: 600;">
                  ${userName || 'N/A'}
                </div>
                <div style="color: #6c757d; font-size: 14px;">
                  ${userEmail || 'N/A'}
                </div>
              </div>
              <div>
                <div style="color: #6c757d; font-size: 12px; font-weight: bold; text-transform: uppercase; margin-bottom: 5px;">
                  Data de Geração
                </div>
                <div style="color: #2c3e50; font-size: 16px; font-weight: 600;">
                  ${currentDateTime}
                </div>
                <div style="color: #6c757d; font-size: 14px;">
                  ${currentTime}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div style="padding: 0 30px;">
          <div style="height: 2px; background-color: #3498db; margin-bottom: 30px;"></div>
          
          ${generateContentHTML(formValues.content, formValues.type)}
          
          <!-- Summary -->
          <div style="margin-top: 40px; padding: 25px; background-color: #f8f9fa; border: 2px solid #3498db; border-radius: 8px;">
            <h3 style="color: #2c3e50; font-size: 18px; font-weight: bold; margin-bottom: 15px; display: flex; align-items: center;">
              <span style="margin-right: 10px;">📋</span>
              Resumo do Relatório
            </h3>
            <div style="color: #6c757d; font-size: 14px; line-height: 1.6;">
              Este relatório foi gerado utilizando metodologia musicoterapêutica especializada, 
              seguindo as diretrizes profissionais da área. As informações apresentadas refletem 
              a evolução e desenvolvimento do paciente durante o período avaliado.
            </div>
            
            <!-- Data do Relatório no Resumo -->
            <div style="margin-top: 15px; padding: 12px; background-color: #e3f2fd; border-left: 4px solid #2196f3; border-radius: 4px;">
              <div style="font-size: 13px; color: #1976d2; font-weight: bold;">
                📅 Data do Relatório: ${reportDate}
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8f9fa; padding: 25px 30px; margin-top: 30px; border-top: 3px solid #3498db;">
          <div style="text-align: center;">
            <!-- Data do Relatório no Rodapé -->
            <div style="background-color: #007bff; color: white; padding: 12px; border-radius: 6px; margin-bottom: 20px;">
              <div style="font-size: 14px; font-weight: bold; display: flex; align-items: center; justify-content: center;">
                <span style="margin-right: 8px;">📅</span>
                <span>RELATÓRIO DE ${reportDateShort}</span>
              </div>
            </div>
            
            <div style="margin-bottom: 15px; padding: 15px; background-color: #ffffff; border-radius: 8px; border: 1px solid #dee2e6;">
              <div style="color: #6c757d; font-size: 12px; margin-bottom: 5px;">
                📄 Documento gerado em ${currentDateTime} às ${currentTime}
              </div>
              <div style="color: #6c757d; font-size: 12px;">
                🎵 Sistema MuseTera - Plataforma Especializada em Musicoterapia
              </div>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; border: 1px solid #dee2e6;">
              <tr>
                <td style="padding: 15px; text-align: left; border-right: 1px solid #dee2e6;">
                  <div style="color: #2c3e50; font-size: 14px; font-weight: bold; margin-bottom: 5px;">
                    Musicoterapeuta Responsável:
                  </div>
                  <div style="color: #6c757d; font-size: 13px; font-weight: 500;">
                    ${userName || 'N/A'}
                  </div>
                  <div style="color: #6c757d; font-size: 12px;">
                    ✉️ ${userEmail || 'N/A'}
                  </div>
                </td>
                <td style="padding: 15px; text-align: right;">
                  <div style="color: #6c757d; font-size: 11px; margin-bottom: 8px;">Assinatura Digital</div>
                  <div style="width: 120px; height: 2px; background-color: #3498db; margin-left: auto;"></div>
                  <!-- Data do Relatório na Assinatura -->
                  <div style="color: #6c757d; font-size: 10px; margin-top: 5px;">
                    Relatório de ${reportDateShort}
                  </div>
                </td>
              </tr>
            </table>
            
            <div style="margin-top: 20px; text-align: center;">
              <div style="display: inline-block; padding: 10px; background-color: #ffffff; border: 2px solid #dee2e6; border-radius: 6px;">
                <div style="width: 50px; height: 50px; background-color: #f8f9fa; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 20px; margin: 0 auto;">
                  📱
                </div>
                <div style="color: #6c757d; font-size: 10px; margin-top: 5px;">
                  Código de Validação
                </div>
              </div>
            </div>
            
            <!-- Data Final no Rodapé -->
            <div style="margin-top: 15px; padding: 10px; background-color: #e8f5e8; border: 1px solid #4caf50; border-radius: 6px;">
              <div style="color: #2e7d32; font-size: 12px; font-weight: bold; text-align: center;">
                📅 Data do Relatório: ${reportDate} | Gerado em: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const opt = {
      margin: [15, 15, 15, 15],
      filename: `${getReportTypeTitle(formValues.type)} - ${patientName} - ${reportDateShort}.pdf`,
      pagebreak: { 
        mode: ['avoid-all', 'css'],
        before: '.page-break'
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
        putOnlyUsedFonts: true,
        floatPrecision: 16
      },
      html2canvas: {
        scale: 1.5,
        useCORS: true,
        letterRendering: true,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: false,
        removeContainer: true,
        imageTimeout: 15000
      },
    };

    console.log("Configurações do PDF:", opt);
    
    const pdfInstance = html2pdf().set(opt).from(element);
    await pdfInstance.save();
    try { const blob = await pdfInstance.outputPdf('blob'); await savePDFToStorage(blob, opt.filename, "report"); } catch(e) { console.warn("PDF não salvo no storage:", e); }
    
    console.log("PDF gerado com sucesso!");
    
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    throw new Error(`Erro na geração do PDF: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
}
