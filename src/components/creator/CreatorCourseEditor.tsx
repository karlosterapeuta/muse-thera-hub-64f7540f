import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Video,
  GripVertical,
  Save,
  Loader2,
  Play,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CreatorCourse, CreatorModule, CreatorLesson } from "@/hooks/useCreatorCourses";
import { CreatorLessonForm } from "./CreatorLessonForm";
import { MuseTeraPlayer } from "@/components/courses/MuseTeraPlayer";
import { ThumbnailUploader } from "./ThumbnailUploader";
import { formatPrice } from "@/types/courses";
import { SortableModule } from "./SortableModule";
import { SortableLesson } from "./SortableLesson";
import { cn } from "@/lib/utils";

interface CreatorCourseEditorProps {
  course: CreatorCourse;
  onBack: () => void;
  onUpdateCourse: (courseId: string, data: Partial<CreatorCourse>) => Promise<void>;
  onTogglePublish: (courseId: string, isPublished: boolean) => Promise<void>;
  onCreateModule: (courseId: string, title: string) => Promise<void>;
  onUpdateModule: (moduleId: string, data: Partial<CreatorModule>) => Promise<void>;
  onDeleteModule: (moduleId: string) => Promise<void>;
  onReorderModules: (courseId: string, moduleIds: string[]) => Promise<void>;
  onCreateLesson: (moduleId: string, data: any) => Promise<void>;
  onUpdateLesson: (lessonId: string, data: Partial<CreatorLesson>) => Promise<void>;
  onDeleteLesson: (lessonId: string) => Promise<void>;
  onReorderLessons: (moduleId: string, lessonIds: string[]) => Promise<void>;
}

