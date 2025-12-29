import { useState } from "react";
import { useLocation } from "react-router-dom";
import FloatingChatButton from "./FloatingChatButton";
import FloatingChatSheet from "./FloatingChatSheet";

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Hide the floating button when already on the AI assistant page
  if (location.pathname === "/ai-assistant") {
    return null;
  }

  return (
    <>
      <FloatingChatButton onClick={() => setIsOpen(true)} />
      <FloatingChatSheet open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
};

export default FloatingChat;
