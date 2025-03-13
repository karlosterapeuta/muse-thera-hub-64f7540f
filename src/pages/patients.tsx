
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { 
  Search, 
  UserRoundPlus,
  Loader2
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { PatientList } from "./components/patients/PatientList";
import { PatientCard } from "./components/patients/PatientCard";
import { AddPatientDialog, EditPatientDialog } from "./components/patients/PatientDialogs";

type Patient = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  birth_date: string | null;
  responsible: string | null;
  contact: string | null;
  age: number | null;
};

interface PatientFilter {
  searchTerm: string;
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

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

      // Transform data to include the age property
      const patientsWithAge = data?.map(patient => ({
        ...patient,
        age: patient.age || null,  // Use the age column if it exists
      })) || [];

      setPatients(patientsWithAge);
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

  const handleEditClick = (patient: Patient) => {
    setPatientToEdit(patient);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6">
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-gradient-to-r from-purple-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-t-lg">
          <div>
            <CardTitle className="text-xl md:text-2xl font-bold">Pacientes</CardTitle>
            <CardDescription className="text-sm md:text-base">
              Gerencie seus pacientes
            </CardDescription>
          </div>
          <Button 
            onClick={() => setIsAddDialogOpen(true)} 
            size="sm"
            className="bg-primary hover:bg-primary/90 text-white transition-all"
          >
            <UserRoundPlus className="h-4 w-4 mr-2" />
            <span className={isMobile ? "hidden" : "inline"}>Novo Paciente</span>
          </Button>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="mb-4 flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Buscar paciente..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {isMobile ? (
                <div className="space-y-4">
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                      <PatientCard
                        key={patient.id}
                        patient={patient}
                        onEdit={() => handleEditClick(patient)}
                        onDelete={() => handleDeletePatient(patient)}
                      />
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-8 bg-gray-50 dark:bg-gray-800 rounded-md">
                      Nenhum paciente encontrado.
                    </div>
                  )}
                </div>
              ) : (
                <PatientList
                  patients={filteredPatients}
                  onEdit={handleEditClick}
                  onDelete={handleDeletePatient}
                />
              )}
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between items-center p-4 border-t bg-gray-50 dark:bg-gray-800 rounded-b-lg">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" disabled={patients.length === 0}>
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
          <div className="text-sm text-gray-500">
            {patients.length} paciente{patients.length !== 1 ? 's' : ''}
          </div>
        </CardFooter>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Paciente</DialogTitle>
            <DialogDescription>
              Crie um novo paciente para iniciar o processo.
            </DialogDescription>
          </DialogHeader>
          <AddPatientDialog loadPatients={loadPatients} closeModal={() => setIsAddDialogOpen(false)}/>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Paciente</DialogTitle>
            <DialogDescription>
              Atualize as informações do paciente.
            </DialogDescription>
          </DialogHeader>
          {patientToEdit && (
            <EditPatientDialog 
              patient={patientToEdit} 
              loadPatients={loadPatients} 
              closeModal={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
