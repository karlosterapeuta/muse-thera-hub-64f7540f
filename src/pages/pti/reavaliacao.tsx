import { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, Sparkles, Loader2, Save, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, Legend, Tooltip,
} from "recharts";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { usePtiPlan } from "@/hooks/usePtiPlans";
import { usePtiReavaliacoes, useSavePtiReavaliacao } from "@/hooks/usePtiReavaliacoes";
import { PTI_CRITERIOS_EVOLUCAO } from "@/types/pti";

export default function PtiReavaliacao() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: plan, isLoading } = usePtiPlan(id);
  const { data: reavaliacoes } = usePtiReavaliacoes(id);
  const saveMutation = useSavePtiReavaliacao();

  const [scores, setScores] = useState<Record<string, number>>({});
  const [observacoes, setObservacoes] = useState("");
  const [report, setReport] = useState("");
  const [generating, setGenerating] = useState(false);

  // baseline = last reavaliação snapshot, or original plan scores
  const baseline = useMemo<Record<string, number>>(() => {
    const last = reavaliacoes?.[reavaliacoes.length - 1];
    if (last?.snapshot?.criterios) return last.snapshot.criterios;
    return plan?.content.criteriosEvolucao || {};
  }, [reavaliacoes, plan]);

  useEffect(() => {
    if (plan) {
      const init = PTI_CRITERIOS_EVOLUCAO.reduce<Record<string, number>>((acc, k) => {
        acc[k] = baseline[k] || plan.content.criteriosEvolucao?.[k] || 0;
        return acc;
      }, {});
      setScores(init);
    }
  }, [plan, baseline]);

  const chartData = useMemo(
    () =>
      PTI_CRITERIOS_EVOLUCAO.map((k) => ({
        area: k,
        anterior: baseline[k] || 0,
        atual: scores[k] || 0,
      })),
    [baseline, scores],
  );

  const handleGenerate = async () => {
    if (!plan) return;
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("pti-reavaliacao", {
        body: {
          paciente: {
            nome: plan.content.identificacao.nome,
            diagnostico: plan.content.identificacao.diagnostico,
          },
          anterior: baseline,
          atual: scores,
          objetivos: plan.content.objetivosEspecificos?.map((o) => o.descricao) || [],
          observacoes,
        },
      });
      if (error) throw error;
      if (data?.error) {
        toast.error(data.error);
        return;
      }
      setReport(data.report || "");
      toast.success("Relatório de reavaliação gerado");
    } catch {
      toast.error("Erro ao gerar relatório");
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!id) return;
    try {
      await saveMutation.mutateAsync({
        pti_id: id,
        snapshot: { criterios: scores, observacoes },
        report: { text: report },
      });
      toast.success("Reavaliação salva");
      navigate(`/pti/${id}`);
    } catch {
      toast.error("Erro ao salvar reavaliação");
    }
  };

  if (isLoading || !plan) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/pti/${id}`)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-extrabold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" /> Reavaliação
            </h1>
            <p className="text-sm text-muted-foreground">{plan.content.identificacao.nome || "Paciente"}</p>
          </div>
          {reavaliacoes && reavaliacoes.length > 0 && (
            <Badge variant="secondary" className="ml-auto">{reavaliacoes.length}ª revisão anterior</Badge>
          )}
        </div>

        {/* Sliders */}
        <Card className="border-border/60">
          <CardContent className="p-4 space-y-4">
            <h3 className="text-sm font-semibold">Critérios de evolução atuais (1 a 5)</h3>
            {PTI_CRITERIOS_EVOLUCAO.map((k) => (
              <div key={k} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span>{k}</span>
                  <span className="text-muted-foreground">
                    {baseline[k] || 0} → <span className="font-semibold text-foreground">{scores[k] || 0}</span>
                  </span>
                </div>
                <Slider
                  min={0} max={5} step={1}
                  value={[scores[k] || 0]}
                  onValueChange={(v) => setScores((s) => ({ ...s, [k]: v[0] }))}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Comparison chart */}
        <Card className="border-border/60">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold mb-3">Comparativo de evolução</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={chartData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="area" fontSize={11} stroke="hsl(var(--muted-foreground))" />
                <PolarRadiusAxis domain={[0, 5]} fontSize={10} stroke="hsl(var(--muted-foreground))" />
                <Radar name="Anterior" dataKey="anterior" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted-foreground))" fillOpacity={0.2} />
                <Radar name="Atual" dataKey="atual" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.4} />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Observations + AI */}
        <Card className="border-border/60">
          <CardContent className="p-4 space-y-3">
            <h3 className="text-sm font-semibold">Observações clínicas</h3>
            <Textarea
              rows={4}
              placeholder="Descreva observações da evolução do paciente neste período..."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
            />
            <Button variant="outline" className="gap-2" onClick={handleGenerate} disabled={generating}>
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Gerar relatório de reavaliação (IA)
            </Button>
          </CardContent>
        </Card>

        {report && (
          <Card className="border-border/60">
            <CardContent className="p-4 space-y-2">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" /> Relatório
              </h3>
              <Textarea rows={14} value={report} onChange={(e) => setReport(e.target.value)} className="text-sm" />
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => navigate(`/pti/${id}`)}>Cancelar</Button>
          <Button className="gap-2" onClick={handleSave} disabled={saveMutation.isPending}>
            {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Salvar reavaliação
          </Button>
        </div>

        {/* History */}
        {reavaliacoes && reavaliacoes.length > 0 && (
          <Card className="border-border/60">
            <CardContent className="p-4 space-y-2">
              <h3 className="text-sm font-semibold">Histórico de reavaliações</h3>
              {reavaliacoes.map((r, i) => (
                <div key={r.id} className="text-xs text-muted-foreground border-b border-border/40 py-1.5 last:border-0">
                  {i + 1}ª reavaliação • {new Date(r.created_at).toLocaleDateString("pt-BR")}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
