import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  CalendarIcon, 
  Download,
  Music2,
  Heart,
  Users,
  Brain,
  Clipboard,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import html2pdf from "html2pdf.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { PatientSelect } from "@/pages/anamnesis/components/PatientSelect";
import { DateField } from "@/pages/processes/report/components/DateField";

const formSchema = z.object({
  patient_id: z.string({
    required_error: "Por favor, selecione um paciente",
  }),
  date: z.date({
    required_error: "Por favor, selecione uma data",
  }),
  emotional_state: z.object({
    receptivity: z.string(),
    participation: z.string(),
    interaction: z.string(),
    musicality: z.string(),
  }),
  intervention_activities: z.array(z.string()).optional(),
  therapeutic_goals: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type Patient = {
  id: string;
  name: string;
};

export default function InterventionForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [selectedPatient, setSelectedPatient] = useState<string>("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emotional_state: {
        receptivity: "",
        participation: "",
        interaction: "",
        musicality: "",
      },
      intervention_activities: [],
      therapeutic_goals: [],
      notes: "",
    },
  });

  const formatNameFromEmail = (email: string) => {
    const namePart = email.split('@')[0];
    return namePart
      .split(/[._-]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const translateEmotionalState = (state: Record<string, string>) => {
    const translations: Record<string, Record<string, string>> = {
      receptivity: {
        muito_receptivo: "Muito Receptivo",
        receptivo: "Receptivo",
        pouco_receptivo: "Pouco Receptivo",
        nao_receptivo: "Não Receptivo"
      },
      participation: {
        muito_participativo: "Muito Participativo",
        participativo: "Participativo",
        pouco_participativo: "Pouco Participativo",
        nao_participativo: "Não Participativo"
      },
      interaction: {
        muito_interativo: "Muito Interativo",
        interativo: "Interativo",
        pouco_interativo: "Pouco Interativo",
        nao_interativo: "Não Interativo"
      },
      musicality: {
        muito_musical: "Muito Musical",
        musical: "Musical",
        pouco_musical: "Pouco Musical",
        nao_musical: "Não Musical"
      }
    };

    return {
      receptivity: translations.receptivity[state.receptivity] || "Não avaliado",
      participation: translations.participation[state.participation] || "Não avaliado",
      interaction: translations.interaction[state.interaction] || "Não avaliado",
      musicality: translations.musicality[state.musicality] || "Não avaliado"
    };
  };

  const translateInterventionActivities = (activities: string[] = []) => {
    const translations: Record<string, string> = {
      canto_livre: "Canto Livre",
      improvisacao_instrumental: "Improvisação Instrumental",
      composicao: "Composição Musical",
      recriacao: "Recriação Musical",
      escuta_musical: "Escuta Musical",
      movimento_corporal: "Movimento Corporal com Música",
      jogos_musicais: "Jogos Musicais",
      relaxamento_musical: "Relaxamento com Música",
      musica_e_imagem: "Música e Imagem Guiada",
      musicoterapia_neurologic: "Musicoterapia Neurológica",
      ritmo_e_movimento: "Ritmo e Movimento",
      expressao_vocal: "Expressão Vocal"
    };

    return activities.map(activity => translations[activity] || activity);
  };

  const translateTherapeuticGoals = (goals: string[] = []) => {
    const translations: Record<string, string> = {
      comunicacao: "Desenvolvimento da Comunicação",
      emocional: "Regulação Emocional",
      cognitivo: "Estimulação Cognitiva",
      motor: "Desenvolvimento Motor",
      social: "Interação Social",
      linguagem: "Desenvolvimento da Linguagem",
      atencao: "Atenção e Concentração",
      memoria: "Memória e Aprendizagem"
    };

    return goals.map(goal => translations[goal] || goal);
  };

  const generatePDF = async (values: FormValues, patientName: string) => {
    try {
      const element = document.createElement('div');
      const translatedEmotionalState = translateEmotionalState(values.emotional_state);
      const translatedActivities = translateInterventionActivities(values.intervention_activities);
      const translatedGoals = translateTherapeuticGoals(values.therapeutic_goals);

      const generateContentHTML = () => {
        const sections = [
          {
            title: "Informações da Sessão",
            fields: [
              { 
                label: "Data da Sessão", 
                value: format(values.date, "PPP", { locale: ptBR }) 
              },
              {
                label: "Paciente",
                value: patientName
              }
            ]
          },
          {
            title: "Estado Emocional",
            fields: [
              { label: "Receptividade", value: translatedEmotionalState.receptivity },
              { label: "Participação", value: translatedEmotionalState.participation },
              { label: "Interação", value: translatedEmotionalState.interaction },
              { label: "Musicalidade", value: translatedEmotionalState.musicality }
            ]
          },
          {
            title: "Técnicas de Intervenção",
            fields: [
              { 
                label: "Atividades Realizadas", 
                value: translatedActivities.length > 0 ? translatedActivities.join(", ") : "Nenhuma atividade registrada"
              }
            ]
          },
          {
            title: "Objetivos Terapêuticos",
            fields: [
              {
                label: "Objetivos Trabalhados",
                value: translatedGoals.length > 0 ? translatedGoals.join(", ") : "Nenhum objetivo registrado"
              }
            ]
          }
        ];

        if (values.notes) {
          sections.push({
            title: "Observações",
            fields: [
              { 
                label: "Notas da Sessão", 
                value: values.notes
              }
            ]
          });
        }

        return sections
          .map(section => {
            const sectionContent = section.fields
              .filter(field => field.value)
              .map(field => `
                <div style="margin-bottom: 16px;">
                  <div style="font-weight: 600; font-size: 13px; margin-bottom: 4px; color: #374151;">
                    ${field.label}
                  </div>
                  <div style="background-color: #F9FAFB; padding: 8px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 12px; line-height: 1.5; color: #1F2937; white-space: pre-wrap;">
                    ${String(field.value).split('\n').join('<br>')}
                  </div>
                </div>
              `)
              .join('');

            if (sectionContent) {
              return `
                <div style="margin-bottom: 24px;">
                  <h2 style="color: #1F2937; font-size: 16px; font-weight: 600; margin-bottom: 12px; padding-bottom: 4px; border-bottom: 2px solid #E5E7EB;">
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
            <h1 style="color: #2563EB; font-size: 24px; font-weight: bold; margin-bottom: 12px;">
              Registro de Intervenção Musicoterapêutica
            </h1>
            <h2 style="color: #1F2937; font-size: 18px; margin-bottom: 8px;">
              ${patientName}
            </h2>
            <p style="color: #6B7280; font-size: 14px;">
              Data: ${format(values.date, "PPP", { locale: ptBR })}
            </p>
          </div>

          <div style="margin-bottom: 32px;">
            ${generateContentHTML()}
          </div>

          <div style="margin-top: 32px; padding-top: 24px; border-top: 2px solid #E5E7EB; text-align: center;">
            <p style="color: #6B7280; font-size: 11px; margin-bottom: 4px;">
              Documento gerado em ${format(new Date(), "PPP", { locale: ptBR })} às ${new Date().toLocaleTimeString('pt-BR')}
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
        filename: `Intervenção - ${patientName} - ${format(values.date, "dd-MM-yyyy")}.pdf`,
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
      
      return true;
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast({
        variant: "destructive",
        title: "Erro ao gerar PDF",
        description: "Não foi possível gerar o PDF da intervenção.",
      });
      return false;
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoadingPatients(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast({
            variant: "destructive",
            title: "Não autenticado",
            description: "Você precisa estar logado para acessar esta página.",
          });
          navigate("/login");
          return;
        }

        setUserEmail(user.email || "");
        setUserName(formatNameFromEmail(user.email || ""));

        console.log("Buscando pacientes para usuário:", user.id);
        
        const { data, error } = await supabase
          .from("patients")
          .select("id, name")
          .eq("professional_id", user.id)
          .order("name");

        if (error) {
          toast({
            variant: "destructive",
            title: "Erro ao carregar pacientes",
            description: "Não foi possível carregar a lista de pacientes.",
          });
          console.error("Erro ao carregar pacientes:", error);
          return;
        }

        setPatients(data || []);
        console.log("Dados dos pacientes retornados:", data);
        console.log(`${data?.length || 0} pacientes encontrados`);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: "Ocorreu um erro ao buscar informações do usuário.",
        });
      } finally {
        setIsLoadingPatients(false);
      }
    };

    fetchUserData();
  }, [toast, navigate]);

  const onSubmit = async (values: FormValues) => {
    try {
      const { error } = await supabase.from("sessions").insert({
        patient_id: values.patient_id,
        date: values.date.toISOString(),
        emotional_state: values.emotional_state,
        intervention_activities: values.intervention_activities || [],
        therapeutic_goals: values.therapeutic_goals || [],
        notes: values.notes,
      });

      if (error) {
        throw error;
      }

      const selectedPatientData = patients.find(p => p.id === values.patient_id);
      if (!selectedPatientData) {
        throw new Error("Paciente não encontrado");
      }

      const pdfGenerated = await generatePDF(values, selectedPatientData.name);
      
      if (pdfGenerated) {
        toast({
          title: "Sucesso!",
          description: "Intervenção registrada e PDF gerado com sucesso.",
        });

        navigate("/processes");
      }
    } catch (error) {
      console.error("Erro ao salvar intervenção:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar intervenção",
        description: "Ocorreu um erro ao salvar os dados da intervenção.",
      });
    }
  };

  const handlePatientSelect = (patientId: string) => {
    setSelectedPatient(patientId);
    form.setValue("patient_id", patientId);
  };

  const emotionalStateOptions = {
    receptivity: [
      { value: "muito_receptivo", label: "Muito Receptivo" },
      { value: "receptivo", label: "Receptivo" },
      { value: "pouco_receptivo", label: "Pouco Receptivo" },
      { value: "nao_receptivo", label: "Não Receptivo" },
    ],
    participation: [
      { value: "muito_participativo", label: "Muito Participativo" },
      { value: "participativo", label: "Participativo" },
      { value: "pouco_participativo", label: "Pouco Participativo" },
      { value: "nao_participativo", label: "Não Participativo" },
    ],
    interaction: [
      { value: "muito_interativo", label: "Muito Interativo" },
      { value: "interativo", label: "Interativo" },
      { value: "pouco_interativo", label: "Pouco Interativo" },
      { value: "nao_interativo", label: "Não Interativo" },
    ],
    musicality: [
      { value: "muito_musical", label: "Muito Musical" },
      { value: "musical", label: "Musical" },
      { value: "pouco_musical", label: "Pouco Musical" },
      { value: "nao_musical", label: "Não Musical" },
    ],
  };

  const interventionSuggestions = [
    { value: "canto_livre", label: "Canto Livre", icon: Music2, description: "Expressão vocal livre e espontânea" },
    { value: "improvisacao_instrumental", label: "Improvisação Instrumental", icon: Music2, description: "Criação musical espontânea com instrumentos" },
    { value: "composicao", label: "Composição Musical", icon: Music2, description: "Criação de músicas originais" },
    { value: "recriacao", label: "Recriação Musical", icon: Music2, description: "Reprodução e interpretação de músicas conhecidas" },
    { value: "escuta_musical", label: "Escuta Musical", icon: Heart, description: "Audição ativa e receptiva de músicas" },
    { value: "movimento_corporal", label: "Movimento Corporal com Música", icon: Users, description: "Integração entre música e expressão corporal" },
    { value: "jogos_musicais", label: "Jogos Musicais", icon: Brain, description: "Atividades lúdicas com elementos musicais" },
    { value: "relaxamento_musical", label: "Relaxamento com Música", icon: Heart, description: "Técnicas de relaxamento guiadas por música" },
    { value: "musica_e_imagem", label: "Música e Imagem Guiada", icon: Brain, description: "Visualização criativa com suporte musical" },
    { value: "musicoterapia_neurologic", label: "Musicoterapia Neurológica", icon: Brain, description: "Técnicas específicas para reabilitação neurológica" },
    { value: "ritmo_e_movimento", label: "Ritmo e Movimento", icon: Users, description: "Trabalho com padrões rítmicos e movimento" },
    { value: "expressao_vocal", label: "Expressão Vocal", icon: Music2, description: "Trabalho específico com a voz e canto" }
  ];

  const therapeuticGoalsSuggestions = [
    { value: "comunicacao", label: "Desenvolvimento da Comunicação" },
    { value: "emocional", label: "Regulação Emocional" },
    { value: "cognitivo", label: "Estimulação Cognitiva" },
    { value: "motor", label: "Desenvolvimento Motor" },
    { value: "social", label: "Interação Social" },
    { value: "linguagem", label: "Desenvolvimento da Linguagem" },
    { value: "atencao", label: "Atenção e Concentração" },
    { value: "memoria", label: "Memória e Aprendizagem" }
  ];

  const musicalResourcesSuggestions = [
    { value: "voz", label: "Voz e Canto" },
    { value: "violao", label: "Violão" },
    { value: "piano", label: "Piano/Teclado" },
    { value: "percussao", label: "Instrumentos de Percussão" },
    { value: "flauta", label: "Flauta" },
    { value: "gravacoes", label: "Músicas Gravadas" },
    { value: "tecnologia", label: "Recursos Tecnológicos" },
    { value: "instrumentos_alternativos", label: "Instrumentos Alternativos" }
  ];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Music2 className="h-6 w-6" />
            Registro de Intervenção Musicoterapêutica
          </CardTitle>
          <CardDescription>
            Registre os detalhes da sessão de intervenção musicoterapêutica
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="patient_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Paciente</FormLabel>
                      <FormControl>
                        <PatientSelect 
                          patients={patients}
                          selectedPatient={field.value}
                          onSelect={field.onChange}
                          isLoading={isLoadingPatients}
                          emptyMessage="Nenhum paciente cadastrado por você"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data da Sessão</FormLabel>
                      <FormControl>
                        <DateField 
                          label=""
                          value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                          onChange={(dateStr) => field.onChange(dateStr ? new Date(`${dateStr}T12:00:00`) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Estado Emocional
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="emotional_state.receptivity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Receptividade</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o nível de receptividade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {emotionalStateOptions.receptivity.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="emotional_state.participation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Participação</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o nível de participação" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {emotionalStateOptions.participation.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="emotional_state.interaction"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interação</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o nível de interação" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {emotionalStateOptions.interaction.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="emotional_state.musicality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Musicalidade</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o nível de musicalidade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {emotionalStateOptions.musicality.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Music2 className="h-5 w-5 text-primary" />
                    Técnicas de Intervenção
                  </CardTitle>
                  <CardDescription>
                    Selecione as técnicas utilizadas durante a sessão
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {interventionSuggestions.map((suggestion) => (
                      <FormField
                        key={suggestion.value}
                        control={form.control}
                        name="intervention_activities"
                        render={({ field }) => {
                          return (
                            <FormItem key={suggestion.value} className="space-y-0">
                              <FormControl>
                                <div className={cn(
                                  "flex items-center space-x-2 rounded-lg border p-4 hover:bg-accent transition-colors",
                                  field.value?.includes(suggestion.value) && "border-primary bg-primary/5"
                                )}>
                                  <Checkbox
                                    checked={field.value?.includes(suggestion.value)}
                                    onCheckedChange={(checked) => {
                                      const activities = field.value || [];
                                      if (checked) {
                                        field.onChange([...activities, suggestion.value]);
                                      } else {
                                        field.onChange(
                                          activities.filter((value) => value !== suggestion.value)
                                        );
                                      }
                                    }}
                                  />
                                  <div className="space-y-1">
                                    <div className="text-sm font-medium leading-none flex items-center gap-2">
                                      <suggestion.icon className="h-4 w-4 text-primary" />
                                      {suggestion.label}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      {suggestion.description}
                                    </p>
                                  </div>
                                </div>
                              </FormControl>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    Objetivos Terapêuticos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {therapeuticGoalsSuggestions.map((goal) => (
                      <FormField
                        key={goal.value}
                        control={form.control}
                        name="therapeutic_goals"
                        render={({ field }) => {
                          return (
                            <FormItem key={goal.value} className="space-y-0">
                              <FormControl>
                                <div className={cn(
                                  "flex items-center space-x-2 rounded-lg border p-4 hover:bg-accent transition-colors",
                                  field.value?.includes(goal.value) && "border-primary bg-primary/5"
                                )}>
                                  <Checkbox
                                    checked={field.value?.includes(goal.value)}
                                    onCheckedChange={(checked) => {
                                      const goals = field.value || [];
                                      if (checked) {
                                        field.onChange([...goals, goal.value]);
                                      } else {
                                        field.onChange(
                                          goals.filter((value) => value !== goal.value)
                                        );
                                      }
                                    }}
                                  />
                                  <label className="text-sm font-medium leading-none">
                                    {goal.label}
                                  </label>
                                </div>
                              </FormControl>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Music2 className="h-5 w-5 text-primary" />
                    Recursos Musicais Utilizados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {musicalResourcesSuggestions.map((resource) => (
                      <FormField
                        key={resource.value}
                        control={form.control}
                        name="intervention_activities"
                        render={({ field }) => {
                          return (
                            <FormItem key={resource.value} className="space-y-0">
                              <FormControl>
                                <div className={cn(
                                  "flex items-center space-x-2 rounded-lg border p-4 hover:bg-accent transition-colors",
                                  field.value?.includes(resource.value) && "border-primary bg-primary/5"
                                )}>
                                  <Checkbox
                                    checked={field.value?.includes(resource.value)}
                                    onCheckedChange={(checked) => {
                                      const resources = field.value || [];
                                      if (checked) {
                                        field.onChange([...resources, resource.value]);
                                      } else {
                                        field.onChange(
                                          resources.filter((value) => value !== resource.value)
                                        );
                                      }
                                    }}
                                  />
                                  <label className="text-sm font-medium leading-none">
                                    {resource.label}
                                  </label>
                                </div>
                              </FormControl>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Registre aqui as observações relevantes da sessão, incluindo outras técnicas utilizadas e resultados observados"
                        className="min-h-[100px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                <Download className="mr-2" />
                Salvar e Baixar PDF
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
