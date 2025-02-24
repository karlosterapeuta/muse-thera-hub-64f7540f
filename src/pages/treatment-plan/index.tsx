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
import html2pdf from "html2pdf.js";
import { Download } from "lucide-react";

type Patient = {
  id: string;
  name: string;
};

type Professional = {
  id: string;
  name: string;
  email: string;
};

export default function TreatmentPlanForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const [professional, setProfessional] = useState<Professional | null>(null);

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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erro",
          description: "Usuário não autenticado",
          variant: "destructive",
        });
        return;
      }

      const { data: professionalData, error: professionalError } = await supabase
        .from("professionals")
        .select("id, name, email")
        .eq("user_id", user.id)
        .maybeSingle();

      if (professionalError) {
        console.error("Erro ao carregar dados do profissional:", professionalError);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do profissional.",
          variant: "destructive",
        });
        return;
      }

      if (!professionalData) {
        console.error("Profissional não encontrado");
        toast({
          title: "Erro",
          description: "Perfil profissional não encontrado.",
          variant: "destructive",
        });
        return;
      }

      setProfessional(professionalData);

      const { data: patientsData, error: patientsError } = await supabase
        .from("patients")
        .select("id, name")
        .eq("professional_id", professionalData.id)
        .order("name");

      if (patientsError) {
        console.error("Erro ao carregar pacientes:", patientsError);
        toast({
          title: "Erro",
          description: "Não foi possível carregar a lista de pacientes.",
          variant: "destructive",
        });
        return;
      }

      console.log("Pacientes carregados:", patientsData);
      setPatients(patientsData || []);

    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados necessários.",
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
      const selectedPatientData = patients.find(p => p.id === selectedPatient);
      element.innerHTML = `
        <div style="padding: 40px; font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #E5E7EB;">
            <div style="margin-bottom: 24px;">
              <img src="/lovable-uploads/86b61f63-0028-428c-90d1-44c71413e24a.png" style="width: 200px; height: auto; margin: 0 auto;">
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
              Musicoterapeuta: ${professional?.name || 'Não informado'}
            </p>
            <p style="color: #6B7280; font-size: 11px;">
              Email: ${professional?.email || 'Não informado'}
            </p>
          </div>
        </div>
      `;

      const opt = {
        margin: [20, 20, 20, 20],
        filename: `Plano Terapêutico - ${selectedPatientData?.name || 'Sem Nome'}.pdf`,
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

    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o PDF. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
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

    if (!professional) {
      toast({
        title: "Erro",
        description: "Dados do profissional não encontrados.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("treatment_plans")
        .insert({
          ...formData,
          patient_id: selectedPatient,
          professional_id: professional.id,
          status: "active",
          created_at: new Date().toISOString(),
        });

      if (error) throw error;

      await generatePDF();

      toast({
        title: "Sucesso!",
        description: "Plano terapêutico salvo e PDF gerado com sucesso.",
      });

      navigate("/processes");
    } catch (error) {
      console.error("Erro ao salvar plano terapêutico:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o plano terapêutico.",
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Plano Terapêutico Musicoterapêutico</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <PatientSelect
              patients={patients}
              selectedPatient={selectedPatient}
              onSelect={setSelectedPatient}
              isLoading={isLoading}
            />

            {sections.map((section) => (
              <div key={section.title} className="space-y-4">
                <h3 className="text-lg font-semibold pt-4">{section.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
            ))}

            <div className="space-y-4">
              <h3 className="text-lg font-semibold pt-4">Observações Adicionais</h3>
              <div>
                <Label>Notas Complementares</Label>
                <Textarea
                  value={formData.additional_notes}
                  onChange={(e) => handleInputChange("additional_notes", e.target.value)}
                  placeholder="Adicione informações complementares relevantes para o plano terapêutico"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/processes")}
              >
                Cancelar
              </Button>
              <Button type="submit">
                <Download className="mr-2" />
                Salvar e Baixar PDF
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
