
# Music Files for Musicogram

This directory contains local music files used by the musicogram feature.

## Important Note
We've updated the application to use CDN-hosted audio files by default, which are more reliable in most environments. However, you can still use local files if needed.

## Using Local Files
If you want to use local audio files, place them in this directory and update the URLs in the `songLibrary` array in `src/pages/musicogram/components/MusicPlaylist.tsx`.

Example local files:
- children-song-1.mp3 (for "Atirei o Pau no Gato")
- ciranda-cirandinha.mp3 (for "Ciranda Cirandinha")

## Audio File Format
For best compatibility across browsers:
- Use MP3 format files
- Keep file sizes reasonable (under 5MB if possible)
- Use 128-192 kbps bitrate for good quality/size balance

**Important:** Make sure these audio files are properly licensed for use in your application.
