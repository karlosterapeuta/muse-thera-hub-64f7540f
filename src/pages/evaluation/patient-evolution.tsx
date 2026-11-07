import { normalizeEvaluation } from "./utils/normalizeEvaluation";
import { downloadSavedEvaluation } from "./utils/savedReport";
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, FileBarChart, User, FileDown, Loader2, CheckCircle2 } from "lucide-react";
import { SavedEvaluation } from "@/hooks/useEvaluationStorage";
import { EvaluationHistory } from "./components/EvaluationHistory";
import { EvolutionTimeline } from "./components/EvolutionTimeline";
import { EvaluationComparison } from "./components/EvaluationComparison";
import { AreasAnalysis } from "./components/AreasAnalysis";
import { EVALUATION_TYPES } from "@/utils/evaluationTypes";
import {
  EVOLUTION_STAGE_KEYS,
  getEvolutionStageKey,
  selectEvaluationsForEvolution,
} from "@/utils/evolutionPresentation";
import { generateSectionPdf } from "@/utils/sectionPdfGenerator";
import { savePDFToStorage } from "@/utils/pdfStorageUtils";
import { EvolutionReportPDF } from "@/components/EvolutionReportPDF";
import { useProfessionalData } from "@/hooks/useProfessionalData";
import { imageUrlToBase64 } from "@/utils/imageToBase64";
import museteraLogo from "@/assets/musetera-logo-transparent.png.asset.json";
import React from "react";

const MAX_COMPARISONS = 4;

