
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  patient_id: z.string({
    required_error: "Por favor, selecione um paciente",
  }),
  date: z.date().default(() => new Date()),
  type: z.enum([
    "individual_session",
    "group_session",
    "daily_evolution",
    "monthly_evolution",
    "semester_evolution",
    "therapeutic_discharge",
    "technical_report",
    "initial_evaluation",
    "progress_report",
    "session_summary",
    "family_report",
    "team_report",
    "assessment_report",
    "discharge_summary",
    "administrative_discharge",
    "tea_scale"
  ], {
    required_error: "Por favor, selecione o tipo de relatório",
  }),
  content: z.record(z.any()).default({}),
});

export type FormValues = z.infer<typeof formSchema>;

export function useReportForm() {
  const { toast } = useToast();
  const [isGeneratingWithAI, setIsGeneratingWithAI] = useState(false);
  const [activeTab, setActiveTab] = useState("manual");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patient_id: "",
      date: new Date(),
      type: "individual_session",
      content: {},
    },
  });

  const generateWithAI = async (keyPoints: string, patients: any[]) => {
    setIsGeneratingWithAI(true);
    try {
      const selectedPatient = patients.find(p => p.id === form.getValues('patient_id'));
      const selectedType = form.getValues('type');

      if (!selectedPatient || !selectedType) {
        toast({
          variant: "destructive",
          title: "Dados incompletos",
          description: "Por favor, selecione paciente e tipo de relatório antes de gerar com IA.",
        });
        return;
      }

      console.log('Calling generate-report function with:', {
        reportType: selectedType,
        keyPoints: keyPoints,
        patientName: selectedPatient.name,
        evaluationDate: format(new Date(), 'yyyy-MM-dd')
      });

      let retryCount = 0;
      const maxRetries = 2;
      
      while (retryCount <= maxRetries) {
        try {
          const { data, error } = await supabase.functions.invoke('generate-report', {
            body: {
              reportType: selectedType,
              keyPoints: keyPoints,
              patientName: selectedPatient.name,
              evaluationDate: format(new Date(), 'yyyy-MM-dd')
            }
          });

          if (error) {
            console.error('Supabase function error:', error);
            throw new Error(`Erro na função: ${error.message}`);
          }

          if (data && data.content) {
            form.setValue('content', data.content);
            setActiveTab('manual');
            toast({
              title: "Relatório gerado com IA!",
              description: "O conteúdo foi gerado pela inteligência artificial. Revise e edite conforme necessário.",
            });
            return;
          } else {
            throw new Error('Resposta inválida da função');
          }

        } catch (functionError) {
          console.error(`Tentativa ${retryCount + 1} falhou:`, functionError);
          retryCount++;
          
          if (retryCount <= maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }

      console.log('Todas as tentativas de IA falharam, gerando conteúdo local aprimorado');
      
      const enhancedContent = generateEnhancedFallbackContent(selectedType, keyPoints, selectedPatient.name);
      form.setValue('content', enhancedContent);
      setActiveTab('manual');
      
      toast({
        title: "Relatório gerado localmente",
        description: "A IA está temporariamente indisponível. Um relatório estruturado foi gerado para você editar.",
        variant: "default",
      });

    } catch (error) {
      console.error('Erro geral ao gerar relatório:', error);
      toast({
        variant: "destructive",
        title: "Erro na geração",
        description: "Não foi possível gerar o relatório. Tente preencher manualmente.",
      });
    } finally {
      setIsGeneratingWithAI(false);
    }
  };

  const generateEnhancedFallbackContent = (reportType: string, keyPoints: string, patientName: string) => {
    const baseContent = {
      patient_name: patientName,
      key_points: keyPoints,
      generated_locally: true
    };

    switch (reportType) {
      case "individual_session":
        return {
          ...baseContent,
          objectives: `Objetivos da sessão individual para ${patientName}`,
          activities: `Atividades realizadas: ${keyPoints}`,
          patient_response: `Resposta do paciente observada durante a sessão`,
          observations: `Observações clínicas relevantes`,
          next_steps: `Próximos passos e recomendações`,
        };

      case "monthly_evolution":
        return {
          ...baseContent,
          therapeutic_objectives: `Objetivos terapêuticos do período`,
          achievements: `Conquistas e progressos observados`,
          challenges: `Desafios encontrados`,
          adjustments: `Ajustes realizados no plano terapêutico`,
          next_steps: `Planejamento para o próximo período`,
        };

      default:
        return {
          ...baseContent,
          content: `Relatório estruturado para ${patientName}. Pontos principais: ${keyPoints}`,
        };
    }
  };

  return {
    form,
    generateWithAI,
    isGeneratingWithAI,
    activeTab,
    setActiveTab,
  };
}
