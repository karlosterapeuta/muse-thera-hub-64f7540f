
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Star, Music, Mic } from 'lucide-react';

interface MagicalGuideProps {
  character: 'fada' | 'mago' | 'estrela' | 'pássaro';
  message: string;
  isAnimating?: boolean;
}

const MagicalGuide = ({ character, message, isAnimating = true }: MagicalGuideProps) => {
  const getCharacterIcon = () => {
    switch (character) {
      case 'fada':
        return <Sparkles className="text-purple-500 w-8 h-8" />;
      case 'mago':
        return <Star className="text-amber-500 w-8 h-8" />;
      case 'estrela':
        return <Star className="text-yellow-500 w-8 h-8" />;
      case 'pássaro':
        return <Music className="text-blue-500 w-8 h-8" />;
    }
  };

  return (
    <motion.div
      className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg shadow-sm"
      animate={isAnimating ? {
        y: [0, -5, 0],
        scale: [1, 1.02, 1]
      } : undefined}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <div className="relative">
        {getCharacterIcon()}
        <motion.div
          className="absolute -inset-1 bg-white/50 rounded-full z-0"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.2, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      <p className="text-sm font-medium text-purple-700">{message}</p>
    </motion.div>
  );
};

export default MagicalGuide;
