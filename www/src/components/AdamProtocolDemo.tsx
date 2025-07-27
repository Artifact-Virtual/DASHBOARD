import React, { useRef, useState, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html, Sphere, Trail, Float, Line, Tube } from '@react-three/drei';
import * as THREE from 'three';

interface FuelNode {
  id: string;
  position: THREE.Vector3;
  type: 'genesis' | 'contract' | 'memory_bank' | 'decision_core' | 'consensus_chamber';
  fuelLevel: number;
  throughput: number;
  connections: string[];
  isProcessing: boolean;
  constitutionalWeight: number;
}

interface FuelFlow {
  id: string;
  fromNode: string;
  toNode: string;
  fuelType: 'cognitive' | 'memory' | 'incentive' | 'constitutional';
  flowRate: number;
  currentPosition: number; // 0 to 1 along the path
  payload: number; // amount of FUEL being carried
}

// Constitutional Memory Bank - where FUEL enforces persistent memory
const MemoryBank: React.FC<{ node: FuelNode; onClick: () => void }> = ({ node, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Pulsing based on fuel level and constitutional weight
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 1;
      const scale = (0.8 + node.fuelLevel * 0.4) * pulse;
      meshRef.current.scale.setScalar(scale);
      
      // Glow intensity based on processing
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = node.isProcessing ? 0.5 : 0.2;
    }
  });

  return (
    <group position={node.position} onClick={onClick}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[1.2]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#004422"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Memory crystals floating around */}
      {Array.from({ length: Math.floor(node.fuelLevel * 8) }).map((_, i) => (
        <Float key={i} speed={1 + i * 0.1} rotationIntensity={0.3}>
          <mesh position={[
            Math.cos(i * 0.8) * 2,
            Math.sin(i * 0.5) * 1.5,
            Math.sin(i * 0.8) * 2
          ]}>
            <tetrahedronGeometry args={[0.1]} />
            <meshBasicMaterial color="#88ffaa" transparent opacity={0.7} />
          </mesh>
        </Float>
      ))}
      
      <Html distanceFactor={15} position={[0, -2, 0]}>
        <div className="bg-black/90 text-green-400 px-2 py-1 rounded text-xs font-precision border border-green-400">
          MEMORY CORE
          <br />
          <span className="text-xs">Load: {(node.fuelLevel * 100).toFixed(0)}%</span>
        </div>
      </Html>
    </group>
  );
};

// Decision Core - where moral anxiety and constitutional reasoning happens
const DecisionCore: React.FC<{ node: FuelNode; onClick: () => void }> = ({ node, onClick }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [moralAnxiety, setMoralAnxiety] = useState(0);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Simulate moral anxiety - rapid decision-making cycles
      const anxiety = Math.sin(state.clock.elapsedTime * 8) * 0.5 + 0.5;
      setMoralAnxiety(anxiety);
      
      // Rotation based on processing intensity
      groupRef.current.rotation.y += node.isProcessing ? 0.02 : 0.005;
      
      // Scale fluctuation during decision-making
      if (node.isProcessing) {
        const fluctuation = Math.sin(state.clock.elapsedTime * 15) * 0.1 + 1;
        groupRef.current.scale.setScalar(fluctuation);
      }
    }
  });

  return (
    <group ref={groupRef} position={node.position} onClick={onClick}>
      {/* Central decision sphere */}
      <mesh>
        <sphereGeometry args={[0.8]} />
        <meshStandardMaterial
          color={node.isProcessing ? "#ff4444" : "#4444ff"}
          emissive={node.isProcessing ? "#441111" : "#111144"}
          emissiveIntensity={moralAnxiety * 0.5}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      
      {/* Decision pathway rings */}
      {[1.2, 1.6, 2.0].map((radius, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, i * Math.PI / 3]}>
          <torusGeometry args={[radius, 0.05, 8, 32]} />
          <meshBasicMaterial 
            color="#ffaa00" 
            transparent 
            opacity={node.constitutionalWeight * 0.6} 
          />
        </mesh>
      ))}
      
      <Html distanceFactor={15} position={[0, -1.5, 0]}>
        <div className="bg-black/90 text-yellow-400 px-2 py-1 rounded text-xs font-precision border border-yellow-400">
          REASONING ENGINE
          <br />
          <span className="text-xs">Anxiety: {(moralAnxiety * 100).toFixed(0)}%</span>
        </div>
      </Html>
    </group>
  );
};

