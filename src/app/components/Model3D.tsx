"use client";

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, PresentationControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

function CyborgModel() {
  const modelRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/cyborg_relax.glb');
  
  // Clone the scene to prevent issues
  const clonedScene = React.useMemo(() => scene.clone(), [scene]);

  // Add a subtle rotation animation
  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  return (
    <primitive 
      ref={modelRef}
      object={clonedScene} 
      scale={1.8} 
      position={[0, -1, 0]} 
    />
  );
}

export default function Model3D() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ height: '100vh', width: '100vw' }}
      >
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        
        <PresentationControls
          global
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 8, Math.PI / 8]}
          azimuth={[-Math.PI / 4, Math.PI / 4]}
          speed={1}
          zoom={1}
          snap={true}
        >
          <CyborgModel />
        </PresentationControls>
        
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}

// Preload the model
useGLTF.preload('/cyborg_relax.glb'); 