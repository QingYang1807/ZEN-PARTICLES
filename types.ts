export enum ShapeType {
  SPHERE = 'Sphere',
  HEART = 'Heart',
  FLOWER = 'Flower',
  SATURN = 'Saturn',
  BUDDHA = 'Buddha',
  FIREWORKS = 'Fireworks',
}

export interface ParticleState {
  shape: ShapeType;
  color: string;
  expansion: number; // 0 to 1 (Controlled by hand or slider)
  particleCount: number;
  isHandTracking: boolean;
  isAiConnected: boolean;
}

export interface HandLandmark {
  x: number;
  y: number;
  z: number;
}
