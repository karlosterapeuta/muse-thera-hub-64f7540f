import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export function ScaleGallerySection() {
  const items = [
    {
      src: '/assets-uploads/460b68cd-687b-4148-a562-03baaa061f0e.png',
      title: 'Visão Geral da Escala MuseTera',
      alt: 'Interface principal da Escala MuseTera com domínios e sistema de pontuação 0-5 visível',
    },
    {
      src: '/assets-uploads/00843ad9-07f6-49b9-a0fa-0ebd2d697fc9.png',
      title: 'Sistema de Pontuação 0–5',
      alt: 'Diagrama dos níveis 0 a 5 da Escala MuseTera com descrições dos critérios de cada nível',
    },
    {
      src: '/assets-uploads/978b95d8-86ef-426b-bb26-4ab75eb24587.png',
      title: 'Domínio Musical',
      alt: 'Tela do domínio Musical da Escala MuseTera com subdomínios e parâmetros',
    },
    {
      src: '/assets-uploads/8abd4927-9dea-44ba-a4f1-f63e79c8d171.png',
      title: 'Domínio Psicossocial',
      alt: 'Tela do domínio Psicossocial da Escala MuseTera com subdomínios e parâmetros',
    },
    {
      src: '/assets-uploads/bd8289ea-d474-46f4-87d3-48ad1567394f.png',
      title: 'Domínio Cognitivo',
      alt: 'Tela do domínio Cognitivo da Escala MuseTera com subdomínios e parâmetros',
    },
    {
      src: '/assets-uploads/6f316512-b637-496d-b3fe-472381b4c647.png',
      title: 'Domínio Sensório‑Motor',
      alt: 'Tela do domínio Sensório‑Motor da Escala MuseTera com subdomínios e parâmetros',
    },
    {
      src: '/assets-uploads/2980fc3c-0aac-41bd-bc7a-2c5aca34aca1.png',
      title: 'Domínio Comunicativo‑Interativo',
      alt: 'Tela do domínio Comunicativo‑Interativo da Escala MuseTera com subdomínios e parâmetros',
    },
  ];

  return (
    <section className="my-8">
      <h2 className="text-xl font-bold text-foreground mb-6">GALERIA DA ESCALA E SUBDOMÍNIOS</h2>
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground mb-4">
            Imagens ilustrativas da interface da Escala MuseTera, do sistema de pontuação 0–5 e dos cinco domínios com seus respectivos subdomínios.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((item, idx) => (
              <figure key={idx} className="overflow-hidden rounded-lg border bg-card">
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }}
                  className="w-full h-56 object-cover"
                />
                <figcaption className="p-3 text-xs text-muted-foreground text-center">
                  {item.title}
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Caso alguma imagem não esteja disponível, um placeholder será exibido temporariamente.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
