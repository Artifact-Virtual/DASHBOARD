
import React, { useState, useEffect } from 'react';

function getSystemTheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
}

const HeroSection = () => {
  const [showCursor, setShowCursor] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [theme, setTheme] = useState(getSystemTheme());

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

  const logoSrc = '/av-black-logo.png';

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-8 overflow-hidden bg-black">
      <div className={`text-center relative z-10 transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Logo */}
        <div className="mb-8 sm:mb-12">
          <img 
            src={logoSrc}
            alt="Artifact Virtual"
            className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 sm:mb-6 object-contain"
          />
          <h1 className="text-2xl sm:text-4xl font-light text-white tracking-wider">
            ARTIFACT VIRTUAL
          </h1>
        </div>

        {/* Minimalist commit statement */}
        <div className="text-center">
          <span className="text-sm font-light text-white tracking-widest">
            commit.
            <span className={`inline-block w-2 h-4 ml-1 bg-white transition-opacity duration-100 ${showCursor ? 'opacity-100' : 'opacity-0'}`} />
          </span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
