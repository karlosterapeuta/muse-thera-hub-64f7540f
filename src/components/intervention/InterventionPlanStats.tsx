import { Card, CardContent } from "@/components/ui/card";
import { FileText, CheckCircle, FileEdit, Activity } from "lucide-react";
import { InterventionPlanStats as Stats } from "@/hooks/useInterventionPlans";

interface InterventionPlanStatsProps {
  stats: Stats;
}

export function InterventionPlanStats({ stats }: InterventionPlanStatsProps) {
  const statCards = [
    {
      title: "Total de Planos",
      value: stats.total,
      icon: FileText,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      title: "Planos Ativos",
      value: stats.active,
      icon: Activity,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/20",
    },
    {
      title: "Planos Concluídos",
      value: stats.completed,
      icon: CheckCircle,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
    },
    {
      title: "Total de Atividades",
      value: stats.totalActivities,
      icon: FileEdit,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
