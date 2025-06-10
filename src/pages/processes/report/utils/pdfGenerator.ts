
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import html2pdf from "html2pdf.js";

type ReportFormData = {
  patient_id?: string;
  date?: Date;
  type?: string;
  content?: Record<string, any>;
};

type ProfessionalData = {
  name: string;
  phone: string;
  email: string;
};

const generateContentHTML = (content: Record<string, any>, type: string) => {
  if (type === "daily_evolution") {
    return `
      <div style="margin-bottom: 28px;">
        <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
          Estado Inicial
        </h2>
        <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
          ${String(content.initial_state || '').split('\n').join('<br>')}
        </div>
      </div>

      <div style="margin-bottom: 28px;">
        <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
          Atividades Realizadas
        </h2>
        <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
          ${String(content.activities || '').split('\n').join('<br>')}
        </div>
      </div>

      <div style="margin-bottom: 28px;">
        <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
          Respostas Observadas
        </h2>
        <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
          ${String(content.responses || '').split('\n').join('<br>')}
        </div>
      </div>

      <div style="margin-bottom: 28px;">
        <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
          Observações
        </h2>
        <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
          ${String(content.observations || '').split('\n').join('<br>')}
        </div>
      </div>
    `;
  } else if (type === "monthly_evolution") {
    return `
      <div style="margin-bottom: 28px;">
        <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
          Objetivos Terapêuticos
        </h2>
        <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
          ${String(content.therapeutic_objectives || '').split('\n').join('<br>')}
        </div>
      </div>

      <div style="margin-bottom: 28px;">
        <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
          Conquistas
        </h2>
        <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
          ${String(content.achievements || '').split('\n').join('<br>')}
        </div>
      </div>

      <div style="margin-bottom: 28px;">
        <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
          Desafios
        </h2>
        <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
          ${String(content.challenges || '').split('\n').join('<br>')}
        </div>
      </div>

      <div style="margin-bottom: 28px;">
        <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
          Ajustes Necessários
        </h2>
        <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
          ${String(content.adjustments || '').split('\n').join('<br>')}
        </div>
      </div>

      <div style="margin-bottom: 28px;">
        <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
          Próximos Passos
        </h2>
        <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
          ${String(content.next_steps || '').split('\n').join('<br>')}
        </div>
      </div>
    `;
  } else if (type === "semester_evolution") {
    return `
      <div style="margin-bottom: 28px;">
        <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
          Avaliação Inicial
        </h2>
        <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
          ${String(content.initial_evaluation || '').split('\n').join('<br>')}
        </div>
      </div>

      <div style="margin-bottom: 28px;">
        <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
          Processo Terapêutico
        </h2>
        <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
          ${String(content.therapeutic_process || '').split('\n').join('<br>')}
        </div>
      </div>

      <div style="margin-bottom: 28px;">
        <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
          Áreas de Evolução
        </h2>
        <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
          ${String(content.evolution_areas || '').split('\n').join('<br>')}
        </div>
      </div>

      <div style="margin-bottom: 28px;">
        <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
          Envolvimento Familiar
        </h2>
        <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
          ${String(content.family_involvement || '').split('\n').join('<br>')}
        </div>
      </div>

      <div style="margin-bottom: 28px;">
        <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
          Conclusões
        </h2>
        <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
          ${String(content.conclusions || '').split('\n').join('<br>')}
        </div>
      </div>

      <div style="margin-bottom: 28px;">
        <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
          Recomendações
        </h2>
        <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
          ${String(content.recommendations || '').split('\n').join('<br>')}
        </div>
      </div>
    `;
  } else if (type === "therapeutic_discharge") {
    return `
      <div style="margin-bottom: 28px;">
        <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
          Resumo do Tratamento
        </h2>
        <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
          ${String(content.treatment_summary || '').split('\n').join('<br>')}
        </div>
      </div>

      <div style="margin-bottom: 28px;">
        <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
          Objetivos Alcançados
        </h2>
        <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
          ${String(content.achieved_goals || '').split('\n').join('<br>')}
        </div>
      </div>

      <div style="margin-bottom: 28px;">
        <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
          Recomendações
        </h2>
        <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
          ${String(content.recommendations || '').split('\n').join('<br>')}
        </div>
      </div>
    `;
  } else if (type === "individual_session") {
    return `
      <div style="margin-bottom: 28px;">
        <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
          Objetivos
        </h2>
        <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
          ${String(content.objectives || '').split('\n').join('<br>')}
        </div>
      </div>

      <div style="margin-bottom: 28px;">
        <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
          Atividades Realizadas
        </h2>
        <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
          ${String(content.activities || '').split('\n').join('<br>')}
        </div>
      </div>

      <div style="margin-bottom: 28px;">
        <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
          Resposta do Paciente
        </h2>
        <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
          ${String(content.patient_response || '').split('\n').join('<br>')}
        </div>
      </div>

      <div style="margin-bottom: 28px;">
        <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
          Observações
        </h2>
        <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
          ${String(content.observations || '').split('\n').join('<br>')}
        </div>
      </div>

      <div style="margin-bottom: 28px;">
        <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
          Próximos Passos
        </h2>
        <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
          ${String(content.next_steps || '').split('\n').join('<br>')}
        </div>
      </div>
    `;
  } else if (type === "group_session") {
    return `
      <div style="margin-bottom: 28px;">
        <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
          Dados da Sessão em Grupo
        </h2>
        <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
          <strong>Participantes:</strong><br>
          ${String(content.participants || '').split('\n').join('<br>')}<br><br>
          <strong>Tema:</strong><br>
          ${String(content.theme || '').split('\n').join('<br>')}
        </div>
      </div>

      <div style="margin-bottom: 28px;">
        <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
          Desenvolvimento
        </h2>
        <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
          <strong>Dinâmica do Grupo:</strong><br>
          ${String(content.group_dynamics || '').split('\n').join('<br>')}<br><br>
          <strong>Atividades Realizadas:</strong><br>
          ${String(content.activities || '').split('\n').join('<br>')}
        </div>
      </div>

      <div style="margin-bottom: 28px;">
        <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
          Avaliação
        </h2>
        <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
          <strong>Resposta do Grupo:</strong><br>
          ${String(content.group_response || '').split('\n').join('<br>')}<br><br>
          <strong>Observações:</strong><br>
          ${String(content.observations || '').split('\n').join('<br>')}
        </div>
      </div>
    `;
  }
  return '';
};

