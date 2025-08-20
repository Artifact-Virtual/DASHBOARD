
import React, { useState, useEffect } from 'react';

interface HeaderProps {
    activeSection: string;
}

const Header: React.FC<HeaderProps> = ({ activeSection }) => {
  const [lastPosition, setLastPosition] = useState<'left' | 'right' | null>(null);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>, sectionId: string) => {
    e.preventDefault();
    const target = document.querySelector(sectionId);
    if(target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  };
  
  const isArcx = activeSection.startsWith('arcx');
  const isAi = activeSection.startsWith('ai');
  // Only show header if in an ARCX or AI section
  const isVisible = isArcx || isAi;
  
  useEffect(() => {
    if (isArcx) {
      setLastPosition('left');
    } else if (isAi) {
      setLastPosition('right');
    }
  }, [isArcx, isAi]);

  const arcxLinks = [
    { name: 'Home', href: '#arcx-home' },
    { name: 'About', href: '#arcx-about' },
    { name: 'Ecosystem', href: '#arcx-ecosystem' },
    { name: 'Security', href: '#arcx-security' },
    { name: 'Tokenomics', href: '#arcx-tokenomics' },
    { name: 'Roadmap', href: '#arcx-roadmap' },
    { name: 'Join', href: '#arcx-join' },
  ];

  const aiLinks = [
    { name: 'Home', href: '#ai-home' },
    { name: 'Legion', href: '#ai-legion' },
    { name: 'Reason', href: '#ai-reason' },
    { name: 'Sentinel', href: '#ai-sentinel' },
    { name: 'Join', href: '#ai-join' },
  ];
  
  const currentSide = isArcx ? 'left' : isAi ? 'right' : lastPosition;

  const navLinks = currentSide === 'left' ? arcxLinks : aiLinks;
  const themeColor = currentSide === 'left' ? 'text-arcx-orange' : 'text-arcx-purple';
  const hoverThemeColor = currentSide === 'left' ? 'hover:text-arcx-orange' : 'hover:text-arcx-purple';
  const buyBgColor = currentSide === 'left' ? 'bg-arcx-orange/80 hover:bg-arcx-orange' : 'bg-arcx-purple/80 hover:bg-arcx-purple';
  const title = currentSide === 'left' ? 'ARCX' : 'AI/ML';
  const buttonText = currentSide === 'left' ? 'Buy' : 'Support';
  const textOrientationClass = currentSide === 'left' ? 'transform rotate-180' : '';
  
  const positionClass = currentSide === 'left' 
    ? 'left-0 border-r border-white/5' 
    : 'right-0 border-l border-white/5';

  // If not visible, do not render the header at all
  if (!isVisible) return null;

  const headerClasses = [
    'fixed', 'top-0', 'h-screen', 'w-16',
    'bg-gradient-to-b',
    currentSide === 'left'
      ? 'from-arcx-orange/90 via-black/90 to-black/80'
      : 'from-arcx-purple/90 via-black/90 to-black/80',
    'backdrop-blur-lg', 'z-50',
    'flex', 'flex-col', 'items-center', 'justify-between', 'py-8',
    'shadow-2xl', 'border-white/10',
    'transition-transform', 'duration-500', 'ease-in-out',
    positionClass,
    // Slide in from left or right
    currentSide === 'left'
      ? 'translate-x-0 -translate-y-0'
      : 'translate-x-0 -translate-y-0',
  ].join(' ');
  
  const buyLink = currentSide === 'left' ? "https://app.uniswap.org/swap?outputCurrency=0x25aB350b5575510B52705657f9552a9263914f44" : "#";

  return (
    <header className={headerClasses}>
      <div 
        className={`${themeColor} font-light text-2xl tracking-[0.3em] writing-mode-vertical-rl cursor-pointer ${textOrientationClass}`} 
        onClick={(e) => scrollToSection(e, '#entry')}>
        {title}
      </div>
      <nav className="flex flex-col items-center space-y-10">
        {navLinks.map((link) => (
          <a 
            key={link.name} 
            href={link.href} 
            onClick={(e) => scrollToSection(e, link.href)} 
            className={`text-gray-600 ${hoverThemeColor} transition-colors duration-300 group`}
            aria-label={`Go to ${link.name} section`}
            >
            <span className={`writing-mode-vertical-rl tracking-[0.2em] uppercase text-xs font-light ${textOrientationClass}`}>{link.name}</span>
          </a>
        ))}
      </nav>
       <a href={buyLink} target="_blank" rel="noopener noreferrer" className={`${buyBgColor} text-white font-semibold py-3 px-2 rounded-sm text-xs transition-all duration-300 writing-mode-vertical-rl tracking-widest uppercase ${textOrientationClass}`}>
            {buttonText}
       </a>
    </header>
  );
};

export default Header;