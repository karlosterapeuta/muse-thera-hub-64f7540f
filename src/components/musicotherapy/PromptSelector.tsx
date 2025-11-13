import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Lightbulb } from 'lucide-react';

interface PromptSelectorProps {
  label: string;
  prompts: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export function PromptSelector({ 
  label, 
  prompts, 
  value, 
  onChange, 
  placeholder = "Digite aqui ou escolha uma sugestão...",
  rows = 4 
}: PromptSelectorProps) {
  const [showPrompts, setShowPrompts] = useState(false);

  const handlePromptSelect = (prompt: string) => {
    if (value.trim()) {
      onChange(value + '\n\n' + prompt);
    } else {
      onChange(prompt);
    }
    setShowPrompts(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-base font-medium text-foreground">
          {label}
        </label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowPrompts(!showPrompts)}
          className="text-xs"
        >
          <Lightbulb className="h-3 w-3 mr-1" />
          {showPrompts ? 'Ocultar' : 'Sugestões'}
        </Button>
      </div>

      {showPrompts && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Sugestões de texto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            {prompts.map((prompt, index) => (
              <Button
                key={index}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handlePromptSelect(prompt)}
                className="w-full text-left text-sm h-auto p-3 justify-start whitespace-normal"
              >
                <Plus className="h-3 w-3 mr-2 flex-shrink-0" />
                <span className="text-left">{prompt}</span>
              </Button>
            ))}
          </CardContent>
        </Card>
      )}

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="min-h-[100px] border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 resize-vertical"
      />
    </div>
  );
}