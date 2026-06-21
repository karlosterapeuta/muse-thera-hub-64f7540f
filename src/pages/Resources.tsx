import { useState } from "react";
import { Link } from "react-router-dom";
import {
  RefreshCw,
  Maximize2,
  Minimize2,
  ArrowLeft,
  Search,
  Bell,
  Music,
  Music2,
  Music4,
  Piano,
  Guitar,
  Volume2,
  Waves,
  Gamepad2,
  PaintBucket,
  Headphones,
  Sparkles,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type GameCategory = "Ritmo & Melodia" | "Instrumentos" | "Estimulação" | "Criação";

interface GameItem {
  title: string;
  description: string;
  to: string;
  icon: LucideIcon;
  gradient: string;
  category: GameCategory;
  tags?: string[];
}

const games: GameItem[] = [
  {
    title: "Sinos Musicais",
    description: "Toque músicas com sinos coloridos e partitura visual guiada.",
    to: "/musical-bells",
    icon: Bell,
    gradient: "from-rose-500 to-orange-500",
    category: "Instrumentos",
    tags: ["TEA", "Cores"],
  },
  {
    title: "Bell Hero",
    description: "Jogo rítmico de sinos no estilo Guitar Hero, otimizado para TEA.",
    to: "/bell-hero",
    icon: Music,
    gradient: "from-amber-500 to-yellow-500",
    category: "Ritmo & Melodia",
    tags: ["TEA", "Ritmo"],
  },
  {
    title: "TEA Hero",
    description: "Melodias 100% sincronizadas visual-auditivas validadas para TEA.",
    to: "/tea-hero",
    icon: Sparkles,
    gradient: "from-violet-500 to-purple-600",
    category: "Ritmo & Melodia",
    tags: ["TEA", "Sincronia"],
  },
  {
    title: "Guitar / Xilofone Hero",
    description: "Sequências rítmicas no xilofone com feedback visual e sonoro.",
    to: "/xylophone-hero",
    icon: Piano,
    gradient: "from-sky-500 to-blue-600",
    category: "Ritmo & Melodia",
    tags: ["Ritmo"],
  },
  {
    title: "Boomwhacker Hero",
    description: "Toque tubos coloridos no ritmo certo e crie melodias divertidas.",
    to: "/boomwhacker-hero",
    icon: Gamepad2,
    gradient: "from-fuchsia-500 to-pink-600",
    category: "Ritmo & Melodia",
    tags: ["Cores", "Ritmo"],
  },
  {
    title: "Orquestra Animal",
    description: "Clique nos bichinhos para descobrir instrumentos da orquestra.",
    to: "/orquestra-animal",
    icon: Music2,
    gradient: "from-orange-500 to-pink-600",
    category: "Estimulação",
    tags: ["Infantil", "Descoberta"],
  },
  {
    title: "Dino Ritmos",
    description: "Música, ritmo e diversão com dinossauros — com modo calmo.",
    to: "/dino-ritmos",
    icon: Music4,
    gradient: "from-purple-500 to-pink-500",
    category: "Estimulação",
    tags: ["Infantil", "Modo Calmo"],
  },
  {
    title: "Musicograma",
    description: "Visualize a estrutura musical em tempo real para escuta ativa.",
    to: "/musicogram",
    icon: Volume2,
    gradient: "from-teal-500 to-cyan-600",
    category: "Estimulação",
    tags: ["Escuta"],
  },
  {
    title: "Frequências Binaurais",
    description: "Sons binaurais para relaxamento, foco e regulação sensorial.",
    to: "/binaural-frequencies",
    icon: Waves,
    gradient: "from-emerald-500 to-green-600",
    category: "Estimulação",
    tags: ["Relaxamento"],
  },
  {
    title: "Compositor Musical",
    description: "Crie e edite suas próprias melodias de forma livre e intuitiva.",
    to: "/music-composer",
    icon: Music2,
    gradient: "from-indigo-500 to-violet-600",
    category: "Criação",
    tags: ["Criação"],
  },
  {
    title: "Canções",
    description: "Biblioteca de canções com partituras e recursos para sessões.",
    to: "/songs",
    icon: Headphones,
    gradient: "from-blue-500 to-indigo-600",
    category: "Criação",
    tags: ["Repertório"],
  },
  {
    title: "Sprunki Musical",
    description: "Crie batidas arrastando personagens — criatividade musical livre.",
    to: "/sprunki",
    icon: PaintBucket,
    gradient: "from-cyan-500 to-sky-600",
    category: "Criação",
    tags: ["Criação"],
  },
  {
    title: "Chrome Music Lab",
    description: "Experimentos musicais interativos para explorar sons e ritmos.",
    to: "/chrome-music-lab",
    icon: Guitar,
    gradient: "from-yellow-500 to-amber-600",
    category: "Criação",
    tags: ["Experimentos"],
  },
];

const categories: GameCategory[] = [
  "Ritmo & Melodia",
  "Instrumentos",
  "Estimulação",
  "Criação",
];

const EXTERNAL_ACTIVITIES_URL = "https://image-replica-system.onrender.com/";

const Resources = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<GameCategory | "Todos">("Todos");
  const [showActivities, setShowActivities] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleLoad = () => setIsLoading(false);

  const handleRefresh = () => {
    setIsLoading(true);
    const iframe = document.getElementById("resources-iframe") as HTMLIFrameElement | null;
    if (iframe) iframe.src = iframe.src;
  };

  const openActivities = () => {
    setShowActivities(true);
    setIsLoading(true);
  };

  const filtered = games.filter((g) => {
    const matchesCategory = activeCategory === "Todos" || g.category === activeCategory;
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      g.title.toLowerCase().includes(q) ||
      g.description.toLowerCase().includes(q) ||
      g.tags?.some((t) => t.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  // ---- External activities embed view ----
  if (showActivities) {
    return (
      <div className={`flex flex-col ${isFullscreen ? "fixed inset-0 z-50 bg-background" : "h-full"}`}>
        <div className="flex items-center justify-between gap-2 px-4 py-3 border-b bg-card">
          <div className="flex items-center gap-3 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowActivities(false);
                setIsFullscreen(false);
              }}
              className="gap-2 shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Voltar</span>
            </Button>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-semibold text-foreground truncate">
                Atividades Terapêuticas
              </h1>
              <p className="hidden sm:block text-xs text-muted-foreground truncate">
                Coordenação motora, memória e cognição
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Atualizar</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen((v) => !v)}
              className="gap-2"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              <span className="hidden sm:inline">{isFullscreen ? "Sair" : "Tela Cheia"}</span>
            </Button>
          </div>
        </div>

        <div className="relative flex-1 w-full">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Skeleton className="w-16 h-16 rounded-full" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Carregando atividades...</p>
              </div>
            </div>
          )}
          <iframe
            id="resources-iframe"
            src={EXTERNAL_ACTIVITIES_URL}
            className="w-full h-full border-0"
            style={{ minHeight: isFullscreen ? "100vh" : "calc(100vh - 140px)" }}
            title="Atividades Terapêuticas MuseTera"
            onLoad={handleLoad}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  // ---- Hub view ----
  return (
    <div className="relative min-h-full overflow-hidden">
      {/* Decorative orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-10 right-0 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-pink-500/10 blur-3xl" />
      </div>

      <div className="relative px-4 sm:px-6 py-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30 shrink-0">
            <Gamepad2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Recursos & Jogos</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Ferramentas musicais interativas para estimular pacientes em sessões individuais ou em grupo.
            </p>
          </div>
        </div>

        {/* External activities highlight */}
        <button
          onClick={openActivities}
          className="group mb-6 w-full text-left rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-purple-500/5 to-pink-500/10 p-4 sm:p-5 transition-all hover:border-primary/40 hover:shadow-lg"
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl sm:text-4xl shrink-0">🤸</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-semibold text-foreground">
                  Atividades Terapêuticas
                </h2>
                <Badge variant="secondary" className="gap-1">
                  <ExternalLink className="h-3 w-3" /> Plataforma estendida
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Bolhas Musicais, Pintura Sonora, Quiz Musical e mais — coordenação motora, memória e cognição.
              </p>
            </div>
            <ArrowLeft className="h-5 w-5 text-muted-foreground rotate-180 transition-transform group-hover:translate-x-1 shrink-0" />
          </div>
        </button>

        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar jogo ou ferramenta..."
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {(["Todos", ...categories] as const).map((cat) => (
              <Button
                key={cat}
                size="sm"
                variant={activeCategory === cat ? "default" : "outline"}
                onClick={() => setActiveCategory(cat)}
                className="shrink-0 rounded-full"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Games grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            Nenhum jogo encontrado para "{search}".
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((game) => {
              const Icon = game.icon;
              return (
                <Link
                  key={game.to}
                  to={game.to}
                  className="group relative flex flex-col rounded-2xl border bg-card/80 backdrop-blur-sm p-5 transition-all hover:-translate-y-1 hover:shadow-xl hover:border-primary/30"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${game.gradient} text-white shadow-md mb-3`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-foreground">{game.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 flex-1">{game.description}</p>
                  {game.tags && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {game.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-0">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <span className="absolute right-4 top-5 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5">
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;
