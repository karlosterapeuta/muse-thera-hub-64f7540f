import { ChevronDown, ChevronUp, Clock, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getComplexityColor } from "@/lib/intervention-utils";
import { TherapyActivity } from "@/types/therapy-activity";

interface ActivityCardProps {
  activity: TherapyActivity;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

export function ActivityCard({ activity, index, isExpanded, onToggle }: ActivityCardProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div 
        className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-3 sm:p-4 cursor-pointer hover:opacity-90 transition-opacity"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <Badge variant="secondary" className="shrink-0 bg-primary-foreground/20 text-primary-foreground">
              {index + 1}
            </Badge>
            <span className="font-semibold text-sm sm:text-base truncate">
              Atividade {index + 1} - {activity.disorder}
            </span>
          </div>
          <Button variant="ghost" size="sm" className="shrink-0 h-8 w-8 p-0 text-primary-foreground hover:bg-primary-foreground/20">
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 sm:p-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{activity.disorder}</Badge>
            <Badge variant="outline">{activity.specialty}</Badge>
            <Badge className={getComplexityColor(activity.complexityLevel)}>{activity.complexityLevel}</Badge>
          </div>
          <Separator />
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-primary" />
                <h4 className="font-semibold text-sm">Objetivo Geral</h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{activity.generalObjective}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-2">Materiais Necessários</h4>
              <ul className="list-disc list-inside space-y-1">
                {activity.materials.map((material, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground">{material}</li>
                ))}
              </ul>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <span className="font-medium">Tempo estimado:</span>
              <span className="text-muted-foreground">{activity.estimatedTime}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
