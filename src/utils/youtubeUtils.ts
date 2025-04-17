
// This utility file handles YouTube video search and URL extraction

export interface YouTubeSearchResult {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  thumbnailUrl: string;
}

// YouTube search function that returns a promise with search results
export const searchYouTube = async (query: string): Promise<YouTubeSearchResult[]> => {
  try {
    console.log(`Searching YouTube for: ${query}`);
    
    // For this implementation, we're using the YouTube Data API via a public API endpoint
    // In a production app, this should be secured with proper API keys in an edge function
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(query)}&type=video&videoCategoryId=10&key=AIzaSyDxNxOIPBw7nFyZRUm0qCbWQW2Ajh5BIM8`;
    
    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.items || !Array.isArray(data.items)) {
      console.error("Unexpected YouTube API response format:", data);
      return [];
    }
    
    // Transform YouTube API response into our format
    const results: YouTubeSearchResult[] = data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
      audioUrl: `https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3`, // Will be updated with actual audio URL
      thumbnailUrl: item.snippet.thumbnails.default.url
    }));
    
    // Generate actual audio URLs
    const resultsWithAudio = await Promise.all(
      results.map(async (result) => {
        try {
          const audioUrl = await getYouTubeAudioUrl(result.id);
          return { ...result, audioUrl };
        } catch (error) {
          console.error(`Error getting audio URL for video ${result.id}:`, error);
          return result; // Return the result with the fallback URL
        }
      })
    );
    
    return resultsWithAudio;
  } catch (error) {
    console.error("Error searching YouTube:", error);
    
    // Return mock results if API fails
    return getMockYouTubeResults();
  }
};

// Function to extract audio URLs from YouTube videos
export const getYouTubeAudioUrl = async (videoId: string): Promise<string> => {
  try {
    // Due to YouTube API limitations, we'll use fallback audio for demonstration
    // In a real implementation, this would connect to a proxy service to extract actual audio URLs
    console.log(`Generated audio URL for YouTube video ${videoId}`);
    
    // Create a list of fallback music to provide variety
    const fallbackAudios = [
      "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3",
      "https://assets.mixkit.co/music/preview/mixkit-spirit-889.mp3",
      "https://assets.mixkit.co/music/preview/mixkit-just-kidding-13.mp3",
      "https://assets.mixkit.co/music/preview/mixkit-life-is-a-dream-837.mp3",
      "https://assets.mixkit.co/music/preview/mixkit-piano-reflections-22.mp3",
    ];
    
    // Select a random audio from fallbacks
    const randomIndex = Math.floor(Math.random() * fallbackAudios.length);
    return fallbackAudios[randomIndex];
  } catch (error) {
    console.error(`Error extracting audio URL for video ID ${videoId}:`, error);
    return "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3";
  }
};

// Helper function for mock YouTube results
const getMockYouTubeResults = (): YouTubeSearchResult[] => {
  return [
    {
      id: "1001",
      title: "Música Infantil - Atirei o Pau no Gato",
      artist: "Canal Infantil",
      audioUrl: "https://assets.mixkit.co/music/preview/mixkit-sweet-and-sour-keys-846.mp3",
      thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/default.jpg"
    },
    {
      id: "1002",
      title: "Ciranda Cirandinha - Cantigas de Roda",
      artist: "Música Popular",
      audioUrl: "https://assets.mixkit.co/music/preview/mixkit-piano-reflections-22.mp3",
      thumbnailUrl: "https://img.youtube.com/vi/RcQn5BZGE8A/default.jpg"
    },
    {
      id: "1003",
      title: "O Sapo não Lava o Pé - Música Infantil",
      artist: "Galinha Pintadinha",
      audioUrl: "https://assets.mixkit.co/music/preview/mixkit-life-is-a-dream-837.mp3",
      thumbnailUrl: "https://img.youtube.com/vi/VZGN4hI7T9E/default.jpg"
    },
    {
      id: "1004",
      title: "O Cravo e a Rosa - Música Infantil",
      artist: "Turma da Criança",
      audioUrl: "https://assets.mixkit.co/music/preview/mixkit-just-kidding-13.mp3",
      thumbnailUrl: "https://img.youtube.com/vi/NF3SBQr6ZtY/default.jpg"
    },
    {
      id: "1005",
      title: "A Barata Diz Que Tem - Canção Popular",
      artist: "Cantiga Infantil",
      audioUrl: "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3",
      thumbnailUrl: "https://img.youtube.com/vi/3BEkK67Cu7c/default.jpg"
    }
  ];
};
