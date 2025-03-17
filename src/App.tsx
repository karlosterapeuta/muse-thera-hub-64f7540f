import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/hooks/use-theme";
import { Toaster } from "@/components/ui/sonner";

// Pages
import IndexPage from "@/pages/Index";
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Login";
import PasswordResetPage from "@/pages/Login";
import NewPasswordPage from "@/pages/Login";
import DashboardPage from "@/pages/Dashboard";
import ProfessionalPage from "@/pages/Professional";
import PatientsPage from "@/pages/patients";
import ProcessesPage from "@/pages/processes";
import HawkinsPage from "@/pages/hawkins";
import AnamnesisPage from "@/pages/anamnesis";
import SongsPage from "@/pages/songs";
import MusicalBellsPage from "@/pages/musical-bells";
import ActivitiesPage from "@/pages/activities";

// Finance Pages
import FinancePage from "@/pages/finance";
import FinancialRecordsPage from "@/pages/finance/records";
import FinancialReportsPage from "@/pages/finance/reports";
import ClinicsPage from "@/pages/finance/clinics";

// Process Pages
import EvaluationPage from "@/pages/evaluation";
import TreatmentPlanPage from "@/pages/treatment-plan";
import InterventionPage from "@/pages/intervention";
import ReevaluationPage from "@/pages/reevaluation";
import ReportPage from "@/pages/processes/report";

// User Management Pages
import UsersPage from "@/pages/users";
import InviteCodesPage from "@/pages/InviteCodes";

// Components
import Layout from "@/components/Layout";
import AuthStatusChecker from "@/components/auth/AuthStatusChecker";
import NotFoundPage from "@/pages/NotFound";

import "./App.css";

// Initialize QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  useEffect(() => {
    // Optional: You can add any global initialization logic here
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="museterapia-theme">
        <BrowserRouter>
          <div className="min-h-screen overflow-hidden">
            <Routes>
              <Route index element={<IndexPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/reset-password" element={<PasswordResetPage />} />
              <Route path="/new-password" element={<NewPasswordPage />} />
              <Route element={<AuthStatusChecker />}>
                <Route element={<Layout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/professional" element={<ProfessionalPage />} />
                  <Route path="/patients" element={<PatientsPage />} />
                  <Route path="/processes" element={<ProcessesPage />} />
                  <Route path="/activities" element={<ActivitiesPage />} />
                  <Route path="/hawkins" element={<HawkinsPage />} />
                  <Route path="/songs" element={<SongsPage />} />
                  <Route path="/musical-bells" element={<MusicalBellsPage />} />
                  
                  {/* Finance Routes */}
                  <Route path="/finance" element={<FinancePage />} />
                  <Route path="/finance/records" element={<FinancialRecordsPage />} />
                  <Route path="/finance/reports" element={<FinancialReportsPage />} />
                  <Route path="/finance/clinics" element={<ClinicsPage />} />
                  
                  {/* Anamnesis Route */}
                  <Route path="/anamnesis" element={<AnamnesisPage />} />
                  
                  {/* Intervention Route */}
                  <Route path="/intervention" element={<InterventionPage />} />
                  
                  {/* User Management */}
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/invite-codes" element={<InviteCodesPage />} />
                  
                  {/* Process Routes */}
                  <Route path="/processos/avaliacao" element={<EvaluationPage />} />
                  <Route path="/processos/plano" element={<TreatmentPlanPage />} />
                  <Route path="/processos/reavaliacao" element={<ReevaluationPage />} />
                  <Route path="/processos/relatorio" element={<ReportPage />} />
                </Route>
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
          <Toaster />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
