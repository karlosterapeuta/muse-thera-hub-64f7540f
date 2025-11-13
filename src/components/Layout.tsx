
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TopHeader } from "./TopHeader";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

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
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        {/* Sidebar com push behavior */}
        <Sidebar />
        
        {/* Main content que será empurrado */}
        <div className="flex-1 flex flex-col w-full">
          {/* Header fixo com botão do menu e theme toggle */}
          <TopHeader />
          
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
    </SidebarProvider>
  );
}
