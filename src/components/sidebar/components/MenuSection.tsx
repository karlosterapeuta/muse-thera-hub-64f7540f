
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import type { MenuSectionProps } from "../types";
import { useNewVacanciesCount } from "@/hooks/useNewVacanciesCount";

export function MenuSection({ title, items, collapsed, onNavigate, showTitle = true }: MenuSectionProps) {
  const vagasCount = useNewVacanciesCount();
  return (
    <div className="space-y-1">
      {!collapsed && showTitle && (
        <div className="px-4 pt-1 pb-2">
          <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">
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
                "group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 mx-2 text-foreground/50 hover:text-foreground hover:bg-white/5",
                collapsed && "justify-center px-2"
              )}
            >
              <item.icon
                size={18}
                className="shrink-0 opacity-70 group-hover:opacity-100 transition-opacity duration-200"
              />

              {!collapsed && (
                <span className="text-sm font-medium flex-1 truncate">
                  {item.text}
                </span>
              )}

              {!collapsed && (
                <svg className="w-3 h-3 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                "group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 mx-2 overflow-hidden",
                collapsed && "justify-center px-2",
                isProcessesItem
                  ? cn(
                      "my-1 ring-1 ring-amber-400/40 shadow-lg shadow-amber-500/20 bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-yellow-500/20 hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-0.5",
                      isActive
                        ? "text-white ring-amber-300/60 shadow-amber-500/40 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500"
                        : "text-foreground"
                    )
                  : isActive
                  ? "text-white shadow-lg shadow-purple-600/20 bg-gradient-to-r from-primary/85 to-purple-600/85"
                  : "text-foreground/50 hover:text-foreground hover:bg-white/5 hover:translate-x-0.5"
              )
            }
          >
            {({ isActive }) => (
              <>
                {/* Shine sweep on active */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                )}

                {/* Continuous shimmer sweep for the highlighted Processes item */}
                {isProcessesItem && (
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                )}

                {/* Icon */}
                {isProcessesItem ? (
                  <div className={cn(
                    "relative shrink-0 flex items-center justify-center w-8 h-8 rounded-lg shadow-md transition-transform duration-300 group-hover:scale-110",
                    isActive
                      ? "bg-white/20"
                      : "bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-500/30"
                  )}>
                    <item.icon size={18} className={cn(isActive ? "text-white" : "text-white drop-shadow")} />
                  </div>
                ) : (
                  <item.icon
                    size={18}
                    className={cn(
                      "relative shrink-0 transition-all duration-300 group-hover:scale-110",
                      isActive ? "text-white opacity-95" : "opacity-70 group-hover:opacity-100"
                    )}
                  />
                )}

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
                    ) : isProcessesItem ? (
                      <span className={cn(
                        "text-sm font-extrabold tracking-tight truncate",
                        isActive
                          ? "text-white"
                          : "bg-gradient-to-r from-amber-600 via-orange-600 to-amber-500 dark:from-amber-300 dark:via-orange-300 dark:to-yellow-300 bg-clip-text text-transparent"
                      )}>
                        {item.text}
                      </span>
                    ) : (
                      <span className={cn(
                        "text-sm font-medium truncate transition-colors duration-200",
                        isActive && "font-semibold"
                      )}>
                        {item.text}
                      </span>
                    )}
                  </div>
                )}

                {/* New vacancies counter badge */}
                {item.path === "/vagas" && vagasCount > 0 && (
                  <span
                    className={cn(
                      "z-10 flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow",
                      collapsed
                        ? "absolute top-0.5 right-0.5 h-4 min-w-4 px-1 text-[9px]"
                        : "h-5 min-w-5 px-1.5 text-[10px]"
                    )}
                  >
                    {vagasCount > 99 ? "99+" : vagasCount}
                  </span>
                )}

                {/* Arrow indicator on hover (non-active) */}
                {!collapsed && !isActive && item.path !== "/vagas" && (
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/0 group-hover:text-muted-foreground/50 transition-all duration-200 group-hover:translate-x-0.5" />
                )}

                {/* Active pulsing dot */}
                {isActive && !collapsed && (
                  <div className="relative z-10 w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-sm" />
                )}
              </>
            )}
          </NavLink>
        );
      })}
    </div>
  );
}
