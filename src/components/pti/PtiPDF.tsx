import { PtiContent, PTI_CRITERIOS_EVOLUCAO } from "@/types/pti";
import { ProfessionalData } from "@/hooks/useProfessionalData";

interface PtiPDFProps {
  content: PtiContent;
  professional?: ProfessionalData | null;
  signature?: string;
  stamp?: string;
}

const styles = {
  page: {
    width: "210mm",
    minHeight: "297mm",
    padding: "14mm",
    background: "#ffffff",
    color: "#1a1a2e",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "11px",
    lineHeight: 1.5,
    boxSizing: "border-box" as const,
  },
  h1: { fontSize: "18px", fontWeight: 700, color: "#7c3aed", margin: "0 0 2px 0" },
  sectionTitle: {
    fontSize: "12px",
    fontWeight: 700,
    color: "#4c1d95",
    borderBottom: "2px solid #ddd6fe",
    padding: "10px 0 4px 0",
    margin: "10px 0 6px 0",
  },
  label: { fontWeight: 700, color: "#444" },
  row: { display: "flex", flexWrap: "wrap" as const, gap: "4px 18px", margin: "2px 0" },
  text: { whiteSpace: "pre-wrap" as const, margin: "2px 0" },
  chip: {
    display: "inline-block",
    background: "#ede9fe",
    color: "#5b21b6",
    borderRadius: "10px",
    padding: "2px 8px",
    margin: "2px 4px 2px 0",
    fontSize: "10px",
  },
};

