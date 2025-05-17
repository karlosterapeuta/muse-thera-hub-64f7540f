
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

// Lista de músicas pré-definidas para o musicograma
const songLibrary: Song[] = [
  {
    id: "song-1",
    title: "Canção da Natureza",
    artist: "Músicas Infantis",
    url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/WFMU/Broke_For_Free/Directionless_EP/Broke_For_Free_-_01_-_Night_Owl.mp3",
    duration: "1:23",
    youtubeId: "tPEE9ZwTmy0" // Música infantil relaxante
  },
  {
    id: "song-2",
    title: "Canção dos Bichinhos",
    artist: "Músicas Infantis",
    url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Tours/Enthusiast/Tours_-_01_-_Enthusiast.mp3",
    duration: "1:12",
    youtubeId: "XU3c64GBpLQ" // Música dos bichinhos
  },
  {
    id: "song-3",
    title: "Dança das Borboletas",
    artist: "Músicas Infantis",
    url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Shipping_Lanes.mp3",
    duration: "1:52",
    youtubeId: "RV3GYtfF5y0" // Música suave para crianças
  },
  {
    id: "song-4",
    title: "Tambores da Selva",
    artist: "Sons da Natureza",
    url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Torres/Torres/Torres_-_01_-_Del_campo_al_humo.mp3",
    duration: "1:30",
    youtubeId: "Eh5QYoV9aJM" // Sons da natureza
  },
  {
    id: "song-5",
    title: "Mar Calmo",
    artist: "Sons da Natureza",
    url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Kai_Engel/Satin/Kai_Engel_-_07_-_Heimat.mp3",
    duration: "1:23",
    youtubeId: "lE6RYpe9IT0" // Sons do oceano
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
