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
      if (formData.type === "individual_session") {
        console.log("Gerando PDF com conteúdo:", content);
        
        const sessionDate = content.data_session ? new Date(content.data_session) : null;
        const formattedDate = sessionDate && !isNaN(sessionDate.getTime()) 
          ? format(sessionDate, 'PPP', { locale: ptBR })
          : 'Data não especificada';

        return `
          <div style="margin-bottom: 28px;">
            <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
              Dados da Sessão
            </h2>
            <div style="margin-bottom: 16px;">
              <div style="font-weight: 600; font-size: 15px; margin-bottom: 6px; color: #374151;">
                Data da Sessão
              </div>
              <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937;">
                ${formattedDate}
              </div>
            </div>
            <div style="margin-bottom: 16px;">
              <div style="font-weight: 600; font-size: 15px; margin-bottom: 6px; color: #374151;">
                Objetivos
              </div>
              <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
                ${String(content.objectives || '').split('\n').join('<br>')}
              </div>
            </div>
          </div>

          <div style="margin-bottom: 28px;">
            <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
              Desenvolvimento
            </h2>
            <div style="margin-bottom: 16px;">
              <div style="font-weight: 600; font-size: 15px; margin-bottom: 6px; color: #374151;">
                Atividades Realizadas
              </div>
              <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
                ${String(content.activities || '').split('\n').join('<br>')}
              </div>
            </div>
            <div style="margin-bottom: 16px;">
              <div style="font-weight: 600; font-size: 15px; margin-bottom: 6px; color: #374151;">
                Resposta do Paciente
              </div>
              <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
                ${String(content.patient_response || '').split('\n').join('<br>')}
              </div>
            </div>
          </div>

          <div style="margin-bottom: 28px;">
            <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
              Conclusão
            </h2>
            <div style="margin-bottom: 16px;">
              <div style="font-weight: 600; font-size: 15px; margin-bottom: 6px; color: #374151;">
                Observações
              </div>
              <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
                ${String(content.observations || '').split('\n').join('<br>')}
              </div>
            </div>
            <div style="margin-bottom: 16px;">
              <div style="font-weight: 600; font-size: 15px; margin-bottom: 6px; color: #374151;">
                Próximos Passos
              </div>
              <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
                ${String(content.next_steps || '').split('\n').join('<br>')}
              </div>
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
            Relatório de Sessão Individual
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
      filename: `Relatório de Sessão - ${patientName}.pdf`,
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
              console.log("Atualizando conteúdo do formulário:", content);
              form.setValue("content", content);
            }}
          />
        );
      case "group_session":
        return null;
      case "daily_evolution":
        return null;
      case "monthly_evolution":
        return null;
      case "semester_evolution":
        return null;
      case "therapeutic_discharge":
        return null;
      case "administrative_discharge":
        return null;
      case "tea_scale":
        return null;
      case "family_report":
        return null;
      case "team_report":
        return null;
      case "technical_report":
        return null;
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
