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
import { MusicotherapyTreatmentPlanPDF } from '@/components/MusicotherapyTreatmentPlanPDF';
import { supabase } from '@/integrations/supabase/client';

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
  const { planData, updatePlanData, savePlan, isSaving, isLoading } = useMusicotherapyTreatmentPlan(id);
  
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);
  const [activeTab, setActiveTab] = useState("identification");

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
        <Label className="text-base font-medium text-gray-700">{label}</Label>
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
              <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
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
    try {
      const component = React.createElement(MusicotherapyTreatmentPlanPDF, { 
        planData: planData as MusicotherapyTreatmentPlan,
        therapistName: professionalData?.name 
      });

      const success = await generateStaticPDF(component, {
        filename: `Plano_Musicoterapeutico_${planData.patient_full_name?.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
        waitTime: 5000,
        quality: 2.0,
        format: 'a4',
        orientation: 'portrait'
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
    }
  };

  const tabSections = [
    { id: "identification", label: "1. Identificação", icon: User },
    { id: "assessment", label: "2. Avaliação", icon: FileText },
    { id: "general-objectives", label: "3. Obj. Gerais", icon: Target },
    { id: "specific-objectives", label: "4. Obj. Específicos", icon: CheckCircle },
    { id: "resources", label: "5. Recursos", icon: Music },
    { id: "strategies", label: "6. Estratégias", icon: Activity },
    { id: "frequency", label: "7. Frequência", icon: Clock },
    { id: "evaluation", label: "8. Avaliação", icon: BarChart },
    { id: "action-plan", label: "9. Plano Ação", icon: Users },
    { id: "re-evaluation", label: "10. Reavaliação", icon: RefreshCw },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-lg">Carregando plano de tratamento...</p>
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
                {id ? 'Editar' : 'Novo'} Plano Musicoterapêutico
              </h1>
              <p className="text-gray-600">
                Modelo profissional completo em 10 seções
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={() => savePlan(planData)}
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Salvando...' : 'Salvar Plano'}
            </Button>
            <Button
              onClick={handleDownloadPDF}
              variant="outline"
              disabled={!planData.patient_full_name}
            >
              <Download className="h-4 w-4 mr-2" />
              Baixar PDF
            </Button>
          </div>
        </div>

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
                    1. Identificação do Paciente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Paciente</Label>
                      {isLoadingPatients ? (
                        <div className="text-sm text-gray-500">Carregando pacientes...</div>
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
                    
                    <div className="space-y-2">
                      <Label>Diagnóstico clínico</Label>
                      <Input
                        value={planData.clinical_diagnosis || ''}
                        onChange={(e) => updatePlanData({ clinical_diagnosis: e.target.value })}
                        placeholder="Ex: TEA, TDAH, etc."
                      />
                    </div>
                    
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
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    2. Avaliação Inicial
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Histórico clínico e familiar relevante</Label>
                    <Textarea
                      value={planData.clinical_family_history || ''}
                      onChange={(e) => updatePlanData({ clinical_family_history: e.target.value })}
                      placeholder="Descreva o histórico clínico e familiar relevante..."
                      rows={4}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Condições físicas, cognitivas, emocionais e sociais</Label>
                    <Textarea
                      value={planData.physical_cognitive_conditions || ''}
                      onChange={(e) => updatePlanData({ physical_cognitive_conditions: e.target.value })}
                      placeholder="Descreva as condições atuais do paciente..."
                      rows={4}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Nível de interação e comunicação</Label>
                    <Textarea
                      value={planData.interaction_communication_level || ''}
                      onChange={(e) => updatePlanData({ interaction_communication_level: e.target.value })}
                      placeholder="Descreva como o paciente se comunica e interage..."
                      rows={3}
                    />
                  </div>
                  
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
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    3. Objetivos Gerais
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ArrayInput
                    label="Propósitos amplos da musicoterapia"
                    field="general_objectives"
                    placeholder="Ex: Promover a comunicação verbal e não verbal"
                  />
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Exemplos de objetivos gerais:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Promover a comunicação verbal e não verbal</li>
                      <li>• Favorecer a autorregulação emocional</li>
                      <li>• Estimular habilidades cognitivas (atenção, memória, concentração)</li>
                      <li>• Melhorar habilidades motoras finas e grossas</li>
                      <li>• Incentivar a socialização e interação com o outro</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 4. Specific Objectives */}
            <TabsContent value="specific-objectives" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    4. Objetivos Específicos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ArrayInput
                    label="Objetivos mensuráveis e específicos"
                    field="specific_objectives"
                    placeholder="Ex: Ampliar o tempo de atenção sustentada em atividades musicais para até 10 minutos"
                  />
                  
                  <div className="mt-6 p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Exemplos de objetivos específicos:</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• Ampliar o tempo de atenção sustentada em atividades musicais para até 10 minutos</li>
                      <li>• Favorecer a iniciação de turnos musicais em atividades rítmicas</li>
                      <li>• Desenvolver a expressão vocal através de canções dirigidas</li>
                      <li>• Estimular movimentos coordenados ao acompanhar músicas</li>
                      <li>• Incentivar a interação em grupo por meio de improvisações musicais</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 5. Musicotherapy Resources */}
            <TabsContent value="resources" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Music className="h-5 w-5" />
                    5. Recursos Musicoterapêuticos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ArrayInput
                      label="Instrumentos musicais"
                      field="musical_instruments"
                      placeholder="Ex: Violão, teclado, percussão"
                    />
                    
                    <ArrayInput
                      label="Recursos tecnológicos"
                      field="technological_resources"
                      placeholder="Ex: Aplicativos musicais, microfone"
                    />
                    
                    <ArrayInput
                      label="Voz e corpo"
                      field="voice_body_resources"
                      placeholder="Ex: Percussão corporal, canto"
                    />
                    
                    <ArrayInput
                      label="Materiais complementares"
                      field="complementary_materials"
                      placeholder="Ex: Imagens, cartões, objetos sonoros"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 6. Strategies and Techniques */}
            <TabsContent value="strategies" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    6. Estratégias e Técnicas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Improvisação musical</Label>
                    <Textarea
                      value={planData.musical_improvisation || ''}
                      onChange={(e) => updatePlanData({ musical_improvisation: e.target.value })}
                      placeholder="Interação livre ou dirigida com instrumentos..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Recriação musical</Label>
                    <Textarea
                      value={planData.musical_recreation || ''}
                      onChange={(e) => updatePlanData({ musical_recreation: e.target.value })}
                      placeholder="Cantar ou tocar músicas conhecidas..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Composição</Label>
                    <Textarea
                      value={planData.musical_composition || ''}
                      onChange={(e) => updatePlanData({ musical_composition: e.target.value })}
                      placeholder="Criar músicas, letras ou sons em conjunto..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Escuta receptiva</Label>
                    <Textarea
                      value={planData.receptive_listening || ''}
                      onChange={(e) => updatePlanData({ receptive_listening: e.target.value })}
                      placeholder="Ouvir músicas para estimular resposta emocional ou cognitiva..."
                      rows={3}
                    />
                  </div>
                  
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
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    7. Frequência e Duração
                  </CardTitle>
                </CardHeader>
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
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5" />
                    8. Critérios de Avaliação
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ArrayInput
                    label="Parâmetros observáveis para medir evolução"
                    field="evaluation_criteria_list"
                    placeholder="Ex: Aumento do tempo de engajamento na atividade"
                  />
                  
                  <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-2">Exemplos de critérios de avaliação:</h4>
                    <ul className="text-sm text-purple-800 space-y-1">
                      <li>• Aumento do tempo de engajamento na atividade</li>
                      <li>• Participação espontânea em turnos musicais</li>
                      <li>• Maior variedade de respostas vocais ou gestuais</li>
                      <li>• Redução de comportamentos desregulados durante a sessão</li>
                      <li>• Evidências de transferência das habilidades para outros contextos</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 9. Therapeutic Plan in Action */}
            <TabsContent value="action-plan" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    9. Plano Terapêutico em Ação
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Estrutura das sessões</Label>
                    <Textarea
                      value={planData.session_structure || ''}
                      onChange={(e) => updatePlanData({ session_structure: e.target.value })}
                      placeholder="Descreva a estrutura típica das sessões (início, desenvolvimento, fechamento)..."
                      rows={4}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Sequência das atividades musicais propostas</Label>
                    <Textarea
                      value={planData.activity_sequence || ''}
                      onChange={(e) => updatePlanData({ activity_sequence: e.target.value })}
                      placeholder="Descreva a ordem e progressão das atividades musicais..."
                      rows={4}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Flexibilidade para ajustes</Label>
                    <Textarea
                      value={planData.flexibility_adjustments || ''}
                      onChange={(e) => updatePlanData({ flexibility_adjustments: e.target.value })}
                      placeholder="Como o plano pode ser ajustado de acordo com as respostas do paciente..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 10. Re-evaluation and Evolution */}
            <TabsContent value="re-evaluation" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5" />
                    10. Reavaliação e Evolução
                  </CardTitle>
                </CardHeader>
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