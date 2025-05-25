import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
  Music,
  Bell,
  DollarSign,
  ListChecks,
  Waves,
  LayoutGrid,
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
  const navigate = useNavigate();

  // Buscar o email do usuário atual
  const { data: userEmail } = useQuery({
    queryKey: ["userEmail"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user?.email || null;
    },
  });

  const menuItems = [
    { icon: BarChart2, text: "Dashboard", path: "/dashboard" },
    { icon: UserCircle, text: "Profissional-MT", path: "/professional" },
    { icon: Users, text: "Pacientes", path: "/patients" },
    { icon: FileText, text: "Processos", path: "/processes" },
    { icon: ListChecks, text: "Atividades", path: "/activities" },
    { icon: Music, text: "Fala Mágica", path: "/songs" },
    { icon: Bell, text: "Sinos Musicais", path: "/musical-bells" },
    { icon: Waves, text: "Frequências Binaurais", path: "/binaural-frequencies" },
    { icon: LayoutGrid, text: "Musicograma", path: "/musicogram" },
    { icon: DollarSign, text: "Financeiro", path: "/finance" },
    // Show Users menu for specific users or admins
    (userEmail === "musicoterapeutakarlos@gmail.com" || userEmail === "marcia.jacira@hotmail.com" || isAdmin) && { icon: UsersRound, text: "Usuários", path: "/users" },
    (userEmail === "musicoterapeutakarlos@gmail.com" || userEmail === "marcia.jacira@hotmail.com" || isAdmin) && { icon: Key, text: "Códigos de Convite", path: "/invite-codes" },
  ].filter(Boolean);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login");
      onNavigate?.();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      // Even if there's an error, redirect to login
      navigate("/login");
      onNavigate?.();
    }
  };

  return (
    <div
      className={cn(
        "h-full bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <img
            src="/lovable-uploads/7e9c8dee-0549-4b2a-9a82-3b3e2717c34f.png"
            alt="MuseTera"
            className="h-8 w-8"
          />
          {!collapsed && <span className="text-xl font-bold text-primary">MuseTera</span>}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="hover:bg-gray-100"
        >
          {collapsed ? <ChevronLeft size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>

      <nav className="flex-1 py-4">
        {menuItems.map((item) => (
          item && (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => onNavigate?.()}
              className={({ isActive }) =>
                cn(
                  "flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors",
                  isActive && "bg-primary/10 text-primary",
                  collapsed && "justify-center"
                )
              }
            >
              <item.icon size={20} />
              {!collapsed && <span>{item.text}</span>}
            </NavLink>
          )
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-center text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors",
            !collapsed && "justify-start"
          )}
          onClick={handleLogout}
        >
          <LogOut size={20} />
          {!collapsed && <span className="ml-3">Sair do Sistema</span>}
        </Button>
      </div>
    </div>
  );
}
