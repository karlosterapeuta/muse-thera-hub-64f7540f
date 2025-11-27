
import html2pdf from "html2pdf.js";

interface AnamnesisData {
  [key: string]: any;
  patient_name?: string;
  created_at: string;
  legal_guardian?: string;
  family_relationship?: string;
  referral_professional?: string;
  main_clinical_demand?: string;
  current_medication?: string;
  school_enrollment?: string;
  school_adaptation?: string;
  extracurricular_activities?: string;
  therapeutic_goals?: string;
  treatment_approach?: string;
  // História Sonora e Musical Detalhada
  pregnancy_sound_experiences?: string;
  mother_movements_songs?: string;
  childhood_sound_environment?: string;
  parents_sound_reactions?: string;
  typical_house_sounds?: string;
  night_body_sounds?: string;
  family_musical_history?: string;
  patient_musical_history?: string;
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
    // Debug log para verificar dados recebidos
    console.log("🔍 Dados recebidos no gerador de PDF:", anamnesisData);
    console.log("🎵 História Sonora no PDF - pregnancy_sound_experiences:", anamnesisData.pregnancy_sound_experiences);
    console.log("🎵 História Sonora no PDF - mother_movements_songs:", anamnesisData.mother_movements_songs);
    console.log("🎵 História Sonora no PDF - childhood_sound_environment:", anamnesisData.childhood_sound_environment);
    console.log("🎵 História Sonora no PDF - parents_sound_reactions:", anamnesisData.parents_sound_reactions);
    console.log("🎵 História Sonora no PDF - typical_house_sounds:", anamnesisData.typical_house_sounds);
    console.log("🎵 História Sonora no PDF - night_body_sounds:", anamnesisData.night_body_sounds);
    console.log("🎵 História Sonora no PDF - family_musical_history:", anamnesisData.family_musical_history);
    console.log("🎵 História Sonora no PDF - patient_musical_history:", anamnesisData.patient_musical_history);
    console.log("🎯 Iniciando geração do PDF profissional...");
    
    const element = document.createElement('div');
    
    const generateProfessionalHTML = () => {
      // Campos da História Sonora e Musical Detalhada (campos novos que podem não estar preenchidos)
      const soundHistoryFields = [
        'pregnancy_sound_experiences',
        'mother_movements_songs', 
        'childhood_sound_environment',
        'parents_sound_reactions',
        'typical_house_sounds',
        'night_body_sounds',
        'family_musical_history',
        'patient_musical_history'
      ];

      // Função para determinar a mensagem apropriada para campos vazios
      const getEmptyFieldMessage = (fieldKey: string, value: any) => {
        // Para campos vazios ou nulos
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          // Se o campo é da História Sonora e Musical
          if (soundHistoryFields.includes(fieldKey)) {
            return 'Campo disponível para preenchimento posterior';
          }
          // Para outros campos vazios
          return 'Não informado';
        }
        
        // Retorna o valor se não estiver vazio
        return value;
      };

