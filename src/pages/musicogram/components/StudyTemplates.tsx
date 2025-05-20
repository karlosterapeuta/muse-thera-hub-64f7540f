
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Music, FileDown, Plus } from "lucide-react";
import { StudyTemplate } from "../types";

interface StudyTemplatesProps {
  templates: StudyTemplate[];
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
}

export function StudyTemplates({ templates, selectedTemplate, onSelectTemplate }: StudyTemplatesProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const handleSelect = (template: StudyTemplate) => {
    onSelectTemplate(template.id);
    setIsOpen(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Music className="h-4 w-4" />
          Estudos Musicais
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Estudos Musicogramas</DialogTitle>
          <DialogDescription>
            Selecione um dos estudos musicais abaixo para trabalhar.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[500px] mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-1">
            {templates.map(template => (
              <Card key={template.id} className="overflow-hidden">
                <div className="w-full h-32 p-3 flex items-center justify-center bg-white">
                  {template.imageUrl ? (
                    <div className="h-24 w-full relative">
                      <img 
                        src={template.imageUrl}
                        alt={template.name}
                        className="object-contain w-full h-full"
                      />
                    </div>
                  ) : template.previewContent ? (
                    <div 
                      className="text-3xl font-bold text-center"
                      dangerouslySetInnerHTML={{ __html: template.previewContent }}
                    />
                  ) : (
                    <div className="text-2xl font-bold">
                      {template.name}
                    </div>
                  )}
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-semibold">{template.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant={selectedTemplate === template.id ? "secondary" : "default"}
                    size="sm" 
                    className="w-full"
                    onClick={() => handleSelect(template)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    {selectedTemplate === template.id ? "Selecionado" : "Usar Este Estudo"}
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

export default StudyTemplates;
