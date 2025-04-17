
import { useState } from "react";
import { Search, Play, Pause, Heart, Plus, Music, Youtube } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { Song, Playlist } from "./types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

interface SongLibraryProps {
  playlists: Playlist[];
  addSongToPlaylist: (playlistId: string, song: Song) => void;
  playSong: (song: Song) => void;
  currentSong: Song | null;
  isPlaying: boolean;
  toggleFavorite: (song: Song) => void;
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
  onSearch?: () => void;
  searchResults?: Song[];
  isLoading?: boolean;
}

// Default library songs
const librarySongs: Song[] = [
  {
    id: "lib-1",
    title: "Canção de Ninar",
    artist: "Musicoterapia Infantil",
    audioUrl: "https://assets.mixkit.co/music/preview/mixkit-sweet-and-sour-keys-846.mp3",
    thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/default.jpg",
    isFavorite: false
  },
  {
    id: "lib-2",
    title: "Ciranda Cirandinha",
    artist: "Cantigas Populares",
    audioUrl: "https://assets.mixkit.co/music/preview/mixkit-piano-reflections-22.mp3",
    thumbnailUrl: "https://img.youtube.com/vi/RcQn5BZGE8A/default.jpg",
    isFavorite: false
  },
  {
    id: "lib-3",
    title: "O Sapo não Lava o Pé",
    artist: "Músicas da Infância",
    audioUrl: "https://assets.mixkit.co/music/preview/mixkit-life-is-a-dream-837.mp3",
    thumbnailUrl: "https://img.youtube.com/vi/VZGN4hI7T9E/default.jpg",
    isFavorite: false
  },
  {
    id: "lib-4",
    title: "Sons da Natureza: Floresta",
    artist: "Terapia Sonora",
    audioUrl: "https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3",
    isFavorite: false
  },
  {
    id: "lib-5",
    title: "Baleia - Sons Aquáticos",
    artist: "Relaxamento Infantil",
    audioUrl: "https://assets.mixkit.co/music/preview/mixkit-just-kidding-13.mp3",
    isFavorite: false
  },
  {
    id: "lib-6",
    title: "Pássaros Cantando",
    artist: "Natureza Viva",
    audioUrl: "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3",
    isFavorite: false
  },
  {
    id: "lib-7",
    title: "Piano Suave",
    artist: "Música Terapêutica",
    audioUrl: "https://assets.mixkit.co/music/preview/mixkit-sun-and-his-daughter-580.mp3",
    isFavorite: false
  },
  {
    id: "lib-8",
    title: "Atirei o Pau no Gato",
    artist: "Cantigas de Roda",
    audioUrl: "https://assets.mixkit.co/music/preview/mixkit-piano-in-the-forest-548.mp3",
    thumbnailUrl: "https://img.youtube.com/vi/3BEkK67Cu7c/default.jpg",
    isFavorite: false
  }
];

export default function SongLibrary({
  playlists,
  addSongToPlaylist,
  playSong,
  currentSong,
  isPlaying,
  toggleFavorite,
  searchTerm = "",
  setSearchTerm,
  onSearch,
  searchResults = [],
  isLoading = false
}: SongLibraryProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [filteredSongs, setFilteredSongs] = useState<Song[]>(librarySongs);
  
  const isMobile = useIsMobile();
  
  // Handle local filtering for the library tab
  const handleLocalSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setLocalSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredSongs(librarySongs);
      return;
    }
    
    const filtered = librarySongs.filter(
      song => song.title.toLowerCase().includes(term.toLowerCase()) || 
              song.artist.toLowerCase().includes(term.toLowerCase())
    );
    
    setFilteredSongs(filtered);
  };

  // For the search tab (YouTube search)
  const handleYouTubeSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch();
  };
  
  const renderSongList = () => {
    const songs = searchResults.length > 0 ? searchResults : filteredSongs;
    
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center p-8">
          <div className="animate-spin h-10 w-10 border-4 border-purple-500 border-opacity-50 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-600">Buscando músicas...</p>
        </div>
      );
    }
    
    if (songs.length === 0) {
      return (
        <div className="text-center p-8">
          <Music size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">Nenhuma música encontrada</h3>
          <p className="text-gray-500">Tente outra busca ou explore a biblioteca</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {songs.map((song) => (
          <div
            key={song.id}
            className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            aria-label={`Música: ${song.title} por ${song.artist}`}
          >
            <div className="flex p-3">
              <div className="flex-shrink-0 mr-3">
                {song.thumbnailUrl ? (
                  <img
                    src={song.thumbnailUrl}
                    alt={song.title}
                    className="w-16 h-16 rounded-md object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-md flex items-center justify-center">
                    <Music size={24} className="text-white" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center">
                  <h3 className="font-medium text-gray-900 truncate flex-1">
                    {song.title}
                  </h3>
                  {song.source === 'youtube' && (
                    <Youtube size={16} className="text-red-500 ml-1" />
                  )}
                </div>
                <p className="text-sm text-gray-500 truncate mb-2">{song.artist}</p>
                
                <div className="flex items-center space-x-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full text-gray-500 hover:text-purple-600 hover:bg-purple-100"
                          onClick={() => playSong(song)}
                          aria-label={`${currentSong?.id === song.id && isPlaying ? "Pausar" : "Reproduzir"} ${song.title}`}
                        >
                          {currentSong?.id === song.id && isPlaying ? (
                            <Pause size={16} />
                          ) : (
                            <Play size={16} className="ml-0.5" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {currentSong?.id === song.id && isPlaying ? "Pausar" : "Reproduzir"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-8 w-8 rounded-full ${song.isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-gray-700'}`}
                          onClick={() => toggleFavorite(song)}
                          aria-label={song.isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                        >
                          <Heart fill={song.isFavorite ? "currentColor" : "none"} size={16} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {song.isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full text-gray-400 hover:text-gray-700"
                        aria-label="Adicionar à playlist"
                      >
                        <Plus size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Adicionar à playlist</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        {playlists.map((playlist) => (
                          <DropdownMenuItem
                            key={playlist.id}
                            onClick={() => addSongToPlaylist(playlist.id, song)}
                          >
                            {playlist.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="flex flex-col h-full">
      {setSearchTerm && onSearch ? (
        <form onSubmit={handleYouTubeSearch} className="mb-4">
          <div className="relative flex items-center">
            <Search size={20} className="absolute left-3 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar músicas no YouTube..."
              className="pl-10 py-6 rounded-full bg-white border-gray-200 focus:border-purple-300 focus:ring-purple-300"
            />
            <Button 
              type="submit" 
              className="absolute right-1 rounded-full bg-purple-500 hover:bg-purple-600 text-white"
              disabled={isLoading || !searchTerm.trim()}
            >
              Buscar
            </Button>
          </div>
        </form>
      ) : (
        <div className="relative mb-4">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            value={localSearchTerm}
            onChange={handleLocalSearch}
            placeholder="Filtrar músicas na biblioteca..."
            className="pl-10 py-6 rounded-full bg-white border-gray-200 focus:border-purple-300 focus:ring-purple-300"
          />
        </div>
      )}
      
      <ScrollArea className={`${isMobile ? 'h-[400px]' : 'h-[calc(100vh-250px)]'} pr-4`}>
        {renderSongList()}
      </ScrollArea>
    </div>
  );
}
