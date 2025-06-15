
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
    
    // Obter credenciais dos secrets
    const clientId = Deno.env.get('SPOTIFY_CLIENT_ID')
    const clientSecret = Deno.env.get('SPOTIFY_CLIENT_SECRET')
    
    console.log(`🎵 Spotify API - Ação: ${action}, Query: ${query}`)
    console.log(`🔐 Client ID configurado: ${clientId ? 'Sim' : 'Não'}`)
    console.log(`🔐 Client Secret configurado: ${clientSecret ? 'Sim' : 'Não'}`)
    
    // Verificar se as credenciais estão configuradas
    if (!clientId || !clientSecret) {
      console.error('❌ Credenciais do Spotify não configuradas')
      return new Response(
        JSON.stringify({ 
          tracks: [],
          error: 'Spotify credentials not configured',
          fallback: true 
        }),
        { 
          status: 200,
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      )
    }
    
    // Obter token de acesso
    console.log('🔄 Obtendo token do Spotify...')
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials'
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error(`❌ Falha ao obter token do Spotify: ${tokenResponse.status}`)
      console.error(`❌ Resposta do erro: ${errorText}`)
      
      return new Response(
        JSON.stringify({ 
          tracks: [],
          error: `Failed to get Spotify token: ${tokenResponse.status}`,
          fallback: true 
        }),
        { 
          status: 200,
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      )
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token
    console.log(`✅ Token obtido com sucesso`)

    let result = {}

    if (action === 'search') {
      console.log(`🔍 Iniciando busca por: "${query}"`)
      
      // Estratégias de busca simplificadas mas eficazes
      const searchStrategies = [
        query,
        `${query} music`,
        'children songs',
        'piano music',
        'instrumental music',
        'classical music for children',
        'nursery rhymes',
        'kids music',
        'educational songs'
      ]

      let allTracks = new Map()
      const markets = ['US', 'BR', 'GB']

      for (const searchQuery of searchStrategies) {
        try {
          console.log(`🔍 Buscando: "${searchQuery}"`)
          
          const searchParams = new URLSearchParams({
            q: searchQuery,
            type: 'track',
            market: 'US',
            limit: '20'
          })

          const searchResponse = await fetch(`https://api.spotify.com/v1/search?${searchParams}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          })

          if (searchResponse.ok) {
            const searchData = await searchResponse.json()
            console.log(`📊 "${searchQuery}": ${searchData.tracks?.items?.length || 0} resultados`)
            
            if (searchData.tracks && searchData.tracks.items) {
              searchData.tracks.items.forEach(track => {
                if (track.id && track.name && track.artists?.[0]?.name) {
                  const trackObj = {
                    id: track.id,
                    title: track.name,
                    artist: track.artists[0].name,
                    duration: Math.floor(track.duration_ms / 1000),
                    preview_url: track.preview_url || null,
                    image: track.album?.images?.[0]?.url,
                    popularity: track.popularity || 0,
                    external_url: track.external_urls?.spotify,
                    source: 'spotify',
                    has_preview: !!track.preview_url
                  }
                  
                  if (!allTracks.has(track.id)) {
                    allTracks.set(track.id, trackObj)
                  }
                }
              })
            }
          } else {
            console.error(`❌ Erro na busca "${searchQuery}": ${searchResponse.status}`)
          }
        } catch (error) {
          console.error(`❌ Erro na busca "${searchQuery}":`, error)
        }

        // Parar se já temos músicas suficientes
        if (allTracks.size >= 15) {
          console.log(`🎯 Limite atingido: ${allTracks.size} músicas`)
          break
        }
      }

      const tracks = Array.from(allTracks.values())
        .sort((a, b) => {
          if (a.has_preview && !b.has_preview) return -1
          if (!a.has_preview && b.has_preview) return 1
          return b.popularity - a.popularity
        })
        .slice(0, 15)

      console.log(`✅ Total final: ${tracks.length} músicas encontradas`)
      
      tracks.slice(0, 3).forEach((track, index) => {
        console.log(`🎵 ${index + 1}. ${track.title} - ${track.artist} (preview: ${track.has_preview ? 'Sim' : 'Não'})`)
      })
      
      result = { tracks }

    } else if (action === 'popular') {
      console.log('🔍 Buscando músicas populares')

      const popularQueries = [
        'top hits',
        'children music',
        'piano instrumental',
        'classical music',
        'kids songs',
        'nursery rhymes'
      ]

      let allTracks = new Map()

      for (const category of popularQueries) {
        try {
          console.log(`🔍 Categoria popular: "${category}"`)
          
          const searchParams = new URLSearchParams({
            q: category,
            type: 'track',
            market: 'US',
            limit: '20'
          })

          const searchResponse = await fetch(`https://api.spotify.com/v1/search?${searchParams}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          })

          if (searchResponse.ok) {
            const searchData = await searchResponse.json()
            console.log(`📊 Categoria "${category}": ${searchData.tracks?.items?.length || 0} resultados`)
            
            if (searchData.tracks && searchData.tracks.items) {
              searchData.tracks.items.forEach(track => {
                if (track.id && track.name && track.artists?.[0]?.name) {
                  const trackObj = {
                    id: track.id,
                    title: track.name,
                    artist: track.artists[0].name,
                    duration: Math.floor(track.duration_ms / 1000),
                    preview_url: track.preview_url || null,
                    image: track.album?.images?.[0]?.url,
                    popularity: track.popularity || 0,
                    external_url: track.external_urls?.spotify,
                    source: 'spotify',
                    has_preview: !!track.preview_url
                  }
                  
                  if (!allTracks.has(track.id)) {
                    allTracks.set(track.id, trackObj)
                  }
                }
              })
            }
          } else {
            console.error(`❌ Erro na categoria "${category}": ${searchResponse.status}`)
          }
        } catch (error) {
          console.error(`❌ Erro na categoria "${category}":`, error)
        }

        if (allTracks.size >= 20) {
          console.log(`🎯 Limite popular atingido: ${allTracks.size} músicas`)
          break
        }
      }

      const tracks = Array.from(allTracks.values())
        .sort((a, b) => {
          if (a.has_preview && !b.has_preview) return -1
          if (!a.has_preview && b.has_preview) return 1
          return b.popularity - a.popularity
        })
        .slice(0, 20)

      console.log(`✅ Total de músicas populares: ${tracks.length}`)
      
      tracks.slice(0, 3).forEach((track, index) => {
        console.log(`🏆 ${index + 1}. ${track.title} - ${track.artist} (preview: ${track.has_preview ? 'Sim' : 'Não'})`)
      })
      
      result = { tracks }

    } else if (action === 'audio-features' && trackId) {
      try {
        console.log(`🎵 Obtendo features para track: ${trackId}`)
        
        const featuresResponse = await fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })

        if (featuresResponse.ok) {
          const featuresData = await featuresResponse.json()
          const bpm = Math.round(featuresData.tempo || 120)
          result = { bpm }
          console.log(`✅ BPM obtido: ${bpm} para track ${trackId}`)
        } else {
          console.log(`⚠️ Usando BPM padrão para track ${trackId}`)
          result = { bpm: 120 }
        }
      } catch (error) {
        console.error('❌ Erro ao obter features:', error)
        result = { bpm: 120 }
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
    console.error('❌ Erro geral na função Spotify API:', error)
    
    return new Response(
      JSON.stringify({ 
        tracks: [],
        error: error.message || 'Unknown error',
        fallback: true 
      }),
      { 
        status: 200,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
