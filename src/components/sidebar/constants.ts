
import {
  BarChart2,
  Users,
  UserCircle,
  FileText,
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
} from "lucide-react";

export const mainMenuItems = [
  { icon: BarChart2, text: "📊 Dashboard", path: "/dashboard", gradient: "from-blue-500 to-purple-600" },
  { icon: UserCircle, text: "🎵 Perfil Profissional", path: "/professional", gradient: "from-green-500 to-teal-600" },
  { icon: Stamp, text: "📝 Carimbo Digital", path: "/digital-stamp", gradient: "from-teal-500 to-cyan-600", isNew: true },
  { icon: Users, text: "👥 Pacientes", path: "/patients", gradient: "from-pink-500 to-rose-600" },
];

export const clinicalMenuItems = [
  { icon: FileText, text: "📋 Processos Musicoterapia", path: "/processes", gradient: "from-orange-500 to-red-600" },
  { icon: ListChecks, text: "🎯 Atividades Terapêuticas", path: "/activities", gradient: "from-cyan-500 to-blue-600", isNew: true },
];

export const musicalGamesMenuItems = [
  { icon: Piano, text: "🎮 Jogos MuseTera", path: "/chrome-music-lab", gradient: "from-blue-500 to-purple-600", isNew: true },
  { icon: Music, text: "🧩 TEA-Hero", path: "/tea-hero", gradient: "from-violet-500 to-purple-600", isNew: true },
  { icon: Bell, text: "🔔 Sinos Musicais", path: "/musical-bells", gradient: "from-green-500 to-emerald-600" },
  { icon: Music2, text: "🎵 Sprunki Musical", path: "/sprunki", gradient: "from-rose-500 to-pink-600", isNew: true },
];

export const toolsMenuItems = [
  { icon: Waves, text: "🧠 Frequências Binaurais", path: "/binaural-frequencies", gradient: "from-green-500 to-emerald-600" },
];

export const managementMenuItems = [
  { icon: DollarSign, text: "💰 Gestão Financeira", path: "/finance", gradient: "from-yellow-500 to-orange-600", isNew: true },
];

export const getAdminMenuItems = (userEmail: string | null, isAdmin: boolean | undefined) => {
  const adminMenuItems = [];
  if (userEmail === "musicoterapeutakarlos@gmail.com" || userEmail === "marcia.jacira@hotmail.com" || isAdmin) {
    adminMenuItems.push(
      { icon: UsersRound, text: "👤 Gestão de Usuários", path: "/users", gradient: "from-slate-500 to-gray-600" },
      { icon: Key, text: "🔑 Códigos de Convite", path: "/invite-codes", gradient: "from-amber-500 to-yellow-600" }
    );
  }
  return adminMenuItems;
};
