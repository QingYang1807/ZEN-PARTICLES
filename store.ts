import { create } from 'zustand';
import { ShapeType, ParticleState } from './types';

export type Language = 'en' | 'zh';

interface AppStore extends ParticleState {
  language: Language;
  setLanguage: (lang: Language) => void;
  setShape: (shape: ShapeType) => void;
  setColor: (color: string) => void;
  setExpansion: (expansion: number) => void;
  setParticleCount: (count: number) => void;
  setIsHandTracking: (isTracking: boolean) => void;
  setIsAiConnected: (isConnected: boolean) => void;
  setHandCoords: (coords: { left: { x: number; y: number } | null; right: { x: number; y: number } | null }) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  language: 'zh',
  shape: ShapeType.HEART,
  color: '#00ccff', // Default to Iron Man Cyan
  expansion: 0.5,
  particleCount: 15000,
  isHandTracking: false,
  isAiConnected: false,
  handCoords: { left: null, right: null },
  setLanguage: (language) => set({ language }),
  setShape: (shape) => set({ shape }),
  setColor: (color) => set({ color }),
  setExpansion: (expansion) => set({ expansion }),
  setParticleCount: (particleCount) => set({ particleCount }),
  setIsHandTracking: (isHandTracking) => set({ isHandTracking }),
  setIsAiConnected: (isAiConnected) => set({ isAiConnected }),
  setHandCoords: (handCoords) => set({ handCoords }),
}));