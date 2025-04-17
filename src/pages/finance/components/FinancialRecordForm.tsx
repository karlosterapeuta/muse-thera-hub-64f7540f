import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useClinics } from "../hooks/useClinics";
import { useAddFinancialRecord, useUpdateFinancialRecord } from "../hooks/useFinancialData";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { FinancialRecord } from "../types";
import { useIsMobile, useIsTablet } from "@/hooks/use-mobile";

const weekdayOptions = [
  { label: "Segunda-feira", value: "segunda" },
  { label: "Terça-feira", value: "terca" },
  { label: "Quarta-feira", value: "quarta" },
  { label: "Quinta-feira", value: "quinta" },
  { label: "Sexta-feira", value: "sexta" },
  { label: "Sábado", value: "sabado" },
];

const baseTimeOptions = Array.from({ length: 14 }, (_, i) => {
  const hour = i + 7;
  return {
    hour,
    label: `${hour}:00`,
    value: `${hour.toString().padStart(2, '0')}:00`
  };
});

const timeOptions = baseTimeOptions.flatMap(baseTime => {
  const { hour } = baseTime;
  
  return [
    { label: `${hour}:00`, value: `${hour.toString().padStart(2, '0')}:00` },
    { label: `${hour}:15`, value: `${hour.toString().padStart(2, '0')}:15` },
    { label: `${hour}:20`, value: `${hour.toString().padStart(2, '0')}:20` },
    { label: `${hour}:30`, value: `${hour.toString().padStart(2, '0')}:30` },
    { label: `${hour}:40`, value: `${hour.toString().padStart(2, '0')}:40` },
    { label: `${hour}:45`, value: `${hour.toString().padStart(2, '0')}:45` }
  ];
});

const durationOptions = [
  { label: "20 minutos", value: "20" },
  { label: "30 minutos", value: "30" },
  { label: "40 minutos", value: "40" },
  { label: "45 minutos", value: "45" },
  { label: "60 minutos", value: "60" },
];

const formSchema = z.object({
  clinic_id: z.string().min(1, { message: "Clínica é obrigatória" }),
  patient_id: z.string().optional(),
  amount: z.number().min(0.01, { message: "Valor deve ser maior que zero" }),
  weekday: z.string().min(1, { message: "Dia da semana é obrigatório" }),
  time: z.string().min(1, { message: "Horário é obrigatório" }),
  duration: z.string().min(1, { message: "Duração é obrigatória" }),
  description: z.string().optional(),
});

type FinancialRecordFormValues = z.infer<typeof formSchema>;

interface FinancialRecordFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  record?: FinancialRecord;
}

