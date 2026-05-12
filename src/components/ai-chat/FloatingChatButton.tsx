import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import museteraBotGreeting from "@/assets/musetera-mascot.png";

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
            className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full bg-transparent shadow-lg hover:scale-110 transition-all duration-300 animate-scale-in p-0 hover:bg-transparent"
            size="icon"
          >
            <img 
              src={museteraBotGreeting} 
              alt="Assistente MuseTera"
              className="h-16 w-16 object-contain drop-shadow-xl"
            />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500 animate-pulse" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="bg-popover text-popover-foreground">
          <p>MuseBot</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FloatingChatButton;
