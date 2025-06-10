
import React from "react";
import { useNavigate } from "react-router-dom";
import { Download, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { generatePDF } from "../utils/pdfGenerator";

interface ReportSubmissionProps {
  formData: {
    patient_id?: string;
    type?: string;
    date?: Date;
    content?: Record<string, any>;
  };
  selectedPatient: any;
  professionalData: any;
  userEmail: string | null;
  userName: string | null;
  userId: string | null;
  isContentEmpty: boolean;
  reportId?: string;
  onSaveSuccess?: (reportId: string) => void;
}

export function ReportSubmission({
  formData,
  selectedPatient,
  professionalData,
  userEmail,
  userName,
  userId,
  isContentEmpty,
  reportId,
  onSaveSuccess,
}: ReportSubmissionProps) {
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateRequiredData = () => {
    if (!formData.patient_id || !formData.type) {
      toast({
        variant: "destructive",
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos obrigatórios antes de salvar.",
      });
      return false;
    }

    if (!selectedPatient || !userId) {
      toast({
        variant: "destructive",
        title: "Dados necessários não encontrados",
        description: "Paciente ou usuário não identificado.",
      });
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    try {
      console.log("Salvando relatório com dados:", formData);
      
      if (!validateRequiredData()) {
        return;
      }

      // Garantir que content seja um objeto válido
      const safeContent = formData.content && typeof formData.content === 'object' 
        ? formData.content 
        : {};

      const reportData = {
        patient_id: formData.patient_id!,
        professional_id: userId!,
        type: formData.type!,
        content: safeContent,
        updated_at: new Date().toISOString(),
      };

      let result;
      if (reportId) {
        // Atualizar relatório existente
        result = await supabase
          .from("reports")
          .update(reportData)
          .eq("id", reportId)
          .select()
          .single();
      } else {
        // Criar novo relatório
        result = await supabase
          .from("reports")
          .insert({
            ...reportData,
            created_at: new Date().toISOString(),
          })
          .select()
          .single();
      }

      if (result.error) throw result.error;

      toast({
        title: "Sucesso!",
        description: reportId ? "Relatório atualizado com sucesso." : "Relatório salvo com sucesso.",
      });

      if (onSaveSuccess && result.data) {
        onSaveSuccess(result.data.id);
      }

      return result.data.id;
    } catch (error) {
      console.error("Erro ao salvar relatório:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar o relatório.",
      });
      throw error;
    }
  };

  const handleSaveAndGeneratePDF = async () => {
    try {
      if (!validateRequiredData()) {
        return;
      }

      // Primeiro salva o relatório
      const savedReportId = await handleSave();
      
      // Preparar dados para o PDF com valores garantidos
      const pdfData = {
        patient_id: formData.patient_id!,
        type: formData.type!,
        date: formData.date || new Date(),
        content: formData.content || {},
      };
      
      // Depois gera o PDF com os dados completos
      await generatePDF(selectedPatient.name, pdfData, professionalData, userEmail, userName);

      toast({
        title: "Concluído!",
        description: "Relatório salvo e PDF gerado com sucesso.",
      });

      navigate("/processes/reports");
    } catch (error) {
      console.error("Erro ao salvar e gerar PDF:", error);
    }
  };

  return (
    <div className="flex justify-end space-x-4">
      <Button
        onClick={handleSave}
        variant="outline"
        className="w-32"
        disabled={isContentEmpty}
      >
        <Save className="mr-2 h-4 w-4" />
        Salvar
      </Button>
      
      <Button
        onClick={handleSaveAndGeneratePDF}
        className="w-32"
        disabled={isContentEmpty}
      >
        <Download className="mr-2 h-4 w-4" />
        Finalizar
      </Button>
    </div>
  );
}
