import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PatientSelect } from "./components/PatientSelect";
import { SelectField } from "./components/SelectField";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";
import html2pdf from "html2pdf.js";

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
    observations: "",
  });

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

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      setUserEmail(user.email || "");
      setUserName(formatNameFromEmail(user.email || ""));

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

  const generatePDF = async (patientName: string) => {
    const element = document.createElement('div');
    
    const generateContentHTML = (content: Record<string, string>) => {
      const sections = [
        {
          title: "Identificação e Histórico",
          fields: [
            { key: "main_complaint", label: "Queixa Principal" },
            { key: "medical_history", label: "Histórico Médico" },
            { key: "current_medications", label: "Medicações Atuais" },
            { key: "family_history", label: "Histórico Familiar" }
          ]
        },
        {
          title: "Avaliação Musical",
          fields: [
            { key: "musical_background", label: "Experiência Musical" },
            { key: "musical_preferences", label: "Preferências Musicais" },
            { key: "musical_skills", label: "Habilidades Musicais" },
            { key: "emotional_response_to_music", label: "Resposta Emocional à Música" }
          ]
        },
        {
          title: "Avaliação Comunicativa",
          fields: [
            { key: "communication_skills", label: "Habilidades de Comunicação" },
            { key: "social_interaction", label: "Interação Social" },
            { key: "emotional_expression", label: "Expressão Emocional" }
          ]
        },
        {
          title: "Avaliação Sensório-Motora",
          fields: [
            { key: "motor_skills", label: "Habilidades Motoras" },
            { key: "auditory_processing", label: "Processamento Auditivo" },
            { key: "rhythmic_responses", label: "Respostas Rítmicas" }
          ]
        },
        {
          title: "Avaliação Cognitiva",
          fields: [
            { key: "cognitive_functions", label: "Funções Cognitivas" },
            { key: "attention_span", label: "Capacidade de Atenção" },
            { key: "memory_function", label: "Função da Memória" }
          ]
        },
        {
          title: "Observações Adicionais",
          fields: [
            { key: "observations", label: "Observações" }
          ]
        }
      ];

      return sections.map(section => {
        const sectionContent = section.fields
          .filter(field => content[field.key])
          .map(field => {
            return `
              <div style="margin-bottom: 16px;">
                <div style="font-weight: 600; font-size: 13px; margin-bottom: 6px; color: #374151;">
                  ${field.label}
                </div>
                <div style="background-color: #F9FAFB; padding: 12px; border-radius: 6px; border: 1px solid #E5E7EB; white-space: pre-wrap; font-size: 13px; line-height: 1.6; color: #1F2937;">
                  ${String(content[field.key]).replace(/\n/g, '<br>')}
                </div>
              </div>
            `;
          })
          .join('');

        if (sectionContent) {
          return `
            <div style="margin-bottom: 32px;">
              <h2 style="color: #1F2937; font-size: 16px; font-weight: 600; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid #E5E7EB;">
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
        <div style="text-align: center; margin-bottom: 48px; padding-bottom: 32px; border-bottom: 2px solid #E5E7EB;">
          <div style="margin-bottom: 24px;">
            <img src="/lovable-uploads/86b61f63-0028-428c-90d1-44c71413e24a.png" style="width: 200px; height: auto; margin: 0 auto;">
          </div>
          <h1 style="color: #2563EB; font-size: 28px; font-weight: bold; margin-bottom: 16px;">
            Anamnese Musicoterapêutica
          </h1>
          <h2 style="color: #1F2937; font-size: 20px; margin-bottom: 8px;">
            Paciente: ${patientName}
          </h2>
          <p style="color: #6B7280; font-size: 14px;">
            Data da Avaliação: ${new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>

        <div style="margin-bottom: 48px;">
          ${generateContentHTML(formData)}
        </div>

        <div style="margin-top: 48px; padding-top: 24px; border-top: 2px solid #E5E7EB; text-align: center;">
          <p style="color: #6B7280; font-size: 12px; margin-bottom: 8px;">
            Documento gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}
          </p>
          <p style="color: #6B7280; font-size: 12px; margin-bottom: 8px;">
            Musetera - Sistema de Gestão para Musicoterapia
          </p>
          <p style="color: #6B7280; font-size: 12px; margin-bottom: 8px;">
            Musicoterapeuta: ${userName}
          </p>
          <p style="color: #6B7280; font-size: 12px;">
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

    try {
      const { error } = await supabase
        .from("anamnesis")
        .insert({
          ...formData,
          patient_id: selectedPatient,
          professional_id: professionalId,
        });

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
          options: [
            { value: "ansiedade", label: "Ansiedade" },
            { value: "depressao", label: "Depressão" },
            { value: "autismo", label: "Transtorno do Espectro Autista" },
            { value: "desenvolvimento", label: "Atraso no Desenvolvimento" },
            { value: "comportamental", label: "Problemas Comportamentais" },
            { value: "outro", label: "Outro" },
          ],
        },
        {
          key: "medical_history",
          label: "Histórico Médico",
          options: [
            { value: "sem_historico", label: "Sem histórico relevante" },
            { value: "neurologico", label: "Condição Neurológica" },
            { value: "psiquiatrico", label: "Condição Psiquiátrica" },
            { value: "desenvolvimento", label: "Atraso no Desenvolvimento" },
            { value: "outro", label: "Outro" },
          ],
        },
      ],
    },
    {
      title: "Avaliação Musical",
      fields: [
        {
          key: "musical_background",
          label: "Experiência Musical",
          options: [
            { value: "nenhuma", label: "Nenhuma experiência" },
            { value: "basica", label: "Experiência básica" },
            { value: "intermediaria", label: "Experiência intermediária" },
            { value: "avancada", label: "Experiência avançada" },
          ],
        },
        {
          key: "musical_preferences",
          label: "Preferências Musicais",
          options: [
            { value: "popular", label: "Música Popular" },
            { value: "infantil", label: "Música Infantil" },
            { value: "classica", label: "Música Cl��ssica" },
            { value: "religiosa", label: "Música Religiosa" },
            { value: "variada", label: "Preferências Variadas" },
          ],
        },
      ],
    },
    {
      title: "Avaliação Comunicativa",
      fields: [
        {
          key: "communication_skills",
          label: "Nível de Comunicaç��o",
          options: [
            { value: "nao_verbal", label: "Não-verbal" },
            { value: "limitada", label: "Comunicação limitada" },
            { value: "funcional", label: "Comunicação funcional" },
            { value: "fluente", label: "Comunicação fluente" },
          ],
        },
        {
          key: "social_interaction",
          label: "Interação Social",
          options: [
            { value: "isolado", label: "Isolamento social" },
            { value: "limitada", label: "Interação limitada" },
            { value: "seletiva", label: "Interação seletiva" },
            { value: "adequada", label: "Interação adequada" },
          ],
        },
      ],
    },
    {
      title: "Avaliação Sensório-Motora",
      fields: [
        {
          key: "motor_skills",
          label: "Habilidades Motoras",
          options: [
            { value: "comprometida", label: "Severamente comprometida" },
            { value: "limitada", label: "Limitada" },
            { value: "moderada", label: "Moderada" },
            { value: "adequada", label: "Adequada" },
          ],
        },
        {
          key: "rhythmic_responses",
          label: "Respostas Rítmicas",
          options: [
            { value: "ausente", label: "Ausente" },
            { value: "inconsistente", label: "Inconsistente" },
            { value: "moderada", label: "Moderada" },
            { value: "adequada", label: "Adequada" },
          ],
        },
      ],
    },
    {
      title: "Avaliação Cognitiva",
      fields: [
        {
          key: "attention_span",
          label: "Capacidade de Atenção",
          options: [
            { value: "muito_baixa", label: "Muito baixa" },
            { value: "baixa", label: "Baixa" },
            { value: "moderada", label: "Moderada" },
            { value: "adequada", label: "Adequada" },
          ],
        },
        {
          key: "memory_function",
          label: "Função da Memória",
          options: [
            { value: "comprometida", label: "Comprometida" },
            { value: "limitada", label: "Limitada" },
            { value: "moderada", label: "Moderada" },
            { value: "preservada", label: "Preservada" },
          ],
        },
      ],
    },
  ];

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
                <Label>Observações</Label>
                <Textarea
                  value={formData.observations}
                  onChange={(e) => handleInputChange("observations", e.target.value)}
                  placeholder="Adicione observações relevantes que não se encaixam nas categorias acima"
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
