import { useLocation, Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Breadcrumbs() {
  const location = useLocation();
  const { t } = useTranslation('navigation');
  const pathnames = location.pathname.split("/").filter((x) => x);

  if (pathnames.length === 0) {
    return null;
  }

  // Map route segments to translation keys
  const getRouteKey = (path: string): string => {
    const routeKeyMap: Record<string, string> = {
      "/dashboard": "dashboard",
      "/professional": "professional",
      "/patients": "patients",
      "/sessions": "sessions",
      "/processes": "processes",
      "/reports": "reports",
      "/patients/new": "patientsNew",
      "/sessions/new": "sessionsNew",
      "/financial": "financial",
      "/goals": "goals",
      "/anamnesis": "anamnesis",
      "/activities": "activities",
      "/music-activities": "musicActivities",
      "/games": "games",
      "/music-games": "musicGames",
      "/rhythm-game": "rhythmGame",
      "/melody-game": "melodyGame",
      "/harmony-game": "harmonyGame",
      "/instruments": "instruments",
      "/metronome": "metronome",
      "/tuner": "tuner",
      "/sheet-music": "sheetMusic",
      "/calendar": "calendar",
      "/settings": "settings",
      "/admin": "admin",
      "/admin/users": "adminUsers",
      "/admin/payments": "adminPayments"
    };
    
    return routeKeyMap[path] || path.split('/').pop() || path;
  };

  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground">
      <Link
        to="/dashboard"
        className="flex items-center gap-1 hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>

      {pathnames.map((_, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const routeKey = getRouteKey(routeTo);
        const routeName = t(`routes.${routeKey}`, { defaultValue: pathnames[index] });
        const isLast = index === pathnames.length - 1;

        return (
          <div key={routeTo} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4" />
            {isLast ? (
              <span className="font-medium text-foreground">{routeName}</span>
            ) : (
              <Link
                to={routeTo}
                className="hover:text-foreground transition-colors"
              >
                {routeName}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
