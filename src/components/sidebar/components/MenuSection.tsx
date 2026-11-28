import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { MenuSectionProps } from "../types";
import { useNewVacanciesCount } from "@/hooks/useNewVacanciesCount";

export function MenuSection({ title, items, collapsed, onNavigate, showTitle = true }: MenuSectionProps) {
  const vagasCount = useNewVacanciesCount();

  if (items.length === 0) return null;

  return (
    <section aria-label={title || "Outros"} className="mb-3 space-y-1">
      {!collapsed && showTitle && (
        <h2 className="px-4 pb-2 pt-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {title}
        </h2>
      )}
      {items.map((item) => {
        const sharedClass = cn(
          "group mx-2 flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          collapsed && "justify-center px-2"
        );

        if (item.external) {
          return (
            <a
              key={item.path}
              href={item.path}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onNavigate?.()}
              aria-label={collapsed ? item.text : undefined}
              className={cn(sharedClass, "text-foreground/75 hover:bg-muted hover:text-foreground")}
            >
              <item.icon size={18} aria-hidden="true" className="shrink-0" />
              {!collapsed && <span className="min-w-0 flex-1 truncate">{item.text}</span>}
            </a>
          );
        }

        return (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => onNavigate?.()}
            aria-label={collapsed ? item.text : undefined}
            className={({ isActive }) =>
              cn(
                sharedClass,
                isActive
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                  : "text-foreground/75 hover:bg-muted hover:text-foreground"
              )
            }
          >
            <item.icon size={18} aria-hidden="true" className="shrink-0" />
            {!collapsed && <span className="min-w-0 flex-1 truncate">{item.text}</span>}
            {item.path === "/vagas" && vagasCount > 0 && (
              <span className={cn(
                "flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground",
                collapsed && "absolute right-1 top-1"
              )}>
                {vagasCount > 99 ? "99+" : vagasCount}
              </span>
            )}
          </NavLink>
        );
      })}
    </section>
  );
}
