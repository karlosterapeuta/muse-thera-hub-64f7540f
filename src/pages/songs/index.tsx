import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Shuffle, Repeat } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface Song {
  id: number;
  title: string;
  artist: string;
  audioUrl?: string;
  fallbackUrls?: string[];
}

const traditionalSongUrls = [
  "https://assets.mixkit.co/music/preview/mixkit-sweet-and-sour-keys-846.mp3",
  "https://assets.mixkit.co/music/preview/mixkit-piano-reflections-22.mp3",
  "https://assets.mixkit.co/music/preview/mixkit-life-is-a-dream-837.mp3",
  "https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3",
  "https://assets.mixkit.co/music/preview/mixkit-just-kidding-13.mp3",
  "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3",
  "https://assets.mixkit.co/music/preview/mixkit-sun-and-his-daughter-580.mp3",
  "https://assets.mixkit.co/music/preview/mixkit-piano-in-the-forest-548.mp3",
  "https://assets.mixkit.co/music/preview/mixkit-feeling-happy-5.mp3",
  "https://assets.mixkit.co/music/preview/mixkit-forest-treasure-138.mp3",
  "https://assets.mixkit.co/music/preview/mixkit-dreaming-big-31.mp3",
  "https://assets.mixkit.co/music/preview/mixkit-deep-urban-623.mp3",
  "https://assets.mixkit.co/music/preview/mixkit-a-very-happy-christmas-51.mp3",
  "https://assets.mixkit.co/music/preview/mixkit-spirit-889.mp3",
  "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3",
];

const fallbackSongUrls = [
  "https://file-examples.com/storage/fe03845071696b0f59a7ee1/2017/11/file_example_MP3_700KB.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
];

const musicApiEndpoints = [
  "https://assets.mixkit.co/sfx/download/mixkit-rain-ambience-light-1252.mp3",
  "https://assets.mixkit.co/sfx/download/mixkit-sea-waves-ambience-1189.mp3",
  "https://assets.mixkit.co/sfx/download/mixkit-campfire-crackles-1330.mp3",
  "https://assets.mixkit.co/sfx/download/mixkit-forest-birds-ambience-1210.mp3",
  "https://assets.mixkit.co/sfx/download/mixkit-morning-birds-singing-2472.mp3",
  "https://assets.mixkit.co/sfx/download/mixkit-small-stream-running-loop-1248.mp3",
  "https://assets.mixkit.co/sfx/download/mixkit-meditation-bell-595.mp3",
  "https://assets.mixkit.co/sfx/download/mixkit-rain-and-thunder-storm-2390.mp3",
  "https://assets.mixkit.co/sfx/download/mixkit-dense-static-noise-2132.mp3",
  "https://assets.mixkit.co/sfx/download/mixkit-crickets-and-insects-in-the-wild-ambience-58.mp3",
];

// This check is updated to avoid no-cors to prevent CORS issues
const checkAudioUrl = async (url: string): Promise<boolean> => {
  try {
    // Just do a simple HEAD request without no-cors to properly detect errors
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error(`URL inacessível: ${url}`, error);
    return false;
  }
};

