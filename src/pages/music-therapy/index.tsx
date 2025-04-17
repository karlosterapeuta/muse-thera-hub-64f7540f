
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import MusicPlayer from "@/components/music-therapy/MusicPlayer";
import PlaylistManager from "@/components/music-therapy/PlaylistManager";
import SongLibrary from "@/components/music-therapy/SongLibrary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Song, Playlist } from "@/components/music-therapy/types";
import { searchYouTube } from "@/utils/youtubeUtils";

export default function MusicTherapyPage() {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([
    { id: "favorite", name: "⭐ Favoritos", songs: [] },
    { id: "relaxing", name: "😌 Relaxamento", songs: [] },
    { id: "movement", name: "🏃 Movimento", songs: [] },
    { id: "speech", name: "🗣️ Hora da Fala", songs: [] },
  ]);
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'playlists' | 'library' | 'search'>('playlists');
  
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Load saved playlists from localStorage on component mount
  useEffect(() => {
    const savedPlaylists = localStorage.getItem('musicTherapyPlaylists');
    if (savedPlaylists) {
      try {
        const parsedPlaylists = JSON.parse(savedPlaylists);
        setPlaylists(parsedPlaylists);
      } catch (error) {
        console.error('Error parsing saved playlists:', error);
      }
    }
  }, []);

  // Save playlists to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('musicTherapyPlaylists', JSON.stringify(playlists));
  }, [playlists]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    try {
      const results = await searchYouTube(searchTerm);
      
      const formattedResults: Song[] = results.map(result => ({
        id: result.id,
        title: result.title,
        artist: result.artist,
        audioUrl: result.audioUrl,
        thumbnailUrl: result.thumbnailUrl,
        source: 'youtube',
        isFavorite: false
      }));
      
      setSearchResults(formattedResults);
      setActiveTab('search');
    } catch (error) {
      console.error('Error searching for songs:', error);
      toast({
        title: "Erro na busca",
        description: "Não foi possível buscar músicas. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addSongToPlaylist = (playlistId: string, song: Song) => {
    setPlaylists(prevPlaylists => 
      prevPlaylists.map(playlist => 
        playlist.id === playlistId
          ? { 
              ...playlist, 
              songs: playlist.songs.some(s => s.id === song.id) 
                ? playlist.songs 
                : [...playlist.songs, song] 
            }
          : playlist
      )
    );
    
    toast({
      title: "Música adicionada",
      description: `"${song.title}" foi adicionada à playlist`,
      variant: "default"
    });
  };

  const removeSongFromPlaylist = (playlistId: string, songId: string) => {
    setPlaylists(prevPlaylists => 
      prevPlaylists.map(playlist => 
        playlist.id === playlistId
          ? { ...playlist, songs: playlist.songs.filter(song => song.id !== songId) }
          : playlist
      )
    );
  };

  const createPlaylist = (name: string) => {
    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}`,
      name,
      songs: []
    };
    
    setPlaylists(prev => [...prev, newPlaylist]);
    setActivePlaylist(newPlaylist);
    
    toast({
      title: "Playlist criada",
      description: `A playlist "${name}" foi criada com sucesso`,
      variant: "default"
    });
  };

  const deletePlaylist = (playlistId: string) => {
    // Don't allow deleting the default playlists
    if (['favorite', 'relaxing', 'movement', 'speech'].includes(playlistId)) {
      toast({
        title: "Ação não permitida",
        description: "As playlists padrão não podem ser excluídas",
        variant: "destructive"
      });
      return;
    }
    
    setPlaylists(prev => prev.filter(playlist => playlist.id !== playlistId));
    
    if (activePlaylist?.id === playlistId) {
      setActivePlaylist(null);
    }
    
    toast({
      title: "Playlist removida",
      description: "A playlist foi removida com sucesso",
      variant: "default"
    });
  };

  const toggleFavorite = (song: Song) => {
    // Update the song in all playlists
    const updatedSong = { ...song, isFavorite: !song.isFavorite };
    
    // Update in all playlists
    setPlaylists(prevPlaylists => 
      prevPlaylists.map(playlist => ({
        ...playlist,
        songs: playlist.songs.map(s => 
          s.id === song.id ? updatedSong : s
        )
      }))
    );
    
    // Add or remove from favorites playlist
    if (!song.isFavorite) {
      // Add to favorites if not already there
      addSongToPlaylist('favorite', updatedSong);
    } else {
      // Remove from favorites
      removeSongFromPlaylist('favorite', song.id);
    }
    
    // Update current song if it's the one being favorited/unfavorited
    if (currentSong?.id === song.id) {
      setCurrentSong(updatedSong);
    }
    
    // Update search results if necessary
    setSearchResults(prev => 
      prev.map(s => s.id === song.id ? updatedSong : s)
    );
  };

  const playSong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  return (
    <div className="container mx-auto py-6">
      <Card className="bg-gradient-to-b from-blue-50 to-purple-50 border-2 border-purple-200 shadow-xl overflow-hidden rounded-xl">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row min-h-[80vh]">
            <div className="w-full md:w-1/2 p-4">
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'playlists' | 'library' | 'search')}>
                <TabsList className="grid w-full grid-cols-3 bg-blue-100 p-1 rounded-full mb-4">
                  <TabsTrigger 
                    value="playlists" 
                    className="rounded-full data-[state=active]:bg-purple-500 data-[state=active]:text-white"
                  >
                    Playlists
                  </TabsTrigger>
                  <TabsTrigger 
                    value="library" 
                    className="rounded-full data-[state=active]:bg-purple-500 data-[state=active]:text-white"
                  >
                    Biblioteca
                  </TabsTrigger>
                  <TabsTrigger 
                    value="search" 
                    className="rounded-full data-[state=active]:bg-purple-500 data-[state=active]:text-white"
                  >
                    Buscar
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="playlists">
                  <PlaylistManager 
                    playlists={playlists}
                    activePlaylist={activePlaylist}
                    setActivePlaylist={setActivePlaylist}
                    createPlaylist={createPlaylist}
                    deletePlaylist={deletePlaylist}
                    playSong={playSong}
                    currentSong={currentSong}
                    isPlaying={isPlaying}
                    removeSongFromPlaylist={removeSongFromPlaylist}
                    toggleFavorite={toggleFavorite}
                  />
                </TabsContent>
                
                <TabsContent value="library">
                  <SongLibrary 
                    playlists={playlists}
                    addSongToPlaylist={addSongToPlaylist}
                    playSong={playSong}
                    currentSong={currentSong}
                    isPlaying={isPlaying}
                    toggleFavorite={toggleFavorite}
                  />
                </TabsContent>
                
                <TabsContent value="search">
                  <SongLibrary 
                    playlists={playlists}
                    addSongToPlaylist={addSongToPlaylist}
                    playSong={playSong}
                    currentSong={currentSong}
                    isPlaying={isPlaying}
                    toggleFavorite={toggleFavorite}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onSearch={handleSearch}
                    searchResults={searchResults}
                    isLoading={isLoading}
                  />
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="w-full md:w-1/2 bg-gradient-to-b from-indigo-50 to-pink-50 p-6 border-t md:border-t-0 md:border-l border-purple-200">
              <MusicPlayer 
                currentSong={currentSong}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                playlists={playlists}
                addSongToPlaylist={addSongToPlaylist}
                toggleFavorite={toggleFavorite}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
