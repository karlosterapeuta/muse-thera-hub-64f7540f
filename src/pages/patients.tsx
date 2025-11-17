import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
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
  Sparkles
} from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";

import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { PatientList } from "./components/patients/PatientList";
import { PatientCard } from "./components/patients/PatientCard";
import { AddPatientDialog, EditPatientDialog } from "./components/patients/PatientDialogs";
import { ViewAnamnesisDialog } from "./components/patients/ViewAnamnesisDialog";
import { usePatientsData, useDeletePatient, useDeleteAllPatients, Patient } from "@/hooks/usePatientsData";
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
  const { t } = useTranslation('patients');
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null);
  const [isViewAnamnesisOpen, setIsViewAnamnesisOpen] = useState(false);  
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedAnamnesis, setSelectedAnamnesis] = useState<Anamnesis | null>(null);
  const isMobile = useIsMobile();
  
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
    queryClient.invalidateQueries({ queryKey: ["patients"] });
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
    setSelectedPatient(patient);
    try {
      const { data, error } = await supabase
        .from("anamnesis")
        .select("*")
        .eq("patient_id", patient.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data) {
        window.location.href = `/anamnesis?patient_id=${patient.id}&anamnesis_id=${data.id}&mode=edit`;
      }
    } catch (error) {
      console.error("Erro ao carregar anamnese para edição:", error);
    }
  };

  const handleAnamnesisEdit = (anamnesis: Anamnesis) => {
    if (selectedPatient) {
      window.location.href = `/anamnesis?patient_id=${selectedPatient.id}&anamnesis_id=${anamnesis.id}&mode=edit`;
    }
    setIsViewAnamnesisOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-4 md:py-8 space-y-8 animate-fadeIn">
      {/* Hero Section */}
      <div className="text-center space-y-6 mb-12 relative">
        {/* Language Selector */}
        <div className="absolute top-0 right-0 md:right-4">
          <LanguageSelector />
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 blur-3xl rounded-full"></div>
          <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary to-purple-600 rounded-full shadow-2xl">
            <Users className="h-10 w-10 text-white" />
          </div>
        </div>
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t('title')}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t('description')}
          </p>
        </div>
      </div>

        {/* Main Card */}
        <Card className="border-0 shadow-2xl bg-card/80 backdrop-blur-sm hover:shadow-3xl transition-all duration-500 overflow-hidden">
          <CardHeader className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border-b border-border">
            <div className="absolute inset-0 bg-gradient-to-r from-background/50 to-transparent"></div>
            <div className="relative flex flex-col md:flex-row items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-primary to-purple-600 rounded-2xl shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl md:text-3xl font-bold text-foreground">
                    {t('title')}
                  </CardTitle>
                  <CardDescription className="text-base md:text-lg text-muted-foreground">
                    {t('description')}
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
                {isMobile ? t('buttons.newPatient') : t('buttons.addPatient')}
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6 md:p-8">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 blur-xl rounded-2xl"></div>
                <div className="relative flex items-center bg-background/90 backdrop-blur-sm border-2 border-border rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/30">
                  <Search className="h-5 w-5 text-muted-foreground mr-3" />
                  <Input
                    type="search"
                    placeholder={t('search.placeholder')}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground text-base"
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
                  <h3 className="text-xl font-semibold text-foreground">{t('loading.title')}</h3>
                  <p className="text-muted-foreground">{t('loading.message')}</p>
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
                        <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto">
                          <Users className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold text-foreground">{t('empty.title')}</h3>
                          <p className="text-muted-foreground">{t('empty.description')}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border overflow-hidden shadow-lg">
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

          {/* Footer */}
          <CardFooter className="bg-gradient-to-r from-muted/30 to-muted/50 border-t border-border p-6">
            <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    disabled={patients.length === 0}
                    className="w-full md:w-auto bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {t('dialog.deleteAll.button')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="border-0 shadow-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-bold text-foreground">{t('dialog.deleteAll.title')}</AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground text-base">
                      {t('dialog.deleteAll.description')}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="hover:bg-gray-100">{t('dialog.deleteAll.cancel')}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAllPatients}
                      className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
                    >
                      {t('dialog.deleteAll.confirm')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              <div className="flex items-center space-x-3 text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-primary to-purple-600 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">
                    {t('counter.registered', { count: patients.length })}
                  </span>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>

        {/* Dialogs */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[425px] p-0 sm:p-6 border-0 shadow-2xl">
            <DialogHeader className="p-4 sm:p-0">
              <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                {t('dialog.add.title')}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {t('dialog.add.description')}
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
                {t('dialog.edit.title')}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {t('dialog.edit.description')}
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
                {t('dialog.viewAnamnesis.title')}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {t('dialog.viewAnamnesis.description')}
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