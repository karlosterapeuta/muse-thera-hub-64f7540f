
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Music, Clock, Drumstick, Volume2, Pause, LayoutGrid
} from "lucide-react";
import { MusicElement } from "../types";

interface ElementPaletteProps {
  onAddElement: (element: any) => void;
}

const ElementPalette = ({ onAddElement }: ElementPaletteProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("note");
  
  const categories = [
    { id: "note", label: "Notas", icon: <Music className="h-4 w-4" /> },
    { id: "rhythm", label: "Ritmos", icon: <Clock className="h-4 w-4" /> },
    { id: "instrument", label: "Instrumentos", icon: <Drumstick className="h-4 w-4" /> },
    { id: "dynamics", label: "Dinâmicas", icon: <Volume2 className="h-4 w-4" /> },
    { id: "silence", label: "Silêncios", icon: <Pause className="h-4 w-4" /> },
    { id: "structure", label: "Estruturas", icon: <LayoutGrid className="h-4 w-4" /> },
  ];
  
  // Dummy elements for demonstration
  const elements: MusicElement[] = [
    { id: "quarter-note", name: "Semínima", category: "note", defaultColor: "#000000", defaultShape: "circle", defaultSize: 20 },
    { id: "half-note", name: "Mínima", category: "note", defaultColor: "#000000", defaultShape: "circle", defaultSize: 20 },
    { id: "whole-note", name: "Semibreve", category: "note", defaultColor: "#000000", defaultShape: "circle", defaultSize: 20 },
    { id: "forte", name: "Forte", category: "dynamics", defaultColor: "#FF5252", defaultShape: "rect", defaultSize: 30 },
    { id: "piano", name: "Piano", category: "dynamics", defaultColor: "#4CAF50", defaultShape: "rect", defaultSize: 30 },
    { id: "quarter-rest", name: "Pausa de Semínima", category: "silence", defaultColor: "#000000", defaultShape: "rect", defaultSize: 20 },
  ];
  
  const filteredElements = elements.filter(element => element.category === selectedCategory);
  
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <Tabs defaultValue="note" onValueChange={(value) => setSelectedCategory(value)}>
          <TabsList className="w-full grid grid-cols-3 lg:grid-cols-6">
            {categories.map(category => (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center space-x-1">
                {category.icon}
                <span className="hidden sm:inline">{category.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {categories.map(category => (
            <TabsContent key={category.id} value={category.id} className="mt-4">
              <h3 className="text-sm font-medium mb-2">{category.label} Disponíveis</h3>
              <ScrollArea className="h-[200px] rounded-md border p-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {filteredElements.map(element => (
                    <div 
                      key={element.id} 
                      className="p-2 border rounded-md hover:bg-muted/50 cursor-pointer transition-colors flex flex-col items-center"
                      onClick={() => onAddElement(element)}
                    >
                      <div 
                        className="w-10 h-10 mb-1 flex items-center justify-center"
                        style={{ 
                          backgroundColor: element.defaultColor,
                          borderRadius: element.defaultShape === 'circle' ? '50%' : '4px',
                          width: `${element.defaultSize * 0.6}px`,
                          height: element.defaultShape === 'rect' 
                            ? `${element.defaultSize * 0.3}px` 
                            : `${element.defaultSize * 0.6}px`
                        }}
                      />
                      <span className="text-xs text-center line-clamp-2">{element.name}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ElementPalette;
