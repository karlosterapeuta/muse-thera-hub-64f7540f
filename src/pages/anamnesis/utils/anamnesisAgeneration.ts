
import html2pdf from "html2pdf.js";

export interface AnamnesisData {
  id: string;
  patient_name?: string;
  created_at: string;
  [key: string]: any;
}

export interface ProfessionalData {
  name?: string;
  email: string;
}

// Definição completa de todas as seções da anamnese
export const ANAMNESIS_SECTIONS = [
  {
    title: "Histórico Musical",
    fields: [
      { id: "musical_education", label: "Educação Musical" },
      { id: "instrumental_practice", label: "Prática Instrumental" },
      { id: "body_musical_expression", label: "Expressão Corporal Musical" },
      { id: "vocal_expression", label: "Expressão Vocal" },
      { id: "choral_activities", label: "Atividades Corais" },
      { id: "no_musical_experience", label: "Sem Experiência Musical" }
    ]
  },
  {
    title: "Comportamento Musical",
    fields: [
      { id: "active_musical_listening", label: "Escuta Musical Ativa" },
      { id: "body_expression", label: "Expressão Corporal" },
      { id: "sound_responsiveness", label: "Responsividade Sonora" },
      { id: "spontaneous_vocal", label: "Emissões Vocais Espontâneas" },
      { id: "instrumental_exploration", label: "Exploração Instrumental" },
      { id: "adverse_sound_reactivity", label: "Reatividade Sonora Adversa" }
    ]
  },
  {
    title: "Processamento Sonoro",
    fields: [
      { id: "auditory_hypersensitivity", label: "Hipersensibilidade Auditiva" },
      { id: "positive_musical_response", label: "Resposta Musical Positiva" },
      { id: "nominal_call_response", label: "Resposta ao Chamado Nominal" },
      { id: "active_sound_search", label: "Busca Ativa por Sons" },
      { id: "specific_sound_aversion", label: "Aversão a Sons Específicos" },
      { id: "sound_source_location", label: "Localização de Fonte Sonora" }
    ]
  },
  {
    title: "Preferências Musicais",
    fields: [
      { id: "children_repertoire", label: "Repertório Infantil" },
      { id: "rock_genre", label: "Rock" },
      { id: "sacred_gospel", label: "Sacra/Gospel" },
      { id: "brazilian_popular", label: "MPB" },
      { id: "country_music", label: "Sertanejo" },
      { id: "classical_music", label: "Música Clássica" },
      { id: "other_musical_genres", label: "Outros Gêneros" }
    ]
  },
  {
    title: "Desenvolvimento",
    fields: [
      { id: "cervical_control", label: "Controle Cervical" },
      { id: "crawling_pattern", label: "Padrão de Engatinhar" },
      { id: "fine_motor_dev", label: "Desenvolvimento Motor Fino" },
      { id: "independent_sitting", label: "Sentar Independente" },
      { id: "autonomous_walking", label: "Marcha Autônoma" },
      { id: "broad_motor_dev", label: "Desenvolvimento Motor Amplo" }
    ]
  },
  {
    title: "Desenvolvimento da Linguagem",
    fields: [
      { id: "babbling", label: "Balbucios" },
      { id: "simple_phrases", label: "Frases Simples" },
      { id: "echolalia", label: "Ecolalia" },
      { id: "first_words", label: "Primeiras Palavras" },
      { id: "nonverbal_communication", label: "Comunicação Não-verbal" },
      { id: "verbal_language_absence", label: "Ausência de Linguagem Verbal" }
    ]
  },
  {
    title: "Comportamento",
    fields: [
      { id: "visual_contact", label: "Contato Visual" },
      { id: "shared_play", label: "Brincadeira Compartilhada" },
      { id: "stereotyped_behavior", label: "Comportamentos Estereotipados" },
      { id: "peer_interaction", label: "Interação com Pares" },
      { id: "social_isolation", label: "Isolamento Social" },
      { id: "restricted_interests", label: "Interesses Restritos" }
    ]
  },
  {
    title: "Regulação Emocional",
    fields: [
      { id: "irritability", label: "Irritabilidade" },
      { id: "heteroaggressive", label: "Heteroagressividade" },
      { id: "emotional_ability", label: "Capacidade Emocional" },
      { id: "anxiety", label: "Ansiedade" },
      { id: "frequent_crying", label: "Choro Frequente" },
      { id: "low_frustration_tolerance", label: "Baixa Tolerância à Frustração" }
    ]
  },
  {
    title: "Saúde",
    fields: [
      { id: "autism_spectrum", label: "Transtorno do Espectro Autista" },
      { id: "down_syndrome", label: "Síndrome de Down" },
      { id: "intellectual_disability", label: "Deficiência Intelectual" },
      { id: "adhd", label: "TDAH" },
      { id: "chronic_encephalopathy", label: "Encefalopatia Crônica" },
      { id: "anxiety_disorders", label: "Transtornos de Ansiedade" },
      { id: "other_diagnoses", label: "Outros Diagnósticos" }
    ]
  },
  {
    title: "Medicação e Terapias",
    fields: [
      { id: "speech_therapy", label: "Fonoaudiologia" },
      { id: "psychological_support", label: "Acompanhamento Psicológico" },
      { id: "psychopedagogical", label: "Psicopedagogia" },
      { id: "occupational_therapy", label: "Terapia Ocupacional" },
      { id: "physiotherapy", label: "Fisioterapia" },
      { id: "equine_therapy", label: "Equoterapia" }
    ]
  }
];

