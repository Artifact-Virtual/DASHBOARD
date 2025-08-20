import React from "react";


const FinalFooter = () => (
  <footer className="finalfooter w-full bg-neutral-950 text-neutral-200 font-light py-12 px-4 mt-0 border-t border-neutral-800/60 relative">
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 pb-8">
      {/* About */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3 tracking-wide">Artifact Virtual</h3>
        <p className="text-sm text-neutral-400 leading-relaxed mb-2">A Framework for Holistic R/D — Radical research, rapid prototyping, and future shock.</p>
        <p className="text-xs text-neutral-600">© {new Date().getFullYear()} Artifact Virtual. All rights reserved.</p>
      </div>
      {/* Quick Links */}
      <div>
        <h4 className="text-base font-semibold text-white mb-3 tracking-wide">Quick Links</h4>
        <ul className="space-y-2 text-sm">
          <li><a href="/" className="hover:text-cyan-400 transition-colors">Home</a></li>
          <li><a href="#disciplines" className="hover:text-cyan-400 transition-colors">Core Disciplines</a></li>
          <li><a href="#vision" className="hover:text-cyan-400 transition-colors">Thesis</a></li>
          <li><a href="/docs/AGGREGATOR_MARKET_API.md" className="hover:text-cyan-400 transition-colors">Docs</a></li>
        </ul>
      </div>
      {/* Socials */}
      <div>
        <h4 className="text-base font-semibold text-white mb-3 tracking-wide">Connect</h4>
        <ul className="space-y-2 text-sm">
          <li><a href="https://twitter.com/artifactvirtual" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">Twitter/X</a></li>
          <li><a href="https://github.com/Artifact-Virtual" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">GitHub</a></li>
          <li><a href="mailto:contact@artifact-virtual.com" className="hover:text-cyan-400 transition-colors">Email</a></li>
        </ul>
      </div>
      {/* Contact */}
      <div>
        <h4 className="text-base font-semibold text-white mb-3 tracking-wide">Contact</h4>
        <p className="text-sm text-neutral-400 mb-2">contact@artifact-virtual.com</p>
        <p className="text-xs text-neutral-600">We welcome collaboration and inquiries from researchers, engineers, and organizations.</p>
      </div>
    </div>
  </footer>
);

export default FinalFooter;
