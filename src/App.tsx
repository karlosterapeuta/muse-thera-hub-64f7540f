
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Professional from "./pages/Professional";
import Processes from "./pages/processes";
import Evaluation from "./pages/evaluation";
import AnamnesisForm from "./pages/anamnesis";
import Patients from "./pages/patients";
import TreatmentPlanForm from "./pages/treatment-plan";
import InterventionForm from "./pages/intervention";
import ReevaluationForm from "./pages/reevaluation";
import ReportPage from "./pages/processes/report";
import ReportsPage from "./pages/processes/reports";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import InviteCodes from "./pages/InviteCodes";
import Users from "./pages/users";
import HawkinsScale from "./pages/hawkins";
import SongsPage from "./pages/songs";
import MusicalBells from "./pages/musical-bells";
import AuthStatusChecker from "./components/auth/AuthStatusChecker";
import "./App.css";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: (
      <>
        <Layout />
        <AuthStatusChecker />
      </>
    ),
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/professional",
        element: <Professional />,
      },
      {
        path: "/patients",
        element: <Patients />,
      },
      {
        path: "/processes",
        element: <Processes />,
      },
      {
        path: "/processos/avaliacao",
        element: <Evaluation />,
      },
      {
        path: "/anamnesis",
        element: <AnamnesisForm />,
      },
      {
        path: "/processos/plano",
        element: <TreatmentPlanForm />,
      },
      {
        path: "/intervention",
        element: <InterventionForm />,
      },
      {
        path: "/processos/reavaliacao",
        element: <ReevaluationForm />,
      },
      {
        path: "/processos/relatorios",
        element: <ReportsPage />,
      },
      {
        path: "/processos/relatorio",
        element: <ReportPage />,
      },
      {
        path: "/invite-codes",
        element: <InviteCodes />,
      },
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/hawkins",
        element: <HawkinsScale />,
      },
      {
        path: "/songs",
        element: <SongsPage />,
      },
      {
        path: "/musical-bells",
        element: <MusicalBells />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <RouterProvider router={router} />
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
