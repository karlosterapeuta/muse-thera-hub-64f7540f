import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  BarChart2,
  Users,
  UserCircle,
  FileText,
  LogOut,
  ChevronLeft,
  Key,
  UsersRound,
  DollarSign,
  ListChecks,
  Waves,
  Guitar,
  Piano,
  Music,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/hooks/use-admin";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface SidebarProps {
  onNavigate?: () => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { data: isAdmin } = useAdmin();
  const { toast } = useToast();

  // Buscar o email do usuário atual
  const { data: userEmail } = useQuery({
    queryKey: ["userEmail"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user?.email || null;
    },
  });

  const mainMenuItems = [
    { icon: BarChart2, text: "Dashboard", path: "/dashboard", gradient: "from-blue-500 to-purple-600" },
    { icon: UserCircle, text: "Profissional-MT", path: "/professional", gradient: "from-green-500 to-teal-600" },
    { icon: Users, text: "Pacientes", path: "/patients", gradient: "from-pink-500 to-rose-600" },
    { icon: FileText, text: "Processos", path: "/processes", gradient: "from-orange-500 to-red-600" },
  ];

  const toolsMenuItems = [
    { icon: ListChecks, text: "Atividades", path: "/activities", gradient: "from-cyan-500 to-blue-600" },
    { icon: Piano, text: "Compositor Musical", path: "/music-composer", gradient: "from-purple-500 to-indigo-600" },
    { icon: Music, text: "TEA-Hero", path: "/tea-hero", gradient: "from-violet-500 to-purple-600" },
    { icon: Waves, text: "Frequências Binaurais", path: "/binaural-frequencies", gradient: "from-emerald-500 to-green-600" },
    { icon: DollarSign, text: "Financeiro", path: "/finance", gradient: "from-yellow-500 to-orange-600" },
  ];

  const adminMenuItems = [
    (userEmail === "musicoterapeutakarlos@gmail.com" || userEmail === "marcia.jacira@hotmail.com" || isAdmin) && 
    { icon: UsersRound, text: "Usuários", path: "/users", gradient: "from-slate-500 to-gray-600" },
    (userEmail === "musicoterapeutakarlos@gmail.com" || userEmail === "marcia.jacira@hotmail.com" || isAdmin) && 
    { icon: Key, text: "Códigos de Convite", path: "/invite-codes", gradient: "from-amber-500 to-yellow-600" },
  ].filter(Boolean);

  const handleLogout = async () => {
    try {
      console.log("=== INICIANDO PROCESSO DE LOGOUT ===");
      
      // Primeiro, limpar todos os dados locais
      console.log("Limpando localStorage e sessionStorage...");
      localStorage.clear();
      sessionStorage.clear();
      
      // Fazer logout do Supabase
      console.log("Fazendo logout no Supabase...");
      const { error } = await supabase.auth.signOut({ 
        scope: 'local' 
      });
      
      if (error) {
        console.error("Erro ao fazer logout no Supabase:", error);
        toast({
          title: "Aviso",
          description: "Ocorreu um erro no logout, mas você será redirecionado.",
          variant: "destructive",
        });
      } else {
        console.log("Logout do Supabase realizado com sucesso");
        toast({
          title: "Logout realizado",
          description: "Você foi desconectado com sucesso.",
        });
      }
      
      // Chamar onNavigate se fornecido
      if (onNavigate) {
        console.log("Chamando onNavigate...");
        onNavigate();
      }
      
      // Forçar redirecionamento para login
      console.log("Redirecionando para /login...");
      window.location.replace('/login');
      
    } catch (error) {
      console.error("Erro crítico durante logout:", error);
      toast({
        title: "Erro no logout",
        description: "Ocorreu um erro, mas você será redirecionado para o login.",
        variant: "destructive",
      });
      
      // Mesmo com erro, forçar logout
      localStorage.clear();
      sessionStorage.clear();
      if (onNavigate) onNavigate();
      window.location.replace('/login');
    }
  };

  const renderMenuItem = (item: any) => (
    <NavLink
      key={item.path}
      to={item.path}
      onClick={() => onNavigate?.()}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95",
          collapsed && "justify-center px-3",
          isActive 
            ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg shadow-${item.gradient.split('-')[1]}-500/30 ring-1 ring-white/20`
            : "text-slate-700 hover:bg-white/40 hover:shadow-md hover:text-slate-800 backdrop-blur-sm border border-transparent hover:border-white/30"
        )
      }
    >
      {({ isActive }) => (
        <>
          <div className={cn(
            "relative transition-all duration-300",
            isActive && "drop-shadow-lg"
          )}>
            <item.icon 
              size={18} 
              className={cn(
                "transition-all duration-300",
                isActive 
                  ? "text-white drop-shadow-sm" 
                  : "text-slate-600 group-hover:text-slate-800"
              )} 
            />
            {isActive && (
              <div className="absolute inset-0 bg-white/20 rounded-lg blur-sm"></div>
            )}
          </div>
          
          {!collapsed && (
            <span className={cn(
              "font-medium transition-all duration-300 tracking-wide text-sm",
              isActive 
                ? "text-white drop-shadow-sm" 
                : "text-slate-700 group-hover:text-slate-800"
            )}>
              {item.text}
            </span>
          )}
          
          {/* Active indicator */}
          {isActive && (
            <div className="absolute right-2 w-2 h-2 bg-white rounded-full animate-pulse shadow-lg"></div>
          )}
          
          {/* Hover glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
        </>
      )}
    </NavLink>
  );

  return (
    <div
      className={cn(
        "h-full bg-gradient-to-br from-slate-50 via-white to-blue-50/30 backdrop-blur-xl border-r border-white/20 shadow-2xl transition-all duration-500 flex flex-col relative overflow-hidden",
        collapsed ? "w-20" : "w-72"
      )}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-60"></div>
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-violet-500/10 to-pink-500/10 blur-3xl"></div>
      
      {/* Header */}
      <div className="relative flex items-center justify-between p-6 border-b border-white/20 bg-white/30 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src="/lovable-uploads/7e9c8dee-0549-4b2a-9a82-3b3e2717c34f.png"
              alt="MuseTera"
              className="h-10 w-10 rounded-xl shadow-lg ring-2 ring-white/50"
            />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-lg"></div>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                MuseTera
              </span>
              <span className="text-xs text-slate-500/80 font-medium">
                Musicoterapia Digital
              </span>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="hover:bg-white/30 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 border border-white/20 backdrop-blur-sm"
        >
          <ChevronLeft 
            size={18} 
            className={cn(
              "transition-transform duration-300 text-slate-600",
              collapsed && "rotate-180"
            )} 
          />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="relative flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {/* Main Menu Section */}
        <div className="space-y-1 mb-4">
          {!collapsed && (
            <div className="px-4 py-2">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Principal
              </h3>
            </div>
          )}
          {mainMenuItems.map(renderMenuItem)}
        </div>

        {/* Tools Section */}
        <div className="space-y-1 mb-4">
          {!collapsed && (
            <div className="px-4 py-2">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Ferramentas
              </h3>
            </div>
          )}
          {toolsMenuItems.map(renderMenuItem)}
        </div>

        {/* Admin Section */}
        {adminMenuItems.length > 0 && (
          <div className="space-y-1">
            {!collapsed && (
              <div className="px-4 py-2">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Administração
                </h3>
              </div>
            )}
            {adminMenuItems.map(renderMenuItem)}
          </div>
        )}
      </nav>

      {/* Footer with Logout Button */}
      <div className="relative p-4 border-t border-white/20 bg-white/20 backdrop-blur-sm">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-center text-slate-700 hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-600 hover:text-white hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300 rounded-2xl border border-white/20 backdrop-blur-sm hover:scale-105 active:scale-95 group",
            !collapsed && "justify-start"
          )}
          onClick={handleLogout}
        >
          <LogOut size={18} className="group-hover:animate-pulse" />
          {!collapsed && (
            <span className="ml-3 font-medium tracking-wide text-sm">
              Sair do Sistema
            </span>
          )}
        </Button>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-blue-500/10 to-transparent blur-2xl"></div>
    </div>
  );
}
