
import { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Pause, Music, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { generateFallbackTone } from "@/utils/audioUtils";

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
  onPlay: (url: string) => void;
  onPause: () => void;
  currentSong: Song | null;
  isPlaying: boolean;
}

export function MusicPlaylist({ onPlay, onPause, currentSong, isPlaying }: MusicPlaylistProps) {
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
  
  // Parse YouTube video ID from various YouTube URL formats
  const getYouTubeId = (url: string): string | null => {
    // Check if it's already an ID (no slashes or dots)
    if (!/[\/\.]/.test(url) && url.length >= 11) {
      return url;
    }
    
    // Try to extract ID from URL
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Handle search submission
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.error("Digite algo para pesquisar");
      return;
    }
    
    setIsSearching(true);
    
    const youtubeId = getYouTubeId(searchQuery);
    if (youtubeId) {
      // If the input is a YouTube URL or ID
      const newSong: Song = {
        id: `youtube-${youtubeId}`,
        title: `Vídeo do YouTube ${youtubeId}`,
        artist: "YouTube",
        url: `https://www.youtube.com/watch?v=${youtubeId}`,
        thumbnail: `https://img.youtube.com/vi/${youtubeId}/0.jpg`,
        source: "youtube"
      };
      
      setSearchResults([newSong]);
      setDisplaySongs([...songLibrary, newSong]);
      setIsSearching(false);
      toast.success("Vídeo do YouTube encontrado!");
      return;
    }
    
    // Simulate searching for music based on the query
    // In a real app, this would use a YouTube API call
    setTimeout(() => {
      const mockResults: Song[] = [
        {
          id: `yt-${Date.now()}-1`,
          title: `${searchQuery} - Música Infantil`,
          artist: "YouTube Kids",
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder URL
          thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg",
          source: "youtube"
        },
        {
          id: `yt-${Date.now()}-2`,
          title: `${searchQuery} - Canção Educativa`,
          artist: "Música Educativa",
          url: "https://www.youtube.com/watch?v=_bP6aVG6L1w", // Placeholder URL
          thumbnail: "https://img.youtube.com/vi/_bP6aVG6L1w/0.jpg",
          source: "youtube"
        }
      ];
      
      setSearchResults(mockResults);
      setDisplaySongs([...songLibrary, ...mockResults]);
      setIsSearching(false);
      toast.success("Músicas encontradas!");
    }, 1000);
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
      
      if (!youtubeId) {
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
        onPause();
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
      if (currentSong?.id === song.id) {
        if (isPlaying) {
          onPause();
        } else {
          onPlay(song.url);
        }
      } else {
        onPlay(song.url);
      }
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
                        {currentSong?.id === song.id && isPlaying && song.source !== "youtube" ? 
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
