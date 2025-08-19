
import React from 'react';

const SecurityCard: React.FC<{ title: string; description: string }> = ({ title, description }) => (
    <div className="bg-white/5 backdrop-blur-md p-8 rounded-sm border border-white/10 h-full">
        <h3 className="text-xl font-light text-gray-200 tracking-widest uppercase">{title}</h3>
        <p className="mt-4 text-gray-500 font-light text-sm leading-relaxed">{description}</p>
        <div className="w-1/4 h-[1px] bg-arcx-orange mt-6"></div>
    </div>
);

const ArcxSecurity: React.FC = () => {
  return (
    <div id="arcx-security" className="w-full h-full flex flex-col items-center justify-center p-8 md:p-16 bg-arcx-dark pl-24">
        <div className="text-center w-full max-w-7xl mx-auto mb-12">
            <h2 className="text-4xl md:text-6xl font-thin text-gray-200 tracking-[0.2em] uppercase">
                Security & Trust
            </h2>
            <p className="mt-4 text-gray-400 font-light max-w-2xl mx-auto">
                A commitment to a secure and transparent protocol, building towards full decentralization.
            </p>
        </div>

        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
            <SecurityCard 
                title="Third-Party Audit"
                description="The ARCX smart contract has undergone a comprehensive third-party security audit to identify and address potential vulnerabilities, ensuring the safety of user funds."
            />
            <SecurityCard 
                title="Governance & Control"
                description="Initially, the contract is managed by a developer-controlled multi-sig for stability. This administrative control will be progressively transferred to the ARCX DAO as the protocol matures and liquidity deepens, ensuring a secure transition to community governance."
            />
        </div>
    </div>
  );
};

export default ArcxSecurity;
