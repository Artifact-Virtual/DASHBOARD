import React from 'react';

const ChevronRightIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
);

const ChevronLeftIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
);

const Entry: React.FC = () => {
  return (
    <div className="w-full h-full bg-arcx-black relative overflow-hidden">
        {/* Subtle background glows */}
        <div className="absolute top-0 left-0 h-full w-2/3 bg-[radial-gradient(ellipse_at_left,_rgba(115,0,255,0.2),_transparent_70%)] animate-pulse-slow pointer-events-none z-0"></div>
        <div className="absolute top-0 right-0 h-full w-2/3 bg-[radial-gradient(ellipse_at_right,_rgba(255,69,0,0.15),_transparent_70%)] animate-pulse-slow pointer-events-none z-0"></div>
        
        {/* Base Layer - Common Elements */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-8 pointer-events-none">
            <h1 className="text-xl md:text-2xl font-thin text-gray-500 tracking-[0.4em] uppercase">
                Welcome to
            </h1>
             <p className="text-5xl md:text-8xl font-thin text-gray-200 mt-4 tracking-[0.2em] uppercase">
                ARC : 0
            </p>
        </div>

        {/* Diagonal Split Layers */}
        {/* AI/ML Side (Left) */}
        <div 
            className="absolute inset-0 z-20 group" 
            style={{clipPath: 'polygon(0 0, 100% 0, 0 100%)'}}
        >
            <div className="w-full h-full relative flex items-start justify-start p-16 transition-all duration-700 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-arcx-purple/10 to-transparent">
                <div className="absolute inset-y-0 left-0 w-1/3 bg-[radial-gradient(ellipse_50%_100%_at_left,_rgba(115,0,255,0.2),_transparent_60%)]"></div>
                 <div className="text-gray-600 font-thin tracking-[0.2em] uppercase text-sm flex items-center animate-pulse">
                    <ChevronLeftIcon className="w-6 h-6 -mr-3" />
                    <ChevronLeftIcon className="w-6 h-6 mr-4" />
                    Scroll for AI/ML
                </div>
            </div>
        </div>

        {/* ARCX Side (Right) */}
        <div 
            className="absolute inset-0 z-20 group"
            style={{clipPath: 'polygon(100% 0, 100% 100%, 0 100%)'}}
        >
             <div className="w-full h-full relative flex items-end justify-end p-16 transition-all duration-700 opacity-0 group-hover:opacity-100 bg-gradient-to-tl from-arcx-orange/10 to-transparent">
                <div className="absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(ellipse_50%_100%_at_right,_rgba(255,69,0,0.15),_transparent_60%)]"></div>
                <div className="text-gray-600 font-thin tracking-[0.2em] uppercase text-sm flex items-center animate-pulse">
                    Scroll for ARCX
                    <ChevronRightIcon className="w-6 h-6 ml-4" />
                    <ChevronRightIcon className="w-6 h-6 -ml-3" />
                </div>
             </div>
        </div>
    </div>
  );
};

export default Entry;