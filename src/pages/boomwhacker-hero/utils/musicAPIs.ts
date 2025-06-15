
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

// Função para validar URLs de áudio
const validateAudioUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok && response.headers.get('content-type')?.includes('audio');
  } catch (error) {
    console.error(`❌ URL inválida: ${url}`, error);
    return false;
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
      
      // Validar URLs de preview
      const validTracks = [];
      for (const track of tracks) {
        if (track.preview_url) {
          validTracks.push(track);
        }
      }
      
      console.log(`🎵 Spotify músicas válidas: ${validTracks.length}`);
      return validTracks;
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
      
      // Filtrar apenas músicas com preview_url válido
      const validTracks = tracks.filter(track => track.preview_url);
      
      console.log(`🎵 Spotify popular válidas: ${validTracks.length}`);
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

      // Expandir termos de busca com sinônimos e variações
      const expandedTerms = this.expandSearchTerms(query);
      let allResults = [];

      for (const searchTerm of expandedTerms) {
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

        console.log(`🔍 Buscando no Jamendo: ${searchTerm}`);

        try {
          const response = await fetch(`https://api.jamendo.com/v3.0/tracks/?${searchParams}`);
          
          if (response.ok) {
            const data = await response.json();
            const results = data.results || [];
            
            // Filtrar e validar URLs de áudio
            const validTracks = results.filter((item: any) => {
              return item.audio && item.audio.length > 0;
            });
            
            allResults.push(...validTracks);
            console.log(`✅ Jamendo "${searchTerm}": ${validTracks.length} resultados`);
          }
        } catch (error) {
          console.error(`❌ Erro na busca Jamendo "${searchTerm}":`, error);
        }
      }
      
      // Remover duplicatas
      const uniqueResults = allResults.filter((item, index, self) => 
        index === self.findIndex(t => t.id === item.id)
      ).slice(0, 20);
      
      console.log(`🎵 Jamendo total único: ${uniqueResults.length}`);
      
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

      // Múltiplas consultas para obter variedade
      const popularQueries = [
        { tags: 'instrumental', order: 'popularity_total' },
        { tags: 'piano', order: 'popularity_month' },
        { tags: 'acoustic', order: 'popularity_week' },
        { tags: 'classical', order: 'popularity_total' },
        { tags: 'peaceful', order: 'popularity_month' },
        { tags: 'children', order: 'popularity_total' }
      ];

      let allResults = [];

      for (const queryConfig of popularQueries) {
        if (allResults.length >= 30) break;

        const searchParams = new URLSearchParams({
          client_id: API_KEY,
          format: 'json',
          limit: '15',
          audioformat: 'mp31',
          order: queryConfig.order,
          include: 'musicinfo',
          tags: queryConfig.tags
        });

        console.log(`🔍 Jamendo popular: ${queryConfig.tags}`);

        try {
          const response = await fetch(`https://api.jamendo.com/v3.0/tracks/?${searchParams}`);
          
          if (response.ok) {
            const data = await response.json();
            const results = data.results || [];
            
            const validTracks = results.filter((item: any) => item.audio);
            allResults.push(...validTracks);
            
            console.log(`✅ Jamendo popular "${queryConfig.tags}": ${validTracks.length}`);
          }
        } catch (error) {
          console.error(`❌ Erro Jamendo popular "${queryConfig.tags}":`, error);
        }
      }
      
      // Remover duplicatas e limitar
      const uniqueResults = allResults.filter((item, index, self) => 
        index === self.findIndex(t => t.id === item.id)
      ).slice(0, 20);
      
      console.log(`🎵 Jamendo popular único: ${uniqueResults.length}`);
      
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
      console.error('❌ Erro na busca popular do Jamendo:', error);
      return [];
    }
  }

  // Expandir termos de busca com sinônimos e variações
  static expandSearchTerms(query: string): string[] {
    const terms = [query];
    const lowerQuery = query.toLowerCase();

    // Dicionário de sinônimos e variações
    const synonyms = {
      'criança': ['children', 'kids', 'infantil', 'child'],
      'infantil': ['children', 'kids', 'criança', 'child'],
      'música': ['music', 'song', 'canção'],
      'piano': ['keyboard', 'teclado'],
      'violão': ['guitar', 'acoustic'],
      'calma': ['peaceful', 'relaxing', 'suave'],
      'alegre': ['happy', 'joyful', 'upbeat'],
      'clássica': ['classical', 'classic'],
      'popular': ['pop', 'hit', 'famous'],
      'instrumental': ['no vocal', 'without voice']
    };

    // Adicionar sinônimos
    Object.entries(synonyms).forEach(([word, syns]) => {
      if (lowerQuery.includes(word)) {
        syns.forEach(syn => {
          terms.push(query.replace(new RegExp(word, 'gi'), syn));
        });
      }
    });

    // Adicionar variações genéricas
    terms.push(`${query} instrumental`);
    terms.push(`${query} piano`);
    terms.push(`${query} acoustic`);
    
    return [...new Set(terms)].slice(0, 8); // Limitar a 8 termos únicos
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
        title: 'Brilha Brilha Estrelinha',
        artist: 'Música Infantil',
        duration: 28,
        popularity: 92,
        source: 'demo',
        bpm: 115
      },
      {
        id: 'demo-6',
        title: 'Parabéns Pra Você',
        artist: 'Tradicional Brasileira',
        duration: 22,
        popularity: 88,
        source: 'demo',
        bpm: 135
      },
      {
        id: 'demo-7',
        title: 'Ciranda Cirandinha',
        artist: 'Folclore Brasileiro',
        duration: 32,
        popularity: 85,
        source: 'demo',
        bpm: 125
      },
      {
        id: 'demo-8',
        title: 'Atirei o Pau no Gato',
        artist: 'Música Infantil',
        duration: 26,
        popularity: 82,
        source: 'demo',
        bpm: 140
      }
    ];

    // Para músicas sem arquivo real, gerar áudio sintético
    const synthesis = getAudioSynthesis();
    
    for (const track of tracks) {
      if (!track.preview_url || track.preview_url.startsWith('/assets/')) {
        try {
          const audioUrl = await synthesis.generateSimpleMelody(track.title);
          if (audioUrl) {
            track.preview_url = audioUrl;
            track.source = 'synthesized';
            console.log(`🎵 Áudio gerado para: ${track.title}`);
          }
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
    
    // Busca fuzzy melhorada
    return tracks.filter(track => {
      const titleMatch = track.title.toLowerCase().includes(lowerQuery);
      const artistMatch = track.artist.toLowerCase().includes(lowerQuery);
      
      // Busca por palavras individuais
      const queryWords = lowerQuery.split(' ');
      const titleWords = track.title.toLowerCase().split(' ');
      const artistWords = track.artist.toLowerCase().split(' ');
      
      const wordMatch = queryWords.some(qWord => 
        titleWords.some(tWord => tWord.includes(qWord)) ||
        artistWords.some(aWord => aWord.includes(qWord))
      );
      
      return titleMatch || artistMatch || wordMatch;
    });
  }
}

// Classe principal com sistema de fallback inteligente
export class MusicAPIManager {
  private static failedTracks = new Set<string>();
  private static apiStatus = {
    spotify: { working: true, lastCheck: 0 },
    jamendo: { working: true, lastCheck: 0 },
    demo: { working: true, lastCheck: 0 }
  };

  static async search(query: string, source: 'spotify' | 'jamendo' | 'demo'): Promise<MusicTrack[]> {
    console.log(`🎵 Iniciando busca inteligente: "${query}" na fonte: ${source}`);
    
    let results: MusicTrack[] = [];
    
    // 1. Tentar fonte especificada primeiro
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
      console.error(`❌ Erro na fonte ${source}:`, error);
      this.updateApiStatus(source, false);
    }
    
    // 2. Fallback automático e inteligente
    if (results.length < 5) {
      console.log(`⚠️ Poucos resultados em ${source} (${results.length}), aplicando fallbacks...`);
      
      const fallbackOrder = this.getOptimalFallbackOrder(source);
      
      for (const fallbackSource of fallbackOrder) {
        if (results.length >= 15) break;
        
        if (!this.apiStatus[fallbackSource].working) {
          console.log(`⏭️ Pulando ${fallbackSource} (marcado como indisponível)`);
          continue;
        }
        
        try {
          let fallbackResults: MusicTrack[] = [];
          
          console.log(`🔄 Tentando fallback inteligente: ${fallbackSource}`);
          
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
            // Evitar duplicatas ao combinar resultados
            const newTracks = fallbackResults.filter(fallbackTrack => 
              !results.some(existingTrack => 
                existingTrack.id === fallbackTrack.id && existingTrack.source === fallbackTrack.source
              )
            );
            
            results.push(...newTracks);
            console.log(`✅ Fallback ${fallbackSource}: +${newTracks.length} músicas novas`);
          }
        } catch (error) {
          console.error(`❌ Erro no fallback ${fallbackSource}:`, error);
          this.updateApiStatus(fallbackSource, false);
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
    
    // 5. Otimizar ordem dos resultados
    const optimizedResults = this.optimizeResultOrder(validResults, query);
    
    console.log(`✅ Busca finalizada: ${optimizedResults.length} músicas encontradas`);
    return optimizedResults.slice(0, 20);
  }

  static async getPopular(source: 'spotify' | 'jamendo' | 'demo'): Promise<MusicTrack[]> {
    console.log(`🎵 Buscando músicas populares inteligente da fonte: ${source}`);
    
    let results: MusicTrack[] = [];
    
    // Tentar fonte primária
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
      console.error(`❌ Erro na fonte ${source}:`, error);
      this.updateApiStatus(source, false);
    }
    
    // Fallback automático se necessário
    if (results.length < 8) {
      console.log(`⚠️ Poucos resultados populares em ${source} (${results.length}), usando fallbacks...`);
      
      const fallbackOrder = this.getOptimalFallbackOrder(source);
      
      for (const fallbackSource of fallbackOrder) {
        if (results.length >= 20) break;
        
        if (!this.apiStatus[fallbackSource].working) continue;
        
        try {
          let fallbackResults: MusicTrack[] = [];
          
          console.log(`🔄 Fallback popular inteligente: ${fallbackSource}`);
          
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
            console.log(`✅ Fallback popular ${fallbackSource}: +${newTracks.length} músicas novas`);
          }
        } catch (error) {
          console.error(`❌ Erro no fallback popular ${fallbackSource}:`, error);
          this.updateApiStatus(fallbackSource, false);
        }
      }
    }
    
    // Garantir que sempre temos demos como último recurso
    if (results.length === 0) {
      console.log('🚨 Sem resultados populares, usando demos de emergência...');
      results = await DemoAPI.getPopularTracks();
    }
    
    // Filtrar e otimizar
    const validResults = results.filter(track => 
      !this.failedTracks.has(`${track.source}-${track.id}`)
    );
    
    const uniqueResults = validResults.filter((track, index, self) => 
      index === self.findIndex(t => t.id === track.id && t.source === track.source)
    ).slice(0, 25);
    
    console.log(`✅ Total de músicas populares: ${uniqueResults.length}`);
    return uniqueResults;
  }

  // Marcar música como falha com limpeza automática
  static markTrackAsFailed(track: MusicTrack) {
    const key = `${track.source}-${track.id}`;
    this.failedTracks.add(key);
    console.log(`❌ Música marcada como falha: ${track.title} (${track.source})`);
    
    // Limpeza automática após 3 minutos
    setTimeout(() => {
      this.failedTracks.delete(key);
      console.log(`🔄 Música removida da blacklist: ${track.title}`);
    }, 3 * 60 * 1000);
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

  // Atualizar status da API
  private static updateApiStatus(source: string, working: boolean) {
    this.apiStatus[source] = {
      working,
      lastCheck: Date.now()
    };
    
    // Reabilitar APIs após 5 minutos
    if (!working) {
      setTimeout(() => {
        this.apiStatus[source].working = true;
        console.log(`🔄 API ${source} reabilitada automaticamente`);
      }, 5 * 60 * 1000);
    }
  }

  // Ordem otimizada de fallback baseada no status das APIs
  private static getOptimalFallbackOrder(source: string): string[] {
    const availableAPIs = Object.entries(this.apiStatus)
      .filter(([api, status]) => api !== source && status.working)
      .sort(([, a], [, b]) => b.lastCheck - a.lastCheck)
      .map(([api]) => api);
    
    // Demo sempre como último recurso
    const withoutDemo = availableAPIs.filter(api => api !== 'demo');
    const demo = availableAPIs.find(api => api === 'demo');
    
    return demo ? [...withoutDemo, demo] : withoutDemo;
  }

  // Otimizar ordem dos resultados baseada na relevância
  private static optimizeResultOrder(tracks: MusicTrack[], query: string): MusicTrack[] {
    return tracks.sort((a, b) => {
      // Priorizar por relevância do título
      const aRelevance = this.calculateRelevance(a, query);
      const bRelevance = this.calculateRelevance(b, query);
      
      if (aRelevance !== bRelevance) {
        return bRelevance - aRelevance;
      }
      
      // Depois por popularidade
      return (b.popularity || 0) - (a.popularity || 0);
    });
  }

  // Calcular relevância de uma música para a busca
  private static calculateRelevance(track: MusicTrack, query: string): number {
    const lowerQuery = query.toLowerCase();
    const lowerTitle = track.title.toLowerCase();
    const lowerArtist = track.artist.toLowerCase();
    
    let relevance = 0;
    
    // Correspondência exata do título
    if (lowerTitle === lowerQuery) relevance += 100;
    // Título contém a busca
    else if (lowerTitle.includes(lowerQuery)) relevance += 80;
    // Palavras do título correspondem
    else {
      const queryWords = lowerQuery.split(' ');
      const titleWords = lowerTitle.split(' ');
      const matches = queryWords.filter(qw => titleWords.some(tw => tw.includes(qw)));
      relevance += matches.length * 20;
    }
    
    // Correspondência do artista
    if (lowerArtist.includes(lowerQuery)) relevance += 30;
    
    // Bônus por ter preview
    if (track.preview_url) relevance += 10;
    
    // Bônus por fonte confiável
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
