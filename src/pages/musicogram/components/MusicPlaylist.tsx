
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Music
} from "lucide-react";
import { playNoteSound, stopAllAudio } from "@/utils/audioUtils";

interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: string; // mm:ss format
}

interface MusicPlaylistProps {
  onPlay: (songUrl: string) => void;
  onPause: () => void;
  currentSong: Song | null;
  isPlaying: boolean;
}

// Lista de músicas pré-definidas para o musicograma
const songLibrary: Song[] = [
  {
    id: "song-1",
    title: "Canção da Natureza",
    artist: "Músicas Infantis",
    url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/WFMU/Broke_For_Free/Directionless_EP/Broke_For_Free_-_01_-_Night_Owl.mp3",
    duration: "1:23"
  },
  {
    id: "song-2",
    title: "Canção dos Bichinhos",
    artist: "Músicas Infantis",
    url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Tours/Enthusiast/Tours_-_01_-_Enthusiast.mp3",
    duration: "1:12"
  },
  {
    id: "song-3",
    title: "Dança das Borboletas",
    artist: "Músicas Infantis",
    url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Shipping_Lanes.mp3",
    duration: "1:52"
  },
  {
    id: "song-4",
    title: "Tambores da Selva",
    artist: "Sons da Natureza",
    url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Torres/Torres/Torres_-_01_-_Del_campo_al_humo.mp3",
    duration: "1:30"
  },
  {
    id: "song-5",
    title: "Mar Calmo",
    artist: "Sons da Natureza",
    url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Kai_Engel/Satin/Kai_Engel_-_07_-_Heimat.mp3",
    duration: "1:23"
  }
];

export const MusicPlaylist = ({ 
  onPlay, 
  onPause, 
  currentSong, 
  isPlaying 
}: MusicPlaylistProps) => {
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  const handleSelectSong = (song: Song) => {
    setSelectedSong(song);
    // Tocar um som de seleção
    playNoteSound("C");
  };

  const handlePlaySong = (song: Song) => {
    onPlay(song.url);
    setSelectedSong(song);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Music size={18} />
          Playlist Musical
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const currentIndex = songLibrary.findIndex(s => s.id === currentSong?.id);
                if (currentIndex > 0) {
                  handlePlaySong(songLibrary[currentIndex - 1]);
                }
              }}
              disabled={!currentSong || songLibrary.findIndex(s => s.id === currentSong?.id) === 0}
            >
              <SkipBack size={16} />
            </Button>
            
            <Button
              variant={isPlaying ? "outline" : "default"}
              className="h-10 w-10 rounded-full p-0"
              onClick={() => isPlaying ? onPause() : currentSong ? onPlay(currentSong.url) : null}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const currentIndex = songLibrary.findIndex(s => s.id === currentSong?.id);
                if (currentIndex < songLibrary.length - 1) {
                  handlePlaySong(songLibrary[currentIndex + 1]);
                }
              }}
              disabled={!currentSong || songLibrary.findIndex(s => s.id === currentSong?.id) === songLibrary.length - 1}
            >
              <SkipForward size={16} />
            </Button>
          </div>
          
          <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
            {songLibrary.map((song) => (
              <div
                key={song.id}
                className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                  currentSong?.id === song.id
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted"
                }`}
                onClick={() => handleSelectSong(song)}
                onDoubleClick={() => handlePlaySong(song)}
              >
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={(e) => {
                      e.stopPropagation();
                      song.id === currentSong?.id && isPlaying 
                        ? onPause() 
                        : handlePlaySong(song);
                    }}
                  >
                    {song.id === currentSong?.id && isPlaying ? (
                      <Pause size={14} />
                    ) : (
                      <Play size={14} />
                    )}
                  </Button>
                  <div>
                    <div className="text-sm font-medium">{song.title}</div>
                    <div className="text-xs text-muted-foreground">{song.artist}</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">{song.duration}</div>
              </div>
            ))}
          </div>
          
          {selectedSong && (
            <div className="pt-2 border-t border-border">
              <p className="text-sm font-medium">Selecionado:</p>
              <p className="text-sm">{selectedSong.title} - {selectedSong.artist}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export { type Song, songLibrary };
