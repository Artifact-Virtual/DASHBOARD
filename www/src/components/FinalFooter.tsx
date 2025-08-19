import React from "react";

const FinalFooter = () => (
  <footer className="finalfooter w-full bg-neutral-950 text-neutral-200 font-light text-center py-10 px-4 mt-0 border-t border-neutral-800/60 relative overflow-hidden">
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
      <span className="text-base md:text-lg tracking-wide opacity-90">© {new Date().getFullYear()} Artifact Virtual</span>
      <span className="text-sm md:text-base opacity-70">A Framework for Holistic R/D — Radical research, rapid prototyping, and future shock.</span>
    </div>
    {/* Surreal animated accent at the bottom */}
    <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[80vw] h-16 pointer-events-none z-0">
      <svg width="100%" height="100%" viewBox="0 0 600 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="footerGlow" cx="50%" cy="0%" r="100%" fx="50%" fy="0%">
            <stop offset="0%" stopColor="#00ff88" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="300" cy="32" rx="300" ry="24" fill="url(#footerGlow)" />
      </svg>
    </div>
  </footer>
);

export default FinalFooter;
