import React, { useState } from 'react';
import { useAppStore } from '../store';
import { ShapeType } from '../types';
import { Mic, MicOff, Hand, Cpu, Settings, X, Activity, Globe, Info } from 'lucide-react';
import { connectToGemini, disconnectGemini } from '../services/geminiService';

const UI: React.FC = () => {
  const { 
    shape, setShape, 
    color, setColor, 
    isHandTracking, 
    isAiConnected, 
    expansion, setExpansion 
  } = useAppStore();
  
  const [showManual, setShowManual] = useState(false);

  const toggleAi = () => {
    if (isAiConnected) {
      disconnectGemini();
    } else {
      connectToGemini();
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-8 font-['Rajdhani']">
      
      {/* --- TOP BAR --- */}
      <div className="flex justify-between items-start pointer-events-auto z-30">
        <div className="flex flex-col">
          <h1 className="text-cyan-400 text-4xl font-bold tracking-[0.2em] drop-shadow-[0_0_10px_rgba(0,204,255,0.8)]">
            JARVIS<span className="text-white text-sm ml-2 opacity-80">SYS.ONLINE</span>
          </h1>
          <div className="flex gap-4 mt-2 text-xs text-cyan-200/60 font-mono">
            <span>CPU: OPTIMAL</span>
            <span>NET: CONNECTED</span>
            <span>SEC: ENCRYPTED</span>
          </div>
        </div>
        
        <button 
          onClick={() => setShowManual(true)}
          className="group flex items-center gap-2 px-6 py-2 bg-cyan-900/20 border border-cyan-500/50 rounded-tl-xl rounded-br-xl hover:bg-cyan-500/20 transition-all backdrop-blur-md"
        >
          <Info size={18} className="text-cyan-400 group-hover:animate-pulse" />
          <span className="text-cyan-300 text-sm tracking-widest font-bold">MANUAL</span>
        </button>
      </div>

      {/* --- SIDE PANELS --- */}
      <div className="flex flex-1 relative mt-10 mb-10">
        
        {/* Left Panel: Shapes */}
        <div className="absolute left-0 top-10 pointer-events-auto">
          <div className="flex flex-col gap-2 p-4 bg-black/60 border-l-2 border-cyan-500/50 backdrop-blur-md rounded-r-xl w-48 shadow-[0_0_20px_rgba(0,0,0,0.5)] transform transition-transform hover:translate-x-2">
            <h3 className="text-cyan-400 text-xs tracking-widest border-b border-cyan-800 pb-2 mb-2 flex items-center gap-2">
              <Globe size={12} /> PROJECTOR_CONFIG
            </h3>
            {Object.values(ShapeType).map((s) => (
              <button
                key={s}
                onClick={() => setShape(s)}
                className={`text-left px-3 py-2 text-sm uppercase tracking-wider transition-all border-l-2 ${
                  shape === s 
                  ? 'border-cyan-400 bg-cyan-500/20 text-white shadow-[0_0_10px_rgba(0,204,255,0.3)]' 
                  : 'border-transparent text-cyan-200/50 hover:text-cyan-100 hover:bg-cyan-900/20'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel: Colors */}
        <div className="absolute right-0 top-10 pointer-events-auto">
          <div className="flex flex-col gap-3 p-4 bg-black/60 border-r-2 border-cyan-500/50 backdrop-blur-md rounded-l-xl w-20 items-center shadow-[0_0_20px_rgba(0,0,0,0.5)] transform transition-transform hover:-translate-x-2">
             <h3 className="text-cyan-400 text-[10px] tracking-widest text-center mb-1">CHROMATIC</h3>
             {['#00ccff', '#ff0055', '#ffaa00', '#cc00ff', '#00ffaa', '#ffffff'].map(c => (
                 <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full border border-white/20 transition-all relative group ${
                        color === c ? 'scale-110 shadow-[0_0_15px_currentColor]' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: c, color: c }}
                 >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-full"></div>
                 </button>
             ))}
             <input 
                type="color" 
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-8 h-8 rounded-full overflow-hidden opacity-50 hover:opacity-100 cursor-pointer"
             />
          </div>
        </div>
      </div>

      {/* --- BOTTOM HUD --- */}
      <div className="flex flex-col items-center gap-6 pointer-events-auto z-30 pb-4">
        
        {/* Arc Reactor / AI Button */}
        <div className="relative group">
            <div className={`absolute inset-0 rounded-full blur-xl transition-all duration-500 ${isAiConnected ? 'bg-red-500/40' : 'bg-cyan-500/20'}`}></div>
            <button
                onClick={toggleAi}
                className={`relative w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.5)] ${
                    isAiConnected 
                    ? 'border-red-500 bg-red-900/20 text-red-100 shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse' 
                    : 'border-cyan-500/60 bg-black/60 text-cyan-400 hover:scale-105 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,204,255,0.4)]'
                }`}
            >
                <div className="absolute inset-1 border border-dashed border-white/20 rounded-full animate-spin-slow"></div>
                {isAiConnected ? <Mic size={28} /> : <Cpu size={28} />}
            </button>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                 <span className={`text-xs font-bold tracking-[0.2em] ${isAiConnected ? 'text-red-400' : 'text-cyan-600'}`}>
                    {isAiConnected ? 'VOICE: ACTIVE' : 'VOICE: STANDBY'}
                 </span>
            </div>
        </div>

        {/* Tracking Status */}
        <div className="flex gap-6 items-center bg-black/80 border-t border-cyan-900/50 px-8 py-3 rounded-t-2xl backdrop-blur-xl">
             <div className={`flex items-center gap-3 ${isHandTracking ? 'text-green-400' : 'text-red-400/50'}`}>
                 <Activity size={18} className={isHandTracking ? 'animate-bounce' : ''} />
                 <span className="text-sm font-bold tracking-widest">
                     {isHandTracking ? 'SENSORS_LOCKED' : 'SEARCHING...'}
                 </span>
             </div>
             <div className="h-4 w-px bg-white/10"></div>
             <div className="flex items-center gap-2 text-cyan-500/60">
                <span className="text-xs">EXPANSION_VAL:</span>
                <span className="text-cyan-300 font-mono">{(expansion * 100).toFixed(0)}%</span>
             </div>
             
             {/* Slider Backup */}
             {!isHandTracking && (
                 <input 
                    type="range" 
                    min="0" max="1" step="0.01" 
                    value={expansion}
                    onChange={(e) => setExpansion(parseFloat(e.target.value))}
                    className="w-24 h-1 bg-cyan-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
             )}
        </div>
      </div>

      {/* --- OPERATION MANUAL MODAL --- */}
      {showManual && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-auto">
            <div className="relative w-full max-w-2xl bg-black/90 border border-cyan-500/50 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,204,255,0.2)] overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
                <div className="absolute bottom-0 right-0 p-4 opacity-20">
                    <Cpu size={120} className="text-cyan-500" />
                </div>

                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-8 border-b border-cyan-900 pb-4">
                        <h2 className="text-3xl text-white font-bold tracking-widest flex items-center gap-3">
                            <Settings className="text-cyan-400" />
                            PROTOCOL_MANUAL_01
                        </h2>
                        <button onClick={() => setShowManual(false)} className="text-cyan-600 hover:text-white transition-colors">
                            <X size={32} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-cyan-100">
                        {/* Gestures */}
                        <div className="space-y-4">
                            <h3 className="text-cyan-400 text-lg font-bold uppercase tracking-widest border-l-4 border-cyan-500 pl-3">
                                Hand Gestures
                            </h3>
                            <div className="bg-cyan-900/20 p-4 rounded-lg border border-cyan-500/20">
                                <div className="flex items-center gap-3 mb-2 text-white font-bold">
                                    <Hand size={20} className="text-cyan-400" />
                                    <span>EXPAND / CONTRACT</span>
                                </div>
                                <p className="text-sm text-cyan-200/70 leading-relaxed">
                                    Show <b>two hands</b> to the camera. Move them apart to expand the particle galaxy. Bring them close to condense it.
                                </p>
                            </div>
                        </div>

                        {/* Voice */}
                        <div className="space-y-4">
                            <h3 className="text-cyan-400 text-lg font-bold uppercase tracking-widest border-l-4 border-cyan-500 pl-3">
                                Voice Command
                            </h3>
                            <div className="bg-cyan-900/20 p-4 rounded-lg border border-cyan-500/20">
                                <div className="flex items-center gap-3 mb-2 text-white font-bold">
                                    <Mic size={20} className="text-cyan-400" />
                                    <span>AI INTERFACE</span>
                                </div>
                                <p className="text-sm text-cyan-200/70 leading-relaxed">
                                    Click the Arc Reactor button. Speak naturally: <br/>
                                    <span className="italic text-cyan-400">"Show me a red heart"</span><br/>
                                    <span className="italic text-cyan-400">"It's Christmas time"</span>
                                </p>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="md:col-span-2 space-y-4">
                             <h3 className="text-cyan-400 text-lg font-bold uppercase tracking-widest border-l-4 border-cyan-500 pl-3">
                                Manual Override
                            </h3>
                            <p className="text-sm text-cyan-200/70">
                                Use the left holographic panel to select shapes (Saturn, Buddha, Flowers). Use the right chromatic panel to adjust photon frequency (Color).
                            </p>
                        </div>
                    </div>
                    
                    <div className="mt-8 text-center">
                        <button 
                            onClick={() => setShowManual(false)}
                            className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold tracking-[0.2em] rounded-sm transition-all shadow-[0_0_20px_rgba(0,204,255,0.4)]"
                        >
                            ACKNOWLEDGE
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default UI;