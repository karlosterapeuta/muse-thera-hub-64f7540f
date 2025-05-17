
/**
 * Extract YouTube video ID from various URL formats
 */
export const getYouTubeId = (url: string): string | null => {
  if (!url || url.trim() === '') return null;
  
  // Direct ID pattern (no slashes, dots, etc.)
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
  
  // Common YouTube URL patterns
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/, // youtu.be short URL
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/, // youtube.com/watch?v= standard URL
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/, // youtube.com/v/ alternative format
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/, // youtube.com/embed/ embed format
    /[?&]v=([a-zA-Z0-9_-]{11})/ // More general pattern as fallback
  ];
  
  // Try each pattern until we find a match
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }
  
  return null;
};

/**
 * Validate that a string matches YouTube ID format
 */
export const validateYouTubeId = (id: string | null): boolean => {
  if (!id) return false;
  return /^[a-zA-Z0-9_-]{11}$/.test(id);
};

/**
 * Check if a YouTube video exists using thumbnail loading
 */
export const checkYouTubeVideoExists = (youtubeId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    
    img.src = `https://img.youtube.com/vi/${youtubeId}/0.jpg`;
  });
};
