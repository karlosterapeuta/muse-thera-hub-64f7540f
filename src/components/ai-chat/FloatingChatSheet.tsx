import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Bot } from "lucide-react";
import ChatContainer from "./ChatContainer";

interface FloatingChatSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FloatingChatSheet = ({ open, onOpenChange }: FloatingChatSheetProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="w-full sm:w-[400px] lg:w-[450px] p-0 flex flex-col h-[600px] max-h-[80vh] mt-auto mb-auto rounded-l-xl"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Assistente MuseTera</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-hidden">
          <ChatContainer />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FloatingChatSheet;