export default function SongsPage() {
  const songs: Song[] = [
    { id: 1, title: "Atirei o Pau no Gato", artist: "Tradicional" },
    { id: 2, title: "Sapo Cururu", artist: "Tradicional" },
    { id: 3, title: "Ciranda, Cirandinha", artist: "Tradicional" },
    { id: 4, title: "O Sítio do Seu Lobato", artist: "Tradicional" },
    { id: 5, title: "A Barata Diz Que Tem", artist: "Tradicional" },
    { id: 6, title: "Marcha Soldado", artist: "Tradicional" },
    { id: 7, title: "Boi da Cara Preta", artist: "Tradicional" },
    { id: 8, title: "Peixe Vivo", artist: "Tradicional" },
    { id: 9, title: "Escravos de Jó", artist: "Tradicional" },
    { id: 10, title: "Cai, Cai Balão", artist: "Tradicional" },
    { id: 11, title: "O Cravo e a Rosa", artist: "Tradicional" },
    { id: 12, title: "Fui no Itororó", artist: "Tradicional" },
    { id: 13, title: "Se Essa Rua Fosse Minha", artist: "Tradicional" },
    { id: 14, title: "Pirulito que Bate Bate", artist: "Tradicional" },
    { id: 15, title: "A Canoa Virou", artist: "Tradicional" },
    { id: 16, title: "Indiozinhos", artist: "Tradicional" },
    { id: 17, title: "A Linda Rosa Juvenil", artist: "Tradicional" },
    { id: 18, title: "Capelinha de Melão", artist: "Tradicional" },
    { id: 19, title: "Nesta Rua", artist: "Tradicional" },
    { id: 20, title: "O Pintinho Amarelinho", artist: "Tradicional" },
    { id: 21, title: "A Galinha do Vizinho", artist: "Tradicional" },
    { id: 22, title: "O Elefante", artist: "Xuxa" },
    { id: 23, title: "A Casa", artist: "Vinicius de Moraes" },
    { id: 24, title: "O Pato", artist: "Vinicius de Moraes" },
    { id: 25, title: "Aquarela", artist: "Toquinho" },
    { id: 26, title: "A Baratinha", artist: "Tradicional" },
    { id: 27, title: "A Dona Aranha", artist: "Adaptação em português" },
    { id: 28, title: "A Roda do Ônibus", artist: "Adaptação em português" },
    { id: 29, title: "Borboletinha", artist: "Tradicional" },
    { id: 30, title: "Cachorrinho está latindo", artist: "Tradicional" },
    { id: 31, title: "Caranguejo não é peixe", artist: "Tradicional" },
    { id: 32, title: "Dona Árvore", artist: "Palavra Cantada" },
    { id: 33, title: "Eu sou pobre, pobre, pobre", artist: "Tradicional" },
    { id: 34, title: "Fui ao mercado", artist: "Tradicional" },
    { id: 35, title: "Gato Xadrez", artist: "Palavra Cantada" },
    { id: 36, title: "O Jacaré", artist: "Xuxa" },
    { id: 37, title: "O Leãozinho", artist: "Toquinho" },
    { id: 38, title: "O Sapo Não Lava o Pé", artist: "Tradicional" },
    { id: 39, title: "A Canoa Virou", artist: "Tradicional" },
  ].map((song, index) => ({
    ...song,
    audioUrl: traditionalSongUrls[index % traditionalSongUrls.length],
    fallbackUrls: [
      fallbackSongUrls[index % fallbackSongUrls.length],
      ...traditionalSongUrls.filter((_, i) => i !== index % traditionalSongUrls.length).slice(0, 2)
    ]
  }));

  const [searchTerm, setSearchTerm] = useState("");
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [jamendoSongs, setJamendoSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'traditionalSongs' | 'jamendoSongs'>('traditionalSongs');
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [preloadedSongs, setPreloadedSongs] = useState<{[id: number]: HTMLAudioElement}>({});
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  const [failedUrls, setFailedUrls] = useState<Set<string>>(new Set());
  const [isChangingTrack, setIsChangingTrack] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const filteredTraditionalSongs = songs.filter(song => 
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredJamendoSongs = jamendoSongs.filter(song => 
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Define the nextSong function with useCallback before it's used
  const nextSong = useCallback(() => {
    if (!currentSong) return;
    
    // Set flag to prevent audio conflicts during track change
    setIsChangingTrack(true);
    
    // Stop current audio playback
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    const currentList = activeTab === 'traditionalSongs' 
      ? filteredTraditionalSongs 
      : filteredJamendoSongs;
    
    if (currentList.length === 0) {
      setIsChangingTrack(false);
      return;
    }
    
    // Add small delay to ensure audio contexts are properly cleaned up
    setTimeout(() => {
      if (isShuffle) {
        const randomIndex = Math.floor(Math.random() * currentList.length);
        playSong(currentList[randomIndex]);
      } else {
        const currentIndex = currentList.findIndex(song => song.id === currentSong.id);
        
        if (currentIndex !== -1 && currentIndex < currentList.length - 1) {
          playSong(currentList[currentIndex + 1]);
        } else if (currentList.length > 0) {
          playSong(currentList[0]);
        }
      }
      
      setIsChangingTrack(false);
    }, 100);
  }, [currentSong, activeTab, filteredTraditionalSongs, filteredJamendoSongs, isShuffle]);

  // Define the prevSong function with useCallback
  const prevSong = useCallback(() => {
    if (!currentSong) return;
    
    // Set flag to prevent audio conflicts during track change
    setIsChangingTrack(true);
    
    // Stop current audio playback
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    const currentList = activeTab === 'traditionalSongs' 
      ? filteredTraditionalSongs 
      : filteredJamendoSongs;
      
    if (currentList.length === 0) {
      setIsChangingTrack(false);
      return;
    }
    
    // Add small delay to ensure audio contexts are properly cleaned up
    setTimeout(() => {
      if (isShuffle) {
        const randomIndex = Math.floor(Math.random() * currentList.length);
        playSong(currentList[randomIndex]);
      } else {
        const currentIndex = currentList.findIndex(song => song.id === currentSong.id);
        
        if (currentIndex > 0) {
          playSong(currentList[currentIndex - 1]);
        } else if (currentList.length > 0) {
          playSong(currentList[currentList.length - 1]);
        }
      }
      
      setIsChangingTrack(false);
    }, 100);
  }, [currentSong, activeTab, filteredTraditionalSongs, filteredJamendoSongs, isShuffle]);

  const togglePlayPause = useCallback(() => {
    if (!audioRef.current || !currentSong) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Clear any existing play/pause errors by stopping and starting fresh
      const currentTime = audioRef.current.currentTime;
      
      audioRef.current.pause();
      
      // Small timeout to ensure the pause completes before play
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.currentTime = currentTime;
          
          audioRef.current.play()
            .then(() => {
              setIsPlaying(true);
            })
            .catch(error => {
              console.error('Erro ao reproduzir áudio:', error);
              
              if (currentSong.audioUrl) {
                toast({
                  title: "Reconectando",
                  description: "Tentando restabelecer a reprodução...",
                  variant: "default"
                });
                
                // Retry with fallback URL if available
                if (currentSong.fallbackUrls && currentSong.fallbackUrls.length > 0) {
                  const fallbackUrl = currentSong.fallbackUrls[0];
                  audioRef.current!.src = fallbackUrl;
                  audioRef.current!.load();
                  audioRef.current!.play()
                    .then(() => setIsPlaying(true))
                    .catch(e2 => {
                      console.error('Falha ao tentar URL alternativa:', e2);
                      toast({
                        title: "Erro de Reprodução",
                        description: "Não foi possível iniciar a reprodução. Tente outra música.",
                        variant: "destructive"
                      });
                    });
                }
              }
            });
        }
      }, 100);
    }
  }, [currentSong, isPlaying, toast]);

  // Preload songs effect
  useEffect(() => {
    const preloadSongs = () => {
      // Clean up existing preloaded songs to prevent memory leaks
      Object.values(preloadedSongs).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      
      const preloadCache: {[id: number]: HTMLAudioElement} = {};
      
      const songsToPreload = [
        ...filteredTraditionalSongs.slice(0, 5),
        ...filteredJamendoSongs.slice(0, 5)
      ];
      
      songsToPreload.forEach(song => {
        if (!song.audioUrl) return;
        
        try {
          if (failedUrls.has(song.audioUrl)) {
            const validFallbackUrl = song.fallbackUrls?.find(url => !failedUrls.has(url));
            if (!validFallbackUrl) return;
            
            const audio = new Audio();
            audio.preload = "metadata"; // Only load metadata at first to reduce bandwidth
            audio.src = validFallbackUrl;
            audio.load();
            preloadCache[song.id] = audio;
          } else {
            const audio = new Audio();
            audio.preload = "metadata";
            audio.src = song.audioUrl;
            audio.load();
            preloadCache[song.id] = audio;
          }
        } catch (error) {
          console.error(`Erro ao precarregar música ${song.id}:`, error);
        }
      });
      
      setPreloadedSongs(preloadCache);
    };
    
    if (filteredTraditionalSongs.length > 0 || filteredJamendoSongs.length > 0) {
      preloadSongs();
    }
    
    return () => {
      Object.values(preloadedSongs).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, [filteredTraditionalSongs.slice(0, 5), filteredJamendoSongs.slice(0, 5), failedUrls]);

  // Initialize audio element and set up event listeners
  useEffect(() => {
    // Cleanup the previous audio element if it exists
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      
      // Remove event listeners from the previous audio element
      audioRef.current.removeEventListener('timeupdate', () => {});
      audioRef.current.removeEventListener('ended', () => {});
      audioRef.current.removeEventListener('loadedmetadata', () => {});
      audioRef.current.removeEventListener('error', () => {});
    }
    
    const audio = new Audio();
    audio.volume = volume;
    audioRef.current = audio;
    
    const handleTimeUpdate = () => {
      if (audio.currentTime && audio.duration) {
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration);
      }
    };
    
    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play().catch(error => {
          console.error('Erro ao repetir áudio:', error);
        });
      } else {
        setIsPlaying(false);
        setCurrentTime(0);
        setTimeout(() => nextSong(), 500);
      }
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });
    
    audio.addEventListener('error', (e) => {
      console.error('Erro de áudio:', e);
      
      // Don't try fallbacks if we're actively changing tracks
      if (isChangingTrack) return;
      
      if (currentSong && currentSong.fallbackUrls && currentSong.fallbackUrls.length > 0) {
        if (audio.src) {
          setFailedUrls(prev => new Set([...prev, audio.src]));
        }
        
        const nextUrlIndex = currentUrlIndex + 1;
        if (nextUrlIndex < currentSong.fallbackUrls.length) {
          setCurrentUrlIndex(nextUrlIndex);
          const nextUrl = currentSong.fallbackUrls[nextUrlIndex];
          
          toast({
            title: "Tentando novamente",
            description: "Usando fonte alternativa para esta música...",
            variant: "default"
          });
          
          // Use a small timeout to ensure proper audio context cleanup
          setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.src = nextUrl;
              audioRef.current.load();
              audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch((error) => {
                  console.error('Erro ao usar URL de fallback:', error);
                  
                  if (failedUrls.has(nextUrl)) {
                    toast({
                      title: "Erro",
                      description: "Não foi possível reproduzir esta música. Tentando próxima...",
                      variant: "destructive"
                    });
                    
                    setTimeout(() => nextSong(), 1000);
                  } else {
                    setFailedUrls(prev => new Set([...prev, nextUrl]));
                    toast({
                      title: "Erro",
                      description: "Não foi possível reproduzir esta música. O arquivo de áudio pode estar indisponível.",
                      variant: "destructive"
                    });
                  }
                });
            }
          }, 100);
        } else {
          toast({
            title: "Erro",
            description: "Não foi possível reproduzir esta música. Tentando próxima...",
            variant: "destructive"
          });
          
          setTimeout(() => nextSong(), 1000);
        }
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível reproduzir esta música. Tentando próxima...",
          variant: "destructive"
        });
        
        setTimeout(() => nextSong(), 1000);
      }
    });
    
    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadedmetadata', () => {});
      audio.removeEventListener('error', () => {});
    };
  }, [toast, isRepeat, currentSong, currentUrlIndex, nextSong, volume, isChangingTrack, failedUrls]);

  // Fetch jamendo songs (relaxing music) on component mount
  useEffect(() => {
    const fetchFreeMusicSongs = async () => {
      try {
        setIsLoading(true);
        
        const fallbackSongs = [
          { id: 1001, title: "Peaceful Piano", artist: "Relaxing Music", audioUrl: "https://assets.mixkit.co/music/preview/mixkit-dreaming-big-31.mp3" },
          { id: 1002, title: "Meditation Sounds", artist: "Calm Waves", audioUrl: "https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3" },
          { id: 1003, title: "Nature Ambience", artist: "Zen Garden", audioUrl: "https://assets.mixkit.co/music/preview/mixkit-spirit-889.mp3" },
          { id: 1004, title: "Healing Tones", artist: "Sound Therapy", audioUrl: "https://assets.mixkit.co/music/preview/mixkit-just-kidding-13.mp3" },
          { id: 1005, title: "Deep Sleep", artist: "Relaxation Aid", audioUrl: "https://assets.mixkit.co/music/preview/mixkit-piano-reflections-22.mp3" },
          { id: 1006, title: "Ambient Rain", artist: "Nature Sounds", audioUrl: musicApiEndpoints[0] },
          { id: 1007, title: "Ocean Waves", artist: "Sea Sounds", audioUrl: musicApiEndpoints[1] },
          { id: 1008, title: "Fireplace Crackling", artist: "Cozy Ambience", audioUrl: musicApiEndpoints[2] },
          { id: 1009, title: "Forest Birds", artist: "Natural World", audioUrl: musicApiEndpoints[3] },
          { id: 1010, title: "Morning Birdsong", artist: "Dawn Chorus", audioUrl: musicApiEndpoints[4] }
        ].map(song => ({
          ...song,
          fallbackUrls: [
            ...fallbackSongUrls,
            ...traditionalSongUrls.slice(0, 3)
          ]
        }));
        
        setJamendoSongs(fallbackSongs);
        toast({
          title: "Músicas Carregadas",
          description: "Utilizando músicas gratuitas para sua sessão de musicoterapia.",
          variant: "default"
        });
      } catch (error) {
        console.error('Erro ao buscar músicas:', error);
        toast({
          title: "Informação",
          description: "Usando músicas de demonstração devido a limitações da API.",
          variant: "default"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFreeMusicSongs();
  }, [toast]);

  // Improved playSong function
  const playSong = useCallback((song: Song) => {
    if (!song.audioUrl && (!song.fallbackUrls || song.fallbackUrls.length === 0)) {
      toast({
        title: "Aviso",
        description: "Esta música não possui um URL de áudio disponível.",
        variant: "default"
      });
      return;
    }
    
    // If same song is selected, just toggle play/pause
    if (currentSong && currentSong.id === song.id) {
      togglePlayPause();
      return;
    }
    
    // Reset URL index when starting a new song
    setCurrentUrlIndex(0);
    
    // First, safely stop any current playback
    if (audioRef.current) {
      setIsChangingTrack(true);
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    // Set the current song immediately so UI updates
    setCurrentSong(song);
    
    // Use a small timeout to ensure clean audio context
    setTimeout(() => {
      const preloadedAudio = preloadedSongs[song.id];
      
      if (preloadedAudio) {
        // Use the preloaded audio if available
        audioRef.current = preloadedAudio;
        audioRef.current.volume = volume;
        
        // Set the current time to 0 to ensure playing from the beginning
        audioRef.current.currentTime = 0;
        
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setCurrentTime(audioRef.current!.currentTime);
            setDuration(audioRef.current!.duration);
            setIsChangingTrack(false);
          })
          .catch(error => {
            console.error('Erro ao reproduzir áudio precarregado:', error);
            fallbackPlayMethod(song);
          });
      } else {
        fallbackPlayMethod(song);
      }
    }, 100);
  }, [currentSong, preloadedSongs, volume, togglePlayPause]);

  // Separate fallback method for song playback
  const fallbackPlayMethod = useCallback((song: Song) => {
    setIsChangingTrack(true);
    
    if (!audioRef.current) {
      setIsChangingTrack(false);
      return;
    }
    
    let audioUrl = song.audioUrl;
    
    // Check if the primary URL failed and try a fallback
    if (audioUrl && failedUrls.has(audioUrl) && song.fallbackUrls && song.fallbackUrls.length > 0) {
      const validFallbackUrl = song.fallbackUrls.find(url => !failedUrls.has(url));
      if (validFallbackUrl) {
        audioUrl = validFallbackUrl;
      }
    }
    
    if (!audioUrl) {
      toast({
        title: "Erro",
        description: "Não há URL de áudio válida para esta música.",
        variant: "destructive"
      });
      setIsChangingTrack(false);
      return;
    }
    
    // Create a new audio element to avoid state conflicts
    const newAudio = new Audio();
    newAudio.volume = volume;
    newAudio.src = audioUrl;
    
    // Update reference to the new audio element
    audioRef.current = newAudio;
    
    toast({
      title: "Carregando",
      description: "Aguarde enquanto carregamos a música...",
      variant: "default"
    });
    
    // Play when metadata is loaded
    newAudio.onloadedmetadata = () => {
      newAudio.play()
        .then(() => {
          setIsPlaying(true);
          setCurrentTime(newAudio.currentTime);
          setDuration(newAudio.duration);
          setIsChangingTrack(false);
        })
        .catch(error => {
          console.error('Erro ao reproduzir áudio:', error);
          
          if (song.fallbackUrls && song.fallbackUrls.length > 0) {
            if (audioUrl) {
              setFailedUrls(prev => new Set([...prev, audioUrl]));
            }
            
            const fallbackUrl = song.fallbackUrls[0];
            toast({
              title: "Tentando alternativa",
              description: "Usando fonte alternativa para esta música...",
              variant: "default"
            });
            
            // Try with the first fallback URL
            newAudio.src = fallbackUrl;
            newAudio.load();
            
            // Wait a small moment before trying to play again
            setTimeout(() => {
              newAudio.play()
                .then(() => {
                  setIsPlaying(true);
                  setCurrentTime(newAudio.currentTime);
                  setDuration(newAudio.duration);
                  setIsChangingTrack(false);
                })
                .catch(e => {
                  console.error('Falha ao tentar URL alternativa:', e);
                  setFailedUrls(prev => new Set([...prev, fallbackUrl]));
                  toast({
                    title: "Erro de Reprodução",
                    description: "Não foi possível iniciar a reprodução. Tente outra música.",
                    variant: "destructive"
                  });
                  setIsChangingTrack(false);
                });
            }, 100);
          } else {
            toast({
              title: "Erro de Reprodução",
              description: "Não foi possível iniciar a reprodução. Tente outra música.",
              variant: "destructive"
            });
            setIsChangingTrack(false);
          }
        });
    };
    
    // Handle errors when loading metadata
    newAudio.onerror = () => {
      if (audioUrl) {
        setFailedUrls(prev => new Set([...prev, audioUrl]));
      }
      
      // Try with fallback URLs if available
      if (song.fallbackUrls && song.fallbackUrls.length > 0) {
        const fallbackUrl = song.fallbackUrls[0];
        
        if (!failedUrls.has(fallbackUrl)) {
          toast({
            title: "Tentando alternativa",
            description: "Usando fonte alternativa para esta música...",
            variant: "default"
          });
          
          newAudio.src = fallbackUrl;
          newAudio.load();
          
          // Try to play after a small delay
          setTimeout(() => {
            newAudio.play()
              .then(() => {
                setIsPlaying(true);
                setCurrentTime(newAudio.currentTime);
                setDuration(newAudio.duration);
                setIsChangingTrack(false);
              })
              .catch(e => {
                console.error('Falha ao tentar URL alternativa:', e);
                setFailedUrls(prev => new Set([...prev, fallbackUrl]));
                toast({
                  title: "Erro de Reprodução",
                  description: "Não foi possível iniciar a reprodução. Tente outra música.",
                  variant: "destructive"
                });
                setIsChangingTrack(false);
              });
          }, 100);
        } else {
          toast({
            title: "Erro",
            description: "Não foi possível reproduzir esta música. Tentando próxima...",
            variant: "destructive"
          });
          setIsChangingTrack(false);
          setTimeout(() => nextSong(), 1000);
        }
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível reproduzir esta música. O arquivo de áudio pode estar indisponível.",
          variant: "destructive"
        });
        setIsChangingTrack(false);
      }
    };
    
    // Start loading the audio file
    newAudio.load();
  }, [failedUrls, toast, volume, nextSong]);

  const handleSeek = (value: number[]) => {
    if (!audioRef.current) return;
    
    const newTime = value[0];
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    if (!audioRef.current) return;
    
    const newVolume = value[0];
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    
    if (isMuted) {
      audioRef.current.volume = volume > 0 ? volume : 0.7;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
    toast({
      title: isShuffle ? "Shuffle desativado" : "Shuffle ativado",
      description: isShuffle ? "As músicas serão reproduzidas em ordem" : "As músicas serão reproduzidas aleatoriamente",
      variant: "default"
    });
  };

  const toggleRepeat = () => {
    setIsRepeat(!isRepeat);
    
    if (audioRef.current) {
      audioRef.current.loop = !isRepeat;
    }
    
    toast({
      title: isRepeat ? "Repetição desativada" : "Repetição ativada",
      description: isRepeat ? "A música não será repetida" : "A música atual será repetida",
      variant: "default"
    });
  };

  const formatTime = (time: number) => {
    if (!time) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto py-6">
      <Card className="bg-[#121212] border-0 shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-b from-[#1A1F2C] to-[#121212] pb-2">
          <CardTitle className={`${isMobile ? "text-4xl" : "text-3xl"} mb-2 text-white`}>Músicas</CardTitle>
          <CardDescription className={`${isMobile ? "text-2xl" : "text-xl"} text-gray-300`}>
            Repertório de músicas para sessões de musicoterapia
          </CardDescription>
          <div className="relative mt-6">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search size={24} />
            </div>
            <Input
              placeholder="Buscar música ou artista..."
              className={`pl-12 ${isMobile ? "text-xl py-7" : "text-lg py-6"} rounded-full bg-[#2A2A2A] border-0 text-white placeholder:text-gray-400 focus:ring-[#1DB954] focus:ring-2`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Tabs 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as 'traditionalSongs' | 'jamendoSongs')} 
            className="mt-6"
          >
            <TabsList className="grid w-full grid-cols-2 bg-[#2A2A2A] p-1 rounded-full">
              <TabsTrigger 
                value="traditionalSongs" 
                className="rounded-full data-[state=active]:bg-[#1DB954] data-[state=active]:text-white"
              >
                Músicas Tradicionais
              </TabsTrigger>
              <TabsTrigger 
                value="jamendoSongs" 
                className="rounded-full data-[state=active]:bg-[#1DB954] data-[state=active]:text-white"
              >
                Músicas Relaxantes
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        {currentSong && (
          <div className="px-6 py-4 bg-[#181818] border-t border-[#282828]">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-lg text-white">{currentSong.title}</h3>
                  <p className="text-gray-400">{currentSong.artist}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleMute}
                    className="text-gray-400 hover:text-white hover:bg-[#282828]"
                  >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </Button>
                  <div className="w-24 hidden md:block">
                    <Slider
                      value={[isMuted ? 0 : volume]}
                      min={0}
                      max={1}
                      step={0.01}
                      onValueChange={handleVolumeChange}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm w-12 text-right text-gray-400">{formatTime(currentTime)}</span>
                <div className="flex-1">
                  <Progress 
                    value={(currentTime / duration) * 100} 
                    className="h-2 cursor-pointer bg-[#5e5e5e]"
                    onClick={(e) => {
                      if (!audioRef.current || !duration) return;
                      
                      const progressBar = e.currentTarget;
                      const rect = progressBar.getBoundingClientRect();
                      const percentage = (e.clientX - rect.left) / rect.width;
                      const newTime = percentage * duration;
                      
                      audioRef.current.currentTime = newTime;
                      setCurrentTime(newTime);
                    }}
                  />
                </div>
                <span className="text-sm w-12 text-gray-400">{formatTime(duration)}</span>
              </div>
              
              <div className="flex justify-center items-center space-x-4 mt-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleShuffle}
                  className={`text-gray-400 hover:text-white hover:bg-[#282828] ${isShuffle ? 'text-[#1DB954]' : ''}`}
                >
                  <Shuffle size={20} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevSong}
                  className="text-gray-400 hover:text-white hover:bg-[#282828]"
                  disabled={isChangingTrack}
                >
                  <SkipBack size={20} />
                </Button>
                <Button
                  variant="default"
                  size="icon"
                  className="h-12 w-12 rounded-full bg-[#1DB954] hover:bg-[#1ED760] text-black"
                  onClick={togglePlayPause}
                  disabled={isChangingTrack}
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextSong}
                  className="text-gray-400 hover:text-white hover:bg-[#282828]"
                  disabled={isChangingTrack}
                >
                  <SkipForward size={20} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleRepeat}
                  className={`text-gray-400 hover:text-white hover:bg-[#282828] ${isRepeat ? 'text-[#1DB954]' : ''}`}
                >
                  <Repeat size={20} />
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'traditionalSongs' | 'jamendoSongs')}>
            <TabsContent value="traditionalSongs" className="m-0">
              <ScrollArea className="h-[60vh] bg-[#121212]">
                <div className="space-y-1 p-4">
                  {filteredTraditionalSongs.length === 0 ? (
                    <div className={`py-12 text-center text-gray-500 ${isMobile ? "text-2xl" : "text-xl"}`}>
                      Nenhuma música encontrada com o termo "{searchTerm}"
                    </div>
                  ) : (
                    filteredTraditionalSongs.map((song) => (
                      <div
                        key={song.id}
                        className={`p-3 hover:bg-[#282828] transition-colors cursor-pointer rounded-md flex justify-between items-center group ${
                          currentSong?.id === song.id ? "bg-[#282828]" : ""
                        }`}
                        onClick={() => playSong(song)}
                      >
                        <div className="flex items-center">
                          <div className="relative w-10 h-10 mr-4 flex items-center justify-center bg-[#333] rounded-md">
                            {(currentSong?.id === song.id && isPlaying) ? (
                              <div className="w-6 h-6 flex items-center justify-center">
                                <span className="animate-pulse block w-1 h-1 mx-[1px] bg-[#1DB954] rounded-full"></span>
                                <span className="animate-pulse block w-1 h-2 mx-[1px] bg-[#1DB954] rounded-full delay-75"></span>
                                <span className="animate-pulse block w-1 h-3 mx-[1px] bg-[#1DB954] rounded-full delay-150"></span>
                              </div>
                            ) : (
                              <Play size={18} className="ml-0.5 opacity-0 group-hover:opacity-100 text-white" />
                            )}
                          </div>
                          <div>
                            <h3 className={`font-medium ${isMobile ? "text-xl" : "text-base"} mb-1 text-white`}>
                              {song.title}
                            </h3>
                            <p className={`${isMobile ? "text-lg" : "text-sm"} text-gray-400`}>
                              {song.artist}
                            </p>
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100">
                          {currentSong?.id === song.id && (
                            <div className="w-2 h-2 bg-[#1DB954] rounded-full"></div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="jamendoSongs" className="m-0">
              <ScrollArea className="h-[60vh] bg-[#121212]">
                <div className="space-y-1 p-4">
                  {isLoading ? (
                    <div className="py-12 text-center">
                      <div className="animate-pulse flex flex-col items-center">
                        <div className="h-8 w-64 bg-[#333] rounded mb-4"></div>
                        <div className="h-4 w-48 bg-[#333] rounded"></div>
                      </div>
                    </div>
                  ) : filteredJamendoSongs.length === 0 ? (
                    <div className={`py-12 text-center text-gray-500 ${isMobile ? "text-2xl" : "text-xl"}`}>
                      Nenhuma música encontrada com o termo "{searchTerm}"
                    </div>
                  ) : (
                    filteredJamendoSongs.map((song) => (
                      <div
                        key={song.id}
                        className={`p-3 hover:bg-[#282828] transition-colors cursor-pointer rounded-md flex justify-between items-center group ${
                          currentSong?.id === song.id ? "bg-[#282828]" : ""
                        }`}
                        onClick={() => playSong(song)}
                      >
                        <div className="flex items-center">
                          <div className="relative w-10 h-10 mr-4 flex items-center justify-center bg-[#333] rounded-md">
                            {(currentSong?.id === song.id && isPlaying) ? (
                              <div className="w-6 h-6 flex items-center justify-center">
                                <span className="animate-pulse block w-1 h-1 mx-[1px] bg-[#1DB954] rounded-full"></span>
                                <span className="animate-pulse block w-1 h-2 mx-[1px] bg-[#1DB954] rounded-full delay-75"></span>
                                <span className="animate-pulse block w-1 h-3 mx-[1px] bg-[#1DB954] rounded-full delay-150"></span>
                              </div>
                            ) : (
                              <Play size={18} className="ml-0.5 opacity-0 group-hover:opacity-100 text-white" />
                            )}
                          </div>
                          <div>
                            <h3 className={`font-medium ${isMobile ? "text-xl" : "text-base"} mb-1 text-white`}>
                              {song.title}
                            </h3>
                            <p className={`${isMobile ? "text-lg" : "text-sm"} text-gray-400`}>
                              {song.artist}
                            </p>
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100">
                          {currentSong?.id === song.id && (
                            <div className="w-2 h-2 bg-[#1DB954] rounded-full"></div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
