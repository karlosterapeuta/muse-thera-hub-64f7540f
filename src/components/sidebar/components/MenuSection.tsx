
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import type { MenuSectionProps } from "../types";
import { useNewVacanciesCount } from "@/hooks/useNewVacanciesCount";

export function MenuSection({ title, items, collapsed, onNavigate, showTitle = true }: MenuSectionProps) {
  const vagasCount = useNewVacanciesCount();
  return (
    <div className="space-y-0.5">
      {!collapsed && showTitle && (
        <div className="px-4 pt-1 pb-2">
          <span className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-[0.15em]">
            {title}
          </span>
        </div>
      )}
      {items.map((item) => {
        if (item.external) {
          return (
            <a
              key={item.path}
              href={item.path}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onNavigate?.()}
              className={cn(
                "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 mx-2 text-foreground/80 hover:text-foreground hover:bg-accent/60",
                collapsed && "justify-center px-2"
              )}
            >
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-muted/60 group-hover:bg-accent transition-colors duration-200">
                <item.icon
                  size={16}
                  className="text-muted-foreground group-hover:text-foreground transition-colors duration-200"
                />
              </div>

              {!collapsed && (
                <span className="font-medium text-[13px] flex-1 truncate">
                  {item.text}
                </span>
              )}

              {!collapsed && (
                <svg className="w-3 h-3 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              )}
            </a>
          );
        }

        const isProcessesItem = item.path === "/processes";

        return (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => onNavigate?.()}
            className={({ isActive }) =>
              cn(
                "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 mx-2 overflow-hidden",
                collapsed && "justify-center px-2",
                isActive
                  ? "bg-gradient-to-r text-white shadow-lg"
                  : "text-foreground/80 hover:text-foreground hover:bg-accent/60",
                isActive && item.gradient,
                isProcessesItem && !isActive && "ring-1 ring-primary/20 bg-primary/5 dark:bg-primary/10 hover:ring-primary/40"
              )
            }
          >
            {({ isActive }) => (
              <>
                {/* Subtle shine effect on active */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                )}

                {/* Icon container */}
                <div className={cn(
                  "relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-white/20"
                    : "bg-muted/60 group-hover:bg-accent",
                  isProcessesItem && !isActive && "bg-primary/10"
                )}>
                  <item.icon
                    size={16}
                    className={cn(
                      "transition-all duration-200",
                      isActive
                        ? "text-white"
                        : "text-muted-foreground group-hover:text-foreground",
                      isProcessesItem && !isActive && "text-primary"
                    )}
                  />
                </div>

                {!collapsed && (
                  <div className="flex items-center gap-2 flex-1 min-w-0 relative z-10">
                    {item.isNetflixStyle ? (
                      <span
                        className="font-black text-sm tracking-tight uppercase truncate"
                        style={{
                          fontFamily: "'Bebas Neue', 'Arial Black', Impact, sans-serif",
                          color: isActive ? '#ffffff' : '#E50914',
                          letterSpacing: '0.5px'
                        }}
                      >
                        {item.text}
                      </span>
                    ) : (
                      <span className={cn(
                        "font-medium text-[13px] truncate transition-colors duration-200",
                        isActive ? "text-white font-semibold" : "",
                        isProcessesItem && !isActive && "font-semibold text-foreground"
                      )}>
                        {item.text}
                      </span>
                    )}
                  </div>
                )}

                {/* Arrow indicator on hover (non-active) */}
                {!collapsed && !isActive && (
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/0 group-hover:text-muted-foreground/60 transition-all duration-200 group-hover:translate-x-0.5" />
                )}

                {/* Active dot */}
                {isActive && !collapsed && (
                  <div className="w-1.5 h-1.5 bg-white rounded-full shadow-sm" />
                )}
              </>
            )}
          </NavLink>
        );
      })}
    </div>
  );
}
