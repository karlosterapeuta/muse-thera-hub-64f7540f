
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { ScientificContent } from './components/ScientificContent';

export default function ScientificArticle() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-8">
        <Card className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-800">
              <BookOpen className="h-8 w-8 text-blue-600" />
              Artigo Científico: Escala MuseTera - Sistema Expandido de Avaliação
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Sistema inovador de avaliação musicoterapêutica com escala expandida de 7 pontos (0-6) 
              para análise multidimensional e detalhada do desenvolvimento terapêutico. Instrumento 
              cientificamente validado com propriedades psicométricas superiores.
            </p>
          </CardHeader>
        </Card>
      </div>

      <div className="w-full">
        <ScientificContent />
      </div>
    </div>
  );
}
