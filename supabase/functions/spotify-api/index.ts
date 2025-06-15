
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Cache de token global
let tokenCache: { token: string; expires: number } | null = null

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, query, trackId } = await req.json()
    
    const clientId = Deno.env.get('SPOTIFY_CLIENT_ID')
    const clientSecret = Deno.env.get('SPOTIFY_CLIENT_SECRET')
    
    if (!clientId || !clientSecret) {
      console.error('❌ Credenciais do Spotify não configuradas')
      throw new Error('Spotify credentials not configured')
    }
    
    console.log(`🎵 Spotify API - Ação: ${action}, Query: ${query}`)
    
    // Obter token com cache inteligente
    const accessToken = await getCachedToken(clientId, clientSecret)
    
    let result = {}

    if (action === 'search') {
      result = await performIntelligentSearch(query, accessToken)
    } else if (action === 'popular') {
      result = await getPopularBrazilianTracks(accessToken)
    } else if (action === 'audio-features' && trackId) {
      const featuresResponse = await fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      })

      if (featuresResponse.ok) {
        const featuresData = await featuresResponse.json()
        result = { bpm: Math.round(featuresData.tempo) }
      }
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('❌ Erro na função Spotify API:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message, 
        tracks: [],
        fallback: 'Usando modo demo devido a erro na API'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

// Sistema de cache de token inteligente
async function getCachedToken(clientId: string, clientSecret: string): Promise<string> {
  const now = Date.now()
  
  // Verificar se token ainda é válido (com margem de 5 minutos)
  if (tokenCache && tokenCache.expires > now + (5 * 60 * 1000)) {
    console.log('✅ Usando token em cache')
    return tokenCache.token
  }
  
  console.log('🔄 Obtendo novo token do Spotify...')
  
  const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret}`),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials'
  })

  if (!tokenResponse.ok) {
    const errorData = await tokenResponse.json()
    console.error(`❌ Falha ao obter token: ${tokenResponse.status}`, errorData)
    throw new Error(`Failed to get Spotify token: ${tokenResponse.status}`)
  }

  const tokenData = await tokenResponse.json()
  
  // Cache do token (expires_in está em segundos)
  tokenCache = {
    token: tokenData.access_token,
    expires: now + (tokenData.expires_in * 1000)
  }
  
  console.log('✅ Novo token obtido e cacheado')
  return tokenCache.token
}

// Busca inteligente com múltiplas estratégias
async function performIntelligentSearch(query: string, accessToken: string) {
  console.log(`🔍 Busca inteligente para: "${query}"`)
  
  // Gerar termos de busca inteligentes
  const searchTerms = generateSmartSearchTerms(query)
  console.log(`📝 Termos gerados: ${searchTerms.length}`)
  
  let allTracks = []
  const markets = ['BR', 'US', 'PT', 'ES', 'AR', 'MX', 'CO']
  
  // Buscar com múltiplos termos e mercados
  for (const searchTerm of searchTerms.slice(0, 12)) {
    if (allTracks.length >= 50) break
    
    for (const market of markets) {
      if (allTracks.length >= 50) break
      
      try {
        const tracks = await searchSpotify(searchTerm, market, accessToken)
        if (tracks.length > 0) {
          allTracks.push(...tracks)
          console.log(`✅ "${searchTerm}" (${market}): ${tracks.length} resultados`)
        }
      } catch (error) {
        console.error(`❌ Erro "${searchTerm}" (${market}):`, error.message)
      }
    }
  }
  
  // Remover duplicatas e classificar por relevância
  const uniqueTracks = removeDuplicatesAndRank(allTracks, query)
  console.log(`🎯 Busca finalizada: ${uniqueTracks.length} músicas únicas`)
  
  return {
    tracks: uniqueTracks.slice(0, 25).map(formatTrack)
  }
}

// Gerador de termos de busca inteligente
function generateSmartSearchTerms(query: string): string[] {
  const terms = new Set([query])
  const lowerQuery = query.toLowerCase().trim()
  
  // Sinônimos e expansões brasileiras
  const synonyms = {
    'música': ['song', 'canção', 'hit'],
    'criança': ['children', 'infantil', 'kids'],
    'infantil': ['children', 'kids', 'criança'],
    'brasileiro': ['brasil', 'br', 'brazilian'],
    'sertanejo': ['country', 'universitário', 'modão'],
    'forró': ['northeastern', 'pé de serra', 'eletrônico'],
    'mpb': ['música popular brasileira', 'popular'],
    'rock': ['nacional', 'brasileiro'],
    'samba': ['pagode', 'partido alto'],
    'bossa': ['bossa nova', 'smooth', 'jazz'],
    'gospel': ['cristã', 'evangélica'],
    'funk': ['carioca', 'brasileiro'],
    'rap': ['hip hop', 'nacional'],
    'pop': ['popular', 'mainstream'],
    'clássica': ['classical', 'erudita'],
    'instrumental': ['sem letra', 'piano', 'violão'],
    'acústico': ['acoustic', 'unplugged', 'violão'],
    'piano': ['teclado', 'instrumental'],
    'violão': ['guitar', 'acoustic'],
    'alegre': ['happy', 'animada', 'festa'],
    'calma': ['relaxing', 'peaceful', 'suave'],
    'romântica': ['romantic', 'love', 'amor'],
    'triste': ['sad', 'melancólica'],
    'dança': ['dance', 'dançante', 'festa']
  }
  
  // Artistas brasileiros famosos para expandir busca
  const famousArtists = [
    'Roberto Carlos', 'Caetano Veloso', 'Gilberto Gil', 'Chico Buarque',
    'Elis Regina', 'Tom Jobim', 'Vinícius de Moraes', 'Djavan', 'Marisa Monte',
    'Gal Costa', 'Maria Bethânia', 'Milton Nascimento', 'Jorge Ben Jor',
    'Alceu Valença', 'Elba Ramalho', 'Fagner', 'Zé Ramalho', 'Lenine',
    'Legião Urbana', 'Capital Inicial', 'Skank', 'Titãs', 'Barão Vermelho',
    'Charlie Brown Jr', 'O Rappa', 'Cidade Negra', 'Jota Quest'
  ]
  
  // Aplicar sinônimos
  Object.entries(synonyms).forEach(([word, syns]) => {
    if (lowerQuery.includes(word)) {
      syns.forEach(syn => {
        terms.add(query.replace(new RegExp(word, 'gi'), syn))
        terms.add(`${syn} ${query}`)
        terms.add(`${query} ${syn}`)
      })
    }
  })
  
  // Adicionar variações comuns
  terms.add(`${query} brasileiro`)
  terms.add(`${query} brasil`)
  terms.add(`música ${query}`)
  terms.add(`canção ${query}`)
  terms.add(`${query} clássico`)
  terms.add(`${query} popular`)
  terms.add(`${query} hits`)
  terms.add(`${query} sucessos`)
  terms.add(`best ${query}`)
  terms.add(`${query} acoustic`)
  terms.add(`${query} instrumental`)
  
  // Se a busca for muito genérica, adicionar artistas famosos
  if (lowerQuery.length <= 6 || ['música', 'song', 'canção', 'hit'].includes(lowerQuery)) {
    famousArtists.slice(0, 5).forEach(artist => {
      terms.add(`${artist} ${query}`)
      terms.add(`${query} ${artist}`)
    })
  }
  
  // Busca fuzzy simples (correções comuns)
  const fuzzyCorrections = {
    'roberto carlos': ['roberto carlos', 'rei'],
    'caetano': ['caetano veloso', 'tropicália'],
    'tom jobim': ['antônio carlos jobim', 'bossa nova'],
    'elis regina': ['elis', 'mpb'],
    'legiao urbana': ['legião urbana', 'renato russo'],
    'charlie brown': ['charlie brown jr', 'chorão']
  }
  
  Object.entries(fuzzyCorrections).forEach(([key, variations]) => {
    if (lowerQuery.includes(key)) {
      variations.forEach(variation => terms.add(variation))
    }
  })
  
  return Array.from(terms).filter(term => term.trim().length > 0)
}

// Busca no Spotify com parâmetros otimizados
async function searchSpotify(searchTerm: string, market: string, accessToken: string) {
  const searchParams = new URLSearchParams({
    q: searchTerm,
    type: 'track',
    market: market,
    limit: '20',
    offset: '0'
  })

  const response = await fetch(`https://api.spotify.com/v1/search?${searchParams}`, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  })

  if (!response.ok) {
    throw new Error(`Spotify search failed: ${response.status}`)
  }

  const data = await response.json()
  return (data.tracks?.items || []).filter(item => 
    item.preview_url && 
    item.duration_ms > 15000 && // Pelo menos 15 segundos
    item.popularity > 15 // Mínimo de popularidade
  )
}

