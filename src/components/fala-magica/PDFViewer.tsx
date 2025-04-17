
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Volume2, Music, Eye, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { InteractivePDF, Word } from './types';
import { motion } from "framer-motion";

interface PDFViewerProps {
  pdf: InteractivePDF;
  onPlayWord: (word: Word) => void;
}

export default function PDFViewer({ pdf, onPlayWord }: PDFViewerProps) {
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [activeView, setActiveView] = useState<'pdf' | 'words'>('words');
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  const handlePlayRegular = (word: Word) => {
    setSelectedWord(word);
    onPlayWord(word);
  };

  const handlePlaySung = (word: Word) => {
    setSelectedWord(word);
    setIsPlayingMusic(true);
    
    // Create audio element to play sung version
    const audio = new Audio(word.sungAudioUrl);
    audio.onended = () => setIsPlayingMusic(false);
    audio.play();
    
    onPlayWord(word);
  };

  return (
    <Card className="shadow-lg">
      <Tabs value={activeView} onValueChange={(value) => setActiveView(value as 'pdf' | 'words')} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="words" className="flex items-center gap-2">
            <Volume2 size={16} />
            <span>Palavras</span>
          </TabsTrigger>
          <TabsTrigger value="pdf" className="flex items-center gap-2">
            <Eye size={16} />
            <span>Cartela</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="words" className="p-4 min-h-[300px]">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold">{pdf.title}</h3>
              <Badge>{pdf.category}</Badge>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {pdf.words.map((word) => (
                <div key={word.id} className="relative">
                  <motion.div 
                    className={`bg-white border rounded-lg shadow-md overflow-hidden ${
                      selectedWord?.id === word.id ? 'ring-2 ring-purple-500' : ''
                    }`}
                    whileHover={{ y: -5, scale: 1.03 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="aspect-square relative">
                      <img 
                        src={word.imageUrl} 
                        alt={word.text} 
                        className="w-full h-full object-cover"
                      />
                      {selectedWord?.id === word.id && isPlayingMusic && (
                        <motion.div 
                          className="absolute inset-0 bg-purple-500/20 flex items-center justify-center"
                          animate={{ opacity: [0.2, 0.5, 0.2] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <Sparkles className="text-purple-600" size={40} />
                        </motion.div>
                      )}
                    </div>
                    
                    <div className="p-3">
                      <h4 className="text-center font-bold mb-2">{word.text}</h4>
                      <div className="flex justify-between gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1 text-xs" 
                          onClick={() => handlePlayRegular(word)}
                        >
                          <Volume2 size={14} className="mr-1" />
                          Falar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1 text-xs" 
                          onClick={() => handlePlaySung(word)}
                        >
                          <Music size={14} className="mr-1" />
                          Cantar
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="pdf" className="min-h-[500px] flex items-center justify-center">
          <div className="text-center p-8">
            <img 
              src={pdf.thumbnailUrl || "https://placehold.co/600x800?text=PDF+Preview"} 
              alt={pdf.title}
              className="max-w-full max-h-[500px] mx-auto rounded-lg shadow-lg"
            />
            <p className="mt-4 text-gray-500">
              O PDF "{pdf.title}" estaria visível aqui.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
