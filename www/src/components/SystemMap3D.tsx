import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Circle, Target, Hexagon, Triangle, Square, Diamond } from 'lucide-react';
import '../styles/SystemMap3D.css';

interface SystemNode {
  id: string;
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  layer: number;
  angle: number;
  connections: string[];
  description: string;
  status: 'active' | 'developing' | 'planned';
}

const systemNodes: SystemNode[] = [
  // Core layer (center)
  { id: 'aros', name: 'AROS Core', icon: Target, layer: 0, angle: 0, connections: ['adam', 'qeng', 'arc', 'research'], description: 'Artifact Research Operations System - Central orchestrator', status: 'active' },
  
  // Inner layer
  { id: 'adam', name: 'ADAM Protocol', icon: Circle, layer: 1, angle: 0, connections: ['arc', 'agents'], description: 'AI-embedded blockchain with constitutional governance', status: 'developing' },
  { id: 'qeng', name: 'Quantum Engine', icon: Hexagon, layer: 1, angle: 90, connections: ['qvm', 'optimization'], description: 'Quantum-classical hybrid processing core', status: 'active' },
  { id: 'arc', name: 'ARC Blockchain', icon: Triangle, layer: 1, angle: 180, connections: ['consensus', 'governance'], description: 'Artifact Runtime Chain with neural consensus', status: 'developing' },
  { id: 'research', name: 'Research Lab', icon: Square, layer: 1, angle: 270, connections: ['automation', 'analysis'], description: 'Autonomous research environment with paper generation', status: 'active' },
  
  // Outer layer
  { id: 'agents', name: 'Multi-Agent Systems', icon: Circle, layer: 2, angle: 30, connections: [], description: 'MAOS & ART autonomous agent orchestration', status: 'active' },
  { id: 'qvm', name: 'QVM Platform', icon: Hexagon, layer: 2, angle: 60, connections: [], description: 'Quantum Virtual Machine with Kubernetes deployment', status: 'active' },
  { id: 'optimization', name: 'Circuit Optimizer', icon: Diamond, layer: 2, angle: 120, connections: [], description: 'Advanced quantum circuit optimization algorithms', status: 'developing' },
  { id: 'consensus', name: 'Neural Consensus', icon: Circle, layer: 2, angle: 150, connections: [], description: '7-weight decision matrices with AI validation', status: 'developing' },
  { id: 'governance', name: 'Digital Sovereignty', icon: Triangle, layer: 2, angle: 210, connections: [], description: 'Constitutional AI framework for autonomous governance', status: 'planned' },
  { id: 'automation', name: 'Research Pipeline', icon: Square, layer: 2, angle: 240, connections: [], description: 'Automated research workflows with live data integration', status: 'active' },
  { id: 'analysis', name: 'Data Engine', icon: Hexagon, layer: 2, angle: 300, connections: [], description: 'Advanced analytics with vector search and RAG', status: 'active' },
  { id: 'enterprise', name: 'Enterprise Suite', icon: Diamond, layer: 2, angle: 330, connections: [], description: 'Business operations and organizational management', status: 'planned' },
];

