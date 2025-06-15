
import { supabase } from '@/integrations/supabase/client';
import { AudioSynthesis } from './audioSynthesis';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  preview_url?: string;
  image?: string;
  popularity?: number;
  external_url?: string;
  source: 'spotify' | 'jamendo' | 'demo' | 'synthesized';
  bpm?: number;
  failed?: boolean;
}

// Instância global para síntese de áudio
let audioSynthesis: AudioSynthesis | null = null;

const getAudioSynthesis = () => {
  if (!audioSynthesis) {
    audioSynthesis = new AudioSynthesis();
  }
  return audioSynthesis;
};

export class SpotifyAPI {
  static async search(query: string): Promise<MusicTrack[]> {
    try {
      console.log(`🔍 Buscando no Spotify via Supabase: ${query}`);

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

      const tracks = data.tracks || [];
      console.log(`✅ Spotify retornou ${tracks.length} resultados`);
      return tracks.filter(track => track.preview_url); // Só retornar músicas com preview
    } catch (error) {
      console.error('❌ Erro na busca do Spotify:', error);
      return [];
    }
  }

  static async getPopular(): Promise<MusicTrack[]> {
    try {
      console.log('🔍 Buscando músicas populares no Spotify via Supabase');

      const { data, error } = await supabase.functions.invoke('spotify-api', {
        body: {
          action: 'popular'
        }
      });

      if (error) {
        console.error('❌ Erro na função Spotify popular:', error);
        return [];
      }

      const tracks = data.tracks || [];
      console.log(`✅ Spotify popular retornou ${tracks.length} resultados`);
      return tracks.filter(track => track.preview_url); // Só retornar músicas com preview
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
        return null;
      }

      return data;
    } catch (error) {
      console.error('❌ Erro ao obter características do áudio:', error);
      return null;
    }
  }
}

export class JamendoAPI {
  static async search(query: string): Promise<MusicTrack[]> {
    try {
      const API_KEY = '5d9cbefe';

      // Busca mais ampla e sem filtros restritivos
      const searchParams = new URLSearchParams({
        client_id: API_KEY,
        format: 'json',
        search: query,
        limit: '15',
        audioformat: 'mp31', // Voltar para mp31 que é mais estável
        order: 'popularity_total',
        include: 'musicinfo'
      });

      console.log(`🔍 Buscando no Jamendo: ${query}`);

      const response = await fetch(`https://api.jamendo.com/v3.0/tracks/?${searchParams}`);
      
      if (!response.ok) {
        console.error('❌ Busca no Jamendo falhou:', response.status, response.statusText);
        return [];
      }

      const data = await response.json();
      const results = data.results || [];
      
      console.log(`✅ Jamendo retornou ${results.length} resultados`);
      
      // Filtrar e validar URLs de áudio
      const validTracks = results.filter((item: any) => {
        const hasAudio = item.audio && item.audio.length > 0;
        if (!hasAudio) {
          console.log(`⚠️ Música sem áudio: ${item.name}`);
          return false;
        }
        return true;
      });
      
      console.log(`🎵 Jamendo músicas com áudio válido: ${validTracks.length}`);
      
      return validTracks.map((item: any) => ({
        id: item.id.toString(),
        title: item.name,
        artist: item.artist_name,
        duration: item.duration,
        preview_url: item.audio, // URL direta do áudio
        image: item.album_image,
        popularity: Math.floor(Math.random() * 100),
        external_url: item.shareurl,
        source: 'jamendo' as const,
        bpm: undefined
      }));
    } catch (error) {
      console.error('❌ Erro na busca do Jamendo:', error);
      return [];
    }
  }

