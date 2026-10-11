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
  const [reviewOpen, setReviewOpen] = useState(false);
  const [draftNarrative, setDraftNarrative] = useState<{ title: string; content: string }[]>([]);
  const [draftReportData, setDraftReportData] = useState<any>(null);
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
          patientBirthDate: (selectedPatient as any).birth_date || '',
          patientGuardian: (selectedPatient as any).responsible || '',
          patientDiagnosis: 'TEA - Transtorno do Espectro Autista'
        });
      }
    }
  }, [patientIdFromQuery, patients, updateReportData]);

  const generatePDFContent = (
    reportDataForPDF: any, 
    photoBase64?: string | null, 
    stampBase64?: string | null,
    logoUrl?: string | null,
    narrative?: { title: string; content: string }[] | null
  ) => {
    const fields = reportDataForPDF.fieldValues || {};
    const currentDate = new Date().toLocaleDateString('pt-BR');

    const escapeHtml = (s: string) =>
      String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    const narrativeBlock = (narrative && narrative.length > 0) ? `
      <div class="clinical-narrative" style="margin-bottom: 25px; border: 2px solid #14b8a6; border-radius: 10px; overflow: hidden; background: #ffffff; page-break-inside: auto;">
        <div style="background: linear-gradient(135deg, #0d9488 0%, #14b8a6 60%, #06b6d4 100%); color: white; padding: 12px 16px;">
          <h2 style="margin: 0; font-size: 16px; font-weight: 700; letter-spacing: 0.3px;">Relatório de Evolução Musicoterapêutica</h2>
          
        </div>
        <div style="padding: 16px 18px;">
          ${narrative.map((sec) => `
            <div style="margin-bottom: 16px; page-break-inside: avoid;">
              <h3 style="color: #0d9488; margin: 0 0 6px 0; font-size: 13px; border-bottom: 1px solid #99f6e4; padding-bottom: 4px;">${escapeHtml(sec.title)}</h3>
              ${String(sec.content).split(/\n{2,}/).map((p) => p.trim()).filter(Boolean).map((p) =>
                `<p style="margin: 0 0 8px 0; font-size: 11.5px; line-height: 1.7; orphans: 3; widows: 3; text-align: justify; color: #1f2937; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word;">${escapeHtml(p)}</p>`
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
          ${logoUrl ? `<img src="${logoUrl}" alt="Logo" style="max-width: 150px; margin-bottom: 15px;" />` : ''}
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
              ? `<p style="margin: 4px 0;"><strong>${label}:</strong> ${String(value)}</p>`
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

        <!-- Report Sections (dados complementares) -->
        ${(!narrative?.length && fields.therapeutic_objectives && fields.therapeutic_objectives.length > 0) ? `
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

        ${(!narrative?.length && fields.recommendations && fields.recommendations.length > 0) ? `
          <div class="section-block" style="margin-bottom: 20px; page-break-inside: avoid; page-break-before: auto;">
            <h3 style="color: #0d9488; border-bottom: 2px solid #14b8a6; padding-bottom: 8px; margin-bottom: 12px; font-size: 14px;">Recomendacoes</h3>
            ${Array.isArray(fields.recommendations) ? `
              <ul style="margin: 0; padding-left: 20px;">
                ${fields.recommendations.map((rec: string) => `<li style="margin: 6px 0; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word;">${rec}</li>`).join('')}
              </ul>
            ` : `<p style="margin: 0; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word;">${fields.recommendations}</p>`}
          </div>
        ` : ''}

        ${(!narrative?.length && fields.conclusion && fields.conclusion.length > 0) ? `
          <div class="section-block" style="margin-bottom: 20px; page-break-inside: avoid; page-break-before: auto;">
            <h3 style="color: #0d9488; border-bottom: 2px solid #14b8a6; padding-bottom: 8px; margin-bottom: 12px; font-size: 14px;">Conclusao</h3>
            ${Array.isArray(fields.conclusion) ? `
              <ul style="margin: 0; padding-left: 20px;">
                ${fields.conclusion.map((conc: string) => `<li style="margin: 6px 0; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word;">${conc}</li>`).join('')}
              </ul>
            ` : `<p style="margin: 0; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word;">${fields.conclusion}</p>`}
          </div>
        ` : ''}

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
                  <strong style="color: #0f766e;">${label}</strong>
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
              <p style="margin: 3px 0 0 0; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word; font-size: 11px;">${text}</p>
            </div>`;
          };

          const renderSection = (title: string, ids: string[]) => {
            const content = ids.map(renderField).join('');
            if (!content.trim()) return '';
            return `<div class="section-block" style="margin-bottom: 20px; page-break-inside: avoid;">
              <h3 style="color: #0d9488; border-bottom: 2px solid #14b8a6; padding-bottom: 8px; margin-bottom: 12px; font-size: 14px;">${title}</h3>
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
              <h3 style="color: #0d9488; border-bottom: 2px solid #14b8a6; padding-bottom: 8px; margin-bottom: 12px; font-size: 14px;">Resumo Quantitativo - Escalas Clínicas</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
                <thead>
                  <tr style="background: #f0fdfa;">
                    <th style="text-align: left; padding: 6px; border: 1px solid #99f6e4; color: #0f766e;">Domínio / Indicador</th>
                    <th style="text-align: center; padding: 6px; border: 1px solid #99f6e4; color: #0f766e; width: 80px;">Pontuação</th>
                    <th style="text-align: center; padding: 6px; border: 1px solid #99f6e4; color: #0f766e; width: 90px;">Classificação</th>
                  </tr>
                </thead>
                <tbody>
                  ${filledScales.map((s) => {
                    const cls = s.value >= 8 ? 'Excelente' : s.value >= 6 ? 'Adequado' : s.value >= 4 ? 'Em desenvolvimento' : 'Necessita suporte';
                    const color = s.value >= 8 ? '#10b981' : s.value >= 6 ? '#f59e0b' : s.value >= 4 ? '#f97316' : '#ef4444';
                    return `<tr>
                      <td style="padding: 6px; border: 1px solid #e5e7eb;">${s.label}</td>
                      <td style="padding: 6px; border: 1px solid #e5e7eb; text-align: center; font-weight: bold; color: ${color};">${s.value}/10</td>
                      <td style="padding: 6px; border: 1px solid #e5e7eb; text-align: center; color: ${color};">${cls}</td>
                    </tr>`;
                  }).join('')}
                </tbody>
              </table>
            </div>
          ` : '';

          // Sumário executivo
          const execItems: string[] = [];
          if (fields.cid_code) execItems.push(`<strong>Diagnóstico:</strong> ${fields.cid_code}`);
          if (fields.support_level) execItems.push(`<strong>Nível de Suporte:</strong> ${fields.support_level}`);
          if (fields.session_count) execItems.push(`<strong>Sessões realizadas:</strong> ${fields.session_count}`);
          if (fields.session_frequency) execItems.push(`<strong>Frequência:</strong> ${fields.session_frequency}`);
          if (fields.revaluation_date) execItems.push(`<strong>Próxima reavaliação:</strong> ${fields.revaluation_date}`);
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
            ${renderSection('Identificação Clínica', ['cid_code','support_level','comorbidities','current_medications','referral_source','treatment_start_date','session_count','session_frequency','session_duration'])}
            ${renderSection('Identidade Sonora (ISO de Benenzon)', ['iso_gestational','iso_universal','iso_cultural','iso_complementary','iso_group','sound_preferences','musical_repertoire_favorites'])}
            ${renderSection('Avaliação Sensório-Musical', ['auditory_processing','sound_tolerance','vestibular_response_music','tactile_instrument_response','proprioceptive_response','sensory_seeking_vs_avoiding','sensory_profile_notes'])}
            ${renderSection('Avaliação Clínica - Domínios - Escala MuseTera', ['domain_musicality','domain_communication_verbal','domain_communication_nonverbal','domain_social_interaction','domain_emotional','domain_cognitive','domain_motor_gross','domain_motor_fine','domain_sensory_integration','domain_autonomy','domain_evidences'])}
            ${renderSection('Detalhamento Clínico da Sessão', ['session_setting','session_structure','improvisation_use','receptive_techniques','recreative_techniques','compositional_techniques','tempo_dynamics_used','vocal_work'])}
            ${renderSection('Comunicação e Linguagem', ['vocalizations_observed','verbal_output_during_music','echolalia_musical','aac_use','pragmatic_skills'])}
            ${renderSection('Evolução Clínica Detalhada', ['evolution_compared_baseline','goals_achieved','goals_in_progress','goals_not_achieved','quantitative_indicators'])}
            ${renderSection('Plano Terapêutico Futuro', ['next_objectives_short','next_objectives_medium','next_objectives_long','proposed_interventions','expected_outcomes','revaluation_date'])}
            ${renderSection('Orientações Ampliadas', ['school_recommendations','interdisciplinary_team_notes','playlist_recommended','red_flags_to_monitor'])}
            ${scalesTable}
            ${(() => {
              const tf = (fields.theoretical_framework || '').toString().trim();
              const at = (fields.assessment_tools_used || '').toString().trim();
              const rc = (fields.references_cited || '').toString().trim();
              if (!tf && !at && !rc) return '';
              const formatList = (txt: string) => {
                const items = txt.split(/\n+/).map(s => s.replace(/^[-•\d.\)\s]+/, '').trim()).filter(Boolean);
                if (items.length <= 1) return `<p style="margin: 0; white-space: pre-wrap; font-size: 11px; line-height: 1.6; color: #1f2937;">${txt}</p>`;
                return `<ul style="margin: 0; padding-left: 18px; font-size: 11px; line-height: 1.7; color: #1f2937;">${items.map(i => `<li style="margin: 4px 0;">${i}</li>`).join('')}</ul>`;
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
                      Documento elaborado segundo diretrizes da WFMT (World Federation of Music Therapy), DSM-5-TR e CID-11
                    </div>
                  </div>
                </div>
              `;
            })()}
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
          title: "Narrativa de IA indisponível",
          description: "Revise os dados estruturados antes da exportação.",
        });
      }

      // Revisão clínica obrigatória antes de emitir o documento.
      setDraftReportData(currentReportData);
      setDraftNarrative(narrative || []);
      setReviewOpen(true);
    } catch (error) {
      console.error('Erro ao preparar relatório:', error);
      toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível preparar a revisão clínica.' });
    } finally {
      setIsExporting(false);
    }
  };

  const handleConfirmExportPDF = async () => {
    if (!draftReportData) return;
    setIsExporting(true);
    let tempDiv: HTMLDivElement | null = null;
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
      tempDiv = document.createElement('div');
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      tempDiv.style.color = '#000';
      tempDiv.style.backgroundColor = '#fff';
      tempDiv.innerHTML = generatePDFContent(draftReportData, photoBase64, stampBase64, null, draftNarrative);

      
      document.body.appendChild(tempDiv);

      // PDF configuration
      const opt = {
        margin: [10, 10],
        filename: `Relatorio_Musicoterapia_${String(draftReportData.patientName || "Paciente").replace(/[^a-zA-Z0-9_-]/g, "_")}_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'], avoid: ['.section-block', 'h2', 'h3'] }
      };

      // Generate and download PDF
      const pdfInstance = html2pdf().set(opt).from(tempDiv);
      await pdfInstance.save();
      try { const blob = await pdfInstance.outputPdf('blob'); await savePDFToStorage(blob, opt.filename, "report"); } catch(e) { console.warn("PDF não salvo no storage:", e); }
      
      tempDiv.remove();
      tempDiv = null;

      toast({
        title: "PDF gerado!",
        description: "Relatório revisado e exportado em PDF.",
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível gerar o PDF.",
      });
    } finally {
      tempDiv?.remove();
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
    <div className="relative min-h-screen">
      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Revisão clínica obrigatória</DialogTitle>
            <DialogDescription>
              Confira e edite a narrativa gerada por IA antes de emitir o relatório.
              Somente registros realmente observados e aplicados devem permanecer no documento.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {draftNarrative.length === 0 ? (
              <p className="text-sm text-amber-700">A IA não produziu uma narrativa. O PDF conterá apenas os dados estruturados registrados pelo profissional.</p>
            ) : draftNarrative.map((section, index) => (
              <div key={index} className="space-y-2">
                <label className="font-semibold text-sm">{section.title}</label>
                <textarea
                  className="w-full min-h-36 rounded-md border border-input bg-background p-3 text-sm leading-relaxed"
                  aria-label={`Revisar ${section.title}`}
                  value={section.content}
                  onChange={(event) => setDraftNarrative(prev => prev.map((item, i) =>
                    i === index ? { ...item, content: event.target.value } : item))}
                />
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-end gap-2 pt-3 border-t">
            <Button variant="outline" disabled={isExporting} onClick={() => setReviewOpen(false)}>Voltar e revisar dados</Button>
            <Button disabled={isExporting} onClick={handleConfirmExportPDF}>
              {isExporting ? 'Gerando PDF...' : 'Aprovar texto e baixar PDF'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
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
                  onClick={handleExportPDF}
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
                  onClick={handleExportPDF}
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
    </div>
  );
}