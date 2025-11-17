import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAddClinic, useUpdateClinic } from "../hooks/useClinics";
import { Clinic } from "../types";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "react-i18next";

const formSchema = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  address: z.string().optional(),
  service_days: z.array(z.string()).optional(),
  patient_ids: z.array(z.string()).optional(),
});

type ClinicFormValues = z.infer<typeof formSchema>;

interface ClinicFormProps {
  onSuccess?: () => void;
  clinic?: Clinic;
}

const WEEKDAYS = [
  { label: "Domingo", value: "domingo" },
  { label: "Segunda-feira", value: "segunda" },
  { label: "Terça-feira", value: "terca" },
  { label: "Quarta-feira", value: "quarta" },
  { label: "Quinta-feira", value: "quinta" },
  { label: "Sexta-feira", value: "sexta" },
  { label: "Sábado", value: "sabado" },
];

export function ClinicForm({ onSuccess, clinic }: ClinicFormProps) {
  const { t } = useTranslation('financial');
  const isUpdating = !!clinic;
  const addClinic = useAddClinic();
  const updateClinic = useUpdateClinic();
  const [patients, setPatients] = useState<{ id: string, name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  
  // Form setup with default values
  const form = useForm<ClinicFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: clinic?.name || "",
      address: clinic?.address || "",
      service_days: clinic?.service_days || [],
      patient_ids: clinic?.patient_ids || [],
    },
  });
  
  useEffect(() => {
    // Fetch patients list only for current user
    const fetchPatients = async () => {
      setIsLoading(true);
      
      try {
        // First get the current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.error("Usuário não autenticado");
          setIsLoading(false);
          return;
        }
        
        // Fetch patients for current user
        const { data, error } = await supabase
          .from("patients")
          .select("id, name")
          .eq("professional_id", user.id)
          .order("name");
          
        if (error) {
          console.error("Erro ao buscar pacientes:", error);
        } else {
          setPatients(data || []);
        }
      } catch (err) {
        console.error("Erro ao buscar pacientes:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPatients();
  }, []);
  
  function onSubmit(values: ClinicFormValues) {
    if (isUpdating) {
      updateClinic.mutate(
        { 
          id: clinic.id,
          name: values.name,
          address: values.address,
          service_days: values.service_days,
          patient_ids: values.patient_ids
        },
        {
          onSuccess: () => {
            if (onSuccess) onSuccess();
          },
        }
      );
    } else {
      addClinic.mutate(
        { 
          name: values.name,
          address: values.address,
          service_days: values.service_days || [],
          patient_ids: values.patient_ids || []
        },
        {
          onSuccess: () => {
            form.reset({
              name: "",
              address: "",
              service_days: [],
              patient_ids: [],
            });
            if (onSuccess) onSuccess();
          },
        }
      );
    }
  }
  
  return (
    <div className="w-full">
      <CardHeader className={isMobile ? "p-4" : "p-6"}>
        <CardTitle className="text-xl md:text-2xl">{isUpdating ? "Editar Clínica" : "Nova Clínica"}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className={`space-y-4 ${isMobile ? "p-4 pt-0" : "p-6 pt-0"}`}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nome da clínica"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Endereço da clínica"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="service_days"
              render={() => (
                <FormItem>
                  <FormLabel>Dias de Atendimento</FormLabel>
                  <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"} gap-2`}>
                    {WEEKDAYS.map((day) => (
                      <div key={day.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`day-${day.value}`}
                          checked={form.watch("service_days")?.includes(day.value)}
                          onCheckedChange={(checked) => {
                            const currentDays = form.watch("service_days") || [];
                            if (checked) {
                              form.setValue("service_days", [...currentDays, day.value]);
                            } else {
                              form.setValue(
                                "service_days",
                                currentDays.filter((d) => d !== day.value)
                              );
                            }
                          }}
                        />
                        <label
                          htmlFor={`day-${day.value}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {day.label}
                        </label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="patient_ids"
              render={() => (
                <FormItem>
                  <FormLabel>Pacientes</FormLabel>
                  <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2">
                    {isLoading ? (
                      <div className="text-sm text-muted-foreground py-2 text-center">
                        Carregando pacientes...
                      </div>
                    ) : patients.length > 0 ? (
                      patients.map((patient) => (
                        <div key={patient.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`patient-${patient.id}`}
                            checked={form.watch("patient_ids")?.includes(patient.id)}
                            onCheckedChange={(checked) => {
                              const currentPatients = form.watch("patient_ids") || [];
                              if (checked) {
                                form.setValue("patient_ids", [...currentPatients, patient.id]);
                              } else {
                                form.setValue(
                                  "patient_ids",
                                  currentPatients.filter((p) => p !== patient.id)
                                );
                              }
                            }}
                          />
                          <label
                            htmlFor={`patient-${patient.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {patient.name}
                          </label>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground py-2 text-center">
                        Nenhum paciente cadastrado no seu perfil
                      </div>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          
          <CardFooter className={`${isMobile ? "flex-col space-y-2" : "flex justify-end space-x-2"} ${isMobile ? "p-4 pt-0" : "p-6 pt-0"} sticky bottom-0 bg-background`}>
            <Button
              type="button"
              variant="outline"
              onClick={() => onSuccess?.()}
              className={isMobile ? "w-full" : ""}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={addClinic.isPending || updateClinic.isPending}
              className={isMobile ? "w-full" : ""}
            >
              {isUpdating ? "Atualizar" : "Salvar"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </div>
  );
}
