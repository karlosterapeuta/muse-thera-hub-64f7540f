
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
    <nav className="relative flex-1 py-4 space-y-4 overflow-y-auto">
      <MenuSection title="Principal" items={mainMenuItems} collapsed={collapsed} onNavigate={onNavigate} />
      
      <div className="mx-4 border-t border-border/50"></div>
      
      <MenuSection title="Clínico" items={clinicalMenuItems} collapsed={collapsed} onNavigate={onNavigate} />
      
      <div className="mx-4 border-t border-border/50"></div>
      
      <MenuSection title="Jogos Musicais" items={musicalGamesMenuItems} collapsed={collapsed} onNavigate={onNavigate} />
      
      <div className="mx-4 border-t border-border/50"></div>
      
      <MenuSection title="Ferramentas" items={toolsMenuItems} collapsed={collapsed} onNavigate={onNavigate} />
      
      <div className="mx-4 border-t border-border/50"></div>
      
      <MenuSection title="Gestão" items={managementMenuItems} collapsed={collapsed} onNavigate={onNavigate} />
      
      <div className="mx-4 border-t border-border/50"></div>
      
      <MenuSection title="Recursos" items={resourcesMenuItems} collapsed={collapsed} onNavigate={onNavigate} />
      
      <div className="mx-4 border-t border-border/50"></div>
      
      <MenuSection title="Comunidade" items={communityMenuItems} collapsed={collapsed} onNavigate={onNavigate} />
      
      {adminMenuItems.length > 0 && (
        <>
          <div className="mx-4 border-t border-border/50"></div>
          <MenuSection title="Administração" items={adminMenuItems} collapsed={collapsed} onNavigate={onNavigate} />
        </>
      )}
    </nav>
  );
}