// Consensus Chamber - where collective intelligence emerges
const ConsensusCore: React.FC<{ node: FuelNode; onClick: () => void }> = ({ node, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Complex rotation patterns representing consensus formation
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  return (
    <group position={node.position} onClick={onClick}>
      <mesh ref={meshRef}>
        <dodecahedronGeometry args={[1]} />
        <meshStandardMaterial
          color="#aa00ff"
          emissive="#220044"
          metalness={0.7}
          roughness={0.3}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Consensus field visualization */}
      <mesh>
        <sphereGeometry args={[2, 8, 6]} />
        <meshBasicMaterial
          color="#aa00ff"
          transparent
          opacity={0.1}
          wireframe
        />
      </mesh>
      
      <Html distanceFactor={15} position={[0, -1.8, 0]}>
        <div className="bg-black/90 text-purple-400 px-2 py-1 rounded text-xs font-precision border border-purple-400">
          CONSENSUS HUB
          <br />
          <span className="text-xs">Authority: {(node.constitutionalWeight * 100).toFixed(0)}%</span>
        </div>
      </Html>
    </group>
  );
};

// FUEL Flow Visualization - actual metabolic pathways
const FuelFlowPath: React.FC<{ flow: FuelFlow; nodes: Map<string, FuelNode> }> = ({ flow, nodes }) => {
  const fromNode = nodes.get(flow.fromNode);
  const toNode = nodes.get(flow.toNode);
  
  if (!fromNode || !toNode) return null;
  
  const pathRef = useRef<THREE.Group>(null);
  
  // Create curved path between nodes
  const curve = useMemo(() => {
    const start = fromNode.position;
    const end = toNode.position;
    const midPoint = start.clone().add(end).multiplyScalar(0.5);
    midPoint.y += 2; // Create arc
    
    return new THREE.QuadraticBezierCurve3(start, midPoint, end);
  }, [fromNode.position, toNode.position]);
  
  const points = curve.getPoints(50);
  
  useFrame((state) => {
    if (pathRef.current) {
      // Animate flow position
      flow.currentPosition += flow.flowRate * 0.01;
      if (flow.currentPosition > 1) {
        flow.currentPosition = 0;
        // Deliver FUEL payload
        toNode.fuelLevel = Math.min(1, toNode.fuelLevel + flow.payload * 0.1);
      }
    }
  });
  
  const getFlowColor = (type: string) => {
    const colors = {
      cognitive: '#00ffff',
      memory: '#00ff88',
      incentive: '#ffff00',
      constitutional: '#ff00ff'
    };
    return colors[type as keyof typeof colors] || '#ffffff';
  };
  
  return (
    <group ref={pathRef}>
      {/* Flow path */}
      <Line
        points={points}
        color={getFlowColor(flow.fuelType)}
        lineWidth={2}
        transparent
        opacity={0.6}
      />
      
      {/* Moving FUEL packet */}
      <mesh position={curve.getPoint(flow.currentPosition)}>
        <sphereGeometry args={[0.1]} />
        <meshBasicMaterial 
          color={getFlowColor(flow.fuelType)}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Flow direction indicators */}
      {points.filter((_, i) => i % 10 === 0).map((point, i) => (
        <mesh key={i} position={point}>
          <coneGeometry args={[0.02, 0.1]} />
          <meshBasicMaterial 
            color={getFlowColor(flow.fuelType)}
            transparent
            opacity={0.4}
          />
        </mesh>
      ))}
    </group>
  );
};

