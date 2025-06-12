
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Music } from "lucide-react";
import GuitarHeroGame from "../guitar-hero/components/GuitarHeroGame";
import { playNoteSound } from "@/utils/audioUtils";

type InstrumentType = "bell" | "xylophone" | "keyboard";

interface Song {
  id: string;
  title: string;
  artist: string;
  difficulty: "Fácil" | "Médio" | "Difícil";
  instrument: InstrumentType;
  color: string;
  category: "infantil" | "clássico" | "brasileiro" | "terapêutico" | "desenhos";
  therapeuticBenefits: string;
}

const TeaHero = () => {
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");

  // Catálogo reorganizado e balanceado de músicas específicas para TEA
  const songs: Song[] = [
    // MÚSICAS FÁCEIS - SINO (6 músicas)
    {
      id: "twinkle-bell",
      title: "Brilha, Brilha Estrelinha",
      artist: "Clássico Infantil",
      difficulty: "Fácil",
      instrument: "bell",
      color: "bg-red-100 border-red-200",
      category: "infantil",
      therapeuticBenefits: "Estimula coordenação básica e reconhecimento de padrões simples"
    },
    {
      id: "mary-lamb-bell",
      title: "Maria, Maria",
      artist: "Infantil",
      difficulty: "Fácil",
      instrument: "bell",
      color: "bg-red-100 border-red-200",
      category: "infantil",
      therapeuticBenefits: "Desenvolve sequenciamento e memória auditiva"
    },
    {
      id: "ciranda-bell",
      title: "Ciranda, Cirandinha",
      artist: "Folclore Brasileiro",
      difficulty: "Fácil",
      instrument: "bell",
      color: "bg-red-100 border-red-200",
      category: "brasileiro",
      therapeuticBenefits: "Promove integração social e cultural brasileira"
    },
    {
      id: "galinha-pintadinha-bell",
      title: "Galinha Pintadinha",
      artist: "Desenho Animado",
      difficulty: "Fácil",
      instrument: "bell",
      color: "bg-red-100 border-red-200",
      category: "desenhos",
      therapeuticBenefits: "Estimula atenção e engagement através de personagem familiar"
    },
    {
      id: "borboletinha-bell",
      title: "Borboletinha",
      artist: "Infantil Brasileiro",
      difficulty: "Fácil",
      instrument: "bell",
      color: "bg-red-100 border-red-200",
      category: "brasileiro",
      therapeuticBenefits: "Desenvolve motricidade fina e ritmo básico"
    },
    {
      id: "atirei-pau-bell",
      title: "Atirei o Pau no Gato",
      artist: "Tradicional",
      difficulty: "Fácil",
      instrument: "bell",
      color: "bg-red-100 border-red-200",
      category: "brasileiro",
      therapeuticBenefits: "Trabalha coordenação e sequenciamento motor"
    },

    // MÚSICAS FÁCEIS - XILOFONE (6 músicas)
    {
      id: "happy-birthday-xylophone",
      title: "Parabéns para Você",
      artist: "Tradicional",
      difficulty: "Fácil",
      instrument: "xylophone",
      color: "bg-blue-100 border-blue-200",
      category: "infantil",
      therapeuticBenefits: "Conecta música com eventos sociais importantes"
    },
    {
      id: "xuxa-xylophone",
      title: "Ilariê (Xuxa)",
      artist: "Xuxa",
      difficulty: "Fácil",
      instrument: "xylophone",
      color: "bg-blue-100 border-blue-200",
      category: "desenhos",
      therapeuticBenefits: "Estimula expressão corporal e alegria"
    },
    {
      id: "sapo-nao-lava-xylophone",
      title: "O Sapo Não Lava o Pé",
      artist: "Infantil",
      difficulty: "Fácil",
      instrument: "xylophone",
      color: "bg-blue-100 border-blue-200",
      category: "brasileiro",
      therapeuticBenefits: "Desenvolve consciência corporal e higiene"
    },
    {
      id: "peppa-pig-xylophone",
      title: "Peppa Pig Theme",
      artist: "Desenho Animado",
      difficulty: "Fácil",
      instrument: "xylophone",
      color: "bg-blue-100 border-blue-200",
      category: "desenhos",
      therapeuticBenefits: "Trabalha familiaridade e conforto através de personagem conhecido"
    },
    {
      id: "escravos-jo-xylophone",
      title: "Escravos de Jó",
      artist: "Folclore",
      difficulty: "Fácil",
      instrument: "xylophone",
      color: "bg-blue-100 border-blue-200",
      category: "brasileiro",
      therapeuticBenefits: "Estimula coordenação bilateral e sequenciamento"
    },
    {
      id: "jingle-bells-xylophone",
      title: "Jingle Bells",
      artist: "Natal",
      difficulty: "Fácil",
      instrument: "xylophone",
      color: "bg-blue-100 border-blue-200",
      category: "infantil",
      therapeuticBenefits: "Conecta com eventos sazonais e tradições"
    },

    // MÚSICAS FÁCEIS - TECLADO (6 músicas)
    {
      id: "scale-keyboard",
      title: "Escala de Dó Maior",
      artist: "Exercício Musical",
      difficulty: "Fácil",
      instrument: "keyboard",
      color: "bg-green-100 border-green-200",
      category: "terapêutico",
      therapeuticBenefits: "Desenvolve sequenciamento e organização mental"
    },
    {
      id: "hot-cross-keyboard",
      title: "Três Notas Mágicas",
      artist: "Terapêutico",
      difficulty: "Fácil",
      instrument: "keyboard",
      color: "bg-green-100 border-green-200",
      category: "terapêutico",
      therapeuticBenefits: "Estimula foco e concentração através da simplicidade"
    },
    {
      id: "frozen-keyboard",
      title: "Let It Go (Simplificada)",
      artist: "Frozen",
      difficulty: "Fácil",
      instrument: "keyboard",
      color: "bg-green-100 border-green-200",
      category: "desenhos",
      therapeuticBenefits: "Trabalha expressão emocional e autoestima"
    },
    {
      id: "aquarela-keyboard",
      title: "Aquarela",
      artist: "Toquinho",
      difficulty: "Fácil",
      instrument: "keyboard",
      color: "bg-green-100 border-green-200",
      category: "brasileiro",
      therapeuticBenefits: "Estimula criatividade e imaginação"
    },
    {
      id: "caranguejo-keyboard",
      title: "Caranguejo",
      artist: "Folclore",
      difficulty: "Fácil",
      instrument: "keyboard",
      color: "bg-green-100 border-green-200",
      category: "brasileiro",
      therapeuticBenefits: "Desenvolve conhecimento sobre natureza e animais"
    },
    {
      id: "paw-patrol-keyboard",
      title: "Patrulha Canina",
      artist: "Desenho Animado",
      difficulty: "Fácil",
      instrument: "keyboard",
      color: "bg-green-100 border-green-200",
      category: "desenhos",
      therapeuticBenefits: "Promove trabalho em equipe e resolução de problemas"
    },

    // MÚSICAS MÉDIAS - SINO (6 músicas)
    {
      id: "frere-jacques-bell",
      title: "Frère Jacques",
      artist: "Tradicional",
      difficulty: "Médio",
      instrument: "bell",
      color: "bg-red-100 border-red-200",
      category: "clássico",
      therapeuticBenefits: "Desenvolve memória sequencial e padrões repetitivos"
    },
    {
      id: "asa-branca-bell",
      title: "Asa Branca",
      artist: "Luiz Gonzaga",
      difficulty: "Médio",
      instrument: "bell",
      color: "bg-red-100 border-red-200",
      category: "brasileiro",
      therapeuticBenefits: "Conecta com cultura nordestina e geografia brasileira"
    },
    {
      id: "sitio-lobato-bell",
      title: "Sítio do Pica-Pau Amarelo",
      artist: "Globo",
      difficulty: "Médio",
      instrument: "bell",
      color: "bg-red-100 border-red-200",
      category: "desenhos",
      therapeuticBenefits: "Estimula imaginação e literatura brasileira"
    },
    {
      id: "pink-panther-bell",
      title: "Pantera Cor-de-Rosa",
      artist: "Desenho Clássico",
      difficulty: "Médio",
      instrument: "bell",
      color: "bg-red-100 border-red-200",
      category: "desenhos",
      therapeuticBenefits: "Trabalha reconhecimento de melodias marcantes"
    },
    {
      id: "capelinha-bell",
      title: "Capelinha de Melão",
      artist: "Festa Junina",
      difficulty: "Médio",
      instrument: "bell",
      color: "bg-red-100 border-red-200",
      category: "brasileiro",
      therapeuticBenefits: "Conecta com tradições e festividades brasileiras"
    },
    {
      id: "amazing-grace-bell",
      title: "Amazing Grace",
      artist: "Espiritual",
      difficulty: "Médio",
      instrument: "bell",
      color: "bg-red-100 border-red-200",
      category: "clássico",
      therapeuticBenefits: "Promove calma e introspecção"
    },

    // MÚSICAS MÉDIAS - XILOFONE (6 músicas)
    {
      id: "ode-joy-xylophone",
      title: "Ode à Alegria",
      artist: "Beethoven",
      difficulty: "Médio",
      instrument: "xylophone",
      color: "bg-blue-100 border-blue-200",
      category: "clássico",
      therapeuticBenefits: "Estimula apreciação da música clássica e grandiosidade"
    },
    {
      id: "chaves-xylophone",
      title: "Tema do Chaves",
      artist: "Chespirito",
      difficulty: "Médio",
      instrument: "xylophone",
      color: "bg-blue-100 border-blue-200",
      category: "desenhos",
      therapeuticBenefits: "Conecta com humor e nostalgia familiar"
    },
    {
      id: "garota-ipanema-xylophone",
      title: "Garota de Ipanema (Simplificada)",
      artist: "Tom Jobim",
      difficulty: "Médio",
      instrument: "xylophone",
      color: "bg-blue-100 border-blue-200",
      category: "brasileiro",
      therapeuticBenefits: "Introduz bossa nova e sofisticação musical"
    },
    {
      id: "danny-boy-xylophone",
      title: "Danny Boy",
      artist: "Irlandesa",
      difficulty: "Médio",
      instrument: "xylophone",
      color: "bg-blue-100 border-blue-200",
      category: "clássico",
      therapeuticBenefits: "Desenvolve expressão emocional profunda"
    },
    {
      id: "turma-monica-xylophone",
      title: "Turma da Mônica",
      artist: "Maurício de Sousa",
      difficulty: "Médio",
      instrument: "xylophone",
      color: "bg-blue-100 border-blue-200",
      category: "desenhos",
      therapeuticBenefits: "Estimula criatividade e narrativa brasileira"
    },
    {
      id: "cai-cai-balao-xylophone",
      title: "Cai, Cai, Balão",
      artist: "Festa Junina",
      difficulty: "Médio",
      instrument: "xylophone",
      color: "bg-blue-100 border-blue-200",
      category: "brasileiro",
      therapeuticBenefits: "Trabalha coordenação e festividades tradicionais"
    },

    // MÚSICAS MÉDIAS - TECLADO (6 músicas)
    {
      id: "moonlight-keyboard",
      title: "Sonata ao Luar (Tema)",
      artist: "Beethoven",
      difficulty: "Médio",
      instrument: "keyboard",
      color: "bg-green-100 border-green-200",
      category: "clássico",
      therapeuticBenefits: "Promove relaxamento e concentração profunda"
    },
    {
      id: "moana-keyboard",
      title: "Moana - Oceania",
      artist: "Disney",
      difficulty: "Médio",
      instrument: "keyboard",
      color: "bg-green-100 border-green-200",
      category: "desenhos",
      therapeuticBenefits: "Estimula coragem e autodescoberta"
    },
    {
      id: "bach-minuet-keyboard",
      title: "Minueto em Sol",
      artist: "Bach",
      difficulty: "Médio",
      instrument: "keyboard",
      color: "bg-green-100 border-green-200",
      category: "clássico",
      therapeuticBenefits: "Desenvolve estrutura e organização mental"
    },
    {
      id: "country-roads-keyboard",
      title: "Country Roads",
      artist: "John Denver",
      difficulty: "Médio",
      instrument: "keyboard",
      color: "bg-green-100 border-green-200",
      category: "clássico",
      therapeuticBenefits: "Conecta com natureza e tranquilidade"
    },
    {
      id: "peixe-vivo-keyboard",
      title: "Peixe Vivo",
      artist: "Folclore",
      difficulty: "Médio",
      instrument: "keyboard",
      color: "bg-green-100 border-green-200",
      category: "brasileiro",
      therapeuticBenefits: "Estimula conexão com natureza aquática"
    },
    {
      id: "toy-story-keyboard",
      title: "You've Got a Friend (Toy Story)",
      artist: "Pixar",
      difficulty: "Médio",
      instrument: "keyboard",
      color: "bg-green-100 border-green-200",
      category: "desenhos",
      therapeuticBenefits: "Trabalha amizade e lealdade"
    },

    // MÚSICAS DIFÍCEIS - SINO (6 músicas)
    {
      id: "william-tell-bell",
      title: "Guilherme Tell",
      artist: "Rossini",
      difficulty: "Difícil",
      instrument: "bell",
      color: "bg-red-100 border-red-200",
      category: "clássico",
      therapeuticBenefits: "Desenvolve coordenação avançada e perseverança"
    },
    {
      id: "carmen-bell",
      title: "Carmen - Habanera",
      artist: "Bizet",
      difficulty: "Difícil",
      instrument: "bell",
      color: "bg-red-100 border-red-200",
      category: "clássico",
      therapeuticBenefits: "Estimula expressão dramática e emocional"
    },
    {
      id: "pirates-bell",
      title: "Piratas do Caribe",
      artist: "Hans Zimmer",
      difficulty: "Difícil",
      instrument: "bell",
      color: "bg-red-100 border-red-200",
      category: "desenhos",
      therapeuticBenefits: "Trabalha aventura e determinação"
    },
    {
      id: "aquarela-complexa-bell",
      title: "Aquarela do Brasil",
      artist: "Ary Barroso",
      difficulty: "Difícil",
      instrument: "bell",
      color: "bg-red-100 border-red-200",
      category: "brasileiro",
      therapeuticBenefits: "Conecta com identidade nacional complexa"
    },
    {
      id: "carnival-bell",
      title: "Carnaval de Veneza",
      artist: "Clássico",
      difficulty: "Difícil",
      instrument: "bell",
      color: "bg-red-100 border-red-200",
      category: "clássico",
      therapeuticBenefits: "Desenvolve agilidade mental e festa"
    },
    {
      id: "star-wars-bell",
      title: "Star Wars - Tema Principal",
      artist: "John Williams",
      difficulty: "Difícil",
      instrument: "bell",
      color: "bg-red-100 border-red-200",
      category: "desenhos",
      therapeuticBenefits: "Estimula imaginação épica e heroísmo"
    },

    // MÚSICAS DIFÍCEIS - XILOFONE (6 músicas)
    {
      id: "turkish-march-xylophone",
      title: "Marcha Turca",
      artist: "Mozart",
      difficulty: "Difícil",
      instrument: "xylophone",
      color: "bg-blue-100 border-blue-200",
      category: "clássico",
      therapeuticBenefits: "Desenvolve velocidade e precisão mental"
    },
    {
      id: "spring-vivaldi-xylophone",
      title: "Primavera (Vivaldi)",
      artist: "Vivaldi",
      difficulty: "Difícil",
      instrument: "xylophone",
      color: "bg-blue-100 border-blue-200",
      category: "clássico",
      therapeuticBenefits: "Conecta com estações e renovação"
    },
    {
      id: "choro-xylophone",
      title: "Tico-Tico no Fubá",
      artist: "Zequinha de Abreu",
      difficulty: "Difícil",
      instrument: "xylophone",
      color: "bg-blue-100 border-blue-200",
      category: "brasileiro",
      therapeuticBenefits: "Estimula agilidade e música instrumental brasileira"
    },
    {
      id: "incredibles-xylophone",
      title: "Os Incríveis",
      artist: "Michael Giacchino",
      difficulty: "Difícil",
      instrument: "xylophone",
      color: "bg-blue-100 border-blue-200",
      category: "desenhos",
      therapeuticBenefits: "Trabalha superpoderes e autoconfiança"
    },
    {
      id: "hungarian-dance-xylophone",
      title: "Dança Húngara No. 5",
      artist: "Brahms",
      difficulty: "Difícil",
      instrument: "xylophone",
      color: "bg-blue-100 border-blue-200",
      category: "clássico",
      therapeuticBenefits: "Desenvolve ritmo complexo e energia"
    },
    {
      id: "beatles-xylophone",
      title: "Yesterday",
      artist: "The Beatles",
      difficulty: "Difícil",
      instrument: "xylophone",
      color: "bg-blue-100 border-blue-200",
      category: "clássico",
      therapeuticBenefits: "Estimula nostalgia e melancolia controlada"
    },

    // MÚSICAS DIFÍCEIS - TECLADO (6 músicas)
    {
      id: "fur-elise-keyboard",
      title: "Para Elisa",
      artist: "Beethoven",
      difficulty: "Difícil",
      instrument: "keyboard",
      color: "bg-green-100 border-green-200",
      category: "clássico",
      therapeuticBenefits: "Desenvolve delicadeza e expressão refinada"
    },
    {
      id: "claire-de-lune-keyboard",
      title: "Claire de Lune",
      artist: "Debussy",
      difficulty: "Difícil",
      instrument: "keyboard",
      color: "bg-green-100 border-green-200",
      category: "clássico",
      therapeuticBenefits: "Promove tranquilidade noturna e contemplação"
    },
    {
      id: "chopin-minute-keyboard",
      title: "Valsa do Minuto",
      artist: "Chopin",
      difficulty: "Difícil",
      instrument: "keyboard",
      color: "bg-green-100 border-green-200",
      category: "clássico",
      therapeuticBenefits: "Estimula velocidade controlada e elegância"
    },
    {
      id: "casa-papel-keyboard",
      title: "Bella Ciao",
      artist: "Tradicional Italiana",
      difficulty: "Difícil",
      instrument: "keyboard",
      color: "bg-green-100 border-green-200",
      category: "clássico",
      therapeuticBenefits: "Trabalha resistência e determinação"
    },
    {
      id: "lion-king-keyboard",
      title: "Circle of Life",
      artist: "Disney",
      difficulty: "Difícil",
      instrument: "keyboard",
      color: "bg-green-100 border-green-200",
      category: "desenhos",
      therapeuticBenefits: "Conecta com ciclo da vida e propósito"
    },
    {
      id: "samba-keyboard",
      title: "Águas de Março",
      artist: "Tom Jobim",
      difficulty: "Difícil",
      instrument: "keyboard",
      color: "bg-green-100 border-green-200",
      category: "brasileiro",
      therapeuticBenefits: "Desenvolve complexidade rítmica brasileira"
    }
  ];

  const categories = [
    { value: "todos", label: "Todas as Categorias" },
    { value: "infantil", label: "Infantil" },
    { value: "clássico", label: "Clássico" },
    { value: "brasileiro", label: "Brasileiro" },
    { value: "terapêutico", label: "Terapêutico" },
    { value: "desenhos", label: "Desenhos/Filmes" }
  ];

  const filteredSongs = selectedCategory === "todos" 
    ? songs 
    : songs.filter(song => song.category === selectedCategory);

  const handleNotePlay = (frequency: number, color: string) => {
    playNoteSound(`${frequency}Hz`);
    
    const instrumentEmoji = selectedSong?.instrument === "bell" ? "🔔" : 
                           selectedSong?.instrument === "xylophone" ? "🎵" : "🎹";
    
    console.log(`${instrumentEmoji} ${selectedSong?.instrument} tocado: ${frequency}Hz (${color})`);
  };

  const handleSongSelect = (song: Song) => {
    setSelectedSong(song);
    setGameStarted(false);
  };

  const handleStartGame = () => {
    if (selectedSong) {
      setGameStarted(true);
    }
  };

  const handleBackToSelection = () => {
    setSelectedSong(null);
    setGameStarted(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Fácil": return "bg-green-100 text-green-800";
      case "Médio": return "bg-yellow-100 text-yellow-800";
      case "Difícil": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getInstrumentIcon = (instrument: InstrumentType) => {
    switch (instrument) {
      case "bell": return "🔔";
      case "xylophone": return "🎵";
      case "keyboard": return "🎹";
      default: return "🎵";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "infantil": return "👶";
      case "clássico": return "🎼";
      case "brasileiro": return "🇧🇷";
      case "terapêutico": return "🧘";
      case "desenhos": return "🎬";
      default: return "🎵";
    }
  };

  if (gameStarted && selectedSong) {
    return (
      <div className="h-screen flex flex-col">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            TEA-Hero - {selectedSong.title} {getInstrumentIcon(selectedSong.instrument)}
          </h1>
          <Button onClick={handleBackToSelection} variant="secondary" size="sm">
            Voltar ao Menu
          </Button>
        </div>
        <GuitarHeroGame 
          instrumentType={selectedSong.instrument} 
          onNotePlay={handleNotePlay}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            TEA-Hero 🎵
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Música Terapêutica para Transtorno do Espectro Autista
          </p>
          <p className="text-sm text-gray-500">
            {filteredSongs.length} músicas disponíveis • Especialmente selecionadas para desenvolvimento cognitivo e sensorial
          </p>
        </div>

        {/* Filtro por Categoria */}
        <div className="mb-6 flex justify-center">
          <div className="bg-white rounded-lg p-4 shadow-md">
            <h3 className="text-sm font-medium text-gray-700 mb-3 text-center">Filtrar por Categoria</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                  className="text-xs"
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {!selectedSong ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredSongs.map((song) => (
              <Card 
                key={song.id}
                className={`cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 ${song.color} border-2`}
                onClick={() => handleSongSelect(song)}
              >
                <CardHeader className="text-center pb-2">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-2xl">{getCategoryIcon(song.category)}</div>
                    <div className="text-3xl">{getInstrumentIcon(song.instrument)}</div>
                  </div>
                  <CardTitle className="text-base leading-tight">{song.title}</CardTitle>
                  <p className="text-xs text-gray-600">{song.artist}</p>
                </CardHeader>
                <CardContent className="text-center space-y-2">
                  <div className="flex justify-center items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(song.difficulty)}`}>
                      {song.difficulty}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">
                      {song.instrument === "bell" ? "Sino" : 
                       song.instrument === "xylophone" ? "Xilofone" : "Teclado"}
                    </span>
                  </div>
                  
                  <div className="bg-blue-50 p-2 rounded text-xs text-blue-800 mb-2">
                    <strong>Benefício:</strong> {song.therapeuticBenefits}
                  </div>

                  <Button size="sm" className="w-full">
                    <Play className="w-3 h-3 mr-1" />
                    Jogar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <Card className="mb-6 border-2 border-purple-200">
              <CardHeader className="text-center">
                <div className="flex justify-center items-center space-x-4 mb-4">
                  <div className="text-4xl">{getCategoryIcon(selectedSong.category)}</div>
                  <div className="text-6xl">{getInstrumentIcon(selectedSong.instrument)}</div>
                </div>
                <CardTitle className="text-2xl">{selectedSong.title}</CardTitle>
                <p className="text-lg text-gray-600">{selectedSong.artist}</p>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="flex justify-center items-center space-x-4 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedSong.difficulty)}`}>
                    Dificuldade: {selectedSong.difficulty}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 capitalize">
                    {selectedSong.category}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 capitalize">
                    {selectedSong.instrument === "bell" ? "Sino" : 
                     selectedSong.instrument === "xylophone" ? "Xilofone" : "Teclado"}
                  </span>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-purple-800 mb-2">
                    🧠 Benefícios Terapêuticos:
                  </h4>
                  <p className="text-sm text-purple-700">
                    {selectedSong.therapeuticBenefits}
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800 mb-2">
                    <strong>Como jogar:</strong>
                  </p>
                  <p className="text-sm text-blue-700">
                    Use as teclas <strong>1-7</strong> para tocar as notas quando elas passarem pela zona dourada!
                    Esta música foi especialmente selecionada para estimular seu desenvolvimento.
                  </p>
                </div>

                <div className="flex space-x-3 justify-center">
                  <Button onClick={handleBackToSelection} variant="outline">
                    Escolher Outra Música
                  </Button>
                  <Button onClick={handleStartGame} size="lg" className="bg-purple-600 hover:bg-purple-700">
                    <Play className="w-5 h-5 mr-2" />
                    Começar Terapia Musical
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="mt-8 text-center">
          <div className="bg-white rounded-lg p-6 shadow-md max-w-4xl mx-auto">
            <h3 className="text-lg font-medium text-gray-800 mb-3">
              🎯 Sobre o TEA-Hero
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              O TEA-Hero foi desenvolvido especificamente para pessoas com Transtorno do Espectro Autista,
              utilizando música como ferramenta terapêutica para estimular desenvolvimento cognitivo,
              coordenação motora, memória sequencial e integração sensorial.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-green-50 p-3 rounded">
                <strong className="text-green-800">🟢 Fácil:</strong>
                <p className="text-green-700">3-4 notas, ritmo simples, melodias familiares</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded">
                <strong className="text-yellow-800">🟡 Médio:</strong>
                <p className="text-yellow-700">5-6 notas, ritmo moderado, pequenas variações</p>
              </div>
              <div className="bg-red-50 p-3 rounded">
                <strong className="text-red-800">🔴 Difícil:</strong>
                <p className="text-red-700">7+ notas, ritmos complexos, melodias elaboradas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeaHero;
