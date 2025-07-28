import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Music, FileText, Wand2, Download, Save, ArrowLeft, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MusicoterapiaReportWizard } from '@/components/musicoterapia/MusicoterapiaReportWizard';
import { MusicoterapiaPreview } from '@/components/musicoterapia/MusicoterapiaPreview';
import { useMusicoterapiaReport } from '@/hooks/useMusicoterapiaReport';
import { useReportData } from '../report/hooks/useReportData';
import { generateStaticPDF } from '@/utils/staticPDFGenerator';

export default function MusicoterapiaPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('wizard');
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const patientIdFromQuery = searchParams.get('patient_id');
  
  const {
    reportData,
    updateReportData,
    generateWithAI,
    isGeneratingWithAI,
    validateReport,
    template,
    professionalData
  } = useMusicoterapiaReport();

  const { patients, isLoadingPatients, userId } = useReportData();

  React.useEffect(() => {
    if (patientIdFromQuery && patients.length > 0) {
      const selectedPatient = patients.find(p => p.id === patientIdFromQuery);
      if (selectedPatient) {
        // Calculate age from birth_date if available
        let age = '';
        if ((selectedPatient as any).birth_date) {
          const today = new Date();
          const birthDate = new Date((selectedPatient as any).birth_date);
          const ageYears = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age = `${ageYears - 1} anos`;
          } else {
            age = `${ageYears} anos`;
          }
        }

        updateReportData({
          selectedPatientId: patientIdFromQuery,
          patientName: selectedPatient.name,
          patientAge: age,
          patientDiagnosis: 'TEA - Transtorno do Espectro Autista'
        });
      }
    }
  }, [patientIdFromQuery, patients, updateReportData]);

  const handleSaveReport = async () => {
    const validation = validateReport();
    if (!validation.isValid) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: `Complete os campos: ${validation.missingFields.join(', ')}`,
      });
      return;
    }

    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('reports')
        .insert({
          patient_id: reportData.selectedPatientId,
          professional_id: userId,
          type: 'musicoterapia',
          content: {
            template_id: reportData.templateId,
            field_values: reportData.fieldValues,
            additional_observations: reportData.additionalObservations,
            patient_info: {
              name: reportData.patientName,
              age: reportData.patientAge,
              diagnosis: reportData.patientDiagnosis
            },
            professional_info: {
              name: reportData.professionalName,
              registry: reportData.professionalRegistry,
              specialty: reportData.professionalSpecialty
            },
            session_date: reportData.sessionDate,
            signature: reportData.signature
          }
        });

      if (error) throw error;

      toast({
        title: "Relatório salvo!",
        description: "Relatório de musicoterapia salvo com sucesso.",
      });

      navigate('/processes/reports');
    } catch (error) {
      console.error('Erro ao salvar relatório:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar o relatório.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPDF = async () => {
    const validation = validateReport();
    if (!validation.isValid) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: `Complete os campos: ${validation.missingFields.join(', ')}`,
      });
      return;
    }

    setIsExporting(true);
    try {
      const success = await generateStaticPDF(
        <MusicoterapiaPreview 
          reportData={reportData as any} 
          professionalData={professionalData} 
        />,
        {
          filename: `Relatorio_Musicoterapia_${reportData.patientName}_${new Date().toISOString().split('T')[0]}.pdf`,
          format: 'a4',
          orientation: 'portrait',
          quality: 1.0
        }
      );

      if (success) {
        toast({
          title: "PDF gerado!",
          description: "Relatório exportado em PDF com sucesso.",
        });
      }
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível gerar o PDF.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/processes/reports')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                  <Music className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl flex items-center space-x-2">
                    <span>Relatório TEA</span>
                    <Badge variant="secondary">TEA Especializado</Badge>
                  </CardTitle>
                  <CardDescription>
                    Relatórios clínicos especializados em Musicoterapia para Transtorno do Espectro Autista
                  </CardDescription>
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={handleSaveReport}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar
                  </>
                )}
              </Button>
              
              <Button
                onClick={handleExportPDF}
                disabled={isExporting}
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                    Gerando PDF...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar PDF
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Seleção de Área e Paciente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Criar Relatório Personalizado</span>
          </CardTitle>
          <CardDescription>
            Selecione sua área de atuação e o paciente para gerar um relatório técnico especializado para TEA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Área de Atuação</label>
              <Select value="musicoterapia" disabled>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a área" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="musicoterapia">Musicoterapia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Paciente</label>
              <Select 
                value={reportData.selectedPatientId || ''} 
                onValueChange={(value) => {
                  const selectedPatient = patients.find(p => p.id === value);
                  if (selectedPatient) {
                    // Calculate age from birth_date if available
                    let age = '';
                    if ((selectedPatient as any).birth_date) {
                      const today = new Date();
                      const birthDate = new Date((selectedPatient as any).birth_date);
                      const ageYears = today.getFullYear() - birthDate.getFullYear();
                      const monthDiff = today.getMonth() - birthDate.getMonth();
                      
                      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                        age = `${ageYears - 1} anos`;
                      } else {
                        age = `${ageYears} anos`;
                      }
                    }

                    updateReportData({
                      selectedPatientId: value,
                      fieldValues: {
                        ...reportData.fieldValues,
                        patient_name: selectedPatient.name,
                        patient_age: age,
                        patient_diagnosis: 'TEA - Transtorno do Espectro Autista'
                      }
                    });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Novo paciente (entrada manual)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Novo paciente (entrada manual)</SelectItem>
                  {patients.map(patient => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name} - {(patient as any).birth_date ? 
                        (() => {
                          const today = new Date();
                          const birthDate = new Date((patient as any).birth_date);
                          const ageYears = today.getFullYear() - birthDate.getFullYear();
                          const monthDiff = today.getMonth() - birthDate.getMonth();
                          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                            return `${ageYears - 1} anos`;
                          }
                          return `${ageYears} anos`;
                        })() : 'Idade não informada'
                      }
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button className="w-full" onClick={() => setActiveTab('wizard')}>
            <Wand2 className="h-4 w-4 mr-2" />
            Wizard Passo-a-Passo
          </Button>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="wizard" className="flex items-center space-x-2">
            <Wand2 className="h-4 w-4" />
            <span>Assistente de Criação</span>
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Visualização</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="wizard" className="space-y-6">
          <MusicoterapiaReportWizard
            reportData={reportData}
            onUpdateData={updateReportData}
            onGenerateWithAI={generateWithAI}
            isGeneratingWithAI={isGeneratingWithAI}
            patients={patients}
            onSaveReport={handleSaveReport}
            isSaving={isSaving}
          />
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-primary" />
                <span>Visualização do Relatório</span>
              </CardTitle>
              <CardDescription>
                Prévia do relatório de musicoterapia formatado para impressão
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MusicoterapiaPreview 
                reportData={reportData as any} 
                professionalData={professionalData} 
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer with Template Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Brain className="h-4 w-4" />
                <span>Template: {template.name}</span>
              </div>
              <div>
                Campos: {template.fields.length}
              </div>
              <div>
                Obrigatórios: {template.fields.filter(f => f.required).length}
              </div>
            </div>
            <div>
              Sistema especializado para TEA
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}