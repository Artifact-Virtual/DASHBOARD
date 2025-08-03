
import React, { useEffect, useState } from 'react';

const PatternLines = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Interactive diagonal lines pattern */}
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
              animationDuration: '4s',
              opacity: Math.max(0.1, 1 - Math.abs(mousePos.x - window.innerWidth / 2) / 1000)
            }}
          />
        ))}
      </div>
      
      {/* Interactive vertical lines */}
      <div className="absolute inset-0">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute w-px bg-gradient-to-b from-transparent via-white/8 to-transparent transition-opacity duration-300"
            style={{
              left: `${i * 12.5}%`,
              height: '100%',
              opacity: Math.max(0.3, 1 - Math.abs((i * 12.5) - (mousePos.x / window.innerWidth * 100)) / 50)
            }}
          />
        ))}
      </div>
      
      {/* Interactive horizontal lines */}
      <div className="absolute inset-0">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute h-px bg-gradient-to-r from-transparent via-white/8 to-transparent w-full transition-opacity duration-300"
            style={{
              top: `${i * 16.67}%`,
              opacity: Math.max(0.3, 1 - Math.abs((i * 16.67) - (mousePos.y / window.innerHeight * 100)) / 30)
            }}
          />
        ))}
      </div>

      {/* Mouse follower effect */}
      <div
        className="absolute w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl transition-all duration-300 pointer-events-none"
        style={{
          left: mousePos.x - 64,
          top: mousePos.y - 64,
        }}
      />
    </div>
  );
};

export default PatternLines;
