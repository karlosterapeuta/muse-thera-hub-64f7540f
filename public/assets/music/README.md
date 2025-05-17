
# Music Files for Musicogram

This directory contains local music files used by the musicogram feature.

## Important Note
We've updated the application to use reliable CDN-hosted audio files from SoundHelix, which should work in all modern browsers.

## Troubleshooting Audio Playback

If you encounter audio playback issues:

1. Ensure your browser allows audio playback on the site
2. Check that your system audio is working properly
3. Try a different browser if issues persist

## Using Local Files
If you want to use local audio files, place MP3 files in this directory and update the URLs in the `songLibrary` array in `src/pages/musicogram/components/MusicPlaylist.tsx`.

Example local files:
- children-song-1.mp3
- ciranda-cirandinha.mp3

## Audio File Format
For best compatibility across browsers:
- Use MP3 format files
- Keep file sizes reasonable (under 5MB if possible)
- Use 128-192 kbps bitrate for good quality/size balance

## CDN Alternatives
If you need alternative CDN sources, these generally work well:
- SoundHelix (https://www.soundhelix.com/audio-examples)
- GitHub raw content (if you host files in a public repo)
- Firebase Storage (with public read access)

**Important:** Make sure all audio files are properly licensed for your use case.

