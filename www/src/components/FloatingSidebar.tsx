import React, { useEffect, useState } from 'react';
import { Home, Map, Atom, Shield, Brain, MessageSquare, Github, ExternalLink } from 'lucide-react';

interface NavItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href?: string;
  action?: () => void;
}

function getSystemTheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
}

const FloatingSidebar = () => {
  const [activeItem, setActiveItem] = useState('home');
  const [isExpanded, setIsExpanded] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const [theme, setTheme] = useState(getSystemTheme());
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const listener = (e) => setTheme(e.matches ? 'light' : 'dark');
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', listener);
    return () => window.matchMedia('(prefers-color-scheme: light)').removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      const scrollY = window.scrollY;
      setIsVisible(scrollY > heroHeight * 0.8);
    };
    const checkMobile = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', checkMobile);
    handleScroll();
    checkMobile();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const navItems: NavItem[] = [
    { id: 'home', icon: Home, label: 'Home', href: '#hero' },
    { id: 'systemmap', icon: Map, label: 'System Map', href: '#systemmap' },
    { id: 'quantum', icon: Atom, label: 'Quantum Engine', href: '#quantum' },
    { id: 'arc', icon: Shield, label: 'The Arc', href: '#arc' },
    { id: 'adam', icon: Brain, label: 'ADAM Protocol', href: '#adam' },
    { id: 'contact', icon: MessageSquare, label: 'Contact', href: '#contact' },
    { 
      id: 'github', 
      icon: Github, 
      label: 'GitHub', 
      action: () => window.open('https://github.com/amuzetnoM/artifactvirtual', '_blank')
    },
    { 
      id: 'dashboard', 
      icon: ExternalLink, 
      label: 'Dashboard', 
      action: () => window.open('http://localhost:3002', '_blank')
    },
  ];

  const handleItemClick = (item: NavItem) => {
    setActiveItem(item.id);
    if (item.action) {
      item.action();
    } else if (item.href) {
      const element = document.querySelector(item.href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const toggleTheme = () => {
    setGlitch(true);
    setTimeout(() => setGlitch(false), 500);
  };

  const logoSrc = '/av-black-logo.png';

  if (isMobile) {
    return (
      <>
        <button
          className="floating-sidebar-toggle"
          aria-label="Open sidebar"
          onClick={() => setOpen((v) => !v)}
          style={{ position: 'fixed', top: 16, left: 16, zIndex: 1000 }}
        >
          <span style={{ fontSize: 24 }}>☰</span>
        </button>
        {open && (
          <nav className={`fixed left-0 top-0 z-50 flex flex-col items-center space-y-8 ${theme === 'light' ? 'bg-white/90 border-black/20' : 'bg-black/90 border-white/10'} rounded-none py-6 px-2 shadow-2xl border backdrop-blur-sm transition-all duration-500 w-56 h-full`}>
            <div className="mb-8 text-center">
              <div className="w-12 h-12 mx-auto flex items-center justify-center">
                <img 
                  src={logoSrc} 
                  alt="Artifact Virtual Logo" 
                  className={`w-full h-full object-contain logo-adaptive transition-all duration-500 ${glitch ? 'animate-glitch' : ''}`}
                  onAnimationEnd={() => setGlitch(false)}
                  onClick={toggleTheme}
                />
              </div>
            </div>
            <div className={`${theme === 'light' ? 'bg-white/40 border-black/10' : 'bg-black/20 border-white/10'} backdrop-blur-md border rounded-2xl p-2 shadow-2xl w-full`}>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeItem === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => { handleItemClick(item); setOpen(false); }}
                    className={`relative flex items-center cursor-pointer group transition-all duration-300 mb-1 last:mb-0 rounded-xl p-3 ${isActive ? (theme === 'light' ? 'bg-black/10' : 'bg-white/10') : (theme === 'light' ? 'hover:bg-black/5' : 'hover:bg-white/5')}`}
                  >
                    <div className={`flex-shrink-0 transition-all duration-300 ${isActive ? (theme === 'light' ? 'text-black' : 'text-white') : (theme === 'light' ? 'text-black/60 group-hover:text-black/80' : 'text-white/60 group-hover:text-white/80')}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className={`ml-3 text-sm font-light tracking-wide transition-all duration-300 whitespace-nowrap overflow-hidden opacity-100 max-w-xs ${isActive ? (theme === 'light' ? 'text-black' : 'text-white') : (theme === 'light' ? 'text-black/70 group-hover:text-black/90' : 'text-white/70 group-hover:text-white/90')}`}>
                      {item.label}
                    </div>
                    {isActive && (<div className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 rounded-r-full ${theme === 'light' ? 'bg-black' : 'bg-white'}`} />)}
                    <div className={`absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none ${isActive ? (theme === 'light' ? 'shadow-lg shadow-black/5' : 'shadow-lg shadow-white/5') : (theme === 'light' ? 'group-hover:shadow-md group-hover:shadow-black/5' : 'group-hover:shadow-md group-hover:shadow-white/5')}`} />
                  </div>
                );
              })}
            </div>
          </nav>
        )}
      </>
    );
  }

  return (
    <nav className={`fixed left-6 top-1/2 transform -translate-y-1/2 z-50 flex flex-col items-center space-y-8 ${theme === 'light' ? 'bg-white/80 border-black/20' : 'bg-black/80 border-white/10'} rounded-2xl py-6 px-2 shadow-2xl border backdrop-blur-sm transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'}`}>
      <div className="mb-8 text-center">
        <div className="w-12 h-12 mx-auto flex items-center justify-center">
          <img 
            src={logoSrc} 
            alt="Artifact Virtual Logo" 
            className={`w-full h-full object-contain logo-adaptive transition-all duration-500 ${glitch ? 'animate-glitch' : ''}`}
            onAnimationEnd={() => setGlitch(false)}
            onClick={toggleTheme}
          />
        </div>
      </div>
      <div 
        className={`${theme === 'light' ? 'bg-white/40 border-black/10' : 'bg-black/20 border-white/10'} backdrop-blur-md border rounded-2xl p-2 shadow-2xl`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          return (
            <div
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`relative flex items-center cursor-pointer group transition-all duration-300 mb-1 last:mb-0 rounded-xl p-3 ${isActive ? (theme === 'light' ? 'bg-black/10' : 'bg-white/10') : (theme === 'light' ? 'hover:bg-black/5' : 'hover:bg-white/5')}`}
            >
              <div className={`flex-shrink-0 transition-all duration-300 ${isActive ? (theme === 'light' ? 'text-black' : 'text-white') : (theme === 'light' ? 'text-black/60 group-hover:text-black/80' : 'text-white/60 group-hover:text-white/80')}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className={`ml-3 text-sm font-light tracking-wide transition-all duration-300 whitespace-nowrap overflow-hidden ${isExpanded ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'} ${isActive ? (theme === 'light' ? 'text-black' : 'text-white') : (theme === 'light' ? 'text-black/70 group-hover:text-black/90' : 'text-white/70 group-hover:text-white/90')}`}>
                {item.label}
              </div>
              {isActive && (<div className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 rounded-r-full ${theme === 'light' ? 'bg-black' : 'bg-white'}`} />)}
              <div className={`absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none ${isActive ? (theme === 'light' ? 'shadow-lg shadow-black/5' : 'shadow-lg shadow-white/5') : (theme === 'light' ? 'group-hover:shadow-md group-hover:shadow-black/5' : 'group-hover:shadow-md group-hover:shadow-white/5')}`} />
            </div>
          );
        })}
      </div>
      <div className={`absolute top-1/2 right-0 transform translate-x-full -translate-y-1/2 w-8 h-px bg-gradient-to-r ${theme === 'light' ? 'from-black/20 to-transparent' : 'from-white/20 to-transparent'}`} />
    </nav>
  );
};
export default FloatingSidebar;
