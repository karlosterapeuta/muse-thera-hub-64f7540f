
import { supabase } from '@/integrations/supabase/client';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  preview_url?: string | null;
  image?: string;
  popularity?: number;
  external_url?: string;
  source: 'spotify' | 'local';
  bpm?: number;
  failed?: boolean;
  has_preview?: boolean;
}

// Músicas de fallback locais para quando o Spotify não estiver disponível
const FALLBACK_TRACKS: MusicTrack[] = [
  {
    id: 'fallback-1',
    title: 'Brilha, Brilha, Estrelinha',
    artist: 'Música Infantil',
    duration: 120,
    source: 'local',
    bpm: 120,
    has_preview: false,
    popularity: 100
  },
  {
    id: 'fallback-2',
    title: 'Parabéns para Você',
    artist: 'Música Tradicional',
    duration: 90,
    source: 'local',
    bpm: 140,
    has_preview: false,
    popularity: 95
  },
  {
    id: 'fallback-3',
    title: 'Mary Had a Little Lamb',
    artist: 'Children\'s Song',
    duration: 100,
    source: 'local',
    bpm: 120,
    has_preview: false,
    popularity: 90
  },
  {
    id: 'fallback-4',
    title: 'Ciranda, Cirandinha',
    artist: 'Folclore Brasileiro',
    duration: 110,
    source: 'local',
    bpm: 125,
    has_preview: false,
    popularity: 85
  },
  {
    id: 'fallback-5',
    title: 'Old MacDonald Had a Farm',
    artist: 'Children\'s Song',
    duration: 130,
    source: 'local',
    bpm: 130,
    has_preview: false,
    popularity: 80
  }
];

export class SpotifyAPI {
  static async search(query: string): Promise<MusicTrack[]> {
    try {
      console.log(`🔍 Buscando no Spotify: "${query}"`);

      const { data, error } = await supabase.functions.invoke('spotify-api', {
        body: {
          action: 'search',
          query: query
        }
      });

      if (error) {
        console.error('❌ Erro na função Spotify:', error);
        return [];
      }

      // Verificar se houve erro ou fallback necessário
      if (data?.error || data?.fallback) {
        console.warn(`⚠️ Spotify API retornou erro: ${data?.error || 'Fallback necessário'}`);
        return [];
      }

      const tracks = data?.tracks || [];
      console.log(`📊 Spotify retornou ${tracks.length} resultados`);
      
      const validTracks = tracks.filter(track => {
        const hasBasicInfo = track.title && track.artist && track.id;
        if (!hasBasicInfo) {
          console.warn(`⚠️ Track inválida: faltam informações básicas`, track);
          return false;
        }
        return true;
      });
      
      console.log(`✅ ${validTracks.length} músicas válidas encontradas`);
      return validTracks;
    } catch (error) {
      console.error('❌ Erro na busca do Spotify:', error);
      return [];
    }
  }

  static async getPopular(): Promise<MusicTrack[]> {
    try {
      console.log('🔍 Buscando músicas populares no Spotify');

      const { data, error } = await supabase.functions.invoke('spotify-api', {
        body: {
          action: 'popular'
        }
      });

      if (error) {
        console.error('❌ Erro na função Spotify popular:', error);
        return [];
      }

      // Verificar se houve erro ou fallback necessário
      if (data?.error || data?.fallback) {
        console.warn(`⚠️ Spotify API popular retornou erro: ${data?.error || 'Fallback necessário'}`);
        return [];
      }

      const tracks = data?.tracks || [];
      console.log(`📊 Spotify popular retornou ${tracks.length} resultados`);
      
      const validTracks = tracks.filter(track => {
        const hasBasicInfo = track.title && track.artist && track.id;
        return hasBasicInfo;
      });
      
      console.log(`✅ ${validTracks.length} músicas populares válidas`);
      return validTracks;
    } catch (error) {
      console.error('❌ Erro na busca popular do Spotify:', error);
      return [];
    }
  }

  static async getAudioFeatures(trackId: string): Promise<{ bpm?: number } | null> {
    try {
      const { data, error } = await supabase.functions.invoke('spotify-api', {
        body: {
          action: 'audio-features',
          trackId: trackId
        }
      });

      if (error) {
        console.error('❌ Erro ao obter características do áudio:', error);
        return { bpm: 120 };
      }

      return data || { bpm: 120 };
    } catch (error) {
      console.error('❌ Erro ao obter características do áudio:', error);
      return { bpm: 120 };
    }
  }
}

export class MusicAPIManager {
  private static failedTracks = new Set<string>();

