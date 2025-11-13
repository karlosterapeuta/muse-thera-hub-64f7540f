import { useLocation, Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const routeNames: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/professional": "Profissional",
  "/patients": "Pacientes",
  "/sessions": "Sessões",
  "/processes": "Processos",
  "/reports": "Relatórios",
  "/patients/new": "Novo Paciente",
  "/sessions/new": "Nova Sessão",
  "/financial": "Financeiro",
  "/goals": "Objetivos",
  "/anamnesis": "Anamnese",
  "/activities": "Atividades",
  "/music-activities": "Atividades Musicais",
  "/games": "Jogos",
  "/music-games": "Jogos Musicais",
  "/rhythm-game": "Jogo de Ritmo",
  "/melody-game": "Jogo de Melodia",
  "/harmony-game": "Jogo de Harmonia",
  "/instruments": "Instrumentos",
  "/metronome": "Metrônomo",
  "/tuner": "Afinador",
  "/sheet-music": "Partituras",
  "/calendar": "Agenda",
  "/settings": "Configurações",
  "/admin": "Administração",
  "/admin/users": "Usuários",
  "/admin/payments": "Pagamentos",
};

export function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  if (pathnames.length === 0) {
    return null;
  }

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
        const routeName = routeNames[routeTo] || pathnames[index];
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
