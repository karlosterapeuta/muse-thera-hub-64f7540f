import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function InstantAuthChecker() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log("🚨 InstantAuthChecker: Setting up immediate auth state monitoring...");
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔐 Auth state changed:", event, session?.user?.id);
      
      // Only check on SIGNED_IN events
      if (event === 'SIGNED_IN' && session?.user) {
        console.log("✅ User signed in, checking status immediately...");
        
        try {
          // Check user profile status immediately
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('status, expires_at')
            .eq('id', session.user.id)
            .single();
          
          if (error) {
            console.error("❌ Error checking profile status:", error);
            return;
          }
          
          console.log("📋 Profile status check:", {
            userId: session.user.id,
            status: profile?.status,
            expires_at: profile?.expires_at
          });
          
          // Check if user is expired
          const isExpired = profile?.expires_at ? new Date(profile.expires_at) < new Date() : false;
          
          // If user is inactive or expired, immediately sign out
          if (profile?.status !== 'active' || isExpired) {
            console.log("🚫 User is inactive or expired, forcing immediate logout...");
            
            // Sign out immediately
            await supabase.auth.signOut();
            
            // Navigate to login
            navigate("/login");
            
            // Show appropriate message
            toast({
              title: isExpired ? "Acesso expirado" : "Conta desativada",
              description: isExpired 
                ? "Seu período de acesso ao sistema expirou. Entre em contato com o administrador para renovar."
                : "Sua conta foi desativada. Entre em contato com o administrador.",
              variant: "destructive",
            });
            
            return;
          }
          
          console.log("✅ User status is active, allowing access");
          
        } catch (error) {
          console.error("❌ Error in instant auth check:", error);
        }
      }
    });
    
    return () => {
      console.log("🔌 InstantAuthChecker: Cleaning up subscription");
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  // This component renders nothing
  return null;
}