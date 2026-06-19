import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
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
  Users,
  Sparkles,
  Trash2,
  HeartPulse
} from "lucide-react";
import { CosmicBackground } from "@/components/auth/CosmicBackground";

import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { PatientList } from "./components/patients/PatientList";
import { PatientCard } from "./components/patients/PatientCard";
import { AddPatientDialog, EditPatientDialog } from "./components/patients/PatientDialogs";
import { ViewAnamnesisDialog } from "./components/patients/ViewAnamnesisDialog";
import { PATIENTS_QUERY_KEY, usePatientsData, useDeletePatient, useDeleteAllPatients, Patient } from "@/hooks/usePatientsData";
import { useQueryClient } from "@tanstack/react-query";

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

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null);
  const [isViewAnamnesisOpen, setIsViewAnamnesisOpen] = useState(false);  
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedAnamnesis, setSelectedAnamnesis] = useState<Anamnesis | null>(null);
  const [loadingAnamnesisPatientId, setLoadingAnamnesisPatientId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Use React Query hooks
  const { data: patients = [], isLoading, error } = usePatientsData();
  const deletePatientMutation = useDeletePatient();
  const deleteAllPatientsMutation = useDeleteAllPatients();
  const queryClient = useQueryClient();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredPatients = useMemo(() => 
    patients.filter((patient) => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        patient.name.toLowerCase().includes(searchTermLower) ||
        (patient.responsible?.toLowerCase().includes(searchTermLower) ?? false)
      );
    }), 
    [patients, searchTerm]
  );

  const handleDeleteAllPatients = () => {
    deleteAllPatientsMutation.mutate();
  };

  const handleDeletePatient = (patientId: string) => {
    deletePatientMutation.mutate(patientId);
  };

  const loadPatients = () => {
    queryClient.invalidateQueries({ queryKey: PATIENTS_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
  };

  const handleEditClick = (patient: Patient) => {
    setPatientToEdit(patient);
    setIsEditDialogOpen(true);
  };

  const handleViewAnamnesis = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsViewAnamnesisOpen(true);
  };

  const handleEditAnamnesis = async (patient: Patient) => {
    setLoadingAnamnesisPatientId(patient.id);
    try {
      const { data, error } = await supabase
        .from("anamnesis")
        .select("id")
        .eq("patient_id", patient.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Erro ao carregar anamnese para edição:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar a anamnese para edição.",
          variant: "destructive",
        });
        return;
      }

      if (!data) {
        toast({
          title: "Anamnese não encontrada",
          description: "Este paciente não possui anamnese registrada.",
          variant: "destructive",
        });
        return;
      }

      navigate(`/anamnesis?patient_id=${patient.id}&anamnesis_id=${data.id}&mode=edit`);
    } catch (error) {
      console.error("Erro ao carregar anamnese para edição:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoadingAnamnesisPatientId(null);
    }
  };

  const handleAnamnesisEdit = (anamnesis: Anamnesis) => {
    setIsViewAnamnesisOpen(false);
    navigate(`/anamnesis?patient_id=${anamnesis.patient_id}&anamnesis_id=${anamnesis.id}&mode=edit`);
  };

  return (
    <div className="min-h-screen relative w-full overflow-x-hidden">
      <CosmicBackground />

      {/* Ambient cosmic blobs */}
      <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto py-6 md:py-10 space-y-8 animate-fadeIn max-w-7xl px-4">
        {/* Elegant Hero Header */}
        <div className="relative overflow-hidden rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-amber-400/10 pointer-events-none" />
          <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6 p-6 md:p-10">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary font-semibold tracking-[0.2em] uppercase text-xs">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-lg bg-primary/15 text-primary">
                  <HeartPulse className="h-3.5 w-3.5" />
                </span>
                Gestão de Atendimento
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-none bg-gradient-to-br from-foreground via-foreground to-primary bg-clip-text text-transparent">
                Pacientes
              </h1>
              <p className="text-muted-foreground text-base md:text-lg max-w-xl leading-relaxed">
                Centralize o histórico, anamneses e informações vitais dos seus pacientes em um só lugar.
              </p>
            </div>

            <Button 
              onClick={() => setIsAddDialogOpen(true)} 
              size="lg"
              className="bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 hover:to-amber-500/90 text-primary-foreground shadow-xl hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-1 px-8 rounded-2xl font-semibold"
            >
              <UserRoundPlus className="h-5 w-5 mr-2" />
              Novo Paciente
            </Button>
          </div>
        </div>

        {/* Stats & Search Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <Input
              type="search"
              placeholder="Pesquisar por nome ou responsável..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-12 py-6 bg-card/70 backdrop-blur-sm border border-border/40 shadow-lg rounded-2xl text-lg focus-visible:ring-2 focus-visible:ring-primary/30 transition-all placeholder:text-muted-foreground/60"
            />
          </div>
          
          <div className="flex items-center justify-between lg:justify-end gap-4 p-4 bg-card/60 backdrop-blur-xl rounded-2xl border border-border/40 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-xl ring-1 ring-primary/20">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold leading-none">{patients.length}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mt-1">Total Ativos</div>
              </div>
            </div>
            <div className="h-10 w-px bg-border/50 hidden sm:block" />
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl ring-1 ring-emerald-500/20">
                <Sparkles className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <div className="text-2xl font-bold leading-none">{patients.filter(p => p.has_anamnesis).length}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mt-1">Anamneses</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <div className="relative">
                <div className="h-16 w-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-8 w-8 bg-primary/10 rounded-full animate-pulse" />
                </div>
              </div>
              <p className="text-muted-foreground font-medium animate-pulse">Sincronizando dados...</p>
            </div>
          ) : (
            <div className="animate-fadeIn">
              {filteredPatients.length > 0 ? (
                isMobile ? (
                  <div className="grid grid-cols-1 gap-4">
                    {filteredPatients.map((patient, index) => (
                      <div 
                        key={patient.id}
                        className="animate-slideUp"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <PatientCard
                          patient={patient}
                          onEdit={() => handleEditClick(patient)}
                          onDelete={() => handleDeletePatient(patient.id)}
                          onViewAnamnesis={() => handleViewAnamnesis(patient)}
                          onEditAnamnesis={() => handleEditAnamnesis(patient)}
                          isLoadingAnamnesis={loadingAnamnesisPatientId === patient.id}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-card rounded-3xl border border-border/50 shadow-xl overflow-hidden">
                    <PatientList
                      patients={filteredPatients}
                      onEdit={handleEditClick}
                      onDelete={(patient) => handleDeletePatient(patient.id)}
                      onViewAnamnesis={handleViewAnamnesis}
                      onEditAnamnesis={handleEditAnamnesis}
                      loadingAnamnesisPatientId={loadingAnamnesisPatientId}
                    />
                  </div>
                )
              ) : (
                <div className="text-center py-32 bg-card/30 border-2 border-dashed border-border rounded-3xl">
                  <div className="inline-flex p-6 bg-muted rounded-full mb-6">
                    <Users className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {searchTerm ? "Nenhum resultado encontrado" : "Sua lista está vazia"}
                  </h3>
                  <p className="text-muted-foreground text-lg max-w-sm mx-auto mb-8">
                    {searchTerm 
                      ? "Não encontramos pacientes com o termo pesquisado. Tente outro nome."
                      : "Adicione seu primeiro paciente para começar a gerenciar seus atendimentos."}
                  </p>
                  {!searchTerm && (
                    <Button 
                      onClick={() => setIsAddDialogOpen(true)}
                      variant="outline"
                      className="rounded-xl px-8"
                    >
                      Cadastrar Paciente
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Danger Zone Section */}
        {patients.length > 0 && (
          <div className="pt-12 pb-6 flex justify-center">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors rounded-xl px-6"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpar banco de pacientes
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-2xl font-bold text-destructive">Ação Irreversível</AlertDialogTitle>
                  <AlertDialogDescription className="text-base">
                    Você está prestes a excluir <strong>todos os {patients.length} pacientes</strong>. 
                    Esta ação removerá permanentemente todos os registros, históricos e anamneses vinculados.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2 sm:gap-0">
                  <AlertDialogCancel className="rounded-xl">Manter Registros</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAllPatients}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
                  >
                    Sim, excluir tudo
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        {/* Modals com Style Clean */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[500px] rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
            <div className="bg-primary/5 p-6 border-b border-primary/10">
              <DialogTitle className="text-2xl font-bold text-primary">Novo Paciente</DialogTitle>
              <DialogDescription className="mt-1">
                Insira os dados básicos para iniciar o acompanhamento.
              </DialogDescription>
            </div>
            <div className="p-6">
              <AddPatientDialog loadPatients={loadPatients} closeModal={() => setIsAddDialogOpen(false)}/>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px] rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
            <div className="bg-primary/5 p-6 border-b border-primary/10">
              <DialogTitle className="text-2xl font-bold text-primary">Editar Perfil</DialogTitle>
              <DialogDescription className="mt-1">
                Mantenha os dados do seu paciente sempre atualizados.
              </DialogDescription>
            </div>
            <div className="p-6">
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
          <DialogContent className="sm:max-w-[850px] max-h-[90vh] rounded-3xl border-none shadow-2xl p-0 overflow-hidden flex flex-col">
            <div className="bg-primary/5 p-6 border-b border-primary/10 flex-shrink-0">
              <DialogTitle className="text-2xl font-bold text-primary">Ficha de Anamnese</DialogTitle>
              <DialogDescription className="mt-1">
                Histórico clínico e informações coletadas.
              </DialogDescription>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar">
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