import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DisorderType, disorderInfo } from "@/data/activities-by-disorder";
import { cn } from "@/lib/utils";

interface DisorderTabsProps {
  selectedDisorder: DisorderType | 'all';
  onDisorderChange: (disorder: DisorderType | 'all') => void;
  children: React.ReactNode;
}

export function DisorderTabs({ selectedDisorder, onDisorderChange, children }: DisorderTabsProps) {
  const disorders: (DisorderType | 'all')[] = ['all', 'TEA', 'TDAH', 'TOD', 'DI'];

  return (
    <Tabs value={selectedDisorder} onValueChange={(v) => onDisorderChange(v as DisorderType | 'all')} className="w-full">
      <TabsList className="w-full flex flex-wrap h-auto gap-2 bg-muted/50 p-2">
        <TabsTrigger 
          value="all" 
          className={cn(
            "flex-1 min-w-[120px] data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground",
            "transition-all duration-200"
          )}
        >
          <span className="mr-2">📚</span>
          Todas
        </TabsTrigger>
        {(Object.keys(disorderInfo) as DisorderType[]).map((disorder) => (
          <TabsTrigger 
            key={disorder} 
            value={disorder}
            className={cn(
              "flex-1 min-w-[120px] data-[state=active]:bg-gradient-to-r data-[state=active]:text-white",
              disorder === 'TEA' && "data-[state=active]:from-blue-500 data-[state=active]:to-cyan-600",
              disorder === 'TDAH' && "data-[state=active]:from-orange-500 data-[state=active]:to-amber-600",
              disorder === 'TOD' && "data-[state=active]:from-red-500 data-[state=active]:to-rose-600",
              disorder === 'DI' && "data-[state=active]:from-purple-500 data-[state=active]:to-violet-600",
              "transition-all duration-200"
            )}
          >
            <span className="mr-2">{disorderInfo[disorder].icon}</span>
            {disorder}
          </TabsTrigger>
        ))}
      </TabsList>
      
      <TabsContent value={selectedDisorder} className="mt-6">
        {children}
      </TabsContent>
    </Tabs>
  );
}
