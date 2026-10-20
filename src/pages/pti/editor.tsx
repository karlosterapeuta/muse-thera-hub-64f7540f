import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Save, Plus, Trash2, Loader2, Check, FileDown, Stethoscope, ChevronLeft, ChevronRight, FileSearch,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { usePtiPlan, useSavePtiPlan, usePtiPatients } from "@/hooks/usePtiPlans";
import { useProfessionalData } from "@/hooks/useProfessionalData";
import { PtiAiButton } from "@/components/pti/PtiAiButton";
import {
  PtiContent, createDefaultPtiContent, computePtiProgress,
  PTI_OPTS, PTI_AREAS, PTI_ESTRATEGIAS, PTI_RECURSOS, PTI_PROFISSIONAIS,
  PTI_FREQUENCIA, PTI_CRITERIOS_EVOLUCAO, PtiObjetivoEspecifico, PtiMeta,
} from "@/types/pti";
import { formatAgeString } from "@/utils/dateUtils";
import { generateStaticPDF } from "@/utils/staticPDFGenerator";
import { PtiPDF } from "@/components/pti/PtiPDF";
import { PtiWizardNavigation, PTI_WIZARD_STEPS, type PtiStepId } from "@/components/pti/PtiWizardNavigation";
import { PtiObjectiveLibrary } from "@/components/pti/PtiObjectiveLibrary";
import { PtiReportStep } from "@/components/pti/PtiReportStep";
import { imageUrlToBase64 } from "@/utils/imageToBase64";
import { supabase } from "@/integrations/supabase/client";

const uid = () => Math.random().toString(36).slice(2, 10);

