import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { musicoterapiaTemplate, type ReportData } from '@/data/musicoterapiaTemplate';
import { useProfessionalData } from '@/hooks/useProfessionalData';

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
    professionalName: professionalData?.name || '',
    professionalRegistry: professionalData?.register || '',
    professionalSpecialty: 'Musicoterapia'
  });

  const updateReportData = useCallback((updates: Partial<ReportData>) => {
    setReportData(prev => ({ ...prev, ...updates }));
  }, []);

  const generateWithAI = useCallback(async (keyPoints: string) => {
    setIsGeneratingWithAI(true);
    
    try {
      // Simulated AI generation with musicotherapy-specific content
      const aiContent = {
        therapeutic_objectives: `Baseado nas observações "${keyPoints}", os objetivos incluem desenvolver expressão musical como comunicação alternativa, promover autorregulação emocional através de atividades rítmicas estruturadas, e estimular interação social por meio de dinâmicas musicais colaborativas específicas para TEA.`,
        
        session_activities: `Durante a sessão, considerando "${keyPoints}", foram implementadas atividades de exploração dirigida de instrumentos de percussão com diferentes texturas, exercícios de imitação rítmica utilizando movimento corporal integrado, e momentos de improvisação musical dirigida para expressão emocional autêntica.`,
        
        patient_evolution: `O paciente demonstrou "${keyPoints}" e apresentou resposta musical progressiva, evidenciando maior engajamento com atividades rítmicas estruturadas, desenvolvimento na capacidade de imitação de padrões musicais simples, e utilização crescente da música como recurso de autorregulação emocional.`,
        
        recommendations: `Baseado na evolução observada e considerando "${keyPoints}", recomenda-se manutenção da frequência semanal com expansão gradual do repertório instrumental, implementação de atividades musicais estruturadas no ambiente familiar, e desenvolvimento de playlist personalizada para momentos de autorregulação no cotidiano.`,
        
        conclusion: `A musicoterapia tem se mostrado ferramenta fundamental para este perfil específico. Considerando "${keyPoints}", os resultados evidenciam potencial significativo da abordagem musical, justificando continuidade e aprofundamento das intervenções musicoterapêuticas especializadas para TEA.`
      };

      updateReportData({
        fieldValues: { ...reportData.fieldValues, ...aiContent }
      });

      toast({
        title: "Relatório de Musicoterapia gerado!",
        description: "Conteúdo especializado criado com base nas suas observações.",
      });

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro na geração",
        description: "Não foi possível gerar o relatório automaticamente.",
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