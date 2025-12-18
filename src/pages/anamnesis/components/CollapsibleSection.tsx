import { useState, ReactNode, useEffect, forwardRef, useImperativeHandle } from "react";
import { ChevronDown, CheckCircle2, AlertCircle, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface CollapsibleSectionProps {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  isComplete?: boolean;
  defaultOpen?: boolean;
  sectionNumber: number;
  hasErrors?: boolean;
  errorCount?: number;
}

export interface CollapsibleSectionRef {
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const CollapsibleSection = forwardRef<CollapsibleSectionRef, CollapsibleSectionProps>(({
  title,
  icon: Icon,
  children,
  isComplete = false,
  defaultOpen = false,
  sectionNumber,
  hasErrors = false,
  errorCount = 0,
}, ref) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Expor métodos para controle externo
  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen(prev => !prev),
  }));

  // Se houver erros, abrir automaticamente
  useEffect(() => {
    if (hasErrors && !isOpen) {
      setIsOpen(true);
    }
  }, [hasErrors]);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-4">
      <CollapsibleTrigger asChild>
        <button
          className={cn(
            "w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300",
            "bg-card hover:bg-accent/50 border-2",
            hasErrors 
              ? "border-destructive/50 bg-destructive/5" 
              : isComplete 
                ? "border-primary/50 bg-primary/5" 
                : "border-border",
            isOpen && "rounded-b-none border-b-0"
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                hasErrors
                  ? "bg-destructive text-destructive-foreground"
                  : isComplete
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
              )}
            >
              {hasErrors ? (
                <AlertCircle className="w-5 h-5" />
              ) : isComplete ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <span className="text-sm font-bold">{sectionNumber}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Icon
                className={cn(
                  "w-5 h-5",
                  hasErrors 
                    ? "text-destructive" 
                    : isComplete 
                      ? "text-primary" 
                      : "text-muted-foreground"
                )}
              />
              <span
                className={cn(
                  "font-semibold text-left",
                  hasErrors 
                    ? "text-destructive" 
                    : isComplete 
                      ? "text-primary" 
                      : "text-foreground"
                )}
              >
                {title}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hasErrors && (
              <span className="text-xs bg-destructive/20 text-destructive px-2 py-1 rounded-full font-medium">
                {errorCount} pendente{errorCount > 1 ? "s" : ""}
              </span>
            )}
            {!hasErrors && isComplete && (
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
            hasErrors 
              ? "border-destructive/50" 
              : isComplete 
                ? "border-primary/50" 
                : "border-border"
          )}
        >
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
});

CollapsibleSection.displayName = "CollapsibleSection";