export default function PtiEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNew = !id || id === "novo";
  const { data: existing } = usePtiPlan(id);
  const { data: patients } = usePtiPatients();
  const { data: professional } = useProfessionalData();
  const saveMutation = useSavePtiPlan();

  const [planId, setPlanId] = useState<string | undefined>(isNew ? undefined : id);
  const [patientId, setPatientId] = useState<string | null>(null);
  const [status, setStatus] = useState("rascunho");
  const [content, setContent] = useState<PtiContent>(createDefaultPtiContent());
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [activeStep, setActiveStep] = useState<PtiStepId>("identificacao");
  const [importingClinical, setImportingClinical] = useState(false);
  const autoSaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadedRef = useRef(false);
  // Serializa as gravações e impede duplicação de planos ao salvar pela primeira vez.
  const planIdRef = useRef<string | undefined>(isNew ? undefined : id);
  const saveQueueRef = useRef<Promise<void>>(Promise.resolve());

  // Load existing plan
  useEffect(() => {
    if (existing && !loadedRef.current) {
      loadedRef.current = true;
      setPlanId(existing.id);
      planIdRef.current = existing.id;
      setPatientId(existing.patient_id);
      setStatus(existing.status);
      setContent({ ...createDefaultPtiContent(), ...existing.content });
    }
  }, [existing]);

  // Prefill professional info
  useEffect(() => {
    if (professional && !content.identificacao.profissional) {
      setContent((c) => ({
        ...c,
        identificacao: { ...c.identificacao, profissional: professional.name || "" },
      }));
    }
  }, [professional]);

  const progress = computePtiProgress(content);

  const update = useCallback((patch: Partial<PtiContent>) => {
    setContent((c) => ({ ...c, ...patch }));
  }, []);

  const doSave = useCallback(
    (silent = false): Promise<boolean> => {
      if (!professional) {
        if (!silent) toast.error("Carregando seus dados profissionais. Aguarde um instante e tente novamente.");
        return Promise.resolve(false);
      }
      if (!patientId) {
        if (!silent) toast.error("Selecione um paciente antes de salvar o PTI.");
        return Promise.resolve(false);
      }

      // A fila mantém a ordem entre autosave, salvar manualmente e exportar PDF.
      // Cada tarefa conserva o conteúdo do momento do clique.
      const snapshot = {
        patient_id: patientId,
        title: content.identificacao.nome
          ? `PTI - ${content.identificacao.nome}`
          : "Plano Terapêutico Individual",
        status,
        plan_date: content.identificacao.dataPlano,
        content,
        createVersion: !silent,
      };
      const persist = async (): Promise<boolean> => {
        try {
          const savedId = await saveMutation.mutateAsync({
            ...snapshot,
            id: planIdRef.current,
          });
          if (!planIdRef.current) {
            planIdRef.current = savedId;
            setPlanId(savedId);
            navigate(`/pti/${savedId}`, { replace: true });
          }
          setLastSaved(new Date());
          if (!silent) toast.success("Plano salvo e versão registrada");
          return true;
        } catch (e: any) {
          if (e?.savedPlanId && !planIdRef.current) {
            planIdRef.current = e.savedPlanId;
            setPlanId(e.savedPlanId);
          }
          if (!silent) toast.error(e.message || "Erro ao salvar");
          return false;
        }
      };
      const pending = saveQueueRef.current.then(persist, persist);
      saveQueueRef.current = pending.then(() => undefined, () => undefined);
      return pending;
    },
    [professional, patientId, status, content, saveMutation, navigate],
  );

  // Auto-save
  useEffect(() => {
    if (!loadedRef.current && !isNew) return;
    if (!content.identificacao.nome || !patientId) return;
    if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
    autoSaveRef.current = setTimeout(() => doSave(true), 2500);
    return () => {
      if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, patientId, status]);

  const handleSelectPatient = (pid: string) => {
    setPatientId(pid);
    const p = patients?.find((x) => x.id === pid);
    if (p) {
      update({
        identificacao: {
          ...content.identificacao,
          nome: p.name || "",
          idade: formatAgeString(p.birth_date, p.age),
          nascimento: p.birth_date || "",
          responsavel: p.responsible || "",
          telefone: p.contact || "",
        },
      });
    }
  };

  // Importa apenas informações efetivamente registradas na anamnese.
  // Não sobrescreve notas já digitadas pelo profissional.
  const importClinicalContext = async () => {
    if (!patientId) {
      toast.error("Selecione um paciente para importar dados da anamnese.");
      return;
    }
    setImportingClinical(true);
    try {
      const { data: record, error } = await supabase.from("anamnesis")
        .select("*").eq("patient_id", patientId)
        .order("updated_at", { ascending: false }).limit(1).maybeSingle();
      if (error) throw error;
      if (!record) {
        toast.info("Nenhuma anamnese encontrada para este paciente.");
        return;
      }
      const rec = record as Record<string, unknown>;
      const field = (key: string) => typeof rec[key] === "string" ? (rec[key] as string).trim() : "";
      const clinicalDetails = field("clinical_details");
      const diagnosis = field("diagnosis_details");
      const code = field("cid_code");
      const musicalHistory = field("patient_musical_history");
      const familyMusicalHistory = field("family_musical_history");
      if (![clinicalDetails, diagnosis, code, musicalHistory, familyMusicalHistory].some(Boolean)) {
        toast.info("A anamnese está disponível, mas não contém dados compatíveis para importação automática.");
        return;
      }
      if (!window.confirm("Importar da anamnese os campos clínicos disponíveis, mantendo os campos já preenchidos? Revise todos os dados antes de emitir o PTI.")) return;
      const preferCurrent = (current: string, imported: string) => current.trim() || imported;
      update({
        identificacao: {
          ...content.identificacao,
          diagnostico: preferCurrent(content.identificacao.diagnostico, diagnosis),
          cid: preferCurrent(content.identificacao.cid, code),
        },
        historicoClinico: {
          ...content.historicoClinico,
          desenvolvimento: preferCurrent(content.historicoClinico.desenvolvimento, clinicalDetails),
          historicoMusical: preferCurrent(content.historicoClinico.historicoMusical, musicalHistory),
        },
      });
      if (familyMusicalHistory && !content.historicoClinico.terapiasAnteriores.trim()) {
        // O histórico musical familiar não corresponde a terapias anteriores:
        // manter esse dado apenas como informação complementar verificável.
        toast.info("Histórico musical familiar disponível na anamnese para consulta; não foi inserido em um campo de terapia anterior.");
      }
      toast.success("Dados disponíveis importados. Confira diagnóstico, CID e histórico.");
    } catch (error) {
      console.error("Erro ao importar anamnese para o PTI:", error);
      toast.error("Não foi possível consultar a anamnese deste paciente.");
    } finally {
      setImportingClinical(false);
    }
  };

  const aiContext = {
    nome: content.identificacao.nome,
    idade: content.identificacao.idade,
    diagnostico: content.identificacao.diagnostico,
    cid: content.identificacao.cid,
    dsm: content.identificacao.dsm,
    queixaPrincipal: content.queixaPrincipal,
    historicoClinico: Object.values(content.historicoClinico).filter(Boolean).join("; "),
    avaliacao: Object.entries(content.avaliacao)
      .map(([k, v]) => `${k}: ${v.opcoes.join(", ")} ${v.observacoes}`)
      .join(" | "),
    potencialidades: content.potencialidades,
    dificuldades: content.dificuldades,
    objetivosAnteriores: content.objetivosEspecificos.map((o) => o.descricao).join("; "),
  };

  const applyText = (field: keyof PtiContent) => (text: string, mode: "replace" | "append") => {
    const current = (content[field] as string) || "";
    update({ [field]: mode === "append" && current ? `${current}\n${text}` : text } as any);
  };

  // multi-select toggle
  const toggleArray = (field: "estrategias" | "recursos", value: string) => {
    const arr = content[field];
    update({ [field]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] } as any);
  };

  const toggleAvaliacao = (cat: keyof PtiContent["avaliacao"], value: string) => {
    const c = content.avaliacao[cat];
    const opcoes = c.opcoes.includes(value)
      ? c.opcoes.filter((v) => v !== value)
      : [...c.opcoes, value];
    update({ avaliacao: { ...content.avaliacao, [cat]: { ...c, opcoes } } });
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      // Nunca exportar conteúdo apenas em memória: confirmar salvamento e versão.
      const saved = await doSave(false);
      if (!saved) return;
      const signature = (professional?.digital_signature_url
        ? await imageUrlToBase64(professional.digital_signature_url)
        : "") || "";
      const stamp = (professional?.digital_stamp_url
        ? await imageUrlToBase64(professional.digital_stamp_url)
        : "") || "";
      await generateStaticPDF(
        <PtiPDF content={content} professional={professional} signature={signature} stamp={stamp} />,
        { filename: `PTI-${content.identificacao.nome || "plano"}.pdf` },
      );
    } catch (e: any) {
      toast.error("Erro ao gerar PDF");
    } finally {
      setDownloading(false);
    }
  };

  // ---- repeatable: objetivos especificos ----
  const addObjetivo = () => update({
    objetivosEspecificos: [
      ...content.objetivosEspecificos,
      { id: uid(), descricao: "", atividade: "", material: "", prazo: "", prioridade: "", area: "" } as PtiObjetivoEspecifico,
    ],
  });
  const updateObjetivo = (oid: string, patch: Partial<PtiObjetivoEspecifico>) =>
    update({ objetivosEspecificos: content.objetivosEspecificos.map((o) => o.id === oid ? { ...o, ...patch } : o) });
  const removeObjetivo = (oid: string) =>
    update({ objetivosEspecificos: content.objetivosEspecificos.filter((o) => o.id !== oid) });

  // ---- repeatable: metas ----
  const addMeta = () => update({
    metas: [...content.metas, { id: uid(), descricao: "", linhaBase: "", indicador: "", percentual: "", prazo: "", criterio: "" } as PtiMeta],
  });
  const updateMeta = (mid: string, patch: Partial<PtiMeta>) =>
    update({ metas: content.metas.map((m) => m.id === mid ? { ...m, ...patch } : m) });
  const removeMeta = (mid: string) => update({ metas: content.metas.filter((m) => m.id !== mid) });

  const ident = content.identificacao;
  const currentStepIndex = PTI_WIZARD_STEPS.findIndex((step) => step.id === activeStep);
  const goStep = (offset: number) => {
    const nextStep = PTI_WIZARD_STEPS[currentStepIndex + offset];
    if (nextStep) {
      setActiveStep(nextStep.id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Sticky header */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border/60">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="ghost" size="icon" className="shrink-0 h-9 w-9" onClick={() => navigate("/pti")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-sm sm:text-base font-bold truncate flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-primary shrink-0" />
                <span className="truncate">PTI MuseTera · Editor V2</span>
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Progress value={progress} className="h-1.5 flex-1 max-w-[180px]" />
                <span className="text-xs text-muted-foreground shrink-0" title="Percentual de campos preenchidos; não representa evolução clínica">Preenchimento: {progress}%</span>
                {lastSaved && (
                  <span className="text-xs text-emerald-600 flex items-center gap-1 shrink-0">
                    <Check className="h-3 w-3" /> salvo
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={handleDownloadPDF} disabled={downloading} className="gap-1.5 px-2.5 sm:px-3">
                {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
                <span className="hidden xs:inline">PDF</span>
              </Button>
              <Button size="sm" onClick={() => doSave(false)} disabled={saveMutation.isPending} className="gap-1.5 px-2.5 sm:px-3">
                {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                <span className="hidden xs:inline">Salvar</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto px-4 py-6 space-y-5"
      >
        <PtiWizardNavigation
          current={activeStep}
          onChange={setActiveStep}
          patientName={ident.nome}
          completion={progress}
          objectives={content.objetivosEspecificos.length}
          goals={content.metas.length}
          status={status}
        />

        {activeStep === "contexto" && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/25 bg-primary/[0.04] p-4">
            <div>
              <p className="text-sm font-semibold">Dados clínicos existentes</p>
              <p className="text-xs text-muted-foreground">Preencha campos vazios a partir da anamnese cadastrada, sem substituir registros manuais.</p>
            </div>
            <Button variant="outline" onClick={importClinicalContext} disabled={importingClinical || !patientId} className="gap-2">
              {importingClinical ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSearch className="h-4 w-4" />} Importar anamnese
            </Button>
          </div>
        )}

        {/* Patient + status selectors */}
        <Card className="border-primary/20 bg-card/90 shadow-sm">
          <CardContent className="p-5 grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Paciente</Label>
              <Select value={patientId ?? undefined} onValueChange={handleSelectPatient}>
                <SelectTrigger><SelectValue placeholder="Selecione um paciente" /></SelectTrigger>
                <SelectContent>
                  {(patients || []).map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="rascunho">Rascunho</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="concluído">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Accordion type="multiple" defaultValue={Array.from({ length: 18 }, (_, index) => `s${index + 1}`)} className="space-y-3">
          {activeStep === "identificacao" && (<>
          {/* 1. Identificação */}
          <SectionItem value="s1" title="1. Identificação">
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Nome" value={ident.nome} onChange={(v) => update({ identificacao: { ...ident, nome: v } })} />
              <Field label="Idade" value={ident.idade} onChange={(v) => update({ identificacao: { ...ident, idade: v } })} />
              <Field label="Data de nascimento" type="date" value={ident.nascimento} onChange={(v) => update({ identificacao: { ...ident, nascimento: v } })} />
              <Field label="Sexo" value={ident.sexo} onChange={(v) => update({ identificacao: { ...ident, sexo: v } })} />
              <Field label="Responsável" value={ident.responsavel} onChange={(v) => update({ identificacao: { ...ident, responsavel: v } })} />
              <Field label="Telefone" value={ident.telefone} onChange={(v) => update({ identificacao: { ...ident, telefone: v } })} />
              <Field label="Diagnóstico" value={ident.diagnostico} onChange={(v) => update({ identificacao: { ...ident, diagnostico: v } })} />
              <Field label="CID" value={ident.cid} onChange={(v) => update({ identificacao: { ...ident, cid: v } })} />
              <Field label="DSM" value={ident.dsm} onChange={(v) => update({ identificacao: { ...ident, dsm: v } })} />
              <Field label="Data do plano" type="date" value={ident.dataPlano} onChange={(v) => update({ identificacao: { ...ident, dataPlano: v } })} />
              <Field label="Profissional responsável" value={ident.profissional} onChange={(v) => update({ identificacao: { ...ident, profissional: v } })} />
              <Field label="CBO" value={ident.cbo} onChange={(v) => update({ identificacao: { ...ident, cbo: v } })} />
            </div>
          </SectionItem>

          </>)}
          {activeStep === "contexto" && (<>
          {/* 2. Queixa Principal */}
          <SectionItem value="s2" title="2. Queixa Principal" ai={<PtiAiButton section="queixaPrincipal" context={aiContext} onApply={applyText("queixaPrincipal")} />}>
            <Textarea rows={4} value={content.queixaPrincipal} onChange={(e) => update({ queixaPrincipal: e.target.value })} placeholder="Descreva a queixa principal..." />
          </SectionItem>

          {/* 3. Histórico Clínico */}
          <SectionItem value="s3" title="3. Histórico Clínico" ai={<PtiAiButton section="historicoClinico" context={aiContext} onApply={(t, m) => {
            const cur = content.historicoClinico.desenvolvimento;
            update({ historicoClinico: { ...content.historicoClinico, desenvolvimento: m === "append" && cur ? `${cur}\n${t}` : t } });
          }} />}>
            <div className="grid sm:grid-cols-2 gap-3">
              {([
                ["desenvolvimento", "Desenvolvimento"],
                ["escolaridade", "Escolaridade"],
                ["comunicacao", "Comunicação"],
                ["terapiasAnteriores", "Terapias anteriores"],
                ["historicoMusical", "Histórico musical"],
                ["preferenciasMusicais", "Preferências musicais"],
                ["hipersensibilidades", "Hipersensibilidades"],
                ["hipossensibilidades", "Hipossensibilidades"],
              ] as const).map(([k, lbl]) => (
                <div key={k} className="space-y-1.5">
                  <Label className="text-sm">{lbl}</Label>
                  <Textarea rows={2} value={(content.historicoClinico as any)[k]} onChange={(e) => update({ historicoClinico: { ...content.historicoClinico, [k]: e.target.value } })} />
                </div>
              ))}
            </div>
          </SectionItem>

          {/* 4. Avaliação Musicoterapêutica */}
          <SectionItem value="s4" title="4. Avaliação Musicoterapêutica">
            <div className="space-y-5">
              {(Object.keys(PTI_OPTS) as (keyof typeof PTI_OPTS)[]).map((cat) => (
                <div key={cat} className="space-y-2">
                  <Label className="capitalize font-semibold">{cat}</Label>
                  <div className="flex flex-wrap gap-2">
                    {PTI_OPTS[cat].map((opt) => {
                      const checked = content.avaliacao[cat].opcoes.includes(opt);
                      return (
                        <button
                          type="button"
                          key={opt}
                          onClick={() => toggleAvaliacao(cat, opt)}
                          className={`px-3 py-1.5 rounded-full text-sm border transition ${checked ? "bg-primary text-primary-foreground border-primary" : "bg-muted/40 border-border hover:bg-muted"}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  <Textarea rows={2} placeholder="Observações..." value={content.avaliacao[cat].observacoes}
                    onChange={(e) => update({ avaliacao: { ...content.avaliacao, [cat]: { ...content.avaliacao[cat], observacoes: e.target.value } } })} />
                </div>
              ))}
            </div>
          </SectionItem>

          {/* 5. Potencialidades */}
          <SectionItem value="s5" title="5. Potencialidades" ai={<PtiAiButton section="potencialidades" context={aiContext} onApply={applyText("potencialidades")} />}>
            <Textarea rows={5} value={content.potencialidades} onChange={(e) => update({ potencialidades: e.target.value })} placeholder="Boa resposta ao ritmo, interesse por instrumentos..." />
          </SectionItem>

          {/* 6. Dificuldades */}
          <SectionItem value="s6" title="6. Dificuldades" ai={<PtiAiButton section="dificuldades" context={aiContext} onApply={applyText("dificuldades")} />}>
            <Textarea rows={5} value={content.dificuldades} onChange={(e) => update({ dificuldades: e.target.value })} />
          </SectionItem>

          </>)}
          {activeStep === "objetivos" && (<>
          {/* 7. Objetivo Geral */}
          <SectionItem value="s7" title="7. Objetivo Geral" ai={<PtiAiButton section="objetivoGeral" context={aiContext} onApply={applyText("objetivoGeral")} />}>
            <Textarea rows={4} value={content.objetivoGeral} onChange={(e) => update({ objetivoGeral: e.target.value })} />
          </SectionItem>

          {/* 8. Objetivos Específicos */}
          <SectionItem value="s8" title="8. Objetivos Específicos">
            <div className="space-y-3">
              <PtiObjectiveLibrary
                selected={content.objetivosEspecificos.map((item) => item.descricao)}
                onAdd={(item) => update({ objetivosEspecificos: [...content.objetivosEspecificos, { id: uid(), descricao: item.objective, atividade: item.example, material: item.resource, prazo: "", prioridade: "Média", area: item.area }] })}
              />
              {content.objetivosEspecificos.map((o) => (
                <Card key={o.id} className="border-border/60">
                  <CardContent className="p-3 space-y-2">
                    <div className="flex gap-2">
                      <Textarea rows={2} className="flex-1" placeholder="Descrição do objetivo" value={o.descricao} onChange={(e) => updateObjetivo(o.id, { descricao: e.target.value })} />
                      <Button variant="ghost" size="icon" onClick={() => removeObjetivo(o.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2">
                      <div className="space-y-1"><Label className="text-xs">Atividade musicoterapêutica</Label><Textarea rows={2} placeholder="Ex.: diálogo rítmico em turnos" value={o.atividade || ""} onChange={(e) => updateObjetivo(o.id, { atividade: e.target.value })} /></div>
                      <div className="space-y-1"><Label className="text-xs">Materiais e instrumentos</Label><Textarea rows={2} placeholder="Ex.: tambor, teclado e cartões" value={o.material || ""} onChange={(e) => updateObjetivo(o.id, { material: e.target.value })} /></div>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-2">
                      <Input placeholder="Prazo" value={o.prazo} onChange={(e) => updateObjetivo(o.id, { prazo: e.target.value })} />
                      <Select value={o.prioridade || undefined} onValueChange={(v) => updateObjetivo(o.id, { prioridade: v as any })}>
                        <SelectTrigger><SelectValue placeholder="Prioridade" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Alta">Alta</SelectItem>
                          <SelectItem value="Média">Média</SelectItem>
                          <SelectItem value="Baixa">Baixa</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={o.area || undefined} onValueChange={(v) => updateObjetivo(o.id, { area: v })}>
                        <SelectTrigger><SelectValue placeholder="Área" /></SelectTrigger>
                        <SelectContent>
                          {PTI_AREAS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={addObjetivo} className="gap-1.5"><Plus className="h-4 w-4" /> Adicionar objetivo</Button>
                <PtiAiButton section="objetivosEspecificos" context={aiContext} label="Sugerir com IA" onApply={(t) => {
                  const lines = t.split("\n").map((l) => l.replace(/^[-*\d.\s]+/, "").trim()).filter(Boolean);
                  update({ objetivosEspecificos: [...content.objetivosEspecificos, ...lines.map((d) => ({ id: uid(), descricao: d, atividade: "", material: "", prazo: "", prioridade: "" as const, area: "" }))] });
                }} />
              </div>
            </div>
          </SectionItem>

          {/* 9. Metas Terapêuticas */}
          <SectionItem value="s9" title="9. Metas Terapêuticas">
            <div className="space-y-3">
              {content.metas.map((m) => (
                <Card key={m.id} className="border-border/60">
                  <CardContent className="p-3 space-y-2">
                    <div className="flex gap-2">
                      <Textarea rows={2} className="flex-1" placeholder="Descrição da meta" value={m.descricao} onChange={(e) => updateMeta(m.id, { descricao: e.target.value })} />
                      <Button variant="ghost" size="icon" onClick={() => removeMeta(m.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2">
                      <Input placeholder="Linha de base observada" value={m.linhaBase || ""} onChange={(e) => updateMeta(m.id, { linhaBase: e.target.value })} />
                      <Input placeholder="Indicador" value={m.indicador} onChange={(e) => updateMeta(m.id, { indicador: e.target.value })} />
                      <Input placeholder="% esperado" value={m.percentual} onChange={(e) => updateMeta(m.id, { percentual: e.target.value })} />
                      <Input placeholder="Prazo" value={m.prazo} onChange={(e) => updateMeta(m.id, { prazo: e.target.value })} />
                      <Input placeholder="Critério de sucesso" value={m.criterio} onChange={(e) => updateMeta(m.id, { criterio: e.target.value })} />
                    </div>
                  </CardContent>
                </Card>
              ))}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={addMeta} className="gap-1.5"><Plus className="h-4 w-4" /> Adicionar meta</Button>
                <PtiAiButton section="metas" context={aiContext} label="Sugerir com IA" onApply={(t) => {
                  const lines = t.split("\n").map((l) => l.replace(/^[-*\d.\s]+/, "").trim()).filter(Boolean);
                  update({ metas: [...content.metas, ...lines.map((d) => ({ id: uid(), descricao: d, linhaBase: "", indicador: "", percentual: "", prazo: "", criterio: "" }))] });
                }} />
              </div>
            </div>
          </SectionItem>

          </>)}
          {activeStep === "intervencoes" && (<>
          {/* 10. Estratégias */}
          <SectionItem value="s10" title="10. Estratégias Musicoterapêuticas">
            <ChipMulti options={PTI_ESTRATEGIAS} selected={content.estrategias} onToggle={(v) => toggleArray("estrategias", v)} onAdd={(v) => update({ estrategias: [...content.estrategias, v] })} addLabel="Nova estratégia" />
          </SectionItem>

          {/* 11. Recursos */}
          <SectionItem value="s11" title="11. Recursos Utilizados">
            <ChipMulti options={PTI_RECURSOS} selected={content.recursos} onToggle={(v) => toggleArray("recursos", v)} onAdd={(v) => update({ recursos: [...content.recursos, v] })} addLabel="Novo recurso" />
          </SectionItem>

          {/* 12. Frequência */}
          <SectionItem value="s12" title="12. Frequência">
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm">Sessões</Label>
                <Select value={content.frequencia.sessoes || undefined} onValueChange={(v) => update({ frequencia: { ...content.frequencia, sessoes: v } })}>
                  <SelectTrigger><SelectValue placeholder="Frequência" /></SelectTrigger>
                  <SelectContent>{PTI_FREQUENCIA.sessoes.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Duração</Label>
                <Select value={content.frequencia.duracao || undefined} onValueChange={(v) => update({ frequencia: { ...content.frequencia, duracao: v } })}>
                  <SelectTrigger><SelectValue placeholder="Duração" /></SelectTrigger>
                  <SelectContent>{PTI_FREQUENCIA.duracao.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Atendimento</Label>
                <Select value={content.frequencia.atendimento || undefined} onValueChange={(v) => update({ frequencia: { ...content.frequencia, atendimento: v } })}>
                  <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
                  <SelectContent>{PTI_FREQUENCIA.atendimento.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          </SectionItem>

          </>)}
          {activeStep === "acompanhamento" && (<>
          {/* 13. Critérios de Evolução */}
          {planId && <div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/25 bg-primary/[0.04] p-4">
            <p className="text-sm text-muted-foreground">A reavaliação permite registrar indicadores por período sem sobrescrever o PTI original.</p>
            <Button type="button" variant="outline" onClick={() => navigate(`/pti/${planId}/reavaliacao`)}>Abrir reavaliação</Button>
          </div>}
          <SectionItem value="s13" title="13. Critérios de Evolução (1 a 5)">
            <div className="space-y-3">
              {PTI_CRITERIOS_EVOLUCAO.map((area) => (
                <div key={area} className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-3">
                  <span className="text-sm">{area}</span>
                  <div className="flex gap-1.5 shrink-0">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button key={n} type="button"
                        onClick={() => update({ criteriosEvolucao: { ...content.criteriosEvolucao, [area]: n } })}
                        className={`w-8 h-8 rounded-lg text-sm font-semibold border transition ${content.criteriosEvolucao[area] === n ? "bg-primary text-primary-foreground border-primary" : "bg-muted/40 border-border hover:bg-muted"}`}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SectionItem>

          {/* 14. Critérios para Alta */}
          <SectionItem value="s14" title="14. Critérios para Alta" ai={<PtiAiButton section="criteriosAlta" context={aiContext} onApply={applyText("criteriosAlta")} />}>
            <Textarea rows={4} value={content.criteriosAlta} onChange={(e) => update({ criteriosAlta: e.target.value })} />
          </SectionItem>

          </>)}
          {activeStep === "familia" && (<>
          {/* 15. Plano Familiar */}
          <SectionItem value="s15" title="15. Plano Familiar" ai={<PtiAiButton section="planoFamiliar" context={aiContext} onApply={applyText("planoFamiliar")} />}>
            <Textarea rows={4} value={content.planoFamiliar} onChange={(e) => update({ planoFamiliar: e.target.value })} />
          </SectionItem>

          {/* 16. Integração Multiprofissional */}
          <SectionItem value="s16" title="16. Integração Multiprofissional">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {PTI_PROFISSIONAIS.map((p) => {
                  const checked = content.integracao.profissionais.includes(p);
                  return (
                    <button key={p} type="button"
                      onClick={() => update({ integracao: { ...content.integracao, profissionais: checked ? content.integracao.profissionais.filter((x) => x !== p) : [...content.integracao.profissionais, p] } })}
                      className={`px-3 py-1.5 rounded-full text-sm border transition ${checked ? "bg-primary text-primary-foreground border-primary" : "bg-muted/40 border-border hover:bg-muted"}`}>
                      {p}
                    </button>
                  );
                })}
              </div>
              <Textarea rows={2} placeholder="Observações..." value={content.integracao.observacoes} onChange={(e) => update({ integracao: { ...content.integracao, observacoes: e.target.value } })} />
            </div>
          </SectionItem>

          </>)}
          {activeStep === "revisao" && (<>
          {/* 17. Fundamentação Técnica */}
          <SectionItem value="s17" title="17. Fundamentação Técnica" ai={<PtiAiButton section="fundamentacao" context={aiContext} onApply={applyText("fundamentacao")} />}>
            <Textarea rows={5} value={content.fundamentacao} onChange={(e) => update({ fundamentacao: e.target.value })} />
          </SectionItem>

          {/* 18. Assinatura */}
          <SectionItem value="s18" title="18. Assinatura">
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong className="text-foreground">{ident.profissional || professional?.name}</strong></p>
              {ident.cbo && <p>CBO: {ident.cbo}</p>}
              <div className="flex gap-6 mt-2">
                {professional?.digital_signature_url && (
                  <div><p className="text-xs mb-1">Assinatura digital</p><img src={professional.digital_signature_url} alt="Assinatura" className="h-16 object-contain" /></div>
                )}
                {professional?.digital_stamp_url && (
                  <div><p className="text-xs mb-1">Carimbo</p><img src={professional.digital_stamp_url} alt="Carimbo" className="h-16 object-contain" /></div>
                )}
              </div>
              <p>Data: {ident.dataPlano && new Date(ident.dataPlano + "T00:00:00").toLocaleDateString("pt-BR")}</p>
            </div>
          </SectionItem>
          </>)}
          {activeStep === "relatorio" && (
            <PtiReportStep
              content={content}
              completion={progress}
              patientId={patientId}
              planId={planId}
              saving={saveMutation.isPending}
              downloading={downloading}
              onSave={() => { void doSave(false); }}
              onExport={handleDownloadPDF}
              onReevaluate={() => navigate(`/pti/${planId}/reavaliacao`)}
            />
          )}
        </Accordion>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-5">
          <Button variant="outline" onClick={() => goStep(-1)} disabled={currentStepIndex === 0} className="gap-2">
            <ChevronLeft className="h-4 w-4" /> Etapa anterior
          </Button>
          <span className="text-xs text-muted-foreground">Etapa {currentStepIndex + 1} / {PTI_WIZARD_STEPS.length}</span>
          <Button onClick={() => goStep(1)} disabled={currentStepIndex === PTI_WIZARD_STEPS.length - 1} className="gap-2">
            Próxima etapa <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

function SectionItem({ value, title, children, ai }: { value: string; title: string; children: React.ReactNode; ai?: React.ReactNode }) {
  return (
    <AccordionItem value={value} className="border border-border/60 rounded-xl bg-card overflow-hidden">
      <AccordionTrigger className="px-4 py-3 hover:no-underline text-left font-semibold text-sm">{title}</AccordionTrigger>
      <AccordionContent className="px-4 pb-4">
        {ai && <div className="flex justify-end mb-3">{ai}</div>}
        {children}
      </AccordionContent>
    </AccordionItem>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function ChipMulti({ options, selected, onToggle, onAdd, addLabel }: { options: string[]; selected: string[]; onToggle: (v: string) => void; onAdd: (v: string) => void; addLabel: string }) {
  const [custom, setCustom] = useState("");
  const all = Array.from(new Set([...options, ...selected]));
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {all.map((opt) => {
          const checked = selected.includes(opt);
          return (
            <button key={opt} type="button" onClick={() => onToggle(opt)}
              className={`px-3 py-1.5 rounded-full text-sm border transition ${checked ? "bg-primary text-primary-foreground border-primary" : "bg-muted/40 border-border hover:bg-muted"}`}>
              {opt}
            </button>
          );
        })}
      </div>
      <div className="flex gap-2">
        <Input placeholder={addLabel} value={custom} onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && custom.trim()) { onAdd(custom.trim()); setCustom(""); } }} />
        <Button variant="outline" size="sm" disabled={!custom.trim()} onClick={() => { onAdd(custom.trim()); setCustom(""); }}><Plus className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}
