import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Heart, Save, FileDown, History } from "lucide-react";
import { useDevolutivaPhrases } from "@/hooks/useDevolutivaPhrases";
import { PhraseSelector } from "@/components/devolutiva/PhraseSelector";
import { DevolutivaPreview } from "@/components/devolutiva/DevolutivaPreview";
import { DevolutivaHistory } from "@/components/devolutiva/DevolutivaHistory";
import { useDevolutivaReport, DevolutivaFormData } from "@/hooks/useDevolutivaReport";
import { PatientSelect } from "@/pages/anamnesis/components/PatientSelect";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function DevolutivaTea() {
  const { t } = useTranslation('clinical');
  const { toast } = useToast();
  const { saveReport, generatePDF, isSaving, isGeneratingPDF, customTexts, setCustomTexts } = useDevolutivaReport();
  const devolutivaPhrases = useDevolutivaPhrases();
  
  const [activeTab, setActiveTab] = useState("form");
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);
  const [professionalData, setProfessionalData] = useState<any>(null);
  
  const [formData, setFormData] = useState<DevolutivaFormData>({
    patient_id: '',
    patient_name: '',
    session_date: new Date().toISOString().split('T')[0],
    session_number: 1,
    arrival_state: [],
    communication: [],
    emotional_regulation: [],
    motor_development: [],
    sensory_aspects: [],
    musical_participation: [],
    achievements: [],
    family_guidelines: [],
    next_steps: [],
    general_observations: [],
    challenges_resistance: [],
    professional_name: '',
    professional_registry: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: professional } = await supabase
        .from('professionals')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (professional) {
        setProfessionalData(professional);
        setFormData(prev => ({
          ...prev,
          professional_name: professional.name || '',
          professional_registry: professional.register || professional.license_number || ''
        }));

        const { data: patientsData } = await supabase
          .from('patients')
          .select('*')
          .eq('professional_id', user.id)
          .order('name');

        setPatients(patientsData || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: t('devolutiva.toast.loadError'),
        description: t('devolutiva.toast.error'),
        variant: "destructive"
      });
    } finally {
      setIsLoadingPatients(false);
    }
  };

  const handlePatientSelect = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      setFormData(prev => ({
        ...prev,
        patient_id: patientId,
        patient_name: patient.name
      }));
    }
  };

  const updatePhrases = (field: keyof DevolutivaFormData, phrases: string[]) => {
    setFormData(prev => ({ ...prev, [field]: phrases }));
  };

  const updateCustomText = (field: string, text: string) => {
    setCustomTexts(prev => ({ ...prev, [field]: text }));
  };

  const handleSave = async () => {
    if (!formData.patient_id) {
      toast({
        title: t('devolutiva.messages.noPatientSelected'),
        description: t('devolutiva.toast.selectPatient'),
        variant: "destructive"
      });
      return;
    }

    if (!professionalData?.id) {
      toast({
        title: t('devolutiva.toast.error'),
        description: t('devolutiva.toast.loadError'),
        variant: "destructive"
      });
      return;
    }

    const success = await saveReport(formData, professionalData.id);
    if (success) {
      setActiveTab("history");
    }
  };

  const handleGeneratePDF = () => {
    if (!formData.patient_id) {
      toast({
        title: t('devolutiva.messages.noPatientSelected'),
        description: t('devolutiva.toast.selectPatient'),
        variant: "destructive"
      });
      return;
    }
    generatePDF(formData);
  };

  const getPreviewData = () => {
    return {
      patient_name: formData.patient_name,
      session_date: formData.session_date,
      session_number: formData.session_number,
      arrival_state: customTexts.arrival_state || formData.arrival_state.join('. ') + (formData.arrival_state.length > 0 ? '.' : ''),
      communication: customTexts.communication || formData.communication.join('. ') + (formData.communication.length > 0 ? '.' : ''),
      emotional_regulation: customTexts.emotional_regulation || formData.emotional_regulation.join('. ') + (formData.emotional_regulation.length > 0 ? '.' : ''),
      motor_development: customTexts.motor_development || formData.motor_development.join('. ') + (formData.motor_development.length > 0 ? '.' : ''),
      sensory_aspects: customTexts.sensory_aspects || formData.sensory_aspects.join('. ') + (formData.sensory_aspects.length > 0 ? '.' : ''),
      musical_participation: customTexts.musical_participation || formData.musical_participation.join('. ') + (formData.musical_participation.length > 0 ? '.' : ''),
      achievements: customTexts.achievements || formData.achievements.join('. ') + (formData.achievements.length > 0 ? '.' : ''),
      family_guidelines: customTexts.family_guidelines || formData.family_guidelines.join('. ') + (formData.family_guidelines.length > 0 ? '.' : ''),
      next_steps: customTexts.next_steps || formData.next_steps.join('. ') + (formData.next_steps.length > 0 ? '.' : ''),
      general_observations: customTexts.general_observations || formData.general_observations.join('. ') + (formData.general_observations.length > 0 ? '.' : ''),
      challenges_resistance: customTexts.challenges_resistance || formData.challenges_resistance.join('. ') + (formData.challenges_resistance.length > 0 ? '.' : ''),
      professional_name: formData.professional_name,
      professional_registry: formData.professional_registry
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl shadow-lg">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {t('devolutiva.title')}
            </h1>
            <p className="text-muted-foreground">
              {t('devolutiva.description')}
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="form">📝 {t('devolutiva.tabs.form')}</TabsTrigger>
            <TabsTrigger value="preview">👁️ {t('devolutiva.tabs.preview')}</TabsTrigger>
            <TabsTrigger value="history">📚 {t('devolutiva.tabs.history')}</TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="space-y-6 mt-6">
            <Card>
              <CardContent className="pt-6 space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>{t('devolutiva.fields.patient')} *</Label>
                    <PatientSelect
                      patients={patients}
                      selectedPatient={formData.patient_id}
                      onSelect={handlePatientSelect}
                      isLoading={isLoadingPatients}
                      emptyMessage={t('devolutiva.fields.selectPatient')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('devolutiva.fields.sessionDate')}</Label>
                    <Input
                      type="date"
                      value={formData.session_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, session_date: e.target.value }))}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('devolutiva.fields.sessionNumber')}</Label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.session_number}
                      onChange={(e) => setFormData(prev => ({ ...prev, session_number: parseInt(e.target.value) || 1 }))}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('devolutiva.fields.professionalName')}</Label>
                    <Input
                      value={formData.professional_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, professional_name: e.target.value }))}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('devolutiva.fields.professionalRegistry')}</Label>
                    <Input
                      value={formData.professional_registry}
                      onChange={(e) => setFormData(prev => ({ ...prev, professional_registry: e.target.value }))}
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {devolutivaPhrases.map((category) => (
                <PhraseSelector
                  key={category.id}
                  title={category.title}
                  icon={category.icon}
                  phrases={category.phrases}
                  selectedPhrases={formData[category.id as keyof DevolutivaFormData] as string[]}
                  onPhrasesChange={(phrases) => updatePhrases(category.id as keyof DevolutivaFormData, phrases)}
                  customText={customTexts[category.id] || ''}
                  onCustomTextChange={(text) => updateCustomText(category.id, text)}
                />
              ))}
            </div>

            <div className="flex gap-4 justify-end">
              <Button
                variant="outline"
                onClick={() => setActiveTab("preview")}
              >
                Visualizar Preview
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Salvando...' : 'Salvar Devolutiva'}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="mt-6">
            <div className="space-y-4">
              <DevolutivaPreview data={getPreviewData()} />
              <div className="flex gap-4 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("form")}
                >
                  Voltar ao Formulário
                </Button>
                <Button
                  onClick={handleGeneratePDF}
                  disabled={isGeneratingPDF}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  {isGeneratingPDF ? 'Gerando...' : 'Baixar PDF'}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <DevolutivaHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
