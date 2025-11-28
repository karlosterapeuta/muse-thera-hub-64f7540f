import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  User, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Activity,
  Target,
  CalendarClock
} from "lucide-react";
import { SavedEvaluation } from "@/hooks/useEvaluationStorage";
import { calculateEvolutionMetrics } from "../utils/suggestionEngine";

interface Patient {
  id: string;
  name: string;
  birth_date: string | null;
  age: number | null;
}

interface PatientEvolutionDashboardProps {
  patients: Patient[];
  selectedPatientId: string | null;
  onSelectPatient: (patientId: string) => void;
  evaluations: SavedEvaluation[];
  isLoading: boolean;
}

export function PatientEvolutionDashboard({
  patients,
  selectedPatientId,
  onSelectPatient,
  evaluations,
  isLoading,
}: PatientEvolutionDashboardProps) {
  // Filtrar avaliações do paciente selecionado
  const patientEvaluations = useMemo(() => {
    if (!selectedPatientId) return [];
    return evaluations.filter(e => e.patient_id === selectedPatientId);
  }, [evaluations, selectedPatientId]);

  // Calcular métricas
  const metrics = useMemo(() => {
    return calculateEvolutionMetrics(patientEvaluations);
  }, [patientEvaluations]);

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  const getTrendIcon = (progress: number) => {
    if (progress > 5) return <TrendingUp className="h-5 w-5 text-emerald-600" />;
    if (progress < -5) return <TrendingDown className="h-5 w-5 text-red-600" />;
    return <Minus className="h-5 w-5 text-gray-500" />;
  };

  const getTrendColor = (progress: number) => {
    if (progress > 5) return "text-emerald-600 dark:text-emerald-400";
    if (progress < -5) return "text-red-600 dark:text-red-400";
    return "text-gray-600 dark:text-gray-400";
  };

  const getProgressBadgeColor = (progress: number) => {
    if (progress > 10) return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200";
    if (progress > 0) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    if (progress === 0) return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/50 dark:via-purple-950/50 dark:to-pink-950/50 border-0 shadow-xl">
      {/* Header com Seletor de Paciente */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Evolução do Paciente
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Acompanhamento individual de progresso
            </p>
          </div>
        </div>

        <Select value={selectedPatientId || ""} onValueChange={onSelectPatient}>
          <SelectTrigger className="w-full sm:w-[280px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <SelectValue placeholder="Selecione um paciente" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800">
            {patients.map((patient) => (
              <SelectItem key={patient.id} value={patient.id}>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-purple-600" />
                  <span>{patient.name}</span>
                  {patient.age && (
                    <span className="text-xs text-gray-500">({patient.age} anos)</span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Paciente Selecionado Info */}
      {selectedPatient && (
        <div className="mb-6 p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <User className="h-5 w-5 text-purple-600 dark:text-purple-300" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">
                {selectedPatient.name}
              </h3>
              {selectedPatient.age && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedPatient.age} anos
                </p>
              )}
            </div>
          </div>

          {/* Métricas do Paciente */}
          {patientEvaluations.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Total de Avaliações */}
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
                    Avaliações
                  </span>
                </div>
                <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                  {metrics.totalEvaluations}
                </p>
              </div>

              {/* Progresso Global */}
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  {getTrendIcon(metrics.globalProgress)}
                  <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                    Progresso
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <p className={`text-2xl font-bold ${getTrendColor(metrics.globalProgress)}`}>
                    {metrics.globalProgress > 0 ? "+" : ""}{metrics.globalProgress}%
                  </p>
                </div>
              </div>

              {/* Primeira Avaliação */}
              <div className="p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                    Primeira
                  </span>
                </div>
                <p className="text-sm font-bold text-blue-900 dark:text-blue-100">
                  {metrics.firstDate 
                    ? format(metrics.firstDate, "dd/MM/yyyy", { locale: ptBR })
                    : "-"
                  }
                </p>
              </div>

              {/* Próxima Sugerida */}
              <div className="p-3 bg-amber-50 dark:bg-amber-950/50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <CalendarClock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
                    Próxima
                  </span>
                </div>
                <p className="text-sm font-bold text-amber-900 dark:text-amber-100">
                  {metrics.nextSuggestedDate 
                    ? format(metrics.nextSuggestedDate, "dd/MM/yyyy", { locale: ptBR })
                    : "-"
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 dark:text-gray-400">
                Nenhuma avaliação registrada para este paciente.
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Realize a primeira avaliação na aba "Avaliação".
              </p>
            </div>
          )}
        </div>
      )}

      {/* Estado vazio - Nenhum paciente selecionado */}
      {!selectedPatient && (
        <div className="text-center py-8">
          <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Selecione um Paciente
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Escolha um paciente no menu acima para visualizar seu histórico de evolução, 
            análise de áreas e sugestões terapêuticas personalizadas.
          </p>
        </div>
      )}
    </Card>
  );
}
