import { useState, useEffect, useRef } from "react";
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
  youtubeId?: string; // Optional YouTube video ID
  jamendoId?: string; // Optional Jamendo track ID
}

interface MusicPlaylistProps {
  onPlay: (songUrl: string) => void;
  onPause: () => void;
  currentSong: Song | null;
  isPlaying: boolean;
}

// Jamendo API client ID
const JAMENDO_CLIENT_ID = "SEU_ID"; // Replace with your actual client ID

// Lista inicial de músicas infantis tradicionais brasileiras
// This will be replaced by Jamendo API results
const initialSongLibrary: Song[] = [
  {
    id: "song-1",
    title: "Carregando músicas...",
    artist: "Aguarde",
    url: "",
    duration: "0:00",
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
  const [songLibrary, setSongLibrary] = useState<Song[]>(initialSongLibrary);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch songs from Jamendo API
  useEffect(() => {
    const fetchSongs = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          `https://api.jamendo.com/v3.0/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=30&tags=childrens-music,children,kids`
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.results && Array.isArray(data.results) && data.results.length > 0) {
          const formattedSongs = data.results.map((track: any) => {
            // Format duration from seconds to mm:ss
            const minutes = Math.floor(track.duration / 60);
            const seconds = Math.floor(track.duration % 60);
            const formattedDuration = `${minutes}:${seconds.toString().padStart(2, "0")}`;
            
            return {
              id: track.id,
              title: track.name,
              artist: track.artist_name,
              url: track.audio,
              duration: formattedDuration,
              jamendoId: track.id
            };
          });
          
          setSongLibrary(formattedSongs);
          console.log("Loaded songs from Jamendo:", formattedSongs.length);
        } else {
          // If no results, fallback to local songs
          console.log("No songs found from Jamendo API, using fallback playlist");
          setSongLibrary(fallbackSongLibrary);
        }
      } catch (err) {
        console.error("Error fetching songs from Jamendo:", err);
        setError("Falha ao carregar músicas do Jamendo. Usando lista de músicas local.");
        toast.error("Erro ao carregar músicas. Usando playlist offline.");
        // Fallback to the local song library
        setSongLibrary(fallbackSongLibrary);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSongs();
    
    // Initialize audio element for direct audio playback
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.addEventListener('ended', () => {
        console.log("Audio playback ended");
        onPause();
      });
      audioRef.current.addEventListener('error', (e) => {
        console.error("Error playing audio:", e);
        toast.error("Erro ao reproduzir o áudio. Tentando alternativa...");
        handleNextSong(); // Try next song when current fails
      });
    }
    
    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  // Atualiza o volume para o elemento de áudio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handleSelectSong = (song: Song) => {
    setSelectedSong(song);
    // Tocar um som de seleção
    playNoteSound("C");
  };

  // Função para reproduzir áudio usando elemento de áudio nativo
  const playAudio = (song: Song) => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    
    try {
      // Stop any current audio playback
      audioRef.current.pause();
      
      const audioUrl = song.url;
      console.log("Attempting to play:", audioUrl);
      
      audioRef.current.src = audioUrl;
      audioRef.current.volume = volume / 100;
      
      // Setup event handlers
      audioRef.current.oncanplay = () => {
        console.log("Audio can play now");
        audioRef.current?.play().catch(error => {
          console.error("Error starting audio playback:", error);
          toast.error("Falha ao iniciar a reprodução. Tentando outra música...");
          handleNextSong();
        });
      };
      
      audioRef.current.onerror = (e) => {
        console.error("Audio source error:", e);
        toast.error("Erro ao reproduzir esta música. Tentando a próxima...");
        handleNextSong();
      };
      
      // Load and attempt to play
      audioRef.current.load();
      
      // Notify parent component
      onPlay(song.url);
      setSelectedSong(song);
      
    } catch (error) {
      console.error("Error setting up audio playback:", error);
      toast.error("Erro ao configurar a reprodução de áudio.");
    }
  };

  const handlePlaySong = (song: Song) => {
    // Stop any current audio playback
    stopAllAudio();
    
    playAudio(song);
  };

  const handlePauseSong = () => {
    if (audioRef.current) {
      try {
        audioRef.current.pause();
      } catch (e) {
        console.error("Error pausing audio:", e);
      }
    }
    
    onPause();
  };

  // Function to get the previous song
  const handlePreviousSong = () => {
    const currentIndex = songLibrary.findIndex(s => s.id === (currentSong?.id || selectedSong?.id));
    if (currentIndex > 0) {
      handlePlaySong(songLibrary[currentIndex - 1]);
    } else {
      // Loop to the end if at the beginning
      handlePlaySong(songLibrary[songLibrary.length - 1]);
    }
  };

  // Function to get the next song
  const handleNextSong = () => {
    const currentIndex = songLibrary.findIndex(s => s.id === (currentSong?.id || selectedSong?.id));
    if (currentIndex < songLibrary.length - 1) {
      handlePlaySong(songLibrary[currentIndex + 1]);
    } else {
      // Loop back to the beginning if at the end
      handlePlaySong(songLibrary[0]);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Music size={18} />
          Playlist Musical
          {isLoading && <span className="text-xs text-muted-foreground ml-2">(Carregando...)</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePreviousSong}
              disabled={!currentSong && !selectedSong || songLibrary.length <= 1}
            >
              <SkipBack size={16} />
            </Button>
            
            <Button
              variant={isPlaying ? "outline" : "default"}
              className="h-10 w-10 rounded-full p-0"
              onClick={() => isPlaying ? handlePauseSong() : currentSong ? handlePlaySong(currentSong) : selectedSong ? handlePlaySong(selectedSong) : null}
              disabled={!currentSong && !selectedSong || songLibrary.length <= 1}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextSong}
              disabled={!currentSong && !selectedSong || songLibrary.length <= 1}
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
          
          {error && (
            <div className="text-sm text-red-500 mb-2">{error}</div>
          )}
          
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between p-2 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-full bg-muted"></div>
                    <div>
                      <div className="h-4 w-32 bg-muted rounded"></div>
                      <div className="h-3 w-20 bg-muted rounded mt-1"></div>
                    </div>
                  </div>
                  <div className="h-3 w-8 bg-muted rounded"></div>
                </div>
              ))}
            </div>
          ) : (
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
          )}
          
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

// Fallback song library in case Jamendo API fails
const fallbackSongLibrary: Song[] = [
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

export { type Song, songLibrary };
