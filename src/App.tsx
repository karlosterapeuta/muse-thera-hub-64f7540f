
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { navItems } from "./nav-items";
import Layout from "./components/Layout";
import AuthStatusChecker from "./components/auth/AuthStatusChecker";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import MusicalBells from "./pages/musical-bells";
import BellHero from "./pages/musical-bells/BellHero";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthStatusChecker />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/musical-bells" element={<Layout><MusicalBells /></Layout>} />
          <Route path="/bell-hero" element={<Layout><BellHero /></Layout>} />
          <Route path="/" element={<Layout />}>
            {navItems.map(({ to, page }) => (
              <Route key={to} path={to} element={page} />
            ))}
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
