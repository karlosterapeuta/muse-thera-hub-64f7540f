
import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import ThemeToggle from "./ThemeToggle";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const [isOpen, setIsOpen] = useState(false);

  // Route guard: check authentication and profile status for protected routes
  useEffect(() => {
    const publicRoutes = ["/", "/login", "/reset-password"];
    
    // Skip validation for public routes
    if (publicRoutes.includes(location.pathname)) {
      return;
    }

    const validateAccess = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        // If no session, redirect to login
        if (!session?.user) {
          navigate('/login');
          return;
        }

        // Check profile status
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('status, expires_at')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error("Error checking profile status:", error);
          return;
        }

        const isExpired = profile?.expires_at ? new Date(profile.expires_at) < new Date() : false;
        
        if (profile?.status !== 'active' || isExpired) {
          await supabase.auth.signOut();
          navigate('/login');
          toast({
            title: "Acesso bloqueado - Pagamento pendente",
            description: "Sua conta está desativada por falta de pagamento. Regularize para voltar a usar o sistema.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error validating access:", error);
      }
    };

    validateAccess();
  }, [location.pathname, navigate, toast]);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 relative gap-0 px-0 mx-0">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-2 sm:top-4 left-2 sm:left-4 z-[100] group relative overflow-hidden transition-all duration-500 ease-out rounded-full w-12 h-12 sm:w-14 sm:h-14 border-0 bg-gradient-to-br from-primary/90 via-primary to-primary/80 hover:from-primary hover:to-primary/90 shadow-2xl hover:shadow-primary/30 backdrop-blur-xl transform hover:scale-110 sm:hover:scale-125 active:scale-95 hover:rotate-3 hover:-translate-y-1"
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
        <main className="flex-1 w-full px-0 py-0 bg-background min-h-screen relative overflow-x-hidden overflow-y-auto scroll-container">
          <div className="fixed top-2 sm:top-4 right-2 sm:right-4 z-50">
            <ThemeToggle />
          </div>
          <div className="w-full max-w-none pt-0 px-0 mx-0">
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
