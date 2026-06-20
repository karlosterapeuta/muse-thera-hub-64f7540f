import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  User, 
  FileText, 
  Target, 
  Music, 
  Users, 
  Clock, 
  CheckCircle, 
  Activity, 
  BarChart, 
  RefreshCw,
  Download,
  Save,
  Plus,
  X
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useMusicotherapyTreatmentPlan } from '@/hooks/useMusicotherapyTreatmentPlan';
import { useProfessionalData } from '@/hooks/useProfessionalData';
import { MusicotherapyTreatmentPlan } from '@/types/musicotherapy-plan';
import { generateStaticPDF } from '@/utils/staticPDFGenerator';
import { MusicotherapyTreatmentPlanPDFv2 as MusicotherapyTreatmentPlanPDF } from '@/components/MusicotherapyTreatmentPlanPDFv2';
import { supabase } from '@/integrations/supabase/client';
import { PromptSelector } from '@/components/musicotherapy/PromptSelector';
import { DiagnosisSelector } from '@/components/musicotherapy/DiagnosisSelector';
import { ObjectivesSelector } from '@/components/musicotherapy/ObjectivesSelector';
import { ResourcesSelector } from '@/components/musicotherapy/ResourcesSelector';
import { EvaluationCriteriaSelector } from '@/components/musicotherapy/EvaluationCriteriaSelector';
import { ValidationSummary } from '@/components/musicotherapy/ValidationSummary';
import { imageUrlToBase64 } from '@/utils/imageToBase64';
import { formatAgeString } from '@/utils/dateUtils';
import { PlanStickyHeader } from '@/components/treatment-plan/PlanStickyHeader';
import { PlanTemplatesDialog } from '@/components/treatment-plan/PlanTemplatesDialog';
import { PlanAIGeneratorDialog } from '@/components/treatment-plan/PlanAIGeneratorDialog';
import { PlanImportClinicalDialog } from '@/components/treatment-plan/PlanImportClinicalDialog';
import { PlanVersionsDialog } from '@/components/treatment-plan/PlanVersionsDialog';
import { Sparkles, Wand2, FileSearch, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { planSections, getCompletion } from './sections';
import { PlanSectionHeader } from '@/components/treatment-plan/PlanSectionNav';

type Patient = {
  id: string;
  name: string;
  age?: number;
  birth_date?: string;
};

export default function MusicotherapyTreatmentPlanPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: professionalData } = useProfessionalData();
  const { 
    planData, 
    updatePlanData, 
    savePlan, 
    isSaving, 
    isLoading, 
    hasUnsavedChanges, 
    isAutoSaving, 
    lastSaved,
    validateRequiredFields,
    getValidationErrors 
  } = useMusicotherapyTreatmentPlan(id, (newId) => {
    // Navigate to edit URL so subsequent saves update instead of creating duplicates
    navigate(`/musicotherapy-treatment-plan/${newId}`, { replace: true });
  });
  
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);
  const [activeTab, setActiveTab] = useState("identification");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [versionsOpen, setVersionsOpen] = useState(false);

  const applyPartialPlan = (partial: Partial<MusicotherapyTreatmentPlan>) => {
    const updates: Record<string, any> = {};
    Object.entries(partial).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      const current = (planData as any)[key];
      if (Array.isArray(value)) {
        updates[key] = Array.from(new Set([...(Array.isArray(current) ? current : []), ...value]));
      } else if (typeof value === 'string') {
        if (!current || (typeof current === 'string' && current.trim().length < 3)) {
          updates[key] = value;
        }
      } else {
        if (!current) updates[key] = value;
      }
    });
    if (Object.keys(updates).length) updatePlanData(updates as Partial<MusicotherapyTreatmentPlan>);
  };

  /** Substitui integralmente os campos presentes no modelo selecionado. */
  const replaceWithTemplate = (partial: Partial<MusicotherapyTreatmentPlan>) => {
    const updates: Record<string, any> = {};
    Object.entries(partial).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      updates[key] = value;
    });
    if (Object.keys(updates).length) updatePlanData(updates as Partial<MusicotherapyTreatmentPlan>);
  };

  /** Aplica um modelo clínico no modo escolhido (completar ou substituir). */
  const applyTemplate = (
    data: Partial<MusicotherapyTreatmentPlan>,
    mode: 'complete' | 'replace',
  ) => {
    if (mode === 'replace') {
      replaceWithTemplate(data);
      toast({ title: 'Modelo aplicado', description: 'O plano foi preenchido com o modelo selecionado.' });
    } else {
      applyPartialPlan(data);
      toast({ title: 'Campos completados', description: 'Apenas os campos vazios foram preenchidos.' });
    }
  };

  // Warning for unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'Você tem alterações não salvas. Tem certeza que deseja sair?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Fetch patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data, error } = await supabase
          .from("patients")
          .select("id, name, age, birth_date");

        if (error) throw error;
        if (data) setPatients(data);
      } catch (error) {
        console.error("Error fetching patients:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Falha ao carregar pacientes.",
        });
      } finally {
        setIsLoadingPatients(false);
      }
    };

    fetchPatients();
  }, [toast]);

  // Auto-fill therapist name when professional data loads
  useEffect(() => {
    if (professionalData && !planData.professional_id) {
      updatePlanData({ professional_id: professionalData.id });
    }
  }, [professionalData, planData.professional_id, updatePlanData]);

  // Sync selectedPatient when planData loads
  useEffect(() => {
    if (planData.patient_id && planData.patient_id !== selectedPatient) {
      setSelectedPatient(planData.patient_id);
    }
  }, [planData.patient_id]);

  const handlePatientSelect = (value: string) => {
    setSelectedPatient(value);
    const patient = patients.find((p) => p.id === value);
    if (patient) {
      // Calcular idade usando utilitário centralizado
      const patientAge = formatAgeString(patient.birth_date, patient.age);

      updatePlanData({
        patient_id: patient.id,
        patient_full_name: patient.name,
        patient_age: patientAge,
        patient_birth_date: patient.birth_date,
      });
    }
  };

  const addArrayItem = (field: keyof MusicotherapyTreatmentPlan, value: string) => {
    if (!value.trim()) return;
    const currentArray = (planData[field] as string[]) || [];
    updatePlanData({
      [field]: [...currentArray, value.trim()]
    });
  };

  const removeArrayItem = (field: keyof MusicotherapyTreatmentPlan, index: number) => {
    const currentArray = (planData[field] as string[]) || [];
    updatePlanData({
      [field]: currentArray.filter((_, i) => i !== index)
    });
  };

  const ArrayInput = ({ 
    label, 
    field, 
    placeholder 
  }: { 
    label: string; 
    field: keyof MusicotherapyTreatmentPlan; 
    placeholder: string;
  }) => {
    const [inputValue, setInputValue] = useState("");
    const items = (planData[field] as string[]) || [];

    const handleAdd = () => {
      addArrayItem(field, inputValue);
      setInputValue("");
    };

    return (
      <div className="space-y-3">
        <Label className="text-base font-medium text-foreground">{label}</Label>
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
            className="flex-1"
          />
          <Button type="button" onClick={handleAdd} disabled={!inputValue.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {items.length > 0 && (
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                <span className="flex-1 text-sm">{item}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeArrayItem(field, index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const handleDownloadPDF = async () => {
    if (!planData.patient_full_name) {
      toast({
        variant: "destructive",
        title: "Campo obrigatório",
        description: "Nome do paciente é obrigatório para gerar o PDF.",
      });
      return;
    }

    setIsGeneratingPDF(true);
    console.log('📄 [Page] Iniciando geração de PDF para o paciente:', planData.patient_full_name);
    try {
      // Convert professional images to Base64
      let signatureBase64: string | null = null;
      let stampBase64: string | null = null;
      let photoBase64: string | null = null;

      if (professionalData?.digital_signature_url) {
        signatureBase64 = await imageUrlToBase64(professionalData.digital_signature_url);
      }
      if (professionalData?.digital_stamp_url) {
        stampBase64 = await imageUrlToBase64(professionalData.digital_stamp_url);
      }
      if (professionalData?.stamp_photo_url) {
        photoBase64 = await imageUrlToBase64(professionalData.stamp_photo_url);
      }

      const component = React.createElement(MusicotherapyTreatmentPlanPDF, { 
        planData: planData as MusicotherapyTreatmentPlan,
        therapistName: professionalData?.name,
        digitalSignatureUrl: signatureBase64 || undefined,
        digitalStampUrl: stampBase64 || undefined,
        professionalPhotoUrl: photoBase64 || undefined,
        professionalEmail: professionalData?.email,
        professionalPhone: professionalData?.phone,
        professionalSpecialty: professionalData?.specialty,
        professionalRegistry: professionalData?.register || professionalData?.license_number,
      });

      const success = await generateStaticPDF(component, {
        filename: `Plano_Musicoterapeutico_${planData.patient_full_name?.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
        waitTime: 3000,
        quality: 2.5,
        format: 'a4',
        orientation: 'portrait',
        fullBleedPages: true
      });

      if (success) {
        toast({
          title: "PDF gerado com sucesso!",
          description: "O plano musicoterapêutico foi baixado.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao gerar PDF",
          description: "Não foi possível gerar o arquivo PDF.",
        });
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        variant: "destructive",
        title: "Erro ao gerar PDF",
        description: "Erro inesperado ao gerar o PDF.",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const tabSections = planSections;
  const activeIndex = tabSections.findIndex((s) => s.id === activeTab);
  const activeSection = tabSections[activeIndex] ?? tabSections[0];

  const goToSection = (id: string) => {
    setActiveTab(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Completion percentage based on per-section rules
  const completion = getCompletion(planData);




  if (isLoading && id) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <div>
            <p className="text-xl font-semibold">Carregando plano...</p>
            <p className="text-sm text-muted-foreground">Aguarde enquanto buscamos os dados</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative w-full overflow-x-hidden bg-background">
      {/* Ambient cosmic blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 pb-10 pt-6 space-y-6">
        {/* Premium Header */}
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/60 backdrop-blur-xl shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-amber-400/5" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          <div className="relative p-6 sm:p-8 lg:p-10">
            <div className="flex items-start gap-5">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-amber-500 blur-xl opacity-40" />
                <div className="relative p-4 rounded-2xl bg-gradient-to-br from-primary to-amber-500 shadow-lg">
                  <Music className="h-7 w-7 lg:h-8 lg:w-8 text-white" />
                </div>
              </div>
              <div className="space-y-2 min-w-0">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/60 bg-background/40 backdrop-blur text-xs font-medium text-muted-foreground">
                  <Sparkles className="h-3 w-3 text-amber-500" />
                  Plano Clínico · IA Integrada
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                  Plano Musicoterapêutico
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
                  Estruture objetivos, recursos e estratégias do plano de tratamento com modelos prontos e assistente de IA.
                </p>
              </div>
            </div>

            {/* Status pills */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border/60 bg-background/40 backdrop-blur text-xs font-medium">
                <Target className="h-3.5 w-3.5 text-primary" /> Objetivos
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border/60 bg-background/40 backdrop-blur text-xs font-medium">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Assistente IA
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border/60 bg-background/40 backdrop-blur text-xs font-medium">
                <Download className="h-3.5 w-3.5 text-rose-400" /> Exportar PDF
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Header */}
        <PlanStickyHeader
          isEditing={!!id}
          patientName={planData.patient_full_name}
          status={planData.status}
          completion={completion}
          isAutoSaving={isAutoSaving}
          isSaving={isSaving}
          hasUnsavedChanges={hasUnsavedChanges}
          lastSaved={lastSaved}
          isGeneratingPDF={isGeneratingPDF}
          canDownload={!!planData.patient_full_name}
          onBack={() => navigate(-1)}
          onSave={() => savePlan()}
          onDownload={handleDownloadPDF}
        />

        {/* Smart actions: templates + AI */}
        <div className="flex flex-wrap items-center gap-2 mb-4 mt-2 p-3 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 via-background to-primary/5">
          <div className="flex-1 min-w-[180px]">
            <div className="text-sm font-semibold flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary" />
              Acelere a criação do plano
            </div>
            <div className="text-xs text-muted-foreground">Aplique um template clínico ou gere uma sugestão com IA.</div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setImportOpen(true)} disabled={!planData.patient_id}>
            <FileSearch className="h-4 w-4 mr-2" />
            Importar prontuário
          </Button>
          <Button variant="outline" size="sm" onClick={() => setTemplatesOpen(true)}>
            <Sparkles className="h-4 w-4 mr-2" />
            Templates
          </Button>
          <Button variant="outline" size="sm" onClick={() => setVersionsOpen(true)} disabled={!planData.id}>
            <History className="h-4 w-4 mr-2" />
            Versões
          </Button>
          <Button size="sm" onClick={() => setAiOpen(true)} className="bg-gradient-to-r from-primary to-primary/80">
            <Wand2 className="h-4 w-4 mr-2" />
            Gerar com IA
          </Button>
        </div>

        <PlanTemplatesDialog
          open={templatesOpen}
          onOpenChange={setTemplatesOpen}
          onApply={applyTemplate}
        />
        <PlanAIGeneratorDialog
          open={aiOpen}
          onOpenChange={setAiOpen}
          patientContext={{
            patient_full_name: planData.patient_full_name,
            patient_age: planData.patient_age,
            clinical_diagnosis: planData.clinical_diagnosis,
          }}
          onGenerated={applyPartialPlan}
        />
        <PlanImportClinicalDialog
          open={importOpen}
          onOpenChange={setImportOpen}
          patientId={planData.patient_id}
          onApply={applyPartialPlan}
        />
        <PlanVersionsDialog
          open={versionsOpen}
          onOpenChange={setVersionsOpen}
          planId={planData.id}
          professionalId={planData.professional_id}
          currentData={planData}
          onRestore={(snap) => updatePlanData(snap)}
        />

        {/* Validation Summary */}
        <ValidationSummary
          errors={getValidationErrors()}
          isValid={validateRequiredFields()}
          className="mb-6"
        />

        {/* Devolutiva-style tabbed layout */}
        <Tabs value={activeTab} onValueChange={goToSection} className="w-full min-w-0">
          <TabsList className="flex flex-wrap h-auto w-full gap-1 bg-card/60 backdrop-blur-xl border border-border/60 rounded-xl p-1">
            {tabSections.map((section, index) => {
              const Icon = section.icon;
              const complete = section.isComplete(planData);
              return (
                <TabsTrigger
                  key={section.id}
                  value={section.id}
                  className="flex-1 min-w-[120px] gap-1.5 rounded-lg text-xs data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-amber-500 data-[state=active]:text-white"
                >
                  {complete ? (
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-400 data-[state=active]:text-white" />
                  ) : (
                    <Icon className="h-3.5 w-3.5" />
                  )}
                  <span className="truncate">{index + 1}. {section.navLabel}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <PlanSectionHeader section={activeSection} index={activeIndex} total={tabSections.length} />


          {/* Tab Contents */}
          <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mt-6"
          >


            {/* 1. Patient Identification */}
            <TabsContent value="identification" className="mt-6">
              <Card>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Paciente</Label>
                      {isLoadingPatients ? (
                        <div className="text-sm text-muted-foreground">Carregando pacientes...</div>
                      ) : (
                        <Select value={selectedPatient} onValueChange={handlePatientSelect}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um paciente" />
                          </SelectTrigger>
                          <SelectContent>
                            {patients.map(patient => (
                              <SelectItem key={patient.id} value={patient.id}>
                                {patient.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Nome completo *</Label>
                      <Input
                        value={planData.patient_full_name || ''}
                        onChange={(e) => updatePlanData({ patient_full_name: e.target.value })}
                        placeholder="Nome completo do paciente"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Data de nascimento</Label>
                      <Input
                        type="date"
                        value={planData.patient_birth_date || ''}
                        onChange={(e) => updatePlanData({ patient_birth_date: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Idade</Label>
                      <Input
                        value={planData.patient_age || ''}
                        onChange={(e) => updatePlanData({ patient_age: e.target.value })}
                        placeholder="Ex: 8 anos"
                      />
                    </div>
                    
                    <DiagnosisSelector
                      value={planData.clinical_diagnosis || ''}
                      onChange={(value) => updatePlanData({ clinical_diagnosis: value })}
                    />
                    
                    <div className="space-y-2">
                      <Label>Responsável</Label>
                      <Input
                        value={planData.responsible_person || ''}
                        onChange={(e) => updatePlanData({ responsible_person: e.target.value })}
                        placeholder="Nome do responsável"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Data de início do plano *</Label>
                      <Input
                        type="date"
                        value={planData.plan_start_date || ''}
                        onChange={(e) => updatePlanData({ plan_start_date: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 2. Initial Assessment */}
            <TabsContent value="assessment" className="mt-6">
              <Card>
                <CardContent className="space-y-6">
                  <PromptSelector
                    label="Histórico clínico e familiar relevante"
                    prompts={[
                      "Diagnóstico aos [idade] anos. Histórico de [condições]. Medicações em uso: [medicamentos]. Terapias complementares: [terapias].",
                      "Desenvolvimento típico até [idade]. Primeira manifestação dos sintomas em [período]. Família com histórico de [condições].",
                      "Parto sem intercorrências. Marco do desenvolvimento dentro da normalidade até [idade]. Histórico familiar sem relevância clínica.",
                      "Nascimento prematuro com [complicações]. Acompanhamento médico desde [idade]. Família com suporte adequado."
                    ]}
                    value={planData.clinical_family_history || ''}
                    onChange={(value) => updatePlanData({ clinical_family_history: value })}
                    placeholder="Descreva o histórico clínico e familiar relevante..."
                    rows={4}
                  />
                  
                  <PromptSelector
                    label="Condições físicas, cognitivas, emocionais e sociais"
                    prompts={[
                      "Desenvolvimento motor: [típico/atípico]. Coordenação: [preservada/comprometida]. Atenção sustentada: [tempo]. Memória: [preservada/dificuldades].",
                      "Comunicação verbal: [presente/ausente/limitada]. Compreensão: [adequada para idade/comprometida]. Aspectos sensoriais: [hiper/hipossensibilidade].",
                      "Estado emocional estável. Comportamentos adaptativos adequados. Interação social apropriada para faixa etária.",
                      "Ansiedade moderada em situações novas. Dificuldades de autorregulação emocional. Preferência por rotinas estruturadas."
                    ]}
                    value={planData.physical_cognitive_conditions || ''}
                    onChange={(value) => updatePlanData({ physical_cognitive_conditions: value })}
                    placeholder="Descreva as condições atuais do paciente..."
                    rows={4}
                  />
                  
                  <PromptSelector
                    label="Nível de interação e comunicação"
                    prompts={[
                      "Contato visual: [mantém/evita/eventual]. Iniciativa comunicativa: [presente/ausente]. Responde ao chamado pelo nome: [sim/não/às vezes].",
                      "Interação social: [busca/evita/indiferente]. Brincadeiras: [solitárias/paralelas/cooperativas]. Turnos de comunicação: [compreende/não compreende].",
                      "Comunicação funcional presente. Busca interação com adultos de referência. Compreende comandos simples.",
                      "Comunicação não verbal predominante. Utiliza gestos para expressar necessidades. Preferência por interação individual."
                    ]}
                    value={planData.interaction_communication_level || ''}
                    onChange={(value) => updatePlanData({ interaction_communication_level: value })}
                    placeholder="Descreva como o paciente se comunica e interage..."
                    rows={3}
                  />
                  
                  <div className="space-y-2">
                    <Label>Interesses musicais</Label>
                    <Textarea
                      value={planData.musical_interests || ''}
                      onChange={(e) => updatePlanData({ musical_interests: e.target.value })}
                      placeholder="Instrumentos preferidos, estilos musicais, preferências sonoras..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Comportamentos observados durante avaliação inicial</Label>
                    <Textarea
                      value={planData.observed_behaviors || ''}
                      onChange={(e) => updatePlanData({ observed_behaviors: e.target.value })}
                      placeholder="Descreva os comportamentos observados..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 3. General Objectives */}
            <TabsContent value="general-objectives" className="mt-6">
              <Card>
                <CardContent>
                  <ObjectivesSelector
                    label="Propósitos amplos da musicoterapia"
                    objectives={planData.general_objectives || []}
                    onAdd={(objective) => addArrayItem('general_objectives', objective)}
                    onRemove={(index) => removeArrayItem('general_objectives', index)}
                    suggestions={[]}
                    type="general"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* 4. Specific Objectives */}
            <TabsContent value="specific-objectives" className="mt-6">
              <Card>
                <CardContent>
                  <ObjectivesSelector
                    label="Objetivos mensuráveis e específicos"
                    objectives={planData.specific_objectives || []}
                    onAdd={(objective) => addArrayItem('specific_objectives', objective)}
                    onRemove={(index) => removeArrayItem('specific_objectives', index)}
                    suggestions={[]}
                    type="specific"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* 5. Musicotherapy Resources */}
            <TabsContent value="resources" className="mt-6">
              <Card>
                <CardContent className="space-y-5 pt-6">
                  <p className="text-sm text-muted-foreground">
                    Organize os recursos por categoria. Cada grupo é registrado separadamente no plano e no documento final.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                      <ArrayInput label="Instrumentos musicais" field="musical_instruments" placeholder="Ex: Violão, teclado, pandeiro..." />
                    </div>
                    <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                      <ArrayInput label="Recursos tecnológicos" field="technological_resources" placeholder="Ex: Aplicativos, sistema de som..." />
                    </div>
                    <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                      <ArrayInput label="Voz e corpo" field="voice_body_resources" placeholder="Ex: Canto, percussão corporal..." />
                    </div>
                    <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                      <ArrayInput label="Materiais complementares" field="complementary_materials" placeholder="Ex: Lenços, cartões, objetos sonoros..." />
                    </div>
                  </div>
                </CardContent>
              </Card>

            </TabsContent>

            {/* 6. Strategies and Techniques */}
            <TabsContent value="strategies" className="mt-6">
              <Card>
                <CardContent className="space-y-6">
                  <PromptSelector
                    label="Improvisação musical"
                    prompts={[
                      "Exploração livre de instrumentos seguida de estruturação gradual. Diálogos musicais entre terapeuta e paciente. Criação de 'conversas' rítmicas.",
                      "Interação espontânea com instrumentos melódicos. Desenvolvimento de temas musicais improvisados. Jogos de pergunta e resposta musical.",
                      "Criação livre com instrumentos de percussão. Expressão emocional através da improvisação. Exploração de texturas sonoras.",
                      "Improvisação vocal livre seguida de estruturação rítmica. Diálogos sonoros não verbais. Expressão criativa sem julgamento."
                    ]}
                    value={planData.musical_improvisation || ''}
                    onChange={(value) => updatePlanData({ musical_improvisation: value })}
                    placeholder="Interação livre ou dirigida com instrumentos..."
                    rows={3}
                  />
                  
                  <PromptSelector
                    label="Recriação musical"
                    prompts={[
                      "Canções conhecidas adaptadas às necessidades terapêuticas. Modificação de letras para trabalhar objetivos específicos. Acompanhamento instrumental de repertório familiar.",
                      "Reprodução de canções infantis com gestos corporais. Adaptação do tempo e ritmo conforme capacidade do paciente. Inclusão de instrumentos simples.",
                      "Interpretação de músicas preferidas do paciente. Trabalho de memória através do repertório conhecido. Estímulo à participação vocal.",
                      "Recriação de trilhas sonoras familiares. Associação de músicas a atividades cotidianas. Desenvolvimento de repertório terapêutico personalizado."
                    ]}
                    value={planData.musical_recreation || ''}
                    onChange={(value) => updatePlanData({ musical_recreation: value })}
                    placeholder="Cantar ou tocar músicas conhecidas..."
                    rows={3}
                  />
                  
                  <PromptSelector
                    label="Composição"
                    prompts={[
                      "Criação de pequenas melodias sobre temas do interesse do paciente. Composição de letras expressando sentimentos. Construção coletiva de canções simples.",
                      "Desenvolvimento de sons e ritmos personalizados. Criação de histórias musicais. Composição colaborativa entre terapeuta e paciente.",
                      "Invenção de canções temáticas para rotinas diárias. Criação de jingles musicais. Desenvolvimento de identidade sonora pessoal.",
                      "Composição de músicas para expressar emoções específicas. Criação de trilhas para atividades favoritas. Desenvolvimento de repertório autoral."
                    ]}
                    value={planData.musical_composition || ''}
                    onChange={(value) => updatePlanData({ musical_composition: value })}
                    placeholder="Criar músicas, letras ou sons em conjunto..."
                    rows={3}
                  />
                  
                  <PromptSelector
                    label="Escuta receptiva"
                    prompts={[
                      "Músicas selecionadas para relaxamento e regulação emocional. Escuta ativa com movimentos corporais. Associação de músicas a imagens e histórias.",
                      "Seleção de repertório para diferentes estados emocionais. Escuta direcionada para estimulação cognitiva. Trabalho de memória auditiva.",
                      "Músicas para indução de estados de calma. Escuta com visualização dirigida. Trabalho de identificação de emoções através da música.",
                      "Repertório adaptado para diferentes objetivos terapêuticos. Escuta com proposta de movimento expressivo. Estimulação sensorial através da música."
                    ]}
                    value={planData.receptive_listening || ''}
                    onChange={(value) => updatePlanData({ receptive_listening: value })}
                    placeholder="Ouvir músicas para estimular resposta emocional ou cognitiva..."
                    rows={3}
                  />
                  
                  <div className="space-y-2">
                    <Label>Dinâmicas rítmicas</Label>
                    <Textarea
                      value={planData.rhythmic_dynamics || ''}
                      onChange={(e) => updatePlanData({ rhythmic_dynamics: e.target.value })}
                      placeholder="Jogos de pulsação e coordenação motora..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 7. Frequency and Duration */}
            <TabsContent value="frequency" className="mt-6">
              <Card>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label>Sessões semanais</Label>
                      <Select 
                        value={String(planData.weekly_sessions || 1)} 
                        onValueChange={(value) => updatePlanData({ weekly_sessions: Number(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map(num => (
                            <SelectItem key={num} value={String(num)}>
                              {num}x por semana
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Duração da sessão (minutos)</Label>
                      <Select 
                        value={String(planData.session_duration_minutes || 45)} 
                        onValueChange={(value) => updatePlanData({ session_duration_minutes: Number(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 minutos</SelectItem>
                          <SelectItem value="40">40 minutos</SelectItem>
                          <SelectItem value="45">45 minutos</SelectItem>
                          <SelectItem value="60">60 minutos</SelectItem>
                          <SelectItem value="90">90 minutos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Período estimado (meses)</Label>
                      <Select 
                        value={String(planData.estimated_period_months || 3)} 
                        onValueChange={(value) => updatePlanData({ estimated_period_months: Number(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 6, 9, 12, 18, 24].map(num => (
                            <SelectItem key={num} value={String(num)}>
                              {num} {num === 1 ? 'mês' : 'meses'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 8. Evaluation Criteria */}
            <TabsContent value="evaluation" className="mt-6">
              <Card>
                <CardContent>
                  <EvaluationCriteriaSelector
                    criteria={planData.evaluation_criteria_list || []}
                    onAdd={(criterion) => addArrayItem('evaluation_criteria_list', criterion)}
                    onRemove={(index) => removeArrayItem('evaluation_criteria_list', index)}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* 9. Therapeutic Plan in Action */}
            <TabsContent value="action-plan" className="mt-6">
              <Card>
                <CardContent className="space-y-6">
                  <PromptSelector
                    label="Estrutura das sessões"
                    prompts={[
                      "Ritual de chegada (5 min) → Aquecimento musical (10 min) → Atividade principal (25 min) → Relaxamento/fechamento (5 min)",
                      "Acolhimento musical (5 min) → Exploração instrumental (15 min) → Atividades dirigidas (20 min) → Momento criativo (15 min) → Despedida musical (5 min)",
                      "Canção de boas-vindas → Aquecimento corporal com música → Atividades principais conforme objetivos → Momento de expressão livre → Ritual de encerramento",
                      "Início com música familiar → Atividades de maior demanda cognitiva → Pausa para regulação → Atividades expressivas → Fechamento relaxante"
                    ]}
                    value={planData.session_structure || ''}
                    onChange={(value) => updatePlanData({ session_structure: value })}
                    placeholder="Descreva a estrutura típica das sessões (início, desenvolvimento, fechamento)..."
                    rows={4}
                  />
                  
                  <PromptSelector
                    label="Sequência das atividades musicais propostas"
                    prompts={[
                      "1. Canção de boas-vindas; 2. Exploração instrumental livre; 3. Atividade dirigida conforme objetivo; 4. Momento criativo/expressivo; 5. Canção de despedida",
                      "Início com música preferida → Atividades rítmicas corporais → Trabalho vocal/instrumental → Improvisação livre → Relaxamento musical",
                      "Aquecimento vocal → Percussão corporal → Instrumentos melódicos → Criação musical → Escuta receptiva para fechamento",
                      "Ritual musical inicial → Atividades de coordenação → Trabalho de objetivos específicos → Expressão criativa → Momento de integração final"
                    ]}
                    value={planData.activity_sequence || ''}
                    onChange={(value) => updatePlanData({ activity_sequence: value })}
                    placeholder="Descreva a ordem e progressão das atividades musicais..."
                    rows={4}
                  />
                  
                  <PromptSelector
                    label="Flexibilidade para ajustes"
                    prompts={[
                      "Ajustes conforme estado emocional e engajamento do paciente. Alternância entre atividades ativas e receptivas conforme necessidade de regulação.",
                      "Adaptação do tempo e intensidade das atividades conforme resposta do paciente. Modificação de instrumentos e repertório conforme interesse demonstrado.",
                      "Flexibilidade para interromper atividades que causem desconforto. Inclusão de pausas para autorregulação quando necessário.",
                      "Possibilidade de modificar objetivos da sessão conforme demandas emergentes. Adaptação de recursos conforme disponibilidade e interesse."
                    ]}
                    value={planData.flexibility_adjustments || ''}
                    onChange={(value) => updatePlanData({ flexibility_adjustments: value })}
                    placeholder="Como o plano pode ser ajustado de acordo com as respostas do paciente..."
                    rows={3}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* 10. Re-evaluation and Evolution */}
            <TabsContent value="re-evaluation" className="mt-6">
              <Card>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Frequência da reavaliação</Label>
                    <Select 
                      value={planData.reevaluation_frequency || 'mensal'} 
                      onValueChange={(value) => updatePlanData({ reevaluation_frequency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quinzenal">Quinzenal</SelectItem>
                        <SelectItem value="mensal">Mensal</SelectItem>
                        <SelectItem value="bimestral">Bimestral</SelectItem>
                        <SelectItem value="trimestral">Trimestral</SelectItem>
                        <SelectItem value="semestral">Semestral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Registro da evolução em prontuário musicoterapêutico</Label>
                    <Textarea
                      value={planData.evolution_recording || ''}
                      onChange={(e) => updatePlanData({ evolution_recording: e.target.value })}
                      placeholder="Descreva como será feito o registro da evolução..."
                      rows={4}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Ajustes necessários nos objetivos e técnicas</Label>
                    <Textarea
                      value={planData.necessary_adjustments || ''}
                      onChange={(e) => updatePlanData({ necessary_adjustments: e.target.value })}
                      placeholder="Que tipo de ajustes podem ser necessários durante o tratamento..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </motion.div>
          </AnimatePresence>

        </Tabs>

        {/* Navigation Footer */}
        <div className="flex items-center justify-between gap-3 mt-8 p-4 bg-muted/40 border border-border/60 rounded-xl">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => { if (activeIndex > 0) goToSection(tabSections[activeIndex - 1].id); }}
            disabled={activeIndex === 0}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">{activeIndex > 0 ? tabSections[activeIndex - 1].navLabel : 'Anterior'}</span>
            <span className="sm:hidden">Anterior</span>
          </Button>

          <div className="text-xs sm:text-sm text-muted-foreground text-center">
            Seção {activeIndex + 1} de {tabSections.length}
          </div>

          <Button
            className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90"
            onClick={() => { if (activeIndex < tabSections.length - 1) goToSection(tabSections[activeIndex + 1].id); }}
            disabled={activeIndex === tabSections.length - 1}
          >
            <span className="hidden sm:inline">{activeIndex < tabSections.length - 1 ? tabSections[activeIndex + 1].navLabel : 'Próxima'}</span>
            <span className="sm:hidden">Próxima</span>
            <ArrowLeft className="h-4 w-4 rotate-180" />
          </Button>
        </div>

      </div>
    </div>
  );
}