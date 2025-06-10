
import React from "react";
import { useNavigate } from "react-router-dom";
import { Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { generatePDF } from "../utils/pdfGenerator";
import type { Database } from "@/integrations/supabase/types";

type ReportType = Database["public"]["Enums"]["report_type"];

interface ReportSubmissionProps {
  formData: {
    patient_id?: string;
    type?: ReportType;
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

  const ensureProfessionalExists = async () => {
    if (!userId || !userEmail) {
      throw new Error("Dados do usuário não encontrados");
    }

    // Verificar se o profissional já existe
    const { data: existingProfessional } = await supabase
      .from('professionals')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (existingProfessional) {
      return existingProfessional.id;
    }

    // Se não existe, criar o registro
    const { data: newProfessional, error } = await supabase
      .from('professionals')
      .insert({
        user_id: userId,
        name: userName || userEmail.split('@')[0],
        email: userEmail,
        phone: '', // Campo obrigatório, mas pode ser vazio inicialmente
      })
      .select('id')
      .single();

    if (error) {
      console.error("Erro ao criar profissional:", error);
      throw new Error("Não foi possível criar o registro do profissional");
    }

    return newProfessional.id;
  };

  const handleSaveAndGeneratePDF = async () => {
    try {
      console.log("Iniciando salvamento e geração de PDF com dados:", formData);
      
      if (!validateRequiredData()) {
        return;
      }

      // Mostrar toast de progresso
      toast({
        title: "Processando...",
        description: "Verificando permissões...",
      });

      // Garantir que o profissional existe na tabela
      await ensureProfessionalExists();

      toast({
        title: "Processando...",
        description: "Salvando relatório...",
      });

      // Garantir que content seja um objeto válido
      const safeContent = formData.content && typeof formData.content === 'object' 
        ? formData.content 
        : {};

      const reportData = {
        patient_id: formData.patient_id!,
        professional_id: userId!,
        type: formData.type!,
        content: safeContent as Database["public"]["Tables"]["reports"]["Insert"]["content"],
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

      if (result.error) {
        console.error("Erro do Supabase:", result.error);
        throw result.error;
      }

      // Atualizar toast de progresso
      toast({
        title: "Relatório salvo!",
        description: "Gerando PDF...",
      });

      if (onSaveSuccess && result.data) {
        onSaveSuccess(result.data.id);
      }

      // Preparar dados para o PDF com valores garantidos
      const pdfData = {
        patient_id: formData.patient_id!,
        type: formData.type!,
        date: formData.date || new Date(),
        content: safeContent,
      };
      
      // Gerar PDF
      await generatePDF(selectedPatient.name, pdfData, professionalData, userEmail, userName);

      toast({
        title: "Concluído!",
        description: "Relatório salvo e PDF gerado com sucesso.",
      });

      navigate("/processes/reports");

    } catch (error) {
      console.error("Erro ao salvar e gerar PDF:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error instanceof Error ? error.message : "Não foi possível completar a operação. Tente novamente.",
      });
    }
  };

  return (
    <div className="flex justify-end">
      <Button
        onClick={handleSaveAndGeneratePDF}
        className="w-48"
        disabled={isContentEmpty}
      >
        <Download className="mr-2 h-4 w-4" />
        Salvar e Baixar PDF
      </Button>
    </div>
  );
}
