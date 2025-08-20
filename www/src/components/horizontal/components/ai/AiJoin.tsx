
import React from 'react';

const TwitterIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
);
const DiscordIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.317,4.369a19.789,19.789,0,0,0-4.885-1.515.074.074,0,0,0-.079.037,14.2,14.2,0,0,0-1.127,2.224,19.159,19.159,0,0,0-5.625,0,14.54,14.54,0,0,0-1.127-2.224.077.077,0,0,0-.079-.037A19.787,19.787,0,0,0,3.683,4.369a.076.076,0,0,0-.04.076A16.425,16.425,0,0,0,2.1,14.855a.077.077,0,0,0,.042.083,18.156,18.156,0,0,0,3.985,1.52.073.073,0,0,0,.08-.035,12.3,12.3,0,0,0,.64-2.22,17.65,17.65,0,0,0-2.812-.914.074.074,0,0,0-.08,0,13.255,13.255,0,0,0-.222,4.423.076.076,0,0,0,.066.078,19.2,19.2,0,0,0,6.1,1.77h.042a19.173,19.173,0,0,0,6.1-1.77.076.076,0,0,0,.066-.078,13.21,13.21,0,0,0-.222-4.423.074.074,0,0,0-.08,0,17.691,17.691,0,0,0-2.812.914.075.075,0,0,0,.08.035,12.336,12.336,0,0,0,.64,2.22.076.076,0,0,0,.08.035,18.156,18.156,0,0,0,3.985-1.52.077.077,0,0,0,.042-.083A16.425,16.425,0,0,0,20.357,4.445a.076.076,0,0,0-.04-.076ZM8.02,12.316c-1.049,0-1.9-.96-1.9-2.15s.85-2.15,1.9-2.15,1.9.96,1.9,2.15S9.069,12.316,8.02,12.316Zm7.96,0c-1.049,0-1.9-.96-1.9-2.15s.85-2.15,1.9-2.15,1.9.96,1.9,2.15S17.029,12.316,15.98,12.316Z" /></svg>
);



const AiJoin: React.FC = () => {
  const [hovered, setHovered] = React.useState<'left' | 'right' | null>(null);
  return (
    <div
      id="ai-join"
      className="w-full h-full bg-arcx-black relative overflow-hidden group"
      onMouseLeave={() => setHovered(null)}
    >
      {/* Subtle background glows */}
      <div className="absolute top-0 left-0 h-full w-2/3 bg-[radial-gradient(ellipse_at_left,_rgba(115,0,255,0.18),_transparent_70%)] animate-pulse-slow pointer-events-none z-0"></div>
      <div className="absolute top-0 right-0 h-full w-2/3 bg-[radial-gradient(ellipse_at_right,_rgba(255,69,0,0.10),_transparent_70%)] animate-pulse-slow pointer-events-none z-0"></div>
      {/* Base Layer - Common Elements */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-8 pointer-events-none">
        <h2 className="text-4xl md:text-6xl font-thin text-gray-200 tracking-[0.2em] uppercase">
          Build The Future
        </h2>
        <p className="mt-4 text-gray-400 font-light max-w-xl mx-auto">
          Join a network of innovators, researchers, and developers dedicated to building a transparent and decentralized future for AI.
        </p>
      </div>
      {/* Diagonal Split Layers */}
      {/* AI/ML Side (Left) */}
      <div
        className="absolute inset-0 z-20 entry-fade"
        style={{clipPath: 'polygon(0 0, 100% 0, 0 100%)'}}
        onMouseEnter={() => setHovered('left')}
      >
        <div className={`w-full h-full relative flex items-start justify-start p-16 transition-all duration-700 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-arcx-purple/20 to-transparent diagonal-half${hovered === 'left' ? ' diagonal-lift diagonal-bright' : ''}`}>
          <div className="absolute inset-y-0 left-0 w-1/3 bg-[radial-gradient(ellipse_50%_100%_at_left,_rgba(115,0,255,0.22),_transparent_60%)]"></div>
          <div className="text-arcx-purple font-thin tracking-[0.2em] uppercase text-sm flex items-center animate-pulse">
            {/* Left diagonal callout */}
            <span className="mr-4">Explore AI/ML</span>
          </div>
        </div>
      </div>
      {/* ARCX Side (Right) */}
      <div
        className="absolute inset-0 z-20 entry-fade"
        style={{clipPath: 'polygon(100% 0, 100% 100%, 0 100%)'}}
        onMouseEnter={() => setHovered('right')}
      >
        <div className={`w-full h-full relative flex items-end justify-end p-16 transition-all duration-700 opacity-0 group-hover:opacity-100 bg-gradient-to-tl from-arcx-orange/10 to-transparent diagonal-half${hovered === 'right' ? ' diagonal-lift diagonal-bright' : ''}`}>
          <div className="absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(ellipse_50%_100%_at_right,_rgba(255,69,0,0.12),_transparent_60%)]"></div>
          <div className="text-arcx-orange font-thin tracking-[0.2em] uppercase text-sm flex items-center animate-pulse">
            {/* Right diagonal callout */}
            <span className="ml-4">Scroll for ARCX</span>
          </div>
        </div>
      </div>
      {/* Buttons and Footer */}
      <div className="absolute inset-0 z-30 flex flex-col items-center justify-end pb-24 pointer-events-auto">
        <div className="flex flex-col items-center space-y-4">
          <a href="#" className="border border-arcx-purple text-arcx-purple font-light py-4 px-12 rounded-sm text-md uppercase tracking-[0.2em] hover:bg-arcx-purple hover:text-white hover:shadow-glow-purple transition-all duration-300">
            Join the Network
          </a>
          <button
            onClick={() => {
              const container = document.getElementById('main-container');
              const entry = document.getElementById('entry');
              if (container && entry) {
                container.scrollTo({ left: entry.offsetLeft, behavior: 'smooth' });
              }
            }}
            className="mt-2 border border-white/20 text-white/80 font-light py-2 px-6 rounded-sm text-xs uppercase tracking-widest hover:bg-white/10 hover:text-arcx-purple transition-all duration-300"
          >
            Back to Centre
          </button>
        </div>
        <footer className="mt-10 text-center text-xs text-gray-700 font-light tracking-widest w-full">
          <div className="flex justify-center space-x-6 mb-4">
            <a href="#" className="text-gray-600 hover:text-arcx-purple transition-colors duration-300" aria-label="AI/ML Twitter">
              <span className="sr-only">Twitter</span>
              <TwitterIcon className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-600 hover:text-arcx-purple transition-colors duration-300" aria-label="AI/ML Discord">
              <span className="sr-only">Discord</span>
              <DiscordIcon className="h-5 w-5" />
            </a>
          </div>
          <p>&copy; {new Date().getFullYear()} ARCX PROTOCOL. ALL RIGHTS RESERVED.</p>
        </footer>
      </div>
    </div>
  );
};

export default AiJoin;