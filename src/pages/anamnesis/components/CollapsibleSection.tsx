import { useState, ReactNode } from "react";
import { ChevronDown, CheckCircle2, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface CollapsibleSectionProps {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  isComplete?: boolean;
  defaultOpen?: boolean;
  sectionNumber: number;
}

export function CollapsibleSection({
  title,
  icon: Icon,
  children,
  isComplete = false,
  defaultOpen = false,
  sectionNumber,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-4">
      <CollapsibleTrigger asChild>
        <button
          className={cn(
            "w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300",
            "bg-card hover:bg-accent/50 border-2",
            isComplete ? "border-primary/50 bg-primary/5" : "border-border",
            isOpen && "rounded-b-none border-b-0"
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                isComplete
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {isComplete ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <span className="text-sm font-bold">{sectionNumber}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Icon
                className={cn(
                  "w-5 h-5",
                  isComplete ? "text-primary" : "text-muted-foreground"
                )}
              />
              <span
                className={cn(
                  "font-semibold text-left",
                  isComplete ? "text-primary" : "text-foreground"
                )}
              >
                {title}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isComplete && (
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full font-medium">
                Completo
              </span>
            )}
            <ChevronDown
              className={cn(
                "w-5 h-5 text-muted-foreground transition-transform duration-300",
                isOpen && "rotate-180"
              )}
            />
          </div>
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div
          className={cn(
            "p-6 bg-card border-2 border-t-0 rounded-b-xl",
            isComplete ? "border-primary/50" : "border-border"
          )}
        >
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
