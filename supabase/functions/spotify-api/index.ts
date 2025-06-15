
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
    
    // Credenciais do Spotify (usar variáveis de ambiente em produção)
    const clientId = 'ca7261877c7848e6a2e8e7bb14f85e6e'
    const clientSecret = Deno.env.get('SPOTIFY_CLIENT_SECRET') || 'b93c7e8b936141d8b7fc0b6d4aa8b9b1'
    
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
      const errorData = await tokenResponse.json()
      console.error(`❌ Falha ao obter token do Spotify: ${tokenResponse.status}`)
      console.error(`❌ Resposta do erro:`, JSON.stringify(errorData))
      throw new Error(`Failed to get Spotify token: ${tokenResponse.status}`)
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    let result = {}

    if (action === 'search') {
      // Buscar com termos brasileiros e amplos
      const searchTerms = [
        query,
        `${query} brasileiro`,
        `${query} brasil`,
        `${query} MPB`,
        `${query} sertanejo`,
        `${query} forró`,
        `${query} bossa nova`,
        `${query} samba`,
        `${query} instrumental`,
        `${query} piano`,
        `${query} acoustic`,
        `${query} children`,
        `${query} kids`,
        `música ${query}`,
        `canção ${query}`,
        `${query} cover`,
        `${query} classical`
      ]

      let allTracks = []

      // Tentar diferentes mercados, priorizando Brasil
      const markets = ['BR', 'US', 'GB', 'ES', 'PT', 'AR']

      for (const searchTerm of searchTerms) {
        if (allTracks.length >= 30) break

        for (const market of markets) {
          if (allTracks.length >= 30) break

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
              
              // Filtrar apenas músicas com preview_url
              const tracksWithPreview = tracks.filter(item => item.preview_url)
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

      // Se ainda não temos resultados suficientes, tentar buscas genéricas brasileiras
      if (allTracks.length < 10) {
        console.log('🔄 Poucos resultados, tentando buscas brasileiras...')
        
        const brazilianTerms = [
          'Roberto Carlos',
          'Caetano Veloso',
          'Gilberto Gil',
          'Chico Buarque',
          'MPB clássicos',
          'sertanejo universitário',
          'forró tradicional',
          'bossa nova clássica',
          'samba brasileiro',
          'música popular brasileira',
          'Elis Regina',
          'Tom Jobim',
          'Vinícius de Moraes',
          'Marisa Monte',
          'Djavan',
          'música infantil brasileira',
          'canções populares brasil',
          'instrumental brasileiro',
          'piano brasileiro',
          'violão brasileiro'
        ]

        for (const brazilianTerm of brazilianTerms) {
          if (allTracks.length >= 25) break

          try {
            const searchParams = new URLSearchParams({
              q: brazilianTerm,
              type: 'track',
              market: 'BR',
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
              
              console.log(`🔍 Brasileiro "${brazilianTerm}": ${tracksWithPreview.length} com preview`)
            }
          } catch (error) {
            console.error(`❌ Erro na busca brasileira "${brazilianTerm}":`, error)
          }
        }
      }

      // Remover duplicatas e ordenar por popularidade
      const uniqueTracks = allTracks.filter((track, index, self) => 
        index === self.findIndex(t => t.id === track.id)
      ).sort((a, b) => b.popularity - a.popularity).slice(0, 25)

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
      // Buscar playlists populares brasileiras
      const popularQueries = [
        'top hits brasil',
        'MPB clássicos',
        'sertanejo hits',
        'Roberto Carlos',
        'Caetano Veloso',
        'Gilberto Gil',
        'bossa nova brasil',
        'samba brasileiro',
        'forró tradicional',
        'música popular brasileira',
        'piano instrumental brasil',
        'violão brasileiro',
        'música infantil brasil',
        'canções brasileiras',
        'hits nacionais',
        'Elis Regina',
        'Tom Jobim',
        'Chico Buarque',
        'Djavan sucessos',
        'Marisa Monte'
      ]

      let allTracks = []

      for (const popularQuery of popularQueries) {
        if (allTracks.length >= 40) break

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
            const tracksWithPreview = tracks.filter(item => item.preview_url)
            allTracks.push(...tracksWithPreview)
            
            console.log(`🔍 Popular brasileiro "${popularQuery}": ${tracksWithPreview.length} com preview`)
          }
        } catch (error) {
          console.error(`❌ Erro na busca popular brasileira "${popularQuery}":`, error)
        }
      }

      // Remover duplicatas e ordenar por popularidade
      const uniqueTracks = allTracks.filter((track, index, self) => 
        index === self.findIndex(t => t.id === track.id)
      ).sort((a, b) => b.popularity - a.popularity).slice(0, 30)

      console.log(`✅ Spotify popular brasileiro encontrou ${uniqueTracks.length} músicas únicas`)
      
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
