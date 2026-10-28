import { jsPDF } from "jspdf";
import type { ProfessionalData } from "@/hooks/useProfessionalData";
import { createDefaultPtiFormulario, type PtiContent } from "@/types/pti";
import { getPtiSelectedReferences } from "@/components/pti/ptiReferences";
import regularFontUrl from "@/assets/pti-font-regular.ttf?url";
import boldFontUrl from "@/assets/pti-font-bold.ttf?url";

interface PtiNativePdfOptions {
  content: PtiContent;
  professional?: ProfessionalData | null;
  signature?: string;
  stamp?: string;
  filename: string;
}

/** Exportação vetorial: textos pesquisáveis, paginação real e imagens preservadas. */
export async function generatePtiNativePdf({ content: c, professional, signature, stamp, filename }: PtiNativePdfOptions): Promise<void> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
  // Subconjuntos da fonte DejaVu Sans com acentuação PT-BR. Incorporar as fontes
  // evita espaçamentos incorretos nos visualizadores e torna o texto pesquisável.
  const loadFont = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Não foi possível carregar a fonte do PDF do PTI.");
    const bytes = new Uint8Array(await response.arrayBuffer());
    let binary = "";
    for (let i = 0; i < bytes.length; i += 8192) {
      binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
    }
    return btoa(binary);
  };
  doc.addFileToVFS("PTI-Regular.ttf", await loadFont(regularFontUrl));
  doc.addFont("PTI-Regular.ttf", "PTI", "normal");
  doc.addFileToVFS("PTI-Bold.ttf", await loadFont(boldFontUrl));
  doc.addFont("PTI-Bold.ttf", "PTI", "bold");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const right = pageWidth - margin;
  const textWidth = right - margin;
  const bottom = pageHeight - 19;
  const green: [number, number, number] = [19, 123, 113];
  const dark: [number, number, number] = [28, 38, 33];
  const soft: [number, number, number] = [98, 111, 104];
  const form = { ...createDefaultPtiFormulario(), ...c.formulario };
  let y = 20;

  const nextPage = () => { doc.addPage(); y = 18; };
  const ensure = (height: number) => { if (y + height > bottom) nextPage(); };
  const text = (value: string, indent = 0, fontSize = 10, color = dark, weight: "normal" | "bold" = "normal") => {
    const cleaned = String(value || "").replace(/\r\n/g, "\n");
    if (!cleaned.trim()) return;
    doc.setFont("PTI", weight);
    doc.setFontSize(fontSize);
    doc.setTextColor(...color);
    const lineHeight = fontSize * 0.43;
    for (const block of cleaned.split("\n")) {
      const lines = doc.splitTextToSize(block || " ", textWidth - indent) as string[];
      for (const line of lines) {
        ensure(lineHeight + 0.6);
        doc.text(line, margin + indent, y);
        y += lineHeight + 0.6;
      }
    }
    y += 1.1;
  };
  const field = (label: string, value: unknown) => {
    const v = typeof value === "string" ? value.trim() : value == null ? "" : String(value);
    if (!v) return;
    text(`${label}: ${v}`);
  };
  const section = (title: string) => {
    ensure(17);
    y += 2.5;
    doc.setFillColor(...green);
    doc.rect(margin, y - 4, textWidth, 9, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("PTI", "bold");
    doc.setFontSize(10);
    doc.text(title, margin + 3, y + 2);
    y += 12;
  };
  const subheading = (title: string) => {
    ensure(10);
    y += 1;
    doc.setFont("PTI", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...green);
    doc.text(title, margin, y);
    y += 5.5;
  };
  const list = (items: string[], prefix = "-") => items.filter(x => x.trim()).forEach((v, i) => text(`${prefix === "#" ? `${i + 1}.` : prefix} ${v}`, 2));

  doc.setFont("PTI", "bold");
  doc.setFontSize(17);
  doc.setTextColor(...green);
  doc.text("MUSETERA", pageWidth / 2, y, { align: "center" });
  y += 8;
  doc.setFontSize(13);
  doc.setTextColor(...dark);
  doc.text("Plano Terapêutico Individual", pageWidth / 2, y, { align: "center" });
  y += 6;
  doc.setFont("PTI", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...soft);
  doc.text("Musicoterapia Clínica - Documento de acompanhamento individualizado", pageWidth / 2, y, { align: "center" });
  y += 5;
  doc.setDrawColor(...green);
  doc.setLineWidth(0.5);
  doc.line(margin, y, right, y);
  y += 4;

  const id = c.identificacao;
  section("1. DADOS DO PACIENTE");
  field("Paciente", id.nome);
  field("Idade", id.idade);
  field("Nascimento", id.nascimento);
  field("Nome da mãe", form.nomeMae);
  field("Nome do pai", form.nomePai);
  field("Responsável", id.responsavel);
  field("Contato", id.telefone);
  field("Diagnóstico registrado", id.diagnostico);
  field("CID", id.cid);
  field("DSM registrado", id.dsm);
  field("Início de implementação", form.inicioImplementacao || id.dataPlano);
  field("Profissional", id.profissional || professional?.name);
  field("Reavaliação prevista", form.revisaoObjetivos);

  section("2. BREVE HISTÓRIA CLÍNICA");
  field("Unidade", form.unidade);
  field("Medicações informadas (já prescritas)", form.medicacoesAtuais);
  field("Protocolo de avaliação", form.protocoloAvaliacao);
  const behaviors = [form.comportamentoAutolesivo && "Autoagressão relatada", form.comportamentoHeterolesivo && "Heteroagressão relatada"].filter(Boolean);
  field("Comportamentos relatados", behaviors.join("; "));
  field("Informações dos responsáveis", form.relatosResponsaveis);
  field("Desenvolvimento e autonomia", form.desenvolvimentoAutonomia);
  field("Comportamento e manejo", form.comportamentoManejo);
  field("Síntese clínica", form.resumoClinico);
  field("Queixa principal", c.queixaPrincipal);
  field("Histórico de desenvolvimento", c.historicoClinico.desenvolvimento);
  field("Escolaridade", c.historicoClinico.escolaridade);
  field("Comunicação", c.historicoClinico.comunicacao);
  field("Terapias anteriores", c.historicoClinico.terapiasAnteriores);
  field("Histórico musical", c.historicoClinico.historicoMusical);
  field("Preferências musicais", c.historicoClinico.preferenciasMusicais);
  field("Hipersensibilidades relatadas", c.historicoClinico.hipersensibilidades);
  field("Hipossensibilidades relatadas", c.historicoClinico.hipossensibilidades);
  field("Potencialidades", c.potencialidades);
  field("Dificuldades", c.dificuldades);
  field("Objetivo geral", c.objetivoGeral);

  const evalNames: Record<string, string> = { comunicacao: "Comunicação", socializacao: "Socialização", cognicao: "Cognição", sensorial: "Sensorial", musicalidade: "Musicalidade" };
  const assessment = Object.entries(c.avaliacao || {}).filter(([, v]) => v.opcoes?.length || v.observacoes?.trim());
  if (assessment.length) {
    subheading("Avaliação clínica registrada");
    assessment.forEach(([key, v]) => field(evalNames[key] || key, [v.opcoes?.join("; "), v.observacoes].filter(Boolean).join(". ")));
  }

  section("3. OBJETIVOS MUSICOTERAPÊUTICOS");
  if (!c.objetivosEspecificos.length) text("Nenhum objetivo cadastrado.");
  c.objetivosEspecificos.forEach((o, i) => {
    subheading(`Objetivo ${i + 1}${o.area ? ` - ${o.area}` : ""}`);
    field("Objetivo", o.descricao);
    field("Atividade", o.atividade);
    field("Material", o.material);
    field("Prioridade", o.prioridade);
    field("Prazo", o.prazo);
  });
  if (c.metas.length) {
    subheading("Metas terapêuticas mensuráveis");
    c.metas.forEach((m, i) => {
      text(`Meta ${i + 1}`, 0, 10, green, "bold");
      field("Descrição", m.descricao);
      field("Linha de base", m.linhaBase);
      field("Indicador", m.indicador);
      field("Alvo", m.percentual);
      field("Prazo", m.prazo);
      field("Critério de sucesso", m.criterio);
    });
  }
  if (c.estrategias.length || c.recursos.length || c.frequencia.sessoes || c.frequencia.duracao || c.frequencia.atendimento) {
    subheading("Estratégias, recursos e frequência");
    field("Estratégias", c.estrategias.join("; "));
    field("Recursos", c.recursos.join("; "));
    field("Frequência", c.frequencia.sessoes);
    field("Duração", c.frequencia.duracao);
    field("Modalidade", c.frequencia.atendimento);
  }
  const evolution = Object.entries(c.criteriosEvolucao || {}).filter(([, value]) => Number(value) > 0);
  if (evolution.length) {
    subheading("Indicadores de evolução registrados");
    evolution.forEach(([key, value]) => field(key, String(value)));
  }

  section("4. COMPORTAMENTOS-PROBLEMA LISTADOS");
  if (form.comportamentosAlvo.length) list(form.comportamentosAlvo, "#");
  else text("Nenhum comportamento registrado neste plano.");

  section("5. CONSIDERAÇÕES E PLANO DE INTERVENÇÃO");
  text(form.consideracoes?.trim() || "Não informado");
  field("Critérios para alta", c.criteriosAlta);
  field("Plano familiar", c.planoFamiliar);
  field("Articulação multiprofissional", c.integracao.observacoes);
  field("Profissionais envolvidos", c.integracao.profissionais.join("; "));
  field("Fundamentação técnica", c.fundamentacao);

  const refs = getPtiSelectedReferences(form.referenciasSelecionadas);
  if (refs.length || form.referencias.trim()) {
    section("REFERÊNCIAS BIBLIOGRÁFICAS UTILIZADAS");
    list(refs, "#");
    text(form.referencias);
  }
  if (form.dataDevolutiva || form.responsavelDevolutiva) {
    section("6. DEVOLUTIVA");
    field("Data da devolutiva", form.dataDevolutiva);
    field("Responsável pela entrega", form.responsavelDevolutiva);
  }

  // Manter as imagens na mesma faixa, em tamanho legível, sem distorção.
  const imageSources = form.incluirAssinatura === false ? [] : [signature, stamp].filter(Boolean) as string[];
  const maxHeight = 33;
  const maxWidth = imageSources.length > 1 ? 77 : 100;
  const gap = 7;
  const sizes = imageSources.map(src => {
    const props = doc.getImageProperties(src);
    const scale = Math.min(maxWidth / props.width, maxHeight / props.height);
    return { src, width: props.width * scale, height: props.height * scale };
  });
  const rowHeight = sizes.length ? Math.max(...sizes.map(item => item.height)) : 0;
  // Reservar título, imagens e identificação na mesma folha.
  ensure(22 + rowHeight);
  section("ASSINATURA E IDENTIFICAÇÃO PROFISSIONAL");
  if (imageSources.length) {
    let x = margin;
    sizes.forEach(item => {
      doc.addImage(item.src, "PNG", x, y, item.width, item.height, undefined, "FAST");
      x += item.width + gap;
    });
    y += rowHeight + 5;
  }
  field("Profissional", id.profissional || professional?.name || "Não informado");
  field("CBO", id.cbo);

  const count = doc.getNumberOfPages();
  for (let page = 1; page <= count; page++) {
    doc.setPage(page);
    if (form.incluirRodape !== false) {
      doc.setDrawColor(182, 226, 220);
      doc.line(margin, pageHeight - 14, right, pageHeight - 14);
      doc.setFont("PTI", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...soft);
      doc.text(`PTI MuseTera - ${id.dataPlano || "Data não informada"} - Documento de uso clínico`, margin, pageHeight - 9);
      doc.text(`${page}/${count}`, right, pageHeight - 9, { align: "right" });
    }
  }
  doc.save(filename);
}
