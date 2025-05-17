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
import { 
  playNoteSound, 
  stopAllAudio, 
  generateFallbackTone, 
  checkAudioUrl, 
  audioFallbackUrls 
} from "@/utils/audioUtils";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Audio } from "expo-av";

export interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: string; // mm:ss format
  spotifyId?: string; // Spotify track ID
  previewUrl?: string; // Spotify preview URL (30 seconds)
  albumArt?: string; // Album artwork URL
  youtubeId?: string; // YouTube video ID for reference
}

interface MusicPlaylistProps {
  onPlay: (songUrl: string) => void;
  onPause: () => void;
  currentSong: Song | null;
  isPlaying: boolean;
}

// Initial placeholder song
const initialSongLibrary: Song[] = [
  {
    id: "song-1",
    title: "Carregando músicas...",
    artist: "Aguarde",
    url: "",
    duration: "0:00",
  }
];

// Fallback song library in case Spotify API fails
const fallbackSongLibrary: Song[] = [
  {
    id: "song-1",
    title: "Atirei o Pau no Gato",
    artist: "Tradicional",
    url: audioFallbackUrls.infantil,
    duration: "1:23",
    youtubeId: "TdaqmdJKHh4"
  },
  {
    id: "song-2",
    title: "Sapo Cururu",
    artist: "Tradicional",
    url: audioFallbackUrls.infantil,
    duration: "1:12",
    youtubeId: "TdaqmdJKHh4"
  },
  {
    id: "song-3",
    title: "Ciranda, Cirandinha",
    artist: "Tradicional",
    url: audioFallbackUrls.infantil,
    duration: "1:52",
    youtubeId: "1fhx98uqOMA"
  },
  {
    id: "song-4",
    title: "O Sítio do Seu Lobato",
    artist: "Tradicional",
    url: audioFallbackUrls.infantil,
    duration: "1:30",
    youtubeId: "P0XtiCDqYr4"
  },
  {
    id: "song-5",
    title: "A Barata Diz Que Tem",
    artist: "Tradicional",
    url: audioFallbackUrls.infantil,
    duration: "1:23",
    youtubeId: "0jmKF0Um4sE"
  },
  {
    id: "song-6",
    title: "Marcha Soldado",
    artist: "Tradicional",
    url: audioFallbackUrls.infantil,
    duration: "1:05",
    youtubeId: "JOwEtUE7CZs"
  },
  {
    id: "song-7",
    title: "Boi da Cara Preta",
    artist: "Tradicional",
    url: audioFallbackUrls.infantil,
    duration: "1:18",
    youtubeId: "tzqdarqFzpw"
  },
  {
    id: "song-8",
    title: "Peixe Vivo",
    artist: "Tradicional",
    url: audioFallbackUrls.infantil,
    duration: "1:20",
    youtubeId: "NMolLPizT6U"
  },
  {
    id: "song-9",
    title: "Escravos de Jó",
    artist: "Tradicional",
    url: audioFallbackUrls.infantil,
    duration: "1:15",
    youtubeId: "Q25_4-OQ8qI"
  },
  {
    id: "song-10",
    title: "Cai, Cai Balão",
    artist: "Tradicional",
    url: audioFallbackUrls.infantil,
    duration: "1:10",
    youtubeId: "SkP6ZWY7A4w"
  },
  {
    id: "song-11",
    title: "O Cravo e a Rosa",
    artist: "Tradicional",
    url: audioFallbackUrls.infantil,
    duration: "1:25",
    youtubeId: "5Hbh_yyLSYw"
  },
  {
    id: "song-12",
    title: "Fui no Itororó",
    artist: "Tradicional",
    url: audioFallbackUrls.infantil,
    duration: "1:28",
    youtubeId: "cIIr9QLZ99w"
  },
  {
    id: "song-13",
    title: "Se Essa Rua Fosse Minha",
    artist: "Tradicional",
    url: audioFallbackUrls.infantil,
    duration: "1:32",
    youtubeId: "CS8gv_B0obA"
  },
  {
    id: "song-14",
    title: "Pirulito que Bate Bate",
    artist: "Tradicional",
    url: audioFallbackUrls.infantil,
    duration: "1:07",
    youtubeId: "QcK9cYX-YBw"
  },
  {
    id: "song-15",
    title: "A Canoa Virou",
    artist: "Tradicional",
    url: audioFallbackUrls.infantil,
    duration: "1:12",
    youtubeId: "z7LG4Q_5CSw"
  },
  {
    id: "song-16",
    title: "Indiozinhos",
    artist: "Tradicional",
    url: audioFallbackUrls.infantil,
    duration: "1:20",
    youtubeId: "pPFXOHhXGM8"
  },
  {
    id: "song-17",
    title: "A Linda Rosa Juvenil",
    artist: "Tradicional",
    url: audioFallbackUrls.infantil,
    duration: "1:45",
    youtubeId: "jUAJxDCd2Ig"
  },
  {
    id: "song-18",
    title: "Capelinha de Melão",
    artist: "Tradicional",
    url: audioFallbackUrls.infantil,
    duration: "1:15",
    youtubeId: "LCmw5g7I-1w"
  },
  {
    id: "song-19",
    title: "Nesta Rua",
    artist: "Tradicional",
    url: audioFallbackUrls.infantil,
    duration: "1:30",
    youtubeId: "BHjDUQp3GYw"
  },
  {
    id: "song-20",
    title: "O Pintinho Amarelinho",
    artist: "Tradicional",
    url: audioFallbackUrls.infantil,
    duration: "1:08",
    youtubeId: "TW6nBTg2wLA"
  },
  {
    id: "song-21",
    title: "A Galinha do Vizinho",
    artist: "Tradicional",
    url: audioFallbackUrls.infantil,
    duration: "1:05",
    youtubeId: "ODR4AjFkRw4"
  },
  {
    id: "song-22",
    title: "O Elefante",
    artist: "Xuxa",
    url: audioFallbackUrls.infantil,
    duration: "1:45",
    youtubeId: "Sz7ipJOfNK8"
  },
  {
    id: "song-23",
    title: "A Casa",
    artist: "Vinicius de Moraes",
    url: audioFallbackUrls.infantil,
    duration: "1:30",
    youtubeId: "P3GJ2BKT4fs"
  },
  {
    id: "song-24",
    title: "O Pato",
    artist: "Vinicius de Moraes",
    url: audioFallbackUrls.infantil,
    duration: "1:40",
    youtubeId: "N5JSr0J9_mY"
  },
  {
    id: "song-25",
    title: "Aquarela",
    artist: "Toquinho",
    url: audioFallbackUrls.infantil,
    duration: "2:20",
    youtubeId: "xT8HIiFQ8Y0"
  },
  {
    id: "song-26",
    title: "A Baratinha",
    artist: "Tradicional",
    url: audioFallbackUrls.infantil,
    duration: "1:15",
    youtubeId: "k5TG8HEtILg"
  },
  {
    id: "song-27",
    title: "A Dona Aranha",
    artist: "Tradicional",
    url: audioFallbackUrls.infantil,
    duration: "1:10",
    youtubeId: "MuBgIfBR1jk"
  },
  {
    id: "song-28",
    title: "A Roda do Ônibus",
    artist: "Tradicional",
    url: audioFallbackUrls.infantil,
    duration: "1:30",
    youtubeId: "7Uce9Lenk8U"
  },
  {
    id: "song-29",
    title: "Borboletinha",
    artist: "Tradicional",
    url: audioFallbackUrls.infantil,
    duration: "1:05",
    youtubeId: "QiVkWZqGvOE"
  },
  {
    id: "song-30",
    title: "Cachorrinho está latindo",
    artist: "Tradicional",
    url: audioFallbackUrls.infantil,
    duration: "1:08",
    youtubeId: "n8Q9Vvh7NhY"
  },
  {
    id: "song-31",
    title: "Caranguejo não é peixe",
    artist: "Tradicional",
    url: audioFallbackUrls.infantil,
    duration: "1:25",
    youtubeId: "WVz4oVUPJ7w"
  },
  {
    id: "song-32",
    title: "Dona Árvore",
    artist: "Palavra Cantada",
    url: audioFallbackUrls.infantil,
    duration: "1:50",
    youtubeId: "19d7M63lVGA"
  },
  {
    id: "song-33",
    title: "Eu sou pobre, pobre, pobre",
    artist: "Tradicional",
    url: audioFallbackUrls.infantil,
    duration: "1:12",
    youtubeId: "uAVUl0cAKpo"
  },
  {
    id: "song-34",
    title: "Fui ao mercado",
    artist: "Tradicional",
    url: audioFallbackUrls.infantil,
    duration: "1:15",
    youtubeId: "T1CRDrLwvkk"
  },
  {
    id: "song-35",
    title: "Gato Xadrez",
    artist: "Palavra Cantada",
    url: audioFallbackUrls.infantil,
    duration: "1:45",
    youtubeId: "vJSeVGLtAnU"
  },
  {
    id: "song-36",
    title: "O Jacaré",
    artist: "Xuxa",
    url: audioFallbackUrls.infantil,
    duration: "1:30",
    youtubeId: "8s-YmGFbwoY"
  },
  {
    id: "song-37",
    title: "O Leãozinho",
    artist: "Toquinho",
    url: audioFallbackUrls.infantil,
    duration: "2:10",
    youtubeId: "ORmIgJq6KUw"
  },
  {
    id: "song-38",
    title: "O Sapo Não Lava o Pé",
    artist: "Tradicional",
    url: audioFallbackUrls.infantil,
    duration: "1:15",
    youtubeId: "ZtFgdmQL8HA"
  },
  {
    id: "song-39",
    title: "A Canoa Virou",
    artist: "Tradicional",
    url: audioFallbackUrls.infantil,
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
  const [songLibrary, setSongLibrary] = useState<Song[]>(initialSongLibrary);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const [soundObject, setSoundObject] = useState<Audio.Sound | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  // Initialize Audio
  useEffect(() => {
    const initializeAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
        });
        console.log("Audio mode set successfully");
      } catch (error) {
        console.error("Failed to set audio mode:", error);
      }
    };

    initializeAudio();
    
    // Cleanup function
    return () => {
      if (soundObject) {
        soundObject.unloadAsync();
      }
    };
  }, []);

  // Carregar músicas
  useEffect(() => {
    setIsLoading(true);
    setSongLibrary(fallbackSongLibrary);
    setIsLoading(false);
    
    // Não estamos mais tentando carregar do Spotify já que estava falhando
  }, []);

  // Update volume
  useEffect(() => {
    const updateVolume = async () => {
      if (soundObject) {
        await soundObject.setVolumeAsync(volume / 100);
      }
    };
    
    updateVolume();
  }, [volume, soundObject]);

  const handleSelectSong = (song: Song) => {
    setSelectedSong(song);
    // Play a selection sound
    playNoteSound("C");
  };

  // Function to play audio using Web API as fallback
  const playAudioWithFallback = async (song: Song): Promise<boolean> => {
    try {
      // Try to play audio with HTML5 element
      const audioElement = new window.Audio(song.url);
      audioElement.volume = volume / 100;
      
      // Promise to load audio
      const loadPromise = new Promise<boolean>((resolve, reject) => {
        audioElement.oncanplaythrough = () => resolve(true);
        audioElement.onerror = () => reject(new Error("Error loading audio"));
        
        // Timeout to avoid infinite wait
        setTimeout(() => reject(new Error("Timeout loading audio")), 5000);
      });
      
      await loadPromise;
      await audioElement.play();
      
      onPlay(song.url);
      setSelectedSong(song);
      
      audioElement.onended = () => {
        onPause();
      };
      
      return true;
    } catch (error) {
      console.error("Error using Audio Web API, trying fallback method:", error);
      
      // If failed, use tone generator as last resort
      const success = generateFallbackTone(30000, 440); // 30 seconds duration
      
      if (success) {
        onPlay(song.url);
        setSelectedSong(song);
        
        // Simulate end of song after 30 seconds
        setTimeout(() => {
          onPause();
        }, 30000);
      }
      
      return success;
    }
  };

  // Function to play audio using Expo Audio
  const playAudio = async (song: Song) => {
    try {
      // Stop any current audio playback
      stopAllAudio();
      if (soundObject) {
        await soundObject.unloadAsync();
      }
      
      const audioUrl = song.url;
      console.log("Attempting to play:", audioUrl);
      
      if (!audioUrl) {
        throw new Error("Empty audio URL");
      }
      
      try {
        // Create a new Sound object
        const { sound } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { volume: volume / 100, shouldPlay: true },
          (status) => {
            if (status.isLoaded && status.didJustFinish) {
              console.log("Audio playback ended");
              onPause();
            }
          }
        );
        
        console.log("Audio loaded successfully");
        setSoundObject(sound);
        soundRef.current = sound;
        
        // Play the sound
        await sound.playAsync();
        console.log("Audio playback started");
        onPlay(song.url);
        setSelectedSong(song);
        setRetryCount(0); // Reset retry counter after success
        
      } catch (expoError) {
        console.error("Error with Expo Audio:", expoError);
        throw expoError; // Pass error to be handled by fallback
      }
      
    } catch (error) {
      console.error("Error setting up audio playback:", error);
      
      if (retryCount < maxRetries) {
        const newRetryCount = retryCount + 1;
        setRetryCount(newRetryCount);
        toast.error(`Attempt ${newRetryCount}/${maxRetries} failed. Trying again...`);
        
        // Wait a moment before trying again
        setTimeout(async () => {
          // Try with fallback method
          const success = await playAudioWithFallback(song);
          
          if (!success && newRetryCount === maxRetries - 1) {
            toast.error("Could not play audio after multiple attempts.");
            handleNextSong();
          }
        }, 1000);
      } else {
        toast.error("Error playing audio. Trying next song...");
        handleNextSong();
      }
    }
  };

  const handlePlaySong = (song: Song) => {
    // Stop any current audio playback
    stopAllAudio();
    
    playAudio(song);
  };

  const handlePauseSong = async () => {
    if (soundObject) {
      try {
        await soundObject.pauseAsync();
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

// Export the fallbackSongLibrary for use in other components
export { fallbackSongLibrary as songLibrary };
