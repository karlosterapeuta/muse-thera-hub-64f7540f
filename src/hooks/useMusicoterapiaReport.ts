import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { musicoterapiaTemplate, type ReportData } from '@/data/musicoterapiaTemplate';
import { useProfessionalData } from '@/hooks/useProfessionalData';
import { supabase } from '@/integrations/supabase/client';

export function useMusicoterapiaReport() {
  const { toast } = useToast();
  const { data: professionalData } = useProfessionalData();
  const [isGeneratingWithAI, setIsGeneratingWithAI] = useState(false);
  
  const [reportData, setReportData] = useState<Partial<ReportData>>({
    templateId: 'musicoterapia',
    sessionDate: new Date().toISOString(),
    fieldValues: {},
    additionalObservations: '',
    signature: '',
    professionalName: '',
    professionalRegistry: '',
    professionalSpecialty: 'Musicoterapia'
  });

  // Auto-populate professional data when it becomes available
  useEffect(() => {
    if (professionalData) {
      setReportData(prev => ({
        ...prev,
        professionalName: professionalData.name || '',
        professionalRegistry: professionalData.register || professionalData.license_number || ''
      }));
    }
  }, [professionalData]);

  const updateReportData = useCallback((updates: Partial<ReportData>) => {
    setReportData(prev => ({ ...prev, ...updates }));
  }, []);

  const generateWithAI = useCallback(async () => {
    setIsGeneratingWithAI(true);
    
    try {
      console.log('Iniciando organização com IA...', reportData);
      
      const { data, error } = await supabase.functions.invoke('organize-musicoterapia-report', {
        body: { reportData }
      });

      if (error) {
        console.error('Erro na edge function:', error);
        throw new Error(error.message || 'Erro ao chamar serviço de IA');
      }

      console.log('Resposta da edge function:', data);

      if (data.success && data.organizedContent) {
        // Converter texto organizado em arrays se necessário
        const organizedFields: Record<string, any> = {};
        const arrayFields = ['therapeutic_objectives', 'session_activities', 'patient_evolution', 'recommendations', 'conclusion'];
        
        Object.entries(data.organizedContent).forEach(([key, value]) => {
          if (arrayFields.includes(key)) {
            // Se o campo original no template espera array, mas a IA retornou string, convertemos
            // No entanto, o PDF generator parece lidar com ambos. 
            // Para garantir consistência no Wizard (que usa textarea), mantemos como string
            // ou array conforme o campo original.
            organizedFields[key] = Array.isArray(value) ? value : [value];
          } else {
            organizedFields[key] = value;
          }
        });


        updateReportData({
          fieldValues: { ...reportData.fieldValues, ...organizedFields }
        });

        toast({
          title: "✅ Relatório Organizado com Sucesso!",
          description: "Seu relatório foi estruturado pela IA e está pronto para baixar ou salvar. Revise o conteúdo e finalize quando desejar.",
          duration: 6000,
        });
      } else if (data.fallbackContent) {
        // Usar conteúdo de fallback em caso de erro
        const fallbackFields: Record<string, any> = {};
        Object.entries(data.fallbackContent).forEach(([key, value]) => {
          fallbackFields[key] = [value as string];
        });

        updateReportData({
          fieldValues: { ...reportData.fieldValues, ...fallbackFields }
        });

        toast({
          title: "Conteúdo Básico Adicionado",
          description: "Foi adicionado conteúdo básico. Revise e complemente conforme necessário.",
        });
      } else {
        throw new Error('Resposta inválida da IA');
      }

    } catch (error) {
      console.error('Erro completo:', error);
      toast({
        variant: "destructive",
        title: "Erro na Organização com IA",
        description: error instanceof Error ? error.message : "Não foi possível organizar o relatório automaticamente.",
      });
    } finally {
      setIsGeneratingWithAI(false);
    }
  }, [reportData, updateReportData, toast]);

  const validateReport = useCallback(() => {
    console.log('Validando relatório...', reportData);
    
    // Validar campos básicos
    const basicErrors = [];
    if (!reportData.selectedPatientId) basicErrors.push('Paciente deve ser selecionado');
    if (!professionalData?.id) basicErrors.push('Dados do profissional não encontrados');
    
    // Validar campos obrigatórios do template
    const requiredFields = musicoterapiaTemplate.fields.filter(field => field.required);
    const missingFields = requiredFields.filter(field => {
      const value = reportData.fieldValues?.[field.id];
      return !value || (Array.isArray(value) && value.length === 0) || 
             (typeof value === 'string' && value.trim() === '');
    });

    const allErrors = [
      ...basicErrors,
      ...missingFields.map(field => field.label)
    ];

    console.log('Campos obrigatórios faltando:', allErrors);

    return {
      isValid: allErrors.length === 0,
      missingFields: allErrors
    };
  }, [reportData, professionalData]);

  return {
    reportData,
    updateReportData,
    generateWithAI,
    isGeneratingWithAI,
    validateReport,
    template: musicoterapiaTemplate,
    professionalData
  };
}