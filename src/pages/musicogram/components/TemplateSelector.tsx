
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MusicogramTemplate } from "../types";
import { FileDown, Plus } from "lucide-react";

interface TemplateSelectorProps {
  templates: MusicogramTemplate[];
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
}

export function TemplateSelector({ templates, selectedTemplate, onSelectTemplate }: TemplateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSelect = (template: MusicogramTemplate) => {
    onSelectTemplate(template.id);
    setIsOpen(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <FileDown className="h-4 w-4" />
          Templates
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Selecionar Template</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[400px] mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-1">
            {templates.map(template => (
              <Card key={template.id} className="overflow-hidden">
                <div 
                  className="w-full h-32 p-3 flex items-center justify-center"
                  style={{ backgroundColor: template.background || '#FFFFFF' }}
                >
                  <div className="relative w-full h-full">
                    {template.elements && template.elements.slice(0, 4).map((element, index) => (
                      <div 
                        key={`preview-${template.id}-${index}`}
                        className="absolute"
                        style={{
                          left: `${(element.position?.x || element.x) * 0.2}px`,
                          top: `${(element.position?.y || element.y) * 0.2}px`,
                          backgroundColor: element.color,
                          width: `${element.size * 0.2}px`,
                          height: element.shape === 'rect' 
                            ? `${element.size * 0.1}px` 
                            : `${element.size * 0.2}px`,
                          borderRadius: element.shape === 'circle' ? '50%' : '4px',
                          transform: `rotate(${element.rotation || 0}deg)`
                        }}
                      />
                    ))}
                    {template.elements && template.elements.length > 4 && (
                      <div className="absolute bottom-0 right-0 bg-primary text-white text-xs p-1 rounded-md">
                        +{template.elements.length - 4} elementos
                      </div>
                    )}
                  </div>
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-semibold">{template.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleSelect(template)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Usar Template
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default TemplateSelector;
