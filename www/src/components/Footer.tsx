
import { ExternalLink, Github, Network, Terminal } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative py-16 px-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 border border-white/20 flex items-center justify-center">
                <Network className="w-4 h-4 text-white" />
              </div>
              <div className="text-xl font-light text-white">ARTIFACT VIRTUAL</div>
            </div>
            <p className="text-white/60 leading-relaxed">
              An exploration into whether consciousness can emerge from constitutional principles—
              investigating the deepest questions of artificial sentience and distributed intelligence.
            </p>
            <div className="mt-4 text-xs text-white/40 font-mono-slim">
              Early Development • Philosophical Prototypes • Open Inquiry
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-light mb-6">Philosophical Inquiries</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-white/60 hover:text-white transition-colors duration-300">Constitutional Emergence</a></li>
              <li><a href="#" className="text-white/60 hover:text-white transition-colors duration-300">Distributed Consciousness</a></li>
              <li><a href="#" className="text-white/60 hover:text-white transition-colors duration-300">Quantum Ethics</a></li>
              <li><a href="#" className="text-white/60 hover:text-white transition-colors duration-300">Post-Scarcity Economics</a></li>
              <li><a href="#" className="text-white/60 hover:text-white transition-colors duration-300">Constitutional Intelligence</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-light mb-6">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="https://github.com/amuzetnoM/artifactvirtual" className="text-white/60 hover:text-white transition-colors duration-300 flex items-center gap-2">
                  <Github className="w-3 h-3" />
                  GitHub Repository
                </a>
              </li>
              <li><a href="#" className="text-white/60 hover:text-white transition-colors duration-300">Documentation</a></li>
              <li><a href="#" className="text-white/60 hover:text-white transition-colors duration-300">API Reference</a></li>
              <li><a href="#" className="text-white/60 hover:text-white transition-colors duration-300">Research Papers</a></li>
              <li><a href="#" className="text-white/60 hover:text-white transition-colors duration-300">Community</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-light mb-6">Deployment</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors duration-300 flex items-center gap-2">
                  <Terminal className="w-3 h-3" />
                  Quick Start
                </a>
              </li>
              <li><a href="#" className="text-white/60 hover:text-white transition-colors duration-300">Bootstrap Guide</a></li>
              <li><a href="#" className="text-white/60 hover:text-white transition-colors duration-300">Docker Images</a></li>
              <li><a href="#" className="text-white/60 hover:text-white transition-colors duration-300">System Status</a></li>
              <li><a href="#" className="text-white/60 hover:text-white transition-colors duration-300">Support</a></li>
            </ul>
          </div>
        </div>

        {/* Constitutional Intelligence Stats */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-2xl font-light text-white mb-2">7-Block</div>
              <div className="text-white/60 text-sm">Circular Validation</div>
            </div>
            <div>
              <div className="text-2xl font-light text-white mb-2">Constitutional</div>
              <div className="text-white/60 text-sm">Proof of Stake</div>
            </div>
            <div>
              <div className="text-2xl font-light text-white mb-2">Quantum</div>
              <div className="text-white/60 text-sm">Resistant Security</div>
            </div>
            <div>
              <div className="text-2xl font-light text-white mb-2">WebAssembly</div>
              <div className="text-white/60 text-sm">Sandboxed Execution</div>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/40 text-sm">
            © 2025 Artifact Virtual. Licensed under MIT License.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-white/40 hover:text-white/60 transition-colors duration-300 text-sm">Privacy Policy</a>
            <a href="#" className="text-white/40 hover:text-white/60 transition-colors duration-300 text-sm">Terms of Service</a>
            <a href="#" className="text-white/40 hover:text-white/60 transition-colors duration-300 text-sm flex items-center gap-1">
              Security
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
