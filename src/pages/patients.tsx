import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, UserRoundPlus, Users, HeartPulse, ClipboardCheck, RefreshCw, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { PatientCareMenu } from "./components/patients/PatientCareMenu";
import { PatientList } from "./components/patients/PatientList";
import { PatientCard } from "./components/patients/PatientCard";
import { AddPatientDialog, EditPatientDialog } from "./components/patients/PatientDialogs";
import { ViewAnamnesisDialog } from "./components/patients/ViewAnamnesisDialog";
import { PATIENTS_QUERY_KEY, usePatientsData, useDeletePatient, type Patient } from "@/hooks/usePatientsData";
import { useQueryClient } from "@tanstack/react-query";

type Anamnesis = {
  id: string;
  patient_id: string;
  [key: string]: unknown;
};

const PAGE_SIZE = 20;
type StatusFilter = "all" | "none" | "draft" | "registered" | "finalized";
type SortBy = "recent" | "oldest" | "name";
const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortBy>("recent");
  const [page, setPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [addDirty, setAddDirty] = useState(false);
  const [editDirty, setEditDirty] = useState(false);
  const [addBusy, setAddBusy] = useState(false);
  const [editBusy, setEditBusy] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null);
  const [isViewAnamnesisOpen, setIsViewAnamnesisOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [loadingAnamnesisPatientId, setLoadingAnamnesisPatientId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const { data: patients = [], isLoading, error, authReady, userId, refetch, isFetching } = usePatientsData();
  const deletePatientMutation = useDeletePatient();
  const appliedDeepLink = useRef(false);
  const patientIdFromDashboard = searchParams.get("patient_id");

  useEffect(() => {
    if (!patientIdFromDashboard || appliedDeepLink.current) return;
    const target = patients.find(patient => patient.id === patientIdFromDashboard);
    if (target) {
      setSearchTerm(target.name);
      appliedDeepLink.current = true;
    }
  }, [patients, patientIdFromDashboard]);

  useEffect(() => { setPage(1); }, [searchTerm, statusFilter, sortBy]);

  const filteredPatients = useMemo(() => patients
    .filter(patient => {
      const term = normalize(searchTerm.trim());
      const matchesName = !term || normalize(patient.name).includes(term) || normalize(patient.responsible || "").includes(term);
      const status = patient.anamnesis_status || (patient.has_anamnesis ? "registered" : "none");
      return matchesName && (statusFilter === "all" || status === statusFilter);
    })
    .sort((a, b) => sortBy === "name"
      ? a.name.localeCompare(b.name, "pt-BR")
      : sortBy === "oldest"
      ? Date.parse(a.created_at) - Date.parse(b.created_at)
      : Date.parse(b.created_at) - Date.parse(a.created_at)), [patients, searchTerm, statusFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredPatients.length / PAGE_SIZE));
  const visiblePatients = filteredPatients.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const finalizedCount = patients.filter(p => p.anamnesis_status === "finalized").length;
  const draftCount = patients.filter(p => p.anamnesis_status === "draft").length;

  const reloadPatients = () => {
    void queryClient.invalidateQueries({ queryKey: PATIENTS_QUERY_KEY });
    void queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
  };

  const requestClose = (open: boolean, dirty: boolean, busy: boolean, setOpen: (value: boolean) => void, setDirty: (value: boolean) => void) => {
    if (!open && busy) {
      toast({ title: "Salvamento em andamento", description: "Aguarde o término do envio para fechar o formulário." });
      return;
    }
    if (!open && dirty && !window.confirm("Existem alterações não salvas. Deseja descartá-las?")) return;
    setOpen(open);
    if (!open) setDirty(false);
  };

  const editPatient = (patient: Patient) => {
    setPatientToEdit(patient);
    setEditDirty(false);
    setIsEditDialogOpen(true);
  };

  const editAnamnesis = async (patient: Patient) => {
    if (loadingAnamnesisPatientId) return;
    setLoadingAnamnesisPatientId(patient.id);
    try {
      const { data, error: loadError } = await supabase
        .from("anamnesis")
        .select("id")
        .eq("patient_id", patient.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (loadError) throw loadError;
      if (!data) {
        navigate("/anamnesis?patient_id=" + encodeURIComponent(patient.id));
        return;
      }
      navigate("/anamnesis?patient_id=" + encodeURIComponent(patient.id) + "&anamnesis_id=" + encodeURIComponent(data.id) + "&mode=edit");
    } catch {
      toast({ title: "Falha ao abrir anamnese", description: "Confira a conexão e tente novamente.", variant: "destructive" });
    } finally {
      setLoadingAnamnesisPatientId(null);
    }
  };

  const onAnamnesisEdit = (anamnesis: Anamnesis) => {
    setIsViewAnamnesisOpen(false);
    navigate("/anamnesis?patient_id=" + encodeURIComponent(anamnesis.patient_id) + "&anamnesis_id=" + encodeURIComponent(anamnesis.id) + "&mode=edit");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl space-y-5 px-3 py-5 sm:px-6 md:py-8">
        <header className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:p-6">
          <div className="space-y-1.5">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <HeartPulse className="h-4 w-4" aria-hidden="true" /> Gestão clínica
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Pacientes</h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Cadastre, consulte e continue o atendimento com segurança.
            </p>
          </div>
          <Button size="lg" className="min-h-11 gap-2" onClick={() => setIsAddDialogOpen(true)}>
            <UserRoundPlus className="h-5 w-5" aria-hidden="true" /> Novo paciente
          </Button>
        </header>

        <section aria-label="Indicadores de pacientes" className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
            <Users className="h-6 w-6 text-primary" aria-hidden="true" />
            <div><p className="text-2xl font-bold text-foreground">{isLoading || error ? "—" : patients.length}</p><p className="text-sm text-muted-foreground">Pacientes cadastrados</p></div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
            <ClipboardCheck className="h-6 w-6 text-primary" aria-hidden="true" />
            <div><p className="text-2xl font-bold text-foreground">{isLoading || error ? "—" : finalizedCount}</p><p className="text-sm text-muted-foreground">Anamneses finalizadas</p></div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
            <HeartPulse className="h-6 w-6 text-primary" aria-hidden="true" />
            <div><p className="text-2xl font-bold text-foreground">{isLoading || error ? "—" : draftCount}</p><p className="text-sm text-muted-foreground">Em preenchimento</p></div>
          </div>
        </section>

        <section className="rounded-xl border bg-card p-3 sm:p-4" aria-label="Busca e filtros de pacientes">
          <div className="grid gap-3 lg:grid-cols-[1fr_180px_160px_auto] lg:items-end">
            <div className="space-y-1.5">
              <label htmlFor="patient-search" className="text-sm font-medium">Pesquisar paciente ou responsável</label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-muted-foreground" aria-hidden="true" />
                <Input id="patient-search" type="search" value={searchTerm} onChange={event => setSearchTerm(event.target.value)}
                  placeholder="Digite um nome..." className="min-h-11 pl-10 text-base" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="patient-status" className="text-sm font-medium">Situação da anamnese</label>
              <select id="patient-status" value={statusFilter} onChange={event => setStatusFilter(event.target.value as StatusFilter)}
                className="min-h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option value="all">Todas</option>
                <option value="none">Não iniciada</option>
                <option value="draft">Em preenchimento</option>
                <option value="registered">Registrada (legado)</option>
                <option value="finalized">Finalizada</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="patient-order" className="text-sm font-medium">Ordenar</label>
              <select id="patient-order" value={sortBy} onChange={event => setSortBy(event.target.value as SortBy)}
                className="min-h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option value="recent">Mais recentes</option>
                <option value="oldest">Mais antigos</option>
                <option value="name">Nome (A–Z)</option>
              </select>
            </div>
            <Button variant="outline" className="min-h-11 gap-2" onClick={() => void refetch()} disabled={isFetching}>
              <RefreshCw className={"h-4 w-4 " + (isFetching ? "animate-spin" : "")} aria-hidden="true" /> Atualizar
            </Button>
          </div>
        </section>

        <section aria-label="Lista de pacientes" aria-live="polite">
          {!authReady || isLoading ? (
            <div className="rounded-2xl border bg-card p-12 text-center text-muted-foreground" role="status">Carregando pacientes...</div>
          ) : !userId ? (
            <div className="rounded-2xl border p-8 text-center text-foreground" role="alert">Sessão não identificada. Faça login novamente para consultar os pacientes.</div>
          ) : error ? (
            <div className="space-y-3 rounded-2xl border border-destructive/30 bg-card p-8 text-center" role="alert">
              <AlertTriangle className="mx-auto h-7 w-7 text-destructive" aria-hidden="true" />
              <h2 className="font-semibold">Não foi possível carregar os pacientes</h2>
              <p className="text-sm text-muted-foreground">Os indicadores não foram zerados porque a consulta falhou. Confira a conexão e tente novamente.</p>
              <Button variant="outline" className="min-h-11" onClick={() => void refetch()}>Tentar novamente</Button>
            </div>
          ) : visiblePatients.length > 0 ? (
            isMobile ? (
              <div className="grid gap-3">{visiblePatients.map(patient => (
                <PatientCard key={patient.id} patient={patient} onEdit={() => editPatient(patient)}
                  onDelete={() => deletePatientMutation.mutate(patient.id)}
                  onViewAnamnesis={() => { setSelectedPatient(patient); setIsViewAnamnesisOpen(true); }}
                  onEditAnamnesis={() => void editAnamnesis(patient)}
                  isLoadingAnamnesis={loadingAnamnesisPatientId === patient.id} />
              ))}</div>
            ) : (
              <div className="overflow-hidden rounded-2xl border bg-card">
                <PatientList patients={visiblePatients} onEdit={editPatient} onDelete={patient => deletePatientMutation.mutate(patient.id)}
                  onViewAnamnesis={patient => { setSelectedPatient(patient); setIsViewAnamnesisOpen(true); }}
                  onEditAnamnesis={editAnamnesis} loadingAnamnesisPatientId={loadingAnamnesisPatientId} />
              </div>
            )
          ) : (
            <div className="rounded-2xl border border-dashed bg-card p-10 text-center">
              <Users className="mx-auto mb-3 h-9 w-9 text-muted-foreground" aria-hidden="true" />
              <h2 className="text-lg font-semibold">{patients.length === 0 ? "Nenhum paciente cadastrado" : "Nenhum paciente encontrado"}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{patients.length === 0
                ? "Cadastre o primeiro paciente para iniciar o acompanhamento."
                : "Altere a pesquisa ou os filtros para encontrar outros registros."}</p>
              {patients.length === 0 && <Button className="mt-4 min-h-11" onClick={() => setIsAddDialogOpen(true)}>Cadastrar paciente</Button>}
            </div>
          )}
        </section>

        {!isLoading && !error && totalPages > 1 && (
          <nav aria-label="Páginas de pacientes" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-3">
            <p className="text-sm text-muted-foreground">{filteredPatients.length} resultados · Página {page} de {totalPages}</p>
            <div className="flex gap-2">
              <Button variant="outline" className="min-h-11" disabled={page <= 1} onClick={() => setPage(previous => Math.max(1, previous - 1))}>Anterior</Button>
              <Button variant="outline" className="min-h-11" disabled={page >= totalPages} onClick={() => setPage(previous => Math.min(totalPages, previous + 1))}>Próxima</Button>
            </div>
          </nav>
        )}

        <Dialog open={isAddDialogOpen} onOpenChange={open => requestClose(open, addDirty, addBusy, setIsAddDialogOpen, setAddDirty)}>
          <DialogContent className="max-h-[90dvh] w-[calc(100vw-1rem)] overflow-y-auto rounded-xl p-4 sm:max-w-2xl sm:p-6">
            <DialogTitle className="text-xl text-primary">Novo paciente</DialogTitle>
            <DialogDescription>Preencha os dados básicos. Campos de responsável e contato podem ficar em branco quando não se aplicarem.</DialogDescription>
            <AddPatientDialog loadPatients={reloadPatients} onDirtyChange={setAddDirty} onBusyChange={setAddBusy}
              closeModal={() => { setAddDirty(false); setIsAddDialogOpen(false); }} />
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={open => requestClose(open, editDirty, editBusy, setIsEditDialogOpen, setEditDirty)}>
          <DialogContent className="max-h-[90dvh] w-[calc(100vw-1rem)] overflow-y-auto rounded-xl p-4 sm:max-w-xl sm:p-6">
            <DialogTitle className="text-xl text-primary">Editar cadastro</DialogTitle>
            <DialogDescription>Revise os dados e confirme o salvamento.</DialogDescription>
            {patientToEdit && <EditPatientDialog key={patientToEdit.id} patient={patientToEdit} loadPatients={reloadPatients}
              onDirtyChange={setEditDirty} onBusyChange={setEditBusy}
              closeModal={() => { setEditDirty(false); setIsEditDialogOpen(false); }} />}
          </DialogContent>
        </Dialog>

        <Dialog open={isViewAnamnesisOpen} onOpenChange={setIsViewAnamnesisOpen}>
          <DialogContent className="flex max-h-[90dvh] w-[calc(100vw-1rem)] flex-col overflow-hidden rounded-xl p-4 sm:max-w-4xl sm:p-6">
            <DialogTitle className="text-xl text-primary">Ficha de anamnese</DialogTitle>
            <DialogDescription>Informações registradas no acompanhamento.</DialogDescription>
            <div className="min-h-0 space-y-3 overflow-y-auto">
              {selectedPatient && <>
                <PatientCareMenu patient={selectedPatient} />
                <ViewAnamnesisDialog patient={selectedPatient} closeModal={() => setIsViewAnamnesisOpen(false)}
                  onEdit={onAnamnesisEdit} />
              </>}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
