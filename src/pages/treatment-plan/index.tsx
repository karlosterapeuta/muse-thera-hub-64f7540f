import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, User, Brain, Heart, MessageSquare, Zap, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useProfessionalData } from "@/hooks/useProfessionalData";
import { SelectField } from "./components/SelectField";
import { generateStaticPDF } from "@/utils/staticPDFGenerator";
import { TreatmentPlanPDFContent } from "@/components/TreatmentPlanPDFContent";

interface FormData {
  patient_name: string;
  therapist_name: string;
  patient_age: string;
  therapy_location: string;
  main_complaint: string;
  therapy_goal: string;
  planned_sessions: string;
  session_frequency: string;
  additional_notes: string;
  sensory_auditory: number;
  sensory_visual: number;
  sensory_tactile: number;
  sensory_proprioceptive: number;
  sensory_vestibular: number;
  communication_verbal: number;
  communication_nonverbal: number;
  communication_receptive: number;
  communication_expressive: number;
  communication_social: number;
  behavioral_repetitive: number;
  behavioral_restricted: number;
  behavioral_transitions: number;
  behavioral_flexibility: number;
  behavioral_self_regulation: number;
}

type Patient = {
  id: string;
  name: string;
  age?: number;
  birth_date?: string;
};

function TreatmentPlanForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: professionalData } = useProfessionalData();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data, error } = await supabase
          .from("patients")
          .select("id, name, age, birth_date");

        if (error) {
          throw error;
        }

        if (data) {
          setPatients(data);
        }
      } catch (error: any) {
        console.error("Error fetching patients:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Failed to load patients.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, [toast]);

  const handlePatientSelect = useCallback((value: string) => {
    setSelectedPatient(value);
    const patient = patients.find((p) => p.id === value);
    if (patient) {
      // Calculate age from birth_date or use direct age field
      let patientAge = "";
      if (patient.age) {
        patientAge = `${patient.age} anos`;
      } else if (patient.birth_date) {
        const birthDate = new Date(patient.birth_date);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          patientAge = `${age - 1} anos`;
        } else {
          patientAge = `${age} anos`;
        }
      }

      setFormData(prev => ({
        ...prev,
        patient_name: patient.name,
        patient_age: patientAge,
      }));
    }
  }, [patients]);
  
  const [formData, setFormData] = useState<FormData>({
    patient_name: "",
    therapist_name: "",
    patient_age: "",
    therapy_location: "",
    main_complaint: "",
    therapy_goal: "",
    planned_sessions: "",
    session_frequency: "",
    additional_notes: "",
    sensory_auditory: 5,
    sensory_visual: 5,
    sensory_tactile: 5,
    sensory_proprioceptive: 5,
    sensory_vestibular: 5,
    communication_verbal: 5,
    communication_nonverbal: 5,
    communication_receptive: 5,
    communication_expressive: 5,
    communication_social: 5,
    behavioral_repetitive: 5,
    behavioral_restricted: 5,
    behavioral_transitions: 5,
    behavioral_flexibility: 5,
    behavioral_self_regulation: 5,
  });

  const handleInputChange = useCallback((field: keyof FormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Auto-fill therapist name when professional data loads
  useEffect(() => {
    if (professionalData && !formData.therapist_name) {
      setFormData(prev => ({
        ...prev,
        therapist_name: professionalData.name || "",
      }));
    }
  }, [professionalData, formData.therapist_name]);

  const handleDownloadPDF = useCallback(async () => {
    try {
      console.log("📄 Gerando PDF do Plano de Tratamento...");
      
      // Convert current form data to PDF component format
      const pdfData = {
        patient_name: formData.patient_name,
        therapist_name: formData.therapist_name,
        age: formData.patient_age,
        diagnosis: "TEA - Transtorno do Espectro Autista",
        treatment_date: new Date().toISOString().split('T')[0],
        session_frequency: formData.session_frequency,
        treatment_duration: formData.planned_sessions ? `${formData.planned_sessions} sessões` : "",
        therapy_goals: formData.therapy_goal,
        intervention_techniques: `Metodologias Especializadas:
• Método MUSICOGRAM® - Criação de representações visuais da música
• Técnicas de Improvisação Musical Terapêutica
• Estimulação Sensorial através de Instrumentos Musicais
• Desenvolvimento de Habilidades Sociais via Atividades Musicais
• Regulação Emocional através de Técnicas Musicoterapêuticas

Local da Terapia: ${formData.therapy_location}
Queixa Principal: ${formData.main_complaint}`,
        additional_notes: formData.additional_notes,
        // Map current form fields to TEA assessment fields
        sensory_hypo: String(formData.sensory_auditory),
        sensory_hyper: String(formData.sensory_visual),
        sensory_seeking: String(formData.sensory_tactile),
        social_interaction: String(formData.communication_social),
        social_communication: String(formData.communication_verbal),
        social_motivation: String(formData.communication_nonverbal),
        repetitive_motor: String(formData.behavioral_repetitive),
        repetitive_verbal: String(formData.communication_receptive),
        repetitive_interests: String(formData.behavioral_restricted),
        change_routine: String(formData.behavioral_transitions),
        change_environment: String(formData.behavioral_flexibility),
        change_unexpected: String(formData.behavioral_self_regulation),
      };

      const component = React.createElement(TreatmentPlanPDFContent, { formData: pdfData });

      const success = await generateStaticPDF(component, {
        filename: `Plano_Terapeutico_${formData.patient_name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
        waitTime: 5000,
        quality: 2.0,
        format: 'a4',
        orientation: 'portrait'
      });

      if (success) {
        toast({
          title: "PDF gerado com sucesso!",
          description: "O plano terapêutico foi baixado com visual profissional.",
        });
        console.log("✅ PDF do plano de tratamento gerado com sucesso!");
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao gerar PDF",
          description: "Não foi possível gerar o arquivo PDF.",
        });
        console.log("❌ Erro ao gerar PDF do plano de tratamento");
      }
    } catch (error) {
      console.error("❌ Erro ao gerar PDF do plano de tratamento:", error);
      toast({
        variant: "destructive",
        title: "Erro ao gerar PDF",
        description: "Erro inesperado ao gerar o PDF. Tente novamente.",
      });
    }
  }, [formData, toast]);

  const ModernFormCard = ({ title, children, icon: Icon, gradient, className = "" }) => (
    <Card className={`shadow-lg border-0 overflow-hidden ${className}`}>
      <CardHeader className={`bg-gradient-to-r ${gradient} text-white`}>
        <CardTitle className="flex items-center gap-3 text-xl font-semibold">
          <Icon className="w-6 h-6" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 bg-white">
        {children}
      </CardContent>
    </Card>
  );

  const FormField = ({ label, children, className = "" }) => (
    <div className={`space-y-2 ${className}`}>
      <Label className="text-base font-medium text-gray-700">{label}</Label>
      {children}
    </div>
  );

  const ScaleInput = ({ label, value, onChange, options }) => (
    <FormField label={label} className="flex-1">
      <Select value={String(value)} onValueChange={(val) => onChange(Number(val))}>
        <SelectTrigger className="w-full border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200">
          <SelectValue placeholder="Selecione..." />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={String(option.value)}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  );

  const teaSections = [
    {
      id: 'sensory',
      title: 'Perfil Sensorial Musical',
      icon: Brain,
      gradient: 'from-purple-500 to-purple-600',
      fields: [
        { key: 'sensory_auditory', label: 'Processamento Auditivo' },
        { key: 'sensory_visual', label: 'Processamento Visual' },
        { key: 'sensory_tactile', label: 'Processamento Tátil' },
        { key: 'sensory_proprioceptive', label: 'Processamento Proprioceptivo' },
        { key: 'sensory_vestibular', label: 'Processamento Vestibular' },
      ]
    },
    {
      id: 'communication',
      title: 'Comunicação Social Musical',
      icon: MessageSquare,
      gradient: 'from-blue-500 to-blue-600',
      fields: [
        { key: 'communication_verbal', label: 'Comunicação Verbal' },
        { key: 'communication_nonverbal', label: 'Comunicação Não Verbal' },
        { key: 'communication_receptive', label: 'Linguagem Receptiva' },
        { key: 'communication_expressive', label: 'Linguagem Expressiva' },
        { key: 'communication_social', label: 'Interação Social' },
      ]
    },
    {
      id: 'behavioral',
      title: 'Padrões Comportamentais Musicais',
      icon: Zap,
      gradient: 'from-green-500 to-green-600',
      fields: [
        { key: 'behavioral_repetitive', label: 'Comportamentos Repetitivos' },
        { key: 'behavioral_restricted', label: 'Interesses Restritos' },
        { key: 'behavioral_transitions', label: 'Adaptação a Mudanças' },
        { key: 'behavioral_flexibility', label: 'Flexibilidade Cognitiva' },
        { key: 'behavioral_self_regulation', label: 'Autorregulação' },
      ]
    }
  ];

  const scaleOptions = [
    { value: 1, label: "1 - Muito baixo" },
    { value: 2, label: "2 - Baixo" },
    { value: 3, label: "3 - Abaixo da média" },
    { value: 4, label: "4 - Levemente abaixo da média" },
    { value: 5, label: "5 - Médio" },
    { value: 6, label: "6 - Levemente acima da média" },
    { value: 7, label: "7 - Acima da média" },
    { value: 8, label: "8 - Alto" },
    { value: 9, label: "9 - Muito alto" },
    { value: 10, label: "10 - Excelente" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Plano Terapêutico
          </h1>
          <p className="text-xl text-gray-600">
            Estruture um plano terapêutico personalizado com foco em musicoterapia para TEA
          </p>
        </div>

        <form className="space-y-8">
          {/* Patient Information */}
          <ModernFormCard
            title="Informações do Paciente"
            icon={User}
            gradient="from-blue-500 to-blue-600"
            className="transform hover:scale-[1.02] transition-all duration-300"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-base font-medium text-gray-700">Nome do Paciente</Label>
                {isLoading ? (
                  <div className="text-sm text-gray-500">Carregando pacientes...</div>
                ) : patients.length === 0 ? (
                  <div className="text-sm text-gray-500">Nenhum paciente cadastrado. Cadastre pacientes primeiro.</div>
                ) : (
                  <SelectField
                    label=""
                    value={selectedPatient}
                    onChange={handlePatientSelect}
                    options={patients.map(patient => ({
                      value: patient.id,
                      label: patient.name
                    }))}
                  />
                )}
              </div>
              <FormField label="Nome do Terapeuta">
                <Input
                  type="text"
                  value={formData.therapist_name}
                  onChange={(e) => handleInputChange("therapist_name", e.target.value)}
                  placeholder="Nome será preenchido automaticamente"
                  className="border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 bg-gray-50"
                  disabled
                />
              </FormField>
            </div>
            <FormField label="Local da Terapia" className="mt-6">
              <Input
                type="text"
                value={formData.therapy_location}
                onChange={(e) => handleInputChange("therapy_location", e.target.value)}
                placeholder="Ex: Clínica, domicílio, escola..."
                className="border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
              />
            </FormField>
          </ModernFormCard>

          {/* Treatment Information */}
          <ModernFormCard
            title="Informações do Tratamento"
            icon={Heart}
            gradient="from-red-500 to-red-600"
            className="transform hover:scale-[1.02] transition-all duration-300"
          >
            <div className="space-y-6">
              <FormField label="Queixa Principal">
                <Textarea
                  value={formData.main_complaint}
                  onChange={(e) => handleInputChange("main_complaint", e.target.value)}
                  placeholder="Descreva as principais dificuldades e questões que levaram à busca por terapia..."
                  className="min-h-24 resize-y border-2 border-gray-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all duration-200"
                />
              </FormField>
              <FormField label="Objetivo da Terapia">
                <Textarea
                  value={formData.therapy_goal}
                  onChange={(e) => handleInputChange("therapy_goal", e.target.value)}
                  placeholder="Defina os objetivos terapêuticos específicos e metas a serem alcançadas..."
                  className="min-h-24 resize-y border-2 border-gray-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all duration-200"
                />
              </FormField>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Número de Sessões Planejadas">
                  <Input
                    type="number"
                    value={formData.planned_sessions}
                    onChange={(e) => handleInputChange("planned_sessions", e.target.value)}
                    placeholder="Ex: 20 sessões"
                    className="border-2 border-gray-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all duration-200"
                  />
                </FormField>
                <FormField label="Frequência das Sessões">
                  <Select
                    value={formData.session_frequency}
                    onValueChange={(value) => handleInputChange("session_frequency", value)}
                  >
                    <SelectTrigger className="border-2 border-gray-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all duration-200">
                      <SelectValue placeholder="Selecione a frequência" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1x-semana">1x por semana</SelectItem>
                      <SelectItem value="2x-semana">2x por semana</SelectItem>
                      <SelectItem value="3x-semana">3x por semana</SelectItem>
                      <SelectItem value="quinzenal">Quinzenal</SelectItem>
                      <SelectItem value="mensal">Mensal</SelectItem>
                      <SelectItem value="outra">Outra frequência</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
            </div>
          </ModernFormCard>

          {/* TEA Assessment Sections */}
          {teaSections.map((section) => {
            return (
              <ModernFormCard
                key={section.id}
                title={section.title}
                icon={section.icon}
                gradient={section.gradient}
                className="transform hover:scale-[1.02] transition-all duration-300"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {section.fields.map((field) => (
                    <ScaleInput
                      key={field.key}
                      label={field.label}
                      value={String(formData[field.key as keyof typeof formData])}
                      onChange={(value) => handleInputChange(field.key as keyof typeof formData, value)}
                      options={scaleOptions}
                    />
                  ))}
                </div>
              </ModernFormCard>
            );
          })}

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

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8 pb-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/processes")}
              className="flex items-center gap-2 px-8 py-3 text-lg font-medium border-2 hover:bg-gray-50 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              Cancelar
            </Button>
            <Button 
              type="button"
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-8 py-3 text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Download className="w-5 h-5" />
              Baixar PDF
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TreatmentPlanForm;
