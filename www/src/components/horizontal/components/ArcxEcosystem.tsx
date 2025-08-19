import React from 'react';

const DexCard: React.FC<{ name: string, description: string }> = ({ name, description }) => (
    <div className="bg-white/5 p-4 rounded-sm border border-white/10">
        <h4 className="font-light tracking-widest uppercase text-gray-200">{name}</h4>
        <p className="text-xs text-gray-500 font-light mt-1">{description}</p>
    </div>
);

const ArcxEcosystem: React.FC = () => {
  return (
    <div id="arcx-ecosystem" className="w-full h-full flex flex-col items-center justify-center p-8 md:p-16 bg-arcx-dark pl-24">
       <div className="text-center w-full max-w-7xl mx-auto mb-12">
            <h2 className="text-4xl md:text-6xl font-thin text-gray-200 tracking-[0.2em] uppercase">
                Ecosystem
            </h2>
            <p className="mt-4 text-gray-400 font-light max-w-xl mx-auto">
                Engage with the ARCX token across the decentralized landscape.
            </p>
        </div>

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-uniswap-pink/90 text-white p-8 rounded-sm flex flex-col justify-between border border-uniswap-pink relative overflow-hidden animate-pink-glow-pulse">
                {/* Liquid Energy Particles */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {Array.from({ length: 15 }).map((_, i) => (
                        <span
                            key={i}
                            className="absolute bg-white/50 rounded-full animate-liquid-drift"
                            style={{
                                width: `${Math.random() * 3 + 1}px`,
                                height: `${Math.random() * 3 + 1}px`,
                                left: `${Math.random() * 100}%`,
                                bottom: `-${Math.random() * 20 + 5}px`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${Math.random() * 5 + 3}s`,
                            }}
                        />
                    ))}
                </div>
                
                <div className="relative">
                    <h3 className="text-2xl font-semibold tracking-wider">Primary Liquidity</h3>
                    <p className="mt-2 text-md font-light text-pink-100">The core ARCX/ETH liquidity pool is hosted on Uniswap v3.</p>
                </div>
                <div className="mt-8 relative">
                    <a href="https://app.uniswap.org/swap?outputCurrency=0x25aB350b5575510B52705657f9552a9263914f44" target="_blank" rel="noopener noreferrer" className="bg-white text-uniswap-pink font-bold py-3 px-6 rounded-sm text-sm uppercase tracking-widest hover:bg-pink-100 transition-colors">
                        Trade on Uniswap
                    </a>
                </div>
            </div>

            <div className="space-y-4">
                <div className="bg-white/5 p-4 rounded-sm border border-white/10">
                    <h4 className="font-light tracking-widest uppercase text-gray-200">Live Chart</h4>
                     <p className="text-xs text-gray-500 font-light mt-1">Real-time price action and token data.</p>
                     <a href="https://dexscreener.com/base/0x2568de10d1a733e281a8435b2e59600e12b620b1" target="_blank" rel="noopener noreferrer" className="text-arcx-orange text-sm font-light tracking-widest mt-2 inline-block hover:underline">
                        View on DexScreener &rarr;
                    </a>
                </div>
                <DexCard name="SushiSwap" description="Available for swaps on the Sushi DEX." />
                <DexCard name="Alien Base" description="Tradeable on the Alien Base DEX." />
            </div>
      </div>
    </div>
  );
};

export default ArcxEcosystem;