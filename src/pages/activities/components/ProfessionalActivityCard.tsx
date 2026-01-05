import { Clock, Target, AlertTriangle, GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProfessionalActivity, disorderInfo } from "@/data/activities-by-disorder";
import { cn } from "@/lib/utils";

interface ProfessionalActivityCardProps {
  activity: ProfessionalActivity;
  onClick: () => void;
}

const complexityColors = {
  leve: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  moderado: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
  severo: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
};

const complexityLabels = {
  leve: "Nível 1",
  moderado: "Nível 2",
  severo: "Nível 3"
};

export function ProfessionalActivityCard({ activity, onClick }: ProfessionalActivityCardProps) {
  const disorder = disorderInfo[activity.disorder];

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1",
        "border-l-4",
        activity.disorder === 'TEA' && "border-l-blue-500",
        activity.disorder === 'TDAH' && "border-l-orange-500",
        activity.disorder === 'TOD' && "border-l-red-500",
        activity.disorder === 'DI' && "border-l-purple-500"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold leading-tight">
            {activity.title}
          </CardTitle>
          <Badge variant="outline" className={cn("text-xs shrink-0", complexityColors[activity.complexityLevel])}>
            {complexityLabels[activity.complexityLevel]}
          </Badge>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Badge 
            variant="secondary" 
            className={cn(
              "text-xs bg-gradient-to-r text-white",
              disorder.color
            )}
          >
            {disorder.icon} {activity.disorder}
          </Badge>
          <span className="text-xs text-muted-foreground">{activity.demandLabel}</span>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {activity.generalObjective}
        </p>
        
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{activity.estimatedTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <GraduationCap className="h-3 w-3" />
            <span>{activity.ageRange}</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="h-3 w-3" />
            <span>{activity.specificObjectives.length} objetivos</span>
          </div>
        </div>

        {activity.contraindications && activity.contraindications.length > 0 && (
          <div className="flex items-center gap-1 mt-2 text-xs text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-3 w-3" />
            <span>Atenção necessária</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
