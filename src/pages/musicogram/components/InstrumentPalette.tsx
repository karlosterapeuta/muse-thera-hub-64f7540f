
import React from "react";
import { InstrumentType } from "../types";
import { UkuleleIcon } from "./UkuleleIcon";
import { useIsMobile } from "@/hooks/use-mobile";
import { Hand } from "lucide-react";

interface InstrumentPaletteProps {
  instruments: InstrumentType[];
  onInstrumentSelect: (instrumentId: string) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, instrument: InstrumentType, type: 'symbol' | 'instrument') => void;
}

const InstrumentPalette: React.FC<InstrumentPaletteProps> = ({
  instruments,
  onInstrumentSelect,
  onDragStart
}) => {
  const isMobile = useIsMobile();

  return (
    <div>
      <h3 className="font-medium mb-2 sm:mb-3 text-center">Instrumentos</h3>
      <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-2 gap-1 sm:gap-2">
        {instruments.map((instrument, index) => (
          <div 
            key={index} 
            className={`flex flex-col items-center justify-center p-1 sm:p-2 transition-all cursor-grab rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800`}
            onClick={() => onInstrumentSelect(instrument.id)}
            draggable
            onDragStart={(e) => {
              // Set cursor style to grabbing when dragging starts
              e.currentTarget.style.cursor = 'grabbing';
              onDragStart(e, instrument, 'instrument');
            }}
            onDragEnd={(e) => {
              // Reset cursor style when drag ends
              e.currentTarget.style.cursor = 'grab';
            }}
          >
            <div 
              className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-md transition-transform duration-200 hover:scale-110"
              style={{ color: instrument.color }}
            >
              {instrument.id === "ukulele" ? (
                <UkuleleIcon className="w-16 h-16 sm:w-20 sm:h-20" />
              ) : instrument.shape === "circle" ? (
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full" style={{ backgroundColor: instrument.color }}></div>
              ) : instrument.shape === "triangle" ? (
                <div style={{ 
                  width: '0', 
                  height: '0', 
                  borderLeft: isMobile ? '24px solid transparent' : '30px solid transparent',
                  borderRight: isMobile ? '24px solid transparent' : '30px solid transparent',
                  borderBottom: `${isMobile ? '48px' : '60px'} solid ${instrument.color}`
                }}></div>
              ) : instrument.shape === "square" ? (
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-md" style={{ backgroundColor: instrument.color }}></div>
              ) : instrument.shape === "hand" ? (
                <Hand size={isMobile ? 48 : 64} fill={instrument.color} color={instrument.color} />
              ) : instrument.shape === "footprints" ? (
                <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" width={isMobile ? "48" : "64"} height={isMobile ? "48" : "64"} fill={instrument.color}>
                    <path d="M9 1c-1.66 0-3 1.34-3 3s1.34 3 3 3s3-1.34 3-3s-1.34-3-3-3zm1.75 7l-2.5 2l1.5 1l-4.75 4.75l2 2l7-7l1.5 1l-2-5l-2.75 1.25z" />
                  </svg>
                </div>
              ) : instrument.shape === "silence" ? (
                <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center opacity-80">
                  <svg viewBox="0 0 24 24" width={isMobile ? "48" : "64"} height={isMobile ? "48" : "64"} fill={instrument.color}>
                    <path d="M12 2c-5.5 0-10 4.5-10 10s4.5 10 10 10s10-4.5 10-10s-4.5-10-10-10zm-1 15h2v-6h-2v6zm0-8h2V7h-2v2z" />
                  </svg>
                </div>
              ) : null}
            </div>
            <span className="text-[10px] sm:text-xs mt-1 text-center">{instrument.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstrumentPalette;
