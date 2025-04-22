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
import { PatientSelect } from "@/pages/anamnesis/components/PatientSelect";
import { GoalSettingForm } from "./components/GoalSettingForm";
import { InterventionPlanForm } from "./components/InterventionPlanForm";
import { ReassessmentPlanForm } from "./components/ReassessmentPlanForm";

const formSchema = z.object({
  patient_id: z.string({
    required_error: "Por favor, selecione um paciente",
  }),
  date: z.date({
    required_error: "Por favor, selecione uma data",
  }),
  goals: z.array(z.object({
    description: z.string().min(1, { message: "A descrição é obrigatória" }),
    category: z.string().min(1, { message: "A categoria é obrigatória" }),
  })),
  interventions: z.array(z.object({
    description: z.string().min(1, { message: "A descrição é obrigatória" }),
    justification: z.string().min(1, { message: "A justificativa é obrigatória" }),
  })),
  reassessments: z.array(z.object({
    date: z.date(),
    methods: z.string().min(1, { message: "O método é obrigatório" }),
  })),
});

type FormValues = z.infer<typeof formSchema>;

type Patient = {
  id: string;
  name: string;
};

export default function TreatmentPlanForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Pegando as informações do profissional
  const [professionalInfo, setProfessionalInfo] = useState<{
    name: string;
    email: string;
    phone: string;
  }>({ name: "", email: "", phone: "" });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patient_id: "",
      date: new Date(),
      goals: [{ description: "", category: "" }],
      interventions: [{ description: "", justification: "" }],
      reassessments: [{ date: new Date(), methods: "" }],
    },
  });

  // Função para buscar nome, email e telefone do profissional
  useEffect(() => {
    async function fetchProfessionalInfo() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);

          const { data, error } = await supabase
            .from("professionals")
            .select("name, email, phone")
            .eq("user_id", user.id)
            .maybeSingle();

          if (!error && data) {
            setProfessionalInfo({
              name: data.name || "",
              email: data.email || "",
              phone: data.phone || ""
            });
          }
        }
      } catch (err) {
        // fallback: campos vazios
      }
    }
    fetchProfessionalInfo();
  }, []);

  // Busca pacientes usuais...
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoadingPatients(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Usuário não autenticado");

        setUserId(user.id);

        const { data, error } = await supabase
          .from("patients")
          .select("id, name")
          .eq("professional_id", user.id)
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
      } finally {
        setIsLoadingPatients(false);
      }
    }

    fetchData();
  }, [toast]);

  const generatePDF = async (data: FormValues, patientName: string) => {
    // Rodapé detalhado, padrão solicitado:
    const profFooter = `
      <div style="margin-top: 32px; padding-top: 24px; border-top: 2px solid #E5E7EB; text-align: left;">
        <p style="color: #111827; font-size: 15px; margin-bottom: 6px;">
          <strong>Nome:</strong> ${professionalInfo.name || "-"}
        </p>
        <p style="color: #111827; font-size: 15px; margin-bottom: 6px;">
          <strong>Telefone:</strong> ${professionalInfo.phone || "-"}
        </p>
        <p style="color: #111827; font-size: 15px;">
          <strong>Email:</strong> ${professionalInfo.email || "-"}
        </p>
      </div>
    `;

    const element = document.createElement('div');
    element.innerHTML = `
    <div style="padding: 40px; font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 32px; padding-bottom: 20px; border-bottom: 2px solid #E5E7EB;">
        <img src="/lovable-uploads/86b61f63-0028-428c-90d1-44c71413e24a.png" style="width: 150px; height: auto; margin: 0 auto 20px;">
        <h1 style="color: #2563EB; font-size: 24px; font-weight: bold; margin-bottom: 12px;">
          Plano Terapêutico
        </h1>
        <h2 style="color: #1F2937; font-size: 18px; margin-bottom: 8px;">
          Paciente: ${patientName}
        </h2>
        <p style="color: #1F2937; font-size: 16px; margin-bottom: 12px;">
          Musicoterapeuta: ${professionalInfo.name || "-"}
        </p>
        <p style="color: #6B7280; font-size: 13px;">
          Data: ${new Date().toLocaleDateString('pt-BR')}
        </p>
      </div>

      <div style="margin-bottom: 28px;">
        <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
          Objetivos Terapêuticos
        </h2>
        ${data.goals.map(goal => `
          <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; margin-bottom: 10px;">
            <strong>Categoria:</strong> ${goal.category}<br>
            <strong>Descrição:</strong> ${goal.description}
          </div>
        `).join('')}
      </div>

      <div style="margin-bottom: 28px;">
        <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
          Plano de Intervenção
        </h2>
        ${data.interventions.map(intervention => `
          <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; margin-bottom: 10px;">
            <strong>Descrição:</strong> ${intervention.description}<br>
            <strong>Justificativa:</strong> ${intervention.justification}
          </div>
        `).join('')}
      </div>

      <div style="margin-bottom: 28px;">
        <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
          Plano de Reavaliação
        </h2>
        ${data.reassessments.map(reassessment => `
          <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; margin-bottom: 10px;">
            <strong>Data:</strong> ${format(reassessment.date, 'PPP', { locale: ptBR })}<br>
            <strong>Métodos:</strong> ${reassessment.methods}
          </div>
        `).join('')}
      </div>
      ${profFooter}
      <div style="color: #6B7280; font-size: 13px; margin-top: 4px; text-align:center;">
        Documento gerado em ${format(new Date(), 'PPP', { locale: ptBR })} às ${new Date().toLocaleTimeString('pt-BR')}
        <br/>
        Musetera - Sistema de Gestão para Musicoterapia
      </div>
    </div>
  `;

    const opt = {
      margin: [20, 20, 20, 20],
      filename: `plano-terapeutico-${patientName}.pdf`,
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
        .from("treatment_plans")
        .insert({
          patient_id: data.patient_id,
          date: format(data.date, "yyyy-MM-dd'T'HH:mm:ssXXX"),
          goals: data.goals,
          interventions: data.interventions,
          reassessments: data.reassessments,
        });

      if (error) throw error;

      await generatePDF(data, selectedPatient.name);

      toast({
        title: "Sucesso!",
        description: "Plano terapêutico registrado e PDF gerado com sucesso.",
      });

      navigate("/processes");
    } catch (error) {
      console.error("Erro ao salvar plano terapêutico:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar o plano terapêutico.",
      });
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Plano Terapêutico</CardTitle>
          <CardDescription>
            Crie e gerencie o plano terapêutico do paciente
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
                    <PatientSelect
                      patients={patients}
                      selectedPatient={field.value}
                      onSelect={field.onChange}
                      isLoading={isLoadingPatients}
                      emptyMessage="Nenhum paciente cadastrado por você"
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
                    <FormLabel>Data do Plano</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy", { locale: ptBR })
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
                          initialFocus
                          locale={ptBR}
                          captionLayout="dropdown-buttons"
                          fromYear={1900}
                          toYear={new Date().getFullYear()}
                          classNames={{
                            caption_label: "hidden",
                            dropdown_month: "w-full",
                            dropdown_year: "w-full",
                            caption: "flex justify-center pt-1",
                            dropdown: "p-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <GoalSettingForm
                form={form}
              />

              <InterventionPlanForm
                form={form}
              />

              <ReassessmentPlanForm
                form={form}
              />

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/processes")}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Gerar PDF
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
