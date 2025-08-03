import { Network, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Navigation = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <nav className="relative z-50 w-full py-6 px-8">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link to="/" className="flex items-center space-x-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 border border-white/20 flex items-center justify-center">
              <Network className="w-4 h-4 text-white" />
            </div>
            <div className="text-2xl font-thin tracking-wider text-white">
              ARTIFACT
            </div>
          </div>
          <div className="hidden md:block text-xs font-mono-slim tracking-[0.3em] text-white/60 uppercase">
            VIRTUAL
          </div>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <a href="#architecture" className="text-white/80 hover:text-white transition-colors duration-300 relative group font-light tracking-wide">
            Platform
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
          </a>
          {/* API link removed */}
          <Link to="/research" className="text-white/80 hover:text-white transition-colors duration-300 relative group font-light tracking-wide">
            Research
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
          </Link>
          <a href="#" className="text-white/80 hover:text-white transition-colors duration-300 relative group font-light tracking-wide">
            Documentation
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
          </a>
          <a href="https://github.com/amuzetnoM/artifactvirtual" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors duration-300 relative group font-light tracking-wide">
            GitHub
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
          </a>
          <button className="flex items-center gap-2 px-6 py-2 border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300 font-light tracking-wide">
            <Terminal className="w-4 h-4" />
            Deploy
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            className="text-white/80 hover:text-white"
            aria-label="Toggle menu"
            onClick={toggleSidebar}
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <div className="h-px bg-current w-full" />
              <div className="h-px bg-current w-full" />
              <div className="h-px bg-current w-full" />
            </div>
          </button>
        </div>
      </div>

      {/* Sidebar for mobile */}
      {isSidebarOpen && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-90 z-40 flex flex-col items-center space-y-6 py-8">
          <button
            className="absolute top-4 right-4 text-white text-2xl"
            aria-label="Close menu"
            onClick={toggleSidebar}
          >
            &times;
          </button>
          <Link to="/" className="text-white text-lg" onClick={toggleSidebar}>
            Home
          </Link>
          <a href="#architecture" className="text-white text-lg" onClick={toggleSidebar}>
            Platform
          </a>
          <Link to="/research" className="text-white text-lg" onClick={toggleSidebar}>
            Research
          </Link>
          <a href="#" className="text-white text-lg" onClick={toggleSidebar}>
            Documentation
          </a>
          <a
            href="https://github.com/amuzetnoM/artifactvirtual"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white text-lg"
            onClick={toggleSidebar}
          >
            GitHub
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
