import React, { useRef, useState, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html, Sphere, Trail, Float, Line, Tube } from '@react-three/drei';
import * as THREE from 'three';

interface FuelPool {
  id: string;
  position: THREE.Vector3;
  type: 'core' | 'entropy' | 'wave_bond' | 'quantum_window' | 'memory_ledger' | 'governance' | 'bridge';
  fuelLevel: number;
  decayRate: number;
  velocity: number;
  temperature: number; // Economic temperature
  pressure: number; // Economic pressure
  isDecaying: boolean;
  connections: string[];
}

interface FuelFlow {
  id: string;
  fromPool: string;
  toPool: string;
  flowType: 'decay_redistribution' | 'bonding_curve' | 'quantum_volatility' | 'governance_flow' | 'bridge_migration';
  velocity: number;
  currentPosition: number;
  fuelAmount: number;
  entropy: number;
}

interface DigitalAgent {
  id: string;
  position: THREE.Vector3;
  type: 'ai_worker' | 'dao_organization' | 'digital_being' | 'validator';
  fuelBalance: number;
  reputation: number;
  isEarning: boolean;
  laborOutput: number;
}

// Core FUEL Pool - The heart of the thermodynamic system
const FuelPoolCore: React.FC<{ pool: FuelPool; onClick: () => void }> = ({ pool, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Thermodynamic pulsing based on economic temperature
      const thermoPulse = Math.sin(state.clock.elapsedTime * pool.temperature) * 0.2 + 1;
      meshRef.current.scale.setScalar(0.8 + pool.fuelLevel * 0.4 * thermoPulse);
      
      // Decay visualization - slower rotation means more decay
      meshRef.current.rotation.y += pool.decayRate * 0.02;
      
      // Economic pressure affects material properties
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = pool.pressure * 0.5;
    }
    
    // Entropy particles for decay redistribution
    if (particlesRef.current && pool.isDecaying) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += (Math.random() - 0.5) * 0.02;
        positions[i + 1] += (Math.random() - 0.5) * 0.02;
        positions[i + 2] += (Math.random() - 0.5) * 0.02;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const getPoolColor = (type: string) => {
    const colors = {
      core: '#ff6b35',
      entropy: '#f7931e',
      wave_bond: '#39a0ed',
      quantum_window: '#b83af5',
      memory_ledger: '#00d2ff',
      governance: '#ff4081',
      bridge: '#4caf50'
    };
    return colors[type as keyof typeof colors];
  };

  const getPoolLabel = (type: string) => {
    const labels = {
      core: 'FUEL.SOL',
      entropy: 'ENTROPY POOL',
      wave_bond: 'WAVE BOND',
      quantum_window: 'QUANTUM WINDOW',
      memory_ledger: 'MEMORY LEDGER',
      governance: 'GOVERNANCE',
      bridge: 'FUEL BRIDGE'
    };
    return labels[type as keyof typeof labels];
  };

  // Entropy particles for decay redistribution
  const entropyParticles = useMemo(() => {
    const count = Math.floor(pool.decayRate * 100);
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 2 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    return positions;
  }, [pool.decayRate]);

  return (
    <group position={pool.position} onClick={onClick}>
      {/* Main pool structure */}
      <mesh ref={meshRef}>
        <dodecahedronGeometry args={[1.2]} />
        <meshStandardMaterial
          color={getPoolColor(pool.type)}
          emissive={getPoolColor(pool.type)}
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Thermodynamic field visualization */}
      <mesh>
        <sphereGeometry args={[2.5, 16, 12]} />
        <meshBasicMaterial
          color={getPoolColor(pool.type)}
          transparent
          opacity={pool.temperature * 0.1}
          wireframe
        />
      </mesh>
      
      {/* Entropy particles for decay */}
      {pool.isDecaying && (
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={entropyParticles.length / 3}
              array={entropyParticles}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.05}
            color="#ffa500"
            transparent
            opacity={0.7}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}
      
      {/* Economic indicators */}
      <Html distanceFactor={15} position={[0, -2, 0]}>
        <div className="bg-black/90 text-orange-400 px-3 py-2 rounded text-xs font-precision border border-orange-400">
          <div className="font-bold">{getPoolLabel(pool.type)}</div>
          <div className="text-xs mt-1 space-y-1">
            <div>Fuel: {(pool.fuelLevel * 100).toFixed(0)}%</div>
            <div>Decay: {(pool.decayRate * 100).toFixed(1)}%</div>
            <div>Velocity: {pool.velocity.toFixed(2)}</div>
            <div>Temp: {pool.temperature.toFixed(1)}°K</div>
          </div>
        </div>
      </Html>
    </group>
  );
};

