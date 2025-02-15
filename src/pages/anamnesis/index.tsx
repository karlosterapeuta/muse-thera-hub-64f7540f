
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    main_complaint: "",
    medical_history: "",
    current_medications: "",
    family_history: "",
    musical_background: "",
    musical_preferences: "",
    musical_skills: "",
    emotional_response_to_music: "",
    social_interaction: "",
    communication_skills: "",
    emotional_expression: "",
    motor_skills: "",
    auditory_processing: "",
    rhythmic_responses: "",
    cognitive_functions: "",
    attention_span: "",
    memory_function: "",
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
      
      // Carregar o ID do profissional
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data: professionalData, error: professionalError } = await supabase
        .from("professionals")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (professionalError) throw professionalError;
      setProfessionalId(professionalData.id);

      // Carregar lista de pacientes
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

  const handleInputChange = (
    field: keyof typeof formData,
    value: string
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
            <div className="space-y-4">
              <div>
                <Label>Paciente</Label>
                <Select 
                  value={selectedPatient} 
                  onValueChange={setSelectedPatient}
                >
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

              <h3 className="text-lg font-semibold pt-4">Dados Pessoais e Histórico</h3>
              <div>
                <Label>Queixa Principal</Label>
                <Textarea
                  value={formData.main_complaint}
                  onChange={(e) => handleInputChange("main_complaint", e.target.value)}
                  placeholder="Descreva a queixa principal do paciente"
                />
              </div>

              <div>
                <Label>Histórico Médico</Label>
                <Textarea
                  value={formData.medical_history}
                  onChange={(e) => handleInputChange("medical_history", e.target.value)}
                  placeholder="Inclua diagnósticos, tratamentos anteriores e condições relevantes"
                />
              </div>

              <div>
                <Label>Medicamentos Atuais</Label>
                <Textarea
                  value={formData.current_medications}
                  onChange={(e) => handleInputChange("current_medications", e.target.value)}
                  placeholder="Liste os medicamentos em uso"
                />
              </div>

              <div>
                <Label>Histórico Familiar</Label>
                <Textarea
                  value={formData.family_history}
                  onChange={(e) => handleInputChange("family_history", e.target.value)}
                  placeholder="Informações relevantes sobre o histórico familiar"
                />
              </div>

              <h3 className="text-lg font-semibold pt-4">Aspectos Musicais</h3>
              <div>
                <Label>Histórico Musical</Label>
                <Textarea
                  value={formData.musical_background}
                  onChange={(e) => handleInputChange("musical_background", e.target.value)}
                  placeholder="Experiências musicais prévias, educação musical"
                />
              </div>

              <div>
                <Label>Preferências Musicais</Label>
                <Textarea
                  value={formData.musical_preferences}
                  onChange={(e) => handleInputChange("musical_preferences", e.target.value)}
                  placeholder="Gêneros, artistas e músicas preferidas"
                />
              </div>

              <div>
                <Label>Habilidades Musicais</Label>
                <Textarea
                  value={formData.musical_skills}
                  onChange={(e) => handleInputChange("musical_skills", e.target.value)}
                  placeholder="Capacidade de cantar, tocar instrumentos, senso rítmico"
                />
              </div>

              <div>
                <Label>Resposta Emocional à Música</Label>
                <Textarea
                  value={formData.emotional_response_to_music}
                  onChange={(e) => handleInputChange("emotional_response_to_music", e.target.value)}
                  placeholder="Como o paciente responde emocionalmente a diferentes estímulos musicais"
                />
              </div>

              <h3 className="text-lg font-semibold pt-4">Aspectos Sociais e Comunicativos</h3>
              <div>
                <Label>Interação Social</Label>
                <Textarea
                  value={formData.social_interaction}
                  onChange={(e) => handleInputChange("social_interaction", e.target.value)}
                  placeholder="Padrões de interação social e relacionamentos"
                />
              </div>

              <div>
                <Label>Habilidades de Comunicação</Label>
                <Textarea
                  value={formData.communication_skills}
                  onChange={(e) => handleInputChange("communication_skills", e.target.value)}
                  placeholder="Comunicação verbal e não-verbal"
                />
              </div>

              <div>
                <Label>Expressão Emocional</Label>
                <Textarea
                  value={formData.emotional_expression}
                  onChange={(e) => handleInputChange("emotional_expression", e.target.value)}
                  placeholder="Capacidade de expressar e regular emoções"
                />
              </div>

              <h3 className="text-lg font-semibold pt-4">Aspectos Físicos e Motores</h3>
              <div>
                <Label>Habilidades Motoras</Label>
                <Textarea
                  value={formData.motor_skills}
                  onChange={(e) => handleInputChange("motor_skills", e.target.value)}
                  placeholder="Coordenação motora, mobilidade, tônus muscular"
                />
              </div>

              <div>
                <Label>Processamento Auditivo</Label>
                <Textarea
                  value={formData.auditory_processing}
                  onChange={(e) => handleInputChange("auditory_processing", e.target.value)}
                  placeholder="Capacidade de processamento e discriminação auditiva"
                />
              </div>

              <div>
                <Label>Respostas Rítmicas</Label>
                <Textarea
                  value={formData.rhythmic_responses}
                  onChange={(e) => handleInputChange("rhythmic_responses", e.target.value)}
                  placeholder="Capacidade de percepção e resposta a estímulos rítmicos"
                />
              </div>

              <h3 className="text-lg font-semibold pt-4">Aspectos Cognitivos</h3>
              <div>
                <Label>Funções Cognitivas</Label>
                <Textarea
                  value={formData.cognitive_functions}
                  onChange={(e) => handleInputChange("cognitive_functions", e.target.value)}
                  placeholder="Atenção, memória, funções executivas"
                />
              </div>

              <div>
                <Label>Span de Atenção</Label>
                <Textarea
                  value={formData.attention_span}
                  onChange={(e) => handleInputChange("attention_span", e.target.value)}
                  placeholder="Capacidade de manter atenção e foco"
                />
              </div>

              <div>
                <Label>Função da Memória</Label>
                <Textarea
                  value={formData.memory_function}
                  onChange={(e) => handleInputChange("memory_function", e.target.value)}
                  placeholder="Memória de curto e longo prazo, memória musical"
                />
              </div>

              <h3 className="text-lg font-semibold pt-4">Avaliação e Objetivos</h3>
              <div>
                <Label>Objetivos Terapêuticos</Label>
                <Textarea
                  value={formData.therapeutic_goals}
                  onChange={(e) => handleInputChange("therapeutic_goals", e.target.value)}
                  placeholder="Objetivos específicos do tratamento musicoterapêutico"
                />
              </div>

              <div>
                <Label>Abordagem de Tratamento</Label>
                <Textarea
                  value={formData.treatment_approach}
                  onChange={(e) => handleInputChange("treatment_approach", e.target.value)}
                  placeholder="Métodos e técnicas planejadas"
                />
              </div>

              <div>
                <Label>Observações Adicionais</Label>
                <Textarea
                  value={formData.observations}
                  onChange={(e) => handleInputChange("observations", e.target.value)}
                  placeholder="Outras observações relevantes"
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
              <Button type="submit">Salvar Anamnese</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
