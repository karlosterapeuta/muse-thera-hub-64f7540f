
// Definição do tipo para representar uma faixa de música
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  preview_url: string | null;
  image: string | null;
  popularity: number | null;
  external_url: string | null;
  source: 'spotify' | 'jamendo' | 'demo' | 'youtube' | 'synthesized';
  bpm?: number;
  failed?: boolean;
}

// Classe para encapsular a lógica de busca na API do Spotify
class SpotifyAPI {
  private static apiUrl = '/api/spotify-api';

  static async search(query: string): Promise<MusicTrack[]> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'search', query })
      });
      
      // Verificar se a resposta é válida
      if (!response.ok) {
        console.warn(`Spotify API não disponível (${response.status}), usando fallback`);
        return [];
      }
      
      const text = await response.text();
      if (!text.trim()) {
        console.warn('Resposta vazia da API Spotify, usando fallback');
        return [];
      }
      
      const data = JSON.parse(text);
      return (data.tracks || []).map((track: any) => ({
        id: track.id,
        title: track.title,
        artist: track.artist,
        duration: track.duration,
        preview_url: track.preview_url,
        image: track.image,
        popularity: track.popularity,
        external_url: track.external_url,
        source: 'spotify' as const,
        bpm: track.bpm
      }));
    } catch (error: any) {
      console.warn('Spotify API indisponível, usando fallback:', error.message);
      return [];
    }
  }

  static async getPopular(): Promise<MusicTrack[]> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'popular' })
      });
      
      // Verificar se a resposta é válida
      if (!response.ok) {
        console.warn(`Spotify API não disponível (${response.status}), usando fallback`);
        return [];
      }
      
      const text = await response.text();
      if (!text.trim()) {
        console.warn('Resposta vazia da API Spotify, usando fallback');
        return [];
      }
      
      const data = JSON.parse(text);
      return (data.tracks || []).map((track: any) => ({
        id: track.id,
        title: track.title,
        artist: track.artist,
        duration: track.duration,
        preview_url: track.preview_url,
        image: track.image,
        popularity: track.popularity,
        external_url: track.external_url,
        source: 'spotify' as const,
        bpm: track.bpm
      }));
    } catch (error: any) {
      console.warn('Spotify API indisponível, usando fallback:', error.message);
      return [];
    }
  }

  static async getAudioFeatures(trackId: string): Promise<{ bpm?: number } | null> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'audio-features', trackId })
      });
      
      if (!response.ok) {
        return null;
      }
      
      const text = await response.text();
      if (!text.trim()) {
        return null;
      }
      
      const data = JSON.parse(text);
      return data || null;
    } catch (error: any) {
      console.warn('Erro ao obter audio features do Spotify:', error.message);
      return null;
    }
  }
}

// Gerador de músicas originais livres de direitos autorais
import { globalAudioSynthesis } from './audioSynthesis';

/**
 * AVISO LEGAL: Todas as músicas abaixo são composições originais
 * criadas especificamente para este aplicativo educacional.
 * 
 * - Todos os títulos são originais e fictícios
 * - Todos os artistas são fictícios 
 * - Todas as melodias são geradas proceduralmente
 * - Conteúdo 100% livre de direitos autorais
 * - Licença: Creative Commons CC0 (Domínio Público)
 */
