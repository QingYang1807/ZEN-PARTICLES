import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store';

const HUD: React.FC = () => {
  const { handCoords, isHandTracking, expansion } = useAppStore();
  const [rotation, setRotation] = useState(0);

  // Constant rotation for UI elements
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(r => (r + 0.2) % 360);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  const toX = (val: number) => `${(1 - val) * 100}%`;
  const toY = (val: number) => `${val * 100}%`;

  // Generate random data blocks
  const dataLines = Array.from({ length: 6 }).map((_, i) => (
    <div key={i} className="flex justify-between text-[8px] text-cyan-500/60 font-tech mb-1">
      <span>{`0x${Math.floor(Math.random()*1000).toString(16).toUpperCase()}`}</span>
      <span>{Math.floor(Math.random() * 100)}%</span>
    </div>
  ));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20 select-none">
      
      {/* 1. Global Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 204, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 204, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
          maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
        }}
      />

      {/* 2. Central Arc Reactor Ring (Background) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-10 rounded-full border border-cyan-500/30"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[580px] opacity-10 rounded-full border-t border-b border-cyan-500 animate-spin-slow"></div>

      <svg className="w-full h-full relative z-10">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0, 204, 255, 0.05)" strokeWidth="0.5"/>
          </pattern>
        </defs>

        {/* Center Target */}
        <g transform="translate(window.innerWidth / 2, window.innerHeight / 2)">
             <circle r="100" stroke="rgba(0,204,255,0.1)" fill="none" />
             <path d="M-20,0 L-10,0 M10,0 L20,0 M0,-20 L0,-10 M0,10 L0,20" stroke="#00ccff" strokeWidth="2" />
        </g>

        {/* Hand Visuals */}
        {isHandTracking && (
          <>
            {/* Left Hand Complex Reticle */}
            {handCoords.left && (
              <g filter="url(#glow)">
                 <g style={{ transformOrigin: `${toX(handCoords.left.x)} ${toY(handCoords.left.y)}`, transform: `rotate(${rotation * 2}deg)` }}>
                    <circle cx={toX(handCoords.left.x)} cy={toY(handCoords.left.y)} r="35" stroke="#00ccff" strokeWidth="1" strokeDasharray="10 5" fill="none" opacity="0.6" />
                    <circle cx={toX(handCoords.left.x)} cy={toY(handCoords.left.y)} r="45" stroke="#00ccff" strokeWidth="0.5" strokeDasharray="2 10" fill="none" opacity="0.4" />
                 </g>
                 
                 {/* Target Brackets */}
                 <path d={`M${(1-handCoords.left.x)*100}%,${handCoords.left.y*100}% m-20,-20 l10,0 l0,10`} stroke="#00ccff" fill="none" strokeWidth="2" />
                 <path d={`M${(1-handCoords.left.x)*100}%,${handCoords.left.y*100}% m20,-20 l-10,0 l0,10`} stroke="#00ccff" fill="none" strokeWidth="2" />
                 <path d={`M${(1-handCoords.left.x)*100}%,${handCoords.left.y*100}% m-20,20 l10,0 l0,-10`} stroke="#00ccff" fill="none" strokeWidth="2" />
                 <path d={`M${(1-handCoords.left.x)*100}%,${handCoords.left.y*100}% m20,20 l-10,0 l0,-10`} stroke="#00ccff" fill="none" strokeWidth="2" />

                 <text x={toX(handCoords.left.x)} y={toY(handCoords.left.y)} dx="50" dy="-20" fill="#00ccff" fontSize="10" className="font-tech">
                    L_MANIPULATOR
                 </text>
                 <text x={toX(handCoords.left.x)} y={toY(handCoords.left.y)} dx="50" dy="-8" fill="rgba(0,204,255,0.7)" fontSize="8" className="font-tech">
                    X: {handCoords.left.x.toFixed(3)} | Y: {handCoords.left.y.toFixed(3)}
                 </text>
                 <line x1={toX(handCoords.left.x)} y1={toY(handCoords.left.y)} x2="50%" y2="50%" stroke="rgba(0,204,255,0.2)" strokeWidth="1" strokeDasharray="2 4" />
              </g>
            )}

            {/* Right Hand Complex Reticle */}
            {handCoords.right && (
              <g filter="url(#glow)">
                 <g style={{ transformOrigin: `${toX(handCoords.right.x)} ${toY(handCoords.right.y)}`, transform: `rotate(-${rotation * 2}deg)` }}>
                    <circle cx={toX(handCoords.right.x)} cy={toY(handCoords.right.y)} r="35" stroke="#00ccff" strokeWidth="1" strokeDasharray="10 5" fill="none" opacity="0.6" />
                    <circle cx={toX(handCoords.right.x)} cy={toY(handCoords.right.y)} r="45" stroke="#00ccff" strokeWidth="0.5" strokeDasharray="2 10" fill="none" opacity="0.4" />
                 </g>

                 {/* Target Brackets */}
                 <path d={`M${(1-handCoords.right.x)*100}%,${handCoords.right.y*100}% m-20,-20 l10,0 l0,10`} stroke="#00ccff" fill="none" strokeWidth="2" />
                 <path d={`M${(1-handCoords.right.x)*100}%,${handCoords.right.y*100}% m20,-20 l-10,0 l0,10`} stroke="#00ccff" fill="none" strokeWidth="2" />
                 <path d={`M${(1-handCoords.right.x)*100}%,${handCoords.right.y*100}% m-20,20 l10,0 l0,-10`} stroke="#00ccff" fill="none" strokeWidth="2" />
                 <path d={`M${(1-handCoords.right.x)*100}%,${handCoords.right.y*100}% m20,20 l-10,0 l0,-10`} stroke="#00ccff" fill="none" strokeWidth="2" />

                 <text x={toX(handCoords.right.x)} y={toY(handCoords.right.y)} dx="-100" dy="-20" fill="#00ccff" fontSize="10" className="font-tech" textAnchor="end">
                    R_MANIPULATOR
                 </text>
                 <text x={toX(handCoords.right.x)} y={toY(handCoords.right.y)} dx="-100" dy="-8" fill="rgba(0,204,255,0.7)" fontSize="8" className="font-tech" textAnchor="end">
                    X: {handCoords.right.x.toFixed(3)} | Y: {handCoords.right.y.toFixed(3)}
                 </text>
                 <line x1={toX(handCoords.right.x)} y1={toY(handCoords.right.y)} x2="50%" y2="50%" stroke="rgba(0,204,255,0.2)" strokeWidth="1" strokeDasharray="2 4" />
              </g>
            )}

            {/* Connection Data Beam */}
            {handCoords.left && handCoords.right && (
              <g filter="url(#glow)">
                <defs>
                   <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgba(0,204,255,0)" />
                      <stop offset="50%" stopColor="rgba(0,204,255,0.8)" />
                      <stop offset="100%" stopColor="rgba(0,204,255,0)" />
                   </linearGradient>
                </defs>
                <line 
                  x1={toX(handCoords.left.x)} y1={toY(handCoords.left.y)} 
                  x2={toX(handCoords.right.x)} y2={toY(handCoords.right.y)} 
                  stroke="url(#beamGrad)" strokeWidth="1"
                />
                
                {/* Distance Widget at Midpoint */}
                <foreignObject x="45%" y="45%" width="10%" height="10%" style={{ overflow: 'visible' }}>
                    <div className="flex flex-col items-center justify-center -translate-y-1/2">
                        <div className="bg-black/80 border border-cyan-400 px-2 py-1 rounded-sm backdrop-blur-md">
                            <span className="text-cyan-400 font-tech text-xs tracking-widest">
                                D: {(expansion * 100).toFixed(1)}%
                            </span>
                        </div>
                    </div>
                </foreignObject>
              </g>
            )}
          </>
        )}
      </svg>
      
      {/* 3. Floating Data Widgets (Simulated Projections) */}
      <div className="absolute top-1/4 left-12 w-48 p-4 glass-panel transform -skew-x-12 opacity-80 hidden md:block">
        <div className="text-cyan-400 text-[10px] tracking-widest border-b border-cyan-500/50 pb-1 mb-2">SYS_DIAGNOSTICS</div>
        {dataLines}
        <div className="mt-2 h-1 w-full bg-cyan-900/50 overflow-hidden">
            <div className="h-full bg-cyan-400 animate-pulse w-2/3"></div>
        </div>
      </div>

      <div className="absolute bottom-1/4 right-12 w-48 p-4 glass-panel transform skew-x-12 opacity-80 hidden md:block">
        <div className="text-cyan-400 text-[10px] tracking-widest border-b border-cyan-500/50 pb-1 mb-2">CORE_WAVEFORM</div>
        <div className="flex items-end gap-1 h-12">
            {[40, 70, 30, 80, 50, 90, 20, 60, 40, 70].map((h, i) => (
                <div key={i} className="flex-1 bg-cyan-500/50 hover:bg-cyan-400 transition-all" style={{ height: `${h}%` }}></div>
            ))}
        </div>
      </div>

      {/* 4. Scanning Line Effect */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-10 animate-scan" style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(0,204,255,0.5) 50%, transparent 100%)', height: '10%' }}></div>
      
      {/* 5. Corner HUD Elements */}
      <div className="absolute top-0 left-0 p-8">
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
             <path d="M0 20 L20 0 L100 0" stroke="#00ccff" strokeWidth="1" fill="none" strokeOpacity="0.5" />
             <rect x="0" y="25" width="5" height="20" fill="#00ccff" opacity="0.6" />
          </svg>
      </div>
      <div className="absolute bottom-0 right-0 p-8 transform rotate-180">
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
             <path d="M0 20 L20 0 L100 0" stroke="#00ccff" strokeWidth="1" fill="none" strokeOpacity="0.5" />
             <rect x="0" y="25" width="5" height="20" fill="#00ccff" opacity="0.6" />
          </svg>
      </div>

    </div>
  );
};

export default HUD;