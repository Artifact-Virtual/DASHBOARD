import React, { useEffect, useRef, useState } from 'react';
import { Server, Brain, Database, Shield, Network, Zap, Globe, Building2, Users, Search, Code, Monitor, Layers } from 'lucide-react';

interface ArchNode {
  id: string;
  name: string;
  category: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description: string;
  connections: string[];
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

const architectureNodes: ArchNode[] = [
  // AROS Core Architecture
  { id: 'aros-core', name: 'AROS Core', category: 'Foundation', icon: Server, description: 'Central orchestration engine with mathematical precision tracking and agent coordination', connections: ['bootstrap', 'integration', 'agents'] },
  { id: 'bootstrap', name: 'Bootstrap Manager', category: 'Foundation', icon: Zap, description: '7-step automated initialization with self-healing and graceful degradation', connections: ['aros-core', 'ai-framework'] },
  { id: 'integration', name: 'Integration Layer', category: 'Foundation', icon: Network, description: 'Cross-system communication bridge with blog automation and enterprise workflows', connections: ['aros-core', 'enterprise'] },
  
  // AI & Research Systems
  { id: 'ai-framework', name: 'AI Framework', category: 'Intelligence', icon: Brain, description: 'Multi-provider AI management with auto-detection (Ollama, LM Studio, Generic)', connections: ['bootstrap', 'agents', 'research'] },
  { id: 'agents', name: 'Multi-Agent System', category: 'Intelligence', icon: Users, description: 'ART agents: WatcherAgent, ResearcherAgent, ReasonerAgent, ImplementerAgent, MemoryKeeper', connections: ['aros-core', 'ai-framework', 'research'] },
  { id: 'research', name: 'Research Pipeline', category: 'Research', icon: Search, description: 'Autonomous research with live internet integration, ArXiv, PubMed, Nature RSS feeds', connections: ['ai-framework', 'agents', 'data-engine'] },
  
  // Quantum & Processing
  { id: 'qeng', name: 'Quantum Engine', category: 'Processing', icon: Layers, description: 'QENG with Kubernetes orchestration, qubit simulation, and superposition states', connections: ['qvm', 'optimization'] },
  { id: 'qvm', name: 'QVM Platform', category: 'Processing', icon: Code, description: 'Quantum Virtual Machine with hardware abstraction, multi-language SDKs', connections: ['qeng', 'kubernetes'] },
  { id: 'optimization', name: 'Circuit Optimizer', category: 'Processing', icon: Monitor, description: 'Multi-level quantum circuit optimization with SWAP-based routing and gate synthesis', connections: ['qeng'] },
  
  // Infrastructure & Enterprise
  { id: 'kubernetes', name: 'K8s Orchestration', category: 'Infrastructure', icon: Globe, description: 'Container orchestration with custom resource definitions for quantum workloads', connections: ['qvm', 'monitoring'] },
  { id: 'monitoring', name: 'System Monitor', category: 'Infrastructure', icon: Monitor, description: 'Real-time metrics with Prometheus, Grafana, and comprehensive logging', connections: ['kubernetes', 'security'] },
  { id: 'security', name: 'Security Framework', category: 'Infrastructure', icon: Shield, description: 'AI-powered threat detection, RBAC, AES-256 encryption, and audit logging', connections: ['monitoring', 'data-engine'] },
  { id: 'data-engine', name: 'Data Engine', category: 'Data', icon: Database, description: 'Vector search, RAG, PostgreSQL, Redis caching, and analytics pipeline', connections: ['research', 'security', 'enterprise'] },
  { id: 'enterprise', name: 'Enterprise Suite', category: 'Business', icon: Building2, description: 'Business operations, finance, legal, and organizational management systems', connections: ['integration', 'data-engine'] },
];

const SystemArchitectureDiagram = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [, forceUpdate] = useState({});
  const nodesRef = useRef(architectureNodes.map(node => ({ ...node })));

  const getCategoryColor = (category: string) => {
    const colors = {
      'Foundation': '#ef4444',
      'Intelligence': '#3b82f6', 
      'Research': '#10b981',
      'Processing': '#8b5cf6',
      'Infrastructure': '#f59e0b',
      'Data': '#06b6d4',
      'Business': '#ec4899'
    };
    return colors[category as keyof typeof colors] || '#6b7280';
  };

