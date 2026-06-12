import React, { useState, useRef } from 'react';
import { Eye, Zap, Download, FileText, Loader2, Upload, Image, X, Save, CheckCircle, Info, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import html2pdf from 'html2pdf.js';
import type { ReportData } from '@/data/musicoterapiaTemplate';
import { imageUrlToBase64 } from '@/utils/imageToBase64';
import { savePDFToStorage } from '@/utils/pdfStorageUtils';

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
      // 1. Organizar com IA antes de exportar
      toast({
        title: "Iniciando IA",
        description: "Organizando os dados com IA para um PDF mais profissional...",
      });
      
      await onOrganizeWithAI();
      
      // 2. Aguardar um pouco para garantir que os dados foram atualizados no estado global
      await new Promise(resolve => setTimeout(resolve, 800));

      let photoBase64: string | null = null;
      let stampBase64: string | null = null;

      if (professionalData?.stamp_photo_url) {
        photoBase64 = await imageUrlToBase64(professionalData.stamp_photo_url);
      }
      if (professionalData?.digital_stamp_url) {
        stampBase64 = await imageUrlToBase64(professionalData.digital_stamp_url);
      }

      const tempDiv = document.createElement('div');
      tempDiv.style.padding = '40px';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      tempDiv.style.color = '#000';
      tempDiv.style.backgroundColor = '#fff';
      tempDiv.innerHTML = generatePDFContent(photoBase64, stampBase64);

      document.body.appendChild(tempDiv);

      const opt = {
        margin: [20, 20, 20, 20],
        filename: `relatorio-musicoterapia-${reportData.patientName?.replace(/\s+/g, '-').toLowerCase() || 'paciente'}-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      const pdfInstance = html2pdf().set(opt).from(tempDiv);
      await pdfInstance.save();

      try {
        const pdfBlob = await pdfInstance.outputPdf('blob');
        await savePDFToStorage(pdfBlob, opt.filename, "report");
      } catch (storageErr) {
        console.warn("PDF baixado mas nao foi salvo no sistema:", storageErr);
      }

      document.body.removeChild(tempDiv);

      toast({
        title: "PDF Exportado com Sucesso!",
        description: "O relatorio foi organizado com IA e baixado em formato PDF.",
      });
    } catch (error) {
      console.error('Erro na exportacao PDF:', error);
      toast({
        variant: "destructive",
        title: "Erro na Exportacao",
        description: "Nao foi possivel gerar o PDF. Tente novamente.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Tipo de arquivo invalido",
        description: "Por favor, selecione apenas arquivos de imagem (PNG, JPG, etc.)",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Arquivo muito grande",
        description: "A imagem deve ter no maximo 5MB",
      });
      return;
    }

    setIsUploadingLogo(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuario nao autenticado");

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/logo-${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('report-logos')
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('report-logos')
        .getPublicUrl(fileName);

      setLogoUrl(publicUrl);

      toast({
        title: "Logo enviada com sucesso!",
        description: "A logo sera incluida no PDF gerado.",
      });

    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        variant: "destructive",
        title: "Erro no upload",
        description: "Nao foi possivel enviar a logo. Tente novamente.",
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
      description: "A logo foi removida do relatorio.",
    });
  };

  const generatePDFContent = (photoBase64?: string | null, stampBase64?: string | null) => {
    const fields = reportData.fieldValues || {};

    return `
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #c9a84c; padding-bottom: 20px;">
        ${logoUrl ? `<img src="${logoUrl}" style="max-width: 150px; max-height: 80px; margin-bottom: 15px; display: block; margin-left: auto; margin-right: auto;" alt="Logo" />` : ''}
        <h1 style="margin:  0; color: #c9a84c; font-size: 28px;">Relatorio MuseTera TEA</h1>
        <p style="margin: 5px 0 0 0; color: #666; font-size: 16px;">Musicoterapia para Transtorno do Espectro Autista</p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
        <div>
          <h3 style="color: #c9a84c; margin-bottom: 15px; font-size: 18px;">Dados do Paciente</h3>
          <p style="margin: 8px 0;"><strong>Nome:</strong> ${reportData.patientName || 'Nao informado'}</p>
          <p style="margin: 8px 0;"><strong>Idade:</strong> ${reportData.patientAge || 'Nao informado'}</p>
          <p style="margin: 8px 0;"><strong>Diagnostico:</strong> ${reportData.patientDiagnosis || 'Nao informado'}</p>
        </div>

        <div>
          <h3 style="color: #c9a84c; margin-bottom: 15px; font-size: 18px;">Dados do Profissional</h3>
          <p style="margin: 8px 0;"><strong>Nome:</strong> ${reportData.professionalName || 'Nao informado'}</p>
          <p style="margin: 8px 0;"><strong>Registro:</strong> ${reportData.professionalRegistry || 'Nao informado'}</p>
          <p style="margin: 8px 0;"><strong>Data da Sessao:</strong> ${reportData.sessionDate ? new Date(reportData.sessionDate).toLocaleDateString('pt-BR') : 'Nao informado'}</p>
        </div>
      </div>

      ${fields.therapeutic_objectives && Array.isArray(fields.therapeutic_objectives) && fields.therapeutic_objectives.length > 0 ? `
        <div style="margin-bottom: 25px;">
          <h3 style="color: #c9a84c; margin-bottom: 15px; font-size: 18px;">Objetivos Terapeuticos</h3>
          <div style="text-align: justify; line-height: 1.6;">
            ${fields.therapeutic_objectives.map(obj => `<p style="margin: 12px 0;">- ${obj}</p>`).join('')}
          </div>
        </div>
      ` : ''}

      ${fields.session_activities && Array.isArray(fields.session_activities) && fields.session_activities.length > 0 ? `
        <div style="margin-bottom: 25px;">
          <h3 style="color: #c9a84c; margin-bottom: 15px; font-size: 18px;">Atividades Realizadas</h3>
          <div style="text-align: justify; line-height: 1.6;">
            ${fields.session_activities.map(act => `<p style="margin: 12px 0;">- ${act}</p>`).join('')}
          </div>
        </div>
      ` : ''}

      ${fields.patient_evolution && Array.isArray(fields.patient_evolution) && fields.patient_evolution.length > 0 ? `
        <div style="margin-bottom: 25px;">
          <h3 style="color: #c9a84c; margin-bottom: 15px; font-size: 18px;">Evolucao do Paciente</h3>
          <div style="text-align: justify; line-height: 1.6;">
            ${fields.patient_evolution.map(evo => `<p style="margin: 12px 0;">- ${evo}</p>`).join('')}
          </div>
        </div>
      ` : ''}

      ${fields.recommendations && Array.isArray(fields.recommendations) && fields.recommendations.length > 0 ? `
        <div style="margin-bottom: 25px;">
          <h3 style="color: #c9a84c; margin-bottom: 15px; font-size: 18px;">Recomendacoes</h3>
          <div style="text-align: justify; line-height: 1.6;">
            ${fields.recommendations.map(rec => `<p style="margin: 12px 0;">- ${rec}</p>`).join('')}
          </div>
        </div>
      ` : ''}

      ${fields.conclusion && Array.isArray(fields.conclusion) && fields.conclusion.length > 0 ? `
        <div style="margin-bottom: 25px;">
          <h3 style="color: #c9a84c; margin-bottom: 15px; font-size: 18px;">Conclusao</h3>
          <div style="text-align: justify; line-height: 1.6;">
            ${fields.conclusion.map(con => `<p style="margin: 12px 0;">- ${con}</p>`).join('')}
          </div>
        </div>
      ` : ''}

      <div style="margin-top: 25px; border: 2px solid transparent; border-radius: 10px; overflow: hidden; background: #ffffff; background-image: linear-gradient(#fff, #fff), linear-gradient(135deg, #0d0d0d, #1a1a1a, #c9a84c); background-origin: border-box; background-clip: padding-box, border-box;">
        <div style="height: 4px; background: linear-gradient(90deg, #c9a84c 0%, #f0d78c 50%, #c9a84c 100%);"></div>
        <div style="padding: 16px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: start;">
            <div style="background: linear-gradient(135deg, #faf8f5, #f0ebe3); border: 1px solid #c9a84c; border-radius: 8px; overflow: hidden;">
              <div style="height: 4px; background: linear-gradient(to right, #c9a84c, #f0d78c, #c9a84c);"></div>
              <div style="padding: 12px;">
                <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                  ${photoBase64 ? `
                    <div style="position: relative;">
                      <div style="position: absolute; width: 52px; height: 52px; border-radius: 50%; background: linear-gradient(135deg, rgba(201,168,76,0.4), rgba(240,215,140,0.3)); filter: blur(5px); top: -2px; left: -2px;"></div>
                      <div style="width: 48px; height: 48px; border-radius: 50%; overflow: hidden; border: 2px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.1); position: relative; background: linear-gradient(135deg, #c9a84c, #f0d78c); padding: 2px;">
                        <div style="width: 100%; height: 100%; border-radius: 50%; overflow: hidden;">
                          <img src="${photoBase64}" style="width: 100%; height: 100%; object-fit: cover;" />
                        </div>
                      </div>
                    </div>
                  ` : ''}
                  <div style="text-align: center;">
                    <div style="font-size: 9px; font-weight: bold; color: #0d0d0d; margin-bottom: 6px; line-height: 1.3; word-wrap: break-word;">${professionalData?.name || reportData.professionalName || 'Profissional'}</div>
                    <div style="display: inline-flex; align-items: center; gap: 3px; background: #f0ebe3; border: 1px solid #c9a84c; border-radius: 10px; padding: 3px 7px; margin-bottom: 8px;">
                      <span style="color: #0d0d0d; font-size: 7px;">&#9835;</span>
                      <span style="font-size: 7px; font-weight: 600; color: #0d0d0d;">${professionalData?.specialty || reportData.professionalSpecialty || 'Musicoterapeuta'}</span>
                    </div>
                    <div style="font-size: 7px; color: #374151; line-height: 1.8;">
                      ${professionalData?.register ? `<div><strong style="color: #c9a84c;">Registro:</strong> ${professionalData.register}</div>` : ''}
                      ${professionalData?.email ? `<div style="word-wrap: break-word;"><strong style="color: #c9a84c;">Email:</strong> ${professionalData.email}</div>` : ''}
                      ${professionalData?.phone ? `<div><strong style="color: #c9a84c;">Telefone:</strong> ${professionalData.phone}</div>` : ''}
                    </div>
                  </div>
                </div>
              </div>
              <div style="border-top: 1px solid #c9a84c; background: linear-gradient(to right, #faf8f5, #f0ebe3, #faf8f5); padding: 7px;">
                <div style="display: flex; align-items: center; justify-content: center; gap: 4px;">
                  <span style="color: #c9a84c; font-size: 8px;">&#10004;</span>
                  <span style="font-size: 6px; font-weight: 600; color: #0d0d0d;">Assinatura Digital Verificada</span>
                  <span style="color: #c9a84c; font-size: 7px;">&#9835;</span>
                  <span style="font-size: 6px; color: #6b7280;">Sistema MuseTera</span>
                </div>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; align-items: center;">
              ${stampBase64 || photoBase64 ? `
                <div style="width: 140px; height: 140px; position: relative; display: flex; align-items: center; justify-content: center;">
                  <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; border: 2px dashed #c9a84c; opacity: 0.3;"></div>
                  <div style="position: absolute; width: 92%; height: 92%; border-radius: 50%; border: 1px solid #c9a84c; opacity: 0.5;"></div>
                  <div style="width: 120px; height: 120px; border-radius: 50%; background: linear-gradient(135deg, #faf8f5, #f0ebe3); border: 3px solid #c9a84c; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 8px; box-shadow: 0 4px 12px rgba(201,168,76,0.25);">
                    ${photoBase64 ? `
                      <div style="position: relative; margin-bottom: 5px;">
                        <div style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, rgba(201,168,76,0.4), rgba(240,215,140,0.3)); filter: blur(4px); top: -2px; left: -2px;"></div>
                        <div style="width: 40px; height: 40px; border-radius: 50%; overflow: hidden; border: 2px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.1); position: relative;">
                          <img src="${photoBase64}" style="width: 100%; height: 100%; object-fit: cover;" />
                        </div>
                      </div>
                    ` : ''}
                    <div style="font-size: 7px; font-weight: bold; color: #0d0d0d; text-align: center; margin-bottom: 3px; max-width: 90px; line-height: 1.3; word-wrap: break-word;">${professionalData?.name || reportData.professionalName || 'Profissional'}</div>
                    <div style="width: 30px; height: 1px; background: linear-gradient(to right, transparent, #c9a84c, transparent); margin-bottom: 3px;"></div>
                    <div style="display: inline-flex; align-items: center; gap: 2px; background: #f0ebe3; border: 1px solid #c9a84c; border-radius: 8px; padding: 2px 5px; margin-bottom: 2px;">
                      <span style="font-size: 5px; color: #0d0d0d;">&#9835;</span>
                      <span style="font-size: 5px; font-weight: 600; color: #0d0d0d; text-transform: uppercase; letter-spacing: 0.3px;">${professionalData?.specialty || reportData.professionalSpecialty || 'Musicoterapeuta'}</span>
                    </div>
                    ${professionalData?.register ? `<div style="font-size: 6px; color: #374151; font-weight: 600;">${professionalData.register}</div>` : ''}
                  </div>
                </div>
                <div style="margin-top: 6px; background: linear-gradient(135deg, #c9a84c, #f0d78c); color: #0d0d0d; padding: 4px 9px; border-radius: 10px; display: inline-flex; align-items: center; gap: 3px; box-shadow: 0 2px 6px rgba(201,168,76,0.3);">
                  <span style="font-size: 6px;">&#10004;</span>
                  <span style="font-size: 6px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px;">MuseTera Verified</span>
                  <span style="font-size: 6px;">&#9835;</span>
                </div>
              ` : `
                <div style="width: 120px; height: 120px; border: 2px dashed #c9a84c; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 7px; color: #6b7280; background: #faf8f5;">
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
        <div className="relative bg-gradient-to-r from-[#0d0d0d] to-[#1a1a1a] text-white p-4 sm:p-8 rounded-t-lg">
          <div className="absolute top-4 right-4 opacity-20">
            <FileText className="h-12 w-12 sm:h-16 sm:w-16" />
          </div>
          <div className="relative z-10">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Relatorio MuseTera TEA</h1>
            <p className="text-[#c9a84c] text-base sm:text-lg">Musicoterapia para Transtorno do Espectro Autista</p>
            <div className="mt-4 text-xs sm:text-sm text-[#c9a84c]/80">
              Gerado em {new Date().toLocaleDateString('pt-BR')} as {new Date().toLocaleTimeString('pt-BR')}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <Card className="border-l-4 border-l-[#c9a84c] shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-[#c9a84c] text-base sm:text-lg">
                  <div className="w-8 h-8 bg-[#c9a84c]/20 rounded-full flex items-center justify-center text-sm">
                    P
                  </div>
                  Dados do Paciente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Nome:</span>
                  <span className="text-foreground">{reportData.patientName || 'Nao informado'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Idade:</span>
                  <span className="text-foreground">{reportData.patientAge || 'Nao informado'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Diagnostico:</span>
                  <span className="text-foreground">{reportData.patientDiagnosis || 'Nao informado'}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#c9a84c] shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-[#c9a84c] text-base sm:text-lg">
                  <div className="w-8 h-8 bg-[#c9a84c]/20 rounded-full flex items-center justify-center text-sm">
                    M
                  </div>
                  Dados do Profissional
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Nome:</span>
                  <span className="text-foreground">{reportData.professionalName || 'Nao informado'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Registro:</span>
                  <span className="text-foreground">{reportData.professionalRegistry || 'Nao informado'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Data da Sessao:</span>
                  <span className="text-foreground">{reportData.sessionDate ? new Date(reportData.sessionDate).toLocaleDateString('pt-BR') : 'Nao informado'}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {fields.therapeutic_objectives && Array.isArray(fields.therapeutic_objectives) && fields.therapeutic_objectives.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="bg-gradient-to-r from-[#c9a84c]/20 to-[#c9a84c]/10 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-[#c9a84c] text-sm sm:text-base">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#c9a84c]/30 rounded-full flex items-center justify-center text-xs">O</div>
                  Objetivos Terapeuticos
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 text-sm">
                <div className="space-y-2 sm:space-y-3">
                  {fields.therapeutic_objectives.map((objective: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-2 sm:p-3 bg-[#c9a84c]/10 rounded-lg border border-[#c9a84c]/20">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#c9a84c]/30 rounded-full flex items-center justify-center text-[#c9a84c] font-bold text-[10px] sm:text-xs mt-0.5 flex-shrink-0">{index + 1}</div>
                      <p className="text-foreground leading-relaxed flex-1">{objective}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {fields.session_activities && Array.isArray(fields.session_activities) && fields.session_activities.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="bg-gradient-to-r from-[#c9a84c]/20 to-[#c9a84c]/10 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-[#c9a84c] text-sm sm:text-base">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#c9a84c]/30 rounded-full flex items-center justify-center text-xs">A</div>
                  Atividades Realizadas
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 text-sm">
                <div className="space-y-2 sm:space-y-3">
                  {fields.session_activities.map((activity: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-2 sm:p-3 bg-[#c9a84c]/10 rounded-lg border border-[#c9a84c]/20">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#c9a84c]/30 rounded-full flex items-center justify-center text-[#c9a84c] font-bold text-[10px] sm:text-xs mt-1 flex-shrink-1">-</div>
                      <p className="text-foreground leading-relaxed flex-1">{activity}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {fields.patient_evolution && Array.isArray(fields.patient_evolution) && fields.patient_evolution.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="bg-gradient-to-r from-[#c9a84c]/20 to-[#c9a84c]/10 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-[#c9a84c] text-sm sm:text-base">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#c9a84c]/30 rounded-full flex items-center justify-center text-xs">E</div>
                  Evolucao do Paciente
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 text-sm">
                <div className="space-y-2 sm:space-y-3">
                  {fields.patient_evolution.map((evolution: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-2 sm:p-3 bg-[#c9a84c]/10 rounded-lg border border-[#c9a84c]/20">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#c9a84c]/30 rounded-full flex items-center justify-center text-[#c9a84c] font-bold text-[10px] sm:text-xs mt-1 flex-shrink-0">ok</div>
                      <p className="text-foreground leading-relaxed flex-1">{evolution}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {fields.recommendations && Array.isArray(fields.recommendations) && fields.recommendations.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="bg-gradient-to-r from-[#c9a84c]/20 to-[#c9a84c]/10 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-[#c9a84c] text-sm sm:text-base">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#c9a84c]/30 rounded-full flex items-center justify-center text-xs">R</div>
                  Recomendacoes
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 text-sm">
                <div className="space-y-2 sm:space-y-3">
                  {fields.recommendations.map((recommendation: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-2 sm:p-3 bg-[#c9a84c]/10 rounded-lg border border-[#c9a84c]/20">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#c9a84c]/30 rounded-full flex items-center justify-center text-[#c9a84c] font-bold text-[10px] sm:text-xs mt-1 flex-shrink-1">&gt;</div>
                      <p className="text-foreground leading-relaxed flex-1">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {fields.conclusion && Array.isArray(fields.conclusion) && fields.conclusion.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="bg-gradient-to-r from-[#c9a84c]/20 to-[#c9a84c]/10 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-[#c9a84c] text-sm sm:text-base">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#c9a84c]/30 rounded-full flex items-center justify-center text-xs">C</div>
                  Conclusao
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 text-sm">
                <div className="space-y-2 sm:space-y-3">
                  {fields.conclusion.map((conclusion: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-2 sm:p-3 bg-[#c9a84c]/10 rounded-lg border border-[#c9a84c]/20">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#c9a84c]/30 rounded-full flex items-center justify-center text-[#c9a84c] font-bold text-[10px] sm:text-xs mt-1 flex-shrink-0">*</div>
                      <p className="text-foreground leading-relaxed flex-1">{conclusion}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="border-t-2 border-[#c9a84c]/30 pt-4 sm:pt-6 mt-6 sm:mt-8">
            <div className="bg-gradient-to-r from-[#0d0d0d]/5 to-[#0d0d0d]/10 p-4 sm:p-6 rounded-lg">
              <div className="text-center">
                <p className="text-base sm:text-lg font-semibold text-foreground mb-2">
                  <strong>Assinatura Digital:</strong> {reportData.signature || reportData.professionalName || 'Nao informado'}
                </p>
                <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-[#c9a84c] rounded-full"></div>
                  <span>Documento verificado e assinado digitalmente</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const filledFieldsCount = Object.keys(reportData.fieldValues || {}).length;
  const totalSteps = 10;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Info Banner */}
      <div className="rounded-2xl border border-[#c9a84c]/30 bg-[#0d0d0d]/40 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-[#c9a84c]/15 border border-[#c9a84c]/30 flex-shrink-1">
            <Info className="h-4 w-4 sm:h-5 sm:w-5 text-[#c9a84c]" />
          </div>
          <div className="min-w-1">
            <p className="font-medium text-sm sm:text-base text-[#c9a84c]">Revisao Final</p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
              Personalize, visualize e exporte seu relatorio profissional. Verifique todos os dados antes de finalizar.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        <StatCard
          label="Campos Preenchidos"
          value={filledFieldsCount.toString()}
          icon={<FileText className="h-4 w-4 text-[#c9a84c]" />}
        />
        <StatCard
          label="Dados do Paciente"
          value={reportData.patientName ? 'OK' : '---'}
          icon={<CheckCircle className="h-4 w-4 text-[#c9a84c]" />}
        />
        <StatCard
          label="Dados do Profissional"
          value={reportData.professionalName ? 'OK' : '---'}
          icon={<CheckCircle className="h-4 w-4 text-[#c9a84c]" />}
        />
        <StatCard
          label="Data da Sessao"
          value={reportData.sessionDate ? new Date(reportData.sessionDate).toLocaleDateString('pt-BR') : '---'}
          icon={<FileText className="h-4 w-4 text-[#c9a84c]" />}
        />
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
        {/* Upload Logo */}
        <div className="rounded-2xl border border-white/5 bg-[#0d0d0d]/30 hover:border-[#c9a84c]/30 hover:bg-[#0d0d0d]/50 transition-all p-4 sm:p-5 flex flex-col">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-[#c9a84c]/15 border border-[#c9a84c]/30 flex-shrink-0">
              <Image className="h-5 w-5 text-[#c9a84c]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-foreground">Upload de Logo</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Adicione sua logo ao PDF</p>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-end">
            {logoUrl ? (
              <div className="space-y-3">
                <div className="relative">
                  <img
                    src={logoUrl}
                    alt="Logo"
                    className="w-full h-20 object-contain border border-[#c9a84c]/30 rounded-xl bg-[#0d0d0d]/40"
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
                <p className="text-xs text-[#c9a84c] font-medium">Logo carregada!</p>
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
                  className="w-full border-[#c9a84c]/30 hover:bg-[#c9a84c]/10 hover:text-[#c9a84c] text-xs sm:text-sm"
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
          </div>
        </div>

        {/* Visualizar */}
        <div className="rounded-2xl border border-white/5 bg-[#0d0d0d]/30 hover:border-[#c9a84c]/30 hover:bg-[#0d0d0d]/50 transition-all p-4 sm:p-5 flex flex-col">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-[#c9a84c]/15 border border-[#c9a84c]/30 flex-shrink-0">
              <Eye className="h-5 w-5 text-[#c9a84c]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-foreground">Visualizar Relatorio</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Veja como ficara o relatorio final</p>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-end">
            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full border-[#c9a84c]/30 hover:bg-[#c9a84c]/10 hover:text-[#c9a84c] text-xs sm:text-sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Previa
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[85vh] p-0 overflow-hidden">
                <DialogHeader className="p-4 sm:p-6 pb-0">
                  <DialogTitle className="text-sm sm:text-base">Previa do Relatorio de Musicoterapia</DialogTitle>
                  <DialogDescription className="text-xs sm:text-sm">
                    Visualizacao completa do relatorio antes da exportacao
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh] p-4 sm:p-6 pt-2">
                  {renderPreviewContent()}
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        </div>


        {/* Salvar */}
        <div className="rounded-2xl border border-white/5 bg-[#0d0d0d]/30 hover:border-[#c9a84c]/30 hover:bg-[#0d0d0d]/50 transition-all p-4 sm:p-5 flex flex-col">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-[#c9a84c]/15 border border-[#c9a84c]/30 flex-shrink-0">
              <Save className="h-5 w-5 text-[#c9a84c]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-foreground">Salvar Relatorio</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Salve o relatorio no sistema</p>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-end">
            <Button
              onClick={onSaveReport}
              disabled={isSaving}
              className="w-full bg-[#0d0d0d] border border-[#c9a84c]/40 hover:bg-[#c9a84c]/10 text-[#c9a84c] text-xs sm:text-sm"
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
          </div>
        </div>

        {/* Exportar PDF */}
        <div className="rounded-2xl border border-white/5 bg-[#0d0d0d]/30 hover:border-[#c9a84c]/30 hover:bg-[#0d0d0d]/50 transition-all p-4 sm:p-5 flex flex-col sm:col-span-2 xl:col-span-1">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-[#c9a84c]/15 border border-[#c9a84c]/30 flex-shrink-0">
              <Download className="h-5 w-5 text-[#c9a84c]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-foreground">Exportar PDF</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Gere o relatorio em formato PDF</p>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-end">
            <Button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="w-full bg-gradient-to-r from-[#c9a84c] to-[#f0d78c] hover:from-[#f0d78c] hover:to-[#c9a84c] text-black font-semibold text-xs sm:text-sm"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Exportando...
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
      </div>

      {/* Progress Summary */}
      <div className="rounded-2xl border border-[#c9a84c]/30 bg-gradient-to-br from-[#c9a84c]/10 to-transparent p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#c9a84c]/15 border border-[#c9a84c]/30">
              <CheckCircle className="h-5 w-5 text-[#c9a84c]" />
            </div>
            <div>
              <p className="text-sm sm:text-base font-semibold text-[#c9a84c]">Relatorio Concluido</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Pronto para exportar!</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-[#c9a84c] hidden sm:block" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#0d0d0d]/30 p-3 sm:p-4 text-center hover:border-[#c9a84c]/30 transition-all">
      <div className="flex items-center justify-center mb-2">
        {icon}
      </div>
      <div className="text-lg sm:text-2xl font-bold text-[#c9a84c] mb-1">{value}</div>
      <div className="text-[10px] sm:text-xs font-medium text-muted-foreground">{label}</div>
    </div>
  );
}
