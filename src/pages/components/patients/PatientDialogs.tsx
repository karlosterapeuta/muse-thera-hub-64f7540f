
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

// Updated Patient type to include both birth_date and age
type Patient = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  birth_date: string | null;
  age: number | null;
  responsible: string | null;
  contact: string | null;
};

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }),
  birth_date: z.string().min(1, {
    message: "Data de nascimento é obrigatória.",
  }),
  responsible: z.string().min(2, {
    message: "Nome do responsável deve ter pelo menos 2 caracteres.",
  }),
  contact: z.string().min(10, {
    message: "Número de contato deve ter pelo menos 10 caracteres.",
  }).max(15, {
    message: "Número de contato deve ter no máximo 15 caracteres.",
  }),
});

interface AddPatientDialogProps {
  loadPatients: () => void;
  closeModal: () => void;
}

export function AddPatientDialog({ loadPatients, closeModal }: AddPatientDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      birth_date: "",
      responsible: "",
      contact: "",
    },
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    try {
      setIsSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Usuário não encontrado",
        });
        return;
      }
      
      console.log("Data de nascimento fornecida:", values.birth_date);

      const { data, error } = await supabase
        .from("patients")
        .insert([
          { 
            name: values.name,
            professional_id: user.id,
            birth_date: values.birth_date,
            responsible: values.responsible,
            contact: values.contact
          },
        ])
        .select();

      if (error) {
        console.error("Erro ao criar paciente:", error);
        throw error;
      }

      // Log the returned data to check what was actually saved
      console.log("Dados retornados após inserção:", data);

      toast({
        title: "Sucesso",
        description: "Paciente criado com sucesso",
      });
      loadPatients();
    } catch (error) {
      console.error("Erro ao criar paciente:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível criar o paciente",
      });
    } finally {
      setIsSubmitting(false);
      closeModal();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome do paciente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birth_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de Nascimento</FormLabel>
              <FormControl>
                <Input 
                  type="date" 
                  placeholder="Data de nascimento do paciente" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="responsible"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Responsável</FormLabel>
              <FormControl>
                <Input placeholder="Nome do responsável" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contato</FormLabel>
              <FormControl>
                <Input placeholder="(99) 99999-9999" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Criando..." : "Criar Paciente"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

interface EditPatientDialogProps {
  patient: Patient;
  loadPatients: () => void;
  closeModal: () => void;
}

export function EditPatientDialog({ patient, loadPatients, closeModal }: EditPatientDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const EditFormSchema = z.object({
    name: z.string().min(2, {
      message: "Nome deve ter pelo menos 2 caracteres.",
    }),
    birth_date: z.string().min(1, {
      message: "Data de nascimento é obrigatória.",
    }),
    responsible: z.string().min(2, {
      message: "Nome do responsável deve ter pelo menos 2 caracteres.",
    }),
    contact: z.string().min(10, {
      message: "Número de contato deve ter pelo menos 10 caracteres.",
    }).max(15, {
      message: "Número de contato deve ter no máximo 15 caracteres.",
    }),
  });

  const form = useForm<z.infer<typeof EditFormSchema>>({
    resolver: zodResolver(EditFormSchema),
    defaultValues: {
      name: patient.name,
      birth_date: patient.birth_date || "",
      responsible: patient.responsible || "",
      contact: patient.contact || "",
    },
  });

  async function onSubmit(values: z.infer<typeof EditFormSchema>) {
    try {
      setIsSubmitting(true);
      
      console.log("Data de nascimento fornecida para edição:", values.birth_date);
      
      const { error, data } = await supabase
        .from("patients")
        .update({
          name: values.name,
          birth_date: values.birth_date,
          responsible: values.responsible,
          contact: values.contact,
          updated_at: new Date().toISOString(),
        })
        .eq('id', patient.id)
        .select();

      if (error) {
        console.error("Erro ao atualizar paciente:", error);
        throw error;
      }
      
      // Log the returned data to check what was actually saved
      console.log("Dados retornados após atualização:", data);

      toast({
        title: "Sucesso",
        description: "Paciente atualizado com sucesso",
      });
      loadPatients();
    } catch (error) {
      console.error("Erro ao atualizar paciente:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar o paciente",
      });
    } finally {
      setIsSubmitting(false);
      closeModal();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome do paciente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birth_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de Nascimento</FormLabel>
              <FormControl>
                <Input 
                  type="date" 
                  placeholder="Data de nascimento do paciente" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="responsible"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Responsável</FormLabel>
              <FormControl>
                <Input placeholder="Nome do responsável" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contato</FormLabel>
              <FormControl>
                <Input placeholder="(99) 99999-9999" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
