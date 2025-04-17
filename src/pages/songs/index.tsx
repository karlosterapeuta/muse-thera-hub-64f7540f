
import { useState } from "react";
import MusicPlayer from "@/components/music-therapy/MusicPlayer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Song, Playlist } from "@/components/music-therapy/types";

export default function SongsPage() {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([
    {
      id: 'library',
      name: 'Biblioteca',
      songs: [],
      createdAt: new Date()
    },
    {
      id: 'favorites',
      name: 'Favoritos',
      songs: [],
      createdAt: new Date()
    }
  ]);

  const addSongToPlaylist = (playlistId: string, song: Song) => {
    setPlaylists(playlists.map(playlist => {
      if (playlist.id === playlistId && !playlist.songs.find(s => s.id === song.id)) {
        return { ...playlist, songs: [...playlist.songs, song] };
      }
      return playlist;
    }));
  };

  const toggleFavorite = (song: Song) => {
    const updatedSong = { ...song, isFavorite: !song.isFavorite };
    
    // Update the song in all playlists
    setPlaylists(playlists.map(playlist => ({
      ...playlist,
      songs: playlist.songs.map(s => s.id === song.id ? updatedSong : s)
    })));

    // If favoriting, add to favorites playlist
    if (!song.isFavorite) {
      addSongToPlaylist('favorites', updatedSong);
    } else {
      // If unfavoriting, remove from favorites playlist
      setPlaylists(playlists.map(playlist => {
        if (playlist.id === 'favorites') {
          return {
            ...playlist,
            songs: playlist.songs.filter(s => s.id !== song.id)
          };
        }
        return playlist;
      }));
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-4xl mb-2 text-purple-700">
            Músicas para Musicoterapia
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <MusicPlayer
            currentSong={currentSong}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            playlists={playlists}
            addSongToPlaylist={addSongToPlaylist}
            toggleFavorite={toggleFavorite}
          />
        </CardContent>
      </Card>
    </div>
  );
}
