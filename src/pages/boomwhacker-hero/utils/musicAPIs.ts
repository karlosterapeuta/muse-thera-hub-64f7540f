
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
      console.log(`🔍 Buscando no Spotify: ${query}`);

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
      console.log(`✅ Spotify retornou ${tracks.length} resultados válidos`);
      
      return tracks;
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

      const tracks = data.tracks || [];
      console.log(`✅ Spotify popular: ${tracks.length} músicas`);
      
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
        console.error('❌ Erro ao obter BPM:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('❌ Erro ao obter BPM:', error);
      return null;
    }
  }
}

export class JamendoAPI {
  static async search(query: string): Promise<MusicTrack[]> {
    try {
      const API_KEY = '5d9cbefe';
      const expandedTerms = this.expandSearchTerms(query);
      let allResults = [];

      for (const searchTerm of expandedTerms.slice(0, 6)) {
        if (allResults.length >= 20) break;

        const searchParams = new URLSearchParams({
          client_id: API_KEY,
          format: 'json',
          search: searchTerm,
          limit: '15',
          audioformat: 'mp31',
          order: 'popularity_total',
          include: 'musicinfo'
        });

        console.log(`🔍 Jamendo: ${searchTerm}`);

        try {
          const response = await fetch(`https://api.jamendo.com/v3.0/tracks/?${searchParams}`);
          
          if (response.ok) {
            const data = await response.json();
            const results = data.results || [];
            
            const validTracks = results.filter((item: any) => 
              item.audio && item.audio.length > 0 && item.duration > 15
            );
            
            allResults.push(...validTracks);
            console.log(`✅ Jamendo "${searchTerm}": ${validTracks.length} resultados`);
          }
        } catch (error) {
          console.error(`❌ Erro Jamendo "${searchTerm}":`, error);
        }
      }
      
      const uniqueResults = allResults.filter((item, index, self) => 
        index === self.findIndex(t => t.id === item.id)
      ).slice(0, 15);
      
      console.log(`🎵 Jamendo total: ${uniqueResults.length}`);
      
      return uniqueResults.map((item: any) => ({
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
      const popularQueries = [
        { tags: 'instrumental', order: 'popularity_total' },
        { tags: 'piano', order: 'popularity_month' },
        { tags: 'acoustic', order: 'popularity_week' },
        { tags: 'classical', order: 'popularity_total' },
        { tags: 'brazilian', order: 'popularity_total' },
        { tags: 'bossanova', order: 'popularity_month' },
        { tags: 'latin', order: 'popularity_week' }
      ];

      let allResults = [];

      for (const queryConfig of popularQueries) {
        if (allResults.length >= 25) break;

        const searchParams = new URLSearchParams({
          client_id: API_KEY,
          format: 'json',
          limit: '10',
          audioformat: 'mp31',
          order: queryConfig.order,
          include: 'musicinfo',
          tags: queryConfig.tags
        });

        try {
          const response = await fetch(`https://api.jamendo.com/v3.0/tracks/?${searchParams}`);
          
          if (response.ok) {
            const data = await response.json();
            const results = data.results || [];
            
            const validTracks = results.filter((item: any) => 
              item.audio && item.duration > 15
            );
            allResults.push(...validTracks);
            
            console.log(`✅ Jamendo popular "${queryConfig.tags}": ${validTracks.length}`);
          }
        } catch (error) {
          console.error(`❌ Erro Jamendo popular "${queryConfig.tags}":`, error);
        }
      }
      
      const uniqueResults = allResults.filter((item, index, self) => 
        index === self.findIndex(t => t.id === item.id)
      ).slice(0, 15);
      
      console.log(`🎵 Jamendo popular: ${uniqueResults.length}`);
      
      return uniqueResults.map((item: any) => ({
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
      console.error('❌ Erro popular Jamendo:', error);
      return [];
    }
  }

  static expandSearchTerms(query: string): string[] {
    const terms = [query];
    const lowerQuery = query.toLowerCase();

    const brazilianSynonyms = {
      'criança': ['children', 'kids', 'infantil'],
      'infantil': ['children', 'kids', 'criança'],
      'música': ['music', 'song'],
      'piano': ['keyboard', 'teclado'],
      'violão': ['guitar', 'acoustic'],
      'calma': ['peaceful', 'relaxing'],
      'alegre': ['happy', 'joyful'],
      'clássica': ['classical', 'classic'],
      'popular': ['pop', 'hit'],
      'brasileiro': ['brazilian', 'brasil'],
      'sertanejo': ['country', 'folk'],
      'forró': ['northeastern', 'folk'],
      'samba': ['brazilian dance'],
      'bossa': ['bossa nova', 'smooth']
    };

    Object.entries(brazilianSynonyms).forEach(([word, syns]) => {
      if (lowerQuery.includes(word)) {
        syns.forEach(syn => {
          terms.push(query.replace(new RegExp(word, 'gi'), syn));
        });
      }
    });

    terms.push(`${query} instrumental`);
    terms.push(`${query} acoustic`);
    
    return [...new Set(terms)].slice(0, 8);
  }
}

export class DemoAPI {
  static async getPopularTracks(): Promise<MusicTrack[]> {
    const realBrazilianTracks: MusicTrack[] = [
      // Roberto Carlos
      {
        id: 'demo-rc-1',
        title: 'Detalhes',
        artist: 'Roberto Carlos',
        duration: 45,
        popularity: 95,
        source: 'demo',
        bpm: 130
      },
      {
        id: 'demo-rc-2',
        title: 'Como É Grande o Meu Amor Por Você',
        artist: 'Roberto Carlos',
        duration: 42,
        popularity: 92,
        source: 'demo',
        bpm: 125
      },
      // Caetano Veloso
      {
        id: 'demo-cv-1',
        title: 'Alegria, Alegria',
        artist: 'Caetano Veloso',
        duration: 40,
        popularity: 90,
        source: 'demo',
        bpm: 125
      },
      {
        id: 'demo-cv-2',
        title: 'Sozinho',
        artist: 'Caetano Veloso',
        duration: 38,
        popularity: 88,
        source: 'demo',
        bpm: 120
      },
      // Tom Jobim
      {
        id: 'demo-tj-1',
        title: 'Garota de Ipanema',
        artist: 'Tom Jobim',
        duration: 38,
        popularity: 88,
        source: 'demo',
        bpm: 120
      },
      {
        id: 'demo-tj-2',
        title: 'Corcovado',
        artist: 'Tom Jobim',
        duration: 35,
        popularity: 85,
        source: 'demo',
        bpm: 115
      },
      // Elis Regina
      {
        id: 'demo-er-1',
        title: 'Como Nossos Pais',
        artist: 'Elis Regina',
        duration: 42,
        popularity: 87,
        source: 'demo',
        bpm: 115
      },
      {
        id: 'demo-er-2',
        title: 'Águas de Março',
        artist: 'Elis Regina',
        duration: 40,
        popularity: 86,
        source: 'demo',
        bpm: 118
      },
      // Chico Buarque
      {
        id: 'demo-cb-1',
        title: 'Construção',
        artist: 'Chico Buarque',
        duration: 44,
        popularity: 89,
        source: 'demo',
        bpm: 122
      },
      {
        id: 'demo-cb-2',
        title: 'A Banda',
        artist: 'Chico Buarque',
        duration: 36,
        popularity: 84,
        source: 'demo',
        bpm: 130
      },
      // Música Infantil Brasileira
      {
        id: 'demo-inf-1',
        title: 'Ciranda Cirandinha',
        artist: 'Folclore Brasileiro',
        duration: 32,
        popularity: 85,
        source: 'demo',
        bpm: 125
      },
      {
        id: 'demo-inf-2',
        title: 'Atirei o Pau no Gato',
        artist: 'Música Infantil',
        duration: 26,
        popularity: 82,
        source: 'demo',
        bpm: 140
      },
      {
        id: 'demo-inf-3',
        title: 'Brilha Brilha Estrelinha',
        artist: 'Música Infantil',
        duration: 28,
        popularity: 92,
        source: 'demo',
        bpm: 115
      },
      {
        id: 'demo-inf-4',
        title: 'Parabéns Pra Você',
        artist: 'Tradicional Brasileira',
        duration: 22,
        popularity: 88,
        source: 'demo',
        bpm: 135
      },
      // Sertanejo/Forró
      {
        id: 'demo-luiz-1',
        title: 'Asa Branca',
        artist: 'Luiz Gonzaga',
        duration: 40,
        popularity: 90,
        source: 'demo',
        bpm: 140
      },
      // Rock Nacional
      {
        id: 'demo-legiao-1',
        title: 'Tempo Perdido',
        artist: 'Legião Urbana',
        duration: 45,
        popularity: 88,
        source: 'demo',
        bpm: 135
      }
    ];

    console.log(`🎵 Demo brasileiro: ${realBrazilianTracks.length} músicas`);
    return realBrazilianTracks;
  }

  static async search(query: string): Promise<MusicTrack[]> {
    const tracks = await this.getPopularTracks();
    
    if (!query.trim()) {
      return tracks;
    }

    const lowerQuery = query.toLowerCase();
    
    return tracks.filter(track => {
      const titleMatch = track.title.toLowerCase().includes(lowerQuery);
      const artistMatch = track.artist.toLowerCase().includes(lowerQuery);
      
      const queryWords = lowerQuery.split(' ');
      const titleWords = track.title.toLowerCase().split(' ');
      const artistWords = track.artist.toLowerCase().split(' ');
      
      const wordMatch = queryWords.some(qWord => 
        titleWords.some(tWord => tWord.includes(qWord)) ||
        artistWords.some(aWord => aWord.includes(qWord))
      );
      
      const brazilianMatches = this.checkBrazilianSynonyms(lowerQuery, track);
      
      return titleMatch || artistMatch || wordMatch || brazilianMatches;
    });
  }

  static checkBrazilianSynonyms(query: string, track: MusicTrack): boolean {
    const synonymMap = {
      'rei': ['roberto carlos'],
      'tropicália': ['caetano'],
      'mpb': ['elis', 'caetano', 'tom', 'chico'],
      'bossa': ['tom jobim', 'garota'],
      'brasileiro': ['roberto', 'caetano', 'elis', 'tom'],
      'clássico': ['detalhes', 'alegria', 'ipanema', 'pais'],
      'infantil': ['ciranda', 'brilha', 'parabéns', 'pau'],
      'forró': ['asa branca', 'luiz'],
      'rock': ['legião', 'tempo']
    };

    for (const [synonym, artists] of Object.entries(synonymMap)) {
      if (query.includes(synonym)) {
        return artists.some(artist => 
          track.title.toLowerCase().includes(artist) || 
          track.artist.toLowerCase().includes(artist)
        );
      }
    }

    return false;
  }
}

export class MusicAPIManager {
  private static failedTracks = new Set<string>();
  private static apiStatus = {
    spotify: { working: true, lastCheck: 0 },
    jamendo: { working: true, lastCheck: 0 },
    demo: { working: true, lastCheck: 0 }
  };

  static async search(query: string, source: 'spotify' | 'jamendo' | 'demo'): Promise<MusicTrack[]> {
    console.log(`🎵 Busca inteligente: "${query}" em ${source}`);
    
    let results: MusicTrack[] = [];
    
    // Tentar fonte principal
    try {
      if (source === 'spotify' && this.apiStatus.spotify.working) {
        results = await SpotifyAPI.search(query);
        this.updateApiStatus('spotify', true);
      } else if (source === 'jamendo' && this.apiStatus.jamendo.working) {
        results = await JamendoAPI.search(query);
        this.updateApiStatus('jamendo', true);
      } else if (source === 'demo') {
        results = await DemoAPI.search(query);
        this.updateApiStatus('demo', true);
      }
    } catch (error) {
      console.error(`❌ Erro em ${source}:`, error);
      this.updateApiStatus(source, false);
    }
    
    // Fallback inteligente
    if (results.length < 3) {
      console.log(`⚠️ Poucos resultados (${results.length}), aplicando fallbacks...`);
      
      const fallbackOrder = this.getOptimalFallbackOrder(source);
      
      for (const fallbackSource of fallbackOrder) {
        if (results.length >= 15) break;
        
        if (!this.apiStatus[fallbackSource].working) continue;
        
        try {
          let fallbackResults: MusicTrack[] = [];
          
          console.log(`🔄 Fallback: ${fallbackSource}`);
          
          if (fallbackSource === 'spotify') {
            fallbackResults = await SpotifyAPI.search(query);
            this.updateApiStatus('spotify', true);
          } else if (fallbackSource === 'jamendo') {
            fallbackResults = await JamendoAPI.search(query);
            this.updateApiStatus('jamendo', true);
          } else if (fallbackSource === 'demo') {
            fallbackResults = await DemoAPI.search(query);
            this.updateApiStatus('demo', true);
          }
          
          if (fallbackResults.length > 0) {
            const newTracks = fallbackResults.filter(fallbackTrack => 
              !results.some(existingTrack => 
                existingTrack.id === fallbackTrack.id && existingTrack.source === fallbackTrack.source
              )
            );
            
            results.push(...newTracks);
            console.log(`✅ Fallback ${fallbackSource}: +${newTracks.length} músicas`);
          }
        } catch (error) {
          console.error(`❌ Erro fallback ${fallbackSource}:`, error);
          this.updateApiStatus(fallbackSource, false);
        }
      }
    }
    
    // Garantir que sempre temos músicas
    if (results.length === 0) {
      console.log('🚨 Carregando músicas demo de emergência...');
      const emergencyTracks = await DemoAPI.getPopularTracks();
      results.push(...emergencyTracks);
    }
    
    // Filtrar músicas que falharam
    const validResults = results.filter(track => 
      !this.failedTracks.has(`${track.source}-${track.id}`)
    );
    
    // Otimizar ordem
    const optimizedResults = this.optimizeResultOrder(validResults, query);
    
    console.log(`✅ Busca finalizada: ${optimizedResults.length} músicas`);
    return optimizedResults.slice(0, 20);
  }

  static async getPopular(source: 'spotify' | 'jamendo' | 'demo'): Promise<MusicTrack[]> {
    console.log(`🎵 Músicas populares: ${source}`);
    
    let results: MusicTrack[] = [];
    
    try {
      if (source === 'spotify' && this.apiStatus.spotify.working) {
        results = await SpotifyAPI.getPopular();
        this.updateApiStatus('spotify', true);
      } else if (source === 'jamendo' && this.apiStatus.jamendo.working) {
        results = await JamendoAPI.getPopular();
        this.updateApiStatus('jamendo', true);
      } else if (source === 'demo') {
        results = await DemoAPI.getPopularTracks();
        this.updateApiStatus('demo', true);
      }
    } catch (error) {
      console.error(`❌ Erro popular ${source}:`, error);
      this.updateApiStatus(source, false);
    }
    
    // Fallback se necessário
    if (results.length < 5) {
      console.log(`⚠️ Poucos populares (${results.length}), usando fallbacks...`);
      
      const fallbackOrder = this.getOptimalFallbackOrder(source);
      
      for (const fallbackSource of fallbackOrder) {
        if (results.length >= 20) break;
        
        if (!this.apiStatus[fallbackSource].working) continue;
        
        try {
          let fallbackResults: MusicTrack[] = [];
          
          if (fallbackSource === 'spotify') {
            fallbackResults = await SpotifyAPI.getPopular();
            this.updateApiStatus('spotify', true);
          } else if (fallbackSource === 'jamendo') {
            fallbackResults = await JamendoAPI.getPopular();
            this.updateApiStatus('jamendo', true);
          } else if (fallbackSource === 'demo') {
            fallbackResults = await DemoAPI.getPopularTracks();
            this.updateApiStatus('demo', true);
          }
          
          if (fallbackResults.length > 0) {
            const newTracks = fallbackResults.filter(fallbackTrack => 
              !results.some(existingTrack => 
                existingTrack.id === fallbackTrack.id && existingTrack.source === fallbackTrack.source
              )
            );
            
            results.push(...newTracks);
            console.log(`✅ Fallback popular ${fallbackSource}: +${newTracks.length}`);
          }
        } catch (error) {
          console.error(`❌ Erro fallback popular ${fallbackSource}:`, error);
          this.updateApiStatus(fallbackSource, false);
        }
      }
    }
    
    // Demo como último recurso
    if (results.length === 0) {
      console.log('🚨 Usando demos de emergência...');
      results = await DemoAPI.getPopularTracks();
    }
    
    const validResults = results.filter(track => 
      !this.failedTracks.has(`${track.source}-${track.id}`)
    );
    
    const uniqueResults = validResults.filter((track, index, self) => 
      index === self.findIndex(t => t.id === track.id && t.source === track.source)
    ).slice(0, 25);
    
    console.log(`✅ Total populares: ${uniqueResults.length}`);
    return uniqueResults;
  }

  static markTrackAsFailed(track: MusicTrack) {
    const key = `${track.source}-${track.id}`;
    this.failedTracks.add(key);
    console.log(`❌ Música falhou: ${track.title}`);
    
    // Limpar após 2 minutos
    setTimeout(() => {
      this.failedTracks.delete(key);
      console.log(`🔄 Música reabilitada: ${track.title}`);
    }, 2 * 60 * 1000);
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
        console.log(`✅ Próxima música: ${track.title}`);
        return track;
      }
    }
    
    console.log('⚠️ Nenhuma música válida restante');
    return null;
  }

  private static updateApiStatus(source: string, working: boolean) {
    this.apiStatus[source] = {
      working,
      lastCheck: Date.now()
    };
    
    if (!working) {
      setTimeout(() => {
        this.apiStatus[source].working = true;
        console.log(`🔄 API ${source} reabilitada`);
      }, 3 * 60 * 1000);
    }
  }

  private static getOptimalFallbackOrder(source: string): string[] {
    const availableAPIs = Object.entries(this.apiStatus)
      .filter(([api, status]) => api !== source && status.working)
      .sort(([, a], [, b]) => b.lastCheck - a.lastCheck)
      .map(([api]) => api);
    
    const withoutDemo = availableAPIs.filter(api => api !== 'demo');
    const demo = availableAPIs.find(api => api === 'demo');
    
    return demo ? [...withoutDemo, demo] : withoutDemo;
  }

  private static optimizeResultOrder(tracks: MusicTrack[], query: string): MusicTrack[] {
    return tracks.sort((a, b) => {
      const aRelevance = this.calculateRelevance(a, query);
      const bRelevance = this.calculateRelevance(b, query);
      
      if (aRelevance !== bRelevance) {
        return bRelevance - aRelevance;
      }
      
      return (b.popularity || 0) - (a.popularity || 0);
    });
  }

  private static calculateRelevance(track: MusicTrack, query: string): number {
    const lowerQuery = query.toLowerCase();
    const lowerTitle = track.title.toLowerCase();
    const lowerArtist = track.artist.toLowerCase();
    
    let relevance = 0;
    
    if (lowerTitle === lowerQuery) relevance += 100;
    else if (lowerTitle.includes(lowerQuery)) relevance += 80;
    else {
      const queryWords = lowerQuery.split(' ');
      const titleWords = lowerTitle.split(' ');
      const matches = queryWords.filter(qw => titleWords.some(tw => tw.includes(qw)));
      relevance += matches.length * 20;
    }
    
    if (lowerArtist.includes(lowerQuery)) relevance += 30;
    if (track.preview_url) relevance += 10;
    if (track.source === 'spotify') relevance += 5;
    else if (track.source === 'jamendo') relevance += 3;
    
    return relevance;
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

    const title = track.title.toLowerCase();
    if (title.includes('detalhes')) return 130;
    if (title.includes('alegria')) return 125;
    if (title.includes('ipanema')) return 120;
    if (title.includes('ciranda')) return 125;
    if (title.includes('parabéns')) return 135;
    if (title.includes('asa branca')) return 140;
    
    return 120;
  }
}
