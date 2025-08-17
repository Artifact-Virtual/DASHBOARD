import React, { useEffect, useState } from 'react';
import {
  Home,
  Coins,
  Github,
  BookOpen,
  FileText,
  Cpu,
  FlaskConical,
  MessageCircle,
} from 'lucide-react';
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
  if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: light)').matches
  ) {
    return 'light';
  }
  return 'dark';
}


const FloatingSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('home');
  const [isExpanded, setIsExpanded] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const [theme, setTheme] = useState(getSystemTheme());
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (isMobile) return;
    
    let timer: NodeJS.Timeout | null = null;
    
    if (isVisible && !isHovering) {
      timer = setTimeout(() => setIsVisible(false), 3000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isVisible, isMobile, isHovering, location.pathname]);

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

  useEffect(() => {
    const path = location.pathname;
    setIsVisible(true);
    if (path === '/') setActiveItem('home');
    else if (path === '/blog' || path.startsWith('/blog/')) setActiveItem('blog');
    else if (path === '/research' || path.startsWith('/research/')) setActiveItem('research');
    else if (path === '/dashboard') setActiveItem('dashboard');
    else setActiveItem('');
  }, [location.pathname]);

  useEffect(() => {
    const listener = (e: MediaQueryListEvent) =>
      setTheme(e.matches ? 'light' : 'dark');
    const mql = window.matchMedia('(prefers-color-scheme: light)');
    mql.addEventListener('change', listener);
    return () => mql.removeEventListener('change', listener);
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
    { id: 'swap', icon: Coins, label: 'Swap', route: '/swap' },
    { id: 'blog', icon: BookOpen, label: 'Blog', route: '/blog' },
    { id: 'research', icon: FileText, label: 'Research', route: '/research' },
    { id: 'dashboard', icon: Cpu, label: 'Dashboard', route: '/dashboard' },
    { id: 'alpha', icon: FlaskConical, label: 'Alpha', href: '#alpha' },
    {
      id: 'github',
      icon: Github,
      label: 'GitHub',
      action: () => window.open('https://github.com/amuzetnoM/artifactvirtual', '_blank'),
    },
    {
      id: 'discord',
      icon: MessageCircle,
      label: 'Discord',
      action: () => window.open('https://discord.gg/wwEd9Hjv', '_blank'),
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

  // Desktop sidebar
  const desktopSidebar = (
    <nav
      className={`sidebar-float hidden md:flex flex-col items-center space-y-8
        ${theme === 'light' ? 'bg-white/90 border-black/20' : 'bg-black/90 border-white/10'}
        rounded-3xl py-8 px-3 shadow-2xl border backdrop-blur-lg transition-all duration-500
        min-w-[70px] max-w-[220px] z-[1000]
        ${isVisible ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 -translate-x-10 pointer-events-none'}`}
      style={{
        boxShadow:
          theme === 'light'
            ? '0 8px 32px 0 rgba(0,0,0,0.10)'
            : '0 8px 32px 0 rgba(255,255,255,0.08)',
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
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
                ${isActive
                  ? theme === 'light'
                    ? 'bg-black/10'
                    : 'bg-white/10'
                  : theme === 'light'
                  ? 'hover:bg-black/5'
                  : 'hover:bg-white/5'
                }`}
              style={{ minHeight: 40 }}
            >
              <div
                className={`flex-shrink-0 transition-all duration-200
                  ${isActive
                    ? theme === 'light'
                      ? 'text-black'
                      : 'text-white'
                    : theme === 'light'
                    ? 'text-black/60 group-hover:text-black/80'
                    : 'text-white/60 group-hover:text-white/80'
                  }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div
                className={`ml-3 text-base font-light tracking-wide transition-all duration-200 whitespace-nowrap overflow-hidden
                  ${isExpanded ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'}
                  ${isActive
                    ? theme === 'light'
                      ? 'text-black'
                      : 'text-white'
                    : theme === 'light'
                    ? 'text-black/70 group-hover:text-black/90'
                    : 'text-white/70 group-hover:text-white/90'
                  }`}
                style={{ transitionProperty: 'opacity,max-width' }}
              >
                {item.label}
              </div>
              {isActive && (
                <div
                  className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full
                    ${theme === 'light' ? 'bg-black' : 'bg-white'}`}
                />
              )}
              <div
                className={`absolute inset-0 rounded-xl transition-all duration-200 pointer-events-none
                  ${isActive
                    ? theme === 'light'
                      ? 'shadow-lg shadow-black/10'
                      : 'shadow-lg shadow-white/10'
                    : theme === 'light'
                    ? 'group-hover:shadow-md group-hover:shadow-black/10'
                    : 'group-hover:shadow-md group-hover:shadow-white/10'
                  }`}
              />
            </div>
          );
        })}
      </div>
      <div
        className={`absolute top-1/2 right-0 translate-x-full -translate-y-1/2 w-8 h-px bg-gradient-to-r
          ${theme === 'light' ? 'from-black/20 to-transparent' : 'from-white/20 to-transparent'}`}
      />
    </nav>
  );

  // Mobile drawer sidebar
  const mobileSidebar = (
    <>
      {/* Hamburger icon */}
      <button
        className="fixed top-4 right-4 z-50 md:hidden flex items-center justify-center w-12 h-12 rounded-full bg-black/80 border border-white/10 shadow-lg"
        onClick={() => setDrawerOpen(true)}
        aria-label="Open navigation menu"
      >
        <span className="block w-6 h-0.5 bg-white mb-1 rounded" />
        <span className="block w-6 h-0.5 bg-white mb-1 rounded" />
        <span className="block w-6 h-0.5 bg-white rounded" />
      </button>
      {/* Drawer overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
      )}
      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 h-full w-64 z-50 bg-black border-l border-white/10 shadow-2xl transform transition-transform duration-300 md:hidden
          ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ willChange: 'transform' }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <img src={logoSrc} alt="Artifact Virtual Logo" className="w-10 h-10 object-contain" />
          <button
            className="text-white text-2xl font-bold px-2 py-1 rounded hover:bg-white/10"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close navigation menu"
          >
            ×
          </button>
        </div>
        <div className="flex flex-col gap-1 px-4 py-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  handleItemClick(item);
                  setDrawerOpen(false);
                }}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200 mb-1 last:mb-0
                  ${isActive ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-white/80'}`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-base font-light tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );

  return (
    <>
      {desktopSidebar}
      {mobileSidebar}
    </>
  );
};

export default FloatingSidebar;
