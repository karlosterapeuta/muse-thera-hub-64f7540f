import html2pdf from "html2pdf.js";

interface AnamnesisData {
  [key: string]: any;
  patient_name?: string;
  created_at: string;
  // Seção 1: Identificação e Encaminhamento
  referral_professional?: string;
  main_clinical_demand?: string;
  diagnosis_details?: string;
  cid_code?: string;
  mother_name?: string;
  father_name?: string;
  diagnosis_date?: string;
  support_level?: string;
  // Seção 2: Histórico Clínico
  clinical_details?: string;
  // Seção 3: Medicação
  current_medication?: string;
  medication_schedule?: string;
  medication_effects?: string;
  // Seção 4: Terapias
  therapy_frequency?: string;
  therapy_observations?: string;
  // Seção 5: Perfil Musical
  instruments_played?: string;
  music_practice_time?: string;
  patient_musical_history?: string;
  // Seção 6: ISO
  pregnancy_sound_experiences?: string;
  mother_movements_songs?: string;
  childhood_sound_environment?: string;
  parents_sound_reactions?: string;
  typical_house_sounds?: string;
  night_body_sounds?: string;
  family_musical_history?: string;
  // Seção 7: Comportamento Musical
  musical_behavior_description?: string;
  // Seção 8: Processamento Auditivo
  discomfort_sounds?: string;
  calming_sounds?: string;
  // Seção 10: Aspectos Comportamentais
  regulation_strategies?: string;
  calming_strategies?: string;
  // Seção 11: Contexto Social
  school_enrollment?: string;
  school_adaptation?: string;
  extracurricular_activities?: string;
  family_support_network?: string;
  // Seção 12: Objetivos
  therapeutic_goals?: string;
  treatment_approach?: string;
}

interface ProfessionalData {
  name?: string;
  email: string;
  specialty?: string;
  phone?: string;
  license_number?: string;
  register?: string;
  association?: string;
  avatar_url?: string;
  digital_stamp_url?: string;
  digital_signature_url?: string;
}

