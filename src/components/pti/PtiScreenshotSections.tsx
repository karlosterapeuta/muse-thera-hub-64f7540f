import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, FileSearch, Loader2 } from "lucide-react";
import { PtiSpecialtyCatalog, type PtiCatalogSuggestion } from "./PtiSpecialtyCatalog";
import { type PtiContent, type PtiFormulario, type PtiObjetivoEspecifico, type PtiMeta, createDefaultPtiFormulario, PTI_ESTRATEGIAS, PTI_RECURSOS, PTI_FREQUENCIA, PTI_OPTS, PTI_PROFISSIONAIS } from "@/types/pti";

export const fieldClass = "mt-1 w-full min-h-10 rounded border border-slate-300 bg-white px-3 py-2 text-sm font-normal normal-case tracking-normal text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400";
export const buttonClass = "inline-flex min-h-9 items-center justify-center gap-1.5 rounded border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-orange-400";
export const labelClass = "block min-w-0 text-[11px] font-bold uppercase tracking-wider text-slate-600";

export function TextInput({label,value,onChange,readOnly=false,type="text",placeholder}: {label:string;value?:string;onChange?:(value:string)=>void;readOnly?:boolean;type?:string;placeholder?:string}) {
  return <label className={labelClass}>{label}<input className={fieldClass+(readOnly?" bg-slate-100":"")} value={value||""} type={type} placeholder={placeholder} readOnly={readOnly} onChange={e=>onChange?.(e.target.value)} /></label>;
}
export function TextArea({label,value,onChange,rows=3,placeholder}:{label:string;value?:string;onChange:(v:string)=>void;rows?:number;placeholder?:string}) {
  return <label className={labelClass}>{label}<textarea className={fieldClass+" resize-y"} rows={rows} value={value||""} placeholder={placeholder} onChange={e=>onChange(e.target.value)} /></label>;
}
export function CheckBox({label,checked,onChange}:{label:string;checked:boolean;onChange:(v:boolean)=>void}) {
  return <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-700"><input type="checkbox" className="h-4 w-4 accent-orange-600" checked={checked} onChange={e=>onChange(e.target.checked)} />{label}</label>;
}
export function SectionBar({title,detail,actions,children,id}:{title:string;detail?:string;actions?:React.ReactNode;children:React.ReactNode;id?:string}) {
  return <section id={id} className="overflow-hidden rounded border border-slate-300 bg-white shadow-sm">
    <div className="flex flex-wrap items-center justify-between gap-2 bg-orange-500 px-4 py-3 text-white">
      <h2 className="text-[13px] font-extrabold uppercase tracking-wider">{title} {detail&&<span className="ml-2 text-[11px] font-normal normal-case tracking-normal text-orange-50">{detail}</span>}</h2>
      {actions}
    </div>
    <div className="space-y-4 p-4">{children}</div>
  </section>;
}

