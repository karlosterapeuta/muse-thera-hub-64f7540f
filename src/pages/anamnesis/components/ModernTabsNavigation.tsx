import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Stethoscope, Brain, Activity, UserCircle, AudioWaveform, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModernTabsNavigationProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  pendingTabs?: Record<string, number>;
}

export function ModernTabsNavigation({
  children,
  activeTab = "personal",
  onTabChange,
  pendingTabs = {},
}: ModernTabsNavigationProps) {

  const handleTabChange = (tab: string) => {
    onTabChange?.(tab);
  };

  const tabs = [
    {
      id: "personal",
      label: "Dados Pessoais",
      mobileLabel: "Dados",
      icon: UserCircle,
      description: "Informações básicas do paciente",
    },
    {
      id: "musical",
      label: "Histórico Musical",
      mobileLabel: "Histórico",
      icon: AudioWaveform,
      description: "Experiências e preferências musicais",
    },
    {
      id: "clinical",
      label: "Avaliação Clínica",
      mobileLabel: "Avaliação",
      icon: Stethoscope,
      description: "Diagnósticos e tratamentos atuais",
    },
    {
      id: "development",
      label: "Desenvolvimento",
      mobileLabel: "Desenv.",
      icon: Activity,
      description: "Marcos do desenvolvimento",
    },
    {
      id: "behavioral",
      label: "Terapêutico e Comportamental",
      mobileLabel: "T.C.",
      icon: Brain,
      description: "Aspectos comportamentais e sociais",
    },
  ];

  const activeIndex = Math.max(0, tabs.findIndex(tab => tab.id === activeTab));
  const navigateStep = (offset: number) => {
    const next = tabs[activeIndex + offset];
    if (next) onTabChange?.(next.id);
  };

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="mb-5 md:mb-8">
          <p className="mb-2 text-sm text-muted-foreground md:hidden">Deslize para navegar pelas 5 etapas da anamnese.</p>
          <TabsList aria-label="Seções da anamnese" className="flex w-full gap-2 overflow-x-auto p-2 md:grid md:grid-cols-5 md:overflow-visible h-auto rounded-2xl bg-muted/40 border border-border/60">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;

              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  aria-label={tab.label}
                  className={`shrink-0 min-w-[118px] sm:min-w-[132px] md:min-w-0 flex flex-col items-center justify-center gap-1.5 px-2 py-3 sm:px-3 sm:py-3.5 rounded-xl border-2 transition-all duration-300 ${
                    isActive
                      ? "bg-card border-primary/60 shadow-sm text-foreground"
                      : "bg-transparent border-transparent text-muted-foreground hover:bg-card/60 hover:text-foreground"
                  } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`}
                >
                  <div
                    className={`p-2 sm:p-2.5 rounded-full transition-colors ${isActive ? "bg-primary" : "bg-primary/10"}`}
                  >
                    <tab.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${isActive ? "text-primary-foreground" : "text-primary"}`} />
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
                    {pendingTabs[tab.id] > 0 && (
                      <span className="mt-1 block text-xs font-semibold text-destructive">
                        {pendingTabs[tab.id]} pendência{pendingTabs[tab.id] > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        <div className="animate-fade-in">{children}</div>
        <nav aria-label="Navegação entre as etapas" className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted/20 p-3">
          <Button type="button" variant="outline" className="min-h-11 gap-2"
            disabled={activeIndex === 0} onClick={() => navigateStep(-1)}>
            <ChevronLeft className="h-4 w-4" /> Etapa anterior
          </Button>
          <span className="text-sm text-muted-foreground">Etapa {activeIndex + 1} de {tabs.length}</span>
          <Button type="button" variant="outline" className="min-h-11 gap-2"
            disabled={activeIndex === tabs.length - 1} onClick={() => navigateStep(1)}>
            Próxima etapa <ChevronRight className="h-4 w-4" />
          </Button>
        </nav>
      </Tabs>
    </div>
  );
}
