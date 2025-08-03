import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, FileText, Users, Calendar, TrendingUp } from "lucide-react";
import { MusicoterapiaReportWizard } from "@/components/musicoterapia/MusicoterapiaReportWizard";
import { MusicoterapiaPreview } from "@/components/musicoterapia/MusicoterapiaPreview";
import { EvolutionReportWizard } from "@/components/musicoterapia/EvolutionReportWizard";
import { EvolutionPreview } from "@/components/musicoterapia/EvolutionPreview";
import { useMusicoterapiaReport } from "@/hooks/useMusicoterapiaReport";
import { useEvolutionReport } from "@/hooks/useEvolutionReport";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { MuseteraReportPDF } from "@/components/MuseteraReportPDF";
import { EvolutionMuseteraReportPDF } from "@/components/EvolutionMuseteraReportPDF";
import { useForm } from "react-hook-form";

export default function Musicoterapia() {
  const { toast } = useToast();
  const [activeReportType, setActiveReportType] = useState<"complete" | "evolution">("complete");
  
  const {
    reportData,
    updateReportData,
    generateWithAI,
    isGeneratingWithAI,
    validateReport,
    template,
    professionalData
  } = useMusicoterapiaReport();

  const {
    reportData: evolutionReportData,
    updateReportData: updateEvolutionReportData,
    generateWithAI: generateEvolutionWithAI,
    isGeneratingWithAI: isGeneratingEvolutionWithAI,
    validateReport: validateEvolutionReport,
    evolutionMuseteraTemplate,
    professionalData: evolutionProfessionalData
  } = useEvolutionReport();

  const form = useForm();
  const evolutionForm = useForm();

  // Fetch patients
  const { data: patients, isLoading: isLoadingPatients } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patients')
        .select('id, name, age, birth_date')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const saveReport = async () => {
    const validation = validateReport();
    if (!validation.isValid) {
      toast({
        variant: "destructive",
        title: "Erro de Validação",
        description: `Campos obrigatórios: ${validation.missingFields.join(", ")}`
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('reports')
        .insert({
          type: 'musicoterapia',
          patient_id: reportData.selectedPatientId,
          professional_id: professionalData?.id,
          content: reportData
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Relatório salvo com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao salvar relatório:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao salvar o relatório. Tente novamente."
      });
    }
  };

  const saveEvolutionReport = async () => {
    const validation = validateEvolutionReport();
    if (!validation.isValid) {
      toast({
        variant: "destructive",
        title: "Erro de Validação",
        description: `Campos obrigatórios: ${validation.missingFields.join(", ")}`
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('reports')
        .insert({
          type: 'evolution_musicoterapia',
          patient_id: evolutionReportData.patientId,
          professional_id: evolutionProfessionalData?.id,
          content: evolutionReportData
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Relatório de Evolução salvo com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao salvar relatório de evolução:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao salvar o relatório de evolução. Tente novamente."
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <FileText className="h-4 w-4 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Relatórios de Musicoterapia</h1>
          <p className="text-muted-foreground">Sistema especializado para relatórios de TEA</p>
        </div>
      </div>

      {/* Report Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Escolha o Tipo de Relatório</CardTitle>
          <CardDescription>Selecione o modelo de relatório que deseja criar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant={activeReportType === "complete" ? "default" : "outline"}
              onClick={() => setActiveReportType("complete")}
              className="h-20 flex flex-col gap-2"
            >
              <FileText className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Relatório Completo</div>
                <div className="text-xs text-muted-foreground">Relatório detalhado de musicoterapia</div>
              </div>
            </Button>
            
            <Button
              variant={activeReportType === "evolution" ? "default" : "outline"}
              onClick={() => setActiveReportType("evolution")}
              className="h-20 flex flex-col gap-2"
            >
              <TrendingUp className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Relatório de Evolução – MuseTera</div>
                <div className="text-xs text-muted-foreground">Relatório de evolução com respostas semi-prontas</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {activeReportType === "complete" ? (
        <Tabs defaultValue="create" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create" className="gap-2">
              <FileText className="h-4 w-4" />
              Criar Relatório
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-2">
              <Calendar className="h-4 w-4" />
              Visualizar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <MusicoterapiaReportWizard
              reportData={reportData}
              onUpdateData={updateReportData}
              onGenerateWithAI={generateWithAI}
              isGeneratingWithAI={isGeneratingWithAI}
              patients={patients || []}
              onSave={saveReport}
              professionalData={professionalData}
            />
          </TabsContent>

          <TabsContent value="preview">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Visualização do Relatório</CardTitle>
                    <CardDescription>
                      Preview do relatório que será gerado
                    </CardDescription>
                  </div>
                  {reportData.patientId && (
                    <PDFDownloadLink
                      document={
                        <MuseteraReportPDF 
                          reportData={reportData}
                          patientName={patients?.find(p => p.id === reportData.patientId)?.name || ""}
                          patientAge={patients?.find(p => p.id === reportData.patientId)?.age}
                        />
                      }
                      fileName={`relatorio-musetera-${patients?.find(p => p.id === reportData.patientId)?.name || 'paciente'}.pdf`}
                    >
                      {({ loading }) => (
                        <Button disabled={loading} className="gap-2">
                          <Download className="h-4 w-4" />
                          {loading ? "Gerando PDF..." : "Download PDF"}
                        </Button>
                      )}
                    </PDFDownloadLink>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <MusicoterapiaPreview 
                  reportData={reportData}
                  patientName={patients?.find(p => p.id === reportData.patientId)?.name}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Tabs defaultValue="create" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Criar Relatório de Evolução
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-2">
              <Calendar className="h-4 w-4" />
              Visualizar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Relatório de Evolução – MuseTera</CardTitle>
                <CardDescription>
                  Utilize as opções semi-prontas para agilizar o preenchimento do relatório
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EvolutionReportWizard
                  reportData={evolutionReportData}
                  onUpdateReportData={updateEvolutionReportData}
                  onGenerateWithAI={generateEvolutionWithAI}
                  isGeneratingWithAI={isGeneratingEvolutionWithAI}
                  control={evolutionForm.control}
                />
                
                <div className="mt-6 flex gap-4">
                  <Button onClick={saveEvolutionReport} className="gap-2">
                    <FileText className="h-4 w-4" />
                    Salvar Relatório
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Visualização do Relatório de Evolução</CardTitle>
                    <CardDescription>
                      Preview do relatório de evolução que será gerado
                    </CardDescription>
                  </div>
                  {evolutionReportData.patientId && (
                    <PDFDownloadLink
                      document={
                        <EvolutionMuseteraReportPDF 
                          reportData={evolutionReportData}
                          patientName={patients?.find(p => p.id === evolutionReportData.patientId)?.name || ""}
                          patientAge={patients?.find(p => p.id === evolutionReportData.patientId)?.age}
                        />
                      }
                      fileName={`relatorio-evolucao-musetera-${patients?.find(p => p.id === evolutionReportData.patientId)?.name || 'paciente'}.pdf`}
                    >
                      {({ loading }) => (
                        <Button disabled={loading} className="gap-2">
                          <Download className="h-4 w-4" />
                          {loading ? "Gerando PDF..." : "Download PDF"}
                        </Button>
                      )}
                    </PDFDownloadLink>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <EvolutionPreview 
                  reportData={evolutionReportData}
                  patientName={patients?.find(p => p.id === evolutionReportData.patientId)?.name}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}