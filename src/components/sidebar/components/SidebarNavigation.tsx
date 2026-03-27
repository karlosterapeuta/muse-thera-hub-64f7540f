
import { MenuSection } from "./MenuSection";
import { mainMenuItems, clinicalMenuItems, musicalGamesMenuItems, toolsMenuItems, managementMenuItems, resourcesMenuItems, communityMenuItems, getAdminMenuItems } from "../constants";

interface SidebarNavigationProps {
  collapsed: boolean;
  onNavigate?: () => void;
  userEmail: string | null;
  isAdmin: boolean | undefined;
}

export function SidebarNavigation({ collapsed, onNavigate, userEmail, isAdmin }: SidebarNavigationProps) {
  const adminMenuItems = getAdminMenuItems(userEmail, isAdmin);

  return (
    <nav className="relative flex-1 py-3 space-y-1 overflow-y-auto scrollbar-thin">
      <MenuSection title="Principal" items={mainMenuItems} collapsed={collapsed} onNavigate={onNavigate} />
      
      {!collapsed && <div className="mx-5 my-2 border-t border-border/30" />}
      
      <MenuSection title="Clínico" items={clinicalMenuItems} collapsed={collapsed} onNavigate={onNavigate} />
      
      {!collapsed && <div className="mx-5 my-2 border-t border-border/30" />}
      
      <MenuSection title="Jogos Musicais" items={musicalGamesMenuItems} collapsed={collapsed} onNavigate={onNavigate} />
      
      {!collapsed && <div className="mx-5 my-2 border-t border-border/30" />}
      
      <MenuSection title="Ferramentas" items={toolsMenuItems} collapsed={collapsed} onNavigate={onNavigate} />
      
      {!collapsed && <div className="mx-5 my-2 border-t border-border/30" />}
      
      <MenuSection title="Gestão" items={managementMenuItems} collapsed={collapsed} onNavigate={onNavigate} />
      
      {!collapsed && <div className="mx-5 my-2 border-t border-border/30" />}
      
      <MenuSection title="Recursos" items={resourcesMenuItems} collapsed={collapsed} onNavigate={onNavigate} />
      
      {!collapsed && <div className="mx-5 my-2 border-t border-border/30" />}
      
      <MenuSection title="Comunidade" items={communityMenuItems} collapsed={collapsed} onNavigate={onNavigate} />
      
      {adminMenuItems.length > 0 && (
        <>
          {!collapsed && <div className="mx-5 my-2 border-t border-primary/30" />}
          {!collapsed && (
            <div className="mx-3 mb-1 mt-2 px-2 py-1.5 bg-primary/10 rounded-lg border border-primary/20">
              <span className="text-xs font-extrabold text-primary uppercase tracking-widest flex items-center gap-2">
                🛡️ Administração
              </span>
            </div>
          )}
          <MenuSection title="" items={adminMenuItems} collapsed={collapsed} onNavigate={onNavigate} showTitle={false} />
        </>
      )}
    </nav>
  );
}
