
import React from 'react';

const TwitterIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
);
const DiscordIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.317,4.369a19.789,19.789,0,0,0-4.885-1.515.074.074,0,0,0-.079.037,14.2,14.2,0,0,0-1.127,2.224,19.159,19.159,0,0,0-5.625,0,14.54,14.54,0,0,0-1.127-2.224.077.077,0,0,0-.079-.037A19.787,19.787,0,0,0,3.683,4.369a.076.076,0,0,0-.04.076A16.425,16.425,0,0,0,2.1,14.855a.077.077,0,0,0,.042.083,18.156,18.156,0,0,0,3.985,1.52.073.073,0,0,0,.08-.035,12.3,12.3,0,0,0,.64-2.22,17.65,17.65,0,0,0-2.812-.914.074.074,0,0,0-.08,0,13.255,13.255,0,0,0-.222,4.423.076.076,0,0,0,.066.078,19.2,19.2,0,0,0,6.1,1.77h.042a19.173,19.173,0,0,0,6.1-1.77.076.076,0,0,0,.066-.078,13.21,13.21,0,0,0-.222-4.423.074.074,0,0,0-.08,0,17.691,17.691,0,0,0-2.812.914.075.075,0,0,0,.08.035,12.336,12.336,0,0,0,.64,2.22.076.076,0,0,0,.08.035,18.156,18.156,0,0,0,3.985-1.52.077.077,0,0,0,.042-.083A16.425,16.425,0,0,0,20.357,4.445a.076.076,0,0,0-.04-.076ZM8.02,12.316c-1.049,0-1.9-.96-1.9-2.15s.85-2.15,1.9-2.15,1.9.96,1.9,2.15S9.069,12.316,8.02,12.316Zm7.96,0c-1.049,0-1.9-.96-1.9-2.15s.85-2.15,1.9-2.15,1.9.96,1.9,2.15S17.029,12.316,15.98,12.316Z" /></svg>
);



const AiJoin: React.FC = () => {
  return (
    <div
      id="ai-join"
      className="w-full h-full bg-arcx-black relative flex flex-col items-center justify-center text-center p-8"
    >
      <h2 className="text-4xl md:text-6xl font-thin text-gray-200 tracking-[0.2em] uppercase">
        Build The Future
      </h2>
      <p className="mt-4 text-gray-400 font-light max-w-xl mx-auto">
        Join a network of innovators, researchers, and developers dedicated to building a transparent and decentralized future for AI.
      </p>
      <div className="mt-8 flex flex-col items-center gap-4">
        <a href="#entry" className="border border-arcx-purple text-arcx-purple px-8 py-3 rounded-md text-lg font-medium tracking-widest hover:bg-arcx-purple hover:text-white transition-colors duration-200">
          Join the Network
        </a>
        <a href="#entry" className="border border-gray-500 text-gray-300 px-6 py-2 rounded-md text-base font-light tracking-widest hover:bg-gray-700 hover:text-white transition-colors duration-200">
          Back to Centre
        </a>
      </div>
      <div className="mt-8 flex gap-6 justify-center">
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" title="Twitter"><TwitterIcon className="w-6 h-6 text-gray-400 hover:text-arcx-purple transition-colors duration-200" /></a>
        <a href="https://discord.com" target="_blank" rel="noopener noreferrer" title="Discord"><DiscordIcon className="w-6 h-6 text-gray-400 hover:text-arcx-purple transition-colors duration-200" /></a>
      </div>
      <footer className="mt-12 text-xs text-gray-500">© 2025 ARCX PROTOCOL. ALL RIGHTS RESERVED.</footer>
    </div>
  );
};

export default AiJoin;