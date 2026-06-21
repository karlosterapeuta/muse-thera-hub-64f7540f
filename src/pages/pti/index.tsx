import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus, Search, FileDown, Trash2, Copy, Stethoscope, ClipboardList,
  Activity, Target, CheckCircle2, TrendingUp, Loader2, Pencil,
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
import { usePtiPlans, useDeletePtiPlan, useDuplicatePtiPlan } from "@/hooks/usePtiPlans";
import { useProfessionalData } from "@/hooks/useProfessionalData";
import { generateStaticPDF } from "@/utils/staticPDFGenerator";
import { imageUrlToBase64 } from "@/utils/imageToBase64";
import { PtiPDF } from "@/components/pti/PtiPDF";
import { PtiPlan } from "@/types/pti";

export default function PtiList() {
  const navigate = useNavigate();
  const { data: plans, isLoading } = usePtiPlans();
  const { data: professional } = useProfessionalData();
  const deleteMutation = useDeletePtiPlan();
  const duplicateMutation = useDuplicatePtiPlan();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const list = plans || [];
    const objetivos = list.reduce((acc, p) => acc + (p.content.objetivosEspecificos?.length || 0), 0);
    const metas = list.reduce((acc, p) => acc + (p.content.metas?.length || 0), 0);
    return {
      total: list.length,
      ativos: list.filter((p) => p.status === "ativo").length,
      reavaliacao: list.filter((p) => p.progress >= 70 && p.status !== "concluído").length,
      objetivos,
      metas,
    };
  }, [plans]);

  const chartData = useMemo(
    () => (plans || []).slice(0, 8).map((p) => ({
      name: (p.content.identificacao.nome || "—").split(" ")[0],
      progresso: p.progress,
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
    setDownloadingId(plan.id);
    try {
      const signature = (professional?.digital_signature_url ? await imageUrlToBase64(professional.digital_signature_url) : "") || "";
      const stamp = (professional?.digital_stamp_url ? await imageUrlToBase64(professional.digital_stamp_url) : "") || "";
      await generateStaticPDF(
        <PtiPDF content={plan.content} professional={professional} signature={signature} stamp={stamp} />,
        { filename: `PTI-${plan.content.identificacao.nome || "plano"}.pdf` },
      );
    } catch {
      toast.error("Erro ao gerar PDF");
    } finally {
      setDownloadingId(null);
    }
  };

  const statCards = [
    { label: "Total de planos", value: stats.total, icon: ClipboardList, color: "text-blue-500" },
    { label: "Planos ativos", value: stats.ativos, icon: Activity, color: "text-emerald-500" },
    { label: "Em reavaliação", value: stats.reavaliacao, icon: TrendingUp, color: "text-amber-500" },
    { label: "Objetivos", value: stats.objetivos, icon: Target, color: "text-violet-500" },
    { label: "Metas", value: stats.metas, icon: CheckCircle2, color: "text-rose-500" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold flex items-center gap-2">
              <Stethoscope className="h-6 w-6 text-primary" />
              Plano Terapêutico Individual
            </h1>
            <p className="text-sm text-muted-foreground">Planos individualizados de Musicoterapia Clínica</p>
          </div>
          <Button onClick={() => navigate("/pti/novo")} className="gap-2">
            <Plus className="h-4 w-4" /> Novo Plano
          </Button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {statCards.map((s) => (
            <Card key={s.label} className="border-border/60">
              <CardContent className="p-4">
                <s.icon className={`h-5 w-5 ${s.color} mb-2`} />
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart */}
        {chartData.length > 0 && (
          <Card className="border-border/60">
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" /> Evolução clínica (preenchimento)
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" fontSize={11} stroke="hsl(var(--muted-foreground))" />
                  <YAxis domain={[0, 100]} fontSize={11} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip />
                  <Bar dataKey="progresso" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="planos">
          <TabsList>
            <TabsTrigger value="planos">Planos Salvos</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="planos" className="space-y-4 mt-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9" placeholder="Buscar por paciente ou diagnóstico..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-44"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="rascunho">Rascunho</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="concluído">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : filtered.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="p-10 text-center text-muted-foreground">
                  <ClipboardList className="h-10 w-10 mx-auto mb-3 opacity-40" />
                  <p>Nenhum plano encontrado.</p>
                  <Button variant="outline" className="mt-4 gap-2" onClick={() => navigate("/pti/novo")}>
                    <Plus className="h-4 w-4" /> Criar primeiro plano
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((plan) => (
                  <motion.div key={plan.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="border-border/60 hover:shadow-lg transition-shadow h-full">
                      <CardContent className="p-4 flex flex-col h-full">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-sm leading-tight">{plan.content.identificacao.nome || "Sem nome"}</h3>
                          <Badge variant={plan.status === "ativo" ? "default" : "secondary"} className="capitalize text-[10px]">{plan.status}</Badge>
                        </div>
                        {plan.content.identificacao.diagnostico && (
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{plan.content.identificacao.diagnostico}</p>
                        )}
                        <div className="flex items-center gap-2 mb-3">
                          <Progress value={plan.progress} className="h-1.5 flex-1" />
                          <span className="text-xs text-muted-foreground">{plan.progress}%</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mb-3">
                          Atualizado {new Date(plan.updated_at).toLocaleDateString("pt-BR")}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-auto">
                          <Button size="sm" variant="outline" className="gap-1 flex-1" onClick={() => navigate(`/pti/${plan.id}`)}>
                            <Pencil className="h-3.5 w-3.5" /> Editar
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDownload(plan)} disabled={downloadingId === plan.id}>
                            {downloadingId === plan.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileDown className="h-3.5 w-3.5" />}
                          </Button>
                          <Button size="sm" variant="ghost" onClick={async () => {
                            const newId = await duplicateMutation.mutateAsync(plan);
                            toast.success("Plano duplicado");
                            navigate(`/pti/${newId}`);
                          }}>
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => {
                            if (confirm("Excluir este plano?")) { deleteMutation.mutate(plan.id); toast.success("Plano excluído"); }
                          }}>
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="historico" className="mt-4">
            <div className="space-y-2">
              {(plans || []).map((p) => (
                <Card key={p.id} className="border-border/60">
                  <CardContent className="p-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{p.content.identificacao.nome || "Sem nome"}</p>
                      <p className="text-xs text-muted-foreground">
                        Criado {new Date(p.created_at).toLocaleDateString("pt-BR")} • Atualizado {new Date(p.updated_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => navigate(`/pti/${p.id}`)}>Abrir</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
