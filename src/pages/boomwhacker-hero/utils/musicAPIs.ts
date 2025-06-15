
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
      const response = await fetch(API_CONFIG.spotify.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(`${API_CONFIG.spotify.clientId}:${API_CONFIG.spotify.clientSecret}`)
        },
        body: 'grant_type=client_credentials'
      });

      if (!response.ok) {
        throw new Error('Failed to get Spotify token');
      }

      const data = await response.json();
      this.token = data.access_token;
      return data.access_token;
    } catch (error) {
      console.error('Spotify token error:', error);
      return null;
    }
  }

  static async search(query: string): Promise<MusicTrack[]> {
    try {
      let token = this.token;
      if (!token) {
        token = await this.getToken();
        if (!token) return [];
      }

      const searchParams = new URLSearchParams({
        q: `${query} genre:children OR ${query} kids OR ${query}`,
        type: 'track',
        market: 'BR',
        limit: '20'
      });

      const response = await fetch(`${API_CONFIG.spotify.searchUrl}?${searchParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Spotify search failed');
      }

      const data = await response.json();
      
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
      console.error('Spotify search error:', error);
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
      const searchParams = new URLSearchParams({
        client_id: API_CONFIG.jamendo.clientId,
        format: 'json',
        namesearch: query,
        limit: '20',
        tags: 'children,kids,instrumental,happy',
        audioformat: 'mp31'
      });

      const response = await fetch(`${API_CONFIG.jamendo.searchUrl}?${searchParams}`);
      
      if (!response.ok) {
        throw new Error('Jamendo search failed');
      }

      const data = await response.json();
      
      return data.results.map((item: any) => ({
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
      console.error('Jamendo search error:', error);
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
      }
    ];
  }

  static search(query: string): MusicTrack[] {
    const tracks = this.getPopularTracks();
    
    if (!query.trim()) {
      return tracks;
    }

    return tracks.filter(track => 
      track.title.toLowerCase().includes(query.toLowerCase()) ||
      track.artist.toLowerCase().includes(query.toLowerCase())
    );
  }
}

// Classe principal para gerenciar todas as APIs
export class MusicAPIManager {
  static async search(query: string, source: 'spotify' | 'jamendo' | 'demo'): Promise<MusicTrack[]> {
    switch (source) {
      case 'spotify':
        return await SpotifyAPI.search(query);
      case 'jamendo':
        return await JamendoAPI.search(query);
      case 'demo':
        return DemoAPI.search(query);
      default:
        return DemoAPI.search(query);
    }
  }

  static async getPopular(source: 'spotify' | 'jamendo' | 'demo'): Promise<MusicTrack[]> {
    switch (source) {
      case 'spotify':
        return await SpotifyAPI.search('children songs popular');
      case 'jamendo':
        return await JamendoAPI.search('children happy');
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
    if (track.title.toLowerCase().includes('twinkle')) return 120;
    if (track.title.toLowerCase().includes('happy')) return 140;
    if (track.title.toLowerCase().includes('mary')) return 120;
    if (track.title.toLowerCase().includes('old')) return 130;
    
    // BPM padrão para músicas infantis
    return 120;
  }
}
