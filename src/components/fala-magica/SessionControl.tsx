
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer, Save, Play, Pause, Upload } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface SessionStats {
  attempts: number;
  duration: number;
  startTime?: Date;
}

interface SessionControlProps {
  onSessionComplete: (stats: SessionStats) => void;
}

const SessionControl = ({ onSessionComplete }: SessionControlProps) => {
  const [isActive, setIsActive] = useState(false);
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    attempts: 0,
    duration: 0,
    startTime: undefined
  });
  const { toast } = useToast();

  const startSession = () => {
    setIsActive(true);
    setSessionStats(prev => ({
      ...prev,
      startTime: new Date()
    }));
    toast({
      title: "Sessão iniciada",
      description: "O tempo está sendo contabilizado"
    });
  };

  const pauseSession = () => {
    setIsActive(false);
    toast({
      title: "Sessão pausada",
      description: "O tempo foi pausado"
    });
  };

  const endSession = () => {
    if (sessionStats.startTime) {
      const endTime = new Date();
      const duration = Math.floor((endTime.getTime() - sessionStats.startTime.getTime()) / 1000);
      
      const finalStats = {
        ...sessionStats,
        duration
      };
      
      onSessionComplete(finalStats);
      
      toast({
        title: "Sessão finalizada",
        description: `Duração total: ${Math.floor(duration / 60)} minutos`
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="text-purple-500" />
          Controle da Sessão
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            {!isActive ? (
              <Button onClick={startSession} className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Iniciar Sessão
              </Button>
            ) : (
              <Button onClick={pauseSession} variant="outline" className="flex items-center gap-2">
                <Pause className="h-4 w-4" />
                Pausar
              </Button>
            )}
            <Button onClick={endSession} variant="secondary" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Finalizar
            </Button>
          </div>
          
          <div className="grid gap-4 pt-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="customImage">Adicionar Imagem Personalizada</Label>
              <div className="flex gap-2">
                <Input id="customImage" type="file" accept="image/*" />
                <Button variant="outline" size="icon">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionControl;
