import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Stethoscope, Brain, Activity, UserCircle, AudioWaveform } from "lucide-react";

interface ModernTabsNavigationProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function ModernTabsNavigation({
  children,
  activeTab = "personal",
  onTabChange,
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
      mobileLabel: "Dados",
      icon: UserCircle,
      gradient: "from-blue-500 to-indigo-600",
      description: "Informações básicas do paciente",
    },
    {
      id: "musical",
      label: "Histórico Musical",
      mobileLabel: "Histórico",
      icon: AudioWaveform,
      gradient: "from-purple-500 to-violet-600",
      description: "Experiências e preferências musicais",
    },
    {
      id: "clinical",
      label: "Avaliação Clínica",
      mobileLabel: "Avaliação",
      icon: Stethoscope,
      gradient: "from-emerald-500 to-teal-600",
      description: "Diagnósticos e tratamentos atuais",
    },
    {
      id: "development",
      label: "Desenvolvimento",
      mobileLabel: "Desenv.",
      icon: Activity,
      gradient: "from-amber-500 to-orange-600",
      description: "Marcos do desenvolvimento",
    },
    {
      id: "behavioral",
      label: "Terapêutico e Comportamental",
      mobileLabel: "T.C.",
      icon: Brain,
      gradient: "from-rose-500 to-pink-600",
      description: "Aspectos comportamentais e sociais",
    },
  ];

  return (
    <div className="w-full">
      <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
        <div className="mb-5 md:mb-8">
          <TabsList className="flex w-full gap-2 overflow-x-auto p-2 md:grid md:grid-cols-5 md:overflow-visible h-auto rounded-2xl bg-muted/40 border border-border/60">
            {tabs.map((tab) => {
              const isActive = currentTab === tab.id;

              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className={`shrink-0 min-w-[118px] sm:min-w-[132px] md:min-w-0 flex flex-col items-center justify-center gap-1.5 px-2 py-3 sm:px-3 sm:py-3.5 rounded-xl border-2 transition-all duration-300 ${
                    isActive
                      ? "bg-card border-primary/60 shadow-lg text-foreground"
                      : "bg-transparent border-transparent text-muted-foreground hover:bg-card/60 hover:text-foreground"
                  }`}
                >
                  <div
                    className={`p-2 sm:p-2.5 rounded-full bg-gradient-to-br ${tab.gradient} shadow-md transition-all duration-300 ${
                      isActive ? "scale-110" : "opacity-80"
                    }`}
                  >
                    <tab.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>

                  <div className="text-center leading-tight">
                    <div className="block md:hidden font-bold text-xs whitespace-nowrap">
                      {tab.mobileLabel}
                    </div>
                    <div className="hidden md:block font-bold text-sm text-foreground">
                      {tab.label}
                    </div>
                    <div className="hidden lg:block text-xs text-muted-foreground mt-1">
                      {tab.description}
                    </div>
                  </div>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        <div className="animate-fade-in">{children}</div>
      </Tabs>
    </div>
  );
}
