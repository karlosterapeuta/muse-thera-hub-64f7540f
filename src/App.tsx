
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Professional from "./pages/Professional";
import Processes from "./pages/processes";
import AnamnesisForm from "./pages/anamnesis";
import InterventionForm from "./pages/intervention";
import ReportPage from "./pages/processes/report";
import ReportsPage from "./pages/processes/reports";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import Index from "./pages/Index";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <Layout />,
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
        path: "/processes",
        element: <Processes />,
      },
      {
        path: "/anamnesis",
        element: <AnamnesisForm />,
      },
      {
        path: "/intervention",
        element: <InterventionForm />,
      },
      {
        path: "/processos/relatorios",
        element: <ReportsPage />,
      },
      {
        path: "/processos/relatorio",
        element: <ReportPage />,
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
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