const SystemMap3D = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const calculatePosition = useCallback((layer: number, angle: number, centerX: number, centerY: number) => {
    const radius = layer === 0 ? 0 : layer === 1 ? 120 : 200;
    const radian = (angle * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(radian),
      y: centerY + radius * Math.sin(radian),
    };
  }, []);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'active': return '#10b981'; // green
      case 'developing': return '#f59e0b'; // amber
      case 'planned': return '#6b7280'; // gray
      default: return '#6b7280';
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const svg = svgRef.current;
    if (svg) {
      observer.observe(svg);
    }

    return () => {
      if (svg) {
        observer.unobserve(svg);
      }
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;
    
    const svg = svgRef.current;
    if (!svg) return;

    // Animate connections first
    const connections = svg.querySelectorAll('.connection-line');
    connections.forEach((line, index) => {
      setTimeout(() => {
        line.classList.add('animate-draw');
      }, index * 150);
    });

    // Then animate nodes with staggered timing
    const nodes = svg.querySelectorAll('.system-node');
    nodes.forEach((node, index) => {
      setTimeout(() => {
        node.classList.add('animate-appear');
      }, index * 200 + 800);
    });
  }, [isVisible]);

  return (
    <section id="systemmap" className="py-12 sm:py-20 px-4 sm:px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
            Artifact Virtual Ecosystem
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
            Radial architecture showing the interconnected components of the Artifact Virtual research framework
          </p>
        </div>

        <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] flex items-center justify-center">
          <svg
            ref={svgRef}
            viewBox="0 0 800 600"
            className="w-full h-full max-w-4xl [filter:drop-shadow(0_0_20px_rgba(255,255,255,0.1))]"
          >
            <defs>
              <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
                <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Background concentric circles for layers */}
            <circle cx="400" cy="300" r="120" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="5,5" />
            <circle cx="400" cy="300" r="200" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3,3" />
            
            {/* Center glow */}
            <circle cx="400" cy="300" r="60" fill="url(#centerGlow)" />

            {/* Grid lines for radial structure */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
              <line
                key={angle}
                x1="400"
                y1="300"
                x2={400 + 200 * Math.cos((angle * Math.PI) / 180)}
                y2={300 + 200 * Math.sin((angle * Math.PI) / 180)}
                stroke="rgba(255,255,255,0.03)"
                strokeWidth="1"
              />
            ))}

            {/* Connections between nodes */}
            {systemNodes.map((node) => {
              const nodePos = calculatePosition(node.layer, node.angle, 400, 300);
              return node.connections.map((connectionId) => {
                const targetNode = systemNodes.find(n => n.id === connectionId);
                if (!targetNode) return null;
                const targetPos = calculatePosition(targetNode.layer, targetNode.angle, 400, 300);
                
                return (
                  <line
                    key={`${node.id}-${connectionId}`}
                    x1={nodePos.x}
                    y1={nodePos.y}
                    x2={targetPos.x}
                    y2={targetPos.y}
                    stroke="rgba(59, 130, 246, 0.4)"
                    strokeWidth="2"
                    className="connection-line opacity-0 transition-opacity duration-1000 [stroke-dasharray:8,4]"
                  />
                );
              });
            })}

            {/* System nodes */}
            {systemNodes.map((node, index) => {
              const { x, y } = calculatePosition(node.layer, node.angle, 400, 300);
              const Icon = node.icon;
              const isSelected = selectedNode === node.id;
              const isHovered = hoveredNode === node.id;
              const radius = node.layer === 0 ? 30 : 22;

              return (
                <g
                  key={node.id}
                  className={`system-node cursor-pointer transition-all duration-300 hover:scale-110 focus:scale-110 ${isSelected ? 'scale-125' : ''} ${isVisible ? 'opacity-100' : 'opacity-0'}`}
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
                  aria-label={`System node: ${node.name}. Status: ${node.status}. ${node.description}`}
                >
                  {/* Node background glow */}
                  {(isHovered || isSelected) && (
                    <circle
                      cx={x}
                      cy={y}
                      r={radius + 8}
                      fill={getStatusColor(node.status)}
                      fillOpacity="0.2"
                      filter="url(#glow)"
                    />
                  )}
                  
                  {/* Node background */}
                  <circle
                    cx={x}
                    cy={y}
                    r={radius}
                    fill="rgba(0,0,0,0.8)"
                    stroke={getStatusColor(node.status)}
                    strokeWidth="3"
                    className="backdrop-blur-sm"
                  />
                  
                  {/* Node icon */}
                  <foreignObject
                    x={x - 16}
                    y={y - 16}
                    width="32"
                    height="32"
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </foreignObject>

                  {/* Node label */}
                  <text
                    x={x}
                    y={y + radius + 18}
                    textAnchor="middle"
                    className={`fill-white text-sm font-medium text-${node.layer === 0 ? '14' : '12'} font-${node.layer === 0 ? 'semibold' : 'medium'}`}
                  >
                    {node.name}
                  </text>

                  {/* Status indicator */}
                  <circle
                    cx={x + radius - 6}
                    cy={y - radius + 6}
                    r="4"
                    fill={getStatusColor(node.status)}
                    className={node.status === 'active' ? 'animate-pulse' : ''}
                  />
                </g>
              );
            })}
          </svg>

          {/* Info panel */}
          {selectedNode && (
            <div className="absolute top-4 right-4 sm:right-4 left-4 sm:left-auto bg-black/95 backdrop-blur-md border border-white/30 rounded-lg p-4 sm:p-6 max-w-sm z-20 shadow-2xl animate-in slide-in-from-right-4 duration-300">
              {(() => {
                const node = systemNodes.find(n => n.id === selectedNode);
                if (!node) return null;
                const Icon = node.icon;
                return (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30">
                        <Icon className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg">{node.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div 
                            className={`w-2 h-2 rounded-full ${
                              node.status === 'active' ? 'bg-green-500' : 
                              node.status === 'developing' ? 'bg-amber-500' : 
                              'bg-gray-500'
                            }`}
                          />
                          <span className="text-xs text-gray-400 capitalize font-medium">{node.status}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">{node.description}</p>
                    {node.connections.length > 0 && (
                      <div className="border-t border-gray-700 pt-3">
                        <p className="text-xs text-gray-500 mb-2">Connected Systems:</p>
                        <div className="flex flex-wrap gap-1">
                          {node.connections.map(connId => {
                            const connNode = systemNodes.find(n => n.id === connId);
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
        </div>
      </div>
    </section>
  );
};

export default SystemMap3D;
