
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

interface AudioVisualizerProps {
  audioData: Uint8Array;
  isActive: boolean;
}

const AudioVisualizer = ({ audioData, isActive }: AudioVisualizerProps) => {
  const numberOfBars = 32;
  const [maxHeight, setMaxHeight] = useState<number[]>(Array(numberOfBars).fill(2));
  
  // Enhanced vibrant color palette with gradient mapping
  const generateBarColor = (frequency: number, intensity: number) => {
    // Map frequency to hue value (0-360)
    const hue = Math.floor((frequency / 255) * 360);
    // Intensity affects saturation and lightness
    const saturation = Math.min(100, 60 + intensity * 0.4);
    const lightness = Math.min(70, 40 + intensity * 0.3);
    
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };
  
  // Update max heights with decay effect
  useEffect(() => {
    if (!isActive) return;
    
    const timer = setInterval(() => {
      setMaxHeight(prev => prev.map(height => Math.max(2, height * 0.9)));
    }, 80);
    
    return () => clearInterval(timer);
  }, [isActive]);

  // Create an array of bars with their heights and colors based on audio data
  const bars = Array.from({ length: numberOfBars }, (_, i) => {
    const dataIndex = Math.floor(i * (audioData.length / numberOfBars));
    const value = audioData[dataIndex] || 0;
    
    // Enhanced amplification factor
    const amplificationFactor = 6.0;
    const baseHeightPercentage = Math.max(2, (value / 255) * 100);
    const heightPercentage = Math.min(100, baseHeightPercentage * amplificationFactor);
    
    // Update max height if current height is greater
    if (heightPercentage > maxHeight[i]) {
      maxHeight[i] = heightPercentage;
    }
    
    // Dynamic color generation based on frequency and intensity
    const intensity = value / 255; // Normalized intensity (0-1)
    const dynamicColor = generateBarColor(value, intensity);
    
    // Add more randomness to make visualization more lively
    const variationFactor = isActive && value > 2 ? (1 + Math.random() * 0.8) : 1;
    const displayHeight = `${heightPercentage * variationFactor}%`;
    const maxDisplayHeight = `${maxHeight[i]}%`;
    
    return {
      height: displayHeight,
      maxHeight: maxDisplayHeight,
      color: dynamicColor,
      value,
      intensity
    };
  });

  return (
    <div className="w-full h-48 bg-black bg-opacity-90 rounded-lg p-4 flex items-end gap-1 relative">
      {bars.map((bar, index) => (
        <div key={index} className="relative h-full flex-1 flex flex-col justify-end">
          {/* Peak indicator with dynamic color */}
          <motion.div
            className="absolute w-full h-1 opacity-70 rounded-t-sm z-10"
            style={{ 
              bottom: bar.maxHeight,
              backgroundColor: bar.color,
              filter: `brightness(${1.2 + bar.intensity * 0.3})` // Brighter peaks
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isActive ? 0.8 : 0.2 }}
            transition={{ duration: 0.2 }}
          />
          
          {/* Main bar with dynamic color and glow effect */}
          <motion.div
            className={`w-full rounded-sm ${
              bar.value > 50 ? 'animate-pulse' : ''
            }`}
            style={{ 
              height: bar.height,
              backgroundColor: bar.color,
              boxShadow: bar.intensity > 0.5 ? `0 0 ${Math.floor(bar.intensity * 20)}px ${bar.color}` : 'none'
            }}
            initial={{ height: "2%" }}
            animate={{ 
              height: bar.height,
              transition: { 
                type: "spring", 
                stiffness: 600,
                damping: isActive ? 3 : 15
              }
            }}
            transition={{ duration: 0.05 }}
          />
        </div>
      ))}
      
      {/* Grid lines with gradient opacity */}
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none p-4">
        {[0, 1, 2, 3].map((_, i) => (
          <div 
            key={i} 
            className="w-full h-px"
            style={{
              background: `rgba(255, 255, 255, ${0.1 - i * 0.02})`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AudioVisualizer;
