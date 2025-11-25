import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Heart, Save, FileDown, History, Eye, Sparkles } from "lucide-react";
import { devolutivaPhrases } from "@/data/devolutivaPhrases";
import { PhraseSelector } from "@/components/devolutiva/PhraseSelector";
import { DevolutivaPreview } from "@/components/devolutiva/DevolutivaPreview";
import { DevolutivaHistory } from "@/components/devolutiva/DevolutivaHistory";
import { PDFPreviewModal } from "@/components/devolutiva/PDFPreviewModal";
import { useDevolutivaReport, DevolutivaFormData } from "@/hooks/useDevolutivaReport";
import { PatientSelect } from "@/pages/anamnesis/components/PatientSelect";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function DevolutivaTea() {
  const { toast } = useToast();
  const { 
    saveReport, 
    generatePDF,
    generateAIPDF,
    previewPDF,
    clearPreview,
    isSaving, 
    isGeneratingPDF,
    isGeneratingAIText,
    isGeneratingPreview,
    pdfPreviewUrl,
    customTexts, 
    setCustomTexts 
  } = useDevolutivaReport();
  
  const [activeTab, setActiveTab] = useState("form");
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);
  const [professionalData, setProfessionalData] = useState<any>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  
  const [formData, setFormData] = useState<DevolutivaFormData>({
    patient_id: '',
    patient_name: '',
    session_date: new Date().toISOString().split('T')[0],
    session_number: 1,
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
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as informações.",
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
        title: "Paciente não selecionado",
        description: "Por favor, selecione um paciente.",
        variant: "destructive"
      });
      return;
    }

    if (!professionalData?.id) {
      toast({
        title: "Erro",
        description: "Dados do profissional não encontrados.",
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
        title: "Paciente não selecionado",
        description: "Por favor, selecione um paciente.",
        variant: "destructive"
      });
      return;
    }
    generatePDF(formData);
  };

  const handlePreview = async () => {
    if (!formData.patient_id) {
      toast({
        title: "Paciente não selecionado",
        description: "Por favor, selecione um paciente.",
        variant: "destructive"
      });
      return;
    }
    const url = await previewPDF(formData);
    if (url) {
      setShowPreviewModal(true);
    }
  };

  const handleClosePreview = () => {
    setShowPreviewModal(false);
    clearPreview();
  };

  const handleDownloadFromPreview = async () => {
    setShowPreviewModal(false);
    await generatePDF(formData);
    clearPreview();
  };

  const handleGenerateAIPDF = () => {
    if (!formData.patient_id) {
      toast({
        title: "Paciente não selecionado",
        description: "Por favor, selecione um paciente.",
        variant: "destructive"
      });
      return;
    }

    // Verificar se há frases selecionadas
    const totalPhrases = [
      ...formData.communication,
      ...formData.emotional_regulation,
      ...formData.motor_development,
      ...formData.sensory_aspects,
      ...formData.musical_participation,
      ...formData.achievements,
      ...formData.challenges_resistance
    ].length;

    if (totalPhrases === 0) {
      toast({
        title: "Nenhuma observação selecionada",
        description: "Por favor, selecione algumas frases nas categorias antes de gerar o relatório com IA.",
        variant: "destructive"
      });
      return;
    }

    generateAIPDF(formData);
  };

  const getPreviewData = () => {
    return {
      patient_name: formData.patient_name,
      session_date: formData.session_date,
      session_number: formData.session_number,
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
        <Card className="mb-8 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-2">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl shadow-lg">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Devolutiva Musicoterapia TEA
                </h1>
                <p className="text-gray-800 dark:text-gray-100 font-medium">
                  Relatório simplificado para famílias de pacientes com TEA
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="form">📝 Formulário</TabsTrigger>
            <TabsTrigger value="preview">👁️ Preview</TabsTrigger>
            <TabsTrigger value="history">📚 Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="space-y-6 mt-6">
            <Card>
              <CardContent className="pt-6 space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Paciente *</Label>
                    <PatientSelect
                      patients={patients}
                      selectedPatient={formData.patient_id}
                      onSelect={handlePatientSelect}
                      isLoading={isLoadingPatients}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Data da Sessão *</Label>
                    <Input
                      type="date"
                      value={formData.session_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, session_date: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Número da Sessão</Label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.session_number}
                      onChange={(e) => setFormData(prev => ({ ...prev, session_number: parseInt(e.target.value) || 1 }))}
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
              <div className="flex gap-4 justify-end flex-wrap">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("form")}
                >
                  Voltar ao Formulário
                </Button>
                <Button
                  onClick={handleGenerateAIPDF}
                  disabled={isGeneratingAIText}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                >
                  {isGeneratingAIText ? (
                    <>
                      <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Gerando PDF...
                    </>
                  ) : (
                    <>
                      <FileDown className="h-4 w-4 mr-2" />
                      Baixar PDF
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <DevolutivaHistory />
          </TabsContent>
        </Tabs>

        <PDFPreviewModal
          open={showPreviewModal}
          onOpenChange={handleClosePreview}
          pdfUrl={pdfPreviewUrl}
          onDownload={handleDownloadFromPreview}
          isDownloading={isGeneratingPDF}
        />
      </div>
    </div>
  );
}
