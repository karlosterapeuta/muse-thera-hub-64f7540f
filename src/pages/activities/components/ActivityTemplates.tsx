import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Plus,
  Copy,
  Edit,
  Trash2,
  FileText,
  Save,
  Download,
  Upload,
  Star,
  Heart,
  Users,
  Clock,
  Target,
  Zap,
  BookOpen,
  Settings
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ActivityTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  ageGroup: string;
  difficulty: 'fácil' | 'médio' | 'difícil';
  duration: string;
  objectives: string[];
  materials: string[];
  steps: TemplateStep[];
  tags: string[];
  isPublic: boolean;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
  rating: number;
  author: string;
}

interface TemplateStep {
  id: string;
  title: string;
  description: string;
  duration?: number;
  materials?: string[];
  notes?: string;
}

interface ActivityTemplatesProps {
  templates: ActivityTemplate[];
  onCreateTemplate: (template: Omit<ActivityTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount' | 'rating'>) => void;
  onUpdateTemplate: (templateId: string, updates: Partial<ActivityTemplate>) => void;
  onDeleteTemplate: (templateId: string) => void;
  onDuplicateTemplate: (templateId: string) => void;
  onUseTemplate: (templateId: string) => void;
  onExportTemplate: (templateId: string) => void;
  onImportTemplate: (templateData: any) => void;
  onToggleFavorite: (templateId: string) => void;
}

export const ActivityTemplates: React.FC<ActivityTemplatesProps> = ({
  templates,
  onCreateTemplate,
  onUpdateTemplate,
  onDeleteTemplate,
  onDuplicateTemplate,
  onUseTemplate,
  onExportTemplate,
  onImportTemplate,
  onToggleFavorite
}) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ActivityTemplate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');

  const [newTemplate, setNewTemplate] = useState<Partial<ActivityTemplate>>({
    name: '',
    description: '',
    category: '',
    ageGroup: '',
    difficulty: 'fácil',
    duration: '',
    objectives: [],
    materials: [],
    steps: [],
    tags: [],
    isPublic: false,
    isFavorite: false,
    author: 'Usuário Atual'
  });

  const [currentObjective, setCurrentObjective] = useState('');
  const [currentMaterial, setCurrentMaterial] = useState('');
  const [currentTag, setCurrentTag] = useState('');
  const [currentStep, setCurrentStep] = useState<Partial<TemplateStep>>({
    title: '',
    description: '',
    duration: undefined,
    materials: [],
    notes: ''
  });

  const categories = [...new Set(templates.map(t => t.category))];
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
    const matchesDifficulty = filterDifficulty === 'all' || template.difficulty === filterDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const resetForm = () => {
    setNewTemplate({
      name: '',
      description: '',
      category: '',
      ageGroup: '',
      difficulty: 'fácil',
      duration: '',
      objectives: [],
      materials: [],
      steps: [],
      tags: [],
      isPublic: false,
      isFavorite: false,
      author: 'Usuário Atual'
    });
    setCurrentObjective('');
    setCurrentMaterial('');
    setCurrentTag('');
    setCurrentStep({
      title: '',
      description: '',
      duration: undefined,
      materials: [],
      notes: ''
    });
  };

