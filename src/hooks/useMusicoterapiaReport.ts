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
        // Não interromper: usar dados originais para o PDF
        toast({
          title: "PDF gerado sem otimização de IA",
          description: "Não foi possível otimizar com IA agora; o relatório usará os dados originais.",
        });
        return reportData.fieldValues;
      }

      console.log('Resposta da edge function:', data);

      if (data.success && data.organizedContent) {
        // Converter texto organizado em arrays se necessário
        const organizedFields: Record<string, any> = {};
        
        Object.entries(data.organizedContent).forEach(([key, value]) => {
          // Manter campos que já são arrays como arrays
          if (Array.isArray(reportData.fieldValues?.[key])) {
            organizedFields[key] = Array.isArray(value) ? value : [value];
          } else {
            organizedFields[key] = value;
          }
        });


        // Retornar o novo estado para que possa ser usado imediatamente
        const newFieldValues = { ...reportData.fieldValues, ...organizedFields };
        
        updateReportData({
          fieldValues: newFieldValues
        });

        toast({
          title: "✅ Relatório Organizado com Sucesso!",
          description: "Seu relatório foi estruturado pela IA para a geração do PDF.",
          duration: 3000,
        });

        return newFieldValues;
      } else if (data.fallbackContent) {
        // IA indisponível: usar os dados originais sem alterar a estrutura
        const newFieldValues = { ...reportData.fieldValues, ...data.fallbackContent };

        updateReportData({
          fieldValues: newFieldValues
        });

        toast({
          title: "PDF gerado sem otimização de IA",
          description: "O relatório usará os dados que você preencheu.",
        });

        return newFieldValues;
      } else {
        return reportData.fieldValues;
      }

    } catch (error) {
      console.error('Erro completo:', error);
      toast({
        variant: "destructive",
        title: "Erro na Organização com IA",
        description: error instanceof Error ? error.message : "Não foi possível organizar o relatório automaticamente.",
      });
      return reportData.fieldValues;
    } finally {
      setIsGeneratingWithAI(false);
    }
  }, [reportData, updateReportData, toast]);

  const generateNarrative = useCallback(async (overrideReportData?: Partial<ReportData>): Promise<{ title: string; content: string }[] | null> => {
    const payload = overrideReportData
      ? { ...reportData, ...overrideReportData }
      : reportData;

    try {
      const { data, error } = await supabase.functions.invoke('generate-tea-narrative', {
        body: { reportData: payload }
      });

      if (error) {
        console.error('Erro na edge function de narrativa:', error);
        return null;
      }

      if (data?.success && Array.isArray(data.sections) && data.sections.length > 0) {
        return data.sections as { title: string; content: string }[];
      }

      console.warn('Narrativa de IA indisponível:', data?.error);
      return null;
    } catch (err) {
      console.error('Erro ao gerar narrativa clínica:', err);
      return null;
    }
  }, [reportData]);

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
    generateNarrative,
    isGeneratingWithAI,
    validateReport,
    template: musicoterapiaTemplate,
    professionalData
  };
}