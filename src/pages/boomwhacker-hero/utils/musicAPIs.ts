import axios from 'axios';

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
  source: 'spotify' | 'jamendo' | 'demo' | 'youtube';
  bpm?: number;
  failed?: boolean;
}

// Classe para encapsular a lógica de busca na API do Spotify
class SpotifyAPI {
  private static apiUrl = '/api/spotify-api';

  static async search(query: string): Promise<MusicTrack[]> {
    try {
      const response = await axios.post(this.apiUrl, { action: 'search', query });
      return (response.data.tracks || []).map((track: any) => ({
        id: track.id,
        title: track.title,
        artist: track.artist,
        duration: track.duration,
        preview_url: track.preview_url,
        image: track.image,
        popularity: track.popularity,
        external_url: track.external_url,
        source: 'spotify',
        bpm: track.bpm
      }));
    } catch (error: any) {
      console.error('Erro ao buscar no Spotify:', error.message);
      return [];
    }
  }

  static async getPopular(): Promise<MusicTrack[]> {
    try {
      const response = await axios.post(this.apiUrl, { action: 'popular' });
      return (response.data.tracks || []).map((track: any) => ({
        id: track.id,
        title: track.title,
        artist: track.artist,
        duration: track.duration,
        preview_url: track.preview_url,
        image: track.image,
        popularity: track.popularity,
        external_url: track.external_url,
        source: 'spotify',
        bpm: track.bpm
      }));
    } catch (error: any) {
      console.error('Erro ao buscar populares no Spotify:', error.message);
      return [];
    }
  }

  static async getAudioFeatures(trackId: string): Promise<{ bpm?: number } | null> {
    try {
      const response = await axios.post(this.apiUrl, { action: 'audio-features', trackId });
      return response.data || null;
    } catch (error: any) {
      console.error('Erro ao obter audio features do Spotify:', error.message);
      return null;
    }
  }
}

