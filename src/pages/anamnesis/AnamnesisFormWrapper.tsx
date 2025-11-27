import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PatientSelect } from "./components/PatientSelect";
import { InitialEvaluationForm } from "./components/InitialEvaluationForm";
import { ModernAnamnesisHeader } from "./components/ModernAnamnesisHeader";
import { ModernTabsNavigation } from "./components/ModernTabsNavigation";
import { ModernActionButtons } from "./components/ModernActionButtons";
import { generateProfessionalAnamnesePDF } from "@/utils/anamnesisePDFGenerator";
import { imageUrlToBase64 } from "@/utils/imageToBase64";

type Patient = {
  id: string;
  name: string;
};

interface AnamnesisFormWrapperProps {
  editAnamnesisId?: string | null;
  editPatientId?: string | null;
  onBack?: () => void;
}

// Campos básicos que sempre existem na tabela anamnesis (garantidos)
const basicDatabaseFields = [
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
  'extracurricular_activities',
  // Campos da História Sonora e Musical Detalhada
  'pregnancy_sound_experiences', 'mother_movements_songs', 'childhood_sound_environment',
  'parents_sound_reactions', 'typical_house_sounds', 'night_body_sounds',
  'family_musical_history', 'patient_musical_history'
];

// Campos que podem não existir (dependem da migração)
const optionalDatabaseFields = [
  'cerebral_palsy', 'fragile_x_syndrome', 'epilepsy', 'williams_syndrome', 
  'depression', 'bipolar_disorder', 'rett_syndrome', 'aba_therapy', 
  'psychomotricity', 'music_therapy', 'nutrition', 'sensory_integration', 'alzheimer'
];

