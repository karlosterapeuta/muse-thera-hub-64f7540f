import { Lock, BookOpen, ArrowLeft, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Course } from "@/types/courses";

interface CourseAccessRestrictedProps {
  course?: Course | null;
  onPurchase?: () => void;
}

export function CourseAccessRestricted({ course, onPurchase }: CourseAccessRestrictedProps) {
  const navigate = useNavigate();
  
  const hasPrice = course?.price_cents && course.price_cents > 0;
  const priceFormatted = hasPrice 
    ? `R$ ${(course.price_cents / 100).toFixed(2).replace('.', ',')}`
    : null;
  
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
          🔒 Acesso Restrito
        </Badge>
        
        {/* Title */}
        <h1 className="text-2xl font-bold mb-3">
          {course?.title || "Curso Bloqueado"}
        </h1>
        
        {/* Message */}
        <p className="text-muted-foreground mb-6">
          {hasPrice 
            ? "Para acessar este curso, você precisa realizar a compra. Após o pagamento, o conteúdo será liberado automaticamente."
            : "Você não tem permissão para acessar este curso."}
        </p>
        
        {/* Price display */}
        {hasPrice && priceFormatted && (
          <div className="mb-6">
            <span className="text-3xl font-bold text-primary">{priceFormatted}</span>
            <span className="text-muted-foreground ml-2">acesso vitalício</span>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          {hasPrice && onPurchase && (
            <Button onClick={onPurchase} className="gap-2 w-full">
              <ShoppingCart className="h-4 w-4" />
              Comprar Acesso
            </Button>
          )}
          
          <Button onClick={() => navigate("/courses")} variant="outline" className="gap-2 w-full">
            <ArrowLeft className="h-4 w-4" />
            Voltar para Cursos
          </Button>
        </div>
      </div>
    </div>
  );
}
