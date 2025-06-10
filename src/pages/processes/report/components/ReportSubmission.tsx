
import React from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { generatePDF } from "../utils/pdfGenerator";
import { FormValues } from "../hooks/useReportForm";

interface ReportSubmissionProps {
  formData: FormValues;
  selectedPatient: any;
  professionalData: any;
  userEmail: string | null;
  userName: string | null;
  isContentEmpty: boolean;
}

export function ReportSubmission({
  formData,
  selectedPatient,
  professionalData,
  userEmail,
  userName,
  isContentEmpty,
}: ReportSubmissionProps) {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      console.log("Submetendo formulário com dados:", formData);
      
      if (!selectedPatient) {
        throw new Error("Paciente não encontrado");
      }

      const { error } = await supabase
        .from("assessments")
        .insert({
          patient_id: formData.patient_id,
          date: format(formData.date, "yyyy-MM-dd'T'HH:mm:ssXXX"),
          type: formData.type,
          content: formData.content,
        });

      if (error) throw error;

      await generatePDF(selectedPatient.name, formData, professionalData, userEmail, userName);

      toast({
        title: "Sucesso!",
        description: "Relatório registrado e PDF gerado com sucesso.",
      });

      navigate("/processes");
    } catch (error) {
      console.error("Erro ao salvar relatório:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar o relatório.",
      });
    }
  };

  return (
    <div className="flex justify-end space-x-4">
      <Button
        onClick={handleSubmit}
        className="w-32"
        disabled={isContentEmpty}
      >
        <Download className="mr-2 h-4 w-4" />
        Gerar PDF
      </Button>
    </div>
  );
}
