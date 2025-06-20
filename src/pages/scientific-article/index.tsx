
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, BookOpen, Users, Mail } from 'lucide-react';
import { ScientificContent } from './components/ScientificContent';
import { PublicationSuggestions } from './components/PublicationSuggestions';
import { PDFDownloadSection } from './components/PDFDownloadSection';

export default function ScientificArticle() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="mb-8">
        <Card className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-800">
              <BookOpen className="h-8 w-8 text-blue-600" />
              Artigo Científico: Escala MuseTera
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Sistema expandido de avaliação musicoterapêutica com escala de 7 pontos (0-6) 
              para análise multidimensional do desenvolvimento terapêutico
            </p>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <ScientificContent />
        </div>
        
        <div className="space-y-6">
          <PDFDownloadSection />
          <PublicationSuggestions />
        </div>
      </div>
    </div>
  );
}
