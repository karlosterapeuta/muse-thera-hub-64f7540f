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
        
        Object.entries(data.organizedContent).forEach(([key, value]) => {
          if (typeof value === 'string') {
            // Para campos que esperam arrays, converter texto em array com um item
            const arrayFields = ['therapeutic_objectives', 'session_activities', 'patient_evolution', 'recommendations', 'conclusion'];
            if (arrayFields.includes(key)) {
              organizedFields[key] = [value];
            } else {
              organizedFields[key] = value;
            }
          } else {
            organizedFields[key] = value;
          }
        });

        updateReportData({
          fieldValues: { ...reportData.fieldValues, ...organizedFields }
        });

        toast({
          title: "Relatório Organizado com IA!",
          description: "O conteúdo foi estruturado automaticamente com inteligência artificial.",
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
    const requiredFields = musicoterapiaTemplate.fields.filter(field => field.required);
    const missingFields = requiredFields.filter(field => {
      const value = reportData.fieldValues?.[field.id];
      return !value || (Array.isArray(value) && value.length === 0);
    });

    return {
      isValid: missingFields.length === 0,
      missingFields: missingFields.map(field => field.label)
    };
  }, [reportData]);

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