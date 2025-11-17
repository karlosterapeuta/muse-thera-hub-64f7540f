
import { useTranslation } from "react-i18next";
import { MenuSection } from "./MenuSection";
import { mainMenuItems, clinicalMenuItems, musicalGamesMenuItems, toolsMenuItems, managementMenuItems, getAdminMenuItems } from "../constants";

interface SidebarNavigationProps {
  collapsed: boolean;
  onNavigate?: () => void;
  userEmail: string | null;
  isAdmin: boolean | undefined;
}

export function SidebarNavigation({ collapsed, onNavigate, userEmail, isAdmin }: SidebarNavigationProps) {
  const { t } = useTranslation('sidebar');
  const adminMenuItems = getAdminMenuItems(userEmail, isAdmin);

  return (
    <nav className="relative flex-1 py-4 space-y-4 overflow-y-auto">
      <MenuSection title={t('main.title', 'Principal')} items={mainMenuItems} collapsed={collapsed} onNavigate={onNavigate} />
      
      <div className="mx-4 border-t border-border/50"></div>
      
      <MenuSection title={t('clinical.title')} items={clinicalMenuItems} collapsed={collapsed} onNavigate={onNavigate} />
      
      <div className="mx-4 border-t border-border/50"></div>
      
      <MenuSection title={t('games.title')} items={musicalGamesMenuItems} collapsed={collapsed} onNavigate={onNavigate} />
      
      <div className="mx-4 border-t border-border/50"></div>
      
      <MenuSection title={t('tools.title')} items={toolsMenuItems} collapsed={collapsed} onNavigate={onNavigate} />
      
      <div className="mx-4 border-t border-border/50"></div>
      
      <MenuSection title={t('management.title')} items={managementMenuItems} collapsed={collapsed} onNavigate={onNavigate} />
      
      {adminMenuItems.length > 0 && (
        <>
          <div className="mx-4 border-t border-border/50"></div>
          <MenuSection title={t('admin.title')} items={adminMenuItems} collapsed={collapsed} onNavigate={onNavigate} />
        </>
      )}
    </nav>
  );
}
