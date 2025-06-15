
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Play, Heart, Clock, Music, ExternalLink, RefreshCw, AlertCircle, Volume2, VolumeX } from 'lucide-react';
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
  const [retryCount, setRetryCount] = useState(0);
  const [lastSearchTerm, setLastSearchTerm] = useState('');
  const [debugInfo, setDebugInfo] = useState<string>('');

  // Carregar músicas populares iniciais com retry e debug melhorado
  const loadPopularTracks = async (isRetry = false) => {
    setLoading(true);
    setDebugInfo('Conectando com Spotify...');
    
    try {
      console.log('🔍 Carregando músicas populares do Spotify');
      const popularTracks = await MusicAPIManager.getPopular();
      console.log(`✅ Músicas carregadas: ${popularTracks.length}`);
      
      setTracks(popularTracks);
      setRetryCount(0);
      setDebugInfo('');
      
      if (popularTracks.length === 0) {
        if (!isRetry && retryCount < 3) {
          console.log('🔄 Tentando novamente carregar músicas populares...');
          setRetryCount(prev => prev + 1);
          setDebugInfo(`Tentativa ${retryCount + 1}/3 - Recarregando...`);
          setTimeout(() => loadPopularTracks(true), 3000);
          return;
        }
        
        setDebugInfo('Não foi possível carregar músicas do Spotify');
        toast({
          title: "🚨 Problema com Spotify",
          description: "Não foi possível carregar músicas. Verifique sua conexão ou tente buscar manualmente.",
          variant: "destructive"
        });
      } else {
        const withPreview = popularTracks.filter(t => t.has_preview).length;
        toast({
          title: "✅ Músicas carregadas!",
          description: `${popularTracks.length} músicas encontradas (${withPreview} com preview)`,
        });
      }
    } catch (error) {
      console.error('❌ Erro ao carregar músicas populares:', error);
      
      if (!isRetry && retryCount < 3) {
        console.log('🔄 Tentando novamente após erro...');
        setRetryCount(prev => prev + 1);
        setDebugInfo(`Erro - Tentativa ${retryCount + 1}/3...`);
        setTimeout(() => loadPopularTracks(true), 3000);
        return;
      }
      
      setDebugInfo('Erro de conexão com Spotify');
      toast({
        title: "❌ Erro de conexão",
        description: "Não foi possível conectar com o Spotify. Tente novamente em alguns minutos.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Função principal de busca com retry e debug melhorado
  const searchTracks = async (query: string, isRetry = false) => {
    if (!query.trim()) {
      setLastSearchTerm('');
      loadPopularTracks();
      return;
    }
    
    setLoading(true);
    setLastSearchTerm(query);
    setDebugInfo(`Buscando "${query}" no Spotify...`);
    
    try {
      console.log(`🔍 Buscando por: "${query}" no Spotify`);
      const results = await MusicAPIManager.search(query);
      console.log(`✅ Resultados encontrados: ${results.length}`);
      
      setTracks(results);
      setRetryCount(0);
      setDebugInfo('');
      
      if (results.length === 0) {
        if (!isRetry && retryCount < 3) {
          console.log('🔄 Tentando busca novamente...');
          setRetryCount(prev => prev + 1);
          setDebugInfo(`Busca - Tentativa ${retryCount + 1}/3...`);
          setTimeout(() => searchTracks(query, true), 2000);
          return;
        }
        
        setDebugInfo(`Nenhum resultado para "${query}"`);
        toast({
          title: "🔍 Nenhuma música encontrada",
          description: `Tente buscar por termos como "piano", "children", "instrumental" ou "happy"`,
        });
      } else {
        const withPreview = results.filter(t => t.has_preview).length;
        toast({
          title: "✅ Busca concluída!",
          description: `${results.length} músicas encontradas (${withPreview} com preview)`,
        });
      }
    } catch (error) {
      console.error('❌ Erro ao buscar músicas:', error);
      
      if (!isRetry && retryCount < 3) {
        console.log('🔄 Tentando busca novamente após erro...');
        setRetryCount(prev => prev + 1);
        setDebugInfo(`Erro - Tentativa ${retryCount + 1}/3...`);
        setTimeout(() => searchTracks(query, true), 2000);
        return;
      }
      
      setDebugInfo('Erro na busca do Spotify');
      toast({
        title: "❌ Erro na busca",
        description: "Não foi possível buscar músicas no Spotify. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Função para forçar retry manual
  const handleRetry = () => {
    setRetryCount(0);
    setDebugInfo('');
    if (lastSearchTerm) {
      searchTracks(lastSearchTerm);
    } else {
      loadPopularTracks();
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
        description: "Esta música não possui preview de áudio, mas pode ser selecionada para o jogo.",
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
    setRetryCount(0);
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
            {retryCount > 0 && (
              <Badge variant="outline" className="text-orange-600">
                Tentativa {retryCount}/3
              </Badge>
            )}
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
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleRetry}
              disabled={loading}
              title="Tentar novamente"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </form>

          {/* Debug info */}
          {debugInfo && (
            <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-2 rounded">
              <AlertCircle className="w-4 h-4" />
              {debugInfo}
            </div>
          )}

          {/* Sugestões de busca */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Sugestões:</span>
            {['children songs', 'piano music', 'happy birthday', 'twinkle star', 'classical piano'].map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm(suggestion);
                  setRetryCount(0);
                  searchTracks(suggestion);
                }}
              >
                {suggestion}
              </Button>
            ))}
          </div>

          <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
            🎵 Credenciais atualizadas do Spotify integradas com sucesso!
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        {loading && (
          <div className="col-span-full text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">
              {debugInfo || 'Buscando músicas no Spotify...'}
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

                    {track.has_preview ? (
                      <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                        <Volume2 className="w-3 h-3 mr-1" />
                        Com Preview
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs bg-gray-100 text-gray-600">
                        <VolumeX className="w-3 h-3 mr-1" />
                        Sem Preview
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
            <p className="text-sm text-gray-500 mb-4">
              {debugInfo || 'Tente buscar por músicas populares ou use as sugestões acima'}
            </p>
            <Button onClick={handleRetry} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar Novamente
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
                    Spotify
                  </Badge>
                  {selectedTrack.bpm && (
                    <Badge variant="outline">
                      {selectedTrack.bpm} BPM
                    </Badge>
                  )}
                  {selectedTrack.has_preview ? (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <Volume2 className="w-3 h-3 mr-1" />
                      Com Preview
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-gray-100 text-gray-600">
                      <VolumeX className="w-3 h-3 mr-1" />
                      Sem Preview
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
