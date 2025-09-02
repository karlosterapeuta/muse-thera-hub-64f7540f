import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, ZoomIn, Image as ImageIcon, X } from 'lucide-react';
import { ResourceLink } from '../types';

interface ImageGalleryProps {
  images: ResourceLink[];
  title?: string;
  showThumbnails?: boolean;
  className?: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  title = "Galeria de Imagens",
  showThumbnails = true,
  className = ""
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const imageResources = images.filter(resource => resource.type === 'image');

  if (imageResources.length === 0) {
    return (
      <div className="text-center py-8">
        <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-muted-foreground">Nenhuma imagem disponível para esta atividade.</p>
      </div>
    );
  }

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedImageIndex(null);
  };

  const nextImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % imageResources.length);
    }
  };

  const prevImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(
        selectedImageIndex === 0 ? imageResources.length - 1 : selectedImageIndex - 1
      );
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          {title}
        </h3>
        <Badge variant="secondary">
          {imageResources.length} {imageResources.length === 1 ? 'imagem' : 'imagens'}
        </Badge>
      </div>

      {/* Main Featured Image */}
      {imageResources.length > 0 && (
        <Card className="mb-4 overflow-hidden group cursor-pointer" onClick={() => openLightbox(0)}>
          <CardContent className="p-0 relative">
            <img
              src={imageResources[0].url}
              alt={imageResources[0].title}
              className="w-full h-48 md:h-64 object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <ZoomIn className="h-8 w-8 text-white" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <h4 className="text-white font-medium text-sm mb-1">{imageResources[0].title}</h4>
              {imageResources[0].description && (
                <p className="text-white/80 text-xs line-clamp-2">{imageResources[0].description}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Thumbnail Grid */}
      {showThumbnails && imageResources.length > 1 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {imageResources.slice(1).map((image, index) => (
            <Card 
              key={index} 
              className="overflow-hidden group cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => openLightbox(index + 1)}
            >
              <CardContent className="p-0 relative">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-24 md:h-32 object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <ZoomIn className="h-5 w-5 text-white" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                  <h5 className="text-white font-medium text-xs line-clamp-1">{image.title}</h5>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <Dialog open={isLightboxOpen} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0 bg-black/95">
          {selectedImageIndex !== null && (
            <div className="relative flex items-center justify-center h-full">
              {/* Close button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-10 text-white hover:bg-white/10 rounded-full"
              >
                <X className="h-6 w-6" />
              </Button>

              {/* Navigation buttons */}
              {imageResources.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={prevImage}
                    className="absolute left-4 z-10 text-white hover:bg-white/10 rounded-full"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={nextImage}
                    className="absolute right-16 z-10 text-white hover:bg-white/10 rounded-full"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}

              {/* Main image */}
              <div className="w-full h-full flex items-center justify-center p-8">
                <img
                  src={imageResources[selectedImageIndex].url}
                  alt={imageResources[selectedImageIndex].title}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Image info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h3 className="text-white font-semibold text-lg mb-2">
                  {imageResources[selectedImageIndex].title}
                </h3>
                {imageResources[selectedImageIndex].description && (
                  <p className="text-white/80 text-sm">
                    {imageResources[selectedImageIndex].description}
                  </p>
                )}
                <div className="flex items-center justify-between mt-3">
                  <span className="text-white/60 text-xs">
                    {selectedImageIndex + 1} de {imageResources.length}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};