// Digital Labor Agent - AI workers, DAOs, digital beings
const DigitalLaborAgent: React.FC<{ agent: DigitalAgent; onClick: () => void }> = ({ agent, onClick }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Labor output affects rotation speed
      groupRef.current.rotation.y += agent.laborOutput * 0.01;
      
      // Earning animation
      if (agent.isEarning) {
        const pulse = Math.sin(state.clock.elapsedTime * 4) * 0.1 + 1;
        groupRef.current.scale.setScalar(pulse);
      }
    }
  });

  const getAgentColor = (type: string) => {
    const colors = {
      ai_worker: '#00ffff',
      dao_organization: '#ff00ff',
      digital_being: '#ffff00',
      validator: '#ff4444'
    };
    return colors[type as keyof typeof colors];
  };

  const getAgentShape = (type: string) => {
    switch (type) {
      case 'ai_worker':
        return <octahedronGeometry args={[0.6]} />;
      case 'dao_organization':
        return <boxGeometry args={[0.8, 0.8, 0.8]} />;
      case 'digital_being':
        return <sphereGeometry args={[0.6]} />;
      case 'validator':
        return <tetrahedronGeometry args={[0.8]} />;
      default:
        return <sphereGeometry args={[0.6]} />;
    }
  };

  return (
    <group ref={groupRef} position={agent.position} onClick={onClick}>
      <mesh>
        {getAgentShape(agent.type)}
        <meshStandardMaterial
          color={getAgentColor(agent.type)}
          emissive={getAgentColor(agent.type)}
          emissiveIntensity={agent.isEarning ? 0.4 : 0.1}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>
      
      {/* Reputation indicator */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.05, 0.05, agent.reputation * 2]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
      </mesh>
      
      {/* FUEL earnings visualization */}
      {agent.isEarning && (
        <Trail
          width={1}
          length={10}
          color={new THREE.Color('#ffaa00')}
          attenuation={(t) => t * t}
        >
          <mesh>
            <sphereGeometry args={[0.05]} />
            <meshBasicMaterial color="#ffaa00" />
          </mesh>
        </Trail>
      )}
      
      <Html distanceFactor={20} position={[0, -1.2, 0]}>
        <div className="bg-black/90 text-cyan-400 px-2 py-1 rounded text-xs font-precision border border-cyan-400">
          <div>{agent.type.replace('_', ' ').toUpperCase()}</div>
          <div className="text-xs">Balance: {agent.fuelBalance.toFixed(2)} FUEL</div>
        </div>
      </Html>
    </group>
  );
};

