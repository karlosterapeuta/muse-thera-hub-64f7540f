import { useState } from "react";

export default function ChromeMusicLab() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background to-muted">
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
            <div className="text-center space-y-4">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
              <p className="text-muted-foreground">Carregando Chrome Music Lab...</p>
            </div>
          </div>
        )}
        
        <iframe
          src="https://musiclab.chromeexperiments.com/"
          className="w-full h-full border-0 rounded-lg shadow-lg"
          allow="microphone; camera; midi; encrypted-media; autoplay"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation"
          onLoad={handleLoad}
          title="Chrome Music Lab"
        />
      </div>
    </div>
  );
}