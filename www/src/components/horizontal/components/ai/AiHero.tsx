
import React from 'react';

const AiHero: React.FC = () => {
    
  const scrollToNext = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.querySelector('#ai-legion')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
  <div id="ai-home" className="w-full h-full flex items-center justify-center text-center p-6 sm:p-8 bg-arcx-dark relative overflow-hidden pr-0 sm:pr-16 max-w-full overflow-x-hidden">
        {/* Background Crystal Effect */}
        <div className="absolute inset-0 z-0">
            <div className="absolute top-1/2 left-1/2 w-[200px] h-[200px] md:w-[400px] md:h-[400px] bg-arcx-purple/10 rounded-full blur-3xl animate-pulse -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(115,0,255,0.1),rgba(255,255,255,0))]"></div>
        </div>
      
      <div className="relative z-10 flex flex-col items-center w-full">
        <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-8xl font-thin text-gray-200 tracking-[0.2em] uppercase animate-fade-in-down">
          AI Universe
        </h1>
        <p className="text-sm xs:text-base md:text-xl text-gray-400 mt-4 sm:mt-6 max-w-2xl mx-auto font-light animate-fade-in-up tracking-wider">
          An ecosystem of decentralized intelligence and trustless computation.
        </p>
        <a href="#ai-legion" onClick={scrollToNext} 
           className="mt-8 sm:mt-12 border border-arcx-purple/50 text-arcx-purple font-light py-2 sm:py-3 px-6 sm:px-10 rounded-sm text-xs sm:text-sm uppercase tracking-[0.2em] hover:bg-arcx-purple/10 hover:shadow-glow-purple transition-all duration-300 w-full max-w-xs">
          Explore the Ecosystem
        </a>
      </div>
    </div>
  );
};

export default AiHero;