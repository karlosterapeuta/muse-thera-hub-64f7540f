import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, X, Sparkles } from 'lucide-react';
import { musicoterapiaPhrases, type PhraseBank } from '@/data/musicoterapiaPhrases';

interface MusicoterapiaQuickFillProps {
  activeField: string;
  onInsert: (text: string) => void;
  onClose: () => void;
}

export function MusicoterapiaQuickFill({
  activeField,
  onInsert,
  onClose
}: MusicoterapiaQuickFillProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter phrases based on active field context and search term
  const filteredPhrases = useMemo(() => {
    let phrases = musicoterapiaPhrases;

    // Filter by field context if active field is provided
    if (activeField) {
      phrases = phrases.filter(bank => 
        bank.fieldContext.includes(activeField) || bank.fieldContext.length === 0
      );
    }

    // Filter by selected category
    if (selectedCategory !== 'all') {
      phrases = phrases.filter(bank => bank.id === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      phrases = phrases.map(bank => ({
        ...bank,
        phrases: bank.phrases.filter(phrase => 
          phrase.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(bank => bank.phrases.length > 0);
    }

    return phrases;
  }, [activeField, selectedCategory, searchTerm]);

  // Get available categories based on active field
  const availableCategories = useMemo(() => {
    if (!activeField) return musicoterapiaPhrases;
    
    return musicoterapiaPhrases.filter(bank => 
      bank.fieldContext.includes(activeField) || bank.fieldContext.length === 0
    );
  }, [activeField]);

  const handleInsert = (phrase: string) => {
    onInsert(phrase);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>Quick Fill - Musicoterapia</span>
            </CardTitle>
            <CardDescription>
              Frases especializadas para relatórios de TEA
              {activeField && (
                <Badge variant="outline" className="ml-2">
                  Campo ativo: {activeField}
                </Badge>
              )}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar frases especializadas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="musical_objectives">Objetivos</TabsTrigger>
            <TabsTrigger value="musical_activities">Atividades</TabsTrigger>
          </TabsList>

          {/* Category Buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              Todas as Categorias
            </Button>
            {availableCategories.map((bank) => (
              <Button
                key={bank.id}
                variant={selectedCategory === bank.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(bank.id)}
              >
                {bank.name}
              </Button>
            ))}
          </div>

          <ScrollArea className="h-96">
            <div className="space-y-4">
              {filteredPhrases.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Nenhuma frase encontrada</p>
                  <p className="text-sm">
                    Tente ajustar os termos de busca ou selecionar uma categoria diferente
                  </p>
                </div>
              ) : (
                filteredPhrases.map((bank) => (
                  <div key={bank.id} className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-sm text-primary">
                        {bank.name}
                      </h4>
                      <Badge variant="secondary" className="text-xs">
                        {bank.phrases.length} frases
                      </Badge>
                    </div>
                    
                    <div className="grid gap-2">
                      {bank.phrases.map((phrase, index) => (
                        <div
                          key={index}
                          className="group p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-start justify-between space-x-2">
                            <p className="text-sm text-muted-foreground flex-1 leading-relaxed">
                              {phrase}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                              onClick={() => handleInsert(phrase)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
}