import React from 'react';
import { RoadmapItem } from '../../types';

const project: {
    name: string;
    purpose: string;
    technology: string[];
    roadmap: { status: RoadmapItem['status']; title: string }[];
} = {
    name: 'Legion',
    purpose: 'A decentralized physical infrastructure network (DePIN) creating an open marketplace for GPU compute, offering a cost-effective, censorship-resistant alternative to centralized cloud providers for AI/ML development.',
    technology: [
        'Decentralized GPU Scheduling & Job Distribution',
        'Incentivized Compute-Power Contribution Model',
        'Broad Workload Compatibility (e.g., Docker)',
    ],
    roadmap: [
        { status: 'Completed', title: 'Core Protocol Development' },
        { status: 'In Progress', title: 'Incentivized Testnet' },
        { status: 'Planned', title: 'Mainnet Launch' },
        { status: 'Planned', title: 'Containerization Support' },
    ],
};

const StatusIndicator: React.FC<{ status: RoadmapItem['status'] }> = ({ status }) => {
    const baseClass = "w-2 h-2 rounded-full";
    switch (status) {
        case 'Completed': return <div className={`${baseClass} bg-arcx-purple-dark`} title="Completed"></div>;
        case 'In Progress': return <div className={`${baseClass} bg-arcx-purple animate-pulse`} title="In Progress"></div>;
        case 'Planned': return <div className={`${baseClass} bg-gray-700`} title="Planned"></div>;
    }
};

const LegionPage: React.FC = () => {
    return (
        <div id="ai-legion" className="w-full h-full flex items-center justify-center p-8 md:p-16 bg-arcx-dark pr-24">
            <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Visual Side */}
                <div className="w-full h-96 flex items-center justify-center relative animate-fade-in-left">
                    <div className="absolute w-full h-full bg-arcx-purple/5 rounded-full blur-3xl"></div>
                    <svg width="80%" height="80%" viewBox="0 0 200 200" className="opacity-50">
                        {Array.from({ length: 50 }).map((_, i) => (
                             <circle 
                                key={i} 
                                cx={Math.random() * 200} 
                                cy={Math.random() * 200} 
                                r="1.5" 
                                fill="rgba(115, 0, 255, 0.5)" 
                                className="animate-node-drift"
                                style={{ animationDelay: `${Math.random() * -12}s` }}
                            />
                        ))}
                         <path d="M 50 50 Q 150 50 150 150" stroke="rgba(115, 0, 255, 0.2)" fill="none" strokeWidth="1" className="animate-line-pulse" style={{ animationDelay: '-1s' }} />
                         <path d="M 180 20 Q 20 180 100 100" stroke="rgba(115, 0, 255, 0.1)" fill="none" strokeWidth="1" className="animate-line-pulse" />
                         <path d="M 20 150 Q 180 20 50 100" stroke="rgba(115, 0, 255, 0.15)" fill="none" strokeWidth="1" className="animate-line-pulse" style={{ animationDelay: '-2s' }} />
                    </svg>
                     <div className="absolute text-center text-arcx-purple font-thin tracking-widest text-lg">
                        <p>Global GPU</p>
                        <p>Marketplace</p>
                    </div>
                </div>

                {/* Information Side */}
                <div className="bg-white/5 backdrop-blur-md p-8 rounded-sm border border-white/10 animate-fade-in-right">
                    <h2 className="text-4xl font-thin tracking-[0.2em] uppercase text-arcx-purple">{project.name}</h2>
                    <div className="mt-6 space-y-6">
                        <div>
                            <h3 className="text-md font-light tracking-[0.2em] uppercase text-gray-200 border-b border-white/10 pb-2">Purpose</h3>
                            <p className="mt-3 text-sm text-gray-400 font-light leading-relaxed">{project.purpose}</p>
                        </div>
                        <div>
                            <h3 className="text-md font-light tracking-[0.2em] uppercase text-gray-200 border-b border-white/10 pb-2">Key Technology</h3>
                            <ul className="mt-3 space-y-2 text-sm text-gray-400 font-light">
                                {project.technology.map((tech, i) => <li key={i} className="flex items-start"><span className="text-arcx-purple mr-2 mt-1">&#8227;</span>{tech}</li>)}
                            </ul>
                        </div>
                        <div>
                             <h3 className="text-md font-light tracking-[0.2em] uppercase text-gray-200 border-b border-white/10 pb-2">Roadmap</h3>
                             <div className="mt-3 space-y-3 text-sm">
                                {project.roadmap.map(item => (
                                    <div key={item.title} className="flex items-center justify-between">
                                        <p className="font-light tracking-wider text-gray-400">{item.title}</p>
                                        <StatusIndicator status={item.status} />
                                    </div>
                                ))}
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LegionPage;