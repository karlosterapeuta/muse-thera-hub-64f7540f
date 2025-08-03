
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, Download, Save, Trash2, Eye, RefreshCw, TrendingUp, Sparkles, Clock, User, Calendar, Activity, Brain, Heart, Users, Target, MessageCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useEvolutionReport } from "@/hooks/useEvolutionReport";
import { evolutionSections } from "@/data/evolutionTemplate";
import { evolutionOptions } from "@/data/evolutionOptions";
import { EvolutionReportPreview } from "@/components/EvolutionReportPreview";
import { supabase } from "@/integrations/supabase/client";
import { generateStaticPDF } from "@/utils/staticPDFGenerator";
import { useProfessionalData } from "@/hooks/useProfessionalData";

export default function EvolutionReport() {
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
      
      const component = React.createElement(EvolutionReportPreview, {
        data: formData,
        professionalName: professionalData?.name || "Nome do Profissional",
        professionalRegister: professionalData?.register || "CRM/XXXX"
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
      const component = React.createElement(EvolutionReportPreview, {
        data: formData,
        professionalName: professionalData?.name || "Nome do Profissional",
        professionalRegister: professionalData?.register || "CRM/XXXX"
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
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Enhanced Organized Header */}
      <div className="relative mb-10 overflow-hidden">
        {/* Main Header Container */}
        <div className="relative rounded-3xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-100/60 shadow-xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-grid-blue-100/20 [mask-image:linear-gradient(0deg,transparent,black,transparent)]" />
          
          <div className="relative p-10">
            {/* Header Content */}
            <div className="flex items-center justify-between">
              {/* Left Side - Main Content */}
              <div className="flex items-center gap-6">
                {/* Icon Container */}
                <div className="relative flex-shrink-0">
                  <div className="p-5 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl">
                    <TrendingUp className="h-10 w-10 text-white" />
                  </div>
                  {/* Floating Badge */}
                  <div className="absolute -top-2 -right-2 p-2 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full shadow-lg animate-pulse">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                </div>
                
                {/* Text Content */}
                <div className="space-y-4">
                  {/* Title Section */}
                  <div className="space-y-2">
                    <h1 className="text-5xl font-black bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent leading-tight tracking-tight">
                      Evolução Diária MuseTera
                    </h1>
                    
                    {/* Subtitle with decorative line */}
                    <div className="flex items-center gap-4">
                      <div className="h-1 w-20 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full shadow-sm" />
                      <span className="text-2xl font-bold text-gray-700">
                        Relatório de Evolução MuseTera
                      </span>
                      <div className="h-1 w-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full shadow-sm" />
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-lg max-w-3xl leading-relaxed font-medium">
                    Sistema profissional para documentação detalhada da evolução do paciente durante sessões de musicoterapia, 
                    registrando progressos, comportamentos e interações terapêuticas de forma estruturada.
                  </p>
                </div>
              </div>

              {/* Right Side - Quick Stats */}
              <div className="hidden lg:flex flex-col gap-3">
                <div className="text-right">
                  <div className="text-3xl font-black text-blue-600">+</div>
                  <div className="text-sm font-semibold text-gray-600">Profissional</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-indigo-600">AI</div>
                  <div className="text-sm font-semibold text-gray-600">Organização</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-purple-600">PDF</div>
                  <div className="text-sm font-semibold text-gray-600">Export</div>
                </div>
              </div>
            </div>
            
            {/* Feature Pills */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white/80 backdrop-blur-sm text-blue-700 rounded-2xl shadow-lg border border-blue-200/50 font-semibold">
                <Clock className="h-5 w-5" />
                <span>Sessão Terapêutica</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white/80 backdrop-blur-sm text-indigo-700 rounded-2xl shadow-lg border border-indigo-200/50 font-semibold">
                <Brain className="h-5 w-5" />
                <span>Análise Clínica</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white/80 backdrop-blur-sm text-purple-700 rounded-2xl shadow-lg border border-purple-200/50 font-semibold">
                <Heart className="h-5 w-5" />
                <span>Evolução Terapêutica</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white/80 backdrop-blur-sm text-emerald-700 rounded-2xl shadow-lg border border-emerald-200/50 font-semibold">
                <Sparkles className="h-5 w-5" />
                <span>IA Integrada</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 h-12">
          <TabsTrigger value="form" className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4" />
            Formulário
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2 text-base">
            <Eye className="h-4 w-4" />
            Visualização
          </TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="space-y-6">
          {/* Enhanced Patient Selection */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-white via-blue-50/30 to-indigo-50/30">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                  <User className="h-5 w-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                  Informações da Sessão
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="patient" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    Paciente *
                  </Label>
                  <Select 
                    value={selectedPatient?.id || ""} 
                    onValueChange={handlePatientSelection}
                  >
                    <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors">
                      <SelectValue placeholder={isLoadingPatients ? "Carregando..." : "Selecione um paciente"} />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-green-600" />
                    Data da Sessão
                  </Label>
                  <div className="h-12 p-3 bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-lg border-2 border-gray-200 flex items-center font-medium text-gray-700">
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
                        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <Target className="h-4 w-4 text-blue-600" />
                          Opções Rápidas:
                        </Label>
                        <div className="grid grid-cols-1 gap-3">
                          {evolutionOptions[section.key as keyof typeof evolutionOptions]?.map((option, optionIndex) => (
                            <Button
                              key={optionIndex}
                              variant="outline"
                              size="sm"
                              className="justify-start text-left h-auto p-4 whitespace-normal hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 transition-all duration-200 group"
                              onClick={() => selectOption(section.key as any, option)}
                            >
                              <div className="flex items-start gap-3 w-full">
                                <div className="p-1 bg-blue-100 group-hover:bg-blue-200 rounded transition-colors flex-shrink-0 mt-0.5">
                                  <CheckCircle className="h-3 w-3 text-blue-600" />
                                </div>
                                <span className="text-gray-700 group-hover:text-gray-900 leading-relaxed">
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
                          <Label htmlFor={section.key} className="text-sm font-semibold text-gray-700 flex items-center gap-2">
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
                          className="min-h-[120px] resize-y border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-200 rounded-lg"
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
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <Button
                  onClick={handleOrganizeWithAI}
                  disabled={isOrganizingWithAI || !selectedPatient}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-12"
                >
                  {isOrganizingWithAI ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  {isOrganizingWithAI ? 'Organizando...' : 'Organizar com IA'}
                </Button>

                <Button
                  onClick={handleSave}
                  disabled={isSaving || !selectedPatient}
                  className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-12"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Salvar Relatório
                </Button>

                <Button
                  onClick={handleGeneratePDF}
                  disabled={isGeneratingPDF || !selectedPatient}
                  className="bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-12"
                >
                  {isGeneratingPDF ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  {isGeneratingPDF ? 'Exportando...' : 'Exportar PDF'}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setActiveTab("preview")}
                  disabled={!selectedPatient}
                  className="border-blue-200 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 h-12"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Visualizar
                </Button>

                <Button
                  variant="outline"
                  onClick={resetForm}
                  className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-400 transition-all duration-200 h-12"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Limpar Formulário
                </Button>
              </div>
              
              {!selectedPatient && (
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800 text-center flex items-center justify-center gap-2">
                    <User className="h-4 w-4" />
                    Selecione um paciente para habilitar as funcionalidades
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Visualização do Relatório</h2>
            <Button
              onClick={handleGeneratePDFFromPreview}
              disabled={!selectedPatient}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Baixar PDF
            </Button>
          </div>

          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="max-h-[800px] overflow-y-auto border rounded-lg">
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
