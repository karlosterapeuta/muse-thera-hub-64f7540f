import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, FileBarChart, User } from "lucide-react";
import { SavedEvaluation } from "@/hooks/useEvaluationStorage";
import { EvaluationHistory } from "./components/EvaluationHistory";
import { EvaluationComparison } from "./components/EvaluationComparison";
import { AreasAnalysis } from "./components/AreasAnalysis";

const MAX_COMPARISONS = 4;

export default function PatientEvolutionPage() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();

  const [evaluations, setEvaluations] = useState<SavedEvaluation[]>([]);
  const [patientName, setPatientName] = useState<string>("Paciente");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!patientId) return;
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("assessments")
          .select("*, patients(name, age, birth_date)")
          .eq("patient_id", patientId)
          .in("type", [
            "avaliacao_inicial",
            "avaliacao_progresso",
            "avaliacao_periodica",
            "avaliacao_final",
            "musetera_evaluation",
          ])
          .order("date", { ascending: false });

        if (error) throw error;
        if (!active) return;

        const mapped = (data || []).map((item: any) => ({
          ...item,
          patient_name: item.patients?.name,
          patient_age: item.patients?.age,
          patient_birth_date: item.patients?.birth_date,
        })) as SavedEvaluation[];

        setEvaluations(mapped);
        setPatientName(mapped[0]?.patient_name || "Paciente");
        // Selecionar automaticamente a avaliação inicial e a final para comparar
        const byDateAsc = [...mapped].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        const typedInitial = byDateAsc.find(
          (e) => (e.content?.evaluationType || e.type) === "avaliacao_inicial"
        );
        const typedFinal = [...byDateAsc]
          .reverse()
          .find((e) => (e.content?.evaluationType || e.type) === "avaliacao_final");
        const initial = typedInitial || byDateAsc[0];
        const final =
          typedFinal && typedFinal.id !== initial?.id
            ? typedFinal
            : byDateAsc[byDateAsc.length - 1];
        const autoSelected = [initial?.id, final?.id].filter(
          (id, idx, arr) => id && arr.indexOf(id) === idx
        ) as string[];
        setSelectedForComparison(autoSelected);
      } catch (err) {
        console.error("Erro ao carregar avaliações:", err);
        toast.error("Erro ao carregar avaliações do paciente");
      } finally {
        if (active) setIsLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [patientId]);

  const handleToggleComparison = (id: string) => {
    setSelectedForComparison((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_COMPARISONS) {
        toast.info(`Você pode comparar até ${MAX_COMPARISONS} avaliações`);
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleDeleteEvaluation = async (id: string) => {
    try {
      const { error } = await supabase.from("assessments").delete().eq("id", id);
      if (error) throw error;
      toast.success("Avaliação excluída com sucesso!");
      setEvaluations((prev) => prev.filter((e) => e.id !== id));
      setSelectedForComparison((prev) => prev.filter((x) => x !== id));
    } catch (err) {
      console.error("Erro ao excluir avaliação:", err);
      toast.error("Erro ao excluir avaliação");
    }
  };

  const hasEnoughForComparison = selectedForComparison.length >= 2;

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <Button
        variant="ghost"
        onClick={() => navigate("/evaluation?tab=comparison")}
        className="mb-4 gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Button>

      <Card className="p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/50 dark:via-purple-950/50 dark:to-pink-950/50 border-0 shadow-xl mb-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {isLoading ? "Carregando..." : patientName}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {evaluations.length}{" "}
              {evaluations.length === 1 ? "avaliação salva" : "avaliações salvas"}
            </p>
          </div>
        </div>
      </Card>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : evaluations.length === 0 ? (
        <div className="text-center py-16">
          <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <FileBarChart className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Nenhuma avaliação salva
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Realize avaliações na aba "Escala MuseTera" e salve para acompanhar a
            evolução deste paciente.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Histórico de Avaliações Salvas */}
          <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-1 flex items-center gap-2">
              📜 Avaliações Salvas
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Selecione 2 ou mais avaliações para comparar a evolução nos gráficos
              abaixo.
            </p>
            <EvaluationHistory
              evaluations={evaluations}
              isLoading={false}
              selectedForComparison={selectedForComparison}
              onToggleComparison={handleToggleComparison}
              onLoadEvaluation={() => {}}
              onDeleteEvaluation={handleDeleteEvaluation}
              maxComparisons={MAX_COMPARISONS}
            />
          </Card>

          {/* Comparação e Gráficos de Evolução */}
          <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                📊 Comparação e Evolução
              </h2>
              {canCompareInitialFinal && (
                <Button
                  onClick={handleCompareInitialFinal}
                  className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90"
                  size="sm"
                >
                  <FileBarChart className="h-4 w-4" />
                  Comparar Inicial → Final
                </Button>
              )}
            </div>
            {hasEnoughForComparison ? (
              <EvaluationComparison
                evaluations={evaluations}
                selectedIds={selectedForComparison}
              />
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                Selecione pelo menos 2 avaliações na lista acima para visualizar a
                comparação e os gráficos de evolução.
              </p>
            )}
          </Card>

          {/* Análise de Áreas */}
          <AreasAnalysis evaluations={evaluations} />
        </div>
      )}
    </div>
  );
}
