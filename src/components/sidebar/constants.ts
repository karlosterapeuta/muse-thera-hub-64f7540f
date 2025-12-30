
import {
  BarChart2,
  Users,
  UserCircle,
  DollarSign,
  ListChecks,
  Stethoscope,
  Brain,
  Activity,
  Piano,
  Bell,
  Music,
  Grid3X3,
  Music2,
  Waves,
  UsersRound,
  Key,
  ClipboardList,
  Stamp,
  GraduationCap,
  Database,
  LayoutDashboard,
  Bot,
} from "lucide-react";

export const mainMenuItems = [
  { icon: BarChart2, text: "📊 Dashboard", path: "/dashboard", gradient: "from-blue-500 to-purple-600" },
  { icon: UserCircle, text: "🎵 Perfil Profissional", path: "/professional", gradient: "from-green-500 to-teal-600" },
  { icon: Stamp, text: "📝 Carimbo Digital", path: "/digital-stamp", gradient: "from-teal-500 to-cyan-600", isNew: true },
  { icon: Users, text: "👥 Pacientes", path: "/patients", gradient: "from-pink-500 to-rose-600" },
];

export const clinicalMenuItems = [
  { icon: ClipboardList, text: "⭐ Processos Musicoterapia", path: "/processes", gradient: "from-purple-600 via-pink-600 to-red-600", isNew: true },
];

export const musicalGamesMenuItems = [
  { icon: Piano, text: "🎮 Jogos MuseTera", path: "/chrome-music-lab", gradient: "from-blue-500 to-purple-600", isNew: true },
  { icon: Music, text: "🧩 TEA-Hero", path: "/tea-hero", gradient: "from-violet-500 to-purple-600", isNew: true },
  { icon: Bell, text: "🔔 Sinos Musicais", path: "/musical-bells", gradient: "from-green-500 to-emerald-600" },
  { icon: Music2, text: "🎵 Sprunki Musical", path: "/sprunki", gradient: "from-rose-500 to-pink-600", isNew: true },
];

export const toolsMenuItems = [
  { icon: Bot, text: "🤖 Assistente IA", path: "/ai-assistant", gradient: "from-violet-500 to-purple-600", isNew: true },
  { icon: Waves, text: "🧠 Frequências Binaurais", path: "/binaural-frequencies", gradient: "from-green-500 to-emerald-600" },
  { icon: GraduationCap, text: "Curso Flix", path: "/courses", gradient: "from-red-600 to-red-700", isNew: true, isNetflixStyle: true },
];

export const managementMenuItems = [
  { icon: DollarSign, text: "💰 Gestão Financeira", path: "/finance", gradient: "from-yellow-500 to-orange-600", isNew: true },
];

export const communityMenuItems = [
  { icon: UsersRound, text: "🌐 Comunidade MuseTera", path: "https://comunidade.musetera.com.br/", gradient: "from-indigo-500 to-blue-600", isNew: true, external: true },
];

export const getAdminMenuItems = (userEmail: string | null, isAdmin: boolean | undefined) => {
  console.log("🔍 getAdminMenuItems:", { userEmail, isAdmin });
  
  const adminEmails = ["musicoterapeutakarlos@gmail.com", "marcia.jacira@hotmail.com"];
  const isAdminEmail = userEmail ? adminEmails.includes(userEmail) : false;
  
  const adminMenuItems = [];
  if (isAdminEmail || isAdmin === true) {
    console.log("✅ User is admin, showing menu items");
    adminMenuItems.push(
      { icon: LayoutDashboard, text: "🎬 Creator Dashboard", path: "/creator-dashboard", gradient: "from-orange-500 to-amber-600", isNew: true },
      { icon: UsersRound, text: "👤 Gestão de Usuários", path: "/users", gradient: "from-slate-500 to-gray-600" },
      { icon: Database, text: "💾 Backup de Dados", path: "/backup", gradient: "from-slate-500 to-zinc-600", isNew: true }
    );
  }
  return adminMenuItems;
};