      // Seções organizadas logicamente
      const sections = [
        {
          title: "I. IDENTIFICAÇÃO E DADOS PESSOAIS",
          icon: "👤",
          fields: [
            { key: "legal_guardian", label: "Responsável Legal" },
            { key: "family_relationship", label: "Grau de Parentesco" },
            { key: "referral_professional", label: "Profissional Encaminhador" }
          ]
        },
        {
          title: "II. DEMANDA CLÍNICA E ENCAMINHAMENTO",
          icon: "🏥",
          fields: [
            { key: "main_clinical_demand", label: "Demanda Clínica Principal" }
          ]
        },
        {
          title: "III. HISTÓRICO MUSICAL E SONORO",
          icon: "🎵",
          checkboxes: [
            { id: "musical_education", label: "Educação Musical Formal" },
            { id: "instrumental_practice", label: "Prática Instrumental" },
            { id: "body_musical_expression", label: "Expressão Corporal Musical" },
            { id: "vocal_expression", label: "Expressão Vocal" },
            { id: "choral_activities", label: "Participação em Atividades Corais" },
            { id: "no_musical_experience", label: "Ausência de Experiência Musical" }
          ]
        },
        {
          title: "IV. HISTÓRIA SONORA E MUSICAL DETALHADA",
          icon: "🎵",
          fields: [
            { key: "pregnancy_sound_experiences", label: "Experiências sonoras durante a gravidez" },
            { key: "mother_movements_songs", label: "Movimentos e canções da mãe" },
            { key: "childhood_sound_environment", label: "Ambiente sonoro da infância" },
            { key: "parents_sound_reactions", label: "Reações sonoras dos pais" },
            { key: "typical_house_sounds", label: "Sons típicos da casa" },
            { key: "night_body_sounds", label: "Sons corporais noturnos" },
            { key: "family_musical_history", label: "História musical familiar" },
            { key: "patient_musical_history", label: "História musical do paciente" }
          ],
          isNewSection: true
        },
        {
          title: "V. COMPORTAMENTO MUSICAL OBSERVADO",
          icon: "🎶",
          checkboxes: [
            { id: "active_musical_listening", label: "Escuta Musical Ativa" },
            { id: "body_expression", label: "Expressão Corporal Espontânea" },
            { id: "sound_responsiveness", label: "Responsividade a Estímulos Sonoros" },
            { id: "spontaneous_vocal", label: "Vocalizações Espontâneas" },
            { id: "instrumental_exploration", label: "Exploração Instrumental" },
            { id: "adverse_sound_reactivity", label: "Reatividade Adversa a Sons" }
          ]
        },
        {
          title: "VI. PROCESSAMENTO AUDITIVO E SENSORIAL",
          icon: "👂",
          checkboxes: [
            { id: "auditory_hypersensitivity", label: "Hipersensibilidade Auditiva" },
            { id: "positive_musical_response", label: "Resposta Positiva à Música" },
            { id: "nominal_call_response", label: "Resposta ao Chamado Nominal" },
            { id: "active_sound_search", label: "Busca Ativa por Fontes Sonoras" },
            { id: "specific_sound_aversion", label: "Aversão a Sons Específicos" },
            { id: "sound_source_location", label: "Localização de Fonte Sonora" }
          ]
        },
        {
          title: "VII. PREFERÊNCIAS MUSICAIS",
          icon: "🎤",
          checkboxes: [
            { id: "children_repertoire", label: "Repertório Infantil" },
            { id: "rock_genre", label: "Rock/Pop" },
            { id: "sacred_gospel", label: "Música Sacra/Gospel" },
            { id: "brazilian_popular", label: "Música Popular Brasileira (MPB)" },
            { id: "country_music", label: "Música Sertaneja" },
            { id: "classical_music", label: "Música Clássica" },
            { id: "other_musical_genres", label: "Outros Gêneros Musicais" }
          ]
        },
        {
          title: "VIII. DESENVOLVIMENTO NEUROPSICOMOTOR",
          icon: "🧠",
          checkboxes: [
            { id: "cervical_control", label: "Controle Cervical Adequado" },
            { id: "crawling_pattern", label: "Padrão de Engatinhar Típico" },
            { id: "fine_motor_dev", label: "Desenvolvimento Motor Fino" },
            { id: "independent_sitting", label: "Sentar Independente" },
            { id: "autonomous_walking", label: "Marcha Autônoma" },
            { id: "broad_motor_dev", label: "Desenvolvimento Motor Amplo" }
          ]
        },
        {
          title: "IX. DESENVOLVIMENTO DA LINGUAGEM",
          icon: "💬",
          checkboxes: [
            { id: "babbling", label: "Presença de Balbucios" },
            { id: "simple_phrases", label: "Formação de Frases Simples" },
            { id: "echolalia", label: "Presença de Ecolalia" },
            { id: "first_words", label: "Desenvolvimento das Primeiras Palavras" },
            { id: "nonverbal_communication", label: "Comunicação Não-Verbal" },
            { id: "verbal_language_absence", label: "Ausência de Linguagem Verbal" }
          ]
        },
        {
          title: "X. COMPORTAMENTO E INTERAÇÃO SOCIAL",
          icon: "👥",
          checkboxes: [
            { id: "visual_contact", label: "Estabelecimento de Contato Visual" },
            { id: "shared_play", label: "Participação em Brincadeiras Compartilhadas" },
            { id: "stereotyped_behavior", label: "Presença de Comportamentos Estereotipados" },
            { id: "peer_interaction", label: "Interação com Pares" },
            { id: "social_isolation", label: "Tendência ao Isolamento Social" },
            { id: "restricted_interests", label: "Interesses Restritos ou Fixações" }
          ]
        },
        {
          title: "XI. REGULAÇÃO EMOCIONAL E COMPORTAMENTAL",
          icon: "😊",
          checkboxes: [
            { id: "irritability", label: "Episódios de Irritabilidade" },
            { id: "heteroaggressive", label: "Comportamentos Heteroagressivos" },
            { id: "emotional_ability", label: "Capacidade de Regulação Emocional" },
            { id: "anxiety", label: "Manifestações de Ansiedade" },
            { id: "frequent_crying", label: "Episódios Frequentes de Choro" },
            { id: "low_frustration_tolerance", label: "Baixa Tolerância à Frustração" }
          ]
        },
        {
          title: "XII. DIAGNÓSTICOS E CONDIÇÕES DE SAÚDE",
          icon: "🩺",
          checkboxes: [
            { id: "autism_spectrum", label: "Transtorno do Espectro Autista (TEA)" },
            { id: "down_syndrome", label: "Síndrome de Down" },
            { id: "intellectual_disability", label: "Deficiência Intelectual" },
            { id: "adhd", label: "Transtorno do Déficit de Atenção e Hiperatividade (TDAH)" },
            { id: "chronic_encephalopathy", label: "Encefalopatia Crônica" },
            { id: "anxiety_disorders", label: "Transtornos de Ansiedade" },
            { id: "cerebral_palsy", label: "Paralisia Cerebral" },
            { id: "epilepsy", label: "Epilepsia" },
            { id: "other_diagnoses", label: "Outros Diagnósticos" }
          ]
        },
        {
          title: "XIII. INTERVENÇÕES E ACOMPANHAMENTOS ATUAIS",
          icon: "🔧",
          fields: [
            { key: "current_medication", label: "Medicações em Uso" }
          ],
          checkboxes: [
            { id: "speech_therapy", label: "Fonoaudiologia" },
            { id: "psychological_support", label: "Acompanhamento Psicológico" },
            { id: "psychopedagogical", label: "Acompanhamento Psicopedagógico" },
            { id: "occupational_therapy", label: "Terapia Ocupacional" },
            { id: "physiotherapy", label: "Fisioterapia" },
            { id: "equine_therapy", label: "Equoterapia" }
          ]
        },
        {
          title: "XIV. CONTEXTO EDUCACIONAL E SOCIAL",
          icon: "🏫",
          fields: [
            { key: "school_enrollment", label: "Situação Escolar" },
            { key: "school_adaptation", label: "Adaptação Escolar" },
            { key: "extracurricular_activities", label: "Atividades Extracurriculares" }
          ]
        }
      ];

