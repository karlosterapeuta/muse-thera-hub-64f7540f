
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Pause, Music, Volume2 } from "lucide-react";
import { toast } from "sonner";

// Define song type
export type Song = {
  id: string;
  title: string;
  artist: string;
  url: string;
};

// Use more reliable CDN URLs for audio files
export const songLibrary: Song[] = [
  {
    id: "1",
    title: "Atirei o Pau no Gato",
    artist: "Música Infantil",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" // Changed to even more reliable CDN URL
  },
  {
    id: "2",
    title: "Ciranda Cirandinha",
    artist: "Música Infantil",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: "3",
    title: "O Sapo não Lava o Pé",
    artist: "Música Infantil",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  },
  {
    id: "4",
    title: "Melodia Calma 1",
    artist: "Musicoterapia",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  },
  {
    id: "5",
    title: "Sons da Natureza",
    artist: "Ambiente",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
  }
];

// Backup URL if all else fails
const ULTIMATE_FALLBACK_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3";

interface MusicPlaylistProps {
  onPlay: (url: string) => void;
  onPause: () => void;
  currentSong: Song | null;
  isPlaying: boolean;
}

export function MusicPlaylist({ onPlay, onPause, currentSong, isPlaying }: MusicPlaylistProps) {
  const [expandedSongId, setExpandedSongId] = useState<string | null>(null);
  const [audioTestElement, setAudioTestElement] = useState<HTMLAudioElement | null>(null);
  
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
  
  // Function to verify if an audio URL is playable
  const verifyAudioUrl = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!audioTestElement) {
        resolve(false);
        return;
      }
      
      // Set timeout to prevent hanging too long
      const timeoutId = setTimeout(() => {
        resolve(false);
      }, 3000);
      
      // Set up event handlers
      const handleCanPlay = () => {
        clearTimeout(timeoutId);
        cleanup();
        resolve(true);
      };
      
      const handleError = () => {
        clearTimeout(timeoutId);
        cleanup();
        resolve(false);
      };
      
      // Clean up function
      const cleanup = () => {
        audioTestElement.removeEventListener('canplaythrough', handleCanPlay);
        audioTestElement.removeEventListener('error', handleError);
      };
      
      // Add event listeners
      audioTestElement.addEventListener('canplaythrough', handleCanPlay);
      audioTestElement.addEventListener('error', handleError);
      
      // Set source and load
      audioTestElement.src = url;
      audioTestElement.load();
    });
  };
  
  const handleSongClick = async (song: Song) => {
    if (currentSong?.id === song.id) {
      if (isPlaying) {
        onPause();
      } else {
        onPlay(song.url);
      }
    } else {
      // Try to play the song directly
      onPlay(song.url);
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
      <CardContent>
        <ScrollArea className="h-[300px] rounded-md">
          <div className="space-y-2">
            {songLibrary.map((song) => (
              <div 
                key={song.id} 
                className="p-3 border rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{song.title}</h4>
                    <p className="text-xs text-muted-foreground">{song.artist}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleSongClick(song)}
                    className="h-8 w-8"
                  >
                    {currentSong?.id === song.id && isPlaying ? 
                      <Pause size={16} /> : 
                      <Play size={16} />
                    }
                  </Button>
                </div>
              </div>
            ))}
            <div className="p-3 mt-4 border-t pt-4">
              <p className="text-xs text-muted-foreground text-center">
                Músicas para musicoterapia e estimulação auditiva
              </p>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
