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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";
import html2pdf from "html2pdf.js";
import { IndividualSessionForm } from "./components/IndividualSessionForm";
import { GroupSessionForm } from "./components/GroupSessionForm";
import { DailyEvolutionForm } from "./components/DailyEvolutionForm";
import { MonthlyEvolutionForm } from "./components/MonthlyEvolutionForm";
import { SemesterEvolutionForm } from "./components/SemesterEvolutionForm";
import { TherapeuticDischargeForm } from "./components/TherapeuticDischargeForm";
import { AdministrativeDischargeForm } from "./components/AdministrativeDischargeForm";
import { TeaScaleForm } from "./components/TeaScaleForm";
import { FamilyReportForm } from "./components/FamilyReportForm";
import { TeamReportForm } from "./components/TeamReportForm";
import { TechnicalReportForm } from "./components/TechnicalReportForm";

const formSchema = z.object({
  patient_id: z.string({
    required_error: "Por favor, selecione um paciente",
  }),
  date: z.date({
    required_error: "Por favor, selecione uma data",
  }),
  type: z.string(),
  content: z.record(z.any()),
});

type FormValues = z.infer<typeof formSchema>;

type Patient = {
  id: string;
  name: string;
};

export default function ReportForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: {},
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
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Usuário não autenticado");

        setUserEmail(user.email || "");
        setUserName(formatNameFromEmail(user.email || ""));

        const { data, error } = await supabase
          .from("patients")
          .select("id, name")
          .order("name");

        if (error) throw error;
        setPatients(data || []);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar a lista de pacientes",
        });
      }
    }

    fetchData();
  }, [toast]);

  const generatePDF = async (patientName: string, formData: FormValues) => {
    const element = document.createElement('div');
    
    const generateContentHTML = (content: Record<string, any>) => {
      if (formData.type === "daily_evolution") {
        return `
          <div style="margin-bottom: 28px;">
            <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
              Estado Inicial
            </h2>
            <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
              ${String(content.initial_state || '').split('\n').join('<br>')}
            </div>
          </div>

          <div style="margin-bottom: 28px;">
            <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
              Atividades Realizadas
            </h2>
            <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
              ${String(content.activities || '').split('\n').join('<br>')}
            </div>
          </div>

          <div style="margin-bottom: 28px;">
            <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
              Respostas Observadas
            </h2>
            <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
              ${String(content.responses || '').split('\n').join('<br>')}
            </div>
          </div>

          <div style="margin-bottom: 28px;">
            <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
              Observações
            </h2>
            <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
              ${String(content.observations || '').split('\n').join('<br>')}
            </div>
          </div>
        `;
      } else if (formData.type === "monthly_evolution") {
        return `
          <div style="margin-bottom: 28px;">
            <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
              Objetivos Terapêuticos
            </h2>
            <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
              ${String(content.therapeutic_objectives || '').split('\n').join('<br>')}
            </div>
          </div>

          <div style="margin-bottom: 28px;">
            <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
              Conquistas
            </h2>
            <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
              ${String(content.achievements || '').split('\n').join('<br>')}
            </div>
          </div>

          <div style="margin-bottom: 28px;">
            <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
              Desafios
            </h2>
            <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
              ${String(content.challenges || '').split('\n').join('<br>')}
            </div>
          </div>

          <div style="margin-bottom: 28px;">
            <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
              Ajustes Necessários
            </h2>
            <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
              ${String(content.adjustments || '').split('\n').join('<br>')}
            </div>
          </div>

          <div style="margin-bottom: 28px;">
            <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
              Próximos Passos
            </h2>
            <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
              ${String(content.next_steps || '').split('\n').join('<br>')}
            </div>
          </div>
        `;
      } else if (formData.type === "semester_evolution") {
        return `
          <div style="margin-bottom: 28px;">
            <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
              Avaliação Inicial
            </h2>
            <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
              ${String(content.initial_evaluation || '').split('\n').join('<br>')}
            </div>
          </div>

          <div style="margin-bottom: 28px;">
            <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
              Processo Terapêutico
            </h2>
            <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
              ${String(content.therapeutic_process || '').split('\n').join('<br>')}
            </div>
          </div>

          <div style="margin-bottom: 28px;">
            <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
              Áreas de Evolução
            </h2>
            <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
              ${String(content.evolution_areas || '').split('\n').join('<br>')}
            </div>
          </div>

          <div style="margin-bottom: 28px;">
            <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
              Envolvimento Familiar
            </h2>
            <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
              ${String(content.family_involvement || '').split('\n').join('<br>')}
            </div>
          </div>

          <div style="margin-bottom: 28px;">
            <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
              Conclusões
            </h2>
            <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
              ${String(content.conclusions || '').split('\n').join('<br>')}
            </div>
          </div>

          <div style="margin-bottom: 28px;">
            <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
              Recomendações
            </h2>
            <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
              ${String(content.recommendations || '').split('\n').join('<br>')}
            </div>
          </div>
        `;
      } else if (formData.type === "therapeutic_discharge") {
        return `
          <div style="margin-bottom: 28px;">
            <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
              Resumo do Tratamento
            </h2>
            <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
              ${String(content.treatment_summary || '').split('\n').join('<br>')}
            </div>
          </div>

          <div style="margin-bottom: 28px;">
            <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
              Objetivos Alcançados
            </h2>
            <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
              ${String(content.achieved_goals || '').split('\n').join('<br>')}
            </div>
          </div>

          <div style="margin-bottom: 28px;">
            <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
              Recomendações
            </h2>
            <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
              ${String(content.recommendations || '').split('\n').join('<br>')}
            </div>
          </div>
        `;
      }
      
      return '';
    };

    console.log("Dados do formulário:", formData);

    element.innerHTML = `
      <div style="padding: 40px; font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #E5E7EB;">
          <div style="margin-bottom: 24px;">
            <img src="/lovable-uploads/86b61f63-0028-428c-90d1-44c71413e24a.png" style="width: 200px; height: auto; margin: 0 auto;">
          </div>
          <h1 style="color: #2563EB; font-size: 28px; font-weight: bold; margin-bottom: 16px;">
            ${formData.type === "monthly_evolution" 
              ? "Evolução Mensal" 
              : formData.type === "daily_evolution" 
              ? "Evolução Diária" 
              : formData.type === "therapeutic_discharge"
              ? "Alta Terapêutica"
              : "Evolução Semestral"}
          </h1>
          <h2 style="color: #1F2937; font-size: 22px; margin-bottom: 12px;">
            Paciente: ${patientName}
          </h2>
          <p style="color: #6B7280; font-size: 16px;">
            Data do Relatório: ${format(formData.date, 'PPP', { locale: ptBR })}
          </p>
        </div>

        <div style="margin-bottom: 32px;">
          ${generateContentHTML(formData.content)}
        </div>

        <div style="margin-top: 32px; padding-top: 24px; border-top: 2px solid #E5E7EB; text-align: center;">
          <p style="color: #6B7280; font-size: 13px; margin-bottom: 4px;">
            Documento gerado em ${format(new Date(), 'PPP', { locale: ptBR })} às ${new Date().toLocaleTimeString('pt-BR')}
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
      filename: `${formData.type === "monthly_evolution" 
        ? "Evolução Mensal" 
        : formData.type === "daily_evolution" 
        ? "Evolução Diária"
        : formData.type === "therapeutic_discharge"
        ? "Alta Terapêutica"
        : "Evolução Semestral"} - ${patientName}.pdf`,
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
      console.log("Submetendo formulário com dados:", data);
      const selectedPatient = patients.find(p => p.id === data.patient_id);
      if (!selectedPatient) {
        throw new Error("Paciente não encontrado");
      }

      const { error } = await supabase
        .from("assessments")
        .insert({
          patient_id: data.patient_id,
          date: format(data.date, "yyyy-MM-dd'T'HH:mm:ssXXX"),
          type: data.type,
          content: data.content,
        });

      if (error) throw error;

      await generatePDF(selectedPatient.name, data);

      toast({
        title: "Sucesso!",
        description: "Relatório registrado e PDF gerado com sucesso.",
      });

      navigate("/processes");
    } catch (error) {
      console.error("Erro ao salvar relatório:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar o relatório.",
      });
    }
  };

  const renderFormByType = (type: string) => {
    switch (type) {
      case "individual_session":
        return (
          <IndividualSessionForm
            content={form.getValues("content")}
            onChange={(content) => {
              console.log("Atualizando conte��do do formulário:", content);
              form.setValue("content", content);
            }}
          />
        );
      case "group_session":
        return (
          <GroupSessionForm
            content={form.getValues("content")}
            onChange={(content) => {
              console.log("Atualizando conteúdo do formulário:", content);
              form.setValue("content", content);
            }}
          />
        );
      case "daily_evolution":
        return (
          <DailyEvolutionForm
            content={form.getValues("content")}
            onChange={(content) => {
              console.log("Atualizando conteúdo do formulário:", content);
              form.setValue("content", content);
            }}
          />
        );
      case "monthly_evolution":
        return (
          <MonthlyEvolutionForm
            content={form.getValues("content")}
            onChange={(content) => {
              console.log("Atualizando conteúdo do formulário:", content);
              form.setValue("content", content);
            }}
          />
        );
      case "semester_evolution":
        return (
          <SemesterEvolutionForm
            content={form.getValues("content")}
            onChange={(content) => {
              console.log("Atualizando conteúdo do formulário:", content);
              form.setValue("content", content);
            }}
          />
        );
      case "therapeutic_discharge":
        return (
          <TherapeuticDischargeForm
            content={form.getValues("content")}
            onChange={(content) => {
              console.log("Atualizando conteúdo do formulário:", content);
              form.setValue("content", content);
            }}
          />
        );
      case "administrative_discharge":
        return (
          <AdministrativeDischargeForm
            content={form.getValues("content")}
            onChange={(content) => {
              console.log("Atualizando conteúdo do formulário:", content);
              form.setValue("content", content);
            }}
          />
        );
      case "tea_scale":
        return (
          <TeaScaleForm
            content={form.getValues("content")}
            onChange={(content) => {
              console.log("Atualizando conteúdo do formulário:", content);
              form.setValue("content", content);
            }}
          />
        );
      case "family_report":
        return (
          <FamilyReportForm
            content={form.getValues("content")}
            onChange={(content) => {
              console.log("Atualizando conteúdo do formulário:", content);
              form.setValue("content", content);
            }}
          />
        );
      case "team_report":
        return (
          <TeamReportForm
            content={form.getValues("content")}
            onChange={(content) => {
              console.log("Atualizando conteúdo do formulário:", content);
              form.setValue("content", content);
            }}
          />
        );
      case "technical_report":
        return (
          <TechnicalReportForm
            content={form.getValues("content")}
            onChange={(content) => {
              console.log("Atualizando conteúdo do formulário:", content);
              form.setValue("content", content);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Novo Relatório</CardTitle>
          <CardDescription>
            Registre um novo relatório para o paciente
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
                    <FormLabel>Data do Relatório</FormLabel>
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

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Relatório</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("content", {});
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de relatório" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="individual_session">
                          Relatório de Sessão Individual
                        </SelectItem>
                        <SelectItem value="group_session">
                          Relatório de Sessão em Grupo
                        </SelectItem>
                        <SelectItem value="daily_evolution">
                          Evolução Diária
                        </SelectItem>
                        <SelectItem value="monthly_evolution">
                          Evolução Mensal
                        </SelectItem>
                        <SelectItem value="semester_evolution">
                          Evolução Semestral
                        </SelectItem>
                        <SelectItem value="therapeutic_discharge">
                          Alta Terapêutica
                        </SelectItem>
                        <SelectItem value="administrative_discharge">
                          Alta Administrativa
                        </SelectItem>
                        <SelectItem value="tea_scale">
                          Escala TEA
                        </SelectItem>
                        <SelectItem value="family_report">
                          Relatório para Família
                        </SelectItem>
                        <SelectItem value="team_report">
                          Relatório para Equipe
                        </SelectItem>
                        <SelectItem value="technical_report">
                          Relatório Técnico
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("type") && renderFormByType(form.watch("type"))}

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
                  Gerar Relatório
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
