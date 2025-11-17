
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { MenuSectionProps } from "../types";
import { useTranslation } from "react-i18next";

export function MenuSection({ title, items, collapsed, onNavigate, showTitle = true }: MenuSectionProps) {
  const { t } = useTranslation();
  
  const getItemText = (item: any) => {
    if (item.textKey) {
      return t(item.textKey) || item.textKey;
    }
    return item.text || "";
  };
  
  return (
    <div className="space-y-1">
      {!collapsed && showTitle && (
        <div className="px-3 py-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {title}
          </span>
        </div>
      )}
      {items.map((item) => {
        const itemText = getItemText(item);
        if (item.external) {
          return (
            <a
              key={item.path}
              href={item.path}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onNavigate?.()}
              className={cn(
                "group relative flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95 mx-2 text-foreground hover:bg-muted/50 hover:shadow-sm hover:text-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <div className="relative transition-all duration-200">
                <item.icon 
                  size={18} 
                  className="text-muted-foreground group-hover:text-foreground transition-all duration-200" 
                />
              </div>
              
              {!collapsed && (
                <span className="font-medium transition-all duration-200 text-sm text-foreground group-hover:text-foreground">
                  {itemText}
                </span>
              )}
              
              {/* External link indicator */}
              {!collapsed && (
                <div className="ml-auto">
                  <svg className="w-3 h-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  : "text-foreground hover:bg-muted/50 hover:shadow-sm hover:text-foreground"
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
                        : "text-muted-foreground group-hover:text-foreground"
                    )} 
                  />
                </div>
                
                {!collapsed && (
                  <div className="flex items-center gap-2 flex-1">
                    <span className={cn(
                      "font-medium transition-all duration-200 text-sm",
                      isActive 
                        ? "text-white" 
                        : "text-foreground group-hover:text-foreground"
                    )}>
                      {itemText?.includes("em construção") ? (
                        <>
                          {itemText.split(" - em construção")[0]}
                          <span className="text-red-500 font-bold ml-1">- em construção</span>
                        </>
                      ) : (
                        itemText || ""
                      )}
                    </span>
                    {item.isNew && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-green-500 text-white shadow-sm animate-pulse">
                        NOVO
                      </span>
                    )}
                  </div>
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
