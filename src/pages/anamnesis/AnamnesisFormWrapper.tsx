import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PatientSelect } from "./components/PatientSelect";
import { Download, Save, ArrowLeft } from "lucide-react";
import html2pdf from "html2pdf.js";
import { InitialEvaluationForm } from "./components/InitialEvaluationForm";

type Patient = {
  id: string;
  name: string;
};

interface AnamnesisFormWrapperProps {
  editAnamnesisId?: string | null;
  editPatientId?: string | null;
  onBack?: () => void;
}

// Lista de campos conhecidos do banco de dados anamnesis - incluindo todas as novas colunas
const knownDatabaseFields = [
  'id', 'patient_id', 'professional_id', 'created_at', 'updated_at', 
  'therapeutic_goals', 'treatment_approach', 'legal_guardian', 'family_relationship', 
  'referral_professional', 'main_clinical_demand', 'musical_education', 
  'instrumental_practice', 'body_musical_expression', 'vocal_expression', 
  'choral_activities', 'no_musical_experience', 'active_musical_listening', 
  'body_expression', 'sound_responsiveness', 'spontaneous_vocal', 
  'instrumental_exploration', 'adverse_sound_reactivity', 'auditory_hypersensitivity', 
  'positive_musical_response', 'nominal_call_response', 'active_sound_search', 
  'specific_sound_aversion', 'sound_source_location', 'children_repertoire', 
  'rock_genre', 'sacred_gospel', 'other_musical_genres', 'brazilian_popular', 
  'country_music', 'classical_music', 'cervical_control', 'crawling_pattern', 
  'fine_motor_dev', 'independent_sitting', 'autonomous_walking', 'broad_motor_dev', 
  'babbling', 'simple_phrases', 'echolalia', 'first_words', 'nonverbal_communication', 
  'verbal_language_absence', 'visual_contact', 'shared_play', 'stereotyped_behavior', 
  'peer_interaction', 'social_isolation', 'restricted_interests', 'irritability', 
  'heteroaggressive', 'emotional_ability', 'anxiety', 'frequent_crying', 
  'low_frustration_tolerance', 'autism_spectrum', 'down_syndrome', 'intellectual_disability', 
  'other_diagnoses', 'adhd', 'chronic_encephalopathy', 'anxiety_disorders', 'current_medication', 
  'speech_therapy', 'psychological_support', 'psychopedagogical', 'occupational_therapy', 
  'physiotherapy', 'equine_therapy', 'school_enrollment', 'school_adaptation', 
  'extracurricular_activities', 'cerebral_palsy', 'fragile_x_syndrome', 'epilepsy', 
  'williams_syndrome', 'depression', 'bipolar_disorder', 'rett_syndrome',
  'aba_therapy', 'psychomotricity', 'music_therapy', 'nutrition', 'sensory_integration', 'alzheimer'
];

export default function AnamnesisFormWrapper({ 
  editAnamnesisId, 
  editPatientId, 
  onBack 
}: AnamnesisFormWrapperProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>(editPatientId || "");
  const [professionalId, setProfessionalId] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [existingAnamnesisId, setExistingAnamnesisId] = useState<string | null>(editAnamnesisId || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    if (selectedPatient && editAnamnesisId) {
      loadPatientAnamnesis();
    }
  }, [selectedPatient, editAnamnesisId]);

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

      setUserEmail(user.email || "");
      setUserName(formatNameFromEmail(user.email || ""));
      setProfessionalId(user.id);

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
    if (!selectedPatient || !editAnamnesisId) return;

    try {
      setIsLoading(true);
      
      const { data: anamnesisData, error } = await supabase
        .from("anamnesis")
        .select("*")
        .eq("id", editAnamnesisId)
        .eq("patient_id", selectedPatient)
        .single();

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
        setExistingAnamnesisId(anamnesisData.id);
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

  const filterDatabaseFields = (data: Record<string, any>) => {
    const filteredData: Record<string, any> = {};
    
    Object.entries(data).forEach(([key, value]) => {
      if (knownDatabaseFields.includes(key.toLowerCase())) {
        const normalizedKey = key.toLowerCase();
        if (typeof value === 'boolean' || value === true || value === false) {
          filteredData[normalizedKey] = Boolean(value);
        } else {
          filteredData[normalizedKey] = value;
        }
      }
    });
    
    return filteredData;
  };

  const updateFormData = (newData: Record<string, any>) => {
    setFormData(newData);
  };

  const saveAnamnesis = async () => {
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
        title: "Erro",
        description: "ID do profissional não encontrado.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const filteredData = filterDatabaseFields(formData);
      
      const anamnesisData: Record<string, any> = {
        patient_id: selectedPatient,
        professional_id: professionalId,
        ...filteredData
      };

      let result;
      
      if (existingAnamnesisId) {
        result = await supabase
          .from("anamnesis")
          .update(anamnesisData)
          .eq("id", existingAnamnesisId);
          
        if (result.error) {
          console.error("Erro ao atualizar anamnese:", result.error);
          throw result.error;
        }
      } else {
        result = await supabase
          .from("anamnesis")
          .insert(anamnesisData)
          .select();
          
        if (result.error) {
          console.error("Erro ao inserir anamnese:", result.error);
          throw result.error;
        }
        
        if (result.data && result.data.length > 0) {
          setExistingAnamnesisId(result.data[0].id);
        }
      }

      toast({
        title: "Sucesso!",
        description: "Anamnese salva com sucesso no sistema.",
      });
      
    } catch (error: any) {
      console.error("Erro ao salvar anamnese:", error);
      
      let errorMessage = "Não foi possível salvar a anamnese.";
      if (error?.message) {
        errorMessage += ` Detalhe: ${error.message}`;
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPatient || !professionalId || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      
      await saveAnamnesis();
      
      if (onBack) {
        onBack();
      } else {
        navigate("/processes");
      }
    } catch (error: any) {
      console.error("Erro ao processar anamnese:", error);
    } finally {
      setIsSubmitting(false);
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
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>
                {editAnamnesisId ? "Editar Anamnese" : "Nova Anamnese Musicoterapêutica"}
              </CardTitle>
            </div>
            {onBack && (
              <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
                <ArrowLeft size={16} />
                Voltar
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <PatientSelect
              patients={patients}
              selectedPatient={selectedPatient}
              onSelect={setSelectedPatient}
              disabled={!!editPatientId}
            />
            
            <InitialEvaluationForm
              content={formData}
              onChange={updateFormData}
            />

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onBack ? onBack() : navigate("/processes")}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="secondary"
                disabled={isSubmitting}
                onClick={saveAnamnesis}
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2" />
                    Salvar
                  </>
                )}
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Processando...
                  </>
                ) : (
                  "Salvar e Voltar"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
