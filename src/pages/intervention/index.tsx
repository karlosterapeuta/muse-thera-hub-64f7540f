import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Download,
  Music2,
  Save,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Clock,
  Target,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import html2pdf from "html2pdf.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { PatientSelect } from "@/pages/anamnesis/components/PatientSelect";
import { therapyActivities, disorderOptions } from "@/data/therapy-activities";
import { TherapyActivity, Disorder } from "@/types/therapy-activity";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type Patient = {
  id: string;
  name: string;
};

export default function InterventionForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [selectedDemands, setSelectedDemands] = useState<Record<string, string[]>>({});
  const [suggestedActivities, setSuggestedActivities] = useState<TherapyActivity[]>([]);
  const [expandedActivities, setExpandedActivities] = useState<Set<string>>(new Set());
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<string>("");

  const formatNameFromEmail = (email: string) => {
    const namePart = email.split('@')[0];
    return namePart
      .split(/[._-]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoadingPatients(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast({
            variant: "destructive",
            title: "Não autenticado",
            description: "Você precisa estar logado para acessar esta página.",
          });
          navigate("/login");
          return;
        }

        setUserEmail(user.email || "");
        setUserName(formatNameFromEmail(user.email || ""));

        const { data, error } = await supabase
          .from("patients")
          .select("id, name")
          .eq("professional_id", user.id)
          .order("name");

        if (error) {
          toast({
            variant: "destructive",
            title: "Erro ao carregar pacientes",
            description: "Não foi possível carregar a lista de pacientes.",
          });
          return;
        }

        setPatients(data || []);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: "Ocorreu um erro ao buscar informações do usuário.",
        });
      } finally {
        setIsLoadingPatients(false);
      }
    };

    fetchUserData();
  }, [toast, navigate]);

  const handleDemandToggle = (disorder: string, demand: string) => {
    setSelectedDemands(prev => {
      const current = prev[disorder] || [];
      const updated = current.includes(demand)
        ? current.filter(d => d !== demand)
        : [...current, demand];
      
      return {
        ...prev,
        [disorder]: updated
      };
    });
  };

  const generateSuggestions = async () => {
    if (!selectedPatient) {
      toast({
        variant: "destructive",
        title: "Selecione um paciente",
        description: "É necessário selecionar um paciente antes de gerar sugestões.",
      });
      return;
    }

    const selectedDisorders = Object.keys(selectedDemands).filter(
      disorder => selectedDemands[disorder].length > 0
    );

    if (selectedDisorders.length === 0) {
      toast({
        variant: "destructive",
        title: "Selecione demandas",
        description: "Selecione pelo menos uma demanda para gerar sugestões.",
      });
      return;
    }

    setIsGenerating(true);
    setGenerationProgress("Consultando dados do paciente...");

    try {
      // Buscar dados do paciente
      const patient = patients.find(p => p.id === selectedPatient);
      
      if (!patient) {
        throw new Error("Paciente não encontrado");
      }

      setGenerationProgress("Gerando atividades personalizadas com IA...");

      // Chamar Edge Function
      const { data, error } = await supabase.functions.invoke('generate-therapy-activities', {
        body: {
          patientName: patient.name,
          selectedDemands: selectedDemands
        }
      });

      if (error) {
        console.error("Erro da Edge Function:", error);
        throw error;
      }

      setGenerationProgress("Processando atividades...");

      // Validar resposta
      if (!data?.activities || !Array.isArray(data.activities)) {
        throw new Error("Formato de resposta inválido");
      }

      if (data.activities.length !== 10) {
        throw new Error(`Esperado 10 atividades, recebido ${data.activities.length}`);
      }

      // Atualizar estado
      setSuggestedActivities(data.activities);
      setShowSuggestions(true);

      toast({
        title: "✨ Atividades geradas com sucesso!",
        description: `${data.activities.length} atividades personalizadas criadas pela IA.`,
      });

    } catch (error: any) {
      console.error("Erro ao gerar atividades:", error);
      
      let errorTitle = "Erro ao gerar atividades";
      let errorDescription = "Não foi possível gerar as sugestões. Tente novamente.";

      if (error.message?.includes("GOOGLE_AI_API_KEY")) {
        errorTitle = "Configuração da API";
        errorDescription = "Chave da API não configurada. Entre em contato com o suporte.";
      } else if (error.message?.includes("Erro na API Gemini")) {
        errorTitle = "Erro na API de IA";
        errorDescription = "O serviço de IA está temporariamente indisponível.";
      }

      toast({
        variant: "destructive",
        title: errorTitle,
        description: errorDescription,
      });
    } finally {
      setIsGenerating(false);
      setGenerationProgress("");
    }
  };

  const toggleActivity = (id: string) => {
    setExpandedActivities(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const savePlan = async () => {
    if (!selectedPatient || suggestedActivities.length === 0) {
      toast({
        variant: "destructive",
        title: "Dados incompletos",
        description: "Selecione um paciente e gere sugestões antes de salvar.",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const planData = {
        patient_id: selectedPatient,
        professional_id: user.id,
        created_at: new Date().toISOString(),
        status: 'active',
        activities: suggestedActivities.map(a => a.id),
        selected_demands: selectedDemands
      };

      // Salvar no banco de dados (você pode criar uma tabela específica para PTI)
      toast({
        title: "Plano salvo com sucesso!",
        description: "O Plano Terapêutico Individual foi registrado.",
      });

    } catch (error) {
      console.error("Erro ao salvar plano:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Não foi possível salvar o plano.",
      });
    }
  };

  const generatePDF = async () => {
    if (!selectedPatient || suggestedActivities.length === 0) {
      toast({
        variant: "destructive",
        title: "Dados incompletos",
        description: "Gere sugestões antes de baixar o PDF.",
      });
      return;
    }

    try {
      const patient = patients.find(p => p.id === selectedPatient);
      if (!patient) throw new Error("Paciente não encontrado");

      const element = document.createElement('div');
      
      const activitiesHTML = suggestedActivities.map((activity, index) => `
        <div style="margin-bottom: 24px; page-break-inside: avoid;">
          <div style="background: linear-gradient(to right, #2563EB, #1E40AF); color: white; padding: 12px 16px; border-radius: 8px 8px 0 0; font-weight: bold; font-size: 16px;">
            Atividade ${index + 1}: ${activity.disorder}
          </div>
          <div style="border: 2px solid #E5E7EB; border-top: none; padding: 16px; border-radius: 0 0 8px 8px;">
            <div style="margin-bottom: 12px;">
              <strong style="color: #1F2937;">Transtorno:</strong> <span style="color: #4B5563;">${activity.disorder}</span> | 
              <strong style="color: #1F2937;">Demanda:</strong> <span style="color: #4B5563;">${activity.demand}</span> | 
              <strong style="color: #1F2937;">Especialidade:</strong> <span style="color: #4B5563;">${activity.specialty}</span>
            </div>
            <div style="margin-bottom: 12px;">
              <strong style="color: #1F2937; display: block; margin-bottom: 4px;">Objetivo Terapêutico Geral:</strong>
              <p style="color: #374151; margin: 0; line-height: 1.6;">${activity.generalObjective}</p>
            </div>
            <div style="margin-bottom: 12px;">
              <strong style="color: #1F2937; display: block; margin-bottom: 4px;">Objetivo Específico:</strong>
              <p style="color: #374151; margin: 0; line-height: 1.6;">${activity.specificObjective}</p>
            </div>
            <div style="margin-bottom: 12px;">
              <strong style="color: #1F2937; display: block; margin-bottom: 4px;">Descrição da Atividade:</strong>
              <p style="color: #374151; margin: 0; line-height: 1.6;">${activity.activityDescription}</p>
            </div>
            <div style="margin-bottom: 12px;">
              <strong style="color: #1F2937; display: block; margin-bottom: 4px;">Materiais Necessários:</strong>
              <ul style="color: #374151; margin: 4px 0; padding-left: 20px; line-height: 1.6;">
                ${activity.materials.map(m => `<li>${m}</li>`).join('')}
              </ul>
            </div>
            <div style="margin-bottom: 12px; display: flex; gap: 16px;">
              <div><strong style="color: #1F2937;">Tempo:</strong> <span style="color: #4B5563;">${activity.estimatedTime}</span></div>
              <div><strong style="color: #1F2937;">Complexidade:</strong> <span style="color: #4B5563;">${activity.complexityLevel}</span></div>
            </div>
            <div>
              <strong style="color: #1F2937; display: block; margin-bottom: 4px;">Critérios de Avaliação:</strong>
              <ul style="color: #374151; margin: 4px 0; padding-left: 20px; line-height: 1.6;">
                ${activity.evaluationCriteria.map(c => `<li>${c}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
      `).join('');

      element.innerHTML = `
        <div style="padding: 40px; font-family: Arial, sans-serif; max-width: 900px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 3px solid #2563EB;">
            <h1 style="color: #2563EB; font-size: 28px; font-weight: bold; margin-bottom: 12px;">
              Plano Terapêutico Individual (PTI)
            </h1>
            <h2 style="color: #1F2937; font-size: 20px; margin-bottom: 8px;">
              Musicoterapia
            </h2>
            <p style="color: #6B7280; font-size: 16px; margin-bottom: 4px;">
              <strong>Paciente:</strong> ${patient.name}
            </p>
            <p style="color: #6B7280; font-size: 14px;">
              Data: ${format(new Date(), "PPP", { locale: ptBR })}
            </p>
          </div>

          <div style="margin-bottom: 32px;">
            ${activitiesHTML}
          </div>

          <div style="margin-top: 40px; padding-top: 24px; border-top: 2px solid #E5E7EB;">
            <p style="color: #6B7280; font-size: 11px; margin-bottom: 4px; text-align: center;">
              Documento gerado em ${format(new Date(), "PPP", { locale: ptBR })} às ${new Date().toLocaleTimeString('pt-BR')}
            </p>
            <p style="color: #6B7280; font-size: 11px; margin-bottom: 4px; text-align: center;">
              Musetera - Sistema de Gestão para Musicoterapia
            </p>
            <p style="color: #6B7280; font-size: 11px; margin-bottom: 4px; text-align: center;">
              Musicoterapeuta: ${userName} | Email: ${userEmail}
            </p>
          </div>
        </div>
      `;

      const opt = {
        margin: [15, 15, 15, 15],
        filename: `PTI - ${patient.name} - ${format(new Date(), "dd-MM-yyyy")}.pdf`,
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
      
      toast({
        title: "PDF gerado com sucesso!",
        description: "O Plano Terapêutico Individual foi baixado.",
      });
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast({
        variant: "destructive",
        title: "Erro ao gerar PDF",
        description: "Não foi possível gerar o PDF do plano.",
      });
    }
  };

  const getComplexityColor = (level: string) => {
    switch (level) {
      case 'Leve': return 'bg-green-100 text-green-800 border-green-300';
      case 'Moderado': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Severo': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-6xl">
      {/* Saved Plans Section */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music2 className="h-6 w-6 text-primary" />
            Planos de Intervenção Salvos
          </CardTitle>
          <CardDescription>
            Visualize, baixe ou exclua os planos gerados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Nenhum plano de atividades salvo ainda.
          </p>
        </CardContent>
      </Card>

      {/* Create New Plan Section */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl">Criar Novo Plano de Intervenção</CardTitle>
          <CardDescription>
            Selecione o paciente e as demandas para gerar sugestões de atividades para a sua especialidade: <span className="text-primary font-semibold">Musicoterapia</span>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Patient Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-3">1. Nome do Paciente</h3>
            <PatientSelect 
              patients={patients}
              selectedPatient={selectedPatient}
              onSelect={setSelectedPatient}
              isLoading={isLoadingPatients}
              emptyMessage="Nenhum paciente cadastrado"
            />
          </div>

          {/* Demands Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-4">2. Principais Demandas</h3>
            <div className="space-y-4">
              {disorderOptions.map((option) => (
                <Card key={option.disorder} className="overflow-hidden">
                  <div className={`bg-gradient-to-r ${option.color} p-4 text-white`}>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{option.icon}</span>
                      <h4 className="font-semibold text-lg">{option.label}</h4>
                    </div>
                  </div>
                  <CardContent className="pt-4">
                    <div className="grid gap-3 md:grid-cols-2">
                      {option.demands.map((demand) => (
                        <div
                          key={demand}
                          className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent transition-colors"
                        >
                          <Checkbox
                            id={`${option.disorder}-${demand}`}
                            checked={selectedDemands[option.disorder]?.includes(demand) || false}
                            onCheckedChange={() => handleDemandToggle(option.disorder, demand)}
                          />
                          <label
                            htmlFor={`${option.disorder}-${demand}`}
                            className="text-sm font-medium leading-none cursor-pointer flex-1"
                          >
                            {demand}
                          </label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button 
              onClick={generateSuggestions} 
              size="lg" 
              className="w-full"
              disabled={isGenerating || !selectedPatient || Object.keys(selectedDemands).filter(d => selectedDemands[d].length > 0).length === 0}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {generationProgress || "Gerando..."}
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  3. Gerar Sugestões com IA
                </>
              )}
            </Button>
            
            {showSuggestions && suggestedActivities.length > 0 && (
              <>
                <Button 
                  onClick={savePlan}
                  size="lg" 
                  variant="default"
                  className="w-full"
                >
                  <Save className="mr-2 h-5 w-5" />
                  Salvar Plano
                </Button>
                <Button 
                  onClick={generatePDF}
                  size="lg" 
                  variant="outline"
                  className="w-full"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Baixar PDF
                </Button>
              </>
            )}
          </div>

          {/* Instructions */}
          {!showSuggestions && (
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Selecione um paciente, escolha as demandas e clique em 'Gerar Sugestões' para começar.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Suggested Activities */}
      {showSuggestions && suggestedActivities.length > 0 && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              Atividades Sugeridas ({suggestedActivities.length})
            </CardTitle>
            <CardDescription>
              Plano Terapêutico Individual baseado nas demandas selecionadas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {suggestedActivities.map((activity, index) => {
              const isExpanded = expandedActivities.has(activity.id);
              return (
                <Card key={activity.id} className="overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-primary to-primary/80 text-white p-4 cursor-pointer hover:from-primary/90 hover:to-primary/70 transition-all"
                    onClick={() => toggleActivity(activity.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold">#{index + 1}</span>
                        <div>
                          <h4 className="font-bold text-lg">{activity.disorder}</h4>
                          <p className="text-sm opacity-90">{activity.demand}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getComplexityColor(activity.complexityLevel)}>
                          {activity.complexityLevel}
                        </Badge>
                        {isExpanded ? <ChevronUp /> : <ChevronDown />}
                      </div>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <Badge variant="outline">{activity.specialty}</Badge>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {activity.estimatedTime}
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h5 className="font-semibold text-sm mb-2 flex items-center gap-2">
                          <Target className="h-4 w-4 text-primary" />
                          Objetivo Terapêutico Geral
                        </h5>
                        <p className="text-sm text-muted-foreground">{activity.generalObjective}</p>
                      </div>

                      <div>
                        <h5 className="font-semibold text-sm mb-2 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          Objetivo Específico
                        </h5>
                        <p className="text-sm text-muted-foreground">{activity.specificObjective}</p>
                      </div>

                      <Separator />

                      <div>
                        <h5 className="font-semibold text-sm mb-2">Descrição da Atividade</h5>
                        <p className="text-sm text-muted-foreground leading-relaxed">{activity.activityDescription}</p>
                      </div>

                      <div>
                        <h5 className="font-semibold text-sm mb-2">Materiais Necessários</h5>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                          {activity.materials.map((material, i) => (
                            <li key={i}>{material}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-semibold text-sm mb-2 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-primary" />
                          Critérios de Avaliação
                        </h5>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                          {activity.evaluationCriteria.map((criterion, i) => (
                            <li key={i}>{criterion}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </CardContent>
        </Card>
      )}

      {showSuggestions && suggestedActivities.length === 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-yellow-800">
              <AlertCircle className="h-5 w-5" />
              <p className="font-medium">
                Nenhuma atividade encontrada para as demandas selecionadas. 
                Tente selecionar outras combinações de transtornos e demandas.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
