
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
  Bell,
  DollarSign,
  ListChecks,
  Waves,
  Guitar,
  Piano,
  Music,
  Stethoscope,
  Brain,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/hooks/use-admin";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface SidebarProps {
  onNavigate?: () => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { data: isAdmin } = useAdmin();

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
  ];

  const clinicalMenuItems = [
    { icon: FileText, text: "Processos", path: "/processes", gradient: "from-orange-500 to-red-600" },
    { icon: ListChecks, text: "Atividades", path: "/activities", gradient: "from-cyan-500 to-blue-600" },
    { icon: Stethoscope, text: "Anamnese", path: "/anamnesis", gradient: "from-emerald-500 to-green-600" },
    { icon: Brain, text: "Avaliação", path: "/evaluation", gradient: "from-purple-500 to-indigo-600" },
    { icon: Activity, text: "Plano Terapêutico", path: "/treatment-plan", gradient: "from-amber-500 to-orange-600" },
  ];

  const toolsMenuItems = [
    { icon: Piano, text: "Compositor Musical", path: "/music-composer", gradient: "from-purple-500 to-indigo-600" },
    { icon: Music, text: "TEA-Hero", path: "/tea-hero", gradient: "from-violet-500 to-purple-600" },
    { icon: Waves, text: "Frequências Binaurais", path: "/binaural-frequencies", gradient: "from-emerald-500 to-green-600" },
  ];

  const managementMenuItems = [
    { icon: DollarSign, text: "Financeiro", path: "/finance", gradient: "from-yellow-500 to-orange-600" },
  ];

  const adminMenuItems = [];
  if (userEmail === "musicoterapeutakarlos@gmail.com" || userEmail === "marcia.jacira@hotmail.com" || isAdmin) {
    adminMenuItems.push(
      { icon: UsersRound, text: "Usuários", path: "/users", gradient: "from-slate-500 to-gray-600" },
      { icon: Key, text: "Códigos de Convite", path: "/invite-codes", gradient: "from-amber-500 to-yellow-600" }
    );
  }

  const handleLogout = async () => {
    try {
      console.log("Iniciando logout...");
      
      // Clear any local storage data
      localStorage.clear();
      sessionStorage.clear();
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Erro ao fazer logout:", error);
      } else {
        console.log("Logout realizado com sucesso");
      }
      
      // Call onNavigate if provided
      onNavigate?.();
      
      // Force redirect to login page
      window.location.replace('/login');
    } catch (error) {
      console.error("Erro durante o logout:", error);
      // Even if there's an error, redirect to login
      onNavigate?.();
      window.location.replace('/login');
    }
  };

  const renderMenuSection = (title: string, items: any[], showTitle: boolean = true) => (
    <div className="space-y-1">
      {!collapsed && showTitle && (
        <div className="px-3 py-2">
          <span className="text-xs font-semibold text-slate-500/80 uppercase tracking-wider">
            {title}
          </span>
        </div>
      )}
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={() => onNavigate?.()}
          className={({ isActive }) =>
            cn(
              "group relative flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95 mx-2",
              collapsed && "justify-center px-2",
              isActive 
                ? `bg-gradient-to-r ${item.gradient} text-white shadow-md shadow-${item.gradient.split('-')[1]}-500/25`
                : "text-slate-700 hover:bg-white/50 hover:shadow-sm hover:text-slate-800"
            )
          }
        >
          {({ isActive }) => (
            <>
              <div className={cn(
                "relative transition-all duration-200",
                isActive && "drop-shadow-sm"
              )}>
                <item.icon 
                  size={18} 
                  className={cn(
                    "transition-all duration-200",
                    isActive 
                      ? "text-white" 
                      : "text-slate-600 group-hover:text-slate-800"
                  )} 
                />
              </div>
              
              {!collapsed && (
                <span className={cn(
                  "font-medium transition-all duration-200 text-sm",
                  isActive 
                    ? "text-white" 
                    : "text-slate-700 group-hover:text-slate-800"
                )}>
                  {item.text}
                </span>
              )}
              
              {/* Active indicator */}
              {isActive && !collapsed && (
                <div className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              )}
            </>
          )}
        </NavLink>
      ))}
    </div>
  );

  return (
    <div
      className={cn(
        "h-full bg-gradient-to-br from-slate-50 via-white to-blue-50/30 backdrop-blur-xl border-r border-white/20 shadow-xl transition-all duration-300 flex flex-col relative overflow-hidden",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 via-purple-500/3 to-pink-500/3"></div>
      
      {/* Header */}
      <div className="relative flex items-center justify-between p-4 border-b border-white/20 bg-white/20 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src="/lovable-uploads/7e9c8dee-0549-4b2a-9a82-3b3e2717c34f.png"
              alt="MuseTera"
              className="h-8 w-8 rounded-lg shadow-md ring-1 ring-white/40"
            />
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                MuseTera
              </span>
              <span className="text-xs text-slate-500/80 font-medium -mt-1">
                Musicoterapia Digital
              </span>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="hover:bg-white/30 rounded-lg transition-all duration-200 h-8 w-8"
        >
          <ChevronLeft 
            size={16} 
            className={cn(
              "transition-transform duration-200 text-slate-600",
              collapsed && "rotate-180"
            )} 
          />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="relative flex-1 py-4 space-y-4 overflow-y-auto">
        {renderMenuSection("Principal", mainMenuItems)}
        
        <div className="mx-4 border-t border-white/20"></div>
        
        {renderMenuSection("Clínico", clinicalMenuItems)}
        
        <div className="mx-4 border-t border-white/20"></div>
        
        {renderMenuSection("Ferramentas", toolsMenuItems)}
        
        <div className="mx-4 border-t border-white/20"></div>
        
        {renderMenuSection("Gestão", managementMenuItems)}
        
        {adminMenuItems.length > 0 && (
          <>
            <div className="mx-4 border-t border-white/20"></div>
            {renderMenuSection("Administração", adminMenuItems)}
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="relative p-3 border-t border-white/20 bg-white/10 backdrop-blur-sm">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-center text-slate-700 hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-600 hover:text-white hover:shadow-md transition-all duration-200 rounded-lg h-9 group",
            !collapsed && "justify-start"
          )}
          onClick={handleLogout}
        >
          <LogOut size={16} className="group-hover:animate-pulse" />
          {!collapsed && (
            <span className="ml-2 font-medium text-sm">
              Sair do Sistema
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
