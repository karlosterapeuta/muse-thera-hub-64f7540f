import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Square,
  Play,
  Loader2,
  AlertCircle,
  CheckCircle,
  Sparkles
} from 'lucide-react';

// Type declarations for Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface VoiceSearchProps {
  onSearchResult: (searchTerm: string) => void;
  isActive?: boolean;
}

interface VoiceSearchState {
  isListening: boolean;
  isProcessing: boolean;
  transcript: string;
  confidence: number;
  error: string | null;
  suggestions: string[];
}

export const VoiceSearch: React.FC<VoiceSearchProps> = ({
  onSearchResult,
  isActive = false
}) => {
  const [state, setState] = useState<VoiceSearchState>({
    isListening: false,
    isProcessing: false,
    transcript: '',
    confidence: 0,
    error: null,
    suggestions: []
  });

  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check for speech recognition support
  const isSpeechRecognitionSupported = () => {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  };

  // Initialize speech recognition
  useEffect(() => {
    if (!isSpeechRecognitionSupported()) {
      setState(prev => ({ 
        ...prev, 
        error: 'Reconhecimento de voz não suportado neste navegador' 
      }));
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'pt-BR';
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      setState(prev => ({ 
        ...prev, 
        isListening: true, 
        error: null,
        transcript: '',
        confidence: 0
      }));
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
      let maxConfidence = 0;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        const confidence = result[0].confidence;

        if (result.isFinal) {
          finalTranscript += transcript;
          maxConfidence = Math.max(maxConfidence, confidence);
        } else {
          interimTranscript += transcript;
        }
      }

      setState(prev => ({
        ...prev,
        transcript: finalTranscript || interimTranscript,
        confidence: maxConfidence || 0.5
      }));

      // Process final result
      if (finalTranscript) {
        processVoiceResult(finalTranscript, maxConfidence);
      }
    };

    recognition.onerror = (event) => {
      let errorMessage = 'Erro no reconhecimento de voz';
      
      switch (event.error) {
        case 'network':
          errorMessage = 'Erro de conexão de rede';
          break;
        case 'not-allowed':
          errorMessage = 'Permissão de microfone negada';
          break;
        case 'no-speech':
          errorMessage = 'Nenhuma fala detectada';
          break;
        case 'audio-capture':
          errorMessage = 'Erro de captura de áudio';
          break;
        case 'service-not-allowed':
          errorMessage = 'Serviço não permitido';
          break;
      }

      setState(prev => ({
        ...prev,
        isListening: false,
        isProcessing: false,
        error: errorMessage
      }));

      toast({
        title: "Erro na busca por voz",
        description: errorMessage,
        variant: "destructive"
      });
    };

    recognition.onend = () => {
      setState(prev => ({ 
        ...prev, 
        isListening: false 
      }));
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const processVoiceResult = (transcript: string, confidence: number) => {
    setState(prev => ({ ...prev, isProcessing: true }));

    // Simulate processing delay and enhancement
    timeoutRef.current = setTimeout(() => {
      const enhancedQuery = enhanceSearchQuery(transcript);
      const suggestions = generateSearchSuggestions(transcript);
      
      setState(prev => ({
        ...prev,
        isProcessing: false,
        suggestions
      }));

      // Execute search if confidence is high enough
      if (confidence > 0.6 || transcript.length > 3) {
        onSearchResult(enhancedQuery);
        
        toast({
          title: "Busca por voz realizada",
          description: `Buscando por: "${enhancedQuery}"`,
        });
      } else {
        toast({
          title: "Qualidade do áudio insuficiente",
          description: "Tente falar mais claramente ou repetir a busca.",
          variant: "destructive"
        });
      }
    }, 1000);
  };

  const enhanceSearchQuery = (transcript: string): string => {
    // Clean up and enhance the search query
    let enhanced = transcript.toLowerCase().trim();
    
    // Common voice recognition improvements for Portuguese
    const corrections = {
      'atividade': ['atividades', 'atividade'],
      'terapêutica': ['terapeutica', 'terapêuticas'],
      'cognitiva': ['cognitiva', 'cognitivas'],
      'motora': ['motora', 'motoras'],
      'emocional': ['emocional', 'emocionais'],
      'social': ['social', 'sociais'],
      'linguagem': ['linguagem', 'linguagens'],
      'música': ['musica', 'música'],
      'relaxamento': ['relaxamento', 'relax'],
      'concentração': ['concentracao', 'concentração'],
      'coordenação': ['coordenacao', 'coordenação']
    };

    Object.entries(corrections).forEach(([correct, variations]) => {
      variations.forEach(variation => {
        enhanced = enhanced.replace(new RegExp(variation, 'gi'), correct);
      });
    });

    return enhanced;
  };

  const generateSearchSuggestions = (transcript: string): string[] => {
    const suggestions = [];
    const words = transcript.toLowerCase().split(' ');
    
    // Generate contextual suggestions based on detected words
    const contextMap = {
      'criança': ['atividades infantis', 'desenvolvimento infantil', 'brincadeiras terapêuticas'],
      'adolescente': ['atividades para adolescentes', 'dinâmicas de grupo', 'expressão emocional'],
      'adulto': ['terapia de adultos', 'relaxamento', 'mindfulness'],
      'grupo': ['dinâmicas de grupo', 'atividades coletivas', 'socialização'],
      'individual': ['terapia individual', 'autoconhecimento', 'reflexão'],
      'ansiedade': ['relaxamento', 'respiração', 'mindfulness'],
      'depressão': ['motivação', 'autoestima', 'ativação comportamental'],
      'coordenação': ['atividades motoras', 'psicomotricidade', 'equilíbrio'],
      'fala': ['linguagem', 'comunicação', 'expressão verbal']
    };

    words.forEach(word => {
      if (contextMap[word]) {
        suggestions.push(...contextMap[word]);
      }
    });

    // Remove duplicates and limit to 3 suggestions
    return [...new Set(suggestions)].slice(0, 3);
  };

  const startListening = () => {
    if (!recognitionRef.current || state.isListening) return;

    // Request microphone permission first
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        recognitionRef.current?.start();
      })
      .catch((error) => {
        setState(prev => ({ 
          ...prev, 
          error: 'Permissão de microfone necessária para busca por voz' 
        }));
        
        toast({
          title: "Permissão necessária",
          description: "Por favor, permita o acesso ao microfone para usar a busca por voz.",
          variant: "destructive"
        });
      });
  };

  const stopListening = () => {
    if (recognitionRef.current && state.isListening) {
      recognitionRef.current.stop();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSearchResult(suggestion);
    setState(prev => ({ ...prev, suggestions: [] }));
  };

  if (!isSpeechRecognitionSupported()) {
    return (
      <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
        <AlertCircle className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Busca por voz não suportada
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Voice Search Button */}
      <div className="flex items-center gap-2">
        <Button
          variant={state.isListening ? "destructive" : "outline"}
          size="sm"
          onClick={state.isListening ? stopListening : startListening}
          disabled={state.isProcessing}
          className="gap-2"
        >
          {state.isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : state.isListening ? (
            <MicOff className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
          
          {state.isProcessing ? 'Processando...' : 
           state.isListening ? 'Parar' : 'Busca por Voz'}
        </Button>

        {state.isListening && (
          <div className="flex items-center gap-1">
            <div className="flex space-x-1">
              <div className="w-1 h-4 bg-red-500 rounded animate-pulse"></div>
              <div className="w-1 h-6 bg-red-500 rounded animate-pulse animation-delay-100"></div>
              <div className="w-1 h-4 bg-red-500 rounded animate-pulse animation-delay-200"></div>
            </div>
            <span className="text-sm text-red-600 ml-2">Escutando...</span>
          </div>
        )}
      </div>

      {/* Voice Recognition Status */}
      {(state.transcript || state.error) && (
        <Card className={state.error ? "border-destructive" : "border-primary"}>
          <CardContent className="p-3">
            {state.error ? (
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{state.error}</span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {state.isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  <span className="text-sm font-medium">
                    {state.isProcessing ? 'Processando...' : 'Reconhecido:'}
                  </span>
                  {state.confidence > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {Math.round(state.confidence * 100)}% confiança
                    </Badge>
                  )}
                </div>
                
                {state.transcript && (
                  <div className="p-2 bg-muted rounded text-sm">
                    "{state.transcript}"
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Search Suggestions */}
      {state.suggestions.length > 0 && (
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Sugestões relacionadas:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {state.suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="h-7 text-xs"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Voice Search Tips */}
      {!state.transcript && !state.error && !state.isListening && (
        <Card className="bg-muted/30">
          <CardContent className="p-3">
            <div className="flex items-start gap-2">
              <Volume2 className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="text-xs text-muted-foreground">
                <p className="font-medium mb-1">Dicas para melhor reconhecimento:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Fale de forma clara e pausada</li>
                  <li>• Use termos como "atividade cognitiva", "terapia motora"</li>
                  <li>• Mencione faixa etária: "para crianças", "adolescentes"</li>
                  <li>• Especifique dificuldade: "fácil", "difícil"</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};