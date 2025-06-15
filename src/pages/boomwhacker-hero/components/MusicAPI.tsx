
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Play, Heart, Clock, Music, ExternalLink, CheckCircle, AlertCircle, Loader, Wifi, WifiOff } from 'lucide-react';
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
  const [apiSource, setApiSource] = useState<'spotify' | 'jamendo' | 'demo'>('spotify');
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [searchStatus, setSearchStatus] = useState<'idle' | 'searching' | 'success' | 'error'>('idle');
  const [apiHealth, setApiHealth] = useState({
    spotify: 'unknown',
    jamendo: 'unknown',
    demo: 'healthy'
  });

  // Carregar músicas populares brasileiras
  const loadPopularTracks = async () => {
    setLoading(true);
    setSearchStatus('searching');
    
    try {
      console.log(`🔍 Carregando populares brasileiras: ${apiSource}`);
      const popularTracks = await MusicAPIManager.getPopular(apiSource);
      console.log(`✅ Populares carregadas: ${popularTracks.length}`);
      
      setTracks(popularTracks);
      setSearchStatus(popularTracks.length > 0 ? 'success' : 'error');
      
      setApiHealth(prev => ({
        ...prev,
        [apiSource]: popularTracks.length > 0 ? 'healthy' : 'degraded'
      }));
      
      if (popularTracks.length === 0) {
        toast({
          title: "⚠️ Sem músicas populares",
          description: "Tentando outras fontes...",
        });
      } else {
        const sourceCount = popularTracks.reduce((acc, track) => {
          acc[track.source] = (acc[track.source] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        const sourceInfo = Object.entries(sourceCount)
          .map(([source, count]) => `${source}: ${count}`)
          .join(', ');
        
        toast({
          title: `🎵 ${popularTracks.length} músicas brasileiras carregadas`,
          description: sourceInfo,
        });
      }
    } catch (error) {
      console.error('❌ Erro ao carregar populares:', error);
      setSearchStatus('error');
      setApiHealth(prev => ({ ...prev, [apiSource]: 'error' }));
      
      toast({
        title: "❌ Erro ao carregar músicas",
        description: "Tentando fontes alternativas...",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Busca inteligente de músicas brasileiras
  const searchTracks = async (query: string) => {
    if (!query.trim()) {
      loadPopularTracks();
      return;
    }
    
    setLoading(true);
    setSearchStatus('searching');
    
    try {
      console.log(`🔍 Busca brasileira: "${query}" em ${apiSource}`);
      
      const results = await MusicAPIManager.search(query, apiSource);
      console.log(`✅ Busca finalizada: ${results.length} resultados`);
      
      setTracks(results);
      setSearchStatus(results.length > 0 ? 'success' : 'error');
      
      const sourceResults = results.filter(track => track.source === apiSource);
      setApiHealth(prev => ({
        ...prev,
        [apiSource]: sourceResults.length > 0 ? 'healthy' : 'degraded'
      }));
      
      if (results.length === 0) {
        toast({
          title: "🔍 Nenhuma música encontrada",
          description: "Tente 'Roberto Carlos', 'MPB' ou 'música infantil'",
        });
      } else {
        const bySource = results.reduce((acc, track) => {
          acc[track.source] = (acc[track.source] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        const sourceInfo = Object.entries(bySource)
          .map(([source, count]) => `${source}: ${count}`)
          .join(', ');
        
        toast({
          title: `🎵 ${results.length} músicas brasileiras encontradas`,
          description: sourceInfo,
        });
      }
    } catch (error) {
      console.error('❌ Erro na busca:', error);
      setSearchStatus('error');
      setApiHealth(prev => ({ ...prev, [apiSource]: 'error' }));
      
      toast({
        title: "❌ Erro na busca",
        description: "Problema na conexão. Tentando outras fontes...",
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
      audio.volume = 0.5;
      
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchTracks(searchTerm);
  };

  // Sugestões brasileiras
  const getBrazilianSuggestions = () => {
    const suggestions = [
      'Roberto Carlos',
      'Caetano Veloso', 
      'MPB clássicos',
      'bossa nova',
      'sertanejo',
      'forró',
      'música infantil',
      'piano brasileiro',
      'violão brasileiro',
      'samba',
      'Tom Jobim',
      'Elis Regina',
      'Chico Buarque',
      'Gilberto Gil',
      'Legião Urbana',
      'rock nacional'
    ];
    
    if (tracks.length > 0) {
      const artists = [...new Set(tracks.map(t => t.artist).slice(0, 3))];
      suggestions.push(...artists.map(artist => `mais de ${artist}`));
    }
    
    return suggestions.slice(0, 8);
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
            🇧🇷 Músicas Brasileiras - Boomwhacker Hero
            {searchStatus === 'searching' && <Loader className="w-4 h-4 animate-spin" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Seletor de API otimizado */}
          <div className="flex gap-2">
            <Button
              variant={apiSource === 'spotify' ? 'default' : 'outline'}
              onClick={() => setApiSource('spotify')}
              className="flex-1 flex items-center gap-2"
            >
              {getApiStatusIcon(apiHealth.spotify)}
              Spotify BR
            </Button>
            <Button
              variant={apiSource === 'jamendo' ? 'default' : 'outline'}
              onClick={() => setApiSource('jamendo')}
              className="flex-1 flex items-center gap-2"
            >
              {getApiStatusIcon(apiHealth.jamendo)}
              Jamendo
            </Button>
            <Button
              variant={apiSource === 'demo' ? 'default' : 'outline'}
              onClick={() => setApiSource('demo')}
              className="flex-1 flex items-center gap-2"
            >
              {getApiStatusIcon(apiHealth.demo)}
              Demo BR
            </Button>
          </div>

          {/* Busca aprimorada */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="🎵 Digite: Roberto Carlos, MPB, sertanejo, música infantil..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
              disabled={loading}
            />
            <Button type="submit" disabled={loading}>
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </Button>
          </form>

          {/* Status da busca */}
          {searchStatus === 'searching' && (
            <div className="flex items-center gap-2 text-blue-600">
              <Loader className="w-4 h-4 animate-spin" />
              <span className="text-sm">🔍 Buscando nas melhores fontes de música brasileira...</span>
            </div>
          )}

          {/* Sugestões brasileiras */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">🇧🇷 Sugestões brasileiras:</span>
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
                className="text-xs"
              >
                {suggestion}
              </Button>
            ))}
          </div>

          {/* Informações do sistema */}
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span>Funcionando</span>
              <AlertCircle className="w-3 h-3 text-yellow-500" />
              <span>Limitado</span>
              <WifiOff className="w-3 h-3 text-red-500" />
              <span>Indisponível</span>
            </div>
            <p className="text-xs">🎵 Sistema otimizado para música brasileira com fallback inteligente entre fontes!</p>
          </div>
        </CardContent>
      </Card>

      {/* Grid de resultados otimizado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        {loading && (
          <div className="col-span-full text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">🔍 Buscando músicas brasileiras...</p>
            <p className="text-sm text-gray-500">Usando múltiplas fontes para melhores resultados</p>
          </div>
        )}

        {!loading && tracks.map((track) => (
          <Card 
            key={`${track.source}-${track.id}`}
            className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
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
                        track.source === 'jamendo' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {track.source}
                    </Badge>
                    
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
                        ✓ Com áudio
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
            <p className="text-gray-600 font-medium">🔍 Nenhuma música brasileira encontrada</p>
            <p className="text-sm text-gray-500 mt-1">
              Tente: Roberto Carlos, Caetano Veloso, MPB, sertanejo, bossa nova
            </p>
            <Button 
              variant="outline" 
              className="mt-3"
              onClick={() => loadPopularTracks()}
            >
              🎵 Carregar Hits Brasileiros
            </Button>
          </div>
        )}
      </div>

      {/* Música selecionada */}
      {selectedTrack && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  🎵 Música Selecionada para o Jogo:
                </h4>
                <p className="text-lg">{selectedTrack.title}</p>
                <p className="text-gray-600">🎤 {selectedTrack.artist}</p>
                <div className="flex gap-2 mt-1">
                  <Badge 
                    variant="secondary"
                    className={
                      selectedTrack.source === 'spotify' ? 'bg-green-100 text-green-800' :
                      selectedTrack.source === 'jamendo' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }
                  >
                    📡 {selectedTrack.source}
                  </Badge>
                  {selectedTrack.bpm && (
                    <Badge variant="outline">
                      🥁 {selectedTrack.bpm} BPM
                    </Badge>
                  )}
                  {selectedTrack.preview_url && (
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      ✓ Com áudio funcionando
                    </Badge>
                  )}
                </div>
              </div>
              <Badge variant="default" className="bg-green-500">
                🎮 Pronto para jogar!
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MusicAPI;