// Músicas populares brasileiras otimizadas
async function getPopularBrazilianTracks(accessToken: string) {
  console.log('🎵 Buscando hits brasileiros populares...')
  
  const popularQueries = [
    'top brasil 2024', 'roberto carlos hits', 'caetano veloso sucessos',
    'mpb clássicos', 'bossa nova brasil', 'sertanejo universitário hits',
    'legião urbana sucessos', 'skank melhores', 'charlie brown jr hits',
    'música infantil brasileira', 'forró pé de serra', 'samba clássico',
    'rock nacional brasileiro', 'funk carioca hits', 'axé music',
    'música popular brasileira', 'tom jobim bossa nova', 'elis regina mpb',
    'chico buarque clássicos', 'gilberto gil tropicália'
  ]

  let allTracks = []
  
  for (const query of popularQueries) {
    if (allTracks.length >= 60) break
    
    try {
      const tracks = await searchSpotify(query, 'BR', accessToken)
      allTracks.push(...tracks)
      console.log(`✅ Popular "${query}": ${tracks.length} músicas`)
    } catch (error) {
      console.error(`❌ Erro popular "${query}":`, error.message)
    }
  }
  
  const uniqueTracks = removeDuplicatesAndRank(allTracks, 'popular brasileiro')
  console.log(`🎯 Total populares: ${uniqueTracks.length}`)
  
  return {
    tracks: uniqueTracks.slice(0, 30).map(formatTrack)
  }
}

