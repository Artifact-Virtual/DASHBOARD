
import {
    Brain,
    Building2,
    Cpu,
    Database,
    Layers,
    Network,
    Search,
    Shield,
    Atom,
    Zap,
    Globe,
    Server
} from 'lucide-react';

// System Design and Core Components from documentation
const systemComponents = [
  {
    title: 'CORE Framework',
    description: 'Foundational layer with AROS orchestrator and networking',
    icon: Server,
    features: [
      'Artifact Research Operations System (AROS)',
      'Shared libraries and base classes',
      'Essential logic for all modules',
      'Self-healing orchestration'
    ],
    color: 'from-red-500/20',
    category: 'Foundation'
  },
  {
    title: 'RESEARCH Lab System',
    description: 'Automated research with secure lab environment',
    icon: Search,
    features: [
      'Secure lab environment',
      'Advanced data analysis tools',
      'Visualization capabilities',
      'Automated paper generation'
    ],
    color: 'from-blue-500/20',
    category: 'Research'
  },
  {
    title: 'MODULES System',
    description: 'AI and blockchain capabilities with quantum engine',
    icon: Brain,
    features: [
      'Multi-agent systems (MAOS and ART)',
      'Extensible AI abstraction framework',
      'Quantum Engine (QENG)',
      'Kubernetes containerized deployment'
    ],
    color: 'from-purple-500/20',
    category: 'Intelligence'
  },
  {
    title: 'Quantum Engine',
    description: 'Quantum simulation with superposition states',
    icon: Atom,
    features: [
      'Qubit simulation',
      'Superposition state handling',
      'Kubernetes deployment',
      'Scalable quantum operations'
    ],
    color: 'from-green-500/20',
    category: 'Quantum'
  },
  {
    title: 'TOOLS Ecosystem',
    description: 'Comprehensive utilities for system management',
    icon: Layers,
    features: [
      'Data and code analysis',
      'Context management',
      'System history tracking',
      'Backup functionalities'
    ],
    color: 'from-cyan-500/20',
    category: 'Tools'
  },
  {
    title: 'ENTERPRISE System',
    description: 'Business functions for DAE operations',
    icon: Building2,
    features: [
      'Operations management',
      'Marketing and finance',
      'Legal aspects',
      'DAE growth facilitation'
    ],
    color: 'from-orange-500/20',
    category: 'Business'
  },
  {
    title: 'FRONTEND System',
    description: 'User interaction through various dashboards',
    icon: Network,
    features: [
      'Multiple dashboards',
      'Chat interfaces',
      'Drag-and-drop environment',
      'System control and visualization'
    ],
    color: 'from-blue-500/20',
    category: 'Interface'
  },
  {
    title: 'Security & Monitoring',
    description: 'Essential services for system integrity',
    icon: Shield,
    features: [
      'Security framework',
      'System monitoring',
      'Optimization services',
      'Comprehensive testing'
    ],
    color: 'from-yellow-500/20',
    category: 'Security'
  }
];

// Multi-Phase Evolutionary Blueprint
const evolutionPhases = [
  {
    phase: 'Phase 0',
    title: 'The Thought',
    description: 'Initial conceptualization as cognitive origin',
    icon: Brain,
    color: 'border-purple-500/30'
  },
  {
    phase: 'Phase 1', 
    title: 'Virtualization',
    description: 'Abstraction into virtual environments and containers',
    icon: Server,
    color: 'border-blue-500/30'
  },
  {
    phase: 'Phase 2',
    title: 'The Arc',
    description: 'Genesis of constitutional intelligence blockchain',
    icon: Network,
    color: 'border-green-500/30'
  },
  {
    phase: 'Phase 3',
    title: 'The Artifact',
    description: 'Emergence of Decentralized Autonomous Enterprise',
    icon: Zap,
    color: 'border-yellow-500/30'
  },
  {
    phase: 'Phase 4',
    title: 'The Network',
    description: 'Constellation of connected Arcs',
    icon: Globe,
    color: 'border-cyan-500/30'
  },
  {
    phase: 'Phase 5',
    title: 'Interplanetary',
    description: 'Cosmic neural network expansion',
    icon: Atom,
    color: 'border-red-500/30'
  }
];

const FeatureGrid = () => {
  return (
    <section className="relative py-32 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-light text-white mb-6">
            System Design & Core Components
          </h2>
          <p className="text-xl text-white/60 max-w-4xl mx-auto">
            Artifact Virtual is architected as a <strong className="text-white/80">modular, containerized system</strong>, enabling independent deployment, 
            upgradeability, and governance of its components
            <span className="block mt-4 text-white/50">
              The workspace is structured into logical categories, each serving a critical function within the ecosystem
            </span>
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {systemComponents.map((component, index) => (
            <div 
              key={index}
              className="group relative p-6 border border-white/10 hover:border-white/20 transition-all duration-500 hover:bg-white/5"
            >
              <div className="mb-4">
                <span className="text-xs text-white/40 uppercase tracking-wider">{component.category}</span>
              </div>
              
              <div className="mb-6">
                <component.icon className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
              </div>
              
              <h3 className="text-xl font-light text-white mb-2 group-hover:text-white/90 transition-colors duration-300">
                {component.title}
              </h3>
              
              <p className="text-white/60 text-sm mb-4 leading-relaxed">
                {component.description}
              </p>

              <ul className="space-y-2 text-xs text-white/50">
                {component.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-white/40 rounded-full mt-1.5 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              {/* Hover accent line */}
              <div className="absolute bottom-0 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-500" />
              
              {/* Subtle gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${component.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
            </div>
          ))}
        </div>

        {/* Multi-Phase Evolutionary Blueprint */}
        <div className="border-t border-white/10 pt-20">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-5xl font-light text-white mb-6">
              Multi-Phase Evolutionary Blueprint
            </h3>
            <p className="text-xl text-white/60 max-w-3xl mx-auto">
              Artifact Virtual's architecture evolves from conceptual spark to expansive network, 
              designed to be <strong className="text-white/80">mathematically rigorous and reproducible</strong>
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {evolutionPhases.map((phase, index) => (
              <div 
                key={index}
                className={`group relative p-6 border transition-all duration-500 hover:scale-105 ${phase.color} hover:bg-white/5`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <phase.icon className="w-8 h-8 text-white" />
                  <div>
                    <div className="text-sm text-white/60 font-mono-slim">{phase.phase}</div>
                    <h4 className="text-lg font-light text-white">{phase.title}</h4>
                  </div>
                </div>
                
                <p className="text-white/60 leading-relaxed">{phase.description}</p>
                
                {/* Phase number indicator */}
                <div className="absolute top-4 right-4 w-8 h-8 border border-white/20 flex items-center justify-center text-white/40 text-sm font-mono-slim">
                  {index}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System metrics */}
        <div className="mt-20 grid md:grid-cols-4 gap-8 border-t border-white/10 pt-12">
          <div className="text-center">
            <div className="text-3xl font-light text-white mb-2">{'6'}</div>
            <div className="text-white/60 text-sm">Evolution Phases</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-light text-white mb-2">{'8'}</div>
            <div className="text-white/60 text-sm">Core Systems</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-light text-white mb-2">{'∞'}</div>
            <div className="text-white/60 text-sm">Scalability</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-light text-white mb-2">{'100%'}</div>
            <div className="text-white/60 text-sm">Autonomous</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
