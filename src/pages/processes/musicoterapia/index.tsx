import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Music, FileText, Wand2, Download, Save, ArrowLeft, Brain, List, Eye, Edit, Trash2, Search, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MusicoterapiaReportWizard } from '@/components/musicoterapia/MusicoterapiaReportWizard';
import { MusicoterapiaPreview } from '@/components/musicoterapia/MusicoterapiaPreview';
import { useMusicoterapiaReport } from '@/hooks/useMusicoterapiaReport';
import { musicoterapiaTemplate, scaleFieldIds } from '@/data/musicoterapiaTemplate';
import { getSelectedMusicoterapiaObjectives, musicoterapiaObjectiveCategories } from '@/data/musicoterapiaObjectives';
import { getSelectedMusicoterapiaApproaches } from '@/data/musicoterapiaApproaches';
import { getRecordedApproachResults } from '@/data/musicoterapiaApproachResults';
import { renderRecordedResultsPdf } from '@/utils/renderRecordedResultsPdf';
import { renderObjectiveFlowPdf } from '@/utils/renderObjectiveFlowPdf';
import { renderMusicoterapiaReferencesPdf } from '@/utils/renderMusicoterapiaReferencesPdf';
import { renderMusicoterapiaFinalConsiderationsPdf } from '@/utils/renderMusicoterapiaFinalConsiderationsPdf';
import { getSelectedMusicoterapiaReferences } from '@/data/musicoterapiaReferences';
import { savePDFToStorage } from '@/utils/pdfStorageUtils';
import { useReportData } from '../report/hooks/useReportData';
import html2pdf from 'html2pdf.js';
import { imageUrlToBase64 } from '@/utils/imageToBase64';
import { DeleteReportDialog } from '../reports/components/DeleteReportDialog';
import { formatAgeString } from '@/utils/dateUtils';
import { mapAnamnesisToMusicoterapia } from '@/utils/musicoterapiaAnamnesisMapping';

