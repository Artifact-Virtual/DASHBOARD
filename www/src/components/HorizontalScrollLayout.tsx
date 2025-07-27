import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface HorizontalScrollLayoutProps {
  children: React.ReactNode;
}

const HorizontalScrollLayout: React.FC<HorizontalScrollLayoutProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  const pages = [
    { path: '/', name: 'Home' },
    { path: '/blog', name: 'Blog' },
    { path: '/research', name: 'Research' },
    // removed API nav entry
  ];

  useEffect(() => {
    const currentIndex = pages.findIndex(page => page.path === location.pathname);
    if (currentIndex !== -1) {
      setCurrentPage(currentIndex);
    }
  }, [location.pathname]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let accumulatedDeltaX = 0;
    const threshold = 50; // Minimum horizontal scroll to trigger page change
    let scrollTimeout: NodeJS.Timeout;

    const handleWheel = (e: WheelEvent) => {
      // Check if this is a horizontal scroll gesture or shift+scroll
      const isHorizontalIntent = Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey;
      
      if (isHorizontalIntent) {
        e.preventDefault();
        
        if (isScrolling) return;
        
        // Use deltaX if available, otherwise use deltaY with shift
        const delta = e.deltaX !== 0 ? e.deltaX : (e.shiftKey ? e.deltaY : 0);
        accumulatedDeltaX += delta;

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          if (Math.abs(accumulatedDeltaX) > threshold) {
            const direction = accumulatedDeltaX > 0 ? 1 : -1;
            const newPageIndex = Math.max(0, Math.min(pages.length - 1, currentPage + direction));
            
            if (newPageIndex !== currentPage) {
              setIsScrolling(true);
              navigate(pages[newPageIndex].path);
              
              setTimeout(() => {
                setIsScrolling(false);
              }, 800); // Match transition duration
            }
          }
          accumulatedDeltaX = 0;
        }, 50);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        if (isScrolling) return;

        const direction = e.key === 'ArrowRight' ? 1 : -1;
        const newPageIndex = Math.max(0, Math.min(pages.length - 1, currentPage + direction));
        
        if (newPageIndex !== currentPage) {
          setIsScrolling(true);
          navigate(pages[newPageIndex].path);
          
          setTimeout(() => {
            setIsScrolling(false);
          }, 800);
        }
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(scrollTimeout);
    };
  }, [currentPage, isScrolling, navigate]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      style={{ 
        transform: `translateX(-${currentPage * 100}vw)`,
        transition: isScrolling ? 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none',
        width: `${pages.length * 100}vw`,
        display: 'flex'
      }}
    >
      {children}
    </div>
  );
};

export default HorizontalScrollLayout;
