
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

// Simple photo gallery using public images. Images are served from /assets-uploads
// All images include descriptive alt text for accessibility and SEO.
export function PhotosSection() {
  const photos = [
    {
      src: '/lovable-uploads/3d7825ca-4115-46a1-a33f-069a18aaf1a2.png',
      alt: 'Sessão de musicoterapia com instrumentos de percussão leves em ambiente clínico',
      caption: 'Sessão individual com foco em coordenação rítmica e autorregulação.'
    },
    {
      src: '/lovable-uploads/6302f00d-e2bf-4d19-95f3-eb52823c19d8.png',
      alt: 'Paciente utilizando xilofone colorido durante avaliação musicoterapêutica',
      caption: 'Uso de instrumentos melódicos para avaliação de percepção e expressão musical.'
    },
    {
      src: '/lovable-uploads/80847e14-0ceb-4478-9e62-d9757cbd7b10.png',
      alt: 'Atividade de comunicação não-verbal com sinais musicais em musicoterapia',
      caption: 'Interação comunicativa e turnos conversacionais mediados pela música.'
    },
    {
      src: '/lovable-uploads/65fe902f-d08a-48e5-8c93-7c4a7cc6e6a6.png',
      alt: 'Técnicas de integração sensório-motora com instrumentos vibratórios',
      caption: 'Integração sensório-motora e propriocepção com suporte musical.'
    }
  ];

  return (
    <section className="my-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">FOTOGRAFIAS DA PRÁTICA CLÍNICA</h2>
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-700 text-sm mb-4">
            Amostras visuais ilustrativas de contextos reais de musicoterapia que inspiraram o
            desenvolvimento e a validação da Escala MuseTera. As imagens demonstram a aplicação
            clínica nos domínios musical, psicossocial, cognitivo, sensório-motor e comunicativo-interativo.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {photos.map((photo, idx) => (
              <figure key={idx} className="overflow-hidden rounded-lg border bg-white">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  className="w-full h-56 object-cover"
                />
                <figcaption className="p-3 text-xs text-gray-600">
                  {photo.caption}
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Observação: As fotografias são ilustrativas e representam situações típicas de intervenção musicoterapêutica.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
