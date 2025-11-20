import html2pdf from "html2pdf.js";

export const generateInterventionPDF = async (
  activities: any[],
  patientName: string,
  userName: string,
  userEmail: string
) => {
  try {
    const element = document.createElement('div');

    const activitiesHTML = activities.map((activity, index) => `
      <div style="margin-bottom: 24px; page-break-inside: avoid;">
        <div style="background: linear-gradient(to right, #2563EB, #1E40AF); color: white; padding: 12px 16px; border-radius: 8px 8px 0 0; font-weight: bold; font-size: 16px;">
          Atividade ${index + 1}: ${activity.disorder}
        </div>
        <div style="border: 2px solid #E5E7EB; border-top: none; padding: 16px; border-radius: 0 0 8px 8px;">
          <div style="margin-bottom: 12px;">
            <strong style="color: #1F2937;">Transtorno:</strong> <span style="color: #4B5563;">${activity.disorder}</span> | 
            <strong style="color: #1F2937;">Demanda:</strong> <span style="color: #4B5563;">${activity.demand}</span> | 
            <strong style="color: #1F2937;">Especialidade:</strong> <span style="color: #4B5563;">${activity.specialty}</span>
          </div>
          <div style="margin-bottom: 12px;">
            <strong style="color: #1F2937; display: block; margin-bottom: 4px;">Objetivo Terapêutico Geral:</strong>
            <p style="color: #374151; margin: 0; line-height: 1.6;">${activity.generalObjective}</p>
          </div>
          <div style="margin-bottom: 12px;">
            <strong style="color: #1F2937; display: block; margin-bottom: 4px;">Objetivo Específico:</strong>
            <p style="color: #374151; margin: 0; line-height: 1.6;">${activity.specificObjective}</p>
          </div>
          <div style="margin-bottom: 12px;">
            <strong style="color: #1F2937; display: block; margin-bottom: 4px;">Descrição da Atividade:</strong>
            <p style="color: #374151; margin: 0; line-height: 1.6;">${activity.activityDescription}</p>
          </div>
          <div style="margin-bottom: 12px;">
            <strong style="color: #1F2937; display: block; margin-bottom: 4px;">Materiais Necessários:</strong>
            <ul style="margin: 4px 0; padding-left: 24px; color: #374151;">
              ${activity.materials.map((material: string) => `<li style="margin: 2px 0;">${material}</li>`).join('')}
            </ul>
          </div>
          <div style="margin-bottom: 12px;">
            <strong style="color: #1F2937; display: block; margin-bottom: 4px;">Tempo Estimado:</strong>
            <p style="color: #374151; margin: 0;">${activity.estimatedTime}</p>
          </div>
          <div style="margin-bottom: 12px;">
            <strong style="color: #1F2937; display: block; margin-bottom: 4px;">Critérios de Avaliação:</strong>
            <ul style="margin: 4px 0; padding-left: 24px; color: #374151;">
              ${activity.evaluationCriteria.map((criteria: string) => `<li style="margin: 2px 0;">${criteria}</li>`).join('')}
            </ul>
          </div>
          <div>
            <strong style="color: #1F2937;">Nível de Complexidade:</strong> 
            <span style="background: #E5E7EB; padding: 4px 8px; border-radius: 4px; color: #1F2937; font-weight: 600;">
              ${activity.complexity}
            </span>
          </div>
        </div>
      </div>
    `).join('');

    element.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 32px; border-bottom: 3px solid #2563EB; padding-bottom: 24px;">
          <h1 style="color: #1E40AF; margin: 0 0 8px 0; font-size: 28px;">
            Plano de Intervenção Individual
          </h1>
          <p style="color: #6B7280; margin: 0; font-size: 14px;">
            Musicoterapia - Atividades Terapêuticas
          </p>
        </div>
        
        <div style="background: #F3F4F6; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <strong style="color: #1F2937; display: block; margin-bottom: 4px;">Paciente:</strong>
              <p style="color: #4B5563; margin: 0;">${patientName}</p>
            </div>
            <div>
              <strong style="color: #1F2937; display: block; margin-bottom: 4px;">Profissional:</strong>
              <p style="color: #4B5563; margin: 0;">${userName}</p>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 16px;">
          <h2 style="color: #1F2937; font-size: 20px; margin: 0 0 16px 0; padding-bottom: 8px; border-bottom: 2px solid #E5E7EB;">
            Atividades Propostas
          </h2>
        </div>

        ${activitiesHTML}

        <div style="margin-top: 40px; padding-top: 24px; border-top: 2px solid #E5E7EB; text-align: center; color: #6B7280; font-size: 12px;">
          <p style="margin: 0;">
            Documento gerado em ${new Date().toLocaleDateString('pt-BR', { 
              day: '2-digit', 
              month: 'long', 
              year: 'numeric' 
            })}
          </p>
          <p style="margin: 4px 0 0 0;">
            ${userEmail}
          </p>
        </div>
      </div>
    `;

    const opt = {
      margin: 10,
      filename: `plano-intervencao-${patientName.replace(/\s+/g, '-').toLowerCase()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        backgroundColor: '#ffffff',
      },
    };

    await html2pdf().from(element).set(opt).save();
    return { success: true };
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    return { success: false, error };
  }
};

export const getPDFOptions = (filename: string) => ({
  margin: 10,
  filename,
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: {
    scale: 2,
    useCORS: true,
    letterRendering: true,
    backgroundColor: '#ffffff',
  },
});
