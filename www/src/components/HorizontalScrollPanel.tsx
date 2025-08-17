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
      {/* Far left black edge */}
      <div className="hs-panel horizontal-scroll-panel hs-black hs-black-left" aria-hidden="true">
        {/* decorative black edge */}
      </div>

      {/* Left panel - cinematic pink */}
      <div className="hs-panel horizontal-scroll-panel hs-left">
        <div className="max-w-3xl text-center px-6">
          <h3 className="text-3xl sm:text-4xl font-thin text-white mb-3">Left — Cinematic Pink</h3>
          <p className="text-sm text-white/90">A cinematic pink panel for features, media, or creative highlights.</p>
        </div>
      </div>

      {/* Right panel - cinematic blue */}
      <div className="hs-panel horizontal-scroll-panel hs-right">
        <div className="max-w-3xl text-center px-6">
          <h3 className="text-3xl sm:text-4xl font-thin text-white mb-3">Right — Cinematic Blue</h3>
          <p className="text-sm text-white/90">A cinematic blue panel for analytics, live charts, or technical showcases.</p>
        </div>
      </div>

      {/* Far right black edge */}
      <div className="hs-panel horizontal-scroll-panel hs-black hs-black-right" aria-hidden="true">
        {/* decorative black edge */}
      </div>
    </div>
  );
};

export default HorizontalScrollPanel;
