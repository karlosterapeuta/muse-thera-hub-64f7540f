
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
    
    // Usar as credenciais do Supabase Secrets
    const clientId = '456e8998507c4ce69392ec1afd8a7fb6'
    const clientSecret = Deno.env.get('SPOTIFY_CLIENT_SECRET') || '00194c96f7574e5393f2f3f931bfb29f'
    
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
      throw new Error(`Failed to get Spotify token: ${tokenResponse.status}`)
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    let result = {}

    if (action === 'search') {
      // Buscar músicas
      const searchQuery = `${query} genre:children OR ${query} kids OR ${query} infantil`
      const searchParams = new URLSearchParams({
        q: searchQuery,
        type: 'track',
        market: 'BR',
        limit: '20'
      })

      const searchResponse = await fetch(`https://api.spotify.com/v1/search?${searchParams}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })

      if (!searchResponse.ok) {
        throw new Error(`Spotify search failed: ${searchResponse.status}`)
      }

      const searchData = await searchResponse.json()
      
      result = {
        tracks: searchData.tracks.items.map((item: any) => ({
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
      // Buscar músicas populares infantis
      const searchParams = new URLSearchParams({
        q: 'children songs popular infantil',
        type: 'track',
        market: 'BR',
        limit: '20'
      })

      const searchResponse = await fetch(`https://api.spotify.com/v1/search?${searchParams}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })

      if (!searchResponse.ok) {
        throw new Error(`Spotify popular search failed: ${searchResponse.status}`)
      }

      const searchData = await searchResponse.json()
      
      result = {
        tracks: searchData.tracks.items.map((item: any) => ({
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
    console.error('Error in Spotify API function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
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
