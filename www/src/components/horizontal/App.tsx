
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


interface AppProps {
  onActiveSectionChange?: (section: string) => void;
}

const App: React.FC<AppProps> = ({ onActiveSectionChange }) => {
  const [activeSection, setActiveSection] = useState('entry');
  const observer = useRef<IntersectionObserver | null>(null);
  const mainContainerRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    // This effect runs before the browser paints.
    // It ensures the user starts at the central entry point.
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
          if (onActiveSectionChange) onActiveSectionChange(entry.target.id);
        }
      });
    };

    observer.current = new IntersectionObserver(handleIntersect, options);

    const sections = document.querySelectorAll('.section');
    sections.forEach(section => observer.current?.observe(section));

    return () => {
      sections.forEach(section => observer.current?.unobserve(section));
    };
  }, [onActiveSectionChange]);

  return (
    <>
  {/* Header will be rendered by parent (Index.tsx) when horizontal section is in view */}
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
    </>
  );
};

export default App;