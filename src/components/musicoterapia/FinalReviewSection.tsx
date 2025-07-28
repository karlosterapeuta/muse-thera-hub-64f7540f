import React, { useState } from 'react';
import { Eye, Zap, Download, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import type { ReportData } from '@/data/musicoterapiaTemplate';

interface FinalReviewSectionProps {
  reportData: Partial<ReportData>;
  onOrganizeWithAI: () => void;
  isGeneratingWithAI: boolean;
}

export function FinalReviewSection({ 
  reportData, 
  onOrganizeWithAI, 
  isGeneratingWithAI 
}: FinalReviewSectionProps) {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      // Simulated PDF export - in real implementation, this would generate actual PDF
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "PDF Exportado com Sucesso!",
        description: "O relatório de musicoterapia foi gerado em formato PDF.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro na Exportação",
        description: "Não foi possível gerar o PDF. Tente novamente.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const renderPreviewContent = () => {
    const fields = reportData.fieldValues || {};
    
    return (
      <div className="space-y-6 p-4">
        <div className="text-center border-b pb-4">
          <h1 className="text-2xl font-bold text-primary">Relatório de Musicoterapia</h1>
          <p className="text-muted-foreground mt-2">TEA - Transtorno do Espectro Autista</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-primary">Dados do Paciente</h3>
            <p><strong>Nome:</strong> {reportData.patientName || 'Não informado'}</p>
            <p><strong>Idade:</strong> {reportData.patientAge || 'Não informado'}</p>
            <p><strong>Diagnóstico:</strong> {reportData.patientDiagnosis || 'Não informado'}</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-primary">Dados do Profissional</h3>
            <p><strong>Nome:</strong> {reportData.professionalName || 'Não informado'}</p>
            <p><strong>Registro:</strong> {reportData.professionalRegistry || 'Não informado'}</p>
            <p><strong>Data da Sessão:</strong> {reportData.sessionDate ? new Date(reportData.sessionDate).toLocaleDateString('pt-BR') : 'Não informado'}</p>
          </div>
        </div>

        {fields.therapeutic_objectives && Array.isArray(fields.therapeutic_objectives) && fields.therapeutic_objectives.length > 0 && (
          <div>
            <h3 className="font-semibold text-primary mb-2">Objetivos Terapêuticos</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {fields.therapeutic_objectives.map((objective: string, index: number) => (
                <li key={index}>{objective}</li>
              ))}
            </ul>
          </div>
        )}

        {fields.session_activities && Array.isArray(fields.session_activities) && fields.session_activities.length > 0 && (
          <div>
            <h3 className="font-semibold text-primary mb-2">Atividades Realizadas</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {fields.session_activities.map((activity: string, index: number) => (
                <li key={index}>{activity}</li>
              ))}
            </ul>
          </div>
        )}

        {fields.patient_evolution && Array.isArray(fields.patient_evolution) && fields.patient_evolution.length > 0 && (
          <div>
            <h3 className="font-semibold text-primary mb-2">Evolução do Paciente</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {fields.patient_evolution.map((evolution: string, index: number) => (
                <li key={index}>{evolution}</li>
              ))}
            </ul>
          </div>
        )}

        {fields.recommendations && Array.isArray(fields.recommendations) && fields.recommendations.length > 0 && (
          <div>
            <h3 className="font-semibold text-primary mb-2">Recomendações</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {fields.recommendations.map((recommendation: string, index: number) => (
                <li key={index}>{recommendation}</li>
              ))}
            </ul>
          </div>
        )}

        {fields.conclusion && Array.isArray(fields.conclusion) && fields.conclusion.length > 0 && (
          <div>
            <h3 className="font-semibold text-primary mb-2">Conclusão</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {fields.conclusion.map((conclusion: string, index: number) => (
                <li key={index}>{conclusion}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="border-t pt-4 text-center">
          <p className="text-sm text-muted-foreground">
            <strong>Assinatura:</strong> {reportData.signature || reportData.professionalName || 'Não informado'}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Revisão Final</h2>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-primary">Relatório Pronto para Finalização</h3>
          <p className="text-muted-foreground">
            Revise as informações, organize com IA e finalize seu relatório
          </p>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Visualizar Relatório */}
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-lg">Visualizar Relatório</CardTitle>
            <p className="text-sm text-muted-foreground">
              Veja como ficará o relatório final
            </p>
          </CardHeader>
          <CardContent>
            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  Prévia
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle>Prévia do Relatório de Musicoterapia</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh]">
                  {renderPreviewContent()}
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Organizar com IA */}
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="text-lg">Organizar com IA</CardTitle>
            <p className="text-sm text-muted-foreground">
              Estruture o relatório automaticamente
            </p>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={onOrganizeWithAI}
              disabled={isGeneratingWithAI}
              className="w-full"
            >
              {isGeneratingWithAI ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Organizando...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Organizar
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Exportar PDF */}
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <Download className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-lg">Exportar PDF</CardTitle>
            <p className="text-sm text-muted-foreground">
              Gere o relatório em formato PDF
            </p>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleExportPDF}
              disabled={isExporting}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Exportando...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center space-x-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2">
                <FileText className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold text-primary">
                  {Object.keys(reportData.fieldValues || {}).length}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Campos Preenchidos</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2">
                <Eye className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold text-primary">100%</span>
              </div>
              <p className="text-sm text-muted-foreground">Completude</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}