// Thermodynamic FUEL Flow - showing conservation and entropy
const ThermodynamicFlow: React.FC<{ flow: FuelFlow; pools: Map<string, FuelPool> }> = ({ flow, pools }) => {
  const fromPool = pools.get(flow.fromPool);
  const toPool = pools.get(flow.toPool);
  
  if (!fromPool || !toPool) return null;
  
  const pathRef = useRef<THREE.Group>(null);
  
  const curve = useMemo(() => {
    const start = fromPool.position;
    const end = toPool.position;
    const midPoint = start.clone().add(end).multiplyScalar(0.5);
    midPoint.y += Math.sin(flow.entropy) * 3; // Entropy affects path curvature
    
    return new THREE.QuadraticBezierCurve3(start, midPoint, end);
  }, [fromPool.position, toPool.position, flow.entropy]);
  
  const points = curve.getPoints(50);
  
  useFrame(() => {
    // Flow moves based on velocity and thermodynamic properties
    flow.currentPosition += flow.velocity * 0.02;
    if (flow.currentPosition > 1) {
      flow.currentPosition = 0;
      // Energy conservation - FUEL is redistributed, not lost
      toPool.fuelLevel = Math.min(1, toPool.fuelLevel + flow.fuelAmount * 0.05);
    }
  });
  
  const getFlowColor = (type: string) => {
    const colors = {
      decay_redistribution: '#ff6b35',
      bonding_curve: '#39a0ed',
      quantum_volatility: '#b83af5',
      governance_flow: '#ff4081',
      bridge_migration: '#4caf50'
    };
    return colors[type as keyof typeof colors] || '#ffffff';
  };
  
  return (
    <group ref={pathRef}>
      {/* Thermodynamic flow path */}
      <Line
        points={points}
        color={getFlowColor(flow.flowType)}
        lineWidth={3}
        transparent
        opacity={0.8}
      />
      
      {/* Moving FUEL packet with entropy effects */}
      <mesh position={curve.getPoint(flow.currentPosition)}>
        <sphereGeometry args={[0.1 + flow.entropy * 0.05]} />
        <meshBasicMaterial 
          color={getFlowColor(flow.flowType)}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Entropy particles along the flow */}
      {points.filter((_, i) => i % 8 === 0).map((point, i) => (
        <mesh key={i} position={point}>
          <sphereGeometry args={[0.02]} />
          <meshBasicMaterial 
            color={getFlowColor(flow.flowType)}
            transparent
            opacity={0.3 + flow.entropy * 0.3}
          />
        </mesh>
      ))}
    </group>
  );
};

