import { Lock, BookOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export function CourseAccessRestricted() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
      <div className="text-center max-w-md p-8">
        {/* Animated Lock Icon */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full flex items-center justify-center animate-pulse">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-500/30 to-orange-500/30 rounded-full flex items-center justify-center">
              <Lock className="h-12 w-12 text-amber-600" />
            </div>
          </div>
          <BookOpen className="absolute bottom-0 right-1/4 h-8 w-8 text-primary opacity-60" />
        </div>
        
        {/* Badge */}
        <Badge variant="outline" className="mb-4 border-amber-500/50 text-amber-600">
          🎓 Em Construção
        </Badge>
        
        {/* Title */}
        <h1 className="text-2xl font-bold mb-3">
          Área de Cursos
        </h1>
        
        {/* Message */}
        <p className="text-muted-foreground mb-6">
          Nossos cursos de musicoterapia estão sendo preparados com muito carinho. 
          Em breve você terá acesso a conteúdos exclusivos para aprimorar sua prática profissional.
        </p>
        
        {/* Stats teaser */}
        <div className="flex justify-center gap-6 mb-8 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Lock className="h-4 w-4" /> Módulos exclusivos
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" /> Videoaulas
          </span>
        </div>
        
        {/* Back Button */}
        <Button onClick={() => navigate("/dashboard")} variant="outline" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar ao Dashboard
        </Button>
      </div>
    </div>
  );
}
