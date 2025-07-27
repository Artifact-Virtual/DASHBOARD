import React, { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';

function getSystemTheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
}

const Index = () => {
  const [theme, setTheme] = useState(getSystemTheme());

  useEffect(() => {
    const listener = (e) => setTheme(e.matches ? 'light' : 'dark');
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', listener);
    return () => window.matchMedia('(prefers-color-scheme: light)').removeEventListener('change', listener);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-y-auto">
      {/* Main content */}
      <div className="relative z-10">
        <div id="hero">
          <HeroSection />
        </div>

        {/* Add more sections here as needed */}
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-4xl font-light mb-4">Welcome to Artifact Virtual</h2>
            <p className="text-xl text-gray-400">Navigate horizontally with scroll wheel + shift or arrow keys</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
