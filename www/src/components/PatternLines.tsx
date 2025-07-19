
import React from 'react';

const PatternLines = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Diagonal lines pattern */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-white/10 to-transparent transform rotate-45 animate-pulse"
            style={{
              left: `${i * 10 - 50}%`,
              top: `${i * 5}%`,
              width: '200%',
              animationDelay: `${i * 0.2}s`,
              animationDuration: '4s'
            }}
          />
        ))}
      </div>
      
      {/* Vertical lines */}
      <div className="absolute inset-0">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute w-px bg-gradient-to-b from-transparent via-white/5 to-transparent"
            style={{
              left: `${i * 12.5}%`,
              height: '100%',
            }}
          />
        ))}
      </div>
      
      {/* Horizontal lines */}
      <div className="absolute inset-0">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute h-px bg-gradient-to-r from-transparent via-white/5 to-transparent w-full"
            style={{
              top: `${i * 16.67}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default PatternLines;
