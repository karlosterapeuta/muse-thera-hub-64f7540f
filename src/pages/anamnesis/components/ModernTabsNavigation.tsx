
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
      gradient: "from-blue-500 to-blue-600",
      description: "Informações básicas do paciente"
    },
    {
      id: "musical",
      label: "Histórico Musical",
      icon: AudioWaveform,
      gradient: "from-purple-500 to-purple-600",
      description: "Experiências e preferências musicais"
    },
    {
      id: "clinical",
      label: "Avaliação Clínica",
      icon: Stethoscope,
      gradient: "from-emerald-500 to-emerald-600",
      description: "Diagnósticos e tratamentos atuais"
    },
    {
      id: "development",
      label: "Desenvolvimento",
      icon: Activity,
      gradient: "from-amber-500 to-amber-600",
      description: "Marcos do desenvolvimento"
    },
    {
      id: "behavioral",
      label: "Comportamental",
      icon: Brain,
      gradient: "from-rose-500 to-rose-600",
      description: "Aspectos comportamentais e sociais"
    }
  ];

  return (
    <div className="w-full">
      <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
        <div className="mb-8">
          <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-gray-50 rounded-xl">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg transition-all duration-200 hover:bg-white/50"
              >
                <div className={`p-2 bg-gradient-to-r ${tab.gradient} rounded-full transition-transform duration-200 ${
                  currentTab === tab.id ? 'scale-110' : 'scale-100'
                }`}>
                  <tab.icon className="h-4 w-4 text-white" />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-sm">{tab.label}</div>
                  <div className="text-xs text-muted-foreground mt-1 hidden md:block">
                    {tab.description}
                  </div>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="animate-fade-in">
          {children}
        </div>
      </Tabs>
    </div>
  );
}