// Enhanced Metabolic FUEL Network
const MetabolicNetwork: React.FC<{ 
  intensity: number; 
  onNodeClick: (node: FuelNode) => void;
  selectedNode: FuelNode | null;
}> = ({ intensity, onNodeClick, selectedNode }) => {
  const [nodes] = useState(() => {
    const nodeMap = new Map<string, FuelNode>();
    
    // Genesis cores - source of constitutional authority
    nodeMap.set('genesis1', {
      id: 'genesis1',
      position: new THREE.Vector3(-8, 0, -8),
      type: 'genesis',
      fuelLevel: 1.0,
      throughput: 0.8,
      connections: ['memory1', 'decision1'],
      isProcessing: true,
      constitutionalWeight: 1.0
    });
    
    nodeMap.set('genesis2', {
      id: 'genesis2',
      position: new THREE.Vector3(8, 0, -8),
      type: 'genesis',
      fuelLevel: 1.0,
      throughput: 0.8,
      connections: ['memory2', 'decision2'],
      isProcessing: true,
      constitutionalWeight: 1.0
    });
    
    // Memory banks - constitutional persistence
    nodeMap.set('memory1', {
      id: 'memory1',
      position: new THREE.Vector3(-12, 3, 0),
      type: 'memory_bank',
      fuelLevel: 0.7,
      throughput: 0.6,
      connections: ['decision1', 'consensus1'],
      isProcessing: false,
      constitutionalWeight: 0.9
    });
    
    nodeMap.set('memory2', {
      id: 'memory2',
      position: new THREE.Vector3(12, 3, 0),
      type: 'memory_bank',
      fuelLevel: 0.8,
      throughput: 0.6,
      connections: ['decision2', 'consensus1'],
      isProcessing: false,
      constitutionalWeight: 0.9
    });
    
    // Decision cores - moral reasoning
    nodeMap.set('decision1', {
      id: 'decision1',
      position: new THREE.Vector3(-6, -3, 6),
      type: 'decision_core',
      fuelLevel: 0.5,
      throughput: 0.9,
      connections: ['consensus1'],
      isProcessing: true,
      constitutionalWeight: 0.85
    });
    
    nodeMap.set('decision2', {
      id: 'decision2',
      position: new THREE.Vector3(6, -3, 6),
      type: 'decision_core',
      fuelLevel: 0.6,
      throughput: 0.9,
      connections: ['consensus1'],
      isProcessing: true,
      constitutionalWeight: 0.88
    });
    
    // Consensus chamber - collective intelligence
    nodeMap.set('consensus1', {
      id: 'consensus1',
      position: new THREE.Vector3(0, 4, 8),
      type: 'consensus_chamber',
      fuelLevel: 0.9,
      throughput: 1.0,
      connections: ['genesis1', 'genesis2'],
      isProcessing: false,
      constitutionalWeight: 0.95
    });
    
    return nodeMap;
  });
  
  const [flows] = useState<FuelFlow[]>([
    // Constitutional flows from genesis
    {
      id: 'flow1',
      fromNode: 'genesis1',
      toNode: 'memory1',
      fuelType: 'constitutional',
      flowRate: 2,
      currentPosition: 0,
      payload: 0.3
    },
    {
      id: 'flow2',
      fromNode: 'genesis2',
      toNode: 'memory2',
      fuelType: 'constitutional',
      flowRate: 2,
      currentPosition: 0.3,
      payload: 0.3
    },
    // Memory to decision flows
    {
      id: 'flow3',
      fromNode: 'memory1',
      toNode: 'decision1',
      fuelType: 'memory',
      flowRate: 3,
      currentPosition: 0,
      payload: 0.2
    },
    {
      id: 'flow4',
      fromNode: 'memory2',
      toNode: 'decision2',
      fuelType: 'memory',
      flowRate: 3,
      currentPosition: 0.5,
      payload: 0.2
    },
    // Decision to consensus flows
    {
      id: 'flow5',
      fromNode: 'decision1',
      toNode: 'consensus1',
      fuelType: 'cognitive',
      flowRate: 4,
      currentPosition: 0,
      payload: 0.4
    },
    {
      id: 'flow6',
      fromNode: 'decision2',
      toNode: 'consensus1',
      fuelType: 'cognitive',
      flowRate: 4,
      currentPosition: 0.7,
      payload: 0.4
    },
    // Democratic feedback loops
    {
      id: 'flow7',
      fromNode: 'consensus1',
      toNode: 'genesis1',
      fuelType: 'incentive',
      flowRate: 1.5,
      currentPosition: 0,
      payload: 0.1
    },
    {
      id: 'flow8',
      fromNode: 'consensus1',
      toNode: 'genesis2',
      fuelType: 'incentive',
      flowRate: 1.5,
      currentPosition: 0.4,
      payload: 0.1
    }
  ]);
  
  // Adjust flow rates based on intensity
  flows.forEach(flow => {
    flow.flowRate = flow.flowRate * intensity;
  });
  
  const renderNode = (node: FuelNode) => {
    const handleClick = () => onNodeClick(node);
    
    switch (node.type) {
      case 'memory_bank':
        return <MemoryBank key={node.id} node={node} onClick={handleClick} />;
      case 'decision_core':
        return <DecisionCore key={node.id} node={node} onClick={handleClick} />;
      case 'consensus_chamber':
        return <ConsensusCore key={node.id} node={node} onClick={handleClick} />;
      case 'genesis':
        return (
          <group key={node.id} position={node.position} onClick={handleClick}>
            <mesh>
              <boxGeometry args={[1.5, 1.5, 1.5]} />
              <meshStandardMaterial
                color="#ff4444"
                emissive="#441111"
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
            <Html distanceFactor={15} position={[0, -1.2, 0]}>
              <div className="bg-black/90 text-red-400 px-2 py-1 rounded text-xs font-precision border border-red-400">
                GENESIS CORE
              </div>
            </Html>
          </group>
        );
      default:
        return null;
    }
  };
  
  return (
    <group>
      {Array.from(nodes.values()).map(renderNode)}
      {flows.map(flow => (
        <FuelFlowPath key={flow.id} flow={flow} nodes={nodes} />
      ))}
    </group>
  );
};

