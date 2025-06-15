
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Play, Heart, Clock, Music, ExternalLink, CheckCircle, AlertCircle, Loader, Wifi, WifiOff, Zap, Star } from 'lucide-react';
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
  const [apiSource, setApiSource] = useState<'spotify' | 'jamendo' | 'demo' | 'youtube'>('spotify');
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [searchStatus, setSearchStatus] = useState<'idle' | 'searching' | 'success' | 'error'>('idle');
  const [apiHealth, setApiHealth] = useState({
    spotify: 'unknown',
    jamendo: 'unknown',
    youtube: 'unknown',
    demo: 'healthy'
  });
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Busca em tempo real com debounce
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.trim().length >= 2) {
        searchTracks(query);
      }
    }, 800),
    [apiSource]
  );

  // Carregar músicas populares inteligentes
  const loadPopularTracks = async () => {
    setLoading(true);
    setSearchStatus('searching');
    
    try {
      console.log(`🔍 Carregando hits brasileiros: ${apiSource}`);
      const popularTracks = await MusicAPIManager.getPopular(apiSource);
      console.log(`✅ Populares carregadas: ${popularTracks.length}`);
      
      setTracks(popularTracks);
      setSearchStatus(popularTracks.length > 0 ? 'success' : 'error');
      
      updateApiHealthFromResults(popularTracks);
      
      if (popularTracks.length === 0) {
        toast({
          title: "⚠️ Sem músicas populares",
          description: "Tentando outras fontes...",
        });
      } else {
        showSuccessToast(popularTracks, 'populares brasileiras');
      }
    } catch (error) {
      console.error('❌ Erro ao carregar populares:', error);
      handleSearchError();
    } finally {
      setLoading(false);
    }
  };

  // Busca inteligente e funcional
  const searchTracks = async (query: string) => {
    if (!query.trim()) {
      loadPopularTracks();
      return;
    }
    
    setLoading(true);
    setSearchStatus('searching');
    setIsTyping(false);
    
    try {
      console.log(`🔍 Busca inteligente: "${query}" via ${apiSource}`);
      
      const results = await MusicAPIManager.search(query, apiSource);
      console.log(`✅ Busca finalizada: ${results.length} resultados`);
      
      setTracks(results);
      setSearchStatus(results.length > 0 ? 'success' : 'error');
      
      updateApiHealthFromResults(results);
      updateSearchSuggestions(query, results);
      
      if (results.length === 0) {
        toast({
          title: "🔍 Busca sem resultados",
          description: `Tente: "Roberto Carlos", "música infantil", "MPB" ou "bossa nova"`,
        });
      } else {
        showSuccessToast(results, `para "${query}"`);
      }
    } catch (error) {
      console.error('❌ Erro na busca:', error);
      handleSearchError();
    } finally {
      setLoading(false);
    }
  };

  const updateApiHealthFromResults = (results: MusicTrack[]) => {
    const sourceResults = results.filter(track => track.source === apiSource);
    setApiHealth(prev => ({
      ...prev,
      [apiSource]: sourceResults.length > 0 ? 'healthy' : 'degraded'
    }));
  };

  const showSuccessToast = (results: MusicTrack[], context: string) => {
    const bySource = results.reduce((acc, track) => {
      acc[track.source] = (acc[track.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const sourceInfo = Object.entries(bySource)
      .map(([source, count]) => `${source}: ${count}`)
      .join(', ');
    
    toast({
      title: `🎵 ${results.length} músicas ${context}`,
      description: `Fontes: ${sourceInfo}`,
    });
  };

  const handleSearchError = () => {
    setSearchStatus('error');
    setApiHealth(prev => ({ ...prev, [apiSource]: 'error' }));
    
    toast({
      title: "❌ Erro na busca",
      description: "Problema na conexão. Tentando outras fontes automaticamente...",
      variant: "destructive"
    });
  };

  const updateSearchSuggestions = (query: string, results: MusicTrack[]) => {
    const suggestions = new Set<string>();
    
    // Sugestões baseadas nos resultados
    results.forEach(track => {
      if (suggestions.size < 5) {
        suggestions.add(`mais de ${track.artist}`);
        suggestions.add(`${track.artist} sucessos`);
      }
    });
    
    // Sugestões inteligentes baseadas na busca
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('infantil') || lowerQuery.includes('criança')) {
      suggestions.add('ciranda cirandinha');
      suggestions.add('brilha brilha estrelinha');
      suggestions.add('música educativa');
    }
    
    if (lowerQuery.includes('mpb') || lowerQuery.includes('brasileiro')) {
      suggestions.add('caetano veloso');
      suggestions.add('elis regina');
      suggestions.add('chico buarque');
    }
    
    setSearchSuggestions(Array.from(suggestions).slice(0, 6));
  };

  const stopCurrentAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }
  };

  const playPreview = async (track: MusicTrack) => {
    console.log(`🎵 Preview: ${track.title}`);
    
    stopCurrentAudio();
    
    if (!track.preview_url) {
      toast({
        title: "⚠️ Preview não disponível",
        description: "Esta música não tem áudio de preview.",
        variant: "destructive"
      });
      return;
    }

    try {
      const audio = new Audio();
      audio.crossOrigin = "anonymous";
      audio.volume = 0.3;
      
      const handleError = () => {
        console.error('❌ Erro no preview');
        MusicAPIManager.markTrackAsFailed(track);
        toast({
          title: "❌ Erro no áudio",
          description: `Não foi possível tocar "${track.title}"`,
          variant: "destructive"
        });
        setCurrentAudio(null);
      };
      
      const handleEnded = () => {
        console.log('🔚 Preview terminou');
        setCurrentAudio(null);
      };
      
      audio.addEventListener('error', handleError);
      audio.addEventListener('ended', handleEnded);
      
      audio.src = track.preview_url;
      setCurrentAudio(audio);
      
      await audio.play();
      
      console.log('▶️ Preview iniciado');
      toast({
        title: "🎵 Tocando preview",
        description: `${track.title} - ${track.artist}`,
      });
      
    } catch (error) {
      console.error('❌ Erro ao tocar preview:', error);
      MusicAPIManager.markTrackAsFailed(track);
      toast({
        title: "❌ Erro no áudio",
        description: "Não foi possível reproduzir. Verifique se o áudio está habilitado.",
        variant: "destructive"
      });
    }
  };

  const getApiStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'degraded': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <WifiOff className="w-4 h-4 text-red-500" />;
      default: return <Wifi className="w-4 h-4 text-gray-400" />;
    }
  };

  const getSourceLabel = (source: string) => {
    const labels = {
      spotify: 'Spotify BR',
      youtube: 'YouTube Music',
      jamendo: 'Jamendo',
      demo: 'Demo BR'
    };
    return labels[source] || source;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTyping(false);
    searchTracks(searchTerm);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsTyping(true);
    
    // Busca em tempo real
    debouncedSearch(value);
  };

  // Sugestões brasileiras inteligentes
  const getBrazilianSuggestions = () => {
    const baseSuggestions = [
      'Roberto Carlos',
      'música infantil',
      'MPB clássicos',
      'bossa nova',
      'sertanejo hits',
      'Legião Urbana',
      'Tom Jobim',
      'Elis Regina',
      'Caetano Veloso',
      'forró pé de serra',
      'rock nacional',
      'samba brasileiro'
    ];
    
    return [...baseSuggestions, ...searchSuggestions]
      .filter((suggestion, index, self) => self.indexOf(suggestion) === index)
      .slice(0, 8);
  };

  const getTrackQualityBadge = (track: MusicTrack) => {
    let quality = 'standard';
    let icon = null;
    
    if (track.popularity && track.popularity > 85) {
      quality = 'hit';
      icon = <Star className="w-3 h-3" />;
    } else if (track.preview_url && track.popularity && track.popularity > 70) {
      quality = 'premium';
      icon = <Zap className="w-3 h-3" />;
    }
    
    const colors = {
      hit: 'bg-yellow-100 text-yellow-800',
      premium: 'bg-blue-100 text-blue-800',
      standard: 'bg-gray-100 text-gray-600'
    };
    
    return (
      <Badge variant="outline" className={`text-xs ${colors[quality]}`}>
        {icon}
        {quality === 'hit' ? 'HIT' : quality === 'premium' ? 'PREMIUM' : 'OK'}
      </Badge>
    );
  };

  useEffect(() => {
    loadPopularTracks();
  }, [apiSource]);

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
            🇧🇷 Busca Inteligente de Músicas Brasileiras
            {(loading || isTyping) && <Loader className="w-4 h-4 animate-spin text-blue-500" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Seletor de fonte otimizado */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {(['spotify', 'youtube', 'jamendo', 'demo'] as const).map((source) => (
              <Button
                key={source}
                variant={apiSource === source ? 'default' : 'outline'}
                onClick={() => setApiSource(source)}
                className="flex items-center gap-2 text-sm"
                size="sm"
              >
                {getApiStatusIcon(apiHealth[source])}
                {getSourceLabel(source)}
              </Button>
            ))}
          </div>

          {/* Busca inteligente */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="🎵 Digite qualquer música: Roberto Carlos, música infantil, MPB, rock nacional..."
              value={searchTerm}
              onChange={handleSearchInputChange}
              className="flex-1"
              disabled={loading}
            />
            <Button type="submit" disabled={loading}>
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </Button>
          </form>

          {/* Status da busca */}
          {searchStatus === 'searching' && (
            <div className="flex items-center gap-2 text-blue-600 bg-blue-50 p-3 rounded-lg">
              <Loader className="w-4 h-4 animate-spin" />
              <span className="text-sm">
                🔍 Buscando em múltiplas fontes... Sistema inteligente ativo!
              </span>
            </div>
          )}

          {/* Sugestões brasileiras inteligentes */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Zap className="w-4 h-4" />
              <span>🇧🇷 Sugestões inteligentes:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {getBrazilianSuggestions().map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm(suggestion);
                    searchTracks(suggestion);
                  }}
                  disabled={loading}
                  className="text-xs hover:bg-blue-50"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>

          {/* Informações do sistema */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span>Funcionando</span>
              <AlertCircle className="w-3 h-3 text-yellow-500" />
              <span>Limitado</span>
              <WifiOff className="w-3 h-3 text-red-500" />
              <span>Indisponível</span>
            </div>
            <p className="text-xs text-gray-600">
              🚀 Sistema de busca inteligente com fallback automático entre Spotify, YouTube Music, Jamendo e base brasileira!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Grid de resultados otimizado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        {loading && tracks.length === 0 && (
          <div className="col-span-full text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">🔍 Busca inteligente em andamento...</p>
            <p className="text-sm text-gray-500">Verificando Spotify → YouTube → Jamendo → Base brasileira</p>
          </div>
        )}

        {!loading && tracks.map((track) => (
          <Card 
            key={`${track.source}-${track.id}`}
            className={`cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${
              selectedTrack?.id === track.id && selectedTrack?.source === track.source 
                ? 'ring-2 ring-blue-500 bg-blue-50' : ''
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
                  <p className="text-gray-600 truncate">🎤 {track.artist}</p>
                  
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">{track.duration}s</span>
                    
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${
                        track.source === 'spotify' ? 'bg-green-100 text-green-800' :
                        track.source === 'youtube' ? 'bg-red-100 text-red-800' :
                        track.source === 'jamendo' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {track.source}
                    </Badge>
                    
                    {getTrackQualityBadge(track)}
                    
                    {track.popularity && (
                      <Badge variant="outline" className="text-xs">
                        ⭐ {track.popularity}%
                      </Badge>
                    )}

                    {track.bpm && (
                      <Badge variant="outline" className="text-xs">
                        🥁 {track.bpm} BPM
                      </Badge>
                    )}

                    {track.preview_url && (
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                        ✓ Áudio OK
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
                      title="Abrir no site original"
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

        {!loading && tracks.length === 0 && searchStatus === 'error' && (
          <div className="col-span-full text-center py-8">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 font-medium">🔍 Nenhuma música encontrada</p>
            <p className="text-sm text-gray-500 mt-1">
              O sistema tentou automaticamente: Spotify → YouTube → Jamendo → Base brasileira
            </p>
            <div className="flex gap-2 justify-center mt-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => loadPopularTracks()}
              >
                🎵 Hits Brasileiros
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => searchTracks('música infantil')}
              >
                🧸 Música Infantil
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => searchTracks('MPB clássicos')}
              >
                🎭 MPB Clássicos
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Música selecionada */}
      {selectedTrack && (
        <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  🎵 Música Selecionada para o Jogo:
                </h4>
                <p className="text-lg font-bold">{selectedTrack.title}</p>
                <p className="text-gray-600">🎤 {selectedTrack.artist}</p>
                <div className="flex gap-2 mt-2">
                  <Badge 
                    variant="secondary"
                    className={
                      selectedTrack.source === 'spotify' ? 'bg-green-100 text-green-800' :
                      selectedTrack.source === 'youtube' ? 'bg-red-100 text-red-800' :
                      selectedTrack.source === 'jamendo' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }
                  >
                    📡 {selectedTrack.source}
                  </Badge>
                  {getTrackQualityBadge(selectedTrack)}
                  {selectedTrack.bpm && (
                    <Badge variant="outline">
                      🥁 {selectedTrack.bpm} BPM
                    </Badge>
                  )}
                  {selectedTrack.preview_url && (
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      ✓ Áudio funcionando
                    </Badge>
                  )}
                </div>
              </div>
              <Badge variant="default" className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                🎮 Pronto para jogar!
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Função debounce utilitária
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default MusicAPI;
