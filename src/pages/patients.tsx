
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { CalendarIcon, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  birth_date: z.date().optional(),
  contact: z.string().optional(),
  responsible: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type Patient = {
  id: string;
  name: string;
  birth_date: string | null;
  contact: string | null;
  responsible: string | null;
  created_at: string;
};

export default function Patients() {
  const { toast } = useToast();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      contact: "",
      responsible: "",
    },
  });

  const fetchPatients = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar pacientes",
        description: "Usuário não autenticado.",
      });
      return;
    }

    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq('professional_id', user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar pacientes",
        description: "Ocorreu um erro ao carregar a lista de pacientes.",
      });
      return;
    }

    setPatients(data);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  async function onSubmit(values: FormValues) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar paciente",
        description: "Usuário não autenticado.",
      });
      return;
    }

    const formattedValues = {
      name: values.name,
      birth_date: values.birth_date ? format(values.birth_date, 'yyyy-MM-dd') : null,
      contact: values.contact || null,
      responsible: values.responsible || null,
      professional_id: user.id
    };

    const { error } = await supabase
      .from("patients")
      .insert(formattedValues)
      .select()
      .single();

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar paciente",
        description: "Ocorreu um erro ao tentar cadastrar o paciente. Tente novamente.",
      });
      return;
    }

    toast({
      title: "Paciente cadastrado com sucesso!",
      description: `O paciente ${values.name} foi cadastrado com sucesso.`,
    });

    form.reset();
    fetchPatients();
  }

  const handleDeleteAllPatients = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Erro ao remover pacientes",
        description: "Usuário não autenticado.",
      });
      return;
    }

    const { error } = await supabase
      .from("patients")
      .delete()
      .eq('professional_id', user.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao remover pacientes",
        description: "Ocorreu um erro ao tentar remover os pacientes. Tente novamente.",
      });
      return;
    }

    toast({
      title: "Pacientes removidos com sucesso!",
      description: "Todos os pacientes foram removidos do sistema.",
    });

    fetchPatients();
  };

  const handleDeletePatient = async (patient: Patient) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Erro ao remover paciente",
        description: "Usuário não autenticado.",
      });
      return;
    }

    const { error } = await supabase
      .from("patients")
      .delete()
      .eq('id', patient.id)
      .eq('professional_id', user.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao remover paciente",
        description: "Ocorreu um erro ao tentar remover o paciente. Tente novamente.",
      });
      return;
    }

    toast({
      title: "Paciente removido com sucesso!",
      description: `O paciente ${patient.name} foi removido do sistema.`,
    });

    setPatientToDelete(null);
    fetchPatients();
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Cadastro de Paciente</CardTitle>
          <CardDescription>
            Preencha os dados do paciente para cadastrá-lo no sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome do paciente" {...field} />
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
                    <FormLabel>Data de nascimento</FormLabel>
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

              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contato</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o telefone ou email" {...field} />
                    </FormControl>
                    <FormDescription>
                      Telefone ou email para contato
                    </FormDescription>
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
                      <Input placeholder="Digite o nome do responsável" {...field} />
                    </FormControl>
                    <FormDescription>
                      Para pacientes menores de idade
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Cadastrar Paciente
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Pacientes Cadastrados</CardTitle>
            <CardDescription>
              Lista de todos os pacientes cadastrados no sistema
            </CardDescription>
          </div>
          {patients.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  Remover Todos os Pacientes
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Todos os pacientes serão removidos permanentemente do sistema.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAllPatients}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Sim, remover todos
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Data de Nascimento</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>{patient.name}</TableCell>
                    <TableCell>
                      {patient.birth_date
                        ? format(new Date(patient.birth_date), "dd/MM/yyyy")
                        : "-"}
                    </TableCell>
                    <TableCell>{patient.contact || "-"}</TableCell>
                    <TableCell>{patient.responsible || "-"}</TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => setPatientToDelete(patient)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o paciente {patient.name}? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setPatientToDelete(null)}>
                              Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeletePatient(patient)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Sim, excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
                {patients.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      Nenhum paciente cadastrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
