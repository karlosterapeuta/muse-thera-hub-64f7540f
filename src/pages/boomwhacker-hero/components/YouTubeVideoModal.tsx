import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Youtube, X } from 'lucide-react';

interface YouTubeVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  youtubeId: string;
  title: string;
  customTitle?: string;
}

export const YouTubeVideoModal: React.FC<YouTubeVideoModalProps> = ({
  isOpen,
  onClose,
  youtubeId,
  title,
  customTitle
}) => {
  const embedUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[80vh] p-0 overflow-hidden bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900">
        <DialogHeader className="p-6 pb-4 bg-gradient-to-r from-violet-600 to-purple-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Youtube className="w-6 h-6 text-red-400" />
                <Badge className="bg-violet-500 text-white">
                  🎵 MuseTera Original
                </Badge>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <DialogTitle className="text-xl font-bold text-white mt-2">
            {customTitle || title}
          </DialogTitle>
          
          <p className="text-violet-200 text-sm">
            Conteúdo educacional criado pela equipe MuseTera para musicoterapia
          </p>
        </DialogHeader>

        <div className="flex-1 p-6 pt-0">
          <div className="w-full h-full bg-black rounded-lg overflow-hidden shadow-2xl">
            <iframe
              src={embedUrl}
              title={title}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        <div className="p-6 pt-0">
          <div className="bg-violet-900/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-violet-200 font-medium">
                Vídeo Educacional MuseTera
              </span>
            </div>
            <p className="text-xs text-violet-300">
              Este conteúdo foi desenvolvido especialmente para apoiar práticas de musicoterapia 
              e musicalização terapêutica. Aproveite este recurso para enriquecer suas sessões!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};