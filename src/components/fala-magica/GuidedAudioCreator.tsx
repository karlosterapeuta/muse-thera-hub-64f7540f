
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import AudioRecorder from './AudioRecorder';
import { GuidedAudio } from './types';
import { Plus, Upload, Music } from "lucide-react";

interface GuidedAudioCreatorProps {
  onSave: (audio: Partial<GuidedAudio>) => void;
}

export default function GuidedAudioCreator({ onSave }: GuidedAudioCreatorProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [voiceType, setVoiceType] = useState<'adulto' | 'infantil' | 'personalizado'>('adulto');
  const [category, setCategory] = useState<'palavras' | 'frases' | 'musicas' | 'historias'>('palavras');
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();

  const handleAudioSave = async (blob: Blob) => {
    // In a real app, you would upload this blob to your storage
    const audioUrl = URL.createObjectURL(blob);
    
    onSave({
      title,
      description,
      voiceType,
      category,
      audioUrl,
      createdAt: new Date(),
      duration: 0, // This would be calculated from the actual audio file
      hasBackgroundMusic: false,
      tags: []
    });

    toast({
      title: "Áudio salvo com sucesso!",
      description: "O áudio guiado foi criado e está pronto para uso.",
    });
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-xl shadow-lg">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título do Áudio</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Animais da Fazenda"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva o conteúdo do áudio..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="voiceType">Tipo de Voz</Label>
            <Select
              value={voiceType}
              onValueChange={(value: 'adulto' | 'infantil' | 'personalizado') => setVoiceType(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de voz" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="adulto">Adulto</SelectItem>
                <SelectItem value="infantil">Infantil</SelectItem>
                <SelectItem value="personalizado">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select
              value={category}
              onValueChange={(value: 'palavras' | 'frases' | 'musicas' | 'historias') => setCategory(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="palavras">Palavras</SelectItem>
                <SelectItem value="frases">Frases</SelectItem>
                <SelectItem value="musicas">Músicas</SelectItem>
                <SelectItem value="historias">Histórias</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {voiceType === 'personalizado' ? (
          <div className="space-y-4">
            <Label>Gravação Personalizada</Label>
            <AudioRecorder onSave={handleAudioSave} />
          </div>
        ) : (
          <div className="space-y-4">
            <Label>Upload de Áudio</Label>
            <div className="flex justify-center">
              <Button variant="outline" className="w-full">
                <Upload className="mr-2 h-4 w-4" /> Selecionar Arquivo de Áudio
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
