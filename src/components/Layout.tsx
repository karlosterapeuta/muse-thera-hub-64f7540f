
import { useEffect, useRef } from "react";
import { PushNotificationManager } from "./notifications/PushNotificationManager";
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
import { logPageView } from "@/utils/activityLogger";
import FloatingChat from "./ai-chat/FloatingChat";
import { UserExpirationWarning } from "./auth/UserExpirationWarning";
import { PendingApprovalScreen } from "./auth/PendingApprovalScreen";
import { useState } from "react";

interface LayoutProps {
  children?: React.ReactNode;
}

const publicRoutes = ["/", "/login", "/reset-password"];

function LayoutContent({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);
  const { toggleSidebar, setOpenMobile, isMobile } = useSidebar();
  const isDashboard = location.pathname === '/dashboard';
  const lastTrackedPath = useRef<string>("");
  const hasAutoOpenedMobile = useRef(false);

  // Auto-open sidebar on mobile when first loading
  useEffect(() => {
    if (isMobile && !hasAutoOpenedMobile.current && !publicRoutes.includes(location.pathname)) {
      hasAutoOpenedMobile.current = true;
      setOpenMobile(true);
    }
  }, [isMobile, setOpenMobile, location.pathname]);

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

  // Track page views
  useEffect(() => {
    const trackPageView = async () => {
      // Skip public routes
      if (publicRoutes.includes(location.pathname)) {
        return;
      }
      
      // Skip if same path (avoid duplicate tracking)
      if (lastTrackedPath.current === location.pathname) {
        return;
      }
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          lastTrackedPath.current = location.pathname;
          await logPageView(session.user.id, location.pathname);
        }
      } catch (error) {
        console.error("Error tracking page view:", error);
      }
    };
    
    trackPageView();
  }, [location.pathname]);

  // Route guard: check authentication and profile status for protected routes
  useEffect(() => {
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

        // Check profile status - use maybeSingle to handle transient RLS timing issues
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('status, expires_at')
          .eq('id', session.user.id)
          .maybeSingle();
        
        if (error) {
          console.error("Error checking profile status:", error);
          return;
        }

        // If profile not found (transient issue), don't log out - just skip
        if (!profile) {
          console.warn("Profile not found, skipping validation (may be transient)");
          return;
        }

        // Handle pending approval
        if (profile?.status === 'pending') {
          setIsPending(true);
          return;
        }

        setIsPending(false);

        const isExpired = profile?.expires_at ? new Date(profile.expires_at) < new Date() : false;
        
        if (profile?.status !== 'active' || isExpired) {
          await supabase.auth.signOut();
          navigate('/login');
          toast({
            title: "Acesso bloqueado",
            description: "Sua conta está desativada. Entre em contato com o administrador.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error validating access:", error);
      }
    };

    validateAccess();
  }, [location.pathname, navigate, toast]);

  if (isPending) {
    return <PendingApprovalScreen />;
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar com push behavior */}
      <Sidebar />
      
      {/* Main content que será empurrado */}
      <div className="flex-1 flex flex-col w-full min-w-0">
        {/* Warning banner for expiring plans */}
        <UserExpirationWarning />
        
        {/* Universal Header com design moderno */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/70 shadow-lg" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          {/* Gradient line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-600 via-blue-500 to-pink-600 animate-gradient shadow-[0_2px_8px_rgba(147,51,234,0.3)]" />
          
          <div className="flex h-20 items-center justify-between px-6 sm:px-8 gap-6">
            {/* Left: Trigger + Logo + Breadcrumbs */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <SidebarTrigger className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 shadow-md transition-all duration-200" />
              
              <HeaderLogo />
              
              <Separator orientation="vertical" className="h-8 hidden lg:block bg-gradient-to-b from-transparent via-border to-transparent" />
              
              <div className="hidden md:block flex-1 overflow-hidden">
                <Breadcrumbs />
              </div>
            </div>
            
            {/* Center: Contextual Info (Dashboard only) */}
            {isDashboard && <HeaderGreeting />}
            
            {/* Right: Actions */}
            <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
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
        <main className="flex-1 overflow-auto bg-background" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          {children || <Outlet />}
        </main>
        
        {/* Footer */}
        <footer className="w-full py-2 text-center text-xs text-muted-foreground border-t bg-transparent" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <div className="w-full px-0">
            © 2025 MuseTera
          </div>
        </footer>
        
        {/* Push Notification Manager */}
        <PushNotificationManager />
        
        {/* Floating Chat Button */}
        <FloatingChat />
      </div>
    </div>
  );
}

export default function Layout({ children }: LayoutProps) {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider defaultOpen={true}>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
}