const guidedSets: [string,string[]][] = [
  ["Informações coletadas com os responsáveis",["Comunicação e autonomia","Interação social","Sono e rotina","Interesses do paciente","Rotina e transições","Autocuidado e alimentação"]],
  ["Desenvolvimento, interação e autonomia",["Comunicação funcional","Interação e turnos","Aprendizagem estruturada","Autonomia e atividades diárias","Atenção compartilhada","Habilidades emergentes"]],
  ["Comportamentos e manejo",["Dificuldade de espera","Mudanças de atividade","Agitação relatada","Sensibilidade sensorial","Resistência a demandas","Necessidade de organização ambiental"]],
];
function GuidedField({index,value,onChange}:{index:number;value:string;onChange:(v:string)=>void}) {
  const [selected,setSelected]=useState<string[]>([]);
  const [title,opts]=guidedSets[index];
  return <div className="space-y-2">
    <div className="rounded border border-slate-200 bg-slate-50 p-3">
      <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-600">Selecione sugestões — {title}</p>
      <div className="grid gap-2 sm:grid-cols-2">{opts.map(opt=><CheckBox key={opt} label={opt} checked={selected.includes(opt)} onChange={yes=>setSelected(s=>yes?[...s,opt]:s.filter(x=>x!==opt))} />)}</div>
      <button type="button" className={buttonClass+" mt-3 border-orange-300 text-orange-800"} disabled={!selected.length}
        onClick={()=>{onChange((value.trim()?value.trim()+"\n":"")+selected.join("; ")+".");setSelected([]);}}>Adicionar sugestões</button>
    </div>
    <TextArea label={title} value={value} onChange={onChange} rows={4} />
  </div>;
}
function Chips({title,options,values,onToggle}:{title:string;options:string[];values:string[];onToggle:(v:string)=>void}) {
  return <div className="space-y-2"><p className={labelClass}>{title}</p><div className="flex flex-wrap gap-2">{Array.from(new Set([...options,...values])).map(v=><button key={v} type="button" onClick={()=>onToggle(v)} className={"rounded border px-3 py-1.5 text-xs "+(values.includes(v)?"border-orange-500 bg-orange-100 text-orange-900":"border-slate-300 bg-white text-slate-700 hover:bg-slate-50")}>{values.includes(v)?"✓ ":""}{v}</button>)}</div></div>;
}
interface Props {
 content:PtiContent; update:(p:Partial<PtiContent>)=>void; importing:boolean; onImport:()=>void; professionalName:string;
}
export function PtiScreenshotSections({content,update,importing,onImport,professionalName}:Props) {
  const navigate = useNavigate();
  const [catalog,setCatalog]=useState(true);
  const [advanced,setAdvanced]=useState(false);
  const [behTemplate,setBehTemplate]=useState("");
  const [textTemplate,setTextTemplate]=useState("");
  const ident=content.identificacao;
  const form:PtiFormulario={...createDefaultPtiFormulario(),...content.formulario};
  const uf=(patch:Partial<PtiFormulario>)=>update({formulario:{...form,...patch}});
  const ui=(patch:Partial<PtiContent["identificacao"]>)=>update({identificacao:{...ident,...patch}});
  const uh=(patch:Partial<PtiContent["historicoClinico"]>)=>update({historicoClinico:{...content.historicoClinico,...patch}});
  const newObj=(suggestion?:PtiCatalogSuggestion)=>update({objetivosEspecificos:[...content.objetivosEspecificos,{id:crypto.randomUUID(),descricao:suggestion?.objective||"",atividade:suggestion?.example||"",material:suggestion?.resource||"",prazo:"",prioridade:"",area:suggestion?.area||""}]});
  const eo=(id:string,patch:Partial<PtiObjetivoEspecifico>)=>update({objetivosEspecificos:content.objetivosEspecificos.map(o=>o.id===id?{...o,...patch}:o)});
  const eg=(id:string,patch:Partial<PtiMeta>)=>update({metas:content.metas.map(o=>o.id===id?{...o,...patch}:o)});
  const tog=(key:"estrategias"|"recursos",v:string)=>update({[key]:content[key].includes(v)?content[key].filter(x=>x!==v):[...content[key],v]});
  const synthesize=()=>{
    const parts=[
      form.unidade.trim()&&"Unidade de acompanhamento: "+form.unidade.trim()+".",
      form.relatosResponsaveis.trim()&&"Informações dos responsáveis: "+form.relatosResponsaveis.trim(),
      form.desenvolvimentoAutonomia.trim()&&"Desenvolvimento, interação e autonomia: "+form.desenvolvimentoAutonomia.trim(),
      form.comportamentoManejo.trim()&&"Comportamentos e manejo: "+form.comportamentoManejo.trim(),
      content.historicoClinico.desenvolvimento.trim()&&"Registro clínico anterior: "+content.historicoClinico.desenvolvimento.trim(),
    ].filter(Boolean);
    if(parts.length)uf({resumoClinico:parts.join("\n\n")});
  };
  return <div className="space-y-4" role="tabpanel">
    <p className="rounded border border-orange-200 bg-orange-50 px-4 py-3 text-xs text-slate-800">Preencha os dados abaixo. Os objetivos do catálogo são sugestões editáveis. Antes de emitir o PDF, confira os dados e salve uma versão.</p>
    <SectionBar title="Dados do paciente (complementares)">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput label="Nome" value={ident.nome} readOnly />
        <TextInput label="Data de nascimento" value={ident.nascimento} readOnly type="date" />
        <TextInput label="Nome da mãe" value={form.nomeMae} onChange={v=>uf({nomeMae:v})} />
        <TextInput label="Nome do pai" value={form.nomePai} onChange={v=>uf({nomePai:v})} />
        <TextInput label="Responsável" value={ident.responsavel} onChange={v=>ui({responsavel:v})} />
        <TextInput label="Diagnóstico já registrado" value={ident.diagnostico} onChange={v=>ui({diagnostico:v})} placeholder="Registrar somente diagnósticos documentados" />
        <TextInput label="Diagnóstico (CID)" value={ident.cid} onChange={v=>ui({cid:v})} placeholder="Informar CID existente no prontuário" />
        <TextInput label="Início de implementação" value={form.inicioImplementacao||ident.dataPlano} onChange={v=>uf({inicioImplementacao:v})} type="date" />
        <TextInput label="Profissional responsável" value={ident.profissional||professionalName} onChange={v=>ui({profissional:v})} />
        <label className={labelClass}>Reavaliação dos objetivos<select className={fieldClass} value={form.revisaoObjetivos} onChange={e=>uf({revisaoObjetivos:e.target.value})}>
          <option value="">Selecione uma periodicidade</option>{["Mensal","Trimestral","Semestral","Anual","Individualizada"].map(x=><option key={x}>{x}</option>)}
        </select></label>
      </div>
    </SectionBar>
    <SectionBar title="Breve história clínica" actions={<button type="button" onClick={synthesize} className={buttonClass}>Montar síntese</button>}>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput label="Unidade / local" value={form.unidade} onChange={v=>uf({unidade:v})} />
        <TextInput label="Medicações atuais já prescritas" value={form.medicacoesAtuais} onChange={v=>uf({medicacoesAtuais:v})} placeholder="Somente medicações informadas" />
        <label className={labelClass}>Protocolo de avaliação<select className={fieldClass} value={form.protocoloAvaliacao} onChange={e=>uf({protocoloAvaliacao:e.target.value})}>
          {["MuseTera TEA","Avaliação musicoterapêutica clínica","Outro protocolo documentado","Não informado"].map(x=><option key={x} value={x}>{x}</option>)}
        </select></label>
        <div className="space-y-2 rounded border border-slate-200 p-3">
          <p className={labelClass}>Comportamentos relatados</p>
          <CheckBox label="Autoagressão relatada" checked={form.comportamentoAutolesivo} onChange={v=>uf({comportamentoAutolesivo:v})} />
          <CheckBox label="Heteroagressão relatada" checked={form.comportamentoHeterolesivo} onChange={v=>uf({comportamentoHeterolesivo:v})} />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-slate-600">Dados já documentados na anamnese, se disponíveis.</p>
        <button type="button" className={buttonClass} onClick={onImport} disabled={importing}>{importing?<Loader2 className="h-4 w-4 animate-spin" />:<FileSearch className="h-4 w-4" />} Importar anamnese</button>
      </div>
      <GuidedField index={0} value={form.relatosResponsaveis} onChange={v=>uf({relatosResponsaveis:v})} />
      <GuidedField index={1} value={form.desenvolvimentoAutonomia} onChange={v=>uf({desenvolvimentoAutonomia:v})} />
      <GuidedField index={2} value={form.comportamentoManejo} onChange={v=>uf({comportamentoManejo:v})} />
      <TextArea label="Síntese da história clínica — totalmente editável" rows={6} value={form.resumoClinico} onChange={v=>uf({resumoClinico:v})} placeholder="Montar a partir do que foi relatado e registrado. Nenhuma observação será inventada." />
    </SectionBar>
    <SectionBar title="Objetivos por área" detail="Planejamento terapêutico por especialidade"
      actions={<div className="flex gap-2"><button type="button" className={buttonClass} onClick={()=>navigate("/evaluation")}>Abrir avaliação</button><button type="button" onClick={()=>newObj()} className={buttonClass}><Plus className="h-4 w-4" /> Objetivo</button></div>}>
      <button type="button" className="text-xs font-semibold text-orange-800 underline" onClick={()=>setCatalog(v=>!v)}>{catalog?"Ocultar":"Exibir"} catálogo de objetivos clínicos</button>
      {catalog && <PtiSpecialtyCatalog selected={content.objetivosEspecificos.map(o=>o.descricao)} onAdd={newObj} />}
      <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Objetivos incluídos ({content.objetivosEspecificos.length})</h3>
      {content.objetivosEspecificos.length===0&&<p className="rounded border border-dashed border-slate-300 p-4 text-sm text-slate-600">Nenhum objetivo adicionado.</p>}
      <div className="divide-y divide-slate-200 overflow-hidden rounded border border-slate-300">
        {content.objetivosEspecificos.map((o,i)=><div key={o.id} className="space-y-3 bg-white p-3">
          <div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-wide text-orange-700">Objetivo {i+1} {o.area&&"• "+o.area}</span>
            <button type="button" aria-label={`Excluir objetivo ${i+1}`} className="rounded p-1 text-red-600 hover:bg-red-50" onClick={()=>update({objetivosEspecificos:content.objetivosEspecificos.filter(x=>x.id!==o.id)})}><Trash2 className="h-4 w-4" /></button>
          </div>
          <div className="grid gap-3 lg:grid-cols-3">
            <TextArea label="Objetivo" value={o.descricao} onChange={v=>eo(o.id,{descricao:v})} rows={3} />
            <TextArea label="Atividade" value={o.atividade} onChange={v=>eo(o.id,{atividade:v})} rows={3} />
            <TextArea label="Material" value={o.material} onChange={v=>eo(o.id,{material:v})} rows={3} />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <TextInput label="Área" value={o.area} onChange={v=>eo(o.id,{area:v})} />
            <TextInput label="Prazo" value={o.prazo} onChange={v=>eo(o.id,{prazo:v})} />
            <label className={labelClass}>Prioridade<select className={fieldClass} value={o.prioridade||""} onChange={e=>eo(o.id,{prioridade:e.target.value as PtiObjetivoEspecifico["prioridade"]})}>
              <option value="">A definir</option>{["Alta","Média","Baixa"].map(v=><option key={v}>{v}</option>)}
            </select></label>
          </div>
        </div>)}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Metas terapêuticas mensuráveis</h3>
        <button type="button" className={buttonClass} onClick={()=>update({metas:[...content.metas,{id:crypto.randomUUID(),descricao:"",linhaBase:"",indicador:"",percentual:"",prazo:"",criterio:""}]})}><Plus className="h-4 w-4" /> Meta</button>
      </div>
      {content.metas.map((m,i)=><div key={m.id} className="space-y-3 rounded border border-slate-200 bg-slate-50 p-3">
        <div className="flex justify-between"><b className="text-xs text-orange-800">Meta {i+1}</b><button type="button" aria-label="Remover meta" className="text-red-600" onClick={()=>update({metas:content.metas.filter(x=>x.id!==m.id)})}><Trash2 className="h-4 w-4" /></button></div>
        <TextArea label="Descrição da meta" value={m.descricao} onChange={v=>eg(m.id,{descricao:v})} rows={2} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <TextInput label="Linha de base" value={m.linhaBase} onChange={v=>eg(m.id,{linhaBase:v})} />
          <TextInput label="Indicador" value={m.indicador} onChange={v=>eg(m.id,{indicador:v})} />
          <TextInput label="Alvo" value={m.percentual} onChange={v=>eg(m.id,{percentual:v})} />
          <TextInput label="Prazo" value={m.prazo} onChange={v=>eg(m.id,{prazo:v})} />
        </div>
        <TextInput label="Critério de sucesso" value={m.criterio} onChange={v=>eg(m.id,{criterio:v})} />
      </div>)}
    </SectionBar>
    <SectionBar title="Comportamentos-problema listados" actions={<div className="flex gap-2">
      <select aria-label="Modelo de comportamento" className="max-w-36 rounded border border-orange-200 bg-orange-400 px-2 text-xs text-white" value={behTemplate} onChange={e=>setBehTemplate(e.target.value)}>
        <option value="">Modelos</option>{["Dificuldade em manter foco nas demandas","Dificuldade em aguardar turnos","Resistência à mudança de atividade","Necessidade de apoio em transições"].map(v=><option key={v} value={v}>{v}</option>)}
      </select>
      <button type="button" className={buttonClass} onClick={()=>{uf({comportamentosAlvo:[...form.comportamentosAlvo,behTemplate]});setBehTemplate("");}}><Plus className="h-4 w-4" /> Item</button>
    </div>}>
      {form.comportamentosAlvo.length===0 && <p className="text-xs text-slate-600">Descreva somente comportamentos observados ou relatados; não há preenchimento automático.</p>}
      {form.comportamentosAlvo.map((v,i)=><div key={i} className="flex items-start gap-2">
        <input className={fieldClass+" mt-0"} aria-label={`Comportamento ${i+1}`} value={v} onChange={e=>uf({comportamentosAlvo:form.comportamentosAlvo.map((x,j)=>j===i?e.target.value:x)})} placeholder="Descrição clínica contextualizada" />
        <button type="button" className="p-2 text-red-600" aria-label="Remover comportamento" onClick={()=>uf({comportamentosAlvo:form.comportamentosAlvo.filter((_,j)=>i!==j)})}><Trash2 className="h-4 w-4" /></button>
      </div>)}
    </SectionBar>
    <SectionBar title="Considerações e plano de intervenção" actions={<select aria-label="Modelo para considerações" className="max-w-44 rounded border border-orange-200 bg-orange-400 px-2 text-xs text-white" value={textTemplate} onChange={e=>{
      const texts:Record<string,string>={continuidade:"Considerar a continuidade do acompanhamento musicoterapêutico de acordo com os objetivos definidos, com reavaliação das metas conforme os registros documentados.",familia:"Articular orientações com a família e demais profissionais, quando pertinente e autorizado, sem presumir resultados ainda não avaliados."};
      setTextTemplate("");if(texts[e.target.value])uf({consideracoes:(form.consideracoes.trim()?form.consideracoes+"\n\n":"")+texts[e.target.value]});
    }}><option value="">Modelos</option><option value="continuidade">Continuidade</option><option value="familia">Integração familiar</option></select>}>
      <TextArea label="Considerações e plano de intervenção" value={form.consideracoes} rows={8} onChange={v=>uf({consideracoes:v})} />
      <TextArea label="Referências bibliográficas utilizadas" value={form.referencias} rows={2} onChange={v=>uf({referencias:v})} />
      <div className="grid gap-3 sm:grid-cols-2">
        <TextInput label="Data da devolutiva" type="date" value={form.dataDevolutiva} onChange={v=>uf({dataDevolutiva:v})} />
        <TextInput label="Responsável pela entrega" value={form.responsavelDevolutiva} onChange={v=>uf({responsavelDevolutiva:v})} />
      </div>
    </SectionBar>
    <section className="rounded border border-slate-300 bg-white p-4">
      <button type="button" aria-expanded={advanced} className="flex w-full items-center justify-between text-left text-xs font-bold uppercase tracking-wide text-slate-700" onClick={()=>setAdvanced(x=>!x)}>
        Campos musicoterapêuticos complementares e dados anteriores <span className="text-orange-800">{advanced?"Ocultar":"Mostrar"}</span>
      </button>
      {advanced&&<div className="mt-4 space-y-4 border-t border-slate-200 pt-4">
        <TextArea label="Queixa principal" value={content.queixaPrincipal} onChange={v=>update({queixaPrincipal:v})} />
        <TextArea label="Histórico de desenvolvimento (dados anteriores)" value={content.historicoClinico.desenvolvimento} onChange={v=>uh({desenvolvimento:v})} />
        <TextArea label="Histórico musical" value={content.historicoClinico.historicoMusical} onChange={v=>uh({historicoMusical:v})} />
        <TextArea label="Comunicação" value={content.historicoClinico.comunicacao} onChange={v=>uh({comunicacao:v})} />
        <TextArea label="Potencialidades" value={content.potencialidades} onChange={v=>update({potencialidades:v})} />
        <TextArea label="Dificuldades" value={content.dificuldades} onChange={v=>update({dificuldades:v})} />
        <TextArea label="Objetivo geral" value={content.objetivoGeral} onChange={v=>update({objetivoGeral:v})} />
        <Chips title="Estratégias" options={PTI_ESTRATEGIAS} values={content.estrategias} onToggle={v=>tog("estrategias",v)} />
        <Chips title="Recursos" options={PTI_RECURSOS} values={content.recursos} onToggle={v=>tog("recursos",v)} />
        <div className="grid gap-3 sm:grid-cols-3">{([
          ["sessoes","Frequência",PTI_FREQUENCIA.sessoes],
          ["duracao","Duração",PTI_FREQUENCIA.duracao],
          ["atendimento","Atendimento",PTI_FREQUENCIA.atendimento],
        ] as const).map(([key,title,opts])=><label key={key} className={labelClass}>{title}<select className={fieldClass} value={content.frequencia[key]} onChange={e=>update({frequencia:{...content.frequencia,[key]:e.target.value}})}>
          <option value="">A definir</option>{opts.map(v=><option key={v}>{v}</option>)}
        </select></label>)}</div>
        <TextArea label="Critérios para alta" value={content.criteriosAlta} onChange={v=>update({criteriosAlta:v})} />
        <TextArea label="Plano familiar" value={content.planoFamiliar} onChange={v=>update({planoFamiliar:v})} />
        <Chips title="Equipe" options={PTI_PROFISSIONAIS} values={content.integracao.profissionais} onToggle={v=>update({integracao:{...content.integracao,profissionais:content.integracao.profissionais.includes(v)?content.integracao.profissionais.filter(x=>x!==v):[...content.integracao.profissionais,v]}})} />
        <TextArea label="Notas multiprofissionais" value={content.integracao.observacoes} onChange={v=>update({integracao:{...content.integracao,observacoes:v}})} />
        <TextArea label="Fundamentação técnica" value={content.fundamentacao} onChange={v=>update({fundamentacao:v})} />
        {Object.entries(PTI_OPTS).map(([key,opts])=>{
          const k=key as keyof PtiContent["avaliacao"];const current=content.avaliacao[k];
          return <div key={key} className="space-y-2"><Chips title={"Avaliação — "+key} options={opts} values={current.opcoes} onToggle={v=>update({avaliacao:{...content.avaliacao,[key]:{...current,opcoes:current.opcoes.includes(v)?current.opcoes.filter(x=>x!==v):[...current.opcoes,v]}}})} />
            <TextArea label="Observações da avaliação" value={current.observacoes} onChange={v=>update({avaliacao:{...content.avaliacao,[key]:{...current,observacoes:v}}})} rows={2} /></div>;
        })}
      </div>}
    </section>
  </div>;
}
