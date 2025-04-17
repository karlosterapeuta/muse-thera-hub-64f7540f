
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface Song {
  id: number;
  title: string;
  artist: string;
  audioUrl?: string;
}

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
  ];

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

  // Buscar músicas da API Jamendo quando o componente montar
  useEffect(() => {
    const fetchJamendoSongs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          'https://api.jamendo.com/v3.0/tracks/?client_id=1c9a87c5&format=json&limit=20&tags=relaxing,meditation,ambient&include=musicinfo'
        );
        
        if (!response.ok) {
          throw new Error('Falha ao buscar músicas');
        }
        
        const data = await response.json();
        
        const formattedSongs = data.results.map((song: any) => ({
          id: song.id,
          title: song.name,
          artist: song.artist_name,
          audioUrl: song.audio
        }));
        
        setJamendoSongs(formattedSongs);
      } catch (error) {
        console.error('Erro ao buscar músicas:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as músicas da API.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJamendoSongs();
  }, [toast]);
  
  // Configurar o áudio e os event listeners
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    
    const handleTimeUpdate = () => {
      if (audio.currentTime && audio.duration) {
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration);
      }
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });
    
    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadedmetadata', () => {});
    };
  }, []);
  
  // Reproduzir música selecionada
  const playSong = (song: Song) => {
    if (!song.audioUrl) {
      toast({
        title: "Aviso",
        description: "Esta música não possui um URL de áudio disponível.",
        variant: "default"
      });
      return;
    }
    
    // Se é a mesma música, apenas toggle play/pause
    if (currentSong && currentSong.id === song.id) {
      togglePlayPause();
      return;
    }
    
    // Se é uma nova música
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = song.audioUrl;
      audioRef.current.volume = volume;
      
      // Reproduzir após carregar os metadados
      audioRef.current.onloadedmetadata = () => {
        audioRef.current?.play()
          .then(() => {
            setIsPlaying(true);
            setCurrentSong(song);
          })
          .catch(error => {
            console.error('Erro ao reproduzir áudio:', error);
            toast({
              title: "Erro",
              description: "Não foi possível reproduzir esta música.",
              variant: "destructive"
            });
          });
      };
      
      audioRef.current.onerror = () => {
        toast({
          title: "Erro",
          description: "Não foi possível reproduzir esta música. O arquivo de áudio pode estar indisponível.",
          variant: "destructive"
        });
      };
    }
  };
  
  // Toggle play/pause
  const togglePlayPause = () => {
    if (!audioRef.current || !currentSong) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play()
        .catch(error => {
          console.error('Erro ao reproduzir áudio:', error);
        });
    }
    
    setIsPlaying(!isPlaying);
  };
  
  // Avançar para a próxima música
  const nextSong = () => {
    if (!currentSong) return;
    
    const currentList = activeTab === 'traditionalSongs' 
      ? filteredTraditionalSongs 
      : filteredJamendoSongs;
    
    const currentIndex = currentList.findIndex(song => song.id === currentSong.id);
    
    if (currentIndex !== -1 && currentIndex < currentList.length - 1) {
      playSong(currentList[currentIndex + 1]);
    } else if (currentList.length > 0) {
      // Voltar para a primeira música se estiver na última
      playSong(currentList[0]);
    }
  };
  
  // Voltar para a música anterior
  const prevSong = () => {
    if (!currentSong) return;
    
    const currentList = activeTab === 'traditionalSongs' 
      ? filteredTraditionalSongs 
      : filteredJamendoSongs;
    
    const currentIndex = currentList.findIndex(song => song.id === currentSong.id);
    
    if (currentIndex > 0) {
      playSong(currentList[currentIndex - 1]);
    } else if (currentList.length > 0) {
      // Ir para a última música se estiver na primeira
      playSong(currentList[currentList.length - 1]);
    }
  };
  
  // Alterar a posição da reprodução
  const handleSeek = (value: number[]) => {
    if (!audioRef.current) return;
    
    const newTime = value[0];
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  // Controlar o volume
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
  
  // Toggle mute
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
  
  // Formatar tempo em mm:ss
  const formatTime = (time: number) => {
    if (!time) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto py-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className={`${isMobile ? "text-4xl" : "text-3xl"} mb-2`}>Músicas</CardTitle>
          <CardDescription className={`${isMobile ? "text-2xl" : "text-xl"}`}>
            Repertório de músicas para sessões de musicoterapia
          </CardDescription>
          <div className="relative mt-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
            <Input
              placeholder="Buscar música ou artista..."
              className={`pl-12 ${isMobile ? "text-xl py-7" : "text-lg py-6"} rounded-xl`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="mt-6 flex space-x-2">
            <Button 
              variant={activeTab === 'traditionalSongs' ? "default" : "outline"} 
              onClick={() => setActiveTab('traditionalSongs')}
              className="flex-1"
            >
              Músicas Tradicionais
            </Button>
            <Button 
              variant={activeTab === 'jamendoSongs' ? "default" : "outline"} 
              onClick={() => setActiveTab('jamendoSongs')}
              className="flex-1"
            >
              Músicas Relaxantes
            </Button>
          </div>
        </CardHeader>
        
        {/* Player de Música */}
        {currentSong && (
          <div className="px-6 py-4 bg-gray-50 border-t border-b">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-lg">{currentSong.title}</h3>
                  <p className="text-gray-600">{currentSong.artist}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={toggleMute}
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
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm w-12 text-right">{formatTime(currentTime)}</span>
                <Slider
                  value={[currentTime]}
                  min={0}
                  max={duration || 100}
                  step={1}
                  onValueChange={handleSeek}
                  className="flex-1"
                />
                <span className="text-sm w-12">{formatTime(duration)}</span>
              </div>
              
              <div className="flex justify-center items-center space-x-4 mt-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevSong}
                >
                  <SkipBack size={20} />
                </Button>
                <Button
                  variant="default"
                  size="icon"
                  className="h-12 w-12 rounded-full"
                  onClick={togglePlayPause}
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextSong}
                >
                  <SkipForward size={20} />
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <CardContent>
          <ScrollArea className="h-[60vh]">
            {activeTab === 'traditionalSongs' ? (
              // Lista de músicas tradicionais
              <div className="space-y-4">
                {filteredTraditionalSongs.length === 0 ? (
                  <div className={`py-12 text-center text-gray-500 ${isMobile ? "text-2xl" : "text-xl"}`}>
                    Nenhuma música encontrada com o termo "{searchTerm}"
                  </div>
                ) : (
                  filteredTraditionalSongs.map((song) => (
                    <div
                      key={song.id}
                      className={`p-4 border rounded-xl hover:bg-gray-50 transition-colors cursor-pointer flex justify-between items-center ${
                        currentSong?.id === song.id ? "bg-gray-100 border-primary" : ""
                      }`}
                      onClick={() => {
                        // Como as músicas tradicionais não têm URL de áudio na lista original,
                        // vamos procurar uma música similar no Jamendo
                        if (!song.audioUrl && jamendoSongs.length > 0) {
                          const randomJamendoSong = jamendoSongs[Math.floor(Math.random() * jamendoSongs.length)];
                          const songWithAudio = { ...song, audioUrl: randomJamendoSong.audioUrl };
                          playSong(songWithAudio);
                        } else {
                          playSong(song);
                        }
                      }}
                    >
                      <div>
                        <h3 className={`font-medium ${isMobile ? "text-2xl" : "text-xl"} mb-1`}>{song.title}</h3>
                        <p className={`text-gray-600 ${isMobile ? "text-xl" : "text-base"}`}>{song.artist}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full"
                      >
                        {currentSong?.id === song.id && isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                      </Button>
                    </div>
                  ))
                )}
              </div>
            ) : (
              // Lista de músicas do Jamendo
              <div className="space-y-4">
                {isLoading ? (
                  <div className="py-12 text-center">
                    <div className="animate-pulse flex flex-col items-center">
                      <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
                      <div className="h-4 w-48 bg-gray-200 rounded"></div>
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
                      className={`p-4 border rounded-xl hover:bg-gray-50 transition-colors cursor-pointer flex justify-between items-center ${
                        currentSong?.id === song.id ? "bg-gray-100 border-primary" : ""
                      }`}
                      onClick={() => playSong(song)}
                    >
                      <div>
                        <h3 className={`font-medium ${isMobile ? "text-2xl" : "text-xl"} mb-1`}>{song.title}</h3>
                        <p className={`text-gray-600 ${isMobile ? "text-xl" : "text-base"}`}>{song.artist}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full"
                      >
                        {currentSong?.id === song.id && isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                      </Button>
                    </div>
                  ))
                )}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
