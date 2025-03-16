
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

const formSchema = z.object({
  clinic_id: z.string().min(1, { message: "Clínica é obrigatória" }),
  patient_id: z.string().optional(),
  amount: z.number().min(0.01, { message: "Valor deve ser maior que zero" }),
  session_date: z.string().min(1, { message: "Data é obrigatória" }),
  description: z.string().optional(),
});

type FinancialRecordFormValues = z.infer<typeof formSchema>;

interface FinancialRecordFormProps {
  onSuccess?: () => void;
  record?: FinancialRecord;
}

export function FinancialRecordForm({ onSuccess, record }: FinancialRecordFormProps) {
  const isUpdating = !!record;
  const { data: clinics = [] } = useClinics();
  const addRecord = useAddFinancialRecord();
  const updateRecord = useUpdateFinancialRecord();
  
  const { data: patients = [] } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patients")
        .select("id, name")
        .order("name");
        
      if (error) throw error;
      return data;
    },
  });
  
  const form = useForm<FinancialRecordFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clinic_id: record?.clinic_id || "",
      patient_id: record?.patient_id || "",
      amount: record?.amount || 0,
      session_date: record?.session_date ? format(new Date(record.session_date), "yyyy-MM-dd'T'HH:mm") : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      description: record?.description || "",
    },
  });
  
  function onSubmit(values: FinancialRecordFormValues) {
    if (isUpdating) {
      updateRecord.mutate(
        { ...values, id: record.id },
        {
          onSuccess: () => {
            onSuccess?.();
          },
        }
      );
    } else {
      addRecord.mutate(
        values,
        {
          onSuccess: () => {
            form.reset({
              clinic_id: "",
              patient_id: "",
              amount: 0,
              session_date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
              description: "",
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
        <CardTitle>{isUpdating ? "Editar Registro" : "Novo Registro Financeiro"}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="clinic_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Clínica</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
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
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um paciente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Nenhum paciente</SelectItem>
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
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="session_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data e Hora</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
                    />
                  </FormControl>
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
              disabled={addRecord.isPending || updateRecord.isPending}
            >
              {isUpdating ? "Atualizar" : "Salvar"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
