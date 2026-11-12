import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAnamnesisData, useDeleteAnamnesis } from "@/hooks/useAnamnesisData";
import type { AnamnesisItem, AnamnesisReviewStatus } from "@/hooks/useAnamnesisData";
import { Eye, Edit, Plus, Search, FileText, ArrowLeft, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface AnamnesesListProps {
  onCreateNew: () => void;
  onEdit: (anamnesisId: string, patientId: string) => void;
  onView: (anamnesis: AnamnesisItem) => void;
}

const PAGE_SIZE = 12;
const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
const statusLabel: Record<AnamnesisReviewStatus, string> = {
  draft: "Rascunho",
  finalized: "Finalizada",
  registered: "Registro legado",
};
const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Data indisponível" : date.toLocaleDateString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
};

export function AnamnesisList({ onCreateNew, onEdit, onView }: AnamnesesListProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | AnamnesisReviewStatus>("all");
  const [sort, setSort] = useState<"recent" | "name">("recent");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<AnamnesisItem | null>(null);
  const [confirmation, setConfirmation] = useState("");
  const { data: anamneses = [], isLoading, error, authReady, userId, refetch } = useAnamnesisData();
  const deleteAnamnesis = useDeleteAnamnesis();

  useEffect(() => { setPage(1); }, [searchTerm, filter, sort]);
  const filtered = useMemo(() => {
    const q = normalize(searchTerm);
    return anamneses.filter(item =>
      (filter === "all" || item.review_status === filter) &&
      (!q || normalize(item.patient_name ?? "").includes(q) ||
        normalize(item.main_clinical_demand ?? "").includes(q))
    ).sort((a, b) => sort === "name"
      ? (a.patient_name ?? "").localeCompare(b.patient_name ?? "", "pt-BR")
      : Date.parse(b.updated_at) - Date.parse(a.updated_at));
  }, [anamneses, searchTerm, filter, sort]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((Math.min(page, pages) - 1) * PAGE_SIZE, Math.min(page, pages) * PAGE_SIZE);
  const finalized = anamneses.filter(item => item.review_status === "finalized").length;
  const drafts = anamneses.filter(item => item.review_status === "draft").length;

  const requestDelete = (item: AnamnesisItem) => {
    setDeleteTarget(item);
    setConfirmation("");
  };
  const confirmDelete = async () => {
    if (!deleteTarget || confirmation !== "EXCLUIR") return;
    try {
      await deleteAnamnesis.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
      setConfirmation("");
    } catch {
      // Mutation displays error, and the dialog stays open for inspection.
    }
  };

  if (isLoading) return <div className="flex min-h-64 items-center justify-center" role="status"><span className="text-muted-foreground">Carregando anamneses com segurança...</span></div>;
  if (authReady && !userId) return (
    <Card><CardContent className="p-8 text-center"><p className="text-foreground font-semibold">Faça login para visualizar suas anamneses.</p><Button className="mt-3" onClick={() => navigate("/login")}>Ir para o login</Button></CardContent></Card>
  );
  if (error) return (
    <Card><CardContent className="p-8 text-center">
      <h2 className="text-lg font-semibold text-destructive">Não foi possível carregar as anamneses</h2>
      <p className="text-sm text-muted-foreground mt-2">Seus registros não foram excluídos. Confira a conexão e tente novamente.</p>
      <Button className="mt-4" onClick={() => void refetch()}>Tentar novamente</Button>
    </CardContent></Card>
  );

  return (
    <div className="space-y-5">
      <Button variant="ghost" onClick={() => navigate("/processes")} className="min-h-11 gap-2">
        <ArrowLeft size={17} /> Voltar
      </Button>
      <header className="flex flex-col gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-2xl font-bold text-foreground">Anamneses</h1>
          <p className="text-sm text-muted-foreground">Histórico e acompanhamento musicoterapêutico dos pacientes cadastrados.</p></div>
        <Button className="min-h-11 gap-2" onClick={onCreateNew}><Plus size={17} /> Nova anamnese</Button>
      </header>
      <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="Indicadores de anamneses">
        {[
          ["Total", anamneses.length],
          ["Rascunhos", drafts],
          ["Finalizadas", finalized],
        ].map(([label, count]) => (
          <Card key={label} className="border-primary/15"><CardContent className="p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-muted-foreground">{label}</p>
            <p className="text-xl sm:text-2xl font-bold text-foreground tabular-nums">{count}</p>
          </CardContent></Card>
        ))}
      </div>
      <div className="grid gap-3 rounded-xl border border-border p-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
        <label className="relative">
          <span className="block pb-1 text-sm font-semibold text-foreground">Pesquisar</span>
          <Search size={17} className="pointer-events-none absolute bottom-3 left-3 text-muted-foreground" />
          <Input className="min-h-11 pl-10" placeholder="Nome ou demanda clínica" value={searchTerm}
            onChange={event => setSearchTerm(event.target.value)} />
        </label>
        <label className="text-sm font-semibold text-foreground">Situação
          <select aria-label="Filtrar por situação" className="mt-1 block min-h-11 w-full min-w-[140px] rounded-md border border-input bg-background px-3 text-base text-foreground" value={filter} onChange={event => setFilter(event.target.value as typeof filter)}>
            <option value="all">Todas</option><option value="draft">Rascunhos</option>
            <option value="finalized">Finalizadas</option><option value="registered">Registros legados</option>
          </select>
        </label>
        <label className="text-sm font-semibold text-foreground">Ordenar
          <select aria-label="Ordenação" className="mt-1 block min-h-11 w-full rounded-md border border-input bg-background px-3 text-base text-foreground" value={sort} onChange={event => setSort(event.target.value as typeof sort)}>
            <option value="recent">Atualização recente</option><option value="name">Nome do paciente</option>
          </select>
        </label>
      </div>
      {filtered.length === 0 ? (
        <Card><CardContent className="p-8 text-center">
          <FileText size={36} className="mx-auto text-muted-foreground" />
          <h2 className="mt-3 text-lg font-semibold text-foreground">{anamneses.length ? "Nenhuma anamnese encontrada nesta busca" : "Nenhuma anamnese registrada"}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{anamneses.length ? "Ajuste o termo ou os filtros." : "Comece criando uma anamnese para um paciente cadastrado."}</p>
          {!anamneses.length && <Button className="mt-4" onClick={onCreateNew}>Criar anamnese</Button>}
        </CardContent></Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map(item => <Card key={item.id} className="min-w-0 border-primary/15">
            <CardHeader className="pb-2"><div className="flex items-start justify-between gap-2">
              <CardTitle className="break-words text-base">{item.patient_name || "Paciente cadastrado"}</CardTitle>
              <Badge variant={item.review_status === "finalized" ? "default" : "secondary"}>{statusLabel[item.review_status]}</Badge>
            </div></CardHeader>
            <CardContent className="space-y-3">
              {item.filled_by_guardian && <p className="text-xs text-primary font-medium">Informações preenchidas pelo responsável</p>}
              <p className="line-clamp-2 text-sm text-muted-foreground">{item.main_clinical_demand || "Demanda clínica ainda não registrada"}</p>
              <p className="text-xs text-muted-foreground">Atualizada: {formatDate(item.updated_at)}</p>
              <div className="flex flex-wrap items-center gap-2">
                <Button className="min-h-11 gap-1" variant="outline" size="sm" onClick={() => onView(item)}><Eye size={16} /> Ver</Button>
                <Button className="min-h-11 gap-1" variant="outline" size="sm" onClick={() => onEdit(item.id, item.patient_id)}><Edit size={16} /> Editar</Button>
                <DropdownMenu><DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="ml-auto min-h-11 min-w-11" aria-label={`Mais ações para ${item.patient_name || "paciente"}`}><MoreHorizontal size={20}/></Button>
                </DropdownMenuTrigger><DropdownMenuContent align="end">
                  <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={() => requestDelete(item)}>Excluir registro...</DropdownMenuItem>
                </DropdownMenuContent></DropdownMenu>
              </div>
            </CardContent>
          </Card>)}
        </div>
      )}
      {filtered.length > PAGE_SIZE && <nav className="flex items-center justify-between gap-3" aria-label="Paginação das anamneses">
        <Button variant="outline" disabled={page <= 1} onClick={() => setPage(v => Math.max(1, v - 1))}>Anterior</Button>
        <p className="text-sm text-muted-foreground">Página {Math.min(page, pages)} de {pages} · {filtered.length} registros</p>
        <Button variant="outline" disabled={page >= pages} onClick={() => setPage(v => Math.min(pages, v + 1))}>Próxima</Button>
      </nav>}
      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={open => { if (!open && !deleteAnamnesis.isPending) { setDeleteTarget(null); setConfirmation(""); } }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Exclusão permanente de anamnese</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação poderá remover um registro clínico e seus dados vinculados. Confirme que verificou a política de retenção de documentos e que tem autorização para excluir a anamnese de {deleteTarget?.patient_name || "este paciente"}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <label htmlFor="confirm-delete-anamnesis" className="text-sm font-semibold text-foreground">Digite EXCLUIR para confirmar
            <Input id="confirm-delete-anamnesis" className="mt-1 min-h-11" autoComplete="off" value={confirmation}
              onChange={event => setConfirmation(event.target.value)} />
          </label>
          <AlertDialogFooter><AlertDialogCancel disabled={deleteAnamnesis.isPending}>Cancelar</AlertDialogCancel>
            <Button variant="destructive" disabled={confirmation !== "EXCLUIR" || deleteAnamnesis.isPending} onClick={() => void confirmDelete()}>
              {deleteAnamnesis.isPending ? "Excluindo..." : "Excluir permanentemente"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
