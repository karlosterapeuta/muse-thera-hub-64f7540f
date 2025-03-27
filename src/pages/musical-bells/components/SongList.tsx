
import React from "react";
import { Song } from "../data/songs-data";

interface SongListProps {
  songs: Song[];
  selectedSong: Song | null;
  isPlaying: boolean;
  onSelectSong: (song: Song) => void;
}

const SongList: React.FC<SongListProps> = ({
  songs,
  selectedSong,
  isPlaying,
  onSelectSong,
}) => {
  return (
    <div className="h-[300px] overflow-y-auto pr-2 border rounded-md p-2">
      {songs.map((song, index) => (
        <div
          key={index}
          className={`p-2 mb-1 rounded-md cursor-pointer hover:bg-secondary/50 ${
            selectedSong?.title === song.title ? "bg-secondary" : ""
          }`}
          onClick={() => onSelectSong(song)}
        >
          {song.title}
        </div>
      ))}
    </div>
  );
};

export default SongList;
