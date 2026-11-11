
import { useEffect, useState } from "react";
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
import { PatientPhotoUpload } from "./PatientPhotoUpload";

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
  photo_url?: string | null;
};

const FormSchema = z.object({
  name: z.string().trim().min(2, "Informe pelo menos 2 caracteres para o nome."),
  birth_date: z.string().refine(value => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(value + "T12:00:00");
    return !Number.isNaN(date.getTime()) &&
      date.toISOString().slice(0, 10) === value &&
      date.getTime() <= Date.now();
  }, "Informe uma data de nascimento válida, que não esteja no futuro."),
  responsible: z.string().trim(),
  contact: z.string().trim().refine(value => {
    const digits = value.replace(/\D/g, "");
    return !value || (digits.length >= 10 && digits.length <= 11);
  }, "Informe um telefone válido com DDD ou deixe em branco."),
});

interface AddPatientDialogProps {
  loadPatients: () => void;
  closeModal: () => void;
  onDirtyChange?: (dirty: boolean) => void;
  onBusyChange?: (busy: boolean) => void;
}

export function AddPatientDialog({ loadPatients, closeModal, onDirtyChange, onBusyChange }: AddPatientDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      birth_date: "",
      responsible: "",
      contact: "",
    },
  });

  useEffect(() => { onDirtyChange?.(form.formState.isDirty || photoUrl !== null); }, [form.formState.isDirty, photoUrl, onDirtyChange]);
  useEffect(() => { onBusyChange?.(isSubmitting || isPhotoUploading); }, [isSubmitting, isPhotoUploading, onBusyChange]);

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
      

      const { data, error } = await supabase
        .from("patients")
        .insert([
          { 
            name: values.name,
            professional_id: user.id,
            birth_date: values.birth_date,
            responsible: values.responsible || null,
            contact: values.contact || null,
            photo_url: photoUrl
          },
        ])
        .select("id")
        .maybeSingle();

      if (error) {
        console.error("Erro ao criar paciente:", error);
        throw error;
      }

      if (!data) throw new Error("Não foi possível confirmar o cadastro.");

      toast({
        title: "Sucesso",
        description: "Paciente criado com sucesso",
      });
      loadPatients();
      closeModal();
    } catch (error) {
      console.error("Erro ao criar paciente:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível criar o paciente",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <PatientPhotoUpload onPhotoUploaded={setPhotoUrl} currentPhotoUrl={photoUrl} onUploadingChange={setIsPhotoUploading} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-1.5 sm:space-y-2">
                  <FormLabel className="text-sm sm:text-base font-medium">Nome</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Nome do paciente" 
                      className="h-11 sm:h-12 text-base rounded-xl"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="birth_date"
              render={({ field }) => (
                <FormItem className="space-y-1.5 sm:space-y-2">
                  <FormLabel className="text-sm sm:text-base font-medium">Data de Nascimento</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      placeholder="Data de nascimento do paciente" 
                      className="h-11 sm:h-12 text-base rounded-xl"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <FormField
              control={form.control}
              name="responsible"
              render={({ field }) => (
                <FormItem className="space-y-1.5 sm:space-y-2">
                  <FormLabel className="text-sm sm:text-base font-medium">Responsável</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Nome do responsável" 
                      className="h-11 sm:h-12 text-base rounded-xl"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem className="space-y-1.5 sm:space-y-2">
                  <FormLabel className="text-sm sm:text-base font-medium">Contato</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="(99) 99999-9999" 
                      className="h-11 sm:h-12 text-base rounded-xl"
                      inputMode="tel"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-3 sm:gap-2 pt-2 sm:pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting || isPhotoUploading}
              className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 text-base rounded-xl"
            >
              {isPhotoUploading ? "Enviando foto..." : isSubmitting ? "Criando..." : "Criar Paciente"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
}

interface EditPatientDialogProps {
  patient: Patient;
  loadPatients: () => void;
  closeModal: () => void;
  onDirtyChange?: (dirty: boolean) => void;
  onBusyChange?: (busy: boolean) => void;
}

export function EditPatientDialog({ patient, loadPatients, closeModal, onDirtyChange, onBusyChange }: EditPatientDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(patient.photo_url || null);
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: patient.name,
      birth_date: patient.birth_date || "",
      responsible: patient.responsible || "",
      contact: patient.contact || "",
    },
  });

  useEffect(() => { onDirtyChange?.(form.formState.isDirty || photoUrl !== (patient.photo_url || null)); }, [form.formState.isDirty, photoUrl, patient.photo_url, onDirtyChange]);
  useEffect(() => { onBusyChange?.(isSubmitting || isPhotoUploading); }, [isSubmitting, isPhotoUploading, onBusyChange]);

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    try {
      setIsSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sessão expirada. Faça login novamente.");
      
      const { error, data } = await supabase
        .from("patients")
        .update({
          name: values.name,
          birth_date: values.birth_date,
          responsible: values.responsible || null,
          contact: values.contact || null,
          photo_url: photoUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', patient.id)
        .eq('professional_id', user.id)
        .select('id')
        .maybeSingle();

      if (error) {
        console.error("Erro ao atualizar paciente:", error);
        throw error;
      }
      
      if (!data) throw new Error("Paciente não encontrado ou acesso não autorizado.");

      toast({
        title: "Sucesso",
        description: "Paciente atualizado com sucesso",
      });
      loadPatients();
      closeModal();
    } catch (error) {
      console.error("Erro ao atualizar paciente:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar o paciente",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <PatientPhotoUpload onPhotoUploaded={setPhotoUrl} currentPhotoUrl={photoUrl} onUploadingChange={setIsPhotoUploading} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-1.5 sm:space-y-2">
                  <FormLabel className="text-sm sm:text-base font-medium">Nome</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Nome do paciente" 
                      className="h-11 sm:h-12 text-base rounded-xl"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="birth_date"
              render={({ field }) => (
                <FormItem className="space-y-1.5 sm:space-y-2">
                  <FormLabel className="text-sm sm:text-base font-medium">Data de Nascimento</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      placeholder="Data de nascimento do paciente" 
                      className="h-11 sm:h-12 text-base rounded-xl"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <FormField
              control={form.control}
              name="responsible"
              render={({ field }) => (
                <FormItem className="space-y-1.5 sm:space-y-2">
                  <FormLabel className="text-sm sm:text-base font-medium">Responsável</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Nome do responsável" 
                      className="h-11 sm:h-12 text-base rounded-xl"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem className="space-y-1.5 sm:space-y-2">
                  <FormLabel className="text-sm sm:text-base font-medium">Contato</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="(99) 99999-9999" 
                      className="h-11 sm:h-12 text-base rounded-xl"
                      inputMode="tel"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-3 sm:gap-2 pt-2 sm:pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting || isPhotoUploading}
              className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 text-base rounded-xl"
            >
              {isPhotoUploading ? "Enviando foto..." : isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
}
