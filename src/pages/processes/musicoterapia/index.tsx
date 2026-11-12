import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Music, FileText, Wand2, Download, Save, ArrowLeft, Brain, List, Eye, Edit, Trash2, Search, Sparkles, Archive, CheckCircle2, Clock3, AlertCircle } from 'lucide-react';
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
import { renderMusicoterapiaSignaturePdf } from '@/utils/renderMusicoterapiaSignaturePdf';
import { splitMusicoterapiaPdfParagraphs } from '@/utils/musicoterapiaPdfParagraphs';
import {
  renderMusicoterapiaPdfPatientContext,
  formatMusicoterapiaPdfDate,
  diagnosesHaveSameCid
} from '@/utils/musicoterapiaPdfPatientContext';
import { getSelectedMusicoterapiaReferences } from '@/data/musicoterapiaReferences';
import { archiveClinicalPdfInR2, getPrivateClinicalPdf } from '@/utils/r2ClinicalDocuments';
import { compareMusicoterapiaReportFields, getMusicoterapiaReportStatus, groupMusicoterapiaReportHistory } from '@/utils/musicoterapiaReportHistory';
import { useReportData } from '../report/hooks/useReportData';
import { exportMusicoterapiaHtmlPdf } from '@/utils/musicoterapiaPdfExport';
import { exportMusicoterapiaNativePdf } from '@/utils/musicoterapiaNativePdf';
import { renderMusicoterapiaPdfVisuals, renderMusicoterapiaPdfHeaderArt } from '@/utils/musicoterapiaPdfVisuals';
import { imageUrlToBase64 } from '@/utils/imageToBase64';
import { resolveMusicoterapiaProfessionalAssets } from '@/utils/musicoterapiaProfessionalAssets';
import { DeleteReportDialog } from '../reports/components/DeleteReportDialog';
import { formatAgeString } from '@/utils/dateUtils';
import { mapAnamnesisToMusicoterapia } from '@/utils/musicoterapiaAnamnesisMapping';
import type { ReportData } from '@/data/musicoterapiaTemplate';

type SaveState = 'idle' | 'pending' | 'saving' | 'saved' | 'error';
const REPORT_PAGE_SIZE = 24;

