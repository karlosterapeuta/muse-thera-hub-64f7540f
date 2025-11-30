import { supabase } from "@/integrations/supabase/client";

export async function logUserActivity(userId: string, activityType: "login" | "logout" | "page_view") {
  try {
    const { error } = await supabase.from("user_activity_logs").insert({
      user_id: userId,
      activity_type: activityType,
      activity_data: {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
      },
    });

    if (error) {
      console.error("Erro ao registrar atividade:", error);
    }
  } catch (error) {
    console.error("Erro ao registrar atividade:", error);
  }
}

// Mapeamento de rotas para nomes amigáveis
const pageNameMap: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/patients': 'Pacientes',
  '/anamnesis': 'Nova Anamnese',
  '/anamnesis/list': 'Lista de Anamneses',
  '/processes': 'Processos',
  '/processes/evaluation': 'Avaliação',
  '/processes/intervention': 'Intervenção',
  '/processes/devolutiva-tea': 'Devolutiva TEA',
  '/processes/musicoterapia': 'Relatório MuseTera TEA',
  '/processes/evolution': 'Evolução Diária',
  '/evaluation': 'Avaliação Musicoterapêutica',
  '/finance': 'Financeiro',
  '/activities': 'Atividades',
  '/courses': 'Cursos',
  '/courses/admin': 'Administrar Cursos',
  '/users': 'Gestão de Usuários',
  '/professional': 'Perfil Profissional',
  '/digital-stamp': 'Carimbo Digital',
  '/backup': 'Backup de Dados',
  '/musicotherapy-treatment-plans': 'Planos Terapêuticos',
  '/musicotherapy-treatment-plan': 'Novo Plano Terapêutico',
  '/sprunki': 'SprunKi',
  '/chrome-music-lab': 'Chrome Music Lab',
};

export function getPageName(path: string): string {
  // Verifica match exato primeiro
  if (pageNameMap[path]) {
    return pageNameMap[path];
  }
  
  // Verifica rotas dinâmicas
  if (path.startsWith('/courses/') && path !== '/courses/admin') {
    return 'Player do Curso';
  }
  if (path.startsWith('/anamnesis/')) {
    return 'Detalhes da Anamnese';
  }
  if (path.startsWith('/musicotherapy-treatment-plan/')) {
    return 'Editar Plano Terapêutico';
  }
  
  // Fallback: usa o último segmento do path
  const segments = path.split('/').filter(Boolean);
  return segments.length > 0 ? segments[segments.length - 1] : 'Página';
}

export async function logPageView(userId: string, pagePath: string) {
  try {
    const pageName = getPageName(pagePath);
    
    const { error } = await supabase.from("user_activity_logs").insert({
      user_id: userId,
      activity_type: "page_view",
      activity_data: {
        timestamp: new Date().toISOString(),
        page: pagePath,
        pageName: pageName,
        userAgent: navigator.userAgent,
      },
    });

    if (error) {
      console.error("Erro ao registrar page view:", error);
    }
  } catch (error) {
    console.error("Erro ao registrar page view:", error);
  }
}
