
import React from 'react';

const FeatureCard: React.FC<{ title: string; description: string }> = ({ title, description }) => (
    <div className="bg-white/5 backdrop-blur-md p-6 rounded-sm border border-white/10 group hover:border-arcx-orange/50 transition-all duration-300">
        <h3 className="text-xl font-light text-gray-200 tracking-widest uppercase">{title}</h3>
        <p className="mt-4 text-gray-500 font-light text-sm leading-relaxed">{description}</p>
        <div className="w-1/4 h-[1px] bg-arcx-orange/0 group-hover:bg-arcx-orange mt-4 transition-all duration-300"></div>
    </div>
);


const About: React.FC = () => {
  return (
    <div id="arcx-about" className="w-full h-full flex items-center justify-center p-6 sm:p-8 md:p-16 bg-arcx-dark pl-0 sm:pl-24 max-w-full overflow-x-hidden">
      <div className="max-w-7xl w-full grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16 items-center">
        <div className="animate-fade-in-left">
          <h2 className="text-4xl md:text-6xl font-thin text-gray-200 tracking-[0.2em] uppercase leading-tight">
            What is <span className="text-arcx-orange">ARCX</span>?
          </h2>
          <p className="mt-6 text-gray-400 font-light max-w-xl text-lg leading-relaxed">
            ARCX is a decentralized protocol and native token on the Base network, designed for the future of digital asset management within the Artifact Virtual ecosystem. It empowers holders with governance rights, enabling them to shape the protocol's evolution.
          </p>
          <div className="mt-8 bg-base-blue/90 text-white p-4 rounded-sm border border-base-blue w-fit">
            <p className="font-semibold tracking-wider">BUILT ON BASE</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 animate-fade-in-right">
            <FeatureCard 
                title="Sovereign Governance" 
                description="ARCX holders steer the protocol's evolution through a decentralized autonomous organization (DAO)." 
            />
             <FeatureCard 
                title="Yield Architecture" 
                description="Engage in novel liquidity strategies and staking mechanisms to generate returns on your assets." 
            />
             <FeatureCard 
                title="Verified Security" 
                description="The protocol's smart contracts are subject to continuous audits and formal verification for maximum security." 
            />
        </div>
      </div>
    </div>
  );
};

export default About;