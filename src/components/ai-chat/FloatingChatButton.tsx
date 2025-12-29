import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import museteraAssistantBot from "@/assets/musetera-assistant-bot.png";

interface FloatingChatButtonProps {
  onClick: () => void;
}

const FloatingChatButton = ({ onClick }: FloatingChatButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onClick}
            className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 animate-scale-in p-1"
            size="icon"
          >
            <img 
              src={museteraAssistantBot} 
              alt="Assistente MuseTera"
              className="h-12 w-12 rounded-full object-cover"
            />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500 animate-pulse" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="bg-popover text-popover-foreground">
          <p>Assistente MuseTera</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FloatingChatButton;
