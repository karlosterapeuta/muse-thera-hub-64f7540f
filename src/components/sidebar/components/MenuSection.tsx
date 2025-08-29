
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { MenuSectionProps } from "../types";

export function MenuSection({ title, items, collapsed, onNavigate, showTitle = true }: MenuSectionProps) {
  return (
    <div className="space-y-1">
      {!collapsed && showTitle && (
        <div className="px-3 py-2">
          <span className="text-xs font-semibold text-slate-500/80 uppercase tracking-wider">
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
                "group relative flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95 mx-2 text-slate-700 hover:bg-white/50 hover:shadow-sm hover:text-slate-800",
                collapsed && "justify-center px-2"
              )}
            >
              <div className="relative transition-all duration-200">
                <item.icon 
                  size={18} 
                  className="text-slate-600 group-hover:text-slate-800 transition-all duration-200" 
                />
              </div>
              
              {!collapsed && (
                <span className="font-medium transition-all duration-200 text-sm text-slate-700 group-hover:text-slate-800">
                  {item.text}
                </span>
              )}
              
              {/* External link indicator */}
              {!collapsed && (
                <div className="ml-auto">
                  <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              )}
            </a>
          );
        }
        
        return (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => onNavigate?.()}
            className={({ isActive }) =>
              cn(
                "group relative flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95 mx-2",
                collapsed && "justify-center px-2",
                isActive 
                  ? `bg-gradient-to-r ${item.gradient} text-white shadow-md shadow-${item.gradient.split('-')[1]}-500/25`
                  : "text-slate-700 hover:bg-white/50 hover:shadow-sm hover:text-slate-800"
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className={cn(
                  "relative transition-all duration-200",
                  isActive && "drop-shadow-sm"
                )}>
                  <item.icon 
                    size={18} 
                    className={cn(
                      "transition-all duration-200",
                      isActive 
                        ? "text-white" 
                        : "text-slate-600 group-hover:text-slate-800"
                    )} 
                  />
                </div>
                
                {!collapsed && (
                  <span className={cn(
                    "font-medium transition-all duration-200 text-sm",
                    isActive 
                      ? "text-white" 
                      : "text-slate-700 group-hover:text-slate-800"
                  )}>
                    {item.text.includes("em construção") ? (
                      <>
                        {item.text.split(" - em construção")[0]}
                        <span className="text-red-500 font-bold ml-1">- em construção</span>
                      </>
                    ) : (
                      item.text
                    )}
                  </span>
                )}
                
                {/* Active indicator */}
                {isActive && !collapsed && (
                  <div className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                )}
              </>
            )}
          </NavLink>
        );
      })}
    </div>
  );
}
