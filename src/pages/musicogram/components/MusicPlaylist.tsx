import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Music,
  Volume,
  VolumeX
} from "lucide-react";
import { playNoteSound, stopAllAudio } from "@/utils/audioUtils";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: string; // mm:ss format
  youtubeId?: string; // YouTube video ID
}

interface MusicPlaylistProps {
  onPlay: (songUrl: string) => void;
  onPause: () => void;
  currentSong: Song | null;
  isPlaying: boolean;
}

// YouTube API key
const YOUTUBE_API_KEY = "AIzaSyAfThpfo8yhfvv7skCwlRbnmNFV8Iuo71o";

// Lista atualizada de músicas infantis tradicionais brasileiras
const songLibrary: Song[] = [
  {
    id: "song-1",
    title: "Atirei o Pau no Gato",
    artist: "Tradicional",
    url: "https://files.freemusicarchive.org/music/no_curator/Traditional/Traditional/01_Atirei_o_Pau_no_Gato.mp3",
    duration: "1:23",
    youtubeId: "RQEm7LUMI7g"
  },
  {
    id: "song-2",
    title: "Sapo Cururu",
    artist: "Tradicional",
    url: "https://files.freemusicarchive.org/music/no_curator/Traditional/Traditional/02_Sapo_Cururu.mp3",
    duration: "1:12",
    youtubeId: "TdaqmdJKHh4"
  },
  {
    id: "song-3",
    title: "Ciranda, Cirandinha",
    artist: "Tradicional",
    url: "https://files.freemusicarchive.org/music/no_curator/Traditional/Traditional/03_Ciranda_Cirandinha.mp3",
    duration: "1:52",
    youtubeId: "1fhx98uqOMA"
  },
  {
    id: "song-4",
    title: "O Sítio do Seu Lobato",
    artist: "Tradicional",
    url: "https://files.freemusicarchive.org/music/no_curator/Traditional/Traditional/04_O_Sitio_do_Seu_Lobato.mp3",
    duration: "1:30",
    youtubeId: "P0XtiCDqYr4"
  },
  {
    id: "song-5",
    title: "A Barata Diz Que Tem",
    artist: "Tradicional",
    url: "https://files.freemusicarchive.org/music/no_curator/Traditional/Traditional/05_A_Barata_Diz_Que_Tem.mp3",
    duration: "1:23",
    youtubeId: "0jmKF0Um4sE"
  },
  {
    id: "song-6",
    title: "Marcha Soldado",
    artist: "Tradicional",
    url: "https://files.freemusicarchive.org/music/no_curator/Traditional/Traditional/06_Marcha_Soldado.mp3",
    duration: "1:05",
    youtubeId: "JOwEtUE7CZs"
  },
  {
    id: "song-7",
    title: "Boi da Cara Preta",
    artist: "Tradicional",
    url: "https://files.freemusicarchive.org/music/no_curator/Traditional/Traditional/07_Boi_da_Cara_Preta.mp3",
    duration: "1:18",
    youtubeId: "tzqdarqFzpw"
  },
  {
    id: "song-8",
    title: "Peixe Vivo",
    artist: "Tradicional",
    url: "https://files.freemusicarchive.org/music/no_curator/Traditional/Traditional/08_Peixe_Vivo.mp3",
    duration: "1:20",
    youtubeId: "NMolLPizT6U"
  },
  {
    id: "song-9",
    title: "Escravos de Jó",
    artist: "Tradicional",
    url: "https://files.freemusicarchive.org/music/no_curator/Traditional/Traditional/09_Escravos_de_Jo.mp3",
    duration: "1:15",
    youtubeId: "Q25_4-OQ8qI"
  },
  {
    id: "song-10",
    title: "Cai, Cai Balão",
    artist: "Tradicional",
    url: "https://files.freemusicarchive.org/music/no_curator/Traditional/Traditional/10_Cai_Cai_Balao.mp3",
    duration: "1:10",
    youtubeId: "SkP6ZWY7A4w"
  },
  {
    id: "song-11",
    title: "O Cravo e a Rosa",
    artist: "Tradicional",
    url: "https://files.freemusicarchive.org/music/no_curator/Traditional/Traditional/11_O_Cravo_e_a_Rosa.mp3",
    duration: "1:25",
    youtubeId: "5Hbh_yyLSYw"
  },
  {
    id: "song-12",
    title: "Fui no Itororó",
    artist: "Tradicional",
    url: "https://files.freemusicarchive.org/music/no_curator/Traditional/Traditional/12_Fui_no_Itororo.mp3",
    duration: "1:28",
    youtubeId: "cIIr9QLZ99w"
  },
  {
    id: "song-13",
    title: "Se Essa Rua Fosse Minha",
    artist: "Tradicional",
    url: "https://files.freemusicarchive.org/music/no_curator/Traditional/Traditional/13_Se_Essa_Rua_Fosse_Minha.mp3",
    duration: "1:32",
    youtubeId: "CS8gv_B0obA"
  },
  {
    id: "song-14",
    title: "Pirulito que Bate Bate",
    artist: "Tradicional",
    url: "https://files.freemusicarchive.org/music/no_curator/Traditional/Traditional/14_Pirulito_que_Bate_Bate.mp3",
    duration: "1:07",
    youtubeId: "QcK9cYX-YBw"
  },
  {
    id: "song-15",
    title: "A Canoa Virou",
    artist: "Tradicional",
    url: "https://files.freemusicarchive.org/music/no_curator/Traditional/Traditional/15_A_Canoa_Virou.mp3",
    duration: "1:12",
    youtubeId: "z7LG4Q_5CSw"
  },
  {
    id: "song-16",
    title: "Indiozinhos",
    artist: "Tradicional",
    url: "https://files.freemusicarchive.org/music/no_curator/Traditional/Traditional/16_Indiozinhos.mp3",
    duration: "1:20",
    youtubeId: "pPFXOHhXGM8"
  },
  {
    id: "song-17",
    title: "A Linda Rosa Juvenil",
    artist: "Tradicional",
    url: "https://files.freemusicarchive.org/music/no_curator/Traditional/Traditional/17_A_Linda_Rosa_Juvenil.mp3",
    duration: "1:45",
    youtubeId: "jUAJxDCd2Ig"
  },
  {
    id: "song-18",
    title: "Capelinha de Melão",
    artist: "Tradicional",
    url: "https://files.freemusicarchive.org/music/no_curator/Traditional/Traditional/18_Capelinha_de_Melao.mp3",
    duration: "1:15",
    youtubeId: "LCmw5g7I-1w"
  },
  {
    id: "song-19",
    title: "Nesta Rua",
    artist: "Tradicional",
    url: "https://files.freemusicarchive.org/music/no_curator/Traditional/Traditional/19_Nesta_Rua.mp3",
    duration: "1:30",
    youtubeId: "BHjDUQp3GYw"
  },
  {
    id: "song-20",
    title: "O Pintinho Amarelinho",
    artist: "Tradicional",
    url: "https://files.freemusicarchive.org/music/no_curator/Traditional/Traditional/20_O_Pintinho_Amarelinho.mp3",
    duration: "1:08",
    youtubeId: "TW6nBTg2wLA"
  },
  {
    id: "song-21",
    title: "A Galinha do Vizinho",
    artist: "Tradicional",
    url: "https://files.freemusicarchive.org/music/no_curator/Traditional/Traditional/21_A_Galinha_do_Vizinho.mp3",
    duration: "1:05",
    youtubeId: "ODR4AjFkRw4"
  },
  {
    id: "song-22",
    title: "O Elefante",
    artist: "Xuxa",
    url: "https://files.freemusicarchive.org/music/no_curator/Xuxa/Xuxa/22_O_Elefante.mp3",
    duration: "1:45",
    youtubeId: "Sz7ipJOfNK8"
  },
  {
    id: "song-23",
    title: "A Casa",
    artist: "Vinicius de Moraes",
    url: "https://files.freemusicarchive.org/music/no_curator/Vinicius_de_Moraes/Vinicius/23_A_Casa.mp3",
    duration: "1:30",
    youtubeId: "P3GJ2BKT4fs"
  },
  {
    id: "song-24",
    title: "O Pato",
    artist: "Vinicius de Moraes",
    url: "https://files.freemusicarchive.org/music/no_curator/Vinicius_de_Moraes/Vinicius/24_O_Pato.mp3",
    duration: "1:40",
    youtubeId: "N5JSr0J9_mY"
  },
  {
    id: "song-25",
    title: "Aquarela",
    artist: "Toquinho",
    url: "https://files.freemusicarchive.org/music/no_curator/Toquinho/Toquinho/25_Aquarela.mp3",
    duration: "2:20",
    youtubeId: "xT8HIiFQ8Y0"
  },
  {
    id: "song-26",
    title: "A Baratinha",
    artist: "Tradicional",
    url: "https://files.freemusicarchive.org/music/no_curator/Traditional/Traditional/26_A_Baratinha.mp3",
    duration: "1:15",
    youtubeId: "k5TG8HEtILg"
  },
  {
    id: "song-27",
    title: "A Dona Aranha",
    artist: "Tradicional",
    url: "https://files.freemusicarchive.org/music/no_curator/Traditional/Traditional/27_A_Dona_Aranha.mp3",
    duration: "1:10",
    youtubeId: "MuBgIfBR1jk"
  },
  {
    id: "song-28",
    title: "A Roda do Ônibus",
    artist: "Tradicional",
    url: "https://files.freemusicarchive.org/music/no_curator/Traditional/Traditional/28_A_Roda_do_Onibus.mp3",
    duration: "1:30",
    youtubeId: "7Uce9Lenk8U"
  },
  {
    id: "song-29",
    title: "Borboletinha",
    artist: "Tradicional",
    url: "https://files.freemusicarchive.org/music/no_curator/Traditional/Traditional/29_Borboletinha.mp3",
    duration: "1:05",
    youtubeId: "QiVkWZqGvOE"
  },
  {
    id: "song-30",
    title: "Cachorrinho está latindo",
    artist: "Tradicional",
    url: "https://files.freemusicarchive.org/music/no_curator/Traditional/Traditional/30_Cachorrinho_esta_latindo.mp3",
    duration: "1:08",
    youtubeId: "n8Q9Vvh7NhY"
  },
  {
    id: "song-31",
    title: "Caranguejo não é peixe",
    artist: "Tradicional",
    url: "https://files.freemusicarchive.org/music/no_curator/Traditional/Traditional/31_Caranguejo_nao_e_peixe.mp3",
    duration: "1:25",
    youtubeId: "WVz4oVUPJ7w"
  },
  {
    id: "song-32",
    title: "Dona Árvore",
    artist: "Palavra Cantada",
    url: "https://files.freemusicarchive.org/music/no_curator/Palavra_Cantada/Palavra/32_Dona_Arvore.mp3",
    duration: "1:50",
    youtubeId: "19d7M63lVGA"
  },
  {
    id: "song-33",
    title: "Eu sou pobre, pobre, pobre",
    artist: "Tradicional",
    url: "https://files.freemusicarchive.org/music/no_curator/Traditional/Traditional/33_Eu_sou_pobre_pobre_pobre.mp3",
    duration: "1:12",
    youtubeId: "uAVUl0cAKpo"
  },
  {
    id: "song-34",
    title: "Fui ao mercado",
    artist: "Tradicional",
    url: "https://files.freemusicarchive.org/music/no_curator/Traditional/Traditional/34_Fui_ao_mercado.mp3",
    duration: "1:15",
    youtubeId: "T1CRDrLwvkk"
  },
  {
    id: "song-35",
    title: "Gato Xadrez",
    artist: "Palavra Cantada",
    url: "https://files.freemusicarchive.org/music/no_curator/Palavra_Cantada/Palavra/35_Gato_Xadrez.mp3",
    duration: "1:45",
    youtubeId: "vJSeVGLtAnU"
  },
  {
    id: "song-36",
    title: "O Jacaré",
    artist: "Xuxa",
    url: "https://files.freemusicarchive.org/music/no_curator/Xuxa/Xuxa/36_O_Jacare.mp3",
    duration: "1:30",
    youtubeId: "8s-YmGFbwoY"
  },
  {
    id: "song-37",
    title: "O Leãozinho",
    artist: "Toquinho",
    url: "https://files.freemusicarchive.org/music/no_curator/Toquinho/Toquinho/37_O_Leaozinho.mp3",
    duration: "2:10",
    youtubeId: "ORmIgJq6KUw"
  },
  {
    id: "song-38",
    title: "O Sapo Não Lava o Pé",
    artist: "Tradicional",
    url: "https://files.freemusicarchive.org/music/no_curator/Traditional/Traditional/38_O_Sapo_Nao_Lava_o_Pe.mp3",
    duration: "1:15",
    youtubeId: "ZtFgdmQL8HA"
  },
  {
    id: "song-39",
    title: "A Canoa Virou",
    artist: "Tradicional",
    url: "https://files.freemusicarchive.org/music/no_curator/Traditional/Traditional/39_A_Canoa_Virou.mp3",
    duration: "1:12",
    youtubeId: "z7LG4Q_5CSw"
  }
];

