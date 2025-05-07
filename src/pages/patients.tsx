
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
  Loader2,
  FileText
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { PatientList } from "./components/patients/PatientList";
import { PatientCard } from "./components/patients/PatientCard";
import { AddPatientDialog, EditPatientDialog } from "./components/patients/PatientDialogs";
import { ViewAnamnesisDialog } from "./components/patients/ViewAnamnesisDialog";

type Patient = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  birth_date: string | null;
  responsible: string | null;
  contact: string | null;
  age: number | null;
  has_anamnesis?: boolean;
};

type Anamnesis = {
  id: string;
  created_at: string;
  updated_at: string;
  professional_id: string;
  patient_id: string;
  legal_guardian?: string | null;
  family_relationship?: string | null;
  referral_professional?: string | null;
  main_clinical_demand?: string | null;
  [key: string]: any;
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
  const [isViewAnamnesisOpen, setIsViewAnamnesisOpen] = useState(false);
  const [isEditAnamnesisOpen, setIsEditAnamnesisOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedAnamnesis, setSelectedAnamnesis] = useState<Anamnesis | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const calculateAge = (birthDate: string | null): number | null => {
    if (!birthDate) return null;
    
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    
    // Verificar se a data é válida
    if (isNaN(birthDateObj.getTime())) return null;
    
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    
    // Se ainda não chegou ao aniversário deste ano, subtrair 1 da idade
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    
    return age;
  };

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
        age: patient.age || calculateAge(patient.birth_date)
      })) || [];

      // Check if each patient has anamnesis records
      const patientsWithAnamnesis = await Promise.all(
        patientsWithAge.map(async (patient) => {
          const { data, error } = await supabase
            .from("anamnesis")
            .select("id")
            .eq("patient_id", patient.id)
            .maybeSingle();

          return {
            ...patient,
            has_anamnesis: !!data
          };
        })
      );

      setPatients(patientsWithAnamnesis);
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

  const handleViewAnamnesis = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsViewAnamnesisOpen(true);
  };

  const handleEditAnamnesis = (patient: Patient) => {
    setSelectedPatient(patient);
    // First, we need to fetch the anamnesis data
    const fetchAnamnesis = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("anamnesis")
          .select("*")
          .eq("patient_id", patient.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setSelectedAnamnesis(data);
          // Navigate to anamnesis page with pre-populated data
          window.location.href = `/anamnesis?patient_id=${patient.id}&anamnesis_id=${data.id}&mode=edit`;
        }
      } catch (error) {
        console.error("Erro ao carregar anamnese para edição:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar os dados da anamnese para edição.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnamnesis();
  };

  const handleAnamnesisEdit = (anamnesis: Anamnesis) => {
    if (selectedPatient) {
      window.location.href = `/anamnesis?patient_id=${selectedPatient.id}&anamnesis_id=${anamnesis.id}&mode=edit`;
    }
    setIsViewAnamnesisOpen(false);
  };

  return (
    <div className="container mx-auto py-4 md:py-6">
      <Card className="shadow-md">
        <CardHeader className="flex flex-col md:flex-row items-center md:justify-between space-y-4 md:space-y-0 pb-3 bg-gradient-to-r from-purple-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-t-lg p-4 md:p-6">
          <div>
            <CardTitle className="text-xl md:text-2xl font-bold">Pacientes</CardTitle>
            <CardDescription className="text-sm md:text-base">
              Gerencie seus pacientes
            </CardDescription>
          </div>
          <Button 
            onClick={() => setIsAddDialogOpen(true)} 
            size={isMobile ? "sm" : "default"}
            className="bg-primary hover:bg-primary/90 text-white transition-all w-full md:w-auto"
          >
            <UserRoundPlus className="h-4 w-4 mr-2" />
            {isMobile ? "Novo" : "Novo Paciente"}
          </Button>
        </CardHeader>
        <CardContent className="p-3 md:p-6">
          <div className="mb-4 flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
            <Search className="h-4 w-4 text-gray-500 ml-2" />
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
                <div className="space-y-3">
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                      <PatientCard
                        key={patient.id}
                        patient={patient}
                        onEdit={() => handleEditClick(patient)}
                        onDelete={() => handleDeletePatient(patient)}
                        onViewAnamnesis={() => handleViewAnamnesis(patient)}
                        onEditAnamnesis={() => handleEditAnamnesis(patient)}
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
                  onViewAnamnesis={handleViewAnamnesis}
                  onEditAnamnesis={handleEditAnamnesis}
                />
              )}
            </>
          )}
        </CardContent>
        <CardFooter className="flex flex-col md:flex-row justify-between items-center p-4 border-t bg-gray-50 dark:bg-gray-800 rounded-b-lg gap-3 md:gap-0">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                size="sm" 
                disabled={patients.length === 0}
                className="w-full md:w-auto order-2 md:order-1"
              >
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
          <div className="text-sm text-gray-500 order-1 md:order-2">
            {patients.length} paciente{patients.length !== 1 ? 's' : ''}
          </div>
        </CardFooter>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px] p-0 sm:p-6">
          <DialogHeader className="p-4 sm:p-0">
            <DialogTitle>Adicionar Paciente</DialogTitle>
            <DialogDescription>
              Crie um novo paciente para iniciar o processo.
            </DialogDescription>
          </DialogHeader>
          <div className="px-4 pb-4 sm:p-0">
            <AddPatientDialog loadPatients={loadPatients} closeModal={() => setIsAddDialogOpen(false)}/>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px] p-0 sm:p-6">
          <DialogHeader className="p-4 sm:p-0">
            <DialogTitle>Editar Paciente</DialogTitle>
            <DialogDescription>
              Atualize as informações do paciente.
            </DialogDescription>
          </DialogHeader>
          <div className="px-4 pb-4 sm:p-0">
            {patientToEdit && (
              <EditPatientDialog 
                patient={patientToEdit} 
                loadPatients={loadPatients} 
                closeModal={() => setIsEditDialogOpen(false)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewAnamnesisOpen} onOpenChange={setIsViewAnamnesisOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto p-0 sm:p-6">
          <DialogHeader className="p-4 sm:p-0">
            <DialogTitle>Anamnese</DialogTitle>
            <DialogDescription>
              Visualize a anamnese do paciente.
            </DialogDescription>
          </DialogHeader>
          <div className="px-4 pb-4 sm:p-0">
            {selectedPatient && (
              <ViewAnamnesisDialog 
                patient={selectedPatient} 
                closeModal={() => setIsViewAnamnesisOpen(false)}
                onEdit={handleAnamnesisEdit}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
