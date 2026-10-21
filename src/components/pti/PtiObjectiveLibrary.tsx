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
const BASE_MUSETERA_PTI_CATALOG: CatalogItem[] = [
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

// Objetivos originais, ilustrativos e editáveis. Não são itens padronizados de avaliação.
const EXTRA_MUSETERA_PTI_OBJECTIVES: CatalogItem[] = [["Comunicação","Ampliar respostas a sinais de início e encerramento musical.","Usar um refrão de abertura e um sinal musical de fechamento.","Voz e pandeiro"],["Comunicação","Facilitar pedidos espontâneos de repetição de experiências musicais.","Interromper brevemente uma canção conhecida, aguardando pedido funcional.","Canções preferidas e cartões"],["Comunicação","Apoiar uso de gestos com significado em cantigas interativas.","Associar gestos simples às palavras-chave do refrão.","Figuras e instrumento harmônico"],["Comunicação","Favorecer identificação auditiva do próprio nome em canções.","Cantar nomes alternados e observar resposta à chamada.","Voz e tambor"],["Comunicação","Estimular comunicação de preferência entre timbres musicais.","Comparar dois sons e solicitar indicação de preferência.","Sinos e chocalhos"],["Comunicação","Desenvolver trocas musicais com pausa e oportunidade de resposta.","Alternar uma frase instrumental e silêncio para resposta.","Teclado e xilofone"],["Linguagem","Apoiar emissão de vogais prolongadas durante vocalizações.","Experimentar glissandos vocais breves com modelagem respeitosa.","Microfone e voz"],["Linguagem","Favorecer imitação de pequenas unidades sonoras e silábicas.","Alternar padrões vocais simples e pausas de resposta.","Voz e cartões silábicos"],["Linguagem","Apoiar associação de palavras funcionais com ações musicais.","Usar canções de pedir, parar, tocar e guardar.","Canções estruturadas"],["Linguagem","Favorecer compreensão de instruções simples em jogos sonoros.","Praticar comandos musicais de uma etapa conforme capacidade.","Tambor e cartões de ação"],["Cognição","Fortalecer discriminação de sons graves e agudos.","Comparar pares de notas com pistas visuais.","Teclado e imagens"],["Cognição","Exercitar memória operacional com sequências rítmicas curtas.","Reproduzir dois ou três padrões conforme desempenho observado.","Claves e tambor"],["Cognição","Aprimorar atenção seletiva diante de diferentes timbres.","Localizar o instrumento-alvo em sequência sonora.","Sinos e percussão"],["Cognição","Estimular antecipação de eventos em canções de rotina.","Usar pausa antes de uma palavra ou gesto esperado.","Voz e cartões"],["Cognição","Exercitar pareamento sonoro em tarefas de escolha.","Associar fontes sonoras semelhantes em atividade guiada.","Pares de chocalhos"],["Cognição","Promover identificação de repetição e contraste musical.","Explorar padrões iguais e diferentes com apoio visual.","Xilofone e cartões"],["Cognição","Apoiar permanência progressiva em tarefa musical.","Estabelecer tempo individualizado para sequência de início, meio e fim.","Cronômetro visual e teclado"],["Cognição","Estimular resolução de problemas na exploração instrumental.","Investigar formas seguras de produzir sons em instrumentos novos.","Instrumentos variados"],["Socialização","Promover alternância de liderança em improvisação coletiva.","Trocar papéis de iniciar, acompanhar e concluir uma improvisação.","Percussão e violão"],["Socialização","Estimular respostas musicais às iniciativas de outra pessoa.","Realizar diálogo de dois instrumentos com turnos claros.","Tambor e xilofone"],["Socialização","Apoiar participação em experiências musicais compartilhadas.","Executar uma canção com papéis complementares.","Boomwhackers"],["Socialização","Favorecer convite musical espontâneo ao interlocutor.","Modelar sinal de chamada e espera antes do dueto.","Microfone e percussão"],["Socialização","Aprimorar cooperação em construção musical de grupo.","Dividir funções de ritmo e melodia com apoio visual.","Teclado, tambor e cartões"],["Socialização","Desenvolver reconhecimento da vez em roda musical.","Usar um objeto sonoro que circula entre participantes.","Chocalho e roda musical"],["Motricidade","Apoiar coordenação óculo-manual durante sequências melódicas.","Tocar notas indicadas visualmente em ordem simples.","Teclado com marcas visuais"],["Motricidade","Favorecer alternância bilateral em atividades de percussão.","Praticar golpes alternados sobre superfícies sonoras.","Tambor e baquetas"],["Motricidade","Estimular sincronização entre movimento e pulsação.","Associar passos ou gestos ao pulso da música.","Caixa de som e percussão"],["Motricidade","Exercitar precisão de movimentos finos com instrumentos.","Explorar acionamento controlado de sinos e teclas.","Sinos e teclado"],["Motricidade","Promover planejamento de gestos em sequências de dois passos.","Executar tocar-parar e tocar-trocar sob pistas musicais.","Pandeiro e cartões de sequência"],["Emocional","Favorecer expressão de preferências emocionais por sons.","Comparar músicas e incentivar relato ou sinalização de estados.","Playlist e pranchas de emoções"],["Emocional","Apoiar transição para estados de menor ativação com música.","Experimentar escuta e respiração no ritmo individual adequado.","Instrumento harmônico e playlist"],["Emocional","Estimular expressão criativa de estados afetivos.","Construir improvisações com contrastes de dinâmica e andamento.","Teclado e instrumentos de percussão"],["Emocional","Favorecer sensação de previsibilidade em intervenções musicais.","Utilizar sequência fixa de abertura, escolha, atividade e encerramento.","Cartões de rotina e voz"],["Sensorial","Estimular discriminação entre timbres de intensidade confortável.","Apresentar timbres controlados e solicitar escolhas.","Instrumentos suaves"],["Sensorial","Favorecer identificação da origem de estímulos sonoros.","Produzir som em posições acessíveis e investigar orientação.","Chocalho e sino"],["Sensorial","Apoiar aceitação gradual de variações sonoras individualizadas.","Apresentar diferenças suaves de intensidade mediante assentimento.","Teclado e controle de volume"],["Musicalidade","Estimular percepção de andamentos lentos e rápidos.","Alternar trechos com sinais de movimento correspondentes.","Tambor e metrônomo"],["Musicalidade","Exercitar organização de frases musicais simples.","Concluir sequências curtas com tônica ou batida final.","Teclado e violão"],["Musicalidade","Favorecer improvisação espontânea com espaço de escolha.","Oferecer dois instrumentos e tempo de criação livre guiada.","Xilofone e tambor"],["Autonomia","Estimular organização do espaço musical ao fim da sessão.","Usar canção de guardar e pistas graduadas.","Caixas de instrumentos e apoio visual"],["Autonomia","Favorecer seleção independente da próxima atividade musical.","Apresentar painel com etapas e permitir escolha assistida.","Agenda visual e instrumentos"],["Funções Executivas","Exercitar controle de impulsos em brincadeiras de pausa musical.","Alternar tocar e parar com sinais previamente combinados.","Percussão e sinal visual"],["Funções Executivas","Estimular adaptação a pequenas mudanças em padrões rítmicos.","Propor alteração previamente indicada e observar necessidade de apoio.","Claves, tambor e cartões"]] .map(([area, objective, example, resource]) => ({ area, objective, example, resource }));
export const MUSETERA_PTI_CATALOG: CatalogItem[] = [...BASE_MUSETERA_PTI_CATALOG, ...EXTRA_MUSETERA_PTI_OBJECTIVES];

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
