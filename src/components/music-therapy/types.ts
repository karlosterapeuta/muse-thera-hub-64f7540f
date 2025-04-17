
export interface Song {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  thumbnailUrl?: string;
  source?: 'youtube' | 'local' | 'jamendo';
  isFavorite?: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  songs: Song[];
}
