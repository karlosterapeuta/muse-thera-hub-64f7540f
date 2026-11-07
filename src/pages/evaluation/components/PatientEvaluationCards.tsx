import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
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
import { Link } from "react-router-dom";
import { getEvaluationTypeMeta } from "@/utils/evaluationTypes";
import { 
  User, 
  ChevronRight, 
  FileBarChart,
  Calendar,
  TrendingUp,
  Trash2
} from "lucide-react";

export interface PatientWithEvaluations {
  patientId: string;
  patientName: string;
  patientAge?: number | null;
  totalEvaluations: number;
  evaluationTypes: string[];
  lastEvaluationDate: string;
  averageScore: number | null;
}

interface PatientEvaluationCardsProps {
  patientsWithEvaluations: PatientWithEvaluations[];
  onDeletePatient?: (patientId: string) => void;
  isLoading: boolean;
}

const getInitials = (name: string) => {
  return (name.trim() || "P")
    .split(/\s+/)
    .slice(0, 2)
    .map(n => n[0])
    .join("")
    .toUpperCase();
};

export function PatientEvaluationCards({
  patientsWithEvaluations,
  onDeletePatient,
  isLoading,
}: PatientEvaluationCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-12 w-12 rounded-full mb-4" />
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-4 w-24 mb-4" />
            <Skeleton className="h-8 w-full" />
          </Card>
        ))}
      </div>
    );
  }

  if (patientsWithEvaluations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
          <FileBarChart className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Nenhuma avaliação salva
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Realize avaliações na aba "Escala MuseTera" e salve para 
          acompanhar a evolução dos pacientes aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {patientsWithEvaluations.map((patient) => {
        return (
          <Card
            key={patient.patientId}
            className="relative flex flex-col border-border bg-card p-4 shadow-sm transition-shadow duration-200 hover:shadow-md sm:p-5"
          >
            {/* Header com Avatar */}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                {getInitials(patient.patientName)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground break-words">
                  {patient.patientName}
                </h3>
                {patient.patientAge && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {patient.patientAge} anos
                  </p>
                )}
              </div>
            </div>

            {/* Estatísticas */}
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                <FileBarChart className="h-3 w-3 mr-1" />
                {patient.totalEvaluations} {patient.totalEvaluations === 1 ? "avaliação" : "avaliações"}
              </Badge>
            </div>

            {/* Tipos de Avaliação */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {patient.evaluationTypes.slice(0, 4).map((type) => (
                <Badge 
                  key={type} 
                  variant="outline"
                  className={`text-xs ${getEvaluationTypeMeta(type).badgeClass}`}
                >
                  {getEvaluationTypeMeta(type).shortLabel}
                </Badge>
              ))}
              {patient.evaluationTypes.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{patient.evaluationTypes.length - 4}
                </Badge>
              )}
            </div>

            {/* Média descritiva, disponível apenas quando há pontuação registrada. */}
            <div className="mb-4" title="Média descritiva das avaliações com indicadores pontuados; não representa evolução clínica isoladamente.">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-foreground/80">
                  Média registrada
                </span>
                {patient.averageScore !== null && (
                  <span className="text-sm font-bold tabular-nums text-foreground">
                    {patient.averageScore}%
                  </span>
                )}
              </div>
              {patient.averageScore === null ? (
                <p className="text-sm text-muted-foreground">Sem pontuação registrada</p>
              ) : (
                <div role="progressbar" aria-label={`Média registrada de ${patient.patientName}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={patient.averageScore} className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${patient.averageScore}%` }} />
                </div>
              )}
            </div>

            {/* Última Avaliação */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                Última: {format(new Date(patient.lastEvaluationDate), "dd/MM/yyyy", { locale: ptBR })}
              </span>
            </div>

            {/* Botão Ver Evolução */}
            <Button asChild className="mt-auto min-h-11 w-full bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary">
              <Link to={`/evaluation/paciente/${patient.patientId}`}>
                <TrendingUp className="h-4 w-4 mr-2" aria-hidden="true" />
                Ver evolução
                <ChevronRight className="h-4 w-4 ml-auto" aria-hidden="true" />
              </Link>
            </Button>

            {/* A exclusão em massa fica recolhida, longe da ação principal. */}
            {onDeletePatient && (
              <details className="mt-3 group">
                <summary className="min-h-11 flex cursor-pointer items-center justify-center rounded-md text-sm font-medium text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  Mais opções
                </summary>
                <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="min-h-11 w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir avaliações
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir todas as avaliações?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação irá excluir permanentemente todas as{" "}
                      {patient.totalEvaluations}{" "}
                      {patient.totalEvaluations === 1 ? "avaliação" : "avaliações"} de{" "}
                      <strong>{patient.patientName}</strong>. Isso permite refazer uma
                      nova avaliação do zero. Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => onDeletePatient(patient.patientId)}
                    >
                      Excluir tudo
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              </details>
            )}
          </Card>
        );
      })}
    </div>
  );
}
