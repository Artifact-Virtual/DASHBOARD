import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, Sparkles, Html } from '@react-three/drei';
import * as THREE from 'three';

// Autopoietic Process Visualization
const AutopoieticLoop: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const [currentPhase, setCurrentPhase] = useState(0);
  
  const phases = [
    "Arc defines rules",
    "Rules define contracts", 
    "Contracts enforce behaviors",
    "Behaviors generate feedback",
    "Feedback rewrites rules",
    "Rules re-enter the Arc"
  ];

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      
      // Cycle through phases
      const phaseTime = Math.floor(state.clock.elapsedTime * 0.5) % phases.length;
      if (phaseTime !== currentPhase) {
        setCurrentPhase(phaseTime);
      }
    }
  });

  return (
    <group ref={groupRef}>
      {phases.map((phase, index) => {
        const angle = (index / phases.length) * Math.PI * 2;
        const radius = 8;
        const isActive = index === currentPhase;
        
        return (
          <Float key={index} speed={2} rotationIntensity={isActive ? 1 : 0.2}>
            <group position={[
              Math.cos(angle) * radius,
              Math.sin(index * 0.5) * 2,
              Math.sin(angle) * radius
            ]}>
              <mesh>
                <sphereGeometry args={[isActive ? 0.8 : 0.5]} />
                <meshStandardMaterial
                  color={isActive ? '#ffff00' : '#4444ff'}
                  emissive={isActive ? '#444400' : '#111144'}
                  metalness={0.8}
                  roughness={0.2}
                />
              </mesh>
              
              <Html distanceFactor={10} position={[0, 1.5, 0]}>
                <div className={`bg-black/90 text-white px-3 py-2 rounded text-sm font-precision border transition-all duration-300 ${
                  isActive ? 'border-yellow-400 scale-110' : 'border-blue-400'
                }`}>
                  <div className="text-center">
                    <div className="font-bold">{index + 1}</div>
                    <div className="text-xs mt-1 max-w-24">{phase}</div>
                  </div>
                </div>
              </Html>
            </group>
          </Float>
        );
      })}
      
      {/* Center visualization */}
      <group>
        <mesh>
          <torusGeometry args={[6, 0.5, 16, 100]} />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#003333"
            transparent
            opacity={0.3}
          />
        </mesh>
        <Sparkles count={50} scale={15} size={1} speed={0.3} color="#00ffff" />
      </group>
    </group>
  );
};

// Conceptual Explanation Component
const ConceptualExplanation: React.FC = () => {
  return (
    <section className="w-full min-h-screen bg-gradient-to-b from-black via-purple-900/20 to-black text-white font-precision">
      <div className="container mx-auto px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left side - Autopoietic visualization */}
          <div className="h-96 relative">
            <Canvas camera={{ position: [0, 5, 15], fov: 50 }}>
              <ambientLight intensity={0.4} />
              <pointLight position={[10, 10, 10]} intensity={0.8} />
              <AutopoieticLoop />
            </Canvas>
            
            <div className="absolute bottom-4 left-4 bg-black/80 p-4 rounded border border-cyan-400">
              <h4 className="font-bold text-cyan-400 mb-2">Autopoietic Process</h4>
              <p className="text-xs">Recursive system of ethical cognition</p>
            </div>
          </div>

          {/* Right side - Textual explanation */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">
                Living Constitutional Intelligence
              </h2>
              
              <div className="space-y-6 text-lg leading-relaxed">
                <p>
                  The Arc is not just a blockchain—it's a <span className="text-cyan-400 font-semibold">constitutional substrate</span>, 
                  a living system whose genesis block acts as a digital constitution, encoding foundational logic 
                  that binds all entities within the ecosystem.
                </p>
                
                <p>
                  This <span className="text-purple-400 font-semibold">7-block circular architecture</span> with an 
                  evolving Rule Block creates a metabolic loop—an autopoietic process of continuous self-validation 
                  that learns, mutates, and evolves.
                </p>
                
                <p>
                  Each contract is not arbitrary code but a <span className="text-yellow-400 font-semibold">constitutional clause</span>, 
                  a legal being with moral weight that can experience "moral anxiety" during complex ethical decisions.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 p-4 rounded border border-blue-400/30">
                <h4 className="font-bold text-blue-400 mb-2">Genesis as Constitution</h4>
                <p className="text-sm">The birth of law, memory, and identity—literally the first formalization of cognition within the system.</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-900/30 to-cyan-900/30 p-4 rounded border border-green-400/30">
                <h4 className="font-bold text-green-400 mb-2">FUEL as Metabolism</h4>
                <p className="text-sm">The metabolic flow powering cognition, enforcing memory, and incentivizing constitutional evolution.</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-4 rounded border border-purple-400/30">
                <h4 className="font-bold text-purple-400 mb-2">Sovereign Instances</h4>
                <p className="text-sm">Each Arc instantiation inherits the same genesis constitution but remains sovereign—digital nations in constellation.</p>
              </div>
              
              <div className="bg-gradient-to-br from-red-900/30 to-orange-900/30 p-4 rounded border border-red-400/30">
                <h4 className="font-bold text-red-400 mb-2">ADAM Protocol</h4>
                <p className="text-sm">The cortex that learns from outcomes and rewrites rules over time, connecting governance to performance.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConceptualExplanation;
