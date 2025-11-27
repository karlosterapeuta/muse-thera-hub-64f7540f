
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, Download, Save, Trash2, Eye, RefreshCw, TrendingUp, Sparkles, Clock, User, Calendar, Activity, Brain, Heart, Users, Target, MessageCircle, CheckCircle, List } from "lucide-react";
import { toast } from "sonner";
import { useEvolutionReport } from "@/hooks/useEvolutionReport";
import { evolutionSections } from "@/data/evolutionTemplate";
import { evolutionOptions } from "@/data/evolutionOptions";
import { EvolutionReportPreview } from "@/components/EvolutionReportPreview";
import { supabase } from "@/integrations/supabase/client";
import { generateStaticPDF } from "@/utils/staticPDFGenerator";
import { useProfessionalData } from "@/hooks/useProfessionalData";
import { useNavigate } from "react-router-dom";
import { imageUrlToBase64 } from "@/utils/imageToBase64";

export default function EvolutionReport() {
  const navigate = useNavigate();
  const {
    formData,
    selectedPatient,
    setSelectedPatient,
    isLoading,
    isSaving,
    isOrganizingWithAI,
    updateField,
    selectOption,
    clearField,
    organizeWithAI,
    saveReport,
    resetForm
  } = useEvolutionReport();

  const { data: professionalData } = useProfessionalData();
  
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);
  const [activeTab, setActiveTab] = useState("form");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
      toast.error("Erro ao carregar pacientes");
    } finally {
      setIsLoadingPatients(false);
    }
  };

  const handleSave = async () => {
    const success = await saveReport();
    if (success) {
      setActiveTab("preview");
    }
  };

  const handleOrganizeWithAI = async () => {
    const success = await organizeWithAI();
    if (success) {
      toast.success("Relatório organizado com IA!", {
        description: "Revise o conteúdo gerado e ajuste se necessário antes de salvar."
      });
    }
  };

  const handleGeneratePDF = async () => {
    if (!selectedPatient) {
      toast.error("Selecione um paciente para gerar o PDF");
      return;
    }

    // Verificar se há dados suficientes para gerar o PDF
    const hasData = Object.values(formData).some(value => 
      value && typeof value === 'string' && value.trim() !== ''
    );

    if (!hasData) {
      toast.error("Adicione dados ao relatório antes de exportar", {
        description: "Preencha alguns campos do formulário para gerar o PDF."
      });
      return;
    }

    setIsGeneratingPDF(true);
    try {
      console.log("📄 Gerando PDF do relatório de evolução...");
      
      // Converter imagens para Base64
      let photoBase64 = null;
      let stampBase64 = null;
      
      if (professionalData?.avatar_url) {
        try {
          photoBase64 = await imageUrlToBase64(professionalData.avatar_url);
        } catch (e) {
          console.warn("Não foi possível converter foto para Base64");
        }
      }
      
      if (professionalData?.digital_stamp_url) {
        try {
          stampBase64 = await imageUrlToBase64(professionalData.digital_stamp_url);
        } catch (e) {
          console.warn("Não foi possível converter carimbo para Base64");
        }
      }
      
      const component = React.createElement(EvolutionReportPreview, {
        data: formData,
        professionalName: professionalData?.name || "Nome do Profissional",
        professionalRegister: professionalData?.register || "CRM/XXXX",
        professionalPhotoUrl: photoBase64 || professionalData?.avatar_url,
        professionalSpecialty: professionalData?.specialty || "Musicoterapeuta",
        professionalEmail: professionalData?.email,
        professionalPhone: professionalData?.phone,
        digitalStampUrl: stampBase64 || professionalData?.digital_stamp_url
      });

      const filename = `Relatorio_Evolucao_MuseTera_${selectedPatient?.name?.replace(/\s+/g, '_') || 'Paciente'}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      const success = await generateStaticPDF(component, {
        filename,
        waitTime: 3000,
        quality: 1.8
      });

      if (success) {
        toast.success("PDF exportado com sucesso!");
      } else {
        toast.error("Erro ao exportar PDF");
      }
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error("Erro ao exportar PDF");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleGeneratePDFFromPreview = async () => {
    if (!selectedPatient) {
      toast.error("Selecione um paciente para gerar o PDF");
      return;
    }

    try {
      // Converter imagens para Base64
      let photoBase64 = null;
      let stampBase64 = null;
      
      if (professionalData?.avatar_url) {
        try {
          photoBase64 = await imageUrlToBase64(professionalData.avatar_url);
        } catch (e) {
          console.warn("Não foi possível converter foto para Base64");
        }
      }
      
      if (professionalData?.digital_stamp_url) {
        try {
          stampBase64 = await imageUrlToBase64(professionalData.digital_stamp_url);
        } catch (e) {
          console.warn("Não foi possível converter carimbo para Base64");
        }
      }
      
      const component = React.createElement(EvolutionReportPreview, {
        data: formData,
        professionalName: professionalData?.name || "Nome do Profissional",
        professionalRegister: professionalData?.register || "CRM/XXXX",
        professionalPhotoUrl: photoBase64 || professionalData?.avatar_url,
        professionalSpecialty: professionalData?.specialty || "Musicoterapeuta",
        professionalEmail: professionalData?.email,
        professionalPhone: professionalData?.phone,
        digitalStampUrl: stampBase64 || professionalData?.digital_stamp_url
      });

      const filename = `Relatorio_Evolucao_MuseTera_${selectedPatient?.name?.replace(/\s+/g, '_') || 'Paciente'}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      await generateStaticPDF(component, {
        filename,
        waitTime: 3000,
        quality: 1.8
      });

      toast.success("PDF gerado com sucesso!");
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error("Erro ao gerar PDF");
    }
  };

  // Mapeamento de ícones para cada seção
  const getSectionIcon = (key: string) => {
    const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
      how_arrived: User,
      resources_used: Target,
      session_dynamics: Activity,
      therapeutic_plan: Brain,
      patient_behaviors: Heart,
      patient_responses: MessageCircle,
      musical_participation: Users,
      communication_interaction: MessageCircle,
      session_adjustments: RefreshCw,
      how_left: CheckCircle,
      general_observations: Eye
    };
    return iconMap[key] || FileText;
  };

  // Função para lidar com a seleção de paciente e sincronizar dados
  const handlePatientSelection = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      setSelectedPatient(patient);
      // Sincronizar dados do paciente no formData
      updateField('patient_name', patient.name);
      updateField('patient_id', patient.id);
      // Definir data atual se não estiver definida
      if (!formData.date) {
        updateField('date', new Date().toISOString().split('T')[0]);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-6xl">
      {/* Enhanced Organized Header */}
      <div className="relative mb-6 lg:mb-10 overflow-hidden">
        {/* Main Header Container */}
        <div className="relative rounded-2xl lg:rounded-3xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-2 border-blue-100/60 dark:border-gray-700 shadow-xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-grid-blue-100/20 [mask-image:linear-gradient(0deg,transparent,black,transparent)]" />
          
          <div className="relative p-4 sm:p-6 lg:p-10">
            {/* Header Content */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              {/* Left Side - Main Content */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full lg:w-auto">
                {/* Icon Container */}
                <div className="relative flex-shrink-0">
                  <div className="p-3 sm:p-4 lg:p-5 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-2xl lg:rounded-3xl shadow-2xl">
                    <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-white" />
                  </div>
                  {/* Floating Badge */}
                  <div className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 p-1.5 lg:p-2 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full shadow-lg animate-pulse">
                    <Sparkles className="h-3 w-3 lg:h-4 lg:w-4 text-white" />
                  </div>
                </div>
                
                {/* Text Content */}
                <div className="space-y-2 lg:space-y-4 w-full">
                  {/* Title Section */}
                  <div className="space-y-1 lg:space-y-2">
                    <h1 className="text-2xl sm:text-3xl lg:text-5xl font-black bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent leading-tight tracking-tight">
                      Evolução Diária MuseTera
                    </h1>
                    
                    {/* Subtitle with decorative line */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full shadow-sm" />
                  <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                    Relatório de Evolução MuseTera
                  </span>
                      <div className="hidden sm:block h-1 w-8 sm:w-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full shadow-sm" />
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-gray-700 dark:text-gray-200 text-sm sm:text-base lg:text-lg max-w-3xl leading-relaxed font-medium">
                    Sistema profissional para documentação detalhada da evolução do paciente durante sessões de musicoterapia, 
                    registrando progressos, comportamentos e interações terapêuticas de forma estruturada.
                  </p>
                </div>
              </div>

              {/* Right Side - Quick Stats */}
              <div className="hidden xl:flex flex-col gap-3">
                <div className="text-right">
                  <div className="text-3xl font-black text-blue-600">+</div>
                  <div className="text-sm font-semibold text-muted-foreground">Profissional</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-indigo-600">AI</div>
                  <div className="text-sm font-semibold text-muted-foreground">Organização</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-purple-600">PDF</div>
                  <div className="text-sm font-semibold text-muted-foreground">Export</div>
                </div>
              </div>
            </div>
            
            {/* Feature Pills */}
            <div className="mt-4 lg:mt-8 flex flex-wrap items-center gap-2 lg:gap-4">
              <div className="flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-4 py-1.5 lg:py-2.5 bg-white/80 backdrop-blur-sm text-blue-700 rounded-xl lg:rounded-2xl shadow-lg border border-blue-200/50 font-semibold text-sm lg:text-base">
                <Clock className="h-4 w-4 lg:h-5 lg:w-5" />
                <span className="hidden sm:inline">Sessão Terapêutica</span>
                <span className="sm:hidden">Sessão</span>
              </div>
              <div className="flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-4 py-1.5 lg:py-2.5 bg-white/80 backdrop-blur-sm text-indigo-700 rounded-xl lg:rounded-2xl shadow-lg border border-indigo-200/50 font-semibold text-sm lg:text-base">
                <Brain className="h-4 w-4 lg:h-5 lg:w-5" />
                <span className="hidden sm:inline">Análise Clínica</span>
                <span className="sm:hidden">Análise</span>
              </div>
              <div className="flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-4 py-1.5 lg:py-2.5 bg-white/80 backdrop-blur-sm text-purple-700 rounded-xl lg:rounded-2xl shadow-lg border border-purple-200/50 font-semibold text-sm lg:text-base">
                <Heart className="h-4 w-4 lg:h-5 lg:w-5" />
                <span className="hidden sm:inline">Evolução Terapêutica</span>
                <span className="sm:hidden">Evolução</span>
              </div>
              <div className="flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-4 py-1.5 lg:py-2.5 bg-white/80 backdrop-blur-sm text-emerald-700 rounded-xl lg:rounded-2xl shadow-lg border border-emerald-200/50 font-semibold text-sm lg:text-base">
                <Sparkles className="h-4 w-4 lg:h-5 lg:w-5" />
                <span className="hidden sm:inline">IA Integrada</span>
                <span className="sm:hidden">IA</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 lg:space-y-6">
        <TabsList className="grid w-full grid-cols-2 h-10 sm:h-12">
          <TabsTrigger value="form" className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
            <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Formulário</span>
            <span className="sm:hidden">Form</span>
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Visualização</span>
            <span className="sm:hidden">Preview</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="space-y-4 lg:space-y-6">
          {/* Enhanced Patient Selection */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-white via-blue-50/30 to-indigo-50/30">
            <CardHeader className="pb-3 lg:pb-4">
              <CardTitle className="flex items-center gap-2 lg:gap-3 text-lg lg:text-xl">
                <div className="p-1.5 lg:p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                  <User className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                  Informações da Sessão
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="patient" className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    Paciente *
                  </Label>
                  <Select 
                    value={selectedPatient?.id || ""} 
                    onValueChange={handlePatientSelection}
                  >
                    <SelectTrigger className="h-10 sm:h-12 border-2 border-border focus:border-blue-500 transition-colors bg-background">
                      <SelectValue placeholder={isLoadingPatients ? "Carregando..." : "Selecione um paciente"} />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-lg z-50">
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id} className="hover:bg-muted/50">
                          {patient.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4 text-green-600" />
                    Data da Sessão
                  </Label>
                  <div className="h-10 sm:h-12 p-3 bg-gradient-to-r from-muted/30 to-blue-50/50 rounded-lg border-2 border-border flex items-center font-medium text-foreground text-sm sm:text-base">
                    {new Date().toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Form Fields */}
          <div className="grid gap-6">
            {evolutionSections.map((section, index) => {
              const IconComponent = getSectionIcon(section.key);
              const gradientColors = [
                'from-blue-500 to-cyan-600',
                'from-indigo-500 to-purple-600', 
                'from-purple-500 to-pink-600',
                'from-pink-500 to-rose-600',
                'from-rose-500 to-orange-600',
                'from-orange-500 to-amber-600',
                'from-amber-500 to-yellow-600',
                'from-yellow-500 to-lime-600',
                'from-lime-500 to-green-600',
                'from-green-500 to-emerald-600',
                'from-emerald-500 to-teal-600'
              ];
              const gradient = gradientColors[index % gradientColors.length];

              return (
                <Card key={section.key} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  {/* Gradient border */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${gradient} p-[1px] rounded-lg`}>
                    <div className="h-full w-full bg-white rounded-lg" />
                  </div>
                  
                  <div className="relative z-10">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <div className={`p-2 bg-gradient-to-r ${gradient} rounded-lg`}>
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="px-3 py-1 text-sm font-bold">
                            {index + 1}
                          </Badge>
                          <span className="bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                            {section.title}
                          </span>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      {/* Enhanced Quick Options */}
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <Target className="h-4 w-4 text-blue-600" />
                          Opções Rápidas:
                        </Label>
                        <div className="grid grid-cols-1 gap-2 lg:gap-3">
                          {evolutionOptions[section.key as keyof typeof evolutionOptions]?.map((option, optionIndex) => (
                            <Button
                              key={optionIndex}
                              variant="outline"
                              size="sm"
                              className="justify-start text-left h-auto p-3 lg:p-4 whitespace-normal hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/40 dark:hover:to-indigo-900/40 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 group text-sm lg:text-base"
                              onClick={() => selectOption(section.key as any, option)}
                            >
                              <div className="flex items-start gap-2 lg:gap-3 w-full">
                                <div className="p-1 bg-blue-100 group-hover:bg-blue-200 rounded transition-colors flex-shrink-0 mt-0.5">
                                  <CheckCircle className="h-3 w-3 text-blue-600" />
                                </div>
                        <span className="text-foreground group-hover:text-gray-900 dark:group-hover:text-gray-100 leading-relaxed">
                          {option}
                        </span>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Enhanced Custom Text Area */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Label htmlFor={section.key} className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <MessageCircle className="h-4 w-4 text-purple-600" />
                            Texto Personalizado:
                          </Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => clearField(section.key as any)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Limpar
                          </Button>
                        </div>
                        <Textarea
                          id={section.key}
                          placeholder={section.placeholder}
                          value={formData[section.key as keyof typeof formData] as string || ""}
                          onChange={(e) => updateField(section.key as any, e.target.value)}
                          className="min-h-[100px] sm:min-h-[120px] resize-y border-2 border-border focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-200 rounded-lg text-sm sm:text-base"
                        />
                      </div>
                    </CardContent>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Enhanced Action Buttons */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-50 via-blue-50/30 to-indigo-50/30">
            <CardContent className="pt-4 lg:pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-3 lg:gap-4">
                <Button
                  onClick={handleOrganizeWithAI}
                  disabled={isOrganizingWithAI || !selectedPatient}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-10 sm:h-12 text-sm sm:text-base"
                >
                  {isOrganizingWithAI ? (
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  )}
                  <span className="hidden sm:inline">
                    {isOrganizingWithAI ? 'Organizando...' : 'Organizar com IA'}
                  </span>
                  <span className="sm:hidden">
                    {isOrganizingWithAI ? 'Organizando...' : 'IA'}
                  </span>
                </Button>

                <Button
                  onClick={handleSave}
                  disabled={isSaving || !selectedPatient}
                  className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-10 sm:h-12 text-sm sm:text-base"
                >
                  {isSaving ? (
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" />
                  ) : (
                    <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  )}
                  <span className="hidden sm:inline">Salvar Relatório</span>
                  <span className="sm:hidden">Salvar</span>
                </Button>

                <Button
                  onClick={handleGeneratePDF}
                  disabled={isGeneratingPDF || !selectedPatient}
                  className="bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-10 sm:h-12 text-sm sm:text-base"
                >
                  {isGeneratingPDF ? (
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" />
                  ) : (
                    <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  )}
                  <span className="hidden sm:inline">
                    {isGeneratingPDF ? 'Exportando...' : 'Exportar PDF'}
                  </span>
                  <span className="sm:hidden">
                    {isGeneratingPDF ? 'Exportando...' : 'PDF'}
                  </span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate("/processes/reports?type=daily_evolution")}
                  className="border-orange-200 hover:bg-orange-50 hover:border-orange-400 transition-all duration-200 h-10 sm:h-12 text-sm sm:text-base text-orange-700"
                >
                  <List className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Ver Relatórios</span>
                  <span className="sm:hidden">Lista</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setActiveTab("preview")}
                  disabled={!selectedPatient}
                  className="border-blue-200 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 h-10 sm:h-12 text-sm sm:text-base"
                >
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Visualizar</span>
                  <span className="sm:hidden">Ver</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={resetForm}
                  className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-400 transition-all duration-200 h-10 sm:h-12 text-sm sm:text-base"
                >
                  <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Limpar Formulário</span>
                  <span className="sm:hidden">Limpar</span>
                </Button>
              </div>
              
              {!selectedPatient && (
                <div className="mt-4 lg:mt-6 p-3 lg:p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs sm:text-sm text-amber-800 text-center flex items-center justify-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Selecione um paciente para habilitar as funcionalidades</span>
                    <span className="sm:hidden">Selecione um paciente</span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4 lg:space-y-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between sm:items-center">
            <h2 className="text-xl lg:text-2xl font-bold">Visualização do Relatório</h2>
            <Button
              onClick={handleGeneratePDFFromPreview}
              disabled={!selectedPatient}
              className="bg-blue-600 hover:bg-blue-700 h-10 sm:h-12 text-sm sm:text-base"
            >
              <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Baixar PDF</span>
              <span className="sm:hidden">PDF</span>
            </Button>
          </div>

          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="max-h-[600px] sm:max-h-[700px] lg:max-h-[800px] overflow-y-auto border rounded-lg">
                <EvolutionReportPreview 
                  data={formData}
                  professionalName={professionalData?.name}
                  professionalRegister={professionalData?.register}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