export function PtiPDF({ content: c, professional, signature, stamp }: PtiPDFProps) {
  const id = c.identificacao;
  const T = ({ children }: { children: React.ReactNode }) => <div style={styles.sectionTitle}>{children}</div>;
  const P = ({ children }: { children: React.ReactNode }) => <div style={styles.text}>{children}</div>;

  return (
    <div style={styles.page}>
      <div style={{ textAlign: "center", marginBottom: "8px" }}>
        <div style={styles.h1}>Plano Terapêutico Individual (PTI)</div>
        <div style={{ fontSize: "11px", color: "#666" }}>Musicoterapia Clínica</div>
      </div>

      <T>1. Identificação</T>
      <div style={styles.row}>
        <span><span style={styles.label}>Nome:</span> {id.nome || "—"}</span>
        <span><span style={styles.label}>Idade:</span> {id.idade || "—"}</span>
        <span><span style={styles.label}>Nascimento:</span> {id.nascimento || "—"}</span>
        <span><span style={styles.label}>Sexo:</span> {id.sexo || "—"}</span>
        <span><span style={styles.label}>Responsável:</span> {id.responsavel || "—"}</span>
        <span><span style={styles.label}>Telefone:</span> {id.telefone || "—"}</span>
        <span><span style={styles.label}>Diagnóstico:</span> {id.diagnostico || "—"}</span>
        <span><span style={styles.label}>CID:</span> {id.cid || "—"}</span>
        <span><span style={styles.label}>DSM:</span> {id.dsm || "—"}</span>
        <span><span style={styles.label}>Data do plano:</span> {id.dataPlano || "—"}</span>
        <span><span style={styles.label}>Profissional:</span> {id.profissional || "—"}</span>
        <span><span style={styles.label}>CBO:</span> {id.cbo || "—"}</span>
      </div>

      <T>2. Queixa Principal</T>
      <P>{c.queixaPrincipal || "—"}</P>

      <T>3. Histórico Clínico</T>
      {Object.entries({
        Desenvolvimento: c.historicoClinico.desenvolvimento,
        Escolaridade: c.historicoClinico.escolaridade,
        Comunicação: c.historicoClinico.comunicacao,
        "Terapias anteriores": c.historicoClinico.terapiasAnteriores,
        "Histórico musical": c.historicoClinico.historicoMusical,
        "Preferências musicais": c.historicoClinico.preferenciasMusicais,
        Hipersensibilidades: c.historicoClinico.hipersensibilidades,
        Hipossensibilidades: c.historicoClinico.hipossensibilidades,
      }).filter(([, v]) => v).map(([k, v]) => (
        <P key={k}><span style={styles.label}>{k}: </span>{v}</P>
      ))}

      <T>4. Avaliação Musicoterapêutica</T>
      {Object.entries(c.avaliacao).map(([cat, val]) => (
        (val.opcoes.length > 0 || val.observacoes) ? (
          <div key={cat} style={{ margin: "3px 0" }}>
            <div style={{ ...styles.label, textTransform: "capitalize" }}>{cat}</div>
            <div>{val.opcoes.map((o) => <span key={o} style={styles.chip}>{o}</span>)}</div>
            {val.observacoes && <P>{val.observacoes}</P>}
          </div>
        ) : null
      ))}

      <T>5. Potencialidades</T>
      <P>{c.potencialidades || "—"}</P>

      <T>6. Dificuldades</T>
      <P>{c.dificuldades || "—"}</P>

      <T>7. Objetivo Geral</T>
      <P>{c.objetivoGeral || "—"}</P>

      <T>8. Objetivos Específicos</T>
      {c.objetivosEspecificos.length ? c.objetivosEspecificos.map((o, i) => (
        <P key={o.id}>{i + 1}. {o.descricao} {o.area && `[${o.area}]`} {o.prioridade && `• ${o.prioridade}`} {o.prazo && `• Prazo: ${o.prazo}`}</P>
      )) : <P>—</P>}

      <T>9. Metas Terapêuticas</T>
      {c.metas.length ? c.metas.map((m, i) => (
        <P key={m.id}>{i + 1}. {m.descricao} {m.indicador && `| Indicador: ${m.indicador}`} {m.percentual && `| ${m.percentual}`} {m.prazo && `| Prazo: ${m.prazo}`} {m.criterio && `| Critério: ${m.criterio}`}</P>
      )) : <P>—</P>}

      <T>10. Estratégias Musicoterapêuticas</T>
      <div>{c.estrategias.length ? c.estrategias.map((e) => <span key={e} style={styles.chip}>{e}</span>) : "—"}</div>

      <T>11. Recursos Utilizados</T>
      <div>{c.recursos.length ? c.recursos.map((e) => <span key={e} style={styles.chip}>{e}</span>) : "—"}</div>

      <T>12. Frequência</T>
      <div style={styles.row}>
        <span><span style={styles.label}>Sessões:</span> {c.frequencia.sessoes || "—"}</span>
        <span><span style={styles.label}>Duração:</span> {c.frequencia.duracao || "—"}</span>
        <span><span style={styles.label}>Atendimento:</span> {c.frequencia.atendimento || "—"}</span>
      </div>

      <T>13. Critérios de Evolução</T>
      <div style={styles.row}>
        {PTI_CRITERIOS_EVOLUCAO.map((a) => (
          <span key={a}><span style={styles.label}>{a}:</span> {c.criteriosEvolucao[a] || 0}/5</span>
        ))}
      </div>

      <T>14. Critérios para Alta</T>
      <P>{c.criteriosAlta || "—"}</P>

      <T>15. Plano Familiar</T>
      <P>{c.planoFamiliar || "—"}</P>

      <T>16. Integração Multiprofissional</T>
      <div>{c.integracao.profissionais.length ? c.integracao.profissionais.map((p) => <span key={p} style={styles.chip}>{p}</span>) : "—"}</div>
      {c.integracao.observacoes && <P>{c.integracao.observacoes}</P>}

      <T>17. Fundamentação Técnica</T>
      <P>{c.fundamentacao || "—"}</P>

      <T>18. Assinatura</T>
      <div style={{ marginTop: "8px" }}>
        <div style={{ display: "flex", gap: "40px", alignItems: "flex-end" }}>
          {signature && <img src={signature} alt="assinatura" style={{ height: "60px", objectFit: "contain" }} />}
          {stamp && <img src={stamp} alt="carimbo" style={{ height: "60px", objectFit: "contain" }} />}
        </div>
        <div style={{ marginTop: "6px" }}>
          <strong>{id.profissional || professional?.name || ""}</strong>
          {id.cbo && <span> — CBO: {id.cbo}</span>}
        </div>
        <div>Data: {id.dataPlano || ""}</div>
      </div>
    </div>
  );
}
