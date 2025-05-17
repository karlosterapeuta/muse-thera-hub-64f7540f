
/**
 * Spotify API utils for authentication and data fetching
 */

// Replace these with your actual Spotify API credentials
// For production, these should be stored securely, not in the code
const CLIENT_ID = 'CLIENT_ID'; // Replace with your Spotify Client ID
const CLIENT_SECRET = 'CLIENT_SECRET'; // Replace with your Spotify Client Secret

/**
 * Get Spotify access token using Client Credentials flow
 */
export const getSpotifyAccessToken = async (): Promise<string | null> => {
  try {
    const authOptions = {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials'
    };

    const response = await fetch('https://accounts.spotify.com/api/token', authOptions);
    
    if (!response.ok) {
      throw new Error(`Failed to get Spotify token: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Error fetching Spotify token:", error);
    return null;
  }
};

/**
 * Search for children's songs on Spotify
 */
export const searchChildrenSongs = async (accessToken: string, limit: number = 20): Promise<any[]> => {
  try {
    // Search for children's songs in Portuguese
    const searchParams = new URLSearchParams({
      q: 'genre:children language:pt',
      type: 'track',
      market: 'BR',
      limit: limit.toString()
    });
    
    const response = await fetch(`https://api.spotify.com/v1/search?${searchParams.toString()}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Spotify search failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.tracks.items || [];
  } catch (error) {
    console.error("Error searching Spotify:", error);
    return [];
  }
};

/**
 * Get track audio features from Spotify
 */
export const getTrackDetails = async (accessToken: string, trackId: string): Promise<any | null> => {
  try {
    const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get track details: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching track details:", error);
    return null;
  }
};
