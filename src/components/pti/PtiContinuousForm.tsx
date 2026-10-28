import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, FileDown, Loader2, Save, ClipboardList, Info } from "lucide-react";
import { type PtiContent, createDefaultPtiFormulario, computePtiProgress } from "@/types/pti";
import { PtiScreenshotSections, CheckBox, fieldClass } from "./PtiScreenshotSections";

interface PatientOption { id:string; name:string; }
interface Props {
  content:PtiContent;
  update:(p:Partial<PtiContent>)=>void;
  patients:PatientOption[];
  patientId:string|null;
  onSelectPatient:(id:string)=>void;
  isPatientLocked:boolean;
  status:string;
  onStatus:(status:string)=>void;
  professionalName:string;
  lastSaved:Date|null;
  saving:boolean;
  downloading:boolean;
  importingClinical:boolean;
  onImportClinical:()=>void;
  onSave:()=>void;
  onDownload:()=>void;
}
export function PtiContinuousForm({
  content,update,patients,patientId,onSelectPatient,isPatientLocked,status,onStatus,
  professionalName,lastSaved,saving,downloading,importingClinical,onImportClinical,onSave,onDownload,
}:Props) {
  const navigate=useNavigate();
  const form={...createDefaultPtiFormulario(),...content.formulario};
  const progress=computePtiProgress(content);
  const ready=!!patientId&&!!content.identificacao.nome.trim();
  const bar="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed";
  return <div className="min-h-screen bg-slate-50/70 pb-16 text-foreground dark:bg-background">
    <header className="relative z-30 border-b border-border bg-card shadow-sm lg:sticky lg:top-0">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
        <button type="button" className={bar+" border-border bg-card text-foreground hover:bg-muted"} onClick={()=>navigate("/pti")}><ArrowLeft aria-hidden="true" className="h-4 w-4" /> Voltar</button>
        <div className="min-w-0 flex-1 basis-[180px]">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">MuseTera · PTI</p>
          <h1 className="truncate text-base font-bold text-foreground sm:text-lg" title={content.identificacao.nome||"Plano Terapêutico Individual"}>{content.identificacao.nome||"Plano Terapêutico Individual"}</h1>
        </div>
        <div className="flex w-full flex-wrap gap-2 sm:w-auto">
          <button type="button" className={bar+" flex-1 border-border bg-card text-foreground hover:bg-muted sm:flex-none"} onClick={()=>navigate("/evaluation")}>Avaliação</button>
          <button type="button" className={bar+" flex-1 border-border bg-card text-foreground hover:bg-muted disabled:opacity-50 sm:flex-none"} disabled={saving||!ready} onClick={onSave}>
            {saving?<Loader2 aria-hidden="true" className="h-4 w-4 animate-spin motion-reduce:animate-none" />:<Save aria-hidden="true" className="h-4 w-4" />} Salvar
          </button>
          <button type="button" className={bar+" flex-1 border-primary bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 sm:flex-none"} disabled={saving||downloading||!ready} onClick={onDownload}>
            {downloading?<Loader2 aria-hidden="true" className="h-4 w-4 animate-spin motion-reduce:animate-none" />:<FileDown aria-hidden="true" className="h-4 w-4" />} Exportar PDF
          </button>
        </div>
      </div>
    </header>
    <main className="mx-auto max-w-7xl space-y-5 px-3 py-6 sm:px-6 sm:py-8">
      <section aria-label="Resumo do plano" className="rounded-2xl border border-teal-200 bg-gradient-to-br from-white via-emerald-50/70 to-teal-50 p-5 shadow-sm dark:border-teal-900 dark:from-teal-950/50 dark:via-background dark:to-background sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-teal-800 dark:text-teal-300"><ClipboardList aria-hidden="true" className="h-4 w-4" /> Planejamento clínico</p>
            <h2 className="text-2xl font-bold tracking-tight text-teal-950 dark:text-teal-100 sm:text-3xl">Plano Terapêutico Individual</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200 sm:text-base">Organize objetivos, metas e intervenções musicoterapêuticas para cada paciente.</p>
          </div>
          <div className="rounded-xl border border-teal-200 bg-card/90 px-4 py-3 text-right dark:border-teal-800">
            <p className="text-2xl font-bold tabular-nums text-teal-900 dark:text-teal-100">{progress}%</p>
            <p className="text-xs font-medium text-muted-foreground">Preenchido · {content.objetivosEspecificos.length} objetivos</p>
          </div>
        </div>
        <div role="progressbar" aria-label="Preenchimento do PTI" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} className="mt-5 h-2.5 overflow-hidden rounded-full bg-teal-100 dark:bg-teal-950">
          <div className="h-full rounded-full bg-teal-700 transition-[width] duration-300 motion-reduce:transition-none" style={{width:`${progress}%`}} />
        </div>
      </section>
      <p className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm leading-relaxed text-foreground">
        <Info aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <span>Documento clínico para revisão profissional. Confira todas as informações antes de salvar e exportar.</span>
      </p>
      <section aria-labelledby="pti-setup-heading" className="space-y-4 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <h2 id="pti-setup-heading" className="text-lg font-bold text-foreground">Paciente e configurações do documento</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="text-sm font-semibold text-foreground">Paciente
            <select aria-label="Selecionar paciente" className={fieldClass} value={patientId||""} onChange={e=>onSelectPatient(e.target.value)} disabled={isPatientLocked}>
              <option value="">Selecione um paciente</option>{patients.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold text-foreground">Status
            <select className={fieldClass} value={status} onChange={e=>onStatus(e.target.value)}>
              <option value="rascunho">Rascunho</option><option value="ativo">Ativo</option><option value="concluído">Concluído</option>
            </select>
          </label>
          <div className="flex flex-col justify-center gap-2">
            <CheckBox label="Assinatura e carimbo cadastrados no PDF" checked={form.incluirAssinatura} onChange={v=>update({formulario:{...form,incluirAssinatura:v}})} />
            <CheckBox label="Rodapé e data no PDF" checked={form.incluirRodape} onChange={v=>update({formulario:{...form,incluirRodape:v}})} />
          </div>
        </div>
        {lastSaved&&<p role="status" className="flex items-center gap-2 text-sm font-medium text-primary"><Check aria-hidden="true" className="h-4 w-4" /> Salvo às {lastSaved.toLocaleTimeString("pt-BR")}</p>}
        {!patientId&&<p className="text-sm text-muted-foreground">Selecione o paciente para preencher e salvar o plano.</p>}
      </section>
      <PtiScreenshotSections content={content} update={update} importing={importingClinical} onImport={onImportClinical} professionalName={professionalName} />
    </main>
  </div>;
}
