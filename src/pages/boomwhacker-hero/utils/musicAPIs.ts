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
  spotify_success?: boolean;
}

// Músicas de fallback apenas se Spotify falhar completamente
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

      // Verificar se foi bem-sucedido
      if (data?.spotify_success && data?.tracks?.length > 0) {
        console.log(`✅ Spotify conectado! ${data.tracks.length} músicas com preview encontradas`);
        return data.tracks;
      }

      console.warn(`⚠️ Spotify não retornou resultados válidos`);
      return [];
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

      // Verificar se foi bem-sucedido
      if (data?.spotify_success && data?.tracks?.length > 0) {
        console.log(`✅ Spotify conectado! ${data.tracks.length} músicas populares com preview`);
        return data.tracks;
      }

      console.warn(`⚠️ Spotify não retornou músicas populares válidas`);
      return [];
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
      // Buscar no Spotify primeiro (agora otimizado)
      const spotifyResults = await SpotifyAPI.search(query);
      
      if (spotifyResults.length > 0) {
        console.log(`✅ Spotify: ${spotifyResults.length} músicas encontradas, todas com preview!`);
        return spotifyResults;
      }
      
      // Só usar fallback se Spotify falhar completamente
      console.log('🔄 Spotify indisponível, usando músicas de fallback');
      const fallbackResults = this.getFallbackTracks(query);
      console.log(`⚠️ Fallback: ${fallbackResults.length} músicas locais`);
      return fallbackResults;
      
    } catch (error) {
      console.error('❌ Erro na busca:', error);
      return this.getFallbackTracks(query);
    }
  }

  static async getPopular(): Promise<MusicTrack[]> {
    console.log('🎵 Buscando músicas populares');
    
    try {
      // Buscar no Spotify primeiro (agora otimizado)
      const spotifyResults = await SpotifyAPI.getPopular();
      
      if (spotifyResults.length > 0) {
        console.log(`✅ Spotify: ${spotifyResults.length} músicas populares, todas com preview!`);
        return spotifyResults;
      }
      
      // Só usar fallback se Spotify falhar completamente
      console.log('🔄 Spotify indisponível, usando músicas de fallback populares');
      console.log(`⚠️ Fallback: ${FALLBACK_TRACKS.length} músicas locais`);
      return FALLBACK_TRACKS;
      
    } catch (error) {
      console.error('❌ Erro na busca popular:', error);
      return FALLBACK_TRACKS;
    }
  }

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

    if (track.source === 'local') {
      return track.bpm || 120;
    }

    const features = await SpotifyAPI.getAudioFeatures(track.id);
    if (features?.bpm) {
      return features.bpm;
    }

    return 120;
  }
}
