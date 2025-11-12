
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useSidebarData } from "./sidebar/hooks/useSidebarData";
import { SidebarHeader } from "./sidebar/components/SidebarHeader";
import { ProfessionalInfo } from "./sidebar/components/ProfessionalInfo";
import { SidebarNavigation } from "./sidebar/components/SidebarNavigation";
import { SidebarFooter } from "./sidebar/components/SidebarFooter";
import type { SidebarProps } from "./sidebar/types";

export default function Sidebar({ onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { userEmail, isAdmin, professional, professionalInfo } = useSidebarData();

  return (
    <div
      className={cn(
        "h-full bg-gradient-to-br from-slate-50 via-white to-blue-50/30 backdrop-blur-xl border-0 shadow-none transition-all duration-300 flex flex-col relative overflow-hidden",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 via-purple-500/3 to-pink-500/3"></div>
      
      <SidebarHeader collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      
      <ProfessionalInfo 
        collapsed={collapsed} 
        professionalInfo={professionalInfo}
        professional={professional}
      />

      <SidebarNavigation 
        collapsed={collapsed}
        onNavigate={onNavigate}
        userEmail={userEmail}
        isAdmin={isAdmin}
      />

      <SidebarFooter collapsed={collapsed} onNavigate={onNavigate} />
    </div>
  );
}
