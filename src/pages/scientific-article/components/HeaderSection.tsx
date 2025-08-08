
import React from 'react';

export function HeaderSection() {
  return (
    <div className="text-center border-b pb-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Escala de Avaliação MuseTera TEA: Desenvolvimento e Validação de um Instrumento 
        de Avaliação Musicoterapêutica com Sistema de Pontuação Expandido (0-5) para 
        Análise Multidimensional do Transtorno do Espectro Autista
      </h1>
      <p className="text-lg text-gray-600 mb-4">
        MuseTera TEA Assessment Scale: Development and Validation of a Music Therapy Assessment Tool 
        with Expanded Scoring System (0-5) for Multidimensional Analysis of Autism Spectrum Disorder
      </p>
      <div className="text-gray-700">
        <p className="font-medium">José Carlos Batista da Silva¹, Dr.</p>
        <p className="text-sm">¹Plataforma MuseTera para Musicoterapeutas - Brasil</p>
        <p className="text-sm">Especialista em Musicoterapia Neurológica e Desenvolvimento</p>
        <p className="text-xs mt-2">
          Endereço para correspondência: josecarlos@musetera.com.br
        </p>
      </div>
    </div>
  );
}