export const generateOriginalDemoTracks = async (): Promise<MusicTrack[]> => {
  const originalSongs = [
    // Músicas Infantis Originais
    { title: "Melodia da Manhã", artist: "Coral Infantil Harmonia", genre: "infantil", bpm: 100 },
    { title: "Dança dos Passarinhos", artist: "Grupo Pequenos Músicos", genre: "infantil", bpm: 95 },
    { title: "Cantiga do Sol", artist: "Coral Infantil Harmonia", genre: "infantil", bpm: 110 },
    { title: "Brincadeira Musical", artist: "Os Pequenos Cantores", genre: "infantil", bpm: 105 },
    { title: "Roda da Alegria", artist: "Turma Musical", genre: "infantil", bpm: 120 },
    { title: "Canção das Cores", artist: "Grupo Pequenos Músicos", genre: "infantil", bpm: 115 },
    { title: "Música dos Animais", artist: "Coral Infantil Harmonia", genre: "infantil", bpm: 100 },
    { title: "Festa na Floresta", artist: "Os Pequenos Cantores", genre: "infantil", bpm: 110 },
    { title: "Sonho de Criança", artist: "Turma Musical", genre: "infantil", bpm: 125 },
    { title: "Jardim Encantado", artist: "Grupo Pequenos Músicos", genre: "infantil", bpm: 95 },
    
    // MPB-Style Original
    { title: "Brisa Dourada", artist: "Os Trovadores", genre: "mpb", bpm: 120 },
    { title: "Caminho das Flores", artist: "Banda Melodia", genre: "mpb", bpm: 95 },
    { title: "Sonho Azul", artist: "Grupo Harmonia", genre: "mpb", bpm: 85 },
    { title: "Noite Serena", artist: "Os Trovadores", genre: "mpb", bpm: 110 },
    { title: "Luz da Esperança", artist: "Banda Melodia", genre: "mpb", bpm: 100 },
    { title: "Momento de Paz", artist: "Grupo Harmonia", genre: "mpb", bpm: 90 },
    { title: "Verso Livre", artist: "Os Trovadores", genre: "mpb", bpm: 115 },
    { title: "Tempo Dourado", artist: "Banda Melodia", genre: "mpb", bpm: 105 },
    
    // Bossa Nova Original
    { title: "Suave Compasso", artist: "Duo Bossa Livre", genre: "bossa nova", bpm: 125 },
    { title: "Ritmo Carioca", artist: "Conjunto Melodia", genre: "bossa nova", bpm: 115 },
    { title: "Doce Harmonia", artist: "Trio Suave", genre: "bossa nova", bpm: 110 },
    { title: "Brisa da Tarde", artist: "Duo Bossa Livre", genre: "bossa nova", bpm: 120 },
    { title: "Melodia Urbana", artist: "Conjunto Melodia", genre: "bossa nova", bpm: 90 },
    
    // Rock Nacional Original
    { title: "Energia Vital", artist: "Banda Força", genre: "rock", bpm: 130 },
    { title: "Liberdade Total", artist: "Grupo Rebeldia", genre: "rock", bpm: 140 },
    { title: "Vento Norte", artist: "Os Guerreiros", genre: "rock", bpm: 125 },
    { title: "Alma Rebelde", artist: "Banda Força", genre: "rock", bpm: 135 },
    { title: "Poder Interior", artist: "Grupo Rebeldia", genre: "rock", bpm: 145 },
    { title: "Fogo Sagrado", artist: "Os Guerreiros", genre: "rock", bpm: 120 },
    { title: "Força da Juventude", artist: "Banda Força", genre: "rock", bpm: 110 },
    
    // Forró Original
    { title: "Festa na Praça", artist: "Trio Nordestino", genre: "forró", bpm: 110 },
    { title: "Dança do Vento", artist: "Grupo Sanfona", genre: "forró", bpm: 120 },
    { title: "Noite Estrelada", artist: "Os Forrozeiros", genre: "forró", bpm: 115 },
    { title: "Alegria do Povo", artist: "Trio Nordestino", genre: "forró", bpm: 125 },
    { title: "Baile da Roça", artist: "Grupo Sanfona", genre: "forró", bpm: 118 },
    
    // Sertanejo Original
    { title: "Campo Dourado", artist: "Dupla Sertão", genre: "sertanejo", bpm: 85 },
    { title: "Vida Simples", artist: "Os Caipiras", genre: "sertanejo", bpm: 90 },
    { title: "Terra Querida", artist: "Dupla Sertão", genre: "sertanejo", bpm: 95 },
    { title: "Raízes do Coração", artist: "Os Caipiras", genre: "sertanejo", bpm: 88 },
    
    // Samba Original
    { title: "Alegria Brasileira", artist: "Escola de Samba", genre: "samba", bpm: 100 },
    { title: "Ritmo do Coração", artist: "Roda de Samba", genre: "samba", bpm: 105 },
    { title: "Festa Popular", artist: "Escola de Samba", genre: "samba", bpm: 108 },
    { title: "Samba da Vida", artist: "Roda de Samba", genre: "samba", bpm: 95 },
    
    // Romântica Original
    { title: "Amor Verdadeiro", artist: "Cantor Romântico", genre: "romântica", bpm: 80 },
    { title: "Coração em Paz", artist: "Voz Suave", genre: "romântica", bpm: 75 },
    { title: "Sentimento Puro", artist: "Cantor Romântico", genre: "romântica", bpm: 85 },
    { title: "Doce Lembrança", artist: "Voz Suave", genre: "romântica", bpm: 70 }
  ];

  const tracks: MusicTrack[] = [];

  // Processar as primeiras 15 músicas com áudio sintético para performance
  for (let index = 0; index < Math.min(originalSongs.length, 15); index++) {
    const song = originalSongs[index];
    const duration = Math.floor(Math.random() * 120) + 120; // 2-4 minutos
    
    let preview_url: string | null = null;
    
    try {
      // Gerar áudio sintético para as primeiras músicas
      if (index < 8) { // Gerar áudio para as primeiras 8 apenas
        preview_url = await globalAudioSynthesis.generateOriginalMelody(song.title, song.genre, 30);
        console.log(`🎵 Áudio original gerado para: ${song.title}`);
      }
    } catch (error) {
      console.warn(`⚠️ Erro ao gerar áudio para ${song.title}:`, error);
    }

    tracks.push({
      id: `original-${index}`,
      title: song.title,
      artist: song.artist,
      duration: duration,
      preview_url: preview_url,
      image: null,
      popularity: Math.floor(Math.random() * 50) + 50, // 50-100
      external_url: null,
      source: 'demo' as const,
      bpm: song.bpm
    });
  }

  // Adicionar o restante sem áudio sintético para não sobrecarregar
  for (let index = 15; index < originalSongs.length; index++) {
    const song = originalSongs[index];
    const duration = Math.floor(Math.random() * 120) + 120;
    
    tracks.push({
      id: `original-${index}`,
      title: song.title,
      artist: song.artist,
      duration: duration,
      preview_url: null,
      image: null,
      popularity: Math.floor(Math.random() * 50) + 50,
      external_url: null,
      source: 'demo' as const,
      bpm: song.bpm
    });
  }

  return tracks;
};

