
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PatientSelect } from "./components/PatientSelect";
import { FormSection } from "./components/FormSection";

type Patient = {
  id: string;
  name: string;
};

export default function AnamnesisForm() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [professionalId, setProfessionalId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Identificação e Histórico
    main_complaint: "",
    medical_history: "",
    current_medications: "",
    family_history: "",
    
    // Avaliação Musical
    musical_background: "",
    musical_preferences: "",
    musical_skills: "",
    emotional_response_to_music: "",
    
    // Avaliação Comunicativa
    social_interaction: "",
    communication_skills: "",
    emotional_expression: "",
    
    // Avaliação Sensório-Motora
    motor_skills: "",
    auditory_processing: "",
    rhythmic_responses: "",
    
    // Avaliação Cognitiva
    cognitive_functions: "",
    attention_span: "",
    memory_function: "",
    
    // Plano Terapêutico
    therapeutic_goals: "",
    treatment_approach: "",
    observations: "",
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data: professionalData, error: professionalError } = await supabase
        .from("professionals")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (professionalError) throw professionalError;
      setProfessionalId(professionalData.id);

      const { data: patientsData, error: patientsError } = await supabase
        .from("patients")
        .select("id, name")
        .order("name");

      if (patientsError) throw patientsError;
      setPatients(patientsData);

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

    try {
      const { error } = await supabase
        .from("anamnesis")
        .insert({
          ...formData,
          patient_id: selectedPatient,
          professional_id: professionalId,
        });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Anamnese registrada com sucesso.",
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

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const sections = [
    {
      title: "Identificação e Histórico",
      fields: [
        {
          key: "main_complaint",
          label: "Queixa Principal",
          placeholder: "Descreva a queixa principal e motivo do encaminhamento",
          value: formData.main_complaint,
          onChange: (value: string) => handleInputChange("main_complaint", value),
        },
        {
          key: "medical_history",
          label: "Histórico Médico e Diagnóstico",
          placeholder: "Condições médicas, diagnósticos, tratamentos anteriores",
          value: formData.medical_history,
          onChange: (value: string) => handleInputChange("medical_history", value),
        },
        {
          key: "current_medications",
          label: "Medicamentos em Uso",
          placeholder: "Medicamentos atuais, dosagens e frequência",
          value: formData.current_medications,
          onChange: (value: string) => handleInputChange("current_medications", value),
        },
        {
          key: "family_history",
          label: "Histórico Familiar Relevante",
          placeholder: "Condições hereditárias, histórico familiar relevante",
          value: formData.family_history,
          onChange: (value: string) => handleInputChange("family_history", value),
        },
      ],
    },
    {
      title: "Avaliação Musical",
      fields: [
        {
          key: "musical_background",
          label: "Histórico Musical",
          placeholder: "Formação musical, experiências prévias, instrumentos",
          value: formData.musical_background,
          onChange: (value: string) => handleInputChange("musical_background", value),
        },
        {
          key: "musical_preferences",
          label: "Preferências Musicais",
          placeholder: "Gêneros musicais, artistas, canções significativas",
          value: formData.musical_preferences,
          onChange: (value: string) => handleInputChange("musical_preferences", value),
        },
        {
          key: "musical_skills",
          label: "Habilidades Musicais",
          placeholder: "Capacidades vocais, instrumentais, percepção musical",
          value: formData.musical_skills,
          onChange: (value: string) => handleInputChange("musical_skills", value),
        },
        {
          key: "emotional_response_to_music",
          label: "Resposta Emocional à Música",
          placeholder: "Reações emocionais, memórias associadas, ISO musical",
          value: formData.emotional_response_to_music,
          onChange: (value: string) => handleInputChange("emotional_response_to_music", value),
        },
      ],
    },
    {
      title: "Avaliação Comunicativa",
      fields: [
        {
          key: "social_interaction",
          label: "Interação Social",
          placeholder: "Padrões de socialização, vínculos, isolamento",
          value: formData.social_interaction,
          onChange: (value: string) => handleInputChange("social_interaction", value),
        },
        {
          key: "communication_skills",
          label: "Habilidades de Comunicação",
          placeholder: "Comunicação verbal/não-verbal, expressão musical",
          value: formData.communication_skills,
          onChange: (value: string) => handleInputChange("communication_skills", value),
        },
        {
          key: "emotional_expression",
          label: "Expressão Emocional",
          placeholder: "Regulação emocional, expressão através da música",
          value: formData.emotional_expression,
          onChange: (value: string) => handleInputChange("emotional_expression", value),
        },
      ],
    },
    {
      title: "Avaliação Sensório-Motora",
      fields: [
        {
          key: "motor_skills",
          label: "Habilidades Motoras",
          placeholder: "Motricidade, coordenação, resposta motora à música",
          value: formData.motor_skills,
          onChange: (value: string) => handleInputChange("motor_skills", value),
        },
        {
          key: "auditory_processing",
          label: "Processamento Auditivo",
          placeholder: "Discriminação sonora, atenção auditiva, memória musical",
          value: formData.auditory_processing,
          onChange: (value: string) => handleInputChange("auditory_processing", value),
        },
        {
          key: "rhythmic_responses",
          label: "Respostas Rítmicas",
          placeholder: "Sincronização, pulsação, padrões rítmicos",
          value: formData.rhythmic_responses,
          onChange: (value: string) => handleInputChange("rhythmic_responses", value),
        },
      ],
    },
    {
      title: "Avaliação Cognitiva",
      fields: [
        {
          key: "cognitive_functions",
          label: "Funções Cognitivas",
          placeholder: "Atenção, memória, funções executivas musicais",
          value: formData.cognitive_functions,
          onChange: (value: string) => handleInputChange("cognitive_functions", value),
        },
        {
          key: "attention_span",
          label: "Capacidade de Atenção",
          placeholder: "Foco em atividades musicais, tempo de engajamento",
          value: formData.attention_span,
          onChange: (value: string) => handleInputChange("attention_span", value),
        },
        {
          key: "memory_function",
          label: "Função da Memória",
          placeholder: "Memória musical, recordação de letras e melodias",
          value: formData.memory_function,
          onChange: (value: string) => handleInputChange("memory_function", value),
        },
      ],
    },
    {
      title: "Plano Terapêutico",
      fields: [
        {
          key: "therapeutic_goals",
          label: "Objetivos Terapêuticos",
          placeholder: "Objetivos específicos, metas musicoterapêuticas",
          value: formData.therapeutic_goals,
          onChange: (value: string) => handleInputChange("therapeutic_goals", value),
        },
        {
          key: "treatment_approach",
          label: "Abordagem de Tratamento",
          placeholder: "Métodos musicoterapêuticos, técnicas planejadas",
          value: formData.treatment_approach,
          onChange: (value: string) => handleInputChange("treatment_approach", value),
        },
        {
          key: "observations",
          label: "Observações Técnicas",
          placeholder: "Observações específicas, recomendações adicionais",
          value: formData.observations,
          onChange: (value: string) => handleInputChange("observations", value),
        },
      ],
    },
  ];

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Anamnese Musicoterapêutica Profissional</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <PatientSelect
              patients={patients}
              selectedPatient={selectedPatient}
              onSelect={setSelectedPatient}
            />
            
            {sections.map((section) => (
              <FormSection
                key={section.title}
                title={section.title}
                fields={section.fields}
              />
            ))}

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/processes")}
              >
                Cancelar
              </Button>
              <Button type="submit">Salvar Anamnese</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
