export const ACTIVITY_COUNT = 10;
export type DisorderCode = "TEA" | "TDAH" | "TOD" | "DI";
export type DemandSelection = { disorder: DisorderCode; category: string; label: string };

export type GeneratedActivity = {
  id: string;
  disorder: DisorderCode;
  demand: string;
  specialty: "Musicoterapia";
  generalObjective: string;
  specificObjective: string;
  activityDescription: string;
  materials: string[];
  estimatedTime: string;
  evaluationCriteria: string[];
  complexityLevel: "Leve" | "Moderado" | "Severo";
};

const codes: DisorderCode[] = ["TEA", "TDAH", "TOD", "DI"];
const legacyCategories: Record<string, DisorderCode> = {
  "Comunicação e Linguagem": "TEA",
  "Cognição e Aprendizagem": "TEA",
  "Socioemocional": "TEA",
  "Sensorial e Motor": "TEA",
  "Atenção e Funções Executivas": "TDAH",
  "Comportamento e Autorregulação": "TDAH",
  "Socioemocional e Autoestima": "TDAH",
  "Cognitivo e Aprendizagem": "DI",
  "Comportamento e Controle Emocional": "TOD",
  "Socioemocional e Relações Interpessoais": "TOD",
  "Regulação Sensorial e Motora": "TOD",
  "Socioemocional e Comportamental": "DI",
};
const text = (value: unknown) => typeof value === "string" ? value.trim().slice(0, 250) : "";
const isDisorder = (value: unknown): value is DisorderCode => codes.includes(value as DisorderCode);

// Category labels can repeat across disorders; always identify the three parts.
export function collectDemands(body: Record<string, unknown>): DemandSelection[] {
  const found: DemandSelection[] = [];
  const add = (disorder: unknown, category: unknown, label: unknown) => {
    if (!isDisorder(disorder)) return;
    const categoryText = text(category);
    const labelText = text(label);
    if (!categoryText || !labelText) return;
    if (!found.some(item => item.disorder === disorder && item.category === categoryText && item.label === labelText)) {
      found.push({ disorder, category: categoryText, label: labelText });
    }
  };

  if (Array.isArray(body.selectedItems)) {
    for (const item of body.selectedItems.slice(0, 60)) {
      if (item && typeof item === "object") {
        const value = item as Record<string, unknown>;
        add(value.disorder, value.category, value.label);
      }
    }
  } else if (body.selectedSubDemands && typeof body.selectedSubDemands === "object") {
    for (const [key, values] of Object.entries(body.selectedSubDemands).slice(0, 60)) {
      if (!Array.isArray(values)) continue;
      const separator = key.indexOf("::");
      // Clientes anteriores à atualização usavam apenas a categoria.
      const disorder = separator > -1 ? key.slice(0, separator) : legacyCategories[key];
      const category = separator > -1 ? key.slice(separator + 2) : key;
      for (const label of values.slice(0, 40)) add(disorder, category, label);
    }
  }

  if (body.selectedDemands && typeof body.selectedDemands === "object") {
    for (const [disorder, values] of Object.entries(body.selectedDemands)) {
      if (!Array.isArray(values)) continue;
      for (const label of values.slice(0, 40)) add(disorder, "Demanda principal", label);
    }
  }

  return found.slice(0, 40);
}

export function allocateDemands(demands: DemandSelection[]) {
  const selected = demands.slice(0, ACTIVITY_COUNT);
  const base = Math.floor(ACTIVITY_COUNT / selected.length);
  return selected.map((demand, index) => ({
    ...demand,
    demandNumber: index + 1,
    count: base + (index < ACTIVITY_COUNT % selected.length ? 1 : 0),
  }));
}

function readStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(text).filter(Boolean).slice(0, 12);
}

export function parseActivities(content: string): GeneratedActivity[] {
  const clean = content.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  const start = clean.indexOf("{");
  const end = clean.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("A IA não retornou JSON completo");

  const parsed = JSON.parse(clean.slice(start, end + 1)) as { activities?: unknown };
  if (!Array.isArray(parsed.activities) || parsed.activities.length !== ACTIVITY_COUNT) {
    throw new Error(`A IA não retornou as ${ACTIVITY_COUNT} atividades completas`);
  }

  return parsed.activities.map((raw, index) => {
    if (!raw || typeof raw !== "object") throw new Error("Atividade inválida");
    const activity = raw as Record<string, unknown>;
    const disorder = activity.disorder;
    const complexity = activity.complexityLevel;
    const result: GeneratedActivity = {
      id: `ativ-${String(index + 1).padStart(3, "0")}`,
      disorder: isDisorder(disorder) ? disorder : "TEA",
      demand: text(activity.demand),
      specialty: "Musicoterapia",
      generalObjective: text(activity.generalObjective),
      specificObjective: text(activity.specificObjective),
      activityDescription: typeof activity.activityDescription === "string" ? activity.activityDescription.trim().slice(0, 5000) : "",
      materials: readStringArray(activity.materials),
      estimatedTime: text(activity.estimatedTime),
      evaluationCriteria: readStringArray(activity.evaluationCriteria),
      complexityLevel: complexity === "Leve" || complexity === "Moderado" || complexity === "Severo" ? complexity : "Moderado",
    };
    if (!result.demand || !result.generalObjective || !result.specificObjective || !result.activityDescription ||
        !result.estimatedTime || !result.materials.length || !result.evaluationCriteria.length || !isDisorder(disorder)) {
      throw new Error(`Atividade ${index + 1} incompleta`);
    }
    return result;
  });
}