// Remover duplicatas e classificar por relevância
function removeDuplicatesAndRank(tracks: any[], query: string) {
  // Remover duplicatas por ID
  const unique = tracks.filter((track, index, self) => 
    index === self.findIndex(t => t.id === track.id)
  )
  
  // Classificar por relevância
  return unique.sort((a, b) => {
    const scoreA = calculateRelevanceScore(a, query)
    const scoreB = calculateRelevanceScore(b, query)
    
    if (scoreA !== scoreB) return scoreB - scoreA
    return (b.popularity || 0) - (a.popularity || 0)
  })
}

// Calcular pontuação de relevância
function calculateRelevanceScore(track: any, query: string): number {
  if (!query || query === 'popular brasileiro') return track.popularity || 0
  
  const lowerQuery = query.toLowerCase()
  const title = track.name.toLowerCase()
  const artist = track.artists[0]?.name.toLowerCase() || ''
  
  let score = 0
  
  // Pontuação por correspondência exata
  if (title === lowerQuery) score += 100
  else if (title.includes(lowerQuery)) score += 80
  else if (artist.includes(lowerQuery)) score += 60
  
  // Pontuação por palavras
  const queryWords = lowerQuery.split(' ')
  const titleWords = title.split(' ')
  const artistWords = artist.split(' ')
  
  queryWords.forEach(qWord => {
    if (titleWords.some(tWord => tWord.includes(qWord))) score += 30
    if (artistWords.some(aWord => aWord.includes(qWord))) score += 20
  })
  
  // Bônus por qualidade
  if (track.preview_url) score += 15
  if (track.popularity > 70) score += 10
  if (track.popularity > 50) score += 5
  
  return score
}

// Formatar track para resposta
function formatTrack(item: any) {
  return {
    id: item.id,
    title: item.name,
    artist: item.artists[0]?.name || 'Artista Desconhecido',
    duration: Math.floor(item.duration_ms / 1000),
    preview_url: item.preview_url,
    image: item.album?.images[0]?.url,
    popularity: item.popularity,
    external_url: item.external_urls?.spotify,
    source: 'spotify',
    bpm: undefined
  }
}
