import { Activity, Code, Database, Play, Terminal } from 'lucide-react';
import { useState } from 'react';

const apiEndpoints = [
  {
    method: 'GET',
    endpoint: '/api/arc/constitution',
    description: 'What does a constitutional state mean for artificial systems?',
    response: '{"block": 7, "validation": "circular", "consensus": "cpos"}'
  },
  {
    method: 'POST', 
    endpoint: '/api/adam/execute',
    description: 'Can intelligence truly embody constitutional principles?',
    response: '{"taskId": "uuid", "layer": "perception", "status": "exploring"}'
  },
  {
    method: 'GET',
    endpoint: '/api/qvm/quantum-state',
    description: 'What happens when we simulate the quantum realm classically?',
    response: '{"qubits": 32, "fidelity": 0.998, "noise_model": "philosophical"}'
  },
  {
    method: 'POST',
    endpoint: '/api/fuel/governance',
    description: 'What if economics could be truly self-governing?',
    response: '{"proposal": "active", "symbiosis": true, "coordination": "emergent"}'
  }
];

const InteractiveDemo = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecute = () => {
    setIsExecuting(true);
    setTimeout(() => setIsExecuting(false), 2000);
  };

  return (
    <section className="relative py-32 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-light text-white mb-6">
            The Inquiry Interface: Questions in Real-Time
          </h2>
          <p className="text-xl text-white/60 max-w-3xl mx-auto">
            Each endpoint embodies a philosophical question made queryable—where abstract inquiries about consciousness, 
            governance, and reality become interactive explorations.
            <span className="block mt-2 text-white/40">
              Experimental • Early Development • Open Inquiry
            </span>
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* API Endpoints List */}
          <div className="space-y-4">
            <h3 className="text-2xl font-light text-white mb-6 flex items-center gap-3">
              <Database className="w-6 h-6" />
              Questions Made Queryable
            </h3>
            
            {apiEndpoints.map((endpoint, index) => (
              <div
                key={index}
                onClick={() => setSelectedEndpoint(index)}
                className={`p-4 border transition-all duration-300 cursor-pointer ${
                  selectedEndpoint === index
                    ? 'border-white/30 bg-white/5'
                    : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2 py-1 text-xs font-mono-slim ${
                    endpoint.method === 'GET' ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300'
                  }`}>
                    {endpoint.method}
                  </span>
                  <code className="text-white/90 font-mono-slim text-sm">
                    {endpoint.endpoint}
                  </code>
                </div>
                <p className="text-white/60 text-sm">
                  {endpoint.description}
                </p>
              </div>
            ))}
          </div>

          {/* Interactive Terminal */}
          <div className="space-y-6">
            <h3 className="text-2xl font-light text-white mb-6 flex items-center gap-3">
              <Terminal className="w-6 h-6" />
              Live Philosophical Exploration
            </h3>
            
            <div className="bg-black/50 border border-white/10 rounded-none">
              {/* Terminal Header */}
              <div className="border-b border-white/10 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
                  </div>
                  <span className="text-white/60 text-sm font-mono-slim">
                    artifact-virtual-inquiry
                  </span>
                </div>
                <Activity className="w-4 h-4 text-white/40" />
              </div>
              
              {/* Terminal Content */}
              <div className="p-4 font-mono-slim text-sm space-y-3">
                <div className="text-white/60">
                  $ curl -X {apiEndpoints[selectedEndpoint].method} \\
                </div>
                <div className="text-white/60 ml-4">
                  https://api.artifact-virtual.com{apiEndpoints[selectedEndpoint].endpoint}
                </div>
                
                {isExecuting ? (
                  <div className="text-yellow-400 animate-pulse">
                    → Philosophical exploration in progress...
                  </div>
                ) : (
                  <div className="text-green-400">
                    → {apiEndpoints[selectedEndpoint].response}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleExecute}
              disabled={isExecuting}
              className="group flex items-center gap-3 bg-white/5 border border-white/20 text-white px-6 py-3 hover:bg-white/10 hover:border-white/30 transition-all duration-300 disabled:opacity-50"
            >
              <Play className={`w-4 h-4 ${isExecuting ? 'animate-spin' : 'group-hover:scale-110'} transition-transform duration-300`} />
              {isExecuting ? 'Exploring...' : 'Execute Philosophical Query'}
            </button>

            {/* Performance Indicator */}
            <div className="flex items-center gap-4 text-sm text-white/40 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Inquiry Network Online</span>
              </div>
              <div>Status: Experimental</div>
              <div>Exploration: Open-ended</div>
            </div>
          </div>
        </div>

        {/* Code Examples */}
        <div className="mt-20 border-t border-white/10 pt-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-light text-white mb-4 flex items-center justify-center gap-3">
              <Code className="w-6 h-6" />
              Philosophical Code Examples
            </h3>
            <p className="text-white/60">
              Early explorations in code—prototypes for inquiry, not production systems
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-black/30 border border-white/10 p-6">
              <h4 className="text-white font-mono-slim text-sm mb-3">Python + ADAM (Experimental)</h4>
              <pre className="text-xs text-white/70 font-mono-slim overflow-x-auto">
{`from artifact_virtual import ADAMClient

# What if intelligence could be constitutional?
adam = ADAMClient()
result = adam.philosophical_query(
  question="consciousness",
  layer="perception"
)
print(result.exploration)`}
              </pre>
            </div>

            <div className="bg-black/30 border border-white/10 p-6">
              <h4 className="text-white font-mono-slim text-sm mb-3">Rust + Arc (Prototype)</h4>
              <pre className="text-xs text-white/70 font-mono-slim overflow-x-auto">
{`use artifact_virtual::Arc;

// Exploring constitutional emergence
let arc = Arc::connect().await?;
let inquiry = arc
  .explore_constitution()
  .await?;
println!("{:?}", inquiry.mystery);`}
              </pre>
            </div>

            <div className="bg-black/30 border border-white/10 p-6">
              <h4 className="text-white font-mono-slim text-sm mb-3">QVM Exploration (Early Stage)</h4>
              <pre className="text-xs text-white/70 font-mono-slim overflow-x-auto">
{`# What if quantum simulation could reveal 
# classical assumptions about reality?
curl -H "Content-Type: application/json" \\
  -X POST \\
  -d '{"qubits": 32, "inquiry": "superposition"}' \\
  https://inquiry.artifact-virtual.com/api/qvm/explore`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDemo;
