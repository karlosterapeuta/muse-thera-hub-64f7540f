import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, Pencil, Trash2, GripVertical, Video, BookOpen, Settings, Loader2, ShieldAlert, DollarSign, Users } from "lucide-react";
import { useAdmin } from "@/hooks/use-admin";
import { 
  useCourses, 
  useCreateCourse, 
  useUpdateCourse, 
  useDeleteCourse,
  useCourse,
  useCreateModule,
  useUpdateModule,
  useDeleteModule,
  useCreateLesson,
  useUpdateLesson,
  useDeleteLesson
} from "@/hooks/useCourses";
import { Course, CourseModule, CourseLesson, formatPrice } from "@/types/courses";
import { toast } from "sonner";
import { getYouTubeId } from "@/utils/youtubeUtils";
import { CreatorManagement } from "@/components/courses/admin/CreatorManagement";
import { CourseCreatorSelect } from "@/components/courses/admin/CourseCreatorSelect";

// Convert YouTube URL to thumbnail URL
const convertYouTubeUrlToThumbnail = (url: string | undefined): string | undefined => {
  if (!url) return undefined;
  
  // If already a thumbnail URL, return as is
  if (url.includes('img.youtube.com') || url.includes('i.ytimg.com')) {
    return url;
  }
  
  // Try to extract YouTube ID and convert to thumbnail
  const youtubeId = getYouTubeId(url);
  if (youtubeId) {
    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  }
  
  // Return original if not a YouTube URL
  return url;
};

