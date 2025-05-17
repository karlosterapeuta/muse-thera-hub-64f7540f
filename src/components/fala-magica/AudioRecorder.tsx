
import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, Square, Save } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface AudioRecorderProps {
  onSave: (blob: Blob) => void;
  maxDuration?: number;
}

export default function AudioRecorder({ onSave, maxDuration = 300 }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        onSave(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
      
      timerRef.current = setInterval(() => {
        setDuration(prev => {
          if (prev >= maxDuration) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000) as unknown as NodeJS.Timeout;

      toast({
        title: "Gravação iniciada",
        description: "Fale pausadamente ao microfone",
      });
    } catch (error) {
      toast({
        title: "Erro ao acessar microfone",
        description: "Verifique se você permitiu o acesso ao microfone",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setDuration(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm space-y-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500">
          Tempo: {formatTime(duration)} / {formatTime(maxDuration)}
        </span>
        <Progress 
          value={(duration / maxDuration) * 100} 
          className="w-64"
        />
      </div>

      <div className="flex justify-center gap-4">
        {!isRecording ? (
          <Button
            onClick={startRecording}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Mic className="mr-2 h-4 w-4" /> Iniciar Gravação
          </Button>
        ) : (
          <Button
            onClick={stopRecording}
            variant="destructive"
          >
            <Square className="mr-2 h-4 w-4" /> Parar Gravação
          </Button>
        )}
      </div>
    </div>
  );
}
