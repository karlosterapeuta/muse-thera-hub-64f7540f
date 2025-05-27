
import { lazy } from "react";

// Lazy load pages for better performance
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Professional = lazy(() => import("./pages/Professional"));
const Patients = lazy(() => import("./pages/patients"));
const Processes = lazy(() => import("./pages/processes"));
const Activities = lazy(() => import("./pages/activities"));
const MusicComposer = lazy(() => import("./pages/music-composer"));
const TeaHero = lazy(() => import("./pages/tea-hero"));
const BinaralFrequencies = lazy(() => import("./pages/binaural-frequencies"));
const Finance = lazy(() => import("./pages/finance"));
const Users = lazy(() => import("./pages/users"));
const InviteCodes = lazy(() => import("./pages/InviteCodes"));
const Anamnesis = lazy(() => import("./pages/anamnesis"));
const Evaluation = lazy(() => import("./pages/evaluation"));
const TreatmentPlan = lazy(() => import("./pages/treatment-plan"));
const Intervention = lazy(() => import("./pages/intervention"));
const Reevaluation = lazy(() => import("./pages/reevaluation"));
const ProcessReports = lazy(() => import("./pages/processes/reports"));
const ReportForm = lazy(() => import("./pages/processes/report"));
const Login = lazy(() => import("./pages/Login"));

export const navItems = [
  { to: "/", page: <Dashboard /> },
  { to: "/dashboard", page: <Dashboard /> },
  { to: "/professional", page: <Professional /> },
  { to: "/patients", page: <Patients /> },
  { to: "/processes", page: <Processes /> },
  { to: "/activities", page: <Activities /> },
  { to: "/music-composer", page: <MusicComposer /> },
  { to: "/tea-hero", page: <TeaHero /> },
  { to: "/binaural-frequencies", page: <BinaralFrequencies /> },
  { to: "/finance", page: <Finance /> },
  { to: "/users", page: <Users /> },
  { to: "/invite-codes", page: <InviteCodes /> },
  { to: "/anamnesis", page: <Anamnesis /> },
  { to: "/evaluation", page: <Evaluation /> },
  { to: "/treatment-plan", page: <TreatmentPlan /> },
  { to: "/intervention", page: <Intervention /> },
  { to: "/reevaluation", page: <Reevaluation /> },
  { to: "/processes/reports", page: <ProcessReports /> },
  { to: "/processes/report", page: <ReportForm /> },
  { to: "/login", page: <Login /> },
];
