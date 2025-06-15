
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
    
    // Usar credenciais fornecidas pelo usuário
    const clientId = Deno.env.get('SPOTIFY_CLIENT_ID') || '5d9cbefe'
    const clientSecret = Deno.env.get('SPOTIFY_CLIENT_SECRET') || 'a062a2dba4d89577a089199a1b5c795a'
    
    console.log(`🎵 Spotify API - Ação: ${action}, Query: ${query}`)
    console.log(`🔐 Usando Client ID: ${clientId}`)
    
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
      
      // Estratégias de busca otimizadas
      const searchStrategies = [
        query,
        `${query} music`,
        `${query} song`,
        'children songs',
        'piano music',
        'instrumental music',
        'classical music for children',
        'nursery rhymes',
        'kids music',
        'educational songs',
        'música infantil',
        'canções de ninar',
        'música clássica'
      ]

      let allTracks = new Map()

      for (const searchQuery of searchStrategies) {
        try {
          console.log(`🔍 Buscando: "${searchQuery}"`)
          
          const searchParams = new URLSearchParams({
            q: searchQuery,
            type: 'track',
            market: 'US',
            limit: '50'
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
                if (track.id && track.name && track.artists?.[0]?.name && track.preview_url) {
                  const trackObj = {
                    id: track.id,
                    title: track.name,
                    artist: track.artists[0].name,
                    duration: Math.floor(track.duration_ms / 1000),
                    preview_url: track.preview_url,
                    image: track.album?.images?.[0]?.url,
                    popularity: track.popularity || 0,
                    external_url: track.external_urls?.spotify,
                    source: 'spotify',
                    has_preview: true,
                    spotify_success: true
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

        // Parar se já temos músicas suficientes com preview
        if (allTracks.size >= 20) {
          console.log(`🎯 Limite atingido: ${allTracks.size} músicas com preview`)
          break
        }
      }

      const tracks = Array.from(allTracks.values())
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 20)

      console.log(`✅ Total final: ${tracks.length} músicas do Spotify encontradas`)
      console.log(`🎵 Todas com preview: ${tracks.filter(t => t.has_preview).length}`)
      
      tracks.slice(0, 3).forEach((track, index) => {
        console.log(`🎵 ${index + 1}. ${track.title} - ${track.artist} (✅ com preview)`)
      })
      
      result = { 
        tracks,
        spotify_success: true,
        total_found: tracks.length
      }

    } else if (action === 'popular') {
      console.log('🔍 Buscando músicas populares')

      const popularQueries = [
        'top hits 2024',
        'children music popular',
        'piano instrumental hits',
        'classical music popular',
        'kids songs popular',
        'nursery rhymes',
        'música infantil popular',
        'canções populares crianças'
      ]

      let allTracks = new Map()

      for (const category of popularQueries) {
        try {
          console.log(`🔍 Categoria popular: "${category}"`)
          
          const searchParams = new URLSearchParams({
            q: category,
            type: 'track',
            market: 'US',
            limit: '50'
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
                if (track.id && track.name && track.artists?.[0]?.name && track.preview_url) {
                  const trackObj = {
                    id: track.id,
                    title: track.name,
                    artist: track.artists[0].name,
                    duration: Math.floor(track.duration_ms / 1000),
                    preview_url: track.preview_url,
                    image: track.album?.images?.[0]?.url,
                    popularity: track.popularity || 0,
                    external_url: track.external_urls?.spotify,
                    source: 'spotify',
                    has_preview: true,
                    spotify_success: true
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

        if (allTracks.size >= 30) {
          console.log(`🎯 Limite popular atingido: ${allTracks.size} músicas`)
          break
        }
      }

      const tracks = Array.from(allTracks.values())
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 30)

      console.log(`✅ Total de músicas populares: ${tracks.length}`)
      console.log(`🎵 Todas com preview: ${tracks.filter(t => t.has_preview).length}`)
      
      tracks.slice(0, 3).forEach((track, index) => {
        console.log(`🏆 ${index + 1}. ${track.title} - ${track.artist} (✅ com preview)`)
      })
      
      result = { 
        tracks,
        spotify_success: true,
        total_found: tracks.length
      }

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
