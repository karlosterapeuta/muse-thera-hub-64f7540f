
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, Download, Save, Trash2, Eye, RefreshCw, TrendingUp, Sparkles, Clock, User, Calendar, Activity, Brain, Heart, Users, Target, MessageCircle, CheckCircle, List, ArrowLeft } from "lucide-react";
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
      
      // Converter imagens para Base64 - usar stamp_photo_url (foto do carimbo digital)
      let photoBase64 = null;
      let stampBase64 = null;
      
      // Priorizar stamp_photo_url sobre avatar_url
      const photoUrl = professionalData?.stamp_photo_url || professionalData?.avatar_url;
      if (photoUrl) {
        try {
          photoBase64 = await imageUrlToBase64(photoUrl);
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
        professionalPhotoUrl: photoBase64 || photoUrl,
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
      // Converter imagens para Base64 - usar stamp_photo_url (foto do carimbo digital)
      let photoBase64 = null;
      let stampBase64 = null;
      
      // Priorizar stamp_photo_url sobre avatar_url
      const photoUrl = professionalData?.stamp_photo_url || professionalData?.avatar_url;
      if (photoUrl) {
        try {
          photoBase64 = await imageUrlToBase64(photoUrl);
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
        professionalPhotoUrl: photoBase64 || photoUrl,
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
    <div className="relative min-h-screen">
      {/* Ambient cosmic background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
      </div>

      <div className="container mx-auto p-4 sm:p-6 max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4 gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>

        {/* Refined Premium Header */}
        <div className="relative mb-6 lg:mb-8 overflow-hidden rounded-3xl border border-border/60 bg-card/60 backdrop-blur-xl shadow-2xl">
          {/* Subtle gradient wash */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-amber-400/5" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          <div className="relative p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-start gap-5">
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-amber-500 blur-xl opacity-40" />
                  <div className="relative p-4 rounded-2xl bg-gradient-to-br from-primary to-amber-500 shadow-lg">
                    <TrendingUp className="h-7 w-7 lg:h-8 lg:w-8 text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/60 bg-background/40 backdrop-blur text-xs font-medium text-muted-foreground">
                    <Sparkles className="h-3 w-3 text-amber-500" />
                    Sessão Terapêutica · IA Integrada
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                    Relatório de Evolução
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
                    Documente com clareza a evolução do paciente em cada sessão de musicoterapia — comportamentos, respostas musicais e progressos terapêuticos.
                  </p>
                </div>
              </div>

              {/* Compact status pills */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border/60 bg-background/40 backdrop-blur text-xs font-medium">
                  <Brain className="h-3.5 w-3.5 text-primary" /> Clínico
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border/60 bg-background/40 backdrop-blur text-xs font-medium">
                  <Heart className="h-3.5 w-3.5 text-rose-400" /> Evolutivo
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border/60 bg-background/40 backdrop-blur text-xs font-medium">
                  <FileText className="h-3.5 w-3.5 text-amber-500" /> PDF
                </div>
              </div>
            </div>
          </div>
        </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 lg:space-y-6">
        <TabsList className="grid w-full grid-cols-2 h-11 sm:h-12 p-1 bg-card/60 backdrop-blur-xl border border-border/60 rounded-xl">
          <TabsTrigger value="form" className="flex items-center gap-2 text-sm sm:text-base rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-md">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Formulário</span>
            <span className="sm:hidden">Form</span>
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2 text-sm sm:text-base rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-md">
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Visualização</span>
            <span className="sm:hidden">Preview</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="space-y-4 lg:space-y-6">
          {/* Session Info */}
          <Card className="border border-border/60 bg-card/60 backdrop-blur-xl shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg lg:text-xl">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-amber-500 shadow-md">
                  <User className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                </div>
                <span className="font-semibold">Informações da Sessão</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="patient" className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Paciente *
                  </Label>
                  <Select
                    value={selectedPatient?.id || ""}
                    onValueChange={handlePatientSelection}
                  >
                    <SelectTrigger className="h-11 sm:h-12 border-border/60 bg-background/50 backdrop-blur focus:border-primary transition-colors">
                      <SelectValue placeholder={isLoadingPatients ? "Carregando..." : "Selecione um paciente"} />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border shadow-lg z-50">
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
                    <Clock className="h-4 w-4 text-emerald-500" />
                    Data da Sessão
                  </Label>
                  <Input
                    type="date"
                    value={formData.date || new Date().toISOString().split('T')[0]}
                    onChange={(e) => updateField('date', e.target.value)}
                    className="h-11 sm:h-12 border-border/60 bg-background/50 backdrop-blur focus:border-primary text-sm sm:text-base font-medium"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Sections */}
          <div className="grid gap-5">
            {evolutionSections.map((section, index) => {
              const IconComponent = getSectionIcon(section.key);

              return (
                <Card
                  key={section.key}
                  className="group relative overflow-hidden border border-border/60 bg-card/60 backdrop-blur-xl shadow-md hover:shadow-xl hover:border-primary/40 transition-all duration-300"
                >
                  {/* Accent side bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-amber-500 to-primary opacity-60 group-hover:opacity-100 transition-opacity" />

                  <CardHeader className="pb-3 pl-6">
                    <CardTitle className="flex items-center gap-3 text-base lg:text-lg">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-primary/15 to-amber-500/15 border border-primary/20">
                        <IconComponent className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
                      </div>
                      <Badge variant="outline" className="px-2.5 py-0.5 text-xs font-bold border-primary/30 text-primary bg-primary/5">
                        {String(index + 1).padStart(2, '0')}
                      </Badge>
                      <span className="font-semibold text-foreground">
                        {section.title}
                      </span>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-5 pl-6">
                    {/* Quick Options */}
                    <div className="space-y-2.5">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Target className="h-3.5 w-3.5 text-primary" />
                        Opções rápidas
                      </Label>
                      <div className="grid grid-cols-1 gap-2">
                        {evolutionOptions[section.key as keyof typeof evolutionOptions]?.map((option, optionIndex) => (
                          <Button
                            key={optionIndex}
                            variant="outline"
                            size="sm"
                            className="justify-start text-left h-auto p-3 whitespace-normal border-border/60 bg-background/40 hover:bg-primary/5 hover:border-primary/40 transition-all duration-200 group/opt text-sm"
                            onClick={() => selectOption(section.key as any, option)}
                          >
                            <div className="flex items-start gap-2.5 w-full">
                              <div className="p-1 rounded-md bg-primary/10 group-hover/opt:bg-primary/20 transition-colors flex-shrink-0 mt-0.5">
                                <CheckCircle className="h-3 w-3 text-primary" />
                              </div>
                              <span className="text-foreground/90 leading-relaxed">
                                {option}
                              </span>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Text Area */}
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center">
                        <Label htmlFor={section.key} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                          <MessageCircle className="h-3.5 w-3.5 text-amber-500" />
                          Texto personalizado
                        </Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => clearField(section.key as any)}
                          className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
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
                        className="min-h-[110px] resize-y border-border/60 bg-background/40 backdrop-blur focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-lg text-sm"
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Sticky Action Bar */}
          <Card className="border border-border/60 bg-card/70 backdrop-blur-xl shadow-xl sticky bottom-4 z-20">
            <CardContent className="pt-4 lg:pt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2.5 lg:gap-3">
                <Button
                  onClick={handleOrganizeWithAI}
                  disabled={isOrganizingWithAI || !selectedPatient}
                  className="bg-gradient-to-br from-primary to-amber-500 hover:opacity-90 text-white shadow-md hover:shadow-lg transition-all duration-200 h-11 text-sm font-semibold"
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
                  professionalPhotoUrl={professionalData?.stamp_photo_url || professionalData?.avatar_url}
                  professionalSpecialty={professionalData?.specialty}
                  professionalEmail={professionalData?.email}
                  professionalPhone={professionalData?.phone}
                  digitalStampUrl={professionalData?.digital_stamp_url}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}
