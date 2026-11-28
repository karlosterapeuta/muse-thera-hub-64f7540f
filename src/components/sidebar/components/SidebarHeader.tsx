interface SidebarHeaderProps {
  collapsed: boolean;
}

export function SidebarHeader({ collapsed }: SidebarHeaderProps) {
  return (
    <div className="border-b border-border px-3 py-3">
      <div className={collapsed ? "flex justify-center" : "flex items-center gap-3"}>
        <img
          src="/lovable-uploads/musetera-logo-new.png"
          alt="MuseTera"
          className={collapsed ? "h-9 w-9 rounded-lg object-contain" : "h-10 w-10 rounded-lg object-contain"}
        />
        {!collapsed && (
          <div className="min-w-0">
            <h1 className="text-base font-bold leading-tight text-foreground">MuseTera</h1>
            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Musicoterapia
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
