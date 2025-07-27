import React, { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import ArcExperience from '../components/ArcExperience';
import ConceptualExplanation from '../components/ConceptualExplanation';
import AdamProtocolDemo from '../components/AdamProtocolDemo';
import FuelEconomyDemo from '../components/FuelEconomyDemo';
import PatternLines from '../components/PatternLines';

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
    <div className="min-h-screen relative overflow-y-auto font-precision bg-black text-white">
      {/* Subtle pattern lines background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
        <PatternLines />
      </div>
      {/* Main content */}
      <div className="relative z-10">
        <div id="hero">
          <HeroSection />
        </div>

        {/* Full-screen, responsive welcome section */}
        <section className="w-full min-h-screen flex items-center justify-center font-precision fade-in-section transition-all duration-700">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-center text-white select-none">
            WELCOME TO ARC:0
          </h1>
        </section>

        {/* Immersive Arc Experience */}
        <div className="my-28 fade-in-section transition-all duration-700">
          <ArcExperience />
        </div>

        {/* Conceptual Deep Dive */}
        <div className="my-28 fade-in-section transition-all duration-700 delay-100">
          <ConceptualExplanation />
        </div>

        {/* Interactive ADAM Protocol Demo */}
        <div className="my-28 fade-in-section transition-all duration-700 delay-200">
          <AdamProtocolDemo />
        </div>

        {/* FUEL Economy Visualization */}
        <div className="my-28 fade-in-section transition-all duration-700 delay-300">
          <FuelEconomyDemo />
        </div>
      </div>
      <style>{`
        .fade-in-section {
          opacity: 0;
          transform: translateY(40px);
          animation: fadeInUp 1s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        .fade-in-section:nth-of-type(1) { animation-delay: 0.1s; }
        .fade-in-section:nth-of-type(2) { animation-delay: 0.2s; }
        .fade-in-section:nth-of-type(3) { animation-delay: 0.3s; }
        .fade-in-section:nth-of-type(4) { animation-delay: 0.4s; }
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Index;
