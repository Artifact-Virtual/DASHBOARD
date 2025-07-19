
import { ArrowRight, Download, GitBranch, Terminal } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="relative py-32 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Main CTA */}
          <div className="relative">
            {/* Background pattern */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-96 h-96 border border-white/10 rotate-45" />
            </div>
            
            <div className="relative z-10 bg-black/80 p-12 border border-white/20">
              <h2 className="text-4xl md:text-6xl font-light text-white mb-6">
                Deploy Your
                <span className="block font-thin text-white/60">Constitutional Intelligence</span>
              </h2>
              
              <p className="text-lg text-white/70 mb-8">
                Join the decentralized revolution. Deploy your own constitutional intelligence system with The Arc, ADAM Protocol, and quantum-resistant infrastructure.
              </p>
              
              <div className="flex flex-col gap-4">
                <button className="group flex items-center justify-center gap-3 bg-white text-black px-8 py-4 text-lg hover:bg-white/90 transition-all duration-300 transform hover:scale-105">
                  <Terminal className="w-5 h-5" />
                  Launch Constitutional Bootstrap
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
                
                <button className="border border-white/20 text-white px-8 py-4 text-lg hover:border-white/40 hover:bg-white/5 transition-all duration-300">
                  <Download className="w-5 h-5 mr-2" />
                  Download Platform
                </button>
              </div>
            </div>
          </div>

          {/* Right: Quick Start Commands */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-light text-white mb-6 flex items-center gap-3">
                <GitBranch className="w-6 h-6" />
                Quick Start
              </h3>
              
              <div className="bg-black/50 border border-white/10 p-6">
                <div className="space-y-4 font-mono-slim text-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-white/40">$</span>
                    <span className="text-white">git clone https://github.com/amuzetnoM/artifactvirtual</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-white/40">$</span>
                    <span className="text-white">cd artifactvirtual</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-white/40">$</span>
                    <span className="text-white">python bootstrap.py</span>
                  </div>
                  <div className="text-green-400 mt-4">
                    → Constitutional foundation initializing...
                    <br />
                    → ADAM Protocol activating...
                    <br />
                    → QVM quantum systems ready...
                    <br />
                    → Constitutional intelligence online in {'<2min'}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-light">Available Commands</h4>
              <div className="grid gap-3">
                <div className="flex items-center gap-3 p-3 border border-white/10 text-sm">
                  <code className="text-green-400 font-mono-slim">--quick</code>
                  <span className="text-white/60">Quick start with existing config</span>
                </div>
                <div className="flex items-center gap-3 p-3 border border-white/10 text-sm">
                  <code className="text-blue-400 font-mono-slim">--status</code>
                  <span className="text-white/60">Check system status</span>
                </div>
                <div className="flex items-center gap-3 p-3 border border-white/10 text-sm">
                  <code className="text-yellow-400 font-mono-slim">--repair</code>
                  <span className="text-white/60">Run diagnostics and repair</span>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <div className="text-center text-white/60 text-sm">
                <div className="mb-2">System Requirements</div>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>Python 3.11+</div>
                  <div>Node.js 18+</div>
                  <div>Docker Ready</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enterprise Section */}
        <div className="mt-20 pt-16 border-t border-white/10">
          <div className="text-center">
            <h3 className="text-3xl font-light text-white mb-4">
              Enterprise Constitutional Intelligence
            </h3>
            <p className="text-white/60 mb-8 max-w-2xl mx-auto">
              Quantum-resistant • Constitutional governance • Multi-signature security • Comprehensive audit trails
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="border border-white/20 text-white px-8 py-4 hover:border-white/40 hover:bg-white/5 transition-all duration-300">
                Contact Enterprise Sales
              </button>
              <button className="border border-white/20 text-white px-8 py-4 hover:border-white/40 hover:bg-white/5 transition-all duration-300">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