  static async search(query: string): Promise<MusicTrack[]> {
    console.log(`🎵 Iniciando busca: "${query}"`);
    
    try {
      // Tentar buscar no Spotify primeiro
      const spotifyResults = await SpotifyAPI.search(query);
      
      if (spotifyResults.length > 0) {
        const validResults = spotifyResults.filter(track => 
          !this.failedTracks.has(`${track.source}-${track.id}`)
        );
        
        const withPreview = validResults.filter(track => track.has_preview);
        const withoutPreview = validResults.filter(track => !track.has_preview);
        
        console.log(`✅ Spotify: ${validResults.length} músicas (${withPreview.length} com preview, ${withoutPreview.length} sem preview)`);
        return validResults;
      }
      
      // Se Spotify falhou, usar músicas de fallback filtradas por query
      console.log('🔄 Spotify indisponível, usando músicas de fallback');
      const fallbackResults = this.getFallbackTracks(query);
      console.log(`✅ Fallback: ${fallbackResults.length} músicas encontradas`);
      return fallbackResults;
      
    } catch (error) {
      console.error('❌ Erro na busca:', error);
      return this.getFallbackTracks(query);
    }
  }

  static async getPopular(): Promise<MusicTrack[]> {
    console.log('🎵 Buscando músicas populares');
    
    try {
      // Tentar buscar no Spotify primeiro
      const spotifyResults = await SpotifyAPI.getPopular();
      
      if (spotifyResults.length > 0) {
        const validResults = spotifyResults.filter(track => 
          !this.failedTracks.has(`${track.source}-${track.id}`)
        );
        
        const withPreview = validResults.filter(track => track.has_preview);
        const withoutPreview = validResults.filter(track => !track.has_preview);
        
        console.log(`✅ Spotify popular: ${validResults.length} músicas (${withPreview.length} com preview, ${withoutPreview.length} sem preview)`);
        return validResults;
      }
      
      // Se Spotify falhou, usar todas as músicas de fallback
      console.log('🔄 Spotify indisponível, usando músicas de fallback populares');
      console.log(`✅ Fallback popular: ${FALLBACK_TRACKS.length} músicas`);
      return FALLBACK_TRACKS;
      
    } catch (error) {
      console.error('❌ Erro na busca popular:', error);
      return FALLBACK_TRACKS;
    }
  }

  // Filtrar músicas de fallback baseado na query
  private static getFallbackTracks(query: string): MusicTrack[] {
    const searchTerm = query.toLowerCase();
    
    return FALLBACK_TRACKS.filter(track => {
      return track.title.toLowerCase().includes(searchTerm) ||
             track.artist.toLowerCase().includes(searchTerm) ||
             searchTerm.includes('infantil') ||
             searchTerm.includes('children') ||
             searchTerm.includes('kids') ||
             searchTerm.includes('music');
    });
  }

  static markTrackAsFailed(track: MusicTrack) {
    const key = `${track.source}-${track.id}`;
    this.failedTracks.add(key);
    console.log(`❌ Música marcada como falha: ${track.title} (${track.source})`);
    
    setTimeout(() => {
      this.failedTracks.delete(key);
      console.log(`🔄 Música removida da blacklist: ${track.title}`);
    }, 5 * 60 * 1000);
  }

  static getNextValidTrack(tracks: MusicTrack[], currentTrack: MusicTrack): MusicTrack | null {
    if (tracks.length === 0) return null;
    
    const currentIndex = tracks.findIndex(t => 
      t.id === currentTrack.id && t.source === currentTrack.source
    );
    
    for (let i = 1; i < tracks.length; i++) {
      const nextIndex = (currentIndex + i) % tracks.length;
      const track = tracks[nextIndex];
      
      if (!this.failedTracks.has(`${track.source}-${track.id}`)) {
        console.log(`✅ Próxima música válida encontrada: ${track.title}`);
        return track;
      }
    }
    
    console.log('⚠️ Nenhuma música válida restante na lista');
    return null;
  }

  static getNextTrackWithPreview(tracks: MusicTrack[], currentTrack: MusicTrack): MusicTrack | null {
    const tracksWithPreview = tracks.filter(track => 
      track.has_preview && 
      !this.failedTracks.has(`${track.source}-${track.id}`)
    );
    
    if (tracksWithPreview.length === 0) return null;
    
    const currentIndex = tracksWithPreview.findIndex(t => 
      t.id === currentTrack.id && t.source === currentTrack.source
    );
    
    if (currentIndex === -1) return tracksWithPreview[0];
    
    const nextIndex = (currentIndex + 1) % tracksWithPreview.length;
    return tracksWithPreview[nextIndex];
  }

  static async getBPM(track: MusicTrack): Promise<number> {
    if (track.bpm) {
      return track.bpm;
    }

    // Se for música local, usar BPM padrão
    if (track.source === 'local') {
      return track.bpm || 120;
    }

    // Para músicas do Spotify, tentar obter features
    const features = await SpotifyAPI.getAudioFeatures(track.id);
    if (features?.bpm) {
      return features.bpm;
    }

    // BPM padrão baseado no tipo de música
    const title = track.title.toLowerCase();
    if (title.includes('twinkle') || title.includes('brilha')) return 120;
    if (title.includes('happy') || title.includes('parabéns')) return 140;
    if (title.includes('mary')) return 120;
    if (title.includes('old') || title.includes('macdonald')) return 130;
    if (title.includes('row')) return 110;
    if (title.includes('ciranda')) return 125;
    
    return 120;
  }
}
