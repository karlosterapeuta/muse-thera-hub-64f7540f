
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PatientSelect } from "./components/PatientSelect";
import { Download, Save, FileText, List } from "lucide-react";
import html2pdf from "html2pdf.js";
import { InitialEvaluationForm } from "./components/InitialEvaluationForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import SavedAnamnesisView from "./components/SavedAnamnesisView";

type Patient = {
  id: string;
  name: string;
};

type Professional = {
  email: string;
};

// Lista de campos conhecidos do banco de dados anamnesis (apenas campos que existem)
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
  'extracurricular_activities', 'williams_syndrome', 'depression',
  // Campos confirmados que existem no banco
  'aba_therapy', 'psychomotricity', 'music_therapy', 'nutrition', 'sensory_integration', 'alzheimer'
];

export default function AnamnesisForm() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [professionalId, setProfessionalId] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [existingAnamnesisId, setExistingAnamnesisId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentView, setCurrentView] = useState<'form' | 'saved'>('form');
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

      setUserEmail(user.email || "");
      setUserName(formatNameFromEmail(user.email || ""));

      // Usando o user.id diretamente como professional_id
      setProfessionalId(user.id);

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
      console.log("Loading anamnesis for patient:", selectedPatient);
      // Modified query to order by created_at desc and limit to 1 record
      const { data: anamnesisData, error } = await supabase
        .from("anamnesis")
        .select("*")
        .eq("patient_id", selectedPatient)
        .order('created_at', { ascending: false })
        .limit(1)
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
        console.log("Anamnesis data loaded:", anamnesisData);
        setFormData(anamnesisData);
        setExistingAnamnesisId(anamnesisData.id);
      } else {
        // Reset form data if no anamnesis exists for this patient
        console.log("No anamnesis data found, resetting form");
        setFormData({});
        setExistingAnamnesisId(null);
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

  // Filtrar dados para incluir apenas campos conhecidos do banco de dados
  const filterDatabaseFields = (data: Record<string, any>) => {
    const filteredData: Record<string, any> = {};
    
    // First extract only known fields
    Object.entries(data).forEach(([key, value]) => {
      if (knownDatabaseFields.includes(key.toLowerCase())) {
        // Ensure consistent casing for field names
        const normalizedKey = key.toLowerCase();
        // Ensure boolean values are properly typed
        if (typeof value === 'boolean' || value === true || value === false) {
          filteredData[normalizedKey] = Boolean(value);
        } else {
          filteredData[normalizedKey] = value;
        }
      }
    });
    
    console.log("Filtered database fields:", filteredData);
    return filteredData;
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
            { id: "depression", label: "Depressão" },
            { id: "other_diagnoses", label: "Outros Diagnósticos" },
            { id: "alzheimer", label: "Alzheimer" }
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
            { id: "equine_therapy", label: "Equoterapia" },
            { id: "aba_therapy", label: "Terapia ABA" },
            { id: "psychomotricity", label: "Psicomotricidade" },
            { id: "music_therapy", label: "Musicoterapia" },
            { id: "nutrition", label: "Nutrição" },
            { id: "sensory_integration", label: "Integração Sensorial" }
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
            { id: "extracurricular_activities", label: "Atividades Extracurriculares" }
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

    try {
      await html2pdf().from(element).set(opt).save();
      return true;
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      return false;
    }
  };

  // Handle form data changes
  const updateFormData = (newData: Record<string, any>) => {
    console.log("Atualizando dados do formulário:", newData);
    setFormData(newData);
  };

  // Simplified save function with only existing database fields
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
      
      console.log("Debug - dados brutos do formulário:", formData);
      
      // Filtrar dados para incluir apenas campos conhecidos do banco de dados
      const filteredData = filterDatabaseFields(formData);
      console.log("Debug - dados filtrados:", filteredData);
      
      // Preparar dados para salvar
      const anamnesisData: Record<string, any> = {
        patient_id: selectedPatient,
        professional_id: professionalId,
        ...filteredData
      };
      
      console.log("Debug - tentando salvar dados:", anamnesisData);

      let result;
      
      // Determine if we should insert or update
      if (existingAnamnesisId) {
        // Update existing record
        result = await supabase
          .from("anamnesis")
          .update(anamnesisData)
          .eq("id", existingAnamnesisId);
          
        if (result.error) {
          console.error("Erro ao atualizar anamnese:", result.error);
          throw result.error;
        }
      } else {
        // Insert new record
        result = await supabase
          .from("anamnesis")
          .insert(anamnesisData)
          .select();
          
        if (result.error) {
          console.error("Erro ao inserir anamnese:", result.error);
          throw result.error;
        }
        
        // Get the ID of the newly created record
        if (result.data && result.data.length > 0) {
          setExistingAnamnesisId(result.data[0].id);
        }
      }

      toast({
        title: "Sucesso!",
        description: "Anamnese salva com sucesso no sistema.",
      });
      
      // Recarregar os dados para garantir que estamos usando os valores mais recentes
      await loadPatientAnamnesis();
      
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

  // Modified submit handler with improved error handling
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
        title: "Erro",
        description: "ID do profissional não encontrado.",
        variant: "destructive",
      });
      return;
    }

    if (isSubmitting) {
      return; // Prevent multiple submissions
    }

    try {
      setIsSubmitting(true);
      
      // First save the data using our improved method
      await saveAnamnesis();
      
      // Only proceed with PDF generation if the save was successful
      
      // Find patient data
      const selectedPatientData = patients.find(p => p.id === selectedPatient);
      if (!selectedPatientData) {
        throw new Error("Dados do paciente não encontrados");
      }
      
      // Generate PDF
      const pdfGenerated = await generatePDF(selectedPatientData.name);
      
      if (pdfGenerated) {
        toast({
          title: "Sucesso!",
          description: "Anamnese salva e PDF gerado com sucesso.",
        });
      }
      
    } catch (error: any) {
      console.error("Erro ao processar anamnese:", error);
      
      let errorMessage = "Não foi possível processar a anamnese.";
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

  // Handle save only (without PDF generation)
  const handleSaveOnly = async () => {
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

    if (isSubmitting) {
      return; // Prevent multiple submissions
    }

    await saveAnamnesis();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-6 max-w-4xl">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          <span className="ml-3 text-lg text-gray-600">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-4xl">
      {/* Navigation Buttons */}
      <div className="flex justify-center gap-4 mb-6">
        <Button 
          onClick={() => setCurrentView('form')}
          variant={currentView === 'form' ? 'default' : 'outline'}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          Nova Anamnese
        </Button>
        <Button 
          onClick={() => setCurrentView('saved')}
          variant={currentView === 'saved' ? 'default' : 'outline'}
          className="flex items-center gap-2"
        >
          <List className="h-4 w-4" />
          Anamneses Salvas
        </Button>
      </div>

      {currentView === 'saved' ? (
        <SavedAnamnesisView />
      ) : (
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
                isLoading={isLoading}
              />
              
              {selectedPatient && (
                <>
                  {existingAnamnesisId && (
                    <Alert>
                      <AlertTitle>Anamnese existente encontrada</AlertTitle>
                      <AlertDescription>
                        Este paciente já possui uma anamnese cadastrada. Você pode editá-la ou criar uma nova.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <InitialEvaluationForm
                    content={formData}
                    onChange={updateFormData}
                  />
                  
                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSaveOnly}
                      disabled={isSubmitting}
                      className="w-32"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {isSubmitting ? "Salvando..." : "Salvar"}
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-32"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {isSubmitting ? "Processando..." : "Salvar e Gerar PDF"}
                    </Button>
                  </div>
                </>
              )}
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
