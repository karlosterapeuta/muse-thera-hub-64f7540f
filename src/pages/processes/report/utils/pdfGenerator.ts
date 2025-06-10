
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import html2pdf from "html2pdf.js";
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
      initial_state: "🎯",
      activities: "🎵",
      responses: "📊",
      observations: "👁️",
      therapeutic_objectives: "🎯", 
      achievements: "🏆",
      challenges: "⚡",
      adjustments: "🔧",
      next_steps: "➡️",
      initial_evaluation: "📋",
      therapeutic_process: "🔄",
      evolution_areas: "📈",
      family_involvement: "👨‍👩‍👧‍👦",
      conclusions: "✅",
      recommendations: "💡",
      treatment_summary: "📝",
      achieved_goals: "🎖️",
      objectives: "🎯",
      patient_response: "💬",
      participants: "👥",
      theme: "📚",
      group_dynamics: "🤝",
      group_response: "🗣️"
    };
    return icons[sectionType as keyof typeof icons] || "📄";
  };

  const createSection = (title: string, content: string, iconType: string) => `
    <div style="margin-bottom: 32px; break-inside: avoid;">
      <div style="display: flex; align-items: center; margin-bottom: 20px; padding: 16px; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 12px; border-left: 6px solid #3b82f6; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <div style="font-size: 24px; margin-right: 12px;">${getIcon(iconType)}</div>
        <h2 style="color: #1e293b; font-size: 22px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">
          ${title}
        </h2>
      </div>
      <div style="background: #ffffff; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 2px 8px rgba(0,0,0,0.03); position: relative;">
        <div style="position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: linear-gradient(to bottom, #3b82f6, #1d4ed8); border-radius: 0 0 0 12px;"></div>
        <div style="margin-left: 12px; font-size: 15px; line-height: 1.7; color: #334155; white-space: pre-wrap;">
          ${String(content || '').split('\n').join('<br>')}
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
      <div style="margin-bottom: 32px;">
        <div style="display: flex; align-items: center; margin-bottom: 20px; padding: 16px; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 12px; border-left: 6px solid #3b82f6; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <div style="font-size: 24px; margin-right: 12px;">👥</div>
          <h2 style="color: #1e293b; font-size: 22px; font-weight: 700; margin: 0;">
            Dados da Sessão em Grupo
          </h2>
        </div>
        <div style="background: #ffffff; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
            <div>
              <div style="display: flex; align-items: center; margin-bottom: 12px;">
                <span style="font-size: 18px; margin-right: 8px;">👥</span>
                <strong style="color: #1e293b; font-size: 16px;">Participantes:</strong>
              </div>
              <div style="margin-left: 26px; padding: 12px; background: #f1f5f9; border-radius: 8px; border-left: 3px solid #3b82f6;">
                ${String(content.participants || '').split('\n').join('<br>')}
              </div>
            </div>
            <div>
              <div style="display: flex; align-items: center; margin-bottom: 12px;">
                <span style="font-size: 18px; margin-right: 8px;">📚</span>
                <strong style="color: #1e293b; font-size: 16px;">Tema:</strong>
              </div>
              <div style="margin-left: 26px; padding: 12px; background: #f1f5f9; border-radius: 8px; border-left: 3px solid #3b82f6;">
                ${String(content.theme || '').split('\n').join('<br>')}
              </div>
            </div>
          </div>
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
  const element = document.createElement('div');
  
  element.innerHTML = `
    <div style="font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; max-width: 800px; margin: 0 auto; background: #ffffff;">
      <!-- Watermark Background -->
      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 120px; color: rgba(59, 130, 246, 0.03); font-weight: bold; z-index: 0; pointer-events: none;">
        MuseTera
      </div>
      
      <!-- Header Section -->
      <div style="position: relative; z-index: 1; background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%); color: white; padding: 40px; margin-bottom: 0; border-radius: 0;">
        <div style="text-align: center; position: relative;">
          <!-- Decorative Musical Notes -->
          <div style="position: absolute; top: -10px; left: 20px; font-size: 24px; opacity: 0.3;">🎵</div>
          <div style="position: absolute; top: 10px; right: 30px; font-size: 20px; opacity: 0.4;">🎶</div>
          <div style="position: absolute; bottom: 0px; left: 50px; font-size: 18px; opacity: 0.3;">🎼</div>
          
          <!-- Professional Info -->
          <div style="margin-bottom: 32px; padding: 20px; background: rgba(255,255,255,0.1); border-radius: 12px; backdrop-filter: blur(10px);">
            <h2 style="font-size: 24px; margin-bottom: 12px; font-weight: 700; letter-spacing: -0.5px;">
              ${professionalData.name}
            </h2>
            <div style="display: flex; justify-content: center; gap: 30px; flex-wrap: wrap; font-size: 14px; opacity: 0.9;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 16px;">📞</span>
                ${professionalData.phone}
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 16px;">✉️</span>
                ${professionalData.email}
              </div>
            </div>
          </div>
          
          <!-- Report Title -->
          <div style="position: relative;">
            <h1 style="color: #ffffff; font-size: 36px; font-weight: 800; margin-bottom: 16px; text-shadow: 0 2px 4px rgba(0,0,0,0.3); letter-spacing: -1px;">
              ${getReportTypeTitle(formValues.type)}
            </h1>
            <div style="width: 80px; height: 4px; background: linear-gradient(90deg, #3b82f6, #1d4ed8); margin: 0 auto; border-radius: 2px;"></div>
          </div>
          
          <!-- Patient Info -->
          <div style="margin-top: 32px; padding: 24px; background: rgba(255,255,255,0.95); color: #1e293b; border-radius: 16px; box-shadow: 0 8px 25px rgba(0,0,0,0.15);">
            <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 8px;">
              <span style="font-size: 24px;">👤</span>
              <h2 style="color: #1e293b; font-size: 28px; margin: 0; font-weight: 700;">
                ${patientName}
              </h2>
            </div>
            <div style="display: flex; align-items: center; justify-content: center; gap: 8px; color: #64748b; font-size: 16px;">
              <span style="font-size: 18px;">📅</span>
              <span>${format(formValues.date, 'PPP', { locale: ptBR })}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Section -->
      <div style="position: relative; z-index: 1; padding: 40px; background: #ffffff;">
        <!-- Decorative Line -->
        <div style="height: 2px; background: linear-gradient(90deg, transparent, #3b82f6, transparent); margin-bottom: 40px;"></div>
        
        ${generateContentHTML(formValues.content, formValues.type)}
        
        <!-- Summary Card -->
        <div style="margin-top: 48px; padding: 32px; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 16px; border: 2px solid #e2e8f0; position: relative; overflow: hidden;">
          <div style="position: absolute; top: 0; right: 0; width: 100px; height: 100px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); opacity: 0.05; border-radius: 0 16px 0 100px;"></div>
          <div style="position: relative; z-index: 1;">
            <div style="display: flex; align-items: center; margin-bottom: 16px;">
              <span style="font-size: 28px; margin-right: 12px;">📋</span>
              <h3 style="color: #1e293b; font-size: 20px; font-weight: 700; margin: 0;">
                Resumo do Relatório
              </h3>
            </div>
            <div style="color: #475569; font-size: 15px; line-height: 1.6;">
              Este relatório foi gerado utilizando metodologia musicoterapêutica especializada, 
              seguindo as diretrizes profissionais da área. As informações apresentadas refletem 
              a evolução e desenvolvimento do paciente durante o período avaliado.
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Section -->
      <div style="position: relative; z-index: 1; background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); padding: 32px 40px; border-top: 3px solid #3b82f6;">
        <div style="text-align: center;">
          <!-- Generation Info -->
          <div style="margin-bottom: 20px; padding: 16px; background: rgba(255,255,255,0.8); border-radius: 12px; border: 1px solid #e2e8f0;">
            <div style="color: #64748b; font-size: 13px; margin-bottom: 6px;">
              📄 Documento gerado em ${format(new Date(), 'PPP', { locale: ptBR })} às ${new Date().toLocaleTimeString('pt-BR')}
            </div>
            <div style="color: #64748b; font-size: 13px;">
              🎵 Sistema MuseTera - Plataforma Especializada em Musicoterapia
            </div>
          </div>
          
          <!-- Professional Signature -->
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px; background: rgba(255,255,255,0.9); border-radius: 12px; border-left: 4px solid #3b82f6;">
            <div style="text-align: left;">
              <div style="color: #1e293b; font-size: 15px; font-weight: 600; margin-bottom: 4px;">
                👩‍⚕️ Musicoterapeuta Responsável:
              </div>
              <div style="color: #475569; font-size: 14px; font-weight: 500;">
                ${userName || 'N/A'}
              </div>
              <div style="color: #64748b; font-size: 13px;">
                ✉️ ${userEmail || 'N/A'}
              </div>
            </div>
            <div style="text-align: right; color: #64748b; font-size: 12px;">
              <div style="margin-bottom: 8px;">Assinatura Digital</div>
              <div style="width: 120px; height: 2px; background: linear-gradient(90deg, #3b82f6, #1d4ed8); margin-left: auto;"></div>
            </div>
          </div>
          
          <!-- QR Code Placeholder -->
          <div style="margin-top: 24px; text-align: center;">
            <div style="display: inline-block; padding: 12px; background: #ffffff; border: 2px solid #e2e8f0; border-radius: 8px;">
              <div style="width: 60px; height: 60px; background: linear-gradient(45deg, #f1f5f9, #e2e8f0); border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 24px;">
                📱
              </div>
              <div style="color: #64748b; font-size: 10px; margin-top: 4px;">
                Código de Validação
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const opt = {
    margin: [10, 10, 10, 10],
    filename: `${getReportTypeTitle(formValues.type)} - ${patientName}.pdf`,
    pagebreak: { 
      mode: ['avoid-all', 'css'],
      before: '.page-break'
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
    },
    html2canvas: {
      scale: 2.5,
      useCORS: true,
      letterRendering: true,
      backgroundColor: '#ffffff',
      logging: false,
      allowTaint: false,
      foreignObjectRendering: true,
    },
  };

  await html2pdf().from(element).set(opt).save();
}