export function CreatorCourseEditor({
  course,
  onBack,
  onUpdateCourse,
  onTogglePublish,
  onCreateModule,
  onUpdateModule,
  onDeleteModule,
  onReorderModules,
  onCreateLesson,
  onUpdateLesson,
  onDeleteLesson,
  onReorderLessons,
}: CreatorCourseEditorProps) {
  const [editingCourse, setEditingCourse] = useState(false);
  const [courseData, setCourseData] = useState({
    title: course.title,
    description: course.description || "",
    price_cents: course.price_cents || 0,
    thumbnail_url: course.thumbnail_url || "",
  });
  const [isSaving, setIsSaving] = useState(false);

  // Module states
  const [showNewModuleDialog, setShowNewModuleDialog] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [editingModule, setEditingModule] = useState<CreatorModule | null>(null);
  const [moduleToDelete, setModuleToDelete] = useState<CreatorModule | null>(null);

  // Lesson states
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<CreatorLesson | null>(null);
  const [lessonToDelete, setLessonToDelete] = useState<CreatorLesson | null>(null);
  const [previewLesson, setPreviewLesson] = useState<CreatorLesson | null>(null);

  const handleSaveCourse = async () => {
    setIsSaving(true);
    await onUpdateCourse(course.id, courseData);
    setIsSaving(false);
    setEditingCourse(false);
  };

  const handleCreateModule = async () => {
    if (!newModuleTitle.trim()) return;
    await onCreateModule(course.id, newModuleTitle);
    setNewModuleTitle("");
    setShowNewModuleDialog(false);
  };

  const handleUpdateModule = async () => {
    if (!editingModule) return;
    await onUpdateModule(editingModule.id, { title: editingModule.title });
    setEditingModule(null);
  };

  const handleDeleteModule = async () => {
    if (!moduleToDelete) return;
    await onDeleteModule(moduleToDelete.id);
    setModuleToDelete(null);
  };

  const handleCreateLesson = async (data: any) => {
    if (!selectedModuleId) return;
    await onCreateLesson(selectedModuleId, data);
    setShowLessonForm(false);
    setSelectedModuleId(null);
  };

  const handleUpdateLesson = async (data: any) => {
    if (!editingLesson) return;
    await onUpdateLesson(editingLesson.id, data);
    setEditingLesson(null);
    setShowLessonForm(false);
  };

  const handleDeleteLesson = async () => {
    if (!lessonToDelete) return;
    await onDeleteLesson(lessonToDelete.id);
    setLessonToDelete(null);
  };

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleModuleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !course.modules) return;

    const oldIndex = course.modules.findIndex((m) => m.id === active.id);
    const newIndex = course.modules.findIndex((m) => m.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newModules = arrayMove(course.modules, oldIndex, newIndex);
      await onReorderModules(course.id, newModules.map((m) => m.id));
    }
  };

  const handleLessonDragEnd = async (moduleId: string, event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const module = course.modules?.find((m) => m.id === moduleId);
    if (!module?.lessons) return;

    const oldIndex = module.lessons.findIndex((l) => l.id === active.id);
    const newIndex = module.lessons.findIndex((l) => l.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newLessons = arrayMove(module.lessons, oldIndex, newIndex);
      await onReorderLessons(moduleId, newLessons.map((l) => l.id));
    }
  };

  const totalLessons = course.modules?.reduce(
    (acc, m) => acc + (m.lessons?.length || 0),
    0
  ) || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{course.title}</h2>
            <p className="text-muted-foreground">
              {course.modules?.length || 0} módulos • {totalLessons} aulas
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={course.is_published ? "default" : "secondary"}>
            {course.is_published ? "Publicado" : "Rascunho"}
          </Badge>
          <Button
            variant="outline"
            onClick={() => onTogglePublish(course.id, course.is_published)}
          >
            {course.is_published ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Despublicar
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Publicar
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Course Info Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Informações do Curso</CardTitle>
          {!editingCourse ? (
            <Button variant="outline" size="sm" onClick={() => setEditingCourse(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditingCourse(false)}>
                Cancelar
              </Button>
              <Button size="sm" onClick={handleSaveCourse} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Salvar
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {editingCourse ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Título</label>
                <Input
                  value={courseData.title}
                  onChange={(e) =>
                    setCourseData({ ...courseData, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Preço (centavos)</label>
                <Input
                  type="number"
                  value={courseData.price_cents}
                  onChange={(e) =>
                    setCourseData({
                      ...courseData,
                      price_cents: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Descrição</label>
                <Textarea
                  value={courseData.description}
                  onChange={(e) =>
                    setCourseData({ ...courseData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Thumbnail do Curso</label>
                <ThumbnailUploader
                  currentUrl={courseData.thumbnail_url}
                  onUpload={(url) =>
                    setCourseData({ ...courseData, thumbnail_url: url })
                  }
                  courseId={course.id}
                />
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <span className="text-sm text-muted-foreground">Título</span>
                <p className="font-medium">{course.title}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Preço</span>
                <p className="font-medium">
                  {course.price_cents ? formatPrice(course.price_cents) : "Gratuito"}
                </p>
              </div>
              <div className="md:col-span-2">
                <span className="text-sm text-muted-foreground">Descrição</span>
                <p className="font-medium">{course.description || "Sem descrição"}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modules & Lessons */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Estrutura do Curso</CardTitle>
          <Button onClick={() => setShowNewModuleDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Módulo
          </Button>
        </CardHeader>
        <CardContent>
          {!course.modules?.length ? (
            <div className="text-center py-8 text-muted-foreground">
              <Video className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>Nenhum módulo criado ainda</p>
              <p className="text-sm">Adicione módulos para organizar suas aulas</p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleModuleDragEnd}
            >
              <SortableContext
                items={course.modules.map((m) => m.id)}
                strategy={verticalListSortingStrategy}
              >
                <Accordion type="multiple" className="space-y-2">
                  {course.modules.map((module, idx) => (
                    <SortableModule key={module.id} id={module.id}>
                      {({ listeners, isDragging }) => (
                        <AccordionItem
                          value={module.id}
                          className={cn(
                            "border rounded-lg px-4",
                            isDragging && "shadow-lg bg-background"
                          )}
                        >
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-3 flex-1">
                              <button
                                {...listeners}
                                className="cursor-grab active:cursor-grabbing touch-none"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <GripVertical className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                              </button>
                              <Badge variant="outline" className="font-mono">
                                {idx + 1}
                              </Badge>
                              <span className="font-semibold">{module.title}</span>
                              <span className="text-sm text-muted-foreground ml-auto mr-4">
                                {module.lessons?.length || 0} aulas
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pt-2 pb-4">
                            {/* Module Actions */}
                            <div className="flex gap-2 mb-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingModule(module)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Editar Módulo
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedModuleId(module.id);
                                  setShowLessonForm(true);
                                }}
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Nova Aula
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive hover:text-destructive ml-auto"
                                onClick={() => setModuleToDelete(module)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            {/* Lessons List with DnD */}
                            {module.lessons?.length ? (
                              <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={(e) => handleLessonDragEnd(module.id, e)}
                              >
                                <SortableContext
                                  items={module.lessons.map((l) => l.id)}
                                  strategy={verticalListSortingStrategy}
                                >
                                  <div className="space-y-2">
                                    {module.lessons.map((lesson, lessonIdx) => (
                                      <SortableLesson key={lesson.id} id={lesson.id}>
                                        {({ listeners: lessonListeners, isDragging: lessonDragging }) => (
                                          <div
                                            className={cn(
                                              "flex items-center gap-3 p-3 bg-muted/50 rounded-lg group",
                                              lessonDragging && "shadow-lg bg-background opacity-80"
                                            )}
                                          >
                                            <button
                                              {...lessonListeners}
                                              className="cursor-grab active:cursor-grabbing touch-none"
                                            >
                                              <GripVertical className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                                            </button>
                                            <Video className="h-4 w-4 text-primary" />
                                            <span className="text-sm font-mono text-muted-foreground">
                                              {idx + 1}.{lessonIdx + 1}
                                            </span>
                                            <span className="flex-1 font-medium">{lesson.title}</span>
                                            {lesson.is_free_preview && (
                                              <Badge variant="secondary" className="text-xs">
                                                Preview
                                              </Badge>
                                            )}
                                            <span className="text-sm text-muted-foreground">
                                              {lesson.duration_minutes || 0} min
                                            </span>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => setPreviewLesson(lesson)}
                                              >
                                                <Play className="h-4 w-4" />
                                              </Button>
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => {
                                                  setEditingLesson(lesson);
                                                  setSelectedModuleId(module.id);
                                                  setShowLessonForm(true);
                                                }}
                                              >
                                                <Edit className="h-4 w-4" />
                                              </Button>
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive hover:text-destructive"
                                                onClick={() => setLessonToDelete(lesson)}
                                              >
                                                <Trash2 className="h-4 w-4" />
                                              </Button>
                                            </div>
                                          </div>
                                        )}
                                      </SortableLesson>
                                    ))}
                                  </div>
                                </SortableContext>
                              </DndContext>
                            ) : (
                              <p className="text-sm text-muted-foreground text-center py-4">
                                Nenhuma aula neste módulo
                              </p>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      )}
                    </SortableModule>
                  ))}
                </Accordion>
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      </Card>

      {/* New Module Dialog */}
      <Dialog open={showNewModuleDialog} onOpenChange={setShowNewModuleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Módulo</DialogTitle>
            <DialogDescription>
              Adicione um novo módulo para organizar suas aulas
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Ex: Módulo 1 - Introdução"
            value={newModuleTitle}
            onChange={(e) => setNewModuleTitle(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewModuleDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateModule} disabled={!newModuleTitle.trim()}>
              Criar Módulo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Module Dialog */}
      <Dialog open={!!editingModule} onOpenChange={() => setEditingModule(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Módulo</DialogTitle>
          </DialogHeader>
          <Input
            value={editingModule?.title || ""}
            onChange={(e) =>
              setEditingModule(editingModule ? { ...editingModule, title: e.target.value } : null)
            }
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingModule(null)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateModule}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lesson Form Dialog */}
      <CreatorLessonForm
        open={showLessonForm}
        onOpenChange={(open) => {
          setShowLessonForm(open);
          if (!open) {
            setEditingLesson(null);
            setSelectedModuleId(null);
          }
        }}
        lesson={editingLesson}
        onSubmit={editingLesson ? handleUpdateLesson : handleCreateLesson}
      />

      {/* Preview Lesson Dialog */}
      <Dialog open={!!previewLesson} onOpenChange={() => setPreviewLesson(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{previewLesson?.title}</DialogTitle>
          </DialogHeader>
          {previewLesson && (
            <MuseTeraPlayer
              videoUrl={previewLesson.youtube_url}
              title={previewLesson.title}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Module Confirmation */}
      <AlertDialog open={!!moduleToDelete} onOpenChange={() => setModuleToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Módulo</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o módulo "{moduleToDelete?.title}"?
              Todas as aulas serão removidas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteModule}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Lesson Confirmation */}
      <AlertDialog open={!!lessonToDelete} onOpenChange={() => setLessonToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Aula</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a aula "{lessonToDelete?.title}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteLesson}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
