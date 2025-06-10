
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

    console.log("Verificando profissional existente para userId:", userId);

    // Verificar se o profissional já existe
    const { data: existingProfessional, error: checkError } = await supabase
      .from('professionals')
      .select('id, name, email')
      .eq('user_id', userId)
      .maybeSingle();

    if (checkError) {
      console.error("Erro ao verificar profissional existente:", checkError);
      throw new Error(`Erro ao verificar profissional: ${checkError.message}`);
    }

    if (existingProfessional) {
      console.log("Profissional existente encontrado:", existingProfessional);
      return existingProfessional.id;
    }

    console.log("Criando novo profissional para:", { userId, userEmail, userName });

    // Se não existe, criar o registro com dados válidos
    const professionalData = {
      user_id: userId,
      name: userName || userEmail.split('@')[0] || 'Profissional',
      email: userEmail,
      phone: '', // Campo obrigatório, mas pode ser vazio inicialmente
      specialty: 'Musicoterapia', // Valor padrão
      license_number: '', // Campo opcional
    };

    const { data: newProfessional, error: createError } = await supabase
      .from('professionals')
      .insert(professionalData)
      .select('id, name, email')
      .single();

    if (createError) {
      console.error("Erro detalhado ao criar profissional:", createError);
      console.error("Dados enviados:", professionalData);
      
      // Verificar se é erro de constraint específico
      if (createError.code === '23505') {
        throw new Error("Profissional já existe com esses dados. Tente fazer logout e login novamente.");
      } else if (createError.code === '23502') {
        throw new Error("Dados obrigatórios ausentes para criar o profissional.");
      } else {
        throw new Error(`Erro ao criar profissional: ${createError.message}`);
      }
    }

    if (!newProfessional?.id) {
      throw new Error("Profissional criado mas ID não retornado");
    }

    console.log("Novo profissional criado com sucesso:", newProfessional);
    return newProfessional.id;
  };

  const validateProfessionalExists = async (professionalId: string) => {
    console.log("Validando se profissional existe na tabela:", professionalId);
    
    const { data: professional, error } = await supabase
      .from('professionals')
      .select('id')
      .eq('id', professionalId)
      .single();

    if (error || !professional) {
      console.error("Profissional não encontrado na validação:", error);
      throw new Error("Profissional não encontrado após criação/verificação");
    }

    console.log("Profissional validado com sucesso");
    return true;
  };

  const handleSaveAndGeneratePDF = async () => {
    try {
      console.log("=== Iniciando salvamento de relatório ===");
      console.log("Dados do formulário:", formData);
      
      if (!validateRequiredData()) {
        return;
      }

      toast({
        title: "Processando...",
        description: "Verificando dados do profissional...",
      });

      // Garantir que o profissional existe e obter o ID
      const professionalId = await ensureProfessionalExists();
      
      // Validar se o profissional realmente existe na tabela
      await validateProfessionalExists(professionalId);

      toast({
        title: "Processando...",
        description: "Salvando relatório...",
      });

      // Garantir que content seja um objeto válido
      const safeContent = formData.content && typeof formData.content === 'object' 
        ? formData.content 
        : {};

      console.log("Preparando dados do relatório com professionalId:", professionalId);

      const reportData = {
        patient_id: formData.patient_id!,
        professional_id: professionalId, // Usar o ID validado
        type: formData.type!,
        content: safeContent as Database["public"]["Tables"]["reports"]["Insert"]["content"],
        updated_at: new Date().toISOString(),
      };

      console.log("Dados do relatório a serem salvos:", reportData);

      let result;
      if (reportId) {
        // Atualizar relatório existente
        console.log("Atualizando relatório existente:", reportId);
        result = await supabase
          .from("reports")
          .update(reportData)
          .eq("id", reportId)
          .select()
          .single();
      } else {
        // Criar novo relatório
        console.log("Criando novo relatório");
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
        console.error("Erro detalhado do Supabase:", result.error);
        console.error("Código do erro:", result.error.code);
        console.error("Mensagem do erro:", result.error.message);
        console.error("Detalhes do erro:", result.error.details);
        throw new Error(`Erro ao salvar relatório: ${result.error.message}`);
      }

      console.log("Relatório salvo com sucesso:", result.data);

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
      console.error("=== Erro no processo completo ===");
      console.error("Erro:", error);
      console.error("Stack trace:", error instanceof Error ? error.stack : 'N/A');
      
      let errorMessage = "Erro desconhecido";
      let suggestion = "Tente novamente ou entre em contato com o suporte.";

      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Sugestões específicas baseadas no tipo de erro
        if (error.message.includes("professional")) {
          suggestion = "Tente fazer logout e login novamente, ou entre em contato com o administrador.";
        } else if (error.message.includes("foreign key")) {
          suggestion = "Problema de integridade de dados. Entre em contato com o suporte técnico.";
        } else if (error.message.includes("network") || error.message.includes("fetch")) {
          suggestion = "Verifique sua conexão com a internet e tente novamente.";
        }
      }

      toast({
        variant: "destructive",
        title: "Erro ao processar relatório",
        description: `${errorMessage}. ${suggestion}`,
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
