
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, Download, Save, Trash2, Eye, RefreshCw, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { useEvolutionReport } from "@/hooks/useEvolutionReport";
import { evolutionSections } from "@/data/evolutionTemplate";
import { evolutionOptions } from "@/data/evolutionOptions";
import { EvolutionReportPreview } from "@/components/EvolutionReportPreview";
import { supabase } from "@/integrations/supabase/client";
import { generateStaticPDF } from "@/utils/staticPDFGenerator";
import { useProfessionalData } from "@/hooks/useProfessionalData";

export default function EvolutionReport() {
  const {
    formData,
    selectedPatient,
    setSelectedPatient,
    isLoading,
    isSaving,
    isOrganizingWithAI,
    updateField,
    selectOption,
    clearField,
    organizeWithAI,
    saveReport,
    resetForm
  } = useEvolutionReport();

  const { data: professionalData } = useProfessionalData();
  
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);
  const [activeTab, setActiveTab] = useState("form");

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
      toast.error("Erro ao carregar pacientes");
    } finally {
      setIsLoadingPatients(false);
    }
  };

  const handleSave = async () => {
    const success = await saveReport();
    if (success) {
      setActiveTab("preview");
    }
  };

  const generatePDF = async () => {
    if (!selectedPatient) {
      toast.error("Selecione um paciente para gerar o PDF");
      return;
    }

    try {
      const component = React.createElement(EvolutionReportPreview, {
        data: formData,
        professionalName: professionalData?.name || "Nome do Profissional",
        professionalRegister: professionalData?.register || "CRM/XXXX"
      });

      const filename = `Relatorio_Evolucao_MuseTera_${selectedPatient?.name?.replace(/\s+/g, '_') || 'Paciente'}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      await generateStaticPDF(component, {
        filename,
        waitTime: 3000,
        quality: 1.8
      });

      toast.success("PDF gerado com sucesso!");
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error("Erro ao gerar PDF");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg text-white">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Relatório de Evolução – MuseTera
            </h1>
            <p className="text-gray-600 mt-1">
              Documente a evolução detalhada do paciente durante a sessão de musicoterapia
            </p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="form" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Formulário
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Visualização
          </TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="space-y-6">
          {/* Patient Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Seleção do Paciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="patient">Paciente *</Label>
                  <Select 
                    value={selectedPatient?.id || ""} 
                    onValueChange={(value) => {
                      const patient = patients.find(p => p.id === value);
                      setSelectedPatient(patient);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={isLoadingPatients ? "Carregando..." : "Selecione um paciente"} />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Data da Sessão</Label>
                  <div className="p-2 bg-gray-50 rounded-md border">
                    {new Date().toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Organization Button */}
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <div className="p-2 bg-blue-600 rounded-lg text-white">
                  <RefreshCw className="h-4 w-4" />
                </div>
                Organização Inteligente
              </CardTitle>
              <p className="text-blue-700 text-sm">
                Use inteligência artificial para estruturar automaticamente seu relatório de evolução
              </p>
            </CardHeader>
            <CardContent>
              <Button
                onClick={organizeWithAI}
                disabled={isOrganizingWithAI || !selectedPatient}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                {isOrganizingWithAI ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                {isOrganizingWithAI ? 'Organizando com IA...' : 'Organizar com IA'}
              </Button>
              <p className="text-xs text-gray-600 mt-2">
                {!selectedPatient 
                  ? "Selecione um paciente para usar a organização com IA" 
                  : "A IA estruturará automaticamente o relatório baseado nos dados preenchidos"
                }
              </p>
            </CardContent>
          </Card>

          {/* Form Fields */}
          <div className="grid gap-6">
            {evolutionSections.map((section, index) => (
              <Card key={section.key}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Badge variant="outline">{index + 1}</Badge>
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Quick Options */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Opções Rápidas:
                    </Label>
                    <div className="grid grid-cols-1 gap-2">
                      {evolutionOptions[section.key as keyof typeof evolutionOptions]?.map((option, optionIndex) => (
                        <Button
                          key={optionIndex}
                          variant="outline"
                          size="sm"
                          className="justify-start text-left h-auto p-3 whitespace-normal"
                          onClick={() => selectOption(section.key as any, option)}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Text Area */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label htmlFor={section.key}>Texto Personalizado:</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => clearField(section.key as any)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Limpar
                      </Button>
                    </div>
                    <Textarea
                      id={section.key}
                      placeholder={section.placeholder}
                      value={formData[section.key as keyof typeof formData] as string || ""}
                      onChange={(e) => updateField(section.key as any, e.target.value)}
                      className="min-h-[120px] resize-y"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleSave}
                  disabled={isSaving || !selectedPatient}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Salvar Relatório
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setActiveTab("preview")}
                  disabled={!selectedPatient}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Visualizar
                </Button>

                <Button
                  variant="outline"
                  onClick={resetForm}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Limpar Formulário
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Visualização do Relatório</h2>
            <Button
              onClick={generatePDF}
              disabled={!selectedPatient}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Baixar PDF
            </Button>
          </div>

          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="max-h-[800px] overflow-y-auto border rounded-lg">
                <EvolutionReportPreview 
                  data={formData}
                  professionalName={professionalData?.name}
                  professionalRegister={professionalData?.register}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
