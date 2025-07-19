import React, { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';

import FloatingSidebar from '../components/FloatingSidebar';

function getSystemTheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
}

const Index = () => {
  const [theme, setTheme] = useState(getSystemTheme());

  useEffect(() => {
    const listener = (e) => setTheme(e.matches ? 'light' : 'dark');
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', listener);
    return () => window.matchMedia('(prefers-color-scheme: light)').removeEventListener('change', listener);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      {/* Floating Sidebar Navigation */}
      <FloatingSidebar />

      {/* Main content */}
      <div className="relative z-10">
        <div id="hero">
          <HeroSection />
        </div>

        {/* Main page restored: no OS iframe, just hero and sidebar */}
      </div>
    </div>
  );
};

export default Index;