// Gerador de músicas demo brasileiras expandido
export const generateBrazilianDemoTracks = (): MusicTrack[] => {
  const brazilianSongs = [
    // MPB Clássicos
    { title: "Águas de Março", artist: "Tom Jobim", genre: "bossa nova", bpm: 120 },
    { title: "Garota de Ipanema", artist: "Tom Jobim & Vinícius de Moraes", genre: "bossa nova", bpm: 125 },
    { title: "Wave", artist: "Tom Jobim", genre: "bossa nova", bpm: 110 },
    { title: "Corcovado", artist: "Tom Jobim", genre: "bossa nova", bpm: 90 },
    { title: "Desafinado", artist: "Tom Jobim", genre: "bossa nova", bpm: 115 },
    
    // Elis Regina
    { title: "Como Nossos Pais", artist: "Elis Regina", genre: "mpb", bpm: 95 },
    { title: "Madalena", artist: "Elis Regina", genre: "mpb", bpm: 100 },
    { title: "Upa Neguinho", artist: "Elis Regina", genre: "mpb", bpm: 130 },
    { title: "Arrastão", artist: "Elis Regina", genre: "mpb", bpm: 125 },
    
    // Caetano Veloso
    { title: "Alegria Alegria", artist: "Caetano Veloso", genre: "tropicália", bpm: 120 },
    { title: "Tropicália", artist: "Caetano Veloso", genre: "tropicália", bpm: 115 },
    { title: "Terra", artist: "Caetano Veloso", genre: "mpb", bpm: 85 },
    { title: "Sampa", artist: "Caetano Veloso", genre: "mpb", bpm: 110 },
    
    // Chico Buarque
    { title: "Construção", artist: "Chico Buarque", genre: "mpb", bpm: 100 },
    { title: "Apesar de Você", artist: "Chico Buarque", genre: "mpb", bpm: 105 },
    { title: "Roda Viva", artist: "Chico Buarque", genre: "mpb", bpm: 115 },
    { title: "João e Maria", artist: "Chico Buarque", genre: "mpb", bpm: 90 },
    
    // Gilberto Gil
    { title: "Aquele Abraço", artist: "Gilberto Gil", genre: "tropicália", bpm: 125 },
    { title: "Expresso 2222", artist: "Gilberto Gil", genre: "rock", bpm: 140 },
    { title: "Toda Menina Baiana", artist: "Gilberto Gil", genre: "mpb", bpm: 110 },
    
    // Roberto Carlos
    { title: "Como é Grande o Meu Amor por Você", artist: "Roberto Carlos", genre: "romântica", bpm: 80 },
    { title: "Detalhes", artist: "Roberto Carlos", genre: "romântica", bpm: 85 },
    { title: "Emoções", artist: "Roberto Carlos", genre: "romântica", bpm: 75 },
    { title: "Jesus Cristo", artist: "Roberto Carlos", genre: "romântica", bpm: 70 },
    { title: "Lady Laura", artist: "Roberto Carlos", genre: "romântica", bpm: 90 },
    
    // Música Infantil Brasileira
    { title: "Ciranda Cirandinha", artist: "Tradicional Brasileira", genre: "infantil", bpm: 100 },
    { title: "Brilha Brilha Estrelinha", artist: "Tradicional Brasileira", genre: "infantil", bpm: 95 },
    { title: "Atirei o Pau no Gato", artist: "Tradicional Brasileira", genre: "infantil", bpm: 110 },
    { title: "Samba Lelê", artist: "Tradicional Brasileira", genre: "infantil", bpm: 105 },
    { title: "Escravos de Jó", artist: "Tradicional Brasileira", genre: "infantil", bpm: 120 },
    { title: "Peixe Vivo", artist: "Tradicional Brasileira", genre: "infantil", bpm: 115 },
    { title: "Borboletinha", artist: "Tradicional Brasileira", genre: "infantil", bpm: 100 },
    { title: "Capelinha de Melão", artist: "Tradicional Brasileira", genre: "infantil", bpm: 110 },
    { title: "Marcha Soldado", artist: "Tradicional Brasileira", genre: "infantil", bpm: 125 },
    { title: "Cai Cai Balão", artist: "Tradicional Brasileira", genre: "infantil", bpm: 95 },
    
    // Rock Nacional
    { title: "Que País É Este", artist: "Legião Urbana", genre: "rock", bpm: 130 },
    { title: "Eduardo e Mônica", artist: "Legião Urbana", genre: "rock", bpm: 120 },
    { title: "Tempo Perdido", artist: "Legião Urbana", genre: "rock", bpm: 125 },
    { title: "Pais e Filhos", artist: "Legião Urbana", genre: "rock", bpm: 110 },
    { title: "Geração Coca-Cola", artist: "Legião Urbana", genre: "rock", bpm: 135 },
    
    // Skank
    { title: "Garota Nacional", artist: "Skank", genre: "rock", bpm: 140 },
    { title: "Balada do Amor Inabalável", artist: "Skank", genre: "rock", bpm: 130 },
    { title: "Jackie Tequila", artist: "Skank", genre: "rock", bpm: 145 },
    
    // Sertanejo Clássico
    { title: "Chalana", artist: "Almir Sater", genre: "sertanejo", bpm: 85 },
    { title: "Tocando em Frente", artist: "Almir Sater", genre: "sertanejo", bpm: 90 },
    { title: "Cuitelinho", artist: "Tradicional", genre: "sertanejo", bpm: 95 },
    
    // Forró
    { title: "Asa Branca", artist: "Luiz Gonzaga", genre: "forró", bpm: 110 },
    { title: "Baião", artist: "Luiz Gonzaga", genre: "forró", bpm: 120 },
    { title: "Xote das Meninas", artist: "Luiz Gonzaga", genre: "forró", bpm: 115 },
    
    // Samba
    { title: "Aquarela do Brasil", artist: "Ary Barroso", genre: "samba", bpm: 100 },
    { title: "Pelo Telefone", artist: "Donga", genre: "samba", bpm: 105 },
    { title: "Carinhoso", artist: "Pixinguinha", genre: "samba", bpm: 80 }
  ];

  return brazilianSongs.map((song, index) => ({
    id: `demo-br-${index}`,
    title: song.title,
    artist: song.artist,
    duration: Math.floor(Math.random() * 120) + 120, // 2-4 minutos
    preview_url: null, // Sem preview real, será simulado
    image: null,
    popularity: Math.floor(Math.random() * 50) + 50, // 50-100
    external_url: null,
    source: 'demo' as const,
    bpm: song.bpm // Corrigido: usando 'bpm' em vez de 'bmp'
  }));
};

