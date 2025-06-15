import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Music, 
  Play, 
  Loader2, 
  Heart, 
  ExternalLink,
  Volume2,
  Clock,
  Star
} from 'lucide-react';
import { MusicTrack, MusicAPIManager } from '../utils/musicAPIs';

interface MusicAPIProps {
  onTrackSelect: (track: MusicTrack) => void;
  selectedTrack?: MusicTrack | null;
}

const MusicAPI: React.FC<MusicAPIProps> = ({ onTrackSelect, selectedTrack }) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSource, setSelectedSource] = useState<'spotify' | 'jamendo' | 'demo' | 'youtube'>('demo');

  // Carregar músicas populares ao inicializar, sempre começando com demo
  useEffect(() => {
    loadPopularTracks();
  }, []);

  const loadPopularTracks = async () => {
    setIsLoading(true);
    try {
      console.log(`🔍 Carregando hits brasileiros: ${selectedSource}`);
      
      // Sempre tentar demo primeiro para garantir que algo funcione
      let popularTracks = await MusicAPIManager.getPopular('demo');
      
      // Se fonte não for demo, tentar a fonte selecionada mas manter demo como fallback
      if (selectedSource !== 'demo') {
        const sourceTracks = await MusicAPIManager.getPopular(selectedSource);
        if (sourceTracks.length > 0) {
          popularTracks = sourceTracks;
        }
      }
      
      setTracks(popularTracks);
      console.log(`✅ Populares carregadas: ${popularTracks.length}`);
      
      if (popularTracks.length === 0) {
        toast({
          title: "⚠️ Aviso",
          description: "Nenhuma música encontrada. Usando biblioteca demo.",
        });
      }
    } catch (error) {
      console.error('❌ Erro ao carregar populares:', error);
      // Fallback para demo em caso de erro
      const demoTracks = await MusicAPIManager.getPopular('demo');
      setTracks(demoTracks);
      toast({
        title: "🎵 Usando Biblioteca Demo",
        description: "APIs externas indisponíveis. Carregando músicas de demonstração.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const searchTracks = async () => {
    if (!searchTerm.trim()) {
      loadPopularTracks();
      return;
    }

    setIsLoading(true);
    try {
      console.log(`🔍 Busca inteligente: "${searchTerm}" via ${selectedSource}`);
      
      // Sempre tentar demo primeiro
      let searchResults = await MusicAPIManager.search(searchTerm, 'demo');
      
      // Se fonte não for demo, tentar a fonte selecionada mas manter demo como fallback
      if (selectedSource !== 'demo') {
        const sourceResults = await MusicAPIManager.search(searchTerm, selectedSource);
        if (sourceResults.length > 0) {
          searchResults = sourceResults;
        }
      }
      
      setTracks(searchResults);
      console.log(`✅ Busca finalizada: ${searchResults.length} resultados`);
      
      if (searchResults.length === 0) {
        toast({
          title: "🔍 Busca sem resultados",
          description: "Tente outras palavras-chave ou use as músicas sugeridas.",
        });
      }
    } catch (error) {
      console.error('❌ Erro na busca:', error);
      // Fallback para demo em caso de erro
      const demoResults = await MusicAPIManager.search(searchTerm, 'demo');
      setTracks(demoResults);
      toast({
        title: "🎵 Busca na Biblioteca Demo",
        description: "APIs externas indisponíveis. Buscando na biblioteca demo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSourceChange = (source: 'spotify' | 'jamendo' | 'demo' | 'youtube') => {
    setSelectedSource(source);
    setSearchTerm('');
    // Recarregar populares com nova fonte, mas sempre com fallback para demo
    setTimeout(loadPopularTracks, 100);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'spotify': return 'bg-green-500';
      case 'jamendo': return 'bg-orange-500';
      case 'youtube': return 'bg-red-500';
      case 'demo': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  
  return (
    <div className="space-y-6">
      {/* Header com seletor de fonte */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="w-5 h-5" />
            Biblioteca Musical
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Seletor de fonte de música */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { key: 'demo', label: 'Demo BR', icon: '🇧🇷' },
              { key: 'spotify', label: 'Spotify', icon: '🎵' },
              { key: 'youtube', label: 'YouTube', icon: '📺' },
              { key: 'jamendo', label: 'Jamendo', icon: '🎸' }
            ].map((source) => (
              <Button
                key={source.key}
                variant={selectedSource === source.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSourceChange(source.key as any)}
                className="flex items-center gap-2"
              >
                <span>{source.icon}</span>
                {source.label}
              </Button>
            ))}
          </div>

          {/* Campo de busca */}
          <div className="flex gap-2">
            <Input
              placeholder="Buscar música ou artista..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchTracks()}
              className="flex-1"
            />
            <Button onClick={searchTracks} disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de músicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              {searchTerm ? `Resultados para "${searchTerm}"` : 'Músicas Populares'}
            </span>
            <Badge variant="secondary">{tracks.length} músicas</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">Carregando músicas...</span>
            </div>
          ) : tracks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Music className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma música encontrada</p>
              <p className="text-sm">Tente buscar por artista ou título</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {tracks.map((track) => (
                <div
                  key={`${track.source}-${track.id}`}
                  className={`p-3 border rounded-lg cursor-pointer transition-all hover:bg-blue-50 dark:hover:bg-blue-900 ${
                    selectedTrack?.id === track.id && selectedTrack?.source === track.source
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                  onClick={() => onTrackSelect(track)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{track.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{track.artist}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getSourceBadgeColor(track.source)} text-white`}
                        >
                          {track.source}
                        </Badge>
                        <div className="flex items-center text-xs text-gray-500 gap-2">
                          <Clock className="w-3 h-3" />
                          {formatDuration(track.duration)}
                          {track.bpm && (
                            <>
                              <Volume2 className="w-3 h-3" />
                              {track.bpm} BPM
                            </>
                          )}
                          {track.popularity && (
                            <>
                              <Star className="w-3 h-3" />
                              {track.popularity}%
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {track.preview_url && (
                        <Button size="sm" variant="ghost">
                          <Play className="w-4 h-4" />
                        </Button>
                      )}
                      {track.external_url && (
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(track.external_url!, '_blank');
                          }}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="ghost">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MusicAPI;
