
import React from "react";
import { Activity } from "../types";
import { Music2 } from "lucide-react";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ActivityAccordionItemProps {
  activity: Activity;
  itemId: string;
  isMobile?: boolean;
}

export function ActivityAccordionItem({ activity, itemId, isMobile }: ActivityAccordionItemProps) {
  const IconComponent = activity.icon || Music2;
  
  return (
    <AccordionItem value={itemId} className="overflow-hidden border rounded-lg mb-3 hover:shadow-md transition-all">
      <AccordionTrigger className="text-left p-4 hover:no-underline hover:bg-accent/40 group">
        <div className="flex flex-col items-start">
          <div className="flex items-center">
            <div className="bg-primary/10 rounded-full p-1.5 mr-3">
              <IconComponent className="h-4 w-4 text-primary" />
            </div>
            <span className={`font-medium ${isMobile ? 'text-base' : 'text-lg'} group-hover:text-primary`}>
              {activity.title}
            </span>
          </div>
          {!isMobile && (
            <div className="text-xs text-muted-foreground mt-1 ml-9 line-clamp-1">
              {activity.description.substring(0, 80)}...
            </div>
          )}
        </div>
      </AccordionTrigger>
      
      <AccordionContent>
        <Card className="p-3 sm:p-4 bg-card/30 border-0 shadow-none">
          <div className="space-y-2 sm:space-y-3">
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              {activity.description}
            </p>
            
            <div>
              <h4 className="text-xs sm:text-sm font-semibold mb-1 text-primary">Indicações:</h4>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {activity.target.map((target, idx) => (
                  <Badge key={idx} variant="outline" className={`${isMobile ? "text-xs py-0" : ""} bg-primary/5 hover:bg-primary/10`}>
                    {target}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-xs sm:text-sm font-semibold mb-1 text-primary">Materiais:</h4>
              <p className="text-gray-700 text-sm sm:text-base bg-background/50 p-2 rounded-md">
                {activity.materials}
              </p>
            </div>
          </div>
        </Card>
      </AccordionContent>
    </AccordionItem>
  );
}
