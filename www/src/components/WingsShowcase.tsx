import React from 'react';
import WingSection from './WingSection';

const BlockchainVisual = (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="54" stroke="#0ff" strokeWidth="4" fill="#111" />
    <rect x="35" y="35" width="50" height="50" rx="10" fill="#0ff" fillOpacity="0.1" stroke="#0ff" strokeWidth="2" />
    <path d="M60 35V85" stroke="#0ff" strokeWidth="2" />
    <path d="M35 60H85" stroke="#0ff" strokeWidth="2" />
    <circle cx="60" cy="60" r="6" fill="#0ff" />
  </svg>
);

const AIVisual = (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="54" stroke="#f0f" strokeWidth="4" fill="#111" />
    <ellipse cx="60" cy="60" rx="30" ry="18" fill="#f0f" fillOpacity="0.08" />
    <ellipse cx="60" cy="60" rx="18" ry="30" fill="#f0f" fillOpacity="0.08" />
    <circle cx="60" cy="60" r="8" fill="#f0f" />
    <path d="M60 52V68" stroke="#f0f" strokeWidth="2" />
    <path d="M52 60H68" stroke="#f0f" strokeWidth="2" />
  </svg>
);

const RDVisual = (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="54" stroke="#ff0" strokeWidth="4" fill="#111" />
    <rect x="45" y="45" width="30" height="30" rx="6" fill="#ff0" fillOpacity="0.08" />
    <path d="M60 45V75" stroke="#ff0" strokeWidth="2" />
    <path d="M45 60H75" stroke="#ff0" strokeWidth="2" />
    <circle cx="60" cy="60" r="5" fill="#ff0" />
  </svg>
);

const WingsShowcase: React.FC = () => (
  <div className="w-full bg-black">
    <WingSection
      id="blockchain"
      title="Blockchain & Web3 Wing"
      description="Building resilient, decentralized systems for a world where the internet may not always exist. On-chain identity, privacy, and unstoppable code."
      visual={BlockchainVisual}
    >
      {/* Add live stats, contract links, or a demo here if desired */}
    </WingSection>
    <WingSection
      id="ai"
      title="AI / ML Wing"
      description="Pushing the boundaries of intelligence. From autonomous agents to generative models, we research and deploy AI for the edge and the unknown."
      visual={AIVisual}
    >
      {/* Add a live AI demo, or research highlights here */}
    </WingSection>
    <WingSection
      id="rnd"
      title="R&D / Think Tank"
      description="Radical research, rapid prototyping, and future shock. We explore, invent, and break the rules to build what comes next."
      visual={RDVisual}
    >
      {/* Add a news ticker, blog, or live feed here */}
    </WingSection>
  </div>
);

export default WingsShowcase;
