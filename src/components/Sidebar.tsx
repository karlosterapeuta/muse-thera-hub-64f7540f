
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
        "h-full bg-white/95 backdrop-blur-md border-r border-gray-200/50 shadow-xl transition-all duration-300 flex flex-col relative overflow-hidden",
        collapsed ? "w-16" : "w-60"
      )}
    >
      
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
