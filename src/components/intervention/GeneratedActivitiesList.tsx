import { Save, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityCard } from "./ActivityCard";
import { TherapyActivity } from "@/types/therapy-activity";

interface GeneratedActivitiesListProps {
  activities: TherapyActivity[];
  expandedActivities: Set<string>;
  onToggleActivity: (activityId: string) => void;
  onSave: () => void;
  onDownload: () => void;
  isSaving?: boolean;
  isExporting?: boolean;
}

export function GeneratedActivitiesList({
  activities,
  expandedActivities,
  onToggleActivity,
  onSave,
  onDownload,
  isSaving = false,
  isExporting = false,
}: GeneratedActivitiesListProps) {
  if (activities.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <CardTitle>Atividades Geradas ({activities.length})</CardTitle>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button 
              onClick={onSave} 
              disabled={isSaving}
              className="flex-1 sm:flex-none"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Salvando..." : "Salvar Plano"}
            </Button>
            <Button 
              onClick={onDownload} 
              variant="outline"
              disabled={isExporting}
              className="flex-1 sm:flex-none"
            >
              <Download className="mr-2 h-4 w-4" />
              {isExporting ? "Gerando..." : "Baixar PDF"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const activityId = `${activity.disorder}-${index}`;
            return (
              <ActivityCard
                key={activityId}
                activity={activity}
                index={index}
                isExpanded={expandedActivities.has(activityId)}
                onToggle={() => onToggleActivity(activityId)}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