  const handleCreateTemplate = () => {
    if (!newTemplate.name || !newTemplate.description || !newTemplate.category) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha pelo menos nome, descrição e categoria.",
        variant: "destructive"
      });
      return;
    }

    onCreateTemplate(newTemplate as Omit<ActivityTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount' | 'rating'>);
    resetForm();
    setShowCreateDialog(false);
    
    toast({
      title: "Template criado",
      description: "Seu template foi criado com sucesso!",
    });
  };

  const handleUpdateTemplate = () => {
    if (editingTemplate) {
      onUpdateTemplate(editingTemplate.id, editingTemplate);
      setEditingTemplate(null);
      
      toast({
        title: "Template atualizado",
        description: "As alterações foram salvas com sucesso!",
      });
    }
  };

  const addObjective = () => {
    if (currentObjective.trim()) {
      setNewTemplate(prev => ({
        ...prev,
        objectives: [...(prev.objectives || []), currentObjective.trim()]
      }));
      setCurrentObjective('');
    }
  };

  const addMaterial = () => {
    if (currentMaterial.trim()) {
      setNewTemplate(prev => ({
        ...prev,
        materials: [...(prev.materials || []), currentMaterial.trim()]
      }));
      setCurrentMaterial('');
    }
  };

  const addTag = () => {
    if (currentTag.trim()) {
      setNewTemplate(prev => ({
        ...prev,
        tags: [...(prev.tags || []), currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const addStep = () => {
    if (currentStep.title && currentStep.description) {
      const step: TemplateStep = {
        id: Date.now().toString(),
        title: currentStep.title,
        description: currentStep.description,
        duration: currentStep.duration,
        materials: currentStep.materials || [],
        notes: currentStep.notes
      };
      
      setNewTemplate(prev => ({
        ...prev,
        steps: [...(prev.steps || []), step]
      }));
      
      setCurrentStep({
        title: '',
        description: '',
        duration: undefined,
        materials: [],
        notes: ''
      });
    }
  };

  const removeItem = (array: string[], index: number, key: keyof ActivityTemplate) => {
    const newArray = array.filter((_, i) => i !== index);
    setNewTemplate(prev => ({ ...prev, [key]: newArray }));
  };

  const removeStep = (stepId: string) => {
    setNewTemplate(prev => ({
      ...prev,
      steps: (prev.steps || []).filter(step => step.id !== stepId)
    }));
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const templateData = JSON.parse(e.target?.result as string);
          onImportTemplate(templateData);
          toast({
            title: "Template importado",
            description: "O template foi importado com sucesso!",
          });
        } catch (error) {
          toast({
            title: "Erro na importação",
            description: "Arquivo inválido ou corrompido.",
            variant: "destructive"
          });
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Templates de Atividades
              <Badge variant="outline">{templates.length}</Badge>
            </CardTitle>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
                id="import-template"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('import-template')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Importar
              </Button>
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Template
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Criar Novo Template</DialogTitle>
                  </DialogHeader>
                  
                  <Tabs defaultValue="basic" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="basic">Básico</TabsTrigger>
                      <TabsTrigger value="content">Conteúdo</TabsTrigger>
                      <TabsTrigger value="steps">Etapas</TabsTrigger>
                      <TabsTrigger value="settings">Configurações</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="template-name">Nome do Template *</Label>
                          <Input
                            id="template-name"
                            value={newTemplate.name || ''}
                            onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Ex: Atividade de Relaxamento"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="template-category">Categoria *</Label>
                          <Select 
                            value={newTemplate.category || ''} 
                            onValueChange={(value) => setNewTemplate(prev => ({ ...prev, category: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Cognitivo">Cognitivo</SelectItem>
                              <SelectItem value="Motor">Motor</SelectItem>
                              <SelectItem value="Emocional">Emocional</SelectItem>
                              <SelectItem value="Social">Social</SelectItem>
                              <SelectItem value="Linguagem">Linguagem</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="template-age-group">Faixa Etária</Label>
                          <Select 
                            value={newTemplate.ageGroup || ''} 
                            onValueChange={(value) => setNewTemplate(prev => ({ ...prev, ageGroup: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a faixa etária" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Infantil">Infantil (0-12 anos)</SelectItem>
                              <SelectItem value="Adolescente">Adolescente (13-17 anos)</SelectItem>
                              <SelectItem value="Adulto">Adulto (18+ anos)</SelectItem>
                              <SelectItem value="Todas">Todas as idades</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="template-difficulty">Dificuldade</Label>
                          <Select 
                            value={newTemplate.difficulty || 'fácil'} 
                            onValueChange={(value: any) => setNewTemplate(prev => ({ ...prev, difficulty: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fácil">Fácil</SelectItem>
                              <SelectItem value="médio">Médio</SelectItem>
                              <SelectItem value="difícil">Difícil</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="md:col-span-2">
                          <Label htmlFor="template-duration">Duração Estimada</Label>
                          <Input
                            id="template-duration"
                            value={newTemplate.duration || ''}
                            onChange={(e) => setNewTemplate(prev => ({ ...prev, duration: e.target.value }))}
                            placeholder="Ex: 30-45 minutos"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="template-description">Descrição *</Label>
                        <Textarea
                          id="template-description"
                          value={newTemplate.description || ''}
                          onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Descreva o propósito e benefícios da atividade..."
                          rows={4}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="content" className="space-y-4">
                      {/* Objectives */}
                      <div>
                        <Label>Objetivos Terapêuticos</Label>
                        <div className="flex gap-2 mt-2">
                          <Input
                            value={currentObjective}
                            onChange={(e) => setCurrentObjective(e.target.value)}
                            placeholder="Digite um objetivo..."
                            onKeyPress={(e) => e.key === 'Enter' && addObjective()}
                          />
                          <Button type="button" onClick={addObjective}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {newTemplate.objectives?.map((objective, index) => (
                            <Badge key={index} variant="secondary" className="gap-1">
                              {objective}
                              <button
                                onClick={() => removeItem(newTemplate.objectives!, index, 'objectives')}
                                className="ml-1 hover:text-destructive"
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Materials */}
                      <div>
                        <Label>Materiais Necessários</Label>
                        <div className="flex gap-2 mt-2">
                          <Input
                            value={currentMaterial}
                            onChange={(e) => setCurrentMaterial(e.target.value)}
                            placeholder="Digite um material..."
                            onKeyPress={(e) => e.key === 'Enter' && addMaterial()}
                          />
                          <Button type="button" onClick={addMaterial}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {newTemplate.materials?.map((material, index) => (
                            <Badge key={index} variant="outline" className="gap-1">
                              {material}
                              <button
                                onClick={() => removeItem(newTemplate.materials!, index, 'materials')}
                                className="ml-1 hover:text-destructive"
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Tags */}
                      <div>
                        <Label>Tags</Label>
                        <div className="flex gap-2 mt-2">
                          <Input
                            value={currentTag}
                            onChange={(e) => setCurrentTag(e.target.value)}
                            placeholder="Digite uma tag..."
                            onKeyPress={(e) => e.key === 'Enter' && addTag()}
                          />
                          <Button type="button" onClick={addTag}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {newTemplate.tags?.map((tag, index) => (
                            <Badge key={index} variant="outline" className="gap-1">
                              #{tag}
                              <button
                                onClick={() => removeItem(newTemplate.tags!, index, 'tags')}
                                className="ml-1 hover:text-destructive"
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="steps" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Adicionar Etapa</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label htmlFor="step-title">Título da Etapa</Label>
                            <Input
                              id="step-title"
                              value={currentStep.title || ''}
                              onChange={(e) => setCurrentStep(prev => ({ ...prev, title: e.target.value }))}
                              placeholder="Ex: Preparação do ambiente"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="step-description">Descrição</Label>
                            <Textarea
                              id="step-description"
                              value={currentStep.description || ''}
                              onChange={(e) => setCurrentStep(prev => ({ ...prev, description: e.target.value }))}
                              placeholder="Descreva o que deve ser feito nesta etapa..."
                              rows={3}
                            />
                          </div>

                          <div>
                            <Label htmlFor="step-duration">Duração (minutos)</Label>
                            <Input
                              id="step-duration"
                              type="number"
                              value={currentStep.duration || ''}
                              onChange={(e) => setCurrentStep(prev => ({ ...prev, duration: parseInt(e.target.value) || undefined }))}
                              placeholder="10"
                            />
                          </div>

                          <div>
                            <Label htmlFor="step-notes">Observações</Label>
                            <Textarea
                              id="step-notes"
                              value={currentStep.notes || ''}
                              onChange={(e) => setCurrentStep(prev => ({ ...prev, notes: e.target.value }))}
                              placeholder="Dicas ou observações importantes..."
                              rows={2}
                            />
                          </div>

                          <Button type="button" onClick={addStep} className="w-full">
                            <Plus className="h-4 w-4 mr-2" />
                            Adicionar Etapa
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Steps List */}
                      {newTemplate.steps && newTemplate.steps.length > 0 && (
                        <div className="space-y-2">
                          <Label>Etapas Adicionadas ({newTemplate.steps.length})</Label>
                          {newTemplate.steps.map((step, index) => (
                            <Card key={step.id}>
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Badge variant="outline">{index + 1}</Badge>
                                      <h4 className="font-medium">{step.title}</h4>
                                      {step.duration && (
                                        <Badge variant="secondary">
                                          <Clock className="h-3 w-3 mr-1" />
                                          {step.duration}min
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">{step.description}</p>
                                    {step.notes && (
                                      <p className="text-xs text-muted-foreground mt-1 italic">
                                        Obs: {step.notes}
                                      </p>
                                    )}
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeStep(step.id)}
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="settings" className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Template Público</Label>
                            <p className="text-sm text-muted-foreground">
                              Outros usuários poderão usar este template
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={newTemplate.isPublic || false}
                            onChange={(e) => setNewTemplate(prev => ({ ...prev, isPublic: e.target.checked }))}
                            className="w-4 h-4"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Adicionar aos Favoritos</Label>
                            <p className="text-sm text-muted-foreground">
                              Marcar como template favorito
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={newTemplate.isFavorite || false}
                            onChange={(e) => setNewTemplate(prev => ({ ...prev, isFavorite: e.target.checked }))}
                            className="w-4 h-4"
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex gap-2 justify-end pt-4 border-t">
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateTemplate}>
                      <Save className="h-4 w-4 mr-2" />
                      Criar Template
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Buscar templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Dificuldade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="fácil">Fácil</SelectItem>
                <SelectItem value="médio">Médio</SelectItem>
                <SelectItem value="difícil">Difícil</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map(template => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{template.name}</CardTitle>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{template.category}</Badge>
                    <Badge variant={template.difficulty === 'fácil' ? 'default' : template.difficulty === 'médio' ? 'secondary' : 'destructive'}>
                      {template.difficulty}
                    </Badge>
                    {template.isPublic && <Badge variant="outline">Público</Badge>}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleFavorite(template.id)}
                    className={template.isFavorite ? 'text-red-500' : ''}
                  >
                    <Heart className={`h-4 w-4 ${template.isFavorite ? 'fill-current' : ''}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onExportTemplate(template.id)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {template.description}
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4" />
                  <span>{template.ageGroup}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>{template.duration}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Target className="h-4 w-4" />
                  <span>{template.objectives.length} objetivos</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="h-4 w-4" />
                  <span>{template.steps.length} etapas</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {template.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
                {template.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{template.tags.length - 3}
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                <span>Por {template.author}</span>
                <div className="flex items-center gap-2">
                  <span>{template.usageCount} usos</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current text-yellow-400" />
                    <span>{template.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onUseTemplate(template.id)}
                  className="flex-1"
                >
                  Usar Template
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDuplicateTemplate(template.id)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingTemplate(template)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteTemplate(template.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">
              {searchTerm || filterCategory !== 'all' || filterDifficulty !== 'all'
                ? 'Nenhum template encontrado com os filtros aplicados.'
                : 'Nenhum template criado ainda. Crie seu primeiro template!'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};