      // Renderizar campo de texto
      const renderTextField = (field: { key: string; label: string }, isNewSection = false) => {
        const rawValue = anamnesisData[field.key];
        const displayValue = getEmptyFieldMessage(field.key, rawValue);
        const isEmpty = !rawValue || (typeof rawValue === 'string' && rawValue.trim() === '');
        
        console.log(`📝 Campo ${field.key}: valor="${rawValue}" | exibição="${displayValue}" | vazio=${isEmpty}`);
        
        return `
          <div style="margin-bottom: 12px;">
            <div style="font-weight: 600; font-size: 12px; color: #374151; margin-bottom: 4px;">
              ${field.label}:
            </div>
            <div style="background-color: #f8fafc; padding: 8px; border-radius: 6px; border: 1px solid #e2e8f0; font-size: 11px; line-height: 1.4; color: ${isEmpty ? '#9ca3af' : '#1f2937'}; min-height: 20px;">
              ${displayValue}
            </div>
          </div>
        `;
      };

      // Renderizar seção de checkboxes
      const renderCheckboxSection = (checkboxes: { id: string; label: string }[]) => {
        const checkedItems = checkboxes.filter(item => anamnesisData[item.id]);
        if (checkedItems.length === 0) return '';
        
        return `
          <div style="background-color: #f8fafc; padding: 10px; border-radius: 6px; border: 1px solid #e2e8f0; margin-bottom: 8px;">
            <div style="display: block;">
              ${checkedItems.map(item => `
                <div style="display: block; background-color: #ffffff; border: 1px solid #d1d5db; border-radius: 4px; padding: 4px 8px; font-size: 10px; color: #374151; margin-bottom: 4px;">
                  <span style="color: #059669; margin-right: 4px; font-weight: bold;">✓</span>
                  ${item.label}
                </div>
              `).join('')}
            </div>
          </div>
        `;
      };

