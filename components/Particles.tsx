import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppStore } from '../store';
import { generateParticles } from '../utils/geometry';
import { ShapeType } from '../types';

const Particles: React.FC = () => {
  const { shape, color, expansion, particleCount } = useAppStore();
  const meshRef = useRef<THREE.Points>(null);
  
  // Buffers
  const [positions, currentPositions] = useMemo(() => {
    const target = generateParticles(shape, particleCount);
    const current = new Float32Array(particleCount * 3);
    // Initialize current positions randomly
    for(let i=0; i<current.length; i++) current[i] = (Math.random() - 0.5) * 10;
    return [target, current];
  }, [shape, particleCount]);

  // Uniforms for shader
  const uniforms = useMemo(() => ({
    uColor: { value: new THREE.Color(color) },
    uTime: { value: 0 },
    uSize: { value: 0.15 },
    uExpansion: { value: 0 },
  }), []);

  // Update loop
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uColor.value.set(color);
    
    // Smoothly interpolate expansion uniform
    uniforms.uExpansion.value = THREE.MathUtils.lerp(uniforms.uExpansion.value, expansion, delta * 3);

    // Physics Animation: Lerp points towards target shape
    const positionsAttribute = meshRef.current.geometry.attributes.position;
    const array = positionsAttribute.array as Float32Array;
    
    // Animate target generation slightly for Fireworks
    const isFireworks = shape === ShapeType.FIREWORKS;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Target coordinates
        let tx = positions[i3];
        let ty = positions[i3 + 1];
        let tz = positions[i3 + 2];

        // Apply Expansion/Explosion math
        const exp = uniforms.uExpansion.value;
        
        // If fireworks, we continuously expand out
        if (isFireworks) {
             const speed = 0.5 + (Math.sin(i) * 0.2);
             // Reset periodically
             const loopT = (time * speed) % 2;
             tx *= (1 + loopT * 3);
             ty *= (1 + loopT * 3);
             tz *= (1 + loopT * 3);
             
             // Gravity effect
             ty -= loopT * loopT * 2;
        } else {
            // Normal Expansion: Spread points out from center based on hand distance
            tx *= (1 + exp * 2);
            ty *= (1 + exp * 2);
            tz *= (1 + exp * 2);
            
            // Add some noise based on expansion to "shatter" the model
            if (exp > 0.8) {
                tx += (Math.random() - 0.5) * exp;
                ty += (Math.random() - 0.5) * exp;
                tz += (Math.random() - 0.5) * exp;
            }
        }

        // Lerp current position to target
        array[i3] += (tx - array[i3]) * 3 * delta;
        array[i3 + 1] += (ty - array[i3 + 1]) * 3 * delta;
        array[i3 + 2] += (tz - array[i3 + 2]) * 3 * delta;
    }

    positionsAttribute.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={currentPositions}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        fragmentShader={`
          uniform vec3 uColor;
          varying float vDistance;
          void main() {
            // Circular particle
            vec2 cxy = 2.0 * gl_PointCoord - 1.0;
            float r = dot(cxy, cxy);
            if (r > 1.0) discard;
            
            // Soft glow
            float alpha = 1.0 - r;
            alpha = pow(alpha, 1.5); // sharpen
            
            gl_FragColor = vec4(uColor, alpha);
          }
        `}
        vertexShader={`
          uniform float uSize;
          varying float vDistance;
          void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            vDistance = -mvPosition.z;
            gl_PointSize = uSize * (300.0 / -mvPosition.z);
          }
        `}
        uniforms={uniforms}
        transparent
      />
    </points>
  );
};

export default Particles;
