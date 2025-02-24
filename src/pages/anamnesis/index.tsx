
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PatientSelect } from "./components/PatientSelect";
import { Download } from "lucide-react";
import html2pdf from "html2pdf.js";
import { InitialEvaluationForm } from "./components/InitialEvaluationForm";

type Patient = {
  id: string;
  name: string;
};

type Professional = {
  email: string;
};

export default function AnamnesisForm() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [professionalId, setProfessionalId] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  const formatNameFromEmail = (email: string) => {
    const namePart = email.split('@')[0];
    return namePart
      .split(/[._-]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedPatient) {
      loadPatientAnamnesis();
    }
  }, [selectedPatient]);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erro de autenticação",
          description: "Usuário não autenticado. Por favor, faça login novamente.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      setProfessionalId(user.id);
      setUserEmail(user.email || "");
      setUserName(formatNameFromEmail(user.email || ""));

      console.log('Buscando pacientes para usuário:', user.id);

      const { data: patientsData, error: patientsError } = await supabase
        .from("patients")
        .select("id, name")
        .eq("professional_id", user.id)
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

      setPatients(patientsData || []);

    } catch (error) {
      console.error("Erro ao carregar dados iniciais:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados necessários.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadPatientAnamnesis = async () => {
    if (!selectedPatient) return;

    try {
      setIsLoading(true);
      const { data: anamnesisData, error } = await supabase
        .from("anamnesis")
        .select("*")
        .eq("patient_id", selectedPatient)
        .maybeSingle();

      if (error) {
        console.error("Erro ao carregar anamnese:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados da anamnese.",
          variant: "destructive",
        });
        return;
      }

      if (anamnesisData) {
        setFormData(anamnesisData);
      } else {
        // Reset form data if no anamnesis exists for this patient
        setFormData({});
      }
    } catch (error) {
      console.error("Erro ao carregar anamnese:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados da anamnese.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generatePDF = async (patientName: string) => {
    const element = document.createElement('div');
    
    const generateContentHTML = (content: Record<string, any>) => {
      const renderSection = (title: string, items: { id: string, label: string }[]) => {
        const checkedItems = items
          .filter(item => content[item.id])
          .map(item => item.label)
          .join(", ");
        
        return checkedItems ? `
          <div style="margin-bottom: 8px;">
            <div style="font-weight: 600; font-size: 13px; margin-bottom: 3px; color: #374151;">
              ${title}
            </div>
            <div style="background-color: #F9FAFB; padding: 6px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 12px; line-height: 1.3; color: #1F2937;">
              ${checkedItems}
            </div>
          </div>
        ` : '';
      };

      const sections = [
        {
          title: "Dados Pessoais",
          textFields: [
            { key: "legal_guardian", label: "Responsável Legal" },
            { key: "family_relationship", label: "Parentesco" },
            { key: "referral_professional", label: "Profissional que Encaminhou" },
            { key: "main_clinical_demand", label: "Demanda Clínica Principal" }
          ]
        },
        {
          title: "Histórico Musical",
          checkboxes: [
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
          checkboxes: [
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
          checkboxes: [
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
          checkboxes: [
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
          checkboxes: [
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
          checkboxes: [
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
          checkboxes: [
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
          checkboxes: [
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
          checkboxes: [
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
          checkboxes: [
            { id: "speech_therapy", label: "Fonoaudiologia" },
            { id: "psychological_support", label: "Acompanhamento Psicológico" },
            { id: "psychopedagogical", label: "Psicopedagogia" },
            { id: "occupational_therapy", label: "Terapia Ocupacional" },
            { id: "physiotherapy", label: "Fisioterapia" },
            { id: "equine_therapy", label: "Equoterapia" }
          ]
        },
        {
          title: "Medicação",
          textFields: [
            { key: "current_medication", label: "Medicação Atual" }
          ]
        },
        {
          title: "Aspectos Sociais",
          textFields: [
            { key: "school_enrollment", label: "Matrícula Escolar" },
            { key: "school_adaptation", label: "Adaptação Escolar" },
            { key: "extracurricular_activities", label: "Atividades Extracurriculares" }
          ]
        }
      ];

      return sections.map(section => {
        let sectionContent = '';
        
        if (section.textFields) {
          sectionContent = section.textFields
            .filter(field => content[field.key])
            .map(field => `
              <div style="margin-bottom: 8px;">
                <div style="font-weight: 600; font-size: 13px; margin-bottom: 3px; color: #374151;">
                  ${field.label}
                </div>
                <div style="background-color: #F9FAFB; padding: 6px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 12px; line-height: 1.3; color: #1F2937;">
                  ${content[field.key]}
                </div>
              </div>
            `).join('');
        }

        if (section.checkboxes) {
          sectionContent = renderSection(section.title, section.checkboxes);
        }

        if (sectionContent) {
          return `
            <div style="margin-bottom: 16px;">
              <h2 style="color: #1F2937; font-size: 15px; font-weight: 600; margin-bottom: 8px; padding-bottom: 4px; border-bottom: 2px solid #E5E7EB;">
                ${section.title}
              </h2>
              ${sectionContent}
            </div>
          `;
        }
        return '';
      }).join('');
    };

    element.innerHTML = `
      <div style="padding: 40px; font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #E5E7EB;">
          <div style="margin-bottom: 24px;">
            <img src="/lovable-uploads/86b61f63-0028-428c-90d1-44c71413e24a.png" style="width: 200px; height: auto; margin: 0 auto;">
          </div>
          <h1 style="color: #2563EB; font-size: 24px; font-weight: bold; margin-bottom: 12px;">
            Anamnese Musicoterapêutica
          </h1>
          <h2 style="color: #1F2937; font-size: 18px; margin-bottom: 6px;">
            Paciente: ${patientName}
          </h2>
          <p style="color: #6B7280; font-size: 13px;">
            Data da Avaliação: ${new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>

        <div style="margin-bottom: 24px;">
          ${generateContentHTML(formData)}
        </div>

        <div style="margin-top: 24px; padding-top: 16px; border-top: 2px solid #E5E7EB; text-align: center;">
          <p style="color: #6B7280; font-size: 11px; margin-bottom: 4px;">
            Documento gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}
          </p>
          <p style="color: #6B7280; font-size: 11px; margin-bottom: 4px;">
            Musetera - Sistema de Gestão para Musicoterapia
          </p>
          <p style="color: #6B7280; font-size: 11px; margin-bottom: 4px;">
            Musicoterapeuta: ${userName}
          </p>
          <p style="color: #6B7280; font-size: 11px;">
            Email: ${userEmail}
          </p>
        </div>
      </div>
    `;

    const opt = {
      margin: [20, 20, 20, 20],
      filename: `Anamnese - ${patientName}.pdf`,
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

    if (!professionalId) {
      toast({
        title: "Erro de autenticação",
        description: "ID do profissional não encontrado. Por favor, faça login novamente.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("anamnesis")
        .upsert({
          ...formData,
          patient_id: selectedPatient,
          professional_id: professionalId,
        })
        .select()
        .single();

      if (error) throw error;

      const selectedPatientData = patients.find(p => p.id === selectedPatient);
      if (selectedPatientData) {
        await generatePDF(selectedPatientData.name);
      }

      toast({
        title: "Sucesso!",
        description: "Anamnese registrada e PDF gerado com sucesso.",
      });

      navigate("/processes");
    } catch (error) {
      console.error("Erro ao salvar anamnese:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a anamnese.",
        variant: "destructive",
      });
    }
  };

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
          <CardTitle>Anamnese Musicoterapêutica</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <PatientSelect
              patients={patients}
              selectedPatient={selectedPatient}
              onSelect={setSelectedPatient}
            />
            
            <InitialEvaluationForm
              content={formData}
              onChange={setFormData}
            />

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

