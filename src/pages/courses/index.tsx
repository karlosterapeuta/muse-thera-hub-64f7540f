import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Settings, Loader2, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCoursesWithStats } from "@/hooks/useCoursesWithStats";
import { useAdmin } from "@/hooks/use-admin";
import { CoursePreviewModal } from "@/components/courses/netflix/CoursePreviewModal";
import { CoursePurchaseModal } from "@/components/courses/netflix/CoursePurchaseModal";
import { CourseWithProgress } from "@/types/courses";
import { supabase } from "@/integrations/supabase/client";

// Landing page components
import {
  LandingHero,
  SocialProofBar,
  TargetAudience,
  BenefitsGrid,
  CourseModules,
  TestimonialsCarousel,
  PricingSection,
  FAQSection,
  FinalCTA,
  TrustBadges,
} from "@/components/courses/landing";

// Netflix browse components
import { NetflixHero } from "@/components/courses/netflix/NetflixHero";
import { CourseRow } from "@/components/courses/netflix/CourseRow";

export default function CoursesPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<CourseWithProgress | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [userAccess, setUserAccess] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"landing" | "browse">("landing");
  
  const { data: isAdmin, isLoading: adminLoading } = useAdmin();
  const { data: courses, isLoading, refetch } = useCoursesWithStats();

  // Fetch user's course access
  useEffect(() => {
    const fetchAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('course_access')
        .select('course_id')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (data) {
        setUserAccess(new Set(data.map(a => a.course_id)));
      }
    };
    fetchAccess();
  }, []);

  // Filter and organize courses
  const filteredCourses = useMemo(() => {
    return (courses || [])
      .filter(course => course.is_published || isAdmin)
      .filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map(course => ({
        ...course,
        hasAccess: userAccess.has(course.id) || !course.price_cents || course.price_cents === 0
      }));
  }, [courses, searchTerm, isAdmin, userAccess]);

  // Get featured course (first one or one with most progress)
  const featuredCourse = useMemo(() => {
    if (filteredCourses.length === 0) return null;
    
    // Prioritize courses in progress
    const inProgress = filteredCourses.find(c => c.progressPercentage > 0 && c.progressPercentage < 100);
    if (inProgress) return inProgress;
    
    return filteredCourses[0];
  }, [filteredCourses]);

  // Organize courses by category
  const coursesByCategory = useMemo(() => {
    const continueWatching = filteredCourses.filter(c => c.progressPercentage > 0 && c.progressPercentage < 100);
    const completed = filteredCourses.filter(c => c.progressPercentage === 100);
    const freeCourses = filteredCourses.filter(c => !c.price_cents || c.price_cents === 0);
    const paidCourses = filteredCourses.filter(c => c.price_cents && c.price_cents > 0);
    const allCourses = filteredCourses;

    return {
      continueWatching,
      completed,
      freeCourses,
      paidCourses,
      allCourses
    };
  }, [filteredCourses]);

  const handleCourseClick = (course: CourseWithProgress) => {
    const isFree = !course.price_cents || course.price_cents === 0;
    const hasAccess = userAccess.has(course.id) || isFree;
    
    if (hasAccess) {
      navigate(`/courses/${course.id}`);
    } else {
      setSelectedCourse(course);
      setShowPurchaseModal(true);
    }
  };

  const handleCourseInfo = (course: CourseWithProgress) => {
    setSelectedCourse(course);
    setShowPreviewModal(true);
  };

  const handleCoursePurchase = (course: CourseWithProgress) => {
    setSelectedCourse(course);
    setShowPurchaseModal(true);
  };

  const handlePurchaseSuccess = () => {
    setShowPurchaseModal(false);
    refetch();
  };

  // Loading state
  if (adminLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Landing Page View (High Conversion)
  if (viewMode === "landing" && featuredCourse) {
    return (
      <div className="min-h-screen bg-background">
        {/* Fixed navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-background via-background/95 to-transparent">
          <div className="flex items-center justify-between px-6 md:px-12 py-4">
            <div className="flex items-center gap-4">
              <h1 className="text-xl md:text-2xl font-bold text-primary">MuseTera Cursos</h1>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("browse")}
                className="text-muted-foreground hover:text-foreground"
              >
                Ver todos os cursos
              </Button>
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/courses/admin")}
                  className="gap-2"
                >
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Gerenciar</span>
                </Button>
              )}
            </div>
          </div>
        </nav>

        {/* Landing Page Sections */}
        <main>
          <LandingHero
            course={featuredCourse}
            onPlay={() => handleCourseClick(featuredCourse)}
            onPurchase={() => handleCoursePurchase(featuredCourse)}
          />
          <SocialProofBar />
          <TargetAudience />
          <BenefitsGrid />
          <CourseModules course={featuredCourse} />
          <TestimonialsCarousel />
          <PricingSection
            course={featuredCourse}
            onPurchase={() => handleCoursePurchase(featuredCourse)}
            onPlay={() => handleCourseClick(featuredCourse)}
          />
          <FAQSection />
          <FinalCTA
            course={featuredCourse}
            onPurchase={() => handleCoursePurchase(featuredCourse)}
            onPlay={() => handleCourseClick(featuredCourse)}
          />
          <TrustBadges />
        </main>

        {/* Footer */}
        <footer className="py-8 bg-muted/30 border-t border-border">
          <div className="container mx-auto px-6 md:px-12 text-center text-muted-foreground text-sm">
            <p>© 2024 MuseTera Cursos. Todos os direitos reservados.</p>
          </div>
        </footer>

        {/* Modals */}
        <CoursePreviewModal
          course={selectedCourse}
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          onPlay={() => {
            setShowPreviewModal(false);
            if (selectedCourse) handleCourseClick(selectedCourse);
          }}
          onPurchase={() => {
            setShowPreviewModal(false);
            setShowPurchaseModal(true);
          }}
          hasAccess={selectedCourse ? userAccess.has(selectedCourse.id) || !selectedCourse.price_cents : false}
        />

        <CoursePurchaseModal
          course={selectedCourse}
          isOpen={showPurchaseModal}
          onClose={() => setShowPurchaseModal(false)}
          onSuccess={handlePurchaseSuccess}
        />
      </div>
    );
  }

  // Browse Mode (Netflix-style)
  return (
    <div className="min-h-screen bg-background">
      {/* Fixed navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-background via-background/80 to-transparent">
        <div className="flex items-center justify-between px-6 md:px-12 py-4">
          <div className="flex items-center gap-4 md:gap-8">
            {featuredCourse && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("landing")}
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Voltar</span>
              </Button>
            )}
            <h1 className="text-xl md:text-2xl font-bold text-primary">MuseTera Cursos</h1>
            
            {/* Search on desktop */}
            <div className="hidden md:block relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar cursos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-muted/50 border-muted"
              />
            </div>
          </div>

          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/courses/admin")}
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Gerenciar</span>
            </Button>
          )}
        </div>

        {/* Search on mobile */}
        <div className="md:hidden px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar cursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-muted/50 border-muted"
            />
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="pt-16 md:pt-20">
        {/* Hero Banner */}
        {featuredCourse && (
          <NetflixHero
            course={featuredCourse}
            onPlay={() => handleCourseClick(featuredCourse)}
            onInfo={() => handleCourseInfo(featuredCourse)}
            onPurchase={() => handleCoursePurchase(featuredCourse)}
          />
        )}

        {/* Course rows */}
        <div className="relative -mt-24 z-10 space-y-2 pb-12">
          {coursesByCategory.continueWatching.length > 0 && (
            <CourseRow
              title="Continue Assistindo"
              courses={coursesByCategory.continueWatching}
              onCourseClick={handleCourseClick}
              onCourseInfo={handleCourseInfo}
              onCoursePurchase={handleCoursePurchase}
            />
          )}

          {coursesByCategory.completed.length > 0 && (
            <CourseRow
              title="Cursos Concluídos"
              courses={coursesByCategory.completed}
              onCourseClick={handleCourseClick}
              onCourseInfo={handleCourseInfo}
              onCoursePurchase={handleCoursePurchase}
            />
          )}

          {coursesByCategory.freeCourses.length > 0 && (
            <CourseRow
              title="Cursos Gratuitos"
              courses={coursesByCategory.freeCourses}
              onCourseClick={handleCourseClick}
              onCourseInfo={handleCourseInfo}
              onCoursePurchase={handleCoursePurchase}
            />
          )}

          {coursesByCategory.paidCourses.length > 0 && (
            <CourseRow
              title="Cursos Premium"
              courses={coursesByCategory.paidCourses}
              onCourseClick={handleCourseClick}
              onCourseInfo={handleCourseInfo}
              onCoursePurchase={handleCoursePurchase}
            />
          )}

          {filteredCourses.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <span className="text-6xl mb-4">🎵</span>
              <h2 className="text-xl font-semibold mb-2">Nenhum curso encontrado</h2>
              <p className="text-muted-foreground">
                {searchTerm ? "Tente buscar por outros termos" : "Ainda não há cursos disponíveis"}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <CoursePreviewModal
        course={selectedCourse}
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        onPlay={() => {
          setShowPreviewModal(false);
          if (selectedCourse) handleCourseClick(selectedCourse);
        }}
        onPurchase={() => {
          setShowPreviewModal(false);
          setShowPurchaseModal(true);
        }}
        hasAccess={selectedCourse ? userAccess.has(selectedCourse.id) || !selectedCourse.price_cents : false}
      />

      <CoursePurchaseModal
        course={selectedCourse}
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        onSuccess={handlePurchaseSuccess}
      />
    </div>
  );
}
