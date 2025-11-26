import { useState, createElement } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateReactPDF } from "@/utils/reactPDFGenerator";
import { generateReactPDFPreview } from "@/utils/reactPDFPreview";
import { DevolutivaPreview } from "@/components/devolutiva/DevolutivaPreview";
import { DevolutivaPreviewPDF } from "@/components/devolutiva/DevolutivaPreviewPDF";
import { DevolutivaTextPDF } from "@/components/devolutiva/DevolutivaTextPDF";
import { useProfessionalData } from "@/hooks/useProfessionalData";

export interface DevolutivaFormData {
  patient_id: string;
  patient_name: string;
  session_date: string;
  session_number: number;
  communication: string[];
  emotional_regulation: string[];
  motor_development: string[];
  sensory_aspects: string[];
  musical_participation: string[];
  achievements: string[];
  family_guidelines: string[];
  next_steps: string[];
  general_observations: string[];
  challenges_resistance: string[];
  professional_name: string;
  professional_registry: string;
}

export function useDevolutivaReport() {
  const { toast } = useToast();
  const { data: professionalData } = useProfessionalData();
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [isGeneratingAIText, setIsGeneratingAIText] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);

  const [customTexts, setCustomTexts] = useState<Record<string, string>>({
    communication: '',
    emotional_regulation: '',
    motor_development: '',
    sensory_aspects: '',
    musical_participation: '',
    achievements: '',
    family_guidelines: '',
    next_steps: '',
    general_observations: '',
    challenges_resistance: ''
  });

  const combineText = (phrases: string[], customText: string): string => {
    if (customText) return customText;
    return phrases.join('. ') + (phrases.length > 0 ? '.' : '');
  };

  const saveReport = async (formData: DevolutivaFormData, professionalId: string) => {
    try {
      setIsSaving(true);

      const reportContent = {
        report_subtype: 'devolutiva_tea',
        patient_name: formData.patient_name,
        session_date: formData.session_date,
        session_number: formData.session_number,
        communication: combineText(formData.communication, customTexts.communication),
        emotional_regulation: combineText(formData.emotional_regulation, customTexts.emotional_regulation),
        motor_development: combineText(formData.motor_development, customTexts.motor_development),
        sensory_aspects: combineText(formData.sensory_aspects, customTexts.sensory_aspects),
        musical_participation: combineText(formData.musical_participation, customTexts.musical_participation),
        achievements: combineText(formData.achievements, customTexts.achievements),
        family_guidelines: combineText(formData.family_guidelines, customTexts.family_guidelines),
        next_steps: combineText(formData.next_steps, customTexts.next_steps),
        general_observations: combineText(formData.general_observations, customTexts.general_observations),
        challenges_resistance: combineText(formData.challenges_resistance, customTexts.challenges_resistance),
        professional_name: formData.professional_name,
        professional_registry: formData.professional_registry
      };

      const { error } = await supabase
        .from('reports')
        .insert({
          professional_id: professionalId,
          patient_id: formData.patient_id,
          type: 'musicoterapia' as any,
          content: reportContent as any
        });

      if (error) throw error;

      toast({
        title: "Devolutiva salva!",
        description: "A devolutiva foi salva com sucesso."
      });

      return true;
    } catch (error) {
      console.error('Error saving report:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a devolutiva.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const generatePDF = async (formData: DevolutivaFormData) => {
    try {
      setIsGeneratingPDF(true);

      // Validar dados essenciais
      if (!formData.patient_name) {
        throw new Error('Nome do paciente é obrigatório');
      }
      
      console.log('📋 Iniciando geração de PDF para:', formData.patient_name);
      console.log('📋 Dados completos para PDF:', {
        patient_name: formData.patient_name,
        session_date: formData.session_date,
        hasCustomTexts: Object.keys(customTexts).filter(k => customTexts[k]).length,
      });

      const previewData = {
        patient_name: formData.patient_name,
        session_date: formData.session_date,
        session_number: formData.session_number,
        communication: combineText(formData.communication, customTexts.communication),
        emotional_regulation: combineText(formData.emotional_regulation, customTexts.emotional_regulation),
        motor_development: combineText(formData.motor_development, customTexts.motor_development),
        sensory_aspects: combineText(formData.sensory_aspects, customTexts.sensory_aspects),
        musical_participation: combineText(formData.musical_participation, customTexts.musical_participation),
        achievements: combineText(formData.achievements, customTexts.achievements),
        family_guidelines: combineText(formData.family_guidelines, customTexts.family_guidelines),
        next_steps: combineText(formData.next_steps, customTexts.next_steps),
        general_observations: combineText(formData.general_observations, customTexts.general_observations),
        challenges_resistance: combineText(formData.challenges_resistance, customTexts.challenges_resistance),
        professional_name: formData.professional_name,
        professional_registry: formData.professional_registry,
        digital_signature_url: professionalData?.digital_signature_url,
        digital_stamp_url: professionalData?.digital_stamp_url
      };

      // Usar componente PDF-específico com estilos inline
      const component = createElement(DevolutivaPreviewPDF, { data: previewData });
      const fileName = `Devolutiva_${formData.patient_name}_${new Date().toISOString().split('T')[0]}.pdf`;

      const success = await generateReactPDF(component, { 
        filename: fileName,
        format: 'a4',
        orientation: 'portrait'
      });

      if (success) {
        toast({
          title: "PDF gerado!",
          description: "O PDF da devolutiva foi gerado com sucesso."
        });
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Erro ao gerar PDF",
        description: "Não foi possível gerar o PDF da devolutiva.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const previewPDF = async (formData: DevolutivaFormData) => {
    try {
      setIsGeneratingPreview(true);

      // Validar dados essenciais
      if (!formData.patient_name) {
        throw new Error('Nome do paciente é obrigatório');
      }

      const previewData = {
        patient_name: formData.patient_name,
        session_date: formData.session_date,
        session_number: formData.session_number,
        communication: combineText(formData.communication, customTexts.communication),
        emotional_regulation: combineText(formData.emotional_regulation, customTexts.emotional_regulation),
        motor_development: combineText(formData.motor_development, customTexts.motor_development),
        sensory_aspects: combineText(formData.sensory_aspects, customTexts.sensory_aspects),
        musical_participation: combineText(formData.musical_participation, customTexts.musical_participation),
        achievements: combineText(formData.achievements, customTexts.achievements),
        family_guidelines: combineText(formData.family_guidelines, customTexts.family_guidelines),
        next_steps: combineText(formData.next_steps, customTexts.next_steps),
        general_observations: combineText(formData.general_observations, customTexts.general_observations),
        challenges_resistance: combineText(formData.challenges_resistance, customTexts.challenges_resistance),
        professional_name: formData.professional_name,
        professional_registry: formData.professional_registry
      };

      const component = createElement(DevolutivaPreview, { data: previewData });
      const pdfUrl = await generateReactPDFPreview(component, {
        format: 'a4',
        orientation: 'portrait'
      });

      if (pdfUrl) {
        setPdfPreviewUrl(pdfUrl);
        return pdfUrl;
      } else {
        toast({
          title: "Erro ao gerar preview",
          description: "Não foi possível gerar o preview do PDF.",
          variant: "destructive"
        });
        return null;
      }
    } catch (error) {
      console.error('Error generating PDF preview:', error);
      toast({
        title: "Erro ao gerar preview",
        description: "Não foi possível gerar o preview do PDF.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  const clearPreview = () => {
    if (pdfPreviewUrl) {
      URL.revokeObjectURL(pdfPreviewUrl);
      setPdfPreviewUrl(null);
    }
  };

  const classifyPhrases = (formData: DevolutivaFormData) => {
    const positives: string[] = [];
    const challenges: string[] = [];
    
    // Palavras-chave que indicam desafios/negativos
    const negativeKeywords = [
      'não', 'dificuldade', 'resistência', 'evitou', 'recusou', 
      'baixa', 'regressão', 'desregulação', 'hipersensibilidade',
      'ausente', 'limitado', 'inconsistente', 'pouca', 'pouco'
    ];
    
    // Challenges/Resistance são sempre negativos
    challenges.push(...formData.challenges_resistance);
    
    // Analisar outras categorias
    const categoriesToAnalyze = [
      { key: 'communication' as keyof DevolutivaFormData, phrases: formData.communication },
      { key: 'emotional_regulation' as keyof DevolutivaFormData, phrases: formData.emotional_regulation },
      { key: 'motor_development' as keyof DevolutivaFormData, phrases: formData.motor_development },
      { key: 'sensory_aspects' as keyof DevolutivaFormData, phrases: formData.sensory_aspects },
      { key: 'musical_participation' as keyof DevolutivaFormData, phrases: formData.musical_participation },
      { key: 'achievements' as keyof DevolutivaFormData, phrases: formData.achievements }
    ];
    
    categoriesToAnalyze.forEach(({ phrases }) => {
      phrases.forEach((phrase: string) => {
        const isNegative = negativeKeywords.some(kw => 
          phrase.toLowerCase().includes(kw)
        );
        if (isNegative) {
          challenges.push(phrase);
        } else {
          positives.push(phrase);
        }
      });
    });
    
    return { positives, challenges };
  };

  const generateAIPDF = async (formData: DevolutivaFormData) => {
    try {
      setIsGeneratingAIText(true);

      if (!formData.patient_name) {
        throw new Error('Nome do paciente é obrigatório');
      }

      console.log('🤖 Iniciando geração de texto via IA...');

      // Classificar frases
      const { positives, challenges } = classifyPhrases(formData);
      
      console.log('📊 Classificação:', {
        positives: positives.length,
        challenges: challenges.length
      });

      // Chamar edge function
      const { data, error } = await supabase.functions.invoke('generate-devolutiva-text', {
        body: {
          patientName: formData.patient_name,
          sessionDate: formData.session_date,
          sessionNumber: formData.session_number,
          positives,
          challenges,
          familyGuidelines: formData.family_guidelines
        }
      });

      if (error) {
        console.error('❌ Erro ao chamar edge function:', error);
        throw error;
      }

      console.log('✅ Texto gerado com sucesso pela IA');

      // Preparar dados para o PDF
      const pdfData = {
        patient_name: formData.patient_name,
        session_date: formData.session_date,
        session_number: formData.session_number,
        professional_name: formData.professional_name,
        professional_registry: formData.professional_registry,
        digital_signature_url: professionalData?.digital_signature_url,
        digital_stamp_url: professionalData?.digital_stamp_url,
        aiContent: data.content
      };

      // Gerar PDF
      const component = createElement(DevolutivaTextPDF, { data: pdfData });
      const fileName = `Devolutiva_IA_${formData.patient_name}_${new Date().toISOString().split('T')[0]}.pdf`;

      const success = await generateReactPDF(component, { 
        filename: fileName,
        format: 'a4',
        orientation: 'portrait'
      });

      if (success) {
        toast({
          title: "PDF com IA gerado!",
          description: "O PDF profissional foi gerado com sucesso."
        });
      }
    } catch (error: any) {
      console.error('❌ Error generating AI PDF:', error);
      
      let errorMessage = "Não foi possível gerar o PDF com IA.";
      
      if (error.message?.includes('Rate limit')) {
        errorMessage = "Rate limit excedido. Por favor, aguarde alguns instantes e tente novamente.";
      } else if (error.message?.includes('Créditos insuficientes')) {
        errorMessage = "Créditos insuficientes. Por favor, adicione créditos à sua conta Lovable AI.";
      }
      
      toast({
        title: "Erro ao gerar PDF com IA",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsGeneratingAIText(false);
    }
  };

  return {
    saveReport,
    generatePDF,
    generateAIPDF,
    previewPDF,
    clearPreview,
    isSaving,
    isGeneratingPDF,
    isGeneratingAIText,
    isGeneratingPreview,
    pdfPreviewUrl,
    customTexts,
    setCustomTexts
  };
}
