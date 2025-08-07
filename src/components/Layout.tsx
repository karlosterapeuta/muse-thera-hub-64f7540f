
import React, { useState, Suspense } from "react";
import { Outlet } from "react-router-dom";
import { SafeTooltipProvider } from "./SafeTooltipProvider";
import Sidebar from "./Sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import ThemeToggle from "./ThemeToggle";
import { Toaster } from "@/components/ui/sonner";

interface LayoutProps {
  children?: React.ReactNode;
}

const SafeLayoutContent: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Safe mobile detection with fallback
  let isMobile = false;
  try {
    isMobile = useIsMobile();
  } catch (error) {
    console.warn('Failed to detect mobile, using fallback:', error);
    isMobile = window.innerWidth < 768;
  }

  return (
    <SafeTooltipProvider>
      <Toaster />
      <div className="flex min-h-screen flex-col">
        <div className="flex flex-1 relative">
          {isMobile ? (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="fixed top-4 sm:top-6 left-4 sm:left-6 z-50 lg:hidden hover:bg-primary/10 transition-all duration-300 rounded-full w-12 h-12 flex items-center justify-center shadow-lg border border-white/20 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl hover:scale-110 active:scale-95"
                >
                  <Menu className="h-6 w-6 text-primary" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72">
                <Sidebar onNavigate={() => setIsOpen(false)} />
              </SheetContent>
            </Sheet>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 left-4 z-50 hover:bg-primary/10 transition-all duration-300 rounded-full w-12 h-12 flex items-center justify-center shadow-lg border border-white/20 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl hover:scale-110 active:scale-95"
              >
                <Menu className="h-6 w-6 text-primary" />
              </Button>
              
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetContent side="left" className="p-0 w-72">
                  <Sidebar onNavigate={() => setIsOpen(false)} />
                </SheetContent>
              </Sheet>
            </>
          )}
          <main className="flex-1 p-4 md:p-6 lg:p-8 bg-background min-h-screen relative overflow-y-auto scroll-container">
            <div className="fixed top-4 right-4 z-50">
              <ThemeToggle />
            </div>
            <div className="max-w-7xl mx-auto pt-16 sm:pt-20">
              {children || <Outlet />}
            </div>
          </main>
        </div>
        
        {/* Footer */}
        <footer className="w-full py-4 text-center text-sm text-muted-foreground border-t bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            © 2025 MuseTera • Plataforma de Musicoterapia
          </div>
        </footer>
      </div>
    </SafeTooltipProvider>
  );
};

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-foreground">Carregando...</div>
  </div>
);

export default function Layout({ children }: LayoutProps) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SafeLayoutContent children={children} />
    </Suspense>
  );
}