  // Enhanced force-directed layout simulation
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isVisible) return;

    const width = container.clientWidth;
    const height = 600;
    const centerX = width / 2;
    const centerY = height / 2;
    const nodes = nodesRef.current;
    
    // Better initial positioning - arrange by category in clusters
    const categories = [...new Set(nodes.map(n => n.category))];
    const categoryAngles = categories.reduce((acc, cat, i) => {
      acc[cat] = (i / categories.length) * 2 * Math.PI;
      return acc;
    }, {} as Record<string, number>);

    nodes.forEach((node, i) => {
      if (!node.x || !node.y) {
        const angle = categoryAngles[node.category] + (Math.random() - 0.5) * 0.5;
        const radius = 100 + Math.random() * 60;
        node.x = centerX + Math.cos(angle) * radius;
        node.y = centerY + Math.sin(angle) * radius;
        node.vx = 0;
        node.vy = 0;
      }
    });

    let animationId: number;
    let iterations = 0;
    const maxIterations = 300;

    const simulate = () => {
      if (iterations >= maxIterations) return;
      
      const alpha = Math.max(0.001, 0.3 * (1 - iterations / maxIterations));
      
      // Apply forces
      for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i];
        if (!nodeA.x || !nodeA.y) continue;
        
        nodeA.vx = (nodeA.vx || 0) * 0.85; // Stronger damping
        nodeA.vy = (nodeA.vy || 0) * 0.85;

        // Gentle centering force
        const centerDx = centerX - nodeA.x;
        const centerDy = centerY - nodeA.y;
        const centerDist = Math.sqrt(centerDx * centerDx + centerDy * centerDy);
        if (centerDist > 200) {
          nodeA.vx += centerDx * 0.002 * alpha;
          nodeA.vy += centerDy * 0.002 * alpha;
        }

        // Node interactions
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeB = nodes[j];
          if (!nodeB.x || !nodeB.y) continue;
          
          const dx = nodeA.x - nodeB.x;
          const dy = nodeA.y - nodeB.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          
          // Stronger repulsion to prevent overlap
          if (distance < 120) {
            const force = (120 - distance) / distance * 0.1 * alpha;
            const fx = dx * force;
            const fy = dy * force;
            
            nodeA.vx += fx;
            nodeA.vy += fy;
            nodeB.vx -= fx;
            nodeB.vy -= fy;
          }

          // Connection attraction
          if (nodeA.connections.includes(nodeB.id)) {
            const optimalDistance = 100;
            if (distance > optimalDistance) {
              const force = (distance - optimalDistance) * 0.01 * alpha;
              const fx = (dx / distance) * force;
              const fy = (dy / distance) * force;
              
              nodeA.vx -= fx;
              nodeA.vy -= fy;
              nodeB.vx += fx;
              nodeB.vy += fy;
            }
          }
        }
      }

      // Update positions with better boundary handling
      nodes.forEach(node => {
        if (!node.x || !node.y) return;
        
        node.x += (node.vx || 0);
        node.y += (node.vy || 0);
        
        // Soft boundary constraints
        const margin = 60;
        if (node.x < margin) {
          node.x = margin;
          node.vx = Math.abs(node.vx || 0) * 0.5;
        } else if (node.x > width - margin) {
          node.x = width - margin;
          node.vx = -Math.abs(node.vx || 0) * 0.5;
        }
        
        if (node.y < margin) {
          node.y = margin;
          node.vy = Math.abs(node.vy || 0) * 0.5;
        } else if (node.y > height - margin) {
          node.y = height - margin;
          node.vy = -Math.abs(node.vy || 0) * 0.5;
        }
      });

      // Force re-render every few iterations
      if (iterations % 3 === 0) {
        forceUpdate({});
      }

      iterations++;
      if (iterations < maxIterations) {
        animationId = requestAnimationFrame(simulate);
      }
    };

    // Start simulation after a brief delay
    const startDelay = setTimeout(() => {
      animationId = requestAnimationFrame(simulate);
    }, 100);

    return () => {
      clearTimeout(startDelay);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isVisible]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const container = containerRef.current;
    if (container) {
      observer.observe(container);
    }

    return () => {
      if (container) {
        observer.unobserve(container);
      }
    };
  }, [isVisible]);

  return (
    <section className="py-12 sm:py-20 px-4 sm:px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
            System Design & Core Components
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
            Interactive force-directed architecture showing detailed component relationships and technical implementations
          </p>
        </div>

        <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
          <div 
            ref={containerRef}
            className="relative w-full h-full"
          >
            {/* Connection lines */}
            <svg className="absolute inset-0 w-full h-full">
              {nodesRef.current.map((node) =>
                node.connections.map((connectionId) => {
                  const targetNode = nodesRef.current.find(n => n.id === connectionId);
                  if (!targetNode || !node.x || !node.y || !targetNode.x || !targetNode.y) return null;
                  
                  return (
                    <line
                      key={`${node.id}-${connectionId}`}
                      x1={node.x}
                      y1={node.y}
                      x2={targetNode.x}
                      y2={targetNode.y}
                      stroke="rgba(59, 130, 246, 0.3)"
                      strokeWidth="2"
                      className="transition-all duration-300"
                    />
                  );
                })
              )}
            </svg>

            {/* Nodes */}
            {nodesRef.current.map((node) => {
              if (!node.x || !node.y) return null;
              
              const Icon = node.icon;
              const isSelected = selectedNode === node.id;
              const isHovered = hoveredNode === node.id;
              
              return (
                <div
                  key={node.id}
                  className={`absolute cursor-pointer transition-all duration-300 ${
                    isSelected ? 'scale-125 z-20' : isHovered ? 'scale-110 z-10' : ''
                  }`}
                  style={{
                    left: node.x - 30,
                    top: node.y - 30,
                    transform: 'translate(-50%, -50%)',
                  }}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedNode(selectedNode === node.id ? null : node.id);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`${node.category} component: ${node.name}. ${node.description}`}
                >
                  {/* Node circle */}
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center border-3 backdrop-blur-sm transition-all duration-300"
                    style={{
                      backgroundColor: `${getCategoryColor(node.category)}20`,
                      borderColor: getCategoryColor(node.category),
                      boxShadow: isSelected || isHovered ? `0 0 20px ${getCategoryColor(node.category)}` : 'none',
                    }}
                  >
                    <Icon 
                      className="w-8 h-8 text-white transition-colors duration-300"
                    />
                  </div>
                  
                  {/* Node label */}
                  <span 
                    className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 text-xs text-white font-medium whitespace-nowrap bg-black/80 px-2 py-1 rounded"
                    style={{ 
                      color: isHovered || isSelected ? getCategoryColor(node.category) : 'white' 
                    }}
                  >
                    {node.name}
                  </span>
                </div>
              );
            })}

            {/* Enhanced info panel */}
            {selectedNode && (
              <div className="absolute top-4 right-4 sm:right-4 left-4 sm:left-auto bg-black/95 backdrop-blur-md border border-white/30 rounded-lg p-4 sm:p-6 max-w-sm z-30 shadow-2xl animate-in slide-in-from-right-4 duration-300">
                {(() => {
                  const node = nodesRef.current.find(n => n.id === selectedNode);
                  if (!node) return null;
                  const Icon = node.icon;
                  return (
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div 
                          className="p-2 rounded-lg border"
                          style={{ 
                            backgroundColor: `${getCategoryColor(node.category)}20`,
                            borderColor: `${getCategoryColor(node.category)}30`
                          }}
                        >
                          <Icon 
                            className="w-6 h-6"
                            style={{ color: getCategoryColor(node.category) }}
                          />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold text-lg">{node.name}</h3>
                          <span 
                            className="text-xs font-medium px-2 py-1 rounded"
                            style={{ 
                              backgroundColor: `${getCategoryColor(node.category)}20`,
                              color: getCategoryColor(node.category)
                            }}
                          >
                            {node.category}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm mb-4 leading-relaxed">{node.description}</p>
                      {node.connections.length > 0 && (
                        <div className="border-t border-gray-700 pt-3">
                          <p className="text-xs text-gray-500 mb-2">Connected Components:</p>
                          <div className="flex flex-wrap gap-1">
                            {node.connections.map(connId => {
                              const connNode = nodesRef.current.find(n => n.id === connId);
                              return connNode ? (
                                <span key={connId} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                                  {connNode.name}
                                </span>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}
                      <button 
                        onClick={() => setSelectedNode(null)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 text-xs text-gray-400">
              <div className="flex flex-wrap gap-2">
                {Object.entries({
                  'Foundation': '#ef4444',
                  'Intelligence': '#3b82f6', 
                  'Research': '#10b981',
                  'Processing': '#8b5cf6',
                  'Infrastructure': '#f59e0b',
                  'Data': '#06b6d4',
                  'Business': '#ec4899'
                }).map(([category, color]) => (
                  <div key={category} className="flex items-center gap-1">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span>{category}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SystemArchitectureDiagram;
