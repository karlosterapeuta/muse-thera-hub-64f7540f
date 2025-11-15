import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface WelcomeToastProps {
  greetingIcon: string;
  mainMessage: string;
  secondaryInfo: Array<{
    icon: string;
    text: string;
    variant?: "default" | "warning" | "success";
  }>;
  onClose: () => void;
  duration?: number;
}

export function WelcomeToast({
  greetingIcon,
  mainMessage,
  secondaryInfo,
  onClose,
  duration = 6000,
}: WelcomeToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md animate-in slide-in-from-right-full duration-500">
      <div className="bg-gradient-to-br from-background/95 via-background/98 to-background/95 backdrop-blur-xl border-2 border-primary/20 rounded-2xl shadow-2xl shadow-primary/10 overflow-hidden">
        {/* Header com gradiente */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4 border-b border-primary/10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl animate-bounce">{greetingIcon}</div>
              <div className="flex-1">
                <p className="text-base font-bold text-foreground leading-tight">{mainMessage}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="ml-2 text-muted-foreground hover:text-foreground transition-colors duration-200 hover:bg-muted/50 rounded-lg p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Informações secundárias */}
        {secondaryInfo.length > 0 && (
          <div className="p-4 space-y-2">
            {secondaryInfo.map((info, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center gap-2 text-sm p-2 rounded-lg transition-all duration-300",
                  info.variant === "warning" &&
                    "bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20",
                  info.variant === "success" &&
                    "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20",
                  !info.variant && "text-muted-foreground hover:bg-muted/30"
                )}
              >
                <span className="text-base">{info.icon}</span>
                <span className="font-medium">{info.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Barra de progresso */}
        <div className="h-1 bg-primary/10">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary animate-progress"
            style={{
              animationDuration: `${duration}ms`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
