import { useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { globalCacheManager } from "@/utils/cacheManager";

// Cache for profile status to avoid repeated requests
const profileStatusCache = new Map<string, { status: string; expires_at: string | null; timestamp: number }>();
const CACHE_DURATION = 1 * 60 * 1000; // 1 minuto - reduzido para detectar mudanças mais rápido

export default function InstantAuthChecker() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const lastCheckRef = useRef<number>(0);

  const checkUserStatus = useCallback(async (userId: string) => {
    const now = Date.now();
    
    // Debounce: prevent checking too frequently
    if (now - lastCheckRef.current < 2000) {
      return;
    }
    lastCheckRef.current = now;

    try {
      // Check if user is an active creator - if so, skip profile check
      const { data: creator } = await supabase
        .from('course_creators')
        .select('id')
        .eq('user_id', userId)
        .eq('is_active', true)
        .maybeSingle();

      if (creator) {
        console.log("🔍 InstantAuthChecker: Skipping - user is an active creator");
        return;
      }

      // Check cache first for regular users
      const cached = profileStatusCache.get(userId);
      if (cached && (now - cached.timestamp) < CACHE_DURATION) {
        const isExpired = cached.expires_at ? new Date(cached.expires_at) < new Date() : false;
        // Skip pending users - they are handled by Layout
        if (cached.status === 'pending') return;
        if (cached.status !== 'active' || isExpired) {
          await supabase.auth.signOut();
          navigate("/login");
          toast({
            title: isExpired ? "Acesso expirado" : "Conta desativada",
            description: isExpired 
              ? "Seu período de acesso ao sistema expirou. Entre em contato com o administrador para renovar."
              : "Sua conta foi desativada. Entre em contato com o administrador.",
            variant: "destructive",
          });
        }
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('status, expires_at')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error("❌ Error checking profile status:", error);
        return;
      }

      // If profile not found (transient RLS timing), skip - don't log out
      if (!profile) {
        console.warn("⚠️ Profile not found for user, skipping check");
        return;
      }

      // Cache the result
      profileStatusCache.set(userId, {
        status: profile?.status || 'inactive',
        expires_at: profile?.expires_at || null,
        timestamp: now
      });

      const isExpired = profile?.expires_at ? new Date(profile.expires_at) < new Date() : false;
      
      // Skip pending users - they are handled by Layout
      if (profile?.status === 'pending') return;
      
      if (profile?.status !== 'active' || isExpired) {
        await supabase.auth.signOut();
        navigate("/login");
        toast({
          title: isExpired ? "Acesso expirado" : "Conta desativada",
          description: isExpired 
            ? "Seu período de acesso ao sistema expirou. Entre em contato com o administrador para renovar."
            : "Sua conta foi desativada. Entre em contato com o administrador.",
          variant: "destructive",
        });
      }
      
    } catch (error) {
      console.error("❌ Error in instant auth check:", error);
    }
  }, [navigate, toast]);

  const clearCacheOnLogin = useCallback(() => {
    try {
      console.log("🧹 Limpando cache ao entrar no sistema...");
      
      // Limpa todo o cache
      globalCacheManager.clearAll();
      
      // Limpa também o cache de perfil local deste componente
      profileStatusCache.clear();
      
      console.log("✅ Cache limpo com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao limpar cache:", error);
    }
  }, []);

  // Check status on initial load for existing sessions
  useEffect(() => {
    const checkInitialSession = async () => {
      // Skip check for creator routes - they use course_creators table, not profiles
      if (location.pathname.startsWith('/creator')) {
        console.log("🔍 InstantAuthChecker: Skipping check for creator route");
        return;
      }
      
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        console.log("🔍 InstantAuthChecker: Checking existing session on mount");
        await checkUserStatus(session.user.id);
      }
    };
    
    checkInitialSession();
  }, [checkUserStatus, location.pathname]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Ignore token refreshes to prevent cascade loops
      if (event === 'TOKEN_REFRESHED') return;
      
      // Limpa cache ao fazer login
      if (event === 'SIGNED_IN' && session?.user) {
        // Skip check for creator routes - they use course_creators table, not profiles
        if (location.pathname.startsWith('/creator')) {
          console.log("🔍 InstantAuthChecker: Skipping auth state check for creator route");
          clearCacheOnLogin();
          return;
        }
        
        // Primeiro limpa o cache
        clearCacheOnLogin();
        
        // Depois verifica o status do usuário
        setTimeout(() => {
          checkUserStatus(session.user.id);
        }, 100);
      }
    });
    
    return () => {
      console.log("🔌 InstantAuthChecker: Cleaning up subscription");
      subscription.unsubscribe();
    };
  }, [checkUserStatus, clearCacheOnLogin, location.pathname]);

  // This component renders nothing
  return null;
}