
// YouTube info handler with enhanced functionality
import { getYouTubeId, validateYouTubeId, checkYouTubeVideoExists } from '@/utils/youtubeUtils';

export async function getYouTubeInfo(id: string) {
  try {
    if (!id || !validateYouTubeId(id)) {
      console.error("Invalid YouTube ID:", id);
      return null;
    }

    // Check if the video exists by testing thumbnail
    const videoExists = await checkYouTubeVideoExists(id);
    if (!videoExists) {
      console.error("YouTube video does not exist:", id);
      return null;
    }

    // Make a fetch request to get video info from YouTube oEmbed API
    const videoUrl = `https://www.youtube.com/watch?v=${id}`;
    const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`);
    
    if (!response.ok) {
      console.error("YouTube API error:", response.status);
      return {
        title: `Vídeo do YouTube (${id})`,
        author_name: "YouTube Creator",
      };
    }

    const data = await response.json();
    return {
      title: data.title || `Vídeo do YouTube (${id})`,
      author_name: data.author_name || "YouTube Creator",
    };
  } catch (error) {
    console.error("Error fetching YouTube info:", error);
    return {
      title: `Vídeo do YouTube (${id})`,
      author_name: "YouTube Creator",
    };
  }
}