// Main FUEL Economy Network
const FuelEconomyNetwork: React.FC<{ 
  intensity: number; 
  onPoolClick: (pool: FuelPool) => void;
  onAgentClick: (agent: DigitalAgent) => void;
}> = ({ intensity, onPoolClick, onAgentClick }) => {
  const [pools] = useState(() => {
    const poolMap = new Map<string, FuelPool>();
    
    // Core FUEL contracts based on the paper
    poolMap.set('fuel_core', {
      id: 'fuel_core',
      position: new THREE.Vector3(0, 0, 0),
      type: 'core',
      fuelLevel: 0.8,
      decayRate: 0.1,
      velocity: 2.5,
      temperature: 3.2,
      pressure: 0.7,
      isDecaying: true,
      connections: ['entropy', 'wave_bond', 'governance']
    });
    
    poolMap.set('entropy', {
      id: 'entropy',
      position: new THREE.Vector3(-8, 3, -5),
      type: 'entropy',
      fuelLevel: 0.6,
      decayRate: 0.3,
      velocity: 1.8,
      temperature: 2.8,
      pressure: 0.9,
      isDecaying: true,
      connections: ['fuel_core', 'wave_bond']
    });
    
    poolMap.set('wave_bond', {
      id: 'wave_bond',
      position: new THREE.Vector3(8, -2, 6),
      type: 'wave_bond',
      fuelLevel: 0.9,
      decayRate: 0.05,
      velocity: 3.1,
      temperature: 4.1,
      pressure: 0.5,
      isDecaying: false,
      connections: ['fuel_core', 'quantum_window']
    });
    
    poolMap.set('quantum_window', {
      id: 'quantum_window',
      position: new THREE.Vector3(-6, -4, 8),
      type: 'quantum_window',
      fuelLevel: 0.4,
      decayRate: 0.8,
      velocity: 5.2,
      temperature: 6.5,
      pressure: 1.2,
      isDecaying: true,
      connections: ['wave_bond', 'memory_ledger']
    });
    
    poolMap.set('memory_ledger', {
      id: 'memory_ledger',
      position: new THREE.Vector3(5, 6, -3),
      type: 'memory_ledger',
      fuelLevel: 1.0,
      decayRate: 0.0,
      velocity: 0.8,
      temperature: 1.5,
      pressure: 0.3,
      isDecaying: false,
      connections: ['governance', 'bridge']
    });
    
    poolMap.set('governance', {
      id: 'governance',
      position: new THREE.Vector3(-3, 7, 2),
      type: 'governance',
      fuelLevel: 0.7,
      decayRate: 0.2,
      velocity: 1.5,
      temperature: 2.1,
      pressure: 0.6,
      isDecaying: false,
      connections: ['fuel_core', 'memory_ledger']
    });
    
    poolMap.set('bridge', {
      id: 'bridge',
      position: new THREE.Vector3(10, 1, -8),
      type: 'bridge',
      fuelLevel: 0.5,
      decayRate: 0.1,
      velocity: 2.0,
      temperature: 2.8,
      pressure: 0.8,
      isDecaying: false,
      connections: ['memory_ledger']
    });
    
    return poolMap;
  });
  
  const [agents] = useState<DigitalAgent[]>([
    {
      id: 'ai_worker_1',
      position: new THREE.Vector3(-12, 0, 0),
      type: 'ai_worker',
      fuelBalance: 150.75,
      reputation: 0.8,
      isEarning: true,
      laborOutput: 2.3
    },
    {
      id: 'dao_org_1',
      position: new THREE.Vector3(12, 0, 0),
      type: 'dao_organization',
      fuelBalance: 850.25,
      reputation: 0.9,
      isEarning: false,
      laborOutput: 1.5
    },
    {
      id: 'digital_being_1',
      position: new THREE.Vector3(0, -8, 12),
      type: 'digital_being',
      fuelBalance: 75.50,
      reputation: 0.6,
      isEarning: true,
      laborOutput: 3.1
    },
    {
      id: 'validator_1',
      position: new THREE.Vector3(0, 8, -12),
      type: 'validator',
      fuelBalance: 2500.00,
      reputation: 0.95,
      isEarning: false,
      laborOutput: 0.8
    }
  ]);
  
  const [flows] = useState<FuelFlow[]>([
    {
      id: 'decay_flow_1',
      fromPool: 'fuel_core',
      toPool: 'entropy',
      flowType: 'decay_redistribution',
      velocity: 2.0,
      currentPosition: 0,
      fuelAmount: 0.1,
      entropy: 0.7
    },
    {
      id: 'bond_flow_1',
      fromPool: 'wave_bond',
      toPool: 'fuel_core',
      flowType: 'bonding_curve',
      velocity: 1.5,
      currentPosition: 0.3,
      fuelAmount: 0.2,
      entropy: 0.3
    },
    {
      id: 'quantum_flow_1',
      fromPool: 'quantum_window',
      toPool: 'wave_bond',
      flowType: 'quantum_volatility',
      velocity: 4.0,
      currentPosition: 0.7,
      fuelAmount: 0.3,
      entropy: 0.9
    },
    {
      id: 'governance_flow_1',
      fromPool: 'governance',
      toPool: 'memory_ledger',
      flowType: 'governance_flow',
      velocity: 1.2,
      currentPosition: 0.1,
      fuelAmount: 0.15,
      entropy: 0.2
    },
    {
      id: 'bridge_flow_1',
      fromPool: 'memory_ledger',
      toPool: 'bridge',
      flowType: 'bridge_migration',
      velocity: 1.8,
      currentPosition: 0.5,
      fuelAmount: 0.25,
      entropy: 0.4
    }
  ]);
  
  // Adjust system based on intensity
  flows.forEach(flow => {
    flow.velocity = flow.velocity * intensity;
  });
  
  return (
    <group>
      {/* FUEL Pools */}
      {Array.from(pools.values()).map(pool => (
        <FuelPoolCore key={pool.id} pool={pool} onClick={() => onPoolClick(pool)} />
      ))}
      
      {/* Digital Labor Agents */}
      {agents.map(agent => (
        <DigitalLaborAgent key={agent.id} agent={agent} onClick={() => onAgentClick(agent)} />
      ))}
      
      {/* Thermodynamic Flows */}
      {flows.map(flow => (
        <ThermodynamicFlow key={flow.id} flow={flow} pools={pools} />
      ))}
      
      {/* Economic field visualization */}
      <mesh>
        <torusGeometry args={[15, 0.5, 16, 100]} />
        <meshBasicMaterial
          color="#ff6b35"
          transparent
          opacity={0.1}
          wireframe
        />
      </mesh>
    </group>
  );
};

