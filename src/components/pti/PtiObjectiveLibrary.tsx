import { useMemo, useState } from "react";
import { Search, Plus, BookOpen, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CatalogItem {
  area: string;
  objective: string;
  example: string;
  resource: string;
}

// Sugestões originais de intervenções musicoterapêuticas; não são observações do paciente.
export const MUSETERA_PTI_CATALOG: CatalogItem[] = [
  { area: "Comunicação", objective: "Estimular a intenção comunicativa por meio de escolhas musicais.", example: "Oferecer duas canções e aguardar escolha verbal, gestual ou alternativa.", resource: "Cartões de escolha e instrumentos" },
  { area: "Comunicação", objective: "Ampliar a reciprocidade comunicativa em turnos musicais.", example: "Estabelecer diálogo de pergunta e resposta com voz ou instrumentos.", resource: "Teclado, tambor e microfone" },
  { area: "Linguagem", objective: "Favorecer a produção e imitação de sons vocais em contexto musical.", example: "Modelar sílabas e vocalizações em canções curtas com pausas.", resource: "Voz, microfone e canções familiares" },
  { area: "Cognição", objective: "Estimular atenção sustentada em atividades musicais estruturadas.", example: "Repetir sequências rítmicas breves com duração progressiva.", resource: "Tambor e cartões rítmicos" },
  { area: "Cognição", objective: "Desenvolver memória auditiva e sequenciação musical.", example: "Reconhecer e reproduzir padrões de duas ou mais notas.", resource: "Xilofone e sinos" },
  { area: "Socialização", objective: "Ampliar atenção compartilhada e interação social mediada pela música.", example: "Realizar canção alternada com troca de olhar e turnos.", resource: "Instrumentos de percussão e canto" },
  { area: "Motricidade", objective: "Fortalecer coordenação motora bilateral em tarefas rítmicas.", example: "Executar padrões alternados com as mãos e movimentos corporais.", resource: "Boomwhackers e instrumentos de percussão" },
  { area: "Emocional", objective: "Favorecer reconhecimento e expressão de estados emocionais com apoio musical.", example: "Relacionar contrastes musicais a emoções e convidar à expressão.", resource: "Playlist terapêutica e cartões de emoções" },
  { area: "Sensorial", objective: "Promover exploração auditiva graduada respeitando a tolerância individual.", example: "Apresentar timbres em intensidade controlada com possibilidade de escolha.", resource: "Sinos, chocalhos e controle de volume" },
  { area: "Musicalidade", objective: "Desenvolver percepção de pulso e organização rítmica.", example: "Marcar pulsação e alternar padrões simples em conjunto.", resource: "Tambor, metrônomo e teclado" },
  { area: "Autonomia", objective: "Estimular a iniciativa na escolha e organização de recursos musicais.", example: "Permitir que o paciente selecione, utilize e guarde instrumentos.", resource: "Instrumentos acessíveis e suportes visuais" },
  { area: "Funções Executivas", objective: "Exercitar flexibilidade cognitiva e controle inibitório com regras musicais.", example: "Alternar sinais de tocar, pausar e mudar andamento.", resource: "Sinais visuais, pandeiro e teclado" },
];

interface Props {
  selected: string[];
  onAdd: (item: CatalogItem) => void;
}

export function PtiObjectiveLibrary({ selected, onAdd }: Props) {
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("Todas");
  const areas = useMemo(() => ["Todas", ...Array.from(new Set(MUSETERA_PTI_CATALOG.map((item) => item.area)))], []);
  const filtered = useMemo(() => MUSETERA_PTI_CATALOG.filter((item) => {
    const matchesArea = area === "Todas" || item.area === area;
    const terms = `${item.area} ${item.objective} ${item.example} ${item.resource}`.toLocaleLowerCase("pt-BR");
    return matchesArea && terms.includes(query.toLocaleLowerCase("pt-BR").trim());
  }), [area, query]);

  return (
    <div className="space-y-3 rounded-xl border border-primary/20 bg-primary/[0.04] p-4">
      <div className="flex items-start gap-2">
        <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div>
          <h3 className="font-semibold">Biblioteca MuseTera de objetivos</h3>
          <p className="text-xs text-muted-foreground">Sugestões editáveis de musicoterapia. Selecione apenas objetivos clinicamente indicados.</p>
        </div>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input aria-label="Buscar objetivo, área ou atividade" className="pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar objetivo, atividade ou instrumento..." />
      </div>
      <div className="flex flex-wrap gap-1.5" aria-label="Filtrar por domínio">
        {areas.map((candidate) => (
          <Button key={candidate} size="sm" type="button" variant={area === candidate ? "default" : "outline"} onClick={() => setArea(candidate)} className="h-8 rounded-full text-xs">{candidate}</Button>
        ))}
      </div>
      <div className="grid gap-2 lg:grid-cols-2">
        {filtered.map((item) => {
          const exists = selected.some((value) => value.trim().toLocaleLowerCase("pt-BR") === item.objective.trim().toLocaleLowerCase("pt-BR"));
          return (
            <div key={item.objective} className="flex flex-col justify-between gap-3 rounded-lg border bg-card p-3">
              <div className="space-y-2">
                <Badge variant="secondary" className="text-xs">{item.area}</Badge>
                <p className="text-sm font-medium">{item.objective}</p>
                <p className="text-xs text-muted-foreground"><strong>Exemplo:</strong> {item.example}</p>
                <p className="text-xs text-muted-foreground"><strong>Recursos:</strong> {item.resource}</p>
              </div>
              <Button type="button" variant={exists ? "secondary" : "outline"} size="sm" disabled={exists} onClick={() => onAdd(item)} className="self-start gap-1.5">
                {exists ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {exists ? "Incluído" : "Adicionar objetivo"}
              </Button>
            </div>
          );
        })}
      </div>
      {filtered.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma sugestão encontrada. Você ainda pode cadastrar objetivos personalizados.</p>}
    </div>
  );
}
