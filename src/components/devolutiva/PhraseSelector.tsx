import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Edit, ChevronDown, ChevronUp } from "lucide-react";

interface PhraseSelectorProps {
  title: string;
  icon: string;
  phrases: string[];
  selectedPhrases: string[];
  onPhrasesChange: (phrases: string[]) => void;
  customText: string;
  onCustomTextChange: (text: string) => void;
}

export function PhraseSelector({
  title,
  icon,
  phrases,
  selectedPhrases,
  onPhrasesChange,
  customText,
  onCustomTextChange
}: PhraseSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const togglePhrase = (phrase: string) => {
    if (selectedPhrases.includes(phrase)) {
      onPhrasesChange(selectedPhrases.filter(p => p !== phrase));
    } else {
      onPhrasesChange([...selectedPhrases, phrase]);
    }
  };

  const clearAll = () => {
    onPhrasesChange([]);
    onCustomTextChange('');
    setIsEditing(false);
  };

  const combinedText = customText || selectedPhrases.join('. ') + (selectedPhrases.length > 0 ? '.' : '');

  return (
    <Card className="border-2 hover:border-primary/50 transition-all duration-200">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{icon}</span>
              <h3 className="font-semibold text-gray-800">{title}</h3>
              {selectedPhrases.length > 0 && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {selectedPhrases.length} selecionada{selectedPhrases.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 p-0"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>

          {isExpanded && (
            <div className="space-y-3 pt-2 border-t">
              <div className="grid gap-2">
                {phrases.map((phrase) => (
                  <div
                    key={phrase}
                    className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer hover:border-primary/30 ${
                      selectedPhrases.includes(phrase)
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200'
                    }`}
                    onClick={() => togglePhrase(phrase)}
                  >
                    <Checkbox
                      id={phrase}
                      checked={selectedPhrases.includes(phrase)}
                      onCheckedChange={() => togglePhrase(phrase)}
                      className="mt-0.5"
                    />
                    <Label
                      htmlFor={phrase}
                      className="text-sm leading-relaxed cursor-pointer flex-1"
                    >
                      {phrase}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(selectedPhrases.length > 0 || customText) && (
            <div className="space-y-2 pt-3 border-t">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Texto Selecionado</Label>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="h-7 text-xs"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    {isEditing ? 'Visualizar' : 'Editar'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAll}
                    className="h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Limpar
                  </Button>
                </div>
              </div>

              {isEditing ? (
                <Textarea
                  value={customText || combinedText}
                  onChange={(e) => onCustomTextChange(e.target.value)}
                  className="min-h-[100px] border-2 focus:border-primary"
                  placeholder="Edite o texto conforme necessário..."
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg border-2 border-gray-200 text-sm leading-relaxed">
                  {combinedText || 'Nenhum texto selecionado'}
                </div>
              )}

              <div className="text-xs text-gray-500 text-right">
                {combinedText.length} caracteres
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
