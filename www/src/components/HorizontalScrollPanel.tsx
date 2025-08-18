import '../styles/PanelHero.css';
import React, { useEffect, useRef } from 'react';

const HorizontalScrollPanel: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Normalize wheel to horizontal scroll when user scrolls vertically
    const onWheel = (e: WheelEvent) => {
      // If user explicitly scrolls horizontally or uses shift, let it be
      const horizontalIntent = Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey;
      // Use the primary horizontal delta if present, otherwise convert vertical delta
      const delta = horizontalIntent ? e.deltaX : e.deltaY;

      if (delta === 0) return;

      const maxScroll = el.scrollWidth - el.clientWidth;
      const next = el.scrollLeft + delta;

      // If container can scroll in that direction, consume the event and scroll horizontally.
      // Otherwise, don't preventDefault so the page can continue scrolling normally.
      const scrollingRight = delta > 0;
      const atRightEdge = el.scrollLeft >= maxScroll - 1;
      const atLeftEdge = el.scrollLeft <= 1;

      if ((scrollingRight && atRightEdge && !horizontalIntent) || (!scrollingRight && atLeftEdge && !horizontalIntent)) {
        // let the event bubble so the page can scroll
        return;
      }

      // consume and perform horizontal scroll
      e.preventDefault();
      // clamp
      const clamped = Math.max(0, Math.min(maxScroll, next));
      el.scrollLeft = clamped;
    };

    // Arrow key support
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        el.scrollBy({ left: -window.innerWidth * 0.9, behavior: 'smooth' });
      } else if (e.key === 'ArrowRight') {
        el.scrollBy({ left: window.innerWidth * 0.9, behavior: 'smooth' });
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);

    return () => {
      el.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div className="hs-container horizontal-scroll-container" ref={containerRef}>
      {/* Far left black edge - intro for Blockchain/Web3 */}
      <div className="hs-panel horizontal-scroll-panel hs-black hs-black-left flex items-center justify-center">
        <div className="text-center w-full">
          <span className="text-xs uppercase tracking-widest text-white/60">Entering</span>
          <h3 className="text-2xl sm:text-3xl font-thin text-white mt-2">Blockchain & Web3</h3>
        </div>
      </div>


      {/* Left panel - Blockchain/Web3 Hero (Cinematic Pink, Themed) */}
      <div className="hs-panel horizontal-scroll-panel hs-left flex items-center justify-center">
        <div className="max-w-4xl w-full text-center px-6 pink-hero-panel">
          <h2 className="pink-hero-title">BLOCKCHAIN & WEB3</h2>
          <div className="pink-hero-sub">
            <p>Resilient, decentralized systems for a world where the internet may not always exist.</p>
            <p>On-chain identity, privacy, unstoppable code.</p>
          </div>
        </div>
      </div>


      {/* Right panel - AI/ML/Web2 Hero (Cinematic Blue, Themed) */}
      <div className="hs-panel horizontal-scroll-panel hs-right flex items-center justify-center">
        <div className="max-w-4xl w-full text-center px-6 blue-hero-panel">
          <h2 className="blue-hero-title">AI / ML & WEB2</h2>
          <div className="blue-hero-sub">
            <p>Pushing the boundaries of intelligence.</p>
            <p>Autonomous agents, generative models, and web2 systems for the edge and the unknown.</p>
          </div>
        </div>
      </div>

      {/* Far right black edge - intro for AI/ML/Web2 */}
      <div className="hs-panel horizontal-scroll-panel hs-black hs-black-right flex items-center justify-center">
        <div className="text-center w-full">
          <span className="text-xs uppercase tracking-widest text-white/60">Entering</span>
          <h3 className="text-2xl sm:text-3xl font-thin text-white mt-2">AI / ML & WEB2</h3>
        </div>
      </div>
    </div>
  );
};

export default HorizontalScrollPanel;
