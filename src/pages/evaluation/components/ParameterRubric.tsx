import { useState } from "react";
import { ChevronDown, ClipboardCheck } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const RUBRIC_LEVELS = [
  { key: "nao_observado", value: 0, title: "0 · Não observado", description: "A habilidade não foi demonstrada mesmo após oportunidades adequadas e acessíveis; descreva as tentativas. Se não houve oportunidade, use Não aplicável/não testado." },
  { key: "emergente", value: 20, title: "1 · Emergente", description: "Há resposta inicial ou tentativa funcional, dependente de mediação intensa, com pouca autonomia." },
  { key: "inconsistente", value: 40, title: "2 · Inconsistente", description: "Habilidade aparece em algumas oportunidades, com variação importante e/ou necessidade frequente de ajuda." },
  { key: "moderado", value: 60, title: "3 · Moderado", description: "Resposta funcional em parte relevante das oportunidades, com apoio ocasional e estabilidade intermediária." },
  { key: "consistente", value: 80, title: "4 · Consistente", description: "Resposta funcional na maioria das oportunidades, com baixa necessidade de mediação, no contexto testado." },
  { key: "excepcional", value: 100, title: "5 · Excepcional", description: "Resposta estável e autônoma nas oportunidades adequadas, com flexibilidade ou transferência observada quando o indicador comportar." },
] as const;

export const EVIDENCE_PREFIX = "__musetera_evidence__:";
export const evidenceKey = (parameterKey: string) => EVIDENCE_PREFIX + parameterKey;

interface Props {
  parameterKey: string;
  parameterLabel: string;
  selection?: string;
  observations: Record<string, string>;
  onEvidenceChange: (key: string, value: string) => void;
  onSelectionChange: (value: string) => void;
}

export function ParameterRubric({ parameterKey, parameterLabel, selection, observations, onEvidenceChange, onSelectionChange }: Props) {
  const [open, setOpen] = useState(false);
  const id = evidenceKey(parameterKey);
  const parsed = (() => {
    try { return JSON.parse(observations[id] || "{}") as Record<string, string>; }
    catch { return {} as Record<string, string>; }
  })();
  const update = (field: string, value: string) => onEvidenceChange(id, JSON.stringify({ ...parsed, [field]: value }));
  const selected = RUBRIC_LEVELS.find(level => level.key === selection);
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="mt-3 rounded-lg border border-teal-700/20 bg-card dark:border-teal-500/25">
      <CollapsibleTrigger type="button" className="flex min-h-11 w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500">
        <span className="flex items-center gap-2"><ClipboardCheck className="h-4 w-4 text-teal-800 dark:text-teal-200" /> Critérios e registro da aplicação</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-3 border-t px-3 py-3 text-sm leading-relaxed">
        <p className="text-muted-foreground">Observe a tarefa: <strong className="text-foreground">{parameterLabel}</strong>. Os níveis são âncoras clínicas propostas; não são pontos de corte validados. Compare respostas somente em condições de aplicação equivalentes.</p>
        <div className="grid gap-2">
          {RUBRIC_LEVELS.map(level => (
            <div key={level.key} className={`rounded-md border px-3 py-2 ${selection === level.key ? "border-teal-500 bg-teal-50 dark:bg-teal-950/40" : "bg-card"}`}>
              <strong>{level.title} · {level.value} pontos</strong>
              <p className="mt-1 text-muted-foreground">{level.description}</p>
            </div>
          ))}
        </div>
        {selected && <p className="rounded-md bg-teal-50 px-3 py-2 text-teal-900 dark:bg-teal-950/40 dark:text-teal-100"><strong>Nível selecionado:</strong> {selected.title}. Justifique com as evidências abaixo.</p>}
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1 text-sm font-medium">Oportunidades/tentativas realizadas
            <Input inputMode="numeric" type="number" min="0" max="99" placeholder="Ex.: 3" value={parsed.attempts || ""} onChange={e=>update("attempts",e.target.value)} className="bg-background" />
          </label>
          <label className="space-y-1 text-sm font-medium">Respostas funcionais observadas
            <Input inputMode="numeric" type="number" min="0" max="99" placeholder="Ex.: 2" value={parsed.successes || ""} onChange={e=>update("successes",e.target.value)} className="bg-background" />
          </label>
          <div className="space-y-1 sm:col-span-2">
            <span className="font-medium">Maior nível de ajuda necessário</span>
            <Select value={parsed.support || "nao_registrado"} onValueChange={v=>update("support",v)}>
              <SelectTrigger className="bg-background"><SelectValue placeholder="Selecione o tipo de apoio" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="nao_registrado">Não registrado</SelectItem>
                <SelectItem value="independente">Sem ajuda / independente</SelectItem>
                <SelectItem value="pista_visual">Pista visual ou gestual</SelectItem>
                <SelectItem value="pista_verbal">Pista verbal</SelectItem>
                <SelectItem value="modelo">Modelo ou demonstração</SelectItem>
                <SelectItem value="ajuda_intensa">Ajuda intensa / coexecução consentida</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <label className="block space-y-1 font-medium">Evidências observáveis e adaptações
          <Textarea rows={2} value={parsed.note || ""} placeholder="Registre resposta, pistas, adaptações, limitações e contexto da sessão." onChange={e=>update("note",e.target.value)} className="bg-background text-sm" />
        </label>
        {parsed.attempts && parsed.successes && Number(parsed.successes) > Number(parsed.attempts) && <p role="alert" className="text-destructive">As respostas observadas não podem superar o número de tentativas.</p>}
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
          <strong>Quando não pontuar:</strong> se faltou oportunidade, a tarefa não era segura ou houve barreira de acessibilidade, selecione “Não aplicável/não testado” no parâmetro. Isso é diferente de “Não observado” (0).
          <button type="button" className="mt-2 block rounded-md border border-amber-700 bg-white px-3 py-2 text-sm font-semibold text-amber-950 hover:bg-amber-100 focus-visible:ring-2 dark:border-amber-500 dark:bg-amber-950 dark:text-amber-50" aria-pressed={selection === "nao_aplicavel"} onClick={()=>onSelectionChange(selection==="nao_aplicavel"?"":"nao_aplicavel")}>{selection==="nao_aplicavel"?"Desmarcar não aplicável":"Marcar não aplicável / não testado"}</button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
