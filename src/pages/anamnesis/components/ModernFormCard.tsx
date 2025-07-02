
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
  return (
    <Card className={`relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}>
      {/* Gradient border */}
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} p-[1px] rounded-lg`}>
        <div className="h-full w-full bg-white rounded-lg" />
      </div>
      
      <div className="relative z-10">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className={`p-2 bg-gradient-to-r ${gradient} rounded-lg`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
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
