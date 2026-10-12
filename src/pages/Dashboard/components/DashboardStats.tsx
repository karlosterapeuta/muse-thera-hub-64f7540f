import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { FileText, UserCheck, ClipboardList, Target, ArrowUpRight } from "lucide-react";

interface DashboardStatsProps {
  totalPatients: number;
  totalReports: number;
  totalAnamnesis: number;
  totalInterventions: number;
  isLoading: boolean;
}

export function DashboardStats({ totalPatients, totalReports, totalAnamnesis, totalInterventions, isLoading }: DashboardStatsProps) {
  const navigate = useNavigate();
  const stats = [
    { title: "Pacientes", value: totalPatients, subtitle: "Cadastrados", icon: UserCheck, path: "/patients" },
    { title: "Anamneses", value: totalAnamnesis, subtitle: "Registradas", icon: ClipboardList, path: "/anamnesis" },
    { title: "Intervenções", value: totalInterventions, subtitle: "Criadas", icon: Target, path: "/intervention" },
    { title: "Relatórios", value: totalReports, subtitle: "Gerados", icon: FileText, path: "/processes/musicoterapia" }
  ];
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {stats.map(stat => (
        <Card key={stat.path} className="overflow-hidden border-teal-700/15 bg-card shadow-sm transition-shadow hover:shadow-md">
          <button type="button" onClick={() => navigate(stat.path)}
            className="flex h-full w-full flex-col items-start gap-3 p-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-500 sm:p-5"
            aria-label={`Abrir ${stat.title}`}>
            <div className="flex w-full items-center justify-between">
              <span className="rounded-xl bg-teal-50 p-2 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300"><stat.icon className="h-5 w-5" aria-hidden="true" /></span>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-snug text-foreground">{stat.title}</p>
              <p className="text-xs leading-relaxed text-muted-foreground">{stat.subtitle}</p>
            </div>
            <span className="text-3xl font-bold tabular-nums tracking-tight text-teal-800 dark:text-teal-200" aria-live="polite">{isLoading ? "—" : stat.value}</span>
          </button>
        </Card>
      ))}
    </div>
  );
}
