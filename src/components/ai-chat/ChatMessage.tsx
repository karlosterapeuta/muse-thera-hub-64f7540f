import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import museteraMascot from "@/assets/musetera-mascot.png";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

const ChatMessage = ({ role, content, isStreaming }: ChatMessageProps) => {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 p-4 rounded-lg animate-fade-in",
        isUser 
          ? "bg-primary/10 ml-8" 
          : "bg-muted/50 mr-8"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isUser 
            ? "bg-primary text-primary-foreground" 
            : "bg-gradient-to-br from-violet-500 to-purple-600 text-white"
        )}
      >
        {isUser ? (
          <User className="w-4 h-4" />
        ) : (
          <img 
            src={museteraMascot} 
            alt="MuseBot"
            className="w-full h-full object-cover rounded-full"
          />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-muted-foreground mb-1">
          {isUser ? "Você" : "🎵 MuseBot"}
        </p>
        <div className="text-sm text-foreground whitespace-pre-wrap break-words">
          {content}
          {isStreaming && (
            <span className="inline-block w-2 h-4 ml-1 bg-primary animate-pulse rounded-sm" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
