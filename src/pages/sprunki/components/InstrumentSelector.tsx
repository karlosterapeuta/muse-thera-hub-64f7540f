
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music, Guitar, Wind, Drum, Zap } from 'lucide-react';

const instruments = [
  {
    id: 'piano',
    name: 'Piano',
    icon: <Music className="w-5 h-5" />,
    description: 'Som suave e clássico',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'guitar',
    name: 'Violão',
    icon: <Guitar className="w-5 h-5" />,
    description: 'Cordas vibrantes',
    color: 'from-amber-500 to-amber-600'
  },
  {
    id: 'flute',
    name: 'Flauta',
    icon: <Wind className="w-5 h-5" />,
    description: 'Melodias etéreas',
    color: 'from-cyan-500 to-cyan-600'
  },
  {
    id: 'drums',
    name: 'Bateria',
    icon: <Drum className="w-5 h-5" />,
    description: 'Ritmos poderosos',
    color: 'from-red-500 to-red-600'
  },
  {
    id: 'synth',
    name: 'Sintetizador',
    icon: <Zap className="w-5 h-5" />,
    description: 'Sons eletrônicos',
    color: 'from-purple-500 to-purple-600'
  }
];

interface InstrumentSelectorProps {
  selectedInstrument: string;
  onInstrumentChange: (instrument: string) => void;
}

const InstrumentSelector: React.FC<InstrumentSelectorProps> = ({
  selectedInstrument,
  onInstrumentChange
}) => {
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Music className="w-5 h-5 text-purple-600" />
          Instrumentos
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {instruments.map((instrument) => (
            <Button
              key={instrument.id}
              onClick={() => onInstrumentChange(instrument.id)}
              variant={selectedInstrument === instrument.id ? "default" : "outline"}
              className={`
                w-full justify-start h-auto p-4 transition-all duration-300
                ${selectedInstrument === instrument.id 
                  ? `bg-gradient-to-r ${instrument.color} text-white shadow-lg scale-105` 
                  : 'hover:shadow-md hover:scale-102'
                }
              `}
            >
              <div className="flex items-center gap-3 w-full">
                <div className={`
                  p-2 rounded-full 
                  ${selectedInstrument === instrument.id 
                    ? 'bg-white/20' 
                    : 'bg-gray-100 dark:bg-gray-700'
                  }
                `}>
                  {instrument.icon}
                </div>
                <div className="text-left flex-1">
                  <div className="font-medium text-sm">
                    {instrument.name}
                  </div>
                  <div className={`
                    text-xs 
                    ${selectedInstrument === instrument.id 
                      ? 'text-white/80' 
                      : 'text-gray-500 dark:text-gray-400'
                    }
                  `}>
                    {instrument.description}
                  </div>
                </div>
                {selectedInstrument === instrument.id && (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
              </div>
            </Button>
          ))}
        </div>

        {/* Sound preview */}
        <div className="mt-4 p-3 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
          <div className="text-sm text-center">
            <span className="font-medium">Instrumento Selecionado:</span>
            <br />
            <span className="text-purple-700 dark:text-purple-300 capitalize">
              {instruments.find(i => i.id === selectedInstrument)?.name || 'Piano'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstrumentSelector;
