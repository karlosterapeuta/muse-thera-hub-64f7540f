import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, Trash2, Calendar, Activity } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { InterventionPlan } from "@/hooks/useInterventionPlans";
import { ActivitiesPreview } from "./ActivitiesPreview";

interface InterventionPlanCardProps {
  plan: InterventionPlan;
  onView: (plan: InterventionPlan) => void;
  onDownload: (plan: InterventionPlan) => void;
  onDelete: (planId: string) => void;
}

const statusConfig = {
  active: { label: "Ativo", variant: "default" as const, color: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400" },
  completed: { label: "Concluído", variant: "secondary" as const, color: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400" },
  draft: { label: "Rascunho", variant: "outline" as const, color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400" },
};

export function InterventionPlanCard({ plan, onView, onDownload, onDelete }: InterventionPlanCardProps) {
  const status = statusConfig[plan.status as keyof typeof statusConfig] || statusConfig.active;
  const activityCount = plan.complementary_materials?.activities?.length || 0;

  return (
    <Card className="border-border/50 hover:border-primary/30 transition-colors">
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{plan.patient_name}</h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{format(new Date(plan.created_at), "PPP", { locale: ptBR })}</span>
            </div>
          </div>
          <Badge className={status.color}>
            {status.label}
          </Badge>
        </div>

        {/* Activity Count */}
        <div className="flex items-center gap-2 text-sm">
          <Activity className="h-4 w-4 text-primary" />
          <span className="font-medium">{activityCount}</span>
          <span className="text-muted-foreground">
            {activityCount === 1 ? 'atividade' : 'atividades'}
          </span>
        </div>

        {/* Activities Preview */}
        <ActivitiesPreview activities={plan.complementary_materials?.activities || []} />

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(plan)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-1" />
            Visualizar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownload(plan)}
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-1" />
            PDF
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(plan.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
