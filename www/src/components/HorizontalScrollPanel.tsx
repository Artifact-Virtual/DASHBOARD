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
      {/* Far left black edge - Blockchain/Web3 entry */}
      <div className="hs-panel horizontal-scroll-panel hs-black hs-black-left flex items-center justify-center">
        <div className="text-center w-full black-panel-entry">
          <h3 className="text-2xl sm:text-3xl font-thin text-white mb-6">Blockchain & Web3</h3>
          <button
            className="theme-enter-btn pink"
            onClick={() => {
              const panel = document.querySelector('.black-panel-entry');
              if (panel) {
                panel.classList.add('zoom-out');
                setTimeout(() => {
                  window.location.href = '/swap';
                }, 600);
              } else {
                window.location.href = '/swap';
              }
            }}
            aria-label="Enter Blockchain & Web3"
          >
            Enter
          </button>
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

      {/* Far right black edge - AI/ML/Web2 entry */}
      <div className="hs-panel horizontal-scroll-panel hs-black hs-black-right flex items-center justify-center">
        <div className="text-center w-full black-panel-entry-ai">
          <h3 className="text-2xl sm:text-3xl font-thin text-white mb-6">AI / ML & WEB2</h3>
          <button
            className="theme-enter-btn blue"
            onClick={() => {
              const panel = document.querySelector('.black-panel-entry-ai');
              if (panel) {
                panel.classList.add('zoom-out');
                setTimeout(() => {
                  window.location.href = 'https://github.com/Artifact-Virtual';
                }, 600);
              } else {
                window.location.href = 'https://github.com/Artifact-Virtual';
              }
            }}
            aria-label="Enter AI / ML & Web2"
          >
            Enter
          </button>
        </div>
      </div>
    </div>
  );
};

export default HorizontalScrollPanel;