export default function PatientEvolutionPage() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();

  const { data: professional } = useProfessionalData();

  const [evaluations, setEvaluations] = useState<SavedEvaluation[]>([]);
  const [patientName, setPatientName] = useState<string>("Paciente");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);

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
        })).map(normalizeEvaluation) as SavedEvaluation[];

        setEvaluations(mapped);
        setPatientName(mapped[0]?.patient_name || "Paciente");
        // As etapas salvas usam chaves no banco e números no formulário.
        // Resolve ambos, escolhendo o registro mais recente de cada etapa.
        setSelectedForComparison(
          selectEvaluationsForEvolution(mapped, MAX_COMPARISONS).map((e) => e.id)
        );
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

  const handleLoadEvaluation = (evaluation: SavedEvaluation) => {
    try {
      const content: any = evaluation.content || {};
      const draft = {
        selectedPatient: evaluation.patient_id || patientId || "",
        selectedEvaluation: content.evaluationType || evaluation.type || "1",
        evaluationDate: new Date(evaluation.date).toISOString(),
        selections: content.selections || {},
        observations: content.observations || {},
        activeTab: "evaluation",
        // Continua editando/avaliando o MESMO registro (retomar em outro momento)
        editingEvaluationId: evaluation.id,
      };
      sessionStorage.setItem("musetera-eval-draft", JSON.stringify(draft));
      toast.success("Avaliação carregada! Você pode continuar avaliando de onde parou.");
      navigate("/evaluation");
    } catch (err) {
      console.error("Erro ao carregar avaliação:", err);
      toast.error("Erro ao carregar avaliação");
    }
  };

  const hasEnoughForComparison = selectedForComparison.length >= 2;

  // Verifica quais dos 4 tipos obrigatórios já foram concluídos
  const completedTypes = EVOLUTION_STAGE_KEYS.filter((key) =>
    evaluations.some((e) => getEvolutionStageKey(e) === key)
  );
  const allFourCompleted = completedTypes.length === EVOLUTION_STAGE_KEYS.length;

  const handleExportReport = async () => {
    if (!allFourCompleted) {
      toast.info("Conclua as 4 avaliações (Inicial, Progresso, Periódica e Final) para gerar o relatório.");
      return;
    }
    setIsExporting(true);
    try {
      // Pega a avaliação mais recente de cada tipo obrigatório, em ordem cronológica
      const ordered = EVOLUTION_STAGE_KEYS.map((key) => {
        const ofType = evaluations
          .filter((e) => getEvolutionStageKey(e) === key)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return ofType[0];
      })
        .filter(Boolean)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) as SavedEvaluation[];

      // Converte assinatura, carimbo e logo para base64 (html2canvas não suporta imagens remotas)
      const [signatureBase64, stampBase64, logoBase64] = await Promise.all([
        professional?.digital_signature_url
          ? imageUrlToBase64(professional.digital_signature_url)
          : Promise.resolve(null),
        professional?.digital_stamp_url || professional?.stamp_photo_url
          ? imageUrlToBase64(
              (professional.digital_stamp_url || professional.stamp_photo_url) as string
            )
          : Promise.resolve(null),
        imageUrlToBase64(museteraLogo.url),
      ]);

      const reportCode = `MT-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

      const filename = `Relatorio_Evolucao_${patientName.replace(/\s+/g, "_")}_${
        new Date().toISOString().split("T")[0]
      }.pdf`;

      const blob = await generateSectionPdf(
        React.createElement(EvolutionReportPDF, {
          patientName,
          patientAge: ordered[0]?.patient_age,
          patientBirthDate: ordered[0]?.patient_birth_date,
          evaluations: ordered,
          professional: professional
            ? {
                name: professional.name,
                specialty: professional.specialty,
                register: professional.register || professional.license_number,
                association: professional.association,
                email: professional.email,
                phone: professional.phone,
              }
            : undefined,
          signatureBase64,
          stampBase64,
          logoBase64,
          reportCode,
        }),
        { filename, scale: 3 }
      );

      // Download local
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Cópia no sistema (não bloqueia o sucesso)
      try {
        await savePDFToStorage(blob, filename, "report");
      } catch (e) {
        console.warn("Falha ao salvar cópia do relatório no sistema:", e);
      }

      toast.success("Relatório de evolução gerado com sucesso!");

    } catch (err) {
      console.error("Erro ao gerar relatório de evolução:", err);
      toast.error("Erro ao gerar o relatório de evolução");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="container mx-auto px-3 py-5 sm:px-4 sm:py-6 max-w-6xl">
      <Button
        variant="ghost"
        onClick={() => navigate("/evaluation?tab=comparison")}
        className="mb-4 min-h-11 gap-2 focus-visible:ring-2 focus-visible:ring-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Button>

      <Card className="mb-6 border-border bg-card p-4 shadow-sm sm:p-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground break-words">
              {isLoading ? "Carregando..." : patientName}
            </h1>
            <p className="text-sm text-muted-foreground">
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
          <Card className="border-border bg-card p-4 shadow-sm sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
              <div>
                <h2 className="text-lg font-bold text-foreground mb-1 flex items-center gap-2">
                  Avaliações salvas
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Selecione 2 ou mais avaliações para comparar a evolução nos gráficos
                  abaixo.
                </p>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1 font-medium">
                  📄 O relatório em PDF é uma comparação completa das 4 avaliações (Inicial → Progresso → Periódica → Final).
                </p>
              </div>
              <div className="flex flex-col items-stretch sm:items-end gap-1 shrink-0">
                <Button
                  onClick={handleExportReport}
                  disabled={!allFourCompleted || isExporting}
                  className="min-h-11 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {isExporting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <FileDown className="h-4 w-4" />
                  )}
                  {isExporting ? "Gerando PDF…" : "Gerar PDF comparativo"}
                </Button>
                <span className="text-sm text-muted-foreground text-center sm:text-right">
                  {allFourCompleted
                    ? "Compara as 4 avaliações em um único relatório"
                    : "Conclua as 4 avaliações para liberar"}
                </span>
              </div>
            </div>

            {/* Progresso das 4 avaliações obrigatórias */}
            <div className="flex flex-wrap items-center gap-2 mb-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700">
              {EVOLUTION_STAGE_KEYS.map((key) => {
                const meta = EVALUATION_TYPES.find((t) => t.key === key)!;
                const done = completedTypes.includes(key);
                return (
                  <div
                    key={key}
                    className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${
                      done
                        ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                        : "bg-card text-foreground/75 border-border"
                    }`}
                  >
                    {done ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <span className="h-3.5 w-3.5 rounded-full border-2 border-current inline-block" />
                    )}
                    {meta.shortLabel}
                  </div>
                );
              })}
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                {allFourCompleted
                  ? "✅ Todas concluídas — relatório disponível"
                  : `${completedTypes.length}/4 concluídas`}
              </span>
            </div>

            <EvaluationHistory
              evaluations={evaluations}
              isLoading={false}
              selectedForComparison={selectedForComparison}
              onToggleComparison={handleToggleComparison}
              onDownloadEvaluation={(evaluation) => downloadSavedEvaluation(evaluation, professional)}
              onLoadEvaluation={handleLoadEvaluation}
              onDeleteEvaluation={handleDeleteEvaluation}
              maxComparisons={MAX_COMPARISONS}
            />
          </Card>

          {/* Comparação e Gráficos de Evolução */}
          <Card className="border-border bg-card p-4 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-foreground mb-1 flex items-center gap-2">
              Comparação das avaliações selecionadas
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Comparação automática entre a primeira e a última avaliação. Você
              pode ajustar as avaliações na lista acima.
            </p>
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

          {/* Gráfico de Linha Temporal */}
          <EvolutionTimeline evaluations={evaluations} patientName={patientName} />

          {/* Análise de Áreas */}
          <AreasAnalysis evaluations={evaluations} />
        </div>
      )}
    </div>
  );
}
