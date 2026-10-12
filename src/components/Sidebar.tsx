import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarFooter,
  useSidebar 
} from "@/components/ui/sidebar";
import { useSidebarData } from "./sidebar/hooks/useSidebarData";
import { SidebarHeader as CustomHeader } from "./sidebar/components/SidebarHeader";
import { ProfessionalInfo } from "./sidebar/components/ProfessionalInfo";
import { SidebarNavigation } from "./sidebar/components/SidebarNavigation";
import { SidebarFooter as CustomFooter } from "./sidebar/components/SidebarFooter";
import type { SidebarProps } from "./sidebar/types";
import { useIsMobile } from "@/hooks/use-mobile";

export default function AppSidebar({ onNavigate }: SidebarProps) {
  const { userEmail, isAdmin, professional, professionalInfo } = useSidebarData();
  const { state, setOpenMobile } = useSidebar();
  const collapsed = state === "collapsed";
  const isMobile = useIsMobile();

  const handleNavigate = () => {
    // Fecha sidebar no mobile após navegação
    if (isMobile) {
      setOpenMobile(false);
    }
    onNavigate?.();
  };

  return (
    <Sidebar collapsible="icon" className="border-r">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-emerald-500/5 to-teal-500/5 pointer-events-none -z-10"></div>
      
      <SidebarHeader className="bg-gradient-to-br from-background via-card/80 to-teal-50/25 dark:to-teal-950/25 backdrop-blur-xl">
        <CustomHeader collapsed={collapsed} />
      </SidebarHeader>
      
      <SidebarContent className="bg-gradient-to-br from-background via-card/80 to-teal-50/25 dark:to-teal-950/25 backdrop-blur-xl">
        <ProfessionalInfo 
          collapsed={collapsed} 
          professionalInfo={professionalInfo}
          professional={professional}
        />

        <SidebarNavigation 
          collapsed={collapsed}
          onNavigate={handleNavigate}
          userEmail={userEmail}
          isAdmin={isAdmin}
        />
      </SidebarContent>

      <SidebarFooter className="bg-gradient-to-br from-background via-card/80 to-teal-50/25 dark:to-teal-950/25 backdrop-blur-xl">
        <CustomFooter collapsed={collapsed} onNavigate={handleNavigate} />
      </SidebarFooter>
    </Sidebar>
  );
}
