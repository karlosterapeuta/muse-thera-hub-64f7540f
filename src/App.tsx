
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";
import Professional from "./pages/Professional";
import Processes from "./pages/processes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/professional" element={<Professional />} />
            <Route path="/patients" element={<div>Patients</div>} />
            <Route path="/processes" element={<Processes />} />
            <Route path="/hawkins" element={<div>Hawkins</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
