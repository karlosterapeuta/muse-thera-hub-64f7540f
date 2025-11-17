import { Clock } from "lucide-react";
import { useState, useEffect } from "react";

export function HeaderTime() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 60000); // Atualiza a cada minuto

    return () => clearInterval(timer);
  }, []);

  const getCurrentTime = () => {
    return time.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="hidden sm:flex items-center gap-2 px-3 py-2.5 bg-muted/50 rounded-lg border border-border/50 hover:border-border transition-colors">
      <Clock className="h-5 w-5 text-muted-foreground" />
      <span className="text-sm font-medium text-foreground tabular-nums">{getCurrentTime()}</span>
    </div>
  );
}
