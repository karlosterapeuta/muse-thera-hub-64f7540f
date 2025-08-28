import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SelectField } from "./components/SelectField";
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
      'neurologic': 'Musicoterapia Neurológica (NMT)',
      'analytical': 'Musicoterapia Analítica',
      'creative': 'Processos Criativos em Musicoterapia',
      'gim': 'Imagery Guiada e Música (GIM)',
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
    };
    return translations[value] || value;
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

      const sections = [
        {
          title: "Configuração do Tratamento",
          fields: [
            { key: "approach_type", label: "Abordagem Terapêutica" },
            { key: "intervention_frequency", label: "Frequência das Intervenções" },
            { key: "session_duration", label: "Duração das Sessões" }
          ]
        },
        {
          title: "Metodologia e Recursos",
          fields: [
            { key: "treatment_model", label: "Modelo de Tratamento" },
            { key: "musical_methods", label: "Métodos Musicais" }
          ]
        },
        {
          title: "Objetivos e Avaliação",
          fields: [
            { key: "therapeutic_focus", label: "Foco Terapêutico" },
            { key: "expected_outcomes", label: "Resultados Esperados" }
          ]
        },
        {
          title: "Estratégias e Recursos",
          fields: [
            { key: "intervention_strategies", label: "Estratégias de Intervenção" },
            { key: "musical_resources", label: "Recursos Musicais" }
          ]
        },
        {
          title: "Observações Adicionais",
          fields: [
            { key: "additional_notes", label: "Notas Complementares" }
          ]
        }
      ];

      return sections
        .map(section => {
          const sectionContent = section.fields
            .filter(field => translatedContent[field.key])
            .map(field => `
              <div style="margin-bottom: 16px;">
                <div style="font-weight: 600; font-size: 13px; margin-bottom: 4px; color: #374151;">
                  ${field.label}
                </div>
                <div style="background-color: #F9FAFB; padding: 8px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 12px; line-height: 1.5; color: #1F2937; white-space: pre-wrap;">
                  ${String(translatedContent[field.key] || '').split('\n').join('<br>')}
                </div>
              </div>
            `)
            .join('');

          if (sectionContent) {
            return `
              <div style="margin-bottom: 24px;">
                <h2 style="color: #1F2937; font-size: 16px; font-weight: 600; margin-bottom: 12px; padding-bottom: 4px; border-bottom: 2px solid #E5E7EB;">
                  ${section.title}
                </h2>
                ${sectionContent}
              </div>
            `;
          }
          return '';
        })
        .join('');
    };

    try {
      console.log("Iniciando geração de PDF...");
      
      const selectedPatientData = patients.find(p => p.id === selectedPatient);
      if (!selectedPatientData) {
        throw new Error("Dados do paciente não encontrados");
      }
      
      console.log("Paciente selecionado:", selectedPatientData.name);
      
      element.innerHTML = `
        <div style="padding: 40px; font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #E5E7EB;">
            <div style="margin-bottom: 24px;">
              <div style="width: 200px; height: 60px; background-color: #2563EB; color: white; display: flex; align-items: center; justify-content: center; margin: 0 auto; border-radius: 8px; font-size: 18px; font-weight: bold;">
                MuseTera
              </div>
            </div>
            <h1 style="color: #2563EB; font-size: 24px; font-weight: bold; margin-bottom: 12px;">
              Plano Terapêutico Musicoterapêutico
            </h1>
            <h2 style="color: #1F2937; font-size: 18px; margin-bottom: 8px;">
              Paciente: ${selectedPatientData?.name || 'Não informado'}
            </h2>
            <p style="color: #6B7280; font-size: 14px;">
              Data: ${new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          <div style="margin-bottom: 32px;">
            ${generateContentHTML(formData)}
          </div>

          <div style="margin-top: 32px; padding-top: 24px; border-top: 2px solid #E5E7EB; text-align: center;">
            <p style="color: #6B7280; font-size: 11px; margin-bottom: 4px;">
              Documento gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}
            </p>
            <p style="color: #6B7280; font-size: 11px; margin-bottom: 4px;">
              Musetera - Sistema de Gestão para Musicoterapia
            </p>
            <p style="color: #6B7280; font-size: 11px; margin-bottom: 4px;">
              Musicoterapeuta: ${userName || 'Não informado'}
            </p>
            <p style="color: #6B7280; font-size: 11px;">
              Email: ${userEmail || 'Não informado'}
            </p>
          </div>
        </div>
      `;

      const opt = {
        margin: [20, 20, 20, 20],
        filename: `Plano_Terapeutico_${selectedPatientData.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
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
          logging: false,
          allowTaint: true,
        },
      };

      console.log("Configurações do PDF:", opt);
      console.log("Gerando PDF...");

      // Add to DOM temporarily for rendering
      document.body.appendChild(element);
      
      await html2pdf().from(element).set(opt).save();
      
      // Remove from DOM
      document.body.removeChild(element);
      
      console.log("PDF gerado com sucesso!");
      
      toast({
        title: "Sucesso!",
        description: "PDF do plano terapêutico gerado com sucesso!",
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
    const hasContent = Object.values(formData).some(value => value.trim() !== "");
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
    const hasContent = Object.values(formData).some(value => value.trim() !== "");
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

  const handleInputChange = (field: keyof typeof formData, value: string) => {
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
            { value: "behavioral", label: "Musicoterapia Comportamental" },
            { value: "nordoff_robbins", label: "Modelo Nordoff-Robbins" },
            { value: "neurologic", label: "Musicoterapia Neurológica (NMT)" },
            { value: "analytical", label: "Musicoterapia Analítica" },
            { value: "creative", label: "Processos Criativos em Musicoterapia" },
            { value: "gim", label: "Imagery Guiada e Música (GIM)" },
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
            { value: "percussion", label: "Instrumentos de Percussão" },
            { value: "melodic", label: "Instrumentos Melódicos" },
            { value: "voice", label: "Recursos Vocais" },
            { value: "technology", label: "Tecnologia Musical" },
            { value: "mixed_resources", label: "Recursos Mistos" },
          ],
        },
      ],
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
          {sections.map((section) => (
            <ModernFormCard
              key={section.title}
              title={section.title}
              icon={section.icon}
              gradient={section.gradient}
              className="transform hover:scale-[1.02] transition-all duration-300"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {section.fields.map((field) => (
                  <SelectField
                    key={field.key}
                    label={field.label}
                    value={formData[field.key as keyof typeof formData]}
                    onChange={(value) => handleInputChange(field.key as keyof typeof formData, value)}
                    options={field.options}
                  />
                ))}
              </div>
            </ModernFormCard>
          ))}

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