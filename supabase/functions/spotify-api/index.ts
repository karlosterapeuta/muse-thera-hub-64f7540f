
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
      // Buscar com termos muito mais amplos e variados
      const searchTerms = [
        query,
        `${query} instrumental`,
        `${query} cover`,
        `${query} acoustic`,
        `${query} piano`,
        `children ${query}`,
        `kids ${query}`,
        `nursery ${query}`,
        `classical ${query}`,
        `simple ${query}`
      ]

      let allTracks = []

      for (const searchTerm of searchTerms) {
        if (allTracks.length >= 25) break

        try {
          const searchParams = new URLSearchParams({
            q: searchTerm,
            type: 'track',
            market: 'US', // Usar mercado US para mais resultados
            limit: '15'
          })

          const searchResponse = await fetch(`https://api.spotify.com/v1/search?${searchParams}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          })

          if (searchResponse.ok) {
            const searchData = await searchResponse.json()
            const tracks = searchData.tracks.items || []
            
            // Filtrar apenas músicas com preview_url
            const tracksWithPreview = tracks.filter(item => item.preview_url)
            allTracks.push(...tracksWithPreview)
            
            console.log(`🔍 "${searchTerm}": ${tracksWithPreview.length} com preview`)
          } else {
            console.log(`⚠️ Busca falhou para: "${searchTerm}"`)
          }
        } catch (error) {
          console.error(`❌ Erro na busca "${searchTerm}":`, error)
        }
      }

      // Se ainda não temos resultados suficientes, tentar buscas genéricas
      if (allTracks.length < 10) {
        console.log('🔄 Poucos resultados, tentando buscas genéricas...')
        
        const genericTerms = [
          'children music instrumental',
          'kids songs piano',
          'nursery rhymes acoustic',
          'classical piano simple',
          'instrumental covers',
          'easy listening piano'
        ]

        for (const genericTerm of genericTerms) {
          if (allTracks.length >= 20) break

          try {
            const searchParams = new URLSearchParams({
              q: genericTerm,
              type: 'track',
              market: 'US',
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
              const tracksWithPreview = tracks.filter(item => item.preview_url)
              allTracks.push(...tracksWithPreview)
              
              console.log(`🔍 Genérico "${genericTerm}": ${tracksWithPreview.length} com preview`)
            }
          } catch (error) {
            console.error(`❌ Erro na busca genérica "${genericTerm}":`, error)
          }
        }
      }

      // Remover duplicatas e ordenar por popularidade
      const uniqueTracks = allTracks.filter((track, index, self) => 
        index === self.findIndex(t => t.id === track.id)
      ).sort((a, b) => b.popularity - a.popularity).slice(0, 20)

      console.log(`✅ Spotify search encontrou ${uniqueTracks.length} músicas únicas com preview`)

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
      // Buscar playlists populares de música infantil e instrumental
      const popularQueries = [
        'top 50 instrumental',
        'piano covers popular',
        'children music hits',
        'nursery rhymes collection',
        'classical piano peaceful',
        'acoustic covers popular',
        'kids instrumental music',
        'peaceful piano music',
        'simple piano melodies',
        'easy listening instrumental'
      ]

      let allTracks = []

      for (const popularQuery of popularQueries) {
        if (allTracks.length >= 30) break

        try {
          const searchParams = new URLSearchParams({
            q: popularQuery,
            type: 'track',
            market: 'US',
            limit: '15'
          })

          const searchResponse = await fetch(`https://api.spotify.com/v1/search?${searchParams}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          })

          if (searchResponse.ok) {
            const searchData = await searchResponse.json()
            const tracks = searchData.tracks.items || []
            const tracksWithPreview = tracks.filter(item => item.preview_url)
            allTracks.push(...tracksWithPreview)
            
            console.log(`🔍 Popular "${popularQuery}": ${tracksWithPreview.length} com preview`)
          }
        } catch (error) {
          console.error(`❌ Erro na busca popular "${popularQuery}":`, error)
        }
      }

      // Remover duplicatas e ordenar por popularidade
      const uniqueTracks = allTracks.filter((track, index, self) => 
        index === self.findIndex(t => t.id === track.id)
      ).sort((a, b) => b.popularity - a.popularity).slice(0, 25)

      console.log(`✅ Spotify popular encontrou ${uniqueTracks.length} músicas únicas`)
      
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
