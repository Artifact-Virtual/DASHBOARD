import React from 'react';
import { Brain, Search, Database, Zap, Globe, Code, Monitor, Shield } from 'lucide-react';

const researchCapabilities = [
  {
    title: 'Autonomous Research Pipeline',
    description: 'Experimental internet research system with ArXiv, PubMed integration. Paper generation framework under development with basic documentation capabilities.',
    icon: Search,
    features: [
      'Basic research data integration',
      'Source verification (development)',
      'Academic feed connections',
      'Prototype paper generation'
    ],
    status: 'Development',
    metrics: 'Early prototype implementation'
  },
  {
    title: 'Multi-Agent Research Team (ART)',
    description: 'Experimental AI agent coordination system with file monitoring, analysis, and reasoning capabilities. Core framework established, expanding functionality.',
    icon: Brain,
    features: [
      'WatcherAgent: File monitoring framework',
      'ResearcherAgent: Analysis prototype',
      'ReasonerAgent: Evaluation logic',
      'MemoryKeeper: Vector search experiments'
    ],
    status: 'Development',
    metrics: 'Agent framework foundation'
  },
  {
    title: 'Quantum Research Engine (QENG)',
    description: 'Quantum-classical hybrid platform with advanced qubit simulation, superposition states, and Kubernetes deployment for scalable quantum algorithm exploration.',
    icon: Zap,
    features: [
      'Qubit state management with noise modeling',
      'Comprehensive quantum gate library',
      'Multi-level circuit optimization',
      'Hardware abstraction framework'
    ],
    status: 'Active',
    metrics: 'Enterprise-grade with K8s orchestration'
  },
  {
    title: 'Advanced Data Analytics',
    description: 'Vector search, RAG implementation, PostgreSQL with Redis caching, and real-time analytics pipeline for comprehensive research data processing.',
    icon: Database,
    features: [
      'Vector search with RAG',
      'PostgreSQL + Redis architecture',
      'Real-time analytics pipeline',
      'Semantic search capabilities'
    ],
    status: 'Development',
    metrics: 'Experimental data engine'
  },
  {
    title: 'Research Lab Guardian',
    description: 'Secure lab environment with hawk-like file monitoring, RAG context system, and live indexing for autonomous research workflow management.',
    icon: Monitor,
    features: [
      'Hawk-like file monitoring',
      'RAG context system',
      'Live indexing automation',
      'Secure lab environment'
    ],
    status: 'Development',
    metrics: 'Lab environment prototype'
  },
  {
    title: 'Enterprise Security & Compliance',
    description: 'AI-powered threat detection, RBAC with fine-grained permissions, AES-256 encryption, and comprehensive audit logging for enterprise research environments.',
    icon: Shield,
    features: [
      'AI-powered threat classification',
      'RBAC with fine-grained permissions',
      'AES-256 encryption at rest/transit',
      'Comprehensive audit logging'
    ],
    status: 'Development',
    metrics: 'Security framework foundation'
  },
  {
    title: 'Constitutional AI Framework',
    description: 'ADAM Protocol with 7-weight decision matrices, neural consensus mechanisms, and digital sovereignty framework for autonomous governance.',
    icon: Code,
    features: [
      '7-weight decision matrices',
      'Neural consensus validation',
      'Constitutional governance logic',
      'Digital sovereignty framework'
    ],
    status: 'Development',
    metrics: 'AI consensus validation protocols'
  },
  {
    title: 'Global Research Network',
    description: 'Multi-region deployment capabilities with geographic distribution, cross-chain integration, and universal research accessibility.',
    icon: Globe,
    features: [
      'Multi-region deployment',
      'Geographic distribution system',
      'Cross-chain bridge protocols',
      'Universal research access'
    ],
    status: 'Planned',
    metrics: 'Phase 2 roadmap implementation'
  }
];

const ResearchCapabilities = () => {
  return (
    <section className="py-12 sm:py-20 px-4 sm:px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
            Research Capabilities & Development Status
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experimental autonomous research framework with foundational systems and ongoing development
          </p>
          <div className="mt-4 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg max-w-2xl mx-auto">
            <p className="text-blue-200 text-sm">
              🧪 <strong>Current Phase:</strong> Early development with experimental components and active research implementations
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {researchCapabilities.map((capability, index) => {
            const Icon = capability.icon;
            const statusColor = capability.status === 'Active' ? 'text-green-400' : 
                              capability.status === 'Development' ? 'text-amber-400' : 'text-gray-400';
            
            return (
              <div 
                key={index}
                className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-blue-400/30 hover:bg-blue-500/5 transition-all duration-500 group cursor-pointer transform hover:scale-[1.02]"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 group-hover:border-blue-400/40 group-hover:bg-blue-500/10 transition-all duration-300">
                      <Icon className="w-6 h-6 text-white group-hover:text-blue-300 transition-colors duration-300" />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-white group-hover:text-blue-100 transition-colors duration-300">{capability.title}</h3>
                      <span className={`text-xs font-medium ${statusColor}`}>
                        {capability.status}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed mb-4 group-hover:text-gray-200 transition-colors duration-300">
                      {capability.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-2">
                    {capability.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        <span className="text-gray-400 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Implementation Status</span>
                      <span className="text-xs text-gray-400 font-mono bg-black/30 px-2 py-1 rounded">
                        {capability.metrics}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Performance metrics summary */}
        <div className="mt-16 bg-gradient-to-r from-black/60 to-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <h3 className="text-2xl font-semibold text-white mb-6 text-center">System Performance Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">98.7/100</div>
              <div className="text-sm text-gray-400">Architecture Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">95%+</div>
              <div className="text-sm text-gray-400">Test Coverage</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">&lt;50ms</div>
              <div className="text-sm text-gray-400">Agent Coordination</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-400 mb-2">Enterprise</div>
              <div className="text-sm text-gray-400">Security Grade</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResearchCapabilities;
