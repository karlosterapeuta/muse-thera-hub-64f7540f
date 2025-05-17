
import { useState, useEffect } from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { 
  Plus, Save, Calendar, Download, User, Pencil, 
  Eye, FileText, Trash, PlusCircle
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import { MusicogramCanvas } from "./components/MusicogramCanvas";
import { ElementPalette } from "./components/ElementPalette";
import { TemplateSelector } from "./components/TemplateSelector";
import { PatientSelector } from "./components/PatientSelector";
import { 
  musicElements, 
  musicogramTemplates as templates,
  sampleMusicograms
} from "./data/musicogramData";
import { 
  MusicElement, 
  PatientMusicogram, 
  VisualElement, 
  MusicogramTemplate 
} from "./types";

export default function MusicogramPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("create");
  const [selectedElement, setSelectedElement] = useState<MusicElement | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<MusicogramTemplate | null>(null);
  const [currentMusicogram, setCurrentMusicogram] = useState<PatientMusicogram | null>(null);
  const [canvasElements, setCanvasElements] = useState<VisualElement[]>([]);
  const [savedMusicograms, setSavedMusicograms] = useState<PatientMusicogram[]>(sampleMusicograms);
  
  // Dialog states
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedMusicogram, setSelectedMusicogram] = useState<PatientMusicogram | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [musicogramToDelete, setMusicogramToDelete] = useState<string | null>(null);
  
  // Form states
  const [patientId, setPatientId] = useState<string>("");
  const [patientName, setPatientName] = useState<string>("");
  const [sessionNotes, setSessionNotes] = useState<string>("");
  
  // Add element to canvas
  const handleAddElement = (element: MusicElement) => {
    if (!element) return;
    
    const newElement: VisualElement = {
      id: uuidv4(),
      type: element.category,
      color: element.defaultColor,
      shape: element.defaultShape,
      size: element.defaultSize,
      position: { x: 400, y: 250 }, // Center of canvas
      rotation: 0,
      label: element.name
    };
    
    setCanvasElements(prev => [...prev, newElement]);
    toast.success(`Elemento ${element.name} adicionado!`);
  };
  
  // Select a template
  const handleSelectTemplate = (template: MusicogramTemplate) => {
    setSelectedTemplate(template);
    setCanvasElements(template.elements);
    toast.success(`Template ${template.name} selecionado!`);
  };
  
  // Save current musicogram
  const handleSave = () => {
    if (canvasElements.length === 0) {
      toast.error("Não é possível salvar um musicograma vazio!");
      return;
    }
    
    setSaveDialogOpen(true);
  };
  
  // Save with dialog data
  const handleSaveWithData = () => {
    if (!patientId || !patientName) {
      toast.error("Selecione um paciente!");
      return;
    }
    
    const newMusicogram: PatientMusicogram = {
      id: currentMusicogram?.id || uuidv4(),
      patientId,
      patientName,
      date: new Date().toISOString().split('T')[0],
      musicogramData: canvasElements,
      notes: sessionNotes,
      templateId: selectedTemplate?.id
    };
    
    // Update or add to saved musicograms
    if (currentMusicogram) {
      setSavedMusicograms(prev => 
        prev.map(m => m.id === currentMusicogram.id ? newMusicogram : m)
      );
      setCurrentMusicogram(null);
    } else {
      setSavedMusicograms(prev => [...prev, newMusicogram]);
    }
    
    // Reset states
    setSessionNotes("");
    setSaveDialogOpen(false);
    toast.success("Musicograma salvo com sucesso!");
    
    // Switch to library tab
    setActiveTab("library");
  };
  
  // Select patient handler
  const handleSelectPatient = (id: string, name: string) => {
    setPatientId(id);
    setPatientName(name);
  };
  
  // View musicogram
  const handleView = (musicogram: PatientMusicogram) => {
    setSelectedMusicogram(musicogram);
    setViewDialogOpen(true);
  };
  
  // Edit musicogram
  const handleEdit = (musicogram: PatientMusicogram) => {
    setCurrentMusicogram(musicogram);
    setCanvasElements(musicogram.musicogramData);
    setPatientId(musicogram.patientId);
    setPatientName(musicogram.patientName);
    setSessionNotes(musicogram.notes);
    
    // Set template if one was used
    if (musicogram.templateId) {
      const template = templates.find(t => t.id === musicogram.templateId);
      if (template) {
        setSelectedTemplate(template);
      }
    }
    
    setActiveTab("create");
  };
  
  // Handle delete
  const handleDelete = (id: string) => {
    setMusicogramToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  // Confirm delete
  const handleConfirmDelete = () => {
    if (!musicogramToDelete) return;
    
    setSavedMusicograms(prev => prev.filter(m => m.id !== musicogramToDelete));
    setDeleteDialogOpen(false);
    setMusicogramToDelete(null);
    toast.success("Musicograma excluído com sucesso!");
  };
  
  // New musicogram
  const handleNewMusicogram = () => {
    setCurrentMusicogram(null);
    setCanvasElements([]);
    setSelectedTemplate(null);
    setPatientId("");
    setPatientName("");
    setSessionNotes("");
    setActiveTab("create");
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary">Musicograma</h1>
          
          <div className="flex space-x-2">
            {activeTab === "library" && (
              <Button onClick={handleNewMusicogram} className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Novo Musicograma
              </Button>
            )}
          </div>
        </div>
        
        <p className="text-muted-foreground">
          O Musicograma é uma ferramenta de representação visual de elementos sonoros,
          especialmente útil para crianças com TEA ou dificuldades cognitivas.
          Facilita a compreensão de estruturas e comandos musicais básicos.
        </p>
        
        <Tabs defaultValue="create" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="create">Criar Musicograma</TabsTrigger>
            <TabsTrigger value="library">Biblioteca</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <Card className="mb-4">
                  <CardContent className="pt-6">
                    <MusicogramCanvas 
                      initialElements={canvasElements} 
                      template={selectedTemplate}
                      onSave={setCanvasElements}
                    />
                  </CardContent>
                </Card>
                
                <div className="flex flex-wrap gap-2 justify-between items-center">
                  <div className="flex flex-wrap gap-2">
                    <TemplateSelector 
                      templates={templates} 
                      onSelectTemplate={handleSelectTemplate} 
                    />
                    
                    {currentMusicogram ? (
                      <Button variant="outline" disabled className="flex items-center gap-2">
                        <Pencil className="h-4 w-4" />
                        Editando: {currentMusicogram.patientName}
                      </Button>
                    ) : (
                      <PatientSelector 
                        onSelectPatient={handleSelectPatient}
                        selectedPatientId={patientId}
                      />
                    )}
                  </div>
                  
                  <Button onClick={handleSave} className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Salvar Musicograma
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <ElementPalette 
                  elements={musicElements}
                  onSelectElement={(element) => {
                    setSelectedElement(element);
                    handleAddElement(element);
                  }}
                />
                
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-2">Elemento Selecionado</h3>
                    {selectedElement ? (
                      <div className="flex flex-col items-center space-y-3 p-2 border rounded-md">
                        <div 
                          className="w-16 h-16 flex items-center justify-center"
                          style={{ 
                            backgroundColor: selectedElement.defaultColor,
                            borderRadius: selectedElement.defaultShape === 'circle' ? '50%' : '4px',
                            width: `${selectedElement.defaultSize}px`,
                            height: selectedElement.defaultShape === 'rect' 
                              ? `${selectedElement.defaultSize * 0.5}px` 
                              : `${selectedElement.defaultSize}px`
                          }}
                        />
                        <div className="text-center">
                          <h4 className="font-medium">{selectedElement.name}</h4>
                          <p className="text-sm text-muted-foreground">{selectedElement.description}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleAddElement(selectedElement)}>
                          <Plus className="h-4 w-4 mr-1" />
                          Adicionar ao Musicograma
                        </Button>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Selecione um elemento na paleta acima para adicioná-lo ao musicograma.
                      </p>
                    )}
                  </CardContent>
                </Card>
                
                {(patientId && patientName) && (
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-semibold mb-2">Anotações</h3>
                      <Textarea 
                        placeholder="Adicione notas sobre a sessão..."
                        value={sessionNotes}
                        onChange={(e) => setSessionNotes(e.target.value)}
                        className="min-h-[120px]"
                      />
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="library" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedMusicograms.length === 0 ? (
                <Card className="col-span-full p-8 text-center">
                  <CardContent className="pt-6 flex flex-col items-center space-y-4">
                    <p className="text-muted-foreground">Nenhum musicograma salvo ainda.</p>
                    <Button onClick={handleNewMusicogram}>
                      <Plus className="h-4 w-4 mr-1" /> Criar Musicograma
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                savedMusicograms.map((musicogram) => (
                  <Card key={musicogram.id} className="overflow-hidden">
                    <div className="h-44 bg-muted p-3 flex items-center justify-center relative">
                      {musicogram.musicogramData.slice(0, 6).map((element, index) => (
                        <div 
                          key={`${musicogram.id}-${index}`}
                          className="absolute"
                          style={{
                            left: `${element.position.x * 0.25}px`,
                            top: `${element.position.y * 0.25}px`,
                            backgroundColor: element.color,
                            width: `${element.size * 0.25}px`,
                            height: element.shape === 'rect' 
                              ? `${element.size * 0.125}px` 
                              : `${element.size * 0.25}px`,
                            borderRadius: element.shape === 'circle' ? '50%' : '4px',
                            transform: `rotate(${element.rotation}deg)`
                          }}
                        />
                      ))}
                      {musicogram.musicogramData.length > 6 && (
                        <div className="absolute bottom-2 right-2 bg-primary text-primary-foreground text-xs p-1 rounded-md">
                          +{musicogram.musicogramData.length - 6} elementos
                        </div>
                      )}
                    </div>
                    
                    <CardContent className="pt-4 pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center mb-1">
                            <User className="h-4 w-4 mr-1 text-muted-foreground" />
                            <p className="text-sm font-medium">{musicogram.patientName}</p>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">{musicogram.date}</p>
                          </div>
                        </div>
                        
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleView(musicogram)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEdit(musicogram)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(musicogram.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {musicogram.notes && (
                        <div className="mt-2">
                          <div className="flex items-center mb-1">
                            <FileText className="h-4 w-4 mr-1 text-muted-foreground" />
                            <p className="text-xs font-medium">Anotações:</p>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {musicogram.notes}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Save Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Salvar Musicograma</DialogTitle>
            <DialogDescription>
              Preencha as informações para salvar o musicograma.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {!currentMusicogram && (
              <PatientSelector 
                onSelectPatient={handleSelectPatient}
                selectedPatientId={patientId}
              />
            )}
            
            <div>
              <h4 className="text-sm font-medium mb-2">Anotações da Sessão</h4>
              <Textarea 
                placeholder="Anotações sobre o musicograma e a sessão..."
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveWithData}>Salvar Musicograma</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle>Visualizando Musicograma</DialogTitle>
            <DialogDescription>
              {selectedMusicogram?.patientName} - {selectedMusicogram?.date}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-2">
            <MusicogramCanvas 
              initialElements={selectedMusicogram?.musicogramData || []} 
              readOnly={true}
            />
            
            {selectedMusicogram?.notes && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Anotações da Sessão</h4>
                <p className="text-sm text-muted-foreground p-3 border rounded-md bg-muted/50">
                  {selectedMusicogram.notes}
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>Fechar</Button>
            <Button onClick={() => {
              setViewDialogOpen(false);
              handleEdit(selectedMusicogram!);
            }}>
              <Pencil className="h-4 w-4 mr-1" />
              Editar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este musicograma? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmDelete}
            >
              Excluir Permanentemente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
