import type { PtiContent } from "@/types/pti";

/** Validação orientativa: rascunhos continuam exportáveis mediante confirmação. */
export function getPtiExportWarnings(content: PtiContent): string[] {
  const warnings: string[] = [];
  if (!content.objetivosEspecificos?.some(item => item.descricao?.trim())) {
    warnings.push("objetivos terapêuticos");
  }
  if (!content.metas?.some(item => item.descricao?.trim())) {
    warnings.push("metas mensuráveis");
  }
  if (!content.formulario?.consideracoes?.trim() && !content.objetivoGeral?.trim()) {
    warnings.push("plano de intervenção ou objetivo geral");
  }
  return warnings;
}

export function confirmPtiExport(content: PtiContent): boolean {
  const missing = getPtiExportWarnings(content);
  if (!missing.length) return true;
  return window.confirm(
    `Este PTI ainda não contém: ${missing.join(", ")}.\n\n` +
    "Deseja exportar mesmo assim como rascunho? Revise os dados antes de entregar o documento."
  );
}
