
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Breadcrumbs } from "./Breadcrumbs";
import { useIsMobile } from "@/hooks/use-mobile";
import { HeaderLogo } from "./header/HeaderLogo";
import { HeaderGreeting } from "./header/HeaderGreeting";
import { HeaderTime } from "./header/HeaderTime";
import { NotificationBell } from "./header/NotificationBell";
import { ProfessionalAvatar } from "./ProfessionalAvatar";
import ThemeToggle from "./ThemeToggle";
import { Separator } from "./ui/separator";

interface LayoutProps {
  children?: React.ReactNode;
}

function LayoutContent({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { toggleSidebar } = useSidebar();
  const isDashboard = location.pathname === '/dashboard';

  // Atalho de teclado Ctrl+B / Cmd+B para toggle do sidebar
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [toggleSidebar]);

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
    <div className="flex min-h-screen w-full">
      {/* Sidebar com push behavior */}
      <Sidebar />
      
      {/* Main content que será empurrado */}
      <div className="flex-1 flex flex-col w-full min-w-0">
        {/* Universal Header com design moderno */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
          {/* Gradient line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-blue-500 to-pink-600 animate-gradient" />
          
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 gap-4">
            {/* Left: Trigger + Logo + Breadcrumbs */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <SidebarTrigger className="relative hover:bg-muted/50 transition-all duration-300" />
              </div>
              
              <HeaderLogo />
              
              <Separator orientation="vertical" className="h-6 hidden lg:block" />
              
              <div className="hidden md:block flex-1 overflow-hidden">
                <Breadcrumbs />
              </div>
            </div>
            
            {/* Center: Contextual Info (Dashboard only) */}
            {isDashboard && <HeaderGreeting />}
            
            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <HeaderTime />
              <NotificationBell />
              <ThemeToggle />
              <ProfessionalAvatar size="sm" />
            </div>
          </div>
          
          {/* Shadow bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </header>
        
        {/* Conteúdo principal */}
        <main className="flex-1 overflow-auto">
          {children || <Outlet />}
        </main>
        
        {/* Footer */}
        <footer className="w-full py-2 text-center text-xs text-muted-foreground border-t bg-background/80">
          <div className="w-full px-0">
            © 2025 MuseTera
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function Layout({ children }: LayoutProps) {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
}
