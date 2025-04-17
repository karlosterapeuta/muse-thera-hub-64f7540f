
export interface Song {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  thumbnailUrl?: string;
  source: 'local' | 'jamendo' | 'freemusicarchive';
  isFavorite: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  songs: Song[];
  createdAt: Date;
}
