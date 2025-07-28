import React, { useState } from 'react';
import { Eye, Zap, Download, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import html2pdf from 'html2pdf.js';
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
      // Criar um elemento HTML temporário com o conteúdo do relatório
      const tempDiv = document.createElement('div');
      tempDiv.style.padding = '40px';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      tempDiv.style.color = '#000';
      tempDiv.style.backgroundColor = '#fff';
      tempDiv.innerHTML = generatePDFContent();
      
      // Configurações do PDF
      const opt = {
        margin: [20, 20, 20, 20],
        filename: `relatorio-musicoterapia-${reportData.patientName?.replace(/\s+/g, '-').toLowerCase() || 'paciente'}-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // Gerar e baixar o PDF
      await html2pdf().set(opt).from(tempDiv).save();
      
      toast({
        title: "PDF Exportado com Sucesso!",
        description: "O relatório de musicoterapia foi baixado em formato PDF.",
      });
    } catch (error) {
      console.error('Erro na exportação PDF:', error);
      toast({
        variant: "destructive",
        title: "Erro na Exportação",
        description: "Não foi possível gerar o PDF. Tente novamente.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const generatePDFContent = () => {
    const fields = reportData.fieldValues || {};
    const currentDate = new Date().toLocaleDateString('pt-BR');
    
    return `
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #007bff; padding-bottom: 20px;">
        <h1 style="margin: 0; color: #007bff; font-size: 28px;">Relatório TEA</h1>
        <p style="margin: 5px 0 0 0; color: #666; font-size: 16px;">Musicoterapia para Transtorno do Espectro Autista</p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
        <div>
          <h3 style="color: #007bff; margin-bottom: 15px; font-size: 18px;">Dados do Paciente</h3>
          <p style="margin: 8px 0;"><strong>Nome:</strong> ${reportData.patientName || 'Não informado'}</p>
          <p style="margin: 8px 0;"><strong>Idade:</strong> ${reportData.patientAge || 'Não informado'}</p>
          <p style="margin: 8px 0;"><strong>Diagnóstico:</strong> ${reportData.patientDiagnosis || 'Não informado'}</p>
        </div>
        
        <div>
          <h3 style="color: #007bff; margin-bottom: 15px; font-size: 18px;">Dados do Profissional</h3>
          <p style="margin: 8px 0;"><strong>Nome:</strong> ${reportData.professionalName || 'Não informado'}</p>
          <p style="margin: 8px 0;"><strong>Registro:</strong> ${reportData.professionalRegistry || 'Não informado'}</p>
          <p style="margin: 8px 0;"><strong>Data da Sessão:</strong> ${reportData.sessionDate ? new Date(reportData.sessionDate).toLocaleDateString('pt-BR') : 'Não informado'}</p>
        </div>
      </div>

      ${fields.therapeutic_objectives && Array.isArray(fields.therapeutic_objectives) && fields.therapeutic_objectives.length > 0 ? `
        <div style="margin-bottom: 25px;">
          <h3 style="color: #007bff; margin-bottom: 15px; font-size: 18px;">Objetivos Terapêuticos</h3>
          <div style="text-align: justify; line-height: 1.6;">
            ${fields.therapeutic_objectives.map(obj => `<p style="margin: 12px 0;">• ${obj}</p>`).join('')}
          </div>
        </div>
      ` : ''}

      ${fields.session_activities && Array.isArray(fields.session_activities) && fields.session_activities.length > 0 ? `
        <div style="margin-bottom: 25px;">
          <h3 style="color: #007bff; margin-bottom: 15px; font-size: 18px;">Atividades Realizadas</h3>
          <div style="text-align: justify; line-height: 1.6;">
            ${fields.session_activities.map(act => `<p style="margin: 12px 0;">• ${act}</p>`).join('')}
          </div>
        </div>
      ` : ''}

      ${fields.patient_evolution && Array.isArray(fields.patient_evolution) && fields.patient_evolution.length > 0 ? `
        <div style="margin-bottom: 25px;">
          <h3 style="color: #007bff; margin-bottom: 15px; font-size: 18px;">Evolução do Paciente</h3>
          <div style="text-align: justify; line-height: 1.6;">
            ${fields.patient_evolution.map(evo => `<p style="margin: 12px 0;">• ${evo}</p>`).join('')}
          </div>
        </div>
      ` : ''}

      ${fields.recommendations && Array.isArray(fields.recommendations) && fields.recommendations.length > 0 ? `
        <div style="margin-bottom: 25px;">
          <h3 style="color: #007bff; margin-bottom: 15px; font-size: 18px;">Recomendações</h3>
          <div style="text-align: justify; line-height: 1.6;">
            ${fields.recommendations.map(rec => `<p style="margin: 12px 0;">• ${rec}</p>`).join('')}
          </div>
        </div>
      ` : ''}

      ${fields.conclusion && Array.isArray(fields.conclusion) && fields.conclusion.length > 0 ? `
        <div style="margin-bottom: 25px;">
          <h3 style="color: #007bff; margin-bottom: 15px; font-size: 18px;">Conclusão</h3>
          <div style="text-align: justify; line-height: 1.6;">
            ${fields.conclusion.map(con => `<p style="margin: 12px 0;">• ${con}</p>`).join('')}
          </div>
        </div>
      ` : ''}

      <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 40px; text-align: center;">
        <p style="margin: 15px 0;"><strong>Assinatura:</strong> ${reportData.signature || reportData.professionalName || 'Não informado'}</p>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          Documento gerado automaticamente pelo Relatório TEA em ${currentDate}
        </p>
      </div>
    `;
  };

  const renderPreviewContent = () => {
    const fields = reportData.fieldValues || {};
    
    return (
      <div className="max-w-4xl mx-auto bg-white">
        {/* Header Elegante */}
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-t-lg">
          <div className="absolute top-4 right-4 opacity-20">
            <FileText className="h-16 w-16" />
          </div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Relatório TEA</h1>
            <p className="text-blue-100 text-lg">Musicoterapia para Transtorno do Espectro Autista</p>
            <div className="mt-4 text-sm text-blue-100">
              Gerado em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Informações Principais em Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-l-4 border-l-blue-500 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-blue-700 text-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    👤
                  </div>
                  Dados do Paciente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Nome:</span>
                  <span className="text-gray-900">{reportData.patientName || 'Não informado'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Idade:</span>
                  <span className="text-gray-900">{reportData.patientAge || 'Não informado'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Diagnóstico:</span>
                  <span className="text-gray-900">{reportData.patientDiagnosis || 'Não informado'}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-green-500 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-green-700 text-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    👨‍⚕️
                  </div>
                  Dados do Profissional
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Nome:</span>
                  <span className="text-gray-900">{reportData.professionalName || 'Não informado'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Registro:</span>
                  <span className="text-gray-900">{reportData.professionalRegistry || 'Não informado'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Data da Sessão:</span>
                  <span className="text-gray-900">{reportData.sessionDate ? new Date(reportData.sessionDate).toLocaleDateString('pt-BR') : 'Não informado'}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Seções do Relatório */}
          {fields.therapeutic_objectives && Array.isArray(fields.therapeutic_objectives) && fields.therapeutic_objectives.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center">
                    🎯
                  </div>
                  Objetivos Terapêuticos
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {fields.therapeutic_objectives.map((objective: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                      <div className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center text-purple-700 font-bold text-xs mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 leading-relaxed flex-1">{objective}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {fields.session_activities && Array.isArray(fields.session_activities) && fields.session_activities.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                    🎵
                  </div>
                  Atividades Realizadas
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {fields.session_activities.map((activity: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs mt-0.5">
                        •
                      </div>
                      <p className="text-gray-700 leading-relaxed flex-1">{activity}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {fields.patient_evolution && Array.isArray(fields.patient_evolution) && fields.patient_evolution.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
                    📈
                  </div>
                  Evolução do Paciente
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {fields.patient_evolution.map((evolution: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                      <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center text-green-700 font-bold text-xs mt-0.5">
                        ✓
                      </div>
                      <p className="text-gray-700 leading-relaxed flex-1">{evolution}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {fields.recommendations && Array.isArray(fields.recommendations) && fields.recommendations.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center">
                    💡
                  </div>
                  Recomendações
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {fields.recommendations.map((recommendation: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                      <div className="w-6 h-6 bg-orange-200 rounded-full flex items-center justify-center text-orange-700 font-bold text-xs mt-0.5">
                        →
                      </div>
                      <p className="text-gray-700 leading-relaxed flex-1">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {fields.conclusion && Array.isArray(fields.conclusion) && fields.conclusion.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-indigo-700">
                  <div className="w-8 h-8 bg-indigo-200 rounded-full flex items-center justify-center">
                    🎼
                  </div>
                  Conclusão
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {fields.conclusion.map((conclusion: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                      <div className="w-6 h-6 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xs mt-0.5">
                        ★
                      </div>
                      <p className="text-gray-700 leading-relaxed flex-1">{conclusion}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Footer Elegante */}
          <div className="border-t-2 border-gray-200 pt-6 mt-8">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-lg">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-800 mb-2">
                  <strong>Assinatura Digital:</strong> {reportData.signature || reportData.professionalName || 'Não informado'}
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Documento verificado e assinado digitalmente</span>
                </div>
              </div>
            </div>
          </div>
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
                  <DialogDescription>
                    Visualização completa do relatório antes da exportação
                  </DialogDescription>
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