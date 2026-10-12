
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface ModernFormCardProps {
  title: string;
  icon: LucideIcon;
  gradient: string;
  children: React.ReactNode;
  className?: string;
}

export function ModernFormCard({ 
  title, 
  icon: Icon, 
  gradient,
  children, 
  className = "" 
}: ModernFormCardProps) {
  // Compatibilidade com chamadas existentes: a identidade visual passa a ser única.
  void gradient;
  return (
    <Card className={`relative overflow-hidden rounded-xl border border-teal-700/20 bg-card shadow-sm transition-shadow hover:shadow-md ${className}`}>
      <div className="relative z-10">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="rounded-lg bg-teal-700 p-2">
              <Icon className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-foreground">
              {title}
            </span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-0">
          {children}
        </CardContent>
      </div>
    </Card>
  );
}
