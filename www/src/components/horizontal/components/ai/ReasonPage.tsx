import React from 'react';
import { RoadmapItem } from '../../types';

const project: {
    name: string;
    purpose: string;
    technology: string[];
    roadmap: { status: RoadmapItem['status']; title: string }[];
} = {
    name: 'Reason',
    purpose: 'A decentralized protocol for verifiable and private AI inference using Zero-Knowledge Machine Learning (ZKML). It allows for trustless AI applications in sensitive fields like finance and healthcare without revealing input data.',
    technology: [
        'Zero-Knowledge Machine Learning (ZKML)',
        'Cryptographic Proof of Correct Computation',
        'Privacy-Preserving Inference APIs',
    ],
    roadmap: [
        { status: 'Completed', title: 'ZKML Foundational Research' },
        { status: 'Completed', title: 'Internal Proof of Concept' },
        { status: 'In Progress', title: 'Public Inference Testnet' },
        { status: 'Planned', title: 'Mainnet Protocol Deployment' },
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

const ReasonPage: React.FC = () => {
    return (
        <div id="ai-reason" className="w-full h-full flex items-center justify-center p-6 sm:p-8 md:p-16 bg-arcx-dark pr-0 sm:pr-24 max-w-full overflow-x-hidden">
            <div className="max-w-7xl w-full grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16 items-center">
                {/* Information Side */}
                 <div className="bg-white/5 backdrop-blur-md p-8 rounded-sm border border-white/10 animate-fade-in-left">
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
                 {/* Visual Side */}
                <div className="w-full h-96 flex items-center justify-center relative animate-fade-in-right">
                     <div className="absolute w-full h-full bg-arcx-purple/5 rounded-sm blur-3xl" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
                     <svg width="60%" height="60%" viewBox="0 0 100 100" className="opacity-60">
                         <polygon points="50,0 100,25 100,75 50,100 0,75 0,25" fill="none" stroke="rgba(115, 0, 255, 0.4)" strokeWidth="1" className="animate-spin-slow-reverse" style={{ transformOrigin: '50% 50%' }}/>
                         <polygon points="50,20 80,35 80,65 50,80 20,65 20,35" fill="rgba(115, 0, 255, 0.1)" stroke="rgba(115, 0, 255, 0.2)" strokeWidth="0.5" className="animate-spin-slow" style={{ transformOrigin: '50% 50%' }} />
                         <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(115, 0, 255, 0.1)" strokeWidth="0.5" className="animate-pulse-slow" />
                         <line x1="0" y1="25" x2="100" y2="75" stroke="rgba(115, 0, 255, 0.1)" strokeWidth="0.5" className="animate-pulse-slow" style={{animationDelay: '-1.5s'}} />
                         <line x1="0" y1="75" x2="100" y2="25" stroke="rgba(115, 0, 255, 0.1)" strokeWidth="0.5" className="animate-pulse-slow" style={{animationDelay: '-3s'}} />
                     </svg>
                     <div className="absolute text-center text-arcx-purple font-thin tracking-widest text-lg">
                        <p>Verifiable</p>
                        <p>AI Inference</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReasonPage;