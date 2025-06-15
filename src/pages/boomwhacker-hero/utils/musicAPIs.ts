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
}

// Instância global para síntese de áudio
let audioSynthesis: AudioSynthesis | null = null;

const getAudioSynthesis = () => {
  if (!audioSynthesis) {
    audioSynthesis = new AudioSynthesis();
  }
  return audioSynthesis;
};

// Configurações das APIs
export const API_CONFIG = {
  spotify: {
    clientId: '456e8998507c4ce69392ec1afd8a7fb6',
    // Para produção, mova para variáveis de ambiente seguras
    clientSecret: 'YOUR_SPOTIFY_CLIENT_SECRET',
    tokenUrl: 'https://accounts.spotify.com/api/token',
    searchUrl: 'https://api.spotify.com/v1/search'
  },
  jamendo: {
    clientId: '5d9cbefe',
    clientSecret: 'a062a2dba4d89577a089199a1b5c795a',
    searchUrl: 'https://api.jamendo.com/v3.0/tracks/'
  }
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
      return tracks;
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
      return tracks;
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

      // Busca mais ampla sem filtros restritivos
      const searchParams = new URLSearchParams({
        client_id: API_KEY,
        format: 'json',
        namesearch: query,
        limit: '30',
        audioformat: 'mp31',
        order: 'popularity_total'
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
      
      return results.map((item: any) => ({
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
      console.error('❌ Erro na busca do Jamendo:', error);
      return [];
    }
  }

  static async getPopular(): Promise<MusicTrack[]> {
    try {
      const API_KEY = '5d9cbefe';

      // Busca por músicas populares sem filtros muito específicos
      const searchParams = new URLSearchParams({
        client_id: API_KEY,
        format: 'json',
        limit: '30',
        audioformat: 'mp31',
        order: 'popularity_total'
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
      
      return results.map((item: any) => ({
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
    const synthesis = getAudioSynthesis();
    
    const tracks: MusicTrack[] = [
      {
        id: 'demo-1',
        title: 'Twinkle Twinkle Little Star',
        artist: 'Tradicional',
        duration: 30,
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
      },
      {
        id: 'demo-5',
        title: 'Row Row Row Your Boat',
        artist: 'Tradicional',
        duration: 22,
        popularity: 75,
        source: 'demo',
        bpm: 110
      },
      {
        id: 'demo-6',
        title: 'Brilha Brilha Estrelinha',
        artist: 'Infantil',
        duration: 28,
        popularity: 88,
        source: 'demo',
        bpm: 120
      },
      {
        id: 'demo-7',
        title: 'Parabéns pra Você',
        artist: 'Infantil',
        duration: 24,
        popularity: 85,
        source: 'demo',
        bpm: 140
      },
      {
        id: 'demo-8',
        title: 'Ciranda Cirandinha',
        artist: 'Folclore',
        duration: 26,
        popularity: 82,
        source: 'demo',
        bpm: 125
      }
    ];

    // Gerar áudio sintético para cada música demo
    for (const track of tracks) {
      try {
        const audioUrl = await synthesis.generateSimpleMelody(track.title);
        track.preview_url = audioUrl;
        track.source = 'synthesized';
        console.log(`🎵 Áudio gerado para: ${track.title}`);
      } catch (error) {
        console.error(`❌ Erro ao gerar áudio para ${track.title}:`, error);
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

// Classe principal para gerenciar todas as APIs com fallback robusto
export class MusicAPIManager {
  static async search(query: string, source: 'spotify' | 'jamendo' | 'demo'): Promise<MusicTrack[]> {
    console.log(`🎵 Iniciando busca: "${query}" na fonte: ${source}`);
    
    // Sempre tentar todas as fontes em cascata
    let results: MusicTrack[] = [];
    
    // 1. Tentar fonte especificada primeiro
    if (source === 'spotify') {
      results = await SpotifyAPI.search(query);
    } else if (source === 'jamendo') {
      results = await JamendoAPI.search(query);
    } else if (source === 'demo') {
      results = await DemoAPI.search(query);
    }
    
    // 2. Se não encontrou resultados suficientes, tentar outras fontes
    if (results.length < 5) {
      console.log(`⚠️ Poucos resultados em ${source}, tentando fallbacks...`);
      
      if (source !== 'spotify') {
        const spotifyResults = await SpotifyAPI.search(query);
        results.push(...spotifyResults);
      }
      
      if (source !== 'jamendo' && results.length < 10) {
        const jamendoResults = await JamendoAPI.search(query);
        results.push(...jamendoResults);
      }
      
      if (source !== 'demo' && results.length < 15) {
        const demoResults = await DemoAPI.search(query);
        results.push(...demoResults);
      }
    }
    
    // 3. Remover duplicatas e limitar resultados
    const uniqueResults = results.filter((track, index, self) => 
      index === self.findIndex(t => t.id === track.id && t.source === track.source)
    ).slice(0, 20);
    
    console.log(`✅ Total final: ${uniqueResults.length} músicas encontradas`);
    return uniqueResults;
  }

  static async getPopular(source: 'spotify' | 'jamendo' | 'demo'): Promise<MusicTrack[]> {
    console.log(`🎵 Buscando músicas populares da fonte: ${source}`);
    
    let results: MusicTrack[] = [];
    
    // Tentar fonte primária
    if (source === 'spotify') {
      results = await SpotifyAPI.getPopular();
    } else if (source === 'jamendo') {
      results = await JamendoAPI.getPopular();
    } else if (source === 'demo') {
      results = await DemoAPI.getPopularTracks();
    }
    
    // Fallback para outras fontes se necessário
    if (results.length < 5) {
      console.log(`⚠️ Poucos resultados populares em ${source}, usando fallbacks...`);
      
      const fallbackSources = ['spotify', 'jamendo', 'demo'].filter(s => s !== source);
      
      for (const fallbackSource of fallbackSources) {
        if (results.length >= 15) break;
        
        try {
          let fallbackResults: MusicTrack[] = [];
          
          if (fallbackSource === 'spotify') {
            fallbackResults = await SpotifyAPI.getPopular();
          } else if (fallbackSource === 'jamendo') {
            fallbackResults = await JamendoAPI.getPopular();
          } else if (fallbackSource === 'demo') {
            fallbackResults = await DemoAPI.getPopularTracks();
          }
          
          results.push(...fallbackResults);
        } catch (error) {
          console.error(`❌ Erro no fallback ${fallbackSource}:`, error);
        }
      }
    }
    
    // Remover duplicatas e retornar
    const uniqueResults = results.filter((track, index, self) => 
      index === self.findIndex(t => t.id === track.id && t.source === track.source)
    ).slice(0, 20);
    
    console.log(`✅ Total de músicas populares: ${uniqueResults.length}`);
    return uniqueResults;
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
    
    // BPM padrão para músicas infantis
    return 120;
  }
}
