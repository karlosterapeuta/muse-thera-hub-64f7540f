
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Play, Heart, Clock, Music, Volume2, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  preview_url?: string;
  image?: string;
  popularity?: number;
  external_url?: string;
  source: 'spotify' | 'jamendo' | 'demo';
  bpm?: number;
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
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null);
  const [apiSource, setApiSource] = useState<'spotify' | 'jamendo' | 'demo'>('demo');

  // Spotify API credentials - substitua pelos seus
  const SPOTIFY_CLIENT_ID = '456e8998507c4ce69392ec1afd8a7fb6';
  const SPOTIFY_CLIENT_SECRET = 'YOUR_SPOTIFY_CLIENT_SECRET'; // Adicione sua chave secreta

  // Obter token do Spotify
  const getSpotifyToken = async () => {
    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)
        },
        body: 'grant_type=client_credentials'
      });

      if (!response.ok) {
        throw new Error('Failed to get Spotify token');
      }

      const data = await response.json();
      setSpotifyToken(data.access_token);
      return data.access_token;
    } catch (error) {
      console.error('Spotify token error:', error);
      toast({
        title: "Erro do Spotify",
        description: "Não foi possível conectar ao Spotify. Usando modo demo.",
      });
      return null;
    }
  };

  // Buscar no Spotify
  const searchSpotify = async (query: string): Promise<Track[]> => {
    try {
      let token = spotifyToken;
      if (!token) {
        token = await getSpotifyToken();
        if (!token) return [];
      }

      const searchParams = new URLSearchParams({
        q: `${query} genre:children OR ${query} kids`,
        type: 'track',
        market: 'BR',
        limit: '20'
      });

      const response = await fetch(`https://api.spotify.com/v1/search?${searchParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Spotify search failed');
      }

      const data = await response.json();
      
      return data.tracks.items.map((item: any) => ({
        id: item.id,
        title: item.name,
        artist: item.artists[0]?.name || 'Artista Desconhecido',
        duration: Math.floor(item.duration_ms / 1000),
        preview_url: item.preview_url,
        image: item.album.images[0]?.url,
        popularity: item.popularity,
        external_url: item.external_urls.spotify,
        source: 'spotify' as const,
        bpm: undefined // Seria necessário uma segunda chamada para audio-features
      }));
    } catch (error) {
      console.error('Spotify search error:', error);
      return [];
    }
  };

  // Buscar no Jamendo
  const searchJamendo = async (query: string): Promise<Track[]> => {
    try {
      const searchParams = new URLSearchParams({
        client_id: 'YOUR_JAMENDO_CLIENT_ID', // Substitua pela sua chave do Jamendo
        format: 'json',
        namesearch: query,
        limit: '20',
        tags: 'children,kids,instrumental',
        audioformat: 'mp31'
      });

      const response = await fetch(`https://api.jamendo.com/v3.0/tracks/?${searchParams}`);
      
      if (!response.ok) {
        throw new Error('Jamendo search failed');
      }

      const data = await response.json();
      
      return data.results.map((item: any) => ({
        id: item.id.toString(),
        title: item.name,
        artist: item.artist_name,
        duration: item.duration,
        preview_url: item.audio,
        image: item.album_image,
        popularity: Math.floor(Math.random() * 100), // Jamendo não tem popularity score
        external_url: item.shareurl,
        source: 'jamendo' as const,
        bpm: undefined
      }));
    } catch (error) {
      console.error('Jamendo search error:', error);
      return [];
    }
  };

  // Músicas demo para fallback
  const getDemoTracks = (query: string): Track[] => {
    const demoTracks: Track[] = [
      {
        id: 'demo-1',
        title: 'Twinkle Twinkle Little Star',
        artist: 'Tradicional',
        duration: 30,
        preview_url: '/assets/music/children-song-1.mp3',
        popularity: 95,
        source: 'demo',
        bpm: 120
      },
      {
        id: 'demo-2',
        title: 'Happy Birthday',
        artist: 'Tradicional',
        duration: 25,
        popularity: 90,
        source: 'demo',
        bpm: 140
      },
      {
        id: 'demo-3',
        title: 'Old MacDonald',
        artist: 'Tradicional',
        duration: 35,
        popularity: 85,
        source: 'demo',
        bpm: 130
      },
      {
        id: 'demo-4',
        title: 'Mary Had a Little Lamb',
        artist: 'Tradicional',
        duration: 20,
        popularity: 80,
        source: 'demo',
        bpm: 120
      },
      {
        id: 'demo-5',
        title: 'Row Row Row Your Boat',
        artist: 'Tradicional',
        duration: 22,
        popularity: 75,
        source: 'demo',
        bpm: 110
      }
    ];

    return demoTracks.filter(track => 
      track.title.toLowerCase().includes(query.toLowerCase()) ||
      track.artist.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Função principal de busca
  const searchTracks = async (query: string) => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      let results: Track[] = [];

      switch (apiSource) {
        case 'spotify':
          results = await searchSpotify(query);
          break;
        case 'jamendo':
          results = await searchJamendo(query);
          break;
        case 'demo':
          results = getDemoTracks(query);
          break;
      }

      // Se não encontrou resultados na API escolhida, tenta demo como fallback
      if (results.length === 0 && apiSource !== 'demo') {
        results = getDemoTracks(query);
        toast({
          title: "Usando músicas demo",
          description: "Não foram encontradas músicas na API selecionada.",
        });
      }

      setTracks(results);
      
      if (results.length === 0) {
        toast({
          title: "Nenhuma música encontrada",
          description: "Tente buscar por 'Twinkle', 'Happy' ou 'Mary'",
        });
      }
    } catch (error) {
      console.error('Erro ao buscar músicas:', error);
      toast({
        title: "Erro na busca",
        description: "Não foi possível buscar músicas. Usando modo demo.",
      });
      // Fallback para demo
      setTracks(getDemoTracks(query));
    } finally {
      setLoading(false);
    }
  };

  // Carregar músicas populares iniciais
  const loadPopularTracks = async () => {
    setLoading(true);
    try {
      let popularTracks: Track[] = [];

      if (apiSource === 'spotify') {
        popularTracks = await searchSpotify('children songs');
      } else if (apiSource === 'jamendo') {
        popularTracks = await searchJamendo('children');
      } else {
        popularTracks = getDemoTracks('');
      }

      if (popularTracks.length === 0) {
        popularTracks = getDemoTracks('');
      }

      setTracks(popularTracks);
    } catch (error) {
      console.error('Erro ao carregar músicas populares:', error);
      setTracks(getDemoTracks(''));
    } finally {
      setLoading(false);
    }
  };

  // Tocar preview
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

  // Carregar músicas ao mudar fonte de API
  useEffect(() => {
    loadPopularTracks();
  }, [apiSource]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="w-5 h-5" />
            Buscar Músicas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Seletor de API */}
          <div className="flex gap-2">
            <Button
              variant={apiSource === 'spotify' ? 'default' : 'outline'}
              onClick={() => setApiSource('spotify')}
              className="flex-1"
            >
              Spotify
            </Button>
            <Button
              variant={apiSource === 'jamendo' ? 'default' : 'outline'}
              onClick={() => setApiSource('jamendo')}
              className="flex-1"
            >
              Jamendo
            </Button>
            <Button
              variant={apiSource === 'demo' ? 'default' : 'outline'}
              onClick={() => setApiSource('demo')}
              className="flex-1"
            >
              Demo
            </Button>
          </div>

          {/* Formulário de busca */}
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
                  {track.image && (
                    <img 
                      src={track.image} 
                      alt={track.title}
                      className="w-12 h-12 rounded mb-2 object-cover"
                    />
                  )}
                  <h3 className="font-semibold text-lg truncate">{track.title}</h3>
                  <p className="text-gray-600 truncate">{track.artist}</p>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">{track.duration}s</span>
                    
                    <Badge variant="secondary" className="text-xs">
                      {track.source}
                    </Badge>
                    
                    {track.popularity && (
                      <Badge variant="outline" className="text-xs">
                        {track.popularity}%
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
                  
                  {track.external_url && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(track.external_url, '_blank');
                      }}
                    >
                      <ExternalLink className="w-3 h-3" />
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
                <Badge variant="secondary" className="mt-1">
                  Fonte: {selectedTrack.source}
                </Badge>
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