function downloadArchivedPdf(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function MusicoterapiaPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('wizard');
  const [viewMode, setViewMode] = useState<'create' | 'list'>('create');
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const exportingRef = React.useRef(false);
  const [reportLogoUrl, setReportLogoUrl] = useState<string | null>(null);
  const [sourceReportId, setSourceReportId] = useState<string | null>(null);
  const [sourceRootId, setSourceRootId] = useState<string | null>(null);
  const [draftId, setDraftId] = useState<string | null>(null);
  const draftIdRef = React.useRef<string | null>(null);
  const saveQueueRef = React.useRef<Promise<void>>(Promise.resolve());
  const queuedSavesRef = React.useRef(0);
  const editRevisionRef = React.useRef(0);
  const hasUnsavedChangesRef = React.useRef(false);
  const autoSaveTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  const [reportsLoadError, setReportsLoadError] = useState(false);
  const [loadingMoreReports, setLoadingMoreReports] = useState(false);
  const [hasMoreReports, setHasMoreReports] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'rascunho' | 'finalizado'>('all');
  const reportsRequestRef = React.useRef(0);
  const sessionOwnerRef = React.useRef<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<any>(null);

  const patientIdFromQuery = searchParams.get('patient_id');
  
  const {
    reportData,
    updateReportData,
    resetReportData,
    generateWithAI,
    generateNarrative,
    isGeneratingWithAI,
    validateReport,
    template,
    professionalData
  } = useMusicoterapiaReport();

  const { patients, isLoadingPatients, patientsLoadError, userId } = useReportData();
  const [professionalId, setProfessionalId] = useState<string | null>(null);
  const [anamnesisStatus, setAnamnesisStatus] = useState<'idle' | 'loading' | 'loaded' | 'empty' | 'error'>('idle');
  const anamnesisRequestRef = React.useRef(0);
  const autoSelectedQueryRef = React.useRef<string | null>(null);
  const [anamnesisSourceDate, setAnamnesisSourceDate] = useState<string | null>(null);

  const markEdited = React.useCallback(() => {
    editRevisionRef.current += 1;
    hasUnsavedChangesRef.current = true;
    setSaveState('pending');
  }, []);

  const updateClinicalReport = React.useCallback((changes: Partial<ReportData> | ((previous: Partial<ReportData>) => Partial<ReportData>)) => {
    markEdited();
    updateReportData(changes);
  }, [markEdited, updateReportData]);

  const confirmDiscard = React.useCallback(() => {
    if (queuedSavesRef.current > 0) {
      toast({ variant: 'destructive', title: 'Aguarde o salvamento', description: 'Não troque de relatório enquanto houver uma gravação em andamento.' });
      return false;
    }
    return !hasUnsavedChangesRef.current || window.confirm('Este relatório possui alterações ainda não salvas. Deseja sair e descartá-las?');
  }, [toast]);

  React.useEffect(() => {
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasUnsavedChangesRef.current) return;
      event.preventDefault();
      event.returnValue = '';
    };
    const guardLinks = (event: MouseEvent) => {
      if (!hasUnsavedChangesRef.current || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const target = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (!(target instanceof HTMLAnchorElement) || target.hasAttribute('download') || target.target === '_blank') return;
      const href = target.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      const destination = new URL(target.href, window.location.href);
      if (destination.origin === window.location.origin && destination.pathname === window.location.pathname && destination.search === window.location.search) return;
      if (!window.confirm('Este relatório possui alterações ainda não salvas. Deseja sair e descartá-las?')) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    window.addEventListener('beforeunload', beforeUnload);
    document.addEventListener('click', guardLinks, true);
    return () => {
      window.removeEventListener('beforeunload', beforeUnload);
      document.removeEventListener('click', guardLinks, true);
    };
  }, []);

  // Purge all local clinical state when a session changes, including in-flight queries.
  React.useEffect(() => {
    if (sessionOwnerRef.current === userId) return;
    const previouslyAuthenticated = sessionOwnerRef.current !== null;
    sessionOwnerRef.current = userId;
    reportsRequestRef.current++;
    setReports([]);
    setHasMoreReports(false);
    setSelectedReport(null);
    setReportToDelete(null);
    setShowViewDialog(false);
    setShowDeleteDialog(false);
    setProfessionalId(null);
    if (previouslyAuthenticated) {
      anamnesisRequestRef.current++;
      autoSelectedQueryRef.current = null;
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
      resetReportData();
      draftIdRef.current = null;
      setDraftId(null);
      setSourceReportId(null);
      setSourceRootId(null);
      setReportLogoUrl(null);
      setAnamnesisStatus('idle');
      setAnamnesisSourceDate(null);
      hasUnsavedChangesRef.current = false;
      setSaveState('idle');
      setLastSaved(null);
    }
  }, [userId, resetReportData]);

  React.useEffect(() => {
    let active = true;
    if (!userId) { setProfessionalId(null); return; }
    async function fetchProfessionalId() {
      if (userId) {
        try {
          const { data, error } = await supabase
            .from('professionals')
            .select('id')
            .eq('user_id', userId)
            .single();
          
          if (active && data && !error) setProfessionalId(data.id);
        } catch (error) {
          console.error('Erro ao buscar professional_id:', error);
        }
      }
    }
    
    void fetchProfessionalId();
    return () => { active = false; };
  }, [userId]);

  // Ao trocar de paciente, limpar o rascunho clínico anterior antes de importar
  // dados da anamnese. A última consulta é a única autorizada a atualizar o estado.
  const selectPatientWithAnamnesis = React.useCallback(async (patientId: string) => {
    if (patientId && patientId === reportData.selectedPatientId) return;
    if (!confirmDiscard()) return;
    const requestId = ++anamnesisRequestRef.current;
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    editRevisionRef.current += 1;
    hasUnsavedChangesRef.current = false;
    setSaveState('idle');
    setLastSaved(null);
    setAnamnesisSourceDate(null);
    draftIdRef.current = null;
    setDraftId(null);
    setSourceRootId(null);
    setReportLogoUrl(null);
    resetReportData();
    if (!patientId || patientId === 'manual') {
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
      setAnamnesisSourceDate(data.updated_at || data.created_at || null);
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
  }, [patients, userId, updateReportData, resetReportData, toast, confirmDiscard, reportData.selectedPatientId]);

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
    narrative?: { title: string; content: string }[] | null,
    signatureBase64?: string | null
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
    // O modelo estruturado de nove etapas é a fonte única do relatório novo.
    // Textos narrativos antigos são preservados somente em relatórios legados.
    // Não repetir narrativas IA com capítulos duplicados ou inferências sem suporte.
    const narrativeSections = narrative || [];
    const narrativeBlock = narrativeSections.length > 0 ? `
      <div class="section-block" style="margin-bottom: 25px; border: 2px solid #14b8a6; border-radius: 10px; overflow: hidden; background: #ffffff; page-break-inside: auto;">
        <div style="background: linear-gradient(135deg, #0d9488 0%, #14b8a6 60%, #06b6d4 100%); color: white; padding: 12px 16px;">
          <h2 style="margin: 0; font-size: 16px; font-weight: 700; letter-spacing: 0.3px;">Relatório de Evolução Musicoterapêutica</h2>
          
        </div>
        <div style="padding: 16px 18px;">
          ${narrativeSections.map((sec) => `
            <div style="margin-bottom: 16px; page-break-inside: avoid;">
              <h3 style="color: #0d9488; margin: 0 0 6px 0; font-size: 13px; border-bottom: 1px solid #99f6e4; padding-bottom: 4px;">${escapeHtml(sec.title)}</h3>
              ${splitMusicoterapiaPdfParagraphs(sec.content).map((p) =>
                `<p style="margin: 0 0 8px 0; font-size: 11.5px; line-height: 1.7; text-align: justify; color: #1f2937; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word;">${escapeHtml(p)}</p>`
              ).join('')}
            </div>
          `).join('')}
        </div>
      </div>
    ` : '';

    
    return `
      <div class="pdf-document" style="width: 186mm; max-width: 186mm; margin: 0; padding: 0; background: #fff; box-sizing: border-box;">
        <!-- Identidade editorial MuseTera: ilustracao vetorial, sem dados clinicos. -->
        <header class="pdf-masthead pdf-keep">
          <div class="pdf-masthead-copy">
            ${logoUrl ? `<img class="pdf-document-logo" src="${escapeHtml(logoUrl)}" alt="Logotipo profissional" />` : ''}
            <span class="pdf-kicker">MUSETERA  /  DOCUMENTAÇÃO CLÍNICA</span>
            <h1>Relatório de Musicoterapia</h1>
            <p>Acompanhamento musicoterapêutico individualizado</p>
          </div>
          ${renderMusicoterapiaPdfHeaderArt()}
        </header>

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
            row('Diagnóstico / CID informado', fields.cid_code || reportDataForPDF.patientDiagnosis),
            ...(fields.cid_code && reportDataForPDF.patientDiagnosis &&
                String(fields.cid_code).trim() !== String(reportDataForPDF.patientDiagnosis).trim() &&
                !diagnosesHaveSameCid(fields.cid_code, reportDataForPDF.patientDiagnosis)
              ? [row('Informação diagnóstica adicional', reportDataForPDF.patientDiagnosis)] : []),
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
            row('Data do relatório', formatMusicoterapiaPdfDate(reportDataForPDF.sessionDate) || currentDate),
          ].filter(Boolean).join('');
          return `
        <div class="pdf-identity section-block">
          <h2>01  ·  Identificação do paciente</h2>
          <div class="pdf-identity-grid">
            <div>
              ${patientRows || '<p>Não informado</p>'}
            </div>
            <div>
              <h3 style="color: #0d9488; margin: 0 0 8px 0; font-size: 11px;">Profissional responsável</h3>
              ${proRows || '<p style="margin: 4px 0;">Não informado</p>'}
            </div>
          </div>
        </div>`;
        })()}

        <!-- Contexto e motivo do encaminhamento junto à identificação, sem repetir no final -->
        ${!isLegacyReport ? renderMusicoterapiaPdfPatientContext(fields, escapeHtml) : ''}

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

        <!-- Painel visual: distribuição dos resultados após objetivos e abordagem -->
        ${renderMusicoterapiaPdfVisuals(fields)}

        ${recordedResults.length ? renderRecordedResultsPdf(recordedResults, escapeHtml) : ''}
        ${renderObjectiveFlowPdf(fields.therapeutic_objective_ids, fields.objective_outcomes, escapeHtml)}

        <!-- Análise narrativa complementar, após os resultados estruturados -->
        ${narrativeBlock}

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

          // Os nove passos do formulário novo já contêm todos os campos
          // indispensáveis. Evitar Sumário Executivo e identificação duplicada
          // ao fim do documento. Preservar a listagem ampla apenas em versões antigas.
          if (!isLegacyReport) {
            return renderMusicoterapiaReferencesPdf(fields.musicoterapia_reference_ids, escapeHtml);
          }

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

        <!-- Identificacao e carimbo cadastrado: sem selos artificiais -->
        ${renderMusicoterapiaSignaturePdf({
          name: reportDataForPDF.professionalName || professionalData?.name,
          register: reportDataForPDF.professionalRegistry || professionalData?.register,
          specialty: reportDataForPDF.professionalSpecialty || professionalData?.specialty,
          date: formatMusicoterapiaPdfDate(reportDataForPDF.sessionDate) || currentDate,
          email: professionalData?.email,
          phone: professionalData?.phone,
          portrait: photoBase64,
          stamp: stampBase64,
          signature: signatureBase64
        }, escapeHtml)}

      </div>
    `;
  };

  const handleSaveReport = async (
    { silent = false }: { silent?: boolean } = {},
  ): Promise<string | null> => {
    if (!professionalId || !reportData.selectedPatientId) {
      if (!silent) toast({ variant: 'destructive', title: 'Identificação necessária', description: 'Selecione um paciente e aguarde seus dados profissionais para salvar.' });
      return null;
    }
    // A versão final só é confirmada depois da validação e do arquivamento explícito.
    const revision = editRevisionRef.current;
    const patientId = reportData.selectedPatientId;
    const content = {
      template_id: reportData.templateId,
      field_values: reportData.fieldValues,
      additional_observations: reportData.additionalObservations,
      patient_info: {
        name: reportData.patientName || reportData.fieldValues?.patient_name,
        age: reportData.patientAge || reportData.fieldValues?.patient_age,
        diagnosis: reportData.patientDiagnosis || reportData.fieldValues?.patient_diagnosis,
        birth_date: reportData.patientBirthDate || '',
        guardian: reportData.patientGuardian || '',
      },
      professional_info: {
        name: reportData.professionalName || professionalData?.name,
        registry: reportData.professionalRegistry || professionalData?.register || professionalData?.license_number,
        specialty: reportData.professionalSpecialty || 'Musicoterapia',
      },
      session_date: reportData.sessionDate,
      signature: reportData.signature,
      logo_url: reportLogoUrl || null,
      document_status: 'rascunho',
      ...(sourceReportId ? { based_on_report_id: sourceReportId } : {}),
      ...(sourceRootId ? { root_report_id: sourceRootId } : {}),
    };
    const payload = { patient_id: patientId, professional_id: professionalId, type: 'musicoterapia' as const, content };

    const persist = async (): Promise<string | null> => {
      setIsSaving(true);
      setSaveState('saving');
      try {
        let savedId = draftIdRef.current;
        if (savedId) {
          // Require both ownership and the original patient, even if RLS policies change.
          const { data, error } = await supabase.from('reports')
            .update(payload)
            .eq('id', savedId)
            .eq('professional_id', professionalId)
            .eq('patient_id', patientId)
            .select('id').maybeSingle();
          if (error || !data) throw new Error('Não foi possível atualizar o rascunho com segurança.');
        } else {
          const { data, error } = await supabase.from('reports').insert(payload).select('id').single();
          if (error || !data?.id) throw new Error('Não foi possível criar o rascunho.');
          savedId = data.id;
          draftIdRef.current = savedId;
          setDraftId(savedId);
        }

        setLastSaved(new Date());
        if (editRevisionRef.current === revision) {
          hasUnsavedChangesRef.current = false;
          setSaveState('saved');
        } else {
          setSaveState('pending');
        }
        if (!silent) {
          toast({ title: 'Rascunho salvo', description: 'As informações foram registradas sem excluir relatórios anteriores.' });
          void loadReports();
        }
        return savedId;
      } catch {
        if (editRevisionRef.current === revision) setSaveState('error');
        if (!silent) toast({ variant: 'destructive', title: 'Falha ao salvar', description: 'Verifique a conexão e tente novamente. Suas alterações continuam no formulário.' });
        return null;
      } finally {
        setIsSaving(false);
      }
    };

    queuedSavesRef.current += 1;
    const queued = saveQueueRef.current.then(persist, persist).finally(() => { queuedSavesRef.current -= 1; });
    saveQueueRef.current = queued.then(() => undefined, () => undefined);
    return queued;
  };

  // Saving a draft is debounced and serialized; merely loading a patient never creates a report.
  React.useEffect(() => {
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    if (viewMode !== 'create' || isExporting || !hasUnsavedChangesRef.current || !professionalId || !reportData.selectedPatientId) return;
    autoSaveTimerRef.current = setTimeout(() => { void handleSaveReport({ silent: true }); }, 3000);
    return () => { if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current); };
    // The save callback captures the current immutable reportData snapshot.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportData, professionalId, reportLogoUrl, viewMode, isExporting]);

  const handleExportPDF = async (logoUrl?: string | null, archive = false): Promise<void> => {
    if (exportingRef.current) return;
    const validation = validateReport();
    if (!validation.isValid) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: `Complete os campos: ${validation.missingFields.join(', ')}`,
      });
      return;
    }

    const exportRevision = editRevisionRef.current;
    const currentReportData = { ...reportData, fieldValues: { ...reportData.fieldValues } };
    exportingRef.current = true;
    setIsExporting(true);
    try {
      // The snapshot is saved as a draft first. It becomes final ONLY after R2
      // has acknowledged the original PDF and the report has been linked to it.
      const savedVersionId = archive ? await handleSaveReport({ silent: true }) : null;
      if (archive && !savedVersionId) {
        toast({ variant: 'destructive', title: 'Arquivamento cancelado', description: 'O relatório precisa ser salvo para vincular o PDF ao histórico.' });
        return;
      }
      const isStructuredReport =
        getSelectedMusicoterapiaApproaches(currentReportData.fieldValues?.musicoterapia_approach_ids).length > 0;
      // No relatório estruturado a análise é montada de forma auditável no
      // exportador nativo. O legado preserva sua integração anterior com IA.
      const narrative = isStructuredReport ? null : await generateNarrative(currentReportData);

      // Convert images to Base64
      let photoBase64: string | null = null;
      let stampBase64: string | null = null;

      if (professionalData?.stamp_photo_url) {
        photoBase64 = await imageUrlToBase64(professionalData.stamp_photo_url);
      }
      const professionalImages = await resolveMusicoterapiaProfessionalAssets(professionalData, userId);
      stampBase64 = professionalImages.stamp;
      const signatureBase64 = professionalImages.signature;
      // A logo personalizada também é convertida para imagem segura antes de incorporar ao PDF.
      const selectedLogoUrl = logoUrl ?? reportLogoUrl;
      const logoBase64 = selectedLogoUrl ? await imageUrlToBase64(selectedLogoUrl) : null;
      if (selectedLogoUrl && !logoBase64) {
        toast({ variant: 'destructive', title: 'Logo não carregada', description: 'O PDF será gerado sem a logo personalizada.' });
      }

      // Um único exportador A4, com margens, gráficos, quebras e páginas numeradas.
      const filename = `Relatorio_Musicoterapia_${(currentReportData.patientName || 'paciente').replace(/[^\p{L}\p{N}_-]+/gu, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      const blob = isStructuredReport
        ? await exportMusicoterapiaNativePdf(
            currentReportData,
            professionalData,
            { logo: logoBase64, photo: photoBase64, stamp: stampBase64, signature: signatureBase64 },
            filename,
            narrative
          )
        : await exportMusicoterapiaHtmlPdf(
            generatePDFContent(currentReportData, photoBase64, stampBase64, logoBase64, narrative, signatureBase64),
            filename
          );
      if (archive && savedVersionId && professionalId) {
        const archived = await archiveClinicalPdfInR2({ pdf: blob, filename, kind: 'report', patientId: currentReportData.selectedPatientId });
        const { data: savedRow, error: lookupError } = await supabase.from('reports')
          .select('content').eq('id', savedVersionId).eq('professional_id', professionalId).single();
        if (lookupError || !savedRow) throw new Error('PDF arquivado, mas ainda não vinculado ao relatório.');
        const originalContent = savedRow.content && typeof savedRow.content === 'object' && !Array.isArray(savedRow.content)
          ? savedRow.content : {};
        const { data: updated, error: updateError } = await supabase.from('reports')
          .update({ content: { ...originalContent, document_status: 'finalizado', archived_pdf_document_id: archived.id } })
          .eq('id', savedVersionId).eq('professional_id', professionalId).select('id').maybeSingle();
        if (updateError || !updated) throw new Error('PDF arquivado, mas ainda não vinculado ao relatório.');
        draftIdRef.current = null;
        setDraftId(null);
        setSourceReportId(savedVersionId);
        setSourceRootId(sourceRootId || savedVersionId);
        toast({ title: 'PDF baixado e arquivado no R2', description: 'A versão original está associada ao relatório e poderá ser baixada novamente.' });
        void loadReports();
        if (editRevisionRef.current === exportRevision) {
          hasUnsavedChangesRef.current = false;
          setSaveState('saved');
          setViewMode('list');
        } else {
          // The clinician changed the form during export. Keep those unsaved
          // edits visible; a subsequent save creates a NEW draft/version.
          hasUnsavedChangesRef.current = true;
          setSaveState('pending');
          toast({ title: 'Alterações posteriores preservadas', description: 'O PDF arquivado corresponde ao momento da exportação. Salve as mudanças recentes em uma nova versão.' });
        }
      } else {
        toast({ title: 'PDF baixado', description: 'O documento foi baixado. Para manter uma cópia privada no R2, use “Baixar e arquivar”.' });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: archive ? 'Falha no arquivamento' : 'Erro ao gerar PDF',
        description: error instanceof Error ? error.message : 'Não foi possível concluir a operação. Nenhum documento existente foi removido.',
      });
    } finally {
      exportingRef.current = false;
      setIsExporting(false);
    }
  };

  const loadReports = async ({ append = false }: { append?: boolean } = {}) => {
    if (!professionalId) return;
    const requestId = ++reportsRequestRef.current;
    const offset = append ? reports.length : 0;
    if (append) setLoadingMoreReports(true);
    else setIsLoadingReports(true);
    setReportsLoadError(false);
    try {
      // Load only one page of full clinical content instead of every report.
      // The original R2 PDF is never downloaded during list navigation.
      const { data, error } = await supabase
        .from('reports')
        .select('id, patient_id, type, created_at, content, patient:patients(name)')
        .eq('professional_id', professionalId)
        .eq('type', 'musicoterapia')
        .order('created_at', { ascending: false })
        .order('id', { ascending: false })
        .range(offset, offset + REPORT_PAGE_SIZE - 1);
      if (error) throw error;
      if (requestId !== reportsRequestRef.current) return;
      const batch = data || [];
      setReports(previous => append
        ? [...previous, ...batch.filter(item => !previous.some(existing => existing.id === item.id))]
        : batch);
      setHasMoreReports(batch.length === REPORT_PAGE_SIZE);
    } catch {
      if (requestId !== reportsRequestRef.current) return;
      setReportsLoadError(true);
      toast({
        variant: 'destructive', title: 'Não foi possível carregar o histórico',
        description: 'Seus relatórios e PDFs não foram alterados. Confira a conexão e tente novamente.',
      });
    } finally {
      if (requestId === reportsRequestRef.current) {
        setIsLoadingReports(false);
        setLoadingMoreReports(false);
      }
    }
  };

  const startNewReport = () => {
    if (!confirmDiscard()) return;
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    anamnesisRequestRef.current += 1;
    resetReportData();
    editRevisionRef.current += 1;
    hasUnsavedChangesRef.current = false;
    draftIdRef.current = null;
    setDraftId(null);
    setSourceReportId(null);
    setSourceRootId(null);
    setReportLogoUrl(null);
    setSaveState('idle');
    setLastSaved(null);
    setAnamnesisStatus('idle');
    setAnamnesisSourceDate(null);
    setViewMode('create');
    setActiveTab('wizard');
  };

  const handleEditReport = (report: any) => {
    if (!confirmDiscard()) return;
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    anamnesisRequestRef.current += 1;
    setAnamnesisStatus('idle');
    const resumeDraft = getMusicoterapiaReportStatus(report.content) === 'rascunho';
    draftIdRef.current = resumeDraft ? report.id : null;
    setDraftId(resumeDraft ? report.id : null);
    // Editing a finalized report starts a new independent version, never overwriting it.
    setSourceReportId(resumeDraft ? report.content?.based_on_report_id || null : report.id);
    setSourceRootId(report.content?.root_report_id || report.content?.based_on_report_id || (resumeDraft ? null : report.id));
    editRevisionRef.current += 1;
    hasUnsavedChangesRef.current = false;
    setSaveState(resumeDraft ? 'saved' : 'idle');
    setLastSaved(null);
    setReportLogoUrl(report.content?.logo_url || null);
    // Carregar dados do relatório no wizard
    updateReportData({
      selectedPatientId: report.patient_id || '',
      patientName: report.content?.patient_info?.name || '',
      patientAge: report.content?.patient_info?.age || '',
      patientDiagnosis: report.content?.patient_info?.diagnosis || '',
      patientBirthDate: report.content?.patient_info?.birth_date || '',
      patientGuardian: report.content?.patient_info?.guardian || '',
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

      // Always prefer the original private PDF when a version has been archived.
      const archivedId = report.content?.archived_pdf_document_id;
      if (typeof archivedId === 'string' && archivedId) {
        const original = await getPrivateClinicalPdf(archivedId);
        const name = (report.content?.patient_info?.name || 'paciente').replace(/[^\p{L}\p{N}_-]+/gu, '_');
        downloadArchivedPdf(original, `Relatorio_Musicoterapia_${name}_original.pdf`);
        toast({ title: 'PDF original baixado', description: 'Esta é a cópia arquivada da versão selecionada.' });
        return;
      }
      
      // 1. Reconstruct report data
      const fieldValues = report.content?.field_values || {};
      
      const reportDataForPDF = {
        templateId: report.content?.template_id || 'musicoterapia-tea',
        patientName: fieldValues.patient_name || report.content?.patient_info?.name || '',
        patientAge: fieldValues.patient_age || report.content?.patient_info?.age || '',
        patientDiagnosis: fieldValues.patient_diagnosis || report.content?.patient_info?.diagnosis || '',
        patientBirthDate: fieldValues.patient_birth_date || report.content?.patient_info?.birth_date || '',
        patientGuardian: fieldValues.patient_guardian || report.content?.patient_info?.guardian || '',
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
      const savedLogoUrl = typeof report.content?.logo_url === 'string' ? report.content.logo_url : null;
      const savedLogoBase64 = savedLogoUrl ? await imageUrlToBase64(savedLogoUrl) : null;

      // Mesmo template e paginação usados no relatório recém-gerado.
      const filename = `Relatorio_Musicoterapia_${(reportDataForPDF.patientName || 'paciente').replace(/[^\p{L}\p{N}_-]+/gu, '_')}_${new Date(report.created_at).toISOString().split('T')[0]}.pdf`;
      const isStructuredReport = getSelectedMusicoterapiaApproaches(fieldValues.musicoterapia_approach_ids).length > 0;
      const blob = isStructuredReport
        ? await exportMusicoterapiaNativePdf(
            reportDataForPDF,
            professionalData,
            { logo: savedLogoBase64, photo: photoBase64, stamp: stampBase64, signature: signatureBase64 },
            filename
          )
        : await exportMusicoterapiaHtmlPdf(
            generatePDFContent(reportDataForPDF, photoBase64, stampBase64, savedLogoBase64, null, signatureBase64),
            filename
          );
      toast({
        title: 'PDF gerado e baixado',
        description: 'Esta versão antiga não possui PDF original vinculado; o arquivo foi reconstruído sem alterar o registro salvo.',
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

  const normalizedSearch = searchTerm.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  const filteredReports = reports.filter(report => {
    const patientName = String(report.patient?.name || report.content?.patient_info?.name || '')
      .normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    const date = report.created_at ? new Date(report.created_at).toLocaleDateString('pt-BR') : '';
    return (statusFilter === 'all' || getMusicoterapiaReportStatus(report.content) === statusFilter) &&
      (!normalizedSearch || patientName.includes(normalizedSearch) || date.includes(normalizedSearch));
  });
  const groupedReports = groupMusicoterapiaReportHistory(filteredReports);

  useEffect(() => {
    if (professionalId) {
      loadReports();
    }
  }, [professionalId]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 sm:p-6 max-w-6xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Button variant="ghost" size="sm" onClick={() => { if (confirmDiscard()) navigate('/dashboard'); }}
            className="min-h-11 gap-2 text-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao painel
          </Button>
          <Button variant="outline" onClick={() => {
              if (viewMode === 'create') {
                if (!confirmDiscard()) return;
                setViewMode('list');
                void loadReports();
              } else startNewReport();
            }}
            className="min-h-11 gap-2 rounded-xl border-primary/25 bg-card font-semibold text-foreground hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-primary">
            {viewMode === 'create' ? <List className="h-4 w-4" /> : <Wand2 className="h-4 w-4" />}
            {viewMode === 'create' ? 'Ver relatórios salvos' : 'Criar novo relatório'}
          </Button>
        </div>

      {viewMode === 'create' ? (
        <>
          {/* Contextual workspace controls: one compact toolbar above the form. */}
          <div className="flex flex-col gap-5 rounded-2xl border border-primary/20 bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">MuseTera · Relatórios</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Relatório de Musicoterapia</h2>
              <p className="mt-2 max-w-xl text-base leading-relaxed text-muted-foreground">
                Preencha as etapas e confira a revisão final antes de emitir o documento.
              </p>
              <p role="status" aria-live="polite" className={`mt-3 flex items-center gap-2 text-sm ${saveState === 'error' ? 'text-destructive' : 'text-foreground'}`}>
                {saveState === 'saving' ? <Clock3 className="h-4 w-4 text-primary" /> : saveState === 'error' ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4 text-primary" />}
                {saveState === 'saving' ? 'Salvando rascunho…' : saveState === 'pending' ? 'Alterações pendentes — salvamento automático em instantes' : saveState === 'error' ? 'Erro ao salvar; suas alterações permanecem no formulário' : saveState === 'saved' ? `Rascunho salvo${lastSaved ? ` às ${lastSaved.toLocaleTimeString('pt-BR')}` : ''}` : 'Selecione um paciente para iniciar um rascunho'}
              </p>
              {draftId && <Badge variant="outline" className="mt-2">Rascunho recuperável</Badge>}
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
              <Button variant="outline" onClick={() => { void handleSaveReport(); }} disabled={isSaving || !reportData.selectedPatientId} className="min-h-12 gap-2 rounded-xl border-primary/30 bg-card font-semibold text-foreground hover:bg-primary/5">
                <Save aria-hidden="true" className="h-4 w-4" />
                {isSaving ? 'Salvando...' : 'Salvar rascunho'}
              </Button>
              <Button onClick={() => void handleExportPDF()} disabled={isExporting}
                className="min-h-12 gap-2 rounded-xl bg-primary px-5 font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary">
                <Download aria-hidden="true" className="h-4 w-4" />
                {isExporting ? 'Gerando PDF...' : 'Exportar PDF'}
              </Button>
              <Button variant="outline" onClick={() => void handleExportPDF(undefined, true)} disabled={isExporting || isSaving}
                className="min-h-12 gap-2 rounded-xl border-primary/30 text-foreground hover:bg-primary/5">
                <Archive aria-hidden="true" className="h-4 w-4" />
                Baixar e arquivar no R2
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 lg:space-y-6">
            <TabsList className="grid w-full grid-cols-2 min-h-14 h-auto p-1 bg-muted/60 border border-border rounded-xl">
              <TabsTrigger value="wizard" className="flex min-h-12 items-center justify-center gap-2 text-sm sm:text-base font-semibold rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm focus-visible:ring-2 focus-visible:ring-primary">
                <Wand2 aria-hidden="true" className="h-4 w-4" />
                <span className="hidden sm:inline">Assistente de Criação</span>
                <span className="sm:hidden">Assistente</span>
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex min-h-12 items-center justify-center gap-2 text-sm sm:text-base font-semibold rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm focus-visible:ring-2 focus-visible:ring-primary">
                <FileText aria-hidden="true" className="h-4 w-4" />
                <span className="hidden sm:inline">Visualização</span>
                <span className="sm:hidden">Preview</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="wizard" className="space-y-6">
              <MusicoterapiaReportWizard
                reportData={reportData}
                onUpdateData={updateClinicalReport}
                onGenerateWithAI={async () => { markEdited(); return generateWithAI(); }}
                isGeneratingWithAI={isGeneratingWithAI}
                onExportPDF={handleExportPDF}
                isExporting={isExporting}
                logoUrl={reportLogoUrl}
                onLogoChange={(value) => { markEdited(); setReportLogoUrl(value); }}
                patients={patients}
                isLoadingPatients={isLoadingPatients}
                patientsLoadError={patientsLoadError}
                anamnesisSourceDate={anamnesisSourceDate}
                onSelectPatient={(patientId) => void selectPatientWithAnamnesis(patientId)}
                anamnesisStatus={anamnesisStatus}
                onSaveReport={() => { void handleSaveReport(); }}
                isSaving={isSaving}
                professionalData={professionalData}
              />
            </TabsContent>

            <TabsContent value="preview" className="space-y-6">
              <Card className="rounded-2xl border-border shadow-sm">
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
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <List className="h-5 w-5" />
                <span>Relatórios de Musicoterapia Salvos</span>
              </CardTitle>
              <CardDescription>
                Visualize, crie novas versões e consulte os documentos do seu histórico sem alterar os PDFs originais.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="relative flex-1 space-y-2">
                  <label htmlFor="musicoterapia-report-search" className="block text-sm font-semibold text-foreground">Buscar relatório</label>
                  <div className="relative">
                  <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="musicoterapia-report-search"
                    placeholder="Filtrar nome ou data dos registros carregados..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-12 rounded-xl pl-10 text-base"
                  />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              Situação
              <select aria-label="Filtrar histórico por situação" value={statusFilter}
                onChange={event => setStatusFilter(event.target.value as typeof statusFilter)}
                className="min-h-11 rounded-lg border border-input bg-background px-3 text-sm text-foreground">
                <option value="all">Todas</option>
                <option value="rascunho">Rascunhos</option>
                <option value="finalizado">Finalizadas</option>
              </select>
            </label>
            <p className="text-xs text-muted-foreground" role="status">
              {filteredReports.length} registro(s) encontrados entre {reports.length} carregados
            </p>
          </div>

          {/* Reports List */}
          {isLoadingReports ? (
            <Card className="rounded-xl">
              <CardContent className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                <span className="ml-2">Carregando relatórios...</span>
              </CardContent>
            </Card>
          ) : reportsLoadError ? (
            <Card className="rounded-xl border-destructive/25">
              <CardContent className="space-y-3 py-8 text-center">
                <AlertCircle className="mx-auto h-9 w-9 text-destructive" aria-hidden="true" />
                <h3 className="text-lg font-semibold">Não foi possível carregar o histórico</h3>
                <p className="text-sm text-muted-foreground">Seus relatórios não foram apagados. Verifique a conexão e tente novamente.</p>
                <Button variant="outline" onClick={() => void loadReports()} className="min-h-11">Tentar novamente</Button>
              </CardContent>
            </Card>
          ) : filteredReports.length === 0 ? (
            <Card className="rounded-xl">
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
            <div className="space-y-5">
              {groupedReports.map(group => <section key={group.key} className="space-y-3 rounded-2xl border border-border/70 bg-muted/20 p-3 sm:p-4" aria-label="Histórico de relatórios do paciente">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-foreground">{group.versions[0]?.patient?.name || 'Paciente não identificado'}</h3>
                  <Badge variant="secondary">{group.versions.length} versão(ões) · histórico preservado</Badge>
                </div>
              {group.versions.map((report, index) => (
                <Card key={report.id} className="rounded-xl border-border shadow-sm transition-shadow hover:shadow-md">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                      {/* Patient info */}
                      <div className="space-y-2 min-w-0">
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <Music className="h-5 w-5 text-primary shrink-0" />
                          <h3 className="min-w-0 break-words text-base font-bold leading-snug">
                            {report.patient?.name || 'Paciente não identificado'}
                          </h3>
                          <Badge variant={getMusicoterapiaReportStatus(report.content) === 'rascunho' ? 'outline' : 'secondary'} className="text-xs shrink-0">
                            {getMusicoterapiaReportStatus(report.content) === 'rascunho' ? 'Rascunho' : 'Versão final'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Versão {group.versions.length - index} · {new Date(report.created_at).toLocaleDateString('pt-BR')}
                        </p>
                        {group.versions[index + 1] && <p className="text-xs text-muted-foreground">
                          {compareMusicoterapiaReportFields(group.versions[index + 1].content, report.content).length} campos diferentes da versão anterior — não representa evolução clínica.
                        </p>}
                        {report.content?.archived_pdf_document_id && <p className="flex items-center gap-1 text-xs font-medium text-primary"><Archive className="h-3.5 w-3.5" /> PDF original protegido no R2</p>}
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
                          className="min-h-11 rounded-lg text-sm"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditReport(report)}
                          className="min-h-11 rounded-lg text-sm"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          {getMusicoterapiaReportStatus(report.content) === 'rascunho' ? 'Continuar' : 'Nova versão'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadReportPDF(report)}
                          disabled={isExporting}
                          className="min-h-11 rounded-lg text-sm"
                        >
                          {isExporting ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-1" />
                          ) : (
                            <Download className="h-4 w-4 mr-1" />
                          )}
                          {report.content?.archived_pdf_document_id ? 'PDF original' : 'Gerar PDF'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(report)}
                          className="min-h-11 rounded-lg text-sm text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Excluir
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              </section>)}
            </div>
          )}
        </div>
      )}


      {viewMode === 'list' && hasMoreReports && !isLoadingReports && (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4">
          <Button className="min-h-11" variant="outline" disabled={loadingMoreReports}
            onClick={() => void loadReports({ append: true })}>
            {loadingMoreReports ? 'Carregando mais versões...' : 'Carregar mais relatórios'}
          </Button>
          <p className="text-xs text-muted-foreground">
            {reports.length} versões carregadas. A busca e os filtros atuam sobre os registros já carregados.
            Os demais registros permanecem no banco.
          </p>
        </div>
      )}

      {/* Footer with Template Info */}
      <Card className="rounded-xl">
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
