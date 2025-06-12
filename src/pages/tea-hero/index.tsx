import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Music } from "lucide-react";
import GuitarHeroGame from "../guitar-hero/components/GuitarHeroGame";
import { playNoteSound } from "@/utils/audioUtils";
import { MusicalSong } from "@/types/musicTypes";
import { getSequenceForSong } from "@/data/musicalSequences";

type InstrumentType = "bell" | "xylophone" | "keyboard";

const TeaHero = () => {
  const [selectedSong, setSelectedSong] = useState<MusicalSong | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");

  // Catálogo reorganizado e balanceado de músicas específicas para TEA com sequências musicais
  const songs: MusicalSong[] = [
    // MÚSICAS FÁCEIS - SINO (6 músicas)
    {
      id: "twinkle-bell",
      title: "Brilha, Brilha Estrelinha",
      artist: "Clássico Infantil",
      difficulty: "Fácil",
      instrument: "bell",
      color: "bg-red-100 border-red-200",
      category: "infantil",
      therapeuticBenefits: "Estimula coordenação básica e reconhecimento de padrões simples",
      noteSequence: getSequenceForSong("twinkle-bell") || {
        notes: [],
        bpm: 90,
        timeSignature: "4/4",
        key: "C"
      }
    },
    {
      id: "mary-lamb-bell",
      title: "Maria, Maria",
      artist: "Infantil",
      difficulty: "Fácil",
      instrument: "bell",
      color: "bg-red-100 border-red-200",
      category: "infantil",
      therapeuticBenefits: "Desenvolve sequenciamento e memória auditiva",
      noteSequence: getSequenceForSong("mary-lamb-bell") || {
        notes: [],
        bpm: 100,
        timeSignature: "4/4",
        key: "C"
      }
    },
    {
      id: "ciranda-bell",
      title: "Ciranda, Cirandinha",
      artist: "Folclore Brasileiro",
      difficulty: "Fácil",
      instrument: "bell",
      color: "bg-red-100 border-red-200",
      category: "brasileiro",
      therapeuticBenefits: "Promove integração social e cultural brasileira",
      noteSequence: getSequenceForSong("ciranda-bell") || {
        notes: [],
        bpm: 110,
        timeSignature: "2/4",
        key: "C"
      }
    },
    {
      id: "galinha-pintadinha-bell",
      title: "Galinha Pintadinha",
      artist: "Desenho Animado",
      difficulty: "Fácil",
      instrument: "bell",
      color: "bg-red-100 border-red-200",
      category: "desenhos",
      therapeuticBenefits: "Estimula atenção e engagement através de personagem familiar",
      noteSequence: getSequenceForSong("galinha-pintadinha-bell") || {
        notes: [],
        bpm: 120,
        timeSignature: "4/4",
        key: "C"
      }
    },
    {
      id: "borboletinha-bell",
      title: "Borboletinha",
      artist: "Infantil Brasileiro",
      difficulty: "Fácil",
      instrument: "bell",
      color: "bg-red-100 border-red-200",
      category: "brasileiro",
      therapeuticBenefits: "Desenvolve motricidade fina e ritmo básico",
      noteSequence: getSequenceForSong("borboletinha-bell") || {
        notes: [],
        bpm: 100,
        timeSignature: "2/4",
        key: "C"
      }
    },
    {
      id: "atirei-pau-bell",
      title: "Atirei o Pau no Gato",
      artist: "Tradicional",
      difficulty: "Fácil",
      instrument: "bell",
      color: "bg-red-100 border-red-200",
      category: "brasileiro",
      therapeuticBenefits: "Trabalha coordenação e sequenciamento motor",
      noteSequence: getSequenceForSong("atirei-pau-bell") || {
        notes: [],
        bpm: 110,
        timeSignature: "4/4",
        key: "C"
      }
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
      therapeuticBenefits: "Conecta música com eventos sociais importantes",
      noteSequence: getSequenceForSong("happy-birthday-xylophone") || {
        notes: [],
        bpm: 90,
        timeSignature: "3/4",
        key: "C"
      }
    },
    {
      id: "xuxa-xylophone",
      title: "Ilariê (Xuxa)",
      artist: "Xuxa",
      difficulty: "Fácil",
      instrument: "xylophone",
      color: "bg-blue-100 border-blue-200",
      category: "desenhos",
      therapeuticBenefits: "Estimula expressão corporal e alegria",
      noteSequence: getSequenceForSong("xuxa-xylophone") || {
        notes: [],
        bpm: 130,
        timeSignature: "4/4",
        key: "G"
      }
    },
    {
      id: "sapo-nao-lava-xylophone",
      title: "O Sapo Não Lava o Pé",
      artist: "Infantil",
      difficulty: "Fácil",
      instrument: "xylophone",
      color: "bg-blue-100 border-blue-200",
      category: "brasileiro",
      therapeuticBenefits: "Desenvolve consciência corporal e higiene",
      noteSequence: getSequenceForSong("sapo-nao-lava-xylophone") || {
        notes: [],
        bpm: 100,
        timeSignature: "2/4",
        key: "C"
      }
    },
    {
      id: "peppa-pig-xylophone",
      title: "Peppa Pig Theme",
      artist: "Desenho Animado",
      difficulty: "Fácil",
      instrument: "xylophone",
      color: "bg-blue-100 border-blue-200",
      category: "desenhos",
      therapeuticBenefits: "Trabalha familiaridade e conforto através de personagem conhecido",
      noteSequence: getSequenceForSong("peppa-pig-xylophone") || {
        notes: [],
        bpm: 120,
        timeSignature: "4/4",
        key: "C"
      }
    },
    {
      id: "escravos-jo-xylophone",
      title: "Escravos de Jó",
      artist: "Folclore",
      difficulty: "Fácil",
      instrument: "xylophone",
      color: "bg-blue-100 border-blue-200",
      category: "brasileiro",
      therapeuticBenefits: "Estimula coordenação bilateral e sequenciamento",
      noteSequence: getSequenceForSong("escravos-jo-xylophone") || {
        notes: [],
        bpm: 110,
        timeSignature: "4/4",
        key: "C"
      }
    },
    {
      id: "jingle-bells-xylophone",
      title: "Jingle Bells",
      artist: "Natal",
      difficulty: "Fácil",
      instrument: "xylophone",
      color: "bg-blue-100 border-blue-200",
      category: "infantil",
      therapeuticBenefits: "Conecta com eventos sazonais e tradições",
      noteSequence: getSequenceForSong("jingle-bells-xylophone") || {
        notes: [],
        bpm: 120,
        timeSignature: "4/4",
        key: "C"
      }
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
      therapeuticBenefits: "Desenvolve sequenciamento e organização mental",
      noteSequence: getSequenceForSong("scale-keyboard") || {
        notes: [],
        bpm: 80,
        timeSignature: "4/4",
        key: "C"
      }
    },
    {
      id: "hot-cross-keyboard",
      title: "Três Notas Mágicas",
      artist: "Terapêutico",
      difficulty: "Fácil",
      instrument: "keyboard",
      color: "bg-green-100 border-green-200",
      category: "terapêutico",
      therapeuticBenefits: "Estimula foco e concentração através da simplicidade",
      noteSequence: getSequenceForSong("hot-cross-keyboard") || {
        notes: [],
        bpm: 90,
        timeSignature: "4/4",
        key: "C"
      }
    },
    {
      id: "frozen-keyboard",
      title: "Let It Go (Simplificada)",
      artist: "Frozen",
      difficulty: "Fácil",
      instrument: "keyboard",
      color: "bg-green-100 border-green-200",
      category: "desenhos",
      therapeuticBenefits: "Trabalha expressão emocional e autoestima",
      noteSequence: getSequenceForSong("frozen-keyboard") || {
        notes: [],
        bpm: 100,
        timeSignature: "4/4",
        key: "F"
      }
    },
    {
      id: "aquarela-keyboard",
      title: "Aquarela",
      artist: "Toquinho",
      difficulty: "Fácil",
      instrument: "keyboard",
      color: "bg-green-100 border-green-200",
      category: "brasileiro",
      therapeuticBenefits: "Estimula criatividade e imaginação",
      noteSequence: getSequenceForSong("aquarela-keyboard") || {
        notes: [],
        bpm: 95,
        timeSignature: "4/4",
        key: "C"
      }
    },
    {
      id: "caranguejo-keyboard",
      title: "Caranguejo",
      artist: "Folclore",
      difficulty: "Fácil",
      instrument: "keyboard",
      color: "bg-green-100 border-green-200",
      category: "brasileiro",
      therapeuticBenefits: "Desenvolve conhecimento sobre natureza e animais",
      noteSequence: getSequenceForSong("caranguejo-keyboard") || {
        notes: [],
        bpm: 110,
        timeSignature: "2/4",
        key: "G"
      }
    },
    {
      id: "paw-patrol-keyboard",
      title: "Patrulha Canina",
      artist: "Desenho Animado",
      difficulty: "Fácil",
      instrument: "keyboard",
      color: "bg-green-100 border-green-200",
      category: "desenhos",
      therapeuticBenefits: "Promove trabalho em equipe e resolução de problemas",
      noteSequence: getSequenceForSong("paw-patrol-keyboard") || {
        notes: [],
        bpm: 125,
        timeSignature: "4/4",
        key: "C"
      }
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
      therapeuticBenefits: "Desenvolve memória sequencial e padrões repetitivos",
      noteSequence: getSequenceForSong("frere-jacques-bell") || {
        notes: [],
        bpm: 100,
        timeSignature: "4/4",
        key: "C"
      }
    },
    {
      id: "asa-branca-bell",
      title: "Asa Branca",
      artist: "Luiz Gonzaga",
      difficulty: "Médio",
      instrument: "bell",
      color: "bg-red-100 border-red-200",
      category: "brasileiro",
      therapeuticBenefits: "Conecta com cultura nordestina e geografia brasileira",
      noteSequence: getSequenceForSong("asa-branca-bell") || {
        notes: [],
        bpm: 90,
        timeSignature: "4/4",
        key: "G"
      }
    },
    {
      id: "sitio-lobato-bell",
      title: "Sítio do Pica-Pau Amarelo",
      artist: "Globo",
      difficulty: "Médio",
      instrument: "bell",
      color: "bg-red-100 border-red-200",
      category: "desenhos",
      therapeuticBenefits: "Estimula imaginação e literatura brasileira",
      noteSequence: getSequenceForSong("sitio-lobato-bell") || {
        notes: [],
        bpm: 100,
        timeSignature: "4/4",
        key: "C"
      }
    },
    {
      id: "pink-panther-bell",
      title: "Pantera Cor-de-Rosa",
      artist: "Desenho Clássico",
      difficulty: "Médio",
      instrument: "bell",
      color: "bg-red-100 border-red-200",
      category: "desenhos",
      therapeuticBenefits: "Trabalha reconhecimento de melodias marcantes",
      noteSequence: getSequenceForSong("pink-panther-bell") || {
        notes: [],
        bpm: 110,
        timeSignature: "4/4",
        key: "C"
      }
    },
    {
      id: "capelinha-bell",
      title: "Capelinha de Melão",
      artist: "Festa Junina",
      difficulty: "Médio",
      instrument: "bell",
      color: "bg-red-100 border-red-200",
      category: "brasileiro",
      therapeuticBenefits: "Conecta com tradições e festividades brasileiras",
      noteSequence: getSequenceForSong("capelinha-bell") || {
        notes: [],
        bpm: 100,
        timeSignature: "4/4",
        key: "C"
      }
    },
    {
      id: "amazing-grace-bell",
      title: "Amazing Grace",
      artist: "Espiritual",
      difficulty: "Médio",
      instrument: "bell",
      color: "bg-red-100 border-red-200",
      category: "clássico",
      therapeuticBenefits: "Promove calma e introspecção",
      noteSequence: getSequenceForSong("amazing-grace-bell") || {
        notes: [],
        bpm: 90,
        timeSignature: "4/4",
        key: "C"
      }
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
      therapeuticBenefits: "Estimula apreciação da música clássica e grandiosidade",
      noteSequence: getSequenceForSong("ode-joy-xylophone") || {
        notes: [],
        bpm: 100,
        timeSignature: "4/4",
        key: "C"
      }
    },
    {
      id: "chaves-xylophone",
      title: "Tema do Chaves",
      artist: "Chespirito",
      difficulty: "Médio",
      instrument: "xylophone",
      color: "bg-blue-100 border-blue-200",
      category: "desenhos",
      therapeuticBenefits: "Conecta com humor e nostalgia familiar",
      noteSequence: getSequenceForSong("chaves-xylophone") || {
        notes: [],
        bpm: 110,
        timeSignature: "4/4",
        key: "C"
      }
    },
    {
      id: "garota-ipanema-xylophone",
      title: "Garota de Ipanema (Simplificada)",
      artist: "Tom Jobim",
      difficulty: "Médio",
      instrument: "xylophone",
      color: "bg-blue-100 border-blue-200",
      category: "brasileiro",
      therapeuticBenefits: "Introduz bossa nova e sofisticação musical",
      noteSequence: getSequenceForSong("garota-ipanema-xylophone") || {
        notes: [],
        bpm: 100,
        timeSignature: "4/4",
        key: "C"
      }
    },
    {
      id: "danny-boy-xylophone",
      title: "Danny Boy",
      artist: "Irlandesa",
      difficulty: "Médio",
      instrument: "xylophone",
      color: "bg-blue-100 border-blue-200",
      category: "clássico",
      therapeuticBenefits: "Desenvolve expressão emocional profunda",
      noteSequence: getSequenceForSong("danny-boy-xylophone") || {
        notes: [],
        bpm: 90,
        timeSignature: "4/4",
        key: "C"
      }
    },
    {
      id: "turma-monica-xylophone",
      title: "Turma da Mônica",
      artist: "Maurício de Sousa",
      difficulty: "Médio",
      instrument: "xylophone",
      color: "bg-blue-100 border-blue-200",
      category: "desenhos",
      therapeuticBenefits: "Estimula criatividade e narrativa brasileira",
      noteSequence: getSequenceForSong("turma-monica-xylophone") || {
        notes: [],
        bpm: 110,
        timeSignature: "4/4",
        key: "C"
      }
    },
    {
      id: "cai-cai-balao-xylophone",
      title: "Cai, Cai, Balão",
      artist: "Festa Junina",
      difficulty: "Médio",
      instrument: "xylophone",
      color: "bg-blue-100 border-blue-200",
      category: "brasileiro",
      therapeuticBenefits: "Trabalha coordenação e festividades tradicionais",
      noteSequence: getSequenceForSong("cai-cai-balao-xylophone") || {
        notes: [],
        bpm: 100,
        timeSignature: "4/4",
        key: "C"
      }
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
      therapeuticBenefits: "Promove relaxamento e concentração profunda",
      noteSequence: getSequenceForSong("moonlight-keyboard") || {
        notes: [],
        bpm: 60,
        timeSignature: "4/4",
        key: "C"
      }
    },
    {
      id: "moana-keyboard",
      title: "Moana - Oceania",
      artist: "Disney",
      difficulty: "Médio",
      instrument: "keyboard",
      color: "bg-green-100 border-green-200",
      category: "desenhos",
      therapeuticBenefits: "Estimula coragem e autodescoberta",
      noteSequence: getSequenceForSong("moana-keyboard") || {
        notes: [],
        bpm: 100,
        timeSignature: "4/4",
        key: "C"
      }
    },
    {
      id: "bach-minuet-keyboard",
      title: "Minueto em Sol",
      artist: "Bach",
      difficulty: "Médio",
      instrument: "keyboard",
      color: "bg-green-100 border-green-200",
      category: "clássico",
      therapeuticBenefits: "Desenvolve estrutura e organização mental",
      noteSequence: getSequenceForSong("bach-minuet-keyboard") || {
        notes: [],
        bpm: 90,
        timeSignature: "3/4",
        key: "G"
      }
    },
    {
      id: "country-roads-keyboard",
      title: "Country Roads",
      artist: "John Denver",
      difficulty: "Médio",
      instrument: "keyboard",
      color: "bg-green-100 border-green-200",
      category: "clássico",
      therapeuticBenefits: "Conecta com natureza e tranquilidade",
      noteSequence: getSequenceForSong("country-roads-keyboard") || {
        notes: [],
        bpm: 100,
        timeSignature: "4/4",
        key: "C"
      }
    },
    {
      id: "peixe-vivo-keyboard",
      title: "Peixe Vivo",
      artist: "Folclore",
      difficulty: "Médio",
      instrument: "keyboard",
      color: "bg-green-100 border-green-200",
      category: "brasileiro",
      therapeuticBenefits: "Estimula conexão com natureza aquática",
      noteSequence: getSequenceForSong("peixe-vivo-keyboard") || {
        notes: [],
        bpm: 110,
        timeSignature: "4/4",
        key: "C"
      }
    },
    {
      id: "toy-story-keyboard",
      title: "You've Got a Friend (Toy Story)",
      artist: "Pixar",
      difficulty: "Médio",
      instrument: "keyboard",
      color: "bg-green-100 border-green-200",
      category: "desenhos",
      therapeuticBenefits: "Trabalha amizade e lealdade",
      noteSequence: getSequenceForSong("toy-story-keyboard") || {
        notes: [],
        bpm: 100,
        timeSignature: "4/4",
        key: "C"
      }
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
      therapeuticBenefits: "Desenvolve coordenação avançada e perseverança",
      noteSequence: getSequenceForSong("william-tell-bell") || {
        notes: [],
        bpm: 140,
        timeSignature: "4/4",
        key: "C"
      }
    },
    {
      id: "carmen-bell",
      title: "Carmen - Habanera",
      artist: "Bizet",
      difficulty: "Difícil",
      instrument: "bell",
      color: "bg-red-100 border-red-200",
      category: "clássico",
      therapeuticBenefits: "Estimula expressão dramática e emocional",
      noteSequence: getSequenceForSong("carmen-bell") || {
        notes: [],
        bpm: 130,
        timeSignature: "4/4",
        key: "C"
      }
    },
    {
      id: "pirates-bell",
      title: "Piratas do Caribe",
      artist: "Hans Zimmer",
      difficulty: "Difícil",
      instrument: "bell",
      color: "bg-red-100 border-red-200",
      category: "desenhos",
      therapeuticBenefits: "Trabalha aventura e determinação",
      noteSequence: getSequenceForSong("pirates-bell") || {
        notes: [],
        bpm: 140,
        timeSignature: "4/4",
        key: "C"
      }
    },
    {
      id: "aquarela-complexa-bell",
      title: "Aquarela do Brasil",
      artist: "Ary Barroso",
      difficulty: "Difícil",
      instrument: "bell",
      color: "bg-red-100 border-red-200",
      category: "brasileiro",
      therapeuticBenefits: "Conecta com identidade nacional complexa",
      noteSequence: getSequenceForSong("aquarela-complexa-bell") || {
        notes: [],
        bpm: 130,
        timeSignature: "4/4",
        key: "C"
      }
    },
    {
      id: "carnival-bell",
      title: "Carnaval de Veneza",
      artist: "Clássico",
      difficulty: "Difícil",
      instrument: "bell",
      color: "bg-red-100 border-red-200",
      category: "clássico",
      therapeuticBenefits: "Desenvolve agilidade mental e festa",
      noteSequence: getSequenceForSong("carnival-bell") || {
        notes: [],
        bpm: 140,
        timeSignature: "4/4",
        key: "C"
      }
    },
    {
      id: "star-wars-bell",
      title: "Star Wars - Tema Principal",
      artist: "John Williams",
      difficulty: "Difícil",
      instrument: "bell",
      color: "bg-red-100 border-red-200",
      category: "desenhos",
      therapeuticBenefits: "Estimula imaginação épica e heroísmo",
      noteSequence: getSequenceForSong("star-wars-bell") || {
        notes: [],
        bpm: 130,
        timeSignature: "4/4",
        key: "C"
      }
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
      therapeuticBenefits: "Desenvolve velocidade e precisão mental",
      noteSequence: getSequenceForSong("turkish-march-xylophone") || {
        notes: [],
        bpm: 140,
        timeSignature: "4/4",
        key: "C"
      }
    },
    {
      id: "spring-vivaldi-xylophone",
      title: "Primavera (Vivaldi)",
      artist: "Vivaldi",
      difficulty: "Difícil",
      instrument: "xylophone",
      color: "bg-blue-100 border-blue-200",
      category: "clássico",
      therapeuticBenefits: "Conecta com estações e renovação",
      noteSequence: getSequenceForSong("spring-vivaldi-xylophone") || {
        notes: [],
        bpm: 130,
        timeSignature: "4/4",
        key: "C"
      }
    },
    {
      id: "choro-xylophone",
      title: "Tico-Tico no Fubá",
      artist: "Zequinha de Abreu",
      difficulty: "Difícil",
      instrument: "xylophone",
      color: "bg-blue-100 border-blue-200",
      category: "brasileiro",
      therapeuticBenefits: "Estimula agilidade e música instrumental brasileira",
      noteSequence: getSequenceForSong("choro-xylophone") || {
        notes: [],
        bpm: 140,
        timeSignature: "4/4",
        key: "C"
      }
    },
    {
      id: "incredibles-xylophone",
      title: "Os Incríveis",
      artist: "Michael Giacchino",
      difficulty: "Difícil",
      instrument: "xylophone",
      color: "bg-blue-100 border-blue-200",
      category: "desenhos",
      therapeuticBenefits: "Trabalha superpoderes e autoconfiança",
      noteSequence: getSequenceForSong("incredibles-xylophone") || {
        notes: [],
        bpm: 130,
        timeSignature: "4/4",
        key: "C"
      }
    },
    {
      id: "hungarian-dance-xylophone",
      title: "Dança Húngara No. 5",
      artist: "Brahms",
      difficulty: "Difícil",
      instrument: "xylophone",
      color: "bg-blue-100 border-blue-200",
      category: "clássico",
      therapeuticBenefits: "Desenvolve ritmo complexo e energia",
      noteSequence: getSequenceForSong("hungarian-dance-xylophone") || {
        notes: [],
        bpm: 140,
        timeSignature: "4/4",
        key: "C"
      }
    },
    {
      id: "beatles-xylophone",
      title: "Yesterday",
      artist: "The Beatles",
      difficulty: "Difícil",
      instrument: "xylophone",
      color: "bg-blue-100 border-blue-200",
      category: "clássico",
      therapeuticBenefits: "Estimula nostalgia e melancolia controlada",
      noteSequence: getSequenceForSong("beatles-xylophone") || {
        notes: [],
        bpm: 130,
        timeSignature: "4/4",
        key: "C"
      }
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
      therapeuticBenefits: "Desenvolve delicadeza e expressão refinada",
      noteSequence: getSequenceForSong("fur-elise-keyboard") || {
        notes: [],
        bpm: 120,
        timeSignature: "3/4",
        key: "A"
      }
    },
    {
      id: "claire-de-lune-keyboard",
      title: "Claire de Lune",
      artist: "Debussy",
      difficulty: "Difícil",
      instrument: "keyboard",
      color: "bg-green-100 border-green-200",
      category: "clássico",
      therapeuticBenefits: "Promove tranquilidade noturna e contemplação",
      noteSequence: getSequenceForSong("claire-de-lune-keyboard") || {
        notes: [],
        bpm: 70,
        timeSignature: "3/4",
        key: "D"
      }
    },
    {
      id: "chopin-minute-keyboard",
      title: "Valsa do Minuto",
      artist: "Chopin",
      difficulty: "Difícil",
      instrument: "keyboard",
      color: "bg-green-100 border-green-200",
      category: "clássico",
      therapeuticBenefits: "Estimula velocidade controlada e elegância",
      noteSequence: getSequenceForSong("chopin-minute-keyboard") || {
        notes: [],
        bpm: 140,
        timeSignature: "3/4",
        key: "G"
      }
    },
    {
      id: "casa-papel-keyboard",
      title: "Bella Ciao",
      artist: "Tradicional Italiana",
      difficulty: "Difícil",
      instrument: "keyboard",
      color: "bg-green-100 border-green-200",
      category: "clássico",
      therapeuticBenefits: "Trabalha resistência e determinação",
      noteSequence: getSequenceForSong("casa-papel-keyboard") || {
        notes: [],
        bpm: 130,
        timeSignature: "4/4",
        key: "C"
      }
    },
    {
      id: "lion-king-keyboard",
      title: "Circle of Life",
      artist: "Disney",
      difficulty: "Difícil",
      instrument: "keyboard",
      color: "bg-green-100 border-green-200",
      category: "desenhos",
      therapeuticBenefits: "Conecta com ciclo da vida e propósito",
      noteSequence: getSequenceForSong("lion-king-keyboard") || {
        notes: [],
        bpm: 120,
        timeSignature: "4/4",
        key: "C"
      }
    },
    {
      id: "samba-keyboard",
      title: "Águas de Março",
      artist: "Tom Jobim",
      difficulty: "Difícil",
      instrument: "keyboard",
      color: "bg-green-100 border-green-200",
      category: "brasileiro",
      therapeuticBenefits: "Desenvolve complexidade rítmica brasileira",
      noteSequence: getSequenceForSong("samba-keyboard") || {
        notes: [],
        bpm: 130,
        timeSignature: "4/4",
        key: "C"
      }
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
    console.log(`Sequência musical: ${selectedSong?.noteSequence.notes.length} notas em ${selectedSong?.noteSequence.key} - ${selectedSong?.noteSequence.bpm} BPM`);
  };

  const handleSongSelect = (song: MusicalSong) => {
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
          noteSequence={selectedSong.noteSequence}
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

                  <div className="bg-purple-50 p-2 rounded text-xs text-purple-800 mb-2">
                    <strong>Música:</strong> {song.noteSequence.notes.length} notas • {song.noteSequence.bpm} BPM • {song.noteSequence.key} Maior
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

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-green-800 mb-2">
                    🎼 Informações Musicais:
                  </h4>
                  <p className="text-sm text-green-700">
                    <strong>Notas:</strong> {selectedSong.noteSequence.notes.length} • 
                    <strong> Andamento:</strong> {selectedSong.noteSequence.bpm} BPM • 
                    <strong> Compasso:</strong> {selectedSong.noteSequence.timeSignature} • 
                    <strong> Tonalidade:</strong> {selectedSong.noteSequence.key} Maior
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800 mb-2">
                    <strong>Como jogar:</strong>
                  </p>
                  <p className="text-sm text-blue-700">
                    Use as teclas <strong>1-7</strong> para tocar as notas quando elas passarem pela zona dourada!
                    Esta música segue a sequência musical real com {selectedSong.noteSequence.notes.length} notas.
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
              utilizando sequências musicais reais como ferramenta terapêutica para estimular desenvolvimento cognitivo,
              coordenação motora, memória sequencial e integração sensorial.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-green-50 p-3 rounded">
                <strong className="text-green-800">🟢 Fácil:</strong>
                <p className="text-green-700">3-5 notas diferentes, 80-100 BPM, melodias simples</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded">
                <strong className="text-yellow-800">🟡 Médio:</strong>
                <p className="text-yellow-700">5-7 notas, 100-120 BPM, ritmo moderado</p>
              </div>
              <div className="bg-red-50 p-3 rounded">
                <strong className="text-red-800">🔴 Difícil:</strong>
                <p className="text-red-700">7+ notas, 120+ BPM, melodias complexas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeaHero;
