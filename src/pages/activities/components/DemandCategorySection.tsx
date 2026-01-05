import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { DemandCategory, demandCategoryInfo, ProfessionalActivity } from "@/data/activities-by-disorder";
import { ProfessionalActivityCard } from "./ProfessionalActivityCard";
import { cn } from "@/lib/utils";

interface DemandCategorySectionProps {
  category: DemandCategory;
  activities: ProfessionalActivity[];
  onActivityClick: (activity: ProfessionalActivity) => void;
}

export function DemandCategorySection({ category, activities, onActivityClick }: DemandCategorySectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const categoryInfo = demandCategoryInfo[category];

  if (activities.length === 0) return null;

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-full flex items-center gap-3 p-3 rounded-lg transition-all",
          "bg-muted/50 hover:bg-muted",
          "text-left"
        )}
      >
        {isExpanded ? (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        )}
        <span className="text-xl">{categoryInfo.icon}</span>
        <span className="font-medium text-foreground">{categoryInfo.name}</span>
        <span className="ml-auto text-sm text-muted-foreground">
          {activities.length} {activities.length === 1 ? 'atividade' : 'atividades'}
        </span>
      </button>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 pl-4">
          {activities.map((activity) => (
            <ProfessionalActivityCard
              key={activity.id}
              activity={activity}
              onClick={() => onActivityClick(activity)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
