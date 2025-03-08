import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { format } from "date-fns";
import { 
  Search, 
  PlusCircle, 
  Pencil, 
  Trash2,
  UserRoundPlus
} from "lucide-react";

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

interface PatientFilter {
  searchTerm: string;
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { toast } = useToast();

  const loadPatients = async () => {
    try {
      setIsLoading(true);
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
        .select("*")
        .eq('professional_id', user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao carregar pacientes:", error);
        throw error;
      }

      setPatients(data || []);
    } catch (error) {
      console.error("Erro ao carregar pacientes:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar a lista de pacientes",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const applyFilters = (patients: Patient[], filters: PatientFilter): Patient[] => {
    return patients.filter((patient) => {
      const searchTermLower = filters.searchTerm.toLowerCase();
      return (
        patient.name.toLowerCase().includes(searchTermLower) ||
        (patient.responsible?.toLowerCase().includes(searchTermLower) ?? false)
      );
    });
  };

  const filteredPatients = applyFilters(patients, { searchTerm });

  const handleDeleteAllPatients = async () => {
    try {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Usuário não encontrado",
        });
        return;
      }

      const { data: patientsToDelete } = await supabase
        .from("patients")
        .select("id")
        .eq('professional_id', user.id);

      const { error } = await supabase
        .from("patients")
        .delete()
        .eq('professional_id', user.id);

      if (error) {
        console.error("Erro ao excluir pacientes:", error);
        throw error;
      }

      setPatients([]);
      toast({
        title: "Sucesso",
        description: "Todos os pacientes foram excluídos",
      });
    } catch (error) {
      console.error("Erro ao excluir pacientes:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível excluir os pacientes",
      });
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleDeletePatient = async (patient: Patient) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from("patients")
        .delete()
        .eq('id', patient.id);

      if (error) {
        console.error("Erro ao excluir paciente:", error);
        throw error;
      }

      loadPatients();
      toast({
        title: "Sucesso",
        description: "Paciente excluído com sucesso",
      });
    } catch (error) {
      console.error("Erro ao excluir paciente:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível excluir o paciente",
      });
    } finally {
      setIsLoading(false);
      setPatientToDelete(null);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Pacientes</CardTitle>
          <Button onClick={() => setIsDialogOpen(true)} size="sm">
            <UserRoundPlus className="h-4 w-4 mr-2" />
            Novo Paciente
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Buscar paciente..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Data de Nascimento</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>
                    {patient.birth_date
                      ? format(new Date(patient.birth_date), "dd/MM/yyyy")
                      : "N/A"}
                  </TableCell>
                  <TableCell>{patient.responsible || "N/A"}</TableCell>
                  <TableCell>{patient.contact || "N/A"}</TableCell>
                  <TableCell className="text-right font-medium">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        window.location.href = `/processos/paciente/editar/${patient.id}`
                      }
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação irá excluir o paciente permanentemente e
                            não poderá ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              setPatientToDelete(patient);
                              handleDeletePatient(patient);
                            }}
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredPatients.length === 0 && (
            <div className="text-center text-gray-500 mt-4">
              Nenhum paciente encontrado.
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between items-center p-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                Excluir Todos os Pacientes
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação irá excluir todos os pacientes permanentemente e não
                  poderá ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    setShowDeleteConfirm(true);
                    handleDeleteAllPatients();
                  }}
                >
                  Excluir Todos
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {isLoading && <div className="text-gray-500">Carregando...</div>}
        </CardFooter>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Paciente</DialogTitle>
            <DialogDescription>
              Crie um novo paciente para iniciar o processo.
            </DialogDescription>
          </DialogHeader>
          <AddPatientDialog loadPatients={loadPatients} closeModal={() => setIsDialogOpen(false)}/>
        </DialogContent>
      </Dialog>
    </div>
  );
}

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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format as dateformat } from "date-fns";
import { ptBR } from 'date-fns/locale';

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

function AddPatientDialog({ loadPatients, closeModal }: AddPatientDialogProps) {
  const { toast } = useToast();
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
            birth_date: values.birth_date.toISOString(),
            responsible: values.responsible,
            contact: values.contact
          },
        ])
        .select();

      if (error) {
        console.error("Erro ao criar paciente:", error);
        throw error;
      }

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
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        dateformat(field.value, "PP", { locale: ptBR })
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
          <Button type="submit">Criar Paciente</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