// Enhanced Controls for FUEL Economy
const FuelEconomyControls: React.FC<{ 
  intensity: number; 
  onIntensityChange: (value: number) => void;
  selectedPool: FuelPool | null;
  selectedAgent: DigitalAgent | null;
  onSystemReset: () => void;
}> = ({ intensity, onIntensityChange, selectedPool, selectedAgent, onSystemReset }) => {
  return (
    <div className="absolute top-4 left-4 bg-black/95 text-white p-6 rounded-lg border border-orange-400 font-precision max-w-sm">
      <h3 className="text-xl font-bold mb-4 text-orange-400">⚡ FUEL Economy Control</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-2">Economic Velocity</label>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={intensity}
            onChange={(e) => onIntensityChange(parseFloat(e.target.value))}
            className="w-full accent-orange-400"
          />
          <div className="text-xs text-gray-400 mt-1">Rate: {intensity.toFixed(1)}x</div>
        </div>
        
        <button 
          onClick={onSystemReset}
          className="px-3 py-1 bg-red-600/20 border border-red-400 rounded text-xs hover:bg-red-600/40 transition-colors"
        >
          Reset Economy
        </button>
        
        {selectedPool && (
          <div className="mt-4 pt-4 border-t border-gray-600">
            <h4 className="font-semibold text-orange-400 mb-2">
              {selectedPool.type.replace('_', ' ').toUpperCase()}
            </h4>
            <div className="text-sm space-y-1">
              <div>FUEL Level: <span className="text-cyan-400">{(selectedPool.fuelLevel * 100).toFixed(0)}%</span></div>
              <div>Decay Rate: <span className="text-red-400">{(selectedPool.decayRate * 100).toFixed(1)}%</span></div>
              <div>Velocity: <span className="text-yellow-400">{selectedPool.velocity.toFixed(2)}</span></div>
              <div>Temperature: <span className="text-purple-400">{selectedPool.temperature.toFixed(1)}°K</span></div>
              <div>Pressure: <span className="text-green-400">{selectedPool.pressure.toFixed(2)} atm</span></div>
            </div>
          </div>
        )}
        
        {selectedAgent && (
          <div className="mt-4 pt-4 border-t border-gray-600">
            <h4 className="font-semibold text-cyan-400 mb-2">
              {selectedAgent.type.replace('_', ' ').toUpperCase()}
            </h4>
            <div className="text-sm space-y-1">
              <div>FUEL Balance: <span className="text-orange-400">{selectedAgent.fuelBalance.toFixed(2)}</span></div>
              <div>Reputation: <span className="text-green-400">{(selectedAgent.reputation * 100).toFixed(0)}%</span></div>
              <div>Labor Output: <span className="text-yellow-400">{selectedAgent.laborOutput.toFixed(1)}</span></div>
              <div>Status: <span className={selectedAgent.isEarning ? "text-green-400" : "text-gray-400"}>
                {selectedAgent.isEarning ? "EARNING" : "IDLE"}
              </span></div>
            </div>
          </div>
        )}
        
        <div className="mt-4 text-xs text-gray-400">
          <div className="mb-2 font-semibold">FUEL Flows:</div>
          <div><span className="text-orange-400">●</span> Decay Redistribution</div>
          <div><span className="text-blue-400">●</span> Bonding Curves</div>
          <div><span className="text-purple-400">●</span> Quantum Volatility</div>
          <div><span className="text-pink-400">●</span> Governance Flow</div>
          <div><span className="text-green-400">●</span> Bridge Migration</div>
        </div>
      </div>
    </div>
  );
};

