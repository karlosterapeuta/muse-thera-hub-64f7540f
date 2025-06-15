
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
    
    // Credenciais do Spotify
    const clientId = '456e8998507c4ce69392ec1afd8a7fb6'
    const clientSecret = Deno.env.get('SPOTIFY_CLIENT_SECRET') || '00194c96f7574e5393f2f3f931bfb29f'
    
    console.log(`🎵 Spotify API - Ação: ${action}, Query: ${query}`)
    
    // Obter token de acesso
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials'
    })

    if (!tokenResponse.ok) {
      console.error(`❌ Falha ao obter token do Spotify: ${tokenResponse.status}`)
      const errorText = await tokenResponse.text()
      console.error(`❌ Resposta do token: ${errorText}`)
      throw new Error(`Failed to get Spotify token: ${tokenResponse.status}`)
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token
    console.log(`✅ Token obtido com sucesso`)

    let result = {}

    if (action === 'search') {
      // Buscar no Spotify com múltiplas estratégias melhoradas
      const searchStrategies = [
        query,
        `"${query}"`,
        `${query} music`,
        `${query} song`,
        `${query} track`,
        'children music',
        'kids songs',
        'nursery rhymes',
        'piano music',
        'instrumental music',
        'happy birthday',
        'twinkle star',
        'mary had little lamb',
        'old macdonald',
        'rock a bye baby',
        'classical piano',
        'peaceful music',
        'educational songs',
        'lullaby',
        'simple songs'
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
            console.log(`📊 API Response status: ${searchResponse.status}`)
            console.log(`📊 Tracks found: ${searchData.tracks?.items?.length || 0}`)
            
            if (searchData.tracks && searchData.tracks.items) {
              let validTracksCount = 0
              
              searchData.tracks.items.forEach(track => {
                // Verificar se tem preview_url válida
                if (track.preview_url && track.preview_url.trim() !== '') {
                  const trackObj = {
                    id: track.id,
                    title: track.name,
                    artist: track.artists[0]?.name || 'Unknown Artist',
                    duration: Math.floor(track.duration_ms / 1000),
                    preview_url: track.preview_url,
                    image: track.album?.images?.[0]?.url,
                    popularity: track.popularity || 0,
                    external_url: track.external_urls?.spotify,
                    source: 'spotify'
                  }
                  
                  // Usar ID como chave para evitar duplicatas
                  allTracks.set(track.id, trackObj)
                  validTracksCount++
                }
              })
              
              console.log(`✅ "${searchQuery}": ${validTracksCount} tracks válidas adicionadas`)
            }
          } else {
            console.error(`❌ Erro na busca "${searchQuery}": ${searchResponse.status}`)
            const errorText = await searchResponse.text()
            console.error(`❌ Resposta: ${errorText}`)
          }
        } catch (error) {
          console.error(`❌ Erro na busca "${searchQuery}":`, error)
        }

        // Parar se já temos músicas suficientes
        if (allTracks.size >= 20) {
          console.log(`🎯 Limite atingido: ${allTracks.size} músicas`)
          break
        }
      }

      // Converter Map para Array e ordenar por popularidade
      const tracks = Array.from(allTracks.values())
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 20)

      console.log(`✅ Total final: ${tracks.length} músicas encontradas`)
      
      // Debug das primeiras músicas
      tracks.slice(0, 3).forEach((track, index) => {
        console.log(`🎵 ${index + 1}. ${track.title} - ${track.artist} (${track.popularity}% popular)`)
      })
      
      result = { tracks }

    } else if (action === 'popular') {
      // Buscar músicas populares com categorias mais específicas
      const popularCategories = [
        'top hits',
        'pop music',
        'children music',
        'kids songs',
        'piano instrumental',
        'acoustic music',
        'nursery rhymes',
        'educational songs',
        'happy songs',
        'peaceful music',
        'classical piano',
        'simple melodies',
        'folk songs',
        'traditional songs'
      ]

      let allTracks = new Map()

      for (const category of popularCategories) {
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
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          })

          if (searchResponse.ok) {
            const searchData = await searchResponse.json()
            console.log(`📊 Categoria "${category}": ${searchData.tracks?.items?.length || 0} resultados`)
            
            if (searchData.tracks && searchData.tracks.items) {
              let validTracksCount = 0
              
              searchData.tracks.items.forEach(track => {
                if (track.preview_url && track.preview_url.trim() !== '') {
                  const trackObj = {
                    id: track.id,
                    title: track.name,
                    artist: track.artists[0]?.name || 'Unknown Artist',
                    duration: Math.floor(track.duration_ms / 1000),
                    preview_url: track.preview_url,
                    image: track.album?.images?.[0]?.url,
                    popularity: track.popularity || 0,
                    external_url: track.external_urls?.spotify,
                    source: 'spotify'
                  }
                  
                  allTracks.set(track.id, trackObj)
                  validTracksCount++
                }
              })
              
              console.log(`✅ "${category}": ${validTracksCount} tracks válidas`)
            }
          } else {
            console.error(`❌ Erro na categoria "${category}": ${searchResponse.status}`)
          }
        } catch (error) {
          console.error(`❌ Erro na categoria "${category}":`, error)
        }

        if (allTracks.size >= 25) {
          console.log(`🎯 Limite popular atingido: ${allTracks.size} músicas`)
          break
        }
      }

      const tracks = Array.from(allTracks.values())
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 25)

      console.log(`✅ Total de músicas populares: ${tracks.length}`)
      result = { tracks }

    } else if (action === 'audio-features' && trackId) {
      // Obter características do áudio
      try {
        const featuresResponse = await fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })

        if (featuresResponse.ok) {
          const featuresData = await featuresResponse.json()
          result = {
            bpm: Math.round(featuresData.tempo || 120)
          }
          console.log(`✅ BPM obtido: ${result.bpm}`)
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
    console.error('❌ Erro na função Spotify API:', error)
    
    // Retornar array vazio em caso de erro para não quebrar o frontend
    return new Response(
      JSON.stringify({ tracks: [] }),
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
