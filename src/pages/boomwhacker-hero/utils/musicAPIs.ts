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
  source: 'spotify' | 'jamendo' | 'youtube' | 'demo' | 'synthesized';
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
      console.log(`🔍 Busca inteligente no Spotify: ${query}`);

      const { data, error } = await supabase.functions.invoke('spotify-api', {
        body: { action: 'search', query: query }
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
      console.log('🔍 Buscando hits populares no Spotify');

      const { data, error } = await supabase.functions.invoke('spotify-api', {
        body: { action: 'popular' }
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
        body: { action: 'audio-features', trackId: trackId }
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

export class YouTubeMusicAPI {
  static async search(query: string): Promise<MusicTrack[]> {
    try {
      console.log(`🔍 YouTube Music: ${query}`);
      
      // Implementação simplificada usando pesquisa pública do YouTube
      const searchTerms = this.generateYouTubeSearchTerms(query);
      let allResults = [];

      for (const searchTerm of searchTerms.slice(0, 5)) {
        if (allResults.length >= 15) break;

        try {
          // Simular busca YouTube Music (seria necessário API key real)
          const mockResults = this.getMockYouTubeResults(searchTerm);
          allResults.push(...mockResults);
          console.log(`✅ YouTube "${searchTerm}": ${mockResults.length} resultados`);
        } catch (error) {
          console.error(`❌ Erro YouTube "${searchTerm}":`, error);
        }
      }

      return allResults.slice(0, 10);
    } catch (error) {
      console.error('❌ Erro na busca do YouTube Music:', error);
      return [];
    }
  }

  static generateYouTubeSearchTerms(query: string): string[] {
    const terms = [query];
    const lowerQuery = query.toLowerCase();

    // Adicionar termos específicos para YouTube Music
    terms.push(`${query} official`);
    terms.push(`${query} music video`);
    terms.push(`${query} audio`);
    terms.push(`${query} letra`);
    
    if (lowerQuery.includes('brasileiro') || lowerQuery.includes('brasil')) {
      terms.push(`${query} brazil`);
    }

    return terms;
  }

  static getMockYouTubeResults(searchTerm: string): MusicTrack[] {
    // Mock data baseado em músicas brasileiras populares no YouTube
    const mockDatabase = [
      {
        id: 'yt-1',
        title: 'Como É Grande o Meu Amor Por Você',
        artist: 'Roberto Carlos',
        duration: 180,
        source: 'youtube' as const,
        popularity: 95,
        bpm: 125
      },
      {
        id: 'yt-2',
        title: 'Garota de Ipanema',
        artist: 'Tom Jobim & Vinícius de Moraes',
        duration: 165,
        source: 'youtube' as const,
        popularity: 92,
        bpm: 120
      },
      {
        id: 'yt-3',
        title: 'Águas de Março',
        artist: 'Elis Regina',
        duration: 195,
        source: 'youtube' as const,
        popularity: 90,
        bpm: 118
      },
      {
        id: 'yt-4',
        title: 'Tempo Perdido',
        artist: 'Legião Urbana',
        duration: 210,
        source: 'youtube' as const,
        popularity: 88,
        bpm: 135
      },
      {
        id: 'yt-5',
        title: 'Asa Branca',
        artist: 'Luiz Gonzaga',
        duration: 155,
        source: 'youtube' as const,
        popularity: 87,
        bpm: 140
      }
    ];

    // Filtrar por relevância da busca
    return mockDatabase.filter(track => {
      const searchLower = searchTerm.toLowerCase();
      const titleLower = track.title.toLowerCase();
      const artistLower = track.artist.toLowerCase();
      
      return titleLower.includes(searchLower) || 
             artistLower.includes(searchLower) ||
             searchLower.split(' ').some(word => 
               titleLower.includes(word) || artistLower.includes(word)
             );
    });
  }
}

export class JamendoAPI {
  static async search(query: string): Promise<MusicTrack[]> {
    try {
      const API_KEY = '5d9cbefe';
      const expandedTerms = this.expandSearchTerms(query);
      let allResults = [];

      for (const searchTerm of expandedTerms.slice(0, 8)) {
        if (allResults.length >= 25) break;

        const searchParams = new URLSearchParams({
          client_id: API_KEY,
          format: 'json',
          search: searchTerm,
          limit: '20',
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
              item.audio && item.audio.length > 0 && item.duration > 20
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
    
    return [...new Set(terms)].slice(0, 10);
  }
}

export class DemoAPI {
  static async getPopularTracks(): Promise<MusicTrack[]> {
    // Expandir significativamente a base de dados brasileira
    const expandedBrazilianTracks: MusicTrack[] = [
      // Roberto Carlos - Rei da Música Brasileira
      { id: 'demo-rc-1', title: 'Detalhes', artist: 'Roberto Carlos', duration: 45, popularity: 95, source: 'demo', bpm: 130 },
      { id: 'demo-rc-2', title: 'Como É Grande o Meu Amor Por Você', artist: 'Roberto Carlos', duration: 42, popularity: 92, source: 'demo', bpm: 125 },
      { id: 'demo-rc-3', title: 'Sua Estupidez', artist: 'Roberto Carlos', duration: 44, popularity: 88, source: 'demo', bpm: 135 },
      { id: 'demo-rc-4', title: 'Jesus Cristo', artist: 'Roberto Carlos', duration: 46, popularity: 90, source: 'demo', bpm: 120 },
      { id: 'demo-rc-5', title: 'Amigo', artist: 'Roberto Carlos', duration: 38, popularity: 87, source: 'demo', bpm: 125 },

      // Caetano Veloso - Tropicália
      { id: 'demo-cv-1', title: 'Alegria, Alegria', artist: 'Caetano Veloso', duration: 40, popularity: 90, source: 'demo', bpm: 125 },
      { id: 'demo-cv-2', title: 'Sozinho', artist: 'Caetano Veloso', duration: 38, popularity: 88, source: 'demo', bpm: 120 },
      { id: 'demo-cv-3', title: 'Tropicália', artist: 'Caetano Veloso', duration: 42, popularity: 89, source: 'demo', bpm: 130 },
      { id: 'demo-cv-4', title: 'Domingo', artist: 'Caetano Veloso', duration: 35, popularity: 86, source: 'demo', bpm: 115 },

      // Tom Jobim - Bossa Nova
      { id: 'demo-tj-1', title: 'Garota de Ipanema', artist: 'Tom Jobim', duration: 38, popularity: 95, source: 'demo', bpm: 120 },
      { id: 'demo-tj-2', title: 'Corcovado', artist: 'Tom Jobim', duration: 35, popularity: 85, source: 'demo', bpm: 115 },
      { id: 'demo-tj-3', title: 'Desafinado', artist: 'Tom Jobim', duration: 40, popularity: 88, source: 'demo', bpm: 118 },
      { id: 'demo-tj-4', title: 'Wave', artist: 'Tom Jobim', duration: 42, popularity: 87, source: 'demo', bpm: 122 },

      // Elis Regina - Rainha da MPB
      { id: 'demo-er-1', title: 'Como Nossos Pais', artist: 'Elis Regina', duration: 42, popularity: 92, source: 'demo', bpm: 115 },
      { id: 'demo-er-2', title: 'Águas de Março', artist: 'Elis Regina', duration: 40, popularity: 90, source: 'demo', bpm: 118 },
      { id: 'demo-er-3', title: 'O Bêbado e a Equilibrista', artist: 'Elis Regina', duration: 45, popularity: 89, source: 'demo', bpm: 110 },
      { id: 'demo-er-4', title: 'Madalena', artist: 'Elis Regina', duration: 38, popularity: 86, source: 'demo', bpm: 125 },

      // Chico Buarque
      { id: 'demo-cb-1', title: 'Construção', artist: 'Chico Buarque', duration: 44, popularity: 89, source: 'demo', bpm: 122 },
      { id: 'demo-cb-2', title: 'A Banda', artist: 'Chico Buarque', duration: 36, popularity: 84, source: 'demo', bpm: 130 },
      { id: 'demo-cb-3', title: 'Apesar de Você', artist: 'Chico Buarque', duration: 40, popularity: 88, source: 'demo', bpm: 120 },

      // Gilberto Gil
      { id: 'demo-gg-1', title: 'Aquele Abraço', artist: 'Gilberto Gil', duration: 38, popularity: 87, source: 'demo', bpm: 128 },
      { id: 'demo-gg-2', title: 'Expresso 2222', artist: 'Gilberto Gil', duration: 42, popularity: 85, source: 'demo', bpm: 135 },

      // Legião Urbana - Rock Nacional
      { id: 'demo-lu-1', title: 'Tempo Perdido', artist: 'Legião Urbana', duration: 45, popularity: 92, source: 'demo', bpm: 135 },
      { id: 'demo-lu-2', title: 'Pais e Filhos', artist: 'Legião Urbana', duration: 48, popularity: 90, source: 'demo', bpm: 125 },
      { id: 'demo-lu-3', title: 'Será', artist: 'Legião Urbana', duration: 52, popularity: 88, source: 'demo', bpm: 130 },

      // Skank
      { id: 'demo-sk-1', title: 'Garota Nacional', artist: 'Skank', duration: 38, popularity: 85, source: 'demo', bpm: 140 },
      { id: 'demo-sk-2', title: 'Vou Deixar', artist: 'Skank', duration: 42, popularity: 83, source: 'demo', bmp: 135 },

      // Música Infantil Brasileira
      { id: 'demo-inf-1', title: 'Ciranda Cirandinha', artist: 'Folclore Brasileiro', duration: 32, popularity: 85, source: 'demo', bpm: 125 },
      { id: 'demo-inf-2', title: 'Atirei o Pau no Gato', artist: 'Música Infantil', duration: 26, popularity: 82, source: 'demo', bpm: 140 },
      { id: 'demo-inf-3', title: 'Brilha Brilha Estrelinha', artist: 'Música Infantil', duration: 28, popularity: 92, source: 'demo', bpm: 115 },
      { id: 'demo-inf-4', title: 'Parabéns Pra Você', artist: 'Tradicional Brasileira', duration: 22, popularity: 95, source: 'demo', bpm: 135 },
      { id: 'demo-inf-5', title: 'Se Essa Rua Fosse Minha', artist: 'Folclore', duration: 30, popularity: 80, source: 'demo', bpm: 120 },
      { id: 'demo-inf-6', title: 'Borboletinha', artist: 'Música Infantil', duration: 25, popularity: 78, source: 'demo', bmp: 130 },

      // Sertanejo/Forró
      { id: 'demo-lg-1', title: 'Asa Branca', artist: 'Luiz Gonzaga', duration: 40, popularity: 90, source: 'demo', bpm: 140 },
      { id: 'demo-lg-2', title: 'Assum Preto', artist: 'Luiz Gonzaga', duration: 38, popularity: 85, source: 'demo', bmp: 135 },

      // Samba
      { id: 'demo-sm-1', title: 'Mas Que Nada', artist: 'Jorge Ben Jor', duration: 40, popularity: 88, source: 'demo', bpm: 140 },
      { id: 'demo-sm-2', title: 'País Tropical', artist: 'Jorge Ben Jor', duration: 42, popularity: 86, source: 'demo', bpm: 135 },

      // MPB Clássica
      { id: 'demo-mn-1', title: 'Travessia', artist: 'Milton Nascimento', duration: 45, popularity: 87, source: 'demo', bmp: 110 },
      { id: 'demo-dj-1', title: 'Flor de Lis', artist: 'Djavan', duration: 40, popularity: 85, source: 'demo', bpm: 125 }
    ];

    console.log(`🎵 Demo brasileiro expandido: ${expandedBrazilianTracks.length} músicas`);
    return expandedBrazilianTracks;
  }

  static async search(query: string): Promise<MusicTrack[]> {
    const tracks = await this.getPopularTracks();
    
    if (!query.trim()) {
      return tracks.slice(0, 20);
    }

    const lowerQuery = query.toLowerCase();
    
    const filtered = tracks.filter(track => {
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

    console.log(`🔍 Demo search "${query}": ${filtered.length} resultados`);
    return filtered.slice(0, 20);
  }

  static checkBrazilianSynonyms(query: string, track: MusicTrack): boolean {
    const synonymMap = {
      'rei': ['roberto carlos'],
      'tropicália': ['caetano'],
      'mpb': ['elis', 'caetano', 'tom', 'chico', 'milton', 'djavan'],
      'bossa': ['tom jobim', 'garota'],
      'brasileiro': ['roberto', 'caetano', 'elis', 'tom'],
      'clássico': ['detalhes', 'alegria', 'ipanema', 'pais'],
      'infantil': ['ciranda', 'brilha', 'parabéns', 'pau', 'rua', 'borboleta'],
      'forró': ['asa branca', 'luiz', 'assum'],
      'rock': ['legião', 'tempo', 'skank'],
      'samba': ['jorge ben', 'mas que nada', 'país tropical']
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
    spotify: { working: true, lastCheck: 0, priority: 1 },
    youtube: { working: true, lastCheck: 0, priority: 2 },
    jamendo: { working: true, lastCheck: 0, priority: 3 },
    demo: { working: true, lastCheck: 0, priority: 4 }
  };

  static async search(query: string, preferredSource: 'spotify' | 'jamendo' | 'demo' | 'youtube' = 'spotify'): Promise<MusicTrack[]> {
    console.log(`🎵 Busca inteligente: "${query}" (preferência: ${preferredSource})`);
    
    let results: MusicTrack[] = [];
    const sources = this.getOptimalSourceOrder(preferredSource);
    
    // Buscar em múltiplas fontes com fallback inteligente
    for (const source of sources) {
      if (results.length >= 20) break;
      
      if (!this.apiStatus[source].working) {
        console.log(`⚠️ ${source} marcado como não funcionando, pulando...`);
        continue;
      }
      
      try {
        let sourceResults: MusicTrack[] = [];
        
        console.log(`🔍 Tentando ${source}...`);
        
        if (source === 'spotify') {
          sourceResults = await SpotifyAPI.search(query);
          this.updateApiStatus('spotify', true);
        } else if (source === 'youtube') {
          sourceResults = await YouTubeMusicAPI.search(query);
          this.updateApiStatus('youtube', true);
        } else if (source === 'jamendo') {
          sourceResults = await JamendoAPI.search(query);
          this.updateApiStatus('jamendo', true);
        } else if (source === 'demo') {
          sourceResults = await DemoAPI.search(query);
          this.updateApiStatus('demo', true);
        }
        
        if (sourceResults.length > 0) {
          const newTracks = sourceResults.filter(sourceTrack => 
            !results.some(existingTrack => 
              existingTrack.id === sourceTrack.id && existingTrack.source === sourceTrack.source
            )
          );
          
          results.push(...newTracks);
          console.log(`✅ ${source}: +${newTracks.length} músicas (total: ${results.length})`);
          
          // Se conseguimos resultados suficientes, parar
          if (results.length >= 15) break;
        }
        
      } catch (error) {
        console.error(`❌ Erro em ${source}:`, error);
        this.updateApiStatus(source, false);
      }
    }
    
    // Garantir que sempre temos músicas
    if (results.length === 0) {
      console.log('🚨 Nenhum resultado encontrado, carregando demos de emergência...');
      const emergencyTracks = await DemoAPI.getPopularTracks();
      results.push(...emergencyTracks.slice(0, 10));
    }
    
    // Filtrar músicas que falharam e otimizar ordem
    const validResults = results.filter(track => 
      !this.failedTracks.has(`${track.source}-${track.id}`)
    );
    
    const optimizedResults = this.optimizeResultOrder(validResults, query);
    
    console.log(`✅ Busca finalizada: ${optimizedResults.length} músicas de ${new Set(optimizedResults.map(t => t.source)).size} fontes`);
    return optimizedResults.slice(0, 25);
  }

  static async getPopular(preferredSource: 'spotify' | 'jamendo' | 'demo' | 'youtube' = 'spotify'): Promise<MusicTrack[]> {
    console.log(`🎵 Músicas populares (preferência: ${preferredSource})`);
    
    let results: MusicTrack[] = [];
    const sources = this.getOptimalSourceOrder(preferredSource);
    
    for (const source of sources) {
      if (results.length >= 30) break;
      
      if (!this.apiStatus[source].working) continue;
      
      try {
        let sourceResults: MusicTrack[] = [];
        
        if (source === 'spotify') {
          sourceResults = await SpotifyAPI.getPopular();
          this.updateApiStatus('spotify', true);
        } else if (source === 'jamendo') {
          sourceResults = await JamendoAPI.getPopular();
          this.updateApiStatus('jamendo', true);
        } else if (source === 'demo') {
          sourceResults = await DemoAPI.getPopularTracks();
          this.updateApiStatus('demo', true);
        }
        
        if (sourceResults.length > 0) {
          const newTracks = sourceResults.filter(sourceTrack => 
            !results.some(existingTrack => 
              existingTrack.id === sourceTrack.id && existingTrack.source === sourceTrack.source
            )
          );
          
          results.push(...newTracks);
          console.log(`✅ Popular ${source}: +${newTracks.length} (total: ${results.length})`);
        }
        
      } catch (error) {
        console.error(`❌ Erro popular ${source}:`, error);
        this.updateApiStatus(source, false);
      }
    }
    
    if (results.length === 0) {
      console.log('🚨 Usando demos de emergência...');
      results = await DemoAPI.getPopularTracks();
    }
    
    const validResults = results.filter(track => 
      !this.failedTracks.has(`${track.source}-${track.id}`)
    );
    
    const uniqueResults = validResults.filter((track, index, self) => 
      index === self.findIndex(t => t.id === track.id && t.source === track.source)
    ).slice(0, 30);
    
    console.log(`✅ Total populares: ${uniqueResults.length} de ${new Set(uniqueResults.map(t => t.source)).size} fontes`);
    return uniqueResults;
  }

  private static getOptimalSourceOrder(preferred: string): string[] {
    const allSources = Object.entries(this.apiStatus)
      .sort(([, a], [, b]) => {
        // Priorizar fonte preferida
        if (a.priority === 1 && preferred === 'spotify') return -1;
        if (b.priority === 1 && preferred === 'spotify') return 1;
        
        // Depois por status (funcionando primeiro)
        if (a.working && !b.working) return -1;
        if (!a.working && b.working) return 1;
        
        // Depois por prioridade
        return a.priority - b.priority;
      })
      .map(([source]) => source);
    
    return allSources;
  }

  private static updateApiStatus(source: string, working: boolean) {
    this.apiStatus[source] = {
      ...this.apiStatus[source],
      working,
      lastCheck: Date.now()
    };
    
    if (!working) {
      // Reabilitar após 2 minutos
      setTimeout(() => {
        this.apiStatus[source].working = true;
        console.log(`🔄 API ${source} reabilitada`);
      }, 2 * 60 * 1000);
    }
  }

  private static optimizeResultOrder(tracks: MusicTrack[], query: string): MusicTrack[] {
    return tracks.sort((a, b) => {
      const aRelevance = this.calculateRelevance(a, query);
      const bRelevance = this.calculateRelevance(b, query);
      
      if (aRelevance !== bRelevance) {
        return bRelevance - aRelevance;
      }
      
      // Priorizar por fonte
      const sourceOrder = { spotify: 4, youtube: 3, jamendo: 2, demo: 1 };
      const aSourceScore = sourceOrder[a.source] || 0;
      const bSourceScore = sourceOrder[b.source] || 0;
      
      if (aSourceScore !== bSourceScore) {
        return bSourceScore - aSourceScore;
      }
      
      return (b.popularity || 0) - (a.popularity || 0);
    });
  }

  private static calculateRelevance(track: MusicTrack, query: string): number {
    const lowerQuery = query.toLowerCase();
    const lowerTitle = track.title.toLowerCase();
    const lowerArtist = track.artist.toLowerCase();
    
    let relevance = 0;
    
    // Correspondência exata
    if (lowerTitle === lowerQuery) relevance += 100;
    else if (lowerTitle.includes(lowerQuery)) relevance += 80;
    else {
      const queryWords = lowerQuery.split(' ');
      const titleWords = lowerTitle.split(' ');
      const matches = queryWords.filter(qw => titleWords.some(tw => tw.includes(qw)));
      relevance += matches.length * 25;
    }
    
    // Correspondência do artista
    if (lowerArtist.includes(lowerQuery)) relevance += 40;
    
    // Bônus por qualidade
    if (track.preview_url) relevance += 15;
    if (track.popularity && track.popularity > 70) relevance += 10;
    if (track.source === 'spotify') relevance += 8;
    else if (track.source === 'youtube') relevance += 6;
    else if (track.source === 'jamendo') relevance += 4;
    
    return relevance;
  }

  static markTrackAsFailed(track: MusicTrack) {
    const key = `${track.source}-${track.id}`;
    this.failedTracks.add(key);
    console.log(`❌ Música falhou: ${track.title}`);
    
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

    // BPM estimado baseado no título/artista
    const title = track.title.toLowerCase();
    const artist = track.artist.toLowerCase();
    
    if (title.includes('detalhes')) return 130;
    if (title.includes('alegria')) return 125;
    if (title.includes('ipanema')) return 120;
    if (title.includes('ciranda')) return 125;
    if (title.includes('parabéns')) return 135;
    if (title.includes('asa branca')) return 140;
    if (artist.includes('roberto carlos')) return 125;
    if (artist.includes('legião')) return 135;
    if (artist.includes('tom jobim')) return 118;
    
    return 120; // BPM padrão
  }
}
