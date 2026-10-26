import { PtiContent, PTI_CRITERIOS_EVOLUCAO, createDefaultPtiFormulario } from "@/types/pti";
import { ProfessionalData } from "@/hooks/useProfessionalData";
import { getPtiSelectedReferences } from "./ptiReferences";

interface PtiPDFProps {
  content: PtiContent;
  professional?: ProfessionalData | null;
  signature?: string;
  stamp?: string;
}

const styles = {
  page: {
    width: "210mm",
    // A margem vertical de cada folha é aplicada pelo exportador.
    // Uma altura mínima A4 aqui provocava páginas adicionais desnecessárias.
    padding: "6mm 14mm",
    background: "#ffffff",
    color: "#1a1a2e",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "11px",
    lineHeight: 1.5,
    boxSizing: "border-box" as const,
  },
  h1: { fontSize: "18px", fontWeight: 700, color: "#137B71", margin: "0 0 2px 0" },
  sectionTitle: {
    fontSize: "12px",
    fontWeight: 700,
    color: "#10695F",
    borderBottom: "2px solid #B6E2DC",
    padding: "10px 0 4px 0",
    margin: "10px 0 6px 0",
  },
  label: { fontWeight: 700, color: "#444" },
  row: { display: "flex", flexWrap: "wrap" as const, gap: "4px 18px", margin: "2px 0" },
  text: { whiteSpace: "pre-wrap" as const, margin: "2px 0" },
  chip: {
    display: "inline-block",
    background: "#E5F5F2",
    color: "#137B71",
    borderRadius: "10px",
    padding: "2px 8px",
    margin: "2px 4px 2px 0",
    fontSize: "10px",
  },
};

