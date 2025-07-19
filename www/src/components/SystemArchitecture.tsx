import {
    Brain,
    Clock,
    Cpu,
    Database,
    GitBranch,
    Layers,
    Network,
    Server,
    Shield,
    Zap,
    Atom,
    Lock,
    Globe
} from 'lucide-react';
import { useState } from 'react';

// Core Development Platform Components
const platformComponents = [
  {
    name: 'FastAPI Backend',
    subtitle: 'High-performance Python API server',
    icon: Server,
    color: 'border-blue-500/30 bg-blue-500/10',
    description: 'Production-ready FastAPI backend with real-time data sync, CORS support, and comprehensive error handling',
    features: [
      'RESTful API endpoints with automatic OpenAPI docs',
      'Real-time WebSocket connections for live updates',
      'File upload/download with ZIP extraction support',
      'JSON persistence with backup and recovery systems'
    ],
    technical: {
      port: '5000',
      framework: 'FastAPI + Uvicorn',
      language: 'Python 3.11+',
      status: 'Production Ready'
    }
  },
  {
    name: 'React Dashboard IDE',
    subtitle: 'Modern web-based development environment',
    icon: Layers,
    color: 'border-purple-500/30 bg-purple-500/10',
    description: 'Full-featured IDE with Monaco Editor, supporting 20+ programming languages with live collaboration',
    features: [
      'Monaco Editor with IntelliSense and syntax highlighting',
      'Integrated file explorer with project management',
      'Built-in terminal with multi-session support',
      'Plugin and extension management dashboard'
    ],
    technical: {
      port: '3002',
      framework: 'React + TypeScript + Vite',
      language: 'TypeScript',
      status: 'Production Ready'
    }
  },
  {
    name: 'AROS Integration',
    subtitle: 'Autonomous Research Operations System',
    icon: Brain,
    color: 'border-green-500/30 bg-green-500/10',
    description: 'AI-powered autonomous systems for research, content generation, and workflow orchestration',
    features: [
      'Autonomous blog and content generation system',
      'Multi-agent debate and research frameworks',
      'Enterprise orchestration with task automation',
      'Real-time monitoring and health checks'
    ],
    technical: {
      port: '8080',
      framework: 'Python + AsyncIO',
      language: 'Python',
      status: 'Active Development'
    }
  },
  {
    name: 'Template Management',
    subtitle: 'Multi-framework project scaffolding',
    icon: GitBranch,
    color: 'border-orange-500/30 bg-orange-500/10',
    description: 'Advanced template system supporting React, Vue, Angular, Node.js, Python, and custom frameworks',
    features: [
      'Multi-framework template upload and management',
      'Live template preview and testing environment',
      'Automated project generation and configuration',
      'Version control integration with Git workflows'
    ],
    technical: {
      port: 'Integrated',
      framework: 'Multi-framework Support',
      language: 'Universal',
      status: 'Production Ready'
    }
  },
  {
    name: 'Real-time Sync',
    subtitle: 'Live collaboration and data synchronization',
    icon: Network,
    color: 'border-green-500/30 bg-green-500/10',
    description: 'WebSocket-based real-time synchronization for collaborative development and live updates',
    features: [
      'Live code synchronization across multiple users',
      'Real-time file system monitoring and updates',
      'Instant plugin state synchronization',
      'WebSocket connections with automatic reconnection'
    ],
    technical: {
      port: '6000',
      framework: 'WebSocket + Event Streaming',
      language: 'JavaScript/Python',
      status: 'Production Ready'
    }
  },
  {
    name: 'Plugin Ecosystem',
    subtitle: 'Extensible architecture with dynamic loading',
    icon: Zap,
    color: 'border-yellow-500/30 bg-yellow-500/10',
    description: 'Dynamic plugin system with install/uninstall capabilities and comprehensive management dashboard',
    features: [
      'Dynamic plugin loading without server restart',
      'Visual plugin management and configuration',
      'Extension marketplace integration',
      'Hot-reload development environment'
    ],
    technical: {
      port: 'Dynamic',
      framework: 'Dynamic Module Loading',
      language: 'Multi-language',
      status: 'Production Ready'
    }
  }
];

// Development & Integration Features  
const developmentFeatures = [
  {
    name: 'Monaco Editor Integration',
    icon: GitBranch,
    description: 'Full VS Code editor experience with 20+ language support',
    color: 'border-red-500/30 bg-red-500/10'
  },
  {
    name: 'Live Hot Reload',
    icon: Clock,
    description: 'Instant updates with Hot Module Replacement (HMR)',
    color: 'border-blue-500/30 bg-blue-500/10'
  },
  {
    name: 'Multi-Framework Support',
    icon: Lock,
    description: 'React, Vue, Angular, Node.js, Python templates',
    color: 'border-purple-500/30 bg-purple-500/10'
  },
  {
    name: 'Container Virtualization',
    icon: Server,
    description: 'Docker integration with isolated development environments',
    color: 'border-green-500/30 bg-green-500/10'
  },
  {
    name: 'AI-Powered Workflows',
    icon: Shield,
    description: 'AROS integration for automated development tasks',
    color: 'border-orange-500/30 bg-orange-500/10'
  },
  {
    name: 'Real-time Collaboration',
    icon: Globe,
    description: 'Live code sharing and collaborative development',
    color: 'border-cyan-500/30 bg-cyan-500/10'
  }
];

