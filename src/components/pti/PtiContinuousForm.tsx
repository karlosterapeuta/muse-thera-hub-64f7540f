import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, FileDown, Loader2, Save, TrendingUp } from "lucide-react";
import { type PtiContent, createDefaultPtiFormulario, computePtiProgress, PTI_CRITERIOS_EVOLUCAO } from "@/types/pti";
import { usePtiReavaliacoes } from "@/hooks/usePtiReavaliacoes";
import { PtiScreenshotSections, SectionBar, CheckBox, fieldClass, buttonClass } from "./PtiScreenshotSections";

type Tab="pti"|"consolidado"|"intervencao"|"evolucao";
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
  planId?:string;
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
  content,update,patients,patientId,onSelectPatient,isPatientLocked,status,onStatus,planId,
  professionalName,lastSaved,saving,downloading,importingClinical,onImportClinical,onSave,onDownload,
}:Props) {
  const navigate=useNavigate();
  const [tab,setTab]=useState<Tab>("pti");
  const {data:reevaluations}=usePtiReavaliacoes(planId);
  const form={...createDefaultPtiFormulario(),...content.formulario};
  const progress=computePtiProgress(content);
  const ready=!!patientId&&!!content.identificacao.nome.trim();
  const counts=[["Objetivos",content.objetivosEspecificos.length],["Metas",content.metas.length],["Preenchimento",progress+"%"]];
  const lastReevaluation=reevaluations?.[reevaluations.length-1];
  const bar="flex min-h-10 items-center gap-2 rounded border px-3 py-2 text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400";
  return <div className="min-h-screen bg-[#f8f9fa] pb-16 text-slate-900" style={{colorScheme:"light"}}>
    <header className="sticky top-0 z-30 border-b border-slate-300 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-3 py-3 sm:px-5">
        <button type="button" className={buttonClass+" border-transparent"} onClick={()=>navigate("/pti")}><ArrowLeft className="h-4 w-4" /> Pacientes</button>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-black uppercase tracking-[.12em] text-orange-700">MuseTera • PTI</p>
          <h1 className="truncate text-sm font-extrabold text-slate-900">{content.identificacao.nome||"Plano Terapêutico Individual"}</h1>
        </div>
        <span className="hidden whitespace-nowrap text-xs font-medium text-slate-600 lg:inline">{content.objetivosEspecificos.length} objetivos • {progress}% preenchido</span>
        <button type="button" className={bar+" border-slate-300 bg-white text-slate-800 hover:bg-slate-100"} onClick={()=>navigate("/evaluation")}>Nova avaliação</button>
        <button type="button" className={bar+" border-slate-300 bg-white text-slate-800 hover:bg-slate-100 disabled:opacity-50"} disabled={saving||!ready} onClick={onSave}>
          {saving?<Loader2 className="h-4 w-4 animate-spin" />:<Save className="h-4 w-4" />} Salvar
        </button>
        <button type="button" className={bar+" border-orange-600 bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50"} disabled={saving||downloading||!ready} onClick={onDownload}>
          {downloading?<Loader2 className="h-4 w-4 animate-spin" />:<FileDown className="h-4 w-4" />} PDF do PTI
        </button>
      </div>
    </header>
    <div className="border-b border-orange-600 bg-orange-500 px-4 py-2 text-xs font-semibold text-white">
      <p className="mx-auto max-w-7xl"><b className="uppercase tracking-[0.12em]">MuseTera</b><span className="ml-4">Plano Terapêutico Individualizado em Musicoterapia</span></p>
    </div>
    <main className="mx-auto max-w-7xl space-y-4 px-3 py-5 sm:px-5">
      <p className="rounded border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-900">
        Documento clínico para revisão profissional. Sugestões de conteúdo não representam observações realizadas e devem ser conferidas antes de salvar.
      </p>
      <div className="space-y-3 rounded border border-slate-300 bg-white p-4">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-700">Dados e opções do PDF</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="text-xs font-semibold text-slate-700">Paciente
            <select aria-label="Selecionar paciente" className={fieldClass} value={patientId||""} onChange={e=>onSelectPatient(e.target.value)} disabled={isPatientLocked}>
              <option value="">Selecione um paciente</option>{patients.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </label>
          <label className="text-xs font-semibold text-slate-700">Status
            <select className={fieldClass} value={status} onChange={e=>onStatus(e.target.value)}>
              <option value="rascunho">Rascunho</option><option value="ativo">Ativo</option><option value="concluído">Concluído</option>
            </select>
          </label>
          <div className="flex flex-col justify-center gap-2">
            <CheckBox label="Assinatura e carimbo cadastrados no PDF" checked={form.incluirAssinatura} onChange={v=>update({formulario:{...form,incluirAssinatura:v}})} />
            <CheckBox label="Rodapé e data no PDF" checked={form.incluirRodape} onChange={v=>update({formulario:{...form,incluirRodape:v}})} />
          </div>
        </div>
        {lastSaved&&<p className="flex items-center gap-1 text-xs font-medium text-emerald-800"><Check className="h-3 w-3" /> Salvo às {lastSaved.toLocaleTimeString("pt-BR")}</p>}
        {!patientId&&<p className="text-xs text-amber-800">Selecione o paciente para preencher e salvar o plano.</p>}
      </div>
      <div className="overflow-x-auto rounded-t border border-slate-300 bg-white">
        <div className="flex min-w-max" role="tablist" aria-label="Módulos do PTI">
          {([["pti","PTI"],["consolidado","CONSOLIDADO"],["intervencao","PEI · INTERVENÇÃO"],["evolucao","EVOLUÇÃO"]] as [Tab,string][]).map(([key,title])=>
            <button key={key} type="button" role="tab" aria-selected={tab===key} onClick={()=>setTab(key)}
              className={"border-r border-slate-200 px-4 py-4 text-xs font-extrabold tracking-wide "+(tab===key?"bg-orange-500 text-white":"bg-white text-slate-900 hover:bg-orange-50")}>{title}</button>)}
        </div>
      </div>
      {tab==="pti"&&<PtiScreenshotSections content={content} update={update} importing={importingClinical} onImport={onImportClinical} professionalName={professionalName} />}
      {tab==="consolidado"&&<div role="tabpanel"><SectionBar title="Consolidado" detail="Resumo real do plano">
        <div className="grid gap-3 sm:grid-cols-3">{counts.map(([name,count])=>
          <div key={name} className="rounded border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs text-slate-600">{name}</p><p className="mt-2 text-2xl font-extrabold text-slate-900">{count}</p>
          </div>)}</div>
        <p className="text-sm text-slate-600">O preenchimento do formulário não indica desempenho clínico. Esta aba não utiliza escores Portage nem presume uma avaliação concluída.</p>
        <h3 className="text-xs font-bold uppercase text-slate-700">Objetivos por área</h3>
        {Array.from(new Set(content.objetivosEspecificos.map(o=>o.area||"Não informada"))).map(area=>
          <div key={area} className="flex justify-between border-b border-slate-200 py-2 text-sm"><span>{area}</span><strong>{content.objetivosEspecificos.filter(o=>(o.area||"Não informada")===area).length}</strong></div>)}
        {!content.objetivosEspecificos.length&&<p className="text-sm text-slate-500">Ainda não há objetivos cadastrados.</p>}
      </SectionBar></div>}
      {tab==="intervencao"&&<div role="tabpanel"><SectionBar title="PEI · Intervenção" detail="Planejamento das atividades">
        <p className="text-sm text-slate-600">Esta aba organiza objetivos, atividades e materiais; não grava acertos como sessões terapêuticas.</p>
        {content.objetivosEspecificos.map((o,i)=><div key={o.id} className="grid gap-3 border-b border-slate-200 pb-4 lg:grid-cols-3">
          <div><p className="text-[11px] font-bold text-slate-500">OBJETIVO {i+1}</p><p className="text-sm">{o.descricao||"Não informado"}</p></div>
          <div><p className="text-[11px] font-bold text-slate-500">ATIVIDADE</p><p className="text-sm">{o.atividade||"Não informada"}</p></div>
          <div><p className="text-[11px] font-bold text-slate-500">MATERIAL</p><p className="text-sm">{o.material||"Não informado"}</p></div>
        </div>)}
        {!content.objetivosEspecificos.length&&<p className="text-sm text-slate-500">Cadastre objetivos na aba PTI para visualizar o planejamento.</p>}
        {planId&&<button type="button" className={buttonClass} onClick={()=>navigate(`/pti/${planId}/reavaliacao`)}><TrendingUp className="h-4 w-4" /> Abrir reavaliação</button>}
      </SectionBar></div>}
      {tab==="evolucao"&&<div role="tabpanel" id="pti-evolucao"><SectionBar title="Evolução" detail="Histórico de reavaliações do PTI">
        {!planId?<p className="text-sm text-slate-600">Salve o PTI para habilitar o histórico de reavaliações.</p>:<>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-600">{reevaluations?.length||0} reavaliação(ões) registrada(s).</p>
            <button type="button" className={buttonClass} onClick={()=>navigate(`/pti/${planId}/reavaliacao`)}>Abrir reavaliação</button>
          </div>
          {!!lastReevaluation?<div className="overflow-x-auto"><table className="w-full text-left text-sm">
            <thead><tr className="border-b border-slate-300 text-xs text-slate-600"><th className="py-2">Domínio</th><th>Linha de base</th><th>Último registro</th></tr></thead>
            <tbody>{PTI_CRITERIOS_EVOLUCAO.map(area=><tr key={area} className="border-b border-slate-100"><td className="py-2">{area}</td>
              <td>{content.criteriosEvolucao?.[area]||"—"}</td><td>{lastReevaluation.snapshot?.criterios?.[area]||"—"}</td></tr>)}</tbody>
          </table></div>:<p className="text-sm text-slate-600">Nenhuma reavaliação registrada. Não há resultados clínicos para comparar.</p>}
          <div className="space-y-2">{reevaluations?.map(r=><div className="rounded border border-slate-200 bg-slate-50 p-3" key={r.id}>
            <strong className="text-xs text-slate-700">{new Date(r.created_at).toLocaleDateString("pt-BR")}</strong>
            <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{typeof r.report?.text==="string"?r.report.text:"Reavaliação sem texto de relatório."}</p>
          </div>)}</div>
        </>}
      </SectionBar></div>}
    </main>
  </div>;
}
