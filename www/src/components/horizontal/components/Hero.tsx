import React from 'react';

const Hero: React.FC = () => {
    
  const scrollToAbout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.querySelector('#arcx-about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full h-full flex items-center justify-center text-center p-8 bg-arcx-dark relative overflow-hidden pl-16">
        {/* Background Crystal Effect */}
        <div className="absolute inset-0 z-0">
            <div className="absolute top-1/2 left-1/2 w-[200px] h-[200px] md:w-[400px] md:h-[400px] bg-arcx-orange/10 rounded-full blur-3xl animate-pulse -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,69,0,0.1),rgba(255,255,255,0))]"></div>
        </div>
      
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-5xl md:text-8xl font-thin text-gray-200 tracking-[0.2em] uppercase animate-fade-in-down">
          ARCX
        </h1>
        <p className="text-md md:text-xl text-gray-400 mt-6 max-w-2xl mx-auto font-light animate-fade-in-up tracking-wider">
          A new paradigm for the decentralized ecosystem.
        </p>
        <a href="#arcx-about" onClick={scrollToAbout} 
           className="mt-12 border border-arcx-orange/50 text-arcx-orange font-light py-3 px-10 rounded-sm text-sm uppercase tracking-[0.2em] hover:bg-arcx-orange/10 hover:shadow-[0_0_15px_rgba(255,69,0,0.5)] transition-all duration-300">
          Enter the Ecosystem
        </a>
      </div>
    </div>
  );
};

export default Hero;