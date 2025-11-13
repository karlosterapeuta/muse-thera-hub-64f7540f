import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificar sessão atual
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Validar status do perfil
          const { data: profile } = await supabase
            .from('profiles')
            .select('status, expires_at')
            .eq('id', session.user.id)
            .single();
          
          const isExpired = profile?.expires_at 
            ? new Date(profile.expires_at) < new Date() 
            : false;
          
          if (profile?.status === 'active' && !isExpired) {
            navigate('/dashboard', { replace: true });
          } else {
            await supabase.auth.signOut();
            navigate('/login', { replace: true });
          }
        } else {
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        navigate('/login', { replace: true });
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default Index;
