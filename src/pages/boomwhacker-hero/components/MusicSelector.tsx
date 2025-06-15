
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, Volume2, Music, Clock, Zap, CheckCircle, AlertCircle, FileAudio } from 'lucide-react';
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
  const [audioSourceStatus, setAudioSourceStatus] = useState<Record<string, string>>({});

  const songs = getSongsByDifficulty(selectedDifficulty);

  const handlePreview = async (song: TraditionalSong) => {
    if (previewingSong === song.id) {
      guitarHeroAudio.pause();
      setPreviewingSong(null);
      return;
    }

    try {
      setPreviewingSong(song.id);
      setLoadingProgress(prev => ({ ...prev, [song.id]: 0 }));
      setAudioSourceStatus(prev => ({ ...prev, [song.id]: 'Carregando...' }));

      guitarHeroAudio.onLoadProgress((progress) => {
        setLoadingProgress(prev => ({ ...prev, [song.id]: progress }));
      });

      const loaded = await guitarHeroAudio.loadTrack(song);
      
      if (loaded) {
        guitarHeroAudio.setMusicVolume(previewVolume);
        guitarHeroAudio.play();
        setAudioSourceStatus(prev => ({ ...prev, [song.id]: 'Carregado com sucesso' }));
        
        setTimeout(() => {
          if (previewingSong === song.id) {
            guitarHeroAudio.pause();
            setPreviewingSong(null);
          }
        }, 15000);
      } else {
        setPreviewingSong(null);
        setAudioSourceStatus(prev => ({ ...prev, [song.id]: 'Erro no carregamento' }));
      }
    } catch (error) {
      console.error('Erro no preview:', error);
      setPreviewingSong(null);
      setAudioSourceStatus(prev => ({ ...prev, [song.id]: 'Erro no carregamento' }));
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

  const getAudioSourceIcon = (song: TraditionalSong) => {
    if (song.audioFile && song.audioFile.startsWith('/assets/music/')) {
      return <FileAudio className="w-3 h-3 text-green-600" title="Arquivo local disponível" />;
    }
    if (song.cdnUrl) {
      return <CheckCircle className="w-3 h-3 text-blue-600" title="CDN disponível" />;
    }
    return <AlertCircle className="w-3 h-3 text-orange-600" title="Apenas backup" />;
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

      {/* Audio Status Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 mb-4">
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
          
          <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
              🎵 Músicas Tradicionais Brasileiras Autênticas
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Sistema inteligente: prioriza arquivos locais → CDN → backups → áudio sintético
            </p>
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
                    <div className="flex items-center gap-2">
                      {getAudioSourceIcon(song)}
                      <Badge className={getDifficultyColor(song.difficulty)}>
                        {getDifficultyLabel(song.difficulty)}
                      </Badge>
                    </div>
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

                  {/* Audio Source Status */}
                  {audioSourceStatus[song.id] && (
                    <div className="mb-3">
                      <div className="text-xs text-gray-500">
                        Status: {audioSourceStatus[song.id]}
                      </div>
                    </div>
                  )}

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

      {/* Instructions for adding real music files */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileAudio className="w-5 h-5" />
            Como Adicionar Músicas Reais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
            <h4 className="font-bold text-green-800 dark:text-green-200 mb-2">
              📁 Para usar músicas reais (opcionalmente):
            </h4>
            <ol className="text-sm text-green-700 dark:text-green-300 space-y-1">
              <li>1. Adicione arquivos MP3 na pasta <code>/public/assets/music/</code></li>
              <li>2. Nomes dos arquivos:</li>
              <ul className="ml-4 mt-1 space-y-1">
                <li>• <code>atirei-pau-gato.mp3</code></li>
                <li>• <code>sapo-cururu.mp3</code></li>
                <li>• <code>ciranda-cirandinha.mp3</code></li>
                <li>• <code>sitio-lobato.mp3</code></li>
                <li>• <code>barata-diz-que-tem.mp3</code></li>
                <li>• <code>marcha-soldado.mp3</code></li>
                <li>• <code>boi-cara-preta.mp3</code></li>
                <li>• <code>peixe-vivo.mp3</code></li>
              </ul>
              <li>3. O sistema funcionará automaticamente com áudio sintético como backup</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MusicSelector;
