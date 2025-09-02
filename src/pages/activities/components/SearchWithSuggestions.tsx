import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  X, 
  Clock, 
  TrendingUp,
  Sparkles,
  Target
} from 'lucide-react';
import { Activity } from '../types';

interface SearchWithSuggestionsProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  allActivities: Activity[];
  recentSearches?: string[];
  onRecentSearchClick?: (search: string) => void;
  placeholder?: string;
}

export const SearchWithSuggestions: React.FC<SearchWithSuggestionsProps> = ({
  searchTerm,
  onSearchChange,
  allActivities,
  recentSearches = [],
  onRecentSearchClick,
  placeholder = "Buscar atividades, objetivos, tags..."
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{
    type: 'activity' | 'tag' | 'objective' | 'category';
    value: string;
    activity?: Activity;
    count?: number;
  }>>([]);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate suggestions based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }

    const term = searchTerm.toLowerCase();
    const newSuggestions: Array<{
      type: 'activity' | 'tag' | 'objective' | 'category';
      value: string;
      activity?: Activity;
      count?: number;
    }> = [];

    // Activity suggestions
    allActivities
      .filter(activity => 
        activity.title.toLowerCase().includes(term) ||
        activity.description.toLowerCase().includes(term)
      )
      .slice(0, 3)
      .forEach(activity => {
        newSuggestions.push({
          type: 'activity',
          value: activity.title,
          activity
        });
      });

    // Tag suggestions
    const tagCounts = new Map<string, number>();
    allActivities.forEach(activity => {
      activity.tags?.forEach(tag => {
        if (tag.toLowerCase().includes(term)) {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        }
      });
    });

    Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .forEach(([tag, count]) => {
        newSuggestions.push({
          type: 'tag',
          value: tag,
          count
        });
      });

    // Objective suggestions
    const objectiveSuggestions = new Set<string>();
    allActivities.forEach(activity => {
      activity.objectives?.forEach(objective => {
        if (objective.toLowerCase().includes(term) && objectiveSuggestions.size < 3) {
          objectiveSuggestions.add(objective);
        }
      });
    });

    objectiveSuggestions.forEach(objective => {
      newSuggestions.push({
        type: 'objective',
        value: objective
      });
    });

    // Category suggestions
    const categories = ['cognitive', 'social', 'emotional', 'motor', 'language'];
    const categoryLabels = {
      cognitive: 'Cognitivas',
      social: 'Sociais', 
      emotional: 'Emocionais',
      motor: 'Motoras',
      language: 'Linguagem'
    };

    categories
      .filter(cat => 
        cat.includes(term) || 
        categoryLabels[cat as keyof typeof categoryLabels]?.toLowerCase().includes(term)
      )
      .slice(0, 2)
      .forEach(category => {
        newSuggestions.push({
          type: 'category',
          value: categoryLabels[category as keyof typeof categoryLabels] || category
        });
      });

    setSuggestions(newSuggestions.slice(0, 8)); // Limit total suggestions
  }, [searchTerm, allActivities]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuggestionClick = (suggestion: typeof suggestions[0]) => {
    onSearchChange(suggestion.value);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleClearSearch = () => {
    onSearchChange('');
    inputRef.current?.focus();
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'activity': return <Target className="h-4 w-4 text-primary" />;
      case 'tag': return <Sparkles className="h-4 w-4 text-blue-500" />;
      case 'objective': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'category': return <Clock className="h-4 w-4 text-purple-500" />;
      default: return <Search className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-10 h-12 text-base"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && (searchTerm || recentSearches.length > 0) && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto shadow-lg">
          <CardContent className="p-0">
            {/* Recent Searches */}
            {!searchTerm && recentSearches.length > 0 && (
              <div className="p-4 border-b">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Buscas Recentes</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.slice(0, 5).map((search, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => onRecentSearchClick?.(search)}
                      className="h-8 text-xs hover:bg-muted"
                    >
                      {search}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Dynamic Suggestions */}
            {suggestions.length > 0 && (
              <div className="py-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted text-left transition-colors"
                  >
                    {getSuggestionIcon(suggestion.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {suggestion.value}
                      </p>
                      {suggestion.activity && (
                        <p className="text-xs text-muted-foreground truncate">
                          {suggestion.activity.description}
                        </p>
                      )}
                      {suggestion.count && (
                        <p className="text-xs text-muted-foreground">
                          {suggestion.count} atividades
                        </p>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs capitalize">
                      {suggestion.type === 'activity' ? 'atividade' : 
                       suggestion.type === 'tag' ? 'tag' :
                       suggestion.type === 'objective' ? 'objetivo' : 'categoria'}
                    </Badge>
                  </button>
                ))}
              </div>
            )}

            {/* No suggestions */}
            {searchTerm && suggestions.length === 0 && (
              <div className="p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Nenhuma sugestão encontrada para "{searchTerm}"
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};