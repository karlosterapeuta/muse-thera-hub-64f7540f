
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children?: React.ReactNode;
}

const SafeLayoutContent: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Simple mobile detection without custom hooks
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 relative">
        {isMobile ? (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="fixed top-4 sm:top-6 left-4 sm:left-6 z-50 lg:hidden"
              >
                <Menu className="h-6 w-6" />
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
              className="fixed top-4 left-4 z-50"
            >
              <Menu className="h-6 w-6" />
            </Button>
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetContent side="left" className="p-0 w-72">
                <Sidebar onNavigate={() => setIsOpen(false)} />
              </SheetContent>
            </Sheet>
          </>
        )}
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-background min-h-screen relative overflow-y-auto">
          <div className="max-w-7xl mx-auto pt-16 sm:pt-20">
            {children || <Outlet />}
          </div>
        </main>
      </div>
      
      <footer className="w-full py-4 text-center text-sm text-muted-foreground border-t bg-background/80">
        <div className="container mx-auto px-4">
          © 2025 MuseTera • Plataforma de Musicoterapia
        </div>
      </footer>
    </div>
  );
};

export default function Layout({ children }: LayoutProps) {
  return <SafeLayoutContent children={children} />;
}
