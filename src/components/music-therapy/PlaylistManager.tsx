
import { useState } from "react";
import { 
  Plus, Trash2, MusicIcon, Play, Pause, Heart, MoreHorizontal 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { Song, Playlist } from "./types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

interface PlaylistManagerProps {
  playlists: Playlist[];
  activePlaylist: Playlist | null;
  setActivePlaylist: (playlist: Playlist | null) => void;
  createPlaylist: (name: string) => void;
  deletePlaylist: (playlistId: string) => void;
  playSong: (song: Song) => void;
  currentSong: Song | null;
  isPlaying: boolean;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;
  toggleFavorite: (song: Song) => void;
}

export default function PlaylistManager({
  playlists, 
  activePlaylist, 
  setActivePlaylist,
  createPlaylist,
  deletePlaylist,
  playSong,
  currentSong,
  isPlaying,
  removeSongFromPlaylist,
  toggleFavorite
}: PlaylistManagerProps) {
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const isMobile = useIsMobile();
  
  const handleCreatePlaylist = () => {
    if (!newPlaylistName.trim()) return;
    
    createPlaylist(newPlaylistName);
    setNewPlaylistName("");
  };
  
  const renderPlaylistContent = () => {
    if (!activePlaylist) {
      return (
        <div className="text-center p-8">
          <MusicIcon size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">Nenhuma playlist selecionada</h3>
          <p className="text-gray-500">Selecione uma playlist para ver suas músicas</p>
        </div>
      );
    }
    
    if (activePlaylist.songs.length === 0) {
      return (
        <div className="text-center p-8">
          <MusicIcon size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">Playlist vazia</h3>
          <p className="text-gray-500">Esta playlist não possui músicas</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-1">
        {activePlaylist.songs.map((song) => (
          <div 
            key={song.id} 
            className={`p-3 hover:bg-purple-50 transition-colors rounded-md flex justify-between items-center group ${
              currentSong?.id === song.id ? "bg-purple-50" : ""
            }`}
            aria-label={`Música: ${song.title} por ${song.artist}`}
          >
            <div className="flex items-center flex-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-full text-gray-500 hover:text-purple-600 hover:bg-purple-100 mr-2"
                      onClick={() => playSong(song)}
                      aria-label={`${currentSong?.id === song.id && isPlaying ? "Pausar" : "Reproduzir"} ${song.title}`}
                    >
                      {currentSong?.id === song.id && isPlaying ? (
                        <Pause size={20} />
                      ) : (
                        <Play size={20} className="ml-0.5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {currentSong?.id === song.id && isPlaying ? "Pausar" : "Reproduzir"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate text-gray-900">
                  {song.title}
                </div>
                <div className="text-sm text-gray-500 truncate">
                  {song.artist}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 ${song.isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-gray-700'}`}
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
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-700"
                          aria-label="Mais opções"
                        >
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      Opções
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={() => removeSongFromPlaylist(activePlaylist.id, song.id)}
                    className="text-red-500 focus:text-red-500"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remover da playlist
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 flex">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-purple-500 hover:bg-purple-600 text-white">
              <Plus className="mr-2 h-4 w-4" /> Nova Playlist
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Playlist</DialogTitle>
              <DialogDescription>
                Dê um nome para sua nova playlist de musicoterapia.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Input
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Nome da playlist"
                className="mb-2"
              />
            </div>
            <DialogFooter>
              <Button onClick={handleCreatePlaylist} disabled={!newPlaylistName.trim()}>
                Criar Playlist
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {playlists.slice(0, 4).map((playlist) => (
          <Button
            key={playlist.id}
            variant="outline"
            className={`h-20 justify-start px-4 py-6 text-lg ${
              activePlaylist?.id === playlist.id 
                ? "border-purple-500 bg-purple-50 text-purple-700" 
                : "border-gray-200 hover:border-purple-300 hover:bg-purple-50"
            }`}
            onClick={() => setActivePlaylist(playlist)}
          >
            <div className="flex flex-col items-start">
              <span className="text-xl mb-1">{playlist.name.split(' ')[0]}</span>
              <span className="text-sm text-gray-500">{playlist.songs.length} músicas</span>
            </div>
          </Button>
        ))}
      </div>
      
      <div className="flex mb-4">
        <ScrollArea className="h-16 w-full flex whitespace-nowrap p-1">
          <div className="flex space-x-2">
            {playlists.slice(4).map((playlist) => (
              <Button
                key={playlist.id}
                variant="outline"
                className={`h-12 px-4 flex-shrink-0 ${
                  activePlaylist?.id === playlist.id 
                    ? "border-purple-500 bg-purple-50 text-purple-700" 
                    : "border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                }`}
                onClick={() => setActivePlaylist(playlist)}
              >
                <div className="flex items-center">
                  <span>{playlist.name}</span>
                  {activePlaylist?.id !== playlist.id && playlist.id !== "favorite" && 
                   playlist.id !== "relaxing" && playlist.id !== "movement" && playlist.id !== "speech" && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-full ml-2 text-gray-400 hover:text-red-500 hover:bg-red-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              deletePlaylist(playlist.id);
                            }}
                            aria-label={`Excluir playlist ${playlist.name}`}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          Excluir playlist
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
      
      <div className="flex-1 bg-white rounded-lg p-4 shadow-sm overflow-hidden">
        {activePlaylist && (
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-purple-700">{activePlaylist.name}</h2>
            {activePlaylist.songs.length > 0 && (
              <span className="text-sm text-gray-500">{activePlaylist.songs.length} músicas</span>
            )}
          </div>
        )}
        
        <ScrollArea className={`${isMobile ? 'h-[300px]' : 'h-[calc(100vh-520px)]'} pr-4`}>
          {renderPlaylistContent()}
        </ScrollArea>
      </div>
    </div>
  );
}
