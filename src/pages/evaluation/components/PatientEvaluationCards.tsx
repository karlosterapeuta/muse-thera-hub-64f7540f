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
import { 
  User, 
  ChevronRight, 
  FileBarChart,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Trash2
} from "lucide-react";

export interface PatientWithEvaluations {
  patientId: string;
  patientName: string;
  patientAge?: number | null;
  totalEvaluations: number;
  evaluationTypes: string[];
  lastEvaluationDate: string;
  averageScore: number;
}

interface PatientEvaluationCardsProps {
  patientsWithEvaluations: PatientWithEvaluations[];
  selectedPatientId: string | null;
  onSelectPatient: (patientId: string) => void;
  onDeletePatient?: (patientId: string) => void;
  isLoading: boolean;
}

const EVALUATION_TYPE_COLORS: Record<string, string> = {
  "Inicial": "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  "Progresso": "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
  "Periódica": "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
  "Final": "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
  "Avaliação": "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 60) return "text-blue-600 dark:text-blue-400";
  if (score >= 40) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
};

const getProgressColor = (score: number) => {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-blue-500";
  if (score >= 40) return "bg-amber-500";
  return "bg-red-500";
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .slice(0, 2)
    .map(n => n[0])
    .join("")
    .toUpperCase();
};

export function PatientEvaluationCards({
  patientsWithEvaluations,
  selectedPatientId,
  onSelectPatient,
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
        const isSelected = selectedPatientId === patient.patientId;
        
        return (
          <Card
            key={patient.patientId}
            className={`relative p-5 transition-all duration-300 cursor-pointer hover:shadow-lg ${
              isSelected
                ? "ring-2 ring-purple-500 bg-purple-50/50 dark:bg-purple-950/30 shadow-lg scale-[1.02]"
                : "bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800"
            }`}
            onClick={() => onSelectPatient(patient.patientId)}
          >
            {/* Indicador de seleção */}
            {isSelected && (
              <div className="absolute top-3 right-3">
                <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            )}

            {/* Header com Avatar */}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                {getInitials(patient.patientName)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 dark:text-white truncate">
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
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
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
                  className={`text-xs ${EVALUATION_TYPE_COLORS[type] || EVALUATION_TYPE_COLORS["Avaliação"]}`}
                >
                  {type}
                </Badge>
              ))}
              {patient.evaluationTypes.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{patient.evaluationTypes.length - 4}
                </Badge>
              )}
            </div>

            {/* Score Médio */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Score Médio
                </span>
                <span className={`text-sm font-bold ${getScoreColor(patient.averageScore)}`}>
                  {patient.averageScore}%
                </span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${getProgressColor(patient.averageScore)}`}
                  style={{ width: `${patient.averageScore}%` }}
                />
              </div>
            </div>

            {/* Última Avaliação */}
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                Última: {format(new Date(patient.lastEvaluationDate), "dd/MM/yyyy", { locale: ptBR })}
              </span>
            </div>

            {/* Botão Ver Evolução */}
            <Button
              variant={isSelected ? "default" : "outline"}
              size="sm"
              className={`w-full ${
                isSelected 
                  ? "bg-purple-600 hover:bg-purple-700 text-white" 
                  : "hover:bg-purple-50 dark:hover:bg-purple-950/30"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onSelectPatient(patient.patientId);
              }}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              {isSelected ? "Selecionado" : "Ver Evolução"}
              <ChevronRight className="h-4 w-4 ml-auto" />
            </Button>
          </Card>
        );
      })}
    </div>
  );
}