export const generateProfessionalAnamnesePDF = async (
  anamnesisData: AnamnesisData,
  professional: ProfessionalData,
  patientName: string,
  professionalPhotoBase64?: string | null,
  digitalStampBase64?: string | null,
  digitalSignatureBase64?: string | null
): Promise<boolean> => {
  try {
    console.log("🎯 Iniciando geração do PDF profissional da Anamnese...");
    
    const element = document.createElement('div');
    const generateProfessionalHTML = () => {
      // Função para valor de campo
      const escapeHtml = (value: unknown): string =>
        String(value ?? "").replace(/[&<>"']/g, char =>
          ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char] || char)
        );

      const getFieldValue = (value: any): string => {
        if (value === null || value === undefined || (typeof value === "string" && !value.trim())) {
          return '<span class="not-reported">Não informado</span>';
        }
        if (typeof value === "boolean") return value ? "Sim" : "Não";
        return escapeHtml(value).replace(/\r?\n/g, "<br />");
      };

      // Escapar conteúdo textual relatado antes de inserir no HTML do PDF.
      const escapeClinicalText = (value: unknown): string =>
        escapeHtml(value).replace(/\r?\n/g, "<br />");

      const renderTeaFunctionalProfile = (): string => {
        const profile = anamnesisData.tea_functional_profile;
        if (!profile || typeof profile !== "object" || Array.isArray(profile)) return "";
        const labels: Array<[string, string]> = [
          ["communication", "Comunicação funcional"],
          ["comprehension", "Compreensão e apoios"],
          ["musical_interaction", "Participação e interação musical"],
          ["musical_strengths", "Interesses e habilidades musicais"],
          ["sensory_triggers", "Perfil sensorial e adaptações"],
          ["emotional_regulation", "Regulação e previsibilidade"],
          ["daily_participation", "Autonomia e participação"],
          ["safety", "Cuidados de segurança"],
          ["family_goals", "Prioridades do paciente e responsáveis"],
          ["communication_support", "Apoios de comunicação"],
          ["sensory_accommodations", "Adaptações sensoriais"],
          ["recovery_plan", "Estratégias durante sobrecarga"],
          ["safety_actions", "Cuidados práticos durante a sessão"],
        ];
        const filled = labels.filter(([key]) =>
          typeof profile[key] === "string" && profile[key].trim().length > 0
        );
        if (!filled.length) return "";
        return `
          <div style="margin:20px 0;page-break-inside:avoid;">
            <h2 style="color:#115e59;font-size:16px;border-bottom:2px solid #0f766e;padding-bottom:6px;">
              PERFIL FUNCIONAL TEA — CONTEXTO MUSICOTERAPÊUTICO
            </h2>
            <p style="font-size:10px;color:#64748b;margin:8px 0;">
              Informações relatadas no processo de anamnese; não constituem diagnóstico.
            </p>
            ${filled.map(([key, label]) => `
              <div style="margin:10px 0;padding:10px 12px;background:#f0fdfa;border-left:3px solid #0f766e;border-radius:5px;page-break-inside:avoid;">
                <strong style="color:#134e4a;font-size:11px;">${escapeClinicalText(label)}</strong>
                <div style="color:#1f2937;font-size:11px;line-height:1.55;margin-top:4px;white-space:normal;">
                  ${escapeClinicalText(profile[key])}
                </div>
              </div>`).join("")}
          </div>`;
      };

      const formatClinicalDate = (value: unknown): string => {
        if (!value) return "Não informado";
        const str = String(value);
        const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(str);
        if (match) return `${match[3]}/${match[2]}/${match[1]}`;
        return "Não informado";
      };
      const identityItem = (label: string, value: unknown): string =>
        `<div style="min-width:0;overflow-wrap:anywhere;">
           <div style="font-weight:800;font-size:9px;letter-spacing:.4px;color:#475569;margin-bottom:3px;">${escapeHtml(label)}</div>
           <div style="font-weight:600;font-size:11px;color:#172b4d;line-height:1.45;">${escapeHtml(value || 'Não informado')}</div>
         </div>`;

      // Campo preenchido mantém destaque; campo vazio permanece identificável,
      // sem criar uma grande caixa cinza para cada resposta não informada.
      const renderTextField = (label: string, key: string) => {
        const value = anamnesisData[key];
        const missing = value === null || value === undefined ||
          (typeof value === "string" && !value.trim());
        return `
          <div class="clinical-field ${missing ? "clinical-field--empty" : "clinical-field--filled"}">
            <div class="clinical-label">${escapeHtml(label)}</div>
            <div class="clinical-value">${getFieldValue(value)}</div>
          </div>`;
      };

      // Marcação não preenchida é diferente de uma resposta clínica negativa.
      const renderCheckboxes = (checkboxes: { id: string; label: string }[]) => {
        const checked = checkboxes.filter(item =>
          anamnesisData[item.id] === true ||
          anamnesisData[item.id] === 1 ||
          anamnesisData[item.id] === "true"
        );
        if (!checked.length) {
          return '<div class="clinical-checkbox-empty">Não informado — nenhuma opção registrada</div>';
        }
        return `<div class="clinical-tags">${checked.map(item =>
          `<span class="clinical-tag"><span aria-hidden="true">✓ </span>${escapeHtml(item.label)}</span>`
        ).join("")}</div>`;
      };

      // Mapeamento de cores por categoria temática
      const sectionColors: Record<number, { gradient: string; iconBg: string; borderColor: string }> = {
        1:  { gradient: 'linear-gradient(135deg, #0d9488, #14b8a6)', iconBg: 'rgba(255,255,255,0.25)', borderColor: '#14b8a6' },  // [ID] TEAL - Identificação
        2:  { gradient: 'linear-gradient(135deg, #1e40af, #3b82f6)', iconBg: 'rgba(255,255,255,0.25)', borderColor: '#3b82f6' },  // [HC] AZUL - Clínico
        3:  { gradient: 'linear-gradient(135deg, #1e40af, #3b82f6)', iconBg: 'rgba(255,255,255,0.25)', borderColor: '#3b82f6' },  // [MED] AZUL - Clínico
        4:  { gradient: 'linear-gradient(135deg, #1e40af, #3b82f6)', iconBg: 'rgba(255,255,255,0.25)', borderColor: '#3b82f6' },  // [TER] AZUL - Clínico
        5:  { gradient: 'linear-gradient(135deg, #a21caf, #d946ef)', iconBg: 'rgba(255,255,255,0.25)', borderColor: '#d946ef' },  // ♪ ROSA - Musical
        6:  { gradient: 'linear-gradient(135deg, #a21caf, #d946ef)', iconBg: 'rgba(255,255,255,0.25)', borderColor: '#d946ef' },  // [ISO] ROSA - Musical
        7:  { gradient: 'linear-gradient(135deg, #a21caf, #d946ef)', iconBg: 'rgba(255,255,255,0.25)', borderColor: '#d946ef' },  // ♫ ROSA - Musical
        8:  { gradient: 'linear-gradient(135deg, #c2410c, #f97316)', iconBg: 'rgba(255,255,255,0.25)', borderColor: '#f97316' },  // [AUD] LARANJA - Sensorial
        9:  { gradient: 'linear-gradient(135deg, #c2410c, #f97316)', iconBg: 'rgba(255,255,255,0.25)', borderColor: '#f97316' },  // [NPM] LARANJA - Sensorial
        10: { gradient: 'linear-gradient(135deg, #15803d, #22c55e)', iconBg: 'rgba(255,255,255,0.25)', borderColor: '#22c55e' },  // [EMO] VERDE - Emocional
        11: { gradient: 'linear-gradient(135deg, #0d9488, #14b8a6)', iconBg: 'rgba(255,255,255,0.25)', borderColor: '#14b8a6' },  // [ESC] TEAL - Identificação
        12: { gradient: 'linear-gradient(135deg, #0d9488, #14b8a6)', iconBg: 'rgba(255,255,255,0.25)', borderColor: '#14b8a6' },  // [OBJ] TEAL - Identificação
      };

      // Ícones SVG inline para cada seção
      const sectionIcons: Record<number, string> = {
        1: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>`,
        2: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>`,
        3: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/>
              <path d="m8.5 8.5 7 7"/>
            </svg>`,
        4: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
            </svg>`,
        5: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 18V5l12-2v13"/>
              <circle cx="6" cy="18" r="3"/>
              <circle cx="18" cy="16" r="3"/>
            </svg>`,
        6: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 10v3M6 6v11M10 3v18M14 8v7M18 5v13M22 10v3"/>
            </svg>`,
        7: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="8" cy="18" r="4"/>
              <path d="M12 18V2l7 4"/>
            </svg>`,
        8: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6.5 10-6.5 15.5 0-5.5-6.5-9.5-6.5-15.5Z"/>
              <path d="M15 8.5a2.5 2.5 0 0 0-5 0"/>
            </svg>`,
        9: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
              <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
              <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>
            </svg>`,
        10: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
               <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
             </svg>`,
        11: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
               <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
               <path d="M6 12v5c3 3 9 3 12 0v-5"/>
             </svg>`,
        12: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
               <circle cx="12" cy="12" r="10"/>
               <circle cx="12" cy="12" r="6"/>
               <circle cx="12" cy="12" r="2"/>
             </svg>`
      };

      // Lista de seções com metadados para índice
      const sectionsList = [
        { number: 1,  title: 'Identificação e Encaminhamento', category: 'identificacao' },
        { number: 2,  title: 'Histórico Clínico e Médico', category: 'clinico' },
        { number: 3,  title: 'Medicação em Uso', category: 'clinico' },
        { number: 4,  title: 'Terapias e Acompanhamentos', category: 'clinico' },
        { number: 5,  title: 'Perfil Musical do Paciente', category: 'musical' },
        { number: 6,  title: 'Identidade Sonora (ISO)', category: 'musical' },
        { number: 7,  title: 'Comportamento Musical Observado', category: 'musical' },
        { number: 8,  title: 'Processamento Auditivo e Sensorial', category: 'sensorial' },
        { number: 9,  title: 'Desenvolvimento Neuropsicomotor', category: 'sensorial' },
        { number: 10, title: 'Aspectos Comportamentais e Emocionais', category: 'emocional' },
        { number: 11, title: 'Contexto Social e Escolar', category: 'identificacao' },
        { number: 12, title: 'Objetivos Terapêuticos', category: 'identificacao' }
      ];

      // Cores das categorias para a legenda
      const categoryColors: Record<string, { name: string; color: string }> = {
        identificacao: { name: 'Identificação', color: '#14b8a6' },
        clinico: { name: 'Clínico', color: '#3b82f6' },
        musical: { name: 'Musical', color: '#d946ef' },
        sensorial: { name: 'Sensorial', color: '#f97316' },
        emocional: { name: 'Emocional', color: '#22c55e' }
      };

      // Gera o índice navegável
      const generateTableOfContents = () => {
        const leftColumn = sectionsList.slice(0, 6);
        const rightColumn = sectionsList.slice(6, 12);

        const renderSectionItem = (section: typeof sectionsList[0]) => {
          const colors = sectionColors[section.number];
          return `
            <div style="display: flex; align-items: center; gap: 8px; padding: 6px 8px; background: #fafafa; border-radius: 6px; border-left: 3px solid ${colors.borderColor};">
              <div style="background: ${colors.gradient}; padding: 4px; border-radius: 4px; display: flex; align-items: center; justify-content: center; min-width: 20px; height: 20px;">
                <span style="font-weight: 700; color: white; font-size: 11px;">${section.number}</span>
              </div>
              <span style="font-size: 10px; color: #374151; font-weight: 500; line-height: 1.2;">${section.number}. ${section.title}</span>
            </div>
          `;
        };

        const legendItems = Object.entries(categoryColors).map(([_, cat]) => `
          <div style="display: flex; align-items: center; gap: 4px;">
            <div style="width: 12px; height: 12px; background: ${cat.color}; border-radius: 2px;"></div>
            <span style="font-size: 9px; color: #6b7280;">${cat.name}</span>
          </div>
        `).join('');

        return `
          <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; margin: 0 16px 24px 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <!-- Header do índice -->
            <div style="background: linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #06b6d4 100%); color: white; padding: 10px 16px; text-align: center;">
              <span style="font-weight: 700; font-size: 12px; letter-spacing: 1px;">SUMÁRIO DA ANAMNESE</span>
            </div>
            
            <!-- Grid 2x6 -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 12px;">
              <div style="display: flex; flex-direction: column; gap: 6px;">
                ${leftColumn.map(renderSectionItem).join('')}
              </div>
              <div style="display: flex; flex-direction: column; gap: 6px;">
                ${rightColumn.map(renderSectionItem).join('')}
              </div>
            </div>
            
            <!-- Legenda -->
            <div style="background: #f9fafb; border-top: 1px solid #e5e7eb; padding: 8px 12px;">
              <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 6px;">
                <span style="font-size: 9px; font-weight: 600; color: #4b5563; text-transform: uppercase; letter-spacing: 0.5px;">Legenda de Cores:</span>
              </div>
              <div style="display: flex; flex-wrap: wrap; gap: 12px;">
                ${legendItems}
              </div>
            </div>
          </div>
        `;
      };

      // Cabeçalho da seção com cores diferenciadas e números estilizados
      const sectionHeader = (number: number, title: string) => {
        const colors = sectionColors[number] || sectionColors[1];
        return `
          <div class="clinical-section-header" style="background: #125b61; color: white; padding: 8px 12px; page-break-after: avoid; break-after: avoid; border-radius: 7px 7px 0 0; display: flex; align-items: center; gap: 12px;">
            <div style="background: ${colors.iconBg}; padding: 5px; border-radius: 6px; display: flex; align-items: center; justify-content: center; min-width: 28px; min-height: 28px;">
              <span style="font-weight: 700; color: white; font-size: 16px;">${number}</span>
            </div>
            <span style="font-weight: 700; font-size: 13px; letter-spacing: 0.5px;">${number}. ${title}</span>
          </div>
        `;
      };

      // Container da seção com borda lateral colorida
      const sectionContainer = (sectionNumber: number, content: string) => {
        const colors = sectionColors[sectionNumber] || sectionColors[1];
        return `
          <div style="background-color: #ffffff; border: 1px solid ${colors.borderColor}; border-left: 3px solid #0f766e; border-top: none; border-radius: 0 0 10px 10px; padding: 11px 13px;">
            ${content}
          </div>
        `;
      };

      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.4; background: #ffffff; }
            .container { max-width: 780px; margin: 0 auto; background-color: #ffffff; color:#172b38; }
            .document-header { margin:0 16px 15px;padding:18px 18px 13px;background:#fff;border-bottom:2px solid #0f766e; }
            .header-brand { display:flex;align-items:center;gap:16px; }
            .brand-logo { flex:0 0 78px;width:78px;height:78px;border-radius:12px;overflow:hidden;background:#0c3035;display:flex;align-items:center;justify-content:center; }
            .brand-logo img { max-width:74px;max-height:74px;object-fit:contain; }
            .header-eyebrow { color:#0f766e;font-size:10px;font-weight:800;letter-spacing:1.3px;margin-bottom:5px; }
            .document-header h1 { color:#102d32;font-size:22px;letter-spacing:-0.4px;font-weight:800;line-height:1.22;margin:0; }
            .header-subtitle { color:#475569;font-size:11px;line-height:1.4;margin-top:6px; }
            .header-rule { margin-top:12px;height:3px;width:72px;background:#0d9488;border-radius:3px; }
            .clinical-field { break-inside:avoid; }
            .section-header { border-radius:7px 7px 0 0; }
            .clinical-section-header { break-inside:avoid; page-break-inside:avoid; break-after:avoid; page-break-after:avoid; }
            .clinical-section-header + div { break-before:avoid; page-break-before:avoid; }
            .document-header,.header-brand,.brand-logo { break-inside:avoid; }
            
            .page-break { break-before: page; page-break-before: always; }
            .clinical-section { break-inside: auto; page-break-inside: auto; }
            .clinical-section--keep { break-inside: avoid !important; page-break-inside: avoid !important; }
            .clinical-section--keep > div { break-inside: avoid; page-break-inside: avoid; }
            .clinical-section--keep { display: flow-root; }
            .clinical-section--keep .clinical-section-header { break-after: avoid !important; page-break-after: avoid !important; }
            .clinical-section-header { break-inside: avoid; page-break-inside: avoid; }
            .clinical-field { margin:0 0 9px; break-inside:avoid; page-break-inside:avoid; }
            .clinical-label { font-size:10px;line-height:1.35;color:#0f766e;font-weight:700;text-transform:uppercase;margin-bottom:4px; }
            .clinical-value { border:1px solid #e2e8f0;background:#f8fafc;padding:7px 10px;border-radius:6px;font-size:11px;line-height:1.55; }
            .clinical-field--empty { display:flex;justify-content:space-between;gap:12px;align-items:baseline;border-bottom:1px solid #f1f5f9;padding-bottom:4px;margin-bottom:6px; }
            .clinical-field--empty .clinical-label { flex:1;min-width:0;margin:0;color:#475569;font-size:10px; }
            .clinical-field--empty .clinical-value { flex:0 1 44%;padding:0;border:0;background:transparent;color:#475569;font-size:10px;text-align:right; }
            .clinical-checkbox-empty { color:#64748b;font-size:10px;font-style:italic;padding:4px 0; }
            .clinical-tags { display:flex;flex-wrap:wrap;gap:5px; }
            .clinical-tag { display:inline-block;border-radius:14px;border:1px solid #7dd3c7;background:#ecfdf5;padding:4px 9px;font-size:10px;font-weight:600;color:#115e59;white-space:normal; }
            .professional-footer { break-inside:auto;page-break-inside:auto; }
            .professional-footer img { break-inside:avoid;page-break-inside:avoid; }
            
            .clinical-value { overflow-wrap: anywhere; word-break: normal; white-space: normal; }
            .not-reported { color: #64748b; font-style: italic; }
            h1, h2, h3 { break-after: avoid; page-break-after: avoid; }
            p, div { overflow-wrap: anywhere; }
            img, svg { max-width: 100%; }
            @media print { h1, h2, h3 { break-after: avoid; } }
          </style>
        </head>
        <body>
          <div class="container">
            <header class="document-header" style="padding:16px 18px 11px;">
              <div class="header-eyebrow">MUSETERA · DOCUMENTAÇÃO CLÍNICA</div>
              <h1>ANAMNESE MUSICOTERAPÊUTICA</h1>
              <div class="header-subtitle">Histórico clínico e sonoro-musical · Registro de anamnese</div>
              <div class="header-rule"></div>
            </header>

            <div class="patient-line" style="margin:0 16px 13px;padding:10px 13px;background:#f3f8f7;border-left:3px solid #0f766e;border-radius:4px;display:flex;justify-content:space-between;align-items:center;gap:16px;page-break-inside:avoid;">
              <div style="min-width:0"><span style="font-size:9px;font-weight:800;color:#475569;letter-spacing:.5px;">PACIENTE</span><div style="font-size:13px;font-weight:700;color:#102a43;overflow-wrap:anywhere;">${escapeHtml(patientName)}</div></div>
              <div style="text-align:right;flex-shrink:0"><span style="font-size:9px;font-weight:800;color:#475569;letter-spacing:.5px;">DATA DO REGISTRO</span><div style="font-size:11px;color:#172b4d;font-weight:600;">${formatClinicalDate(anamnesisData.created_at)}</div></div>
            </div>

            <!-- Identificação consolidada: valores provenientes exclusivamente da anamnese salva -->
            <div class="patient-identification" style="margin:0 16px 12px;padding:12px;background:#ffffff;border:1px solid #c9e4df;border-radius:7px;break-inside:avoid;page-break-inside:avoid;">
              <div style="font-size:11px;font-weight:800;color:#115e59;margin-bottom:9px;">IDENTIFICAÇÃO DO PACIENTE</div>
              <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px 15px;">
                ${identityItem('Nome completo', patientName)}
                ${identityItem('Data de nascimento', formatClinicalDate(anamnesisData.birth_date))}
                ${identityItem('Responsável legal', anamnesisData.legal_guardian)}
                ${identityItem('Parentesco', anamnesisData.family_relationship)}
                ${identityItem('Código CID-10/11', anamnesisData.cid_code)}
                ${identityItem('Profissional encaminhador', anamnesisData.referral_professional)}
              </div>
            </div>

            <!-- ÍNDICE NAVEGÁVEL -->


            <!-- CONTEÚDO DAS SEÇÕES -->
            <div style="padding: 0 16px;">

              <!-- SEÇÃO 1: IDENTIFICAÇÃO E ENCAMINHAMENTO -->
              <div class="clinical-section clinical-section--keep" style="margin-bottom: 10px;">
                ${sectionHeader(1, 'ENCAMINHAMENTO E DEMANDA CLÍNICA')}
                ${sectionContainer(1, `
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    ${renderTextField('Nome da Mãe', 'mother_name')}
                    ${renderTextField('Nome do Pai', 'father_name')}
                  </div>
                   ${renderTextField('Responsável legal', 'legal_guardian')}
                  ${renderTextField('Vínculo com paciente', 'family_relationship')}
                  ${renderTextField('Profissional Encaminhador', 'referral_professional')}
                  ${renderTextField('Demanda Clínica Principal', 'main_clinical_demand')}
                  ${renderTextField('Detalhes do Diagnóstico', 'diagnosis_details')}
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    ${renderTextField('Código CID-10/11', 'cid_code')}
                    ${renderTextField('Data do Diagnóstico', 'diagnosis_date')}
                  </div>
                `)}
              </div>

              <!-- SEÇÃO 2: HISTÓRICO CLÍNICO E MÉDICO -->
              <div class="clinical-section clinical-section--keep" style="margin-bottom: 12px;">
                ${sectionHeader(2, 'HISTÓRICO CLÍNICO E MÉDICO')}
                ${sectionContainer(2, `
                  <div style="margin-bottom: 16px;">
                    <div style="font-weight: 600; font-size: 11px; color: #0f766e; margin-bottom: 10px; text-transform: uppercase;">Diagnósticos / Condições</div>
                    ${renderCheckboxes([
                      { id: 'autism_spectrum', label: 'TEA - Transtorno do Espectro Autista' },
                      { id: 'adhd', label: 'TDAH' },
                      { id: 'down_syndrome', label: 'Síndrome de Down' },
                      { id: 'intellectual_disability', label: 'Deficiência Intelectual' },
                      { id: 'cerebral_palsy', label: 'Paralisia Cerebral' },
                      { id: 'epilepsy', label: 'Epilepsia' },
                      { id: 'chronic_encephalopathy', label: 'Encefalopatia Crônica' },
                      { id: 'williams_syndrome', label: 'Síndrome de Williams' },
                      { id: 'fragile_x_syndrome', label: 'Síndrome X Frágil' },
                      { id: 'rett_syndrome', label: 'Síndrome de Rett' },
                      { id: 'angelman_syndrome', label: 'Síndrome de Angelman' },
                      { id: 'alzheimer', label: 'Doença de Alzheimer' },
                      { id: 'parkinson', label: 'Doença de Parkinson' },
                      { id: 'depression', label: 'Depressão' },
                      { id: 'bipolar_disorder', label: 'Transtorno Bipolar' },
                      { id: 'anxiety_disorders', label: 'Transtornos de Ansiedade' },
                      { id: 'odd_disorder', label: 'TOD - Transtorno Opositor Desafiador' },
                      { id: 'other_diagnoses', label: 'Outros Diagnósticos' }
                    ])}
                  </div>
                  ${renderTextField('Nível de Suporte (TEA)', 'support_level')}
                  ${renderTextField('Detalhes Adicionais das Condições', 'clinical_details')}
                `)}
              </div>

              <!-- SEÇÃO 3: MEDICAÇÃO EM USO -->
              <div class="clinical-section clinical-section--keep" style="margin-bottom: 12px;">
                ${sectionHeader(3, 'MEDICAÇÃO EM USO')}
                ${sectionContainer(3, `
                  ${renderTextField('Medicações Atuais', 'current_medication')}
                  ${renderTextField('Horários e Dosagens', 'medication_schedule')}
                  ${renderTextField('Efeitos Observados', 'medication_effects')}
                `)}
              </div>

              <!-- SEÇÃO 4: TERAPIAS E ACOMPANHAMENTOS -->
              <div class="clinical-section clinical-section--keep" style="margin-bottom: 12px;">
                ${sectionHeader(4, 'TERAPIAS E ACOMPANHAMENTOS')}
                ${sectionContainer(4, `
                  <div style="margin-bottom: 16px;">
                    <div style="font-weight: 600; font-size: 11px; color: #0f766e; margin-bottom: 10px; text-transform: uppercase;">Acompanhamentos em Andamento</div>
                    ${renderCheckboxes([
                      { id: 'speech_therapy', label: 'Fonoaudiologia' },
                      { id: 'psychological_support', label: 'Psicologia' },
                      { id: 'psychopedagogical', label: 'Psicopedagogia' },
                      { id: 'occupational_therapy', label: 'Terapia Ocupacional' },
                      { id: 'physiotherapy', label: 'Fisioterapia' },
                      { id: 'equine_therapy', label: 'Equoterapia' },
                      { id: 'aba_therapy', label: 'Terapia ABA' },
                      { id: 'sensory_integration', label: 'Integração Sensorial' },
                      { id: 'psychomotricity', label: 'Psicomotricidade' },
                      { id: 'nutrition', label: 'Nutrição' },
                      { id: 'music_therapy', label: 'Musicoterapia' }
                    ])}
                  </div>
                  ${renderTextField('Frequência das Terapias', 'therapy_frequency')}
                  ${renderTextField('Observações sobre Evolução', 'therapy_observations')}
                `)}
              </div>

              <!-- SEÇÃO 5: PERFIL MUSICAL DO PACIENTE -->
              <div class="clinical-section clinical-section--keep" style="margin-bottom: 12px;">
                ${sectionHeader(5, 'PERFIL MUSICAL DO PACIENTE')}
                ${sectionContainer(5, `
                  <div style="margin-bottom: 16px;">
                    <div style="font-weight: 600; font-size: 11px; color: #0f766e; margin-bottom: 10px; text-transform: uppercase;">Experiências Musicais</div>
                    ${renderCheckboxes([
                      { id: 'musical_education', label: 'Educação Musical Formal' },
                      { id: 'instrumental_practice', label: 'Prática Instrumental' },
                      { id: 'choral_activities', label: 'Canto/Coral' },
                      { id: 'body_musical_expression', label: 'Expressão Corporal Musical' },
                      { id: 'vocal_expression', label: 'Expressão Vocal' },
                      { id: 'music_therapy_experience', label: 'Experiência em Musicoterapia' },
                      { id: 'no_musical_experience', label: 'Sem Experiência Musical Formal' }
                    ])}
                  </div>
                  <div style="margin-bottom: 16px;">
                    <div style="font-weight: 600; font-size: 11px; color: #0f766e; margin-bottom: 10px; text-transform: uppercase;">Gêneros Musicais Preferidos</div>
                    ${renderCheckboxes([
                      { id: 'children_repertoire', label: 'Repertório Infantil' },
                      { id: 'rock_genre', label: 'Rock/Pop' },
                      { id: 'sacred_gospel', label: 'Música Sacra/Gospel' },
                      { id: 'brazilian_popular', label: 'MPB' },
                      { id: 'country_music', label: 'Sertanejo' },
                      { id: 'classical_music', label: 'Música Clássica' },
                      { id: 'electronic_music', label: 'Música Eletrônica' },
                      { id: 'other_musical_genres', label: 'Outros Gêneros' }
                    ])}
                  </div>
                  ${renderTextField('Instrumentos que Toca/Interesse', 'instruments_played')}
                  ${renderTextField('Tempo de Prática Musical', 'music_practice_time')}
                  ${renderTextField('História Musical do Paciente', 'patient_musical_history')}
                `)}
              </div>

              <!-- SEÇÃO 6: IDENTIDADE SONORA (ISO) -->
              <div class="clinical-section clinical-section--keep" style="margin-bottom: 12px;">
                ${sectionHeader(6, 'IDENTIDADE SONORA (ISO)')}
                ${sectionContainer(6, `
                  <div style="background: linear-gradient(135deg, #f0fdfa, #ecfeff); padding: 12px; border-radius: 8px; border-left: 4px solid #14b8a6; margin-bottom: 16px;">
                    <span style="font-size: 11px; color: #0f766e; font-style: italic;">
                      Baseado na teoria de Rolando Benenzon - elementos sonoro-musicais que caracterizam a identidade do indivíduo
                    </span>
                  </div>
                  ${renderTextField('Experiências Sonoras na Gravidez', 'pregnancy_sound_experiences')}
                  ${renderTextField('Movimentos e Canções da Mãe', 'mother_movements_songs')}
                  ${renderTextField('Ambiente Sonoro da Infância', 'childhood_sound_environment')}
                  ${renderTextField('Reações dos Pais aos Sons', 'parents_sound_reactions')}
                  ${renderTextField('Sons Típicos da Casa', 'typical_house_sounds')}
                  ${renderTextField('Sons Corporais e Noturnos', 'night_body_sounds')}
                  ${renderTextField('História Musical Familiar', 'family_musical_history')}
                `)}
              </div>

              <!-- SEÇÃO 7: COMPORTAMENTO MUSICAL OBSERVADO -->
              <div class="clinical-section clinical-section--keep" style="margin-bottom: 12px;">
                ${sectionHeader(7, 'COMPORTAMENTO MUSICAL OBSERVADO')}
                ${sectionContainer(7, `
                  <div style="margin-bottom: 16px;">
                    <div style="font-weight: 600; font-size: 11px; color: #0f766e; margin-bottom: 10px; text-transform: uppercase;">Comportamentos Observados</div>
                    ${renderCheckboxes([
                      { id: 'active_musical_listening', label: 'Escuta Musical Ativa' },
                      { id: 'body_expression', label: 'Expressão Corporal' },
                      { id: 'sound_responsiveness', label: 'Responsividade Sonora' },
                      { id: 'spontaneous_vocal', label: 'Emissões Vocais Espontâneas' },
                      { id: 'instrumental_exploration', label: 'Exploração Instrumental' },
                      { id: 'adverse_sound_reactivity', label: 'Reatividade Adversa a Sons' }
                    ])}
                  </div>
                  ${renderTextField('Descrição do Comportamento Musical', 'musical_behavior_description')}
                `)}
              </div>

              <!-- SEÇÃO 8: PROCESSAMENTO AUDITIVO E SENSORIAL -->
              <div class="clinical-section clinical-section--keep" style="margin-bottom: 12px;">
                ${sectionHeader(8, 'PROCESSAMENTO AUDITIVO E SENSORIAL')}
                ${sectionContainer(8, `
                  <div style="margin-bottom: 16px;">
                    <div style="font-weight: 600; font-size: 11px; color: #0f766e; margin-bottom: 10px; text-transform: uppercase;">Características Auditivas</div>
                    ${renderCheckboxes([
                      { id: 'auditory_hypersensitivity', label: 'Hipersensibilidade Auditiva' },
                      { id: 'positive_musical_response', label: 'Resposta Positiva à Música' },
                      { id: 'nominal_call_response', label: 'Resposta ao Chamado Nominal' },
                      { id: 'active_sound_search', label: 'Busca Ativa por Sons' },
                      { id: 'specific_sound_aversion', label: 'Aversão a Sons Específicos' },
                      { id: 'sound_source_location', label: 'Localização de Fonte Sonora' }
                    ])}
                  </div>
                  ${renderTextField('Sons que Causam Desconforto', 'discomfort_sounds')}
                  ${renderTextField('Sons que Acalmam/Regulam', 'calming_sounds')}
                `)}
              </div>

              <!-- SEÇÃO 9: DESENVOLVIMENTO NEUROPSICOMOTOR -->
              <div class="clinical-section clinical-section--keep" style="margin-bottom: 12px;">
                ${sectionHeader(9, 'DESENVOLVIMENTO NEUROPSICOMOTOR')}
                ${sectionContainer(9, `
                  <div style="margin-bottom: 16px;">
                    <div style="font-weight: 600; font-size: 11px; color: #0f766e; margin-bottom: 10px; text-transform: uppercase;">Marcos Motores</div>
                    ${renderCheckboxes([
                      { id: 'cervical_control', label: 'Controle Cervical' },
                      { id: 'independent_sitting', label: 'Sentar Independente' },
                      { id: 'crawling_pattern', label: 'Padrão de Engatinhar' },
                      { id: 'autonomous_walking', label: 'Marcha Autônoma' },
                      { id: 'fine_motor_dev', label: 'Desenvolvimento Motor Fino' },
                      { id: 'broad_motor_dev', label: 'Desenvolvimento Motor Amplo' }
                    ])}
                  </div>
                  <div style="margin-bottom: 16px;">
                    <div style="font-weight: 600; font-size: 11px; color: #0f766e; margin-bottom: 10px; text-transform: uppercase;">Desenvolvimento da Linguagem</div>
                    ${renderCheckboxes([
                      { id: 'babbling', label: 'Balbucios' },
                      { id: 'first_words', label: 'Primeiras Palavras' },
                      { id: 'simple_phrases', label: 'Frases Simples' },
                      { id: 'echolalia', label: 'Ecolalia' },
                      { id: 'nonverbal_communication', label: 'Comunicação Não-Verbal' },
                      { id: 'verbal_language_absence', label: 'Ausência de Linguagem Verbal' }
                    ])}
                  </div>
                `)}
              </div>

              <!-- SEÇÃO 10: ASPECTOS COMPORTAMENTAIS E EMOCIONAIS -->
              <div class="clinical-section clinical-section--keep" style="margin-bottom: 12px;">
                ${sectionHeader(10, 'ASPECTOS COMPORTAMENTAIS E EMOCIONAIS')}
                ${sectionContainer(10, `
                  <div style="margin-bottom: 16px;">
                    <div style="font-weight: 600; font-size: 11px; color: #0f766e; margin-bottom: 10px; text-transform: uppercase;">Comportamento e Interação</div>
                    ${renderCheckboxes([
                      { id: 'visual_contact', label: 'Contato Visual' },
                      { id: 'shared_play', label: 'Brincadeiras Compartilhadas' },
                      { id: 'peer_interaction', label: 'Interação com Pares' },
                      { id: 'social_isolation', label: 'Isolamento Social' },
                      { id: 'stereotyped_behavior', label: 'Comportamentos Estereotipados' },
                      { id: 'restricted_interests', label: 'Interesses Restritos' }
                    ])}
                  </div>
                  <div style="margin-bottom: 16px;">
                    <div style="font-weight: 600; font-size: 11px; color: #0f766e; margin-bottom: 10px; text-transform: uppercase;">Regulação Emocional</div>
                    ${renderCheckboxes([
                      { id: 'irritability', label: 'Irritabilidade' },
                      { id: 'anxiety', label: 'Ansiedade' },
                      { id: 'frequent_crying', label: 'Choro Frequente' },
                      { id: 'low_frustration_tolerance', label: 'Baixa Tolerância à Frustração' },
                      { id: 'heteroaggressive', label: 'Heteroagressividade' },
                      { id: 'emotional_ability', label: 'Regulação Emocional Preservada' }
                    ])}
                  </div>
                  ${renderTextField('Estratégias de Regulação', 'regulation_strategies')}
                  ${renderTextField('Estratégias para Acalmar', 'calming_strategies')}
                `)}
              </div>

              <!-- SEÇÃO 11: CONTEXTO SOCIAL E ESCOLAR -->
              <div class="clinical-section clinical-section--keep" style="margin-bottom: 12px;">
                ${sectionHeader(11, 'CONTEXTO SOCIAL E ESCOLAR')}
                ${sectionContainer(11, `
                  ${renderTextField('Situação Escolar', 'school_enrollment')}
                  ${renderTextField('Adaptação Escolar', 'school_adaptation')}
                  ${renderTextField('Atividades Extracurriculares', 'extracurricular_activities')}
                  ${renderTextField('Rede de Apoio Familiar', 'family_support_network')}
                `)}
              </div>

              ${renderTeaFunctionalProfile()}

              <!-- SEÇÃO 12: OBJETIVOS TERAPÊUTICOS -->
              <div class="clinical-section clinical-section--keep" style="margin-bottom: 12px;">
                ${sectionHeader(12, 'OBJETIVOS TERAPÊUTICOS')}
                ${sectionContainer(12, `
                  <div style="background: linear-gradient(135deg, #f0fdfa, #ecfeff); padding: 12px; border-radius: 8px; border-left: 4px solid #14b8a6; margin-bottom: 16px;">
                    <span style="font-size: 11px; color: #0f766e; font-style: italic;">
                      Objetivos e abordagem conforme informações registradas nesta anamnese
                    </span>
                  </div>
                  ${renderTextField('Objetivos Terapêuticos', 'therapeutic_goals')}
                  ${renderTextField('Abordagem de Tratamento', 'treatment_approach')}
                `)}
              </div>

            </div>

            <!-- Assinatura e carimbo reais, somente no final do PDF -->
            <section class="professional-footer" style="margin:10px 16px 4px;border:1px solid #d6e8e7;border-top:3px solid #0f766e;border-radius:9px;padding:9px 12px;break-inside:auto;page-break-inside:auto;">
              <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px;">
                <h2 style="font-size:13px;color:#115e59;margin:0;">ASSINATURA E CARIMBO DO MUSICOTERAPEUTA</h2>
              </div>
              <div style="font-weight:700;font-size:12px;color:#102a43;">${escapeHtml(professional.name || 'Profissional não informado')}</div>
              <div style="font-size:10px;color:#475569;margin-top:3px;">${escapeHtml(professional.specialty || 'Musicoterapia')}</div>
              ${professional.register || professional.license_number ? `<div style="font-size:10px;color:#475569;">Registro: ${escapeHtml(professional.register || professional.license_number)}</div>` : ''}
              <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:14px;margin-top:9px;">
                <div style="flex:1;min-width:0;">
                  <div style="font-size:10px;font-weight:700;color:#115e59;margin-bottom:6px;">ASSINATURA DIGITAL CADASTRADA</div>
                  ${digitalSignatureBase64 || professional.digital_signature_url ? `<img src="${escapeHtml(digitalSignatureBase64 || professional.digital_signature_url)}" alt="Imagem da assinatura cadastrada" style="max-width:255px;max-height:105px;width:auto;object-fit:contain;display:block;"/>` : '<p style="font-size:10px;color:#64748b;">Assinatura não cadastrada ou indisponível.</p>'}
                </div>
                <div style="flex:1;min-width:0;">
                  <div style="font-size:10px;font-weight:700;color:#115e59;margin-bottom:6px;">CARIMBO DIGITAL CADASTRADO</div>
                  ${digitalStampBase64 || professional.digital_stamp_url ? `<img src="${escapeHtml(digitalStampBase64 || professional.digital_stamp_url)}" alt="Imagem do carimbo cadastrado" style="max-width:220px;max-height:105px;width:auto;object-fit:contain;display:block;"/>` : '<p style="font-size:10px;color:#64748b;">Carimbo não cadastrado ou indisponível.</p>'}
                </div>
              </div>
              <p style="font-size:9px;line-height:1.5;color:#64748b;margin-top:12px;">Quando presentes, imagens de assinatura e carimbo reproduzidas conforme cadastro. Este PDF não comprova assinatura criptográfica certificada.</p>
            </section>

            <!-- Metadados de emissão vão no rodapé vetorial da última página,
                 fora do raster do html2pdf, evitando uma quinta página. -->
          </div>
        </body>
        </html>
      `;
    };

    element.innerHTML = generateProfessionalHTML();

    // Garantir que as imagens do rodapé estejam prontas antes da captura do PDF.
    const images = Array.from(element.querySelectorAll('img'));
    await Promise.all(images.map(img => new Promise<void>(resolve => {
      if (img.complete) return resolve();
      const timeout = window.setTimeout(resolve, 8000);
      img.addEventListener('load', () => { clearTimeout(timeout); resolve(); }, { once: true });
      img.addEventListener('error', () => { clearTimeout(timeout); resolve(); }, { once: true });
    })));

    const hasSignature = Boolean(digitalSignatureBase64 || professional.digital_signature_url);
    const hasStamp = Boolean(digitalStampBase64 || professional.digital_stamp_url);
    const loadedImages = Array.from(element.querySelectorAll('img'));
    if ((hasSignature || hasStamp) && loadedImages.some(img =>
      (img.alt === 'Imagem da assinatura cadastrada' || img.alt === 'Imagem do carimbo cadastrado') &&
      img.naturalWidth === 0
    )) {
      throw new Error('A assinatura ou o carimbo cadastrado não carregou. O PDF não será gerado sem esses elementos.');
    }

    const issueDate = new Date();
    const localIssueDate = [
      issueDate.getFullYear(),
      String(issueDate.getMonth() + 1).padStart(2, "0"),
      String(issueDate.getDate()).padStart(2, "0"),
    ].join("-");
    const opt = {
      margin: [12, 10, 17, 10],
      filename: `Anamnese_Musicoterapeutica_${patientName.replace(/\s+/g, '_')}_${localIssueDate}.pdf`,
      pagebreak: { 
        mode: ['css', 'legacy'],
        avoid: ['.clinical-section--keep', '.clinical-section-header', '.patient-line', '.patient-identification', 'h1', 'h2', 'h3']
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 15000,
        removeContainer: true
      },
    };

    console.log("📄 Gerando PDF da Anamnese...");
    const pdfInstance = html2pdf().from(element).set(opt);
    await pdfInstance.toPdf();
    const pdfDocument = await pdfInstance.get("pdf");
    // Não detectar/apagar páginas por cor de pixels: conteúdo legítimo,
    // inclusive textos discretos, poderia ser descartado.
    // O bloco de data/confidencialidade foi retirado do HTML e é
    // desenhado no rodapé da última página já paginada.
    const pageCount = pdfDocument.internal.getNumberOfPages();
    for (let pageNumber = 1; pageNumber <= pageCount; pageNumber++) {
      pdfDocument.setPage(pageNumber);
      pdfDocument.setFont("helvetica", "normal");
      pdfDocument.setFontSize(8);
      pdfDocument.setTextColor(100, 116, 139);
      pdfDocument.text("Musetera · Anamnese musicoterapêutica", 11, 293);
      pdfDocument.text(`Página ${pageNumber} de ${pageCount}`, 199, 293, { align: "right" });

      if (pageNumber === pageCount) {
        const issuedAt = issueDate.toLocaleDateString('pt-BR') + ' às ' +
          issueDate.toLocaleTimeString('pt-BR');
        pdfDocument.setFontSize(7);
        pdfDocument.setTextColor(100, 116, 139);
        pdfDocument.text(`Documento gerado em: ${issuedAt}`, 105, 283.5, { align: 'center' });
        pdfDocument.setFontSize(6.5);
        pdfDocument.text(
          'Este documento contém informações confidenciais protegidas pelo sigilo profissional',
          105, 287, { align: 'center' }
        );
      }
    }
    await pdfInstance.save();

    console.log("✅ PDF da Anamnese gerado com sucesso!");
    return true;
  } catch (error) {
    console.error("❌ Erro ao gerar PDF da Anamnese:", error);
    return false;
  }
};