// Enhanced ADAM Protocol Controls
const MetabolicControls: React.FC<{ 
  intensity: number; 
  onIntensityChange: (value: number) => void;
  selectedNode: FuelNode | null;
  onSystemReset: () => void;
}> = ({ intensity, onIntensityChange, selectedNode, onSystemReset }) => {
  return (
    <div className="absolute top-4 left-4 bg-black/95 text-white p-6 rounded-lg border border-blue-400 font-precision max-w-sm">
      <h3 className="text-xl font-bold mb-4 text-blue-400">🧠 ADAM Protocol Control Center</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-2">Consensus Processing Rate</label>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={intensity}
            onChange={(e) => onIntensityChange(parseFloat(e.target.value))}
            className="w-full accent-blue-400"
          />
          <div className="text-xs text-gray-400 mt-1">Rate: {intensity.toFixed(1)}x</div>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={onSystemReset}
            className="px-3 py-1 bg-red-600/20 border border-red-400 rounded text-xs hover:bg-red-600/40 transition-colors"
          >
            Reset Protocol
          </button>
        </div>
        
        {selectedNode && (
          <div className="mt-4 pt-4 border-t border-gray-600">
            <h4 className="font-semibold text-blue-400 mb-2">
              {selectedNode.type.replace('_', ' ').toUpperCase()} NODE
            </h4>
            <div className="text-sm space-y-1">
              <div>Processing Load: <span className="text-cyan-400">{(selectedNode.fuelLevel * 100).toFixed(1)}%</span></div>
              <div>Throughput: <span className="text-yellow-400">{(selectedNode.throughput * 100).toFixed(0)}%</span></div>
              <div>Constitutional Authority: <span className="text-purple-400">{(selectedNode.constitutionalWeight * 100).toFixed(0)}%</span></div>
              <div>Status: <span className={selectedNode.isProcessing ? "text-red-400" : "text-blue-400"}>
                {selectedNode.isProcessing ? "PROCESSING" : "IDLE"}
              </span></div>
              <div>Connections: <span className="text-gray-400">{selectedNode.connections.length}</span></div>
            </div>
            
            <div className="mt-3 text-xs text-gray-300 leading-relaxed">
              {selectedNode.type === 'genesis' && "Constitutional origin point. ADAM Protocol uses these to maintain foundational logic and evolve rules democratically."}
              {selectedNode.type === 'memory_bank' && "Constitutional memory core. ADAM Protocol stores and retrieves constitutional history, preventing system drift."}
              {selectedNode.type === 'decision_core' && "Moral reasoning engine. ADAM Protocol processes ethical decisions and experiences 'moral anxiety' during complex choices."}
              {selectedNode.type === 'consensus_chamber' && "Democratic consensus hub. ADAM Protocol facilitates collective intelligence and constitutional evolution."}
            </div>
          </div>
        )}
        
        <div className="mt-4 text-xs text-gray-400">
          <div className="mb-2 font-semibold">ADAM Protocol Flows:</div>
          <div><span className="text-purple-400">●</span> Constitutional (Authority Flow)</div>
          <div><span className="text-green-400">●</span> Memory (Persistence Flow)</div>
          <div><span className="text-cyan-400">●</span> Cognitive (Reasoning Flow)</div>
          <div><span className="text-yellow-400">●</span> Consensus (Democratic Flow)</div>
        </div>
      </div>
    </div>
  );
};

