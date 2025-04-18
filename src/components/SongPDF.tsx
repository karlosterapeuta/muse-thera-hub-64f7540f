import React from 'react';
import LogoRound from './LogoRound';

interface Note {
  note: string;
  color: string;
  colorName: string;
  label?: string;
}

interface Song {
  title: string;
  notes: string[];
  lyrics: string[];
  description: string;
}

interface SongPDFProps {
  song: Song;
  notes: Note[];
}

export const SongPDF: React.FC<SongPDFProps> = ({ song, notes }) => {
  return (
    <div className="bg-white p-8" style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #E5E7EB' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
          <div style={{ width: '20px', height: '20px', marginRight: '12px' }}>
            <img
              src="/lovable-uploads/934e42dc-e002-4eaa-add0-0fd741e314c8.png"
              alt="Musetera Logo"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
            />
          </div>
          <h1 style={{ color: '#6D28D9', fontSize: '24px', fontWeight: 'bold' }}>
            {song.title}
          </h1>
        </div>
        <p style={{ color: '#6B7280', fontSize: '14px' }}>
          {song.description}
        </p>
        <p style={{ color: '#6B7280', fontSize: '13px' }}>
          Data de geração: {new Date().toLocaleDateString('pt-BR')}
        </p>
      </div>

      <div style={{ marginBottom: '32px', padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#111827' }}>
          Sinos Musicais - Cores e Notas
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
          {notes.map((note) => (
            <div key={note.note} style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              width: '60px'
            }}>
              <div
                style={{ 
                  width: '20px', 
                  height: '20px', 
                  borderRadius: '50%', 
                  backgroundColor: note.color,
                  marginBottom: '4px'
                }}
              ></div>
              <span style={{ fontWeight: '600' }}>{note.note}</span>
              <span style={{ fontSize: '10px', color: '#6B7280' }}>{note.colorName}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#111827', textAlign: 'center' }}>
          Partitura Visual
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {Array.from({ length: Math.ceil(song.notes.length / 6) }).map((_, rowIndex) => {
            const startIdx = rowIndex * 6;
            const endIdx = Math.min(startIdx + 6, song.notes.length);
            const rowNotes = song.notes.slice(startIdx, endIdx);
            const rowLyrics = song.lyrics.slice(startIdx, endIdx);
            
            return (
              <div key={rowIndex} style={{ marginBottom: '16px', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '8px' }}>
                  {rowNotes.map((noteKey, noteIdx) => {
                    const noteData = notes.find(n => n.note === noteKey);
                    return (
                      <div 
                        key={`${noteKey}-${noteIdx}`} 
                        style={{ 
                          width: '50px', 
                          height: '50px', 
                          borderRadius: '50%', 
                          backgroundColor: noteData?.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: noteData?.color === "#FFFFFF" ? '#333' : '#fff',
                          fontWeight: 'bold',
                          fontSize: '18px'
                        }}
                      >
                        {noteKey}
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                  {rowLyrics.map((lyric, lyricIdx) => (
                    <div 
                      key={`lyric-${lyricIdx}`} 
                      style={{ 
                        width: '50px', 
                        textAlign: 'center',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    >
                      {lyric}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: '32px', padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px', color: '#111827' }}>
          Como tocar esta música
        </h3>
        <ol style={{ paddingLeft: '20px', fontSize: '14px', color: '#4B5563', lineHeight: '1.5' }}>
          <li>Identifique as notas musicais pelas cores dos sinos.</li>
          <li>Toque cada nota na ordem apresentada acima.</li>
          <li>Você pode cantar as sílabas mostradas abaixo de cada nota.</li>
          <li>Experimente tocar em ritmos diferentes para criar variações da música.</li>
        </ol>
      </div>

      <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '2px solid #E5E7EB', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ width: '40px', height: '40px', marginRight: '8px' }}>
            <img
              src="/lovable-uploads/934e42dc-e002-4eaa-add0-0fd741e314c8.png"
              alt="Musetera Logo"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
            />
          </div>
          <p style={{ color: '#6B7280', fontSize: '14px', fontWeight: 'bold' }}>
            Musetera - Sistema de Gestão para Musicoterapia
          </p>
        </div>
        <p style={{ color: '#6B7280', fontSize: '11px', marginBottom: '4px' }}>
          Documento gerado em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
        </p>
      </div>
    </div>
  );
};
