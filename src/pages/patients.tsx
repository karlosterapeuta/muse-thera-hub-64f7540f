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
  Users,
  Sparkles
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

  const handleDeletePatient = async (patientId: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from("patients")
        .delete()
        .eq('id', patientId);

      if (error) {
        console.error("Erro ao excluir paciente:", error);
        throw error;
      }

      // Atualizar a lista local removendo o paciente excluído
      setPatients(prevPatients => prevPatients.filter(p => p.id !== patientId));
      
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto py-4 md:py-8 space-y-8 animate-fadeIn">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-12">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 blur-3xl rounded-full"></div>
            <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary to-purple-600 rounded-full shadow-2xl">
              <Users className="h-10 w-10 text-white" />
            </div>
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Pacientes
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Gerencie seus pacientes com facilidade e organize todo o processo terapêutico
            </p>
          </div>
        </div>

        {/* Main Card with enhanced design */}
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm hover:shadow-3xl transition-all duration-500 overflow-hidden">
          {/* Header with gradient background */}
          <CardHeader className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border-b border-gray-100">
            <div className="absolute inset-0 bg-gradient-to-r from-white/50 to-transparent"></div>
            <div className="relative flex flex-col md:flex-row items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-primary to-purple-600 rounded-2xl shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Gerenciar Pacientes
                  </CardTitle>
                  <CardDescription className="text-base md:text-lg text-gray-600">
                    Organize e acompanhe seus pacientes
                  </CardDescription>
                </div>
              </div>
              <Button 
                onClick={() => setIsAddDialogOpen(true)} 
                size={isMobile ? "default" : "lg"}
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full md:w-auto"
              >
                <UserRoundPlus className="h-5 w-5 mr-2" />
                <Sparkles className="h-4 w-4 mr-1" />
                {isMobile ? "Novo Paciente" : "Adicionar Paciente"}
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6 md:p-8">
            {/* Enhanced Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 blur-xl rounded-2xl"></div>
                <div className="relative flex items-center bg-white/90 backdrop-blur-sm border-2 border-gray-100 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/30">
                  <Search className="h-5 w-5 text-gray-400 mr-3" />
                  <Input
                    type="search"
                    placeholder="Buscar paciente por nome ou responsável..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-700 placeholder-gray-400 text-base"
                  />
                </div>
              </div>
            </div>
            
            {/* Content Area */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-purple-500/30 blur-2xl rounded-full"></div>
                  <div className="relative inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary/30 border-t-primary shadow-lg"></div>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold text-gray-700">Carregando pacientes...</h3>
                  <p className="text-gray-500">Aguarde um momento</p>
                </div>
              </div>
            ) : (
              <>
                {isMobile ? (
                  <div className="space-y-4">
                    {filteredPatients.length > 0 ? (
                      filteredPatients.map((patient, index) => (
                        <div 
                          key={patient.id}
                          className="animate-fadeIn"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <PatientCard
                            patient={patient}
                            onEdit={() => handleEditClick(patient)}
                            onDelete={() => handleDeletePatient(patient.id)}
                            onViewAnamnesis={() => handleViewAnamnesis(patient)}
                            onEditAnamnesis={() => handleEditAnamnesis(patient)}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-16 space-y-6">
                        <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto">
                          <Users className="h-12 w-12 text-gray-400" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold text-gray-600">Nenhum paciente encontrado</h3>
                          <p className="text-gray-500">Comece adicionando seu primeiro paciente</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-100 overflow-hidden shadow-lg">
                    <PatientList
                      patients={filteredPatients}
                      onEdit={handleEditClick}
                      onDelete={(patient) => handleDeletePatient(patient.id)}
                      onViewAnamnesis={handleViewAnamnesis}
                      onEditAnamnesis={handleEditAnamnesis}
                    />
                  </div>
                )}
              </>
            )}
          </CardContent>

          {/* Enhanced Footer */}
          <CardFooter className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-t border-gray-100 p-6">
            <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    disabled={patients.length === 0}
                    className="w-full md:w-auto bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Excluir Todos os Pacientes
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="border-0 shadow-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-bold text-gray-800">Tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600 text-base">
                      Esta ação irá excluir todos os pacientes permanentemente e não
                      poderá ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="hover:bg-gray-100">Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        setShowDeleteConfirm(true);
                        handleDeleteAllPatients();
                      }}
                      className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
                    >
                      Excluir Todos
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              <div className="flex items-center space-x-3 text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-primary to-purple-600 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">
                    {patients.length} paciente{patients.length !== 1 ? 's' : ''} cadastrado{patients.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>

        {/* Dialogs - keeping existing dialog structure */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[425px] p-0 sm:p-6 border-0 shadow-2xl">
            <DialogHeader className="p-4 sm:p-0">
              <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Adicionar Paciente
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Crie um novo paciente para iniciar o processo terapêutico.
              </DialogDescription>
            </DialogHeader>
            <div className="px-4 pb-4 sm:p-0">
              <AddPatientDialog loadPatients={loadPatients} closeModal={() => setIsAddDialogOpen(false)}/>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px] p-0 sm:p-6 border-0 shadow-2xl">
            <DialogHeader className="p-4 sm:p-0">
              <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Editar Paciente
              </DialogTitle>
              <DialogDescription className="text-gray-600">
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
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto p-0 sm:p-6 border-0 shadow-2xl">
            <DialogHeader className="p-4 sm:p-0">
              <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Anamnese
              </DialogTitle>
              <DialogDescription className="text-gray-600">
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
    </div>
  );
}
