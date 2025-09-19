import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, X, Music, Mic, Smartphone, Heart } from 'lucide-react';

interface ResourcesSelectorProps {
  resources: string[];
  onAdd: (resource: string) => void;
  onRemove: (index: number) => void;
}

const resourceCategories = {
  instruments: {
    icon: Music,
    label: "Instrumentos",
    items: [
      "Violão", "Teclado", "Bateria infantil", "Pandeiro", "Chocalho", 
      "Metalofone", "Sinos", "Tambor", "Flauta doce", "Ukulele",
      "Xilofone", "Maracas", "Triângulo", "Pau de chuva", "Clavas"
    ]
  },
  technology: {
    icon: Smartphone,
    label: "Tecnológicos",
    items: [
      "Aplicativos musicais", "Músicas gravadas", "Sistema de som",
      "Microfone", "Tablet com jogos musicais", "Metrônomo digital",
      "Gravador digital", "Caixas de som bluetooth", "Fones de ouvido"
    ]
  },
  voice: {
    icon: Mic,
    label: "Voz/Corpo",
    items: [
      "Canto livre", "Canções dirigidas", "Percussão corporal",
      "Movimento e dança", "Respiração musical", "Vocalizes",
      "Improvisação vocal", "Jogos rítmicos corporais"
    ]
  },
  complementary: {
    icon: Heart,
    label: "Complementares",
    items: [
      "Imagens temáticas", "Cartões musicais", "Objetos sonoros",
      "Fantoches musicais", "Tecidos e lenços", "Bolas sensoriais",
      "Balões", "Pompons", "Elásticos coloridos", "Bambolês"
    ]
  }
};

export function ResourcesSelector({ resources, onAdd, onRemove }: ResourcesSelectorProps) {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue("");
    }
  };

  const handleSuggestionAdd = (resource: string) => {
    onAdd(resource);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium text-gray-700 dark:text-gray-300">
          Recursos Musicoterapêuticos
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="text-xs"
        >
          <Music className="h-3 w-3 mr-1" />
          {showSuggestions ? 'Ocultar' : 'Catálogo'}
        </Button>
      </div>

      {showSuggestions && (
        <Card className="border-purple-200 bg-purple-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-purple-800">
              Catálogo de Recursos
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Tabs defaultValue="instruments" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                {Object.entries(resourceCategories).map(([key, category]) => {
                  const IconComponent = category.icon;
                  return (
                    <TabsTrigger key={key} value={key} className="text-xs">
                      <IconComponent className="h-3 w-3 mr-1" />
                      {category.label}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
              
              {Object.entries(resourceCategories).map(([key, category]) => (
                <TabsContent key={key} value={key} className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {category.items.map((item) => (
                      <Badge
                        key={item}
                        variant="outline"
                        className="cursor-pointer hover:bg-purple-100 transition-colors border-purple-300 text-purple-700"
                        onClick={() => handleSuggestionAdd(item)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {item}
                      </Badge>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Digite um recurso ou escolha do catálogo"
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          className="flex-1"
        />
        <Button type="button" onClick={handleAdd} disabled={!inputValue.trim()}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {resources.length > 0 && (
        <div className="space-y-2">
          {resources.map((resource, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <span className="flex-1 text-sm">{resource}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemove(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}