  static async getPopular(): Promise<MusicTrack[]> {
    try {
      const API_KEY = '5d9cbefe';

      // Busca por músicas populares mais genérica
      const searchParams = new URLSearchParams({
        client_id: API_KEY,
        format: 'json',
        limit: '20',
        audioformat: 'mp31',
        order: 'popularity_total',
        include: 'musicinfo',
        tags: 'instrumental' // Focar em instrumentais que são melhores para o jogo
      });

      console.log('🔍 Buscando músicas populares no Jamendo');

      const response = await fetch(`https://api.jamendo.com/v3.0/tracks/?${searchParams}`);
      
      if (!response.ok) {
        console.error('❌ Busca popular no Jamendo falhou:', response.status, response.statusText);
        return [];
      }

      const data = await response.json();
      const results = data.results || [];
      
      console.log(`✅ Jamendo popular retornou ${results.length} resultados`);
      
      // Filtrar apenas músicas com áudio válido
      const validTracks = results.filter((item: any) => {
        const hasAudio = item.audio && item.audio.length > 0;
        if (!hasAudio) {
          console.log(`⚠️ Música popular sem áudio: ${item.name}`);
          return false;
        }
        return true;
      });
      
      console.log(`🎵 Jamendo popular com áudio válido: ${validTracks.length}`);
      
      return validTracks.map((item: any) => ({
        id: item.id.toString(),
        title: item.name,
        artist: item.artist_name,
        duration: item.duration,
        preview_url: item.audio,
        image: item.album_image,
        popularity: Math.floor(Math.random() * 100),
        external_url: item.shareurl,
        source: 'jamendo' as const,
        bpm: undefined
      }));
    } catch (error) {
      console.error('❌ Erro na busca popular do Jamendo:', error);
      return [];
    }
  }
}

export class DemoAPI {
  static async getPopularTracks(): Promise<MusicTrack[]> {
    const tracks: MusicTrack[] = [
      {
        id: 'demo-1',
        title: 'Twinkle Twinkle Little Star',
        artist: 'Tradicional',
        duration: 30,
        preview_url: '/assets/music/children-song-1.mp3', // Usar arquivo real existente
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
      }
    ];

    // Para músicas sem arquivo real, gerar áudio sintético
    const synthesis = getAudioSynthesis();
    
    for (const track of tracks) {
      if (!track.preview_url) {
        try {
          const audioUrl = await synthesis.generateSimpleMelody(track.title);
          track.preview_url = audioUrl;
          track.source = 'synthesized';
          console.log(`🎵 Áudio gerado para: ${track.title}`);
        } catch (error) {
          console.error(`❌ Erro ao gerar áudio para ${track.title}:`, error);
        }
      }
    }

    return tracks;
  }

  static async search(query: string): Promise<MusicTrack[]> {
    const tracks = await this.getPopularTracks();
    
    if (!query.trim()) {
      return tracks;
    }

    const lowerQuery = query.toLowerCase();
    return tracks.filter(track => 
      track.title.toLowerCase().includes(lowerQuery) ||
      track.artist.toLowerCase().includes(lowerQuery)
    );
  }
}

// Classe principal com sistema de fallback melhorado
export class MusicAPIManager {
  private static failedTracks = new Set<string>();
  private static currentTrackIndex = 0;

  static async search(query: string, source: 'spotify' | 'jamendo' | 'demo'): Promise<MusicTrack[]> {
    console.log(`🎵 Iniciando busca: "${query}" na fonte: ${source}`);
    
    let results: MusicTrack[] = [];
    
    // 1. Tentar fonte especificada primeiro
    try {
      if (source === 'spotify') {
        results = await SpotifyAPI.search(query);
      } else if (source === 'jamendo') {
        results = await JamendoAPI.search(query);
      } else if (source === 'demo') {
        results = await DemoAPI.search(query);
      }
    } catch (error) {
      console.error(`❌ Erro na fonte ${source}:`, error);
    }
    
    // 2. Fallback automático e inteligente
    if (results.length < 3) {
      console.log(`⚠️ Poucos resultados em ${source} (${results.length}), tentando fallbacks...`);
      
      const fallbackOrder = this.getFallbackOrder(source);
      
      for (const fallbackSource of fallbackOrder) {
        if (results.length >= 10) break;
        
        try {
          let fallbackResults: MusicTrack[] = [];
          
          console.log(`🔄 Tentando fallback: ${fallbackSource}`);
          
          if (fallbackSource === 'spotify') {
            fallbackResults = await SpotifyAPI.search(query);
          } else if (fallbackSource === 'jamendo') {
            fallbackResults = await JamendoAPI.search(query);
          } else if (fallbackSource === 'demo') {
            fallbackResults = await DemoAPI.search(query);
          }
          
          if (fallbackResults.length > 0) {
            results.push(...fallbackResults);
            console.log(`✅ Fallback ${fallbackSource}: +${fallbackResults.length} músicas`);
          }
        } catch (error) {
          console.error(`❌ Erro no fallback ${fallbackSource}:`, error);
        }
      }
    }
    
    // 3. Filtrar músicas que falharam anteriormente
    const validResults = results.filter(track => 
      !this.failedTracks.has(`${track.source}-${track.id}`)
    );
    
    // 4. Garantir que sempre temos pelo menos algumas músicas
    if (validResults.length === 0) {
      console.log('🚨 Nenhum resultado válido, carregando demos de emergência...');
      const emergencyTracks = await DemoAPI.getPopularTracks();
      validResults.push(...emergencyTracks);
    }
    
    // 5. Remover duplicatas e limitar resultados
    const uniqueResults = validResults.filter((track, index, self) => 
      index === self.findIndex(t => t.id === track.id && t.source === track.source)
    ).slice(0, 20);
    
    console.log(`✅ Total final: ${uniqueResults.length} músicas encontradas`);
    return uniqueResults;
  }

