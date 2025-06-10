import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Download, Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import html2pdf from "html2pdf.js";
import { generateProfessionalAnamnesePDF } from "@/utils/anamnesisePDFGenerator";

type Patient = {
  id: string;
  name: string;
};

type Anamnesis = {
  id: string;
  created_at: string;
  updated_at: string;
  professional_id: string;
  patient_id: string;
  legal_guardian?: string | null;
  family_relationship?: string | null;
  referral_professional?: string | null;
  main_clinical_demand?: string | null;
  therapeutic_goals?: string | null;
  treatment_approach?: string | null;
  current_medication?: string | null;
  school_enrollment?: string | null;
  school_adaptation?: string | null;
  extracurricular_activities?: string | null;
  [key: string]: any;
};

interface ViewAnamnesisDialogProps {
  patient: Patient;
  closeModal: () => void;
  onEdit?: (anamnesis: Anamnesis) => void;
}

export function ViewAnamnesisDialog({ patient, closeModal, onEdit }: ViewAnamnesisDialogProps) {
  const [anamnesis, setAnamnesis] = useState<Anamnesis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [professional, setProfessional] = useState<{ email: string; name?: string } | null>(null);
  const { toast } = useToast();

  const formatNameFromEmail = (email: string) => {
    const namePart = email.split('@')[0];
    return namePart
      .split(/[._-]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  useEffect(() => {
    const loadAnamnesis = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from("anamnesis")
          .select("*")
          .eq("patient_id", patient.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) {
          console.error("Erro ao carregar anamnese:", error);
          throw error;
        }

        if (data) {
          setAnamnesis(data);
          
          // Load professional data
          try {
            // First try to get the user with auth.getUser()
            const { data: authData } = await supabase.auth.getUser();
            
            if (authData.user) {
              setProfessional({
                email: authData.user.email || '',
                name: formatNameFromEmail(authData.user.email || '')
              });
            } else {
              // Fallback to just using the ID without profile data
              setProfessional({
                email: 'profissional@musetera.app',
                name: 'Profissional'
              });
            }
          } catch (userError) {
            console.error("Error fetching user data:", userError);
            // Set a fallback value
            setProfessional({
              email: 'profissional@musetera.app',
              name: 'Profissional'
            });
          }
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

    loadAnamnesis();
  }, [patient.id]);

  const renderCheckboxSections = () => {
    if (!anamnesis) return null;

    const sections = [
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

    return sections.map((section, index) => {
      const selectedFields = section.fields.filter(field => anamnesis[field.id] === true);
      
      if (selectedFields.length === 0) return null;
      
      return (
        <div key={index} className="mb-4">
          <h3 className="text-md font-semibold text-gray-700 mb-2">{section.title}</h3>
          <div className="bg-gray-50 p-3 rounded-md">
            {selectedFields.map((field, idx) => (
              <span key={idx} className="inline-flex items-center mr-2 mb-2 px-2 py-1 bg-white border border-gray-200 rounded-md text-sm">
                {field.label}
              </span>
            ))}
          </div>
        </div>
      );
    });
  };

  const renderTextFields = () => {
    if (!anamnesis) return null;

    const textFields = [
      { key: "legal_guardian", label: "Responsável Legal" },
      { key: "family_relationship", label: "Parentesco" },
      { key: "referral_professional", label: "Profissional que Encaminhou" },
      { key: "main_clinical_demand", label: "Demanda Clínica Principal" },
      { key: "current_medication", label: "Medicação Atual" },
      { key: "school_enrollment", label: "Matrícula Escolar" },
      { key: "school_adaptation", label: "Adaptação Escolar" },
      { key: "extracurricular_activities", label: "Atividades Extracurriculares" }
    ];

    return textFields.map((field, index) => {
      if (!anamnesis[field.key]) return null;
      
      return (
        <div key={index} className="mb-4">
          <h3 className="text-md font-semibold text-gray-700 mb-1">{field.label}</h3>
          <div className="bg-gray-50 p-3 rounded-md text-sm">{anamnesis[field.key]}</div>
        </div>
      );
    });
  };

  const generatePDF = async () => {
    if (!anamnesis || !professional) return;
    
    try {
      const success = await generateProfessionalAnamnesePDF(
        anamnesis,
        professional,
        patient.name
      );

      if (success) {
        toast({
          title: "Sucesso",
          description: "PDF profissional gerado com sucesso!",
        });
        return true;
      } else {
        throw new Error("Falha na geração do PDF");
      }
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o PDF.",
        variant: "destructive",
      });
      return false;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!anamnesis) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhuma anamnese encontrada para este paciente.</p>
        <Button 
          onClick={closeModal} 
          className="mt-4"
        >
          Fechar
        </Button>
      </div>
    );
  }

  return (
    <div className="max-h-[70vh] overflow-y-auto p-1">
      <div className="space-y-4">
        <div className="flex justify-between items-center pb-2 border-b">
          <div>
            <h3 className="font-medium text-gray-700">
              Data do registro: {formatDate(anamnesis.created_at)}
            </h3>
          </div>
        </div>
        
        {renderTextFields()}
        {renderCheckboxSections()}
        
        <div className="pt-4 flex justify-end space-x-4 border-t mt-4">
          <Button variant="outline" onClick={closeModal}>
            Fechar
          </Button>
          {onEdit && (
            <Button 
              onClick={() => onEdit(anamnesis)} 
              variant="outline" 
              className="hover:text-primary"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Editar
            </Button>
          )}
          <Button 
            onClick={generatePDF}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Baixar PDF Profissional
          </Button>
        </div>
      </div>
    </div>
  );
}
