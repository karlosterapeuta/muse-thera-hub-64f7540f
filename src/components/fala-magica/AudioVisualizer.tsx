
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

interface AudioVisualizerProps {
  audioData: Uint8Array;
  isActive: boolean;
}

const AudioVisualizer = ({ audioData, isActive }: AudioVisualizerProps) => {
  const numberOfBars = 32; // Number of frequency bars to display
  const [maxHeight, setMaxHeight] = useState<number[]>(Array(numberOfBars).fill(2));
  
  // Enhanced color palette for better visual impact
  const colors = [
    'bg-purple-500', 'bg-pink-500', 'bg-red-500', 
    'bg-orange-500', 'bg-yellow-500', 'bg-lime-400',
    'bg-green-500', 'bg-cyan-400', 'bg-blue-500',
    'bg-indigo-500', 'bg-violet-500', 'bg-fuchsia-500'
  ];

  // Update max heights with decay effect
  useEffect(() => {
    if (!isActive) return;
    
    const timer = setInterval(() => {
      setMaxHeight(prev => prev.map(height => Math.max(2, height * 0.92))); // Faster decay for more responsive peaks
    }, 100); // Faster updates
    
    return () => clearInterval(timer);
  }, [isActive]);

  // Create an array of bars with their heights based on audio data
  const bars = Array.from({ length: numberOfBars }, (_, i) => {
    // Map the bar index to a position in the audio data array
    const dataIndex = Math.floor(i * (audioData.length / numberOfBars));
    const value = audioData[dataIndex] || 0;
    
    // Apply a stronger amplification factor to make the visualization more responsive
    const amplificationFactor = 4.5; // Increased even more for better visibility
    const baseHeightPercentage = Math.max(2, (value / 255) * 100);
    const heightPercentage = Math.min(100, baseHeightPercentage * amplificationFactor);
    
    // Update max height if current height is greater
    if (heightPercentage > maxHeight[i]) {
      maxHeight[i] = heightPercentage;
    }
    
    // Add some randomness to make visualization more lively when active
    const variationFactor = isActive && value > 2 ? (1 + Math.random() * 0.6) : 1; // More variation
    const displayHeight = `${heightPercentage * variationFactor}%`;
    const maxDisplayHeight = `${maxHeight[i]}%`;
    
    const colorIndex = Math.floor((i / numberOfBars) * colors.length);
    
    return {
      height: displayHeight,
      maxHeight: maxDisplayHeight,
      color: colors[colorIndex],
      value
    };
  });

  return (
    <div className="w-full h-48 bg-black bg-opacity-90 rounded-lg p-4 flex items-end gap-1 relative">
      {bars.map((bar, index) => (
        <div key={index} className="relative h-full flex-1 flex flex-col justify-end">
          {/* Peak indicator */}
          <motion.div
            className={`absolute w-full h-1 ${bar.color} opacity-70 rounded-t-sm z-10`}
            style={{ bottom: bar.maxHeight }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isActive ? 0.8 : 0.2 }}
            transition={{ duration: 0.2 }}
          />
          
          {/* Main bar */}
          <motion.div
            className={`w-full ${bar.color} rounded-sm ${
              bar.value > 60 ? 'animate-pulse' : ''
            }`}
            style={{ height: bar.height }}
            initial={{ height: "2%" }}
            animate={{ 
              height: bar.height,
              transition: { 
                type: "spring", 
                stiffness: 500, // More responsive
                damping: isActive ? 5 : 20  // Lower damping for more bouncy effect
              }
            }}
            transition={{ duration: 0.05 }}
          />
        </div>
      ))}
      
      {/* Grid lines */}
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none p-4">
        {[0, 1, 2, 3].map((_, i) => (
          <div 
            key={i} 
            className="w-full h-px bg-white bg-opacity-10"
          />
        ))}
      </div>
    </div>
  );
};

export default AudioVisualizer;
