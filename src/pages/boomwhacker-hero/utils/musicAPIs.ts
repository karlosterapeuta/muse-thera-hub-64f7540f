
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  preview_url?: string;
  image?: string;
  popularity?: number;
  external_url?: string;
  source: 'spotify' | 'jamendo' | 'demo';
  bpm?: number;
}

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
    clientId: 'YOUR_JAMENDO_CLIENT_ID',
    searchUrl: 'https://api.jamendo.com/v3.0/tracks/'
  }
};

export class SpotifyAPI {
  private static token: string | null = null;

  static async getToken(): Promise<string | null> {
    try {
      // Verificar se as credenciais estão configuradas
      if (API_CONFIG.spotify.clientSecret === 'YOUR_SPOTIFY_CLIENT_SECRET') {
        console.log('❌ Credenciais do Spotify não configuradas');
        return null;
      }

      const response = await fetch(API_CONFIG.spotify.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(`${API_CONFIG.spotify.clientId}:${API_CONFIG.spotify.clientSecret}`)
        },
        body: 'grant_type=client_credentials'
      });

      if (!response.ok) {
        console.error('❌ Falha ao obter token do Spotify:', response.status, response.statusText);
        return null;
      }

      const data = await response.json();
      this.token = data.access_token;
      console.log('✅ Token do Spotify obtido com sucesso');
      return data.access_token;
    } catch (error) {
      console.error('❌ Erro ao obter token do Spotify:', error);
      return null;
    }
  }

  static async search(query: string): Promise<MusicTrack[]> {
    try {
      let token = this.token;
      if (!token) {
        token = await this.getToken();
        if (!token) {
          console.log('⚠️ Spotify não disponível, token não obtido');
          return [];
        }
      }

      // Melhorar a query de busca para músicas infantis
      const searchQuery = `${query} genre:children OR ${query} kids OR ${query} infantil`;
      const searchParams = new URLSearchParams({
        q: searchQuery,
        type: 'track',
        market: 'BR',
        limit: '20'
      });

      console.log(`🔍 Buscando no Spotify: ${searchQuery}`);

      const response = await fetch(`${API_CONFIG.spotify.searchUrl}?${searchParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        console.error('❌ Busca no Spotify falhou:', response.status, response.statusText);
        // Token pode ter expirado, tentar renovar
        if (response.status === 401) {
          this.token = null;
        }
        return [];
      }

      const data = await response.json();
      console.log(`✅ Spotify retornou ${data.tracks.items.length} resultados`);
      
      return data.tracks.items.map((item: any) => ({
        id: item.id,
        title: item.name,
        artist: item.artists[0]?.name || 'Artista Desconhecido',
        duration: Math.floor(item.duration_ms / 1000),
        preview_url: item.preview_url,
        image: item.album.images[0]?.url,
        popularity: item.popularity,
        external_url: item.external_urls.spotify,
        source: 'spotify' as const,
        bpm: undefined
      }));
    } catch (error) {
      console.error('❌ Erro na busca do Spotify:', error);
      return [];
    }
  }

  static async getAudioFeatures(trackId: string): Promise<{ bpm?: number } | null> {
    try {
      let token = this.token;
      if (!token) {
        token = await this.getToken();
        if (!token) return null;
      }

      const response = await fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return {
        bpm: Math.round(data.tempo)
      };
    } catch (error) {
      console.error('Error getting audio features:', error);
      return null;
    }
  }
}

export class JamendoAPI {
  static async search(query: string): Promise<MusicTrack[]> {
    try {
      // Verificar se a chave está configurada
      if (API_CONFIG.jamendo.clientId === 'YOUR_JAMENDO_CLIENT_ID') {
        console.log('❌ Chave do Jamendo não configurada');
        return [];
      }

      const searchParams = new URLSearchParams({
        client_id: API_CONFIG.jamendo.clientId,
        format: 'json',
        namesearch: query,
        limit: '20',
        tags: 'children,kids,instrumental,happy,family',
        audioformat: 'mp31'
      });

      console.log(`🔍 Buscando no Jamendo: ${query}`);

      const response = await fetch(`${API_CONFIG.jamendo.searchUrl}?${searchParams}`);
      
      if (!response.ok) {
        console.error('❌ Busca no Jamendo falhou:', response.status, response.statusText);
        return [];
      }

      const data = await response.json();
      console.log(`✅ Jamendo retornou ${data.results?.length || 0} resultados`);
      
      return (data.results || []).map((item: any) => ({
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
}

export class DemoAPI {
  static getPopularTracks(): MusicTrack[] {
    return [
      {
        id: 'demo-1',
        title: 'Twinkle Twinkle Little Star',
        artist: 'Tradicional',
        duration: 30,
        preview_url: '/assets/music/children-song-1.mp3',
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
  }

  static search(query: string): MusicTrack[] {
    const tracks = this.getPopularTracks();
    
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

// Classe principal para gerenciar todas as APIs
export class MusicAPIManager {
  static async search(query: string, source: 'spotify' | 'jamendo' | 'demo'): Promise<MusicTrack[]> {
    console.log(`🎵 Iniciando busca: "${query}" na fonte: ${source}`);
    
    switch (source) {
      case 'spotify':
        const spotifyResults = await SpotifyAPI.search(query);
        // Se Spotify falhar, tentar demo como fallback
        if (spotifyResults.length === 0) {
          console.log('⚠️ Spotify sem resultados, usando demo como fallback');
          return DemoAPI.search(query);
        }
        return spotifyResults;
        
      case 'jamendo':
        const jamendoResults = await JamendoAPI.search(query);
        // Se Jamendo falhar, tentar demo como fallback
        if (jamendoResults.length === 0) {
          console.log('⚠️ Jamendo sem resultados, usando demo como fallback');
          return DemoAPI.search(query);
        }
        return jamendoResults;
        
      case 'demo':
        return DemoAPI.search(query);
        
      default:
        return DemoAPI.search(query);
    }
  }

  static async getPopular(source: 'spotify' | 'jamendo' | 'demo'): Promise<MusicTrack[]> {
    console.log(`🎵 Buscando músicas populares da fonte: ${source}`);
    
    switch (source) {
      case 'spotify':
        const spotifyPopular = await SpotifyAPI.search('children songs popular');
        if (spotifyPopular.length === 0) {
          console.log('⚠️ Spotify não disponível, usando demo');
          return DemoAPI.getPopularTracks();
        }
        return spotifyPopular;
        
      case 'jamendo':
        const jamendoPopular = await JamendoAPI.search('children happy');
        if (jamendoPopular.length === 0) {
          console.log('⚠️ Jamendo não disponível, usando demo');
          return DemoAPI.getPopularTracks();
        }
        return jamendoPopular;
        
      case 'demo':
        return DemoAPI.getPopularTracks();
        
      default:
        return DemoAPI.getPopularTracks();
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
    
    // BPM padrão para músicas infantis
    return 120;
  }
}
