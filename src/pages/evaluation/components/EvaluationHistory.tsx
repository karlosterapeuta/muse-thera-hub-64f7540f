import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
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
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Trash2, FileText, Loader2, History, CheckCircle2, Download, Pencil, User } from "lucide-react";
import { SavedEvaluation } from "@/hooks/useEvaluationStorage";
import { EVALUATION_TYPES, getEvaluationTypeMeta } from "@/utils/evaluationTypes";
import { getEvolutionStageKey, getRecordedEvaluationScore } from "@/utils/evolutionPresentation";

interface EvaluationHistoryProps {
  evaluations: SavedEvaluation[];
  isLoading: boolean;
  selectedForComparison: string[];
  onToggleComparison: (id: string) => void;
  onLoadEvaluation: (evaluation: SavedEvaluation) => void;
  onDeleteEvaluation: (id: string) => void;
  onDownloadEvaluation?: (evaluation: SavedEvaluation) => void;
  onEditEvaluation?: (evaluation: SavedEvaluation) => void;
  maxComparisons?: number;
}


export function EvaluationHistory({
  evaluations,
  isLoading,
  selectedForComparison,
  onToggleComparison,
  onLoadEvaluation,
  onDeleteEvaluation,
  onDownloadEvaluation,
  onEditEvaluation,
  maxComparisons = 4,
}: EvaluationHistoryProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (evaluation: SavedEvaluation) => {
    if (!onDownloadEvaluation) return;
    setDownloadingId(evaluation.id);
    try {
      await onDownloadEvaluation(evaluation);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await onDeleteEvaluation(id);
    setDeletingId(null);
  };

  if (isLoading) {
    return (
      <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-11 w-11 animate-spin text-primary" />
        </div>
      </Card>
    );
  }

  if (evaluations.length === 0) {
    return (
      <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="flex flex-col items-center justify-center h-48 text-center">
          <History className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Nenhuma avaliação salva
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
            Realize e salve avaliações para visualizar o histórico e comparar a evolução do paciente.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <section aria-label="Histórico de avaliações" className="min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <History className="h-5 w-5 text-primary" aria-hidden="true" />
          Avaliações Salvas ({evaluations.length})
        </h3>
        {selectedForComparison.length > 0 && (
          <Badge variant="secondary" className="bg-secondary text-secondary-foreground" aria-live="polite">
            {selectedForComparison.length} selecionada(s)
          </Badge>
        )}
      </div>

      <div className="min-w-0">
        <div className="space-y-5">
          {EVALUATION_TYPES.map((typeMeta) => {
            const group = evaluations.filter(
              (e) => getEvolutionStageKey(e) === typeMeta.key
            );
            if (group.length === 0) return null;

            return (
              <div key={typeMeta.key} className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ backgroundColor: typeMeta.color }}
                  />
                  <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100">
                    {typeMeta.label}
                  </h4>
                  <Badge variant="outline" className={`text-xs ${typeMeta.badgeClass}`}>
                    {group.length}
                  </Badge>
                  <span className="text-sm text-muted-foreground hidden sm:inline">
                    {typeMeta.description}
                  </span>
                </div>

                {group.map((evaluation) => {
                    const score = getRecordedEvaluationScore(evaluation);
                  const isSelected = selectedForComparison.includes(evaluation.id);
                  const canSelect = isSelected || selectedForComparison.length < maxComparisons;
                    const meta = getEvaluationTypeMeta(getEvolutionStageKey(evaluation));

            return (
              <div
                key={evaluation.id}
                className={`p-3 sm:p-4 rounded-xl border transition-[border-color,background-color] duration-200 ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/60"
                }`}
                style={{ borderLeftWidth: 5, borderLeftColor: meta.color }}
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <label className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-md hover:bg-muted focus-within:ring-2 focus-within:ring-primary">
                    <Checkbox
                      aria-label={`Comparar ${meta.label} de ${format(new Date(evaluation.date), "dd/MM/yyyy")}`}
                      checked={isSelected}
                      onCheckedChange={() => canSelect && onToggleComparison(evaluation.id)}
                      disabled={!canSelect}
                    />
                  </label>
                  <div className="flex-1 min-w-0">
                    {evaluation.patient_name && (
                      <div className="flex items-center gap-1.5 mb-1">
                        <User className="h-3.5 w-3.5 text-purple-600" />
                        <span className="font-medium text-purple-700 dark:text-purple-300 text-sm">
                          {evaluation.patient_name}
                        </span>
                        {evaluation.patient_age && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            ({evaluation.patient_age} anos)
                          </span>
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-gray-800 dark:text-gray-200">
                        {format(new Date(evaluation.date), "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                      <Badge variant="outline" className={`text-xs ${meta.badgeClass}`}>
                        {meta.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                       <Badge className="bg-secondary text-secondary-foreground tabular-nums">
                         {score === null ? "Sem pontuação registrada" : `Pontuação: ${score}%`}
                      </Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {evaluation.content?.overallScore?.evaluatedParameters || 0} parâmetros avaliados
                      </span>
                    </div>
                     <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                       {onDownloadEvaluation && (
                         <Button
                           variant="default"
                           aria-label="Baixar avaliação individual (PDF)"
                           onClick={() => handleDownload(evaluation)}
                           disabled={downloadingId !== null}
                           className="min-h-11 h-auto whitespace-normal text-sm bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary"
                         >
                           {downloadingId === evaluation.id ? (
                             <Loader2 className="h-4 w-4 animate-spin mr-1" aria-hidden="true" />
                           ) : (
                             <Download className="h-4 w-4 mr-1" aria-hidden="true" />
                           )}
                           Baixar PDF individual
                         </Button>
                       )}
                      <Button
                        variant="outline"
                        onClick={() => onLoadEvaluation(evaluation)}
                         className="min-h-11 h-auto whitespace-normal text-sm border-border text-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary"
                      >
                         <FileText className="h-4 w-4 mr-1" aria-hidden="true" />
                         Continuar avaliação
                      </Button>
                      {onEditEvaluation && (
                        <Button
                          variant="outline"
                          aria-label="Editar Avaliação"
                          onClick={() => onEditEvaluation(evaluation)}
                           className="min-h-11 h-auto whitespace-normal text-sm border-border text-foreground hover:bg-muted"
                        >
                          <Pencil className="h-3 w-3 mr-1" />
                          Editar
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                             aria-label={`Excluir avaliação de ${format(new Date(evaluation.date), "dd/MM/yyyy")}`}
                             className="min-h-11 h-11 w-11 border-destructive/30 text-destructive hover:bg-destructive/10"
                          >
                            {deletingId === evaluation.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir avaliação?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita. A avaliação de{" "}
                              {format(new Date(evaluation.date), "dd/MM/yyyy")} será
                              permanentemente excluída.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(evaluation.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  {isSelected && (
                     <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" aria-hidden="true" />
                  )}
                </div>
              </div>
            );
                })}
              </div>
            );
          })}
        </div>
      </div>


      {evaluations.length >= 2 && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
          Selecione até {maxComparisons} avaliações para comparar a evolução
        </p>
      )}
    </section>
  );
}
