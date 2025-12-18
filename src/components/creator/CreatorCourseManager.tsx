import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  Plus,
  BookOpen,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ChevronRight,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { useCreatorCourses, CreatorCourse } from "@/hooks/useCreatorCourses";
import { CreatorCourseEditor } from "./CreatorCourseEditor";
import { formatPrice } from "@/types/courses";

interface CreatorCourseManagerProps {
  creatorId: string;
}

export function CreatorCourseManager({ creatorId }: CreatorCourseManagerProps) {
  const {
    courses,
    isLoading,
    loadCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    togglePublish,
    createModule,
    updateModule,
    deleteModule,
    createLesson,
    updateLesson,
    deleteLesson,
  } = useCreatorCourses(creatorId);

  const [showNewCourseDialog, setShowNewCourseDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CreatorCourse | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<CreatorCourse | null>(null);
  const [newCourseData, setNewCourseData] = useState({
    title: "",
    description: "",
    price_cents: 0,
    thumbnail_url: "",
  });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const handleCreateCourse = async () => {
    if (!newCourseData.title.trim()) return;

    setIsCreating(true);
    const course = await createCourse({
      title: newCourseData.title,
      description: newCourseData.description || undefined,
      price_cents: newCourseData.price_cents || 0,
      thumbnail_url: newCourseData.thumbnail_url || undefined,
    });
    setIsCreating(false);

    if (course) {
      setShowNewCourseDialog(false);
      setNewCourseData({ title: "", description: "", price_cents: 0, thumbnail_url: "" });
      setSelectedCourse(course);
    }
  };

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;
    await deleteCourse(courseToDelete.id);
    setCourseToDelete(null);
  };

  // If a course is selected, show the editor
  if (selectedCourse) {
    return (
      <CreatorCourseEditor
        course={courses.find((c) => c.id === selectedCourse.id) || selectedCourse}
        onBack={() => setSelectedCourse(null)}
        onUpdateCourse={updateCourse}
        onTogglePublish={togglePublish}
        onCreateModule={createModule}
        onUpdateModule={updateModule}
        onDeleteModule={deleteModule}
        onCreateLesson={createLesson}
        onUpdateLesson={updateLesson}
        onDeleteLesson={deleteLesson}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            Gerenciar Meus Cursos
          </h2>
          <p className="text-muted-foreground">
            Crie e gerencie seus cursos na plataforma
          </p>
        </div>
        <Button onClick={() => setShowNewCourseDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Curso
        </Button>
      </div>

      {/* Courses Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : courses.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum curso criado</h3>
            <p className="text-muted-foreground text-center mb-4">
              Comece criando seu primeiro curso para disponibilizar na plataforma
            </p>
            <Button onClick={() => setShowNewCourseDialog(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Criar Primeiro Curso
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => setSelectedCourse(course)}
            >
              {/* Thumbnail */}
              <div className="aspect-video relative bg-gradient-to-br from-primary/20 to-primary/5">
                {course.thumbnail_url ? (
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
                  </div>
                )}
                <Badge
                  className="absolute top-2 right-2"
                  variant={course.is_published ? "default" : "secondary"}
                >
                  {course.is_published ? (
                    <>
                      <Eye className="h-3 w-3 mr-1" />
                      Publicado
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3 w-3 mr-1" />
                      Rascunho
                    </>
                  )}
                </Badge>
              </div>

              {/* Content */}
              <CardContent className="p-4">
                <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                {course.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {course.description}
                  </p>
                )}
                <Separator className="my-3" />
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {course.modules?.length || 0} módulos •{" "}
                    {course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0} aulas
                  </div>
                  <span className="font-bold text-primary">
                    {course.price_cents && course.price_cents > 0
                      ? formatPrice(course.price_cents)
                      : "Gratuito"}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCourse(course);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePublish(course.id, course.is_published);
                    }}
                  >
                    {course.is_published ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCourseToDelete(course);
                    }}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add New Course Card */}
          <Card
            className="border-dashed cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
            onClick={() => setShowNewCourseDialog(true)}
          >
            <CardContent className="flex flex-col items-center justify-center h-full min-h-[300px]">
              <Plus className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <span className="text-muted-foreground font-medium">Criar Novo Curso</span>
            </CardContent>
          </Card>
        </div>
      )}

      {/* New Course Dialog */}
      <Dialog open={showNewCourseDialog} onOpenChange={setShowNewCourseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Novo Curso</DialogTitle>
            <DialogDescription>
              Preencha as informações básicas do seu curso
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Título do Curso *</label>
              <Input
                placeholder="Ex: Musicoterapia para Iniciantes"
                value={newCourseData.title}
                onChange={(e) =>
                  setNewCourseData({ ...newCourseData, title: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Descrição</label>
              <Textarea
                placeholder="Descreva o conteúdo do seu curso..."
                value={newCourseData.description}
                onChange={(e) =>
                  setNewCourseData({ ...newCourseData, description: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Preço (em centavos)</label>
              <Input
                type="number"
                placeholder="Ex: 9700 para R$ 97,00 (0 para gratuito)"
                value={newCourseData.price_cents || ""}
                onChange={(e) =>
                  setNewCourseData({
                    ...newCourseData,
                    price_cents: parseInt(e.target.value) || 0,
                  })
                }
              />
              <p className="text-xs text-muted-foreground">
                {newCourseData.price_cents > 0
                  ? `Preço final: ${formatPrice(newCourseData.price_cents)}`
                  : "Curso gratuito"}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">URL da Thumbnail</label>
              <Input
                placeholder="https://..."
                value={newCourseData.thumbnail_url}
                onChange={(e) =>
                  setNewCourseData({ ...newCourseData, thumbnail_url: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewCourseDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleCreateCourse}
              disabled={!newCourseData.title.trim() || isCreating}
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Criando...
                </>
              ) : (
                "Criar Curso"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!courseToDelete} onOpenChange={() => setCourseToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Curso</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o curso "{courseToDelete?.title}"?
              Esta ação não pode ser desfeita e todos os módulos e aulas serão
              removidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCourse}
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