  static async getPopular(source: 'spotify' | 'jamendo' | 'demo'): Promise<MusicTrack[]> {
    console.log(`🎵 Buscando músicas populares da fonte: ${source}`);
    
    let results: MusicTrack[] = [];
    
    // Tentar fonte primária
    try {
      if (source === 'spotify') {
        results = await SpotifyAPI.getPopular();
      } else if (source === 'jamendo') {
        results = await JamendoAPI.getPopular();
      } else if (source === 'demo') {
        results = await DemoAPI.getPopularTracks();
      }
    } catch (error) {
      console.error(`❌ Erro na fonte ${source}:`, error);
    }
    
    // Fallback automático se necessário
    if (results.length < 3) {
      console.log(`⚠️ Poucos resultados populares em ${source} (${results.length}), usando fallbacks...`);
      
      const fallbackOrder = this.getFallbackOrder(source);
      
      for (const fallbackSource of fallbackOrder) {
        if (results.length >= 15) break;
        
        try {
          let fallbackResults: MusicTrack[] = [];
          
          console.log(`🔄 Fallback popular: ${fallbackSource}`);
          
          if (fallbackSource === 'spotify') {
            fallbackResults = await SpotifyAPI.getPopular();
          } else if (fallbackSource === 'jamendo') {
            fallbackResults = await JamendoAPI.getPopular();
          } else if (fallbackSource === 'demo') {
            fallbackResults = await DemoAPI.getPopularTracks();
          }
          
          if (fallbackResults.length > 0) {
            results.push(...fallbackResults);
            console.log(`✅ Fallback popular ${fallbackSource}: +${fallbackResults.length} músicas`);
          }
        } catch (error) {
          console.error(`❌ Erro no fallback popular ${fallbackSource}:`, error);
        }
      }
    }
    
    // Garantir que sempre temos demos como último recurso
    if (results.length === 0) {
      console.log('🚨 Sem resultados populares, usando demos de emergência...');
      results = await DemoAPI.getPopularTracks();
    }
    
    // Filtrar músicas que falharam
    const validResults = results.filter(track => 
      !this.failedTracks.has(`${track.source}-${track.id}`)
    );
    
    // Remover duplicatas e retornar
    const uniqueResults = validResults.filter((track, index, self) => 
      index === self.findIndex(t => t.id === track.id && t.source === track.source)
    ).slice(0, 20);
    
    console.log(`✅ Total de músicas populares: ${uniqueResults.length}`);
    return uniqueResults;
  }

  // Marcar música como falha (com limpeza automática)
  static markTrackAsFailed(track: MusicTrack) {
    const key = `${track.source}-${track.id}`;
    this.failedTracks.add(key);
    console.log(`❌ Música marcada como falha: ${track.title} (${track.source})`);
    
    // Limpar blacklist após 2 minutos (reduzido para recuperação mais rápida)
    setTimeout(() => {
      this.failedTracks.delete(key);
      console.log(`🔄 Música removida da blacklist: ${track.title}`);
    }, 2 * 60 * 1000);
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

  private static getFallbackOrder(source: string): string[] {
    switch (source) {
      case 'spotify':
        return ['jamendo', 'demo'];
      case 'jamendo':
        return ['demo', 'spotify'];
      case 'demo':
        return ['jamendo', 'spotify'];
      default:
        return ['demo', 'jamendo', 'spotify'];
    }
  }

  static async getBPM(track: MusicTrack): Promise<number> {
    if (track.bpm) {
      return track.bpm;
    }

    if (track.source === 'spotify') {
      const features = await SpotifyAPI.getAudioFeatures(track.id);
      if (features?.bpm) {
        return features.bpm;
      }
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
