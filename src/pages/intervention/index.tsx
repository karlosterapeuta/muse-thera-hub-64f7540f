import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Download } from "lucide-react";
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
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

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
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

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
      receptivity: translations.receptivity[state.receptivity] || state.receptivity,
      participation: translations.participation[state.participation] || state.participation,
      interaction: translations.interaction[state.interaction] || state.interaction,
      musicality: translations.musicality[state.musicality] || state.musicality
    };
  };

  const translateInterventionActivities = (activities: string[]) => {
    const translations: Record<string, string> = {
      canto_livre: "Canto Livre",
      improvisacao_instrumental: "Improvisação Instrumental",
      composicao: "Composição Musical",
      recriacao: "Recriação Musical",
      escuta_musical: "Escuta Musical",
      movimento_corporal: "Movimento Corporal com Música",
      jogos_musicais: "Jogos Musicais",
      relaxamento_musical: "Relaxamento com Música"
    };

    return activities.map(activity => translations[activity] || activity);
  };

  const generatePDF = async (values: FormValues, patientName: string) => {
    const element = document.createElement('div');
    const translatedEmotionalState = translateEmotionalState(values.emotional_state);
    const translatedActivities = values.intervention_activities ? 
      translateInterventionActivities(values.intervention_activities) : [];

    const generateContentHTML = () => {
      const sections = [
        {
          title: "Informações da Sessão",
          fields: [
            { 
              label: "Data da Sessão", 
              value: format(values.date, "PPP", { locale: ptBR }) 
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
              value: translatedActivities.join(", ") 
            }
          ]
        },
        {
          title: "Observações",
          fields: [
            { 
              label: "Notas da Sessão", 
              value: values.notes || "Sem observações registradas" 
            }
          ]
        }
      ];

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
            Registro de Intervenção Terapêutica
          </h1>
          <h2 style="color: #1F2937; font-size: 18px; margin-bottom: 8px;">
            Paciente: ${patientName}
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
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || "");
        setUserName(formatNameFromEmail(user.email || ""));
      }
    };

    const fetchPatients = async () => {
      const { data, error } = await supabase
        .from("patients")
        .select("id, name")
        .order("name");

      if (error) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar pacientes",
          description: "Não foi possível carregar a lista de pacientes.",
        });
        return;
      }

      setPatients(data);
    };

    fetchUserData();
    fetchPatients();
  }, [toast]);

  const onSubmit = async (values: FormValues) => {
    const { error } = await supabase.from("sessions").insert({
      patient_id: values.patient_id,
      date: values.date.toISOString(),
      emotional_state: values.emotional_state,
      intervention_activities: values.intervention_activities,
      notes: values.notes,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar intervenção",
        description: "Ocorreu um erro ao salvar os dados da intervenção.",
      });
      return;
    }

    const selectedPatientData = patients.find(p => p.id === values.patient_id);
    if (selectedPatientData) {
      await generatePDF(values, selectedPatientData.name);
    }

    toast({
      title: "Sucesso!",
      description: "Intervenção registrada e PDF gerado com sucesso.",
    });

    navigate("/processes");
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
    { value: "canto_livre", label: "Canto Livre" },
    { value: "improvisacao_instrumental", label: "Improvisação Instrumental" },
    { value: "composicao", label: "Composição Musical" },
    { value: "recriacao", label: "Recriação Musical" },
    { value: "escuta_musical", label: "Escuta Musical" },
    { value: "movimento_corporal", label: "Movimento Corporal com Música" },
    { value: "jogos_musicais", label: "Jogos Musicais" },
    { value: "relaxamento_musical", label: "Relaxamento com Música" },
  ];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Registro de Intervenção Terapêutica</CardTitle>
          <CardDescription>
            Registre os detalhes da sessão de intervenção musicoterapêutica
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
                    <FormLabel>Paciente</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um paciente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {patients.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.name}
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
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data da Sessão</FormLabel>
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
                <h3 className="text-lg font-medium">Técnicas de Intervenção</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {interventionSuggestions.map((suggestion) => (
                    <FormField
                      key={suggestion.value}
                      control={form.control}
                      name="intervention_activities"
                      render={({ field }) => {
                        return (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
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
                            </FormControl>
                            <FormLabel className="font-normal">
                              {suggestion.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Estado Emocional</h3>
                
                <FormField
                  control={form.control}
                  name="emotional_state.receptivity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Receptividade</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
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
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
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
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
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
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
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
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Registre aqui as observações relevantes da sessão, incluindo outras técnicas utilizadas e resultados observados"
                        className="min-h-[100px]"
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
