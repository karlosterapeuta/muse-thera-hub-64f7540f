
export interface SidebarProps {
  onNavigate?: () => void;
}

export interface MenuItem {
  icon: any;
  text: string;
  path: string;
  gradient: string;
  external?: boolean;
}

export interface MenuSectionProps {
  title: string;
  items: MenuItem[];
  collapsed: boolean;
  onNavigate?: () => void;
  showTitle?: boolean;
}
