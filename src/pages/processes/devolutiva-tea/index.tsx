import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquareText, 
  FileText, 
  Download, 
  Save, 
  Eye, 
  User, 
  Calendar, 
  Sparkles,
  TrendingUp,
  Target,
  Heart,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useProfessionalData } from "@/hooks/useProfessionalData";
import { useNavigate } from "react-router-dom";

interface DevolutivaData {
  patient_id: string;
  patient_name: string;
  period_summary: string;
  main_achievements: string;
  areas_attention: string;
  family_recommendations: string;
  team_recommendations: string;
  successful_strategies: string;
  next_steps: string;
  additional_observations: string;
}

export default function DevolutivaTEA() {
  const navigate = useNavigate();
  const { data: professionalData } = useProfessionalData();
  
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);
  const [activeTab, setActiveTab] = useState("form");
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  
  const [formData, setFormData] = useState<DevolutivaData>({
    patient_id: "",
    patient_name: "",
    period_summary: "",
    main_achievements: "",
    areas_attention: "",
    family_recommendations: "",
    team_recommendations: "",
    successful_strategies: "",
    next_steps: "",
    additional_observations: ""
  });

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

  const handlePatientSelection = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      setSelectedPatient(patient);
      setFormData(prev => ({
        ...prev,
        patient_id: patient.id,
        patient_name: patient.name
      }));
    }
  };

  const updateField = (field: keyof DevolutivaData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!selectedPatient) {
      toast.error("Selecione um paciente");
      return;
    }

    if (!formData.period_summary || !formData.main_achievements) {
      toast.error("Preencha ao menos o resumo do período e as principais conquistas");
      return;
    }

    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data: professional } = await supabase
        .from('professionals')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!professional) throw new Error("Profissional não encontrado");

      const { error } = await supabase
        .from('reports')
        .insert([{
          patient_id: formData.patient_id,
          professional_id: professional.id,
          type: 'musicoterapia' as const,
          content: {
            report_type: 'devolutiva_tea',
            ...formData
          }
        }]);

      if (error) throw error;

      toast.success("Devolutiva salva com sucesso!");
      setActiveTab("preview");
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast.error("Erro ao salvar devolutiva");
    } finally {
      setIsSaving(false);
    }
  };

  const handleGeneratePDF = async () => {
    if (!selectedPatient) {
      toast.error("Selecione um paciente para gerar o PDF");
      return;
    }

    toast.info("Funcionalidade de PDF em desenvolvimento");
  };

  const formSections = [
    {
      key: "period_summary",
      title: "Resumo do Período",
      description: "Descreva o período terapêutico e contexto geral",
      icon: Calendar,
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      key: "main_achievements",
      title: "Principais Conquistas",
      description: "Destaque os avanços e evoluções observadas",
      icon: TrendingUp,
      gradient: "from-emerald-500 to-green-600"
    },
    {
      key: "areas_attention",
      title: "Áreas que Necessitam Atenção",
      description: "Identifique pontos que requerem maior foco",
      icon: AlertCircle,
      gradient: "from-amber-500 to-orange-600"
    },
    {
      key: "successful_strategies",
      title: "Estratégias que Funcionaram",
      description: "Descreva as abordagens mais efetivas",
      icon: Target,
      gradient: "from-purple-500 to-pink-600"
    },
    {
      key: "family_recommendations",
      title: "Recomendações para Família",
      description: "Orientações específicas para o ambiente familiar",
      icon: Heart,
      gradient: "from-rose-500 to-pink-600"
    },
    {
      key: "team_recommendations",
      title: "Recomendações para Equipe",
      description: "Orientações para equipe multidisciplinar",
      icon: User,
      gradient: "from-indigo-500 to-purple-600"
    },
    {
      key: "next_steps",
      title: "Próximos Passos",
      description: "Planejamento e continuidade do tratamento",
      icon: CheckCircle,
      gradient: "from-green-500 to-emerald-600"
    },
    {
      key: "additional_observations",
      title: "Observações Adicionais",
      description: "Informações complementares relevantes",
      icon: FileText,
      gradient: "from-gray-500 to-slate-600"
    }
  ];

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-6xl">
      {/* Header */}
      <div className="relative mb-6 lg:mb-10 overflow-hidden">
        <div className="relative rounded-2xl lg:rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 border-2 border-amber-100/60 shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.1),transparent_50%)]" />
          
          <div className="relative p-4 sm:p-6 lg:p-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full lg:w-auto">
                <div className="relative flex-shrink-0">
                  <div className="p-3 sm:p-4 lg:p-5 bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 rounded-2xl lg:rounded-3xl shadow-2xl">
                    <MessageSquareText className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 p-1.5 lg:p-2 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full shadow-lg animate-pulse">
                    <Sparkles className="h-3 w-3 lg:h-4 lg:w-4 text-white" />
                  </div>
                </div>
                
                <div className="space-y-2 lg:space-y-4 w-full">
                  <div className="space-y-1 lg:space-y-2">
                    <h1 className="text-2xl sm:text-3xl lg:text-5xl font-black bg-gradient-to-r from-amber-700 via-orange-700 to-red-700 bg-clip-text text-transparent leading-tight tracking-tight">
                      Devolutiva Musicoterapia TEA
                    </h1>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full shadow-sm" />
                      <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-700">
                        Relatório Especializado TEA
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-3xl leading-relaxed font-medium">
                    Relatório de devolutiva especializado em musicoterapia para pacientes com Transtorno do Espectro Autista, 
                    incluindo conquistas, recomendações e orientações para família e equipe.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 lg:mt-8 flex flex-wrap items-center gap-2 lg:gap-4">
              <Badge className="flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-4 py-1.5 lg:py-2.5 bg-white/80 text-amber-700 border-amber-200/50">
                <Target className="h-4 w-4 lg:h-5 lg:w-5" />
                Análise Especializada
              </Badge>
              <Badge className="flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-4 py-1.5 lg:py-2.5 bg-white/80 text-orange-700 border-orange-200/50">
                <Heart className="h-4 w-4 lg:h-5 lg:w-5" />
                Orientações Práticas
              </Badge>
              <Badge className="flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-4 py-1.5 lg:py-2.5 bg-white/80 text-red-700 border-red-200/50">
                <CheckCircle className="h-4 w-4 lg:h-5 lg:w-5" />
                Plano de Continuidade
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 lg:space-y-6">
        <TabsList className="grid w-full grid-cols-2 h-10 sm:h-12">
          <TabsTrigger value="form" className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
            <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
            Formulário
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
            Visualização
          </TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="space-y-4 lg:space-y-6">
          {/* Patient Selection */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-white via-amber-50/30 to-orange-50/30">
            <CardHeader className="pb-3 lg:pb-4">
              <CardTitle className="flex items-center gap-2 lg:gap-3 text-lg lg:text-xl">
                <div className="p-1.5 lg:p-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg">
                  <User className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                </div>
                Seleção de Paciente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="patient" className="text-sm font-semibold text-gray-700">
                  Paciente *
                </Label>
                <Select 
                  value={selectedPatient?.id || ""} 
                  onValueChange={handlePatientSelection}
                >
                  <SelectTrigger className="h-10 sm:h-12 border-2 border-gray-200 focus:border-amber-500 transition-colors bg-white">
                    <SelectValue placeholder={isLoadingPatients ? "Carregando..." : "Selecione um paciente"} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg z-50">
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id} className="hover:bg-gray-50">
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Form Sections */}
          <div className="grid gap-6">
            {formSections.map((section, index) => {
              const IconComponent = section.icon;

              return (
                <Card key={section.key} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className={`absolute inset-0 bg-gradient-to-r ${section.gradient} p-[1px] rounded-lg`}>
                    <div className="h-full w-full bg-white rounded-lg" />
                  </div>
                  
                  <div className="relative z-10">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <div className={`p-2 bg-gradient-to-r ${section.gradient} rounded-lg`}>
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="px-3 py-1 text-sm font-bold">
                            {index + 1}
                          </Badge>
                          <div>
                            <div className="font-bold text-gray-800">{section.title}</div>
                            <div className="text-sm text-gray-600 font-normal">{section.description}</div>
                          </div>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={formData[section.key as keyof DevolutivaData]}
                        onChange={(e) => updateField(section.key as keyof DevolutivaData, e.target.value)}
                        placeholder={`Digite ${section.title.toLowerCase()}...`}
                        className="min-h-[120px] border-2 focus:border-amber-500 transition-colors"
                      />
                    </CardContent>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end sticky bottom-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg border">
            <Button
              variant="outline"
              onClick={() => navigate('/processes')}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleGeneratePDF}
              disabled={isGeneratingPDF || !selectedPatient}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Download className="h-4 w-4 mr-2" />
              {isGeneratingPDF ? "Gerando..." : "Exportar PDF"}
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || !selectedPatient}
              className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Salvando..." : "Salvar Devolutiva"}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Visualização da Devolutiva
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {selectedPatient ? (
                <>
                  <div className="border-b pb-4">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      Devolutiva Musicoterapia - {formData.patient_name}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Data: {new Date().toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-sm text-gray-600">
                      Profissional: {professionalData?.name}
                    </p>
                  </div>

                  {formSections.map((section) => {
                    const value = formData[section.key as keyof DevolutivaData];
                    if (!value) return null;

                    return (
                      <div key={section.key} className="space-y-2">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                          {React.createElement(section.icon, { className: "h-5 w-5" })}
                          {section.title}
                        </h3>
                        <p className="text-gray-700 whitespace-pre-wrap">{value}</p>
                      </div>
                    );
                  })}
                </>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  Selecione um paciente e preencha o formulário para visualizar a devolutiva
                </p>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              onClick={handleGeneratePDF}
              disabled={isGeneratingPDF || !selectedPatient}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
            >
              <Download className="h-4 w-4 mr-2" />
              {isGeneratingPDF ? "Gerando..." : "Exportar PDF"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
