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
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface FormData {
  patient_name: string;
  therapist_name: string;
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
};

function TreatmentPlanForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data, error } = await supabase
          .from("patients")
          .select("id, name");

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

  const handlePatientSelect = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPatient(event.target.value);
    const patient = patients.find((p) => p.id === event.target.value);
    if (patient) {
      setFormData(prev => ({
        ...prev,
        patient_name: patient.name,
      }));
    }
  }, [patients]);
  
  const [formData, setFormData] = useState<FormData>({
    patient_name: "",
    therapist_name: "",
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

  const handleDownloadPDF = useCallback(async () => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let currentY = margin;

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(20);
      pdf.text('PLANO TERAPÊUTICO', pageWidth / 2, currentY, { align: 'center' });
      currentY += 15;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(12);

      // Patient Information
      pdf.setFont('helvetica', 'bold');
      pdf.text('INFORMAÇÕES DO PACIENTE', margin, currentY);
      currentY += 8;
      
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Nome do Paciente: ${formData.patient_name}`, margin, currentY);
      currentY += 6;
      pdf.text(`Terapeuta: ${formData.therapist_name}`, margin, currentY);
      currentY += 6;
      pdf.text(`Local da Terapia: ${formData.therapy_location}`, margin, currentY);
      currentY += 10;

      // Treatment Information
      pdf.setFont('helvetica', 'bold');
      pdf.text('INFORMAÇÕES DO TRATAMENTO', margin, currentY);
      currentY += 8;
      
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Queixa Principal: ${formData.main_complaint}`, margin, currentY);
      currentY += 6;
      pdf.text(`Objetivo da Terapia: ${formData.therapy_goal}`, margin, currentY);
      currentY += 6;
      pdf.text(`Sessões Planejadas: ${formData.planned_sessions}`, margin, currentY);
      currentY += 6;
      pdf.text(`Frequência: ${formData.session_frequency}`, margin, currentY);
      currentY += 15;

      console.log('Adding TEA sections...');

      // TEA Section 1: Musical Sensory Profile
      console.log('Adding Musical Sensory Profile section');
      pdf.setFont('helvetica', 'bold');
      pdf.text('1. PERFIL SENSORIAL MUSICAL', margin, currentY);
      currentY += 8;
      
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Processamento Auditivo: ${formData.sensory_auditory}/10`, margin, currentY);
      currentY += 6;
      pdf.text(`Processamento Visual: ${formData.sensory_visual}/10`, margin, currentY);
      currentY += 6;
      pdf.text(`Processamento Tátil: ${formData.sensory_tactile}/10`, margin, currentY);
      currentY += 6;
      pdf.text(`Processamento Proprioceptivo: ${formData.sensory_proprioceptive}/10`, margin, currentY);
      currentY += 6;
      pdf.text(`Processamento Vestibular: ${formData.sensory_vestibular}/10`, margin, currentY);
      currentY += 15;

      // TEA Section 2: Musical Social Communication
      console.log('Adding Musical Social Communication section');
      pdf.setFont('helvetica', 'bold');
      pdf.text('2. COMUNICAÇÃO SOCIAL MUSICAL', margin, currentY);
      currentY += 8;
      
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Comunicação Verbal: ${formData.communication_verbal}/10`, margin, currentY);
      currentY += 6;
      pdf.text(`Comunicação Não Verbal: ${formData.communication_nonverbal}/10`, margin, currentY);
      currentY += 6;
      pdf.text(`Linguagem Receptiva: ${formData.communication_receptive}/10`, margin, currentY);
      currentY += 6;
      pdf.text(`Linguagem Expressiva: ${formData.communication_expressive}/10`, margin, currentY);
      currentY += 6;
      pdf.text(`Interação Social: ${formData.communication_social}/10`, margin, currentY);
      currentY += 15;

      // TEA Section 3: Musical Behavioral Patterns
      console.log('Adding Musical Behavioral Patterns section');
      pdf.setFont('helvetica', 'bold');
      pdf.text('3. PADRÕES COMPORTAMENTAIS MUSICAIS', margin, currentY);
      currentY += 8;
      
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Comportamentos Repetitivos: ${formData.behavioral_repetitive}/10`, margin, currentY);
      currentY += 6;
      pdf.text(`Interesses Restritos: ${formData.behavioral_restricted}/10`, margin, currentY);
      currentY += 6;
      pdf.text(`Adaptação a Mudanças: ${formData.behavioral_transitions}/10`, margin, currentY);
      currentY += 6;
      pdf.text(`Flexibilidade Cognitiva: ${formData.behavioral_flexibility}/10`, margin, currentY);
      currentY += 6;
      pdf.text(`Autorregulação: ${formData.behavioral_self_regulation}/10`, margin, currentY);
      currentY += 15;

      // TEA Section 4: Specialized Methodologies
      console.log('Adding Specialized Methodologies section');
      pdf.setFont('helvetica', 'bold');
      pdf.text('4. METODOLOGIAS ESPECIALIZADAS', margin, currentY);
      currentY += 8;
      
      pdf.setFont('helvetica', 'normal');
      pdf.text('• Método MUSICOGRAM® - Criação de representações visuais da música', margin + 5, currentY);
      currentY += 6;
      pdf.text('• Técnicas de Improvisação Musical Terapêutica', margin + 5, currentY);
      currentY += 6;
      pdf.text('• Estimulação Sensorial através de Instrumentos Musicais', margin + 5, currentY);
      currentY += 6;
      pdf.text('• Desenvolvimento de Habilidades Sociais via Atividades Musicais', margin + 5, currentY);
      currentY += 6;
      pdf.text('• Regulação Emocional através de Técnicas Musicoterapêuticas', margin + 5, currentY);
      currentY += 15;

      // TEA Section 5: Additional Observations
      console.log('Adding Additional Observations section');
      pdf.setFont('helvetica', 'bold');
      pdf.text('5. OBSERVAÇÕES COMPLEMENTARES', margin, currentY);
      currentY += 8;
      
      pdf.setFont('helvetica', 'normal');
      const additionalNotes = formData.additional_notes || 'Nenhuma observação adicional registrada.';
      const splitText = pdf.splitTextToSize(additionalNotes, pageWidth - 2 * margin);
      pdf.text(splitText, margin, currentY);

      console.log('All TEA sections added successfully');

      pdf.save(`plano-terapeutico-${formData.patient_name.replace(/\s+/g, '-').toLowerCase()}.pdf`);
      
      toast({
        title: "PDF gerado com sucesso!",
        description: "O plano terapêutico foi baixado.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        variant: "destructive",
        title: "Erro ao gerar PDF",
        description: "Não foi possível gerar o arquivo PDF.",
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
              <FormField label="Nome do Paciente">
                <Input
                  type="text"
                  value={formData.patient_name}
                  onChange={(e) => handleInputChange("patient_name", e.target.value)}
                  placeholder="Digite o nome completo do paciente"
                  className="border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                />
              </FormField>
              <FormField label="Nome do Terapeuta">
                <Input
                  type="text"
                  value={formData.therapist_name}
                  onChange={(e) => handleInputChange("therapist_name", e.target.value)}
                  placeholder="Digite o nome do terapeuta"
                  className="border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
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
