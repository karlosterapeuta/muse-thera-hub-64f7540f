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
  PtiContent, createDefaultPtiContent, createDefaultPtiFormulario, computePtiProgress,
  PTI_OPTS, PTI_AREAS, PTI_ESTRATEGIAS, PTI_RECURSOS, PTI_PROFISSIONAIS,
  PTI_FREQUENCIA, PTI_CRITERIOS_EVOLUCAO, PtiObjetivoEspecifico, PtiMeta,
} from "@/types/pti";
import { formatAgeString } from "@/utils/dateUtils";
import { generateStaticPDF } from "@/utils/staticPDFGenerator";
import { PtiPDF } from "@/components/pti/PtiPDF";
import { PtiContinuousForm } from "@/components/pti/PtiContinuousForm";
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
  const [importingClinical, setImportingClinical] = useState(false);
  const autoSaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadedRef = useRef(false);
  // Serializa as gravações e impede duplicação de planos ao salvar pela primeira vez.
  const planIdRef = useRef<string | undefined>(isNew ? undefined : id);
  const saveQueueRef = useRef<Promise<void>>(Promise.resolve());
  const patientLookupRef = useRef(0);

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
    if (pid === patientId) return;
    if (planIdRef.current) {
      toast.error("O paciente de um PTI já salvo não pode ser alterado. Crie um novo plano.");
      return;
    }
    if (patientId && !window.confirm("Trocar de paciente? O conteúdo ainda não salvo deste rascunho será reiniciado para não misturar informações clínicas.")) return;
    const p = patients?.find((x) => x.id === pid);
    if (!p) return;
    const lookupId = ++patientLookupRef.current;
    // Reiniciar qualquer conteúdo anterior antes de associar o novo paciente.
    const initial = createDefaultPtiContent();
    setContent({
      ...initial,
      identificacao: {
        ...initial.identificacao,
        nome: p.name || "",
        idade: formatAgeString(p.birth_date, p.age),
        nascimento: p.birth_date || "",
        responsavel: p.responsible || "",
        telefone: p.contact || "",
        profissional: professional?.name || "",
      },
    });
    setPatientId(pid);
    // A anamnese contém os nomes da mãe e do pai; o cadastro básico do paciente não.
    // Carregar somente esses campos automaticamente, sem alterar outros registros clínicos.
    void (async () => {
      const { data, error } = await supabase.from("anamnesis")
        .select("mother_name, father_name")
        .eq("patient_id", pid)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (lookupId !== patientLookupRef.current) return;
      if (error) {
        console.error("Erro ao carregar responsáveis da anamnese:", error);
        toast.info("Não foi possível carregar mãe e pai automaticamente. Você pode preencher os nomes manualmente.");
        return;
      }
      if (!data) return;
      setContent(current => ({
        ...current,
        formulario: {
          ...createDefaultPtiFormulario(),
          ...current.formulario,
          nomeMae: current.formulario?.nomeMae?.trim() || data.mother_name || "",
          nomePai: current.formulario?.nomePai?.trim() || data.father_name || "",
        },
      }));
    })();
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
      const motherName = field("mother_name");
      const fatherName = field("father_name");
      const currentMedication = field("current_medication");
      const mainDemand = field("main_clinical_demand");
      if (![clinicalDetails, diagnosis, code, musicalHistory, familyMusicalHistory, motherName, fatherName, currentMedication, mainDemand].some(Boolean)) {
        toast.info("A anamnese está disponível, mas não contém dados compatíveis para importação automática.");
        return;
      }
      if (!window.confirm("Importar da anamnese os campos clínicos disponíveis, mantendo os campos já preenchidos? Revise todos os dados antes de emitir o PTI.")) return;
      const preferCurrent = (current: string, imported: string) => current.trim() || imported;
      const form = { ...createDefaultPtiFormulario(), ...content.formulario };
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
        queixaPrincipal: preferCurrent(content.queixaPrincipal, mainDemand),
        formulario: {
          ...form,
          nomeMae: preferCurrent(form.nomeMae, motherName),
          nomePai: preferCurrent(form.nomePai, fatherName),
          medicacoesAtuais: preferCurrent(form.medicacoesAtuais, currentMedication),
          resumoClinico: preferCurrent(form.resumoClinico, clinicalDetails),
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
      const signature = (content.formulario?.incluirAssinatura !== false && professional?.digital_signature_url
        ? await imageUrlToBase64(professional.digital_signature_url)
        : "") || "";
      const stamp = (content.formulario?.incluirAssinatura !== false && professional?.digital_stamp_url
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

  return <PtiContinuousForm
    content={content}
    update={update}
    patients={patients || []}
    patientId={patientId}
    onSelectPatient={handleSelectPatient}
    isPatientLocked={!!planIdRef.current}
    status={status}
    onStatus={setStatus}
    professionalName={professional?.name || ""}
    lastSaved={lastSaved}
    saving={saveMutation.isPending}
    downloading={downloading}
    importingClinical={importingClinical}
    onImportClinical={() => { void importClinicalContext(); }}
    onSave={() => { void doSave(false); }}
    onDownload={() => { void handleDownloadPDF(); }}
  />;
}
