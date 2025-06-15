
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Play, Heart, Clock, Music, ExternalLink, RefreshCw, Volume2, Wifi, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MusicAPIManager, MusicTrack } from '../utils/musicAPIs';

interface MusicAPIProps {
  onTrackSelect: (track: MusicTrack) => void;
  selectedTrack?: MusicTrack | null;
}

const MusicAPI: React.FC<MusicAPIProps> = ({ onTrackSelect, selectedTrack }) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [spotifyConnected, setSpotifyConnected] = useState<boolean | null>(null);

  const loadPopularTracks = async () => {
    setLoading(true);
    
    try {
      console.log('🔍 Carregando músicas populares do Spotify');
      const popularTracks = await MusicAPIManager.getPopular();
      console.log(`✅ Músicas carregadas: ${popularTracks.length}`);
      
      setTracks(popularTracks);
      
      // Verificar se são do Spotify ou fallback
      const spotifyTracks = popularTracks.filter(t => t.source === 'spotify');
      setSpotifyConnected(spotifyTracks.length > 0);
      
      if (spotifyTracks.length > 0) {
        toast({
          title: "🎵 Spotify Conectado!",
          description: `${popularTracks.length} músicas carregadas, todas com preview de áudio!`,
        });
      } else {
        toast({
          title: "🎵 Músicas locais carregadas",
          description: `${popularTracks.length} músicas de demonstração disponíveis`,
        });
      }
    } catch (error) {
      console.error('❌ Erro ao carregar músicas:', error);
      setSpotifyConnected(false);
      toast({
        title: "⚠️ Erro ao carregar músicas",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const searchTracks = async (query: string) => {
    if (!query.trim()) {
      loadPopularTracks();
      return;
    }
    
    setLoading(true);
    
    try {
      console.log(`🔍 Buscando por: "${query}"`);
      const results = await MusicAPIManager.search(query);
      console.log(`✅ Resultados encontrados: ${results.length}`);
      
      setTracks(results);
      
      // Verificar tipo de resultados
      const spotifyTracks = results.filter(t => t.source === 'spotify');
      setSpotifyConnected(spotifyTracks.length > 0);
      
      if (spotifyTracks.length > 0) {
        toast({
          title: "🎵 Busca no Spotify realizada!",
          description: `${results.length} músicas encontradas, todas com preview!`,
        });
      } else if (results.length > 0) {
        toast({
          title: "🎵 Músicas locais encontradas",
          description: `${results.length} músicas de demonstração para "${query}"`,
        });
      } else {
        toast({
          title: "🔍 Nenhuma música encontrada",
          description: `Tente buscar por termos como "piano", "infantil", "children" ou "music"`,
        });
      }
    } catch (error) {
      console.error('❌ Erro ao buscar músicas:', error);
      toast({
        title: "⚠️ Erro na busca",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const stopCurrentAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }
  };

  const playPreview = (track: MusicTrack) => {
    console.log(`🎵 Tentando tocar preview de: ${track.title}`);
    
    stopCurrentAudio();
    
    if (!track.preview_url) {
      toast({
        title: "Preview não disponível",
        description: track.source === 'local' ? 
          "Esta é uma música local sem preview, mas pode ser usada no jogo." :
          "Esta música não possui preview de áudio, mas pode ser selecionada para o jogo.",
        variant: "destructive"
      });
      return;
    }

    try {
      const audio = new Audio(track.preview_url);
      audio.volume = 0.5;
      audio.crossOrigin = "anonymous";
      
      audio.addEventListener('error', (e) => {
        console.error('❌ Erro no áudio:', e);
        toast({
          title: "Erro no áudio",
          description: "Não foi possível reproduzir o preview desta música.",
          variant: "destructive"
        });
      });
      
      audio.addEventListener('ended', () => {
        setCurrentAudio(null);
      });
      
      setCurrentAudio(audio);
      
      audio.play().then(() => {
        toast({
          title: "🎵 Tocando preview",
          description: `${track.title} - ${track.artist}`,
        });
      }).catch(error => {
        console.error('❌ Erro ao iniciar áudio:', error);
        toast({
          title: "Erro no áudio",
          description: "Não foi possível tocar o preview.",
          variant: "destructive"
        });
      });
      
    } catch (error) {
      console.error('❌ Erro ao criar áudio:', error);
      toast({
        title: "Erro no áudio",
        description: "Não foi possível criar o player de áudio.",
        variant: "destructive"
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchTracks(searchTerm);
  };

  useEffect(() => {
    loadPopularTracks();
  }, []);

  useEffect(() => {
    return () => {
      stopCurrentAudio();
    };
  }, []);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="w-5 h-5" />
            Buscar Músicas no Spotify
            {spotifyConnected !== null && (
              <div className="flex items-center gap-1">
                {spotifyConnected ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <Badge variant="outline" className="text-green-600 bg-green-50">
                      <Wifi className="w-3 h-3 mr-1" />
                      Spotify Conectado
                    </Badge>
                  </>
                ) : (
                  <Badge variant="outline" className="text-orange-600 bg-orange-50">
                    Modo Local
                  </Badge>
                )}
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
            <Button 
              type="button" 
              variant="outline" 
              onClick={loadPopularTracks}
              disabled={loading}
              title="Recarregar músicas populares"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </form>

          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Sugestões:</span>
            {['infantil', 'piano', 'children', 'classical', 'kids music', 'música brasileira'].map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm(suggestion);
                  searchTracks(suggestion);
                }}
              >
                {suggestion}
              </Button>
            ))}
          </div>

          {spotifyConnected === true && (
            <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <strong>Spotify conectado com sucesso!</strong>
              </div>
              <p className="mt-1">Todas as músicas têm preview de áudio de alta qualidade.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        {loading && (
          <div className="col-span-full text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">
              Buscando músicas no Spotify...
            </p>
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
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <h3 className="font-semibold text-lg truncate">{track.title}</h3>
                  <p className="text-gray-600 truncate">{track.artist}</p>
                  
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">{track.duration}s</span>
                    
                    <Badge variant="secondary" className="text-xs">
                      {track.source === 'spotify' ? 'Spotify' : 'Local'}
                    </Badge>
                    
                    {track.popularity && (
                      <Badge variant="outline" className="text-xs">
                        {track.popularity}%
                      </Badge>
                    )}

                    {track.has_preview && (
                      <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                        <Volume2 className="w-3 h-3 mr-1" />
                        Preview
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
                      title="Tocar preview"
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
                      title="Abrir no Spotify"
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
                    title="Favoritar"
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
            <p className="text-sm text-gray-500 mb-4">
              Tente buscar por músicas populares ou use as sugestões acima
            </p>
            <Button onClick={loadPopularTracks} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Carregar Músicas Populares
            </Button>
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
                <div className="flex gap-2 mt-1">
                  <Badge variant="secondary">
                    {selectedTrack.source === 'spotify' ? 'Spotify' : 'Local'}
                  </Badge>
                  {selectedTrack.has_preview && (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <Volume2 className="w-3 h-3 mr-1" />
                      Com Preview
                    </Badge>
                  )}
                </div>
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