const SystemArchitecture = () => {
  const [selectedFramework, setSelectedFramework] = useState(0);
  const [activeView, setActiveView] = useState('frameworks');

  return (
    <section className="relative py-32 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-light text-white mb-6">
            Platform Architecture
          </h2>
          <p className="text-xl text-white/60 max-w-4xl mx-auto">
            Production-ready development platform combining <strong className="text-white/80">FastAPI backend</strong>, 
            <strong className="text-white/80"> React dashboard IDE</strong>, and <strong className="text-white/80">autonomous research systems</strong>
            <br />for modern multi-framework development workflows.
            <span className="block mt-4 text-base text-white/40 italic">
              Version 2.1.0 • Fully operational and production-tested
            </span>
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center mb-12">
          <div className="flex bg-white/5 rounded border border-white/10 p-1">
            <button
              onClick={() => setActiveView('frameworks')}
              className={`px-6 py-2 rounded transition-all duration-300 ${
                activeView === 'frameworks'
                  ? 'bg-white text-black'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Core Components
            </button>
            <button
              onClick={() => setActiveView('research')}
              className={`px-6 py-2 rounded transition-all duration-300 ${
                activeView === 'research'
                  ? 'bg-white text-black'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Development Features
            </button>
          </div>
        </div>

        {activeView === 'frameworks' && (
          <>
            {/* Core Components Grid */}
            <div className="grid lg:grid-cols-2 gap-8 mb-16">
              {platformComponents.map((component, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedFramework(selectedFramework === index ? null : index)}
                  className={`relative p-8 border transition-all duration-500 cursor-pointer ${
                    selectedFramework === index
                      ? component.color + ' scale-105'
                      : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-start gap-6 mb-6">
                    <div className="w-16 h-16 border border-white/20 flex items-center justify-center">
                      <component.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-light text-white mb-1">{component.name}</h3>
                      <p className="text-white/60 text-sm mb-3">{component.subtitle}</p>
                      <p className="text-white/70 leading-relaxed">{component.description}</p>
                    </div>
                  </div>

                  {selectedFramework === index && (
                    <div className="border-t border-white/20 pt-6 grid md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-white font-light mb-4 flex items-center gap-2">
                          <Layers className="w-4 h-4" />
                          Key Features
                        </h4>
                        <ul className="space-y-3">
                          {component.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-white/60 text-sm">
                              <Zap className="w-3 h-3 text-white/40 mt-1 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-white font-light mb-4 flex items-center gap-2">
                          <Cpu className="w-4 h-4" />
                          Technical Details
                        </h4>
                        <div className="space-y-3">
                          {Object.entries(component.technical).map(([key, value], idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-white/60 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                              <span className="text-white/80 font-mono text-xs">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* System Integration Flow */}
            <div className="border-t border-white/10 pt-16">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-light text-white mb-4">
                  Development Workflow
                </h3>
                <p className="text-white/60 max-w-2xl mx-auto">
                  Integrated development flow from code editing to deployment
                </p>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 border border-blue-500/30 bg-blue-500/10 flex items-center justify-center">
                    <Server className="w-10 h-10 text-white" />
                  </div>
                  <h4 className="text-white font-light mb-2">FastAPI Backend</h4>
                  <p className="text-white/60 text-sm">API & Data Management</p>
                </div>

                <div className="hidden md:block">
                  <div className="w-16 h-px bg-gradient-to-r from-white/40 to-white/40" />
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 border border-purple-500/30 bg-purple-500/10 flex items-center justify-center">
                    <Layers className="w-10 h-10 text-white" />
                  </div>
                  <h4 className="text-white font-light mb-2">React IDE</h4>
                  <p className="text-white/60 text-sm">Code editing & collaboration</p>
                </div>

                <div className="hidden md:block">
                  <div className="w-16 h-px bg-gradient-to-r from-white/40 to-white/40" />
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 border border-green-500/30 bg-green-500/10 flex items-center justify-center">
                    <Brain className="w-10 h-10 text-white" />
                  </div>
                  <h4 className="text-white font-light mb-2">AROS</h4>
                  <p className="text-white/60 text-sm">Autonomous systems</p>
                </div>

                <div className="hidden md:block">
                  <div className="w-16 h-px bg-gradient-to-r from-white/40 to-white/40" />
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 border border-orange-500/30 bg-orange-500/10 flex items-center justify-center">
                    <Database className="w-10 h-10 text-white" />
                  </div>
                  <h4 className="text-white font-light mb-2">Templates</h4>
                  <p className="text-white/60 text-sm">Multi-framework support</p>
                </div>
              </div>
            </div>
          </>
        )}

        {activeView === 'research' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {developmentFeatures.map((feature, index) => (
              <div
                key={index}
                className={`p-6 border transition-all duration-300 hover:border-white/20 hover:bg-white/5 ${feature.color}`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                  <h3 className="text-lg font-light text-white">{feature.name}</h3>
                </div>
                <p className="text-white/60 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SystemArchitecture;
