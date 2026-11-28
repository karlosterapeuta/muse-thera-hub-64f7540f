import { MenuSection } from "./MenuSection";
import { mainMenuItems, clinicalMenuItems, toolsMenuItems, managementMenuItems, getAdminMenuItems } from "../constants";

interface SidebarNavigationProps {
  collapsed: boolean;
  onNavigate?: () => void;
  userEmail: string | null;
  isAdmin: boolean | undefined;
}

export function SidebarNavigation({ collapsed, onNavigate, userEmail, isAdmin }: SidebarNavigationProps) {
  const adminMenuItems = getAdminMenuItems(userEmail, isAdmin);

  return (
    <nav aria-label="Navegação principal" className="relative flex-1 overflow-y-auto py-3">
      <MenuSection title="Início" items={mainMenuItems} collapsed={collapsed} onNavigate={onNavigate} />
      <MenuSection title="Atendimento clínico" items={clinicalMenuItems} collapsed={collapsed} onNavigate={onNavigate} />
      <MenuSection title="Recursos terapêuticos" items={toolsMenuItems} collapsed={collapsed} onNavigate={onNavigate} />
      <MenuSection title="Gestão profissional" items={managementMenuItems} collapsed={collapsed} onNavigate={onNavigate} />
      {adminMenuItems.length > 0 && (
        <MenuSection title="Administração" items={adminMenuItems} collapsed={collapsed} onNavigate={onNavigate} />
      )}
    </nav>
  );
}