// Cache para colunas verificadas
let columnCheckCache: string[] | null = null;

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
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const formatNameFromEmail = (email: string) => {
    const namePart = email.split('@')[0];
    return namePart
      .split(/[._-]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Função melhorada para verificar colunas disponíveis com cache
  const getAvailableColumns = async (): Promise<string[]> => {
    // Se já temos o cache, retornar imediatamente
    if (columnCheckCache) {
      console.log("✅ Usando cache de colunas:", columnCheckCache.length);
      return columnCheckCache;
    }

    try {
      console.log("🔍 Verificando colunas disponíveis na tabela anamnesis...");
      
      // Tentar consultar a estrutura da tabela diretamente
      const { data, error } = await supabase
        .from("anamnesis")
        .select("*")
        .limit(1);

      if (error) {
        console.warn("⚠️ Erro ao verificar colunas:", error.message);
        console.log("📝 Usando apenas campos básicos como fallback");
        columnCheckCache = basicDatabaseFields;
        return basicDatabaseFields;
      }

      // Se a consulta funcionou, assumimos que todas as colunas estão disponíveis
      const allFields = [...basicDatabaseFields, ...optionalDatabaseFields];
      console.log("✅ Todas as colunas parecem estar disponíveis:", allFields.length);
      columnCheckCache = allFields;
      return allFields;

    } catch (error) {
      console.warn("⚠️ Erro ao verificar colunas disponíveis:", error);
      console.log("📝 Usando apenas campos básicos como fallback");
      columnCheckCache = basicDatabaseFields;
      return basicDatabaseFields;
    }
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
      
      // Verificar colunas disponíveis primeiro e aguardar
      await getAvailableColumns();
      
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

  // Função para filtrar apenas campos que existem no banco
  const filterDatabaseFields = (data: Record<string, any>, availableColumns: string[]) => {
    const filteredData: Record<string, any> = {};
    
    console.log("🔄 Filtrando dados com colunas disponíveis:", availableColumns.length);
    
    Object.entries(data).forEach(([key, value]) => {
      const normalizedKey = key.toLowerCase();
      
      if (availableColumns.includes(normalizedKey)) {
        if (typeof value === 'boolean' || value === true || value === false) {
          filteredData[normalizedKey] = Boolean(value);
        } else {
          filteredData[normalizedKey] = value;
        }
      } else if (!['id', 'patient_id', 'professional_id', 'created_at', 'updated_at'].includes(normalizedKey)) {
        console.log(`⚠️ Campo ${normalizedKey} não está disponível na tabela, ignorando...`);
      }
    });
    
    console.log("✅ Dados filtrados:", Object.keys(filteredData).length, "campos");
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
      
      // SEMPRE garantir que temos as colunas disponíveis antes de prosseguir
      console.log("💾 Iniciando salvamento - verificando colunas...");
      const availableColumns = await getAvailableColumns();
      
      const filteredData = filterDatabaseFields(formData, availableColumns);
      
      console.log("💾 Tentando salvar anamnese com", Object.keys(filteredData).length, "campos");
      
      const anamnesisData: Record<string, any> = {
        patient_id: selectedPatient,
        professional_id: professionalId,
        ...filteredData
      };

      let result;
      
      if (existingAnamnesisId) {
        console.log("🔄 Atualizando anamnese existente:", existingAnamnesisId);
        result = await supabase
          .from("anamnesis")
          .update(anamnesisData)
          .eq("id", existingAnamnesisId);
      } else {
        console.log("➕ Criando nova anamnese");
        result = await supabase
          .from("anamnesis")
          .insert(anamnesisData)
          .select();
      }

      if (result.error) {
        throw result.error;
      }

      if (!existingAnamnesisId && result.data && result.data.length > 0) {
        setExistingAnamnesisId(result.data[0].id);
      }

      console.log("✅ Anamnese salva com sucesso!");
      toast({
        title: "Sucesso!",
        description: "Anamnese salva com sucesso no sistema.",
      });
      
    } catch (error: any) {
      console.error("❌ Erro ao salvar anamnese:", error);
      
      // Se ainda há erro de coluna, tentar com apenas campos básicos
      if (error?.message?.includes('column')) {
        console.log("🔄 Tentando novamente apenas com campos básicos...");
        
        try {
          const basicFilteredData = filterDatabaseFields(formData, basicDatabaseFields);
          const basicAnamnesisData = {
            patient_id: selectedPatient,
            professional_id: professionalId,
            ...basicFilteredData
          };

          let basicResult;
          if (existingAnamnesisId) {
            basicResult = await supabase
              .from("anamnesis")
              .update(basicAnamnesisData)
              .eq("id", existingAnamnesisId);
          } else {
            basicResult = await supabase
              .from("anamnesis")
              .insert(basicAnamnesisData)
              .select();
          }

          if (basicResult.error) {
            throw basicResult.error;
          }

          // Atualizar cache para usar apenas campos básicos
          columnCheckCache = basicDatabaseFields;

          toast({
            title: "Parcialmente Salvo",
            description: "Anamnese salva com campos básicos. Alguns campos avançados podem não ter sido salvos devido a limitações do banco de dados.",
            variant: "default",
          });
          return;

        } catch (basicError) {
          console.error("❌ Erro mesmo com campos básicos:", basicError);
        }
      }
      
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

  const exportPDF = async () => {
    if (!selectedPatient || !formData) {
      toast({
        title: "Atenção",
        description: "Por favor, selecione um paciente e preencha os dados.",
        variant: "destructive",
      });
      return;
    }

    let currentAnamnesisId = existingAnamnesisId;

    // First, make sure the anamnesis is saved before exporting
    if (!currentAnamnesisId) {
      try {
        setIsSubmitting(true);
        
        const availableColumns = await getAvailableColumns();
        const filteredData = filterDatabaseFields(formData, availableColumns);
        
        const anamnesisData: Record<string, any> = {
          patient_id: selectedPatient,
          professional_id: professionalId,
          ...filteredData
        };

        const result = await supabase
          .from("anamnesis")
          .insert(anamnesisData)
          .select();

        if (result.error) {
          throw result.error;
        }

        if (result.data && result.data.length > 0) {
          currentAnamnesisId = result.data[0].id;
          setExistingAnamnesisId(currentAnamnesisId);
        } else {
          toast({
            title: "Erro",
            description: "Não foi possível salvar a anamnese para exportar o PDF.",
            variant: "destructive",
          });
          return;
        }
      } catch (error: any) {
        console.error("Erro ao salvar anamnese para PDF:", error);
        toast({
          title: "Erro",
          description: "Erro ao salvar anamnese antes da exportação.",
          variant: "destructive",
        });
        return;
      } finally {
        setIsSubmitting(false);
      }
    }

    try {
      setIsExportingPDF(true);
      
      // Get patient name
      const patient = patients.find(p => p.id === selectedPatient);
      const patientName = patient?.name || "Paciente";

      // Get professional data
      const { data: professionalData, error: profError } = await supabase
        .from("professionals")
        .select("*")
        .eq("id", professionalId)
        .single();

      let professional = professionalData;
      
      if (profError || !professionalData) {
        // Fallback to user data
        professional = {
          id: professionalId,
          name: userName,
          email: userEmail,
          specialty: "Musicoterapeuta",
          phone: "",
          license_number: "",
          register: "",
          association: "",
          avatar_url: "",
          digital_signature_url: null,
          digital_stamp_url: null,
          stamp_photo_url: "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: professionalId
        };
      }

      // Converter imagens para Base64
      let professionalPhotoBase64: string | null = null;
      let digitalStampBase64: string | null = null;

      if (professional?.avatar_url) {
        try {
          console.log("🖼️ Convertendo foto do profissional para Base64...");
          professionalPhotoBase64 = await imageUrlToBase64(professional.avatar_url);
        } catch (e) {
          console.warn("⚠️ Não foi possível converter foto para Base64:", e);
        }
      }

      if (professional?.digital_stamp_url) {
        try {
          console.log("🔖 Convertendo carimbo digital para Base64...");
          digitalStampBase64 = await imageUrlToBase64(professional.digital_stamp_url);
        } catch (e) {
          console.warn("⚠️ Não foi possível converter carimbo para Base64:", e);
        }
      }

      const anamnesisDataForPDF = {
        ...formData,
        id: currentAnamnesisId,
        patient_id: selectedPatient,
        professional_id: professionalId,
        created_at: formData.created_at || new Date().toISOString(),
        patient_name: patientName
      };

      const success = await generateProfessionalAnamnesePDF(
        anamnesisDataForPDF,
        professional,
        patientName,
        professionalPhotoBase64,
        digitalStampBase64
      );

      if (success) {
        toast({
          title: "Sucesso",
          description: "PDF da anamnese exportado com sucesso!",
        });
      } else {
        throw new Error("Falha na geração do PDF");
      }
      
    } catch (error: any) {
      console.error("Erro ao exportar PDF:", error);
      toast({
        title: "Erro",
        description: "Não foi possível exportar o PDF da anamnese.",
        variant: "destructive",
      });
    } finally {
      setIsExportingPDF(false);
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
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando formulário...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full px-0 sm:px-2 py-4 space-y-6 max-w-6xl mx-auto">
        <Card className="border-0 shadow-2xl overflow-hidden">
          <ModernAnamnesisHeader editMode={!!editAnamnesisId} />
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Patient Selection */}
              <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                <PatientSelect
                  patients={patients}
                  selectedPatient={selectedPatient}
                  onSelect={setSelectedPatient}
                  disabled={!!editPatientId}
                />
              </div>
              
              {/* Form Content in Tabs */}
              <ModernTabsNavigation>
                <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                  <InitialEvaluationForm
                    content={formData}
                    onChange={updateFormData}
                  />
                </div>
              </ModernTabsNavigation>

              {/* Action Buttons */}
              <ModernActionButtons
                onSave={saveAnamnesis}
                onCancel={() => onBack ? onBack() : navigate("/processes")}
                onExportPDF={exportPDF}
                isSaving={isSubmitting}
                isExportingPDF={isExportingPDF}
                showBack={!!onBack}
              />
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
