
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, query, trackId } = await req.json()
    
    // Usar credenciais do Spotify das variáveis de ambiente
    const clientId = Deno.env.get('SPOTIFY_CLIENT_ID')
    const clientSecret = Deno.env.get('SPOTIFY_CLIENT_SECRET')
    
    if (!clientId || !clientSecret) {
      console.error('❌ Credenciais do Spotify não configuradas')
      throw new Error('Spotify credentials not configured')
    }
    
    console.log(`🎵 Spotify API - Ação: ${action}, Query: ${query}`)
    
    // Obter token de acesso com cache
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
      console.error(`❌ Falha ao obter token do Spotify: ${tokenResponse.status}`)
      console.error(`❌ Resposta do erro:`, JSON.stringify(errorData))
      throw new Error(`Failed to get Spotify token: ${tokenResponse.status}`)
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    let result = {}

    if (action === 'search') {
      // Buscar com múltiplas estratégias brasileiras
      const brazilianSearchTerms = [
        query,
        `${query} brasileiro`,
        `${query} brasil`,
        `${query} MPB`,
        `${query} sertanejo`,
        `${query} forró`,
        `${query} bossa nova`,
        `${query} samba`,
        `música ${query}`,
        `canção ${query}`,
        `${query} acústico`,
        `${query} piano`,
        `${query} violão`,
        `${query} infantil`,
        `${query} popular`,
        `${query} clássico`
      ]

      // Artistas brasileiros para expandir busca
      const brazilianArtists = [
        'Roberto Carlos', 'Caetano Veloso', 'Gilberto Gil', 'Chico Buarque',
        'Elis Regina', 'Tom Jobim', 'Vinícius de Moraes', 'Djavan',
        'Marisa Monte', 'Gal Costa', 'Maria Bethânia', 'Milton Nascimento',
        'Jorge Ben Jor', 'Alceu Valença', 'Elba Ramalho', 'Fagner',
        'Zé Ramalho', 'Lenine', 'Arnaldo Antunes', 'Titãs',
        'Legião Urbana', 'Barão Vermelho', 'Capital Inicial', 'Skank',
        'O Rappa', 'Cidade Negra', 'Charlie Brown Jr', 'Jota Quest'
      ]

      let allTracks = []
      const markets = ['BR', 'US', 'GB', 'ES', 'PT', 'AR', 'MX']

      // Buscar por termos específicos
      for (const searchTerm of brazilianSearchTerms.slice(0, 8)) {
        if (allTracks.length >= 40) break

        for (const market of markets) {
          if (allTracks.length >= 40) break

          try {
            const searchParams = new URLSearchParams({
              q: searchTerm,
              type: 'track',
              market: market,
              limit: '20'
            })

            const searchResponse = await fetch(`https://api.spotify.com/v1/search?${searchParams}`, {
              headers: {
                'Authorization': `Bearer ${accessToken}`
              }
            })

            if (searchResponse.ok) {
              const searchData = await searchResponse.json()
              const tracks = searchData.tracks.items || []
              
              const tracksWithPreview = tracks.filter(item => 
                item.preview_url && 
                item.duration_ms > 10000 && // Pelo menos 10 segundos
                item.popularity > 20 // Mínimo de popularidade
              )
              
              allTracks.push(...tracksWithPreview)
              
              if (tracksWithPreview.length > 0) {
                console.log(`🔍 "${searchTerm}" (${market}): ${tracksWithPreview.length} com preview`)
              }
            }
          } catch (error) {
            console.error(`❌ Erro na busca "${searchTerm}" (${market}):`, error)
          }
        }
      }

      // Se poucos resultados, buscar artistas brasileiros famosos
      if (allTracks.length < 15) {
        console.log('🔄 Expandindo busca com artistas brasileiros...')
        
        for (const artist of brazilianArtists.slice(0, 10)) {
          if (allTracks.length >= 30) break

          try {
            const searchParams = new URLSearchParams({
              q: `artist:"${artist}"`,
              type: 'track',
              market: 'BR',
              limit: '10'
            })

            const searchResponse = await fetch(`https://api.spotify.com/v1/search?${searchParams}`, {
              headers: {
                'Authorization': `Bearer ${accessToken}`
              }
            })

            if (searchResponse.ok) {
              const searchData = await searchResponse.json()
              const tracks = searchData.tracks.items || []
              const validTracks = tracks.filter(item => 
                item.preview_url && item.popularity > 30
              )
              allTracks.push(...validTracks)
              
              console.log(`🎵 Artista "${artist}": ${validTracks.length} músicas`)
            }
          } catch (error) {
            console.error(`❌ Erro buscando artista "${artist}":`, error)
          }
        }
      }

      // Remover duplicatas e ordenar
      const uniqueTracks = allTracks.filter((track, index, self) => 
        index === self.findIndex(t => t.id === track.id)
      ).sort((a, b) => b.popularity - a.popularity).slice(0, 30)

      console.log(`✅ Spotify search: ${uniqueTracks.length} músicas únicas`)

      result = {
        tracks: uniqueTracks.map((item: any) => ({
          id: item.id,
          title: item.name,
          artist: item.artists[0]?.name || 'Artista Desconhecido',
          duration: Math.floor(item.duration_ms / 1000),
          preview_url: item.preview_url,
          image: item.album.images[0]?.url,
          popularity: item.popularity,
          external_url: item.external_urls.spotify,
          source: 'spotify',
          bpm: undefined
        }))
      }

    } else if (action === 'popular') {
      // Buscar hits brasileiros populares
      const popularQueries = [
        'top brasil hits',
        'Roberto Carlos sucessos',
        'Caetano Veloso clássicos',
        'MPB clássicos',
        'sertanejo universitário',
        'bossa nova brasil',
        'samba clássico',
        'forró pé de serra',
        'rock nacional brasileiro',
        'música popular brasileira',
        'Tom Jobim bossa nova',
        'Elis Regina MPB',
        'Chico Buarque sucessos',
        'Gilberto Gil tropicália',
        'música infantil brasileira'
      ]

      let allTracks = []

      for (const popularQuery of popularQueries) {
        if (allTracks.length >= 50) break

        try {
          const searchParams = new URLSearchParams({
            q: popularQuery,
            type: 'track',
            market: 'BR',
            limit: '20'
          })

          const searchResponse = await fetch(`https://api.spotify.com/v1/search?${searchParams}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          })

          if (searchResponse.ok) {
            const searchData = await searchResponse.json()
            const tracks = searchData.tracks.items || []
            const validTracks = tracks.filter(item => 
              item.preview_url && item.popularity > 25
            )
            allTracks.push(...validTracks)
            
            console.log(`🔍 Popular "${popularQuery}": ${validTracks.length} com preview`)
          }
        } catch (error) {
          console.error(`❌ Erro popular "${popularQuery}":`, error)
        }
      }

      const uniqueTracks = allTracks.filter((track, index, self) => 
        index === self.findIndex(t => t.id === track.id)
      ).sort((a, b) => b.popularity - a.popularity).slice(0, 40)

      console.log(`✅ Spotify popular: ${uniqueTracks.length} músicas`)
      
      result = {
        tracks: uniqueTracks.map((item: any) => ({
          id: item.id,
          title: item.name,
          artist: item.artists[0]?.name || 'Artista Desconhecido',
          duration: Math.floor(item.duration_ms / 1000),
          preview_url: item.preview_url,
          image: item.album.images[0]?.url,
          popularity: item.popularity,
          external_url: item.external_urls.spotify,
          source: 'spotify',
          bpm: undefined
        }))
      }

    } else if (action === 'audio-features' && trackId) {
      const featuresResponse = await fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })

      if (featuresResponse.ok) {
        const featuresData = await featuresResponse.json()
        result = {
          bpm: Math.round(featuresData.tempo)
        }
      }
    }

    return new Response(
      JSON.stringify(result),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
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
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
