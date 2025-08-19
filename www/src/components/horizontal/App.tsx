
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import Header from './components/Header';
import Entry from './components/Entry';

// ARCX Ecosystem Components
import ArcxHero from './components/Hero';
import ArcxAbout from './components/About';
import ArcxEcosystem from './components/ArcxEcosystem';
import ArcxSecurity from './components/ArcxSecurity';
import ArcxTokenomics from './components/Tokenomics';
import ArcxRoadmap from './components/Roadmap';
import ArcxJoin from './components/Join';


// AI & ML Universe Components
import AiHero from './components/ai/AiHero';
import LegionPage from './components/ai/LegionPage';
import ReasonPage from './components/ai/ReasonPage';
import SentinelPage from './components/ai/SentinelPage';
import AiJoin from './components/ai/AiJoin';


// Placeholder for the first vertical section (Title Page)
const TitleSection: React.FC = () => (
    <div className="w-full h-full flex flex-col items-center justify-center text-center bg-black text-white p-4">
        <h1 className="text-5xl md:text-8xl font-thin text-gray-200 tracking-[0.2em] uppercase animate-fade-in-down">
            ARCX Protocol
        </h1>
        <p className="mt-4 text-gray-500 font-light animate-fade-in-up">Scroll down to enter the dual universes.</p>
        <div className="absolute bottom-10 animate-bounce">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 9l-7 7-7-7" /></svg>
        </div>
    </div>
);

// The original horizontal scrolling application, now encapsulated
const HorizontalScrollerApp: React.FC = () => {
  const [activeSection, setActiveSection] = useState('entry');
  const observer = useRef<IntersectionObserver | null>(null);
  const mainContainerRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    // This effect runs before the browser paints.
    // It ensures the user starts at the central entry point within the horizontal view.
    const entryElement = document.getElementById('entry');
    const container = document.getElementById('main-container');
    if (entryElement && container) {
      // We calculate the starting scroll position to center the entry page.
      const scrollPosition = entryElement.offsetLeft;
      container.scrollLeft = scrollPosition;
    }
  }, []);

  useEffect(() => {
    mainContainerRef.current = document.getElementById('main-container');

    const options = {
      root: mainContainerRef.current,
      rootMargin: '0px',
      threshold: 0.3, // Section is "active" when 30% is visible
    };

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    observer.current = new IntersectionObserver(handleIntersect, options);

    const sections = document.querySelectorAll('.section');
    sections.forEach(section => observer.current?.observe(section));

    return () => {
      sections.forEach(section => observer.current?.unobserve(section));
    };
  }, []);

  return (
    // This wrapper is essential for containing the absolutely positioned header
    <div className="w-full h-full relative">
      <Header activeSection={activeSection} />
      <main id="main-container" className="horizontal-container">
        {/* AI & ML Universe (Left Side) - Journey starts at Hero, next to Entry */}
        <section id="ai-join" className="section"><AiJoin /></section>
        <section id="ai-sentinel" className="section"><SentinelPage /></section>
        <section id="ai-reason" className="section"><ReasonPage /></section>
        <section id="ai-legion" className="section"><LegionPage /></section>
        <section id="ai-home" className="section"><AiHero /></section>
        
        {/* Central Entry Hub */}
        <section id="entry" className="section"><Entry /></section>

        {/* ARCX Ecosystem (Right Side) */}
        <section id="arcx-home" className="section"><ArcxHero /></section>
        <section id="arcx-about" className="section"><ArcxAbout /></section>
        <section id="arcx-ecosystem" className="section"><ArcxEcosystem /></section>
        <section id="arcx-security" className="section"><ArcxSecurity /></section>
        <section id="arcx-tokenomics" className="section"><ArcxTokenomics /></section>
        <section id="arcx-roadmap" className="section"><ArcxRoadmap /></section>
        <section id="arcx-join" className="section"><ArcxJoin /></section>
      </main>
    </div>
  );
};

// Placeholder for a vertical section after the horizontal app
const AnotherVerticalSection: React.FC = () => (
     <div className="w-full h-full flex items-center justify-center text-center bg-arcx-dark text-white p-4">
        <h2 className="text-4xl md:text-7xl font-thin tracking-[0.2em] uppercase">The Journey Continues</h2>
    </div>
);


const App: React.FC = () => {
  return (
    <div>
        <div className="vertical-section">
            <TitleSection />
        </div>
        <div className="vertical-section">
            <HorizontalScrollerApp />
        </div>
        <div className="vertical-section">
            <AnotherVerticalSection />
        </div>
    </div>
  );
};

export default App;
