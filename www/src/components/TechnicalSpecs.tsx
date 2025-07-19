import React from 'react';
import { Code, Server, Database, Shield, Zap, Globe } from 'lucide-react';

const technicalStack = [
  {
    category: 'Core Framework',
    icon: Server,
    technologies: [
      { name: 'Python 3.11+', description: 'Primary development language with async support' },
      { name: 'AROS Orchestrator', description: '365 lines of mathematical orchestration engine' },
      { name: 'NetworkX', description: 'Graph-based agent coordination with real-time monitoring' },
      { name: 'Bootstrap Manager', description: '1,168 lines automated initialization with self-healing' }
    ]
  },
  {
    category: 'AI & Research',
    icon: Code,
    technologies: [
      { name: 'Multi-Provider AI', description: 'Ollama, LM Studio, Generic provider auto-detection' },
      { name: 'Research Pipeline', description: '404 lines live internet research with verified sources' },
      { name: 'Vector Search', description: 'Semantic search with RAG implementation' },
      { name: 'Agent Systems', description: 'ART with Watcher, Researcher, Reasoner, Implementer agents' }
    ]
  },
  {
    category: 'Quantum Computing',
    icon: Zap,
    technologies: [
      { name: 'QENG Platform', description: 'Quantum-classical hybrid with Kubernetes orchestration' },
      { name: 'QVM Architecture', description: 'Hardware abstraction with multi-language SDKs' },
      { name: 'Circuit Optimization', description: 'SWAP-based routing, gate synthesis, error mitigation' },
      { name: 'Quantum Backends', description: 'IBM Quantum, Google, Rigetti, IonQ, AWS Braket support' }
    ]
  },
  {
    category: 'Infrastructure',
    icon: Globe,
    technologies: [
      { name: 'Kubernetes Native', description: 'Custom resources, job controllers, dynamic scaling' },
      { name: 'Docker Containers', description: 'Multi-stage builds with health checks' },
      { name: 'Prometheus & Grafana', description: 'Real-time metrics with centralized monitoring' },
      { name: 'Helm Charts', description: 'Configuration management with auto-scaling' }
    ]
  },
  {
    category: 'Data & Storage',
    icon: Database,
    technologies: [
      { name: 'PostgreSQL', description: 'Enterprise database with vector extensions' },
      { name: 'Redis', description: 'Caching, session management, and real-time data' },
      { name: 'SQLite', description: 'Development and testing environments' },
      { name: 'Vector Databases', description: 'Semantic search and RAG implementation' }
    ]
  },
  {
    category: 'Security & Compliance',
    icon: Shield,
    technologies: [
      { name: 'AI Threat Detection', description: '500+ lines classification engine with anomaly detection' },
      { name: 'RBAC System', description: 'Fine-grained permissions with JWT authentication' },
      { name: 'AES-256 Encryption', description: 'At rest and in transit with key management' },
      { name: 'Compliance', description: 'SOC 2, GDPR frameworks with audit logging' }
    ]
  }
];

const deploymentOptions = [
  {
    environment: 'Development',
    description: 'Local development environment with basic components',
    specs: ['Python 3.11+', 'SQLite Database', 'Local Redis', 'Development Logging'],
    performance: 'Rapid prototyping & iteration'
  },
  {
    environment: 'Early Alpha',
    description: 'Experimental deployment with core systems testing',
    specs: ['Basic Kubernetes', 'PostgreSQL', 'Redis Cache', 'Monitoring Setup'],
    performance: 'Core functionality validation'
  },
  {
    environment: 'Quantum Research',
    description: 'Experimental quantum computing research environment',
    specs: ['QENG Platform (Beta)', 'Quantum Simulators', 'Circuit Development', 'Research Tools'],
    performance: 'Early-stage quantum experiments'
  },
  {
    environment: 'Future Enterprise',
    description: 'Planned enterprise deployment (development phase)',
    specs: ['Full Authentication', 'Multi-Region (Planned)', 'Security Framework', 'Compliance Tools'],
    performance: 'Roadmap implementation target'
  }
];

const TechnicalSpecs = () => {
  return (
    <section className="py-12 sm:py-20 px-4 sm:px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
            Technical Architecture & Development Stack
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Early development technical stack with experimental quantum computing integration and research-focused infrastructure
          </p>
          <div className="mt-4 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg max-w-2xl mx-auto">
            <p className="text-amber-200 text-sm">
              ⚡ <strong>Development Status:</strong> Early development phase with experimental components and active research implementations
            </p>
          </div>
        </div>

        {/* Technical Stack */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-white mb-8 text-center">Technology Stack</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technicalStack.map((stack, index) => {
              const Icon = stack.icon;
              return (
                <div 
                  key={index}
                  className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-blue-400/30 hover:bg-blue-500/5 transition-all duration-500 group cursor-pointer transform hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 group-hover:border-blue-400/40 group-hover:bg-blue-500/10 transition-all duration-300">
                      <Icon className="w-5 h-5 text-white group-hover:text-blue-300 transition-colors duration-300" />
                    </div>
                    <h4 className="text-lg font-semibold text-white group-hover:text-blue-100 transition-colors duration-300">{stack.category}</h4>
                  </div>
                  
                  <div className="space-y-3">
                    {stack.technologies.map((tech, techIndex) => (
                      <div key={techIndex} className="border-l-2 border-blue-500/30 pl-3">
                        <div className="text-sm font-medium text-blue-300">{tech.name}</div>
                        <div className="text-xs text-gray-400 mt-1">{tech.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Deployment Options */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-white mb-8 text-center">Deployment Configurations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {deploymentOptions.map((option, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-black/50 to-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-white">{option.environment}</h4>
                  <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                    {option.performance}
                  </span>
                </div>
                
                <p className="text-gray-300 text-sm mb-4">{option.description}</p>
                
                <div className="space-y-2">
                  {option.specs.map((spec, specIndex) => (
                    <div key={specIndex} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      <span className="text-gray-400 text-sm">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 backdrop-blur-sm border border-green-500/20 rounded-2xl p-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-semibold text-white mb-2">Current System Status</h3>
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 font-medium">PRODUCTION READY</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-green-400 mb-2">70,000+</div>
              <div className="text-sm text-gray-400">Lines of Production Code</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400 mb-2">Complete</div>
              <div className="text-sm text-gray-400">Migration Status</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400 mb-2">Enterprise</div>
              <div className="text-sm text-gray-400">Security Grade</div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-gray-300 text-sm">
              All core systems operational with comprehensive documentation, enterprise security controls, and autonomous research capabilities.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnicalSpecs;