export const MusicPlaylist = ({ 
  onPlay, 
  onPause, 
  currentSong, 
  isPlaying 
}: MusicPlaylistProps) => {
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [volume, setVolume] = useState(50);
  const [youtubeApiLoaded, setYoutubeApiLoaded] = useState(false);
  const [youtubePlayer, setYoutubePlayer] = useState<any>(null);

  // Carrega a API do YouTube
  useEffect(() => {
    // Cria o script do YouTube API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      
      // Função de callback quando a API estiver pronta
      window.onYouTubeIframeAPIReady = () => {
        setYoutubeApiLoaded(true);
      };
      
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    } else if (window.YT.Player) {
      setYoutubeApiLoaded(true);
    }
    
    // Limpa o player do YouTube quando o componente é desmontado
    return () => {
      if (youtubePlayer) {
        youtubePlayer.destroy();
      }
    };
  }, []);

  // Inicializa o player do YouTube quando a API estiver carregada
  useEffect(() => {
    if (youtubeApiLoaded && !youtubePlayer) {
      // Cria um elemento div invisível para o player do YouTube
      const playerDiv = document.createElement('div');
      playerDiv.id = 'youtube-player';
      playerDiv.style.display = 'none';
      document.body.appendChild(playerDiv);
      
      const player = new window.YT.Player('youtube-player', {
        height: '0',
        width: '0',
        playerVars: {
          'playsinline': 1,
          'controls': 0,
          'disablekb': 1
        },
        events: {
          'onReady': () => {
            setYoutubePlayer(player);
            player.setVolume(volume);
          },
          'onStateChange': (event: any) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              // Quando a música terminar, notifica o componente pai
              onPause();
            }
          },
          'onError': (event: any) => {
            console.error("Erro no player do YouTube:", event);
            toast.error("Erro ao reproduzir o vídeo do YouTube. Tentando alternativa...");
            
            // Tenta tocar a versão alternativa do arquivo
            if (currentSong) {
              onPlay(currentSong.url);
            }
          }
        }
      });
    }
  }, [youtubeApiLoaded, onPause, volume]);

  // Atualiza o volume quando for alterado
  useEffect(() => {
    if (youtubePlayer && youtubePlayer.setVolume) {
      youtubePlayer.setVolume(volume);
    }
  }, [volume, youtubePlayer]);

  const handleSelectSong = (song: Song) => {
    setSelectedSong(song);
    // Tocar um som de seleção
    playNoteSound("C");
  };

  const handlePlaySong = (song: Song) => {
    // Se tivermos um player do YouTube e a música tiver um ID do YouTube, toca pelo YouTube
    if (youtubePlayer && song.youtubeId) {
      try {
        youtubePlayer.loadVideoById(song.youtubeId);
        youtubePlayer.playVideo();
        onPlay(song.url); // Notifica o componente pai
      } catch (error) {
        console.error("Erro ao tocar vídeo do YouTube:", error);
        toast.error("Erro ao reproduzir o vídeo. Usando fonte alternativa.");
        // Usa a URL alternativa se o YouTube falhar
        onPlay(song.url);
      }
    } else {
      // Caso contrário, usa o método padrão
      onPlay(song.url);
    }
    setSelectedSong(song);
  };

  const handlePauseSong = () => {
    if (youtubePlayer && youtubePlayer.pauseVideo) {
      youtubePlayer.pauseVideo();
    }
    onPause();
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Music size={18} />
          Playlist Musical
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const currentIndex = songLibrary.findIndex(s => s.id === currentSong?.id);
                if (currentIndex > 0) {
                  handlePlaySong(songLibrary[currentIndex - 1]);
                }
              }}
              disabled={!currentSong || songLibrary.findIndex(s => s.id === currentSong?.id) === 0}
            >
              <SkipBack size={16} />
            </Button>
            
            <Button
              variant={isPlaying ? "outline" : "default"}
              className="h-10 w-10 rounded-full p-0"
              onClick={() => isPlaying ? handlePauseSong() : currentSong ? handlePlaySong(currentSong) : null}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const currentIndex = songLibrary.findIndex(s => s.id === currentSong?.id);
                if (currentIndex < songLibrary.length - 1) {
                  handlePlaySong(songLibrary[currentIndex + 1]);
                }
              }}
              disabled={!currentSong || songLibrary.findIndex(s => s.id === currentSong?.id) === songLibrary.length - 1}
            >
              <SkipForward size={16} />
            </Button>
          </div>
          
          {/* Volume Control */}
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setVolume(volume === 0 ? 50 : 0)}
              className="h-8 w-8"
            >
              {volume === 0 ? <VolumeX size={16} /> : <Volume size={16} />}
            </Button>
            <Slider 
              value={[volume]} 
              min={0} 
              max={100} 
              step={1} 
              className="w-32"
              onValueChange={(vals) => setVolume(vals[0])}
            />
            <span className="text-xs w-8 text-center">{volume}%</span>
          </div>
          
          <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
            {songLibrary.map((song) => (
              <div
                key={song.id}
                className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                  currentSong?.id === song.id
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted"
                }`}
                onClick={() => handleSelectSong(song)}
                onDoubleClick={() => handlePlaySong(song)}
              >
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={(e) => {
                      e.stopPropagation();
                      song.id === currentSong?.id && isPlaying 
                        ? handlePauseSong() 
                        : handlePlaySong(song);
                    }}
                  >
                    {song.id === currentSong?.id && isPlaying ? (
                      <Pause size={14} />
                    ) : (
                      <Play size={14} />
                    )}
                  </Button>
                  <div>
                    <div className="text-sm font-medium">{song.title}</div>
                    <div className="text-xs text-muted-foreground">{song.artist}</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">{song.duration}</div>
              </div>
            ))}
          </div>
          
          {selectedSong && (
            <div className="pt-2 border-t border-border">
              <p className="text-sm font-medium">Selecionado:</p>
              <p className="text-sm">{selectedSong.title} - {selectedSong.artist}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Adicione este tipo global para o YouTube API
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export { type Song, songLibrary };