export const TEXT_FIELDS = [
  { key: "legal_guardian", label: "Responsável Legal" },
  { key: "family_relationship", label: "Parentesco" },
  { key: "referral_professional", label: "Profissional que Encaminhou" },
  { key: "main_clinical_demand", label: "Demanda Clínica Principal" },
  { key: "current_medication", label: "Medicação Atual" },
  { key: "school_enrollment", label: "Matrícula Escolar" },
  { key: "school_adaptation", label: "Adaptação Escolar" },
  { key: "extracurricular_activities", label: "Atividades Extracurriculares" }
];

export function validateAnamnesisData(data: AnamnesisData): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.patient_name || data.patient_name.trim() === '') {
    errors.push('Nome do paciente é obrigatório');
  }
  
  if (!data.created_at) {
    errors.push('Data de criação é obrigatória');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function sanitizeText(text: string): string {
  if (!text) return '';
  
  return text
    .replace(/[<>]/g, '') // Remove caracteres HTML
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove caracteres de controle
    .trim();
}

export function formatNameFromEmail(email: string): string {
  const namePart = email.split('@')[0];
  return namePart
    .split(/[._-]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function generateAnamnesisHTML(
  anamnesisData: AnamnesisData,
  professionalData: ProfessionalData
): string {
  console.log('Gerando HTML da anamnese com dados:', { anamnesisData, professionalData });
  
  const validation = validateAnamnesisData(anamnesisData);
  if (!validation.isValid) {
    throw new Error(`Dados inválidos: ${validation.errors.join(', ')}`);
  }

  const renderCheckboxSection = (title: string, fields: { id: string, label: string }[]) => {
    const checkedItems = fields
      .filter(item => anamnesisData[item.id] === true)
      .map(item => sanitizeText(item.label))
      .join(", ");
    
    return checkedItems ? `
      <div style="margin-bottom: 12px;">
        <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px; color: #374151;">
          ${sanitizeText(title)}
        </div>
        <div style="background-color: #F9FAFB; padding: 8px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 12px; line-height: 1.4; color: #1F2937;">
          ${checkedItems}
        </div>
      </div>
    ` : '';
  };

  const renderTextFields = () => {
    return TEXT_FIELDS
      .filter(field => anamnesisData[field.key])
      .map(field => `
        <div style="margin-bottom: 12px;">
          <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px; color: #374151;">
            ${sanitizeText(field.label)}
          </div>
          <div style="background-color: #F9FAFB; padding: 8px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 12px; line-height: 1.4; color: #1F2937;">
            ${sanitizeText(anamnesisData[field.key])}
          </div>
        </div>
      `).join('');
  };

  const renderCheckboxSections = () => {
    return ANAMNESIS_SECTIONS
      .map(section => renderCheckboxSection(section.title, section.fields))
      .filter(section => section !== '')
      .join('');
  };

  const professionalName = professionalData.name || formatNameFromEmail(professionalData.email);

  return `
    <div style="padding: 40px; font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; line-height: 1.5;">
      <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #E5E7EB;">
        <h1 style="color: #2563EB; font-size: 26px; font-weight: bold; margin-bottom: 15px;">
          Anamnese Musicoterapêutica
        </h1>
        <h2 style="color: #1F2937; font-size: 20px; margin-bottom: 8px;">
          Paciente: ${sanitizeText(anamnesisData.patient_name || '')}
        </h2>
        <p style="color: #6B7280; font-size: 14px;">
          Data da Avaliação: ${new Date(anamnesisData.created_at).toLocaleDateString('pt-BR')}
        </p>
      </div>

      <div style="margin-bottom: 30px;">
        ${renderTextFields()}
        ${renderCheckboxSections()}
      </div>

      <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #E5E7EB; text-align: center;">
        <p style="color: #6B7280; font-size: 11px; margin-bottom: 4px;">
          Documento gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}
        </p>
        <p style="color: #6B7280; font-size: 11px; margin-bottom: 4px;">
          Musetera - Sistema de Gestão para Musicoterapia
        </p>
        <p style="color: #6B7280; font-size: 11px; margin-bottom: 4px;">
          Musicoterapeuta: ${sanitizeText(professionalName)}
        </p>
        <p style="color: #6B7280; font-size: 11px;">
          Email: ${sanitizeText(professionalData.email)}
        </p>
      </div>
    </div>
  `;
}

export async function generateAnamnesisPortrait(
  anamnesisData: AnamnesisData,
  professionalData: ProfessionalData
): Promise<boolean> {
  try {
    console.log('Iniciando geração de PDF da anamnese');
    
    const validation = validateAnamnesisData(anamnesisData);
    if (!validation.isValid) {
      throw new Error(`Dados inválidos para gerar PDF: ${validation.errors.join(', ')}`);
    }

    const element = document.createElement('div');
    element.innerHTML = generateAnamnesisHTML(anamnesisData, professionalData);

    const filename = `Anamnese - ${sanitizeText(anamnesisData.patient_name || 'Paciente')}.pdf`;
    
    const opt = {
      margin: [15, 15, 15, 15],
      filename,
      pagebreak: { mode: 'avoid-all', before: '.page-break' },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
      },
      html2canvas: {
        scale: 1.5,
        useCORS: true,
        letterRendering: true,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: false,
        removeContainer: true,
      },
    };

    console.log('Configurações do PDF:', opt);
    
    await html2pdf().from(element).set(opt).save();
    console.log('PDF gerado com sucesso');
    
    return true;
  } catch (error) {
    console.error('Erro detalhado ao gerar PDF da anamnese:', error);
    throw new Error(`Falha na geração do PDF: ${error.message}`);
  }
}
