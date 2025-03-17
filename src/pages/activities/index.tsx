
import { useIsMobile, useIsTablet } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Accordion } from "@/components/ui/accordion";
import { Music2, Target, Brain, Users, Heart, Lightbulb, UserPlus } from "lucide-react";
import { activities, getCategoryIcon } from "./data/activities";
import { ActivityAccordionItem } from "./components/ActivityAccordionItem";

export default function Activities() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  return (
    <div className="container mx-auto px-4 py-6 min-h-screen bg-gradient-to-b from-background to-background/95">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-primary bg-clip-text animate-fade-in">
        Atividades Musicoterapêuticas
      </h1>
      <p className="text-gray-700 mb-6 sm:mb-8 text-sm sm:text-base max-w-3xl mx-auto animate-fade-in">
        Atividades musicoterapêuticas adaptáveis a necessidades específicas, incluindo TEA e diversos 
        transtornos mentais, conforme a demanda do paciente.
      </p>

      <Tabs defaultValue="comunicacao" className="w-full animate-fade-in">
        <TabsList className="mb-4 sm:mb-6 flex flex-wrap h-auto gap-1 sm:gap-2 justify-start overflow-x-auto pb-1 border-b border-muted">
          {isMobile ? (
            // Mobile tabs layout - smaller font and padding
            <>
              <TabsTrigger value="comunicacao" className="px-2 py-1 text-xs rounded-full">
                <Music2 className="h-3 w-3 mr-1" /> Comunicação
              </TabsTrigger>
              <TabsTrigger value="interacao" className="px-2 py-1 text-xs rounded-full">
                <Users className="h-3 w-3 mr-1" /> Interação
              </TabsTrigger>
              <TabsTrigger value="regulacao" className="px-2 py-1 text-xs rounded-full">
                <Heart className="h-3 w-3 mr-1" /> Regulação
              </TabsTrigger>
              <TabsTrigger value="motor" className="px-2 py-1 text-xs rounded-full">
                <Users className="h-3 w-3 mr-1" /> Des. Motor
              </TabsTrigger>
              <TabsTrigger value="flexibilidade" className="px-2 py-1 text-xs rounded-full">
                <Brain className="h-3 w-3 mr-1" /> Flex. Cognitiva
              </TabsTrigger>
              <TabsTrigger value="autonomia" className="px-2 py-1 text-xs rounded-full">
                <Lightbulb className="h-3 w-3 mr-1" /> Autonomia
              </TabsTrigger>
              <TabsTrigger value="vinculacao" className="px-2 py-1 text-xs rounded-full">
                <UserPlus className="h-3 w-3 mr-1" /> Vinculação
              </TabsTrigger>
            </>
          ) : isTablet ? (
            // Tablet tabs layout
            <>
              <TabsTrigger value="comunicacao" className="text-sm rounded-full">
                <Music2 className="h-4 w-4 mr-1" /> Comunicação
              </TabsTrigger>
              <TabsTrigger value="interacao" className="text-sm rounded-full">
                <Users className="h-4 w-4 mr-1" /> Interação Social
              </TabsTrigger>
              <TabsTrigger value="regulacao" className="text-sm rounded-full">
                <Heart className="h-4 w-4 mr-1" /> Regulação Sensorial
              </TabsTrigger>
              <TabsTrigger value="motor" className="text-sm rounded-full">
                <Users className="h-4 w-4 mr-1" /> Desenvolvimento Motor
              </TabsTrigger>
              <TabsTrigger value="flexibilidade" className="text-sm rounded-full">
                <Brain className="h-4 w-4 mr-1" /> Flexibilidade Cognitiva
              </TabsTrigger>
              <TabsTrigger value="autonomia" className="text-sm rounded-full">
                <Lightbulb className="h-4 w-4 mr-1" /> Autonomia
              </TabsTrigger>
              <TabsTrigger value="vinculacao" className="text-sm rounded-full">
                <UserPlus className="h-4 w-4 mr-1" /> Vinculação Afetiva
              </TabsTrigger>
            </>
          ) : (
            // Desktop tabs layout
            <>
              <TabsTrigger value="comunicacao" className="rounded-full px-4 py-2">
                <Music2 className="h-4 w-4 mr-2" /> Comunicação e Expressão
              </TabsTrigger>
              <TabsTrigger value="interacao" className="rounded-full px-4 py-2">
                <Users className="h-4 w-4 mr-2" /> Interação Social
              </TabsTrigger>
              <TabsTrigger value="regulacao" className="rounded-full px-4 py-2">
                <Heart className="h-4 w-4 mr-2" /> Regulação Sensorial
              </TabsTrigger>
              <TabsTrigger value="motor" className="rounded-full px-4 py-2">
                <Users className="h-4 w-4 mr-2" /> Desenvolvimento Motor
              </TabsTrigger>
              <TabsTrigger value="flexibilidade" className="rounded-full px-4 py-2">
                <Brain className="h-4 w-4 mr-2" /> Flexibilidade Cognitiva
              </TabsTrigger>
              <TabsTrigger value="autonomia" className="rounded-full px-4 py-2">
                <Lightbulb className="h-4 w-4 mr-2" /> Autonomia e Autoestima
              </TabsTrigger>
              <TabsTrigger value="vinculacao" className="rounded-full px-4 py-2">
                <UserPlus className="h-4 w-4 mr-2" /> Vinculação Afetiva
              </TabsTrigger>
            </>
          )}
        </TabsList>

        {Object.entries(activities).map(([category, activityList], index) => {
          const CategoryIcon = getCategoryIcon(category);
          const tabValue = [
            "comunicacao", 
            "interacao", 
            "regulacao", 
            "motor", 
            "flexibilidade", 
            "autonomia", 
            "vinculacao"
          ][index];
          
          return (
            <TabsContent key={tabValue} value={tabValue} className="space-y-4 sm:space-y-6 animate-fade-in">
              <div className="bg-gradient-to-r from-primary/10 to-transparent p-4 rounded-lg mb-4 border border-primary/10">
                <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-1 sm:mb-2 flex items-center">
                  <CategoryIcon className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-primary" />
                  {category}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Selecione uma atividade para ver detalhes e sugestões de aplicação
                </p>
              </div>
              
              <Accordion type="single" collapsible className="w-full">
                {activityList.map((activity, idx) => (
                  <ActivityAccordionItem 
                    key={idx}
                    activity={activity} 
                    itemId={`item-${tabValue}-${idx}`} 
                    isMobile={isMobile}
                  />
                ))}
              </Accordion>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
