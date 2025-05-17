import { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Pause, Music, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { generateFallbackTone } from "@/utils/audioUtils";
import { getYouTubeId, validateYouTubeId, checkYouTubeVideoExists } from "@/utils/youtubeUtils";
import { getYouTubeInfo } from "@/pages/api/youtube-info";

// Define song type
export type Song = {
  id: string;
  title: string;
  artist: string;
  url: string;
  thumbnail?: string;
  source?: "default" | "youtube";
};

// Create an empty song library
export const songLibrary: Song[] = [];

// Backup URL if all else fails
const ULTIMATE_FALLBACK_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3";

// YouTube API embed URL base
const YOUTUBE_EMBED_API_BASE = "https://www.youtube.com/embed/";

interface MusicPlaylistProps {
  onMusicSelect: (musicId: string | null) => void;
  currentMusic: string | null;
}

export function MusicPlaylist({ onMusicSelect, currentMusic }: MusicPlaylistProps) {
  const [audioTestElement, setAudioTestElement] = useState<HTMLAudioElement | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [displaySongs, setDisplaySongs] = useState<Song[]>(songLibrary);
  const [youtubeIframeVisible, setYoutubeIframeVisible] = useState(false);
  const [currentYoutubeId, setCurrentYoutubeId] = useState<string | null>(null);
  const youtubeIframeRef = useRef<HTMLIFrameElement>(null);
  
  // Create a test audio element to verify URLs
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    setAudioTestElement(audio);
    
    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, []);
  
  // Function to fetch YouTube video title from thumbnail or metadata
  const fetchYouTubeVideoInfo = async (youtubeId: string): Promise<{ title: string, artist: string, success: boolean }> => {
    try {
      // Validate the ID first
      if (!validateYouTubeId(youtubeId)) {
        return { title: "", artist: "", success: false };
      }
      
      // Check if video exists via thumbnail
      const videoExists = await checkYouTubeVideoExists(youtubeId);
      if (!videoExists) {
        return { title: "", artist: "", success: false };
      }
      
      // Get info from our API handler
      const info = await getYouTubeInfo(youtubeId);
      if (info && info.title) {
        return { 
          title: info.title, 
          artist: info.author_name || "YouTube Creator", 
          success: true 
        };
      } else {
        // Fallback with ID
        return { 
          title: `Vídeo do YouTube (${youtubeId.substring(0, 6)}...)`, 
          artist: "YouTube Creator", 
          success: true 
        };
      }
    } catch (error) {
      console.error("Error fetching YouTube info:", error);
      return { 
        title: `Vídeo do YouTube (${youtubeId.substring(0, 6)}...)`, 
        artist: "YouTube Creator", 
        success: true 
      };
    }
  };

  // Handle search submission
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Digite algo para pesquisar");
      return;
    }
    
    setIsSearching(true);
    
    // Extract YouTube ID from input
    const youtubeId = getYouTubeId(searchQuery);
    
    // Validate the ID format
    if (youtubeId && validateYouTubeId(youtubeId)) {
      try {
        // Try to fetch video metadata
        const { title, artist, success } = await fetchYouTubeVideoInfo(youtubeId);
        
        if (success) {
          // Create a song entry for valid YouTube ID
          const newSong: Song = {
            id: `youtube-${youtubeId}`,
            title: title,
            artist: artist,
            url: `https://www.youtube.com/watch?v=${youtubeId}`,
            thumbnail: `https://img.youtube.com/vi/${youtubeId}/0.jpg`,
            source: "youtube"
          };
          
          setSearchResults([newSong]);
          setDisplaySongs(prev => {
            // Check if the song already exists to prevent duplicates
            const exists = prev.some(song => song.id === newSong.id);
            return exists ? prev : [...prev, newSong];
          });
          toast.success("Vídeo do YouTube encontrado!");
        } else {
          toast.error("ID de vídeo do YouTube inválido ou vídeo não encontrado");
        }
      } catch (error) {
        console.error("Error validating YouTube video:", error);
        toast.error("Erro ao validar vídeo do YouTube");
      }
      
      setIsSearching(false);
      return;
    }
    
    // If not a direct YouTube URL, treat as search query
    try {
      // Use the search term to search for videos (simulating a YouTube search)
      const searchTerm = encodeURIComponent(searchQuery);
      
      // Search-related YouTube video IDs based on common music topics
      // These are just popular music videos that could be relevant to search terms
      let relatedVideoIds: string[] = [];
      
      // Match based on search term to provide more relevant results
      const lowerSearch = searchQuery.toLowerCase();
      
      if (lowerSearch.includes("rock") || lowerSearch.includes("roll")) {
        relatedVideoIds = ["l482T0yNkeo", "TJXTjZflJdU", "1w7OgIMMRc4"]; // Rock related videos
      } else if (lowerSearch.includes("pop") || lowerSearch.includes("dance")) {
        relatedVideoIds = ["CevxZvSJLk8", "dQw4w9WgXcQ", "OPf0YbXqDm0"]; // Pop related videos
      } else if (lowerSearch.includes("classical") || lowerSearch.includes("orchestra")) {
        relatedVideoIds = ["_mVW8tgGY_w", "EJC-_j3SnXk", "fOk8Tm815lE"]; // Classical related videos
      } else if (lowerSearch.includes("country") || lowerSearch.includes("western")) {
        relatedVideoIds = ["K_yBUfMGvzc", "BjZPvXKewFk", "7yg05DSGWzE"]; // Country related videos
      } else if (lowerSearch.includes("jazz") || lowerSearch.includes("blues")) {
        relatedVideoIds = ["CWeXOm4NNb8", "ZhN2PbHMazw", "v6kYEEjwLsU"]; // Jazz related videos
      } else if (lowerSearch.includes("rap") || lowerSearch.includes("hip hop")) {
        relatedVideoIds = ["uelHwf8o7_U", "YVkUvmDQ3HY", "5qm8PH4xAss"]; // Rap related videos
      } else if (lowerSearch.includes("samba") || lowerSearch.includes("brasil")) {
        relatedVideoIds = ["3yd_eoMOvqk", "W5SLC_n_66M", "KxcP7TRY178"]; // Brazilian music
      } else if (lowerSearch.includes("infantil") || lowerSearch.includes("crianças") || lowerSearch.includes("crianca")) {
        relatedVideoIds = ["XqZsoesa55w", "HP8S_0Z5ybM", "LIrJ6UnUTQo"]; // Children's songs
      } else if (lowerSearch.includes("relaxante") || lowerSearch.includes("medita")) {
        relatedVideoIds = ["lFcSrYw-ARY", "77ZozI0rw7g", "1ZYbU82GVz4"]; // Relaxing music
      } else {
        // Generic popular music videos for any other search
        relatedVideoIds = [
          "JGwWNGJdvx8", // Shape of You - Ed Sheeran
          "RqcjBLMaWCg", // Uptown Funk - Mark Ronson ft. Bruno Mars
          "kJQP7kiw5Fk"  // Despacito - Luis Fonsi ft. Daddy Yankee
        ];
      }
      
      const resultPromises = relatedVideoIds.map(async (videoId, index) => {
        try {
          const info = await fetchYouTubeVideoInfo(videoId);
          const videoTitle = info.success 
            ? info.title 
            : `${searchQuery} - Resultado ${index + 1}`;
            
          const videoArtist = info.success
            ? info.artist
            : "YouTube Music";
            
          return {
            id: `yt-search-${Date.now()}-${index}`,
            title: videoTitle,
            artist: videoArtist,
            url: `https://www.youtube.com/watch?v=${videoId}`,
            thumbnail: `https://img.youtube.com/vi/${videoId}/0.jpg`,
            source: "youtube" as const
          };
        } catch (error) {
          console.error("Error fetching video info:", error);
          // Return a fallback song object in case of error
          return {
            id: `yt-search-${Date.now()}-${index}`,
            title: `${searchQuery} - Resultado ${index + 1}`,
            artist: "YouTube Music",
            url: `https://www.youtube.com/watch?v=${videoId}`,
            thumbnail: `https://img.youtube.com/vi/${videoId}/0.jpg`,
            source: "youtube" as const
          };
        }
      });
      
      const searchResults = await Promise.all(resultPromises);
      
      setSearchResults(searchResults);
      setDisplaySongs(prev => {
        // Filter out any duplicate IDs
        const newSongs = searchResults.filter(newSong => 
          !prev.some(existingSong => existingSong.url === newSong.url)
        );
        return [...prev, ...newSongs];
      });
      
      toast.success(`Resultados para "${searchQuery}" encontrados!`);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Erro ao buscar músicas");
    } finally {
      setIsSearching(false);
    }
  };
  
  // Reset search
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setDisplaySongs(songLibrary);
    setYoutubeIframeVisible(false);
    if (youtubeIframeRef.current) {
      youtubeIframeRef.current.src = "";
    }
    setCurrentYoutubeId(null);
  };
  
  // Handle song click from library or search results
  const handleSongClick = (song: Song) => {
    if (song.source === "youtube") {
      // Handle YouTube video
      const youtubeId = getYouTubeId(song.url);
      
      if (!youtubeId || !validateYouTubeId(youtubeId)) {
        toast.error("ID de vídeo inválido");
        return;
      }
      
      if (currentYoutubeId === youtubeId && youtubeIframeVisible) {
        // Toggle off current YouTube video
        setYoutubeIframeVisible(false);
        if (youtubeIframeRef.current) {
          youtubeIframeRef.current.src = "";
        }
        setCurrentYoutubeId(null);
        onMusicSelect(null);
      } else {
        // Show new YouTube video
        setYoutubeIframeVisible(true);
        setCurrentYoutubeId(youtubeId);
        
        if (youtubeIframeRef.current) {
          youtubeIframeRef.current.src = `${YOUTUBE_EMBED_API_BASE}${youtubeId}?autoplay=1`;
        }
        
        // Use a fallback tone since we can't directly integrate with onPlay
        generateFallbackTone(300, 440);
        toast.success(`Tocando: ${song.title}`);
      }
    } else {
      // Handle regular audio file
      onMusicSelect(song.id);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Music className="h-5 w-5 mr-2" />
          Playlist Musical
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* YouTube iframe container */}
        {youtubeIframeVisible && (
          <div className="relative w-full pt-[56.25%] mb-4">
            <iframe
              ref={youtubeIframeRef}
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}
        
        {/* Search bar */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Buscar ou colar URL do YouTube"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pr-8"
            />
            {searchQuery && (
              <button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={clearSearch}
              >
                <X size={16} />
              </button>
            )}
          </div>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={handleSearch}
            disabled={isSearching}
          >
            <Search size={16} className="mr-1" />
            {isSearching ? "Buscando..." : "Buscar"}
          </Button>
        </div>
        
        {/* Results or library */}
        <ScrollArea className="h-[300px] rounded-md">
          <div className="space-y-2">
            {displaySongs.map((song) => (
              <div 
                key={song.id} 
                className={`p-3 border rounded-md hover:bg-gray-50 transition-colors cursor-pointer ${
                  song.source === "youtube" ? "bg-gray-50" : ""
                }`}
                onClick={() => handleSongClick(song)}
              >
                <div className="flex items-center space-x-3">
                  {song.thumbnail && (
                    <div className="flex-shrink-0">
                      <img 
                        src={song.thumbnail} 
                        alt={song.title}
                        className="w-12 h-12 rounded object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-sm truncate">{song.title}</h4>
                        <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 flex-shrink-0"
                      >
                        {currentMusic === song.id && song.source !== "youtube" ? 
                          <Pause size={16} /> : 
                          <Play size={16} />
                        }
                      </Button>
                    </div>
                  </div>
                </div>
                
                {song.source === "youtube" && (
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                      YouTube
                    </span>
                  </div>
                )}
              </div>
            ))}
            
            <div className="p-3 mt-4 border-t pt-4">
              <p className="text-xs text-muted-foreground text-center">
                {searchResults.length > 0 
                  ? `${searchResults.length} resultado(s) encontrado(s)` 
                  : "Pesquise por música no YouTube para começar"}
              </p>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default MusicPlaylist;
