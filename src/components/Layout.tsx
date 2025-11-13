
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import ThemeToggle from "./ThemeToggle";

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Open sidebar by default on desktop for dashboard page
  const isDashboard = location.pathname === '/dashboard';
  const [isOpen, setIsOpen] = useState(!isMobile && isDashboard);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 relative gap-0 items-stretch overflow-hidden">
        {isMobile ? (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="fixed top-2 sm:top-4 left-2 sm:left-4 z-50 lg:hidden group relative overflow-hidden transition-all duration-500 ease-out rounded-full w-12 h-12 sm:w-14 sm:h-14 border-0 bg-gradient-to-br from-primary/90 via-primary to-primary/80 hover:from-primary hover:to-primary/90 shadow-2xl hover:shadow-primary/30 backdrop-blur-xl transform hover:scale-110 sm:hover:scale-125 active:scale-95 hover:rotate-3 hover:-translate-y-1"
              >
                {/* Efeito de brilho animado */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300" />
                
                {/* Anéis decorativos */}
                <div className="absolute inset-0 rounded-full border-2 border-white/40 group-hover:border-white/60 transition-colors duration-300" />
                <div className="absolute -inset-1 rounded-full border border-primary/20 group-hover:border-primary/40 animate-pulse" />
                
                <Menu className="h-6 w-6 sm:h-7 sm:w-7 text-white drop-shadow-lg relative z-10 group-hover:text-primary-foreground transition-colors duration-300" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 border-0 shadow-none rounded-none">
              <Sidebar onNavigate={() => setIsOpen(false)} />
            </SheetContent>
          </Sheet>
        ) : (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="fixed top-2 sm:top-4 left-2 sm:left-4 z-50 group relative overflow-hidden transition-all duration-500 ease-out rounded-full w-12 h-12 sm:w-14 sm:h-14 border-0 bg-gradient-to-br from-primary/90 via-primary to-primary/80 hover:from-primary hover:to-primary/90 shadow-2xl hover:shadow-primary/30 backdrop-blur-xl transform hover:scale-110 sm:hover:scale-125 active:scale-95 hover:rotate-3 hover:-translate-y-1"
            >
              {/* Efeito de brilho animado */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300" />
              
              {/* Anéis decorativos */}
              <div className="absolute inset-0 rounded-full border-2 border-white/40 group-hover:border-white/60 transition-colors duration-300" />
              <div className="absolute -inset-1 rounded-full border border-primary/20 group-hover:border-primary/40 animate-pulse" />
              
              <Menu className="h-6 w-6 sm:h-7 sm:w-7 text-white drop-shadow-lg relative z-10 group-hover:text-primary-foreground transition-colors duration-300" />
            </Button>
            
            {isOpen && (
              <aside className="shrink-0 m-0 p-0">
                <Sidebar onNavigate={() => setIsOpen(false)} />
              </aside>
            )}
          </>
        )}
        <main className="flex-1 w-full m-0 px-0 py-0 bg-background min-h-screen relative overflow-x-hidden overflow-y-auto scroll-container lg:-ml-px">
          <div className="fixed top-2 sm:top-4 right-2 sm:right-4 z-50">
            <ThemeToggle />
          </div>
          <div className="w-full max-w-none pt-0">
            {children || <Outlet />}
          </div>
        </main>
      </div>
      
      {/* Footer */}
        <footer className="w-full py-2 text-center text-xs text-muted-foreground border-t bg-background/80">
          <div className="w-full px-0">
            © 2025 MuseTera
          </div>
        </footer>
    </div>
  );
}
