import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import html2pdf from "html2pdf.js";
import { PatientSelect } from "../anamnesis/components/PatientSelect";

const formSchema = z.object({
  patient_id: z.string({
    required_error: "Por favor, selecione um paciente",
  }),
  date: z.date({
    required_error: "Por favor, selecione uma data",
  }),
  therapeutic_progress: z.object({
    musical_engagement: z.string(),
    emotional_expression: z.string(),
    social_interaction: z.string(),
    communication: z.string(),
    cognitive_function: z.string(),
    motor_skills: z.string(),
  }),
  treatment_effectiveness: z.object({
    objectives_achievement: z.string(),
    intervention_response: z.string(),
    technique_effectiveness: z.string(),
  }),
  recommendations: z.string().optional(),
  adjustments_needed: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type Patient = {
  id: string;
  name: string;
};

const therapeuticProgressFields = {
  musical_engagement: "Engajamento Musical",
  emotional_expression: "Expressão Emocional",
  social_interaction: "Interação Social",
  communication: "Comunicação",
  cognitive_function: "Função Cognitiva",
  motor_skills: "Habilidades Motoras",
} as const;

const treatmentEffectivenessFields = {
  objectives_achievement: "Alcance dos Objetivos",
  intervention_response: "Resposta às Intervenções",
  technique_effectiveness: "Efetividade das Técnicas",
} as const;

export default function ReevaluationForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      therapeutic_progress: {
        musical_engagement: "O paciente demonstrou engajamento significativo nas atividades musicais propostas, participando ativamente das sessões e mostrando interesse crescente pelos instrumentos e atividades rítmicas. Houve melhora notável na iniciativa musical e na expressão através da música.",
        emotional_expression: "Observou-se progresso na capacidade de expressar emoções através da música. O paciente consegue utilizar diferentes elementos musicais para comunicar seus estados emocionais, demonstrando maior consciência e regulação emocional durante as sessões.",
        social_interaction: "Houve evolução positiva nas interações sociais durante as atividades em grupo. O paciente desenvolveu maior capacidade de aguardar sua vez, compartilhar instrumentos e participar de atividades musicais coletivas.",
        communication: "Notou-se melhora significativa na comunicação verbal e não-verbal. O paciente demonstra maior facilidade em se expressar através da música e aumentou seu vocabulário relacionado às experiências musicais.",
        cognitive_function: "Observou-se progresso nas habilidades cognitivas, incluindo melhor atenção, memória musical e capacidade de seguir sequências rítmicas. O paciente demonstra maior compreensão e retenção das atividades propostas.",
        motor_skills: "Houve desenvolvimento positivo nas habilidades motoras, especialmente no controle motor fino ao manipular instrumentos musicais. A coordenação rítmica e a sincronização de movimentos apresentaram melhora significativa.",
      },
      treatment_effectiveness: {
        objectives_achievement: "Os objetivos terapêuticos estabelecidos inicialmente foram alcançados de forma satisfatória. O paciente apresentou progresso consistente nas áreas prioritárias identificadas no plano terapêutico.",
        intervention_response: "As intervenções musicoterapêuticas demonstraram efetividade significativa, com o paciente respondendo positivamente às técnicas e estratégias implementadas durante as sessões.",
        technique_effectiveness: "As técnicas musicoterapêuticas utilizadas mostraram-se apropriadas e eficazes para as necessidades do paciente, contribuindo para o progresso observado em diferentes áreas do desenvolvimento.",
      },
      recommendations: "Recomenda-se a continuidade do processo musicoterapêutico, mantendo o foco no desenvolvimento das habilidades já trabalhadas e introduzindo gradualmente novos desafios musicais. Sugere-se também a inclusão de mais atividades de improvisação musical e a intensificação do trabalho com instrumentos de percussão.",
      adjustments_needed: "Propõe-se alguns ajustes no plano terapêutico para otimizar os resultados: 1) Aumentar a duração das atividades de expressão musical livre; 2) Introduzir mais elementos de música e movimento; 3) Desenvolver atividades específicas para estimular a criatividade musical.",
    },
  });

  const formatNameFromEmail = (email: string) => {
    const namePart = email.split('@')[0];
    return namePart
      .split(/[._-]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) {
          console.error('Erro de autenticação:', authError);
          throw authError;
        }
        if (!user) {
          console.error('Usuário não autenticado');
          throw new Error("Usuário não autenticado");
        }

        setUserEmail(user.email || "");
        setUserName(formatNameFromEmail(user.email || ""));

        console.log('Buscando pacientes para usuário:', user.id);

        const { data: patientsData, error: patientsError } = await supabase
          .from('patients')
          .select('id, name')
          .eq('professional_id', user.id)
          .order('name');

        if (patientsError) {
          console.error('Erro ao buscar pacientes:', patientsError);
          throw patientsError;
        }

        console.log('Dados dos pacientes retornados:', patientsData);
        
        if (!patientsData || patientsData.length === 0) {
          console.log('Nenhum paciente encontrado para o profissional');
        } else {
          console.log(`${patientsData.length} pacientes encontrados`);
        }

        setPatients(patientsData || []);

      } catch (error) {
        console.error("Erro detalhado ao carregar dados:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados do usuário ou pacientes. Por favor, tente novamente.",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [toast]);

  const generatePDF = async (patientName: string, formData: FormValues) => {
    const element = document.createElement('div');
    
    const generateContentHTML = (content: FormValues) => {
      const sections = [
        {
          title: "Progresso Terapêutico",
          fields: [
            { key: "musical_engagement", label: "Engajamento Musical", value: content.therapeutic_progress.musical_engagement },
            { key: "emotional_expression", label: "Expressão Emocional", value: content.therapeutic_progress.emotional_expression },
            { key: "social_interaction", label: "Interação Social", value: content.therapeutic_progress.social_interaction },
            { key: "communication", label: "Comunicação", value: content.therapeutic_progress.communication },
            { key: "cognitive_function", label: "Função Cognitiva", value: content.therapeutic_progress.cognitive_function },
            { key: "motor_skills", label: "Habilidades Motoras", value: content.therapeutic_progress.motor_skills },
          ]
        },
        {
          title: "Efetividade do Tratamento",
          fields: [
            { key: "objectives_achievement", label: "Alcance dos Objetivos", value: content.treatment_effectiveness.objectives_achievement },
            { key: "intervention_response", label: "Resposta às Intervenções", value: content.treatment_effectiveness.intervention_response },
            { key: "technique_effectiveness", label: "Efetividade das Técnicas", value: content.treatment_effectiveness.technique_effectiveness },
          ]
        },
        {
          title: "Conclusões e Ajustes",
          fields: [
            { key: "recommendations", label: "Recomendações", value: content.recommendations },
            { key: "adjustments_needed", label: "Ajustes Necessários", value: content.adjustments_needed },
          ]
        }
      ];

      return sections
        .map(section => {
          const sectionContent = section.fields
            .filter(field => field.value)
            .map(field => `
              <div style="margin-bottom: 16px;">
                <div style="font-weight: 600; font-size: 15px; margin-bottom: 6px; color: #374151;">
                  ${field.label}
                </div>
                <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
                  ${String(field.value || '').split('\n').join('<br>')}
                </div>
              </div>
            `)
            .join('');

          if (sectionContent) {
            return `
              <div style="margin-bottom: 28px;">
                <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
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

    element.innerHTML = `
      <div style="padding: 40px; font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #E5E7EB;">
          <div style="margin-bottom: 24px;">
            <img src="/lovable-uploads/86b61f63-0028-428c-90d1-44c71413e24a.png" style="width: 200px; height: auto; margin: 0 auto;">
          </div>
          <h1 style="color: #2563EB; font-size: 28px; font-weight: bold; margin-bottom: 16px;">
            Reavaliação Musicoterapêutica
          </h1>
          <h2 style="color: #1F2937; font-size: 22px; margin-bottom: 12px;">
            Paciente: ${patientName}
          </h2>
          <p style="color: #6B7280; font-size: 16px;">
            Data da Reavaliação: ${format(formData.date, 'PPP', { locale: ptBR })}
          </p>
        </div>

        <div style="margin-bottom: 32px;">
          ${generateContentHTML(formData)}
        </div>

        <div style="margin-top: 32px; padding-top: 24px; border-top: 2px solid #E5E7EB; text-align: center;">
          <p style="color: #6B7280; font-size: 13px; margin-bottom: 4px;">
            Documento gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}
          </p>
          <p style="color: #6B7280; font-size: 13px; margin-bottom: 4px;">
            Musetera - Sistema de Gestão para Musicoterapia
          </p>
          <p style="color: #6B7280; font-size: 13px; margin-bottom: 4px;">
            Musicoterapeuta: ${userName}
          </p>
          <p style="color: #6B7280; font-size: 13px;">
            Email: ${userEmail}
          </p>
        </div>
      </div>
    `;

    const opt = {
      margin: [20, 20, 20, 20],
      filename: `Reavaliação - ${patientName}.pdf`,
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

  const onSubmit = async (data: FormValues) => {
    try {
      const selectedPatient = patients.find(p => p.id === data.patient_id);
      if (!selectedPatient) {
        throw new Error("Paciente não encontrado");
      }

      const { error } = await supabase
        .from("assessments")
        .insert({
          patient_id: data.patient_id,
          date: format(data.date, "yyyy-MM-dd'T'HH:mm:ssXXX"),
          type: "reevaluation",
          content: {
            therapeutic_progress: data.therapeutic_progress,
            treatment_effectiveness: data.treatment_effectiveness,
            recommendations: data.recommendations,
            adjustments_needed: data.adjustments_needed,
          },
        });

      if (error) throw error;

      await generatePDF(selectedPatient.name, data);

      toast({
        title: "Sucesso!",
        description: "Reavaliação registrada e PDF gerado com sucesso.",
      });

      navigate("/processes");
    } catch (error) {
      console.error("Erro ao salvar reavaliação:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a reavaliação.",
        variant: "destructive",
      });
    }
  };

  const progressOptions = {
    levels: [
      { value: "significativo", label: "Progresso Significativo" },
      { value: "moderado", label: "Progresso Moderado" },
      { value: "leve", label: "Progresso Leve" },
      { value: "estavel", label: "Estável" },
      { value: "regressao", label: "Regressão" },
    ],
  };

  const effectivenessOptions = {
    levels: [
      { value: "muito_efetivo", label: "Muito Efetivo" },
      { value: "efetivo", label: "Efetivo" },
      { value: "parcialmente", label: "Parcialmente Efetivo" },
      { value: "pouco_efetivo", label: "Pouco Efetivo" },
      { value: "inefetivo", label: "Inefetivo" },
    ],
  };

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Reavaliação Musicoterapêutica</CardTitle>
          <CardDescription>
            Registre a reavaliação do processo musicoterapêutico
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="patient_id"
                render={({ field }) => (
                  <FormItem>
                    <PatientSelect
                      patients={patients}
                      selectedPatient={field.value}
                      onSelect={field.onChange}
                      isLoading={isLoading}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data da Reavaliação</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR })
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Progresso Terapêutico</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(Object.entries(therapeuticProgressFields) as [keyof typeof therapeuticProgressFields, string][]).map(([key, label]) => (
                    <FormField
                      key={key}
                      control={form.control}
                      name={`therapeutic_progress.${key}` as const}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{label}</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder={`Descreva ${label.toLowerCase()}, incluindo observações sobre desenvolvimentos positivos, desafios encontrados e áreas que necessitam atenção especial`} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Efetividade do Tratamento</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(Object.entries(treatmentEffectivenessFields) as [keyof typeof treatmentEffectivenessFields, string][]).map(([key, label]) => (
                    <FormField
                      key={key}
                      control={form.control}
                      name={`treatment_effectiveness.${key}` as const}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{label}</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder={`Avalie ${label.toLowerCase()}, considerando o progresso do paciente em relação aos objetivos estabelecidos e a resposta às intervenções propostas`} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>

              <FormField
                control={form.control}
                name="recommendations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recomendações</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Registre as recomendações para o processo terapêutico"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="adjustments_needed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ajustes Necessários</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva os ajustes necessários no plano terapêutico"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
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
                  <Download className="mr-2 h-4 w-4" />
                  Exportar PDF
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
