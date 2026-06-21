
import { Toaster } from "@/components/ui/sonner";
import { Toaster as ShadcnToaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import { useEffect, lazy, Suspense } from "react";
import { globalCacheManager } from "@/utils/cacheManager";
// Auth state validation is centralized in Layout.tsx to avoid token refresh storms
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { PWAInstallProvider } from "@/contexts/PWAInstallContext";

// Eager: rotas críticas de entrada
import Index from "./pages/Index";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

// Lazy: demais páginas (code-splitting por rota)
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Professional = lazy(() => import("./pages/Professional"));
const Patients = lazy(() => import("./pages/patients"));
const Anamnesis = lazy(() => import("./pages/anamnesis"));
const Processes = lazy(() => import("./pages/processes"));
const TreatmentPlan = lazy(() => import("./pages/treatment-plan"));
const MusicotherapyTreatmentPlan = lazy(() => import("./pages/musicotherapy-treatment-plan"));
const MusicotherapyTreatmentPlans = lazy(() => import("./pages/musicotherapy-treatment-plans"));
const PtiList = lazy(() => import("./pages/pti"));
const PtiEditor = lazy(() => import("./pages/pti/editor"));
const PtiReavaliacao = lazy(() => import("./pages/pti/reavaliacao"));
const Intervention = lazy(() => import("./pages/intervention"));
const InterventionPlans = lazy(() => import("./pages/intervention-plans"));
const Evaluation = lazy(() => import("./pages/evaluation"));
const PatientEvolution = lazy(() => import("./pages/evaluation/patient-evolution"));
const Reevaluation = lazy(() => import("./pages/reevaluation"));
const Finance = lazy(() => import("./pages/finance"));
const ScientificArticle = lazy(() => import("./pages/scientific-article"));
const Activities = lazy(() => import("./pages/activities"));
const MusicalBells = lazy(() => import("./pages/musical-bells"));
const BellHero = lazy(() => import("./pages/bell-hero"));
const TeaHero = lazy(() => import("./pages/tea-hero"));
const Musicogram = lazy(() => import("./pages/musicogram"));
const SprunKi = lazy(() => import("./pages/SprunKi"));
const BoomwhackerHero = lazy(() => import("./pages/boomwhacker-hero"));
const XylophoneHero = lazy(() => import("./pages/xylophone-hero"));
const MusicComposer = lazy(() => import("./pages/music-composer"));
const Songs = lazy(() => import("./pages/songs"));
const BinauralFrequencies = lazy(() => import("./pages/binaural-frequencies"));
const ChromeMusicLab = lazy(() => import("./pages/ChromeMusicLab"));
const Hawkins = lazy(() => import("./pages/hawkins"));
const Users = lazy(() => import("./pages/users"));
const InviteCodes = lazy(() => import("./pages/InviteCodes"));
const DigitalStamp = lazy(() => import("./pages/DigitalStamp"));
const PatientHistory = lazy(() => import("./pages/patient-history"));
const Install = lazy(() => import("./pages/Install"));
const PublicAnamnesis = lazy(() => import("./pages/PublicAnamnesis"));

// Process pages
const MusicoterapiaReport = lazy(() => import("./pages/processes/musicoterapia"));
const EvolutionReport = lazy(() => import("./pages/processes/evolution"));
const TeaArticle = lazy(() => import("./pages/evaluation/tea-article"));
const EvaluationArticle = lazy(() => import("./pages/evaluation/article"));
const ProcessReport = lazy(() => import("./pages/processes/report"));
const ProcessReports = lazy(() => import("./pages/processes/reports"));
const DevolutivaTea = lazy(() => import("./pages/processes/devolutiva-tea"));

// Finance pages
const FinanceRecords = lazy(() => import("./pages/finance/records"));
const FinanceReports = lazy(() => import("./pages/finance/reports"));
const FinanceClinics = lazy(() => import("./pages/finance/clinics"));
const ReceiptsList = lazy(() => import("./pages/finance/receipts"));
const VerifyReceipt = lazy(() => import("./pages/verify-receipt"));

// Activities pages
const ActivityFavorites = lazy(() => import("./pages/activities/favorites"));
const ActivityCategory = lazy(() => import("./pages/activities/category"));
const ProfessionalActivitiesPage = lazy(() => import("./pages/activities/ProfessionalActivitiesPage"));

// Courses pages
const CoursesPage = lazy(() => import("./pages/courses"));
const CoursePlayerPage = lazy(() => import("./pages/courses/[courseId]"));
const CreatorDashboardAdmin = lazy(() => import("./pages/courses/admin/creator/[creatorId]"));
const CourseAdminPage = lazy(() => import("./pages/courses/admin"));

// Backup page
const BackupPage = lazy(() => import("./pages/backup"));

// AI Assistant
const AIAssistant = lazy(() => import("./pages/ai-assistant"));

// Resources
const Resources = lazy(() => import("./pages/Resources"));
const OrquestraAnimal = lazy(() => import("./pages/orquestra-animal"));
const DinoRitmos = lazy(() => import("./pages/dino-ritmos"));
const VagasEmbed = lazy(() => import("./pages/VagasEmbed"));

// Creator pages (separate from MuseTera)
const CreatorLoginPage = lazy(() => import("./pages/creator/login"));
const CreatorRegisterPage = lazy(() => import("./pages/creator/register"));
const CreatorDashboardPage = lazy(() => import("./pages/creator/dashboard"));
const CreatorCoursePreview = lazy(() => import("./pages/creator/course-preview"));

// Captação de Pacientes
const CaptacaoModule = lazy(() => import("./pages/captacao/CaptacaoModule"));
const EncontrarMusicoterapeuta = lazy(() => import("./pages/public/EncontrarMusicoterapeuta"));
const PerfilPublicoPage = lazy(() => import("./pages/public/PerfilPublicoPage"));
const SeoLandingPage = lazy(() => import("./pages/public/SeoLandingPage"));


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  useEffect(() => {
    // Initialize cache namespaces (reduced initial operations)
    globalCacheManager.initCache('audio');
    globalCacheManager.initCache('melodies');
    globalCacheManager.initCache('sounds');
    globalCacheManager.initCache('api');
    globalCacheManager.initCache('user-data');

    // Defer initial cleanup to avoid blocking UI
    setTimeout(() => {
      const cleaned = globalCacheManager.cleanup();
      if (cleaned > 0) {
        console.log(`🧹 Deferred cache cleanup: removed ${cleaned} expired items`);
      }
    }, 2000);

    // Cleanup on page unload
    const handleBeforeUnload = () => {
      globalCacheManager.performFullCleanup();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      globalCacheManager.dispose();
    };
  }, []);


  return (
  <QueryClientProvider client={queryClient}>
    <PWAInstallProvider>
      <TooltipProvider>
        <Toaster />
        <ShadcnToaster />
        
        <BrowserRouter>
        <Suspense fallback={<div className="flex h-dvh w-full items-center justify-center bg-background"><div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/verify-receipt/:id" element={<VerifyReceipt />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/anamnese-publica/:token" element={<PublicAnamnesis />} />
          <Route path="/creator-login" element={<CreatorLoginPage />} />
          <Route path="/creator-register" element={<CreatorRegisterPage />} />
          <Route path="/creator-dashboard" element={<CreatorDashboardPage />} />
          <Route path="/creator-course-preview/:courseId" element={<CreatorCoursePreview />} />
          <Route path="/encontrar-musicoterapeuta" element={<EncontrarMusicoterapeuta />} />
          <Route path="/profissional/:slug" element={<PerfilPublicoPage />} />
          <Route path="/musicoterapeuta/:slug" element={<PerfilPublicoPage />} />
          <Route path="/musicoterapia/:slug" element={<SeoLandingPage />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/login" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="captacao" element={<CaptacaoModule />} />
            <Route path="professional" element={<Professional />} />
            <Route path="patients" element={<Patients />} />
            <Route path="patient-history" element={<PatientHistory />} />
            <Route path="anamnesis/*" element={<Anamnesis />} />
            <Route path="processes" element={<Processes />} />
            <Route path="processes/musicoterapia" element={<MusicoterapiaReport />} />
            <Route path="processes/evolution" element={<EvolutionReport />} />
            <Route path="processes/devolutiva-tea" element={<DevolutivaTea />} />
            <Route path="processes/report" element={<ProcessReport />} />
            <Route path="processes/report" element={<ProcessReport />} />
            <Route path="processes/report/:id" element={<ProcessReport />} />
            <Route path="processes/reports" element={<ProcessReports />} />
            <Route path="pti" element={<PtiList />} />
            <Route path="pti/:id/reavaliacao" element={<PtiReavaliacao />} />
            <Route path="pti/:id" element={<PtiEditor />} />
            <Route path="treatment-plan" element={<TreatmentPlan />} />
            <Route path="musicotherapy-treatment-plans" element={<MusicotherapyTreatmentPlans />} />
            <Route path="musicotherapy-treatment-plan" element={<MusicotherapyTreatmentPlan />} />
            <Route path="musicotherapy-treatment-plan/:id" element={<MusicotherapyTreatmentPlan />} />
            <Route path="intervention" element={<Intervention />} />
            <Route path="intervention-plans" element={<InterventionPlans />} />
            <Route path="evaluation" element={<Evaluation />} />
            <Route path="evaluation/article" element={<EvaluationArticle />} />
            <Route path="evaluation/tea-article" element={<TeaArticle />} />
            <Route path="reevaluation" element={<Reevaluation />} />
            <Route path="finance" element={<Finance />} />
            <Route path="finance/records" element={<FinanceRecords />} />
            <Route path="finance/reports" element={<FinanceReports />} />
            <Route path="finance/clinics" element={<FinanceClinics />} />
            <Route path="finance/receipt-profile" element={<Navigate to="/finance/receipts?tab=emissor" replace />} />
            <Route path="finance/receipts" element={<ReceiptsList />} />
            <Route path="scientific-article" element={<ScientificArticle />} />
            <Route path="activities" element={<ProfessionalActivitiesPage />} />
            <Route path="activities/explore" element={<Activities />} />
            <Route path="activities/favorites" element={<ActivityFavorites />} />
            <Route path="activities/category/:categoryId" element={<ActivityCategory />} />
            <Route path="musical-bells" element={<MusicalBells />} />
            <Route path="bell-hero" element={<BellHero />} />
            <Route path="tea-hero" element={<TeaHero />} />
            <Route path="musicogram" element={<Musicogram />} />
            <Route path="sprunki" element={<SprunKi />} />
            <Route path="boomwhacker-hero" element={<BoomwhackerHero />} />
            <Route path="xylophone-hero" element={<XylophoneHero />} />
            <Route path="music-composer" element={<MusicComposer />} />
            <Route path="songs" element={<Songs />} />
            <Route path="binaural-frequencies" element={<BinauralFrequencies />} />
            <Route path="chrome-music-lab" element={<ChromeMusicLab />} />
            <Route path="hawkins" element={<Hawkins />} />
            <Route path="users" element={<Users />} />
            <Route path="invite-codes" element={<InviteCodes />} />
          <Route path="digital-stamp" element={<DigitalStamp />} />
            <Route path="install" element={<Install />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="courses/:courseId" element={<CoursePlayerPage />} />
            <Route path="courses/admin" element={<CourseAdminPage />} />
            <Route path="courses/admin/creator/:creatorId" element={<CreatorDashboardAdmin />} />
            <Route path="backup" element={<BackupPage />} />
            <Route path="ai-assistant" element={<AIAssistant />} />
            <Route path="resources" element={<Resources />} />
            <Route path="orquestra-animal" element={<OrquestraAnimal />} />
            <Route path="dino-ritmos" element={<DinoRitmos />} />
            <Route path="vagas" element={<VagasEmbed />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        </Suspense>
      </BrowserRouter>
      </TooltipProvider>
    </PWAInstallProvider>
  </QueryClientProvider>
  );
};

export default App;
