import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, FileDown, Loader2, Save } from "lucide-react";
import { type PtiContent, createDefaultPtiFormulario, computePtiProgress } from "@/types/pti";
import { PtiScreenshotSections, CheckBox, fieldClass, buttonClass } from "./PtiScreenshotSections";

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
  const bar="flex min-h-10 items-center gap-2 rounded border px-3 py-2 text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
  return <div className="min-h-screen bg-background pb-16 text-foreground">
    <header className="sticky top-0 z-30 border-b border-border bg-card shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-3 py-3 sm:px-5">
        <button type="button" className={buttonClass+" border-transparent"} onClick={()=>navigate("/pti")}><ArrowLeft className="h-4 w-4" /> Pacientes</button>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-black uppercase tracking-[.12em] text-primary">MuseTera • PTI</p>
          <h1 className="truncate text-sm font-extrabold text-foreground">{content.identificacao.nome||"Plano Terapêutico Individual"}</h1>
        </div>
        <span className="hidden whitespace-nowrap text-xs font-medium text-muted-foreground lg:inline">{content.objetivosEspecificos.length} objetivos • {progress}% preenchido</span>
        <button type="button" className={bar+" border-border bg-card text-foreground hover:bg-muted"} onClick={()=>navigate("/evaluation")}>Nova avaliação</button>
        <button type="button" className={bar+" border-border bg-card text-foreground hover:bg-muted disabled:opacity-50"} disabled={saving||!ready} onClick={onSave}>
          {saving?<Loader2 className="h-4 w-4 animate-spin" />:<Save className="h-4 w-4" />} Salvar
        </button>
        <button type="button" className={bar+" border-primary bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"} disabled={saving||downloading||!ready} onClick={onDownload}>
          {downloading?<Loader2 className="h-4 w-4 animate-spin" />:<FileDown className="h-4 w-4" />} PDF do PTI
        </button>
      </div>
    </header>
    <div className="border-b border-primary bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">
      <p className="mx-auto max-w-7xl"><b className="uppercase tracking-[0.12em]">MuseTera</b><span className="ml-4">Plano Terapêutico Individualizado em Musicoterapia</span></p>
    </div>
    <main className="mx-auto max-w-7xl space-y-4 px-3 py-5 sm:px-5">
      <p className="rounded border border-primary/25 bg-primary/10 px-4 py-3 text-xs text-foreground">
        Documento clínico para revisão profissional. Sugestões de conteúdo não representam observações realizadas e devem ser conferidas antes de salvar.
      </p>
      <div className="space-y-3 rounded border border-border bg-card p-4">
        <h2 className="text-xs font-black uppercase tracking-wider text-foreground">Dados e opções do PDF</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="text-xs font-semibold text-foreground">Paciente
            <select aria-label="Selecionar paciente" className={fieldClass} value={patientId||""} onChange={e=>onSelectPatient(e.target.value)} disabled={isPatientLocked}>
              <option value="">Selecione um paciente</option>{patients.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </label>
          <label className="text-xs font-semibold text-foreground">Status
            <select className={fieldClass} value={status} onChange={e=>onStatus(e.target.value)}>
              <option value="rascunho">Rascunho</option><option value="ativo">Ativo</option><option value="concluído">Concluído</option>
            </select>
          </label>
          <div className="flex flex-col justify-center gap-2">
            <CheckBox label="Assinatura e carimbo cadastrados no PDF" checked={form.incluirAssinatura} onChange={v=>update({formulario:{...form,incluirAssinatura:v}})} />
            <CheckBox label="Rodapé e data no PDF" checked={form.incluirRodape} onChange={v=>update({formulario:{...form,incluirRodape:v}})} />
          </div>
        </div>
        {lastSaved&&<p className="flex items-center gap-1 text-xs font-medium text-primary"><Check className="h-3 w-3" /> Salvo às {lastSaved.toLocaleTimeString("pt-BR")}</p>}
        {!patientId&&<p className="text-xs text-muted-foreground">Selecione o paciente para preencher e salvar o plano.</p>}
      </div>
      <PtiScreenshotSections content={content} update={update} importing={importingClinical} onImport={onImportClinical} professionalName={professionalName} />
    </main>
  </div>;
}
