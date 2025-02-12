
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  BarChart2,
  Users,
  UserCircle,
  FileText,
  Book,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { icon: BarChart2, text: "Dashboard", path: "/dashboard" },
    { icon: UserCircle, text: "Profissional-MT", path: "/professional" },
    { icon: Users, text: "Pacientes", path: "/patients" },
    { icon: FileText, text: "Processos", path: "/processes" },
    { icon: Book, text: "Hawkins", path: "/hawkins" },
  ];

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div
      className={cn(
        "h-screen bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <img
            src="/lovable-uploads/b3c0260e-f8ab-47b7-83f1-f32afb34a749.png"
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
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>

      <nav className="flex-1 py-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
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
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full flex items-center space-x-3 text-gray-700 hover:bg-gray-100"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          {!collapsed && <span>Sair do Sistema</span>}
        </Button>
      </div>
    </div>
  );
}