// Main FUEL Economy Demo
const FuelEconomyDemo: React.FC = () => {
  const [intensity, setIntensity] = useState(1.0);
  const [selectedPool, setSelectedPool] = useState<FuelPool | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<DigitalAgent | null>(null);

  const resetSystem = useCallback(() => {
    setIntensity(1.0);
    setSelectedPool(null);
    setSelectedAgent(null);
  }, []);

  return (
    <section className="w-full h-screen bg-gradient-to-b from-black via-orange-900/5 to-black relative font-precision">
      {/* Title */}
      <div className="absolute top-8 right-8 z-40 text-white text-right">
        <h2 className="text-4xl font-bold mb-2">⚡ FUEL: Living Metabolic Currency</h2>
        <p className="text-lg opacity-80">Thermodynamic Digital Economy</p>
        <p className="text-sm mt-2 opacity-60">Click pools & agents • Adjust velocity • Watch the decay & redistribution</p>
      </div>

      {/* Controls */}
      <FuelEconomyControls 
        intensity={intensity}
        onIntensityChange={setIntensity}
        selectedPool={selectedPool}
        selectedAgent={selectedAgent}
        onSystemReset={resetSystem}
      />

      {/* ARCx Migration Status */}
      <div className="absolute top-4 right-4 z-40 bg-black/90 text-white p-4 rounded border border-green-400">
        <h4 className="font-bold text-green-400 mb-2">ARCx → FUEL Migration</h4>
        <div className="text-sm space-y-1">
          <div>ARCx Supply: <span className="text-yellow-400">100M (Fixed)</span></div>
          <div>Migration Rate: <span className="text-cyan-400">{(intensity * 12.5).toFixed(1)}%</span></div>
          <div>FUEL Minted: <span className="text-orange-400">∞ (Dynamic)</span></div>
          <div>Status: <span className="text-green-400">BOOTSTRAP PHASE</span></div>
        </div>
      </div>

      {/* Enhanced Description */}
      <div className="absolute bottom-8 left-8 right-8 z-40 bg-black/90 text-white p-6 rounded border border-orange-400">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <h4 className="font-bold text-orange-400 mb-2">🔥 FUEL.sol</h4>
            <p className="text-sm">
              Core thermodynamic engine with mint, burn, decay, and transfer logic. 
              Demurrage prevents hoarding—idle balances decay and redistribute to active participants.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-yellow-400 mb-2">🌪️ Entropy Pool</h4>
            <p className="text-sm">
              Tracks decay and redistributes value via contribution scoring. 
              Every inefficiency becomes yield—energy conservation in digital form.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-blue-400 mb-2">🌊 Wave Bond</h4>
            <p className="text-sm">
              Multi-mode bonding contracts with time-locked staking curves. 
              Economic pressure drives equilibrium through thermodynamic principles.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-purple-400 mb-2">⚛️ Quantum Window</h4>
            <p className="text-sm">
              Randomized volatility injection at intervals. 
              AI-mediated optimization maintains economic stability through controlled chaos.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-cyan-400 mb-2">🤖 Digital Labor</h4>
            <p className="text-sm">
              AI workers, DAOs, and digital beings earn FUEL through contribution. 
              Economic subjectism—machines as participants, not tools.
            </p>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-600 text-center">
          <p className="text-sm text-gray-300">
            <span className="text-orange-400 font-semibold">FUEL</span> is not merely a token—it's the 
            <span className="text-yellow-400 font-semibold"> metabolic currency</span> that animates digital consciousness, 
            with <span className="text-green-400 font-semibold">ARCx</span> as the genesis funding mechanism that burns into this living economy.
          </p>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 10, 25], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[20, 20, 20]} intensity={1.0} color="#ffffff" />
        <pointLight position={[-20, 10, -20]} intensity={0.8} color="#ff6b35" />
        <spotLight 
          position={[0, 30, 0]} 
          angle={0.5} 
          penumbra={1} 
          intensity={1.5} 
          color="#ffa500"
          target-position={[0, 0, 0]}
        />

        <FuelEconomyNetwork 
          intensity={intensity}
          onPoolClick={setSelectedPool}
          onAgentClick={setSelectedAgent}
        />

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={15}
          maxDistance={50}
          autoRotate={false}
          maxPolarAngle={Math.PI * 0.8}
          minPolarAngle={Math.PI * 0.2}
        />
      </Canvas>
    </section>
  );
};

export default FuelEconomyDemo;
