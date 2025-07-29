import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Music, FileText, Wand2, Download, Save, ArrowLeft, Brain, List, Eye, Edit, Trash2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MusicoterapiaReportWizard } from '@/components/musicoterapia/MusicoterapiaReportWizard';
import { MusicoterapiaPreview } from '@/components/musicoterapia/MusicoterapiaPreview';
import { useMusicoterapiaReport } from '@/hooks/useMusicoterapiaReport';
import { useReportData } from '../report/hooks/useReportData';
import { generateStaticPDF } from '@/utils/staticPDFGenerator';
import { DeleteReportDialog } from '../reports/components/DeleteReportDialog';

export default function MusicoterapiaPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('wizard');
  const [viewMode, setViewMode] = useState<'create' | 'list'>('create');
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [reports, setReports] = useState<any[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<any>(null);

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
  const [professionalId, setProfessionalId] = useState<string | null>(null);

  React.useEffect(() => {
    async function fetchProfessionalId() {
      if (userId) {
        try {
          const { data, error } = await supabase
            .from('professionals')
            .select('id')
            .eq('user_id', userId)
            .single();
          
          if (data && !error) {
            setProfessionalId(data.id);
          }
        } catch (error) {
          console.error('Erro ao buscar professional_id:', error);
        }
      }
    }
    
    fetchProfessionalId();
  }, [userId]);

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
    console.log('Iniciando salvamento do relatório...');
    console.log('Professional ID:', professionalId);
    console.log('Report Data:', reportData);
    
    if (!professionalId) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "ID do profissional não encontrado. Faça login novamente.",
      });
      return;
    }

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
      const reportPayload = {
        patient_id: reportData.selectedPatientId,
        professional_id: professionalId,
        type: 'musicoterapia' as const,
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
      };

      console.log('Payload do relatório:', reportPayload);

      const { data, error } = await supabase
        .from('reports')
        .insert(reportPayload);

      if (error) {
        console.error('Erro do Supabase:', error);
        throw error;
      }

      console.log('Relatório salvo com sucesso:', data);

      toast({
        title: "Relatório salvo!",
        description: "Relatório de musicoterapia salvo com sucesso.",
      });

      loadReports();
    } catch (error) {
      console.error('Erro ao salvar relatório:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Não foi possível salvar o relatório: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
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

  const loadReports = async () => {
    if (!professionalId) return;
    
    setIsLoadingReports(true);
    try {
      const { data, error } = await supabase
        .from('reports')
        .select(`
          id,
          type,
          created_at,
          content,
          patient:patients(name)
        `)
        .eq('professional_id', professionalId)
        .eq('type', 'musicoterapia')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os relatórios.",
      });
    } finally {
      setIsLoadingReports(false);
    }
  };

  const handleEditReport = (report: any) => {
    // Carregar dados do relatório no wizard
    updateReportData({
      selectedPatientId: report.content?.patient_info?.name || '',
      patientName: report.content?.patient_info?.name || '',
      patientAge: report.content?.patient_info?.age || '',
      patientDiagnosis: report.content?.patient_info?.diagnosis || '',
      fieldValues: report.content?.field_values || {},
      additionalObservations: report.content?.additional_observations || '',
      sessionDate: report.content?.session_date || new Date().toISOString().split('T')[0],
      professionalName: report.content?.professional_info?.name || '',
      professionalRegistry: report.content?.professional_info?.registry || '',
      professionalSpecialty: report.content?.professional_info?.specialty || '',
      signature: report.content?.signature || ''
    });
    
    setViewMode('create');
    setActiveTab('wizard');
  };

  const handleDeleteClick = (report: any) => {
    setReportToDelete(report);
    setShowDeleteDialog(true);
  };

  const handleDeleteSuccess = () => {
    loadReports();
    setShowDeleteDialog(false);
    setReportToDelete(null);
  };

  const filteredReports = reports.filter(report =>
    report.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    new Date(report.created_at).toLocaleDateString().includes(searchTerm)
  );

  useEffect(() => {
    if (professionalId) {
      loadReports();
    }
  }, [professionalId]);

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
                onClick={() => navigate('/dashboard')}
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
                variant={viewMode === 'create' ? 'default' : 'outline'}
                onClick={() => setViewMode(viewMode === 'create' ? 'list' : 'create')}
                className={viewMode === 'create' ? 
                  "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 border-0" :
                  "border-primary/30 hover:bg-primary/10"
                }
              >
                {viewMode === 'create' ? (
                  <>
                    <List className="h-4 w-4 mr-2" />
                    Ver Relatórios Salvos
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Criar Novo Relatório
                  </>
                )}
              </Button>

              {viewMode === 'create' && (
                <>
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
                </>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {viewMode === 'create' ? (
        <>
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
        </>
      ) : (
        /* Lista de Relatórios Salvos */
        <div className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <List className="h-5 w-5" />
                <span>Relatórios de Musicoterapia Salvos</span>
              </CardTitle>
              <CardDescription>
                Visualize, edite e gerencie seus relatórios salvos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por paciente ou data..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reports List */}
          {isLoadingReports ? (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                <span className="ml-2">Carregando relatórios...</span>
              </CardContent>
            </Card>
          ) : filteredReports.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {searchTerm ? 'Nenhum relatório encontrado' : 'Nenhum relatório salvo'}
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm 
                    ? 'Tente ajustar os filtros de busca.'
                    : 'Comece criando seu primeiro relatório de musicoterapia.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredReports.map((report) => (
                <Card key={report.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Music className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold">
                            {report.patient?.name || 'Paciente não identificado'}
                          </h3>
                          <Badge variant="secondary">Musicoterapia</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Criado em {new Date(report.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedReport(report);
                            setShowViewDialog(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditReport(report)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(report)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Excluir
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

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

      {/* Dialogs */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Visualizar Relatório de Musicoterapia</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <MusicoterapiaPreview 
              reportData={{
                templateId: selectedReport.content?.template_id || 'musicoterapia-tea',
                patientName: selectedReport.content?.patient_info?.name || '',
                patientAge: selectedReport.content?.patient_info?.age || '',
                patientDiagnosis: selectedReport.content?.patient_info?.diagnosis || '',
                fieldValues: selectedReport.content?.field_values || {},
                additionalObservations: selectedReport.content?.additional_observations || '',
                sessionDate: selectedReport.content?.session_date || '',
                professionalName: selectedReport.content?.professional_info?.name || '',
                professionalRegistry: selectedReport.content?.professional_info?.registry || '',
                professionalSpecialty: selectedReport.content?.professional_info?.specialty || '',
                signature: selectedReport.content?.signature || ''
              }}
              professionalData={professionalData}
            />
          )}
        </DialogContent>
      </Dialog>

      {reportToDelete && (
        <DeleteReportDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          reportId={reportToDelete.id}
          reportType="Musicoterapia"
          patientName={reportToDelete.patient?.name || 'Paciente não identificado'}
          onDeleteSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
}