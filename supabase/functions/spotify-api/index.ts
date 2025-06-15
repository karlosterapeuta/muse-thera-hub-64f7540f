
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
    
    // Credenciais atualizadas do Spotify
    const clientId = '621c3273fae14b20ba611da08b02b8b6'
    const clientSecret = '894151949126492da49d77cd8741a888'
    
    console.log(`🎵 Spotify API - Ação: ${action}, Query: ${query}`)
    console.log(`🔐 Usando Client ID: ${clientId.substring(0, 8)}...`)
    
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
      // Estratégias de busca melhoradas e mais abrangentes
      const searchStrategies = [
        query,
        `"${query}"`,
        `${query} music`,
        `${query} song`,
        `${query} instrumental`,
        'children music',
        'kids songs',
        'nursery rhymes',
        'piano music',
        'classical music',
        'instrumental music',
        'happy birthday',
        'twinkle star',
        'mary had little lamb',
        'old macdonald',
        'rock a bye baby',
        'baa baa black sheep',
        'london bridge',
        'humpty dumpty',
        'row row row boat',
        'wheels on the bus',
        'if you happy and you know it',
        'head shoulders knees toes',
        'abc song',
        'educational songs',
        'lullaby',
        'simple melodies',
        'easy piano',
        'beginner music',
        'peaceful music',
        'relaxing music',
        'meditation music',
        'ambient music',
        'calm music',
        'soft music'
      ]

      let allTracks = new Map()
      const markets = ['US', 'BR', 'GB', 'CA', 'AU', 'DE', 'FR', 'ES', 'IT', 'NL']

      for (const searchQuery of searchStrategies) {
        for (const market of markets) {
          try {
            console.log(`🔍 Buscando: "${searchQuery}" no mercado ${market}`)
            
            const searchParams = new URLSearchParams({
              q: searchQuery,
              type: 'track',
              market: market,
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
              console.log(`📊 "${searchQuery}" (${market}): ${searchData.tracks?.items?.length || 0} resultados`)
              
              if (searchData.tracks && searchData.tracks.items) {
                let validTracksCount = 0
                
                searchData.tracks.items.forEach(track => {
                  // Aceitar todas as músicas, mesmo sem preview
                  const trackObj = {
                    id: track.id,
                    title: track.name,
                    artist: track.artists[0]?.name || 'Unknown Artist',
                    duration: Math.floor(track.duration_ms / 1000),
                    preview_url: track.preview_url || null, // Pode ser null
                    image: track.album?.images?.[0]?.url,
                    popularity: track.popularity || 0,
                    external_url: track.external_urls?.spotify,
                    source: 'spotify',
                    has_preview: !!track.preview_url
                  }
                  
                  // Usar ID como chave para evitar duplicatas
                  if (!allTracks.has(track.id)) {
                    allTracks.set(track.id, trackObj)
                    validTracksCount++
                  }
                })
                
                console.log(`✅ "${searchQuery}" (${market}): ${validTracksCount} tracks adicionadas`)
              }
            } else {
              console.error(`❌ Erro na busca "${searchQuery}" (${market}): ${searchResponse.status}`)
            }
          } catch (error) {
            console.error(`❌ Erro na busca "${searchQuery}" (${market}):`, error)
          }

          // Parar se já temos músicas suficientes
          if (allTracks.size >= 30) {
            console.log(`🎯 Limite atingido: ${allTracks.size} músicas`)
            break
          }
        }
        
        if (allTracks.size >= 30) break
      }

      // Converter Map para Array e ordenar por popularidade e presença de preview
      const tracks = Array.from(allTracks.values())
        .sort((a, b) => {
          // Priorizar músicas com preview
          if (a.has_preview && !b.has_preview) return -1
          if (!a.has_preview && b.has_preview) return 1
          // Depois ordenar por popularidade
          return b.popularity - a.popularity
        })
        .slice(0, 25)

      console.log(`✅ Total final: ${tracks.length} músicas encontradas`)
      
      // Debug das primeiras músicas
      tracks.slice(0, 5).forEach((track, index) => {
        console.log(`🎵 ${index + 1}. ${track.title} - ${track.artist} (${track.popularity}% popular, preview: ${track.has_preview ? 'Sim' : 'Não'})`)
      })
      
      result = { tracks }

    } else if (action === 'popular') {
      // Categorias populares expandidas
      const popularCategories = [
        'top hits global',
        'viral hits',
        'trending music',
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
        'traditional songs',
        'easy listening',
        'soft rock',
        'ambient music',
        'new age music',
        'meditation music',
        'relaxing piano',
        'instrumental pop',
        'modern classical',
        'minimalist music',
        'calm music',
        'study music',
        'background music',
        'chill music'
      ]

      let allTracks = new Map()
      const markets = ['US', 'BR', 'GB', 'CA', 'AU']

      for (const category of popularCategories) {
        for (const market of markets) {
          try {
            console.log(`🔍 Categoria popular: "${category}" (${market})`)
            
            const searchParams = new URLSearchParams({
              q: category,
              type: 'track',
              market: market,
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
              console.log(`📊 Categoria "${category}" (${market}): ${searchData.tracks?.items?.length || 0} resultados`)
              
              if (searchData.tracks && searchData.tracks.items) {
                let validTracksCount = 0
                
                searchData.tracks.items.forEach(track => {
                  const trackObj = {
                    id: track.id,
                    title: track.name,
                    artist: track.artists[0]?.name || 'Unknown Artist',
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
                    validTracksCount++
                  }
                })
                
                console.log(`✅ "${category}" (${market}): ${validTracksCount} tracks válidas`)
              }
            } else {
              console.error(`❌ Erro na categoria "${category}" (${market}): ${searchResponse.status}`)
            }
          } catch (error) {
            console.error(`❌ Erro na categoria "${category}" (${market}):`, error)
          }

          if (allTracks.size >= 35) {
            console.log(`🎯 Limite popular atingido: ${allTracks.size} músicas`)
            break
          }
        }
        
        if (allTracks.size >= 35) break
      }

      const tracks = Array.from(allTracks.values())
        .sort((a, b) => {
          // Priorizar músicas com preview
          if (a.has_preview && !b.has_preview) return -1
          if (!a.has_preview && b.has_preview) return 1
          // Depois ordenar por popularidade
          return b.popularity - a.popularity
        })
        .slice(0, 30)

      console.log(`✅ Total de músicas populares: ${tracks.length}`)
      
      // Debug das primeiras músicas populares
      tracks.slice(0, 3).forEach((track, index) => {
        console.log(`🏆 ${index + 1}. ${track.title} - ${track.artist} (${track.popularity}% popular, preview: ${track.has_preview ? 'Sim' : 'Não'})`)
      })
      
      result = { tracks }

    } else if (action === 'audio-features' && trackId) {
      // Obter características do áudio
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