export function PtiPDF({ content: c, professional, signature, stamp }: PtiPDFProps) {
  const id = c.identificacao;
  const form = { ...createDefaultPtiFormulario(), ...c.formulario };
  const selectedReferences = getPtiSelectedReferences(form.referenciasSelecionadas);
  const additionalReferences = form.referencias.trim();
  const sectionBar: React.CSSProperties = {
    background: "#137B71", color: "#ffffff", padding: "7px 9px",
    fontSize: "11px", fontWeight: 700, letterSpacing: ".5px",
    marginTop: "14px", marginBottom: "8px", breakAfter: "avoid",
  };
  const line: React.CSSProperties = { margin: "2px 0", whiteSpace: "pre-wrap" };
  // Um objetivo longo precisa poder continuar na próxima folha; apenas
  // cabeçalhos e registros compactos devem permanecer inteiros.
  const item: React.CSSProperties = { padding: "6px 0", borderBottom: "1px solid #e2e8f0" };
  const compact: React.CSSProperties = { breakInside: "avoid", pageBreakInside: "avoid" };
  const K = ({ label, value }: { label: string; value?: string }) =>
    <div style={{ margin: "2px 0" }}><strong style={styles.label}>{label}: </strong>{value?.trim() || "Não informado"}</div>;
  const T = ({ children }: { children: React.ReactNode }) => <div className="pti-pdf-heading" style={sectionBar}>{children}</div>;
  const P = ({ children }: { children: React.ReactNode }) => <div style={line}>{children}</div>;
  const optional = (label: string, value?: string) =>
    value?.trim() ? <K key={label} label={label} value={value} /> : null;
  return (
    <div style={{ ...styles.page, fontSize: "11px", color: "#172017" }}>
      <header className="pti-pdf-atomic" style={{ borderBottom: "2px solid #137B71", paddingBottom: "8px" }}>
        <div style={{ textAlign: "center", fontSize: "19px", fontWeight: 800, color: "#137B71" }}>MUSETERA</div>
        <div style={{ textAlign: "center", fontSize: "15px", fontWeight: 700, margin: "4px 0" }}>Plano Terapêutico Individual</div>
        <div style={{ textAlign: "center", fontSize: "10px", color: "#647061" }}>Musicoterapia Clínica • Documento de acompanhamento individualizado</div>
      </header>
      <T>1. DADOS DO PACIENTE (COMPLEMENTARES)</T>
      <div style={styles.row}>
        <K label="Paciente" value={id.nome} />
        {optional("Idade", id.idade)}
        <K label="Nascimento" value={id.nascimento} />
        {optional("Nome da mãe", form.nomeMae)}
        {optional("Nome do pai", form.nomePai)}
        <K label="Responsável" value={id.responsavel} />
        {optional("Telefone de contato", id.telefone)}
        <K label="Diagnóstico" value={id.diagnostico} />
        <K label="CID" value={id.cid} />
        {optional("DSM registrado", id.dsm)}
        <K label="Início de implementação" value={form.inicioImplementacao || id.dataPlano} />
        <K label="Profissional" value={id.profissional || professional?.name} />
        <K label="Reavaliação prevista" value={form.revisaoObjetivos} />
      </div>
      <T>2. BREVE HISTÓRIA CLÍNICA</T>
      {optional("Unidade", form.unidade)}
      {optional("Medicações informadas (já prescritas)", form.medicacoesAtuais)}
      {optional("Protocolo de avaliação", form.protocoloAvaliacao)}
      {(form.comportamentoAutolesivo || form.comportamentoHeterolesivo) &&
        <P><strong>Comportamentos relatados: </strong>
          {[form.comportamentoAutolesivo && "Autoagressão", form.comportamentoHeterolesivo && "Heteroagressão"].filter(Boolean).join("; ")}
        </P>}
      {optional("Relatos dos responsáveis", form.relatosResponsaveis)}
      {optional("Desenvolvimento, interação e autonomia", form.desenvolvimentoAutonomia)}
      {optional("Comportamentos e manejo", form.comportamentoManejo)}
      {optional("Síntese clínica", form.resumoClinico)}
      {optional("Queixa principal", c.queixaPrincipal)}
      {optional("Histórico de desenvolvimento", c.historicoClinico.desenvolvimento)}
      {optional("Escolaridade", c.historicoClinico.escolaridade)}
      {optional("Comunicação", c.historicoClinico.comunicacao)}
      {optional("Terapias anteriores", c.historicoClinico.terapiasAnteriores)}
      {optional("Histórico musical", c.historicoClinico.historicoMusical)}
      {optional("Preferências musicais", c.historicoClinico.preferenciasMusicais)}
      {optional("Hipersensibilidades relatadas", c.historicoClinico.hipersensibilidades)}
      {optional("Hipossensibilidades relatadas", c.historicoClinico.hipossensibilidades)}
      {optional("Potencialidades", c.potencialidades)}
      {optional("Dificuldades", c.dificuldades)}
      {optional("Objetivo geral", c.objetivoGeral)}
      {Object.entries(c.avaliacao || {}).some(([,value]) => value?.opcoes?.length || value?.observacoes?.trim()) && <>
        <div style={styles.sectionTitle}>Avaliação clínica registrada</div>
        {Object.entries(c.avaliacao).map(([key,value]) => {
          const details = [value?.opcoes?.join("; "), value?.observacoes?.trim()].filter(Boolean).join(". ");
          return details ? <div key={key} style={line}>
            <strong style={styles.label}>{({comunicacao:"Comunicação",socializacao:"Socialização",cognicao:"Cognição",sensorial:"Sensorial",musicalidade:"Musicalidade"} as Record<string,string>)[key] || key}: </strong>{details}
          </div> : null;
        })}
      </>}
      <T>3. OBJETIVOS POR ÁREA — PLANEJAMENTO MUSICOTERAPÊUTICO</T>
      {c.objetivosEspecificos.length ? c.objetivosEspecificos.map((o,i)=>
        <div key={o.id} style={item}>
          <P><strong>OBJETIVO {i+1}: </strong>{o.descricao || "Não informado"}{o.area && ` • ${o.area}`}</P>
          {optional("Atividade", o.atividade)}
          {optional("Material", o.material)}
          {optional("Prioridade", o.prioridade)}
          {optional("Prazo", o.prazo)}
        </div>
      ) : <P>Nenhum objetivo cadastrado.</P>}
      {c.metas.length>0 && <>
        <div style={{...styles.sectionTitle,color:"#137B71"}}>Metas mensuráveis</div>
        {c.metas.map((m,i)=><div key={m.id} style={item}>
          <P><strong>Meta {i+1}: </strong>{m.descricao || "Não informado"}</P>
          {optional("Linha de base", m.linhaBase)}
          {optional("Indicador", m.indicador)}
          {optional("Alvo", m.percentual)}
          {optional("Prazo", m.prazo)}
          {optional("Critério de sucesso", m.criterio)}
        </div>)}
      </>}
      {(c.estrategias.length>0||c.recursos.length>0||c.frequencia.sessoes||c.frequencia.duracao) && <>
        <div style={styles.sectionTitle}>Estratégias, recursos e frequência</div>
        {c.estrategias.length>0&&<K label="Estratégias" value={c.estrategias.join("; ")} />}
        {c.recursos.length>0&&<K label="Recursos" value={c.recursos.join("; ")} />}
        {optional("Frequência", c.frequencia.sessoes)}
        {optional("Duração", c.frequencia.duracao)}
        {optional("Modalidade de atendimento", c.frequencia.atendimento)}
      </>}
      {Object.entries(c.criteriosEvolucao || {}).some(([,value]) => Number(value)>0) && <>
        <div style={styles.sectionTitle}>Indicadores de evolução registrados</div>
        {Object.entries(c.criteriosEvolucao).filter(([,value])=>Number(value)>0).map(([key,value])=><div key={key} style={line}>
          <strong style={styles.label}>{key}: </strong>{String(value)}
        </div>)}
      </>}
      <T>4. COMPORTAMENTOS-PROBLEMA LISTADOS</T>
      {form.comportamentosAlvo.length>0?form.comportamentosAlvo.map((v,i)=>
        <P key={i}>{i+1}. {v.trim() || "Não descrito"}</P>):<P>Nenhum comportamento registrado neste plano.</P>}
      <T>5. CONSIDERAÇÕES E PLANO DE INTERVENÇÃO</T>
      <P>{form.consideracoes?.trim() || "Não informado"}</P>
      {optional("Critérios para alta", c.criteriosAlta)}
      {optional("Plano familiar", c.planoFamiliar)}
      {optional("Articulação multiprofissional", c.integracao.observacoes)}
      {c.integracao.profissionais.length > 0 && <K label="Profissionais envolvidos" value={c.integracao.profissionais.join("; ")} />}
      {optional("Fundamentação técnica", c.fundamentacao)}
      {(selectedReferences.length > 0 || additionalReferences) && <>
        <T>REFERÊNCIAS BIBLIOGRÁFICAS UTILIZADAS</T>
        {selectedReferences.map((reference, index) =>
          <div key={reference} className="pti-pdf-atomic" style={{ ...line, ...compact, padding: "3px 0" }}>
            {index + 1}. {reference}
          </div>
        )}
        {additionalReferences && <div style={{ ...line, marginTop: selectedReferences.length ? "6px" : 0 }}>{additionalReferences}</div>}
      </>}
      {(form.dataDevolutiva || form.responsavelDevolutiva) && <>
        <T>6. DEVOLUTIVA</T>
        {optional("Data da devolutiva", form.dataDevolutiva)}
        {optional("Responsável pela entrega", form.responsavelDevolutiva)}
      </>}
      <T>ASSINATURA E IDENTIFICAÇÃO PROFISSIONAL</T>
      <div className="pti-pdf-atomic" style={{minHeight:"46px",marginTop:"10px",...compact}}>
        {form.incluirAssinatura !== false && <div style={{display:"flex",gap:"30px",alignItems:"end"}}>
          {signature&&<img src={signature} alt="Imagem de assinatura cadastrada" style={{maxHeight:"65px",maxWidth:"230px",objectFit:"contain"}} />}
          {stamp&&<img src={stamp} alt="Carimbo cadastrado" style={{maxHeight:"65px",maxWidth:"200px",objectFit:"contain"}} />}
        </div>}
        <strong>{id.profissional || professional?.name || "Profissional não informado"}</strong>
        {id.cbo && <span> — CBO: {id.cbo}</span>}
      </div>
      {form.incluirRodape !== false && <footer style={{borderTop:"1px solid #B6E2DC",marginTop:"16px",paddingTop:"6px",color:"#647061",fontSize:"9px"}}>
        PTI MuseTera • Data do plano: {id.dataPlano || "Não informada"} • Documento de uso clínico
      </footer>}
    </div>
  );
}
