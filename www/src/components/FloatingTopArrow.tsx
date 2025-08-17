import React from 'react';

const FloatingTopArrow: React.FC = () => {
  const handleClick = () => {
    try {
      const hs = document.querySelector('.hs-container') as HTMLElement | null;
      if (hs && hs.scrollWidth > hs.clientWidth) {
        // Scroll the horizontal scroller one viewport to the left
        hs.scrollBy({ left: -window.innerWidth, behavior: 'smooth' });
        return;
      }
    } catch (e) {
      // fall back to normal page behavior
    }

    // If no horizontal scroller found, scroll page up by one viewport
    window.scrollBy({ top: -window.innerHeight, behavior: 'smooth' });
  };

  return (
    <button
      className="floating-top-arrow"
      onClick={handleClick}
      aria-label="Go up one level"
      title="Up one level"
    >
      {/* Simple upward chevron */}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d="M6 15L12 9L18 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
};

export default FloatingTopArrow;
