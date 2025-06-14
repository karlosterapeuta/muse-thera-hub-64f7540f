
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Music, Zap, Settings } from 'lucide-react';

interface SprunkiGameModeProps {
  onSelectMode: (mode: 'creative' | 'challenge') => void;
  onSettings: () => void;
}

const SprunkiGameMode: React.FC<SprunkiGameModeProps> = ({
  onSelectMode,
  onSettings
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            🎵 SPRUNKI
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-2">
            O Jogo Musical Interativo
          </p>
          <p className="text-base text-gray-500 dark:text-gray-400">
            Escolha seu modo de jogo preferido
          </p>
        </div>

        {/* Game Mode Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Creative Mode */}
          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-purple-300">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-purple-100 dark:bg-purple-900/30 rounded-full w-20 h-20 flex items-center justify-center">
                <Music className="w-10 h-10 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-2xl text-purple-700 dark:text-purple-300">
                Modo Criativo
              </CardTitle>
              <CardDescription className="text-base">
                Crie suas próprias músicas arrastando os bonequinhos para o palco
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-600 dark:text-gray-400 mb-6 space-y-2">
                <li>• Liberdade total para criar</li>
                <li>• 8 personagens únicos</li>
                <li>• Salve suas composições</li>
                <li>• Modo relaxante</li>
              </ul>
              <Button 
                onClick={() => onSelectMode('creative')}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 text-lg"
              >
                Jogar Modo Criativo
              </Button>
            </CardContent>
          </Card>

          {/* Challenge Mode */}
          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-yellow-300">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-full w-20 h-20 flex items-center justify-center">
                <Zap className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
              </div>
              <CardTitle className="text-2xl text-yellow-700 dark:text-yellow-300">
                Modo Desafio
              </CardTitle>
              <CardDescription className="text-base">
                Reproduza as sequências musicais e avance pelos níveis
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-600 dark:text-gray-400 mb-6 space-y-2">
                <li>• Desafios progressivos</li>
                <li>• Sistema de pontuação</li>
                <li>• Tempo cronometrado</li>
                <li>• Feedback imediato</li>
              </ul>
              <Button 
                onClick={() => onSelectMode('challenge')}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 text-lg"
              >
                Jogar Modo Desafio
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Settings Button */}
        <Button
          onClick={onSettings}
          variant="outline"
          className="mb-4"
        >
          <Settings className="w-4 h-4 mr-2" />
          Configurações de Acessibilidade
        </Button>

        {/* Info */}
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            🧩 Adaptado para TEA • Interface intuitiva • Feedback positivo
          </p>
        </div>
      </div>
    </div>
  );
};

export default SprunkiGameMode;
