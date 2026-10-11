import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { musicoterapiaTemplate, type ReportData } from '@/data/musicoterapiaTemplate';
import { getMusicoterapiaQualityWarnings } from '@/utils/musicoterapiaQuality';
import { getSelectedMusicoterapiaObjectives } from '@/data/musicoterapiaObjectives';
import { getSelectedMusicoterapiaApproaches } from '@/data/musicoterapiaApproaches';
import { getRecordedApproachResults, getApproachResultsValidationIssues, summarizeApproachResult } from '@/data/musicoterapiaApproachResults';
import { getObjectiveOutcomes, getPendingObjectiveInterventions, getObjectiveOutcomesValidationIssues, getObjectiveOutcomeLabel } from '@/data/musicoterapiaObjectiveOutcomes';
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

  // Aceita atualização atômica para impedir que uma consulta assíncrona
  // substitua edições já feitas em outro campo ou dados de outro paciente.
  const updateReportData = useCallback((
    updates: Partial<ReportData> | ((prev: Partial<ReportData>) => Partial<ReportData>)
  ) => {
    setReportData(prev => ({
      ...prev,
      ...(typeof updates === 'function' ? updates(prev) : updates)
    }));
  }, []);

  const generateWithAI = useCallback(async () => {
    setIsGeneratingWithAI(true);
    
    try {

      
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



      if (data.success && data.organizedContent) {
        // Converter texto organizado em arrays se necessário
        const organizedFields: Record<string, any> = {};
        
        Object.entries(data.organizedContent).forEach(([key, value]) => {
          // Objetivos selecionados são decisões do profissional: a IA não pode alterá-los.
          if (key === 'therapeutic_objective_ids' || key === 'musicoterapia_approach_ids' || key === 'approach_results' || key === 'objective_outcomes') return;
          // Não acrescentar ao prontuário campos não enviados pelo profissional.
          if (!Object.prototype.hasOwnProperty.call(reportData.fieldValues || {}, key)) return;
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
        const { therapeutic_objective_ids: _unusedObjectiveIds, musicoterapia_approach_ids: _unusedApproachIds, approach_results: _unusedApproachResults, objective_outcomes: _unusedObjectiveOutcomes, ...fallbackFields } = data.fallbackContent || {};
        const newFieldValues = { ...reportData.fieldValues, ...fallbackFields };

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
      const selectedObjectives = getSelectedMusicoterapiaObjectives(payload.fieldValues?.therapeutic_objective_ids);
      const selectedApproaches = getSelectedMusicoterapiaApproaches(payload.fieldValues?.musicoterapia_approach_ids);
      const recordedResults = getRecordedApproachResults(payload.fieldValues?.musicoterapia_approach_ids, payload.fieldValues?.approach_results);
      const objectiveOutcomes = getObjectiveOutcomes(payload.fieldValues?.therapeutic_objective_ids, payload.fieldValues?.objective_outcomes);
      const pendingObjectives = getPendingObjectiveInterventions(payload.fieldValues?.therapeutic_objective_ids, payload.fieldValues?.objective_outcomes);
      // Enviar os objetivos por extenso apenas como contexto da narrativa, sem
      // gravar texto gerado automaticamente ou tratar objetivos como conquistas.
      const narrativePayload = {
        ...payload,
        fieldValues: {
          ...payload.fieldValues,
          ...(selectedObjectives.length > 0 ? {
            therapeutic_objectives_selected_descriptions: selectedObjectives.map(
              (objective) => `${objective.title}: ${objective.objective}`
            ),
            therapeutic_objectives_selection_note: 'Estes são objetivos planejados para estimulação, não resultados observados nem habilidades comprovadas.'
          } : {}),
          ...(objectiveOutcomes.length > 0 ? {
            observed_results_by_objective: objectiveOutcomes.map(({objective,status}) => ({
              objetivo: objective.title,
              situacao_registrada: getObjectiveOutcomeLabel(status)
            })),
            intervention_needs_derived_from_objectives: pendingObjectives.map(({objective,status}) => ({
              objetivo: objective.title,
              resultado: getObjectiveOutcomeLabel(status)
            })),
            clinical_interpretation_note: 'As necessidades foram derivadas das classificações por objetivo feitas pelo profissional; não concluir causalidade ou progresso fora do que foi informado.'
          } : {}),
          ...(recordedResults.length > 0 ? { observed_results_by_approach: recordedResults.map(({ approach, result }) => ({ approach: approach.title, response: summarizeApproachResult(result) })) } : {}),
          ...(selectedApproaches.length > 0 ? {
            musicoterapia_approaches_selected_descriptions: selectedApproaches.map(
              (approach) => `${approach.title}: ${approach.description} Objetivos possíveis: ${approach.goals}`
            ),
            musicoterapia_approaches_selection_note: 'Estas abordagens foram selecionadas pelo profissional, mas a seleção isolada não comprova execução, técnica específica nem benefício observado.'
          } : {})
        }
      };
      const { data, error } = await supabase.functions.invoke('generate-tea-narrative', {
        body: { reportData: narrativePayload }
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

    
    // Validar campos básicos
    const basicErrors = [];
    if (!reportData.selectedPatientId) basicErrors.push('Paciente deve ser selecionado');
    if (!professionalData?.id) basicErrors.push('Dados do profissional não encontrados');
    if (!reportData.professionalName?.trim()) basicErrors.push('Nome do profissional deve ser informado');
    
    // Validar campos obrigatórios do template
    const requiredFields = musicoterapiaTemplate.fields.filter(field => field.required);
    const missingFields = requiredFields.filter(field => {
      const value = reportData.fieldValues?.[field.id];
      return !value || (Array.isArray(value) && value.length === 0) || 
             (typeof value === 'string' && value.trim() === '');
    });

    // O catálogo aprovado de 27 objetivos é a única opção de seleção na etapa.
    // Os textos antigos ficam preservados para consulta histórica, mas não
    // substituem a seleção em novos documentos ou novas versões.
    const objectiveSelection = getSelectedMusicoterapiaObjectives(reportData.fieldValues?.therapeutic_objective_ids);
    const approachSelection = getSelectedMusicoterapiaApproaches(reportData.fieldValues?.musicoterapia_approach_ids);

    const allErrors = [
      ...basicErrors,
      ...missingFields.map(field => field.label),
      ...(objectiveSelection.length === 0
        ? ['Selecione pelo menos um dos 27 objetivos terapêuticos']
        : []),
      ...(approachSelection.length === 0
        ? ['Selecione pelo menos uma abordagem musicoterapêutica da Etapa 03']
        : []),
      ...getApproachResultsValidationIssues(reportData.fieldValues?.musicoterapia_approach_ids, reportData.fieldValues?.approach_results),
      ...getObjectiveOutcomesValidationIssues(reportData.fieldValues?.therapeutic_objective_ids, reportData.fieldValues?.objective_outcomes)
    ];



    return {
      isValid: allErrors.length === 0,
      missingFields: allErrors,
      clinicalWarnings: getMusicoterapiaQualityWarnings(reportData)
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