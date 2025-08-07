
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { navItems } from "./nav-items";
import "./App.css";
import BasicLayout from "./components/BasicLayout";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import { ErrorBoundary } from "./components/ErrorBoundary";

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
import Sprunki from "./pages/sprunki";
import BoomwhackerHero from "./pages/boomwhacker-hero";
import XylophoneHero from "./pages/xylophone-hero";
import MusicComposer from "./pages/music-composer";
import Songs from "./pages/songs";
import BinauralFrequencies from "./pages/binaural-frequencies";
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
  console.log('App component starting to render');
  
  try {
    return (
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
            <BrowserRouter>
            <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/" element={<BasicLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
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
              <Route path="sprunki" element={<Sprunki />} />
              <Route path="boomwhacker-hero" element={<BoomwhackerHero />} />
              <Route path="xylophone-hero" element={<XylophoneHero />} />
              <Route path="music-composer" element={<MusicComposer />} />
              <Route path="songs" element={<Songs />} />
              <Route path="binaural-frequencies" element={<BinauralFrequencies />} />
              <Route path="hawkins" element={<Hawkins />} />
              <Route path="users" element={<Users />} />
              <Route path="invite-codes" element={<InviteCodes />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          </BrowserRouter>
        </ErrorBoundary>
      </QueryClientProvider>
    );
  } catch (error) {
    console.error('App rendering failed:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Sistema Indisponível
          </h1>
          <p className="text-muted-foreground mb-6">
            Ocorreu um erro ao carregar a aplicação.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Recarregar Página
          </button>
        </div>
      </div>
    );
  }
};

export default App;
