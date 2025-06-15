
import { supabase } from '@/integrations/supabase/client';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  preview_url?: string;
  image?: string;
  popularity?: number;
  external_url?: string;
  source: 'spotify';
  bpm?: number;
  failed?: boolean;
}

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

      const tracks = data?.tracks || [];
      console.log(`📊 Spotify retornou ${tracks.length} resultados`);
      
      // Validar e filtrar tracks
      const validTracks = tracks.filter(track => {
        const hasPreview = track.preview_url && track.preview_url.trim() !== '';
        const hasBasicInfo = track.title && track.artist && track.id;
        
        if (!hasBasicInfo) {
          console.warn(`⚠️ Track inválida: faltam informações básicas`, track);
          return false;
        }
        
        if (!hasPreview) {
          console.warn(`⚠️ Track sem preview: ${track.title} - ${track.artist}`);
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

      const tracks = data?.tracks || [];
      console.log(`📊 Spotify popular retornou ${tracks.length} resultados`);
      
      // Validar tracks populares
      const validTracks = tracks.filter(track => {
        const hasPreview = track.preview_url && track.preview_url.trim() !== '';
        const hasBasicInfo = track.title && track.artist && track.id;
        return hasBasicInfo && hasPreview;
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

// Classe principal para gerenciar API do Spotify
export class MusicAPIManager {
  private static failedTracks = new Set<string>();

  static async search(query: string): Promise<MusicTrack[]> {
    console.log(`🎵 Iniciando busca no Spotify: "${query}"`);
    
    try {
      const results = await SpotifyAPI.search(query);
      
      // Filtrar músicas que falharam anteriormente
      const validResults = results.filter(track => 
        !this.failedTracks.has(`${track.source}-${track.id}`)
      );
      
      console.log(`✅ Total final: ${validResults.length} músicas encontradas no Spotify`);
      return validResults;
    } catch (error) {
      console.error('❌ Erro na busca do Spotify:', error);
      return [];
    }
  }

  static async getPopular(): Promise<MusicTrack[]> {
    console.log('🎵 Buscando músicas populares no Spotify');
    
    try {
      const results = await SpotifyAPI.getPopular();
      
      // Filtrar músicas que falharam
      const validResults = results.filter(track => 
        !this.failedTracks.has(`${track.source}-${track.id}`)
      );
      
      console.log(`✅ Total de músicas populares do Spotify: ${validResults.length}`);
      return validResults;
    } catch (error) {
      console.error('❌ Erro na busca popular do Spotify:', error);
      return [];
    }
  }

  // Marcar música como falha
  static markTrackAsFailed(track: MusicTrack) {
    const key = `${track.source}-${track.id}`;
    this.failedTracks.add(key);
    console.log(`❌ Música marcada como falha: ${track.title} (${track.source})`);
    
    // Limpar blacklist após 5 minutos
    setTimeout(() => {
      this.failedTracks.delete(key);
      console.log(`🔄 Música removida da blacklist: ${track.title}`);
    }, 5 * 60 * 1000);
  }

  // Obter próxima música válida de uma lista
  static getNextValidTrack(tracks: MusicTrack[], currentTrack: MusicTrack): MusicTrack | null {
    if (tracks.length === 0) return null;
    
    const currentIndex = tracks.findIndex(t => 
      t.id === currentTrack.id && t.source === currentTrack.source
    );
    
    // Procurar próxima música válida a partir do índice atual
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

  static async getBPM(track: MusicTrack): Promise<number> {
    if (track.bpm) {
      return track.bpm;
    }

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
