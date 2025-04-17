
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, List, Star, Volume2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface TrackedWord {
  text: string;
  attempts: number;
  lastAttempt?: Date;
}

const WordTracker = () => {
  const [words, setWords] = useState<TrackedWord[]>([]);
  const [newWord, setNewWord] = useState('');
  const { toast } = useToast();

  const addWord = () => {
    if (newWord.trim()) {
      // Check if the word already exists
      if (words.some(word => word.text.toLowerCase() === newWord.trim().toLowerCase())) {
        toast({
          title: "Palavra já existe",
          description: "Esta palavra já está na sua lista de treino.",
          variant: "destructive",
        });
        return;
      }
      
      setWords(prev => [...prev, { text: newWord.trim(), attempts: 0 }]);
      setNewWord('');
      
      toast({
        title: "Palavra adicionada",
        description: `"${newWord.trim()}" foi adicionada à sua lista de treino.`,
      });
    }
  };

  const trackAttempt = (index: number) => {
    setWords(prev => prev.map((word, i) => 
      i === index 
        ? { ...word, attempts: word.attempts + 1, lastAttempt: new Date() }
        : word
    ));
    
    const wordText = words[index].text;
    
    toast({
      title: "Prática registrada!",
      description: `Você praticou a palavra "${wordText}".`,
    });
  };
  
  const removeWord = (index: number) => {
    setWords(prev => prev.filter((_, i) => i !== index));
    
    toast({
      title: "Palavra removida",
      description: "A palavra foi removida da sua lista de treino.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <List className="text-purple-500" />
          Palavras para Treino
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Nova palavra..."
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addWord()}
            />
            <Button onClick={addWord} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-2">
            {words.length === 0 ? (
              <div className="text-center p-6 text-gray-500">
                <List className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Adicione palavras para treinar a fala</p>
              </div>
            ) : (
              words.map((word, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4 text-purple-500" />
                    <span className="font-medium">{word.text}</span>
                    <Badge variant="secondary">{word.attempts} tentativas</Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => trackAttempt(index)}
                      className="flex items-center gap-1"
                    >
                      <Star className="h-4 w-4" />
                      Registrar
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeWord(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-100"
                    >
                      &times;
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WordTracker;
