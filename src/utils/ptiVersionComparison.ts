import type { PtiContent, PtiObjetivoEspecifico, PtiMeta } from "@/types/pti";

type VersionContent = Pick<PtiContent, "objetivosEspecificos" | "metas">;

function descriptions(entries: Array<{ descricao: string }> | undefined) {
  return Array.from(new Set((entries || []).map(item => item.descricao?.trim()).filter(Boolean) as string[]));
}

function editedEntries<T extends { id: string; descricao: string }>(current: T[], previous: T[], fields: Array<keyof T>) {
  return current.filter(entry => {
    const older = previous.find(item => item.id === entry.id);
    return older && fields.some(field => entry[field] !== older[field]);
  }).map(entry => entry.descricao.trim()).filter(Boolean);
}

function newDescriptions<T extends { id: string; descricao: string }>(current: T[], previous: T[]) {
  const oldIds = new Set(previous.map(item => item.id));
  return current.filter(item => !oldIds.has(item.id)).map(item => item.descricao.trim()).filter(Boolean);
}

const objectiveFields: Array<keyof PtiObjetivoEspecifico> = ["descricao", "atividade", "material", "area", "prazo", "prioridade"];
const goalFields: Array<keyof PtiMeta> = ["descricao", "linhaBase", "indicador", "percentual", "prazo", "criterio"];

/** Compare immutable saved snapshots, never mutate the plan or a version. */
export function comparePtiVersions(current: VersionContent, previous?: VersionContent) {
  const currentObjectives = descriptions(current.objetivosEspecificos);
  const currentGoals = descriptions(current.metas);
  if (!previous) return {
    currentObjectives, currentGoals,
    addedObjectives: currentObjectives, removedObjectives: [] as string[],
    addedGoals: currentGoals, removedGoals: [] as string[],
    editedObjectives: [] as string[], editedGoals: [] as string[],
  };
  return {
    currentObjectives, currentGoals,
    addedObjectives: newDescriptions(current.objetivosEspecificos || [], previous.objetivosEspecificos || []),
    removedObjectives: newDescriptions(previous.objetivosEspecificos || [], current.objetivosEspecificos || []),
    addedGoals: newDescriptions(current.metas || [], previous.metas || []),
    removedGoals: newDescriptions(previous.metas || [], current.metas || []),
    editedObjectives: editedEntries(current.objetivosEspecificos || [], previous.objetivosEspecificos || [], objectiveFields),
    editedGoals: editedEntries(current.metas || [], previous.metas || [], goalFields),
  };
}
