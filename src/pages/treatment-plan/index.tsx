import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SelectField } from "./components/SelectField";
import { ScaleField } from "./components/ScaleField";
import { TextAreaField } from "./components/TextAreaField";
import { PatientSelect } from "../anamnesis/components/PatientSelect";
import { ModernFormCard } from "../anamnesis/components/ModernFormCard";
import html2pdf from "html2pdf.js";
import { 
  FileText, 
  Settings, 
  Target, 
  Zap, 
  Download,
  ArrowLeft,
  Music,
  Brain,
  Heart,
  Users,
  Clock,
  Stethoscope
} from "lucide-react";

type Patient = {
  id: string;
  name: string;
};

export default function TreatmentPlanForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  const [formData, setFormData] = useState({
    approach_type: "",
    intervention_frequency: "",
    session_duration: "",
    treatment_model: "",
    musical_methods: "",
    therapeutic_focus: "",
    expected_outcomes: "",
    evaluation_criteria: "",
    intervention_strategies: "",
    musical_resources: "",
    additional_notes: "",
    
    // TEA - Perfil Sensorial Musical
    auditory_sensitivity: 5,
    frequency_responsiveness: 5,
    volume_tolerance: 5,
    texture_preference: 5,
    rhythmic_processing: 5,
    
    // TEA - Comunicação Social Musical
    musical_communication: 5,
    non_verbal_expression: 5,
    social_interaction_music: 5,
    joint_attention_music: 5,
    imitation_skills: 5,
    
    // TEA - Comportamentos Musicais
    musical_stereotypies: 5,
    ritual_behaviors: 5,
    sensory_seeking: 5,
    self_regulation_music: 5,
    behavioral_flexibility: 5,
    
    // TEA - Campos de Texto Específicos
    tea_approach_methodology: "",
    adaptive_resources: "",
    communication_strategies: "",
    sensory_program: "",
    family_guidance: "",
    evaluation_methods: "",
  });

  const formatNameFromEmail = (email: string) => {
    const namePart = email.split('@')[0];
    return namePart
      .split(/[._-]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Get user with proper session validation
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error("Erro de autenticação:", authError);
        throw new Error("Usuário não autenticado");
      }

      console.log("Usuário autenticado:", user.id, user.email);
      setUserEmail(user.email || "");
      setUserName(formatNameFromEmail(user.email || ""));

      // First strategy: Try to get patients using auth.uid() directly (most common case)
      console.log("Estratégia 1: Buscando pacientes com user_id:", user.id);
      let { data: patients, error: patientsError } = await supabase
        .from("patients")
        .select("id, name, professional_id")
        .eq("professional_id", user.id)
        .order("name");

      if (patientsError) {
        console.error("Erro ao buscar pacientes (estratégia 1):", patientsError);
        throw patientsError;
      }

      console.log("Pacientes encontrados (estratégia 1):", patients?.length || 0);

      // If no patients found, try to find via professionals table
      if (!patients || patients.length === 0) {
        console.log("Estratégia 2: Buscando via tabela professionals...");
        
        const { data: professionalData, error: profError } = await supabase
          .from("professionals")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (professionalData && !profError) {
          console.log("Profissional encontrado:", professionalData.id);
          
          const { data: profPatients, error: profPatientsError } = await supabase
            .from("patients")
            .select("id, name, professional_id")
            .eq("professional_id", professionalData.id)
            .order("name");

          if (profPatientsError) {
            console.error("Erro ao buscar pacientes (estratégia 2):", profPatientsError);
          } else {
            patients = profPatients;
            console.log("Pacientes encontrados (estratégia 2):", patients?.length || 0);
          }
        }
      }

      // Log final results
      console.log("Total de pacientes carregados:", patients?.length || 0);
      if (patients && patients.length > 0) {
        console.log("Primeiros pacientes:", patients.slice(0, 3));
      }
      
      setPatients(patients || []);
      
    } catch (error) {
      console.error("Erro ao carregar pacientes:", error);
      toast({
        title: "Erro",
        description: `Não foi possível carregar a lista de pacientes: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const translateApproachType = (value: string): string => {
    const translations: Record<string, string> = {
      'behavioral': 'Musicoterapia Comportamental',
      'nordoff_robbins': 'Modelo Nordoff-Robbins',
      'nordoff_robbins_tea': 'Modelo Nordoff-Robbins para TEA',
      'neurologic': 'Musicoterapia Neurológica (NMT)',
      'nmt_tea': 'Musicoterapia Neurológica para TEA',
      'analytical': 'Musicoterapia Analítica',
      'creative': 'Processos Criativos em Musicoterapia',
      'gim': 'Imagery Guiada e Música (GIM)',
      'dir_floortime': 'DIR/Floortime Musical',
      'teacch_music': 'TEACCH Musical',
      'aba_music': 'ABA Musical',
      'sensory_integration': 'Integração Sensorial Musical',
    };
    return translations[value] || value;
  };

  const translateInterventionFrequency = (value: string): string => {
    const translations: Record<string, string> = {
      'twice_week': '2 vezes por semana',
      'weekly': 'Semanal',
      'biweekly': 'Quinzenal',
      'monthly': 'Mensal',
    };
    return translations[value] || value;
  };

  const translateSessionDuration = (value: string): string => {
    const translations: Record<string, string> = {
      '30min': '30 minutos',
      '45min': '45 minutos',
      '60min': '60 minutos',
      '90min': '90 minutos',
    };
    return translations[value] || value;
  };

  const translateTreatmentModel = (value: string): string => {
    const translations: Record<string, string> = {
      'individual': 'Terapia Individual',
      'group': 'Terapia em Grupo',
      'family': 'Terapia Familiar',
      'mixed': 'Modelo Misto',
    };
    return translations[value] || value;
  };

  const translateMusicalMethods = (value: string): string => {
    const translations: Record<string, string> = {
      'improvisation': 'Improvisação Clínica',
      'receptive': 'Escuta Musical Terapêutica',
      'recreation': 'Re-criação Musical',
      'composition': 'Composição Terapêutica',
      'combined': 'Métodos Combinados',
    };
    return translations[value] || value;
  };

  const translateTherapeuticFocus = (value: string): string => {
    const translations: Record<string, string> = {
      'emotional': 'Regulação Emocional',
      'cognitive': 'Desenvolvimento Cognitivo',
      'motor': 'Habilidades Motoras',
      'social': 'Interação Social',
      'communication': 'Comunicação',
      'multiple': 'Múltiplos Focos',
    };
    return translations[value] || value;
  };

  const translateExpectedOutcomes = (value: string): string => {
    const translations: Record<string, string> = {
      'emotional_regulation': 'Melhora na Regulação Emocional',
      'skill_development': 'Desenvolvimento de Habilidades',
      'social_improvement': 'Progresso na Interação Social',
      'functional_gains': 'Ganhos Funcionais',
      'quality_life': 'Aumento na Qualidade de Vida',
    };
    return translations[value] || value;
  };

  const translateInterventionStrategies = (value: string): string => {
    const translations: Record<string, string> = {
      'active_music': 'Musicoterapia Ativa',
      'receptive_music': 'Musicoterapia Receptiva',
      'combined_approach': 'Abordagem Combinada',
      'iso_principle': 'Princípio ISO',
      'entrainment': 'Entrainment',
    };
    return translations[value] || value;
  };

  const translateMusicalResources = (value: string): string => {
    const translations: Record<string, string> = {
      'percussion': 'Instrumentos de Percussão',
      'melodic': 'Instrumentos Melódicos',
      'voice': 'Recursos Vocais',
      'technology': 'Tecnologia Musical',
      'mixed_resources': 'Recursos Mistos',
      'adaptive_instruments': 'Instrumentos Adaptativos',
      'sensory_instruments': 'Instrumentos Sensoriais',
      'communication_devices': 'Dispositivos de Comunicação Musical',
      'assistive_technology': 'Tecnologia Assistiva Musical',
    };
    return translations[value] || value;
  };

  // Novas funções de tradução para campos TEA
  const translateTeaApproachMethodology = (value: string): string => {
    const translations: Record<string, string> = {
      'dir_floortime': 'DIR/Floortime Musical - Desenvolvimento individual baseado nas forças e desafios únicos da criança',
      'teacch_structured': 'TEACCH Musical - Ensino estruturado com suporte visual e musical',
      'aba_music': 'ABA Musical - Análise comportamental aplicada com reforços musicais',
      'sensory_integration': 'Integração Sensorial Musical - Foco no processamento sensorial através da música',
      'pecs_musical': 'PECS Musical - Sistema de comunicação por intercâmbio de figuras musicais',
    };
    return translations[value] || value;
  };

  const translateAdaptiveResources = (value: string): string => {
    const translations: Record<string, string> = {
      'switch_instruments': 'Instrumentos com Adaptadores de Acionamento',
      'vibrotactile': 'Instrumentos Vibrotáteis',
      'visual_cues': 'Instrumentos com Pistas Visuais',
      'simplified_interfaces': 'Interfaces Musicais Simplificadas',
      'sensory_friendly': 'Instrumentos Sensorialmente Apropriados',
    };
    return translations[value] || value;
  };

  const generateScaleVisualization = (value: number, label: string) => {
    if (!value) return '';
    
    const percentage = (value / 10) * 100;
    const getScaleColor = (val: number) => {
      if (val <= 3) return '#DC2626'; // red-600
      if (val <= 6) return '#D97706'; // amber-600
      return '#059669'; // emerald-600
    };
    
    const getScaleLabel = (val: number) => {
      if (val <= 3) return 'Baixo';
      if (val <= 6) return 'Moderado';
      return 'Alto';
    };
    
    return `
      <div style="margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <span style="font-weight: 600; font-size: 12px; color: #374151;">${label}</span>
          <span style="font-weight: 700; color: ${getScaleColor(value)}; font-size: 14px;">${value}/10 - ${getScaleLabel(value)}</span>
        </div>
        <div style="width: 100%; height: 12px; background-color: #F3F4F6; border-radius: 6px; overflow: hidden;">
          <div style="width: ${percentage}%; height: 100%; background-color: ${getScaleColor(value)}; transition: width 0.3s ease;"></div>
        </div>
      </div>
    `;
  };

  const generatePDF = async () => {
    if (!selectedPatient) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um paciente antes de gerar o PDF.",
        variant: "destructive",
      });
      return;
    }

    const element = document.createElement('div');
    
    const generateContentHTML = (content: Record<string, any>) => {
      const translatedContent = {
        ...content,
        approach_type: content.approach_type ? translateApproachType(content.approach_type) : '',
        intervention_frequency: content.intervention_frequency ? translateInterventionFrequency(content.intervention_frequency) : '',
        session_duration: content.session_duration ? translateSessionDuration(content.session_duration) : '',
        treatment_model: content.treatment_model ? translateTreatmentModel(content.treatment_model) : '',
        musical_methods: content.musical_methods ? translateMusicalMethods(content.musical_methods) : '',
        therapeutic_focus: content.therapeutic_focus ? translateTherapeuticFocus(content.therapeutic_focus) : '',
        expected_outcomes: content.expected_outcomes ? translateExpectedOutcomes(content.expected_outcomes) : '',
        intervention_strategies: content.intervention_strategies ? translateInterventionStrategies(content.intervention_strategies) : '',
        musical_resources: content.musical_resources ? translateMusicalResources(content.musical_resources) : '',
        additional_notes: content.additional_notes || ''
      };

      let htmlContent = '';

      // Configuração do Tratamento
      if (content.approach_type || content.intervention_frequency || content.session_duration) {
        htmlContent += `
          <div style="margin-bottom: 32px; page-break-inside: avoid;">
            <h2 style="color: #2563EB; font-size: 18px; font-weight: 700; margin-bottom: 16px; padding: 8px 0; border-bottom: 3px solid #2563EB; display: flex; align-items: center;">
              <span style="margin-right: 8px;">⚙️</span> Configuração do Tratamento
            </h2>
            <div style="background: linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 100%); padding: 20px; border-radius: 12px; border-left: 4px solid #2563EB;">
              ${content.approach_type ? `
                <div style="margin-bottom: 16px;">
                  <div style="font-weight: 600; font-size: 14px; color: #1E40AF; margin-bottom: 6px;">📋 Abordagem Terapêutica</div>
                  <div style="background-color: white; padding: 12px; border-radius: 8px; font-size: 13px; line-height: 1.6; color: #374151; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">${translatedContent.approach_type}</div>
                </div>
              ` : ''}
              ${content.intervention_frequency ? `
                <div style="margin-bottom: 16px;">
                  <div style="font-weight: 600; font-size: 14px; color: #1E40AF; margin-bottom: 6px;">📅 Frequência das Intervenções</div>
                  <div style="background-color: white; padding: 12px; border-radius: 8px; font-size: 13px; line-height: 1.6; color: #374151; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">${translatedContent.intervention_frequency}</div>
                </div>
              ` : ''}
              ${content.session_duration ? `
                <div style="margin-bottom: 0;">
                  <div style="font-weight: 600; font-size: 14px; color: #1E40AF; margin-bottom: 6px;">⏱️ Duração das Sessões</div>
                  <div style="background-color: white; padding: 12px; border-radius: 8px; font-size: 13px; line-height: 1.6; color: #374151; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">${translatedContent.session_duration}</div>
                </div>
              ` : ''}
            </div>
          </div>
        `;
      }

      // Metodologia e Recursos
      if (content.treatment_model || content.musical_methods) {
        htmlContent += `
          <div style="margin-bottom: 32px; page-break-inside: avoid;">
            <h2 style="color: #059669; font-size: 18px; font-weight: 700; margin-bottom: 16px; padding: 8px 0; border-bottom: 3px solid #059669; display: flex; align-items: center;">
              <span style="margin-right: 8px;">🎵</span> Metodologia e Recursos
            </h2>
            <div style="background: linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%); padding: 20px; border-radius: 12px; border-left: 4px solid #059669;">
              ${content.treatment_model ? `
                <div style="margin-bottom: 16px;">
                  <div style="font-weight: 600; font-size: 14px; color: #065F46; margin-bottom: 6px;">🎯 Modelo de Tratamento</div>
                  <div style="background-color: white; padding: 12px; border-radius: 8px; font-size: 13px; line-height: 1.6; color: #374151; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">${translatedContent.treatment_model}</div>
                </div>
              ` : ''}
              ${content.musical_methods ? `
                <div style="margin-bottom: 0;">
                  <div style="font-weight: 600; font-size: 14px; color: #065F46; margin-bottom: 6px;">🎶 Métodos Musicais</div>
                  <div style="background-color: white; padding: 12px; border-radius: 8px; font-size: 13px; line-height: 1.6; color: #374151; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">${translatedContent.musical_methods}</div>
                </div>
              ` : ''}
            </div>
          </div>
        `;
      }

      // Objetivos e Avaliação
      if (content.therapeutic_focus || content.expected_outcomes) {
        htmlContent += `
          <div style="margin-bottom: 32px; page-break-inside: avoid;">
            <h2 style="color: #7C3AED; font-size: 18px; font-weight: 700; margin-bottom: 16px; padding: 8px 0; border-bottom: 3px solid #7C3AED; display: flex; align-items: center;">
              <span style="margin-right: 8px;">🎯</span> Objetivos e Avaliação
            </h2>
            <div style="background: linear-gradient(135deg, #FAF5FF 0%, #FDF4FF 100%); padding: 20px; border-radius: 12px; border-left: 4px solid #7C3AED;">
              ${content.therapeutic_focus ? `
                <div style="margin-bottom: 16px;">
                  <div style="font-weight: 600; font-size: 14px; color: #5B21B6; margin-bottom: 6px;">🔍 Foco Terapêutico</div>
                  <div style="background-color: white; padding: 12px; border-radius: 8px; font-size: 13px; line-height: 1.6; color: #374151; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">${translatedContent.therapeutic_focus}</div>
                </div>
              ` : ''}
              ${content.expected_outcomes ? `
                <div style="margin-bottom: 0;">
                  <div style="font-weight: 600; font-size: 14px; color: #5B21B6; margin-bottom: 6px;">📈 Resultados Esperados</div>
                  <div style="background-color: white; padding: 12px; border-radius: 8px; font-size: 13px; line-height: 1.6; color: #374151; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">${translatedContent.expected_outcomes}</div>
                </div>
              ` : ''}
            </div>
          </div>
        `;
      }

      // Estratégias e Recursos
      if (content.intervention_strategies || content.musical_resources) {
        htmlContent += `
          <div style="margin-bottom: 32px; page-break-inside: avoid;">
            <h2 style="color: #DC2626; font-size: 18px; font-weight: 700; margin-bottom: 16px; padding: 8px 0; border-bottom: 3px solid #DC2626; display: flex; align-items: center;">
              <span style="margin-right: 8px;">🛠️</span> Estratégias e Recursos
            </h2>
            <div style="background: linear-gradient(135deg, #FEF2F2 0%, #FFF5F5 100%); padding: 20px; border-radius: 12px; border-left: 4px solid #DC2626;">
              ${content.intervention_strategies ? `
                <div style="margin-bottom: 16px;">
                  <div style="font-weight: 600; font-size: 14px; color: #991B1B; margin-bottom: 6px;">💡 Estratégias de Intervenção</div>
                  <div style="background-color: white; padding: 12px; border-radius: 8px; font-size: 13px; line-height: 1.6; color: #374151; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">${translatedContent.intervention_strategies}</div>
                </div>
              ` : ''}
              ${content.musical_resources ? `
                <div style="margin-bottom: 0;">
                  <div style="font-weight: 600; font-size: 14px; color: #991B1B; margin-bottom: 6px;">🎹 Recursos Musicais</div>
                  <div style="background-color: white; padding: 12px; border-radius: 8px; font-size: 13px; line-height: 1.6; color: #374151; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">${translatedContent.musical_resources}</div>
                </div>
              ` : ''}
            </div>
          </div>
        `;
      }

      // Perfil Sensorial Musical (TEA) - com escalas visuais
      const hasMusicalSensoryData = content.auditory_sensitivity || content.sound_frequency_preference || 
        content.sound_texture_preference || content.rhythm_sensitivity || content.sensory_processing;
      
      if (hasMusicalSensoryData) {
        htmlContent += `
          <div style="margin-bottom: 32px; page-break-inside: avoid;">
            <h2 style="color: #EA580C; font-size: 18px; font-weight: 700; margin-bottom: 16px; padding: 8px 0; border-bottom: 3px solid #EA580C; display: flex; align-items: center;">
              <span style="margin-right: 8px;">🧠</span> Perfil Sensorial Musical (TEA)
            </h2>
            <div style="background: linear-gradient(135deg, #FFF7ED 0%, #FFFBEB 100%); padding: 20px; border-radius: 12px; border-left: 4px solid #EA580C;">
              <div style="margin-bottom: 16px;">
                <div style="font-weight: 600; font-size: 14px; color: #9A3412; margin-bottom: 12px;">📊 Avaliação Quantitativa (Escalas 1-10)</div>
                <div style="background-color: white; padding: 16px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  ${content.auditory_sensitivity ? generateScaleVisualization(content.auditory_sensitivity, 'Sensibilidade Auditiva') : ''}
                  ${content.sound_frequency_preference ? generateScaleVisualization(content.sound_frequency_preference, 'Preferência por Frequências Sonoras') : ''}
                  ${content.sound_texture_preference ? generateScaleVisualization(content.sound_texture_preference, 'Preferência por Texturas Sonoras') : ''}
                  ${content.rhythm_sensitivity ? generateScaleVisualization(content.rhythm_sensitivity, 'Sensibilidade Rítmica') : ''}
                  ${content.sensory_processing ? generateScaleVisualization(content.sensory_processing, 'Processamento Sensorial Geral') : ''}
                </div>
              </div>
            </div>
          </div>
          <div class="page-break-after"></div>
        `;
      }

      // Comunicação Social Musical (TEA) - com escalas visuais
      const hasSocialCommunicationData = content.musical_social_interaction || content.musical_attention || 
        content.musical_imitation || content.musical_turn_taking || content.musical_emotional_expression;
      
      if (hasSocialCommunicationData) {
        htmlContent += `
          <div style="margin-bottom: 32px; page-break-inside: avoid;">
            <h2 style="color: #0891B2; font-size: 18px; font-weight: 700; margin-bottom: 16px; padding: 8px 0; border-bottom: 3px solid #0891B2; display: flex; align-items: center;">
              <span style="margin-right: 8px;">🤝</span> Comunicação Social Musical (TEA)
            </h2>
            <div style="background: linear-gradient(135deg, #F0FDFA 0%, #F0F9FF 100%); padding: 20px; border-radius: 12px; border-left: 4px solid #0891B2;">
              <div style="margin-bottom: 16px;">
                <div style="font-weight: 600; font-size: 14px; color: #0E7490; margin-bottom: 12px;">📊 Avaliação Quantitativa (Escalas 1-10)</div>
                <div style="background-color: white; padding: 16px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  ${content.musical_social_interaction ? generateScaleVisualization(content.musical_social_interaction, 'Interação Social através da Música') : ''}
                  ${content.musical_attention ? generateScaleVisualization(content.musical_attention, 'Atenção Musical Compartilhada') : ''}
                  ${content.musical_imitation ? generateScaleVisualization(content.musical_imitation, 'Imitação Musical') : ''}
                  ${content.musical_turn_taking ? generateScaleVisualization(content.musical_turn_taking, 'Alternância Musical') : ''}
                  ${content.musical_emotional_expression ? generateScaleVisualization(content.musical_emotional_expression, 'Expressão Emocional Musical') : ''}
                </div>
              </div>
            </div>
          </div>
          <div class="page-break-after"></div>
        `;
      }

      // Padrões Comportamentais Musicais (TEA) - com escalas visuais
      const hasBehavioralData = content.musical_stereotypies || content.musical_flexibility || 
        content.musical_routine_adaptation || content.musical_frustration_tolerance || content.musical_self_regulation;
      
      if (hasBehavioralData) {
        htmlContent += `
          <div style="margin-bottom: 32px; page-break-inside: avoid;">
            <h2 style="color: #7C2D12; font-size: 18px; font-weight: 700; margin-bottom: 16px; padding: 8px 0; border-bottom: 3px solid #7C2D12; display: flex; align-items: center;">
              <span style="margin-right: 8px;">🔄</span> Padrões Comportamentais Musicais (TEA)
            </h2>
            <div style="background: linear-gradient(135deg, #FEF7F0 0%, #FFFBF0 100%); padding: 20px; border-radius: 12px; border-left: 4px solid #7C2D12;">
              <div style="margin-bottom: 16px;">
                <div style="font-weight: 600; font-size: 14px; color: #92400E; margin-bottom: 12px;">📊 Avaliação Quantitativa (Escalas 1-10)</div>
                <div style="background-color: white; padding: 16px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  ${content.musical_stereotypies ? generateScaleVisualization(content.musical_stereotypies, 'Estereotipias Musicais') : ''}
                  ${content.musical_flexibility ? generateScaleVisualization(content.musical_flexibility, 'Flexibilidade Musical') : ''}
                  ${content.musical_routine_adaptation ? generateScaleVisualization(content.musical_routine_adaptation, 'Adaptação a Mudanças na Rotina Musical') : ''}
                  ${content.musical_frustration_tolerance ? generateScaleVisualization(content.musical_frustration_tolerance, 'Tolerância à Frustração Musical') : ''}
                  ${content.musical_self_regulation ? generateScaleVisualization(content.musical_self_regulation, 'Autorregulação Musical') : ''}
                </div>
              </div>
            </div>
          </div>
        `;
      }

      // Metodologias e Recursos Especializados (TEA) - campos de texto
      const hasSpecializedMethodsData = content.dir_floortime_methods || content.teacch_methods || 
        content.aba_methods || content.nordoff_robbins_methods || content.nmt_methods || content.sensory_integration_methods;
      
      if (hasSpecializedMethodsData) {
        htmlContent += `
          <div style="margin-bottom: 32px; page-break-inside: avoid;">
            <h2 style="color: #BE185D; font-size: 18px; font-weight: 700; margin-bottom: 16px; padding: 8px 0; border-bottom: 3px solid #BE185D; display: flex; align-items: center;">
              <span style="margin-right: 8px;">🎓</span> Metodologias e Recursos Especializados (TEA)
            </h2>
            <div style="background: linear-gradient(135deg, #FDF2F8 0%, #FCF7FF 100%); padding: 20px; border-radius: 12px; border-left: 4px solid #BE185D;">
              ${content.dir_floortime_methods ? `
                <div style="margin-bottom: 16px;">
                  <div style="font-weight: 600; font-size: 14px; color: #9D174D; margin-bottom: 6px;">🎯 Métodos DIR/Floortime Musical</div>
                  <div style="background-color: white; padding: 12px; border-radius: 8px; font-size: 13px; line-height: 1.6; color: #374151; box-shadow: 0 1px 3px rgba(0,0,0,0.1); white-space: pre-wrap;">${content.dir_floortime_methods}</div>
                </div>
              ` : ''}
              ${content.teacch_methods ? `
                <div style="margin-bottom: 16px;">
                  <div style="font-weight: 600; font-size: 14px; color: #9D174D; margin-bottom: 6px;">📚 Métodos TEACCH Musical</div>
                  <div style="background-color: white; padding: 12px; border-radius: 8px; font-size: 13px; line-height: 1.6; color: #374151; box-shadow: 0 1px 3px rgba(0,0,0,0.1); white-space: pre-wrap;">${content.teacch_methods}</div>
                </div>
              ` : ''}
              ${content.aba_methods ? `
                <div style="margin-bottom: 16px;">
                  <div style="font-weight: 600; font-size: 14px; color: #9D174D; margin-bottom: 6px;">🔬 Métodos ABA Musical</div>
                  <div style="background-color: white; padding: 12px; border-radius: 8px; font-size: 13px; line-height: 1.6; color: #374151; box-shadow: 0 1px 3px rgba(0,0,0,0.1); white-space: pre-wrap;">${content.aba_methods}</div>
                </div>
              ` : ''}
              ${content.nordoff_robbins_methods ? `
                <div style="margin-bottom: 16px;">
                  <div style="font-weight: 600; font-size: 14px; color: #9D174D; margin-bottom: 6px;">🎼 Métodos Nordoff-Robbins para TEA</div>
                  <div style="background-color: white; padding: 12px; border-radius: 8px; font-size: 13px; line-height: 1.6; color: #374151; box-shadow: 0 1px 3px rgba(0,0,0,0.1); white-space: pre-wrap;">${content.nordoff_robbins_methods}</div>
                </div>
              ` : ''}
              ${content.nmt_methods ? `
                <div style="margin-bottom: 16px;">
                  <div style="font-weight: 600; font-size: 14px; color: #9D174D; margin-bottom: 6px;">🧠 Métodos NMT para TEA</div>
                  <div style="background-color: white; padding: 12px; border-radius: 8px; font-size: 13px; line-height: 1.6; color: #374151; box-shadow: 0 1px 3px rgba(0,0,0,0.1); white-space: pre-wrap;">${content.nmt_methods}</div>
                </div>
              ` : ''}
              ${content.sensory_integration_methods ? `
                <div style="margin-bottom: 0;">
                  <div style="font-weight: 600; font-size: 14px; color: #9D174D; margin-bottom: 6px;">🌊 Métodos de Integração Sensorial Musical</div>
                  <div style="background-color: white; padding: 12px; border-radius: 8px; font-size: 13px; line-height: 1.6; color: #374151; box-shadow: 0 1px 3px rgba(0,0,0,0.1); white-space: pre-wrap;">${content.sensory_integration_methods}</div>
                </div>
              ` : ''}
            </div>
          </div>
        `;
      }

      // Observações Adicionais
      if (content.additional_notes) {
        htmlContent += `
          <div style="margin-bottom: 32px; page-break-inside: avoid;">
            <h2 style="color: #374151; font-size: 18px; font-weight: 700; margin-bottom: 16px; padding: 8px 0; border-bottom: 3px solid #374151; display: flex; align-items: center;">
              <span style="margin-right: 8px;">📝</span> Observações Adicionais
            </h2>
            <div style="background: linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%); padding: 20px; border-radius: 12px; border-left: 4px solid #374151;">
              <div style="background-color: white; padding: 16px; border-radius: 8px; font-size: 13px; line-height: 1.7; color: #374151; box-shadow: 0 1px 3px rgba(0,0,0,0.1); white-space: pre-wrap;">${content.additional_notes}</div>
            </div>
          </div>
        `;
      }

      return htmlContent;
    };

    try {
      console.log("Iniciando geração de PDF...");
      
      const selectedPatientData = patients.find(p => p.id === selectedPatient);
      if (!selectedPatientData) {
        throw new Error("Dados do paciente não encontrados");
      }
      
      console.log("Paciente selecionado:", selectedPatientData.name);
      
      const currentDate = new Date();
      const documentId = `PLN-${currentDate.getFullYear()}${(currentDate.getMonth() + 1).toString().padStart(2, '0')}${currentDate.getDate().toString().padStart(2, '0')}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      element.innerHTML = `
        <div style="padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 100%; margin: 0; background: white; color: #1f2937;">
          
          <!-- CABEÇALHO PROFISSIONAL -->
          <div style="background: linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%); color: white; padding: 40px; margin: 0; text-align: center; position: relative; overflow: hidden;">
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 200"><path d="M0,100 C150,200 350,0 500,100 C650,200 850,0 1000,100 L1000,200 L0,200 Z" fill="rgba(255,255,255,0.1)"/></svg>'); background-size: cover; opacity: 0.3;"></div>
            <div style="position: relative; z-index: 1;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px;">
                <div style="text-align: left;">
                  <div style="background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); padding: 16px 24px; border-radius: 12px; display: inline-block; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
                    <div style="font-size: 28px; font-weight: 900; margin-bottom: 4px; letter-spacing: 2px;">MuseTera</div>
                    <div style="font-size: 14px; opacity: 0.9; font-weight: 500;">Sistema de Musicoterapia</div>
                  </div>
                </div>
                <div style="text-align: right; background: rgba(255,255,255,0.15); padding: 16px 20px; border-radius: 10px; backdrop-filter: blur(10px);">
                  <div style="font-size: 12px; opacity: 0.8; margin-bottom: 4px;">Documento:</div>
                  <div style="font-size: 14px; font-weight: 600; font-family: monospace;">${documentId}</div>
                  <div style="font-size: 11px; opacity: 0.8; margin-top: 8px;">Data: ${currentDate.toLocaleDateString('pt-BR')}</div>
                </div>
              </div>
              
              <h1 style="font-size: 32px; font-weight: 800; margin: 0 0 20px 0; text-shadow: 0 2px 4px rgba(0,0,0,0.3); letter-spacing: 1px;">
                Plano Terapêutico Musicoterapêutico
              </h1>
              <div style="background: rgba(255,255,255,0.2); border-radius: 15px; padding: 20px; backdrop-filter: blur(10px); box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; text-align: left;">
                  <div>
                    <div style="font-size: 13px; opacity: 0.8; margin-bottom: 4px; font-weight: 500;">PACIENTE</div>
                    <div style="font-size: 20px; font-weight: 700;">${selectedPatientData?.name || 'Não informado'}</div>
                  </div>
                  <div style="text-align: right;">
                    <div style="font-size: 13px; opacity: 0.8; margin-bottom: 4px; font-weight: 500;">MUSICOTERAPEUTA</div>
                    <div style="font-size: 18px; font-weight: 600;">${userName || 'Não informado'}</div>
                    <div style="font-size: 12px; opacity: 0.9; margin-top: 2px;">${userEmail || 'Email não informado'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- CONTEÚDO PRINCIPAL -->
          <div style="padding: 40px; background: white;">
            ${generateContentHTML(formData)}
          </div>

          <!-- RODAPÉ PROFISSIONAL -->
          <div style="margin-top: 40px; padding: 30px 40px; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-top: 4px solid #2563eb;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 20px;">
              <!-- Informações do Sistema -->
              <div>
                <div style="font-weight: 700; font-size: 14px; color: #2563eb; margin-bottom: 8px;">📋 INFORMAÇÕES DO DOCUMENTO</div>
                <div style="font-size: 11px; color: #64748b; line-height: 1.6;">
                  <div>• Gerado em: ${currentDate.toLocaleDateString('pt-BR')} às ${currentDate.toLocaleTimeString('pt-BR')}</div>
                  <div>• Sistema: MuseTera v2.0 - Gestão de Musicoterapia</div>
                  <div>• Código: ${documentId}</div>
                  <div>• Validade: Este plano deve ser revisado periodicamente</div>
                </div>
              </div>
              
              <!-- Assinatura Digital -->
              <div style="text-align: right;">
                <div style="font-weight: 700; font-size: 14px; color: #2563eb; margin-bottom: 8px;">✍️ RESPONSÁVEL TÉCNICO</div>
                <div style="font-size: 12px; color: #374151; line-height: 1.6;">
                  <div style="font-weight: 600;">${userName || 'Musicoterapeuta Responsável'}</div>
                  <div>${userEmail || 'email@exemplo.com'}</div>
                  <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #cbd5e1;">
                    <div style="font-size: 10px; color: #64748b;">Assinatura Digital</div>
                    <div style="font-size: 8px; color: #94a3b8; margin-top: 4px;">Este documento foi gerado digitalmente e é válido sem assinatura física</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Legendas das Escalas -->
            <div style="margin-top: 20px; padding: 16px; background: white; border-radius: 8px; border: 1px solid #e2e8f0;">
              <div style="font-weight: 600; font-size: 12px; color: #374151; margin-bottom: 8px;">📊 LEGENDA DAS ESCALAS DE AVALIAÇÃO</div>
              <div style="display: flex; justify-content: space-between; gap: 20px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <div style="width: 12px; height: 12px; background-color: #dc2626; border-radius: 2px;"></div>
                  <span style="font-size: 10px; color: #64748b;">1-3: Baixo</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <div style="width: 12px; height: 12px; background-color: #d97706; border-radius: 2px;"></div>
                  <span style="font-size: 10px; color: #64748b;">4-6: Moderado</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <div style="width: 12px; height: 12px; background-color: #059669; border-radius: 2px;"></div>
                  <span style="font-size: 10px; color: #64748b;">7-10: Alto</span>
                </div>
              </div>
            </div>
            
            <!-- Aviso Legal -->
            <div style="text-align: center; margin-top: 16px;">
              <div style="font-size: 9px; color: #94a3b8; line-height: 1.4;">
                Este plano terapêutico foi elaborado com base nas melhores práticas em musicoterapia e deve ser implementado por profissional qualificado.<br>
                Qualquer alteração deve ser documentada e aprovada pelo musicoterapeuta responsável.
              </div>
            </div>
          </div>
        </div>
      `;

      const opt = {
        margin: [15, 15, 15, 15],
        filename: `Plano_Terapeutico_TEA_${selectedPatientData.name.replace(/\s+/g, '_')}_${currentDate.toISOString().split('T')[0]}.pdf`,
        pagebreak: { 
          mode: 'css',
          before: '.page-break-before',
          after: '.page-break-after'
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
          compress: false,
        },
        html2canvas: {
          scale: 1.5,
          useCORS: true,
          letterRendering: true,
          backgroundColor: '#ffffff',
          logging: true,
          allowTaint: true,
          removeContainer: false,
          foreignObjectRendering: true,
          imageTimeout: 30000,
          scrollX: 0,
          scrollY: 0,
        },
      };

      console.log("Configurações do PDF:", opt);
      console.log("Gerando PDF...");

      // Add to DOM temporarily for rendering
      document.body.appendChild(element);
      
      // Wait longer for fonts, styles and content to load completely
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      await html2pdf().from(element).set(opt).save();
      
      // Remove from DOM
      document.body.removeChild(element);
      
      console.log("PDF gerado com sucesso!");
      
      toast({
        title: "Sucesso!",
        description: "PDF do plano terapêutico TEA gerado com sucesso! Todas as seções específicas foram incluídas.",
      });

    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      
      // Clean up DOM if element was added
      if (document.body.contains(element)) {
        document.body.removeChild(element);
      }
      
      toast({
        title: "Erro na geração do PDF",
        description: `Erro: ${error.message || 'Falha inesperada'}. Verifique se todos os campos estão preenchidos.`,
        variant: "destructive",
      });
    }
  };

  const handleDownloadPDF = async () => {
    if (!selectedPatient) {
      toast({
        title: "Atenção",
        description: "Por favor, selecione um paciente antes de gerar o PDF.",
        variant: "destructive",
      });
      return;
    }

    // Check if any required fields are filled
    const hasContent = Object.values(formData).some(value => 
      typeof value === 'string' ? value.trim() !== "" : value !== 0
    );
    if (!hasContent) {
      toast({
        title: "Atenção",
        description: "Por favor, preencha pelo menos um campo do plano terapêutico antes de gerar o PDF.",
        variant: "destructive",
      });
      return;
    }

    await generatePDF();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPatient) {
      toast({
        title: "Atenção",
        description: "Por favor, selecione um paciente.",
        variant: "destructive",
      });
      return;
    }

    // Check if any required fields are filled
    const hasContent = Object.values(formData).some(value => 
      typeof value === 'string' ? value.trim() !== "" : value !== 0
    );
    if (!hasContent) {
      toast({
        title: "Atenção",
        description: "Por favor, preencha pelo menos um campo do plano terapêutico.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      console.log("Salvando plano terapêutico...");

      // Always use auth.uid() for professional_id as required by RLS policy
      const { error } = await supabase
        .from("treatment_plans")
        .insert({
          ...formData,
          patient_id: selectedPatient,
          professional_id: user.id, // Use user.id (auth.uid()) for RLS compliance
          status: "active",
          created_at: new Date().toISOString(),
        });

      if (error) throw error;

      console.log("Plano terapêutico salvo com sucesso!");

      toast({
        title: "Sucesso!",
        description: "Plano terapêutico salvo com sucesso!",
      });

      setTimeout(() => {
        navigate("/processes");
      }, 2000);

    } catch (error) {
      console.error("Erro ao salvar plano terapêutico:", error);
      toast({
        title: "Erro ao salvar",
        description: `Não foi possível salvar o plano terapêutico: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const sections = [
    {
      title: "Configuração do Tratamento",
      icon: Settings,
      gradient: "from-blue-500 to-blue-600",
      fields: [
        {
          key: "approach_type",
          label: "Abordagem Terapêutica",
          options: [
            { value: "dir_floortime", label: "DIR/Floortime Musical" },
            { value: "teacch_music", label: "TEACCH Musical" },
            { value: "aba_music", label: "ABA Musical" },
            { value: "nordoff_robbins_tea", label: "Modelo Nordoff-Robbins para TEA" },
            { value: "nmt_tea", label: "Musicoterapia Neurológica para TEA" },
            { value: "sensory_integration", label: "Integração Sensorial Musical" },
            { value: "behavioral", label: "Musicoterapia Comportamental" },
            { value: "creative", label: "Processos Criativos em Musicoterapia" },
          ],
        },
        {
          key: "intervention_frequency",
          label: "Frequência das Intervenções",
          options: [
            { value: "twice_week", label: "2 vezes por semana" },
            { value: "weekly", label: "Semanal" },
            { value: "biweekly", label: "Quinzenal" },
            { value: "monthly", label: "Mensal" },
          ],
        },
        {
          key: "session_duration",
          label: "Duração das Sessões",
          options: [
            { value: "30min", label: "30 minutos" },
            { value: "45min", label: "45 minutos" },
            { value: "60min", label: "60 minutos" },
            { value: "90min", label: "90 minutos" },
          ],
        },
      ],
    },
    {
      title: "Metodologia e Recursos",
      icon: Music,
      gradient: "from-purple-500 to-purple-600",
      fields: [
        {
          key: "treatment_model",
          label: "Modelo de Tratamento",
          options: [
            { value: "individual", label: "Terapia Individual" },
            { value: "group", label: "Terapia em Grupo" },
            { value: "family", label: "Terapia Familiar" },
            { value: "mixed", label: "Modelo Misto" },
          ],
        },
        {
          key: "musical_methods",
          label: "Métodos Musicais",
          options: [
            { value: "improvisation", label: "Improvisação Clínica" },
            { value: "receptive", label: "Escuta Musical Terapêutica" },
            { value: "recreation", label: "Re-criação Musical" },
            { value: "composition", label: "Composição Terapêutica" },
            { value: "combined", label: "Métodos Combinados" },
          ],
        },
      ],
    },
    {
      title: "Objetivos e Avaliação",
      icon: Target,
      gradient: "from-green-500 to-green-600",
      fields: [
        {
          key: "therapeutic_focus",
          label: "Foco Terapêutico",
          options: [
            { value: "emotional", label: "Regulação Emocional" },
            { value: "cognitive", label: "Desenvolvimento Cognitivo" },
            { value: "motor", label: "Habilidades Motoras" },
            { value: "social", label: "Interação Social" },
            { value: "communication", label: "Comunicação" },
            { value: "multiple", label: "Múltiplos Focos" },
          ],
        },
        {
          key: "expected_outcomes",
          label: "Resultados Esperados",
          options: [
            { value: "emotional_regulation", label: "Melhora na Regulação Emocional" },
            { value: "skill_development", label: "Desenvolvimento de Habilidades" },
            { value: "social_improvement", label: "Progresso na Interação Social" },
            { value: "functional_gains", label: "Ganhos Funcionais" },
            { value: "quality_life", label: "Aumento na Qualidade de Vida" },
          ],
        },
      ],
    },
    {
      title: "Estratégias e Recursos",
      icon: Zap,
      gradient: "from-orange-500 to-orange-600",
      fields: [
        {
          key: "intervention_strategies",
          label: "Estratégias de Intervenção",
          options: [
            { value: "active_music", label: "Musicoterapia Ativa" },
            { value: "receptive_music", label: "Musicoterapia Receptiva" },
            { value: "combined_approach", label: "Abordagem Combinada" },
            { value: "iso_principle", label: "Princípio ISO" },
            { value: "entrainment", label: "Entrainment" },
          ],
        },
        {
          key: "musical_resources",
          label: "Recursos Musicais",
          options: [
            { value: "adaptive_instruments", label: "Instrumentos Adaptativos" },
            { value: "sensory_instruments", label: "Instrumentos Sensoriais" },
            { value: "communication_devices", label: "Dispositivos de Comunicação Musical" },
            { value: "assistive_technology", label: "Tecnologia Assistiva Musical" },
            { value: "percussion", label: "Instrumentos de Percussão" },
            { value: "melodic", label: "Instrumentos Melódicos" },
            { value: "voice", label: "Recursos Vocais" },
            { value: "mixed_resources", label: "Recursos Mistos" },
          ],
        },
      ],
    },
    
    // Novas seções específicas para TEA
    {
      title: "Perfil Sensorial Musical (TEA)",
      icon: Brain,
      gradient: "from-emerald-500 to-emerald-600",
      type: "tea_sensory",
      description: "Avaliação do processamento sensorial auditivo e resposta a estímulos musicais",
    },
    {
      title: "Comunicação Social Musical (TEA)",
      icon: Users,
      gradient: "from-rose-500 to-rose-600", 
      type: "tea_communication",
      description: "Habilidades de comunicação e interação social através da música",
    },
    {
      title: "Padrões Comportamentais Musicais (TEA)",
      icon: Heart,
      gradient: "from-amber-500 to-amber-600",
      type: "tea_behavioral", 
      description: "Comportamentos, estereotipias e autorregulação através da música",
    },
    {
      title: "Metodologias e Recursos Especializados (TEA)",
      icon: Clock,
      gradient: "from-cyan-500 to-cyan-600",
      type: "tea_methodology",
      description: "Abordagens específicas para TEA e recursos adaptativos",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-slate-600 font-medium">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      <div className="container mx-auto p-6 space-y-8 max-w-6xl">
        {/* Header */}
        <div className="text-center space-y-4 pt-8 pb-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
            <Stethoscope className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
            Plano Terapêutico Musicoterapêutico
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Elabore um plano terapêutico personalizado e baseado em evidências científicas
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Patient Selection Card */}
          <ModernFormCard
            title="Seleção do Paciente"
            icon={Users}
            gradient="from-teal-500 to-teal-600"
            className="transform hover:scale-[1.02] transition-all duration-300"
          >
            {patients.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <Users className="w-12 h-12 mx-auto text-gray-400" />
                <p className="text-gray-500 font-medium">Nenhum paciente encontrado</p>
                <p className="text-sm text-gray-400">Cadastre pacientes na seção "Pacientes" para criar planos terapêuticos</p>
              </div>
            ) : (
              <PatientSelect
                patients={patients}
                selectedPatient={selectedPatient}
                onSelect={setSelectedPatient}
                isLoading={isLoading}
                emptyMessage="Nenhum paciente encontrado para sua conta"
              />
            )}
          </ModernFormCard>

          {/* Dynamic Sections */}
          {sections.map((section) => {
            if (section.type === "tea_sensory") {
              return (
                <ModernFormCard
                  key={section.title}
                  title={section.title}
                  icon={section.icon}
                  gradient={section.gradient}
                  className="transform hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="space-y-6">
                    <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
                      {section.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ScaleField
                        label="Sensibilidade Auditiva"
                        value={formData.auditory_sensitivity}
                        onChange={(value) => handleInputChange("auditory_sensitivity", value)}
                        description="Resposta a diferentes intensidades sonoras"
                      />
                      <ScaleField
                        label="Responsividade a Frequências"
                        value={formData.frequency_responsiveness}
                        onChange={(value) => handleInputChange("frequency_responsiveness", value)}
                        description="Reação a sons agudos e graves"
                      />
                      <ScaleField
                        label="Tolerância ao Volume"
                        value={formData.volume_tolerance}
                        onChange={(value) => handleInputChange("volume_tolerance", value)}
                        description="Capacidade de lidar com diferentes volumes"
                      />
                      <ScaleField
                        label="Preferência de Texturas Sonoras"
                        value={formData.texture_preference}
                        onChange={(value) => handleInputChange("texture_preference", value)}
                        description="Interesse por diferentes timbres musicais"
                      />
                      <div className="md:col-span-2">
                        <ScaleField
                          label="Processamento Rítmico"
                          value={formData.rhythmic_processing}
                          onChange={(value) => handleInputChange("rhythmic_processing", value)}
                          description="Habilidade para perceber e sincronizar com ritmos"
                        />
                      </div>
                    </div>
                  </div>
                </ModernFormCard>
              );
            }
            
            if (section.type === "tea_communication") {
              return (
                <ModernFormCard
                  key={section.title}
                  title={section.title}
                  icon={section.icon}
                  gradient={section.gradient}
                  className="transform hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="space-y-6">
                    <p className="text-sm text-gray-600 bg-rose-50 p-3 rounded-lg border border-rose-200">
                      {section.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ScaleField
                        label="Comunicação Musical"
                        value={formData.musical_communication}
                        onChange={(value) => handleInputChange("musical_communication", value)}
                        description="Uso da música para se comunicar"
                      />
                      <ScaleField
                        label="Expressão Não-Verbal"
                        value={formData.non_verbal_expression}
                        onChange={(value) => handleInputChange("non_verbal_expression", value)}
                        description="Comunicação através de gestos e movimentos"
                      />
                      <ScaleField
                        label="Interação Social Musical"
                        value={formData.social_interaction_music}
                        onChange={(value) => handleInputChange("social_interaction_music", value)}
                        description="Engajamento social durante atividades musicais"
                      />
                      <ScaleField
                        label="Atenção Conjunta Musical"
                        value={formData.joint_attention_music}
                        onChange={(value) => handleInputChange("joint_attention_music", value)}
                        description="Compartilhamento de experiências musicais"
                      />
                      <div className="md:col-span-2">
                        <ScaleField
                          label="Habilidades de Imitação"
                          value={formData.imitation_skills}
                          onChange={(value) => handleInputChange("imitation_skills", value)}
                          description="Capacidade de imitar sons e movimentos musicais"
                        />
                      </div>
                    </div>
                  </div>
                </ModernFormCard>
              );
            }
            
            if (section.type === "tea_behavioral") {
              return (
                <ModernFormCard
                  key={section.title}
                  title={section.title}
                  icon={section.icon}
                  gradient={section.gradient}
                  className="transform hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="space-y-6">
                    <p className="text-sm text-gray-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                      {section.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ScaleField
                        label="Estereotipias Musicais"
                        value={formData.musical_stereotypies}
                        onChange={(value) => handleInputChange("musical_stereotypies", value)}
                        description="Frequência de movimentos repetitivos com música"
                      />
                      <ScaleField
                        label="Comportamentos Rituais"
                        value={formData.ritual_behaviors}
                        onChange={(value) => handleInputChange("ritual_behaviors", value)}
                        description="Necessidade de rotinas musicais específicas"
                      />
                      <ScaleField
                        label="Busca Sensorial"
                        value={formData.sensory_seeking}
                        onChange={(value) => handleInputChange("sensory_seeking", value)}
                        description="Procura por estimulação sensorial através da música"
                      />
                      <ScaleField
                        label="Autorregulação Musical"
                        value={formData.self_regulation_music}
                        onChange={(value) => handleInputChange("self_regulation_music", value)}
                        description="Uso da música para se acalmar ou regular"
                      />
                      <div className="md:col-span-2">
                        <ScaleField
                          label="Flexibilidade Comportamental"
                          value={formData.behavioral_flexibility}
                          onChange={(value) => handleInputChange("behavioral_flexibility", value)}
                          description="Adaptabilidade a mudanças nas atividades musicais"
                        />
                      </div>
                    </div>
                  </div>
                </ModernFormCard>
              );
            }
            
            if (section.type === "tea_methodology") {
              return (
                <ModernFormCard
                  key={section.title}
                  title={section.title}
                  icon={section.icon}
                  gradient={section.gradient}
                  className="transform hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="space-y-6">
                    <p className="text-sm text-gray-600 bg-cyan-50 p-3 rounded-lg border border-cyan-200">
                      {section.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <TextAreaField
                        label="Metodologia de Abordagem TEA"
                        value={formData.tea_approach_methodology}
                        onChange={(value) => handleInputChange("tea_approach_methodology", value)}
                        placeholder="Descreva a metodologia específica para TEA (DIR/Floortime, TEACCH, ABA, etc.)"
                        description="Detalhe como a abordagem será adaptada para o espectro autista"
                      />
                      <TextAreaField
                        label="Recursos Adaptativos"
                        value={formData.adaptive_resources}
                        onChange={(value) => handleInputChange("adaptive_resources", value)}
                        placeholder="Instrumentos adaptativos, tecnologia assistiva, suportes visuais..."
                        description="Liste recursos especializados para necessidades individuais"
                      />
                      <TextAreaField
                        label="Estratégias de Comunicação"
                        value={formData.communication_strategies}
                        onChange={(value) => handleInputChange("communication_strategies", value)}
                        placeholder="PECS musicais, símbolos, gestos, comunicação aumentativa..."
                        description="Métodos para facilitar a comunicação através da música"
                      />
                      <TextAreaField
                        label="Programação Sensorial"
                        value={formData.sensory_program}
                        onChange={(value) => handleInputChange("sensory_program", value)}
                        placeholder="Cronograma de exposição gradual, atividades de integração sensorial..."
                        description="Plano para modulação e integração sensorial"
                      />
                      <TextAreaField
                        label="Orientações Familiares"
                        value={formData.family_guidance}
                        onChange={(value) => handleInputChange("family_guidance", value)}
                        placeholder="Atividades domiciliares, estratégias para os pais, recursos para casa..."
                        description="Direcionamentos para continuidade terapêutica em casa"
                      />
                      <TextAreaField
                        label="Métodos de Avaliação"
                        value={formData.evaluation_methods}
                        onChange={(value) => handleInputChange("evaluation_methods", value)}
                        placeholder="Escalas padronizadas, observação estruturada, registro de dados..."
                        description="Instrumentos para monitoramento e avaliação do progresso"
                      />
                    </div>
                  </div>
                </ModernFormCard>
              );
            }
            
            // Seções tradicionais
            return (
              <ModernFormCard
                key={section.title}
                title={section.title}
                icon={section.icon}
                gradient={section.gradient}
                className="transform hover:scale-[1.02] transition-all duration-300"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {section.fields?.map((field) => (
                    <SelectField
                      key={field.key}
                      label={field.label}
                      value={String(formData[field.key as keyof typeof formData])}
                      onChange={(value) => handleInputChange(field.key as keyof typeof formData, value)}
                      options={field.options}
                    />
                  ))}
                </div>
              </ModernFormCard>
            );
          })}

          {/* Additional Notes */}
          <ModernFormCard
            title="Observações Complementares"
            icon={FileText}
            gradient="from-indigo-500 to-indigo-600"
            className="transform hover:scale-[1.02] transition-all duration-300"
          >
            <div className="space-y-3">
              <Label className="text-base font-medium text-gray-700">
                Notas Complementares
              </Label>
              <Textarea
                value={formData.additional_notes}
                onChange={(e) => handleInputChange("additional_notes", e.target.value)}
                placeholder="Adicione informações complementares relevantes para o plano terapêutico, observações especiais, considerações importantes ou instruções específicas..."
                className="min-h-32 resize-y border-2 border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
              />
            </div>
          </ModernFormCard>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8 pb-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/processes")}
              className="flex items-center gap-2 px-8 py-3 text-lg font-medium border-2 hover:bg-gray-50 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              Cancelar
            </Button>
            <Button 
              type="button"
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-8 py-3 text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Download className="w-5 h-5" />
              Baixar PDF
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}