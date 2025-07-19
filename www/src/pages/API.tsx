import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import PatternLines from '../components/PatternLines';
import Footer from '../components/Footer';
import { Code, Server, Shield, Zap, Database, Network, Activity, Terminal, Lock, Cpu } from 'lucide-react';

interface APIEndpoint {
  id: string;
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'WebSocket';
  description: string;
  category: string;
  port: number;
  technology: string;
  status: 'active' | 'development' | 'deprecated';
  authentication: boolean;
  quantumResistant: boolean;
  documentation?: string;
}

const apiEndpoints: APIEndpoint[] = [
  {
    id: 'constitutional-inference',
    name: 'Constitutional Inference API',
    path: '/api/v1/inference/constitutional',
    method: 'POST',
    description: 'Explore: Can AI systems truly follow constitutional principles, or do they merely simulate compliance?',
    category: 'Ethical Intelligence',
    port: 5000,
    technology: 'FastAPI + Constitutional Framework',
    status: 'active',
    authentication: true,
    quantumResistant: true,
    documentation: '/docs/constitutional-inference'
  },
  {
    id: 'quantum-virtualization',
    name: 'Quantum Virtualization Engine',
    path: '/api/v1/quantum/virtualize',
    method: 'POST',
    description: 'Investigate: What happens when we simulate the quantum realm on classical architecture?',
    category: 'Quantum Philosophy',
    port: 8000,
    technology: 'FastAPI + QVM',
    status: 'active',
    authentication: true,
    quantumResistant: true,
    documentation: '/docs/quantum-virtualization'
  },
  {
    id: 'aros-orchestration',
    name: 'AROS Research Orchestration',
    path: '/api/v1/research/orchestrate',
    method: 'POST',
    description: 'Question: Can research truly be autonomous, or do we simply automate human biases?',
    category: 'Autonomous Emergence',
    port: 8080,
    technology: 'FastAPI + Multi-Agent Framework',
    status: 'active',
    authentication: true,
    quantumResistant: true,
    documentation: '/docs/aros-orchestration'
  },
  {
    id: 'quantum-key-exchange',
    name: 'Quantum-Resistant Key Exchange',
    path: '/api/v1/crypto/key-exchange',
    method: 'POST',
    description: 'Ponder: What does security mean in a post-quantum world that may never arrive?',
    category: 'Cryptographic Trust',
    port: 9000,
    technology: 'FastAPI + CRYSTALS-Kyber',
    status: 'active',
    authentication: false,
    quantumResistant: true,
    documentation: '/docs/quantum-crypto'
  },
  {
    id: 'knowledge-graph',
    name: 'Knowledge Graph API',
    path: '/api/v1/knowledge',
    method: 'GET',
    description: 'Examine: How do we map knowledge when the territory itself keeps changing?',
    category: 'Living Knowledge',
    port: 7000,
    technology: 'FastAPI + Neo4j',
    status: 'active',
    authentication: true,
    quantumResistant: true,
    documentation: '/docs/knowledge-graph'
  },
  {
    id: 'websocket-realtime',
    name: 'Real-time Research Stream',
    path: '/ws/research/stream',
    method: 'WebSocket',
    description: 'Wonder: What insights emerge when research unfolds in real-time streams?',
    category: 'Temporal Streams',
    port: 6000,
    technology: 'WebSocket + Event Streaming',
    status: 'active',
    authentication: true,
    quantumResistant: true,
    documentation: '/docs/websocket-api'
  },
  {
    id: 'art-dashboard',
    name: 'Autonomous Research Team Dashboard',
    path: '/api/v1/art/dashboard',
    method: 'GET',
    description: 'Reflect: Can we observe autonomous research teams without influencing their emergence?',
    category: 'Autonomous Emergence',
    port: 8000,
    technology: 'FastAPI + WebSocket',
    status: 'active',
    authentication: true,
    quantumResistant: true,
    documentation: '/docs/art-dashboard'
  },
  {
    id: 'maos-orchestration',
    name: 'Multi-Agent Orchestration System',
    path: '/api/v1/maos',
    method: 'POST',
    description: 'Contemplate: What happens when artificial agents coordinate without human orchestration?',
    category: 'Autonomous Emergence',
    port: 8000,
    technology: 'FastAPI + Agent Framework',
    status: 'active',
    authentication: true,
    quantumResistant: true,
    documentation: '/docs/maos'
  }
];

const categories = Array.from(new Set(apiEndpoints.map(api => api.category)));

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Ethical Intelligence':
      return Shield;
    case 'Quantum Philosophy':
      return Cpu;
    case 'Autonomous Emergence':
      return Network;
    case 'Cryptographic Trust':
      return Lock;
    case 'Living Knowledge':
      return Database;
    case 'Temporal Streams':
      return Activity;
    default:
      return Server;
  }
};

const getMethodColor = (method: string) => {
  switch (method) {
    case 'GET':
      return 'text-green-400 bg-green-400/10 border-green-400/20';
    case 'POST':
      return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    case 'PUT':
      return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
    case 'DELETE':
      return 'text-red-400 bg-red-400/10 border-red-400/20';
    case 'WebSocket':
      return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
    default:
      return 'text-white/60 bg-white/10 border-white/20';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'text-green-400';
    case 'development':
      return 'text-yellow-400';
    case 'deprecated':
      return 'text-red-400';
    default:
      return 'text-white/60';
  }
};

