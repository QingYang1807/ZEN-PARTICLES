import React, { useState } from 'react';
import { useAppStore } from '../store';
import { ShapeType } from '../types';
import { Mic, MicOff, Hand, Menu, X, Wand2 } from 'lucide-react';
import { connectToGemini, disconnectGemini } from '../services/geminiService';

const UI: React.FC = () => {
  const { 
    shape, setShape, 
    color, setColor, 
    isHandTracking, 
    isAiConnected, 
    expansion, setExpansion 
  } = useAppStore();
  
  const [isOpen, setIsOpen] = useState(true);

  const toggleAi = () => {
    if (isAiConnected) {
      disconnectGemini();
    } else {
      connectToGemini();
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
      {/* Header */}
      <div className="flex justify-between items-start pointer-events-auto">
        <h1 className="text-white text-3xl font-bold tracking-tighter font-['Rajdhani'] drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
          ZEN PARTICLES <span className="text-xs align-top opacity-70">AI</span>
        </h1>
        
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white bg-white/10 backdrop-blur-md p-2 rounded-lg"
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Main Controls Panel */}
      <div className={`
        absolute top-20 left-6 bottom-20 w-80 
        bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6
        transform transition-transform duration-300 pointer-events-auto overflow-y-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-[110%]'}
      `}>
        
        {/* Gemini AI Section */}
        <div className="mb-8">
            <h2 className="text-white/60 text-xs uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                <Wand2 size={14} className="text-purple-400" />
                Gemini Magic
            </h2>
            <button
                onClick={toggleAi}
                className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl transition-all duration-300 border ${
                    isAiConnected 
                    ? 'bg-red-500/20 border-red-500 text-red-100 shadow-[0_0_20px_rgba(239,68,68,0.3)]' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 border-transparent text-white shadow-lg hover:scale-[1.02]'
                }`}
            >
                {isAiConnected ? <MicOff size={20} /> : <Mic size={20} />}
                <span className="font-semibold">
                    {isAiConnected ? 'Stop Listening' : 'Voice Control'}
                </span>
            </button>
            <p className="text-white/40 text-xs mt-3 leading-relaxed">
                Connect and say: <br/>
                "Make it a blue flower" <br/>
                "Show me fireworks for New Year"
            </p>
        </div>

        <hr className="border-white/10 mb-8" />

        {/* Shape Selector */}
        <div className="mb-8">
          <h2 className="text-white/60 text-xs uppercase tracking-widest font-bold mb-4">Shape</h2>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(ShapeType).map((s) => (
              <button
                key={s}
                onClick={() => setShape(s)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-all text-left ${
                  shape === s 
                  ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-105' 
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Color Picker */}
        <div className="mb-8">
          <h2 className="text-white/60 text-xs uppercase tracking-widest font-bold mb-4">Color</h2>
          <div className="flex gap-3 flex-wrap">
             {['#ff0055', '#00ccff', '#ffaa00', '#cc00ff', '#00ffaa', '#ffffff'].map(c => (
                 <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform ${
                        color === c ? 'border-white scale-110' : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: c, boxShadow: `0 0 10px ${c}80` }}
                 />
             ))}
             <input 
                type="color" 
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-8 h-8 rounded-full overflow-hidden border-0 p-0 cursor-pointer"
             />
          </div>
        </div>

        {/* Manual Expansion Fallback */}
        {!isHandTracking && (
             <div className="mb-4 p-4 bg-white/5 rounded-xl border border-white/5">
                <h2 className="text-white/60 text-xs uppercase tracking-widest font-bold mb-2">Manual Control</h2>
                <input 
                    type="range" 
                    min="0" max="1" step="0.01" 
                    value={expansion}
                    onChange={(e) => setExpansion(parseFloat(e.target.value))}
                    className="w-full accent-white h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                />
             </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex justify-between items-end pointer-events-auto">
         <div className="flex gap-4">
             <div className={`flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md ${
                 isHandTracking ? 'bg-green-500/20 border-green-500 text-green-300' : 'bg-black/40 border-white/10 text-white/40'
             }`}>
                 <Hand size={16} />
                 <span className="text-xs font-bold uppercase">
                     {isHandTracking ? 'Hands Detected' : 'No Hands'}
                 </span>
             </div>
         </div>
      </div>
    </div>
  );
};

export default UI;
