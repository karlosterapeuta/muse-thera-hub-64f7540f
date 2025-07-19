
import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { navItems } from "./nav-items";
import Layout from "./components/Layout";
import AuthStatusChecker from "./components/auth/AuthStatusChecker";
import { PWAStatus } from "./components/PWAStatus";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import MusicalBells from "./pages/musical-bells";
import BellHero from "./pages/musical-bells/BellHero";

const queryClient = new QueryClient();

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <PWAStatus />
      <PWAInstallPrompt />
      <BrowserRouter>
        <AuthStatusChecker />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/musical-bells" element={<Layout><MusicalBells /></Layout>} />
            <Route path="/bell-hero" element={<Layout><BellHero /></Layout>} />
            <Route path="/" element={<Layout />}>
              {navItems.map(({ to, page: PageComponent }) => (
                <Route 
                  key={to} 
                  path={to} 
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <PageComponent />
                    </Suspense>
                  } 
                />
              ))}
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
