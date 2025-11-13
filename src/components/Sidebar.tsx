
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
        "h-full backdrop-blur-md border-r shadow-xl transition-all duration-300 flex flex-col relative overflow-hidden",
        "bg-white/95 border-gray-200/50",
        "dark:bg-gray-900/95 dark:border-gray-700/50 dark:shadow-2xl",
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
