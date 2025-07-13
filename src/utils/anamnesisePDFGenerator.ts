
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
}

interface ProfessionalData {
  name?: string;
  email: string;
}

export const generateProfessionalAnamnesePDF = async (
  anamnesisData: AnamnesisData,
  professional: ProfessionalData,
  patientName: string
): Promise<boolean> => {
  try {
    console.log("🎯 Iniciando geração do PDF profissional...");
    
    const element = document.createElement('div');
    
    const generateProfessionalHTML = () => {
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
            { key: "main_clinical_demand", label: "Demanda Clínica Principal" },
            { key: "therapeutic_goals", label: "Objetivos Terapêuticos" },
            { key: "treatment_approach", label: "Abordagem de Tratamento" }
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
          icon: "🎼",
          fields: [
            { key: "pregnancy_sound_experiences", label: "Vivências sonoras durante a gravidez" },
            { key: "mother_movements_songs", label: "Movimentos corporais e canções da mãe" },
            { key: "childhood_sound_environment", label: "Ambiente sonoro durante a infância" },
            { key: "parents_sound_reactions", label: "Reações dos pais aos sons e aos ruídos" },
            { key: "typical_house_sounds", label: "Os sons típicos da casa (bater de portas, gritos, prantos, ruídos de mastigar, tiques com sons, murmúrios, assobios, etc...)" },
            { key: "night_body_sounds", label: "Sons durante a noite e sons corporais" },
            { key: "family_musical_history", label: "História Musical da família" },
            { key: "patient_musical_history", label: "História musical do paciente" }
          ]
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
      const renderTextField = (field: { key: string; label: string }) => {
        if (!anamnesisData[field.key]) return '';
        return `
          <div style="margin-bottom: 12px;">
            <div style="font-weight: 600; font-size: 12px; color: #374151; margin-bottom: 4px;">
              ${field.label}:
            </div>
            <div style="background-color: #f8fafc; padding: 8px; border-radius: 6px; border: 1px solid #e2e8f0; font-size: 11px; line-height: 1.4; color: #1f2937; min-height: 20px;">
              ${anamnesisData[field.key]}
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

      // Renderizar seções
      const renderSections = () => {
        return sections.map(section => {
          let hasContent = false;
          let sectionHTML = '';

          // Verificar se há campos de texto
          if (section.fields) {
            const textFieldsHTML = section.fields.map(renderTextField).filter(html => html).join('');
            if (textFieldsHTML) {
              sectionHTML += textFieldsHTML;
              hasContent = true;
            }
          }

          // Verificar se há checkboxes marcados
          if (section.checkboxes) {
            const checkboxHTML = renderCheckboxSection(section.checkboxes);
            if (checkboxHTML) {
              sectionHTML += checkboxHTML;
              hasContent = true;
            }
          }

          if (!hasContent) return '';

          return `
            <div style="margin-bottom: 20px; page-break-inside: avoid;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 8px 12px; border-radius: 8px 8px 0 0; font-weight: 600; font-size: 13px;">
                <span style="margin-right: 8px; font-size: 14px;">${section.icon}</span>
                ${section.title}
              </div>
              <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; padding: 12px;">
                ${sectionHTML}
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
                  ${professional.name || 'Não informado'} | ${professional.email}
                </div>
              </div>
            </div>

            <!-- Conteúdo das Seções -->
            <div style="padding: 0 16px;">
              ${renderSections()}
            </div>

            <!-- Rodapé -->
            <div style="margin-top: 40px; padding: 20px; background-color: #f8fafc; border-top: 2px solid #e2e8f0;">
              <div style="text-align: center; margin-bottom: 16px;">
                <div style="border-top: 1px solid #9ca3af; width: 200px; margin: 0 auto 8px auto;"></div>
                <div style="font-size: 12px; color: #6b7280;">
                  Assinatura do Musicoterapeuta Responsável
                </div>
              </div>
              
              <div style="font-size: 10px; color: #6b7280; text-align: center;">
                <div style="margin-bottom: 8px;">
                  <strong>Documento gerado em:</strong>
                  ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}
                </div>
                <div style="margin-bottom: 8px;">
                  <strong>Sistema:</strong>
                  Musetera - Gestão para Musicoterapia
                </div>
                <div style="font-size: 9px; color: #9ca3af;">
                  Este documento contém informações confidenciais protegidas pelo sigilo profissional
                </div>
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
