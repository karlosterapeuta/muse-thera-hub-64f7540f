
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
      // Buscar músicas com termos mais amplos
      const searchTerms = [
        `${query}`,
        `${query} children`,
        `${query} kids`,
        `instrumental ${query}`,
        `piano ${query}`
      ]

      let allTracks = []

      for (const searchTerm of searchTerms) {
        const searchParams = new URLSearchParams({
          q: searchTerm,
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
          const tracks = searchData.tracks.items.filter(item => item.preview_url)
          allTracks.push(...tracks)
          
          if (allTracks.length >= 15) break
        }
      }

      // Remover duplicatas
      const uniqueTracks = allTracks.filter((track, index, self) => 
        index === self.findIndex(t => t.id === track.id)
      ).slice(0, 15)

      console.log(`✅ Spotify encontrou ${uniqueTracks.length} músicas com preview`)

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
      // Buscar músicas populares com vários termos
      const popularQueries = [
        'children songs popular',
        'kids music instrumental',
        'piano children',
        'classical kids',
        'nursery rhymes'
      ]

      let allTracks = []

      for (const popularQuery of popularQueries) {
        const searchParams = new URLSearchParams({
          q: popularQuery,
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
          const tracks = searchData.tracks.items.filter(item => item.preview_url)
          allTracks.push(...tracks)
        }
      }

      // Remover duplicatas e ordenar por popularidade
      const uniqueTracks = allTracks.filter((track, index, self) => 
        index === self.findIndex(t => t.id === track.id)
      ).sort((a, b) => b.popularity - a.popularity).slice(0, 20)

      console.log(`✅ Spotify popular encontrou ${uniqueTracks.length} músicas`)
      
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
      // Obter características do áudio
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
      JSON.stringify({ error: error.message, tracks: [] }),
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
