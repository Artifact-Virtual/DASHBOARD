import React, { useState, useEffect, useRef } from 'react';
import FinalFooter from '../components/FinalFooter';
import MouseRepelCanvas from '../components/MouseRepelCanvas';

import NoiseLinesBackground from '../components/NoiseLinesBackground';
import TradingViewWidget from '../components/TradingViewWidget';
import HorizontalScrollPanel from '../components/HorizontalScrollPanel';
import FloatingTopArrow from '../components/FloatingTopArrow';
import WingsShowcase from '../components/WingsShowcase';
import '../styles/Index.css';
import '../styles/LiveMarket.css';
import '../styles/LiveMarket.css';

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

  // Enhanced scroll/zoom/doorway effect for welcome section
  useEffect(() => {
    const welcomeSection = welcomeRef.current as HTMLElement;
    if (!welcomeSection) return;
    const wrapper = welcomeSection.querySelector('.welcome-scale-wrapper') as HTMLElement;
    if (!wrapper) return;

    // Get section position relative to viewport
    const rect = welcomeSection.getBoundingClientRect();
    const windowH = window.innerHeight;
    // How far into the section are we? 0 = top, 1 = bottom
    const progress = Math.min(1, Math.max(0, (windowH - rect.top) / (rect.height + windowH * 0.5)));

    // Zoom in as we enter, then zoom out and move down as we leave
    let scale = 1;
    let translateY = 0;
    if (progress < 0.5) {
      // Entering: zoom in from 0.8 to 1.1
      scale = 0.8 + progress * 0.6;
      translateY = 0;
    } else {
      // Exiting: zoom out from 1.1 to 0.7, move down up to 120px
      scale = 1.1 - (progress - 0.5) * 0.8;
      translateY = (progress - 0.5) * 240;
    }
    // Clamp
    scale = Math.max(0.6, Math.min(1.1, scale));
    translateY = Math.max(0, Math.min(120, translateY));
    wrapper.style.setProperty('--scale', scale.toString());
    wrapper.style.setProperty('--translateY', `${translateY}px`);
  }, [scrollY]);


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



      {/* Section 2: The Artifact Thesis */}
      <section id="vision" className="relative bg-black text-neutral-300 py-24 sm:py-32 px-4 sm:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          {/* Abstract background grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:36px_36px]"></div>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12 items-center">
          <div className="md:col-span-3">
            <h2 className="text-sm font-light uppercase tracking-[0.3em] text-cyan-400 mb-4">The Thesis</h2>
            <h3 className="text-3xl sm:text-5xl font-light text-white leading-tight tracking-wider mb-6">
              A Framework for Holistic Innovation.
            </h3>
            <p className="font-light text-lg text-neutral-400 max-w-2xl leading-relaxed">
              Artifact Virtual is not just a company; it's a research organism. We operate at the intersection of radical theory and tangible application. Our mission is to explore the technological frontier, prototype the future, and deploy systems that redefine the boundaries of what's possible.
            </p>
          </div>
          <div className="md:col-span-2 flex items-center justify-center">
            <div className="relative w-48 h-48 sm:w-64 sm:h-64">
              <div className="absolute inset-0 border-2 border-neutral-800 rounded-full animate-spin-slow"></div>
              <div className="absolute inset-4 border border-neutral-700 rounded-full animate-spin-slow-reverse"></div>
              <div className="absolute inset-8 bg-cyan-900/40 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-cyan-400 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 01-1.414 1.414L12 6.414l-2.293 2.293a1 1 0 01-1.414-1.414L10 4.293a1 1 0 012 0zm2.293 7.293a1 1 0 011.414 0L17.414 15l-2.293 2.293a1 1 0 01-1.414-1.414L15 14.414l-2.293-2.293a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Core Disciplines */}
      <section id="disciplines" className="bg-black py-24 sm:py-32 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-light text-white tracking-wider">Core Disciplines</h2>
            <p className="mt-4 text-lg text-neutral-500 font-light max-w-2xl mx-auto">Our research is focused on foundational technologies that will power the next generation of decentralized systems.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Autonomous Systems */}
            <div className="border border-neutral-800 bg-neutral-950/50 p-8 rounded-lg transition-all duration-300 hover:border-neutral-700 hover:-translate-y-2">
              <div className="flex items-center justify-center w-12 h-12 mb-6 border border-neutral-800 rounded-lg bg-black">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-xl font-light text-white tracking-widest mb-3">Autonomous Systems</h3>
              <p className="text-neutral-500 font-light leading-relaxed">Developing intelligent, self-governing agents and networks capable of complex coordination and decision-making without human intervention.</p>
            </div>

            {/* Card 2: Decentralized Computation */}
            <div className="border border-neutral-800 bg-neutral-950/50 p-8 rounded-lg transition-all duration-300 hover:border-neutral-700 hover:-translate-y-2">
              <div className="flex items-center justify-center w-12 h-12 mb-6 border border-neutral-800 rounded-lg bg-black">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2 1M4 7l2-1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1m2 1l-2 1m2-1V15M18 18l2-1m-2 1l2 1m-2 1V15" />
                </svg>
              </div>
              <h3 className="text-xl font-light text-white tracking-widest mb-3">Decentralized Computation</h3>
              <p className="text-neutral-500 font-light leading-relaxed">Building trustless, censorship-resistant infrastructure for scalable computing and data storage, ensuring resilience and open access.</p>
            </div>

            {/* Card 3: Verifiable Intelligence */}
            <div className="border border-neutral-800 bg-neutral-950/50 p-8 rounded-lg transition-all duration-300 hover:border-neutral-700 hover:-translate-y-2">
              <div className="flex items-center justify-center w-12 h-12 mb-6 border border-neutral-800 rounded-lg bg-black">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-light text-white tracking-widest mb-3">Verifiable Intelligence</h3>
              <p className="text-neutral-500 font-light leading-relaxed">Pioneering the use of Zero-Knowledge proofs and cryptography to create AI/ML systems whose operations can be proven correct without revealing underlying data.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-neutral-900 text-neutral-500">
        <div className="max-w-6xl mx-auto py-16 px-4 sm:px-8 text-center">
          <h2 className="text-2xl sm:text-4xl font-light text-white tracking-wider mb-4">Join The Frontier</h2>
          <p className="max-w-xl mx-auto mb-8 font-light leading-relaxed">We collaborate with ambitious researchers, engineers, and organizations. If you are building the future, we want to hear from you.</p>
          <a 
            href="mailto:contact@artifact-virtual.com" 
            className="inline-block bg-neutral-900 border border-neutral-700 text-neutral-200 hover:bg-neutral-800 hover:border-neutral-600 transition-all duration-300 px-8 py-3 rounded-md tracking-widest font-light"
          >
            CONTACT US
          </a>
          <div className="mt-16 pt-8 border-t border-neutral-900 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm font-light tracking-widest">&copy; {new Date().getFullYear()} ARTIFACT VIRTUAL. ALL RIGHTS RESERVED.</p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a href="#" className="hover:text-white transition-colors duration-300">Twitter</a>
              <a href="#" className="hover:text-white transition-colors duration-300">Github</a>
              <a href="#" className="hover:text-white transition-colors duration-300">Mirror</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Final surreal footer */}

      <FinalFooter />
    </div>
  );
};

export default Index;
