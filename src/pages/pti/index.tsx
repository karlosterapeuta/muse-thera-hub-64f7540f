import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Plus, Search, FileDown, Trash2, Copy, Stethoscope, ClipboardList,
  Activity, Target, CheckCircle2, TrendingUp, Loader2, Pencil, History, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { toast } from "sonner";
import { usePtiPatients, usePtiPlans, usePtiVersions, useDeletePtiPlan, useDuplicatePtiPlan } from "@/hooks/usePtiPlans";
import { comparePtiVersions } from "@/utils/ptiVersionComparison";
import { useProfessionalData } from "@/hooks/useProfessionalData";
import { generatePtiNativePdf } from "@/utils/ptiNativePdf";
import { confirmPtiExport } from "@/utils/ptiExportValidation";
import { imageUrlToBase64 } from "@/utils/imageToBase64";
import { PtiPlan, computePtiProgress } from "@/types/pti";

export default function PtiList() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const requested = params.get("patient_id");
  const activeTab = params.get("tab") === "historico" ? "historico" : "planos";
  const { data: allPlans, isLoading, isError: plansError } = usePtiPlans();
  const { data: versions, isLoading: versionsLoading, isError: versionsError } = usePtiVersions(activeTab === "historico");
  const { data: patients } = usePtiPatients();
  const patient = patients?.find(p => p.id === requested);
  const plans = useMemo(() => requested ? allPlans?.filter(p => p.patient_id === requested) : allPlans, [allPlans, requested]);
  const newPlanPath = requested ? `/pti/novo?patient_id=${encodeURIComponent(requested)}` : "/pti/novo";
  const { data: professional } = useProfessionalData();
  const deleteMutation = useDeletePtiPlan();
  const duplicateMutation = useDuplicatePtiPlan();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [showChart, setShowChart] = useState(false);

  const stats = useMemo(() => {
    const list = plans || [];
    const objetivos = list.reduce((acc, p) => acc + (p.content.objetivosEspecificos?.length || 0), 0);
    const metas = list.reduce((acc, p) => acc + (p.content.metas?.length || 0), 0);
    return {
      total: list.length,
      ativos: list.filter((p) => p.status === "ativo").length,
      preenchidos70: list.filter((p) => computePtiProgress(p.content) >= 70).length,
      objetivos,
      metas,
    };
  }, [plans]);

  const chartData = useMemo(
    () => (plans || []).slice(0, 8).map((p) => ({
      name: (p.content.identificacao.nome || "—").split(" ")[0],
      progresso: computePtiProgress(p.content),
    })),
    [plans],
  );

  const filtered = useMemo(() => {
    const list = plans || [];
    const term = search.toLowerCase();
    return list.filter((p) => {
      const matchSearch = !term ||
        p.content.identificacao.nome?.toLowerCase().includes(term) ||
        p.content.identificacao.diagnostico?.toLowerCase().includes(term);
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [plans, search, statusFilter]);

  const handleDownload = async (plan: PtiPlan) => {
    if (!confirmPtiExport(plan.content)) return;
    setDownloadingId(plan.id);
    try {
      const signature = (professional?.digital_signature_url ? await imageUrlToBase64(professional.digital_signature_url) : "") || "";
      const stamp = (professional?.digital_stamp_url ? await imageUrlToBase64(professional.digital_stamp_url) : "") || "";
      await generatePtiNativePdf({ content: plan.content, professional, signature, stamp,
        filename: `PTI-${plan.content.identificacao.nome || "plano"}.pdf` });
    } catch {
      toast.error("Erro ao gerar PDF");
    } finally {
      setDownloadingId(null);
    }
  };

  const statCards = [
    { label: "Total de planos", value: stats.total, icon: ClipboardList, color: "text-primary" },
    { label: "Planos ativos", value: stats.ativos, icon: Activity, color: "text-primary" },
    { label: "≥70% preenchidos", value: stats.preenchidos70, icon: ClipboardList, color: "text-primary" },
    { label: "Objetivos", value: stats.objetivos, icon: Target, color: "text-primary" },
    { label: "Metas", value: stats.metas, icon: CheckCircle2, color: "text-primary" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 sm:px-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col gap-4 rounded-2xl border border-primary/20 bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">Planejamento clínico · Musicoterapia</p>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2 sm:text-3xl">
              <Stethoscope aria-hidden="true" className="h-6 w-6 shrink-0 text-primary" />
              Plano Terapêutico Individual
            </h1>
            <p className="mt-2 text-base leading-relaxed text-muted-foreground">{requested ? patient?.name || "Planos do paciente selecionado" : "Organize seus planos, metas e reavaliações em um só lugar."}</p>
          </div>
          {patient && <Button variant="outline" asChild className="min-h-11">
            <Link to={`/intervention?patient_id=${encodeURIComponent(patient.id)}`}>Abrir intervenção</Link>
          </Button>}
          <Button disabled={!!requested && !patient} onClick={() => navigate(newPlanPath)} className="min-h-12 shrink-0 gap-2 rounded-xl px-5 font-semibold">
            <Plus className="h-4 w-4" /> Novo Plano
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {statCards.map((s) => (
            <Card key={s.label} className="rounded-xl border-border shadow-sm">
              <CardContent className="p-4 sm:p-5">
                <s.icon aria-hidden="true" className={`h-5 w-5 ${s.color} mb-3`} />
                <div className="text-2xl font-bold tabular-nums text-foreground">{s.value}</div>
                <div className="mt-1 text-sm font-medium leading-snug text-foreground/80">{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* The primary task is finding a PTI. Keep the optional chart collapsed, especially on mobile. */}
        {chartData.length > 0 && (
          <Card className="border-border/60">
            <CardContent className="p-4 space-y-3">
              <Button variant="ghost" className="w-full min-h-11 justify-between gap-2 text-left" aria-expanded={showChart} onClick={() => setShowChart(value => !value)}>
                <span className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" aria-hidden="true" /> Resumo de preenchimento dos planos</span>
                <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${showChart ? "rotate-180" : ""}`} aria-hidden="true" />
              </Button>
              {showChart && <>
                <p className="text-sm text-muted-foreground">Os percentuais indicam preenchimento de documentos, não evolução clínica.</p>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" fontSize={11} stroke="hsl(var(--muted-foreground))" />
                    <YAxis domain={[0, 100]} fontSize={11} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip />
                    <Bar dataKey="progresso" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </>}
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={(tab) => {
          const next = new URLSearchParams(params);
          if (tab === "historico") next.set("tab", "historico"); else next.delete("tab");
          setParams(next);
        }}>
          <TabsList className="min-h-12 rounded-xl border border-border bg-muted/60 p-1">
            <TabsTrigger value="planos">Planos Salvos</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="planos" className="space-y-4 mt-4">
            {/* Filters */}
            <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-end">
              <div className="relative flex-1 space-y-2">
                <label htmlFor="pti-plan-search" className="block text-sm font-semibold text-foreground">Buscar plano</label>
                <div className="relative">
                  <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="pti-plan-search" className="h-12 rounded-xl pl-10 text-base" placeholder="Paciente ou diagnóstico" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="pti-status-filter" className="block text-sm font-semibold text-foreground">Filtrar por status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="pti-status-filter" className="h-12 w-full rounded-xl text-base sm:w-48"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="rascunho">Rascunho</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="concluído">Concluído</SelectItem>
                </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : plansError ? (
              <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">Não foi possível carregar os planos. Verifique a conexão e tente atualizar a página.</p>
            ) : filtered.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="p-10 text-center text-muted-foreground">
                  <ClipboardList className="h-10 w-10 mx-auto mb-3 opacity-40" />
                  <p>Nenhum plano encontrado.</p>
                  <Button variant="outline" className="mt-4 gap-2" disabled={!!requested && !patient} onClick={() => navigate(newPlanPath)}>
                    <Plus className="h-4 w-4" /> Criar primeiro plano
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((plan) => (
                  <div key={plan.id}>
                    <Card className="h-full rounded-xl border-border shadow-sm transition-shadow hover:shadow-md">
                      <CardContent className="p-4 flex flex-col h-full">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="min-w-0 break-words text-base font-bold leading-snug">{plan.content.identificacao.nome || "Sem nome"}</h3>
                          <Badge variant={plan.status === "ativo" ? "default" : "secondary"} className="shrink-0 capitalize text-xs">{plan.status}</Badge>
                        </div>
                        {plan.content.identificacao.diagnostico && (
                          <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">{plan.content.identificacao.diagnostico}</p>
                        )}
                        <div className="flex items-center gap-2 mb-3">
                          <Progress value={computePtiProgress(plan.content)} className="h-1.5 flex-1" />
                          <span className="text-sm font-medium tabular-nums text-foreground" title="Preenchimento documental, não evolução terapêutica">{computePtiProgress(plan.content)}%</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mb-3">
                          Atualizado {new Date(plan.updated_at).toLocaleDateString("pt-BR")}
                        </p>
                        <div className="mt-auto flex flex-wrap gap-2">
                          <Button size="sm" variant="outline" className="min-h-11 flex-1 gap-2 rounded-lg text-sm" onClick={() => navigate(`/pti/${plan.id}`)}>
                            <Pencil className="h-3.5 w-3.5" /> Editar
                          </Button>
                          <Button size="sm" variant="ghost" aria-label={`Reavaliar plano de ${plan.content.identificacao.nome || "paciente"}`} title="Reavaliação" className="h-11 w-11" onClick={() => navigate(`/pti/${plan.id}/reavaliacao`)}>
                            <TrendingUp className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="sm" variant="ghost" aria-label={`Baixar PDF do plano de ${plan.content.identificacao.nome || "paciente"}`} className="h-11 w-11" onClick={() => handleDownload(plan)} disabled={downloadingId === plan.id}>
                            {downloadingId === plan.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileDown className="h-3.5 w-3.5" />}
                          </Button>
                          <Button size="sm" variant="ghost" aria-label={`Duplicar plano de ${plan.content.identificacao.nome || "paciente"}`} className="h-11 w-11" disabled={duplicateMutation.isPending} onClick={async () => {
                            try {
                              const newId = await duplicateMutation.mutateAsync(plan);
                              toast.success("Plano duplicado");
                              navigate(`/pti/${newId}`);
                            } catch { toast.error("Não foi possível duplicar este plano. Tente novamente."); }
                          }}>
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="sm" variant="ghost" aria-label={`Excluir plano de ${plan.content.identificacao.nome || "paciente"}`} className="h-11 w-11" disabled={deleteMutation.isPending} onClick={async () => {
                            if (!confirm("Excluir este plano e seu histórico de versões? Esta ação não pode ser desfeita.")) return;
                            try { await deleteMutation.mutateAsync(plan.id); toast.success("Plano excluído"); }
                            catch { toast.error("Não foi possível excluir o plano. Nenhum sucesso foi confirmado."); }
                          }}>
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="historico" className="mt-4">
            <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
              <History className="h-4 w-4 text-primary" aria-hidden="true" /> Versões registradas ao clicar em Salvar ou exportar PDF. O salvamento automático não cria versões extras.
            </div>
            {versionsLoading || isLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" aria-label="Carregando versões" /></div>
            ) : versionsError || plansError ? (
              <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">Não foi possível consultar o histórico. Verifique a conexão e recarregue a página.</p>
            ) : (plans || []).length === 0 ? (
              <p className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">Nenhum PTI encontrado para este filtro.</p>
            ) : (
              <div className="space-y-4">
                {(plans || []).map((plan) => {
                  const planVersions = (versions || []).filter(v => v.pti_id === plan.id);
                  return <Card key={plan.id} className="border-border/60">
                    <CardContent className="space-y-3 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="break-words text-base font-semibold text-foreground">{plan.content.identificacao.nome || "Sem nome"}</h3>
                          <p className="text-sm text-muted-foreground">{planVersions.length} versão(ões) registrada(s)</p>
                        </div>
                        <Button variant="outline" asChild className="min-h-11"><Link to={`/pti/${plan.id}`}>Abrir PTI</Link></Button>
                      </div>
                      {planVersions.length === 0 ? (
                        <p className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">Este plano ainda não possui versões explícitas. Clique em Salvar no editor para registrar a primeira.</p>
                      ) : <div className="space-y-2">
                        {planVersions.map((version, index) => {
                          const previous = planVersions[index + 1];
                          const change = comparePtiVersions(version.content, previous?.content);
                          return <details key={version.id} className="rounded-lg border border-border bg-card">
                            <summary className="min-h-11 cursor-pointer p-3 text-sm font-semibold text-foreground focus-visible:ring-2 focus-visible:ring-primary">
                              Versão {planVersions.length - index} · {new Date(version.created_at).toLocaleString("pt-BR")}
                            </summary>
                            <div className="space-y-3 border-t border-border p-3 text-sm">
                              <p className="text-muted-foreground">{change.currentObjectives.length} objetivos · {change.currentGoals.length} metas registrados nesta versão.</p>
                              <p className="font-medium text-foreground">{previous ? "Alterações em relação à versão anterior:" : "Primeira versão registrada:"}</p>
                              <ul className="list-disc space-y-1 pl-5 text-foreground">
                                <li>{change.addedObjectives.length} objetivos incluídos; {change.removedObjectives.length} removidos</li>
                                <li>{change.editedObjectives.length} objetivos editados</li>
                                <li>{change.addedGoals.length} metas incluídas; {change.removedGoals.length} removidas</li>
                                <li>{change.editedGoals.length} metas editadas</li>
                              </ul>
                              <div className="grid gap-3 sm:grid-cols-2">
                                <div><p className="mb-1 font-semibold">Objetivos registrados</p><ul className="list-disc space-y-1 break-words pl-5 text-muted-foreground">{change.currentObjectives.length ? change.currentObjectives.map(value=><li key={value}>{value}</li>) : <li>Nenhum objetivo descrito</li>}</ul></div>
                                <div><p className="mb-1 font-semibold">Metas registradas</p><ul className="list-disc space-y-1 break-words pl-5 text-muted-foreground">{change.currentGoals.length ? change.currentGoals.map(value=><li key={value}>{value}</li>) : <li>Nenhuma meta descrita</li>}</ul></div>
                              </div>
                            </div>
                          </details>;
                        })}
                      </div>}
                    </CardContent>
                  </Card>;
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
