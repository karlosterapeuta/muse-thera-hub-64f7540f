import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SelectField } from "./components/SelectField";
import { PatientSelect } from "../anamnesis/components/PatientSelect";
import { ModernFormCard } from "../anamnesis/components/ModernFormCard";
import { TreatmentPlanHeader } from "./components/TreatmentPlanHeader";
import { TreatmentPlanActions } from "./components/TreatmentPlanActions";
import { treatmentPlanSections } from "./components/TreatmentPlanSections";
import { useTreatmentPlanData } from "./hooks/useTreatmentPlanData";
import html2pdf from "html2pdf.js";
import { 
  FileText, 
  Users,
} from "lucide-react";
import {
  translateApproachType,
  translateInterventionFrequency,
  translateSessionDuration,
  translateTreatmentModel,
  translateMusicalMethods,
  translateTherapeuticFocus,
  translateExpectedOutcomes,
  translateInterventionStrategies,
  translateMusicalResources
} from "./utils/translationHelpers";

export default function TreatmentPlanForm() {
  const { isLoading, patients, userEmail, userName } = useTreatmentPlanData();
  const [selectedPatient, setSelectedPatient] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    approach_type: "",
    intervention_frequency: "",
    session_duration: "",
    treatment_model: "",
    musical_methods: "",
    therapeutic_focus: "",
    expected_outcomes: "",
    evaluation_criteria: "",
    intervention_strategies: "",
    musical_resources: "",
    additional_notes: "",
  });

  const generatePDF = async () => {
    const element = document.createElement('div');
    
    const generateContentHTML = (content: Record<string, any>) => {
      const translatedContent = {
        ...content,
        approach_type: content.approach_type ? translateApproachType(content.approach_type) : '',
        intervention_frequency: content.intervention_frequency ? translateInterventionFrequency(content.intervention_frequency) : '',
        session_duration: content.session_duration ? translateSessionDuration(content.session_duration) : '',
        treatment_model: content.treatment_model ? translateTreatmentModel(content.treatment_model) : '',
        musical_methods: content.musical_methods ? translateMusicalMethods(content.musical_methods) : '',
        therapeutic_focus: content.therapeutic_focus ? translateTherapeuticFocus(content.therapeutic_focus) : '',
        expected_outcomes: content.expected_outcomes ? translateExpectedOutcomes(content.expected_outcomes) : '',
        intervention_strategies: content.intervention_strategies ? translateInterventionStrategies(content.intervention_strategies) : '',
        musical_resources: content.musical_resources ? translateMusicalResources(content.musical_resources) : '',
        additional_notes: content.additional_notes || ''
      };

      const sections = [
        {
          title: "Configuração do Tratamento",
          fields: [
            { key: "approach_type", label: "Abordagem Terapêutica" },
            { key: "intervention_frequency", label: "Frequência das Intervenções" },
            { key: "session_duration", label: "Duração das Sessões" }
          ]
        },
        {
          title: "Metodologia e Recursos",
          fields: [
            { key: "treatment_model", label: "Modelo de Tratamento" },
            { key: "musical_methods", label: "Métodos Musicais" }
          ]
        },
        {
          title: "Objetivos e Avaliação",
          fields: [
            { key: "therapeutic_focus", label: "Foco Terapêutico" },
            { key: "expected_outcomes", label: "Resultados Esperados" }
          ]
        },
        {
          title: "Estratégias e Recursos",
          fields: [
            { key: "intervention_strategies", label: "Estratégias de Intervenção" },
            { key: "musical_resources", label: "Recursos Musicais" }
          ]
        },
        {
          title: "Observações Adicionais",
          fields: [
            { key: "additional_notes", label: "Notas Complementares" }
          ]
        }
      ];

      return sections
        .map(section => {
          const sectionContent = section.fields
            .filter(field => translatedContent[field.key])
            .map(field => `
              <div style="margin-bottom: 16px;">
                <div style="font-weight: 600; font-size: 13px; margin-bottom: 4px; color: #374151;">
                  ${field.label}
                </div>
                <div style="background-color: #F9FAFB; padding: 8px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 12px; line-height: 1.5; color: #1F2937; white-space: pre-wrap;">
                  ${String(translatedContent[field.key] || '').split('\n').join('<br>')}
                </div>
              </div>
            `)
            .join('');

          if (sectionContent) {
            return `
              <div style="margin-bottom: 24px;">
                <h2 style="color: #1F2937; font-size: 16px; font-weight: 600; margin-bottom: 12px; padding-bottom: 4px; border-bottom: 2px solid #E5E7EB;">
                  ${section.title}
                </h2>
                ${sectionContent}
              </div>
            `;
          }
          return '';
        })
        .join('');
    };

    try {
      const selectedPatientData = patients.find(p => p.id === selectedPatient);
      element.innerHTML = `
        <div style="padding: 40px; font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #E5E7EB;">
            <div style="margin-bottom: 24px;">
              <img src="/lovable-uploads/86b61f63-0028-428c-90d1-44c71413e24a.png" style="width: 200px; height: auto; margin: 0 auto;">
            </div>
            <h1 style="color: #2563EB; font-size: 24px; font-weight: bold; margin-bottom: 12px;">
              Plano Terapêutico Musicoterapêutico
            </h1>
            <h2 style="color: #1F2937; font-size: 18px; margin-bottom: 8px;">
              Paciente: ${selectedPatientData?.name || 'Não informado'}
            </h2>
            <p style="color: #6B7280; font-size: 14px;">
              Data: ${new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          <div style="margin-bottom: 32px;">
            ${generateContentHTML(formData)}
          </div>

          <div style="margin-top: 32px; padding-top: 24px; border-top: 2px solid #E5E7EB; text-align: center;">
            <p style="color: #6B7280; font-size: 11px; margin-bottom: 4px;">
              Documento gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}
            </p>
            <p style="color: #6B7280; font-size: 11px; margin-bottom: 4px;">
              Musetera - Sistema de Gestão para Musicoterapia
            </p>
            <p style="color: #6B7280; font-size: 11px; margin-bottom: 4px;">
              Musicoterapeuta: ${userName || 'Não informado'}
            </p>
            <p style="color: #6B7280; font-size: 11px;">
              Email: ${userEmail || 'Não informado'}
            </p>
          </div>
        </div>
      `;

      const opt = {
        margin: [20, 20, 20, 20],
        filename: `Plano Terapêutico - ${selectedPatientData?.name || 'Sem Nome'}.pdf`,
        pagebreak: { mode: 'avoid-all' },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
        },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          backgroundColor: '#ffffff',
        },
      };

      await html2pdf().from(element).set(opt).save();

    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o PDF. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPatient) {
      toast({
        title: "Atenção",
        description: "Por favor, selecione um paciente.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data: professionalData, error: professionalError } = await supabase
        .from("professionals")
        .select("id")
        .eq("user_id", user.id)
        .single();

      let professional_id = user.id;
      
      if (professionalData && !professionalError) {
        professional_id = professionalData.id;
      } else {
        console.log("Profissional não encontrado, usando user_id como professional_id");
      }

      const { error } = await supabase
        .from("treatment_plans")
        .insert({
          ...formData,
          patient_id: selectedPatient,
          professional_id: professional_id,
          status: "active",
          created_at: new Date().toISOString(),
        });

      if (error) throw error;

      await generatePDF();

      toast({
        title: "Sucesso!",
        description: "Plano terapêutico salvo e PDF gerado com sucesso.",
      });

      navigate("/processes");
    } catch (error) {
      console.error("Erro ao salvar plano terapêutico:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o plano terapêutico.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-slate-600 font-medium">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      <div className="container mx-auto p-6 space-y-8 max-w-6xl">
        <TreatmentPlanHeader />

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Patient Selection Card */}
          <ModernFormCard
            title="Seleção do Paciente"
            icon={Users}
            gradient="from-teal-500 to-teal-600"
            className="transform hover:scale-[1.02] transition-all duration-300"
          >
            <PatientSelect
              patients={patients}
              selectedPatient={selectedPatient}
              onSelect={setSelectedPatient}
              isLoading={isLoading}
              emptyMessage="Nenhum paciente encontrado para sua conta"
            />
          </ModernFormCard>

          {/* Dynamic Sections */}
          {treatmentPlanSections.map((section) => (
            <ModernFormCard
              key={section.title}
              title={section.title}
              icon={section.icon}
              gradient={section.gradient}
              className="transform hover:scale-[1.02] transition-all duration-300"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {section.fields.map((field) => (
                  <SelectField
                    key={field.key}
                    label={field.label}
                    value={formData[field.key as keyof typeof formData]}
                    onChange={(value) => handleInputChange(field.key as keyof typeof formData, value)}
                    options={field.options}
                  />
                ))}
              </div>
            </ModernFormCard>
          ))}

          {/* Additional Notes */}
          <ModernFormCard
            title="Observações Complementares"
            icon={FileText}
            gradient="from-indigo-500 to-indigo-600"
            className="transform hover:scale-[1.02] transition-all duration-300"
          >
            <div className="space-y-3">
              <Label className="text-base font-medium text-gray-700">
                Notas Complementares
              </Label>
              <Textarea
                value={formData.additional_notes}
                onChange={(e) => handleInputChange("additional_notes", e.target.value)}
                placeholder="Adicione informações complementares relevantes para o plano terapêutico, observações especiais, considerações importantes ou instruções específicas..."
                className="min-h-32 resize-y border-2 border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
              />
            </div>
          </ModernFormCard>

          {/* Action Buttons */}
          <TreatmentPlanActions
            onCancel={() => navigate("/processes")}
            onSubmit={handleSubmit}
          />
        </form>
      </div>
    </div>
  );
}