export default function MusicoterapiaPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('wizard');
  const [viewMode, setViewMode] = useState<'create' | 'list'>('create');
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [reportLogoUrl, setReportLogoUrl] = useState<string | null>(null);
  const [sourceReportId, setSourceReportId] = useState<string | null>(null);
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
    generateNarrative,
    isGeneratingWithAI,
    validateReport,
    template,
    professionalData
  } = useMusicoterapiaReport();

  const { patients, isLoadingPatients, userId } = useReportData();
  const [professionalId, setProfessionalId] = useState<string | null>(null);
  const [anamnesisStatus, setAnamnesisStatus] = useState<'idle' | 'loading' | 'loaded' | 'empty' | 'error'>('idle');
  const anamnesisRequestRef = React.useRef(0);
  const autoSelectedQueryRef = React.useRef<string | null>(null);

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

  // Ao trocar de paciente, limpar o rascunho clínico anterior antes de importar
  // dados da anamnese. A última consulta é a única autorizada a atualizar o estado.
  const selectPatientWithAnamnesis = React.useCallback(async (patientId: string) => {
    const requestId = ++anamnesisRequestRef.current;
    if (!patientId || patientId === 'manual') {
      updateReportData({
        selectedPatientId: '',
        patientName: '',
        patientAge: '',
        patientBirthDate: '',
        patientGuardian: '',
        patientDiagnosis: '',
        fieldValues: {}
      });
      setAnamnesisStatus('idle');
      setSourceReportId(null);
      return;
    }

    const patient = patients.find((item) => item.id === patientId);
    if (!patient) return;

    // Uma nova seleção começa um novo relatório. Não reaproveitar objetivos,
    // evoluções ou qualquer outro dado pertencente ao paciente anterior.
    updateReportData({
      selectedPatientId: patientId,
      patientName: patient.name,
      patientAge: formatAgeString(patient.birth_date, patient.age),
      patientBirthDate: patient.birth_date || '',
      patientGuardian: patient.responsible || '',
      patientDiagnosis: '',
      fieldValues: {},
      additionalObservations: ''
    });
    setSourceReportId(null);
    setAnamnesisStatus('loading');

    if (!userId) {
      if (requestId === anamnesisRequestRef.current) setAnamnesisStatus('error');
      return;
    }

    try {
      // A anamnese pertence ao mesmo paciente e ao profissional autenticado.
      // O banco deve aplicar suas políticas de acesso (RLS) normalmente.
      const { data, error } = await supabase
        .from('anamnesis')
        .select('*')
        .eq('patient_id', patientId)
        .eq('professional_id', userId)
        .order('updated_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (requestId !== anamnesisRequestRef.current) return;
      if (error) throw error;

      if (!data) {
        setAnamnesisStatus('empty');
        return;
      }

      const mapped = mapAnamnesisToMusicoterapia(data);
      updateReportData((previous) => {
        if (previous.selectedPatientId !== patientId) return {};
        // Os valores já digitados enquanto a consulta estava em andamento
        // têm prioridade, evitando substituições silenciosas.
        const available = Object.fromEntries(
          Object.entries(mapped.fieldValues).filter(([key]) => {
            const current = previous.fieldValues?.[key];
            return current === undefined || current === null || current === '';
          })
        );
        return {
          ...(!previous.patientGuardian?.trim() && mapped.patientGuardian
            ? { patientGuardian: mapped.patientGuardian } : {}),
          ...(!previous.patientDiagnosis?.trim() && mapped.patientDiagnosis
            ? { patientDiagnosis: mapped.patientDiagnosis } : {}),
          fieldValues: { ...previous.fieldValues, ...available }
        };
      });
      setAnamnesisStatus('loaded');
    } catch {
      if (requestId !== anamnesisRequestRef.current) return;
      // Nunca registrar ou exibir o conteúdo da anamnese no console.
      setAnamnesisStatus('error');
      toast({
        variant: 'destructive',
        title: 'Anamnese não carregada',
        description: 'O paciente foi selecionado, mas não foi possível carregar a anamnese. Você pode preencher os dados manualmente.'
      });
    }
  }, [patients, userId, updateReportData, toast]);

  React.useEffect(() => {
    if (!patientIdFromQuery || patients.length === 0 || !userId) return;
    if (autoSelectedQueryRef.current === patientIdFromQuery) return;
    if (!patients.some((patient) => patient.id === patientIdFromQuery)) return;
    autoSelectedQueryRef.current = patientIdFromQuery;
    void selectPatientWithAnamnesis(patientIdFromQuery);
  }, [patientIdFromQuery, patients, userId, selectPatientWithAnamnesis]);

  const generatePDFContent = (
    reportDataForPDF: any, 
    photoBase64?: string | null, 
    stampBase64?: string | null,
    logoUrl?: string | null,
    narrative?: { title: string; content: string }[] | null
  ) => {
    const fields = reportDataForPDF.fieldValues || {};
    const selectedGoals = getSelectedMusicoterapiaObjectives(fields.therapeutic_objective_ids);
    const selectedApproaches = getSelectedMusicoterapiaApproaches(fields.musicoterapia_approach_ids);
    const selectedReferences = getSelectedMusicoterapiaReferences(fields.musicoterapia_reference_ids);
    const recordedResults = getRecordedApproachResults(fields.musicoterapia_approach_ids, fields.approach_results);
    // Manter informações de relatórios anteriores sem repetir a antiga Etapa 04 nos novos.
    const isLegacyReport = selectedApproaches.length === 0;
    const currentDate = new Date().toLocaleDateString('pt-BR');

    const escapeHtml = (s: string) =>
      String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    // A Etapa 08 é a conclusão oficial dos relatórios estruturados.
    // Evitar uma segunda conclusão/prognóstico gerados pela narrativa de IA.
    const narrativeSections = (narrative || []).filter((section) => {
      if (isLegacyReport) return true;
      const normalizedTitle = String(section.title || '')
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      return !/(consideracoes finais|conclusao|prognostico)/.test(normalizedTitle);
    });
    const narrativeBlock = narrativeSections.length > 0 ? `
      <div class="section-block" style="margin-bottom: 25px; border: 2px solid #14b8a6; border-radius: 10px; overflow: hidden; background: #ffffff; page-break-inside: auto;">
        <div style="background: linear-gradient(135deg, #0d9488 0%, #14b8a6 60%, #06b6d4 100%); color: white; padding: 12px 16px;">
          <h2 style="margin: 0; font-size: 16px; font-weight: 700; letter-spacing: 0.3px;">Relatório de Evolução Musicoterapêutica</h2>
          
        </div>
        <div style="padding: 16px 18px;">
          ${narrativeSections.map((sec) => `
            <div style="margin-bottom: 16px; page-break-inside: avoid;">
              <h3 style="color: #0d9488; margin: 0 0 6px 0; font-size: 13px; border-bottom: 1px solid #99f6e4; padding-bottom: 4px;">${escapeHtml(sec.title)}</h3>
              ${String(sec.content).split(/\n{2,}/).map((p) => p.trim()).filter(Boolean).map((p) =>
                `<p style="margin: 0 0 8px 0; font-size: 11.5px; line-height: 1.7; text-align: justify; color: #1f2937; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word;">${escapeHtml(p)}</p>`
              ).join('')}
            </div>
          `).join('')}
        </div>
      </div>
    ` : '';

    
    return `
      <div style="font-family: Arial, sans-serif; color: #000; background-color: #fff; width: 210mm; min-height: 297mm; padding: 20mm; margin: 0 auto; font-size: 12px; line-height: 1.6; box-sizing: border-box;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 2px solid #14b8a6; page-break-inside: avoid;">
          ${logoUrl ? `<img src="${escapeHtml(logoUrl)}" alt="Logo" style="max-width: 150px; margin-bottom: 15px;" />` : ''}
          <h1 style="color: #0d9488; margin: 0; font-size: 24px;">Relatorio MuseTera TEA</h1>
          <p style="color: #666; margin: 5px 0 0 0; font-size: 13px;">Musicoterapia para Transtorno do Espectro Autista</p>
        </div>

        ${(() => {
          const formatDateBR = (d: any) => {
            if (!d) return '';
            const s = String(d);
            const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
            if (m) return `${m[3]}/${m[2]}/${m[1]}`;
            return s;
          };
          const row = (label: string, value: any) =>
            value && String(value).trim()
              ? `<p style="margin: 4px 0;"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(String(value))}</p>`
              : '';
          const patientRows = [
            row('Nome completo', reportDataForPDF.patientName),
            row('Data de nascimento', formatDateBR(reportDataForPDF.patientBirthDate)),
            row('Idade', reportDataForPDF.patientAge),
            row('Diagnóstico clínico', reportDataForPDF.patientDiagnosis),
            row('CID', fields.cid_code),
            row('Responsável', reportDataForPDF.patientGuardian),
            row('Início dos atendimentos', formatDateBR(fields.treatment_start_date)),
            row('Período avaliado', fields.evaluation_period),
            row('Fonte do diagnóstico informado', fields.diagnosis_source),
            row('Frequência dos atendimentos', fields.session_frequency),
          ].filter(Boolean).join('');
          const proRows = [
            row('Musicoterapeuta', reportDataForPDF.professionalName || professionalData?.name),
            row('Registro profissional', reportDataForPDF.professionalRegistry || professionalData?.register),
            row('Especialidade', reportDataForPDF.professionalSpecialty || professionalData?.specialty),
            row('Data do relatório', reportDataForPDF.sessionDate || currentDate),
          ].filter(Boolean).join('');
          return `
        <div class="section-block" style="margin-bottom: 25px; padding: 16px; background: #f0fdfa; border-radius: 8px; page-break-inside: avoid;">
          <h2 style="color: #0d9488; margin: 0 0 12px 0; font-size: 15px; border-bottom: 2px solid #14b8a6; padding-bottom: 6px;">1. Identificação do Paciente</h2>
          <div style="display: flex; gap: 20px;">
            <div style="flex: 1; font-size: 12px;">
              ${patientRows || '<p style="margin: 4px 0;">Não informado</p>'}
            </div>
            <div style="flex: 1; font-size: 12px; border-left: 1px solid #99f6e4; padding-left: 16px;">
              <h3 style="color: #0d9488; margin: 0 0 8px 0; font-size: 13px;">Profissional Responsável</h3>
              ${proRows || '<p style="margin: 4px 0;">Não informado</p>'}
            </div>
          </div>
        </div>`;
        })()}

        <!-- AI Clinical Narrative -->
        ${narrativeBlock}

        <!-- Objetivos planejados: jamais indicar como resultados adquiridos -->
        ${selectedGoals.length > 0 ? `
          <div class="section-block" style="margin-bottom: 20px; page-break-inside: auto;">
            <h3 style="color: #0d9488; border-bottom: 2px solid #14b8a6; padding-bottom: 8px; margin-bottom: 12px; font-size: 14px;">Objetivos Terapêuticos Priorizados</h3>
            <p style="margin: 0 0 10px; font-size: 10px; color: #64748b;">Habilidades que serão estimuladas ou desenvolvidas ao longo do acompanhamento musicoterapêutico. A seleção não implica aquisição da habilidade.</p>
            ${musicoterapiaObjectiveCategories.map((category) => {
              const objectives = selectedGoals.filter((goal) => goal.category === category.id);
              if (objectives.length === 0) return '';
              return `
                <div style="margin-bottom: 12px; page-break-inside: auto;">
                  <h4 style="font-size: 11px; color: #0d9488; font-weight: 700; margin: 9px 0 6px; padding-bottom: 3px; border-bottom: 1px solid #99f6e4;">${escapeHtml(category.title)}</h4>
                  <ol style="margin: 0; padding-left: 20px; font-size: 11px;">
                    ${objectives.map((goal) => `<li style="margin: 0 0 9px; line-height: 1.6; page-break-inside: avoid;"><strong style="color: #0f766e;">${escapeHtml(goal.title)}:</strong> ${escapeHtml(goal.objective)}</li>`).join('')}
                  </ol>
                </div>
              `;
            }).join('')}
          </div>
        ` : ''}

        <!-- Abordagem Musicoterapêutica: seleção efetiva do profissional na Etapa 03 -->
        ${selectedApproaches.length > 0 ? `
          <div class="section-block" style="margin-bottom: 20px; page-break-inside: auto;">
            <h3 style="color: #0d9488; border-bottom: 2px solid #14b8a6; padding-bottom: 8px; margin-bottom: 12px; font-size: 14px;">Abordagem Musicoterapêutica</h3>
            <p style="margin: 0 0 10px; font-size: 10px; color: #64748b;">Abordagens indicadas pelo profissional no planejamento ou condução da musicoterapia. A seleção não equivale a comprovação de aplicação, formação ou resultado clínico.</p>
            <ol style="margin: 0; padding-left: 20px; font-size: 11px; line-height: 1.65;">
              ${selectedApproaches.map((approach) => `
                <li style="margin: 0 0 12px; page-break-inside: avoid; overflow-wrap: break-word;">
                  <strong style="color: #0f766e;">${escapeHtml(approach.title)}</strong>
                  <div>${escapeHtml(approach.description)}</div>
                  <div><strong>Objetivos possíveis:</strong> ${escapeHtml(approach.goals)}</div>
                  ${approach.clinicalNote ? `<div style="color: #64748b; font-size: 10px;"><strong>Nota clínica:</strong> ${escapeHtml(approach.clinicalNote)}</div>` : ''}
                </li>
              `).join('')}
            </ol>
          </div>
        ` : ''}

        ${recordedResults.length ? renderRecordedResultsPdf(recordedResults, escapeHtml) : ''}
        ${renderObjectiveFlowPdf(fields.therapeutic_objective_ids, fields.objective_outcomes, escapeHtml)}

        <!-- Report Sections (dados complementares) -->
        ${selectedGoals.length === 0 && fields.therapeutic_objectives && fields.therapeutic_objectives.length > 0 ? `
          <div class="section-block" style="margin-bottom: 20px; page-break-inside: avoid; page-break-before: auto;">
            <h3 style="color: #0d9488; border-bottom: 2px solid #14b8a6; padding-bottom: 8px; margin-bottom: 12px; font-size: 14px;">Objetivos Complementares</h3>
            ${Array.isArray(fields.therapeutic_objectives) ? `
              <ul style="margin: 0; padding-left: 20px;">
                ${fields.therapeutic_objectives.map((obj: string) => `<li style="margin: 6px 0; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word;" >${escapeHtml(String(obj))}</li>`).join('')}
              </ul>
            ` : `<p style="margin: 0; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word;" >${escapeHtml(String(fields.therapeutic_objectives))}</p>`}
          </div>
        ` : ''}

        ${selectedGoals.length === 0 && fields.specific_goals && String(fields.specific_goals).trim() ? `
          <div class="section-block" style="margin-bottom: 20px; page-break-inside: auto;">
            <h3 style="color: #0d9488; border-bottom: 2px solid #14b8a6; padding-bottom: 8px; margin-bottom: 12px; font-size: 14px;">Metas Específicas Individualizadas</h3>
            <p style="margin: 0; white-space: pre-wrap; overflow-wrap: break-word; font-size: 11px; line-height: 1.6;">${escapeHtml(Array.isArray(fields.specific_goals) ? fields.specific_goals.join('\\n') : String(fields.specific_goals))}</p>
          </div>
        ` : ''}

        ${fields.musical_techniques && fields.musical_techniques.length > 0 ? `
          <div class="section-block" style="margin-bottom: 20px; page-break-inside: avoid; page-break-before: auto;">
            <h3 style="color: #0d9488; border-bottom: 2px solid #14b8a6; padding-bottom: 8px; margin-bottom: 12px; font-size: 14px;">Tecnicas Musicais Utilizadas</h3>
            ${Array.isArray(fields.musical_techniques) ? `
              <ul style="margin: 0; padding-left: 20px;">
                ${fields.musical_techniques.map((tech: string) => `<li style="margin: 6px 0; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word;" >${escapeHtml(String(tech))}</li>`).join('')}
              </ul>
            ` : `<p style="margin: 0; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word;" >${escapeHtml(String(fields.musical_techniques))}</p>`}
          </div>
        ` : ''}

        ${fields.instruments_used && fields.instruments_used.length > 0 ? `
          <div class="section-block" style="margin-bottom: 20px; page-break-inside: avoid; page-break-before: auto;">
            <h3 style="color: #0d9488; border-bottom: 2px solid #14b8a6; padding-bottom: 8px; margin-bottom: 12px; font-size: 14px;">Instrumentos Utilizados</h3>
            ${Array.isArray(fields.instruments_used) ? `
              <ul style="margin: 0; padding-left: 20px;">
                ${fields.instruments_used.map((inst: string) => `<li style="margin: 6px 0; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word;" >${escapeHtml(String(inst))}</li>`).join('')}
              </ul>
            ` : `<p style="margin: 0; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word;" >${escapeHtml(String(fields.instruments_used))}</p>`}
          </div>
        ` : ''}

        ${isLegacyReport && fields.session_activities && fields.session_activities.length > 0 ? `
          <div class="section-block" style="margin-bottom: 20px; page-break-inside: avoid; page-break-before: auto;">
            <h3 style="color: #0d9488; border-bottom: 2px solid #14b8a6; padding-bottom: 8px; margin-bottom: 12px; font-size: 14px;">Atividades da Sessao</h3>
            ${Array.isArray(fields.session_activities) ? `
              <ul style="margin: 0; padding-left: 20px;">
                ${fields.session_activities.map((act: string) => `<li style="margin: 6px 0; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word;" >${escapeHtml(String(act))}</li>`).join('')}
              </ul>
            ` : `<p style="margin: 0; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word;" >${escapeHtml(String(fields.session_activities))}</p>`}
          </div>
        ` : ''}

        ${isLegacyReport && fields.patient_evolution && fields.patient_evolution.length > 0 ? `
          <div class="section-block" style="margin-bottom: 20px; page-break-inside: avoid; page-break-before: auto;">
            <h3 style="color: #0d9488; border-bottom: 2px solid #14b8a6; padding-bottom: 8px; margin-bottom: 12px; font-size: 14px;">Evolucao do Paciente</h3>
            ${Array.isArray(fields.patient_evolution) ? `
              <ul style="margin: 0; padding-left: 20px;">
                ${fields.patient_evolution.map((evol: string) => `<li style="margin: 6px 0; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word;" >${escapeHtml(String(evol))}</li>`).join('')}
              </ul>
            ` : `<p style="margin: 0; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word;" >${escapeHtml(String(fields.patient_evolution))}</p>`}
          </div>
        ` : ''}

        ${fields.recommendations && fields.recommendations.length > 0 ? `
          <div class="section-block" style="margin-bottom: 20px; page-break-inside: avoid; page-break-before: auto;">
            <h3 style="color: #0d9488; border-bottom: 2px solid #14b8a6; padding-bottom: 8px; margin-bottom: 12px; font-size: 14px;">Recomendacoes</h3>
            ${Array.isArray(fields.recommendations) ? `
              <ul style="margin: 0; padding-left: 20px;">
                ${fields.recommendations.map((rec: string) => `<li style="margin: 6px 0; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word;" >${escapeHtml(String(rec))}</li>`).join('')}
              </ul>
            ` : `<p style="margin: 0; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word;" >${escapeHtml(String(fields.recommendations))}</p>`}
          </div>
        ` : ''}

        ${isLegacyReport && fields.conclusion && fields.conclusion.length > 0 ? `
          <div class="section-block" style="margin-bottom: 20px; page-break-inside: avoid; page-break-before: auto;">
            <h3 style="color: #0d9488; border-bottom: 2px solid #14b8a6; padding-bottom: 8px; margin-bottom: 12px; font-size: 14px;">Conclusao</h3>
            ${Array.isArray(fields.conclusion) ? `
              <ul style="margin: 0; padding-left: 20px;">
                ${fields.conclusion.map((conc: string) => `<li style="margin: 6px 0; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word;" >${escapeHtml(String(conc))}</li>`).join('')}
              </ul>
            ` : `<p style="margin: 0; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word;" >${escapeHtml(String(fields.conclusion))}</p>`}
          </div>
        ` : ''}

        ${!isLegacyReport ? renderMusicoterapiaFinalConsiderationsPdf(fields, escapeHtml) : ''}

        ${(() => {
          // ===== SEÇÕES CLÍNICAS EXPANDIDAS =====
          const renderField = (id: string) => {
            const value = fields[id];
            if (value === undefined || value === null || value === '') return '';
            const fieldDef = (musicoterapiaTemplate.fields as any[]).find((f) => f.id === id);
            const label = fieldDef?.label || id;
            if (fieldDef?.type === 'scale') {
              const n = Number(value);
              if (!n) return '';
              const pct = Math.max(0, Math.min(100, (n / 10) * 100));
              const color = n >= 8 ? '#10b981' : n >= 6 ? '#f59e0b' : n >= 4 ? '#f97316' : '#ef4444';
              return `<div style="margin: 8px 0;">
                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 3px;">
                  <strong style="color: #0f766e;">${escapeHtml(label)}</strong>
                  <span style="font-weight: bold; color: ${color};">${n}/10</span>
                </div>
                <div style="background: #e5e7eb; border-radius: 6px; height: 8px; overflow: hidden;">
                  <div style="width: ${pct}%; height: 100%; background: ${color};"></div>
                </div>
              </div>`;
            }
            const text = Array.isArray(value) ? value.join(', ') : String(value);
            if (!text.trim()) return '';
            return `<div style="margin: 8px 0;">
              <strong style="color: #0f766e; font-size: 11px;">${label}:</strong>
              <p style="margin: 3px 0 0 0; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word; font-size: 11px;">${escapeHtml(text)}</p>
            </div>`;
          };

          const renderSection = (title: string, ids: string[]) => {
            const content = ids.map(renderField).join('');
            if (!content.trim()) return '';
            return `<div class="section-block" style="margin-bottom: 20px; page-break-inside: avoid;">
              <h3 style="color: #0d9488; border-bottom: 2px solid #14b8a6; padding-bottom: 8px; margin-bottom: 12px; font-size: 14px;">${escapeHtml(title)}</h3>
              ${content}
            </div>`;
          };

          // Resumo Quantitativo (tabela com todas as escalas preenchidas)
          const filledScales = scaleFieldIds
            .map((id) => {
              const v = Number(fields[id]);
              if (!v) return null;
              const fd = (musicoterapiaTemplate.fields as any[]).find((f) => f.id === id);
              return { label: fd?.label || id, value: v };
            })
            .filter(Boolean) as { label: string; value: number }[];

          const scalesTable = filledScales.length > 0 ? `
            <div class="section-block" style="margin-bottom: 20px; page-break-inside: avoid;">
              <h3 style="color: #0d9488; border-bottom: 2px solid #14b8a6; padding-bottom: 8px; margin-bottom: 12px; font-size: 14px;">Indicadores observacionais registrados (1 a 10)</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
                <thead>
                  <tr style="background: #f0fdfa;">
                    <th style="text-align: left; padding: 6px; border: 1px solid #99f6e4; color: #0f766e;">Domínio / Indicador</th>
                    <th style="text-align: center; padding: 6px; border: 1px solid #99f6e4; color: #0f766e; width: 80px;">Pontuação</th>
                    <th style="text-align: center; padding: 6px; border: 1px solid #99f6e4; color: #0f766e; width: 90px;">Faixa</th>
                  </tr>
                </thead>
                <tbody>
                  ${filledScales.map((s) => {
                    const cls = s.value >= 8 ? '8–10' : s.value >= 6 ? '6–7' : s.value >= 4 ? '4–5' : '1–3';
                    const color = s.value >= 8 ? '#10b981' : s.value >= 6 ? '#f59e0b' : s.value >= 4 ? '#f97316' : '#ef4444';
                    return `<tr>
                      <td style="padding: 6px; border: 1px solid #e5e7eb;">${escapeHtml(s.label)}</td>
                      <td style="padding: 6px; border: 1px solid #e5e7eb; text-align: center; font-weight: bold; color: ${color};">${s.value}/10</td>
                      <td style="padding: 6px; border: 1px solid #e5e7eb; text-align: center; color: ${color};">${cls}</td>
                    </tr>`;
                  }).join('')}
                </tbody>
              </table>
              <p style="margin: 8px 0 0; color: #64748b; font-size: 9px;">Pontuações de acompanhamento clínico informadas pelo profissional; não representam, isoladamente, diagnóstico ou escala psicométrica validada.</p>
            </div>
          ` : '';

          // Sumário executivo
          const execItems: string[] = [];
          if (fields.cid_code) execItems.push(`<strong>Classificação diagnóstica informada:</strong> ${escapeHtml(String(fields.cid_code))}`);
          if (fields.support_level) execItems.push(`<strong>Nível de Suporte:</strong> ${escapeHtml(String(fields.support_level))}`);
          if (fields.session_count) execItems.push(`<strong>Sessões realizadas:</strong> ${escapeHtml(String(fields.session_count))}`);
          if (fields.session_frequency) execItems.push(`<strong>Frequência:</strong> ${escapeHtml(String(fields.session_frequency))}`);
          if (fields.revaluation_date) execItems.push(`<strong>Próxima reavaliação:</strong> ${escapeHtml(String(fields.revaluation_date))}`);
          const execSummary = execItems.length > 0 ? `
            <div class="section-block" style="margin-bottom: 20px; padding: 12px 16px; background: linear-gradient(135deg, #f0fdfa, #ecfeff); border-left: 4px solid #0d9488; border-radius: 6px; page-break-inside: avoid;">
              <h3 style="color: #0d9488; margin: 0 0 8px 0; font-size: 13px;">Sumário Executivo</h3>
              <div style="display: flex; flex-wrap: wrap; gap: 12px; font-size: 11px;">
                ${execItems.map((i) => `<span>${i}</span>`).join('')}
              </div>
            </div>
          ` : '';

          return `
            ${execSummary}
            ${renderSection('Identificação Clínica', ['evaluation_period','diagnosis_source','cid_code','support_level','comorbidities','current_medications','mother_name','father_name','family_relationship','diagnosis_date','clinical_details','medication_schedule','medication_effects','calming_strategies','family_support_network','treatment_start_date','session_count','session_frequency','session_duration'])}
            ${renderSection('Motivo do Encaminhamento', ['referral_source','referral_reason'])}
            ${renderSection('Identidade Sonora (ISO de Benenzon)', ['iso_gestational','iso_universal','iso_cultural','iso_complementary','iso_group','sound_preferences','musical_repertoire_favorites'])}
            ${renderSection('Avaliação Sensório-Musical', ['auditory_processing','sound_tolerance','vestibular_response_music','tactile_instrument_response','proprioceptive_response','sensory_seeking_vs_avoiding','sensory_profile_notes'])}
            ${isLegacyReport ? renderSection('Indicadores Musicoterapêuticos - Pontuações Observacionais', ['domain_musicality','domain_communication_verbal','domain_communication_nonverbal','domain_social_interaction','domain_emotional','domain_cognitive','domain_motor_gross','domain_motor_fine','domain_sensory_integration','domain_autonomy','domain_evidences']) : ''}
            ${selectedApproaches.length === 0 ? renderSection('Detalhamento Clínico da Sessão', ['session_setting','session_structure','improvisation_use','receptive_techniques','recreative_techniques','compositional_techniques','tempo_dynamics_used','vocal_work']) : ''}
            ${isLegacyReport ? renderSection('Comunicação e Linguagem', ['vocalizations_observed','verbal_output_during_music','echolalia_musical','aac_use','pragmatic_skills']) : ''}
            ${renderSection('Matriz de Evidências Musicoterapêuticas', ['baseline_observation','current_observation','measurement_method','assistance_level','observation_context','report_limitations'])}
            ${isLegacyReport ? renderSection('Evolução Clínica Detalhada', ['evolution_compared_baseline','goals_achieved','goals_in_progress','goals_not_achieved','quantitative_indicators']) : renderSection('Síntese dos Resultados', ['goals_achieved','goals_in_progress','quantitative_indicators'])}
            ${isLegacyReport ? renderSection('Plano Terapêutico Futuro', ['next_objectives_short','next_objectives_medium','next_objectives_long','proposed_interventions','expected_outcomes','revaluation_date']) : ''}
            ${isLegacyReport ? renderSection('Orientações Ampliadas', ['school_recommendations','interdisciplinary_team_notes','playlist_recommended','red_flags_to_monitor']) : ''}
            ${scalesTable}
            ${(() => {
              const tf = selectedApproaches.length === 0 ? (fields.theoretical_framework || '').toString().trim() : '';
              const at = selectedApproaches.length === 0 ? (fields.assessment_tools_used || '').toString().trim() : '';
              const rc = isLegacyReport && selectedReferences.length === 0 ? (fields.references_cited || '').toString().trim() : '';
              if (!tf && !at && !rc) return '';
              const formatList = (txt: string) => {
                const items = txt.split(/\n+/).map(s => s.replace(/^[-•\d.\)\s]+/, '').trim()).filter(Boolean);
                if (items.length <= 1) return `<p style="margin: 0; white-space: pre-wrap; font-size: 11px; line-height: 1.6; color: #1f2937;">${escapeHtml(txt)}</p>`;
                return `<ul style="margin: 0; padding-left: 18px; font-size: 11px; line-height: 1.7; color: #1f2937;">${items.map(i => `<li style="margin: 4px 0;">${escapeHtml(i)}</li>`).join('')}</ul>`;
              };
              return `
                <div class="section-block" style="margin-bottom: 20px; page-break-inside: avoid; border: 2px solid #14b8a6; border-radius: 10px; overflow: hidden; background: #ffffff;">
                  <div style="background: linear-gradient(135deg, #0d9488 0%, #14b8a6 60%, #06b6d4 100%); color: white; padding: 12px 16px;">
                    <h3 style="margin: 0; font-size: 14px; font-weight: 700; letter-spacing: 0.3px;">Fundamentação Teórica e Referências Científicas</h3>
                    <p style="margin: 4px 0 0 0; font-size: 10px; opacity: 0.92;">Base científica que sustenta a conduta clínica musicoterapêutica</p>
                  </div>
                  <div style="padding: 14px 16px;">
                    ${tf ? `
                      <div style="margin-bottom: 14px; padding: 10px 12px; background: #f0fdfa; border-left: 4px solid #0d9488; border-radius: 4px;">
                        <div style="font-size: 11px; font-weight: 700; color: #0f766e; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Abordagem Teórica</div>
                        ${formatList(tf)}
                      </div>
                    ` : ''}
                    ${at ? `
                      <div style="margin-bottom: 14px; padding: 10px 12px; background: #ecfeff; border-left: 4px solid #06b6d4; border-radius: 4px;">
                        <div style="font-size: 11px; font-weight: 700; color: #0e7490; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Instrumentos de Avaliação Utilizados</div>
                        ${formatList(at)}
                      </div>
                    ` : ''}
                    ${rc ? `
                      <div style="padding: 10px 12px; background: #f8fafc; border-left: 4px solid #64748b; border-radius: 4px;">
                        <div style="font-size: 11px; font-weight: 700; color: #334155; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Referências Bibliográficas</div>
                        ${formatList(rc)}
                      </div>
                    ` : ''}
                    <div style="margin-top: 12px; padding-top: 10px; border-top: 1px dashed #cbd5e1; font-size: 9px; color: #64748b; text-align: center; font-style: italic;">
                      Referências e instrumentos informados pelo profissional. A avaliação musicoterapêutica não substitui o diagnóstico clínico.
                    </div>
                  </div>
                </div>
              `;
            })()}
            ${renderMusicoterapiaReferencesPdf(fields.musicoterapia_reference_ids, escapeHtml)}
          `;
        })()}

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
                      <div style="font-size: 9px; font-weight: bold; color: #0f766e; margin-bottom: 6px; line-height: 1.3; word-wrap: break-word; overflow-wrap: break-word;">${escapeHtml(professionalData?.name || 'Profissional')}</div>
                      <div style="display: inline-flex; align-items: center; gap: 3px; background: #ccfbf1; border: 1px solid #5eead4; border-radius: 10px; padding: 3px 7px; margin-bottom: 8px;">
                        <span style="color: #0f766e; font-size: 7px;">&#9835;</span>
                        <span style="font-size: 7px; font-weight: 600; color: #0f766e;">${escapeHtml(professionalData?.specialty || 'Musicoterapeuta')}</span>
                      </div>
                      <div style="font-size: 7px; color: #374151; line-height: 1.8;">
                        ${professionalData?.register ? `<div><strong style="color: #0f766e;">Registro:</strong> ${escapeHtml(professionalData.register)}</div>` : ''}
                        ${professionalData?.email ? `<div style="word-wrap: break-word; overflow-wrap: break-word;"><strong style="color: #0f766e;">Email:</strong> ${escapeHtml(professionalData.email)}</div>` : ''}
                        ${professionalData?.phone ? `<div><strong style="color: #0f766e;">Telefone:</strong> ${escapeHtml(professionalData.phone)}</div>` : ''}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div style="border-top: 1px solid #5eead4; background: linear-gradient(to right, #f0fdfa, #ecfeff, #f0fdfa); padding: 7px;">
                  <div style="display: flex; align-items: center; justify-content: center; gap: 4px;">
                    <span style="color: #0d9488; font-size: 8px;">&#10004;</span>
                    <span style="font-size: 6px; font-weight: 600; color: #0f766e;">Identificação do profissional responsável</span>
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
                      <div style="font-size: 7px; font-weight: bold; color: #0f766e; text-align: center; margin-bottom: 3px; max-width: 90px; line-height: 1.3; word-wrap: break-word; overflow-wrap: break-word;">${escapeHtml(professionalData?.name || 'Profissional')}</div>
                      <div style="width: 30px; height: 1px; background: linear-gradient(to right, transparent, #14b8a6, transparent); margin-bottom: 3px;"></div>
                      <div style="display: inline-flex; align-items: center; gap: 2px; background: #ccfbf1; border: 1px solid #5eead4; border-radius: 8px; padding: 2px 5px; margin-bottom: 2px;">
                        <span style="font-size: 5px; color: #0f766e;">&#9835;</span>
                        <span style="font-size: 5px; font-weight: 600; color: #0f766e; text-transform: uppercase; letter-spacing: 0.3px;">${escapeHtml(professionalData?.specialty || 'Musicoterapeuta')}</span>
                      </div>
                      ${professionalData?.register ? `<div style="font-size: 6px; color: #374151; font-weight: 600;">${escapeHtml(professionalData.register)}</div>` : ''}
                    </div>
                  </div>
                  <div style="margin-top: 6px; background: linear-gradient(135deg, #0d9488, #0891b2); color: white; padding: 4px 9px; border-radius: 10px; display: inline-flex; align-items: center; gap: 3px; box-shadow: 0 2px 6px rgba(13,148,136,0.3);">
                    <span style="font-size: 6px;">&#10004;</span>
                    <span style="font-size: 6px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px;">Documento gerado no MuseTera</span>
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
      // Dados clínicos não devem ser registrados no console em produção.
      // Dados clínicos não devem ser registrados no console em produção.
      // Dados clínicos não devem ser registrados no console em produção.
      // Dados clínicos não devem ser registrados no console em produção.
    
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
          signature: reportData.signature,
          ...(sourceReportId ? { based_on_report_id: sourceReportId } : {})
        }
      };

      // Dados clínicos não devem ser registrados no console em produção.

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

      // Dados clínicos não devem ser registrados no console em produção.

      toast({
        title: 'Sucesso!',
        description: sourceReportId ? 'Nova versão salva; o relatório original foi preservado.' : 'Relatório de musicoterapia salvo com sucesso.',
      });
      setSourceReportId(null);

      loadReports();
    } catch (error) {
      console.error('Erro ao salvar relatório (detalhes omitidos para proteger dados clínicos)');
      
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

  const handleExportPDF = async (logoUrl?: string | null): Promise<void> => {
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
      // 1. Organizar com IA antes de exportar
      toast({
        title: "Iniciando IA",
        description: "Analisando as respostas e gerando o relatório clínico narrativo...",
      });
      
      const organizedFields = await generateWithAI();
      
      // Criamos uma versão local dos dados para o PDF
      const currentReportData = {
        ...reportData,
        fieldValues: organizedFields || reportData.fieldValues
      };

      // 2. Gerar relatório narrativo clínico com IA
      const narrative = await generateNarrative(currentReportData);
      if (narrative && narrative.length > 0) {
        toast({
          title: "Relatório narrativo gerado",
          description: "A IA produziu uma análise clínica personalizada para o paciente.",
        });
      } else {
        toast({
          title: "PDF gerado sem narrativa de IA",
          description: "Não foi possível gerar o texto narrativo agora; o relatório usará os dados estruturados.",
        });
      }

      // Convert images to Base64
      let photoBase64: string | null = null;
      let stampBase64: string | null = null;

      if (professionalData?.stamp_photo_url) {
        photoBase64 = await imageUrlToBase64(professionalData.stamp_photo_url);
      }
      if (professionalData?.digital_stamp_url) {
        stampBase64 = await imageUrlToBase64(professionalData.digital_stamp_url);
      }
      // A logo personalizada também é convertida para imagem segura antes de incorporar ao PDF.
      const selectedLogoUrl = logoUrl ?? reportLogoUrl;
      const logoBase64 = selectedLogoUrl ? await imageUrlToBase64(selectedLogoUrl) : null;
      if (selectedLogoUrl && !logoBase64) {
        toast({ variant: 'destructive', title: 'Logo não carregada', description: 'O PDF será gerado sem a logo personalizada.' });
      }

      // Create temporary HTML element
      const tempDiv = document.createElement('div');
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      tempDiv.style.color = '#000';
      tempDiv.style.backgroundColor = '#fff';
      tempDiv.innerHTML = generatePDFContent(currentReportData, photoBase64, stampBase64, logoBase64, narrative);

      
      document.body.appendChild(tempDiv);

      // PDF configuration
      const opt = {
        margin: [10, 10],
        filename: `Relatorio_Musicoterapia_${(reportData.patientName || 'paciente').replace(/[^\p{L}\p{N}_-]+/gu, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'], avoid: '.section-block' }
      };

      // Generate and download PDF
      const pdfInstance = html2pdf().set(opt).from(tempDiv);
      await pdfInstance.save();
      let savedPath: string | null = null;
      try {
        const blob = await pdfInstance.outputPdf('blob');
        savedPath = await savePDFToStorage(blob, opt.filename, 'report');
      } catch {
        // Falha de arquivo não deve ser confundida com falha no download.
      }
      document.body.removeChild(tempDiv);
      toast({
        title: savedPath ? 'PDF baixado e arquivado' : 'PDF baixado; arquivamento pendente',
        description: savedPath
          ? 'Relatório baixado e cópia salva no MuseTera.'
          : 'O PDF foi baixado, mas não foi possível salvar uma cópia no MuseTera.',
        variant: savedPath ? 'default' : 'destructive',
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
          patient_id,
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
    anamnesisRequestRef.current += 1;
    setAnamnesisStatus('idle');
    // Cria uma nova versão, preservando o documento histórico original.
    setSourceReportId(report.id);
    // Carregar dados do relatório no wizard
    updateReportData({
      selectedPatientId: report.patient_id || '',
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
        // Preservar todos os campos do relatório salvo, inclusive os novos indicadores clínicos.
        fieldValues: { ...fieldValues },
        additionalObservations: fieldValues.additional_observations || report.content?.additional_observations || '',
        signature: report.content?.signature || fieldValues.digital_signature || professionalData?.name || ''
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
      let savedPath: string | null = null;
      try {
        const blob = await pdfInstance2.outputPdf('blob');
        savedPath = await savePDFToStorage(blob, opt.filename, 'report');
      } catch {
        // O download já foi realizado; uma falha de arquivamento é informada separadamente.
      }
      document.body.removeChild(tempDiv);
      toast({
        title: savedPath ? 'PDF baixado e arquivado' : 'PDF baixado; arquivamento pendente',
        description: savedPath
          ? 'O relatório foi baixado e salvo no MuseTera.'
          : 'O arquivo foi baixado, mas a cópia não foi salva no MuseTera.',
        variant: savedPath ? 'default' : 'destructive',
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
    <div className="relative min-h-screen">
      {/* Ambient cosmic background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container mx-auto p-4 sm:p-6 max-w-6xl space-y-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard')}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>

        {/* MOBILE: Action buttons at TOP for visibility */}
        <div className="flex flex-col gap-2 sm:hidden">
          <Button
            onClick={() => setViewMode(viewMode === 'create' ? 'list' : 'create')}
            className="w-full h-12 font-semibold border-0 bg-gradient-to-br from-primary to-amber-500 text-white shadow-lg hover:opacity-90 transition-all duration-300"
          >
            {viewMode === 'create' ? (
              <>
                <List className="h-5 w-5 mr-2" />
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
              className="w-full border-border/60 bg-card/60 backdrop-blur-xl"
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




      {viewMode === 'create' ? (
        <>
          {/* Export PDF Card */}
          <Card className="relative overflow-hidden border border-border/60 bg-card/60 backdrop-blur-xl shadow-lg rounded-2xl">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-amber-500 to-primary" />
            <CardContent className="p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-amber-500 blur-lg opacity-40" />
                    <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-amber-500 shadow-md">
                      <Download className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                      Gerar Relatório Final (IA)
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Organiza seus dados automaticamente e gera o PDF final.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => void handleExportPDF()}
                  disabled={isExporting}
                  className="bg-gradient-to-br from-primary to-amber-500 hover:opacity-90 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 font-semibold"
                >
                  {isExporting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Processando com IA...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Exportar PDF com IA
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 lg:space-y-6">
            <TabsList className="grid w-full grid-cols-2 h-11 sm:h-12 p-1 bg-card/60 backdrop-blur-xl border border-border/60 rounded-xl">
              <TabsTrigger value="wizard" className="flex items-center gap-2 text-sm sm:text-base rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-md">
                <Wand2 className="h-4 w-4" />
                <span className="hidden sm:inline">Assistente de Criação</span>
                <span className="sm:hidden">Assistente</span>
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2 text-sm sm:text-base rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-md">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Visualização</span>
                <span className="sm:hidden">Preview</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="wizard" className="space-y-6">
              <MusicoterapiaReportWizard
                reportData={reportData}
                onUpdateData={updateReportData}
                onGenerateWithAI={generateWithAI}
                isGeneratingWithAI={isGeneratingWithAI}
                onExportPDF={handleExportPDF}
                isExporting={isExporting}
                logoUrl={reportLogoUrl}
                onLogoChange={setReportLogoUrl}
                patients={patients}
                onSelectPatient={(patientId) => void selectPatientWithAnamnesis(patientId)}
                anamnesisStatus={anamnesisStatus}
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

          {/* Export PDF Card (bottom duplicate) */}
          <Card className="relative overflow-hidden border border-border/60 bg-card/60 backdrop-blur-xl shadow-lg rounded-2xl">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-amber-500 to-primary" />
            <CardContent className="p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-amber-500 blur-lg opacity-40" />
                    <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-amber-500 shadow-md">
                      <Download className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                      Gerar Relatório Final (IA)
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Organiza seus dados automaticamente e gera o PDF final.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => void handleExportPDF()}
                  disabled={isExporting}
                  className="bg-gradient-to-br from-primary to-amber-500 hover:opacity-90 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 font-semibold"
                >
                  {isExporting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Processando com IA...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Exportar PDF com IA
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
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
                Visualize, crie novas versões e gerencie seus relatórios salvos
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
                          Nova versão
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
    </div>
  );
}