import React, { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import ComingSoon from '../components/ComingSoon';
import FloatingSidebar from '../components/FloatingSidebar';
import LoadingScreen from '../components/LoadingScreen';

function getSystemTheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [pageVisible, setPageVisible] = useState(false);
  const [theme, setTheme] = useState(getSystemTheme());

  useEffect(() => {
    const listener = (e) => setTheme(e.matches ? 'light' : 'dark');
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', listener);
    return () => window.matchMedia('(prefers-color-scheme: light)').removeEventListener('change', listener);
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    setTimeout(() => setPageVisible(true), 100);
  };

  useEffect(() => {
    // Preload images
    const imagesToPreload = ['/av-white-logo.png', '/av-black-logo.png'];
    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      {/* Floating Sidebar Navigation */}
      <FloatingSidebar />
      
      {/* Main content */}
      <div className="relative z-10">
        <div id="hero">
          <HeroSection />
        </div>
        
        {/* Coming Soon Section */}
        <div id="coming-soon">
          <ComingSoon />
        </div>
      </div>
    </div>
  );
};

export default Index;