// Classe para buscar músicas na API Jamendo
class JamendoAPI {
  // Removido process.env para evitar erro no browser
  private static clientId: string | null = null;
  private static baseUrl = 'https://api.jamendo.com/v3.0';

  static async search(query: string): Promise<MusicTrack[]> {
    if (!this.clientId) {
      console.warn('Jamendo Client ID não configurado.');
      return [];
    }

    try {
      const url = `${this.baseUrl}/tracks?client_id=${this.clientId}&format=jsonpretty&limit=20&searchtext=${encodeURIComponent(query)}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.results && Array.isArray(data.results)) {
        return data.results.map((track: any) => ({
          id: track.id.toString(),
          title: track.name,
          artist: track.artist_name,
          duration: track.duration,
          preview_url: track.audiodownload,
          image: track.image,
          popularity: track.popularity || 0,
          external_url: track.shareurl,
          source: 'jamendo' as const,
          bpm: track.tempo
        }));
      } else {
        console.warn('Formato de resposta inesperado da API Jamendo.');
        return [];
      }
    } catch (error: any) {
      console.error('Erro ao buscar no Jamendo:', error.message);
      return [];
    }
  }

  static async getPopular(): Promise<MusicTrack[]> {
    if (!this.clientId) {
      console.warn('Jamendo Client ID não configurado.');
      return [];
    }

    try {
      const url = `${this.baseUrl}/tracks/radio?client_id=${this.clientId}&format=jsonpretty&limit=20`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.results && Array.isArray(data.results)) {
        return data.results.map((track: any) => ({
          id: track.id.toString(),
          title: track.name,
          artist: track.artist_name,
          duration: track.duration,
          preview_url: track.audiodownload,
          image: track.image,
          popularity: track.popularity || 0,
          external_url: track.shareurl,
          source: 'jamendo' as const,
          bpm: track.tempo
        }));
      } else {
        console.warn('Formato de resposta inesperado da API Jamendo.');
        return [];
      }
    } catch (error: any) {
      console.error('Erro ao buscar populares no Jamendo:', error.message);
      return [];
    }
  }
}

// Classe para buscar vídeos de música no YouTube (simulação)
class YouTubeMusicAPI {
  static async search(query: string): Promise<MusicTrack[]> {
    // Simulação de resultados do YouTube
    const demoTracks = await generateOriginalDemoTracks();
    const demoResults = demoTracks.filter(track =>
      track.title.toLowerCase().includes(query.toLowerCase()) ||
      track.artist.toLowerCase().includes(query.toLowerCase())
    ).map(track => ({
      ...track,
      id: `youtube-${track.id}`,
      source: 'youtube' as const,
      preview_url: null, // YouTube não fornece URLs diretas para preview
      external_url: `https://www.youtube.com/results?search_query=${encodeURIComponent(track.title + ' ' + track.artist)}`
    }));

    return demoResults.slice(0, 8); // Limitar a 8 resultados
  }

  static async getPopular(): Promise<MusicTrack[]> {
    // Simulação de músicas populares do YouTube
    const demoTracks = await generateOriginalDemoTracks();
    const popularTracks = demoTracks.slice(0, 5).map(track => ({
      ...track,
      id: `youtube-${track.id}`,
      source: 'youtube' as const,
      preview_url: null, // YouTube não fornece URLs diretas para preview
      external_url: `https://www.youtube.com/results?search_query=${encodeURIComponent(track.title + ' ' + track.artist)}`
    }));

    return popularTracks;
  }
}