export async function generatePDF(
  patientName: string, 
  formValues: ReportFormData, 
  professionalData: ProfessionalData,
  userEmail: string | null,
  userName: string | null
) {
  // Garantir que os dados obrigatórios estão presentes
  if (!formValues.type || !formValues.date) {
    throw new Error("Dados obrigatórios ausentes para gerar PDF");
  }

  const element = document.createElement('div');
  
  element.innerHTML = `
    <div style="padding: 40px; font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #E5E7EB;">
        <div style="margin-bottom: 24px;">
          <h2 style="font-size: 18px; color: #374151; margin-bottom: 8px;">
            ${professionalData.name}
          </h2>
          <p style="font-size: 14px; color: #6B7280; margin-bottom: 4px;">
            ${professionalData.phone}
          </p>
          <p style="font-size: 14px; color: #6B7280; margin-bottom: 16px;">
            ${professionalData.email}
          </p>
        </div>
        <h1 style="color: #2563EB; font-size: 28px; font-weight: bold; margin-bottom: 16px;">
          ${formValues.type === "monthly_evolution" 
            ? "Evolução Mensal" 
            : formValues.type === "daily_evolution" 
            ? "Evolução Diária" 
            : formValues.type === "therapeutic_discharge"
            ? "Alta Terapêutica"
            : formValues.type === "individual_session"
            ? "Relatório de Sessão Individual"
            : formValues.type === "group_session"
            ? "Relatório de Sessão em Grupo"
            : "Evolução Semestral"}
        </h1>
        <h2 style="color: #1F2937; font-size: 22px; margin-bottom: 8px;">
          Paciente: ${patientName}
        </h2>
        <p style="color: #6B7280; font-size: 16px;">
          Data do Relatório: ${format(formValues.date, 'PPP', { locale: ptBR })}
        </p>
      </div>

      <div style="margin-bottom: 32px;">
        ${generateContentHTML(formValues.content || {}, formValues.type)}
      </div>

      <div style="margin-top: 32px; padding-top: 24px; border-top: 2px solid #E5E7EB; text-align: center;">
        <p style="color: #6B7280; font-size: 13px; margin-bottom: 4px;">
          Documento gerado em ${format(new Date(), 'PPP', { locale: ptBR })} às ${new Date().toLocaleTimeString('pt-BR')}
        </p>
        <p style="color: #6B7280; font-size: 13px; margin-bottom: 4px;">
          Musetera - Sistema de Gestão para Musicoterapia
        </p>
        <p style="color: #6B7280; font-size: 13px; margin-bottom: 4px;">
          Musicoterapeuta: ${userName || 'N/A'}
        </p>
        <p style="color: #6B7280; font-size: 13px;">
          Email: ${userEmail || 'N/A'}
        </p>
      </div>
    </div>
  `;

  const opt = {
    margin: [20, 20, 20, 20],
    filename: `${formValues.type === "monthly_evolution" 
      ? "Evolução Mensal" 
      : formValues.type === "daily_evolution" 
      ? "Evolução Diária"
      : formValues.type === "therapeutic_discharge"
      ? "Alta Terapêutica"
      : formValues.type === "individual_session"
      ? "Relatório de Sessão Individual"
      : formValues.type === "group_session"
      ? "Relatório de Sessão em Grupo"
      : "Evolução Semestral"} - ${patientName}.pdf`,
    pagebreak: { mode: 'avoid-all' },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
    },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      backgroundColor: '#ffffff',
    },
  };

  await html2pdf().from(element).set(opt).save();
}
