import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, OrbitControls, Environment, Sparkles, Trail, Float, useTexture, Html, PerspectiveCamera, Effects, Sphere } from '@react-three/drei';
import { Vector3, Color, MathUtils, DoubleSide, AdditiveBlending } from 'three';
import * as THREE from 'three';

// Types for our Arc system
interface ArcBlock {
  id: number;
  position: Vector3;
  rotation: number;
  isRuleBlock: boolean;
  data: string;
  active: boolean;
}

interface ContractNode {
  id: string;
  position: Vector3;
  type: 'governance' | 'economic' | 'identity' | 'justice';
  connections: string[];
  active: boolean;
  moralWeight: number;
}

// Core Arc Ring Component - The 7-block + 1 rule block architecture
const ArcRing: React.FC<{ onBlockClick: (block: ArcBlock) => void }> = ({ onBlockClick }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null);
  
  // Create the 7 + 1 block structure
  const blocks = useMemo(() => {
    const arcBlocks: ArcBlock[] = [];
    const radius = 8;
    
    // 7 genesis blocks in a circle
    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * Math.PI * 2;
      arcBlocks.push({
        id: i,
        position: new Vector3(
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius
        ),
        rotation: angle,
        isRuleBlock: false,
        data: `Genesis Block ${i + 1}`,
        active: true
      });
    }
    
    // Rule Block at the center-top
    arcBlocks.push({
      id: 7,
      position: new Vector3(0, 4, 0),
      rotation: 0,
      isRuleBlock: true,
      data: 'Rule Evolution Block',
      active: true
    });
    
    return arcBlocks;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
      
      // Pulsing effect for active blocks
      blocks.forEach((block, index) => {
        const blockMesh = groupRef.current?.children[index] as THREE.Mesh;
        if (blockMesh && blockMesh.material) {
          const material = blockMesh.material as THREE.MeshStandardMaterial;
          const pulse = Math.sin(state.clock.elapsedTime * 2 + index) * 0.3 + 0.7;
          material.emissive = new Color(block.isRuleBlock ? 0xff4444 : 0x4444ff).multiplyScalar(pulse * 0.3);
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {blocks.map((block, index) => (
        <group key={block.id} position={block.position}>
          <mesh
            onClick={() => {
              setSelectedBlock(block.id);
              onBlockClick(block);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              document.body.style.cursor = 'auto';
            }}
          >
            <boxGeometry args={block.isRuleBlock ? [2, 2, 2] : [1.5, 1.5, 1.5]} />
            <meshStandardMaterial
              color={block.isRuleBlock ? '#ff4444' : selectedBlock === block.id ? '#ffff44' : '#4444ff'}
              emissive={block.isRuleBlock ? '#441111' : '#111144'}
              metalness={0.8}
              roughness={0.2}
              transparent
              opacity={0.9}
            />
          </mesh>
          
          {/* Energy connections between blocks */}
          {!block.isRuleBlock && (
            <Trail
              width={2}
              length={20}
              color={new Color('#00ffff')}
              attenuation={(t) => t * t}
            >
              <mesh>
                <sphereGeometry args={[0.1]} />
                <meshBasicMaterial color="#00ffff" />
              </mesh>
            </Trail>
          )}
          
          {/* Block labels */}
          <Html distanceFactor={10} position={[0, block.isRuleBlock ? 1.5 : 1, 0]}>
            <div className="bg-black/80 text-white px-2 py-1 rounded text-xs font-precision border border-cyan-400">
              {block.isRuleBlock ? 'RULE' : `B${block.id + 1}`}
            </div>
          </Html>
        </group>
      ))}
      
      {/* Energy field around the ring */}
      <Sparkles count={100} scale={20} size={2} speed={0.4} color="#00ffff" />
      
      {/* Constitutional substrate visualization */}
      <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6, 12, 64]} />
        <meshStandardMaterial
          color="#222244"
          emissive="#001122"
          transparent
          opacity={0.3}
          side={DoubleSide}
        />
      </mesh>
    </group>
  );
};

