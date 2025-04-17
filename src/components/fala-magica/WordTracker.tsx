
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, List, Star } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface TrackedWord {
  text: string;
  attempts: number;
  lastAttempt?: Date;
}

const WordTracker = () => {
  const [words, setWords] = useState<TrackedWord[]>([]);
  const [newWord, setNewWord] = useState('');

  const addWord = () => {
    if (newWord.trim()) {
      setWords(prev => [...prev, { text: newWord.trim(), attempts: 0 }]);
      setNewWord('');
    }
  };

  const trackAttempt = (index: number) => {
    setWords(prev => prev.map((word, i) => 
      i === index 
        ? { ...word, attempts: word.attempts + 1, lastAttempt: new Date() }
        : word
    ));
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
            {words.map((word, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-secondary/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{word.text}</span>
                  <Badge variant="secondary">{word.attempts} tentativas</Badge>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => trackAttempt(index)}
                  className="flex items-center gap-1"
                >
                  <Star className="h-4 w-4" />
                  Registrar
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WordTracker;
