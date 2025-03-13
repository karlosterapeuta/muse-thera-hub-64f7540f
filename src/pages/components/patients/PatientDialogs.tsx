
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type Patient = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  birth_date: string | null;
  responsible: string | null;
  contact: string | null;
};

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }),
  birth_date: z.date({
    required_error: "Uma data de nascimento é necessária.",
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

// Fixed implementation of formatDateWithoutTimezoneIssue to ensure it respects the selected date
function getFormattedDateString(date: Date): string {
  // Setting specific time (noon) to avoid any timezone offset issues
  const correctedDate = new Date(date);
  correctedDate.setHours(12, 0, 0, 0);
  
  const year = correctedDate.getFullYear();
  const month = String(correctedDate.getMonth() + 1).padStart(2, '0');
  const day = String(correctedDate.getDate()).padStart(2, '0');
  
  // Log all date representations to debug
  console.log("Selected date object:", date);
  console.log("Corrected date object:", correctedDate);
  console.log("Date components - Year:", year, "Month:", month, "Day:", day);
  
  // Return date in YYYY-MM-DD format
  return `${year}-${month}-${day}`;
}

export function AddPatientDialog({ loadPatients, closeModal }: AddPatientDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      birth_date: new Date(),
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
      
      // Get the formatted date string using our improved function
      const formattedDate = getFormattedDateString(values.birth_date);
      
      console.log("Data selecionada no formulário (local):", format(values.birth_date, 'dd/MM/yyyy'));
      console.log("Data formatada para armazenamento:", formattedDate);

      const { data, error } = await supabase
        .from("patients")
        .insert([
          { 
            name: values.name,
            professional_id: user.id,
            birth_date: formattedDate,
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
            <FormItem className="flex flex-col">
              <FormLabel>Data de Nascimento</FormLabel>
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
                        <span>Selecione a data</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    locale={ptBR}
                    selected={field.value}
                    onSelect={(date) => {
                      if (date) {
                        // Log when user selects a date
                        console.log("Data selecionada pelo usuário:", date);
                        field.onChange(date);
                      }
                    }}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
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
    birth_date: z.date({
      required_error: "Uma data de nascimento é necessária.",
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
      birth_date: patient.birth_date ? new Date(patient.birth_date) : new Date(),
      responsible: patient.responsible || "",
      contact: patient.contact || "",
    },
  });

  async function onSubmit(values: z.infer<typeof EditFormSchema>) {
    try {
      setIsSubmitting(true);
      
      // Get the formatted date string using our improved function
      const formattedDate = getFormattedDateString(values.birth_date);
      
      console.log("Data selecionada para edição (local):", format(values.birth_date, 'dd/MM/yyyy'));
      console.log("Data formatada para armazenamento (edição):", formattedDate);
      
      const { error, data } = await supabase
        .from("patients")
        .update({
          name: values.name,
          birth_date: formattedDate,
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
            <FormItem className="flex flex-col">
              <FormLabel>Data de Nascimento</FormLabel>
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
                        <span>Selecione a data</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    locale={ptBR}
                    selected={field.value}
                    onSelect={(date) => {
                      if (date) {
                        // Log when user selects a date
                        console.log("Data selecionada pelo usuário (edição):", date);
                        field.onChange(date);
                      }
                    }}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
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
