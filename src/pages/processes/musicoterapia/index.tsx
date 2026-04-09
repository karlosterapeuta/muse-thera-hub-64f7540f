import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Music, FileText, Wand2, Download, Save, ArrowLeft, Brain, List, Eye, Edit, Trash2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MusicoterapiaReportWizard } from '@/components/musicoterapia/MusicoterapiaReportWizard';
import { MusicoterapiaPreview } from '@/components/musicoterapia/MusicoterapiaPreview';
import { useMusicoterapiaReport } from '@/hooks/useMusicoterapiaReport';
import { savePDFToStorage } from '@/utils/pdfStorageUtils';
import { useReportData } from '../report/hooks/useReportData';
import html2pdf from 'html2pdf.js';
import { imageUrlToBase64 } from '@/utils/imageToBase64';
import { DeleteReportDialog } from '../reports/components/DeleteReportDialog';
import { formatAgeString } from '@/utils/dateUtils';

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
        // Calcular idade usando utilitário centralizado
        const age = formatAgeString((selectedPatient as any).birth_date, (selectedPatient as any).age);

        updateReportData({
          selectedPatientId: patientIdFromQuery,
          patientName: selectedPatient.name,
          patientAge: age,
          patientDiagnosis: 'TEA - Transtorno do Espectro Autista'
        });
      }
    }
  }, [patientIdFromQuery, patients, updateReportData]);

  const generatePDFContent = (
    reportDataForPDF: any, 
    photoBase64?: string | null, 
    stampBase64?: string | null,
    logoUrl?: string | null
  ) => {
    const fields = reportDataForPDF.fieldValues || {};
    const currentDate = new Date().toLocaleDateString('pt-BR');
    
    return `
      <div style="font-family: Arial, sans-serif; color: #000; background-color: #fff; width: 210mm; min-height: 297mm; padding: 20mm; margin: 0 auto; font-size: 12px; line-height: 1.6; box-sizing: border-box;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 2px solid #14b8a6; page-break-inside: avoid;">
          ${logoUrl ? `<img src="${logoUrl}" alt="Logo" style="max-width: 150px; margin-bottom: 15px;" />` : ''}
          <h1 style="color: #0d9488; margin: 0; font-size: 24px;">Relatorio MuseTera TEA</h1>
          <p style="color: #666; margin: 5px 0 0 0; font-size: 13px;">Musicoterapia para Transtorno do Espectro Autista</p>
        </div>

        <!-- Patient and Professional Info -->
        <div class="section-block" style="display: flex; gap: 20px; margin-bottom: 25px; padding: 16px; background: #f0fdfa; border-radius: 8px; page-break-inside: avoid;">
          <div style="flex: 1;">
            <h3 style="color: #0d9488; margin: 0 0 10px 0; font-size: 14px;">Dados do Paciente</h3>
            <p style="margin: 5px 0;"><strong>Nome:</strong> ${reportDataForPDF.patientName || 'Nao informado'}</p>
            <p style="margin: 5px 0;"><strong>Idade:</strong> ${reportDataForPDF.patientAge || 'Nao informado'}</p>
            <p style="margin: 5px 0;"><strong>Diagnostico:</strong> ${reportDataForPDF.patientDiagnosis || 'Nao informado'}</p>
          </div>
          <div style="flex: 1;">
            <h3 style="color: #0d9488; margin: 0 0 10px 0; font-size: 14px;">Dados do Profissional</h3>
            <p style="margin: 5px 0;"><strong>Nome:</strong> ${reportDataForPDF.professionalName || professionalData?.name || 'Nao informado'}</p>
            <p style="margin: 5px 0;"><strong>Registro:</strong> ${reportDataForPDF.professionalRegistry || professionalData?.register || 'Nao informado'}</p>
            <p style="margin: 5px 0;"><strong>Data:</strong> ${reportDataForPDF.sessionDate || currentDate}</p>
          </div>
        </div>

        <!-- Report Sections -->
        ${fields.therapeutic_objectives && fields.therapeutic_objectives.length > 0 ? `
          <div class="section-block" style="margin-bottom: 20px; page-break-inside: avoid; page-break-before: auto;">
            <h3 style="color: #0d9488; border-bottom: 2px solid #14b8a6; padding-bottom: 8px; margin-bottom: 12px; font-size: 14px;">Objetivos Terapeuticos</h3>
            ${Array.isArray(fields.therapeutic_objectives) ? `
              <ul style="margin: 0; padding-left: 20px;">
                ${fields.therapeutic_objectives.map((obj: string) => `<li style="margin: 6px 0; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word;">${obj}</li>`).join('')}
              </ul>
            ` : `<p style="margin: 0; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word;">${fields.therapeutic_objectives}</p>`}
          </div>
        ` : ''}

        ${fields.musical_techniques && fields.musical_techniques.length > 0 ? `
          <div class="section-block" style="margin-bottom: 20px; page-break-inside: avoid; page-break-before: auto;">
            <h3 style="color: #0d9488; border-bottom: 2px solid #14b8a6; padding-bottom: 8px; margin-bottom: 12px; font-size: 14px;">Tecnicas Musicais Utilizadas</h3>
            ${Array.isArray(fields.musical_techniques) ? `
              <ul style="margin: 0; padding-left: 20px;">
                ${fields.musical_techniques.map((tech: string) => `<li style="margin: 6px 0; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word;">${tech}</li>`).join('')}
              </ul>
            ` : `<p style="margin: 0; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word;">${fields.musical_techniques}</p>`}
          </div>
        ` : ''}

        ${fields.instruments_used && fields.instruments_used.length > 0 ? `
          <div class="section-block" style="margin-bottom: 20px; page-break-inside: avoid; page-break-before: auto;">
            <h3 style="color: #0d9488; border-bottom: 2px solid #14b8a6; padding-bottom: 8px; margin-bottom: 12px; font-size: 14px;">Instrumentos Utilizados</h3>
            ${Array.isArray(fields.instruments_used) ? `
              <ul style="margin: 0; padding-left: 20px;">
                ${fields.instruments_used.map((inst: string) => `<li style="margin: 6px 0; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word;">${inst}</li>`).join('')}
              </ul>
            ` : `<p style="margin: 0; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word;">${fields.instruments_used}</p>`}
          </div>
        ` : ''}

        ${fields.session_activities && fields.session_activities.length > 0 ? `
          <div class="section-block" style="margin-bottom: 20px; page-break-inside: avoid; page-break-before: auto;">
            <h3 style="color: #0d9488; border-bottom: 2px solid #14b8a6; padding-bottom: 8px; margin-bottom: 12px; font-size: 14px;">Atividades da Sessao</h3>
            ${Array.isArray(fields.session_activities) ? `
              <ul style="margin: 0; padding-left: 20px;">
                ${fields.session_activities.map((act: string) => `<li style="margin: 6px 0; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word;">${act}</li>`).join('')}
              </ul>
            ` : `<p style="margin: 0; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word;">${fields.session_activities}</p>`}
          </div>
        ` : ''}

        ${fields.patient_evolution && fields.patient_evolution.length > 0 ? `
          <div class="section-block" style="margin-bottom: 20px; page-break-inside: avoid; page-break-before: auto;">
            <h3 style="color: #0d9488; border-bottom: 2px solid #14b8a6; padding-bottom: 8px; margin-bottom: 12px; font-size: 14px;">Evolucao do Paciente</h3>
            ${Array.isArray(fields.patient_evolution) ? `
              <ul style="margin: 0; padding-left: 20px;">
                ${fields.patient_evolution.map((evol: string) => `<li style="margin: 6px 0; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word;">${evol}</li>`).join('')}
              </ul>
            ` : `<p style="margin: 0; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word;">${fields.patient_evolution}</p>`}
          </div>
        ` : ''}

        ${fields.recommendations && fields.recommendations.length > 0 ? `
          <div class="section-block" style="margin-bottom: 20px; page-break-inside: avoid; page-break-before: auto;">
            <h3 style="color: #0d9488; border-bottom: 2px solid #14b8a6; padding-bottom: 8px; margin-bottom: 12px; font-size: 14px;">Recomendacoes</h3>
            ${Array.isArray(fields.recommendations) ? `
              <ul style="margin: 0; padding-left: 20px;">
                ${fields.recommendations.map((rec: string) => `<li style="margin: 6px 0; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word;">${rec}</li>`).join('')}
              </ul>
            ` : `<p style="margin: 0; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word;">${fields.recommendations}</p>`}
          </div>
        ` : ''}

        ${fields.conclusion && fields.conclusion.length > 0 ? `
          <div class="section-block" style="margin-bottom: 20px; page-break-inside: avoid; page-break-before: auto;">
            <h3 style="color: #0d9488; border-bottom: 2px solid #14b8a6; padding-bottom: 8px; margin-bottom: 12px; font-size: 14px;">Conclusao</h3>
            ${Array.isArray(fields.conclusion) ? `
              <ul style="margin: 0; padding-left: 20px;">
                ${fields.conclusion.map((conc: string) => `<li style="margin: 6px 0; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word;">${conc}</li>`).join('')}
              </ul>
            ` : `<p style="margin: 0; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word;">${fields.conclusion}</p>`}
          </div>
        ` : ''}

        <!-- FOOTER TEAL -->
        <div class="section-block" style="margin-top: 25px; border: 2px solid #14b8a6; border-radius: 10px; overflow: hidden; background: #ffffff; page-break-inside: avoid; page-break-before: auto;">
          <div style="height: 4px; background: linear-gradient(90deg, #0d9488 0%, #14b8a6 50%, #06b6d4 100%);"></div>
          
          <div style="padding: 16px;">
            <div style="display: flex; gap: 16px; align-items: start;">
            
              <!-- Card de Assinatura (Esquerda) -->
              <div style="flex: 1; background: linear-gradient(135deg, #f0fdfa, #ccfbf1); border: 1px solid #14b8a6; border-radius: 8px; overflow: hidden;">
                <div style="height: 4px; background: linear-gradient(to right, #0d9488, #14b8a6, #06b6d4);"></div>
                
                <div style="padding: 12px;">
                  <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                    ${photoBase64 ? `
                      <div style="width: 48px; height: 48px; border-radius: 50%; overflow: hidden; border: 2px solid #14b8a6; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
                        <img src="${photoBase64}" style="width: 100%; height: 100%; object-fit: cover;" />
                      </div>
                    ` : ''}
                    <div style="text-align: center;">
                      <div style="font-size: 9px; font-weight: bold; color: #0f766e; margin-bottom: 6px; line-height: 1.3; word-wrap: break-word; overflow-wrap: break-word;">${professionalData?.name || 'Profissional'}</div>
                      <div style="display: inline-flex; align-items: center; gap: 3px; background: #ccfbf1; border: 1px solid #5eead4; border-radius: 10px; padding: 3px 7px; margin-bottom: 8px;">
                        <span style="color: #0f766e; font-size: 7px;">&#9835;</span>
                        <span style="font-size: 7px; font-weight: 600; color: #0f766e;">${professionalData?.specialty || 'Musicoterapeuta'}</span>
                      </div>
                      <div style="font-size: 7px; color: #374151; line-height: 1.8;">
                        ${professionalData?.register ? `<div><strong style="color: #0f766e;">Registro:</strong> ${professionalData.register}</div>` : ''}
                        ${professionalData?.email ? `<div style="word-wrap: break-word; overflow-wrap: break-word;"><strong style="color: #0f766e;">Email:</strong> ${professionalData.email}</div>` : ''}
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

              <!-- Carimbo Circular (Direita) -->
              <div style="flex: 1; display: flex; flex-direction: column; align-items: center;">
                ${stampBase64 || photoBase64 ? `
                  <div style="width: 140px; height: 140px; position: relative; display: flex; align-items: center; justify-content: center;">
                    <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; border: 2px dashed #14b8a6; opacity: 0.3;"></div>
                    <div style="position: absolute; width: 92%; height: 92%; border-radius: 50%; border: 1px solid #14b8a6; opacity: 0.5;"></div>
                    <div style="width: 120px; height: 120px; border-radius: 50%; background: linear-gradient(135deg, #f0fdfa, #ccfbf1); border: 3px solid #0d9488; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 8px; box-shadow: 0 4px 12px rgba(20,184,166,0.25);">
                      ${photoBase64 ? `
                        <div style="width: 40px; height: 40px; border-radius: 50%; overflow: hidden; border: 2px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.1); margin-bottom: 5px;">
                          <img src="${photoBase64}" style="width: 100%; height: 100%; object-fit: cover;" />
                        </div>
                      ` : ''}
                      <div style="font-size: 7px; font-weight: bold; color: #0f766e; text-align: center; margin-bottom: 3px; max-width: 90px; line-height: 1.3; word-wrap: break-word; overflow-wrap: break-word;">${professionalData?.name || 'Profissional'}</div>
                      <div style="width: 30px; height: 1px; background: linear-gradient(to right, transparent, #14b8a6, transparent); margin-bottom: 3px;"></div>
                      <div style="display: inline-flex; align-items: center; gap: 2px; background: #ccfbf1; border: 1px solid #5eead4; border-radius: 8px; padding: 2px 5px; margin-bottom: 2px;">
                        <span style="font-size: 5px; color: #0f766e;">&#9835;</span>
                        <span style="font-size: 5px; font-weight: 600; color: #0f766e; text-transform: uppercase; letter-spacing: 0.3px;">${professionalData?.specialty || 'Musicoterapeuta'}</span>
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
      </div>
    `;
  };

  const handleSaveReport = async () => {
    console.log('=== Iniciando salvamento do relatório ===');
    console.log('Professional ID:', professionalId);
    console.log('Report Data:', reportData);
    console.log('Professional Data:', professionalData);
    
    // Validação aprimorada
    if (!professionalId) {
      console.error('Professional ID não encontrado');
      toast({
        variant: "destructive",
        title: "Erro de Autenticação",
        description: "ID do profissional não encontrado. Faça logout e login novamente.",
      });
      return;
    }

    if (!reportData.selectedPatientId) {
      console.error('Paciente não selecionado');
      toast({
        variant: "destructive",
        title: "Paciente Obrigatório",
        description: "Selecione um paciente antes de salvar o relatório.",
      });
      return;
    }

    const validation = validateReport();
    if (!validation.isValid) {
      console.error('Validação falhou:', validation.missingFields);
      toast({
        variant: "destructive",
        title: "Campos Obrigatórios Não Preenchidos",
        description: `Complete: ${validation.missingFields.join(', ')}`,
      });
      return;
    }

    setIsSaving(true);
    try {
      // Verificar se o professional_id existe na tabela professionals
      const { data: professionalCheck, error: professionalError } = await supabase
        .from('professionals')
        .select('id')
        .eq('id', professionalId)
        .single();

      if (professionalError || !professionalCheck) {
        console.error('Professional não encontrado na tabela:', professionalError);
        throw new Error('Profissional não encontrado. Faça logout e login novamente.');
      }

      // Verificar se o paciente existe
      const { data: patientCheck, error: patientError } = await supabase
        .from('patients')
        .select('id')
        .eq('id', reportData.selectedPatientId)
        .single();

      if (patientError || !patientCheck) {
        console.error('Paciente não encontrado:', patientError);
        throw new Error('Paciente não encontrado. Selecione um paciente válido.');
      }

      const reportPayload = {
        patient_id: reportData.selectedPatientId,
        professional_id: professionalId,
        type: 'musicoterapia' as const,
        content: {
          template_id: reportData.templateId,
          field_values: reportData.fieldValues,
          additional_observations: reportData.additionalObservations,
          patient_info: {
            name: reportData.patientName || reportData.fieldValues?.patient_name,
            age: reportData.patientAge || reportData.fieldValues?.patient_age,
            diagnosis: reportData.patientDiagnosis || reportData.fieldValues?.patient_diagnosis
          },
          professional_info: {
            name: reportData.professionalName || professionalData?.name,
            registry: reportData.professionalRegistry || professionalData?.register || professionalData?.license_number,
            specialty: reportData.professionalSpecialty || 'Musicoterapia'
          },
          session_date: reportData.sessionDate,
          signature: reportData.signature
        }
      };

      console.log('Payload final do relatório:', JSON.stringify(reportPayload, null, 2));

      const { data, error } = await supabase
        .from('reports')
        .insert(reportPayload)
        .select()
        .single();

      if (error) {
        console.error('Erro detalhado do Supabase:', error);
        console.error('Código:', error.code);
        console.error('Mensagem:', error.message);
        console.error('Detalhes:', error.details);
        
        // Tratamento específico de erros
        if (error.code === '23503') {
          if (error.message.includes('patient_id')) {
            throw new Error('Paciente não encontrado ou inválido');
          } else if (error.message.includes('professional_id')) {
            throw new Error('Profissional não encontrado ou inválido');
          }
          throw new Error('Erro de referência de dados');
        } else if (error.code === '23502') {
          throw new Error('Campos obrigatórios não preenchidos');
        }
        
        throw new Error(`Erro no banco de dados: ${error.message}`);
      }

      console.log('Relatório salvo com sucesso:', data);

      toast({
        title: "Sucesso!",
        description: "Relatório de musicoterapia salvo com sucesso.",
      });

      loadReports();
    } catch (error) {
      console.error('=== Erro no salvamento ===');
      console.error('Erro:', error);
      console.error('Stack:', error instanceof Error ? error.stack : 'N/A');
      
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      toast({
        variant: "destructive",
        title: "Erro ao Salvar Relatório",
        description: errorMessage,
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
      // Convert images to Base64
      let photoBase64: string | null = null;
      let stampBase64: string | null = null;

      if (professionalData?.stamp_photo_url) {
        photoBase64 = await imageUrlToBase64(professionalData.stamp_photo_url);
      }
      if (professionalData?.digital_stamp_url) {
        stampBase64 = await imageUrlToBase64(professionalData.digital_stamp_url);
      }

      // Create temporary HTML element
      const tempDiv = document.createElement('div');
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      tempDiv.style.color = '#000';
      tempDiv.style.backgroundColor = '#fff';
      tempDiv.innerHTML = generatePDFContent(reportData, photoBase64, stampBase64);
      
      document.body.appendChild(tempDiv);

      // PDF configuration
      const opt = {
        margin: [10, 10],
        filename: `Relatorio_Musicoterapia_${reportData.patientName}_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'], avoid: '.section-block' }
      };

      // Generate and download PDF
      const pdfInstance = html2pdf().set(opt).from(tempDiv);
      await pdfInstance.save();
      try { const blob = await pdfInstance.outputPdf('blob'); await savePDFToStorage(blob, opt.filename, "report"); } catch(e) { console.warn("PDF não salvo no storage:", e); }
      
      document.body.removeChild(tempDiv);

      toast({
        title: "PDF gerado!",
        description: "Relatório exportado em PDF com sucesso.",
      });
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

  const handleDownloadReportPDF = async (report: any) => {
    try {
      setIsExporting(true);
      
      // 1. Reconstruct report data
      const fieldValues = report.content?.field_values || {};
      
      const reportDataForPDF = {
        templateId: report.content?.template_id || 'musicoterapia-tea',
        patientName: fieldValues.patient_name || report.content?.patient_info?.name || '',
        patientAge: fieldValues.patient_age || report.content?.patient_info?.age || '',
        patientDiagnosis: fieldValues.patient_diagnosis || report.content?.patient_info?.diagnosis || '',
        professionalName: fieldValues.professional_name || professionalData?.name || '',
        professionalRegistry: fieldValues.professional_registry || professionalData?.register || professionalData?.license_number || '',
        professionalSpecialty: fieldValues.professional_specialty || professionalData?.specialty || 'Musicoterapia',
        sessionDate: fieldValues.session_date || report.content?.session_date || '',
        fieldValues: {
          therapeutic_objectives: fieldValues.therapeutic_objectives || [],
          musical_techniques: fieldValues.musical_techniques || [],
          instruments_used: fieldValues.instruments_used || [],
          session_activities: fieldValues.session_activities || [],
          patient_evolution: fieldValues.patient_evolution || [],
          communication_scale: fieldValues.communication_scale || 1,
          social_interaction_scale: fieldValues.social_interaction_scale || 1,
          emotional_expression_scale: fieldValues.emotional_expression_scale || 1,
          motor_coordination_scale: fieldValues.motor_coordination_scale || 1,
          attention_focus_scale: fieldValues.attention_focus_scale || 1,
          sensory_responses: fieldValues.sensory_responses || [],
          recommendations: fieldValues.recommendations || [],
          home_activities: fieldValues.home_activities || [],
          conclusion: fieldValues.conclusion || [],
          digital_signature: fieldValues.digital_signature || '',
          digital_stamp: fieldValues.digital_stamp || '',
          logo_url: fieldValues.logo_url || ''
        },
        additionalObservations: fieldValues.additional_observations || report.content?.additional_observations || '',
        signature: fieldValues.digital_signature || professionalData?.name || ''
      };

      // 2. Convert images to Base64
      let photoBase64: string | null = null;
      let stampBase64: string | null = null;

      if (professionalData?.stamp_photo_url) {
        photoBase64 = await imageUrlToBase64(professionalData.stamp_photo_url);
      }
      if (professionalData?.digital_stamp_url) {
        stampBase64 = await imageUrlToBase64(professionalData.digital_stamp_url);
      }

      // 3. Create temporary HTML element
      const tempDiv = document.createElement('div');
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      tempDiv.style.color = '#000';
      tempDiv.style.backgroundColor = '#fff';
      tempDiv.innerHTML = generatePDFContent(reportDataForPDF, photoBase64, stampBase64);
      
      document.body.appendChild(tempDiv);

      // 4. PDF configuration
      const opt = {
        margin: [10, 10],
        filename: `Relatorio_Musicoterapia_${reportDataForPDF.patientName?.replace(/\s+/g, '_') || 'paciente'}_${new Date(report.created_at).toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'], avoid: '.section-block' }
      };

      // 5. Generate and download PDF
      const pdfInstance2 = html2pdf().set(opt).from(tempDiv);
      await pdfInstance2.save();
      try { const blob = await pdfInstance2.outputPdf('blob'); await savePDFToStorage(blob, opt.filename, "report"); } catch(e) { console.warn("PDF não salvo no storage:", e); }
      
      document.body.removeChild(tempDiv);
      
      toast({
        title: "PDF gerado com sucesso!",
        description: "O relatório foi baixado automaticamente.",
      });

    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        variant: "destructive",
        title: "Erro ao gerar PDF",
        description: "Ocorreu um erro inesperado.",
      });
    } finally {
      setIsExporting(false);
    }
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
    <div className="w-full max-w-full mx-auto px-0 py-0 space-y-6">
      {/* Header */}
      <Card className="border-2 border-primary/20 rounded-none sm:rounded-lg">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col space-y-4">
            {/* MOBILE: Action buttons at TOP for visibility */}
            <div className="flex flex-col space-y-2 sm:hidden">
              <Button
                variant={viewMode === 'create' ? 'default' : 'outline'}
                onClick={() => setViewMode(viewMode === 'create' ? 'list' : 'create')}
                className={`w-full ${viewMode === 'create' ? 
                  "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 border-0" :
                  "border-primary/30 hover:bg-primary/10"
                }`}
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
                <Button
                  variant="outline"
                  onClick={handleSaveReport}
                  disabled={isSaving}
                  className="w-full"
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
              )}
            </div>

            {/* Header with title and desktop buttons */}
            <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              {/* Left: Back button + Title */}
              <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                  className="w-fit"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
                
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 shrink-0">
                    <Music className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-lg sm:text-2xl flex flex-wrap items-center gap-2">
                      <span>Relatório MuseTera TEA</span>
                      <Badge variant="secondary" className="text-xs">TEA</Badge>
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Relatórios clínicos especializados
                    </CardDescription>
                  </div>
                </div>
              </div>

              {/* DESKTOP: Action buttons on right */}
              <div className="hidden sm:flex sm:flex-row sm:space-x-2">
                <Button
                  variant={viewMode === 'create' ? 'default' : 'outline'}
                  onClick={() => setViewMode(viewMode === 'create' ? 'list' : 'create')}
                  className={`${viewMode === 'create' ? 
                    "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 border-0" :
                    "border-primary/30 hover:bg-primary/10"
                  }`}
                >
                  {viewMode === 'create' ? (
                    <>
                      <List className="h-4 w-4 mr-2" />
                      Ver Relatórios
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Criar Novo
                    </>
                  )}
                </Button>

                {viewMode === 'create' && (
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
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {viewMode === 'create' ? (
        <>
          {/* Export PDF Card */}
          <Card className="border-2 border-primary/20 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-none sm:rounded-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500">
                    <Download className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      Exportar PDF
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Gere o relatório em formato PDF para impressão ou compartilhamento
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {isExporting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
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
                professionalData={professionalData}
              />
            </TabsContent>

            <TabsContent value="preview" className="space-y-6">
              <Card className="rounded-none sm:rounded-lg">
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
          <Card className="rounded-none sm:rounded-lg">
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
            <Card className="rounded-none sm:rounded-lg">
              <CardContent className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                <span className="ml-2">Carregando relatórios...</span>
              </CardContent>
            </Card>
          ) : filteredReports.length === 0 ? (
            <Card className="rounded-none sm:rounded-lg">
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
                <Card key={report.id} className="hover:shadow-lg transition-shadow rounded-none sm:rounded-lg">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                      {/* Patient info */}
                      <div className="space-y-2 min-w-0">
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <Music className="h-5 w-5 text-primary shrink-0" />
                          <h3 className="font-semibold truncate">
                            {report.patient?.name || 'Paciente não identificado'}
                          </h3>
                          <Badge variant="secondary" className="text-xs shrink-0">Musicoterapia</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Criado em {new Date(report.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      
                      {/* Action buttons - grid on mobile, flex on desktop */}
                      <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:space-x-2 sm:shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedReport(report);
                            setShowViewDialog(true);
                          }}
                          className="text-xs sm:text-sm"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditReport(report)}
                          className="text-xs sm:text-sm"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadReportPDF(report)}
                          disabled={isExporting}
                          className="text-xs sm:text-sm"
                        >
                          {isExporting ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-1" />
                          ) : (
                            <Download className="h-4 w-4 mr-1" />
                          )}
                          PDF
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(report)}
                          className="text-xs sm:text-sm text-destructive hover:text-destructive"
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
      <Card className="rounded-none sm:rounded-lg">
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
            <DialogDescription>
              Prévia completa do relatório de musicoterapia salvo
            </DialogDescription>
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