export function FinancialRecordForm({ onSuccess, onCancel, record }: FinancialRecordFormProps) {
  const isUpdating = !!record;
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const { data: clinics = [] } = useClinics();
  const addRecord = useAddFinancialRecord();
  const updateRecord = useUpdateFinancialRecord();
  
  const { data: patients = [], isLoading: patientsLoading } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Usuário não autenticado");
      }
      
      const { data, error } = await supabase
        .from("patients")
        .select("id, name")
        .eq("professional_id", user.id)
        .order("name");
        
      if (error) throw error;
      return data;
    },
  });

  const getWeekdayFromDate = (dateString?: string) => {
    if (!dateString) return "segunda";
    
    const date = new Date(dateString);
    const day = date.getDay();
    
    switch (day) {
      case 1: return "segunda";
      case 2: return "terca";
      case 3: return "quarta";
      case 4: return "quinta";
      case 5: return "sexta";
      case 6: return "sabado";
      default: return "segunda";
    }
  };

  const getTimeFromDescription = (description?: string): string => {
    if (!description) return "08:00";
    
    const timeMatch = description.match(/Horário: (\d{2}:\d{2})/);
    return timeMatch ? timeMatch[1] : "08:00";
  };

  const getDurationFromDescription = (description?: string): string => {
    if (!description) return "45";
    
    const durationMatch = description.match(/Duração: (\d+) minutos/);
    return durationMatch ? durationMatch[1] : "45";
  };

  const defaultWeekday = record?.session_date 
    ? getWeekdayFromDate(record.session_date) 
    : "segunda";
  
  const defaultTime = record?.description 
    ? getTimeFromDescription(record.description) 
    : "08:00";
    
  const defaultDuration = record?.description
    ? getDurationFromDescription(record.description)
    : "45";
  
  const form = useForm<FinancialRecordFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clinic_id: record?.clinic_id || "",
      patient_id: record?.patient_id || undefined,
      amount: record?.amount || 0,
      weekday: defaultWeekday,
      time: defaultTime,
      duration: defaultDuration,
      description: record?.description 
        ? record.description.replace(/Dia da semana: [a-z]+\s*\|\s*Horário: \d{2}:\d{2}\s*\|\s*Duração: \d+ minutos\s*\|\s*/, "")
        : "",
    },
  });
  
  useEffect(() => {
    if (record) {
      const cleanDescription = record.description 
        ? record.description.replace(/Dia da semana: [a-z]+\\s*\\|\\s*Horário: \\d{2}:\\d{2}\\s*\\|\\s*Duração: \\d+ minutos\\s*\\|\\s*/, "")
        : "";
        
      form.reset({
        clinic_id: record.clinic_id || "",
        patient_id: record.patient_id || undefined,
        amount: record.amount || 0,
        weekday: getWeekdayFromDate(record.session_date),
        time: getTimeFromDescription(record.description),
        duration: getDurationFromDescription(record.description),
        description: cleanDescription,
      });
    } else {
      form.reset({
        clinic_id: "",
        patient_id: undefined,
        amount: 0,
        weekday: "segunda",
        time: "08:00",
        duration: "45",
        description: "",
      });
    }
  }, [record, form]);
  
  function onSubmit(values: FinancialRecordFormValues) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    const enhancedDescription = `Dia da semana: ${values.weekday} | Horário: ${values.time} | Duração: ${values.duration} minutos${values.description ? ` | ${values.description}` : ''}`;
    
    if (isUpdating && record) {
      updateRecord.mutate(
        { 
          id: record.id,
          clinic_id: values.clinic_id,
          patient_id: values.patient_id === "no-patient" ? undefined : values.patient_id,
          amount: values.amount,
          session_date: format(now, "yyyy-MM-dd'T'HH:mm"),
          description: enhancedDescription
        },
        {
          onSuccess: () => {
            onSuccess?.();
          },
        }
      );
    } else {
      addRecord.mutate(
        { 
          clinic_id: values.clinic_id,
          patient_id: values.patient_id === "no-patient" ? undefined : values.patient_id,
          amount: values.amount,
          session_date: format(now, "yyyy-MM-dd'T'HH:mm"),
          description: enhancedDescription
        },
        {
          onSuccess: () => {
            form.reset({
              clinic_id: "",
              patient_id: undefined,
              amount: 0,
              weekday: "segunda",
              time: "08:00",
              duration: "45",
              description: "",
            });
            onSuccess?.();
          },
        }
      );
    }
  }

  const handleCancel = () => {
    form.reset();
    onCancel?.();
  };
  
  return (
    <Card className={`w-full ${isMobile ? 'rounded-none border-0 shadow-none' : ''}`}>
      <CardHeader className={isMobile ? 'px-4 py-3' : ''}>
        <CardTitle>{isUpdating ? "Editar Registro" : "Novo Registro Financeiro"}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className={`space-y-4 ${isMobile ? 'px-4' : ''}`}>
            <FormField
              control={form.control}
              name="clinic_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Clínica</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma clínica" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clinics.map((clinic) => (
                        <SelectItem key={clinic.id} value={clinic.id}>
                          {clinic.name}
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
              name="patient_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paciente (opcional)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um paciente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem key="no-patient" value="no-patient">
                        Nenhum paciente
                      </SelectItem>
                      {patientsLoading ? (
                        <SelectItem key="loading" value="loading" disabled>
                          Carregando pacientes...
                        </SelectItem>
                      ) : patients.length > 0 ? (
                        patients.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem key="no-patients" value="no-patients" disabled>
                          Nenhum paciente encontrado
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor (R$)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="100.00"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === '' ? 0 : parseFloat(value));
                      }}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className={`${isMobile ? 'space-y-4' : isTablet ? 'grid grid-cols-2 gap-4' : 'grid grid-cols-3 gap-4'}`}>
              <FormField
                control={form.control}
                name="weekday"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dia da Semana</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Dia" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {weekdayOptions.map((day) => (
                          <SelectItem key={day.value} value={day.value}>
                            {day.label}
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
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Horário" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[40vh] overflow-auto">
                        {timeOptions.map((time) => (
                          <SelectItem key={time.value} value={time.value}>
                            {time.label}
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
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duração</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Duração" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {durationOptions.map((duration) => (
                          <SelectItem key={duration.value} value={duration.value}>
                            {duration.label}
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detalhes sobre o atendimento"
                      {...field}
                      className={isMobile ? 'min-h-[80px]' : 'min-h-[100px]'}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          
          <CardFooter className={`${isMobile ? 'flex flex-col gap-2 px-4 pb-6' : isTablet ? 'flex justify-end gap-2' : 'flex justify-end space-x-2'}`}>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className={isMobile ? 'w-full' : ''}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={addRecord.isPending || updateRecord.isPending}
              className={isMobile ? 'w-full' : ''}
            >
              {addRecord.isPending || updateRecord.isPending ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  {isUpdating ? "Atualizando..." : "Salvando..."}
                </>
              ) : (
                isUpdating ? "Atualizar" : "Salvar"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
