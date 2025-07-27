
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Brain, GitBranch, Lock, Network, Atom, Zap, Layers } from 'lucide-react';
import Navigation from '../components/Navigation';
import PatternLines from '../components/PatternLines';
import Footer from '../components/Footer';

// Research Categories with technical depth
const researchCategories = [
  {
    id: 'constitutional-intelligence',
    title: 'Constitutional Intelligence',
    icon: Brain,
    color: 'border-purple-500/30 bg-purple-500/10',
    description: 'Self-governance and adaptive evolution in virtual ecosystems',
    articleCount: 6
  },
  {
    id: 'arc-blockchain',
    title: 'The Arc Architecture',
    icon: Network,
    color: 'border-blue-500/30 bg-blue-500/10',
    description: 'Layer 1 blockchain with conscious architecture and MetaBlock system',
    articleCount: 4
  },
  {
    id: 'adam-protocol',
    title: 'ADAM Protocol',
    icon: GitBranch,
    color: 'border-green-500/30 bg-green-500/10',
    description: 'Constitutional intelligence module with Rust+WASM execution',
    articleCount: 3
  },
  {
    id: 'quantum-virtual-machine',
    title: 'Quantum Virtual Machine',
    icon: Atom,
    color: 'border-cyan-500/30 bg-cyan-500/10',
    description: 'High-fidelity quantum simulation with lattice-clock timing',
    articleCount: 4
  },
  {
    id: 'fuel-economics',
    title: 'FUEL Economics',
    icon: Zap,
    color: 'border-yellow-500/30 bg-yellow-500/10',
    description: 'Economic substrate for digital civilizations and AI symbiosis',
    articleCount: 3
  },
  {
    id: 'security-resilience',
    title: 'Security & Resilience',
    icon: Lock,
    color: 'border-red-500/30 bg-red-500/10',
    description: 'Quantum-resistant cryptography and multi-layered defense',
    articleCount: 4
  }
];

