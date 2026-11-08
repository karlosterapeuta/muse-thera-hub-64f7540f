import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useProfessionalData } from '@/hooks/useProfessionalData';
import { imageUrlToBase64 } from '@/utils/imageToBase64';
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
  Eye,
  Info
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import html2pdf from "html2pdf.js";
import { savePDFToStorage } from "@/utils/pdfStorageUtils";
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
import { disorderOptions, teaDemandCategories, tdahDemandCategories, todDemandCategories, diDemandCategories } from "@/data/therapy-activities";
import { TherapyActivity, Disorder } from "@/types/therapy-activity";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

type Patient = {
  id: string;
  name: string;
};

// Conteúdo clínico e texto da IA são inseridos no HTML que dá origem ao PDF.
const escapePdfHtml = (value: unknown): string => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char] || char));

export default function InterventionForm() {
  const [params] = useSearchParams();
  const requested = params.get("patient_id") || "";
  return <InterventionSession key={requested} requested={requested} />;
}

function InterventionSession({ requested }: { requested: string }) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: professionalData } = useProfessionalData();
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
  const [generationError, setGenerationError] = useState<string>("");
  const [generationWarning, setGenerationWarning] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [savedPlans, setSavedPlans] = useState<any[]>([]);
  const [isLoadingSavedPlans, setIsLoadingSavedPlans] = useState(false);
  const [savedPlansError, setSavedPlansError] = useState(false);
  const [viewingPlan, setViewingPlan] = useState<any | null>(null);

  const selectedItems = Object.entries(selectedSubDemands).flatMap(([key, labels]) => {
    const separator = key.indexOf('::');
    if (separator < 0) return [];
    const disorder = key.slice(0, separator);
    const category = key.slice(separator + 2);
    return labels.map(label => ({ disorder, category, label }));
  });
  const selectedCount = selectedItems.length + Object.values(selectedDemands).reduce((sum, values) => sum + values.length, 0);

  const invalidateSuggestions = () => {
    setSuggestedActivities([]);
    setExpandedActivities(new Set());
    setShowSuggestions(false);
    setGenerationError("");
    setGenerationWarning("");
  };

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
        if (requested && data?.some(p => p.id === requested)) setSelectedPatient(requested);
        else if (requested) toast({ title: "Paciente indisponível", description: "Selecione um paciente para continuar." });
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
      setSavedPlansError(false);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Buscar professional_id
      const { data: professional } = await supabase
        .from('professionals')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!professional?.id) { setSavedPlans([]); return; }

      // Buscar planos salvos - filtrar apenas os que têm activities (planos de intervenção)
      const { data: plans, error } = await supabase
        .from('treatment_plans')
        .select(`
          id,
          created_at,
          patient_id,
          patient_full_name,
          status,
          general_objectives,
          complementary_materials
        `)
        .eq('professional_id', professional.id)
        .not('complementary_materials', 'is', null)
        .not('complementary_materials->activities', 'is', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Consulta única e restrita ao profissional; evita uma requisição por plano.
      const patientIds = [...new Set((plans || []).map(plan => plan.patient_id).filter(Boolean))] as string[];
      let patientNames = new Map<string, string>();
      if (user && patientIds.length) {
        const { data: ownedPatients, error: patientError } = await supabase.from('patients')
          .select('id, name').eq('professional_id', user.id).in('id', patientIds);
        if (patientError) throw patientError;
        patientNames = new Map((ownedPatients || []).map(patient => [patient.id, patient.name]));
      }
      const enrichedPlans = (plans || []).map(plan => ({
        ...plan,
        patient_name: (plan.patient_id && patientNames.get(plan.patient_id)) || plan.patient_full_name || 'Paciente não encontrado',
      }));

      setSavedPlans(enrichedPlans);
    } catch (error) {
      console.error("Erro ao carregar planos salvos:", error);
      setSavedPlansError(true);
    } finally {
      setIsLoadingSavedPlans(false);
    }
  };

  const handleDemandToggle = (disorder: string, demand: string) => {
    invalidateSuggestions();
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

  const handleSubDemandToggle = (disorder: string, category: string, subDemandLabel: string) => {
    invalidateSuggestions();
    const key = `${disorder}::${category}`;
    setSelectedSubDemands(prev => {
      const current = prev[key] || [];
      const updated = current.includes(subDemandLabel)
        ? current.filter(d => d !== subDemandLabel)
        : [...current, subDemandLabel];
      
      return {
        ...prev,
        [key]: updated
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

    if (selectedCount === 0) {
      toast({
        variant: "destructive",
        title: "Selecione demandas",
        description: "Selecione pelo menos uma demanda para gerar sugestões.",
      });
      return;
    }

    setIsGenerating(true);
    setGenerationError("");
    setGenerationWarning("");
    setGenerationProgress("Consultando dados do paciente...");

    try {
      // Buscar dados do paciente
      const patient = patients.find(p => p.id === selectedPatient);
      
      if (!patient) {
        throw new Error("Paciente não encontrado");
      }

      setGenerationProgress("Gerando atividades personalizadas com IA...");

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Sua sessão expirou. Faça login novamente.");

      // A função valida a associação entre o paciente e o profissional.
      const { data, error } = await supabase.functions.invoke('generate-therapy-activities', {
        body: {
          patientId: patient.id,
          selectedDemands: selectedDemands,
          selectedSubDemands: selectedSubDemands,
          selectedItems,
        }
      });

      if (error) {
        console.error("Erro da Edge Function:", error);
        const response = (error as { context?: Response }).context;
        let serverMessage = "";
        if (response && typeof response.json === "function") {
          try {
            const details = await response.json();
            if (typeof details?.error === 'string') serverMessage = details.error;
          } catch { /* Sem resposta JSON do servidor */ }
        }
        throw new Error(serverMessage || (response?.status === 401 ? "Sua sessão expirou. Entre novamente." :
          response?.status === 429 ? "Muitas solicitações à IA. Aguarde um pouco e tente novamente." :
          "Não foi possível acessar o serviço de IA. Tente novamente."));
      }

      setGenerationProgress("Processando atividades...");

      // Validar resposta
      if (!data?.activities || !Array.isArray(data.activities)) {
        throw new Error("Formato de resposta inválido");
      }

      if (data.activities.length !== 10) {
        throw new Error(`Esperado 10 atividades, recebido ${data.activities.length}`);
      }

      if (data.activities.some((activity: TherapyActivity) => !activity.activityDescription ||
        !Array.isArray(activity.materials) || !Array.isArray(activity.evaluationCriteria))) {
        throw new Error("A IA retornou atividades incompletas. Tente gerar novamente.");
      }

      // Atualizar estado
      setSuggestedActivities(data.activities);
      setShowSuggestions(true);
      setExpandedActivities(new Set([data.activities[0].id]));
      if (data.totalDemands > data.consideredDemands) {
        setGenerationWarning(`Foram consideradas ${data.consideredDemands} das ${data.totalDemands} demandas selecionadas. Para outras demandas, gere um novo plano com uma seleção menor.`);
      }

      toast({
        title: "✨ Atividades geradas com sucesso!",
        description: `${data.activities.length} atividades personalizadas criadas pela IA.`,
      });

    } catch (error: any) {
      console.error("Erro ao gerar atividades:", error);
      
      const errorDescription = error instanceof Error ? error.message : "Não foi possível gerar as sugestões. Tente novamente.";
      setGenerationError(errorDescription);

      toast({
        variant: "destructive",
        title: "Erro ao gerar atividades",
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

    if (isSaving) return;
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");
      const selectedPatientData = patients.find(patient => patient.id === selectedPatient);
      if (!selectedPatientData) throw new Error("Paciente indisponível para este profissional");

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
          patient_full_name: selectedPatientData.name,
          professional_id: professional.id,
          status: 'active',
          general_objectives: { selected_demands: selectedDemands, selected_sub_demands: selectedSubDemands } as any,
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
    } finally {
      setIsSaving(false);
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

    if (isPdfGenerating) return;
    setIsPdfGenerating(true);
    try {
      // Convert professional images to Base64
      let signatureBase64: string | null = null;
      let photoBase64: string | null = null;

      if (professionalData?.digital_signature_url) {
        signatureBase64 = await imageUrlToBase64(professionalData.digital_signature_url);
      }
      if (professionalData?.stamp_photo_url) {
        photoBase64 = await imageUrlToBase64(professionalData.stamp_photo_url);
      }

      let stampBase64: string | null = null;
      if (professionalData?.digital_stamp_url) {
        stampBase64 = await imageUrlToBase64(professionalData.digital_stamp_url);
      }

      const patient = patients.find(p => p.id === selectedPatient);
      if (!patient) throw new Error("Paciente não encontrado");

      const element = document.createElement('div');
      
      const activitiesHTML = suggestedActivities.map((activity, index) => `
        <div style="margin-bottom: 24px; page-break-inside: avoid;">
          <div style="background: linear-gradient(to right, #0F766E, #115E59); color: white; padding: 12px 16px; border-radius: 8px 8px 0 0; font-weight: bold; font-size: 16px;">
            Atividade ${index + 1}: ${escapePdfHtml(activity.disorder)}
          </div>
          <div style="border: 2px solid #E5E7EB; border-top: none; padding: 16px; border-radius: 0 0 8px 8px;">
            <div style="margin-bottom: 12px;">
              <strong style="color: #1F2937;">Transtorno:</strong> <span style="color: #4B5563;">${escapePdfHtml(activity.disorder)}</span> |
              <strong style="color: #1F2937;">Demanda:</strong> <span style="color: #4B5563;">${escapePdfHtml(activity.demand)}</span> |
              <strong style="color: #1F2937;">Especialidade:</strong> <span style="color: #4B5563;">${escapePdfHtml(activity.specialty)}</span>
            </div>
            <div style="margin-bottom: 12px;">
              <strong style="color: #1F2937; display: block; margin-bottom: 4px;">Objetivo Terapêutico Geral:</strong>
              <p style="color: #374151; margin: 0; line-height: 1.6;">${escapePdfHtml(activity.generalObjective)}</p>
            </div>
            <div style="margin-bottom: 12px;">
              <strong style="color: #1F2937; display: block; margin-bottom: 4px;">Objetivo Específico:</strong>
              <p style="color: #374151; margin: 0; line-height: 1.6;">${escapePdfHtml(activity.specificObjective)}</p>
            </div>
            <div style="margin-bottom: 12px;">
              <strong style="color: #1F2937; display: block; margin-bottom: 4px;">Descrição da Atividade:</strong>
              <p style="color: #374151; margin: 0; line-height: 1.6;">${escapePdfHtml(activity.activityDescription)}</p>
            </div>
            <div style="margin-bottom: 12px;">
              <strong style="color: #1F2937; display: block; margin-bottom: 4px;">Materiais Necessários:</strong>
              <ul style="color: #374151; margin: 4px 0; padding-left: 20px; line-height: 1.6;">
                ${(Array.isArray(activity.materials) ? activity.materials : []).map(m => `<li>${escapePdfHtml(m)}</li>`).join('')}
              </ul>
            </div>
            <div style="margin-bottom: 12px; display: flex; gap: 16px;">
              <div><strong style="color: #1F2937;">Tempo:</strong> <span style="color: #4B5563;">${escapePdfHtml(activity.estimatedTime)}</span></div>
              <div><strong style="color: #1F2937;">Complexidade:</strong> <span style="color: #4B5563;">${escapePdfHtml(activity.complexityLevel)}</span></div>
            </div>
            <div>
              <strong style="color: #1F2937; display: block; margin-bottom: 4px;">Critérios de Avaliação:</strong>
              <ul style="color: #374151; margin: 4px 0; padding-left: 20px; line-height: 1.6;">
                ${(Array.isArray(activity.evaluationCriteria) ? activity.evaluationCriteria : []).map(c => `<li>${escapePdfHtml(c)}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
      `).join('');

      element.innerHTML = `
        <div style="padding: 40px; font-family: Arial, sans-serif; max-width: 900px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 3px solid #0F766E;">
            <h1 style="color: #0F766E; font-size: 28px; font-weight: bold; margin-bottom: 12px;">
              Plano de Intervenção (PI)
            </h1>
            <h2 style="color: #1F2937; font-size: 20px; margin-bottom: 8px;">
              Musicoterapia
            </h2>
            <p style="color: #6B7280; font-size: 16px; margin-bottom: 4px;">
              <strong>Paciente:</strong> ${escapePdfHtml(patient.name)}
            </p>
            <p style="color: #6B7280; font-size: 14px;">
              Data: ${format(new Date(), "PPP", { locale: ptBR })}
            </p>
          </div>

          <div style="margin-bottom: 32px;">
            ${activitiesHTML}
          </div>

          <!-- Footer - Digital Signature & Stamp (TEAL Design) -->
          <div style="margin-top: 60px; border: 3px solid transparent; border-image: linear-gradient(135deg, #0d9488, #14b8a6, #06b6d4) 1; border-radius: 16px; overflow: hidden; background: #ffffff; box-shadow: 0 8px 24px rgba(13, 148, 136, 0.15);">
            <!-- Decorative TEAL gradient bar (8px) at TOP -->
            <div style="height: 8px; background: linear-gradient(90deg, #0d9488 0%, #14b8a6 50%, #06b6d4 100%);"></div>
            
            <!-- Padding wrapper -->
            <div style="padding: 32px;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: start;">
                <!-- Left Side: NESTED Signature Card -->
                <div style="background: linear-gradient(135deg, #f0fdfa, #ccfbf1); border: 2px solid #14b8a6; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(20,184,166,0.15);">
                  <!-- Decorative TEAL gradient bar INSIDE card -->
                  <div style="height: 8px; background: linear-gradient(to right, #0d9488, #14b8a6, #06b6d4);"></div>
                  
                  <div style="padding: 20px;">
                    <div style="display: flex; align-items: start; gap: 16px; margin-bottom: 24px;">
                      <!-- Professional Photo with blur effect -->
                      <div style="position: relative;">
                        <div style="position: absolute; inset: 0; border-radius: 50%; filter: blur(40px); opacity: 0.5; background: radial-gradient(circle, #14b8a6, #22d3ee, #0d9488);"></div>
                        <img 
                          src="${photoBase64 || '/placeholder.svg'}" 
                          alt="Professional" 
                          style="position: relative; width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid #14b8a6;"
                        />
                      </div>
                      
                      <!-- Professional Info -->
                      <div style="flex: 1;">
                        <h3 style="font-weight: bold; font-size: 18px; margin-bottom: 8px; color: #0f766e;">
                          ${escapePdfHtml(professionalData?.name || userName || 'Musicoterapeuta')}
                        </h3>
                        ${professionalData?.specialty ? `
                          <div style="display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 14px; font-weight: 500; background-color: #ccfbf1; color: #0f766e; border: 1px solid #99f6e4; margin-bottom: 12px;">
                            🎵 ${escapePdfHtml(professionalData.specialty)}
                          </div>
                        ` : ''}
                      </div>
                    </div>
                    
                    <!-- Contact Information -->
                    <div style="margin-bottom: 16px; font-size: 14px; color: #0f766e;">
                      ${professionalData?.register || professionalData?.license_number ? `
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                          <span>📋</span>
                          <span>${escapePdfHtml(professionalData.register || professionalData.license_number)}</span>
                        </div>
                      ` : ''}
                      ${professionalData?.email || userEmail ? `
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                          <span>📧</span>
                          <span style="word-break: break-all;">${escapePdfHtml(professionalData?.email || userEmail)}</span>
                        </div>
                      ` : ''}
                      ${professionalData?.phone ? `
                        <div style="display: flex; align-items: center; gap: 8px;">
                          <span>📞</span>
                          <span>${escapePdfHtml(professionalData.phone)}</span>
                        </div>
                      ` : ''}
                    </div>
                  </div>
                  
                  ${signatureBase64 ? `<div style="padding: 4px 20px 16px; text-align: center;"><img src="${signatureBase64}" alt="Assinatura cadastrada" style="max-width: 180px; max-height: 75px; object-fit: contain; margin: 0 auto;" /></div>` : ''}
                  <!-- Identificação do profissional; não é assinatura criptográfica -->
                  <div style="border-top: 1px solid #99f6e4; background: linear-gradient(to right, #f0fdfa, #ecfeff, #f0fdfa); padding: 12px 16px; text-align: center; font-size: 12px; font-weight: 500; color: #0f766e;">
                    ${signatureBase64 ? 'Assinatura digital cadastrada' : 'Identificação profissional'} · Sistema MuseTera
                  </div>
                </div>

                <!-- Right Side: Circular Digital Stamp (Conditional) -->
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
                  ${stampBase64 ? `<img src="${stampBase64}" alt="Carimbo digital cadastrado" style="max-width: 180px; max-height: 95px; object-fit: contain; margin-bottom: 12px;" />` : ''}
                  ${(stampBase64 || photoBase64) ? `
                    <!-- Outer decorative dashed circle -->
                    <div style="position: relative; width: 280px; height: 280px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px dashed #99f6e4;">
                      <!-- Main stamp circle -->
                      <div style="width: 240px; height: 240px; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; position: relative; overflow: hidden; background: linear-gradient(135deg, #ccfbf1 0%, #99f6e4 50%, #ccfbf1 100%); border: 3px solid #14b8a6; box-shadow: 0 8px 24px rgba(20,184,166,0.2), inset 0 2px 8px rgba(20,184,166,0.1);">
                        <!-- Professional Photo inside stamp -->
                        ${photoBase64 ? `
                          <img 
                            src="${photoBase64}" 
                            alt="Stamp" 
                            style="width: 64px; height: 64px; border-radius: 50%; object-fit: cover; margin-bottom: 8px; border: 2px solid #0d9488;"
                          />
                        ` : ''}
                        
                        <!-- Professional Name -->
                        <div style="text-align: center; font-weight: bold; font-size: 14px; margin-bottom: 4px; color: #0f766e;">
                          ${escapePdfHtml(professionalData?.name || userName || 'Musicoterapeuta')}
                        </div>
                        
                        <!-- Decorative line -->
                        <div style="width: 80px; height: 1px; margin-bottom: 8px; background: linear-gradient(to right, transparent, #14b8a6, transparent);"></div>
                        
                        <!-- Specialty Badge -->
                        ${professionalData?.specialty ? `
                          <div style="padding: 4px 8px; border-radius: 9999px; font-size: 12px; font-weight: 500; margin-bottom: 4px; background-color: #0d9488; color: white;">
                            🎵 ${escapePdfHtml(professionalData.specialty)}
                          </div>
                        ` : ''}
                        
                        <!-- Registry -->
                        ${professionalData?.register || professionalData?.license_number ? `
                          <div style="font-size: 12px; font-weight: 500; color: #0f766e;">
                            📋 ${escapePdfHtml(professionalData.register || professionalData.license_number)}
                          </div>
                        ` : ''}
                      </div>
                    </div>
                    
                    <!-- MuseTera Verified Badge -->
                    <div style="margin-top: 16px; padding: 8px 16px; border-radius: 9999px; font-size: 12px; font-weight: bold; background: linear-gradient(135deg, #14b8a6, #06b6d4); color: white;">
                      MuseTera · Identificação profissional
                    </div>
                  ` : `
                    <!-- Placeholder when no stamp -->
                    <div style="width: 240px; height: 240px; border: 3px dashed #14b8a6; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; color: #6b7280; background-color: #f0fdfa;">
                      🔖 Carimbo Digital
                    </div>
                  `}
                </div>
              </div>
            </div>
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

      const pdfInstance = html2pdf().from(element).set(opt);
      await pdfInstance.save();
      try { const blob = await pdfInstance.outputPdf('blob'); await savePDFToStorage(blob, opt.filename, "intervention"); } catch(e) { console.warn("PDF não salvo no storage:", e); }
      
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
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const deletePlan = async (planId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (!confirm("Tem certeza que deseja excluir este plano?")) {
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");
      const { data: professional, error: professionalError } = await supabase.from('professionals')
        .select('id').eq('user_id', user.id).maybeSingle();
      if (professionalError || !professional) throw new Error("Perfil profissional não encontrado");
      const { error } = await supabase
        .from('treatment_plans')
        .delete()
        .eq('id', planId)
        .eq('professional_id', professional.id);

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
      // Verificar se complementary_materials é array (formato antigo) ou objeto (formato correto)
      const cm = plan.complementary_materials;
      const activities = Array.isArray(cm) ? [] : (cm?.activities || []);
      
      if (activities.length === 0) {
        toast({
          variant: "destructive",
          title: "Sem atividades",
          description: "Este plano não possui atividades para gerar PDF.",
        });
        return;
      }
      
      toast({
        title: "Gerando PDF...",
        description: "Aguarde enquanto o PDF é preparado.",
      });

      // Convert professional images to Base64
      let photoBase64: string | null = null;
      let stampBase64: string | null = null;
      let signatureBase64: string | null = null;

      if (professionalData?.stamp_photo_url) {
        photoBase64 = await imageUrlToBase64(professionalData.stamp_photo_url);
      }
      if (professionalData?.digital_stamp_url) {
        stampBase64 = await imageUrlToBase64(professionalData.digital_stamp_url);
      }
      if (professionalData?.digital_signature_url) {
        signatureBase64 = await imageUrlToBase64(professionalData.digital_signature_url);
      }

      const element = document.createElement('div');
      
      const activitiesHTML = activities.map((activity: any, index: number) => `
        <div style="margin-bottom: 24px; page-break-inside: avoid;">
          <div style="background: linear-gradient(to right, #0F766E, #115E59); color: white; padding: 12px 16px; border-radius: 8px 8px 0 0; font-weight: bold; font-size: 16px;">
            Atividade ${index + 1}: ${escapePdfHtml(activity.disorder)}
          </div>
          <div style="border: 2px solid #E5E7EB; border-top: none; padding: 16px; border-radius: 0 0 8px 8px;">
            <div style="margin-bottom: 12px;">
              <strong style="color: #1F2937;">Transtorno:</strong> <span style="color: #4B5563;">${escapePdfHtml(activity.disorder)}</span> |
              <strong style="color: #1F2937;">Demanda:</strong> <span style="color: #4B5563;">${escapePdfHtml(activity.demand)}</span> |
              <strong style="color: #1F2937;">Especialidade:</strong> <span style="color: #4B5563;">${escapePdfHtml(activity.specialty)}</span>
            </div>
            <div style="margin-bottom: 12px;">
              <strong style="color: #1F2937; display: block; margin-bottom: 4px;">Objetivo Terapêutico Geral:</strong>
              <p style="color: #374151; margin: 0; line-height: 1.6;">${escapePdfHtml(activity.generalObjective)}</p>
            </div>
            <div style="margin-bottom: 12px;">
              <strong style="color: #1F2937; display: block; margin-bottom: 4px;">Objetivo Específico:</strong>
              <p style="color: #374151; margin: 0; line-height: 1.6;">${escapePdfHtml(activity.specificObjective)}</p>
            </div>
            <div style="margin-bottom: 12px;">
              <strong style="color: #1F2937; display: block; margin-bottom: 4px;">Descrição da Atividade:</strong>
              <p style="color: #374151; margin: 0; line-height: 1.6;">${escapePdfHtml(activity.activityDescription)}</p>
            </div>
            <div style="margin-bottom: 12px;">
              <strong style="color: #1F2937; display: block; margin-bottom: 4px;">Materiais Necessários:</strong>
              <ul style="color: #374151; margin: 4px 0; padding-left: 20px; line-height: 1.6;">
                ${(Array.isArray(activity.materials) ? activity.materials : []).map((m: string) => `<li>${escapePdfHtml(m)}</li>`).join('')}
              </ul>
            </div>
            <div style="margin-bottom: 12px; display: flex; gap: 16px;">
              <div><strong style="color: #1F2937;">Tempo:</strong> <span style="color: #4B5563;">${escapePdfHtml(activity.estimatedTime)}</span></div>
              <div><strong style="color: #1F2937;">Complexidade:</strong> <span style="color: #4B5563;">${escapePdfHtml(activity.complexityLevel)}</span></div>
            </div>
            <div>
              <strong style="color: #1F2937; display: block; margin-bottom: 4px;">Critérios de Avaliação:</strong>
              <ul style="color: #374151; margin: 4px 0; padding-left: 20px; line-height: 1.6;">
                ${(Array.isArray(activity.evaluationCriteria) ? activity.evaluationCriteria : []).map((c: string) => `<li>${escapePdfHtml(c)}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
      `).join('');

      element.innerHTML = `
        <div style="padding: 40px; font-family: Arial, sans-serif; max-width: 900px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 3px solid #0F766E;">
              <h1 style="color: #0F766E; font-size: 28px; font-weight: bold; margin-bottom: 12px;">
                Plano de Intervenção (PI)
              </h1>
            <h2 style="color: #1F2937; font-size: 20px; margin-bottom: 8px;">
              Musicoterapia
            </h2>
            <p style="color: #6B7280; font-size: 16px; margin-bottom: 4px;">
              <strong>Paciente:</strong> ${escapePdfHtml(plan.patient_name)}
            </p>
            <p style="color: #6B7280; font-size: 14px;">
              Data: ${format(new Date(plan.created_at), "PPP", { locale: ptBR })}
            </p>
          </div>

          <div style="margin-bottom: 32px;">
            ${activitiesHTML}
          </div>

          <!-- Footer - Digital Signature & Stamp (TEAL Design) -->
          <div style="margin-top: 60px; border: 3px solid transparent; border-image: linear-gradient(135deg, #0d9488, #14b8a6, #06b6d4) 1; border-radius: 16px; overflow: hidden; background: #ffffff; box-shadow: 0 8px 24px rgba(13, 148, 136, 0.15);">
            <!-- Decorative TEAL gradient bar (8px) at TOP -->
            <div style="height: 8px; background: linear-gradient(90deg, #0d9488 0%, #14b8a6 50%, #06b6d4 100%);"></div>
            
            <!-- Padding wrapper -->
            <div style="padding: 32px;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: start;">
                <!-- Left Side: NESTED Signature Card -->
                <div style="background: linear-gradient(135deg, #f0fdfa, #ccfbf1); border: 2px solid #14b8a6; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(20,184,166,0.15);">
                  <!-- Decorative TEAL gradient bar INSIDE card -->
                  <div style="height: 8px; background: linear-gradient(to right, #0d9488, #14b8a6, #06b6d4);"></div>
                  
                  <div style="padding: 20px;">
                    <div style="display: flex; align-items: start; gap: 16px; margin-bottom: 24px;">
                      <!-- Professional Photo with blur effect -->
                      <div style="position: relative;">
                        <div style="position: absolute; inset: 0; border-radius: 50%; filter: blur(40px); opacity: 0.5; background: radial-gradient(circle, #14b8a6, #22d3ee, #0d9488);"></div>
                        <img 
                          src="${photoBase64 || '/placeholder.svg'}" 
                          alt="Professional" 
                          style="position: relative; width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid #14b8a6;"
                        />
                      </div>
                      
                      <!-- Professional Name & Specialty -->
                      <div style="flex: 1;">
                        <h3 style="font-size: 18px; font-weight: bold; margin: 0 0 8px 0; color: #0d9488;">
                          ${escapePdfHtml(professionalData?.name || userName || 'Musicoterapeuta')}
                        </h3>
                        ${professionalData?.specialty ? `
                          <div style="display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 14px; font-weight: 500; background-color: #ccfbf1; color: #0f766e; border: 1px solid #99f6e4; margin-bottom: 12px;">
                            🎵 ${escapePdfHtml(professionalData.specialty)}
                          </div>
                        ` : ''}
                      </div>
                    </div>
                    
                    <!-- Contact Information -->
                    <div style="margin-bottom: 16px; font-size: 14px; color: #0f766e;">
                      ${professionalData?.register || professionalData?.license_number ? `
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                          <span>📋</span>
                          <span>${escapePdfHtml(professionalData.register || professionalData.license_number)}</span>
                        </div>
                      ` : ''}
                      ${professionalData?.email || userEmail ? `
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                          <span>📧</span>
                          <span style="word-break: break-all;">${escapePdfHtml(professionalData?.email || userEmail)}</span>
                        </div>
                      ` : ''}
                      ${professionalData?.phone ? `
                        <div style="display: flex; align-items: center; gap: 8px;">
                          <span>📞</span>
                          <span>${escapePdfHtml(professionalData.phone)}</span>
                        </div>
                      ` : ''}
                    </div>
                  </div>
                  
                  ${signatureBase64 ? `<div style="padding: 4px 20px 16px; text-align: center;"><img src="${signatureBase64}" alt="Assinatura cadastrada" style="max-width: 180px; max-height: 75px; object-fit: contain; margin: 0 auto;" /></div>` : ''}
                  <!-- Identificação do profissional; não é assinatura criptográfica -->
                  <div style="border-top: 1px solid #99f6e4; background: linear-gradient(to right, #f0fdfa, #ecfeff, #f0fdfa); padding: 12px 16px; text-align: center; font-size: 12px; font-weight: 500; color: #0f766e;">
                    ${signatureBase64 ? 'Assinatura digital cadastrada' : 'Identificação profissional'} · Sistema MuseTera
                  </div>
                </div>

                <!-- Right Side: Circular Digital Stamp (Conditional) -->
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
                  ${stampBase64 ? `<img src="${stampBase64}" alt="Carimbo digital cadastrado" style="max-width: 180px; max-height: 95px; object-fit: contain; margin-bottom: 12px;" />` : ''}
                  ${(stampBase64 || photoBase64) ? `
                    <!-- Outer decorative dashed circle -->
                    <div style="position: relative; width: 280px; height: 280px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px dashed #99f6e4;">
                      <!-- Main stamp circle -->
                      <div style="width: 240px; height: 240px; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; position: relative; overflow: hidden; background: linear-gradient(135deg, #ccfbf1 0%, #99f6e4 50%, #ccfbf1 100%); border: 3px solid #14b8a6; box-shadow: 0 8px 24px rgba(20,184,166,0.2), inset 0 2px 8px rgba(20,184,166,0.1);">
                        <!-- Professional Photo inside stamp -->
                        ${photoBase64 ? `
                          <img 
                            src="${photoBase64}" 
                            alt="Stamp" 
                            style="width: 64px; height: 64px; border-radius: 50%; object-fit: cover; margin-bottom: 8px; border: 2px solid #0d9488;"
                          />
                        ` : ''}
                        
                        <!-- Professional Name -->
                        <div style="text-align: center; font-weight: bold; font-size: 14px; margin-bottom: 4px; color: #0f766e;">
                          ${escapePdfHtml(professionalData?.name || userName || 'Musicoterapeuta')}
                        </div>
                        
                        <!-- Decorative line -->
                        <div style="width: 80px; height: 1px; margin-bottom: 8px; background: linear-gradient(to right, transparent, #14b8a6, transparent);"></div>
                        
                        <!-- Specialty Badge -->
                        ${professionalData?.specialty ? `
                          <div style="padding: 4px 8px; border-radius: 9999px; font-size: 12px; font-weight: 500; margin-bottom: 4px; background-color: #0d9488; color: white;">
                            🎵 ${escapePdfHtml(professionalData.specialty)}
                          </div>
                        ` : ''}
                        
                        <!-- Registry -->
                        ${professionalData?.register || professionalData?.license_number ? `
                          <div style="font-size: 12px; font-weight: 500; color: #0f766e;">
                            📋 ${escapePdfHtml(professionalData.register || professionalData.license_number)}
                          </div>
                        ` : ''}
                      </div>
                    </div>
                    
                    <!-- MuseTera Verified Badge -->
                    <div style="margin-top: 16px; padding: 8px 16px; border-radius: 9999px; font-size: 12px; font-weight: bold; background: linear-gradient(135deg, #14b8a6, #06b6d4); color: white;">
                      MuseTera · Identificação profissional
                    </div>
                  ` : `
                    <!-- Placeholder when no stamp -->
                    <div style="width: 240px; height: 240px; border: 3px dashed #14b8a6; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; color: #6b7280; background-color: #f0fdfa;">
                      🔖 Carimbo Digital
                    </div>
                  `}
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      const opt = {
        margin: [15, 15, 15, 15],
        filename: `PI - ${plan.patient_name} - ${format(new Date(plan.created_at), "dd-MM-yyyy")}.pdf`,
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

      const pdfInstance2 = html2pdf().from(element).set(opt);
      await pdfInstance2.save();
      try { const blob = await pdfInstance2.outputPdf('blob'); await savePDFToStorage(blob, opt.filename, "intervention"); } catch(e) { console.warn("PDF não salvo no storage:", e); }
      
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
    <main className="mx-auto w-full max-w-6xl space-y-5 px-3 py-4 sm:px-6 sm:py-6">
      <header className="rounded-2xl border border-teal-700/20 bg-gradient-to-r from-teal-50 to-emerald-50/50 p-4 dark:from-teal-950/30 dark:to-background sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">MuseTera · Prática clínica</p>
            <h1 className="mt-1 flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl"><Music2 className="h-7 w-7 text-teal-700 dark:text-teal-300" aria-hidden="true" /> Intervenção Musicoterapêutica</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Monte um plano com 10 sugestões de atividades, revise os objetivos e registre com segurança.</p>
          </div>
          <Button variant="outline" className="min-h-11 shrink-0" onClick={() => document.getElementById('new-intervention')?.scrollIntoView({ behavior: 'smooth' })}>
            Criar novo plano
          </Button>
        </div>
      </header>
      {/* Saved Plans Section */}
      <Card className="border-teal-700/20">
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
          ) : savedPlansError ? (
            <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-sm">
              <p className="font-medium text-red-700 dark:text-red-300">Não foi possível consultar os planos salvos.</p>
              <Button variant="outline" className="mt-3 min-h-11" onClick={fetchSavedPlans}>Tentar novamente</Button>
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
                          className="min-h-11 flex-1 gap-2 sm:flex-none text-xs sm:text-sm"
                        >
                          <Eye className="h-4 w-4" aria-hidden="true" /> Visualizar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadPlanPDF(plan)}
                          className="min-h-11 flex-1 gap-2 sm:flex-none text-xs sm:text-sm"
                        >
                          <Download className="h-4 w-4" aria-hidden="true" /> PDF
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          aria-label={`Excluir plano de ${plan.patient_name}`}
                          onClick={(e) => deletePlan(plan.id, e)}
                          className="min-h-11 min-w-11 text-xs sm:text-sm"
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
      <Card id="new-intervention" className="scroll-mt-5 border-teal-700/20 shadow-sm">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl md:text-2xl">Criar Novo Plano de Intervenção</CardTitle>
          <div className="bg-teal-50/70 dark:bg-teal-950/20 border border-teal-700/20 rounded-xl p-4 sm:p-5 mt-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Info className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                  Como funciona
                </h3>
                <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
                  Selecione o <span className="font-semibold text-primary">paciente</span> e as{" "}
                  <span className="font-semibold text-primary">demandas</span> para gerar sugestões 
                  de atividades personalizadas para a sua especialidade:{" "}
                  <span className="font-bold text-primary">Musicoterapia</span>.
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
          {/* Patient Selection */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">1. Nome do Paciente</h3>
            <PatientSelect 
              patients={patients}
              selectedPatient={selectedPatient}
              onSelect={(id) => {
                if (id === selectedPatient) return;
                if (selectedPatient && !window.confirm("Trocar de paciente e reiniciar esta intervenção?")) return;
                navigate(`/intervention?patient_id=${encodeURIComponent(id)}`);
              }}
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
                  <div className="border-b border-teal-700/10 bg-teal-50/70 p-3 text-foreground dark:bg-teal-950/20 sm:p-4">
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
                          const selectedCount = selectedSubDemands[`TEA::${category.category}`]?.length || 0;
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
                                          checked={selectedSubDemands[`TEA::${category.category}`]?.includes(subDemand.label) || false}
                                          onCheckedChange={() => handleSubDemandToggle('TEA', category.category, subDemand.label)}
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
                          const selectedCount = selectedSubDemands[`TDAH::${category.category}`]?.length || 0;
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
                                          checked={selectedSubDemands[`TDAH::${category.category}`]?.includes(subDemand.label) || false}
                                          onCheckedChange={() => handleSubDemandToggle('TDAH', category.category, subDemand.label)}
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
                          const selectedCount = selectedSubDemands[`TOD::${category.category}`]?.length || 0;
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
                                          checked={selectedSubDemands[`TOD::${category.category}`]?.includes(subDemand.label) || false}
                                          onCheckedChange={() => handleSubDemandToggle('TOD', category.category, subDemand.label)}
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
                          const selectedCount = selectedSubDemands[`DI::${category.category}`]?.length || 0;
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
                                          checked={selectedSubDemands[`DI::${category.category}`]?.includes(subDemand.label) || false}
                                          onCheckedChange={() => handleSubDemandToggle('DI', category.category, subDemand.label)}
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

          <div className="rounded-xl border border-teal-700/20 bg-teal-50/60 p-4 dark:bg-teal-950/20" aria-live="polite">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-foreground">Resumo da seleção</h3>
              <Badge variant="secondary" className="text-sm">{selectedCount} demandas selecionadas</Badge>
            </div>
            {selectedCount ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedItems.map(item => <Badge key={`${item.disorder}-${item.category}-${item.label}`} variant="outline" className="max-w-full whitespace-normal border-teal-700/30 bg-background py-1.5 text-left text-xs text-foreground">{item.disorder} · {item.label}</Badge>)}
                {Object.entries(selectedDemands).flatMap(([disorder, labels]) => labels.map(label => <Badge key={`${disorder}-${label}`} variant="outline" className="border-teal-700/30 bg-background py-1.5 text-xs text-foreground">{disorder} · {label}</Badge>))}
              </div>
            ) : <p className="mt-2 text-sm text-muted-foreground">Marque ao menos uma demanda clínica acima.</p>}
            {selectedCount > 10 && <p className="mt-3 text-sm font-medium text-amber-800 dark:text-amber-300">Para distribuir 10 atividades, serão priorizadas as 10 primeiras demandas. Você poderá criar outro plano para as demais.</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 sm:gap-3">
            <Button 
              onClick={generateSuggestions} 
              size="lg" 
              className="min-h-12 w-full bg-teal-700 text-white hover:bg-teal-800"
              disabled={isGenerating || !selectedPatient || selectedCount === 0}
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
                  className="min-h-11 w-full"
                  disabled={isSaving}
                >
                  {isSaving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                  {isSaving ? 'Salvando plano...' : 'Salvar plano'}
                </Button>
                <Button 
                  onClick={generatePDF}
                  size="lg" 
                  variant="outline"
                  className="min-h-11 w-full"
                  disabled={isPdfGenerating}
                >
                  {isPdfGenerating ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Download className="mr-2 h-5 w-5" />}
                  {isPdfGenerating ? 'Preparando PDF...' : 'Baixar PDF'}
                </Button>
              </>
            )}
          </div>

          {isGenerating && <p role="status" aria-live="polite" className="rounded-lg border border-teal-700/20 bg-teal-50 p-3 text-sm font-medium text-teal-900 dark:bg-teal-950/30 dark:text-teal-200">{generationProgress || 'Gerando sugestões com IA...'}</p>}
          {generationError && <div role="alert" className="rounded-lg border border-red-500/30 bg-red-500/5 p-4 text-sm"><p className="font-semibold text-red-700 dark:text-red-300">Não foi possível gerar as atividades</p><p className="mt-1 text-foreground">{generationError}</p><p className="mt-2 text-muted-foreground">Confira sua conexão e tente novamente. Se o problema persistir, contate o suporte MuseTera.</p></div>}
          {generationWarning && <p role="status" className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-900 dark:text-amber-200">{generationWarning}</p>}

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
        <Card className="border-teal-700/20">
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
                  <button type="button"
                    className="flex w-full cursor-pointer items-center bg-teal-700 p-3 text-left text-white transition-colors hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 sm:p-4"
                    aria-expanded={isExpanded}
                    aria-controls={`activity-${index + 1}`}
                    onClick={() => toggleActivity(activity.id)}
                  >
                    <div className="flex w-full items-center justify-between gap-2">
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
                  </button>
                  
                  {isExpanded && (
                    <CardContent id={`activity-${index + 1}`} className="pt-4 sm:pt-6 space-y-3 sm:space-y-4 p-3 sm:p-6">
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
    </main>
  );
}
