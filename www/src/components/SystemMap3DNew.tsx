import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, useProgress, Text } from '@react-three/drei';
import * as THREE from 'three';

// --- Node Icon Map (SVGs or PNGs in /public/icons/) ---
const nodeIcons = {
  core: '/icons/core.svg',
  quantum: '/icons/quantum.svg',
  ai: '/icons/ai.svg',
  backend: '/icons/backend.svg',
};

// --- Data Model ---
const systemNodes = [
  {
    id: 'core',
    name: 'Artifact Virtual Core',
    type: 'core',
    position: [0, 0, 0],
    icon: nodeIcons.core,
    size: 2.2,
    status: 'processing',
    children: [
      {
        id: 'quantum',
        name: 'Quantum Engine',
        type: 'quantum',
        position: [5, 2, -3],
        icon: nodeIcons.quantum,
        size: 1.2,
        status: 'processing',
      },
      {
        id: 'ai',
        name: 'AI Abstraction',
        type: 'ai',
        position: [-4, 3, 1],
        icon: nodeIcons.ai,
        size: 1.1,
        status: 'online',
      },
      {
        id: 'backend',
        name: 'Quantum Backend',
        type: 'backend',
        position: [0, -5, 2],
        icon: nodeIcons.backend,
        size: 1.1,
        status: 'idle',
      },
    ],
  },
];

// --- Loader ---
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div style={{ color: 'white', fontSize: 18 }}>Loading {progress.toFixed(0)}%</div>
    </Html>
  );
}

// --- Node Component with Icon ---
function Node({ node, onClick }: any) {
  const mesh = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.008;
      mesh.current.scale.setScalar(hovered ? 1.15 : 1);
    }
  });
  return (
    <group position={node.position}>
      <mesh
        ref={mesh}
        onClick={() => onClick(node)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[node.size, 32, 32]} />
        <meshStandardMaterial color={'#222'} emissive={'#222'} emissiveIntensity={hovered ? 0.5 : 0.15} transparent opacity={hovered ? 0.95 : 0.8} />
      </mesh>
      {/* Icon overlay */}
      <Html center style={{ pointerEvents: 'none' }}>
        <img src={node.icon} alt={node.type} style={{ width: 48 * node.size, height: 48 * node.size, filter: hovered ? 'drop-shadow(0 0 8px #fff)' : 'drop-shadow(0 0 2px #888)' }} />
      </Html>
      <Text
        position={[0, node.size + 0.7, 0]}
        fontSize={0.35}
        color={hovered ? '#fff' : '#aaa'}
        anchorX="center"
        anchorY="middle"
        outlineColor="#000"
        outlineWidth={0.01}
      >
        {node.name}
      </Text>
    </group>
  );
}

// --- Main Scene ---
function SystemScene({ nodes, onNodeClick }: any) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 10]} intensity={0.7} castShadow />
      <OrbitControls enablePan enableZoom enableRotate />
      {nodes.map((node: any) => (
        <React.Fragment key={node.id}>
          <Node node={node} onClick={onNodeClick} />
          {node.children && node.children.map((child: any) => (
            <>
              {/* Connection line */}
              <mesh key={child.id + '-line'}>
                <cylinderGeometry args={[0.04, 0.04, new THREE.Vector3(...child.position).distanceTo(new THREE.Vector3(...node.position)), 16]} />
                <meshStandardMaterial color="#888" opacity={0.5} transparent />
                <group position={node.position} />
              </mesh>
              <Node node={child} onClick={onNodeClick} />
            </>
          ))}
        </React.Fragment>
      ))}
    </>
  );
}

// --- Main Container ---
const SystemMap3DContainer = () => {
  const [selected, setSelected] = useState(null);
  return (
    <section id="systemmap" className="relative min-h-[60vh] w-full bg-black overflow-hidden">
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-md border border-white/10 rounded-lg px-6 py-3">
          <span className="text-white/80 text-lg font-light tracking-wider">System Map</span>
        </div>
      </div>
      <div className="h-[70vh] w-full">
        <Suspense fallback={<Loader />}>
          <Canvas shadows camera={{ position: [0, 0, 13], fov: 60 }} style={{ background: 'transparent' }}>
            <SystemScene nodes={systemNodes} onNodeClick={setSelected} />
          </Canvas>
        </Suspense>
      </div>
      {/* Info Panel */}
      {selected && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 border border-white/10 rounded-lg px-8 py-4 z-20">
          <div className="text-white text-lg font-semibold mb-2">{selected.name}</div>
          <div className="text-white/70 text-sm">Type: {selected.type}</div>
          <div className="text-white/70 text-sm">Status: {selected.status}</div>
          <button className="mt-3 px-4 py-1 rounded bg-white/10 text-white hover:bg-white/20" onClick={() => setSelected(null)}>Close</button>
        </div>
      )}
    </section>
  );
};

export default SystemMap3DContainer;
