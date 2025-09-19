
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { navItems } from "./nav-items";
import "./App.css";
import Layout from "./components/Layout";
import { useEffect } from "react";
import { globalCacheManager } from "@/utils/cacheManager";
import InstantAuthChecker from "@/components/auth/InstantAuthChecker";
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
import Intervention from "./pages/intervention";
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

// Process pages
import MusicoterapiaReport from "./pages/processes/musicoterapia";
import EvolutionReport from "./pages/processes/evolution";
import EvaluationProcess from "./pages/processes/evaluation";
import TeaArticle from "./pages/processes/evaluation/tea-article";
import EvaluationArticle from "./pages/processes/evaluation/article";
import ProcessReport from "./pages/processes/report";
import ProcessReports from "./pages/processes/reports";

// Finance pages
import FinanceRecords from "./pages/finance/records";
import FinanceReports from "./pages/finance/reports";
import FinanceClinics from "./pages/finance/clinics";

// Activities pages
import ActivityFavorites from "./pages/activities/favorites";
import ActivityCategory from "./pages/activities/category";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize cache namespaces
    globalCacheManager.initCache('audio');
    globalCacheManager.initCache('melodies');
    globalCacheManager.initCache('sounds');
    globalCacheManager.initCache('api');
    globalCacheManager.initCache('user-data');

    // Perform initial cleanup on app start
    const cleaned = globalCacheManager.cleanup();
    globalCacheManager.cleanWebStorage();
    
    if (cleaned > 0) {
      console.log(`🧹 Initial cache cleanup: removed ${cleaned} expired items`);
    }

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
      <InstantAuthChecker />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="professional" element={<Professional />} />
            <Route path="patients" element={<Patients />} />
            <Route path="anamnesis/*" element={<Anamnesis />} />
            <Route path="processes" element={<Processes />} />
            <Route path="processes/musicoterapia" element={<MusicoterapiaReport />} />
            <Route path="processes/evolution" element={<EvolutionReport />} />
            <Route path="processes/evaluation" element={<EvaluationProcess />} />
            <Route path="processes/evaluation/tea-article" element={<TeaArticle />} />
            <Route path="processes/evaluation/article" element={<EvaluationArticle />} />
            <Route path="processes/report" element={<ProcessReport />} />
            <Route path="processes/report/:id" element={<ProcessReport />} />
            <Route path="processes/reports" element={<ProcessReports />} />
            <Route path="treatment-plan" element={<TreatmentPlan />} />
            <Route path="intervention" element={<Intervention />} />
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
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
