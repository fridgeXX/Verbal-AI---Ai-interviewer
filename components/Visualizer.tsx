
import React, { useEffect, useState } from 'react';

interface VisualizerProps {
  isActive: boolean;
  isModelSpeaking: boolean;
}

const Visualizer: React.FC<VisualizerProps> = ({ isActive, isModelSpeaking }) => {
  const [bars, setBars] = useState<number[]>(new Array(12).fill(1));

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setBars(new Array(12).fill(0).map(() => 
        Math.random() * (isModelSpeaking ? 80 : 40) + 10
      ));
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, isModelSpeaking]);

  return (
    <div className="relative flex items-center justify-center w-80 h-40 border border-theme-border bg-theme-text/5 p-10 rounded-theme">
      <div className="flex items-end gap-1.5 h-full">
        {bars.map((height, i) => (
          <div
            key={i}
            className={`w-3 transition-all duration-100 ease-in-out rounded-t-sm ${
              isModelSpeaking ? 'bg-theme-accent' : 'bg-theme-text/20'
            }`}
            style={{
              height: `${isActive ? height : 5}%`,
              opacity: isActive ? 1 : 0.4,
            }}
          />
        ))}
      </div>
      
      {/* Subtle corner ticks */}
      <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-theme-border" />
      <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-theme-border" />
      <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-theme-border" />
      <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-theme-border" />
      
      <div className="absolute top-4 left-4 text-[8px] font-bold opacity-40 uppercase tracking-widest text-theme-text">
        Voice Engine Output
      </div>
    </div>
  );
};

export default Visualizer;