const API = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAPIs = apiEndpoints.filter(api => {
    const matchesCategory = selectedCategory === 'All' || api.category === selectedCategory;
    const matchesSearch = api.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         api.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         api.path.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-precision">
      <PatternLines />
      
      <div className="relative z-10">
        <Navigation />
        
        <main className="max-w-7xl mx-auto px-8 py-16">
          {/* Header */}
          <header className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-thin tracking-wider mb-6">
              The Interface: Questions Made Queryable
            </h1>
            <p className="text-xl text-white/70 font-light leading-relaxed max-w-3xl mx-auto mb-8">
              Each API represents a philosophical inquiry manifested as accessible interface—where abstract questions about intelligence, 
              consciousness, and reality become concrete endpoints for exploration. These are early experiments, not production systems.
            </p>
            <p className="text-sm text-white/50 font-light italic max-w-2xl mx-auto mb-8">
              "What if deep questions could be queried like databases? What if philosophical exploration had REST endpoints?"
            </p>
            
            {/* Search */}
            <div className="max-w-lg mx-auto mb-8">
              <div className="relative">
                <Terminal className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  placeholder="Search philosophical interfaces..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/20 font-mono text-sm"
                />
              </div>
            </div>
          </header>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-lg border transition-all duration-200 font-light tracking-wide ${
                selectedCategory === 'All'
                  ? 'bg-white/10 border-white/20 text-white'
                  : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
              }`}
            >
              All Interfaces
            </button>
            {categories.map((category) => {
              const Icon = getCategoryIcon(category);
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 font-light tracking-wide ${
                    selectedCategory === category
                      ? 'bg-white/10 border-white/20 text-white'
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category}</span>
                </button>
              );
            })}
          </div>

          {/* API Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAPIs.map((api) => {
              const Icon = getCategoryIcon(api.category);
              return (
                <div
                  key={api.id}
                  className="bg-white/5 border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all duration-200 group"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Icon className="w-6 h-6 text-white/60" />
                      <div>
                        <h3 className="text-lg font-light tracking-wide text-white group-hover:text-white transition-colors">
                          {api.name}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 rounded text-xs font-mono border ${getMethodColor(api.method)}`}>
                            {api.method}
                          </span>
                          <span className={`text-xs font-light ${getStatusColor(api.status)}`}>
                            {api.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Path */}
                  <div className="mb-4">
                    <code className="text-sm font-mono text-white/80 bg-black/30 px-3 py-2 rounded border border-white/10 block overflow-x-auto">
                      {api.path}
                    </code>
                  </div>

                  {/* Description */}
                  <p className="text-white/70 font-light text-sm leading-relaxed mb-4">
                    {api.description}
                  </p>

                  {/* Technical Details */}
                  <div className="space-y-2 text-xs text-white/60">
                    <div className="flex justify-between">
                      <span>Port:</span>
                      <span className="font-mono">{api.port}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Technology:</span>
                      <span className="font-mono text-right">{api.technology}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Security:</span>
                      <div className="flex space-x-2">
                        {api.authentication && (
                          <span className="text-green-400">Auth</span>
                        )}
                        {api.quantumResistant && (
                          <span className="text-purple-400">QR</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Documentation Link */}
                  {api.documentation && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <a
                        href={api.documentation}
                        className="inline-flex items-center space-x-2 text-white/60 hover:text-white transition-colors text-sm font-light"
                      >
                        <Code className="w-4 h-4" />
                        <span>Documentation</span>
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Philosophical Implementation Notes */}
          <div className="mt-16 p-6 border border-white/10 rounded-lg bg-white/5">
            <h2 className="text-2xl font-thin tracking-wide text-white mb-4">Experimental Philosophy in Code</h2>
            <p className="text-sm text-white/50 font-light italic mb-6">
              These interfaces represent early explorations into fundamental questions. They are prototypes of inquiry, not production systems.
            </p>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-white/70 font-light">
              <div>
                <h3 className="text-white mb-2 font-light">Post-Quantum Speculation</h3>
                <p className="leading-relaxed">
                  APIs marked "QR" implement theoretical post-quantum protocols—not because the quantum threat is imminent, 
                  but because preparing for uncertain futures is itself a philosophical practice.
                </p>
              </div>
              <div>
                <h3 className="text-white mb-2 font-light">Constitutional Constraints as Questions</h3>
                <p className="leading-relaxed">
                  Our constitutional intelligence endpoints don't just enforce rules—they explore what it means 
                  for artificial systems to embody principles, raising questions about agency and adherence.
                </p>
              </div>
              <div>
                <h3 className="text-white mb-2 font-light">Performance as Philosophy</h3>
                <p className="leading-relaxed">
                  Response times &lt; 100ms for most endpoints, because immediacy itself is a form of inquiry—
                  what happens when questions can be asked and answered at the speed of thought?
                </p>
              </div>
              <div>
                <h3 className="text-white mb-2 font-light">Scalable Uncertainty</h3>
                <p className="leading-relaxed">
                  Distributed architecture supports scaling not just computational load, but the capacity 
                  for philosophical exploration—can uncertainty itself be load-balanced?
                </p>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-8 flex justify-center">
            <div className="flex flex-wrap gap-6 text-xs text-white/60">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-green-400 rounded"></span>
                <span>Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-yellow-400 rounded"></span>
                <span>Development</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-400 font-mono">Auth</span>
                <span>Authentication Required</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-purple-400 font-mono">QR</span>
                <span>Quantum-Resistant</span>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
      
      <div className="fixed inset-0 bg-gradient-to-br from-black via-black to-gray-900 opacity-50 pointer-events-none" />
    </div>
  );
};

export default API;
