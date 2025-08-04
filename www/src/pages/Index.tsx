import React, { useState, useEffect, useRef } from 'react';
import PatternLines from '../components/PatternLines';
import SystemMap3D from '../components/SystemMap3D';
import ResearchCapabilities from '../components/ResearchCapabilities';
import TechnicalSpecs from '../components/TechnicalSpecs';
import '../styles/Index.css';

function getSystemTheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
}

const Index = () => {
  const [theme, setTheme] = useState(getSystemTheme());
  const [showCursor, setShowCursor] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [horizontalIndex, setHorizontalIndex] = useState(0);
  const welcomeRef = useRef(null);
  const horizontalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const listener = (e) => setTheme(e.matches ? 'light' : 'dark');
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', listener);
    return () => window.matchMedia('(prefers-color-scheme: light)').removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Horizontal scrolling for the technical showcase section
  useEffect(() => {
    const handleHorizontalScroll = (e: WheelEvent) => {
      const horizontalSection = horizontalRef.current;
      if (!horizontalSection) return;
      
      const rect = horizontalSection.getBoundingClientRect();
      const isInHorizontalSection = rect.top <= 0 && rect.bottom >= window.innerHeight;
      
      if (isInHorizontalSection && (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey)) {
        e.preventDefault();
        const maxIndex = 3; // 4 sections (0-3)
        const delta = e.shiftKey ? e.deltaY : e.deltaX;
        if (delta > 0 && horizontalIndex < maxIndex) {
          setHorizontalIndex(prev => prev + 1);
        } else if (delta < 0 && horizontalIndex > 0) {
          setHorizontalIndex(prev => prev - 1);
        }
      }
    };

    const handleKeydown = (e: KeyboardEvent) => {
      const horizontalSection = horizontalRef.current;
      if (!horizontalSection) return;
      
      const rect = horizontalSection.getBoundingClientRect();
      const isInHorizontalSection = rect.top <= 0 && rect.bottom >= window.innerHeight;
      
      if (isInHorizontalSection && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        e.preventDefault();
        const maxIndex = 3;
        if (e.key === 'ArrowRight' && horizontalIndex < maxIndex) {
          setHorizontalIndex(prev => prev + 1);
        } else if (e.key === 'ArrowLeft' && horizontalIndex > 0) {
          setHorizontalIndex(prev => prev - 1);
        }
      }
    };

    window.addEventListener('wheel', handleHorizontalScroll, { passive: false });
    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('wheel', handleHorizontalScroll);
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [horizontalIndex]);

  const logoSrc = '/av-black-logo.png';

  return (
    <div className="min-h-screen relative overflow-y-auto bg-black text-white">
      {/* Enhanced pattern lines background with parallax */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-40" 
        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
      >
        <PatternLines />
      </div>

      {/* Hero Section with Enhanced Animations */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-8 overflow-hidden">
        <div className={`text-center relative z-10 transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Professional Logo */}
          <div className="mb-8 sm:mb-12 group">
            <div className="relative inline-block">
              <img 
                src={logoSrc}
                alt="Artifact Virtual"
                className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 sm:mb-6 object-contain transition-all duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-white/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            <h1 className="text-2xl sm:text-4xl font-light text-white tracking-wider hover:tracking-widest transition-all duration-500">
              ARTIFACT VIRTUAL
            </h1>
          </div>

          {/* Interactive commit statement */}
          <div className="text-center group cursor-pointer">
            <span className="text-sm font-light text-white tracking-widest group-hover:text-cyan-400 transition-colors duration-300">
              commit.
              <span className={`inline-block w-2 h-4 ml-1 bg-white group-hover:bg-cyan-400 transition-all duration-100 ${showCursor ? 'opacity-100' : 'opacity-0'}`} />
            </span>
          </div>

          {/* Subtle scroll hint */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <span className="text-xs font-light text-white/30 tracking-widest uppercase">
              SCROLL TO ENTER
            </span>
          </div>
        </div>
      </section>

      {/* Enhanced Welcome Section with Subtle Animations */}
      <section ref={welcomeRef} className="w-full min-h-screen flex items-center justify-center relative">
        {/* Subtle background animations */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="text-center relative z-10">
          <h1 className="text-5xl md:text-8xl font-thin tracking-ultra-wide text-center select-none text-white brightness-110">
            WELCOME TO ARC:0
          </h1>
        </div>
      </section>

      {/* Technical Showcase Section - Horizontal Scroll */}
      <section ref={horizontalRef} className="w-full min-h-screen relative">
        <div className="sticky top-0 h-screen overflow-hidden">
          <div 
            className="flex h-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${horizontalIndex * 100}vw)` }}
          >
            {/* System Map */}
            <div className="flex-none w-screen h-full flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black border-r border-white/10">
              <div className="text-center">
                <h2 className="text-4xl md:text-6xl font-thin tracking-wide mb-8 text-white">SYSTEM ARCHITECTURE</h2>
                <p className="text-white/60 font-light tracking-wide max-w-2xl mx-auto mb-12">
                  Interactive visualization of the Artifact Virtual ecosystem components and their interconnections.
                </p>
                <div className="w-full max-w-6xl mx-auto">
                  <SystemMap3D />
                </div>
              </div>
            </div>

            {/* Research Capabilities */}
            <div className="flex-none w-screen h-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 border-r border-white/10">
              <div className="w-full max-w-7xl mx-auto px-8">
                <ResearchCapabilities />
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="flex-none w-screen h-full flex items-center justify-center bg-gradient-to-br from-black via-gray-800 to-black border-r border-white/10">
              <div className="w-full max-w-7xl mx-auto px-8">
                <TechnicalSpecs />
              </div>
            </div>

            {/* System Simulation */}
            <div className="flex-none w-screen h-full flex items-center justify-center bg-gradient-to-br from-gray-800 via-black to-gray-900">
              <div className="text-center">
                <h2 className="text-4xl md:text-6xl font-thin tracking-wide mb-8 text-white">LIVE SIMULATION</h2>
                <p className="text-white/60 font-light tracking-wide max-w-2xl mx-auto mb-12">
                  Real-time system simulation and network activity monitoring.
                </p>
                <div className="text-white/40 font-light tracking-wide">System Simulation Loading...</div>
              </div>
            </div>
          </div>
          
          {/* Horizontal Navigation Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
            {[0, 1, 2, 3].map((index) => (
              <button
                key={index}
                onClick={() => setHorizontalIndex(index)}
                className={`w-2 h-2 transition-all duration-300 ${
                  horizontalIndex === index 
                    ? 'bg-white scale-125' 
                    : 'bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
          
          {/* Scroll Instructions */}
          <div className="absolute top-8 right-8 text-white/40 font-light tracking-wide text-sm">
            <div className="text-right">
              <div className="mb-1">HORIZONTAL SCROLL</div>
              <div className="text-xs">← → or Shift + Scroll</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
