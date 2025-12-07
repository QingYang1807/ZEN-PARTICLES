import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import Particles from './components/Particles';
import HandTracker from './components/HandTracker';
import UI from './components/UI';
import HUD from './components/HUD';

const App: React.FC = () => {
  return (
    <div className="w-full h-screen relative bg-black overflow-hidden">
      {/* 3D Scene */}
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }} gl={{ antialias: true }}>
        <color attach="background" args={['#050505']} />
        
        {/* Lights */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ff0055" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#00ccff" />

        <Suspense fallback={null}>
          <Particles />
          <Environment preset="city" />
        </Suspense>

        <OrbitControls 
          enableZoom={true} 
          enablePan={false} 
          autoRotate={true} 
          autoRotateSpeed={0.5} 
          maxDistance={20}
          minDistance={2}
        />
      </Canvas>

      {/* Logic & UI Layers */}
      <HandTracker />
      <HUD />
      <UI />
    </div>
  );
};

export default App;