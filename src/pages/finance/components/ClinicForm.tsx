
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const isUpdating = !!clinic;
  const addClinic = useAddClinic();
  const updateClinic = useUpdateClinic();
  const [patients, setPatients] = useState<{ id: string, name: string }[]>([]);
  
  useEffect(() => {
    // Buscar lista de pacientes
    const fetchPatients = async () => {
      const { data, error } = await supabase
        .from("patients")
        .select("id, name")
        .order("name");
        
      if (!error && data) {
        setPatients(data);
      }
    };
    
    fetchPatients();
  }, []);
  
  const form = useForm<ClinicFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: clinic?.name || "",
      address: clinic?.address || "",
      service_days: clinic?.service_days || [],
      patient_ids: clinic?.patient_ids || [],
    },
  });
  
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
            onSuccess?.();
          },
        }
      );
    } else {
      addClinic.mutate(
        { 
          name: values.name,
          address: values.address,
          service_days: values.service_days,
          patient_ids: values.patient_ids
        },
        {
          onSuccess: () => {
            form.reset({
              name: "",
              address: "",
              service_days: [],
              patient_ids: [],
            });
            onSuccess?.();
          },
        }
      );
    }
  }
  
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>{isUpdating ? "Editar Clínica" : "Nova Clínica"}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
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
                  <div className="space-y-2">
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
                    {patients.map((patient) => (
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
                    ))}
                    {patients.length === 0 && (
                      <div className="text-sm text-muted-foreground py-2 text-center">
                        Nenhum paciente cadastrado
                      </div>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          
          <CardFooter className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={addClinic.isPending || updateClinic.isPending}
            >
              {isUpdating ? "Atualizar" : "Salvar"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
