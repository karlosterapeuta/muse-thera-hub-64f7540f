import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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

const evaluationTypeLabels: Record<string, string> = {
  avaliacao_inicial: "Avaliação Inicial",
  avaliacao_progresso: "Avaliação de Progresso",
  avaliacao_periodica: "Avaliação Periódica",
  avaliacao_final: "Avaliação Final",
  musetera_evaluation: "Escala MuseTera",
  "1": "Avaliação Inicial",
  "2": "Avaliação de Progresso",
  "3": "Avaliação Periódica",
  "4": "Avaliação Final",
};

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
    await onDownloadEvaluation(evaluation);
    setDownloadingId(null);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await onDeleteEvaluation(id);
    setDeletingId(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200";
    if (score >= 60) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    if (score >= 40) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    if (score >= 20) return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  };

  if (isLoading) {
    return (
      <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
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
    <Card className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <History className="h-5 w-5 text-purple-600" />
          Avaliações Salvas ({evaluations.length})
        </h3>
        {selectedForComparison.length > 0 && (
          <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            {selectedForComparison.length} selecionada(s)
          </Badge>
        )}
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-3">
          {evaluations.map((evaluation) => {
            const score = evaluation.content?.overallScore?.percentage || 0;
            const isSelected = selectedForComparison.includes(evaluation.id);
            const canSelect = isSelected || selectedForComparison.length < maxComparisons;

            return (
              <div
                key={evaluation.id}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  isSelected
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-950/30"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300 dark:hover:border-purple-700"
                }`}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => canSelect && onToggleComparison(evaluation.id)}
                    disabled={!canSelect}
                    className="mt-1"
                  />
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
                      <Badge variant="outline" className="text-xs">
                        {evaluationTypeLabels[evaluation.type] || evaluationTypeLabels[evaluation.content?.evaluationType] || "Avaliação"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getScoreColor(score)}>
                        Score: {score}%
                      </Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {evaluation.content?.overallScore?.evaluatedParameters || 0} parâmetros avaliados
                      </span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onLoadEvaluation(evaluation)}
                        className="h-8 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:hover:bg-blue-900 dark:text-blue-300 dark:border-blue-800"
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Carregar
                      </Button>
                      {onEditEvaluation && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEditEvaluation(evaluation)}
                          className="h-8 text-xs bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:hover:bg-amber-900 dark:text-amber-300 dark:border-amber-800"
                        >
                          <Pencil className="h-3 w-3 mr-1" />
                          Editar
                        </Button>
                      )}
                      {onDownloadEvaluation && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(evaluation)}
                          disabled={downloadingId === evaluation.id}
                          className="h-8 text-xs bg-green-50 hover:bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:hover:bg-green-900 dark:text-green-300 dark:border-green-800"
                        >
                          {downloadingId === evaluation.id ? (
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                          ) : (
                            <Download className="h-3 w-3 mr-1" />
                          )}
                          PDF
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs bg-red-50 hover:bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:hover:bg-red-900 dark:text-red-300 dark:border-red-800"
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
                    <CheckCircle2 className="h-5 w-5 text-purple-600 flex-shrink-0" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {evaluations.length >= 2 && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
          Selecione até {maxComparisons} avaliações para comparar a evolução
        </p>
      )}
    </Card>
  );
}
