
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { usePDFGenerator } from "@/hooks/usePDFGenerator";

interface PDFButtonProps {
  htmlContent: string;
  filename?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
}

export const PDFButton = ({ 
  htmlContent, 
  filename,
  variant = "outline",
  size = "default",
  className = "",
  children = "Gerar PDF"
}: PDFButtonProps) => {
  const { generatePDF, isGenerating } = usePDFGenerator();

  const handleClick = () => {
    generatePDF(htmlContent, { filename });
  };

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      disabled={isGenerating}
      className={`flex items-center gap-2 ${className}`}
    >
      <FileDown className="h-4 w-4" />
      {children}
    </Button>
  );
};
