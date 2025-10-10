import { useState, createElement } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateStaticPDF } from "@/utils/staticPDFGenerator";
import { DevolutivaPreview } from "@/components/devolutiva/DevolutivaPreview";

export interface DevolutivaFormData {
  patient_id: string;
  patient_name: string;
  session_date: string;
  session_number: number;
  arrival_state: string[];
  communication: string[];
  emotional_regulation: string[];
  motor_development: string[];
  sensory_aspects: string[];
  musical_participation: string[];
  achievements: string[];
  family_guidelines: string[];
  next_steps: string[];
  general_observations: string[];
  professional_name: string;
  professional_registry: string;
}

export function useDevolutivaReport() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const [customTexts, setCustomTexts] = useState<Record<string, string>>({
    arrival_state: '',
    communication: '',
    emotional_regulation: '',
    motor_development: '',
    sensory_aspects: '',
    musical_participation: '',
    achievements: '',
    family_guidelines: '',
    next_steps: '',
    general_observations: ''
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
        arrival_state: combineText(formData.arrival_state, customTexts.arrival_state),
        communication: combineText(formData.communication, customTexts.communication),
        emotional_regulation: combineText(formData.emotional_regulation, customTexts.emotional_regulation),
        motor_development: combineText(formData.motor_development, customTexts.motor_development),
        sensory_aspects: combineText(formData.sensory_aspects, customTexts.sensory_aspects),
        musical_participation: combineText(formData.musical_participation, customTexts.musical_participation),
        achievements: combineText(formData.achievements, customTexts.achievements),
        family_guidelines: combineText(formData.family_guidelines, customTexts.family_guidelines),
        next_steps: combineText(formData.next_steps, customTexts.next_steps),
        general_observations: combineText(formData.general_observations, customTexts.general_observations),
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

      const previewData = {
        patient_name: formData.patient_name,
        session_date: formData.session_date,
        session_number: formData.session_number,
        arrival_state: combineText(formData.arrival_state, customTexts.arrival_state),
        communication: combineText(formData.communication, customTexts.communication),
        emotional_regulation: combineText(formData.emotional_regulation, customTexts.emotional_regulation),
        motor_development: combineText(formData.motor_development, customTexts.motor_development),
        sensory_aspects: combineText(formData.sensory_aspects, customTexts.sensory_aspects),
        musical_participation: combineText(formData.musical_participation, customTexts.musical_participation),
        achievements: combineText(formData.achievements, customTexts.achievements),
        family_guidelines: combineText(formData.family_guidelines, customTexts.family_guidelines),
        next_steps: combineText(formData.next_steps, customTexts.next_steps),
        general_observations: combineText(formData.general_observations, customTexts.general_observations),
        professional_name: formData.professional_name,
        professional_registry: formData.professional_registry
      };

      const component = createElement(DevolutivaPreview, { data: previewData });
      const fileName = `Devolutiva_${formData.patient_name}_${new Date().toISOString().split('T')[0]}.pdf`;

      await generateStaticPDF(component, { filename: fileName });

      toast({
        title: "PDF gerado!",
        description: "O PDF da devolutiva foi gerado com sucesso."
      });
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

  return {
    saveReport,
    generatePDF,
    isSaving,
    isGeneratingPDF,
    customTexts,
    setCustomTexts
  };
}
