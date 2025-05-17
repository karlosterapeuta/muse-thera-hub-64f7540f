
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import ThemeToggle from "./ThemeToggle";

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        {isMobile ? (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="fixed top-4 sm:top-6 left-4 sm:left-6 z-50 lg:hidden hover:bg-primary/10 transition-colors duration-200 rounded-full w-10 h-10 flex items-center justify-center shadow-md border border-gray-200/80 bg-white/90 backdrop-blur-md hover:scale-105 active:scale-95"
              >
                <Menu className="h-5 w-5 text-primary" />
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
              className="fixed top-4 left-4 z-50 hover:bg-primary/10 transition-colors duration-200 rounded-full w-10 h-10 flex items-center justify-center shadow-md border border-gray-200/80 bg-white/90 backdrop-blur-md hover:scale-105 active:scale-95"
            >
              <Menu className="h-5 w-5 text-primary" />
            </Button>
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetContent side="left" className="p-0 w-72">
                <Sidebar onNavigate={() => setIsOpen(false)} />
              </SheetContent>
            </Sheet>
          </>
        )}
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-background min-h-screen relative overflow-y-auto">
          <div className="fixed top-4 right-4 z-50">
            <ThemeToggle />
          </div>
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Footer */}
      <footer className="w-full py-3 text-center text-sm text-gray-600 border-t border-gray-200 bg-background">
        © 2025 MuseTera. Todos os direitos reservados.
      </footer>
    </div>
  );
}
