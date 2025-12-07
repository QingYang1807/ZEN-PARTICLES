import React from 'react';
import { useAppStore } from '../store';

const HUD: React.FC = () => {
  const { handCoords, isHandTracking, expansion } = useAppStore();

  // Helper to convert normalized coordinates (0-1) to percentage strings
  // We mirror X because the user sees themselves as a mirror
  const toX = (val: number) => `${(1 - val) * 100}%`;
  const toY = (val: number) => `${val * 100}%`;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      <svg className="w-full h-full">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Central HUD Ring (Static) */}
        <circle cx="50%" cy="50%" r="20%" stroke="rgba(0, 204, 255, 0.1)" strokeWidth="1" fill="none" />
        <circle cx="50%" cy="50%" r="15%" stroke="rgba(0, 204, 255, 0.05)" strokeWidth="1" fill="none" strokeDasharray="10,10" className="animate-spin-slow" />

        {/* Hand Tracking Visuals */}
        {isHandTracking && (
          <>
            {/* Left Hand Target */}
            {handCoords.left && (
              <g filter="url(#glow)">
                <circle cx={toX(handCoords.left.x)} cy={toY(handCoords.left.y)} r="20" stroke="#00ccff" strokeWidth="2" fill="rgba(0, 204, 255, 0.1)" />
                <circle cx={toX(handCoords.left.x)} cy={toY(handCoords.left.y)} r="30" stroke="#00ccff" strokeWidth="1" fill="none" strokeDasharray="5,5" className="animate-spin" />
                <text x={toX(handCoords.left.x)} y={toY(handCoords.left.y)} dx="35" dy="5" fill="#00ccff" fontSize="10" fontFamily="Rajdhani">L_HAND // ACT</text>
              </g>
            )}

            {/* Right Hand Target */}
            {handCoords.right && (
              <g filter="url(#glow)">
                <circle cx={toX(handCoords.right.x)} cy={toY(handCoords.right.y)} r="20" stroke="#00ccff" strokeWidth="2" fill="rgba(0, 204, 255, 0.1)" />
                <circle cx={toX(handCoords.right.x)} cy={toY(handCoords.right.y)} r="30" stroke="#00ccff" strokeWidth="1" fill="none" strokeDasharray="5,5" className="animate-spin" />
                <text x={toX(handCoords.right.x)} y={toY(handCoords.right.y)} dx="35" dy="5" fill="#00ccff" fontSize="10" fontFamily="Rajdhani">R_HAND // ACT</text>
              </g>
            )}

            {/* Connection Line (Expansion Visual) */}
            {handCoords.left && handCoords.right && (
              <>
                <line 
                  x1={toX(handCoords.left.x)} y1={toY(handCoords.left.y)} 
                  x2={toX(handCoords.right.x)} y2={toY(handCoords.right.y)} 
                  stroke="#00ccff" strokeWidth="2" strokeOpacity="0.6"
                  filter="url(#glow)"
                />
                {/* Data readout on line */}
                <text 
                  x="50%" y="50%" textAnchor="middle" dy="-20"
                  fill="#fff" fontSize="12" fontFamily="Rajdhani" fontWeight="bold" letterSpacing="2px"
                >
                  EXPANSION: {(expansion * 100).toFixed(0)}%
                </text>
              </>
            )}
          </>
        )}
      </svg>
      
      {/* Corner Brackets */}
      <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-cyan-400 opacity-50"></div>
      <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-cyan-400 opacity-50"></div>
      <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-cyan-400 opacity-50"></div>
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-cyan-400 opacity-50"></div>
    </div>
  );
};

export default HUD;