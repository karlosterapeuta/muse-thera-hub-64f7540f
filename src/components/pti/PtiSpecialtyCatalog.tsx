import { useMemo, useState } from "react";
import { Check, ChevronDown, ChevronUp, Plus, Search } from "lucide-react";
import { MUSETERA_PTI_CATALOG } from "./PtiObjectiveLibrary";

export interface PtiCatalogSuggestion {
  specialty: string;
  area: string;
  objective: string;
  example: string;
  resource: string;
}

const specialtySuggestions: PtiCatalogSuggestion[] = [
  { specialty: "Psicologia", area: "Autorregulação", objective: "Favorecer o reconhecimento e a expressão de emoções nas interações.", example: "Utilizar jogos simbólicos e identificação de emoções conforme orientação da equipe.", resource: "Cartões de emoções e histórias" },
  { specialty: "Psicologia", area: "Habilidades sociais", objective: "Ampliar repertórios de espera, turnos e tolerância a mudanças graduais.", example: "Planejar atividades mediadas com alternância de turnos.", resource: "Jogos de regras simples" },
  { specialty: "Fonoaudiologia", area: "Comunicação", objective: "Apoiar o uso funcional de recursos de comunicação definidos pela equipe.", example: "Oferecer oportunidades de escolha usando o recurso comunicativo já indicado.", resource: "Pranchas e cartões de comunicação" },
  { specialty: "Fonoaudiologia", area: "Linguagem", objective: "Favorecer trocas comunicativas em atividades compartilhadas.", example: "Organizar turnos de pedidos, nomeações e respostas funcionais.", resource: "Objetos e recursos visuais" },
  { specialty: "Nutrição", area: "Rotina", objective: "Apoiar a participação nas rotinas de alimentação conforme plano da equipe.", example: "Estruturar sequência visual de início, participação e encerramento.", resource: "Rotinas ilustradas" },
  { specialty: "Psicomotricidade", area: "Coordenação", objective: "Estimular organização espacial e planejamento motor em atividades lúdicas.", example: "Realizar circuitos simples com sequências e pausas.", resource: "Cones, aros e marcações" },
  { specialty: "Terapia Ocupacional", area: "Autonomia", objective: "Favorecer participação progressiva em atividades de vida diária.", example: "Sequenciar tarefas funcionais com ajuda graduada.", resource: "Objetos de rotina e pistas visuais" },
  { specialty: "Psicopedagogia", area: "Aprendizagem", objective: "Apoiar manutenção da atenção e sequenciação de tarefas de aprendizagem.", example: "Organizar tarefas curtas com começo, meio e fim.", resource: "Cartões de sequência e jogos" },
];

const suggestions: PtiCatalogSuggestion[] = [
  ...MUSETERA_PTI_CATALOG.map(item => ({ ...item, specialty: "Musicoterapia" })),
  ...specialtySuggestions,
];
const specialties = ["Musicoterapia", "Psicologia", "Fonoaudiologia", "Nutrição", "Psicomotricidade", "Terapia Ocupacional", "Psicopedagogia"];
const normalize = (s: string) => s.toLocaleLowerCase("pt-BR").trim();
interface Props {
  selected: string[];
  onAdd: (suggestion: PtiCatalogSuggestion) => void;
}
export function PtiSpecialtyCatalog({ selected, onAdd }: Props) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string[]>([]);
  const matches = useMemo(() => suggestions.filter(item => normalize(`${item.specialty} ${item.area} ${item.objective} ${item.example} ${item.resource}`).includes(normalize(query))), [query]);
  return (
    <div className="overflow-hidden rounded-md border border-border bg-card">
      <div className="space-y-3 border-b border-border p-4">
        <h3 className="text-sm font-bold text-foreground">Catálogo de objetivos clínicos</h3>
        <p className="text-xs text-muted-foreground">Escolha uma sugestão para incluir um objetivo, atividade e material no PTI. Revise a pertinência clínica antes de salvar.</p>
        <div className="relative max-w-lg">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input aria-label="Buscar por objetivo, atividade, material ou subtema" value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Buscar por objetivo, atividade, material ou subtema"
            className="h-10 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
      </div>
      <div className="divide-y divide-slate-200">
        {specialties.map(specialty => {
          const allCount = suggestions.filter(item => item.specialty === specialty).length;
          const listed = matches.filter(item => item.specialty === specialty);
          if (query.trim() && !listed.length) return null;
          const open = expanded.includes(specialty) || (!!query.trim() && listed.length > 0);
          const selectedCount = suggestions.filter(item => item.specialty === specialty && selected.some(x => normalize(x) === normalize(item.objective))).length;
          return (
            <div key={specialty}>
              <button type="button" className="flex w-full items-center gap-2 px-4 py-3 text-left hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => setExpanded(current => current.includes(specialty) ? current.filter(x => x !== specialty) : [...current, specialty])}
                aria-expanded={open}>
                <span className="min-w-0 flex-1 text-xs font-bold uppercase tracking-wider text-foreground">{specialty}</span>
                <span className="rounded-full bg-primary/15 px-2 py-1 text-[11px] font-semibold text-primary">{allCount} objetivos</span>
                {selectedCount > 0 && <span className="rounded-full bg-primary/15 px-2 py-1 text-[11px] font-semibold text-primary">{selectedCount} incluído(s)</span>}
                {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </button>
              {open && <div className="space-y-2 border-t border-border bg-muted/40 p-3">
                {listed.map(item => {
                  const exists = selected.some(x => normalize(x) === normalize(item.objective));
                  return (
                    <div key={item.objective} className="flex flex-col gap-2 rounded border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0 space-y-1">
                        <p className="text-xs font-semibold text-primary">{item.area}</p>
                        <p className="text-sm font-medium text-foreground">{item.objective}</p>
                        <p className="text-xs text-muted-foreground"><b>Atividade:</b> {item.example}</p>
                        <p className="text-xs text-muted-foreground"><b>Material:</b> {item.resource}</p>
                      </div>
                      <button type="button" disabled={exists} onClick={() => onAdd(item)}
                        className="inline-flex shrink-0 items-center justify-center gap-1 rounded border border-primary/40 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/15 disabled:border-border disabled:bg-muted disabled:text-muted-foreground">
                        {exists ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        {exists ? "Incluído" : "Adicionar"}
                      </button>
                    </div>
                  );
                })}
              </div>}
            </div>
          );
        })}
      </div>
      <p className="border-t border-border bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
        Sugestões ilustrativas. Objetivos de outras especialidades exigem participação do profissional habilitado; o plano musicoterapêutico deve respeitar o escopo de atuação.
      </p>
    </div>
  );
}
