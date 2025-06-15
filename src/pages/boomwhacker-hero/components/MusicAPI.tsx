
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Play, Heart, Clock, Music } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  preview_url?: string;
  image?: string;
  popularity?: number;
}

interface MusicAPIProps {
  onTrackSelect: (track: Track) => void;
  selectedTrack?: Track | null;
}

const MusicAPI: React.FC<MusicAPIProps> = ({ onTrackSelect, selectedTrack }) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiKey] = useState('456e8998507c4ce69392ec1afd8a7fb6'); // API key fornecida

  // Função para buscar músicas usando a API
  const searchTracks = async (query: string) => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      // Simular busca na API - em produção, substituir por chamada real
      // Por exemplo, para Spotify Web API ou Jamendo API
      
      // Para demonstração, vamos usar músicas infantis populares
      const demoTracks: Track[] = [
        {
          id: 'demo-1',
          title: 'Twinkle Twinkle Little Star',
          artist: 'Tradicional',
          duration: 30,
          preview_url: '/assets/music/children-song-1.mp3',
          popularity: 95
        },
        {
          id: 'demo-2',
          title: 'Happy Birthday',
          artist: 'Tradicional',
          duration: 25,
          popularity: 90
        },
        {
          id: 'demo-3',
          title: 'Old MacDonald',
          artist: 'Tradicional',
          duration: 35,
          popularity: 85
        },
        {
          id: 'demo-4',
          title: 'Mary Had a Little Lamb',
          artist: 'Tradicional',
          duration: 20,
          popularity: 80
        },
        {
          id: 'demo-5',
          title: 'Row Row Row Your Boat',
          artist: 'Tradicional',
          duration: 22,
          popularity: 75
        }
      ].filter(track => 
        track.title.toLowerCase().includes(query.toLowerCase()) ||
        track.artist.toLowerCase().includes(query.toLowerCase())
      );

      setTracks(demoTracks);
      
      if (demoTracks.length === 0) {
        toast({
          title: "Nenhuma música encontrada",
          description: "Tente buscar por 'Twinkle', 'Happy' ou 'Mary'",
        });
      }
    } catch (error) {
      console.error('Erro ao buscar músicas:', error);
      toast({
        title: "Erro na busca",
        description: "Não foi possível buscar músicas. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar músicas populares iniciais
  const loadPopularTracks = async () => {
    setLoading(true);
    try {
      // Carregar músicas populares por padrão
      const popularTracks: Track[] = [
        {
          id: 'popular-1',
          title: 'Twinkle Twinkle Little Star',
          artist: 'Tradicional',
          duration: 30,
          preview_url: '/assets/music/children-song-1.mp3',
          popularity: 95
        },
        {
          id: 'popular-2',
          title: 'Happy Birthday',
          artist: 'Tradicional',
          duration: 25,
          popularity: 90
        },
        {
          id: 'popular-3',
          title: 'Brilha Brilha Estrelinha',
          artist: 'Infantil',
          duration: 28,
          popularity: 88
        },
        {
          id: 'popular-4',
          title: 'Parabéns pra Você',
          artist: 'Infantil',
          duration: 24,
          popularity: 85
        },
        {
          id: 'popular-5',
          title: 'Escala Musical',
          artist: 'Exercício',
          duration: 15,
          popularity: 70
        }
      ];

      setTracks(popularTracks);
    } catch (error) {
      console.error('Erro ao carregar músicas populares:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar músicas populares ao inicializar
  useEffect(() => {
    loadPopularTracks();
  }, []);

  // Função para tocar preview
  const playPreview = (track: Track) => {
    if (track.preview_url) {
      const audio = new Audio(track.preview_url);
      audio.volume = 0.5;
      audio.play().catch(error => {
        console.error('Erro ao tocar preview:', error);
        toast({
          title: "Erro no áudio",
          description: "Não foi possível tocar o preview da música.",
        });
      });
    } else {
      toast({
        title: "Preview não disponível",
        description: "Esta música não possui preview disponível.",
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchTracks(searchTerm);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="w-5 h-5" />
            Buscar Músicas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Digite o nome da música ou artista..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              <Search className="w-4 h-4" />
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        {loading && (
          <div className="col-span-full text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Buscando músicas...</p>
          </div>
        )}

        {!loading && tracks.map((track) => (
          <Card 
            key={track.id}
            className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
              selectedTrack?.id === track.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
            }`}
            onClick={() => onTrackSelect(track)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg truncate">{track.title}</h3>
                  <p className="text-gray-600 truncate">{track.artist}</p>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">{track.duration}s</span>
                    
                    {track.popularity && (
                      <Badge variant="secondary" className="text-xs">
                        {track.popularity}% popular
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col gap-1 ml-2">
                  {track.preview_url && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        playPreview(track);
                      }}
                    >
                      <Play className="w-3 h-3" />
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast({
                        title: "❤️ Favoritado!",
                        description: `${track.title} foi adicionado aos favoritos.`,
                      });
                    }}
                  >
                    <Heart className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {!loading && tracks.length === 0 && (
          <div className="col-span-full text-center py-8">
            <Music className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Nenhuma música encontrada</p>
            <p className="text-sm text-gray-500">Tente buscar por músicas infantis populares</p>
          </div>
        )}
      </div>

      {selectedTrack && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Música Selecionada:</h4>
                <p className="text-lg">{selectedTrack.title}</p>
                <p className="text-gray-600">{selectedTrack.artist}</p>
              </div>
              <Badge variant="default">Pronto para jogar!</Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MusicAPI;
