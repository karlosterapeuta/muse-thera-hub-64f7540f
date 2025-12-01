import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, BookOpen, Settings, Layers, Clock } from "lucide-react";
import { CourseCard } from "@/components/courses/CourseCard";
import { useCoursesWithStats } from "@/hooks/useCoursesWithStats";
import { useAdmin } from "@/hooks/use-admin";
import { CourseAccessRestricted } from "@/components/courses/CourseAccessRestricted";
import { formatDuration } from "@/types/courses";

export default function CoursesPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { data: isAdmin, isLoading: adminLoading } = useAdmin();
  const { data: courses, isLoading } = useCoursesWithStats();

  // Loading state
  if (adminLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Block non-admin users
  if (!isAdmin) {
    return <CourseAccessRestricted />;
  }

  // Filter courses based on publish status and search
  const filteredCourses = (courses || [])
    .filter(course => course.is_published || isAdmin)
    .filter(course =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Calculate totals for header stats
  const totalModules = filteredCourses.reduce((acc, c) => acc + c.totalModules, 0);
  const totalLessons = filteredCourses.reduce((acc, c) => acc + c.totalLessons, 0);
  const totalDuration = filteredCourses.reduce((acc, c) => acc + c.totalDurationMinutes, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-primary" />
                Cursos
              </h1>
              <p className="text-muted-foreground mt-1">
                Aprenda no seu ritmo com nossos cursos de musicoterapia
              </p>
              
              {/* Stats row - Hotmart style */}
              {filteredCourses.length > 0 && (
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {filteredCourses.length} {filteredCourses.length === 1 ? "curso" : "cursos"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Layers className="h-4 w-4" />
                    {totalModules} {totalModules === 1 ? "módulo" : "módulos"}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {totalLessons} {totalLessons === 1 ? "aula" : "aulas"}
                  </span>
                  {totalDuration > 0 && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDuration(totalDuration)} de conteúdo
                    </span>
                  )}
                </div>
              )}
            </div>

            {isAdmin && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate("/courses/admin")}
                  className="gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Gerenciar Cursos
                </Button>
              </div>
            )}
          </div>

          {/* Search */}
          <div className="mt-6 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar cursos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {false ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="aspect-video bg-muted rounded-lg mb-4" />
                <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Nenhum curso encontrado</h2>
            <p className="text-muted-foreground">
              {searchTerm 
                ? "Tente buscar por outros termos" 
                : "Ainda não há cursos disponíveis"}
            </p>
            {isAdmin && !searchTerm && (
              <Button 
                className="mt-4 gap-2"
                onClick={() => navigate("/courses/admin")}
              >
                <Plus className="h-4 w-4" />
                Criar Primeiro Curso
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                onClick={() => navigate(`/courses/${course.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
