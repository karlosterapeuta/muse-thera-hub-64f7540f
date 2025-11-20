import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { generateInterventionPDF } from "@/lib/pdf-generator";

export function usePDFExport() {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const exportPDF = async (
    activities: any[],
    patientName: string,
    userName: string,
    userEmail: string
  ) => {
    if (activities.length === 0) {
      toast({
        variant: "destructive",
        title: "Nenhuma atividade",
        description: "Gere atividades antes de exportar o PDF.",
      });
      return;
    }

    setIsExporting(true);
    
    try {
      const result = await generateInterventionPDF(activities, patientName, userName, userEmail);
      
      if (result.success) {
        toast({
          title: "PDF gerado com sucesso!",
          description: "O Plano de Intervenção Individual foi baixado.",
        });
      } else {
        throw result.error;
      }
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast({
        variant: "destructive",
        title: "Erro ao gerar PDF",
        description: "Não foi possível gerar o PDF do plano.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return {
    isExporting,
    exportPDF,
  };
}
