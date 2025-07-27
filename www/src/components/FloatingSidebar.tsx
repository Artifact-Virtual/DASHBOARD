import React, { useEffect, useState } from 'react';
import { Home, Map, Atom, Shield, Brain, Coins, Github, ExternalLink, BookOpen, FileText, Cpu } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href?: string;
  route?: string;
  action?: () => void;
}

function getSystemTheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
}


const FloatingSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('home');
  const [isExpanded, setIsExpanded] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const [theme, setTheme] = useState(getSystemTheme());
  const [isVisible, setIsVisible] = useState(true); // sidebar starts visible
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);
  const [hideTimer, setHideTimer] = useState<NodeJS.Timeout | null>(null);

  // Auto-hide after 10 seconds
  useEffect(() => {
    if (isMobile) return;
    if (!isVisible) return;
    if (hideTimer) clearTimeout(hideTimer);
    const timer = setTimeout(() => setIsVisible(false), 3000);
    setHideTimer(timer);
    return () => clearTimeout(timer);
  }, [isVisible, isMobile]);

  // Show sidebar when mouse is near left edge
  useEffect(() => {
    if (isMobile) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientX < 40) {
        setIsVisible(true);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);

  // Always update active item on route change
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setActiveItem('home');
    else if (path === '/blog' || path.startsWith('/blog/')) setActiveItem('blog');
    else if (path === '/research' || path.startsWith('/research/')) setActiveItem('research');
    else if (path === '/api') setActiveItem('api');
    else setActiveItem('');
  }, [location.pathname]);

  useEffect(() => {
    const listener = (e) => setTheme(e.matches ? 'light' : 'dark');
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', listener);
    return () => window.matchMedia('(prefers-color-scheme: light)').removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener('resize', checkMobile);
    checkMobile();
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const navItems: NavItem[] = [
    { id: 'home', icon: Home, label: 'Home', route: '/' },
    { id: 'blog', icon: BookOpen, label: 'Blog', route: '/blog' },
    { id: 'research', icon: FileText, label: 'Research', route: '/research' },
    { id: 'api', icon: Cpu, label: 'API', route: '/api' },
    // { id: 'systemmap', icon: Map, label: 'System Map', href: '#systemmap' },
    { id: 'quantum', icon: Atom, label: 'Quantum Engine', href: '#quantum' },
    { id: 'arc', icon: Shield, label: 'The Arc', href: '#arc' },
    { id: 'adam', icon: Brain, label: 'ADAM Protocol', href: '#adam' },
    { id: 'systemmap', icon: Map, label: 'System Map', route: '/systemmap' },
    { id: 'arcx', icon: Coins, label: 'ARCx Token', action: () => window.open('https://artifact-virtual.github.io/arcx_token/', '_blank') },
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
    } else if (item.route) {
      navigate(item.route);
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
    <nav
      className={`fixed left-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center space-y-8
        ${theme === 'light' ? 'bg-white/90 border-black/20' : 'bg-black/90 border-white/10'}
        rounded-3xl py-8 px-3 shadow-2xl border backdrop-blur-lg transition-all duration-500
        min-w-[70px] max-w-[220px]
        ${isVisible ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 -translate-x-10 pointer-events-none'}`
      }
      style={{ boxShadow: theme === 'light' ? '0 8px 32px 0 rgba(0,0,0,0.10)' : '0 8px 32px 0 rgba(255,255,255,0.08)' }}
    >
      <div className="mb-10 text-center">
        <div className="w-14 h-14 mx-auto flex items-center justify-center">
          <img
            src={logoSrc}
            alt="Artifact Virtual Logo"
            className={`w-full h-full object-contain logo-adaptive transition-all duration-500 ${glitch ? 'animate-glitch' : ''}`}
            onAnimationEnd={() => setGlitch(false)}
            onClick={toggleTheme}
            style={{ cursor: 'pointer' }}
          />
        </div>
      </div>
      <div
        className={`${theme === 'light' ? 'bg-white/60 border-black/10' : 'bg-black/30 border-white/10'}
          backdrop-blur-md border rounded-2xl p-2 shadow-xl w-full flex flex-col gap-1`}
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
              className={`relative flex items-center cursor-pointer group transition-all duration-200 mb-1 last:mb-0 rounded-xl px-3 py-2
                ${isActive ? (theme === 'light' ? 'bg-black/10' : 'bg-white/10') : (theme === 'light' ? 'hover:bg-black/5' : 'hover:bg-white/5')}`}
              style={{ minHeight: 40 }}
            >
              <div className={`flex-shrink-0 transition-all duration-200
                ${isActive ? (theme === 'light' ? 'text-black' : 'text-white') : (theme === 'light' ? 'text-black/60 group-hover:text-black/80' : 'text-white/60 group-hover:text-white/80')}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className={`ml-3 text-base font-light tracking-wide transition-all duration-200 whitespace-nowrap overflow-hidden
                ${isExpanded ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'}
                ${isActive ? (theme === 'light' ? 'text-black' : 'text-white') : (theme === 'light' ? 'text-black/70 group-hover:text-black/90' : 'text-white/70 group-hover:text-white/90')}`}
                style={{ transitionProperty: 'opacity,max-width' }}
              >
                {item.label}
              </div>
              {isActive && (
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full
                  ${theme === 'light' ? 'bg-black' : 'bg-white'}`}
                />
              )}
              <div className={`absolute inset-0 rounded-xl transition-all duration-200 pointer-events-none
                ${isActive ? (theme === 'light' ? 'shadow-lg shadow-black/10' : 'shadow-lg shadow-white/10') : (theme === 'light' ? 'group-hover:shadow-md group-hover:shadow-black/10' : 'group-hover:shadow-md group-hover:shadow-white/10')}`}
              />
            </div>
          );
        })}
      </div>
      <div className={`absolute top-1/2 right-0 translate-x-full -translate-y-1/2 w-8 h-px bg-gradient-to-r
        ${theme === 'light' ? 'from-black/20 to-transparent' : 'from-white/20 to-transparent'}`}
      />
    </nav>
  );
};
export default FloatingSidebar;