      // Renderizar seções - SEMPRE mostra todas as seções
      const renderSections = () => {
        return sections.map(section => {
          let sectionHTML = '';

          // Verificar se há campos de texto - SEMPRE renderiza
          if (section.fields) {
            const textFieldsHTML = section.fields.map(field => 
              renderTextField(field, section.isNewSection || false)
            ).join('');
            sectionHTML += textFieldsHTML;
          }

          // Verificar se há checkboxes marcados
          if (section.checkboxes) {
            const checkboxHTML = renderCheckboxSection(section.checkboxes);
            if (checkboxHTML) {
              sectionHTML += checkboxHTML;
            } else {
              // Se não há checkboxes marcados, mostrar mensagem
              sectionHTML += `
                <div style="background-color: #f8fafc; padding: 10px; border-radius: 6px; border: 1px solid #e2e8f0; margin-bottom: 8px;">
                  <div style="font-size: 11px; color: #9ca3af; font-style: italic;">
                    Nenhum item selecionado nesta seção
                  </div>
                </div>
              `;
            }
          }

          // SEMPRE retorna a seção, mesmo sem conteúdo preenchido
          return `
            <div style="margin-bottom: 20px; page-break-inside: avoid;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 8px 12px; border-radius: 8px 8px 0 0; font-weight: 600; font-size: 13px;">
                <span style="margin-right: 8px; font-size: 14px;">${section.icon}</span>
                ${section.title}
              </div>
              <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; padding: 12px;">
                ${sectionHTML || `
                  <div style="font-size: 11px; color: #9ca3af; font-style: italic;">
                    Seção não preenchida
                  </div>
                `}
              </div>
            </div>
          `;
        }).join('');
      };

      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; line-height: 1.4; }
            .container { max-width: 800px; margin: 0 auto; background-color: #ffffff; }
            .page-break { page-break-before: always; }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- Cabeçalho -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; margin-bottom: 0;">
              <div style="text-align: center;">
                <h1 style="margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                  ANAMNESE MUSICOTERAPÊUTICA
                </h1>
                <div style="margin-top: 8px; font-size: 14px; opacity: 0.9;">
                  Avaliação Inicial para Intervenção Musicoterapêutica
                </div>
              </div>
            </div>

            <!-- Informações do Documento -->
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; margin-bottom: 24px;">
              <div style="margin-bottom: 12px;">
                <div style="font-weight: 600; font-size: 12px; color: #374151; margin-bottom: 4px;">
                  PACIENTE:
                </div>
                <div style="font-size: 16px; font-weight: 600; color: #1f2937;">
                  ${patientName}
                </div>
              </div>
              <div style="margin-bottom: 12px;">
                <div style="font-weight: 600; font-size: 12px; color: #374151; margin-bottom: 4px;">
                  DATA DA AVALIAÇÃO:
                </div>
                <div style="font-size: 14px; color: #1f2937;">
                  ${new Date(anamnesisData.created_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </div>
              <div>
                <div style="font-weight: 600; font-size: 12px; color: #374151; margin-bottom: 4px;">
                  MUSICOTERAPEUTA RESPONSÁVEL:
                </div>
                <div style="font-size: 14px; color: #1f2937;">
                  <strong>Nome:</strong> ${professional.name || 'Não informado'}<br>
                  <strong>Email:</strong> ${professional.email}<br>
                  <strong>Telefone:</strong> ${professional.phone || 'Não informado'}<br>
                  <strong>Registro:</strong> ${professional.register || professional.license_number || 'Não informado'}
                  ${professional.specialty ? `<br><strong>Especialidade:</strong> ${professional.specialty}` : ''}
                  ${professional.association ? `<br><strong>Associação:</strong> ${professional.association}` : ''}
                </div>
              </div>
            </div>

            <!-- Aviso sobre campos não preenchidos -->
            <div style="background-color: #fef3c7; border: 1px solid #fbbf24; padding: 12px; margin-bottom: 24px; border-radius: 8px;">
              <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 16px; margin-right: 8px;">ℹ️</span>
                <div style="font-weight: 600; font-size: 12px; color: #92400e;">
                  INFORMAÇÕES SOBRE PREENCHIMENTO
                </div>
              </div>
              <div style="font-size: 11px; color: #92400e; line-height: 1.4;">
                • <strong>"Não informado":</strong> Campo padrão não preenchido<br>
                • <strong>"Campo disponível para preenchimento posterior":</strong> Seção adicionada recentemente que pode ser preenchida em futuras atualizações da anamnese<br>
                • <strong>"Nenhum item selecionado":</strong> Seção de múltipla escolha sem seleções
              </div>
            </div>

            <!-- Conteúdo das Seções -->
            <div style="padding: 0 16px;">
              ${renderSections()}
            </div>

            <!-- Rodapé TEAL Unificado -->
            <div style="margin-top: 50px; border: 3px solid transparent; border-image: linear-gradient(135deg, #0d9488, #14b8a6, #06b6d4) 1; border-radius: 16px; overflow: hidden; background: #ffffff; box-shadow: 0 8px 24px rgba(13, 148, 136, 0.15);">
              
              <!-- Barra Decorativa Superior 8px -->
              <div style="height: 8px; background: linear-gradient(90deg, #0d9488 0%, #14b8a6 50%, #06b6d4 100%);"></div>
              
              <!-- Seção Principal - padding 32px -->
              <div style="padding: 32px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: start;">
                  
                  <!-- ESQUERDA: Card de Assinatura -->
                  <div style="background: linear-gradient(135deg, #f0fdfa, #ccfbf1); border: 2px solid #14b8a6; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(20,184,166,0.15);">
                    
                    <!-- Barra decorativa 8px -->
                    <div style="height: 8px; background: linear-gradient(to right, #0d9488, #14b8a6, #06b6d4);"></div>
                    
                    <div style="padding: 20px;">
                      <!-- Layout horizontal: Foto + Info -->
                      <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
                        
                        ${professionalPhotoBase64 ? `
                        <!-- Foto com Blur 80x80 -->
                        <div style="position: relative; width: 80px; height: 80px; flex-shrink: 0;">
                          <div style="position: absolute; inset: 0; border-radius: 50%; background: linear-gradient(135deg, #14b8a6, #22d3ee, #0d9488); filter: blur(4px); opacity: 0.75;"></div>
                          <div style="position: relative; width: 100%; height: 100%; border-radius: 50%; overflow: hidden; border: 3px solid #fff;">
                            <img src="${professionalPhotoBase64}" style="width: 100%; height: 100%; object-fit: cover;" />
                          </div>
                        </div>
                        ` : ''}
                        
                        <!-- Info do Profissional -->
                        <div style="flex: 1;">
                          <div style="font-size: 16px; font-weight: bold; color: #0f766e; margin-bottom: 8px; line-height: 1.3;">
                            ${professional.name || 'Nome do Profissional'}
                          </div>
                          <div style="background-color: #ccfbf1; border: 1px solid #99f6e4; border-radius: 20px; padding: 4px 12px; display: inline-block;">
                            <span style="font-size: 11px; color: #0f766e; font-weight: 600;">🎵 ${professional.specialty || 'Musicoterapeuta'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Contatos -->
                      <div style="font-size: 12px; color: #374151; line-height: 1.6;">
                        ${professional.register || professional.license_number ? `<div style="margin-bottom: 4px;"><span>📋</span> ${professional.register || professional.license_number}</div>` : ''}
                        ${professional.email ? `<div style="margin-bottom: 4px;"><span>📧</span> ${professional.email}</div>` : ''}
                        ${professional.phone ? `<div><span>📞</span> ${professional.phone}</div>` : ''}
                      </div>
                    </div>
                    
                    <!-- Verification Footer -->
                    <div style="border-top: 1px solid #99f6e4; background: linear-gradient(to right, #f0fdfa, #ecfeff, #f0fdfa); padding: 12px 16px;">
                      <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                        <span style="color: #0d9488;">✓</span>
                        <span style="font-size: 12px; font-weight: 600; color: #0f766e;">Assinatura Digital Verificada</span>
                        <span style="color: #0d9488;">🎵</span>
                        <span style="font-size: 12px; color: #6b7280;">Sistema MuseTera</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- DIREITA: Carimbo Circular 280x280 -->
                  <div style="display: flex; flex-direction: column; align-items: center;">
                    ${professionalPhotoBase64 ? `
                    <!-- Container Outer 280x280 -->
                    <div style="width: 280px; height: 280px; position: relative; display: flex; align-items: center; justify-content: center;">
                      <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; border: 3px dashed #14b8a6; opacity: 0.3;"></div>
                      
                      <!-- Main Stamp Circle 240x240 -->
                      <div style="width: 240px; height: 240px; border-radius: 50%; background: linear-gradient(135deg, #f0fdfa, #ccfbf1); border: 4px solid #14b8a6; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; box-shadow: 0 8px 24px rgba(20,184,166,0.2), inset 0 2px 8px rgba(20,184,166,0.1); position: relative;">
                        
                        <!-- Foto no Carimbo 70x70 -->
                        <div style="width: 70px; height: 70px; border-radius: 50%; overflow: hidden; border: 3px solid #14b8a6; margin-bottom: 12px;">
                          <img src="${professionalPhotoBase64}" style="width: 100%; height: 100%; object-fit: cover;" />
                        </div>
                        
                        <!-- Nome -->
                        <div style="font-size: 14px; font-weight: bold; color: #0f766e; text-align: center; margin-bottom: 8px; line-height: 1.2;">
                          ${professional.name || 'Nome do Profissional'}
                        </div>
                        
                        <!-- Divider 80px -->
                        <div style="width: 80px; height: 2px; background: linear-gradient(to right, transparent, #14b8a6, transparent); margin-bottom: 8px;"></div>
                        
                        <!-- Specialty Badge -->
                        <div style="background-color: #ccfbf1; border: 1px solid #99f6e4; border-radius: 16px; padding: 4px 12px; margin-bottom: 6px;">
                          <span style="font-size: 10px; color: #0f766e; font-weight: 600;">🎵 ${professional.specialty || 'Musicoterapeuta'}</span>
                        </div>
                        
                        <!-- Registry -->
                        ${professional.register || professional.license_number ? `
                        <div style="font-size: 11px; color: #374151; font-weight: 600;">
                          ${professional.register || professional.license_number}
                        </div>
                        ` : ''}
                      </div>
                    </div>
                    
                    <!-- Verified Badge GRADIENT -->
                    <div style="margin-top: 16px; background: linear-gradient(135deg, #0d9488, #0891b2); color: white; padding: 8px 20px; border-radius: 20px; font-size: 11px; font-weight: 600; display: flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(13,148,136,0.3);">
                      <span>✓</span>
                      <span>MuseTera Verified</span>
                      <span>🎵</span>
                    </div>
                    ` : `
                    <!-- Fallback sem foto -->
                    <div style="width: 240px; height: 240px; border: 3px dashed #14b8a6; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; color: #6b7280; background-color: #f0fdfa;">
                      🔖 Carimbo Digital
                    </div>
                    `}
                  </div>
                  
                </div>
              </div>
            </div>

            <!-- Informações do Documento -->
            <div style="font-size: 10px; color: #6b7280; text-align: center; margin-top: 16px;">
              <div style="margin-bottom: 4px;">
                <strong>Documento gerado em:</strong> ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}
              </div>
              <div style="font-size: 9px; color: #9ca3af;">
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

    console.log("📄 Gerando PDF com html2pdf...");
    await html2pdf().from(element).set(opt).save();
    console.log("✅ PDF gerado com sucesso!");
    return true;
  } catch (error) {
    console.error("❌ Erro ao gerar PDF profissional:", error);
    return false;
  }
};
