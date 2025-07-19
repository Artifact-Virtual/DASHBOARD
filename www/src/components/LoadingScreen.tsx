import React, { useEffect, useState } from 'react';
import '../styles/LoadingScreen.css';

function getSystemTheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
}

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);
  const [showText, setShowText] = useState(false);
  const [theme, setTheme] = useState(getSystemTheme());

  useEffect(() => {
    const listener = (e) => setTheme(e.matches ? 'light' : 'dark');
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', listener);
    return () => window.matchMedia('(prefers-color-scheme: light)').removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowText(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const phases = [
      { duration: 1000, target: 25 },
      { duration: 1500, target: 60 },
      { duration: 800, target: 85 },
      { duration: 600, target: 100 }
    ];

    let currentProgress = 0;
    let phaseIndex = 0;

    const updateProgress = () => {
      if (phaseIndex >= phases.length) {
        setTimeout(onComplete, 800);
        return;
      }

      const currentPhase = phases[phaseIndex];
      const increment = (currentPhase.target - currentProgress) / (currentPhase.duration / 50);
      
      const interval = setInterval(() => {
        currentProgress += increment;
        setProgress(Math.min(currentProgress, currentPhase.target));
        
        if (currentProgress >= currentPhase.target) {
          clearInterval(interval);
          phaseIndex++;
          setPhase(phaseIndex);
          setTimeout(updateProgress, 200);
        }
      }, 50);
    };

    const timer = setTimeout(updateProgress, 1000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const getPhaseText = () => {
    switch (phase) {
      case 0: return "Initializing AROS Core...";
      case 1: return "Loading Quantum Engine...";
      case 2: return "Connecting Multi-Agent Systems...";
      case 3: return "Artifact Virtual Ready";
      default: return "Starting Systems...";
    }
  };

  const logoSrc = '/av-black-logo.png';

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center overflow-hidden">
      {/* Central loading content */}
      <div className="relative z-10 text-center">
        {/* Main logo */}
        <div className="mb-12 relative">
          <img 
            src={logoSrc}
            alt="Artifact Virtual"
            className="relative w-32 h-32 mx-auto transition-all duration-2000 object-contain"
            style={{
              opacity: showText ? 1 : 0,
              transform: `scale(${showText ? 1 : 0.8})`
            }}
          />
        </div>

        {/* Title */}
        <h1 
          className="text-4xl font-light tracking-wider mb-12 transition-all duration-1000 text-white"
          style={{
            opacity: showText ? 1 : 0,
            transform: `translateY(${showText ? 0 : 16}px)`
          }}
        >
          ARTIFACT VIRTUAL
        </h1>

        {/* Simple progress bar */}
        <div className="w-96 mx-auto mb-8">
          <div className="relative h-1 mb-6">
            <div className="absolute inset-0 bg-gray-800 rounded-full" />
            <div 
              className="absolute left-0 top-0 h-full bg-white rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="text-xs tracking-widest font-mono text-gray-400">
            {Math.round(progress)}% · {getPhaseText()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