// Classe para buscar músicas na API Jamendo
class JamendoAPI {
  private static clientId = Deno.env.get('JAMENDO_CLIENT_ID') || process.env.JAMENDO_CLIENT_ID;
  private static baseUrl = 'https://api.jamendo.com/v3.0';

  static async search(query: string): Promise<MusicTrack[]> {
    if (!this.clientId) {
      console.warn('Jamendo Client ID não configurado.');
      return [];
    }

    try {
      const url = `${this.baseUrl}/tracks?client_id=${this.clientId}&format=jsonpretty&limit=20&searchtext=${encodeURIComponent(query)}`;
      const response = await axios.get(url);

      if (response.data.results && Array.isArray(response.data.results)) {
        return response.data.results.map((track: any) => ({
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
      const response = await axios.get(url);

      if (response.data.results && Array.isArray(response.data.results)) {
        return response.data.results.map((track: any) => ({
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
    const demoResults = generateBrazilianDemoTracks().filter(track =>
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
    const popularTracks = generateBrazilianDemoTracks().slice(0, 5).map(track => ({
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
  static async search(query: string, source: 'spotify' | 'jamendo' | 'demo' | 'youtube' = 'spotify'): Promise<MusicTrack[]> {
    try {
      let results: MusicTrack[] = [];

      switch (source) {
        case 'spotify':
          results = await SpotifyAPI.search(query);
          break;
        case 'jamendo':
          results = await JamendoAPI.search(query);
          break;
        case 'youtube':
          results = await YouTubeMusicAPI.search(query);
          break;
        case 'demo':
          results = generateBrazilianDemoTracks().filter(track =>
            track.title.toLowerCase().includes(query.toLowerCase()) ||
            track.artist.toLowerCase().includes(query.toLowerCase())
          );
          break;
        default:
          console.warn('Fonte de música inválida.');
          return [];
      }

      // Enriquecer com BPM se a fonte não fornecer
      if (source !== 'spotify') {
        for (const track of results) {
          if (!track.bpm && source !== 'youtube') {
            const features = await SpotifyAPI.getAudioFeatures(track.id);
            track.bpm = features?.bpm;
          }
        }
      }

      return results.filter(track => !track.failed);
    } catch (error) {
      console.error('Erro ao buscar músicas:', error);
      return [];
    }
  }

  static async getPopular(source: 'spotify' | 'jamendo' | 'demo' | 'youtube' = 'spotify'): Promise<MusicTrack[]> {
    try {
      let results: MusicTrack[] = [];

      switch (source) {
        case 'spotify':
          results = await SpotifyAPI.getPopular();
          break;
        case 'jamendo':
          results = await JamendoAPI.getPopular();
          break;
        case 'youtube':
          results = await YouTubeMusicAPI.getPopular();
          break;
        case 'demo':
          results = generateBrazilianDemoTracks();
          break;
        default:
          console.warn('Fonte de música inválida.');
          return [];
      }

      return results.filter(track => !track.failed);
    } catch (error) {
      console.error('Erro ao buscar músicas populares:', error);
      return [];
    }
  }

  static markTrackAsFailed(track: MusicTrack) {
    // Implementar lógica para marcar a música como falha
    console.warn(`Música falhou: ${track.title} - ${track.artist}`);
    track.failed = true;
  }
}