// Sample of detailed research articles with technical diagrams
const researchArticles = {
  'constitutional-intelligence': [
    {
      id: 'ci-paradigm-shift',
      title: 'Constitutional Intelligence: The Paradigm Shift',
      authors: ['Artifact Virtual Research Team'],
      date: '2025-06-27',
      readTime: '12 min',
      abstract: 'Breaking free from centralized control through decentralized, constitutional AI that achieves true self-governance and adaptive evolution.',
      tags: ['Theory', 'Governance', 'Decentralization'],
      diagramType: 'paradigm-comparison'
    },
    {
      id: 'conscious-blockchain-architecture',
      title: 'Conscious Blockchain Architecture: Four-Layer Framework',
      authors: ['Artifact Virtual Research Team'],
      date: '2025-06-26',
      readTime: '15 min',
      abstract: 'Deep dive into the Constitutional Substrate, Memory & Learning, Perception & Awareness, and Action & Execution layers.',
      tags: ['Architecture', 'Consciousness', 'Blockchain'],
      diagramType: 'consciousness-layers'
    },
    {
      id: 'decentralized-intelligence-theory',
      title: 'Theory of Decentralized Intelligence (TDI)',
      authors: ['Artifact Virtual Research Team'],
      date: '2025-06-25',
      readTime: '18 min',
      abstract: 'Mathematical and algorithmic foundations for distributed cognition, stigmergic coordination, and emergent properties.',
      tags: ['Theory', 'AI', 'Mathematics'],
      diagramType: 'tdi-framework'
    },
    {
      id: 'self-modifying-logic',
      title: 'Self-Modifying Constitutional Logic',
      authors: ['Artifact Virtual Research Team'],
      date: '2025-06-24',
      readTime: '14 min',
      abstract: 'Mechanisms for adaptive evolution through outcome-based rule evolution and democratic feedback systems.',
      tags: ['Logic', 'Evolution', 'Democracy'],
      diagramType: 'rule-evolution'
    },
    {
      id: 'digital-sovereignty',
      title: 'Digital Sovereignty in Constitutional Intelligence',
      authors: ['Artifact Virtual Research Team'],
      date: '2025-06-23',
      readTime: '11 min',
      abstract: 'Ensuring control over digital infrastructure, technology, and data without external dependencies.',
      tags: ['Sovereignty', 'Security', 'Policy'],
      diagramType: 'sovereignty-layers'
    },
    {
      id: 'bioethics-principles',
      title: 'Bioethics Principles in AI Self-Governance',
      authors: ['Artifact Virtual Research Team'],
      date: '2025-06-22',
      readTime: '13 min',
      abstract: 'Embedding autonomy, beneficence, nonmaleficence, and justice into AI operational logic.',
      tags: ['Ethics', 'Bioethics', 'Governance'],
      diagramType: 'ethics-framework'
    }
  ],
  'arc-blockchain': [
    {
      id: 'arc-layer1-architecture',
      title: 'The Arc: Layer 1 Blockchain Architecture',
      authors: ['Artifact Virtual Research Team'],
      date: '2025-06-27',
      readTime: '16 min',
      abstract: 'Purpose-built Layer 1 blockchain with Rust-based AVM, gas-free transactions, and Constitutional Proof of Stake.',
      tags: ['Blockchain', 'Layer1', 'Rust'],
      diagramType: 'arc-architecture'
    },
    {
      id: 'metablock-system',
      title: 'MetaBlock System: Dynamic Data Units',
      authors: ['Artifact Virtual Research Team'],
      date: '2025-06-26',
      readTime: '14 min',
      abstract: 'Revolutionary data structure encapsulating constitutional rules, evolutionary metrics, and learning model states.',
      tags: ['MetaBlock', 'Data', 'Evolution'],
      diagramType: 'metablock-structure'
    },
    {
      id: 'constitutional-pos',
      title: 'Constitutional Proof of Stake Consensus',
      authors: ['Artifact Virtual Research Team'],
      date: '2025-06-25',
      readTime: '12 min',
      abstract: 'Hybrid consensus combining PoS with compliance scoring and constitutional adherence mechanisms.',
      tags: ['Consensus', 'PoS', 'Constitutional'],
      diagramType: 'cpos-mechanism'
    },
    {
      id: 'blockchain-virtualization',
      title: 'Blockchain-Native Virtualization',
      authors: ['Artifact Virtual Research Team'],
      date: '2025-06-24',
      readTime: '13 min',
      abstract: 'Decentralized Virtual Machines (DVMs) with secure multi-tenancy and WASM module integration.',
      tags: ['Virtualization', 'DVM', 'Security'],
      diagramType: 'dvm-architecture'
    }
  ],
  'adam-protocol': [
    {
      id: 'adam-constitutional-intelligence',
      title: 'ADAM Protocol: Constitutional Intelligence Module',
      authors: ['Artifact Virtual Research Team'],
      date: '2025-06-27',
      readTime: '17 min',
      abstract: 'Turing-complete governance programs with Rust+WebAssembly execution and multi-signature validation.',
      tags: ['ADAM', 'Intelligence', 'Rust'],
      diagramType: 'adam-architecture'
    },
    {
      id: 'turing-complete-governance',
      title: 'Turing-Complete Governance Programs',
      authors: ['Artifact Virtual Research Team'],
      date: '2025-06-26',
      readTime: '15 min',
      abstract: 'Arbitrarily programmable governance enabling dynamic reconfiguration and AI-driven optimization.',
      tags: ['Governance', 'Turing', 'Programming'],
      diagramType: 'governance-flow'
    },
    {
      id: 'wasm-sandboxing',
      title: 'WebAssembly Secure Sandboxing',
      authors: ['Artifact Virtual Research Team'],
      date: '2025-06-25',
      readTime: '11 min',
      abstract: 'Secure execution environment for constitutional logic with quantum-resistant failsafes.',
      tags: ['WebAssembly', 'Security', 'Sandboxing'],
      diagramType: 'wasm-security'
    }
  ],
  'quantum-virtual-machine': [
    {
      id: 'qvm-architecture',
      title: 'Quantum Virtual Machine Architecture',
      authors: ['Artifact Virtual Research Team'],
      date: '2025-06-27',
      readTime: '19 min',
      abstract: 'High-fidelity quantum simulation on classical hardware with lattice-clock timing and noise models.',
      tags: ['Quantum', 'Simulation', 'Architecture'],
      diagramType: 'qvm-system'
    },
    {
      id: 'quantum-classical-hybrid',
      title: 'Quantum-Classical Hybrid Execution',
      authors: ['Artifact Virtual Research Team'],
      date: '2025-06-26',
      readTime: '16 min',
      abstract: 'Seamless integration of quantum algorithms with classical AI for optimization and cryptographic tasks.',
      tags: ['Hybrid', 'Quantum', 'Classical'],
      diagramType: 'hybrid-execution'
    },
    {
      id: 'tensor-networks',
      title: 'Tensor Network Methods in QVM',
      authors: ['Artifact Virtual Research Team'],
      date: '2025-06-25',
      readTime: '14 min',
      abstract: 'Advanced tensor network approaches for efficient quantum state representation and Hamiltonian dynamics.',
      tags: ['Tensor', 'Networks', 'Quantum'],
      diagramType: 'tensor-networks'
    },
    {
      id: 'quantum-noise-modeling',
      title: 'Quantum Noise Models and Fidelity',
      authors: ['Artifact Virtual Research Team'],
      date: '2025-06-24',
      readTime: '12 min',
      abstract: 'Comprehensive noise modeling for realistic quantum simulations and error correction protocols.',
      tags: ['Noise', 'Fidelity', 'Error'],
      diagramType: 'noise-models'
    }
  ],
  'fuel-economics': [
    {
      id: 'fuel-economic-substrate',
      title: 'FUEL: Economic Substrate for Digital Civilizations',
      authors: ['Artifact Virtual Research Team'],
      date: '2025-06-27',
      readTime: '15 min',
      abstract: 'AI-driven meta-governance for planetary-scale civilizational coordination and resource allocation.',
      tags: ['Economics', 'AI', 'Governance'],
      diagramType: 'fuel-economics'
    },
    {
      id: 'ai-symbiosis-economics',
      title: 'AI Symbiosis Economics',
      authors: ['Artifact Virtual Research Team'],
      date: '2025-06-26',
      readTime: '13 min',
      abstract: 'Dynamic economic parameters evolved through AI-driven meta-governance and autonomous agents.',
      tags: ['Symbiosis', 'AI', 'Economics'],
      diagramType: 'symbiosis-model'
    },
    {
      id: 'planetary-coordination',
      title: 'Planetary-Scale Coordination Mechanisms',
      authors: ['Artifact Virtual Research Team'],
      date: '2025-06-25',
      readTime: '17 min',
      abstract: 'Scalable coordination protocols for global digital civilization resource management.',
      tags: ['Coordination', 'Scale', 'Planetary'],
      diagramType: 'coordination-networks'
    }
  ],
  'security-resilience': [
    {
      id: 'quantum-resistant-security',
      title: 'Quantum-Resistant Security Framework',
      authors: ['Artifact Virtual Research Team'],
      date: '2025-06-27',
      readTime: '18 min',
      abstract: 'Post-quantum cryptography, adaptive security levels, and emergency quantum protocols.',
      tags: ['Security', 'Quantum', 'Cryptography'],
      diagramType: 'quantum-security'
    },
    {
      id: 'multi-signature-governance',
      title: 'Advanced Multi-Signature Governance',
      authors: ['Artifact Virtual Research Team'],
      date: '2025-06-26',
      readTime: '14 min',
      abstract: 'Role-based access control, time-locked conditions, and dynamic key rotation for constitutional operations.',
      tags: ['MultiSig', 'Governance', 'Security'],
      diagramType: 'multisig-architecture'
    },
    {
      id: 'circuit-breakers-failsafes',
      title: 'Circuit Breakers and Constitutional Failsafes',
      authors: ['Artifact Virtual Research Team'],
      date: '2025-06-25',
      readTime: '12 min',
      abstract: 'Immutable smart contracts for emergency protocol activation and anomaly response.',
      tags: ['Failsafes', 'Emergency', 'Protocol'],
      diagramType: 'failsafe-system'
    },
    {
      id: 'threat-monitoring',
      title: 'AI-Driven Threat Monitoring and Response',
      authors: ['Artifact Virtual Research Team'],
      date: '2025-06-24',
      readTime: '16 min',
      abstract: 'Real-time anomaly detection, intrusion response, and adaptive security protocols.',
      tags: ['Monitoring', 'AI', 'Response'],
      diagramType: 'threat-monitoring'
    }
  ]
};

