
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, Volume2, Music, Clock, Zap } from 'lucide-react';
import { TraditionalSong, getSongsByDifficulty } from '../data/traditionalSongs';
import { guitarHeroAudio } from '../utils/guitarHeroAudio';

interface MusicSelectorProps {
  selectedDifficulty: 'easy' | 'medium' | 'hard';
  onSelectSong: (song: TraditionalSong) => void;
  onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard') => void;
}

const MusicSelector: React.FC<MusicSelectorProps> = ({
  selectedDifficulty,
  onSelectSong,
  onDifficultyChange
}) => {
  const [previewingSong, setPreviewingSong] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState<Record<string, number>>({});
  const [previewVolume, setPreviewVolume] = useState(0.3);

  const songs = getSongsByDifficulty(selectedDifficulty);

  const handlePreview = async (song: TraditionalSong) => {
    if (previewingSong === song.id) {
      // Stop preview
      guitarHeroAudio.pause();
      setPreviewingSong(null);
      return;
    }

    try {
      setPreviewingSong(song.id);
      setLoadingProgress(prev => ({ ...prev, [song.id]: 0 }));

      // Monitor loading progress
      guitarHeroAudio.onLoadProgress((progress) => {
        setLoadingProgress(prev => ({ ...prev, [song.id]: progress }));
      });

      const loaded = await guitarHeroAudio.loadTrack(song);
      
      if (loaded) {
        guitarHeroAudio.setMusicVolume(previewVolume);
        guitarHeroAudio.play();
        
        // Stop preview after 30 seconds
        setTimeout(() => {
          if (previewingSong === song.id) {
            guitarHeroAudio.pause();
            setPreviewingSong(null);
          }
        }, 30000);
      } else {
        setPreviewingSong(null);
      }
    } catch (error) {
      console.error('Erro no preview:', error);
      setPreviewingSong(null);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-600';
      case 'medium': return 'bg-yellow-600';
      case 'hard': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Fácil';
      case 'medium': return 'Médio';
      case 'hard': return 'Difícil';
      default: return difficulty;
    }
  };

  useEffect(() => {
    return () => {
      if (previewingSong) {
        guitarHeroAudio.pause();
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Difficulty Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Nível de Dificuldade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 justify-center">
            {(['easy', 'medium', 'hard'] as const).map((difficulty) => (
              <Button
                key={difficulty}
                variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
                onClick={() => onDifficultyChange(difficulty)}
                className={`px-6 py-3 ${
                  selectedDifficulty === difficulty 
                    ? getDifficultyColor(difficulty)
                    : `border-2 ${difficulty === 'easy' ? 'border-green-600 text-green-600' :
                        difficulty === 'medium' ? 'border-yellow-600 text-yellow-600' :
                        'border-red-600 text-red-600'}`
                }`}
              >
                {difficulty === 'easy' ? '🟢 Fácil' : 
                 difficulty === 'medium' ? '🟡 Médio' : '🔴 Difícil'}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preview Volume Control */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Volume2 className="w-4 h-4" />
            <span className="text-sm">Volume do Preview:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={previewVolume}
              onChange={(e) => setPreviewVolume(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm w-12">{Math.round(previewVolume * 100)}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Songs List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Music className="w-5 h-5" />
              Músicas Tradicionais - {getDifficultyLabel(selectedDifficulty)}
            </span>
            <Badge variant="secondary">{songs.length} músicas</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {songs.map((song) => (
              <Card 
                key={song.id} 
                className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900 transition-all hover:scale-105 border-2"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg">{song.title}</h3>
                    <Badge className={getDifficultyColor(song.difficulty)}>
                      {getDifficultyLabel(song.difficulty)}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-2">{song.artist}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {song.duration}s
                    </span>
                    <span>🎵 {song.bpm} BPM</span>
                    <span>🎼 {song.pattern.length} notas</span>
                  </div>

                  {/* Loading Progress */}
                  {loadingProgress[song.id] !== undefined && loadingProgress[song.id] < 100 && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>Carregando...</span>
                        <span>{Math.round(loadingProgress[song.id])}%</span>
                      </div>
                      <Progress value={loadingProgress[song.id]} className="h-2" />
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreview(song);
                      }}
                      className="flex-1"
                      disabled={loadingProgress[song.id] !== undefined && loadingProgress[song.id] < 100}
                    >
                      {previewingSong === song.id ? (
                        <>
                          <Pause className="w-3 h-3 mr-1" />
                          Parar
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 mr-1" />
                          Preview
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                      onClick={() => onSelectSong(song)}
                      size="sm"
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Jogar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {songs.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Music className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma música encontrada para esta dificuldade</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MusicSelector;
