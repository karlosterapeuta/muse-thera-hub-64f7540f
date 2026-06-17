
import { useEffect } from "react";

export default function VagasEmbed() {
  useEffect(() => {
    document.title = "Vagas MuseTera";
  }, []);

  return (
    <div className="w-full h-[calc(100vh-4rem)] -m-6">
      <iframe
        src="https://vagasmusetera.lovable.app"
        title="Vagas MuseTera"
        className="w-full h-full border-0"
        allow="fullscreen"
      />
    </div>
  );
}
