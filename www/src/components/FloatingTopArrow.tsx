import React from 'react';

interface FloatingTopArrowProps {
  scrollTargetId: string;
}

const FloatingTopArrow: React.FC<FloatingTopArrowProps> = ({ scrollTargetId }) => {
  const handleClick = () => {
    const target = document.getElementById(scrollTargetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    // fallback: scroll up one viewport
    window.scrollBy({ top: -window.innerHeight, behavior: 'smooth' });
  };

  return (
    <button
      className="floating-top-arrow"
      onClick={handleClick}
      aria-label="Go to TradingView"
      title="Go to TradingView"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d="M6 15L12 9L18 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
};

export default FloatingTopArrow;
