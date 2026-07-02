import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ResourceBackButtonProps {
  className?: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  label?: string;
}

export function ResourceBackButton({
  className = "",
  variant = "outline",
  label = "Voltar",
}: ResourceBackButtonProps) {
  const navigate = useNavigate();

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={() => navigate(-1)}
      className={`gap-2 ${className}`}
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </Button>
  );
}
