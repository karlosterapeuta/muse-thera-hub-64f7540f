import ChatContainer from "@/components/ai-chat/ChatContainer";

const AIAssistant = () => {
  return (
    <div className="h-[calc(100vh-4rem)] md:h-[calc(100vh-2rem)] flex flex-col">
      <div className="flex-1 max-w-4xl mx-auto w-full bg-card rounded-lg border border-border shadow-lg overflow-hidden">
        <ChatContainer />
      </div>
    </div>
  );
};

export default AIAssistant;
