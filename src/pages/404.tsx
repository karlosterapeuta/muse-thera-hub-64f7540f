
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-12 flex flex-col items-center justify-center min-h-[80vh]">
      <h1 className="text-5xl md:text-7xl font-bold mb-6">404</h1>
      <p className="text-xl md:text-2xl font-medium mb-2">Página não encontrada</p>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        A página que você está procurando não existe ou foi removida.
      </p>
      
      <div className="flex gap-4">
        <Button onClick={() => navigate(-1)}>
          Voltar
        </Button>
        <Button variant="outline" onClick={() => navigate("/")}>
          Ir para a página inicial
        </Button>
      </div>
    </div>
  );
}
