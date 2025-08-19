import React from 'react';
import { RoadmapItem } from '../types';

const roadmapData: RoadmapItem[] = [
  {
    phase: 'Q2 2024',
    title: 'Protocol Launch',
    description: 'Successful deployment on Base, Uniswap LP creation, and third-party security audit.',
    status: 'Completed',
  },
  {
    phase: 'Q3 2024',
    title: 'Growth & Governance',
    description: 'Secure first CEX listing, deploy the ARCX DAO governance portal, and launch staking contracts.',
    status: 'In Progress',
  },
  {
    phase: 'Q4 2024',
    title: 'Ecosystem Expansion',
    description: 'Launch ecosystem grants program, form strategic partnerships, and begin dApp integrations.',
    status: 'Planned',
  },
  {
    phase: 'Q1 2025',
    title: 'Future Protocol',
    description: 'Begin research and development for Protocol V2, with a focus on cross-chain exploration.',
    status: 'Planned',
  },
];

const getStatusColor = (status: RoadmapItem['status']) => {
    switch (status) {
        case 'Completed': return 'bg-arcx-maroon';
        case 'In Progress': return 'bg-arcx-orange animate-pulse';
        case 'Planned': return 'bg-gray-700';
    }
}

const Roadmap: React.FC = () => {
  return (
    <div id="arcx-roadmap" className="w-full h-full flex flex-col items-center justify-center p-8 bg-arcx-dark pl-24 overflow-hidden">
        <div className="text-center w-full max-w-7xl mx-auto mb-10">
            <h2 className="text-4xl md:text-6xl font-thin text-gray-200 tracking-[0.2em] uppercase">
                Roadmap
            </h2>
            <p className="mt-4 text-gray-400 font-light max-w-xl mx-auto">
                Our developmental trajectory towards a fully decentralized future.
            </p>
        </div>

        <div className="w-full max-w-5xl flex flex-col mt-8">
            {/* Timeline Path */}
            <div className="w-full h-4 flex items-center relative mb-8 px-[12.5%]">
                <div className="absolute top-1/2 left-0 h-[2px] w-full bg-arcx-orange/20">
                    <div className="h-full bg-arcx-orange animate-fill-line shadow-[0_0_10px_theme(colors.arcx-orange)]"></div>
                </div>
                <div className="w-full flex justify-between relative">
                    {roadmapData.map((_, index) => (
                        <div 
                            key={index} 
                            className="w-4 h-4 rounded-full bg-arcx-dark border-2 border-arcx-orange opacity-0 animate-milestone-pop"
                            style={{ animationDelay: `${0.5 + index * 0.35}s` }}
                        ></div>
                    ))}
                </div>
            </div>

            {/* Cards */}
            <div className="w-full grid grid-cols-4 gap-8">
                {roadmapData.map((item, index) => (
                    <div 
                        key={item.phase} 
                        className="bg-white/5 backdrop-blur-md rounded-sm border border-white/10 p-4 flex flex-col h-48 justify-between opacity-0 animate-fade-in-up hover:-translate-y-2 hover:border-arcx-orange/50 transition-all duration-300"
                        style={{ animationDelay: `${0.8 + index * 0.35}s` }}
                    >
                        <div>
                            <div className="flex justify-between items-center">
                                <h3 className="font-light text-gray-200 tracking-widest uppercase text-sm">{item.title}</h3>
                                <div className={`w-2 h-2 rounded-full ${getStatusColor(item.status)}`}></div>
                            </div>
                            <p className="text-xs text-gray-500 font-light mt-2">{item.description}</p>
                        </div>
                        <p className="text-gray-600 font-light text-xs tracking-widest">{item.phase}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default Roadmap;