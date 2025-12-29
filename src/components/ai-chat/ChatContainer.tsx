import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import SuggestedQuestions from "./SuggestedQuestions";
import museteraBotGreeting from "@/assets/musetera-bot-greeting.png";
import museteraBotHappy from "@/assets/musetera-bot-happy.png";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/musicotherapy-chat`;

const ChatContainer = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [professionalName, setProfessionalName] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Fetch professional name
  useEffect(() => {
    const fetchProfessionalName = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: professional } = await supabase
          .from('professionals')
          .select('name')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (professional?.name) {
          // Get first name only
          const firstName = professional.name.split(' ')[0];
          setProfessionalName(firstName);
        }
      }
    };
    fetchProfessionalName();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const streamChat = async (userMessage: string) => {
    const userMsg: Message = { role: "user", content: userMessage };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    let assistantContent = "";

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: [...messages, userMsg], professionalName }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erro ${response.status}`);
      }

      if (!response.body) {
        throw new Error("Resposta sem corpo");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      // Add empty assistant message to stream into
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        // Process line-by-line
        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages((prev) => {
                const newMessages = [...prev];
                const lastMsg = newMessages[newMessages.length - 1];
                if (lastMsg?.role === "assistant") {
                  lastMsg.content = assistantContent;
                }
                return newMessages;
              });
            }
          } catch {
            // Incomplete JSON, put back and wait
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages((prev) => {
                const newMessages = [...prev];
                const lastMsg = newMessages[newMessages.length - 1];
                if (lastMsg?.role === "assistant") {
                  lastMsg.content = assistantContent;
                }
                return newMessages;
              });
            }
          } catch {
            /* ignore partial leftovers */
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        variant: "destructive",
        title: "Erro no chat",
        description: error instanceof Error ? error.message : "Erro ao processar mensagem",
      });
      // Remove the empty assistant message on error
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && !last.content) {
          return prev.slice(0, -1);
        }
        return prev;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
  };

  const showWelcome = messages.length === 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-purple-500/30">
            <img 
              src={museteraBotHappy} 
              alt="Assistente MuseTera"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">🎵 MuseBot</h2>
            <p className="text-xs text-muted-foreground">Assistente de Musicoterapia</p>
          </div>
        </div>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Limpar
          </Button>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {showWelcome ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="w-16 h-16 rounded-full overflow-hidden mb-4 ring-2 ring-purple-500/30">
              <img 
                src={museteraBotGreeting} 
                alt="Assistente MuseTera"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {professionalName ? `Olá, ${professionalName}!` : "Olá!"} Sou o MuseBot 🎵
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mb-6">
              Sua assistente virtual especializada em musicoterapia clínica. 
              Posso ajudar com técnicas, atividades, planejamento de sessões e muito mais!
            </p>
            <SuggestedQuestions onSelect={streamChat} disabled={isLoading} />
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <ChatMessage
                key={index}
                role={msg.role}
                content={msg.content}
                isStreaming={isLoading && index === messages.length - 1 && msg.role === "assistant"}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border space-y-3">
        {messages.length > 0 && !isLoading && showSuggestions && (
          <SuggestedQuestions 
            onSelect={(question) => {
              streamChat(question);
              setShowSuggestions(false);
            }} 
            disabled={isLoading} 
          />
        )}
        <div className="flex items-center gap-2">
          {messages.length > 0 && !isLoading && !showSuggestions && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSuggestions(true)}
              className="text-xs text-muted-foreground hover:text-violet-500 hover:border-violet-500/50 shrink-0"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Sugestões
            </Button>
          )}
          <div className="flex-1">
            <ChatInput onSend={streamChat} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
