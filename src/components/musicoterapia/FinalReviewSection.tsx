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
import { imageUrlToBase64 } from '@/utils/imageToBase64';

interface FinalReviewSectionProps {
  reportData: Partial<ReportData>;
  onOrganizeWithAI: () => void;
  isGeneratingWithAI: boolean;
  onSaveReport: () => void;
  isSaving: boolean;
  professionalData?: any;
}

export function FinalReviewSection({ 
  reportData, 
  onOrganizeWithAI, 
  isGeneratingWithAI,
  onSaveReport,
  isSaving,
  professionalData
}: FinalReviewSectionProps) {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportPDF = async () => {
    setIsExporting(true);
    
    try {
      // Converter imagens para Base64
      let photoBase64: string | null = null;
      let stampBase64: string | null = null;

      if (professionalData?.stamp_photo_url) {
        photoBase64 = await imageUrlToBase64(professionalData.stamp_photo_url);
      }
      if (professionalData?.digital_stamp_url) {
        stampBase64 = await imageUrlToBase64(professionalData.digital_stamp_url);
      }

      // Criar um elemento HTML temporário com o conteúdo do relatório
      const tempDiv = document.createElement('div');
      tempDiv.style.padding = '40px';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      tempDiv.style.color = '#000';
      tempDiv.style.backgroundColor = '#fff';
      tempDiv.innerHTML = generatePDFContent(photoBase64, stampBase64);
      
      document.body.appendChild(tempDiv);
      
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
      
      document.body.removeChild(tempDiv);
      
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


  const generatePDFContent = (photoBase64?: string | null, stampBase64?: string | null) => {
    const fields = reportData.fieldValues || {};
    const currentDate = new Date().toLocaleDateString('pt-BR');
    
    return `
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #007bff; padding-bottom: 20px;">
        ${logoUrl ? `<img src="${logoUrl}" style="max-width: 150px; max-height: 80px; margin-bottom: 15px; display: block; margin-left: auto; margin-right: auto;" alt="Logo" />` : ''}
        <h1 style="margin: 0; color: #007bff; font-size: 28px;">Relatorio MuseTera TEA</h1>
        <p style="margin: 5px 0 0 0; color: #666; font-size: 16px;">Musicoterapia para Transtorno do Espectro Autista</p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
        <div>
          <h3 style="color: #007bff; margin-bottom: 15px; font-size: 18px;">Dados do Paciente</h3>
          <p style="margin: 8px 0;"><strong>Nome:</strong> ${reportData.patientName || 'Nao informado'}</p>
          <p style="margin: 8px 0;"><strong>Idade:</strong> ${reportData.patientAge || 'Nao informado'}</p>
          <p style="margin: 8px 0;"><strong>Diagnostico:</strong> ${reportData.patientDiagnosis || 'Nao informado'}</p>
        </div>
        
        <div>
          <h3 style="color: #007bff; margin-bottom: 15px; font-size: 18px;">Dados do Profissional</h3>
          <p style="margin: 8px 0;"><strong>Nome:</strong> ${reportData.professionalName || 'Nao informado'}</p>
          <p style="margin: 8px 0;"><strong>Registro:</strong> ${reportData.professionalRegistry || 'Nao informado'}</p>
          <p style="margin: 8px 0;"><strong>Data da Sessao:</strong> ${reportData.sessionDate ? new Date(reportData.sessionDate).toLocaleDateString('pt-BR') : 'Nao informado'}</p>
        </div>
      </div>

      ${fields.therapeutic_objectives && Array.isArray(fields.therapeutic_objectives) && fields.therapeutic_objectives.length > 0 ? `
        <div style="margin-bottom: 25px;">
          <h3 style="color: #007bff; margin-bottom: 15px; font-size: 18px;">Objetivos Terapeuticos</h3>
          <div style="text-align: justify; line-height: 1.6;">
            ${fields.therapeutic_objectives.map(obj => `<p style="margin: 12px 0;">- ${obj}</p>`).join('')}
          </div>
        </div>
      ` : ''}

      ${fields.session_activities && Array.isArray(fields.session_activities) && fields.session_activities.length > 0 ? `
        <div style="margin-bottom: 25px;">
          <h3 style="color: #007bff; margin-bottom: 15px; font-size: 18px;">Atividades Realizadas</h3>
          <div style="text-align: justify; line-height: 1.6;">
            ${fields.session_activities.map(act => `<p style="margin: 12px 0;">- ${act}</p>`).join('')}
          </div>
        </div>
      ` : ''}

      ${fields.patient_evolution && Array.isArray(fields.patient_evolution) && fields.patient_evolution.length > 0 ? `
        <div style="margin-bottom: 25px;">
          <h3 style="color: #007bff; margin-bottom: 15px; font-size: 18px;">Evolucao do Paciente</h3>
          <div style="text-align: justify; line-height: 1.6;">
            ${fields.patient_evolution.map(evo => `<p style="margin: 12px 0;">- ${evo}</p>`).join('')}
          </div>
        </div>
      ` : ''}

      ${fields.recommendations && Array.isArray(fields.recommendations) && fields.recommendations.length > 0 ? `
        <div style="margin-bottom: 25px;">
          <h3 style="color: #007bff; margin-bottom: 15px; font-size: 18px;">Recomendacoes</h3>
          <div style="text-align: justify; line-height: 1.6;">
            ${fields.recommendations.map(rec => `<p style="margin: 12px 0;">- ${rec}</p>`).join('')}
          </div>
        </div>
      ` : ''}

      ${fields.conclusion && Array.isArray(fields.conclusion) && fields.conclusion.length > 0 ? `
        <div style="margin-bottom: 25px;">
          <h3 style="color: #007bff; margin-bottom: 15px; font-size: 18px;">Conclusao</h3>
          <div style="text-align: justify; line-height: 1.6;">
            ${fields.conclusion.map(con => `<p style="margin: 12px 0;">- ${con}</p>`).join('')}
          </div>
        </div>
      ` : ''}

      <!-- FOOTER TEAL - Design 50% menor -->
      <div style="margin-top: 25px; border: 2px solid transparent; border-radius: 10px; overflow: hidden; background: #ffffff; background-image: linear-gradient(#fff, #fff), linear-gradient(135deg, #0d9488, #14b8a6, #06b6d4); background-origin: border-box; background-clip: padding-box, border-box;">
        <div style="height: 4px; background: linear-gradient(90deg, #0d9488 0%, #14b8a6 50%, #06b6d4 100%);"></div>
        
        <div style="padding: 16px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: start;">
          
            <!-- Card de Assinatura (Esquerda) - 50% menor -->
            <div style="background: linear-gradient(135deg, #f0fdfa, #ccfbf1); border: 1px solid #14b8a6; border-radius: 8px; overflow: hidden;">
              <div style="height: 4px; background: linear-gradient(to right, #0d9488, #14b8a6, #06b6d4);"></div>
              
              <div style="padding: 12px;">
                <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                  ${photoBase64 ? `
                    <div style="position: relative;">
                      <div style="position: absolute; width: 52px; height: 52px; border-radius: 50%; background: linear-gradient(135deg, rgba(20,184,166,0.4), rgba(6,182,212,0.3)); filter: blur(5px); top: -2px; left: -2px;"></div>
                      <div style="width: 48px; height: 48px; border-radius: 50%; overflow: hidden; border: 2px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.1); position: relative; background: linear-gradient(135deg, #0d9488, #14b8a6); padding: 2px;">
                        <div style="width: 100%; height: 100%; border-radius: 50%; overflow: hidden;">
                          <img src="${photoBase64}" style="width: 100%; height: 100%; object-fit: cover;" />
                        </div>
                      </div>
                    </div>
                  ` : ''}
                  <div style="text-align: center;">
                    <div style="font-size: 9px; font-weight: bold; color: #0f766e; margin-bottom: 6px; line-height: 1.3; word-wrap: break-word;">${professionalData?.name || reportData.professionalName || 'Profissional'}</div>
                    <div style="display: inline-flex; align-items: center; gap: 3px; background: #ccfbf1; border: 1px solid #5eead4; border-radius: 10px; padding: 3px 7px; margin-bottom: 8px;">
                      <span style="color: #0f766e; font-size: 7px;">&#9835;</span>
                      <span style="font-size: 7px; font-weight: 600; color: #0f766e;">${professionalData?.specialty || reportData.professionalSpecialty || 'Musicoterapeuta'}</span>
                    </div>
                    <div style="font-size: 7px; color: #374151; line-height: 1.8;">
                      ${professionalData?.register ? `<div><strong style="color: #0f766e;">Registro:</strong> ${professionalData.register}</div>` : ''}
                      ${professionalData?.email ? `<div style="word-wrap: break-word;"><strong style="color: #0f766e;">Email:</strong> ${professionalData.email}</div>` : ''}
                      ${professionalData?.phone ? `<div><strong style="color: #0f766e;">Telefone:</strong> ${professionalData.phone}</div>` : ''}
                    </div>
                  </div>
                </div>
              </div>
              
              <div style="border-top: 1px solid #5eead4; background: linear-gradient(to right, #f0fdfa, #ecfeff, #f0fdfa); padding: 7px;">
                <div style="display: flex; align-items: center; justify-content: center; gap: 4px;">
                  <span style="color: #0d9488; font-size: 8px;">&#10004;</span>
                  <span style="font-size: 6px; font-weight: 600; color: #0f766e;">Assinatura Digital Verificada</span>
                  <span style="color: #0d9488; font-size: 7px;">&#9835;</span>
                  <span style="font-size: 6px; color: #6b7280;">Sistema MuseTera</span>
                </div>
              </div>
            </div>

            <!-- Carimbo Circular (Direita) - 50% menor -->
            <div style="display: flex; flex-direction: column; align-items: center;">
              ${stampBase64 || photoBase64 ? `
                <div style="width: 140px; height: 140px; position: relative; display: flex; align-items: center; justify-content: center;">
                  <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; border: 2px dashed #14b8a6; opacity: 0.3;"></div>
                  <div style="position: absolute; width: 92%; height: 92%; border-radius: 50%; border: 1px solid #14b8a6; opacity: 0.5;"></div>
                  <div style="width: 120px; height: 120px; border-radius: 50%; background: linear-gradient(135deg, #f0fdfa, #ccfbf1); border: 3px solid #0d9488; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 8px; box-shadow: 0 4px 12px rgba(20,184,166,0.25);">
                    ${photoBase64 ? `
                      <div style="position: relative; margin-bottom: 5px;">
                        <div style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, rgba(20,184,166,0.4), rgba(6,182,212,0.3)); filter: blur(4px); top: -2px; left: -2px;"></div>
                        <div style="width: 40px; height: 40px; border-radius: 50%; overflow: hidden; border: 2px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.1); position: relative;">
                          <img src="${photoBase64}" style="width: 100%; height: 100%; object-fit: cover;" />
                        </div>
                      </div>
                    ` : ''}
                    <div style="font-size: 7px; font-weight: bold; color: #0f766e; text-align: center; margin-bottom: 3px; max-width: 90px; line-height: 1.3; word-wrap: break-word;">${professionalData?.name || reportData.professionalName || 'Profissional'}</div>
                    <div style="width: 30px; height: 1px; background: linear-gradient(to right, transparent, #14b8a6, transparent); margin-bottom: 3px;"></div>
                    <div style="display: inline-flex; align-items: center; gap: 2px; background: #ccfbf1; border: 1px solid #5eead4; border-radius: 8px; padding: 2px 5px; margin-bottom: 2px;">
                      <span style="font-size: 5px; color: #0f766e;">&#9835;</span>
                      <span style="font-size: 5px; font-weight: 600; color: #0f766e; text-transform: uppercase; letter-spacing: 0.3px;">${professionalData?.specialty || reportData.professionalSpecialty || 'Musicoterapeuta'}</span>
                    </div>
                    ${professionalData?.register ? `<div style="font-size: 6px; color: #374151; font-weight: 600;">${professionalData.register}</div>` : ''}
                  </div>
                </div>
                <div style="margin-top: 6px; background: linear-gradient(135deg, #0d9488, #0891b2); color: white; padding: 4px 9px; border-radius: 10px; display: inline-flex; align-items: center; gap: 3px; box-shadow: 0 2px 6px rgba(13,148,136,0.3);">
                  <span style="font-size: 6px;">&#10004;</span>
                  <span style="font-size: 6px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px;">MuseTera Verified</span>
                  <span style="font-size: 6px;">&#9835;</span>
                </div>
              ` : `
                <div style="width: 120px; height: 120px; border: 2px dashed #14b8a6; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 7px; color: #6b7280; background: #f0fdfa;">
                  Carimbo Digital
                </div>
              `}
            </div>
          </div>
        </div>
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
            <h1 className="text-3xl font-bold mb-2">Relatório MuseTera TEA</h1>
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