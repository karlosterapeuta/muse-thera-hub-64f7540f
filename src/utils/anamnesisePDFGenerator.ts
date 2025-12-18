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
              <div style="background: linear-gradient(135deg, #ccfbf1, #f0fdfa); border: 1px solid #14b8a6; border-radius: 20px; padding: 6px 14px; font-size: 10px; color: #0f766e; font-weight: 500; display: inline-flex; align-items: center; gap: 6px;">
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

      // Cabeçalho da seção com cores diferenciadas
      const sectionHeader = (number: number, title: string, icon: string) => {
        const colors = sectionColors[number] || sectionColors[1];
        return `
          <div style="background: ${colors.gradient}; color: white; padding: 10px 16px; border-radius: 10px 10px 0 0; display: flex; align-items: center; gap: 12px;">
            <div style="background: ${colors.iconBg}; padding: 6px 10px; border-radius: 6px; font-size: 12px; font-weight: 700;">
              ${icon}
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

            <!-- CONTEÚDO DAS SEÇÕES -->
            <div style="padding: 0 16px;">

              <!-- SEÇÃO 1: IDENTIFICAÇÃO E ENCAMINHAMENTO -->
              <div style="margin-bottom: 20px; page-break-inside: avoid;">
                ${sectionHeader(1, 'IDENTIFICAÇÃO E ENCAMINHAMENTO', '[ID]')}
                ${sectionContainer(1, `
                  ${renderTextField('Profissional Encaminhador', 'referral_professional')}
                  ${renderTextField('Demanda Clínica Principal', 'main_clinical_demand')}
                  ${renderTextField('Detalhes do Diagnóstico', 'diagnosis_details')}
                  ${renderTextField('Código CID-10/11', 'cid_code')}
                `)}
              </div>

              <!-- SEÇÃO 2: HISTÓRICO CLÍNICO E MÉDICO -->
              <div style="margin-bottom: 20px; page-break-inside: avoid;">
                ${sectionHeader(2, 'HISTÓRICO CLÍNICO E MÉDICO', '[HC]')}
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
                  ${renderTextField('Detalhes Adicionais das Condições', 'clinical_details')}
                `)}
              </div>

              <!-- SEÇÃO 3: MEDICAÇÃO EM USO -->
              <div style="margin-bottom: 20px; page-break-inside: avoid;">
                ${sectionHeader(3, 'MEDICAÇÃO EM USO', '[MED]')}
                ${sectionContainer(3, `
                  ${renderTextField('Medicações Atuais', 'current_medication')}
                  ${renderTextField('Horários e Dosagens', 'medication_schedule')}
                  ${renderTextField('Efeitos Observados', 'medication_effects')}
                `)}
              </div>

              <!-- SEÇÃO 4: TERAPIAS E ACOMPANHAMENTOS -->
              <div style="margin-bottom: 20px; page-break-inside: avoid;">
                ${sectionHeader(4, 'TERAPIAS E ACOMPANHAMENTOS', '[TER]')}
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
                ${sectionHeader(5, 'PERFIL MUSICAL DO PACIENTE', '♪')}
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
                ${sectionHeader(6, 'IDENTIDADE SONORA (ISO)', '[ISO]')}
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
                ${sectionHeader(7, 'COMPORTAMENTO MUSICAL OBSERVADO', '♫')}
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
                ${sectionHeader(8, 'PROCESSAMENTO AUDITIVO E SENSORIAL', '[AUD]')}
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
                ${sectionHeader(9, 'DESENVOLVIMENTO NEUROPSICOMOTOR', '[NPM]')}
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
                ${sectionHeader(10, 'ASPECTOS COMPORTAMENTAIS E EMOCIONAIS', '[EMO]')}
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
                `)}
              </div>

              <!-- SEÇÃO 11: CONTEXTO SOCIAL E ESCOLAR -->
              <div style="margin-bottom: 20px; page-break-inside: avoid;">
                ${sectionHeader(11, 'CONTEXTO SOCIAL E ESCOLAR', '[ESC]')}
                ${sectionContainer(11, `
                  ${renderTextField('Situação Escolar', 'school_enrollment')}
                  ${renderTextField('Adaptação Escolar', 'school_adaptation')}
                  ${renderTextField('Atividades Extracurriculares', 'extracurricular_activities')}
                  ${renderTextField('Rede de Apoio Familiar', 'family_support_network')}
                `)}
              </div>

              <!-- SEÇÃO 12: OBJETIVOS TERAPÊUTICOS -->
              <div style="margin-bottom: 20px; page-break-inside: avoid;">
                ${sectionHeader(12, 'OBJETIVOS TERAPÊUTICOS', '[OBJ]')}
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
                        <div style="position: relative; width: 56px; height: 56px; flex-shrink: 0;">
                          <div style="position: absolute; inset: 0; border-radius: 50%; background: linear-gradient(135deg, #14b8a6, #22d3ee, #0d9488); filter: blur(3px); opacity: 0.75;"></div>
                          <div style="position: relative; width: 100%; height: 100%; border-radius: 50%; overflow: hidden; border: 2px solid #fff;">
                            <img src="${professionalPhotoBase64}" style="width: 100%; height: 100%; object-fit: cover;" />
                          </div>
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
                    <div style="width: 180px; height: 180px; position: relative; display: flex; align-items: center; justify-content: center;">
                      <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; border: 2px dashed #14b8a6; opacity: 0.3;"></div>
                      <div style="width: 150px; height: 150px; border-radius: 50%; background: linear-gradient(135deg, #f0fdfa, #ccfbf1); border: 3px solid #14b8a6; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 12px; box-shadow: 0 6px 16px rgba(20,184,166,0.2);">
                        <div style="width: 40px; height: 40px; border-radius: 50%; overflow: hidden; border: 2px solid #14b8a6; margin-bottom: 8px;">
                          <img src="${professionalPhotoBase64}" style="width: 100%; height: 100%; object-fit: cover;" />
                        </div>
                        <div style="font-size: 11px; font-weight: bold; color: #0f766e; text-align: center; margin-bottom: 4px; line-height: 1.1;">
                          ${professional.name || 'Profissional'}
                        </div>
                        <div style="width: 50px; height: 1px; background: linear-gradient(to right, transparent, #14b8a6, transparent); margin-bottom: 4px;"></div>
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
                    <div style="margin-top: 12px; background: linear-gradient(135deg, #0d9488, #0891b2); color: white; padding: 6px 16px; border-radius: 16px; font-size: 9px; font-weight: 600; display: flex; align-items: center; gap: 4px; box-shadow: 0 3px 8px rgba(13,148,136,0.3);">
                      <span>✔</span>
                      <span>MuseTera Verified</span>
                      <span>♪</span>
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
        allowTaint: false,
        backgroundColor: '#ffffff'
      },
    };

    console.log("📄 Gerando PDF da Anamnese...");
    await html2pdf().from(element).set(opt).save();
    console.log("✅ PDF da Anamnese gerado com sucesso!");
    return true;
  } catch (error) {
    console.error("❌ Erro ao gerar PDF da Anamnese:", error);
    return false;
  }
};
