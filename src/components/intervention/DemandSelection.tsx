import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { disorderOptions, teaDemandCategories, tdahDemandCategories, todDemandCategories, diDemandCategories } from "@/data/therapy-activities";

interface DemandSelectionProps {
  selectedDemands: Record<string, string[]>;
  selectedSubDemands: Record<string, string[]>;
  expandedCategories: Record<string, boolean>;
  onDemandToggle: (disorder: string, demand: string) => void;
  onSubDemandToggle: (category: string, subDemandLabel: string) => void;
  onCategoryToggle: (category: string) => void;
}

export function DemandSelection({
  selectedDemands,
  selectedSubDemands,
  expandedCategories,
  onDemandToggle,
  onSubDemandToggle,
  onCategoryToggle,
}: DemandSelectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Selecione as Demandas Terapêuticas</h3>
      
      {disorderOptions.map((option) => (
        <div key={option.disorder} className="border rounded-lg p-4 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{option.icon}</span>
            <h4 className="font-semibold text-base">{option.label}</h4>
          </div>

          {option.disorder === 'TEA' && teaDemandCategories.map((category) => {
            const isExpanded = expandedCategories[category.category] || false;
            const selectedCount = selectedSubDemands[category.category]?.length || 0;
            const totalCount = category.subDemands.length;

            return (
              <Collapsible key={category.category} open={isExpanded}>
                <div className="border rounded-lg overflow-hidden">
                  <CollapsibleTrigger
                    onClick={() => onCategoryToggle(category.category)}
                    className="w-full p-4 flex items-center justify-between hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-xl">{category.icon}</span>
                      <div className="text-left flex-1">
                        <div className="font-semibold text-sm">{category.category}</div>
                        <div className="text-xs text-muted-foreground">
                          {selectedCount}/{totalCount} selecionadas
                        </div>
                      </div>
                    </div>
                    <ChevronDown 
                      className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="p-4 pt-2 space-y-3 border-t">
                      {category.subDemands.map((subDemand) => (
                        <div key={subDemand.id} className="flex items-start gap-3">
                          <Checkbox
                            id={subDemand.id}
                            checked={selectedSubDemands[category.category]?.includes(subDemand.label) || false}
                            onCheckedChange={() => onSubDemandToggle(category.category, subDemand.label)}
                          />
                          <div className="flex-1">
                            <Label
                              htmlFor={subDemand.id}
                              className="text-sm font-medium cursor-pointer"
                            >
                              {subDemand.label}
                            </Label>
                            {subDemand.associatedConditions && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Condições associadas: {subDemand.associatedConditions.join(', ')}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            );
          })}

          {option.disorder === 'TDAH' && tdahDemandCategories.map((category) => {
            const isExpanded = expandedCategories[category.category] || false;
            const selectedCount = selectedSubDemands[category.category]?.length || 0;
            const totalCount = category.subDemands.length;

            return (
              <Collapsible key={category.category} open={isExpanded}>
                <div className="border rounded-lg overflow-hidden">
                  <CollapsibleTrigger
                    onClick={() => onCategoryToggle(category.category)}
                    className="w-full p-4 flex items-center justify-between hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-xl">{category.icon}</span>
                      <div className="text-left flex-1">
                        <div className="font-semibold text-sm">{category.category}</div>
                        <div className="text-xs text-muted-foreground">
                          {selectedCount}/{totalCount} selecionadas
                        </div>
                      </div>
                    </div>
                    <ChevronDown 
                      className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="p-4 pt-2 space-y-3 border-t">
                      {category.subDemands.map((subDemand) => (
                        <div key={subDemand.id} className="flex items-start gap-3">
                          <Checkbox
                            id={subDemand.id}
                            checked={selectedSubDemands[category.category]?.includes(subDemand.label) || false}
                            onCheckedChange={() => onSubDemandToggle(category.category, subDemand.label)}
                          />
                          <Label
                            htmlFor={subDemand.id}
                            className="text-sm font-medium cursor-pointer flex-1"
                          >
                            {subDemand.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            );
          })}

          {option.disorder === 'TOD' && todDemandCategories.map((category) => {
            const isExpanded = expandedCategories[category.category] || false;
            const selectedCount = selectedSubDemands[category.category]?.length || 0;
            const totalCount = category.subDemands.length;

            return (
              <Collapsible key={category.category} open={isExpanded}>
                <div className="border rounded-lg overflow-hidden">
                  <CollapsibleTrigger
                    onClick={() => onCategoryToggle(category.category)}
                    className="w-full p-4 flex items-center justify-between hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-xl">{category.icon}</span>
                      <div className="text-left flex-1">
                        <div className="font-semibold text-sm">{category.category}</div>
                        <div className="text-xs text-muted-foreground">
                          {selectedCount}/{totalCount} selecionadas
                        </div>
                      </div>
                    </div>
                    <ChevronDown 
                      className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="p-4 pt-2 space-y-3 border-t">
                      {category.subDemands.map((subDemand) => (
                        <div key={subDemand.id} className="flex items-start gap-3">
                          <Checkbox
                            id={subDemand.id}
                            checked={selectedSubDemands[category.category]?.includes(subDemand.label) || false}
                            onCheckedChange={() => onSubDemandToggle(category.category, subDemand.label)}
                          />
                          <Label
                            htmlFor={subDemand.id}
                            className="text-sm font-medium cursor-pointer flex-1"
                          >
                            {subDemand.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            );
          })}

          {option.disorder === 'DI' && diDemandCategories.map((category) => {
            const isExpanded = expandedCategories[category.category] || false;
            const selectedCount = selectedSubDemands[category.category]?.length || 0;
            const totalCount = category.subDemands.length;

            return (
              <Collapsible key={category.category} open={isExpanded}>
                <div className="border rounded-lg overflow-hidden">
                  <CollapsibleTrigger
                    onClick={() => onCategoryToggle(category.category)}
                    className="w-full p-4 flex items-center justify-between hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-xl">{category.icon}</span>
                      <div className="text-left flex-1">
                        <div className="font-semibold text-sm">{category.category}</div>
                        <div className="text-xs text-muted-foreground">
                          {selectedCount}/{totalCount} selecionadas
                        </div>
                      </div>
                    </div>
                    <ChevronDown 
                      className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="p-4 pt-2 space-y-3 border-t">
                      {category.subDemands.map((subDemand) => (
                        <div key={subDemand.id} className="flex items-start gap-3">
                          <Checkbox
                            id={subDemand.id}
                            checked={selectedSubDemands[category.category]?.includes(subDemand.label) || false}
                            onCheckedChange={() => onSubDemandToggle(category.category, subDemand.label)}
                          />
                          <Label
                            htmlFor={subDemand.id}
                            className="text-sm font-medium cursor-pointer flex-1"
                          >
                            {subDemand.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            );
          })}
        </div>
      ))}
    </div>
  );
}
