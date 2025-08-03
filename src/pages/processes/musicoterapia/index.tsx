import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function MusicoterapiaRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redireciona automaticamente para a versão nova e funcional
    navigate("/processes/musicoterapia/simple", { replace: true });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}