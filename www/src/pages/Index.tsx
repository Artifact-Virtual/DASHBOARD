import React, { useState, useEffect, useRef } from 'react';
import NoiseLinesBackground from '../components/NoiseLinesBackground';
import TradingViewWidget from '../components/TradingViewWidget';
import HorizontalScrollPanel from '../components/HorizontalScrollPanel';
import FloatingTopArrow from '../components/FloatingTopArrow';
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
  const [showArrow, setShowArrow] = useState(false);
  const welcomeRef = useRef(null);
  const horizontalSectionRef = useRef<HTMLDivElement | null>(null);
  // Show floating arrow only when horizontal section is in view
  useEffect(() => {
    const section = horizontalSectionRef.current;
    if (!section) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => setShowArrow(entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

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

  // apply CSS variable for welcome scale transform to avoid inline styles
  useEffect(() => {
    const welcomeSection = welcomeRef.current as HTMLElement;
    if (welcomeSection) {
      const wrapper = welcomeSection.querySelector('.welcome-scale-wrapper') as HTMLElement;
      if (wrapper) {
        const scale = Math.max(0.5, 1 - scrollY / 1000);
        const opacity = Math.max(0.3, 1 - scrollY / 800);
        wrapper.style.setProperty('--scale', scale.toString());
        wrapper.style.setProperty('--opacity', opacity.toString());
      }
    }
  }, [scrollY])


  const logoSrc = '/av-black-logo.png';

  return (
    <div className="min-h-screen relative overflow-y-auto bg-black text-white">
      {/* Full-screen noise lines background (first section only) */}
      <NoiseLinesBackground />

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

          {/* Interactive commit statement - now scrolls to welcome section */}
          <div
            className="text-center group cursor-pointer"
            onClick={() => {
              if (welcomeRef.current) {
                (welcomeRef.current as HTMLElement).scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            <span className="text-sm font-light text-white tracking-widest group-hover:text-cyan-400 transition-colors duration-300">
              commit.
              <span className={`inline-block w-2 h-4 ml-1 bg-white group-hover:bg-cyan-400 transition-all duration-100 ${showCursor ? 'opacity-100' : 'opacity-0'}`} />
            </span>
          </div>
        </div>
      </section>

      {/* Welcome Section - Scales down on scroll */}
  <section ref={welcomeRef} className="w-full min-h-screen flex items-center justify-center relative bg-black welcome-section-footer">
        <div 
          ref={(el) => {
            if (el) {
              const scale = Math.max(0.5, 1 - scrollY / 1000);
              const opacity = Math.max(0.3, 1 - scrollY / 800);
              (el.style as any).setProperty('--scale', scale);
              (el.style as any).setProperty('--opacity', opacity);
            }
          }}
          className="text-center w-full welcome-scale-wrapper"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-thin tracking-ultra-wide text-center select-none text-white brightness-110">
            WELCOME TO ARC:0
          </h1>
        </div>
        {/* Tagline pinned to the bottom of the welcome section */}
        <div className="w-full">
          <p className="page-foot-tagline text-sm text-muted-foreground">at the end of everything, there is a beginning.</p>
        </div>
      </section>

      

      {/* Trading Section */}
      <section className="w-full min-h-screen relative trading-section flex items-center justify-center">
        <div className="text-center w-full max-w-6xl mx-auto px-4">
          <h2 className="text-4xl md:text-6xl font-thin tracking-wide mb-8 text-white">Live Market Intelligence</h2>
          <div className="w-full max-w-4xl mx-auto" id="tradingview-section">
            <TradingViewWidget symbol="BINANCE:BTCUSDT" />
          </div>
        </div>
      </section>

      {/* Horizontal scroll final section with animated floating arrow */}
      <section ref={horizontalSectionRef} className="w-full min-h-screen relative overflow-hidden">
        <div className={`fixed top-6 left-1/2 z-50 floating-arrow-animate ${showArrow ? 'floating-arrow-animate-show' : 'floating-arrow-animate-hide'}`}>
          <FloatingTopArrow scrollTargetId="tradingview-section" />
        </div>
        <HorizontalScrollPanel />
      </section>
    </div>
  );
};

export default Index;
