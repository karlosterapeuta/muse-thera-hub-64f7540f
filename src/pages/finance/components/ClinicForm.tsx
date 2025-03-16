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

const formSchema = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  address: z.string().optional(),
});

type ClinicFormValues = z.infer<typeof formSchema>;

interface ClinicFormProps {
  onSuccess?: () => void;
  clinic?: Clinic;
}

export function ClinicForm({ onSuccess, clinic }: ClinicFormProps) {
  const isUpdating = !!clinic;
  const addClinic = useAddClinic();
  const updateClinic = useUpdateClinic();
  
  const form = useForm<ClinicFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: clinic?.name || "",
      address: clinic?.address || "",
    },
  });
  
  function onSubmit(values: ClinicFormValues) {
    if (isUpdating) {
      updateClinic.mutate(
        { 
          id: clinic.id,
          name: values.name,
          address: values.address 
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
          address: values.address 
        },
        {
          onSuccess: () => {
            form.reset({
              name: "",
              address: "",
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
