
import { MenuSection } from "./MenuSection";
import { mainMenuItems, clinicalMenuItems, toolsMenuItems, managementMenuItems, resourcesMenuItems, communityMenuItems, getAdminMenuItems } from "../constants";

interface SidebarNavigationProps {
  collapsed: boolean;
  onNavigate?: () => void;
  userEmail: string | null;
  isAdmin: boolean | undefined;
}

export function SidebarNavigation({ collapsed, onNavigate, userEmail, isAdmin }: SidebarNavigationProps) {
  const adminMenuItems = getAdminMenuItems(userEmail, isAdmin);

  return (
    <nav className="relative flex-1 py-4 space-y-6 overflow-y-auto scrollbar-thin">
      <MenuSection title="Principal" items={mainMenuItems} collapsed={collapsed} onNavigate={onNavigate} />

      <MenuSection title="Clínico" items={clinicalMenuItems} collapsed={collapsed} onNavigate={onNavigate} />

      <MenuSection title="Ferramentas" items={toolsMenuItems} collapsed={collapsed} onNavigate={onNavigate} />

      <MenuSection title="Gestão" items={managementMenuItems} collapsed={collapsed} onNavigate={onNavigate} />

      <MenuSection title="Recursos" items={resourcesMenuItems} collapsed={collapsed} onNavigate={onNavigate} />

      <MenuSection title="Comunidade" items={communityMenuItems} collapsed={collapsed} onNavigate={onNavigate} />

      {adminMenuItems.length > 0 && (
        <div>
          {!collapsed && (
            <div className="mx-4 mb-2 px-2 py-1.5">
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] flex items-center gap-1.5">
                🛡️ Administração
              </span>
            </div>
          )}
          <MenuSection title="" items={adminMenuItems} collapsed={collapsed} onNavigate={onNavigate} showTitle={false} />
        </div>
      )}
    </nav>
  );
}
