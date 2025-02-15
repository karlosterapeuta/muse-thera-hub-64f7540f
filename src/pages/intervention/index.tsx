import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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

  useEffect(() => {
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

    fetchPatients();
  }, [toast]);

  const onSubmit = async (values: FormValues) => {
    const { error } = await supabase.from("sessions").insert({
      patient_id: values.patient_id,
      date: values.date.toISOString(),
      emotional_state: values.emotional_state,
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

    toast({
      title: "Intervenção registrada",
      description: "Os dados da intervenção foram salvos com sucesso.",
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
                Salvar Intervenção
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
