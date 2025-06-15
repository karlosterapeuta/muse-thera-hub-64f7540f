
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
      throw new Error(`Failed to get Spotify token: ${tokenResponse.status}`)
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    let result = {}

    if (action === 'search') {
      // Buscar no Spotify com múltiplas estratégias
      const searchStrategies = [
        query,
        `${query} children`,
        `${query} kids`,
        `${query} instrumental`,
        `${query} piano`,
        `${query} cover`,
        `children songs`,
        `kids music`,
        `nursery rhymes`,
        `piano instrumental`,
        `acoustic covers`,
        `classical piano`
      ]

      let allTracks = new Set()

      for (const searchQuery of searchStrategies) {
        try {
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
            if (searchData.tracks && searchData.tracks.items) {
              searchData.tracks.items.forEach(track => {
                if (track.preview_url) {
                  allTracks.add(JSON.stringify({
                    id: track.id,
                    title: track.name,
                    artist: track.artists[0]?.name || 'Unknown Artist',
                    duration: Math.floor(track.duration_ms / 1000),
                    preview_url: track.preview_url,
                    image: track.album?.images?.[0]?.url,
                    popularity: track.popularity,
                    external_url: track.external_urls?.spotify,
                    source: 'spotify'
                  }))
                }
              })
              console.log(`🔍 "${searchQuery}": +${searchData.tracks.items.filter(t => t.preview_url).length} tracks`)
            }
          }
        } catch (error) {
          console.error(`❌ Erro na busca "${searchQuery}":`, error)
        }

        if (allTracks.size >= 15) break
      }

      const tracks = Array.from(allTracks).map(trackStr => JSON.parse(trackStr))
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 15)

      console.log(`✅ Total de ${tracks.length} músicas encontradas`)
      result = { tracks }

    } else if (action === 'popular') {
      // Buscar músicas populares com várias categorias
      const popularCategories = [
        'children music',
        'kids songs',
        'piano instrumental',
        'acoustic covers',
        'nursery rhymes',
        'classical piano',
        'peaceful music',
        'educational songs',
        'lullabies',
        'simple melodies'
      ]

      let allTracks = new Set()

      for (const category of popularCategories) {
        try {
          const searchParams = new URLSearchParams({
            q: category,
            type: 'track',
            market: 'US',
            limit: '15'
          })

          const searchResponse = await fetch(`https://api.spotify.com/v1/search?${searchParams}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          })

          if (searchResponse.ok) {
            const searchData = await searchResponse.json()
            if (searchData.tracks && searchData.tracks.items) {
              searchData.tracks.items.forEach(track => {
                if (track.preview_url) {
                  allTracks.add(JSON.stringify({
                    id: track.id,
                    title: track.name,
                    artist: track.artists[0]?.name || 'Unknown Artist',
                    duration: Math.floor(track.duration_ms / 1000),
                    preview_url: track.preview_url,
                    image: track.album?.images?.[0]?.url,
                    popularity: track.popularity,
                    external_url: track.external_urls?.spotify,
                    source: 'spotify'
                  }))
                }
              })
              console.log(`🔍 Popular "${category}": +${searchData.tracks.items.filter(t => t.preview_url).length} tracks`)
            }
          }
        } catch (error) {
          console.error(`❌ Erro na categoria "${category}":`, error)
        }

        if (allTracks.size >= 20) break
      }

      const tracks = Array.from(allTracks).map(trackStr => JSON.parse(trackStr))
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 20)

      console.log(`✅ Total de ${tracks.length} músicas populares encontradas`)
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
        } else {
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
