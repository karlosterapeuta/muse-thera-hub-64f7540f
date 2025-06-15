
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Play, Heart, Clock, Music, ExternalLink } from 'lucide-react';
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

  // Carregar músicas populares iniciais
  const loadPopularTracks = async () => {
    setLoading(true);
    try {
      console.log('🔍 Carregando músicas populares do Spotify');
      const popularTracks = await MusicAPIManager.getPopular();
      console.log(`✅ Músicas carregadas: ${popularTracks.length}`);
      setTracks(popularTracks);
      
      if (popularTracks.length === 0) {
        toast({
          title: "Sem músicas encontradas",
          description: "Não foi possível carregar músicas do Spotify.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('❌ Erro ao carregar músicas populares:', error);
      toast({
        title: "Erro ao carregar músicas",
        description: "Não foi possível conectar com o Spotify.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Função principal de busca
  const searchTracks = async (query: string) => {
    if (!query.trim()) {
      loadPopularTracks();
      return;
    }
    
    setLoading(true);
    try {
      console.log(`🔍 Buscando por: "${query}" no Spotify`);
      const results = await MusicAPIManager.search(query);
      console.log(`✅ Resultados encontrados: ${results.length}`);
      
      setTracks(results);
      
      if (results.length === 0) {
        toast({
          title: "Nenhuma música encontrada",
          description: `Tente buscar por termos como "infantil", "criança" ou nomes de músicas conhecidas`,
        });
      }
    } catch (error) {
      console.error('❌ Erro ao buscar músicas:', error);
      toast({
        title: "Erro na busca",
        description: "Não foi possível buscar músicas no Spotify. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Parar áudio atual se estiver tocando
  const stopCurrentAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }
  };

  // Tocar preview
  const playPreview = (track: MusicTrack) => {
    console.log(`🎵 Tentando tocar preview de: ${track.title}`);
    
    // Parar áudio atual
    stopCurrentAudio();
    
    if (!track.preview_url) {
      toast({
        title: "Preview não disponível",
        description: "Esta música não possui preview de áudio.",
        variant: "destructive"
      });
      return;
    }

    try {
      const audio = new Audio(track.preview_url);
      audio.volume = 0.5;
      audio.crossOrigin = "anonymous";
      
      audio.addEventListener('loadstart', () => {
        console.log('🔄 Carregando áudio...');
      });
      
      audio.addEventListener('canplay', () => {
        console.log('✅ Áudio pronto para tocar');
      });
      
      audio.addEventListener('error', (e) => {
        console.error('❌ Erro no áudio:', e);
        toast({
          title: "Erro no áudio",
          description: "Não foi possível reproduzir o preview desta música.",
          variant: "destructive"
        });
      });
      
      audio.addEventListener('ended', () => {
        console.log('🔚 Áudio terminou');
        setCurrentAudio(null);
      });
      
      setCurrentAudio(audio);
      
      audio.play().then(() => {
        console.log('▶️ Áudio iniciado com sucesso');
        toast({
          title: "🎵 Tocando preview",
          description: `${track.title} - ${track.artist}`,
        });
      }).catch(error => {
        console.error('❌ Erro ao iniciar áudio:', error);
        toast({
          title: "Erro no áudio",
          description: "Não foi possível tocar o preview. Verifique se o áudio está habilitado no navegador.",
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

  // Carregar músicas ao inicializar
  useEffect(() => {
    loadPopularTracks();
  }, []);

  // Limpar áudio ao desmontar componente
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
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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

          {/* Sugestões de busca */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Sugestões:</span>
            {['infantil', 'criança', 'twinkle', 'parabéns', 'piano instrumental'].map((suggestion) => (
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

          <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
            🎵 Todas as músicas são fornecidas pelo Spotify
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        {loading && (
          <div className="col-span-full text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Buscando músicas no Spotify...</p>
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
                      Spotify
                    </Badge>
                    
                    {track.popularity && (
                      <Badge variant="outline" className="text-xs">
                        {track.popularity}%
                      </Badge>
                    )}

                    {track.bpm && (
                      <Badge variant="outline" className="text-xs">
                        {track.bpm} BPM
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
            <p className="text-gray-600">Nenhuma música encontrada no Spotify</p>
            <p className="text-sm text-gray-500">Tente buscar por músicas populares ou use as sugestões acima</p>
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
                    Spotify
                  </Badge>
                  {selectedTrack.bpm && (
                    <Badge variant="outline">
                      {selectedTrack.bpm} BPM
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
