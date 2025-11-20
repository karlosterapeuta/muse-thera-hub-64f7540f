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
  Loader2,
  Trash2,
  Eye
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { PatientSelect } from "@/pages/anamnesis/components/PatientSelect";
import { therapyActivities, disorderOptions, teaDemandCategories, tdahDemandCategories, todDemandCategories, diDemandCategories } from "@/data/therapy-activities";
import { TherapyActivity, Disorder } from "@/types/therapy-activity";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
  const [selectedSubDemands, setSelectedSubDemands] = useState<Record<string, string[]>>({});
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [suggestedActivities, setSuggestedActivities] = useState<TherapyActivity[]>([]);
  const [expandedActivities, setExpandedActivities] = useState<Set<string>>(new Set());
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<string>("");
  const [savedPlans, setSavedPlans] = useState<any[]>([]);
  const [isLoadingSavedPlans, setIsLoadingSavedPlans] = useState(false);
  const [viewingPlan, setViewingPlan] = useState<any | null>(null);

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
    fetchSavedPlans();
  }, [toast, navigate]);

  const fetchSavedPlans = async () => {
    try {
      setIsLoadingSavedPlans(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Buscar professional_id
      const { data: professional } = await supabase
        .from('professionals')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!professional?.id) return;

      // Buscar planos salvos
      const { data: plans, error } = await supabase
        .from('treatment_plans')
        .select(`
          id,
          created_at,
          patient_id,
          status,
          general_objectives,
          complementary_materials
        `)
        .eq('professional_id', professional.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Enriquecer com nomes dos pacientes
      const enrichedPlans = await Promise.all(
        (plans || []).map(async (plan) => {
          const { data: patient } = await supabase
            .from('patients')
            .select('name')
            .eq('id', plan.patient_id)
            .single();
          
          return {
            ...plan,
            patient_name: patient?.name || 'Paciente não encontrado'
          };
        })
      );

      setSavedPlans(enrichedPlans);
    } catch (error) {
      console.error("Erro ao carregar planos salvos:", error);
    } finally {
      setIsLoadingSavedPlans(false);
    }
  };

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

  const handleSubDemandToggle = (category: string, subDemandLabel: string) => {
    setSelectedSubDemands(prev => {
      const current = prev[category] || [];
      const updated = current.includes(subDemandLabel)
        ? current.filter(d => d !== subDemandLabel)
        : [...current, subDemandLabel];
      
      return {
        ...prev,
        [category]: updated
      };
    });
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
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

    const hasSubDemands = Object.values(selectedSubDemands).some(arr => arr.length > 0);

    if (selectedDisorders.length === 0 && !hasSubDemands) {
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
          selectedDemands: selectedDemands,
          selectedSubDemands: selectedSubDemands
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

      // Buscar ou criar profissional
      let { data: professional, error: profError } = await supabase
        .from('professionals')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profError) throw profError;

      // Se não existir, criar automaticamente
      if (!professional?.id) {
        const { data: newProfessional, error: createError } = await supabase
          .from('professionals')
          .insert({
            user_id: user.id,
            name: userName || formatNameFromEmail(user.email || ''),
            email: user.email,
          })
          .select('id')
          .single();

        if (createError) throw createError;
        professional = newProfessional;
      }

      // Inserir o plano na tabela treatment_plans
      const { error: insertError } = await supabase
        .from('treatment_plans')
        .insert({
          patient_id: selectedPatient,
          professional_id: professional.id,
          status: 'active',
          general_objectives: { selected_demands: selectedDemands } as any,
          complementary_materials: { activities: suggestedActivities } as any,
        });

      if (insertError) throw insertError;

      // Recarregar lista de planos
      await fetchSavedPlans();

      toast({
        title: "Plano salvo com sucesso!",
        description: "O Plano de Intervenção foi registrado.",
      });
    } catch (error: any) {
      console.error("Erro ao salvar plano:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: error?.message || "Não foi possível salvar o plano.",
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
              Plano Intervenção Individual (PII)
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
        filename: `PII - ${patient.name} - ${format(new Date(), "dd-MM-yyyy")}.pdf`,
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
        description: "O Plano Intervenção Individual foi baixado.",
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

  const deletePlan = async (planId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (!confirm("Tem certeza que deseja excluir este plano?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('treatment_plans')
        .delete()
        .eq('id', planId);

      if (error) {
        console.error("Erro ao excluir:", error);
        throw error;
      }

      // Atualizar lista local removendo o plano
      setSavedPlans(prev => prev.filter(p => p.id !== planId));

      toast({
        title: "Plano excluído",
        description: "O plano foi removido com sucesso.",
      });
    } catch (error: any) {
      console.error("Erro ao excluir plano:", error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: error?.message || "Não foi possível excluir o plano.",
      });
    }
  };

  const downloadPlanPDF = async (plan: any) => {
    try {
      const activities = plan.complementary_materials?.activities || [];
      if (activities.length === 0) {
        toast({
          variant: "destructive",
          title: "Sem atividades",
          description: "Este plano não possui atividades para gerar PDF.",
        });
        return;
      }

      const element = document.createElement('div');
      
      const activitiesHTML = activities.map((activity: any, index: number) => `
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
                ${activity.materials.map((m: string) => `<li>${m}</li>`).join('')}
              </ul>
            </div>
            <div style="margin-bottom: 12px; display: flex; gap: 16px;">
              <div><strong style="color: #1F2937;">Tempo:</strong> <span style="color: #4B5563;">${activity.estimatedTime}</span></div>
              <div><strong style="color: #1F2937;">Complexidade:</strong> <span style="color: #4B5563;">${activity.complexityLevel}</span></div>
            </div>
            <div>
              <strong style="color: #1F2937; display: block; margin-bottom: 4px;">Critérios de Avaliação:</strong>
              <ul style="color: #374151; margin: 4px 0; padding-left: 20px; line-height: 1.6;">
                ${activity.evaluationCriteria.map((c: string) => `<li>${c}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
      `).join('');

      element.innerHTML = `
        <div style="padding: 40px; font-family: Arial, sans-serif; max-width: 900px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 3px solid #2563EB;">
              <h1 style="color: #2563EB; font-size: 28px; font-weight: bold; margin-bottom: 12px;">
                Plano de Intervenção (PI)
              </h1>
            <h2 style="color: #1F2937; font-size: 20px; margin-bottom: 8px;">
              Musicoterapia
            </h2>
            <p style="color: #6B7280; font-size: 16px; margin-bottom: 4px;">
              <strong>Paciente:</strong> ${plan.patient_name}
            </p>
            <p style="color: #6B7280; font-size: 14px;">
              Data: ${format(new Date(plan.created_at), "PPP", { locale: ptBR })}
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
        filename: `PTI - ${plan.patient_name} - ${format(new Date(plan.created_at), "dd-MM-yyyy")}.pdf`,
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
        description: "O Plano de Intervenção foi baixado.",
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
    <div className="w-full px-0 py-2 sm:py-4 space-y-3 sm:space-y-4">
      {/* Saved Plans Section */}
      <Card className="mx-1 sm:mx-2 border-primary/20">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-2xl">
            <Music2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            Planos de Intervenção Salvos
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Visualize, baixe ou exclua os planos gerados.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {isLoadingSavedPlans ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin text-primary" />
              <span className="ml-2 text-sm sm:text-base text-muted-foreground">Carregando planos...</span>
            </div>
          ) : savedPlans.length === 0 ? (
            <p className="text-muted-foreground text-center py-8 text-sm sm:text-base">
              Nenhum plano de atividades salvo ainda.
            </p>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {savedPlans.slice(0, 3).map((plan) => (
                <Card key={plan.id} className="border-border/50">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-base sm:text-lg truncate">{plan.patient_name}</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Criado em {format(new Date(plan.created_at), "PPP", { locale: ptBR })}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {plan.complementary_materials?.activities?.length || 0} atividades
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setViewingPlan(plan)}
                          className="flex-1 sm:flex-none text-xs sm:text-sm"
                        >
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                          <span className="hidden sm:inline">Visualizar</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadPlanPDF(plan)}
                          className="flex-1 sm:flex-none text-xs sm:text-sm"
                        >
                          <Download className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                          <span className="hidden sm:inline">PDF</span>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={(e) => deletePlan(plan.id, e)}
                          className="text-xs sm:text-sm"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {savedPlans.length > 3 && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/intervention-plans')}
                >
                  Ver Todos os Planos ({savedPlans.length})
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create New Plan Section */}
      <Card className="mx-1 sm:mx-2 border-primary/20">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl md:text-2xl">Criar Novo Plano de Intervenção</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Selecione o paciente e as demandas para gerar sugestões de atividades para a sua especialidade: <span className="text-primary font-semibold">Musicoterapia</span>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
          {/* Patient Selection */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">1. Nome do Paciente</h3>
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
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">2. Principais Demandas</h3>
            <div className="space-y-3 sm:space-y-4">
              {disorderOptions.map((option) => (
                <Card key={option.disorder} className="overflow-hidden">
                  <div className={`bg-gradient-to-r ${option.color} p-3 sm:p-4 text-white`}>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="text-2xl sm:text-3xl">{option.icon}</span>
                      <h4 className="font-semibold text-base sm:text-lg">{option.label}</h4>
                    </div>
                  </div>
                  <CardContent className="pt-3 sm:pt-4 p-3 sm:p-6">
                    {option.disorder === 'TEA' ? (
                      // TEA com sub-demandas hierárquicas
                      <div className="space-y-2 sm:space-y-3">
                        {teaDemandCategories.map((category) => {
                          const selectedCount = selectedSubDemands[category.category]?.length || 0;
                          const totalCount = category.subDemands.length;
                          
                          return (
                            <Collapsible
                              key={category.category}
                              open={expandedCategories[category.category]}
                              onOpenChange={() => toggleCategory(category.category)}
                            >
                              <div className="border rounded-lg overflow-hidden">
                                <CollapsibleTrigger className="w-full">
                                  <div className="flex items-center justify-between p-3 sm:p-4 hover:bg-accent transition-colors">
                                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                      <span className="text-xl sm:text-2xl flex-shrink-0">{category.icon}</span>
                                      <div className="text-left min-w-0 flex-1">
                                        <h5 className="font-semibold text-sm sm:text-base truncate">{category.category}</h5>
                                        <p className="text-xs text-muted-foreground">
                                          {selectedCount > 0 ? `${selectedCount}/${totalCount} selecionadas` : `${totalCount} sub-demandas`}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                      {selectedCount > 0 && (
                                        <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                                          {selectedCount}
                                        </Badge>
                                      )}
                                      {expandedCategories[category.category] ? (
                                        <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                                      ) : (
                                        <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                                      )}
                                    </div>
                                  </div>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                  <div className="p-3 sm:p-4 pt-0 space-y-2 bg-muted/30">
                                    {category.subDemands.map((subDemand) => (
                                      <div
                                        key={subDemand.id}
                                        className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg bg-background border hover:border-primary/50 transition-colors"
                                      >
                                        <Checkbox
                                          id={subDemand.id}
                                          checked={selectedSubDemands[category.category]?.includes(subDemand.label) || false}
                                          onCheckedChange={() => handleSubDemandToggle(category.category, subDemand.label)}
                                          className="mt-0.5"
                                        />
                                        <div className="flex-1 min-w-0">
                                          <label
                                            htmlFor={subDemand.id}
                                            className="text-xs sm:text-sm font-medium leading-none cursor-pointer block"
                                          >
                                            {subDemand.label}
                                          </label>
                                          {subDemand.associatedConditions && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                              Condições associadas: {subDemand.associatedConditions.join(', ')}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </CollapsibleContent>
                              </div>
                            </Collapsible>
                          );
                        })}
                      </div>
                    ) : option.disorder === 'TDAH' ? (
                      // TDAH com estrutura hierárquica
                      <div className="space-y-2 sm:space-y-3">
                        {tdahDemandCategories.map((category) => {
                          const isExpanded = expandedCategories[category.category] || false;
                          const selectedCount = selectedSubDemands[category.category]?.length || 0;
                          const totalCount = category.subDemands.length;

                          return (
                            <Collapsible key={category.category} open={isExpanded}>
                              <div className="border rounded-lg overflow-hidden">
                                <CollapsibleTrigger
                                  onClick={() => toggleCategory(category.category)}
                                  className="w-full p-3 sm:p-4 flex items-center justify-between hover:bg-accent transition-colors"
                                >
                                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                    <span className="text-xl sm:text-2xl flex-shrink-0">{category.icon}</span>
                                    <div className="text-left min-w-0 flex-1">
                                      <div className="font-semibold text-sm sm:text-base truncate">{category.category}</div>
                                      <div className="text-xs text-muted-foreground">
                                        {selectedCount}/{totalCount} selecionadas
                                      </div>
                                    </div>
                                  </div>
                                  <ChevronDown 
                                    className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                                  />
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                  <div className="p-3 sm:p-4 pt-2 space-y-2 sm:space-y-3 border-t">
                                    {category.subDemands.map((subDemand) => (
                                      <div key={subDemand.id} className="flex items-start gap-2 sm:gap-3">
                                        <Checkbox
                                          id={subDemand.id}
                                          checked={selectedSubDemands[category.category]?.includes(subDemand.label) || false}
                                          onCheckedChange={() => handleSubDemandToggle(category.category, subDemand.label)}
                                        />
                                        <div className="flex-1 min-w-0">
                                          <Label
                                            htmlFor={subDemand.id}
                                            className="text-xs sm:text-sm font-medium leading-none cursor-pointer block"
                                          >
                                            {subDemand.label}
                                          </Label>
                                          {subDemand.associatedConditions && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                              Condições associadas: {subDemand.associatedConditions.join(', ')}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </CollapsibleContent>
                              </div>
                            </Collapsible>
                          );
                        })}
                      </div>
                    ) : option.disorder === 'TOD' ? (
                      // TOD com estrutura hierárquica
                      <div className="space-y-2 sm:space-y-3">
                        {todDemandCategories.map((category) => {
                          const isExpanded = expandedCategories[category.category] || false;
                          const selectedCount = selectedSubDemands[category.category]?.length || 0;
                          const totalCount = category.subDemands.length;

                          return (
                            <Collapsible key={category.category} open={isExpanded}>
                              <div className="border rounded-lg overflow-hidden">
                                <CollapsibleTrigger
                                  onClick={() => toggleCategory(category.category)}
                                  className="w-full p-3 sm:p-4 flex items-center justify-between hover:bg-accent transition-colors"
                                >
                                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                    <span className="text-xl sm:text-2xl flex-shrink-0">{category.icon}</span>
                                    <div className="text-left min-w-0 flex-1">
                                      <div className="font-semibold text-sm sm:text-base truncate">{category.category}</div>
                                      <div className="text-xs text-muted-foreground">
                                        {selectedCount}/{totalCount} selecionadas
                                      </div>
                                    </div>
                                  </div>
                                  <ChevronDown 
                                    className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                                  />
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                  <div className="p-3 sm:p-4 pt-2 space-y-2 sm:space-y-3 border-t">
                                    {category.subDemands.map((subDemand) => (
                                      <div key={subDemand.id} className="flex items-start gap-2 sm:gap-3">
                                        <Checkbox
                                          id={subDemand.id}
                                          checked={selectedSubDemands[category.category]?.includes(subDemand.label) || false}
                                          onCheckedChange={() => handleSubDemandToggle(category.category, subDemand.label)}
                                        />
                                        <div className="flex-1 min-w-0">
                                          <Label
                                            htmlFor={subDemand.id}
                                            className="text-xs sm:text-sm font-medium leading-none cursor-pointer block"
                                          >
                                            {subDemand.label}
                                          </Label>
                                          {subDemand.associatedConditions && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                              Condições associadas: {subDemand.associatedConditions.join(', ')}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </CollapsibleContent>
                              </div>
                            </Collapsible>
                          );
                        })}
                      </div>
                    ) : option.disorder === 'DI' ? (
                      // DI com estrutura hierárquica
                      <div className="space-y-2 sm:space-y-3">
                        {diDemandCategories.map((category) => {
                          const isExpanded = expandedCategories[category.category] || false;
                          const selectedCount = selectedSubDemands[category.category]?.length || 0;
                          const totalCount = category.subDemands.length;

                          return (
                            <Collapsible key={category.category} open={isExpanded}>
                              <div className="border rounded-lg overflow-hidden">
                                <CollapsibleTrigger
                                  onClick={() => toggleCategory(category.category)}
                                  className="w-full p-3 sm:p-4 flex items-center justify-between hover:bg-accent transition-colors"
                                >
                                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                    <span className="text-xl sm:text-2xl flex-shrink-0">{category.icon}</span>
                                    <div className="text-left min-w-0 flex-1">
                                      <div className="font-semibold text-sm sm:text-base truncate">{category.category}</div>
                                      <div className="text-xs text-muted-foreground">
                                        {selectedCount}/{totalCount} selecionadas
                                      </div>
                                    </div>
                                  </div>
                                  <ChevronDown 
                                    className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                                  />
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                  <div className="p-3 sm:p-4 pt-2 space-y-2 sm:space-y-3 border-t">
                                    {category.subDemands.map((subDemand) => (
                                      <div key={subDemand.id} className="flex items-start gap-2 sm:gap-3">
                                        <Checkbox
                                          id={subDemand.id}
                                          checked={selectedSubDemands[category.category]?.includes(subDemand.label) || false}
                                          onCheckedChange={() => handleSubDemandToggle(category.category, subDemand.label)}
                                        />
                                        <div className="flex-1 min-w-0">
                                          <Label
                                            htmlFor={subDemand.id}
                                            className="text-xs sm:text-sm font-medium leading-none cursor-pointer block"
                                          >
                                            {subDemand.label}
                                          </Label>
                                          {subDemand.associatedConditions && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                              Condições associadas: {subDemand.associatedConditions.join(', ')}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </CollapsibleContent>
                              </div>
                            </Collapsible>
                          );
                        })}
                        
                        {/* Autonomia como demanda adicional simples */}
                        <div className="border rounded-lg p-3 sm:p-4">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <Checkbox
                              id="di-autonomia"
                              checked={selectedDemands['DI']?.includes('Autonomia') || false}
                              onCheckedChange={() => handleDemandToggle('DI', 'Autonomia')}
                            />
                            <label
                              htmlFor="di-autonomia"
                              className="text-xs sm:text-sm font-medium leading-none cursor-pointer flex-1"
                            >
                              Autonomia
                            </label>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 sm:gap-3">
            <Button 
              onClick={generateSuggestions} 
              size="lg" 
              className="w-full"
              disabled={isGenerating || !selectedPatient || (Object.keys(selectedDemands).filter(d => selectedDemands[d].length > 0).length === 0 && Object.values(selectedSubDemands).every(arr => arr.length === 0))}
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
            <div className="bg-muted p-3 sm:p-4 rounded-lg">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Selecione um paciente, escolha as demandas e clique em 'Gerar Sugestões' para começar.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Suggested Activities */}
      {showSuggestions && suggestedActivities.length > 0 && (
        <Card className="mx-1 sm:mx-2 border-primary/20">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-2xl">
              <Target className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              Atividades Sugeridas ({suggestedActivities.length})
            </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Plano de Intervenção baseado nas demandas selecionadas
                </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
            {suggestedActivities.map((activity, index) => {
              const isExpanded = expandedActivities.has(activity.id);
              return (
                <Card key={activity.id} className="overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-primary to-primary/80 text-white p-3 sm:p-4 cursor-pointer hover:from-primary/90 hover:to-primary/70 transition-all"
                    onClick={() => toggleActivity(activity.id)}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <span className="text-xl sm:text-2xl font-bold flex-shrink-0">#{index + 1}</span>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-sm sm:text-lg truncate">{activity.disorder}</h4>
                          <p className="text-xs sm:text-sm opacity-90 truncate">{activity.demand}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge className={`${getComplexityColor(activity.complexityLevel)} text-xs hidden sm:inline-flex`}>
                          {activity.complexityLevel}
                        </Badge>
                        {isExpanded ? <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" /> : <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />}
                      </div>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <CardContent className="pt-4 sm:pt-6 space-y-3 sm:space-y-4 p-3 sm:p-6">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                        <Badge variant="outline" className="text-xs">{activity.specialty}</Badge>
                        <Badge className={`${getComplexityColor(activity.complexityLevel)} text-xs sm:hidden`}>
                          {activity.complexityLevel}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                          {activity.estimatedTime}
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h5 className="font-semibold text-xs sm:text-sm mb-2 flex items-center gap-2">
                          <Target className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                          Objetivo Terapêutico Geral
                        </h5>
                        <p className="text-xs sm:text-sm text-muted-foreground">{activity.generalObjective}</p>
                      </div>

                      <div>
                        <h5 className="font-semibold text-xs sm:text-sm mb-2 flex items-center gap-2">
                          <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                          Objetivo Específico
                        </h5>
                        <p className="text-xs sm:text-sm text-muted-foreground">{activity.specificObjective}</p>
                      </div>

                      <Separator />

                      <div>
                        <h5 className="font-semibold text-xs sm:text-sm mb-2">Descrição da Atividade</h5>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{activity.activityDescription}</p>
                      </div>

                      <div>
                        <h5 className="font-semibold text-xs sm:text-sm mb-2">Materiais Necessários</h5>
                        <ul className="list-disc list-inside text-xs sm:text-sm text-muted-foreground space-y-1">
                          {activity.materials.map((material, i) => (
                            <li key={i}>{material}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-semibold text-xs sm:text-sm mb-2 flex items-center gap-2">
                          <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                          Critérios de Avaliação
                        </h5>
                        <ul className="list-disc list-inside text-xs sm:text-sm text-muted-foreground space-y-1">
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
        <Card className="mx-1 sm:mx-2 border-yellow-200 bg-yellow-50">
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
      
      {/* Dialog de Visualização do Plano */}
      <Dialog open={!!viewingPlan} onOpenChange={(open) => !open && setViewingPlan(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl md:max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl md:text-2xl flex items-center gap-2">
              <Music2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <span className="truncate">Plano de Intervenção - {viewingPlan?.patient_name}</span>
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Criado em {viewingPlan && format(new Date(viewingPlan.created_at), "PPP", { locale: ptBR })}
            </DialogDescription>
          </DialogHeader>
          
          {viewingPlan && (
            <div className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
              {/* Demandas Selecionadas */}
              <Card>
                <CardHeader className="p-3 sm:p-6">
                  <CardTitle className="text-base sm:text-lg">Demandas Selecionadas</CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-6 pt-0">
                  {viewingPlan.general_objectives?.selected_demands && 
                    Object.entries(viewingPlan.general_objectives.selected_demands).map(([disorder, demands]: [string, any]) => (
                      demands.length > 0 && (
                        <div key={disorder} className="mb-3">
                          <h4 className="font-semibold text-sm mb-1">{disorder}</h4>
                          <ul className="list-disc list-inside text-sm text-muted-foreground">
                            {demands.map((demand: string) => (
                              <li key={demand}>{demand}</li>
                            ))}
                          </ul>
                        </div>
                      )
                    ))
                  }
                </CardContent>
              </Card>

              {/* Atividades */}
              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-base sm:text-lg font-semibold">Atividades Sugeridas</h3>
                {viewingPlan.complementary_materials?.activities?.map((activity: any, index: number) => (
                  <Card key={index} className="border-primary/20">
                    <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
                      <CardTitle className="text-sm sm:text-base flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <span className="truncate">Atividade {index + 1}: {activity.disorder}</span>
                        <Badge className={`${getComplexityColor(activity.complexityLevel)} text-xs flex-shrink-0`}>
                          {activity.complexityLevel}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-6 pt-0">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs sm:text-sm">
                        <div>
                          <span className="font-semibold">Transtorno:</span>
                          <p className="text-muted-foreground truncate">{activity.disorder}</p>
                        </div>
                        <div>
                          <span className="font-semibold">Demanda:</span>
                          <p className="text-muted-foreground truncate">{activity.demand}</p>
                        </div>
                        <div>
                          <span className="font-semibold">Especialidade:</span>
                          <p className="text-muted-foreground truncate">{activity.specialty}</p>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h5 className="font-semibold text-xs sm:text-sm mb-1 flex items-center gap-2">
                          <Target className="h-3 w-3 sm:h-4 sm:w-4" />
                          Objetivo Terapêutico Geral
                        </h5>
                        <p className="text-xs sm:text-sm text-muted-foreground">{activity.generalObjective}</p>
                      </div>

                      <div>
                        <h5 className="font-semibold text-xs sm:text-sm mb-1 flex items-center gap-2">
                          <Target className="h-3 w-3 sm:h-4 sm:w-4" />
                          Objetivo Específico
                        </h5>
                        <p className="text-xs sm:text-sm text-muted-foreground">{activity.specificObjective}</p>
                      </div>

                      <div>
                        <h5 className="font-semibold text-xs sm:text-sm mb-1">Descrição da Atividade</h5>
                        <p className="text-xs sm:text-sm text-muted-foreground">{activity.activityDescription}</p>
                      </div>

                      <div>
                        <h5 className="font-semibold text-xs sm:text-sm mb-1">Materiais Necessários</h5>
                        <ul className="list-disc list-inside text-xs sm:text-sm text-muted-foreground space-y-1">
                          {activity.materials.map((material: string, idx: number) => (
                            <li key={idx}>{material}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex gap-2 sm:gap-4 text-xs sm:text-sm">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                          <span className="font-semibold">Tempo:</span>
                          <span className="text-muted-foreground">{activity.estimatedTime}</span>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-semibold text-xs sm:text-sm mb-1 flex items-center gap-2">
                          <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          Critérios de Avaliação
                        </h5>
                        <ul className="list-disc list-inside text-xs sm:text-sm text-muted-foreground space-y-1">
                          {activity.evaluationCriteria.map((criteria: string, idx: number) => (
                            <li key={idx}>{criteria}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Botões de ação */}
              <div className="flex flex-col sm:flex-row gap-2 justify-end pt-3 sm:pt-4">
                <Button
                  variant="outline"
                  onClick={() => setViewingPlan(null)}
                  className="w-full sm:w-auto text-xs sm:text-sm"
                >
                  Fechar
                </Button>
                <Button
                  onClick={() => {
                    downloadPlanPDF(viewingPlan);
                    setViewingPlan(null);
                  }}
                  className="w-full sm:w-auto text-xs sm:text-sm"
                >
                  <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Baixar PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
