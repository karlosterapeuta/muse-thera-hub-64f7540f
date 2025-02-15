
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SelectField } from "./components/SelectField";

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
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const { data, error } = await supabase
        .from("patients")
        .select("id, name")
        .order("name");

      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error("Erro ao carregar pacientes:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de pacientes.",
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data: professionalData, error: professionalError } = await supabase
        .from("professionals")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (professionalError) throw professionalError;

      const { error } = await supabase
        .from("treatment_plans")
        .insert({
          ...formData,
          patient_id: selectedPatient,
          professional_id: professionalData.id,
          status: "active",
          created_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Plano terapêutico criado com sucesso.",
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
            <div className="space-y-4">
              <Label>Paciente</Label>
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um paciente" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
              <Button type="submit">Salvar Plano Terapêutico</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
