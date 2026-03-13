
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, 
  Music, 
  Stethoscope, 
  Brain, 
  Heart, 
  Activity,
  UserCircle,
  AudioWaveform
} from "lucide-react";

interface ModernTabsNavigationProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function ModernTabsNavigation({ 
  children, 
  activeTab = "personal",
  onTabChange 
}: ModernTabsNavigationProps) {
  const [currentTab, setCurrentTab] = useState(activeTab);

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    onTabChange?.(tab);
  };

  const tabs = [
    {
      id: "personal",
      label: "Dados Pessoais",
      icon: UserCircle,
      gradient: "from-blue-500 to-indigo-600",
      activeBg: "bg-blue-50 dark:bg-blue-950/50",
      activeBorder: "border-blue-400 dark:border-blue-500",
      activeText: "text-blue-700 dark:text-blue-200",
      description: "Informações básicas do paciente"
    },
    {
      id: "musical",
      label: "Histórico Musical",
      icon: AudioWaveform,
      gradient: "from-purple-500 to-violet-600",
      activeBg: "bg-purple-50 dark:bg-purple-950/50",
      activeBorder: "border-purple-400 dark:border-purple-500",
      activeText: "text-purple-700 dark:text-purple-200",
      description: "Experiências e preferências musicais"
    },
    {
      id: "clinical",
      label: "Avaliação Clínica",
      icon: Stethoscope,
      gradient: "from-emerald-500 to-teal-600",
      activeBg: "bg-emerald-50 dark:bg-emerald-950/50",
      activeBorder: "border-emerald-400 dark:border-emerald-500",
      activeText: "text-emerald-700 dark:text-emerald-200",
      description: "Diagnósticos e tratamentos atuais"
    },
    {
      id: "development",
      label: "Desenvolvimento",
      icon: Activity,
      gradient: "from-amber-500 to-orange-600",
      activeBg: "bg-amber-50 dark:bg-amber-950/50",
      activeBorder: "border-amber-400 dark:border-amber-500",
      activeText: "text-amber-700 dark:text-amber-200",
      description: "Marcos do desenvolvimento"
    },
    {
      id: "behavioral",
      label: "Comportamental",
      icon: Brain,
      gradient: "from-rose-500 to-pink-600",
      activeBg: "bg-rose-50 dark:bg-rose-950/50",
      activeBorder: "border-rose-400 dark:border-rose-500",
      activeText: "text-rose-700 dark:text-rose-200",
      description: "Aspectos comportamentais e sociais"
    }
  ];

  return (
    <div className="w-full">
      <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
        <div className="mb-6 md:mb-8">
          <TabsList className="grid w-full grid-cols-5 h-auto p-1.5 bg-muted/40 dark:bg-muted/20 rounded-2xl gap-1.5 border border-border/50">
            {tabs.map((tab) => {
              const isActive = currentTab === tab.id;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className={`flex flex-col items-center gap-1 sm:gap-2 px-1 py-2.5 sm:p-3 md:p-4 rounded-xl transition-all duration-300 border-2 ${
                    isActive 
                      ? `${tab.activeBg} ${tab.activeBorder} shadow-lg scale-[1.02]` 
                      : 'border-transparent hover:bg-card/60 dark:hover:bg-card/30'
                  }`}
                >
                  <div className={`p-1.5 sm:p-2.5 bg-gradient-to-br ${tab.gradient} rounded-full transition-all duration-300 shadow-md ${
                    isActive ? 'scale-110 shadow-lg' : 'scale-100 opacity-70'
                  }`}>
                    <tab.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white" />
                  </div>
                  <div className="text-center">
                    <div className={`font-bold text-[10px] sm:text-xs md:text-sm leading-tight ${
                      isActive ? tab.activeText : 'text-muted-foreground'
                    }`}>
                      {tab.label}
                    </div>
                    <div className={`text-[9px] sm:text-xs mt-0.5 sm:mt-1 hidden md:block ${
                      isActive ? 'text-foreground/70' : 'text-muted-foreground/60'
                    }`}>
                      {tab.description}
                    </div>
                  </div>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        <div className="animate-fade-in">
          {children}
        </div>
      </Tabs>
    </div>
  );
}