export default function CourseAdminPage() {
  const navigate = useNavigate();
  const { data: isAdmin, isLoading: isCheckingAdmin } = useAdmin();
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [moduleDialogOpen, setModuleDialogOpen] = useState(false);
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(null);
  const [editingModule, setEditingModule] = useState<Partial<CourseModule> | null>(null);
  const [editingLesson, setEditingLesson] = useState<Partial<CourseLesson> & { courseId?: string } | null>(null);

  const { data: courses, isLoading } = useCourses();
  const { data: selectedCourse } = useCourse(selectedCourseId || undefined);
  
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();
  const createModule = useCreateModule();
  const updateModule = useUpdateModule();
  const deleteModule = useDeleteModule();
  const createLesson = useCreateLesson();
  const updateLesson = useUpdateLesson();
  const deleteLesson = useDeleteLesson();

  // Redirect non-admin users
  useEffect(() => {
    if (!isCheckingAdmin && !isAdmin) {
      toast.error("Acesso restrito a administradores");
      navigate("/courses");
    }
  }, [isAdmin, isCheckingAdmin, navigate]);

  // Show loading while checking admin status
  if (isCheckingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <ShieldAlert className="h-16 w-16 text-destructive" />
          <h2 className="text-xl font-semibold">Acesso Restrito</h2>
          <p className="text-muted-foreground">Apenas administradores podem acessar esta página.</p>
          <Button onClick={() => navigate("/courses")} variant="outline">
            Voltar para Cursos
          </Button>
        </div>
      </div>
    );
  }

  // Course handlers
  const handleSaveCourse = async () => {
    if (!editingCourse?.title) {
      toast.error("O título é obrigatório");
      return;
    }

    // Auto-convert YouTube URL to thumbnail
    const courseData = {
      ...editingCourse,
      thumbnail_url: convertYouTubeUrlToThumbnail(editingCourse.thumbnail_url)
    };

    if (editingCourse.id) {
      await updateCourse.mutateAsync(courseData as Course & { id: string });
    } else {
      const result = await createCourse.mutateAsync(courseData);
      setSelectedCourseId(result.id);
    }
    setCourseDialogOpen(false);
    setEditingCourse(null);
  };

  // Module handlers
  const handleSaveModule = async () => {
    if (!editingModule?.title || !selectedCourseId) {
      toast.error("O título é obrigatório");
      return;
    }

    const moduleData = { ...editingModule, course_id: selectedCourseId };

    if (editingModule.id) {
      await updateModule.mutateAsync({ ...moduleData, id: editingModule.id, course_id: selectedCourseId } as CourseModule & { id: string; course_id: string });
    } else {
      const maxOrder = selectedCourse?.modules?.reduce((max, m) => Math.max(max, m.order_index), -1) ?? -1;
      await createModule.mutateAsync({ ...moduleData, order_index: maxOrder + 1 });
    }
    setModuleDialogOpen(false);
    setEditingModule(null);
  };

  // Lesson handlers
  const handleSaveLesson = async () => {
    if (!editingLesson?.title || !editingLesson?.youtube_url || !editingLesson?.module_id) {
      toast.error("Título e URL do YouTube são obrigatórios");
      return;
    }

    if (editingLesson.id) {
      await updateLesson.mutateAsync({ 
        ...editingLesson, 
        id: editingLesson.id, 
        courseId: selectedCourseId! 
      } as CourseLesson & { id: string; courseId: string });
    } else {
      const module = selectedCourse?.modules?.find(m => m.id === editingLesson.module_id);
      const maxOrder = module?.lessons?.reduce((max, l) => Math.max(max, l.order_index), -1) ?? -1;
      await createLesson.mutateAsync({ 
        ...editingLesson, 
        order_index: maxOrder + 1,
        courseId: selectedCourseId! 
      });
    }
    setLessonDialogOpen(false);
    setEditingLesson(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/courses")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Settings className="h-6 w-6" />
                Gerenciar Cursos
              </h1>
              <p className="text-sm text-muted-foreground">
                Crie e edite cursos, módulos, aulas e criadores
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Cursos
            </TabsTrigger>
            <TabsTrigger value="creators" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Criadores
            </TabsTrigger>
          </TabsList>

          <TabsContent value="creators">
            <CreatorManagement />
          </TabsContent>

          <TabsContent value="courses">
            <div className="grid lg:grid-cols-3 gap-6">
          {/* Courses List */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Cursos</CardTitle>
              <Button size="sm" onClick={() => { setEditingCourse({}); setCourseDialogOpen(true); }}>
                <Plus className="h-4 w-4 mr-1" /> Novo
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {isLoading ? (
                <p className="text-muted-foreground text-sm">Carregando...</p>
              ) : courses?.length === 0 ? (
                <p className="text-muted-foreground text-sm">Nenhum curso criado</p>
              ) : (
                courses?.map(course => (
                  <div
                    key={course.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedCourseId === course.id 
                        ? "bg-primary/10 border-primary" 
                        : "hover:bg-muted"
                    }`}
                    onClick={() => setSelectedCourseId(course.id)}
                  >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{course.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {course.is_published ? "✅ Publicado" : "📝 Rascunho"}
                            </span>
                            {course.price_cents && course.price_cents > 0 ? (
                              <span className="text-xs font-medium text-emerald-600">
                                {formatPrice(course.price_cents)}
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">Grátis</span>
                            )}
                          </div>
                        </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingCourse(course);
                            setCourseDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir curso?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não pode ser desfeita. Todos os módulos e aulas serão excluídos.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => {
                                  deleteCourse.mutate(course.id);
                                  if (selectedCourseId === course.id) {
                                    setSelectedCourseId(null);
                                  }
                                }}
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Course Editor */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">
                {selectedCourse ? selectedCourse.title : "Selecione um curso"}
              </CardTitle>
              {selectedCourse && (
                <Button size="sm" onClick={() => { setEditingModule({}); setModuleDialogOpen(true); }}>
                  <Plus className="h-4 w-4 mr-1" /> Módulo
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {!selectedCourse ? (
                <div className="text-center py-12 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>Selecione um curso para editar</p>
                </div>
              ) : selectedCourse.modules?.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Este curso não tem módulos</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                    onClick={() => { setEditingModule({}); setModuleDialogOpen(true); }}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Adicionar Módulo
                  </Button>
                </div>
              ) : (
                <Accordion type="multiple" className="space-y-2">
                  {selectedCourse.modules?.map((module, moduleIdx) => (
                    <AccordionItem key={module.id} value={module.id} className="border rounded-lg">
                      <AccordionTrigger className="px-4 hover:no-underline">
                        <div className="flex items-center gap-3 flex-1">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Módulo {moduleIdx + 1}: {module.title}</span>
                          <span className="text-xs text-muted-foreground ml-auto mr-2">
                            {module.lessons?.length || 0} aulas
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <div className="flex items-center gap-2 mb-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => { setEditingModule(module); setModuleDialogOpen(true); }}
                          >
                            <Pencil className="h-3 w-3 mr-1" /> Editar Módulo
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-destructive">
                                <Trash2 className="h-3 w-3 mr-1" /> Excluir
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Excluir módulo?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Todas as aulas deste módulo serão excluídas.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteModule.mutate({ moduleId: module.id, courseId: selectedCourseId! })}
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          <Button
                            size="sm"
                            onClick={() => { 
                              setEditingLesson({ module_id: module.id, courseId: selectedCourseId! }); 
                              setLessonDialogOpen(true); 
                            }}
                            className="ml-auto"
                          >
                            <Plus className="h-3 w-3 mr-1" /> Aula
                          </Button>
                        </div>

                        {/* Lessons */}
                        <div className="space-y-2">
                          {module.lessons?.map((lesson, lessonIdx) => (
                            <div
                              key={lesson.id}
                              className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                            >
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                              <Video className="h-4 w-4 text-muted-foreground" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {lessonIdx + 1}. {lesson.title}
                                </p>
                                {lesson.duration_minutes > 0 && (
                                  <p className="text-xs text-muted-foreground">
                                    {lesson.duration_minutes} min
                                  </p>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => { 
                                  setEditingLesson({ ...lesson, courseId: selectedCourseId! }); 
                                  setLessonDialogOpen(true); 
                                }}
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Excluir aula?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deleteLesson.mutate({ lessonId: lesson.id, courseId: selectedCourseId! })}
                                    >
                                      Excluir
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Course Dialog */}
      <Dialog open={courseDialogOpen} onOpenChange={setCourseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCourse?.id ? "Editar Curso" : "Novo Curso"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Título *</Label>
              <Input
                value={editingCourse?.title || ""}
                onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                placeholder="Nome do curso"
              />
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea
                value={editingCourse?.description || ""}
                onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                placeholder="Descrição do curso"
              />
            </div>
            <div>
              <Label>Instrutor</Label>
              <Input
                value={editingCourse?.instructor_name || ""}
                onChange={(e) => setEditingCourse({ ...editingCourse, instructor_name: e.target.value })}
                placeholder="Nome do instrutor"
              />
            </div>
            <div>
              <Label>URL da Thumbnail</Label>
              <Input
                value={editingCourse?.thumbnail_url || ""}
                onChange={(e) => setEditingCourse({ ...editingCourse, thumbnail_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" /> Preço (R$)
                </Label>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  value={editingCourse?.price_cents ? (editingCourse.price_cents / 100).toFixed(2) : ""}
                  onChange={(e) => setEditingCourse({ 
                    ...editingCourse, 
                    price_cents: Math.round(parseFloat(e.target.value || "0") * 100) 
                  })}
                  placeholder="0.00 (grátis)"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Deixe em branco ou 0 para curso gratuito
                </p>
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch
                  checked={editingCourse?.is_published || false}
                  onCheckedChange={(checked) => setEditingCourse({ ...editingCourse, is_published: checked })}
                />
                <Label>Publicado</Label>
              </div>
            </div>
            <div>
              <Label>Criador do Curso</Label>
              <CourseCreatorSelect
                value={editingCourse?.creator_id || undefined}
                onChange={(value) => setEditingCourse({ ...editingCourse, creator_id: value })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                O criador receberá a comissão das vendas
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCourseDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveCourse}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Module Dialog */}
      <Dialog open={moduleDialogOpen} onOpenChange={setModuleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingModule?.id ? "Editar Módulo" : "Novo Módulo"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Título *</Label>
              <Input
                value={editingModule?.title || ""}
                onChange={(e) => setEditingModule({ ...editingModule, title: e.target.value })}
                placeholder="Nome do módulo"
              />
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea
                value={editingModule?.description || ""}
                onChange={(e) => setEditingModule({ ...editingModule, description: e.target.value })}
                placeholder="Descrição do módulo"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModuleDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveModule}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lesson Dialog */}
      <Dialog open={lessonDialogOpen} onOpenChange={setLessonDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingLesson?.id ? "Editar Aula" : "Nova Aula"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Título *</Label>
              <Input
                value={editingLesson?.title || ""}
                onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })}
                placeholder="Nome da aula"
              />
            </div>
            <div>
              <Label>URL do YouTube *</Label>
              <Input
                value={editingLesson?.youtube_url || ""}
                onChange={(e) => setEditingLesson({ ...editingLesson, youtube_url: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea
                value={editingLesson?.description || ""}
                onChange={(e) => setEditingLesson({ ...editingLesson, description: e.target.value })}
                placeholder="Descrição da aula"
              />
            </div>
            <div>
              <Label>Duração (minutos)</Label>
              <Input
                type="number"
                value={editingLesson?.duration_minutes || ""}
                onChange={(e) => setEditingLesson({ ...editingLesson, duration_minutes: parseInt(e.target.value) || 0 })}
                placeholder="10"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLessonDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveLesson}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
