
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Pause, Music } from "lucide-react";
import { toast } from "sonner";

// Define song type
export type Song = {
  id: string;
  title: string;
  artist: string;
  url: string;
};

// Use local mp3 files or reliable CDN URLs instead of freemusicarchive.org
export const songLibrary: Song[] = [
  {
    id: "1",
    title: "Atirei o Pau no Gato",
    artist: "Música Infantil",
    url: "/assets/music/children-song-1.mp3" // Changed to use local file path
  },
  {
    id: "2",
    title: "Ciranda Cirandinha",
    artist: "Música Infantil",
    url: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1ebd.mp3" // Using a reliable CDN URL
  },
  {
    id: "3",
    title: "O Sapo não Lava o Pé",
    artist: "Música Infantil",
    url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3" // Using a reliable CDN URL
  },
  {
    id: "4",
    title: "Melodia Calma 1",
    artist: "Musicoterapia",
    url: "https://cdn.pixabay.com/download/audio/2021/11/25/audio_cb79f1f56a.mp3" // Using a reliable CDN URL
  },
  {
    id: "5",
    title: "Sons da Natureza",
    artist: "Ambiente",
    url: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_95db69eedc.mp3" // Using a reliable CDN URL
  }
];

interface MusicPlaylistProps {
  onPlay: (url: string) => void;
  onPause: () => void;
  currentSong: Song | null;
  isPlaying: boolean;
}

export function MusicPlaylist({ onPlay, onPause, currentSong, isPlaying }: MusicPlaylistProps) {
  const [expandedSongId, setExpandedSongId] = useState<string | null>(null);
  
  const handleSongClick = (song: Song) => {
    if (currentSong?.id === song.id) {
      if (isPlaying) {
        onPause();
      } else {
        onPlay(song.url);
      }
    } else {
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
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
