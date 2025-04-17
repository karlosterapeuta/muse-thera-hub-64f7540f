
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Bem-vindo ao MuseTera</h1>
      <p className="mb-6">Sistema de gestão para musicoterapeutas</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Button 
          variant="outline" 
          className="h-32 p-4 flex flex-col items-center justify-center"
          onClick={() => navigate("/music-therapy")}
        >
          <span className="text-lg font-medium">Musicoterapia TEA</span>
          <span className="text-sm text-muted-foreground mt-1">Player de música para terapia</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-32 p-4 flex flex-col items-center justify-center"
          onClick={() => navigate("/songs")}
        >
          <span className="text-lg font-medium">Músicas</span>
          <span className="text-sm text-muted-foreground mt-1">Biblioteca de músicas</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-32 p-4 flex flex-col items-center justify-center"
          onClick={() => navigate("/activities")}
        >
          <span className="text-lg font-medium">Atividades</span>
          <span className="text-sm text-muted-foreground mt-1">Gerenciar atividades terapêuticas</span>
        </Button>
      </div>
    </div>
  );
}
