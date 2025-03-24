"use client";

import React, { memo } from 'react';
import Aurora from './Aurora';

interface BackgroundProps {
  colorStops?: string[];
  amplitude?: number;
  blend?: number;
  speed?: number;
}

// Optimize the background with memoization to prevent unnecessary re-renders
const Background = memo(function Background({ 
  colorStops = ["#4a00e0", "#8e2de2", "#00d8ff"], 
  amplitude = 1.0,
  blend = 0.6,
  speed = 0.4
}: BackgroundProps) {
  return (
    <div className="fixed inset-0 w-full h-full z-[-1] overflow-hidden">
      {/* Overlay gradient for better visual blend */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-black via-purple-950 to-black opacity-70"
        style={{ 
          backgroundImage: 'radial-gradient(circle at center, rgba(35, 9, 57, 0.5), rgba(10, 10, 10, 0.9))' 
        }}
      />
      
      {/* Aurora animation */}
      <Aurora 
        colorStops={colorStops} 
        amplitude={amplitude} 
        blend={blend}
        speed={speed}
      />
    </div>
  );
});

Background.displayName = 'Background';

export default Background; 