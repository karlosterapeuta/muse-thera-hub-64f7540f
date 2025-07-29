import React, { useState, useRef } from 'react';
import { Eye, Zap, Download, FileText, Loader2, Upload, Image, X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import html2pdf from 'html2pdf.js';
import type { ReportData } from '@/data/musicoterapiaTemplate';

interface FinalReviewSectionProps {
  reportData: Partial<ReportData>;
  onOrganizeWithAI: () => void;
  isGeneratingWithAI: boolean;
  onSaveReport: () => void;
  isSaving: boolean;
}

export function FinalReviewSection({ 
  reportData, 
  onOrganizeWithAI, 
  isGeneratingWithAI,
  onSaveReport,
  isSaving
}: FinalReviewSectionProps) {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [stampUrl, setStampUrl] = useState<string | null>(null);
  const [isUploadingStamp, setIsUploadingStamp] = useState(false);
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [isUploadingSignature, setIsUploadingSignature] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stampInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);

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

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Tipo de arquivo inválido",
        description: "Por favor, selecione apenas arquivos de imagem (PNG, JPG, etc.)",
      });
      return;
    }

    // Validar tamanho do arquivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Arquivo muito grande",
        description: "A imagem deve ter no máximo 5MB",
      });
      return;
    }

    setIsUploadingLogo(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('report-logos')
        .upload(fileName, file);

      if (error) throw error;

      // Obter URL pública da imagem
      const { data: { publicUrl } } = supabase.storage
        .from('report-logos')
        .getPublicUrl(fileName);

      setLogoUrl(publicUrl);
      
      toast({
        title: "Logo enviada com sucesso!",
        description: "A logo será incluída no PDF gerado.",
      });
      
    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        variant: "destructive",
        title: "Erro no upload",
        description: "Não foi possível enviar a logo. Tente novamente.",
      });
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const removeLogo = () => {
    setLogoUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast({
      title: "Logo removida",
      description: "A logo foi removida do relatório.",
    });
  };

  const handleStampUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Tipo de arquivo inválido",
        description: "Por favor, selecione apenas arquivos de imagem (PNG, JPG, etc.)",
      });
      return;
    }

    // Validar tamanho do arquivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Arquivo muito grande",
        description: "A imagem deve ter no máximo 5MB",
      });
      return;
    }

    setIsUploadingStamp(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `stamp-${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('report-logos')
        .upload(fileName, file);

      if (error) throw error;

      // Obter URL pública da imagem
      const { data: { publicUrl } } = supabase.storage
        .from('report-logos')
        .getPublicUrl(fileName);

      setStampUrl(publicUrl);
      
      toast({
        title: "Carimbo enviado com sucesso!",
        description: "O carimbo será incluído no PDF gerado.",
      });
      
    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        variant: "destructive",
        title: "Erro no upload",
        description: "Não foi possível enviar o carimbo. Tente novamente.",
      });
    } finally {
      setIsUploadingStamp(false);
    }
  };

  const removeStamp = () => {
    setStampUrl(null);
    if (stampInputRef.current) {
      stampInputRef.current.value = '';
    }
    toast({
      title: "Carimbo removido",
      description: "O carimbo foi removido do relatório.",
    });
  };

  const handleSignatureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Tipo de arquivo inválido",
        description: "Por favor, selecione apenas arquivos de imagem (PNG, JPG, etc.)",
      });
      return;
    }

    // Validar tamanho do arquivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Arquivo muito grande",
        description: "A imagem deve ter no máximo 5MB",
      });
      return;
    }

    setIsUploadingSignature(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `signature-${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('digital-signatures')
        .upload(fileName, file);

      if (error) throw error;

      // Obter URL pública da imagem
      const { data: { publicUrl } } = supabase.storage
        .from('digital-signatures')
        .getPublicUrl(fileName);

      setSignatureUrl(publicUrl);
      
      toast({
        title: "Assinatura enviada com sucesso!",
        description: "A assinatura digital será incluída no PDF gerado.",
      });
      
    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        variant: "destructive",
        title: "Erro no upload",
        description: "Não foi possível enviar a assinatura. Tente novamente.",
      });
    } finally {
      setIsUploadingSignature(false);
    }
  };

  const removeSignature = () => {
    setSignatureUrl(null);
    if (signatureInputRef.current) {
      signatureInputRef.current.value = '';
    }
    toast({
      title: "Assinatura removida",
      description: "A assinatura digital foi removida do relatório.",
    });
  };

  const generatePDFContent = () => {
    const fields = reportData.fieldValues || {};
    const currentDate = new Date().toLocaleDateString('pt-BR');
    
    return `
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #007bff; padding-bottom: 20px;">
        ${logoUrl ? `<img src="${logoUrl}" style="max-width: 150px; max-height: 80px; margin-bottom: 15px; display: block; margin-left: auto; margin-right: auto;" alt="Logo" />` : ''}
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
        
        ${signatureUrl || stampUrl ? `
          <div style="display: flex; justify-content: center; align-items: center; gap: 30px; margin: 30px 0; flex-wrap: wrap;">
            ${signatureUrl ? `
              <div style="text-align: center;">
                <img src="${signatureUrl}" style="max-width: 200px; max-height: 80px; display: block; margin: 0 auto;" alt="Assinatura Digital" />
                <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">Assinatura Digital</p>
              </div>
            ` : ''}
            ${stampUrl ? `
              <div style="text-align: center;">
                <img src="${stampUrl}" style="max-width: 120px; max-height: 60px; display: block; margin: 0 auto;" alt="Carimbo Digital" />
                <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">Carimbo Digital</p>
              </div>
            ` : ''}
          </div>
        ` : ''}
        
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
      {/* Hero Header - Responsivo */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-xl md:rounded-2xl shadow-xl">
        <div className="absolute inset-0 bg-white/10">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
        </div>
        
        <div className="relative p-4 md:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-4 md:mb-6">
            <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg">
              <FileText className="h-6 w-6 md:h-8 md:w-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 md:mb-2">
                Revisão Final
              </h1>
              <p className="text-sm md:text-base lg:text-lg text-white/90">
                Personalize, visualize e exporte seu relatório profissional
              </p>
            </div>
          </div>
          
          {/* Progress Indicator */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-4 border border-white/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
              <span className="text-white font-medium text-sm md:text-base">Relatório Concluído</span>
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-green-400 rounded-full flex items-center justify-center">
                  <Download className="h-2.5 w-2.5 md:h-3 md:w-3 text-white" />
                </div>
                <span className="text-white text-sm md:text-base lg:text-lg font-bold">Pronto para exportar!</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas do Relatório - Card Hero */}
      <Card className="relative overflow-hidden border-0 shadow-xl">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        <CardHeader className="bg-gradient-to-br from-gray-50 to-white">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            Resumo do Relatório
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {Object.keys(reportData.fieldValues || {}).length}
              </div>
              <div className="text-sm font-medium text-blue-700">Campos Preenchidos</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {reportData.patientName ? '✓' : '✗'}
              </div>
              <div className="text-sm font-medium text-green-700">Dados do Paciente</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {reportData.professionalName ? '✓' : '✗'}
              </div>
              <div className="text-sm font-medium text-purple-700">Dados do Profissional</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
              <div className="text-3xl font-bold text-orange-600 mb-1">
                {reportData.sessionDate ? new Date(reportData.sessionDate).toLocaleDateString('pt-BR') : '--'}
              </div>
              <div className="text-sm font-medium text-orange-700">Data da Sessão</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Upload de Logo */}
        <Card className="text-center h-[280px] flex flex-col">
          <CardHeader className="pb-4 flex-shrink-0">
            <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
              <Image className="h-6 w-6 text-yellow-600" />
            </div>
            <CardTitle className="text-lg">Upload de Logo</CardTitle>
            <p className="text-sm text-muted-foreground">
              Adicione sua logo ao PDF
            </p>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center space-y-3">
            {logoUrl ? (
              <div className="space-y-2">
                <div className="relative">
                  <img 
                    src={logoUrl} 
                    alt="Logo" 
                    className="w-full h-20 object-contain border rounded-lg bg-gray-50"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                    onClick={removeLogo}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-green-600 font-medium">Logo carregada!</p>
              </div>
            ) : (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingLogo}
                >
                  {isUploadingLogo ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Enviar Logo
                    </>
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Upload de Carimbo Digital */}
        <Card className="text-center h-[280px] flex flex-col">
          <CardHeader className="pb-4 flex-shrink-0">
            <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3">
              <Image className="h-6 w-6 text-orange-600" />
            </div>
            <CardTitle className="text-lg">Carimbo Digital</CardTitle>
            <p className="text-sm text-muted-foreground">
              Adicione seu carimbo ao PDF
            </p>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center space-y-3">
            {stampUrl ? (
              <div className="space-y-2">
                <div className="relative">
                  <img 
                    src={stampUrl} 
                    alt="Carimbo" 
                    className="w-full h-20 object-contain border rounded-lg bg-gray-50"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                    onClick={removeStamp}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-green-600 font-medium">Carimbo carregado!</p>
              </div>
            ) : (
              <>
                <input
                  ref={stampInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleStampUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => stampInputRef.current?.click()}
                  disabled={isUploadingStamp}
                >
                  {isUploadingStamp ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Enviar Carimbo
                    </>
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Upload de Assinatura Digital */}
        <Card className="text-center h-[280px] flex flex-col">
          <CardHeader className="pb-4 flex-shrink-0">
            <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
              <Upload className="h-6 w-6 text-indigo-600" />
            </div>
            <CardTitle className="text-lg">Assinatura Digital</CardTitle>
            <p className="text-sm text-muted-foreground">
              Adicione sua assinatura digital ao PDF
            </p>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center space-y-3">
            {signatureUrl ? (
              <div className="space-y-2">
                <div className="relative">
                  <img 
                    src={signatureUrl} 
                    alt="Assinatura Digital" 
                    className="w-full h-20 object-contain border rounded-lg bg-gray-50"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                    onClick={removeSignature}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-green-600 font-medium">Assinatura carregada!</p>
              </div>
            ) : (
              <>
                <input
                  ref={signatureInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleSignatureUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => signatureInputRef.current?.click()}
                  disabled={isUploadingSignature}
                >
                  {isUploadingSignature ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Enviar Assinatura
                    </>
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Visualizar Relatório */}
        <Card className="text-center h-[280px] flex flex-col">
          <CardHeader className="pb-4 flex-shrink-0">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-lg">Visualizar Relatório</CardTitle>
            <p className="text-sm text-muted-foreground">
              Veja como ficará o relatório final
            </p>
          </CardHeader>
          <CardContent className="flex-1 flex items-end">
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
        <Card className="text-center h-[280px] flex flex-col">
          <CardHeader className="pb-4 flex-shrink-0">
            <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="text-lg">Organizar com IA</CardTitle>
            <p className="text-sm text-muted-foreground">
              Estruture o relatório automaticamente
            </p>
          </CardHeader>
          <CardContent className="flex-1 flex items-end">
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

        {/* Salvar Relatório */}
        <Card className="text-center h-[280px] flex flex-col">
          <CardHeader className="pb-4 flex-shrink-0">
            <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
              <Save className="h-6 w-6 text-emerald-600" />
            </div>
            <CardTitle className="text-lg">Salvar Relatório</CardTitle>
            <p className="text-sm text-muted-foreground">
              Salve o relatório no sistema
            </p>
          </CardHeader>
          <CardContent className="flex-1 flex items-end">
            <Button 
              onClick={onSaveReport}
              disabled={isSaving}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Exportar PDF */}
        <Card className="text-center h-[280px] flex flex-col">
          <CardHeader className="pb-4 flex-shrink-0">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <Download className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-lg">Exportar PDF</CardTitle>
            <p className="text-sm text-muted-foreground">
              Gere o relatório em formato PDF
            </p>
          </CardHeader>
          <CardContent className="flex-1 flex items-end">
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