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
import { useTranslation } from 'react-i18next';
import { useMusicotherapyTreatmentPlan } from '@/hooks/useMusicotherapyTreatmentPlan';
import { useProfessionalData } from '@/hooks/useProfessionalData';
import { MusicotherapyTreatmentPlan } from '@/types/musicotherapy-plan';
import { generateStaticPDF } from '@/utils/staticPDFGenerator';
import { MusicotherapyTreatmentPlanPDF } from '@/components/MusicotherapyTreatmentPlanPDF';
import { supabase } from '@/integrations/supabase/client';
import { PromptSelector } from '@/components/musicotherapy/PromptSelector';
import { DiagnosisSelector } from '@/components/musicotherapy/DiagnosisSelector';
import { ObjectivesSelector } from '@/components/musicotherapy/ObjectivesSelector';
import { ResourcesSelector } from '@/components/musicotherapy/ResourcesSelector';
import { EvaluationCriteriaSelector } from '@/components/musicotherapy/EvaluationCriteriaSelector';
import { ValidationSummary } from '@/components/musicotherapy/ValidationSummary';
import { LanguageSelector } from '@/components/LanguageSelector';

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
  const { t } = useTranslation('musicotherapy');
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
  } = useMusicotherapyTreatmentPlan(id);
  
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);
  const [activeTab, setActiveTab] = useState("identification");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Warning for unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = t('form.unsavedChanges');
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges, t]);

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
          title: t('form.toast.loadError'),
          description: t('form.toast.loadErrorMessage'),
        });
      } finally {
        setIsLoadingPatients(false);
      }
    };

    fetchPatients();
  }, [toast, t]);

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
        title: t('form.toast.requiredField'),
        description: t('form.validation.patientNameRequired'),
      });
      return;
    }

    setIsGeneratingPDF(true);
    try {
      const component = React.createElement(MusicotherapyTreatmentPlanPDF, { 
        planData: planData as MusicotherapyTreatmentPlan,
        therapistName: professionalData?.name 
      });

      const success = await generateStaticPDF(component, {
        filename: `Plano_Musicoterapeutico_${planData.patient_full_name?.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
        waitTime: 2000,
        quality: 1.2,
        format: 'a4',
        orientation: 'portrait'
      });

      if (success) {
        toast({
          title: t('form.toast.pdfSuccess'),
          description: t('form.toast.pdfDownloaded'),
        });
      } else {
        toast({
          variant: "destructive",
          title: t('form.toast.pdfError'),
          description: t('form.toast.pdfGenerationError'),
        });
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        variant: "destructive",
        title: t('form.toast.pdfError'),
        description: t('form.toast.unexpectedError'),
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const tabSections = [
    { id: 'identification', label: t('form.tabs.identification.label'), icon: User },
    { id: 'assessment', label: t('form.tabs.assessment.label'), icon: FileText },
    { id: 'general-objectives', label: t('form.tabs.generalObjectives.label'), icon: Target },
    { id: 'specific-objectives', label: t('form.tabs.specificObjectives.label'), icon: CheckCircle },
    { id: 'resources', label: t('form.tabs.resources.label'), icon: Music },
    { id: 'strategies', label: t('form.tabs.strategies.label'), icon: Activity },
    { id: 'frequency', label: t('form.tabs.frequency.label'), icon: Clock },
    { id: 'evaluation', label: t('form.tabs.evaluation.label'), icon: BarChart },
    { id: 'action-plan', label: t('form.tabs.action.label'), icon: Users },
    { id: 're-evaluation', label: t('form.tabs.reevaluation.label'), icon: RefreshCw }
  ];

  if (isLoading && id) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <div>
            <p className="text-xl font-semibold">{t('form.loadingPlan')}</p>
            <p className="text-sm text-muted-foreground">{t('form.loadingMessage')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {id ? t('form.editTitle') : t('form.newTitle')}
              </h1>
              <p className="text-muted-foreground">
                {t('form.subtitle')}
              </p>
            </div>
          </div>
          
          <LanguageSelector />
          
          <div className="flex gap-2 items-center">
            {/* Save status indicator */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {isAutoSaving && (
                <div className="flex items-center gap-1">
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  <span>{t('form.autoSaving')}</span>
                </div>
              )}
              {hasUnsavedChanges && !isAutoSaving && (
                <div className="flex items-center gap-1 text-amber-600">
                  <div className="h-2 w-2 rounded-full bg-amber-600" />
                  <span>{t('form.unsavedChanges')}</span>
                </div>
              )}
              {lastSaved && !hasUnsavedChanges && !isAutoSaving && (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="h-3 w-3" />
                  <span>{t('form.lastSaved', { time: lastSaved.toLocaleTimeString() })}</span>
                </div>
              )}
            </div>
            
            <Button
              onClick={() => savePlan()}
              disabled={isSaving || isAutoSaving}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? t('form.savingButton') : t('form.saveButton')}
            </Button>
            <Button
              onClick={handleDownloadPDF}
              variant="outline"
              disabled={!planData.patient_full_name || isGeneratingPDF}
            >
              <Download className="h-4 w-4 mr-2" />
              {isGeneratingPDF ? t('form.generatingPdfButton') : t('form.downloadPdfButton')}
            </Button>
          </div>
        </div>

        {/* Validation Summary */}
        <ValidationSummary 
          errors={getValidationErrors()} 
          isValid={validateRequiredFields()}
          className="mb-6"
        />

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 lg:grid-cols-10 gap-1 h-auto p-1 bg-muted/50">
            {tabSections.map((section) => {
              const IconComponent = section.icon;
              return (
                <TabsTrigger
                  key={section.id}
                  value={section.id}
                  className="flex flex-col items-center gap-1 p-3 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="hidden sm:block">{section.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Tab Contents */}
          <div className="mt-6">
            {/* 1. Patient Identification */}
            <TabsContent value="identification" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {t('form.tabs.identification.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>{t('form.fields.patient')}</Label>
                      {isLoadingPatients ? (
                        <div className="text-sm text-muted-foreground">{t('form.loadingPatients')}</div>
                      ) : (
                        <Select value={selectedPatient} onValueChange={handlePatientSelect}>
                          <SelectTrigger>
                            <SelectValue placeholder={t('form.fields.patientPlaceholder')} />
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
                      <Label>{t('form.fields.fullName')}</Label>
                      <Input
                        value={planData.patient_full_name || ''}
                        onChange={(e) => updatePlanData({ patient_full_name: e.target.value })}
                        placeholder={t('form.fields.fullNamePlaceholder')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>{t('form.fields.birthDate')}</Label>
                      <Input
                        type="date"
                        value={planData.patient_birth_date || ''}
                        onChange={(e) => updatePlanData({ patient_birth_date: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>{t('form.fields.age')}</Label>
                      <Input
                        value={planData.patient_age || ''}
                        onChange={(e) => updatePlanData({ patient_age: e.target.value })}
                        placeholder={t('form.fields.agePlaceholder')}
                      />
                    </div>
                    
                    <DiagnosisSelector
                      value={planData.clinical_diagnosis || ''}
                      onChange={(value) => updatePlanData({ clinical_diagnosis: value })}
                    />
                    
                    <div className="space-y-2">
                      <Label>{t('form.fields.responsible')}</Label>
                      <Input
                        value={planData.responsible_person || ''}
                        onChange={(e) => updatePlanData({ responsible_person: e.target.value })}
                        placeholder={t('form.fields.responsiblePlaceholder')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>{t('form.fields.planStartDate')}</Label>
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

            <TabsContent value="assessment" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {t('form.tabs.assessment.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                <PromptSelector
                  label={t('form.fields.clinicalHistory')}
                  prompts={t('prompts.clinicalFamilyHistory', { returnObjects: true }) as string[]}
                  value={planData.clinical_family_history || ''}
                  onChange={(value) => updatePlanData({ clinical_family_history: value })}
                  placeholder={t('form.fields.clinicalHistoryPlaceholder')}
                  rows={4}
                />
                
                <PromptSelector
                  label={t('form.fields.physicalCognitive')}
                  prompts={t('prompts.physicalCognitiveConditions', { returnObjects: true }) as string[]}
                  value={planData.physical_cognitive_conditions || ''}
                  onChange={(value) => updatePlanData({ physical_cognitive_conditions: value })}
                  placeholder={t('form.fields.physicalCognitivePlaceholder')}
                  rows={4}
                />
                
                <PromptSelector
                  label={t('form.fields.interactionLevel')}
                  prompts={t('prompts.interactionCommunicationLevel', { returnObjects: true }) as string[]}
                  value={planData.interaction_communication_level || ''}
                  onChange={(value) => updatePlanData({ interaction_communication_level: value })}
                  placeholder={t('form.fields.interactionLevelPlaceholder')}
                  rows={3}
                />
                
                <div className="space-y-2">
                  <Label>{t('form.fields.musicalInterests')}</Label>
                  <Textarea
                    value={planData.musical_interests || ''}
                    onChange={(e) => updatePlanData({ musical_interests: e.target.value })}
                    placeholder={t('form.fields.musicalInterestsPlaceholder')}
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
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    {t('form.tabs.generalObjectives.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ObjectivesSelector
                    label={t('objectives.general.label')}
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
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    {t('form.tabs.specificObjectives.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ObjectivesSelector
                    label={t('objectives.specific.label')}
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
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Music className="h-5 w-5" />
                    {t('form.tabs.resources.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ResourcesSelector
                    resources={[
                      ...(planData.musical_instruments || []),
                      ...(planData.technological_resources || []),
                      ...(planData.voice_body_resources || []),
                      ...(planData.complementary_materials || [])
                    ]}
                    onAdd={(resource) => {
                      // Add to the first empty array or musical_instruments by default
                      if (!planData.musical_instruments?.length) {
                        addArrayItem('musical_instruments', resource);
                      } else {
                        addArrayItem('complementary_materials', resource);
                      }
                    }}
                    onRemove={(index) => {
                      // Find which array the item belongs to and remove it
                      const allResources = [
                        ...(planData.musical_instruments || []),
                        ...(planData.technological_resources || []),
                        ...(planData.voice_body_resources || []),
                        ...(planData.complementary_materials || [])
                      ];
                      
                      let currentIndex = 0;
                      const fields: (keyof MusicotherapyTreatmentPlan)[] = [
                        'musical_instruments', 'technological_resources', 
                        'voice_body_resources', 'complementary_materials'
                      ];
                      
                      for (const field of fields) {
                        const fieldArray = planData[field] as string[] || [];
                        if (index < currentIndex + fieldArray.length) {
                          removeArrayItem(field, index - currentIndex);
                          break;
                        }
                        currentIndex += fieldArray.length;
                      }
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* 6. Strategies and Techniques */}
            <TabsContent value="strategies" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    {t('form.tabs.strategies.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <PromptSelector
                    label={t('form.strategies.musicalImprovisation.label')}
                    prompts={t('form.strategies.musicalImprovisation.prompts', { returnObjects: true }) as string[]}
                    value={planData.musical_improvisation || ''}
                    onChange={(value) => updatePlanData({ musical_improvisation: value })}
                    placeholder={t('form.strategies.musicalImprovisation.placeholder')}
                    rows={3}
                  />
                  
                  <PromptSelector
                    label={t('form.strategies.musicalRecreation.label')}
                    prompts={t('form.strategies.musicalRecreation.prompts', { returnObjects: true }) as string[]}
                    value={planData.musical_recreation || ''}
                    onChange={(value) => updatePlanData({ musical_recreation: value })}
                    placeholder={t('form.strategies.musicalRecreation.placeholder')}
                    rows={3}
                  />
                  
                  <PromptSelector
                    label={t('form.strategies.composition.label')}
                    prompts={t('form.strategies.composition.prompts', { returnObjects: true }) as string[]}
                    value={planData.musical_composition || ''}
                    onChange={(value) => updatePlanData({ musical_composition: value })}
                    placeholder={t('form.strategies.composition.placeholder')}
                    rows={3}
                  />
                  
                  <PromptSelector
                    label={t('form.strategies.receptiveListening.label')}
                    prompts={t('form.strategies.receptiveListening.prompts', { returnObjects: true }) as string[]}
                    value={planData.receptive_listening || ''}
                    onChange={(value) => updatePlanData({ receptive_listening: value })}
                    placeholder={t('form.strategies.receptiveListening.placeholder')}
                    rows={3}
                  />
                  
                  <div className="space-y-2">
                    <Label>{t('form.strategies.rhythmicDynamics.label')}</Label>
                    <Textarea
                      value={planData.rhythmic_dynamics || ''}
                      onChange={(e) => updatePlanData({ rhythmic_dynamics: e.target.value })}
                      placeholder={t('form.strategies.rhythmicDynamics.placeholder')}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 7. Frequency and Duration */}
            <TabsContent value="frequency" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    {t('form.tabs.frequency.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label>{t('frequency.weeklySessionsLabel')}</Label>
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
                              {num}x {t('frequency.perWeek')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>{t('frequency.sessionDurationLabel')}</Label>
                      <Select 
                        value={String(planData.session_duration_minutes || 45)} 
                        onValueChange={(value) => updatePlanData({ session_duration_minutes: Number(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">{t('frequency.options.duration.thirty')}</SelectItem>
                          <SelectItem value="40">{t('frequency.options.duration.forty')}</SelectItem>
                          <SelectItem value="45">{t('frequency.options.duration.fortyfive')}</SelectItem>
                          <SelectItem value="60">{t('frequency.options.duration.sixty')}</SelectItem>
                          <SelectItem value="90">{t('frequency.options.duration.ninety')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>{t('frequency.estimatedPeriodLabel')}</Label>
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
                              {num} {num === 1 ? t('frequency.month') : t('frequency.months')}
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
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5" />
                    {t('form.tabs.evaluation.title')}
                  </CardTitle>
                </CardHeader>
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
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {t('form.tabs.action.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <PromptSelector
                    label={t('form.fields.sessionStructure')}
                    prompts={t('form.prompts.sessionStructure', { returnObjects: true }) as string[]}
                    value={planData.session_structure || ''}
                    onChange={(value) => updatePlanData({ session_structure: value })}
                    placeholder={t('form.fields.sessionStructurePlaceholder')}
                    rows={4}
                  />
                  
                  <PromptSelector
                    label={t('form.fields.activitySequence')}
                    prompts={t('form.prompts.activitySequence', { returnObjects: true }) as string[]}
                    value={planData.activity_sequence || ''}
                    onChange={(value) => updatePlanData({ activity_sequence: value })}
                    placeholder={t('form.fields.activitySequencePlaceholder')}
                    rows={4}
                  />
                  
                  <PromptSelector
                    label={t('form.fields.flexibility')}
                    prompts={t('form.prompts.flexibility', { returnObjects: true }) as string[]}
                    value={planData.flexibility_adjustments || ''}
                    onChange={(value) => updatePlanData({ flexibility_adjustments: value })}
                    placeholder={t('form.fields.flexibilityPlaceholder')}
                    rows={3}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* 10. Re-evaluation and Evolution */}
            <TabsContent value="re-evaluation" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5" />
                    {t('form.tabs.reevaluation.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>{t('form.fields.reevaluationFrequency')}</Label>
                    <Select 
                      value={planData.reevaluation_frequency || 'monthly'} 
                      onValueChange={(value) => updatePlanData({ reevaluation_frequency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="biweekly">{t('form.reevaluationOptions.biweekly')}</SelectItem>
                        <SelectItem value="monthly">{t('form.reevaluationOptions.monthly')}</SelectItem>
                        <SelectItem value="bimonthly">{t('form.reevaluationOptions.bimonthly')}</SelectItem>
                        <SelectItem value="quarterly">{t('form.reevaluationOptions.quarterly')}</SelectItem>
                        <SelectItem value="semiannual">{t('form.reevaluationOptions.semiannual')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>{t('form.fields.evolutionRecording')}</Label>
                    <Textarea
                      value={planData.evolution_recording || ''}
                      onChange={(e) => updatePlanData({ evolution_recording: e.target.value })}
                      placeholder={t('form.fields.evolutionRecordingPlaceholder')}
                      rows={4}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>{t('form.fields.necessaryAdjustments')}</Label>
                    <Textarea
                      value={planData.necessary_adjustments || ''}
                      onChange={(e) => updatePlanData({ necessary_adjustments: e.target.value })}
                      placeholder={t('form.fields.necessaryAdjustmentsPlaceholder')}
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>

        {/* Navigation Footer */}
        <div className="flex justify-between items-center mt-8 p-4 bg-muted/50 rounded-lg">
          <Button
            variant="outline"
            onClick={() => {
              const currentIndex = tabSections.findIndex(section => section.id === activeTab);
              if (currentIndex > 0) {
                setActiveTab(tabSections[currentIndex - 1].id);
              }
            }}
            disabled={tabSections.findIndex(section => section.id === activeTab) === 0}
          >
            Anterior
          </Button>
          
          <div className="text-sm text-muted-foreground">
            Seção {tabSections.findIndex(section => section.id === activeTab) + 1} de {tabSections.length}
          </div>
          
          <Button
            onClick={() => {
              const currentIndex = tabSections.findIndex(section => section.id === activeTab);
              if (currentIndex < tabSections.length - 1) {
                setActiveTab(tabSections[currentIndex + 1].id);
              }
            }}
            disabled={tabSections.findIndex(section => section.id === activeTab) === tabSections.length - 1}
          >
            Próxima
          </Button>
        </div>
      </div>
    </div>
  );
}