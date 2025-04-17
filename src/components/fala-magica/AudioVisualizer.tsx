
import { motion } from "framer-motion";
import React from "react";

interface AudioVisualizerProps {
  audioData: Uint8Array;
  isActive: boolean;
}

const AudioVisualizer = ({ audioData, isActive }: AudioVisualizerProps) => {
  const numberOfBars = 32; // Number of frequency bars to display
  const colors = [
    'bg-purple-500', 'bg-pink-500', 'bg-red-500', 
    'bg-orange-500', 'bg-yellow-500', 'bg-lime-400',
    'bg-green-500', 'bg-cyan-400', 'bg-blue-500'
  ];

  // Create an array of bars with their heights based on audio data
  const bars = Array.from({ length: numberOfBars }, (_, i) => {
    const dataIndex = Math.floor(i * (audioData.length / numberOfBars));
    const value = audioData[dataIndex] || 0;
    const height = `${Math.max(2, (value / 255) * 100)}%`;
    const colorIndex = Math.floor((i / numberOfBars) * colors.length);
    
    return {
      height,
      color: colors[colorIndex],
    };
  });

  return (
    <div className="w-full h-48 bg-black rounded-lg p-4 flex items-end gap-1">
      {bars.map((bar, index) => (
        <motion.div
          key={index}
          className={`w-full ${bar.color}`}
          style={{ height: bar.height }}
          initial={{ height: "2%" }}
          animate={{ 
            height: bar.height,
            transition: { type: "spring", stiffness: 300, damping: 20 }
          }}
          transition={{ duration: 0.1 }}
        />
      ))}
    </div>
  );
};

export default AudioVisualizer;