// Contract Nodes - Dynamic entities that interact with the Arc
const ContractNodes: React.FC<{ onNodeClick: (node: ContractNode) => void }> = ({ onNodeClick }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  
  const contracts = useMemo(() => {
    const nodes: ContractNode[] = [
      // Governance Contracts
      {
        id: 'gov1',
        position: new Vector3(-12, 3, -8),
        type: 'governance',
        connections: ['eco1', 'id1'],
        active: true,
        moralWeight: 0.9
      },
      {
        id: 'gov2',
        position: new Vector3(12, 3, -8),
        type: 'governance',
        connections: ['eco2', 'just1'],
        active: true,
        moralWeight: 0.85
      },
      
      // Economic Contracts
      {
        id: 'eco1',
        position: new Vector3(-15, -2, 5),
        type: 'economic',
        connections: ['id1', 'just1'],
        active: true,
        moralWeight: 0.7
      },
      {
        id: 'eco2',
        position: new Vector3(15, -2, 5),
        type: 'economic',
        connections: ['id2', 'just2'],
        active: true,
        moralWeight: 0.75
      },
      
      // Identity Contracts
      {
        id: 'id1',
        position: new Vector3(-8, -5, 12),
        type: 'identity',
        connections: ['just1'],
        active: true,
        moralWeight: 0.95
      },
      {
        id: 'id2',
        position: new Vector3(8, -5, 12),
        type: 'identity',
        connections: ['just2'],
        active: true,
        moralWeight: 0.93
      },
      
      // Justice Contracts
      {
        id: 'just1',
        position: new Vector3(-5, 6, 15),
        type: 'justice',
        connections: ['gov1'],
        active: true,
        moralWeight: 1.0
      },
      {
        id: 'just2',
        position: new Vector3(5, 6, 15),
        type: 'justice',
        connections: ['gov2'],
        active: true,
        moralWeight: 0.98
      }
    ];
    return nodes;
  }, []);

  const getNodeColor = (type: string, selected: boolean) => {
    const colors = {
      governance: selected ? '#ffaa00' : '#ff6600',
      economic: selected ? '#00ffaa' : '#00ff66',
      identity: selected ? '#aa00ff' : '#6600ff',
      justice: selected ? '#ff00aa' : '#ff0066'
    };
    return colors[type as keyof typeof colors];
  };

  useFrame((state) => {
    contracts.forEach((contract, index) => {
      if (groupRef.current?.children[index]) {
        const node = groupRef.current.children[index];
        // Moral anxiety visualization - nodes pulse based on moral weight
        const anxiety = (1 - contract.moralWeight) * 2;
        const pulse = Math.sin(state.clock.elapsedTime * (2 + anxiety)) * anxiety * 0.5;
        node.scale.setScalar(1 + pulse);
        
        // Floating motion
        node.position.y += Math.sin(state.clock.elapsedTime + index) * 0.02;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {contracts.map((contract, index) => (
        <Float key={contract.id} speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <group position={contract.position}>
            <mesh
              onClick={() => {
                setSelectedNode(contract.id);
                onNodeClick(contract);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'auto';
              }}
            >
              <octahedronGeometry args={[0.8]} />
              <meshStandardMaterial
                color={getNodeColor(contract.type, selectedNode === contract.id)}
                emissive={getNodeColor(contract.type, false)}
                emissiveIntensity={0.2}
                metalness={0.6}
                roughness={0.3}
              />
            </mesh>
            
            {/* Moral weight indicator */}
            <mesh position={[0, 1.2, 0]}>
              <cylinderGeometry args={[0.1, 0.1, contract.moralWeight * 2]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
            </mesh>
            
            <Html distanceFactor={15} position={[0, -1.5, 0]}>
              <div className="bg-black/90 text-white px-2 py-1 rounded text-xs font-precision border border-purple-400">
                {contract.type.toUpperCase()}
                <br />
                <span className="text-xs opacity-75">MW: {contract.moralWeight.toFixed(2)}</span>
              </div>
            </Html>
          </group>
        </Float>
      ))}
    </group>
  );
};

// FUEL Flow Visualization - The metabolic system
const FuelFlow: React.FC = () => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particleCount = 1000;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particleCount; i++) {
        // Create flowing patterns around the Arc
        const t = state.clock.elapsedTime * 0.5 + i * 0.01;
        const radius = 15 + Math.sin(t) * 5;
        
        positions[i * 3] = Math.cos(t) * radius;
        positions[i * 3 + 1] = Math.sin(t * 0.5) * 8;
        positions[i * 3 + 2] = Math.sin(t) * radius;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#00ffaa"
        transparent
        opacity={0.6}
        blending={AdditiveBlending}
      />
    </points>
  );
};

// Information Panel Component
const InfoPanel: React.FC<{ selectedItem: any; onClose: () => void }> = ({ selectedItem, onClose }) => {
  if (!selectedItem) return null;

  const getDescription = (item: any) => {
    if (item.isRuleBlock !== undefined) {
      // It's an Arc block
      if (item.isRuleBlock) {
        return {
          title: "Rule Evolution Block",
          content: "The 8th block that evolves rules dynamically after each cycle. This is where constitutional intelligence manifests - the system's ability to question its own axioms and rewrite its foundational logic based on performance and democratic feedback."
        };
      } else {
        return {
          title: `Genesis Block ${item.id + 1}`,
          content: "Part of the constitutional substrate - the birth of law, memory, and identity. Each genesis block encodes foundational logic that binds all smart contracts, nodes, agents, and governance decisions. This is the literal formalization of cognition within the system."
        };
      }
    } else {
      // It's a contract node
      const descriptions = {
        governance: "Constitutional clauses that define, interpret, and enforce rules. These are not arbitrary scripts but legal beings with authority stemming from The Arc itself.",
        economic: "Allocate FUEL, manage incentives, and encode obligations. They power the metabolic flow of the system and ensure constitutional compliance in all economic activities.",
        identity: "Define digital personhood, rights, and memory trails. These contracts establish who you are within the constitutional framework and what rights you possess.",
        justice: "Enable slashing, arbitration, and restitution. They provide the moral weight and ethical enforcement mechanisms, capable of experiencing 'moral anxiety' during complex decisions."
      };
      
      return {
        title: `${item.type.toUpperCase()} Contract`,
        content: descriptions[item.type as keyof typeof descriptions] + ` Moral Weight: ${item.moralWeight} - indicating the ethical complexity and decision-making burden of this contract.`
      };
    }
  };

  const info = getDescription(selectedItem);

  return (
    <div className="fixed top-4 right-4 max-w-md bg-black/90 text-white p-6 rounded-lg border border-cyan-400 font-precision z-50">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-cyan-400">{info.title}</h3>
        <button 
          onClick={onClose}
          className="text-white hover:text-cyan-400 text-xl"
        >
          ×
        </button>
      </div>
      <p className="text-sm leading-relaxed">{info.content}</p>
      
      {selectedItem.type && (
        <div className="mt-4 pt-4 border-t border-gray-600">
          <div className="text-xs text-gray-400">
            <div>Connections: {selectedItem.connections?.length || 0}</div>
            <div>Status: {selectedItem.active ? 'Active' : 'Dormant'}</div>
            <div>Type: Constitutional Entity</div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Experience Component
const ArcExperience: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 15, 25]);

  return (
    <section className="w-full h-screen bg-black relative font-precision">
      {/* Title overlay */}
      <div className="absolute top-8 left-8 z-40 text-white">
        <h2 className="text-4xl font-bold mb-2">🌀 THE ARC</h2>
        <p className="text-lg opacity-80">Constitutional Substrate & Living Intelligence</p>
        <p className="text-sm mt-2 opacity-60">Click on blocks and contracts to explore</p>
      </div>

      {/* Controls overlay */}
      <div className="absolute bottom-8 left-8 z-40 text-white text-sm opacity-60">
        <div>Mouse: Orbit • Wheel: Zoom • Click: Interact</div>
      </div>

      {/* Info panel */}
      {selectedItem && (
        <InfoPanel 
          selectedItem={selectedItem} 
          onClose={() => setSelectedItem(null)} 
        />
      )}

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: cameraPosition, fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.setClearColor('#000000', 1);
        }}
      >
        {/* Enhanced lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4444ff" />
        <spotLight 
          position={[0, 20, 0]} 
          angle={0.3} 
          penumbra={1} 
          intensity={0.8} 
          color="#00ffff"
          target-position={[0, 0, 0]}
        />

        {/* Environment */}
        <Environment preset="night" />
        
        {/* Core components */}
        <ArcRing onBlockClick={setSelectedItem} />
        <ContractNodes onNodeClick={setSelectedItem} />
        <FuelFlow />

        {/* Camera controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={10}
          maxDistance={100}
          autoRotate={false}
        />
      </Canvas>

      {/* Concept overview */}
      <div className="absolute bottom-8 right-8 z-40 max-w-xs bg-black/80 text-white p-4 rounded border border-purple-400">
        <h4 className="font-bold mb-2">System Overview</h4>
        <div className="text-xs space-y-1">
          <div><span className="text-blue-400">■</span> Genesis Blocks (7)</div>
          <div><span className="text-red-400">■</span> Rule Evolution Block</div>
          <div><span className="text-orange-400">■</span> Governance Contracts</div>
          <div><span className="text-green-400">■</span> Economic Contracts</div>
          <div><span className="text-purple-400">■</span> Identity Contracts</div>
          <div><span className="text-pink-400">■</span> Justice Contracts</div>
          <div><span className="text-cyan-400">◦</span> FUEL Flow</div>
        </div>
      </div>
    </section>
  );
};

export default ArcExperience;
