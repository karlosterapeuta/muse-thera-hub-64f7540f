import { InterventionPlanActivity } from "@/hooks/useInterventionPlans";
import { Badge } from "@/components/ui/badge";
import { Clock, Target } from "lucide-react";

interface ActivitiesPreviewProps {
  activities: InterventionPlanActivity[];
  maxVisible?: number;
}

export function ActivitiesPreview({ activities, maxVisible = 1 }: ActivitiesPreviewProps) {
  if (!activities || activities.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic">Nenhuma atividade disponível</p>
    );
  }

  const visibleActivities = activities.slice(0, maxVisible);
  const remainingCount = Math.max(0, activities.length - maxVisible);

  return (
    <div className="space-y-3">
      {visibleActivities.map((activity, index) => (
        <div key={index} className="bg-muted/30 p-3 rounded-md space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h5 className="font-medium text-sm line-clamp-1">{activity.name}</h5>
            <Badge variant="secondary" className="text-xs shrink-0">
              {activity.complexity}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Target className="h-3 w-3" />
            <p className="line-clamp-1">{activity.generalObjective}</p>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{activity.estimatedTime}</span>
          </div>
        </div>
      ))}
      
      {remainingCount > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          + {remainingCount} {remainingCount === 1 ? 'atividade' : 'atividades'}
        </p>
      )}
    </div>
  );
}
