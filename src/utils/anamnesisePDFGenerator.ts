import html2pdf from "html2pdf.js";
import { savePDFToStorage } from "./pdfStorageUtils";

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
}

export const generateProfessionalAnamnesePDF = async (
  anamnesisData: AnamnesisData,
  professional: ProfessionalData,
  patientName: string,
  professionalPhotoBase64?: string | null,
  digitalStampBase64?: string | null
): Promise<boolean> => {
  try {
    console.log("🎯 Iniciando geração do PDF profissional da Anamnese...");
    
    const element = document.createElement('div');
    
    const generateProfessionalHTML = () => {
      // Função para valor de campo
      const getFieldValue = (value: any): string => {
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          return '<span style="color: #9ca3af; font-style: italic;">Não informado</span>';
        }
        return String(value);
      };

      // Renderizar campo de texto
      const renderTextField = (label: string, key: string) => {
        const value = anamnesisData[key];
        return `
          <div style="margin-bottom: 12px;">
            <div style="font-weight: 600; font-size: 11px; color: #0f766e; margin-bottom: 4px; text-transform: uppercase;">
              ${label}
            </div>
            <div style="background-color: #f0fdfa; padding: 10px 12px; border-radius: 8px; border: 1px solid #99f6e4; font-size: 11px; line-height: 1.5; color: #1f2937; min-height: 20px;">
              ${getFieldValue(value)}
            </div>
          </div>
        `;
      };

      // Renderizar checkboxes marcados
      const renderCheckboxes = (checkboxes: { id: string; label: string }[]) => {
        const checked = checkboxes.filter(item => anamnesisData[item.id]);
        if (checked.length === 0) {
          return `
            <div style="background-color: #f0fdfa; padding: 12px; border-radius: 8px; border: 1px solid #99f6e4;">
              <span style="font-size: 11px; color: #9ca3af; font-style: italic;">Nenhum item selecionado</span>
            </div>
          `;
        }
        
        return `
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${checked.map(item => `
              <div style="background-color: #ccfbf1; border: 1px solid #14b8a6; border-radius: 20px; padding: 6px 14px; font-size: 10px; color: #0f766e; font-weight: 500; display: inline-block; min-width: 50px; min-height: 24px; line-height: 12px;">
                <span style="color: #14b8a6; font-weight: bold;">✓</span>
                ${item.label}
              </div>
            `).join('')}
          </div>
        `;
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
          <div style="background: ${colors.gradient}; color: white; padding: 10px 16px; border-radius: 10px 10px 0 0; display: flex; align-items: center; gap: 12px;">
            <div style="background: ${colors.iconBg}; padding: 8px; border-radius: 8px; display: flex; align-items: center; justify-content: center; min-width: 36px; min-height: 36px;">
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
          <div style="background-color: #ffffff; border: 1px solid ${colors.borderColor}; border-left: 4px solid ${colors.borderColor}; border-top: none; border-radius: 0 0 10px 10px; padding: 16px;">
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
            .container { max-width: 800px; margin: 0 auto; background-color: #ffffff; }
            .page-break { page-break-before: always; }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- HEADER TEAL PREMIUM -->
            <div style="background: linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #06b6d4 100%); color: white; padding: 28px 24px; margin-bottom: 0; border-radius: 0 0 20px 20px; box-shadow: 0 4px 20px rgba(13, 148, 136, 0.3);">
              <div style="text-align: center;">
                <div style="font-size: 14px; letter-spacing: 3px; opacity: 0.9; margin-bottom: 8px;">♪ MUSICOTERAPIA CLÍNICA ♪</div>
                <h1 style="margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  ANAMNESE MUSICOTERAPÊUTICA
                </h1>
                <div style="margin-top: 10px; font-size: 14px; opacity: 0.95; font-weight: 500;">
                  Avaliação Musicoterapêutica Profissional
                </div>
              </div>
            </div>

            <!-- INFORMAÇÕES DO PACIENTE -->
            <div style="background: linear-gradient(135deg, #f0fdfa, #ccfbf1); border: 2px solid #14b8a6; padding: 20px; margin: 24px 16px; border-radius: 12px; box-shadow: 0 2px 12px rgba(13, 148, 136, 0.1);">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div>
                  <div style="font-weight: 600; font-size: 10px; color: #0f766e; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 1px;">Paciente</div>
                  <div style="font-size: 18px; font-weight: 700; color: #134e4a;">${patientName}</div>
                </div>
                <div>
                  <div style="font-weight: 600; font-size: 10px; color: #0f766e; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 1px;">Data da Avaliação</div>
                  <div style="font-size: 14px; font-weight: 600; color: #134e4a;">
                    ${new Date(anamnesisData.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </div>
                </div>
              </div>
              <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #99f6e4;">
                <div style="font-weight: 600; font-size: 10px; color: #0f766e; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 1px;">Musicoterapeuta Responsável</div>
                <div style="font-size: 13px; color: #134e4a;">
                  <strong>${professional.name || 'Não informado'}</strong>
                  ${professional.register || professional.license_number ? ` • ${professional.register || professional.license_number}` : ''}
                  ${professional.specialty ? ` • ${professional.specialty}` : ''}
                </div>
              </div>
            </div>

            <!-- ÍNDICE NAVEGÁVEL -->
            ${generateTableOfContents()}

            <!-- CONTEÚDO DAS SEÇÕES -->
            <div style="padding: 0 16px;">

              <!-- SEÇÃO 1: IDENTIFICAÇÃO E ENCAMINHAMENTO -->
              <div style="margin-bottom: 20px; page-break-inside: avoid;">
                ${sectionHeader(1, 'IDENTIFICAÇÃO E ENCAMINHAMENTO')}
                ${sectionContainer(1, `
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    ${renderTextField('Nome da Mãe', 'mother_name')}
                    ${renderTextField('Nome do Pai', 'father_name')}
                  </div>
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
              <div style="margin-bottom: 20px; page-break-inside: avoid;">
                ${sectionHeader(2, 'HISTÓRICO CLÍNICO E MÉDICO')}
                ${sectionContainer(2, `
                  <div style="margin-bottom: 16px;">
                    <div style="font-weight: 600; font-size: 11px; color: #0f766e; margin-bottom: 10px; text-transform: uppercase;">Diagnósticos / Condições</div>
                    ${renderCheckboxes([
                      { id: 'autism_spectrum', label: 'Transtorno do Espectro Autista (TEA)' },
                      { id: 'down_syndrome', label: 'Síndrome de Down' },
                      { id: 'intellectual_disability', label: 'Deficiência Intelectual' },
                      { id: 'adhd', label: 'TDAH' },
                      { id: 'chronic_encephalopathy', label: 'Encefalopatia Crônica' },
                      { id: 'anxiety_disorders', label: 'Transtornos de Ansiedade' },
                      { id: 'cerebral_palsy', label: 'Paralisia Cerebral' },
                      { id: 'epilepsy', label: 'Epilepsia' },
                      { id: 'genetic_syndrome', label: 'Síndrome Genética' },
                      { id: 'hearing_impairment', label: 'Deficiência Auditiva' },
                      { id: 'visual_impairment', label: 'Deficiência Visual' },
                      { id: 'other_diagnoses', label: 'Outros Diagnósticos' }
                    ])}
                  </div>
                  ${renderTextField('Nível de Suporte (TEA)', 'support_level')}
                  ${renderTextField('Detalhes Adicionais das Condições', 'clinical_details')}
                `)}
              </div>

              <!-- SEÇÃO 3: MEDICAÇÃO EM USO -->
              <div style="margin-bottom: 20px; page-break-inside: avoid;">
                ${sectionHeader(3, 'MEDICAÇÃO EM USO')}
                ${sectionContainer(3, `
                  ${renderTextField('Medicações Atuais', 'current_medication')}
                  ${renderTextField('Horários e Dosagens', 'medication_schedule')}
                  ${renderTextField('Efeitos Observados', 'medication_effects')}
                `)}
              </div>

              <!-- SEÇÃO 4: TERAPIAS E ACOMPANHAMENTOS -->
              <div style="margin-bottom: 20px; page-break-inside: avoid;">
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
                      { id: 'nutritionist', label: 'Nutricionista' },
                      { id: 'neurologist', label: 'Neurologista' },
                      { id: 'psychiatrist', label: 'Psiquiatra' }
                    ])}
                  </div>
                  ${renderTextField('Frequência das Terapias', 'therapy_frequency')}
                  ${renderTextField('Observações sobre Evolução', 'therapy_observations')}
                `)}
              </div>

              <!-- SEÇÃO 5: PERFIL MUSICAL DO PACIENTE -->
              <div style="margin-bottom: 20px; page-break-inside: avoid;">
                ${sectionHeader(5, 'PERFIL MUSICAL DO PACIENTE')}
                ${sectionContainer(5, `
                  <div style="margin-bottom: 16px;">
                    <div style="font-weight: 600; font-size: 11px; color: #0f766e; margin-bottom: 10px; text-transform: uppercase;">Experiências Musicais</div>
                    ${renderCheckboxes([
                      { id: 'musical_education', label: 'Educação Musical Formal' },
                      { id: 'instrumental_practice', label: 'Prática Instrumental' },
                      { id: 'body_musical_expression', label: 'Expressão Corporal Musical' },
                      { id: 'vocal_expression', label: 'Expressão Vocal' },
                      { id: 'choral_activities', label: 'Atividades Corais' },
                      { id: 'no_musical_experience', label: 'Sem Experiência Musical' }
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
              <div style="margin-bottom: 20px; page-break-inside: avoid;">
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
              <div style="margin-bottom: 20px; page-break-inside: avoid;">
                ${sectionHeader(7, 'COMPORTAMENTO MUSICAL OBSERVADO')}
                ${sectionContainer(7, `
                  <div style="margin-bottom: 16px;">
                    <div style="font-weight: 600; font-size: 11px; color: #0f766e; margin-bottom: 10px; text-transform: uppercase;">Comportamentos Observados</div>
                    ${renderCheckboxes([
                      { id: 'active_musical_listening', label: 'Escuta Musical Ativa' },
                      { id: 'body_expression', label: 'Expressão Corporal Espontânea' },
                      { id: 'sound_responsiveness', label: 'Responsividade a Estímulos Sonoros' },
                      { id: 'spontaneous_vocal', label: 'Vocalizações Espontâneas' },
                      { id: 'instrumental_exploration', label: 'Exploração Instrumental' },
                      { id: 'musical_imitation', label: 'Imitação Musical' },
                      { id: 'rhythmic_synchronization', label: 'Sincronização Rítmica' }
                    ])}
                  </div>
                  ${renderTextField('Descrição do Comportamento Musical', 'musical_behavior_description')}
                `)}
              </div>

              <!-- SEÇÃO 8: PROCESSAMENTO AUDITIVO E SENSORIAL -->
              <div style="margin-bottom: 20px; page-break-inside: avoid;">
                ${sectionHeader(8, 'PROCESSAMENTO AUDITIVO E SENSORIAL')}
                ${sectionContainer(8, `
                  <div style="margin-bottom: 16px;">
                    <div style="font-weight: 600; font-size: 11px; color: #0f766e; margin-bottom: 10px; text-transform: uppercase;">Características Auditivas</div>
                    ${renderCheckboxes([
                      { id: 'auditory_hypersensitivity', label: 'Hipersensibilidade Auditiva' },
                      { id: 'positive_musical_response', label: 'Resposta Positiva à Música' },
                      { id: 'nominal_call_response', label: 'Resposta ao Chamado Nominal' },
                      { id: 'active_sound_search', label: 'Busca Ativa por Fontes Sonoras' },
                      { id: 'specific_sound_aversion', label: 'Aversão a Sons Específicos' },
                      { id: 'sound_source_location', label: 'Localização de Fonte Sonora' },
                      { id: 'adverse_sound_reactivity', label: 'Reatividade Adversa a Sons' }
                    ])}
                  </div>
                  ${renderTextField('Sons que Causam Desconforto', 'discomfort_sounds')}
                  ${renderTextField('Sons que Acalmam/Regulam', 'calming_sounds')}
                `)}
              </div>

              <!-- SEÇÃO 9: DESENVOLVIMENTO NEUROPSICOMOTOR -->
              <div style="margin-bottom: 20px; page-break-inside: avoid;">
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
              <div style="margin-bottom: 20px; page-break-inside: avoid;">
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
              <div style="margin-bottom: 20px; page-break-inside: avoid;">
                ${sectionHeader(11, 'CONTEXTO SOCIAL E ESCOLAR')}
                ${sectionContainer(11, `
                  ${renderTextField('Situação Escolar', 'school_enrollment')}
                  ${renderTextField('Adaptação Escolar', 'school_adaptation')}
                  ${renderTextField('Atividades Extracurriculares', 'extracurricular_activities')}
                  ${renderTextField('Rede de Apoio Familiar', 'family_support_network')}
                `)}
              </div>

              <!-- SEÇÃO 12: OBJETIVOS TERAPÊUTICOS -->
              <div style="margin-bottom: 20px; page-break-inside: avoid;">
                ${sectionHeader(12, 'OBJETIVOS TERAPÊUTICOS')}
                ${sectionContainer(12, `
                  <div style="background: linear-gradient(135deg, #f0fdfa, #ecfeff); padding: 12px; border-radius: 8px; border-left: 4px solid #14b8a6; margin-bottom: 16px;">
                    <span style="font-size: 11px; color: #0f766e; font-style: italic;">
                      Objetivos definidos em conjunto com a família e equipe multidisciplinar
                    </span>
                  </div>
                  ${renderTextField('Objetivos Terapêuticos', 'therapeutic_goals')}
                  ${renderTextField('Abordagem de Tratamento', 'treatment_approach')}
                `)}
              </div>

            </div>

            <!-- RODAPÉ TEAL UNIFICADO -->
            <div style="margin: 40px 16px 0 16px; border: 3px solid transparent; border-image: linear-gradient(135deg, #0d9488, #14b8a6, #06b6d4) 1; border-radius: 16px; overflow: hidden; background: #ffffff; box-shadow: 0 8px 24px rgba(13, 148, 136, 0.15);">
              
              <!-- Barra Decorativa Superior 8px -->
              <div style="height: 8px; background: linear-gradient(90deg, #0d9488 0%, #14b8a6 50%, #06b6d4 100%);"></div>
              
              <!-- Seção Principal -->
              <div style="padding: 24px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start;">
                  
                  <!-- ESQUERDA: Card de Assinatura -->
                  <div style="background: linear-gradient(135deg, #f0fdfa, #ccfbf1); border: 2px solid #14b8a6; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(20,184,166,0.15);">
                    <div style="height: 6px; background: linear-gradient(to right, #0d9488, #14b8a6, #06b6d4);"></div>
                    <div style="padding: 16px;">
                      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                        ${professionalPhotoBase64 ? `
                        <div style="width: 56px; height: 56px; flex-shrink: 0; border-radius: 50%; overflow: hidden; border: 3px solid #14b8a6; box-shadow: 0 0 12px 3px rgba(20, 184, 166, 0.4);">
                          <img src="${professionalPhotoBase64}" style="width: 100%; height: 100%; object-fit: cover;" />
                        </div>
                        ` : ''}
                        <div style="flex: 1;">
                          <div style="font-size: 13px; font-weight: bold; color: #0f766e; margin-bottom: 6px; line-height: 1.2;">
                            ${professional.name || 'Nome do Profissional'}
                          </div>
                          <div style="background-color: #ccfbf1; border: 1px solid #99f6e4; border-radius: 16px; padding: 3px 10px; display: inline-block;">
                            <span style="font-size: 9px; color: #0f766e; font-weight: 600;">Musicoterapeuta ${professional.specialty ? `- ${professional.specialty}` : ''}</span>
                          </div>
                        </div>
                      </div>
                      <div style="font-size: 10px; color: #374151; line-height: 1.5;">
                        ${professional.register || professional.license_number ? `<div style="margin-bottom: 2px;">Reg: ${professional.register || professional.license_number}</div>` : ''}
                        ${professional.email ? `<div style="margin-bottom: 2px;">Email: ${professional.email}</div>` : ''}
                        ${professional.phone ? `<div>Tel: ${professional.phone}</div>` : ''}
                      </div>
                    </div>
                    <div style="border-top: 1px solid #99f6e4; background: linear-gradient(to right, #f0fdfa, #ecfeff, #f0fdfa); padding: 10px 12px;">
                      <div style="display: flex; align-items: center; justify-content: center; gap: 6px;">
                        <span style="color: #0d9488; font-size: 12px;">✔</span>
                        <span style="font-size: 10px; font-weight: 600; color: #0f766e;">Assinatura Digital Verificada</span>
                        <span style="color: #0d9488; font-size: 10px;">♪</span>
                        <span style="font-size: 10px; color: #6b7280;">Sistema MuseTera</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- DIREITA: Carimbo Circular -->
                  <div style="display: flex; flex-direction: column; align-items: center;">
                    ${professionalPhotoBase64 ? `
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
                      <div style="width: 150px; height: 150px; border-radius: 50%; background-color: #f0fdfa; border: 3px solid #14b8a6; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 12px; box-shadow: 0 0 0 8px rgba(20, 184, 166, 0.1), 0 0 0 12px rgba(20, 184, 166, 0.05), 0 6px 16px rgba(20, 184, 166, 0.2);">
                        <div style="width: 40px; height: 40px; border-radius: 50%; overflow: hidden; border: 2px solid #14b8a6; margin-bottom: 8px;">
                          <img src="${professionalPhotoBase64}" style="width: 100%; height: 100%; object-fit: cover;" />
                        </div>
                        <div style="font-size: 11px; font-weight: bold; color: #0f766e; text-align: center; margin-bottom: 4px; line-height: 1.1;">
                          ${professional.name || 'Profissional'}
                        </div>
                        <div style="width: 50px; height: 1px; background-color: #14b8a6; margin-bottom: 4px;"></div>
                        <div style="background-color: #ccfbf1; border: 1px solid #99f6e4; border-radius: 12px; padding: 2px 8px;">
                          <span style="font-size: 8px; color: #0f766e; font-weight: 600;">Musicoterapeuta</span>
                        </div>
                        ${professional.register || professional.license_number ? `
                        <div style="font-size: 8px; color: #374151; font-weight: 600; margin-top: 4px;">
                          ${professional.register || professional.license_number}
                        </div>
                        ` : ''}
                      </div>
                    </div>
                    <div style="margin-top: 12px; background-color: #0d9488; color: white; padding: 6px 16px; border-radius: 16px; font-size: 9px; font-weight: 600; display: inline-block; min-width: 120px; min-height: 24px; text-align: center; box-shadow: 0 3px 8px rgba(13,148,136,0.3);">
                      MuseTera Verified
                    </div>
                    ` : `
                    <div style="width: 150px; height: 150px; border: 2px dashed #14b8a6; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #6b7280; background-color: #f0fdfa;">
                      Carimbo Digital
                    </div>
                    `}
                  </div>
                  
                </div>
              </div>
            </div>

            <!-- Informações do Documento -->
            <div style="font-size: 9px; color: #6b7280; text-align: center; margin: 16px 16px 24px 16px;">
              <div style="margin-bottom: 4px;">
                <strong>Documento gerado em:</strong> ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}
              </div>
              <div style="font-size: 8px; color: #9ca3af;">
                Este documento contém informações confidenciais protegidas pelo sigilo profissional
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
    };

    element.innerHTML = generateProfessionalHTML();

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `Anamnese_Musicoterapeutica_${patientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
      pagebreak: { 
        mode: ['avoid-all', 'css', 'legacy']
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      },
      html2canvas: {
        scale: 1.5,
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
    await pdfInstance.save();

    // Auto-save to storage
    try {
      const pdfBlob = await pdfInstance.outputPdf('blob');
      await savePDFToStorage(pdfBlob, opt.filename, "anamnesis");
    } catch (storageErr) {
      console.warn("⚠️ PDF baixado mas não foi salvo no sistema:", storageErr);
    }

    console.log("✅ PDF da Anamnese gerado com sucesso!");
    return true;
  } catch (error) {
    console.error("❌ Erro ao gerar PDF da Anamnese:", error);
    return false;
  }
};
