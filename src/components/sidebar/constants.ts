import {
  BarChart2,
  Users,
  UserCircle,
  DollarSign,
  ListChecks,
  Waves,
  UsersRound,
  Stamp,
  Database,
  LayoutDashboard,
  Bot,
  FolderOpen,
  History,
  CreditCard,
  ClipboardList,
  Briefcase,
  BookOpen,
} from "lucide-react";

export const mainMenuItems = [
  { icon: BarChart2, text: "Dashboard", path: "/dashboard", gradient: "from-emerald-600 to-green-700" },
  { icon: UserCircle, text: "Perfil profissional", path: "/professional", gradient: "from-emerald-600 to-green-700" },
  { icon: CreditCard, text: "Meu plano", path: "/plano", gradient: "from-emerald-600 to-green-700" },
];

export const clinicalMenuItems = [
  { icon: Users, text: "Pacientes", path: "/patients", gradient: "from-emerald-600 to-green-700" },
  { icon: ClipboardList, text: "Processos musicoterapêuticos", path: "/processes", gradient: "from-emerald-600 to-green-700" },
  { icon: History, text: "Histórico do paciente", path: "/patient-history", gradient: "from-emerald-600 to-green-700" },
];

export const toolsMenuItems = [
  { icon: ListChecks, text: "Atividades terapêuticas", path: "/activities", gradient: "from-emerald-600 to-green-700" },
  { icon: Waves, text: "Frequências binaurais", path: "/binaural-frequencies", gradient: "from-emerald-600 to-green-700" },
  { icon: Bot, text: "Assistente IA", path: "/ai-assistant", gradient: "from-emerald-600 to-green-700" },
];

export const managementMenuItems = [
  { icon: DollarSign, text: "Gestão financeira", path: "/finance", gradient: "from-emerald-600 to-green-700" },
  { icon: Stamp, text: "Carimbo digital", path: "/digital-stamp", gradient: "from-emerald-600 to-green-700" },
  { icon: Briefcase, text: "Vagas", path: "/vagas", gradient: "from-emerald-600 to-green-700", isNew: true },
  { icon: FolderOpen, text: "Recursos", path: "/resources", gradient: "from-emerald-600 to-green-700" },
  { icon: BookOpen, text: "Cursos", path: "/courses", gradient: "from-emerald-600 to-green-700" },
];

export const resourcesMenuItems = [];

export const getAdminMenuItems = (userEmail: string | null, isAdmin: boolean | undefined) => {
  const isAdminEmail = userEmail === "musicoterapeutakarlos@gmail.com";
  if (!isAdminEmail && isAdmin !== true) return [];

  return [
    { icon: LayoutDashboard, text: "Creator Dashboard", path: "/creator-dashboard", gradient: "from-emerald-600 to-green-700" },
    { icon: UsersRound, text: "Gestão de usuários", path: "/users", gradient: "from-emerald-600 to-green-700" },
    { icon: Briefcase, text: "Vagas — administração", path: "/vagas/admin", gradient: "from-emerald-600 to-green-700" },
    { icon: Database, text: "Backup de dados", path: "/backup", gradient: "from-emerald-600 to-green-700" },
  ];
};
