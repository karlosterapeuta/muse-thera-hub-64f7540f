
interface SidebarHeaderProps {
  collapsed: boolean;
}

export function SidebarHeader({ collapsed }: SidebarHeaderProps) {
  return (
    <div className="relative flex items-center justify-center p-3 border-b border-white/20 bg-white/20 backdrop-blur-sm">
      <div className="flex items-center">
        <img
          src="/lovable-uploads/7e9c8dee-0549-4b2a-9a82-3b3e2717c34f.png"
          alt="MuseTera"
          className="h-8 w-8 rounded-lg shadow-md ring-1 ring-white/40"
        />
      </div>
    </div>
  );
}
