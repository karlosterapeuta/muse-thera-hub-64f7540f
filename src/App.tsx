
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { navItems } from "./nav-items";
import Layout from "./components/Layout";

// Lazy load pages for better performance
const BellHero = lazy(() => import("./pages/bell-hero"));
const XylophoneHero = lazy(() => import("./pages/xylophone-hero"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {navItems.map(({ to, page }) => (
              <Route key={to} path={to} element={<Layout>{page}</Layout>} />
            ))}
            <Route path="/bell-hero" element={<Layout><BellHero /></Layout>} />
            <Route path="/xylophone-hero" element={<Layout><XylophoneHero /></Layout>} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
