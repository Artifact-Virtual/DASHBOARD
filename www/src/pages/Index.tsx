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

        {/* Full-screen, responsive welcome section */}
        <section className="w-full min-h-screen flex items-center justify-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-center text-white select-none">
            WELCOME TO ARC:0
          </h1>
        </section>
      </div>
    </div>
  );
};

export default Index;