// Classe para gerenciar a busca em múltiplas APIs de música
export class MusicAPIManager {
  private static demoTracksCache: MusicTrack[] | null = null;

  static async search(query: string, source: 'spotify' | 'jamendo' | 'demo' | 'youtube' = 'demo'): Promise<MusicTrack[]> {
    try {
      let results: MusicTrack[] = [];

      switch (source) {
        case 'spotify':
          results = await SpotifyAPI.search(query);
          // Se Spotify falhar, usar demo como fallback
          if (results.length === 0) {
            console.log('Spotify falhou, usando demo como fallback');
            const demoTracks = await this.getDemoTracks();
            results = demoTracks.filter(track =>
              track.title.toLowerCase().includes(query.toLowerCase()) ||
              track.artist.toLowerCase().includes(query.toLowerCase())
            );
          }
          break;
        case 'jamendo':
          results = await JamendoAPI.search(query);
          // Se Jamendo falhar, usar demo como fallback
          if (results.length === 0) {
            console.log('Jamendo falhou, usando demo como fallback');
            const demoTracks = await this.getDemoTracks();
            results = demoTracks.filter(track =>
              track.title.toLowerCase().includes(query.toLowerCase()) ||
              track.artist.toLowerCase().includes(query.toLowerCase())
            );
          }
          break;
        case 'youtube':
          results = await YouTubeMusicAPI.search(query);
          break;
        case 'demo':
          const demoTracks = await this.getDemoTracks();
          results = demoTracks.filter(track =>
            track.title.toLowerCase().includes(query.toLowerCase()) ||
            track.artist.toLowerCase().includes(query.toLowerCase())
          );
          break;
        default:
          console.warn('Fonte de música inválida, usando demo.');
          const defaultTracks = await this.getDemoTracks();
          results = defaultTracks.filter(track =>
            track.title.toLowerCase().includes(query.toLowerCase()) ||
            track.artist.toLowerCase().includes(query.toLowerCase())
          );
      }

      return results.filter(track => !track.failed);
    } catch (error) {
      console.error('Erro ao buscar músicas, usando fallback demo:', error);
      // Fallback final para demo
      const demoTracks = await this.getDemoTracks();
      return demoTracks.filter(track =>
        track.title.toLowerCase().includes(query.toLowerCase()) ||
        track.artist.toLowerCase().includes(query.toLowerCase())
      );
    }
  }

  static async getPopular(source: 'spotify' | 'jamendo' | 'demo' | 'youtube' = 'demo'): Promise<MusicTrack[]> {
    try {
      let results: MusicTrack[] = [];

      switch (source) {
        case 'spotify':
          results = await SpotifyAPI.getPopular();
          // Se Spotify falhar, usar demo como fallback
          if (results.length === 0) {
            console.log('Spotify populares falhou, usando demo como fallback');
            results = await this.getDemoTracks();
          }
          break;
        case 'jamendo':
          results = await JamendoAPI.getPopular();
          // Se Jamendo falhar, usar demo como fallback
          if (results.length === 0) {
            console.log('Jamendo populares falhou, usando demo como fallback');
            results = await this.getDemoTracks();
          }
          break;
        case 'youtube':
          results = await YouTubeMusicAPI.getPopular();
          break;
        case 'demo':
          results = await this.getDemoTracks();
          break;
        default:
          console.warn('Fonte de música inválida, usando demo.');
          results = await this.getDemoTracks();
      }

      return results.filter(track => !track.failed);
    } catch (error) {
      console.error('Erro ao buscar músicas populares, usando fallback demo:', error);
      // Fallback final para demo
      return await this.getDemoTracks();
    }
  }

  // Método privado para obter tracks demo com cache
  private static async getDemoTracks(): Promise<MusicTrack[]> {
    if (!this.demoTracksCache) {
      console.log('🎵 Gerando biblioteca original com áudio sintético...');
      this.demoTracksCache = await generateOriginalDemoTracks();
    }
    return this.demoTracksCache;
  }

  static markTrackAsFailed(track: MusicTrack) {
    // Implementar lógica para marcar a música como falha
    console.warn(`Música falhou: ${track.title} - ${track.artist}`);
    track.failed = true;
  }

  static getNextValidTrack(tracks: MusicTrack[], currentIndex: number): MusicTrack | null {
    for (let i = currentIndex + 1; i < tracks.length; i++) {
      if (!tracks[i].failed) {
        return tracks[i];
      }
    }
    return null;
  }

  // Limpar cache de demo tracks
  static clearCache() {
    this.demoTracksCache = null;
    globalAudioSynthesis.clearCache();
  }
}
