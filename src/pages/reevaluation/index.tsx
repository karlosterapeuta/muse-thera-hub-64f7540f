
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

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

export default function ReevaluationForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      therapeutic_progress: {
        musical_engagement: "",
        emotional_expression: "",
        social_interaction: "",
        communication: "",
        cognitive_function: "",
        motor_skills: "",
      },
      treatment_effectiveness: {
        objectives_achievement: "",
        intervention_response: "",
        technique_effectiveness: "",
      },
      recommendations: "",
      adjustments_needed: "",
    },
  });

  useEffect(() => {
    async function fetchPatients() {
      const { data, error } = await supabase
        .from("patients")
        .select("id, name")
        .order("name");

      if (error) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar pacientes",
          description: error.message,
        });
        return;
      }

      setPatients(data);
    }

    fetchPatients();
  }, [toast]);

  async function onSubmit(data: FormValues) {
    const { error } = await supabase.from("assessments").insert({
      patient_id: data.patient_id,
      date: data.date,
      type: "reevaluation",
      content: {
        therapeutic_progress: data.therapeutic_progress,
        treatment_effectiveness: data.treatment_effectiveness,
        recommendations: data.recommendations,
        adjustments_needed: data.adjustments_needed,
      },
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar reavaliação",
        description: error.message,
      });
      return;
    }

    toast({
      title: "Reavaliação salva com sucesso",
      description: "Os dados foram registrados no sistema",
    });

    navigate("/processes");
  }

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
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Reavaliação Musicoterapêutica</CardTitle>
          <CardDescription>
            Avalie o progresso e a efetividade do tratamento musicoterapêutico
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
                {Object.entries({
                  musical_engagement: "Engajamento Musical",
                  emotional_expression: "Expressão Emocional",
                  social_interaction: "Interação Social",
                  communication: "Comunicação",
                  cognitive_function: "Função Cognitiva",
                  motor_skills: "Habilidades Motoras",
                }).map(([key, label]) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={`therapeutic_progress.${key}` as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o nível de progresso" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {progressOptions.levels.map((level) => (
                              <SelectItem key={level.value} value={level.value}>
                                {level.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Efetividade do Tratamento</h3>
                {Object.entries({
                  objectives_achievement: "Alcance dos Objetivos",
                  intervention_response: "Resposta às Intervenções",
                  technique_effectiveness: "Efetividade das Técnicas",
                }).map(([key, label]) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={`treatment_effectiveness.${key}` as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o nível de efetividade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {effectivenessOptions.levels.map((level) => (
                              <SelectItem key={level.value} value={level.value}>
                                {level.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <FormField
                control={form.control}
                name="recommendations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recomendações</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Registre aqui as recomendações para o continuidade do tratamento"
                        className="min-h-[100px]"
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
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Salvar Reavaliação
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
