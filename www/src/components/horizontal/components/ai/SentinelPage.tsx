import React from 'react';
import { RoadmapItem } from '../../types';

const project: {
    name: string;
    purpose: string;
    technology: string[];
    roadmap: { status: RoadmapItem['status']; title: string }[];
} = {
    name: 'Sentinel',
    purpose: 'A decentralized, AI-powered security protocol. A network of autonomous agents continuously monitors on-chain activity to detect threats, exploits, and economic anomalies in real-time, providing crucial threat intelligence.',
    technology: [
        'Autonomous Agent Monitoring Network',
        'On-chain Anomaly & Threat Detection Models',
        'Real-time Security Consensus Mechanism',
    ],
    roadmap: [
        { status: 'Completed', title: 'On-Chain Threat Model Research' },
        { status: 'In Progress', title: 'Alpha Monitoring Network' },
        { status: 'Planned', title: 'Public Audit Competition' },
        { status: 'Planned', title: 'Mainnet Security Launch' },
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

const SentinelPage: React.FC = () => {
    return (
        <div id="ai-sentinel" className="w-full h-full flex items-center justify-center p-6 sm:p-8 md:p-16 bg-arcx-dark pr-0 sm:pr-24 max-w-full overflow-x-hidden">
            <div className="max-w-7xl w-full grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16 items-center">
                 {/* Visual Side */}
                <div className="w-full h-96 flex items-center justify-center relative animate-fade-in-left">
                    <div className="absolute w-64 h-64 rounded-full border-2 border-arcx-purple/10"></div>
                    <div className="absolute w-80 h-80 rounded-full border border-arcx-purple/5 animate-spin-slow"></div>
                    <div className="absolute w-48 h-48 bg-arcx-purple/10 rounded-full blur-3xl"></div>
                    <div className="absolute w-32 h-32 rounded-full bg-arcx-purple/20 border border-arcx-purple/40 animate-heartbeat-glow"></div>
                     <div className="absolute text-center text-arcx-purple font-thin tracking-widest text-lg">
                        <p>AI-Powered</p>
                        <p>Web3 Security</p>
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

export default SentinelPage;