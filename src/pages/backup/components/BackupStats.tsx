import { Card, CardContent } from "@/components/ui/card";
import { Users, FileText, ClipboardList, DollarSign, Building2, Calendar, Stethoscope, Activity } from "lucide-react";
import { BackupStatistics } from "../hooks/useBackupData";
import { Skeleton } from "@/components/ui/skeleton";

interface BackupStatsProps {
  statistics: BackupStatistics | undefined;
  isLoading: boolean;
}

const statItems = [
  { key: "patients", label: "Pacientes", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
  { key: "anamnesis", label: "Anamneses", icon: FileText, color: "text-green-500", bg: "bg-green-500/10" },
  { key: "assessments", label: "Avaliações", icon: Stethoscope, color: "text-purple-500", bg: "bg-purple-500/10" },
  { key: "treatmentPlans", label: "Planos", icon: ClipboardList, color: "text-orange-500", bg: "bg-orange-500/10" },
  { key: "reports", label: "Relatórios", icon: Activity, color: "text-pink-500", bg: "bg-pink-500/10" },
  { key: "financialRecords", label: "Financeiro", icon: DollarSign, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { key: "clinics", label: "Clínicas", icon: Building2, color: "text-teal-500", bg: "bg-teal-500/10" },
  { key: "sessions", label: "Sessões", icon: Calendar, color: "text-indigo-500", bg: "bg-indigo-500/10" },
];

export function BackupStats({ statistics, isLoading }: BackupStatsProps) {
  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          📊 Estatísticas dos Dados
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {statItems.map((item) => {
            const Icon = item.icon;
            const value = statistics?.[item.key as keyof BackupStatistics] ?? 0;
            
            return (
              <div
                key={item.key}
                className={`flex items-center gap-3 p-3 rounded-lg ${item.bg} transition-all hover:scale-105`}
              >
                <Icon className={`h-5 w-5 ${item.color}`} />
                <div>
                  {isLoading ? (
                    <Skeleton className="h-6 w-8" />
                  ) : (
                    <span className="text-xl font-bold">{value}</span>
                  )}
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
