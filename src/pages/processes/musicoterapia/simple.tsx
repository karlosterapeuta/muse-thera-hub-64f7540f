import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileText, TrendingUp } from "lucide-react";
import { EvolutionReportWizard } from "@/components/musicoterapia/EvolutionReportWizard";
import { EvolutionPreview } from "@/components/musicoterapia/EvolutionPreview";
import { useEvolutionReport } from "@/hooks/useEvolutionReport";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { EvolutionMuseteraReportPDF } from "@/components/EvolutionMuseteraReportPDF";
import { useForm, FormProvider } from "react-hook-form";

export default function SimpleMusicoterapia() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("create");
  
  const {
    reportData,
    updateReportData,
    generateWithAI,
    isGeneratingWithAI,
    validateReport,
    professionalData
  } = useEvolutionReport();

  const form = useForm();

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

  const saveEvolutionReport = async () => {
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
          type: 'evolution_musicoterapia',
          patient_id: reportData.patientId,
          professional_id: professionalData?.id,
          content: reportData as any
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
          <TrendingUp className="h-4 w-4 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Relatório de Evolução – MuseTera</h1>
          <p className="text-muted-foreground">Relatório de evolução com respostas semi-prontas</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Seleção de Paciente</CardTitle>
          <CardDescription>Selecione o paciente para o relatório de evolução</CardDescription>
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
            <Form {...form}>
              <FormField
                control={form.control}
                name="patient_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paciente</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        updateReportData({ patientId: value });
                      }}
                      value={reportData.patientId}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um paciente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {patients?.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.name} {patient.age && `(${patient.age} anos)`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </Form>
          </FormProvider>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Criar Relatório de Evolução
          </TabsTrigger>
          <TabsTrigger value="preview" className="gap-2">
            <FileText className="h-4 w-4" />
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
              <FormProvider {...form}>
                <EvolutionReportWizard
                  reportData={reportData}
                  onUpdateReportData={updateReportData}
                  onGenerateWithAI={generateWithAI}
                  isGeneratingWithAI={isGeneratingWithAI}
                  control={form.control}
                />
              </FormProvider>
              
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
                {reportData.patientId && (
                  <PDFDownloadLink
                    document={
                      <EvolutionMuseteraReportPDF 
                        reportData={reportData}
                        patientName={patients?.find(p => p.id === reportData.patientId)?.name || ""}
                        patientAge={patients?.find(p => p.id === reportData.patientId)?.age}
                      />
                    }
                    fileName={`relatorio-evolucao-musetera-${patients?.find(p => p.id === reportData.patientId)?.name || 'paciente'}.pdf`}
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
                reportData={reportData}
                patientName={patients?.find(p => p.id === reportData.patientId)?.name}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}