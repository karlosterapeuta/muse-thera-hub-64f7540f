
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
  { icon: BarChart2, textKey: "sidebar:main.dashboard", path: "/dashboard", gradient: "from-blue-500 to-purple-600" },
  { icon: UserCircle, textKey: "sidebar:main.professionalProfile", path: "/professional", gradient: "from-green-500 to-teal-600" },
  { icon: Stamp, textKey: "sidebar:main.digitalStamp", path: "/digital-stamp", gradient: "from-teal-500 to-cyan-600", isNew: true },
  { icon: Users, textKey: "sidebar:main.patients", path: "/patients", gradient: "from-pink-500 to-rose-600" },
];

export const clinicalMenuItems = [
  { icon: FileText, textKey: "sidebar:clinical.processes", path: "/processes", gradient: "from-orange-500 to-red-600" },
  { icon: ListChecks, textKey: "sidebar:clinical.activities", path: "/activities", gradient: "from-cyan-500 to-blue-600", isNew: true },
];

export const musicalGamesMenuItems = [
  { icon: Piano, textKey: "sidebar:games.museteraGames", path: "/chrome-music-lab", gradient: "from-blue-500 to-purple-600", isNew: true },
  { icon: Music, textKey: "sidebar:games.teaHero", path: "/tea-hero", gradient: "from-violet-500 to-purple-600", isNew: true },
  { icon: Bell, textKey: "sidebar:games.musicalBells", path: "/musical-bells", gradient: "from-green-500 to-emerald-600" },
  { icon: Music2, textKey: "sidebar:games.sprunkiMusical", path: "/sprunki", gradient: "from-rose-500 to-pink-600", isNew: true },
];

export const toolsMenuItems = [
  { icon: Waves, textKey: "sidebar:tools.binauralFrequencies", path: "/binaural-frequencies", gradient: "from-green-500 to-emerald-600" },
];

export const managementMenuItems = [
  { icon: DollarSign, textKey: "sidebar:management.finance", path: "/finance", gradient: "from-yellow-500 to-orange-600", isNew: true },
];

export const getAdminMenuItems = (userEmail: string | null, isAdmin: boolean | undefined) => {
  const adminMenuItems = [];
  if (userEmail === "musicoterapeutakarlos@gmail.com" || userEmail === "marcia.jacira@hotmail.com" || isAdmin) {
    adminMenuItems.push(
      { icon: UsersRound, textKey: "sidebar:admin.users", path: "/users", gradient: "from-slate-500 to-gray-600" },
      { icon: Key, textKey: "sidebar:admin.inviteCodes", path: "/invite-codes", gradient: "from-amber-500 to-yellow-600" }
    );
  }
  return adminMenuItems;
};