const Research = () => {
  const [selectedCategory, setSelectedCategory] = useState('constitutional-intelligence');
  const navigate = useNavigate();

  const currentArticles = researchArticles[selectedCategory] || [];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-precision">
      <PatternLines />
      <div className="relative z-10">
        <Navigation />
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-7xl font-light text-white mb-6">
              The Odyssey
              <span className="block font-thin text-white/60">Questions Unfolding</span>
            </h1>
            <p className="text-xl text-white/70 max-w-4xl mx-auto mb-8">
              Each exploration poses deeper questions about the nature of consciousness, governance, and intelligence—
              <br />leading us toward understanding what artificial sentience might truly become.
            </p>
            <div className="text-sm text-white/40 italic max-w-2xl mx-auto">
              These are early philosophical investigations and theoretical frameworks.
              Each question leads to new territories of inquiry.
            </div>
          </div>
        </section>
        {/* Category Selection */}
        <section className="relative py-16 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
              {researchCategories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`group p-8 border transition-all duration-300 cursor-pointer ${
                    selectedCategory === category.id
                      ? category.color + ' scale-105'
                      : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-start gap-6 mb-6">
                    <div className="w-16 h-16 border border-white/20 flex items-center justify-center">
                      <category.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-light text-white mb-2">{category.title}</h3>
                      <p className="text-white/60 text-sm mb-3">{category.description}</p>
                      <div className="text-white/40 text-xs">
                        {category.articleCount} Research Articles
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Selected Category Articles */}
            <div className="border-t border-white/10 pt-16">
              <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 border border-white/20 flex items-center justify-center">
                  {(() => {
                    const category = researchCategories.find(c => c.id === selectedCategory);
                    if (category) {
                      const IconComponent = category.icon;
                      return <IconComponent className="w-6 h-6 text-white" />;
                    }
                    return null;
                  })()}
                </div>
                <div>
                  <h2 className="text-3xl font-light text-white">
                    {researchCategories.find(c => c.id === selectedCategory)?.title}
                  </h2>
                  <p className="text-white/60">
                    {researchCategories.find(c => c.id === selectedCategory)?.description}
                  </p>
                </div>
              </div>
              <div className="grid lg:grid-cols-2 gap-8">
                {currentArticles.map((article) => (
                  <div
                    key={article.id}
                    className="group p-8 border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-300 cursor-pointer"
                    onClick={() => navigate(`/research/${article.id}`)}
                  >
                    <div className="mb-6">
                      <h3 className="text-xl font-light text-white mb-3 group-hover:text-white transition-colors">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-white/40 mb-4">
                        <span>{article.date}</span>
                        <span>•</span>
                        <span>{article.readTime}</span>
                        <span>•</span>
                        <span>{article.authors.join(', ')}</span>
                      </div>
                      <p className="text-white/70 leading-relaxed mb-4">
                        {article.abstract}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.tags.map((tag) => (
                          <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 text-white/60 text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2 text-white/60 text-sm">
                        <Layers className="w-4 h-4" />
                        <span>Technical Diagrams</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
};

export default Research;
