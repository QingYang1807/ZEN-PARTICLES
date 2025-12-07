import * as THREE from 'three';
import { ShapeType } from '../types';

export const generateParticles = (shape: ShapeType, count: number): Float32Array => {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    let x = 0, y = 0, z = 0;
    const idx = i * 3;

    switch (shape) {
      case ShapeType.HEART:
        // Heart shape parametric equation
        const t = Math.random() * Math.PI * 2;
        const r = Math.pow(Math.random(), 0.3); // Bias towards surface
        // Scale factor
        const s = 1.5; 
        x = s * 16 * Math.pow(Math.sin(t), 3) * r;
        y = s * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * r;
        z = (Math.random() - 0.5) * 4 * r;
        break;

      case ShapeType.FLOWER:
        // Rose curve / Flower
        const theta = Math.random() * Math.PI * 2;
        const phi = (Math.random() - 0.5) * Math.PI;
        const k = 5; // Petals
        const rad = 3 * Math.cos(k * theta) + 1;
        
        x = rad * Math.cos(theta) * Math.cos(phi);
        y = rad * Math.sin(theta) * Math.cos(phi);
        z = (Math.random() - 0.5) * 2;
        break;

      case ShapeType.SATURN:
        // Planet + Ring
        if (Math.random() > 0.4) {
          // Planet
          const rSat = 2 * Math.pow(Math.random(), 1/3);
          const thetaSat = Math.random() * Math.PI * 2;
          const phiSat = Math.acos(2 * Math.random() - 1);
          x = rSat * Math.sin(phiSat) * Math.cos(thetaSat);
          y = rSat * Math.sin(phiSat) * Math.sin(thetaSat);
          z = rSat * Math.cos(phiSat);
        } else {
          // Ring
          const innerR = 3;
          const outerR = 6;
          const ringR = innerR + Math.random() * (outerR - innerR);
          const ringTheta = Math.random() * Math.PI * 2;
          x = ringR * Math.cos(ringTheta);
          z = ringR * Math.sin(ringTheta);
          y = (Math.random() - 0.5) * 0.2; // Thin ring
          
          // Tilt
          const tilt = Math.PI / 6;
          const oldY = y;
          const oldZ = z;
          y = oldY * Math.cos(tilt) - oldZ * Math.sin(tilt);
          z = oldY * Math.sin(tilt) + oldZ * Math.cos(tilt);
        }
        break;

      case ShapeType.BUDDHA:
        // Simplified Meditating Figure Approximation
        const part = Math.random();
        if (part < 0.3) {
          // Head
          const rHead = 0.8;
          const th = Math.random() * Math.PI * 2;
          const ph = Math.acos(2 * Math.random() - 1);
          x = rHead * Math.sin(ph) * Math.cos(th);
          y = rHead * Math.sin(ph) * Math.sin(th) + 2.5;
          z = rHead * Math.cos(ph);
        } else if (part < 0.8) {
          // Body (Ovoid)
          const rBody = 1.6;
          const th = Math.random() * Math.PI * 2;
          const ph = Math.acos(2 * Math.random() - 1);
          x = rBody * Math.sin(ph) * Math.cos(th);
          y = rBody * Math.sin(ph) * Math.sin(th) * 1.2;
          z = rBody * Math.cos(ph) * 0.8;
        } else {
          // Legs/Base
          const rBase = 2.5 * Math.sqrt(Math.random());
          const th = Math.random() * Math.PI * 2;
          x = rBase * Math.cos(th);
          z = rBase * Math.sin(th);
          y = -1.5 + (Math.random() * 0.5);
        }
        break;

      case ShapeType.FIREWORKS:
         // Sphere shell mostly
         const rFire = 0.2 + (Math.random() * 3); // varied radii
         const thFire = Math.random() * Math.PI * 2;
         const phFire = Math.acos(2 * Math.random() - 1);
         x = rFire * Math.sin(phFire) * Math.cos(thFire);
         y = rFire * Math.sin(phFire) * Math.sin(thFire);
         z = rFire * Math.cos(phFire);
         break;

      default: // SPHERE
        const rSphere = 3 * Math.pow(Math.random(), 1/3);
        const thSphere = Math.random() * Math.PI * 2;
        const phSphere = Math.acos(2 * Math.random() - 1);
        x = rSphere * Math.sin(phSphere) * Math.cos(thSphere);
        y = rSphere * Math.sin(phSphere) * Math.sin(thSphere);
        z = rSphere * Math.cos(phSphere);
        break;
    }

    positions[idx] = x;
    positions[idx + 1] = y;
    positions[idx + 2] = z;
  }
  return positions;
};
