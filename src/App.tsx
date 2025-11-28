
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { navItems } from "./nav-items";
import "./App.css";
import Layout from "./components/Layout";
import { useEffect } from "react";
import { globalCacheManager } from "@/utils/cacheManager";
import InstantAuthChecker from "@/components/auth/InstantAuthChecker";
import AuthStatusChecker from "@/components/auth/AuthStatusChecker";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

// Import all pages dynamically
import Dashboard from "./pages/Dashboard";
import Professional from "./pages/Professional";
import Patients from "./pages/patients";
import Anamnesis from "./pages/anamnesis";
import Processes from "./pages/processes";
import TreatmentPlan from "./pages/treatment-plan";
import MusicotherapyTreatmentPlan from "./pages/musicotherapy-treatment-plan";
import MusicotherapyTreatmentPlans from "./pages/musicotherapy-treatment-plans";
import Intervention from "./pages/intervention";
import InterventionPlans from "./pages/intervention-plans";
import Evaluation from "./pages/evaluation";
import Reevaluation from "./pages/reevaluation";
import Finance from "./pages/finance";
import ScientificArticle from "./pages/scientific-article";
import Activities from "./pages/activities";
import MusicalBells from "./pages/musical-bells";
import BellHero from "./pages/bell-hero";
import TeaHero from "./pages/tea-hero";
import Musicogram from "./pages/musicogram";
import SprunKi from "./pages/SprunKi";
import BoomwhackerHero from "./pages/boomwhacker-hero";
import XylophoneHero from "./pages/xylophone-hero";
import MusicComposer from "./pages/music-composer";
import Songs from "./pages/songs";
import BinauralFrequencies from "./pages/binaural-frequencies";
import ChromeMusicLab from "./pages/ChromeMusicLab";
import Hawkins from "./pages/hawkins";
import Users from "./pages/users";
import InviteCodes from "./pages/InviteCodes";
import DigitalStamp from "./pages/DigitalStamp";
import Install from "./pages/Install";

// Process pages
import MusicoterapiaReport from "./pages/processes/musicoterapia";
import EvolutionReport from "./pages/processes/evolution";
import EvaluationProcess from "./pages/processes/evaluation";
import TeaArticle from "./pages/processes/evaluation/tea-article";
import EvaluationArticle from "./pages/processes/evaluation/article";
import ProcessReport from "./pages/processes/report";
import ProcessReports from "./pages/processes/reports";
import DevolutivaTea from "./pages/processes/devolutiva-tea";

// Finance pages
import FinanceRecords from "./pages/finance/records";
import FinanceReports from "./pages/finance/reports";
import FinanceClinics from "./pages/finance/clinics";

// Activities pages
import ActivityFavorites from "./pages/activities/favorites";
import ActivityCategory from "./pages/activities/category";

// Courses pages
import CoursesPage from "./pages/courses";
import CoursePlayerPage from "./pages/courses/[courseId]";
import CourseAdminPage from "./pages/courses/admin";

// Backup page
import BackupPage from "./pages/backup";

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
    <TooltipProvider>
      <Toaster />
      <PWAInstallPrompt />
      <BrowserRouter>
        <InstantAuthChecker />
        <AuthStatusChecker />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="professional" element={<Professional />} />
            <Route path="patients" element={<Patients />} />
            <Route path="anamnesis/*" element={<Anamnesis />} />
            <Route path="processes" element={<Processes />} />
            <Route path="processes/musicoterapia" element={<MusicoterapiaReport />} />
            <Route path="processes/evolution" element={<EvolutionReport />} />
            <Route path="processes/devolutiva-tea" element={<DevolutivaTea />} />
            <Route path="processes/evaluation" element={<EvaluationProcess />} />
            <Route path="processes/evaluation/tea-article" element={<TeaArticle />} />
            <Route path="processes/evaluation/article" element={<EvaluationArticle />} />
            <Route path="processes/report" element={<ProcessReport />} />
            <Route path="processes/report/:id" element={<ProcessReport />} />
            <Route path="processes/reports" element={<ProcessReports />} />
            <Route path="treatment-plan" element={<TreatmentPlan />} />
            <Route path="musicotherapy-treatment-plans" element={<MusicotherapyTreatmentPlans />} />
            <Route path="musicotherapy-treatment-plan" element={<MusicotherapyTreatmentPlan />} />
            <Route path="musicotherapy-treatment-plan/:id" element={<MusicotherapyTreatmentPlan />} />
            <Route path="intervention" element={<Intervention />} />
            <Route path="intervention-plans" element={<InterventionPlans />} />
            <Route path="evaluation" element={<Evaluation />} />
            <Route path="reevaluation" element={<Reevaluation />} />
            <Route path="finance" element={<Finance />} />
            <Route path="finance/records" element={<FinanceRecords />} />
            <Route path="finance/reports" element={<FinanceReports />} />
            <Route path="finance/clinics" element={<FinanceClinics />} />
            <Route path="scientific-article" element={<ScientificArticle />} />
            <Route path="activities" element={<Activities />} />
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
            <Route path="backup" element={<BackupPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