// Main Interactive ADAM Protocol Demo - Enhanced Consensus Engine
const AdamProtocolDemo: React.FC = () => {
  const [intensity, setIntensity] = useState(1.0);
  const [selectedNode, setSelectedNode] = useState<FuelNode | null>(null);
  const [systemHealth, setSystemHealth] = useState(100);

  const resetSystem = useCallback(() => {
    setIntensity(1.0);
    setSelectedNode(null);
    setSystemHealth(100);
  }, []);

  return (
    <section className="w-full h-screen bg-gradient-to-b from-black via-blue-900/5 to-black relative font-precision">
      {/* Enhanced Title */}
      <div className="absolute top-8 right-8 z-40 text-white text-right">
        <h2 className="text-4xl font-bold mb-2">🧠 ADAM Protocol: Consensus Engine</h2>
        <p className="text-lg opacity-80">Constitutional Intelligence & Democratic Evolution</p>
        <p className="text-sm mt-2 opacity-60">Click nodes to inspect • Adjust processing rate • Watch the consensus</p>
      </div>

      {/* Enhanced Controls */}
      <MetabolicControls 
        intensity={intensity}
        onIntensityChange={setIntensity}
        selectedNode={selectedNode}
        onSystemReset={resetSystem}
      />

      {/* System Status */}
      <div className="absolute top-4 right-4 z-40 bg-black/90 text-white p-4 rounded border border-blue-400">
        <h4 className="font-bold text-blue-400 mb-2">Protocol Status</h4>
        <div className="text-sm space-y-1">
          <div>Health: <span className="text-green-400">{systemHealth}%</span></div>
          <div>Processing: <span className="text-yellow-400">{intensity.toFixed(1)}x</span></div>
          <div>Active Nodes: <span className="text-cyan-400">7</span></div>
          <div>Flow Paths: <span className="text-purple-400">8</span></div>
        </div>
      </div>

      {/* Enhanced Description */}
      <div className="absolute bottom-8 left-8 right-8 z-40 bg-black/90 text-white p-6 rounded border border-blue-400">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h4 className="font-bold text-red-400 mb-2">🔷 Genesis Cores</h4>
            <p className="text-sm">
              Constitutional foundation points. ADAM Protocol originates from these cores, 
              maintaining foundational logic and enabling democratic rule evolution.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-green-400 mb-2">🗄️ Memory Cores</h4>
            <p className="text-sm">
              Constitutional persistence engines. ADAM Protocol stores system memory here, 
              preventing constitutional drift and ensuring historical continuity.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-yellow-400 mb-2">🧠 Reasoning Engines</h4>
            <p className="text-sm">
              Moral computation centers. ADAM Protocol processes ethical decisions here, 
              experiencing "moral anxiety" during complex constitutional reasoning.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-purple-400 mb-2">🏛️ Consensus Hub</h4>
            <p className="text-sm">
              Democratic intelligence center. ADAM Protocol facilitates collective decision-making, 
              constitutional evolution, and system-wide consensus formation.
            </p>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-600 text-center">
          <p className="text-sm text-gray-300">
            <span className="text-blue-400 font-semibold">ADAM Protocol</span> is the consensus engine that powers constitutional intelligence. 
            <span className="text-green-400 font-semibold">FUEL</span> is the utility token that powers the ecosystem, 
            with <span className="text-yellow-400 font-semibold">ARCx</span> as the bootstrapper funding token.
          </p>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 8, 20], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[15, 15, 15]} intensity={0.8} color="#ffffff" />
        <pointLight position={[-15, 10, -15]} intensity={0.6} color="#4488ff" />
        <spotLight 
          position={[0, 25, 0]} 
          angle={0.4} 
          penumbra={1} 
          intensity={1.2} 
          color="#8888ff"
          target-position={[0, 0, 0]}
        />

        <MetabolicNetwork 
          intensity={intensity}
          onNodeClick={setSelectedNode}
          selectedNode={selectedNode}
        />

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={10}
          maxDistance={40}
          autoRotate={false}
          maxPolarAngle={Math.PI * 0.8}
          minPolarAngle={Math.PI * 0.2}
        />
      </Canvas>
    </section>
  );
};

export default AdamProtocolDemo;
