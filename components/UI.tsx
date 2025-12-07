import React, { useState } from 'react';
import { useAppStore } from '../store';
import { ShapeType } from '../types';
import { translations } from '../utils/i18n';
import { Mic, Hand, Cpu, Settings, X, Activity, Globe, Info, Languages } from 'lucide-react';
import { connectToGemini, disconnectGemini } from '../services/geminiService';

const UI: React.FC = () => {
  const { 
    shape, setShape, 
    color, setColor, 
    isHandTracking, 
    isAiConnected, 
    expansion, setExpansion,
    language, setLanguage
  } = useAppStore();
  
  const [showManual, setShowManual] = useState(false);
  
  const t = translations[language];

  const toggleAi = () => {
    if (isAiConnected) {
      disconnectGemini();
    } else {
      connectToGemini();
    }
  };

  const toggleLanguage = () => {
      setLanguage(language === 'en' ? 'zh' : 'en');
  }

  return (
    <div className={`absolute inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-6 overflow-hidden ${language === 'zh' ? 'font-cn' : 'font-[Rajdhani]'}`}>
      
      {/* --- TOP HEADER BAR --- */}
      <div className="flex justify-between items-start pointer-events-auto z-40">
        
        {/* Title Block */}
        <div className="flex flex-col relative group">
          {/* Decorative bracket */}
          <div className="absolute -left-4 top-0 bottom-0 w-1 bg-cyan-500/50"></div>
          
          <h1 className="text-cyan-400 text-4xl font-bold tracking-[0.15em] drop-shadow-[0_0_10px_rgba(0,204,255,0.8)] flex items-baseline">
            {t.title} <span className="text-white text-xs ml-2 opacity-80 tracking-widest font-tech">{t.subtitle}</span>
          </h1>
          <div className="flex gap-4 mt-1 text-[10px] text-cyan-200/60 font-tech uppercase tracking-wider">
            <span className="flex items-center gap-1"><div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div> {t.cpu}</span>
            <span className="flex items-center gap-1"><div className="w-1 h-1 bg-green-400 rounded-full"></div> {t.net}</span>
            <span>{t.sec}</span>
          </div>
        </div>
        
        {/* Top Right Controls */}
        <div className="flex gap-2">
            <button 
            onClick={toggleLanguage}
            className="group flex items-center gap-2 px-4 py-2 bg-black/40 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all backdrop-blur-md clip-path-slant"
            style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 0% 100%)' }}
            >
            <Languages size={16} className="text-cyan-400" />
            <span className="text-cyan-300 text-xs tracking-widest font-bold">{language.toUpperCase()}</span>
            </button>

            <button 
            onClick={() => setShowManual(true)}
            className="group flex items-center gap-2 px-6 py-2 bg-cyan-900/20 border border-cyan-500/50 hover:bg-cyan-500/20 transition-all backdrop-blur-md"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 70%, 90% 100%, 0 100%)' }}
            >
            <Info size={16} className="text-cyan-400 group-hover:animate-pulse" />
            <span className="text-cyan-300 text-xs tracking-widest font-bold">{t.manual}</span>
            </button>
        </div>
      </div>

      {/* --- SIDE HOLOGRAPHIC PANELS --- */}
      <div className="flex flex-1 relative mt-12 mb-12 pointer-events-none">
        
        {/* Left Panel: Shapes */}
        <div className="absolute left-0 top-10 pointer-events-auto transform transition-all duration-500 hover:translate-x-2">
          <div className="glass-panel rounded-r-xl w-60 flex flex-col p-1 relative overflow-hidden">
             {/* Tech decoration lines */}
             <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-cyan-400/50"></div>
             <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-cyan-400/50"></div>

            <h3 className="text-cyan-400 text-[10px] font-tech uppercase tracking-[0.2em] bg-cyan-900/30 p-2 mb-1 flex items-center gap-2 border-b border-cyan-500/30">
              <Globe size={10} /> {t.projector}
            </h3>
            <div className="flex flex-col gap-1 p-2">
                {Object.values(ShapeType).map((s) => (
                <button
                    key={s}
                    onClick={() => setShape(s)}
                    className={`relative text-left px-4 py-3 text-sm font-bold tracking-wider transition-all overflow-hidden group ${
                    shape === s 
                    ? 'text-black bg-cyan-400 shadow-[0_0_15px_rgba(0,204,255,0.6)]' 
                    : 'text-cyan-300/70 hover:text-cyan-100 hover:bg-cyan-500/20'
                    }`}
                >
                    <div className="relative z-10 flex justify-between items-center">
                        {t.shapes[s]}
                        {shape === s && <Activity size={12} className="animate-spin-slow" />}
                    </div>
                    {/* Hover scan effect */}
                    <div className={`absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 skew-x-12 ${shape === s ? 'hidden' : 'block'}`}></div>
                </button>
                ))}
            </div>
          </div>
        </div>

        {/* Right Panel: Colors - Increased Size for Practicality */}
        <div className="absolute right-0 top-20 pointer-events-auto transform transition-all duration-500 hover:-translate-x-2">
          <div className="glass-panel rounded-l-xl w-20 flex flex-col items-center py-4 relative">
             <div className="absolute top-0 left-0 w-2 h-full border-l border-cyan-500/20"></div>
             <h3 className="text-cyan-400 text-[8px] tracking-widest text-center mb-4 writing-vertical rotate-180 opacity-70">{t.chromatic}</h3>
             
             <div className="flex flex-col gap-4">
                {['#00ccff', '#ff0055', '#ffaa00', '#cc00ff', '#00ffaa', '#ffffff'].map(c => (
                    <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={`w-8 h-8 rotate-45 border transition-all relative group shadow-[0_0_10px_rgba(0,0,0,0.5)] ${
                            color === c ? 'scale-125 border-white z-10' : 'border-white/10 scale-90 opacity-60 hover:opacity-100 hover:scale-110'
                        }`}
                        style={{ backgroundColor: c }}
                    >
                    </button>
                ))}
                <div className="w-8 h-px bg-cyan-500/50 my-1"></div>
                <div className="relative w-8 h-8 rotate-45 overflow-hidden border border-cyan-500/50 group">
                     <input 
                        type="color" 
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer opacity-0"
                    />
                    <div className="w-full h-full bg-gradient-to-br from-transparent to-cyan-500/50"></div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* --- BOTTOM CONTROL HUB --- */}
      <div className="flex flex-col items-center gap-4 pointer-events-auto z-40 pb-6 w-full max-w-3xl mx-auto">
        
        {/* Arc Reactor (Voice) */}
        <div className="relative group scale-90 md:scale-100">
            {/* Spinning Rings */}
            <div className={`absolute inset-[-10px] rounded-full border border-dashed border-cyan-500/30 animate-spin-reverse transition-opacity duration-1000 ${isAiConnected ? 'opacity-0' : 'opacity-100'}`}></div>
            <div className={`absolute inset-[-20px] rounded-full border border-dotted border-cyan-500/20 animate-spin-slow transition-opacity duration-1000 ${isAiConnected ? 'opacity-0' : 'opacity-100'}`}></div>
            
            {/* Glow Bloom */}
            <div className={`absolute inset-0 rounded-full blur-2xl transition-all duration-500 ${isAiConnected ? 'bg-red-500/50 scale-125' : 'bg-cyan-400/20 scale-100'}`}></div>
            
            <button
                onClick={toggleAi}
                className={`relative w-20 h-20 rounded-full border-2 flex items-center justify-center transition-all duration-300 shadow-2xl backdrop-blur-sm z-10 overflow-hidden group-hover:scale-105 ${
                    isAiConnected 
                    ? 'border-red-500 bg-red-950/40 shadow-[0_0_40px_rgba(239,68,68,0.6)]' 
                    : 'border-cyan-400/60 bg-cyan-950/40 shadow-[0_0_30px_rgba(0,204,255,0.3)]'
                }`}
            >
                {/* Inner Hexagon Pattern */}
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle, transparent 20%, #000 120%)', backgroundSize: '10px 10px' }}></div>
                
                <div className={`relative z-20 transition-transform duration-500 ${isAiConnected ? 'animate-pulse' : ''}`}>
                    {isAiConnected ? <Mic size={24} className="text-red-100" /> : <Cpu size={24} className="text-cyan-100" />}
                </div>

                {/* Arc Ring */}
                <svg className="absolute inset-0 w-full h-full animate-spin-slow" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" strokeDasharray="20 60" fill="none" className={isAiConnected ? 'text-red-500' : 'text-cyan-400'} />
                </svg>
            </button>

            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-black/60 px-3 py-1 rounded-sm border border-cyan-500/30 backdrop-blur-md">
                 <span className={`text-[10px] font-bold tracking-[0.2em] font-tech ${isAiConnected ? 'text-red-400 animate-pulse' : 'text-cyan-500'}`}>
                    {isAiConnected ? t.voiceActive : t.voiceStandby}
                 </span>
            </div>
        </div>

        {/* Status Bar */}
        <div className="w-full flex justify-center items-end gap-2 px-4 md:px-0">
             {/* Left Decoration */}
             <div className="h-px w-12 md:w-32 bg-gradient-to-r from-transparent to-cyan-500/50 mb-4"></div>

             {/* Main Info Box */}
             <div className="flex-1 max-w-md glass-panel rounded-t-lg px-6 py-2 flex items-center justify-between min-h-[50px] relative">
                 {/* Top line scanner */}
                 <div className="absolute top-0 left-0 h-0.5 bg-cyan-400/50 w-full animate-pulse"></div>

                 <div className={`flex items-center gap-3 ${isHandTracking ? 'text-green-400' : 'text-red-400/70'}`}>
                     <Activity size={16} className={isHandTracking ? 'animate-bounce' : ''} />
                     <span className="text-xs font-bold tracking-widest font-tech uppercase">
                         {isHandTracking ? t.sensorsLocked : t.searching}
                     </span>
                 </div>

                 <div className="h-6 w-px bg-cyan-500/20 mx-2"></div>

                 <div className="flex flex-col items-end">
                    <span className="text-[9px] text-cyan-400/60 font-tech tracking-widest">{t.expansion}</span>
                    <div className="flex items-center gap-2">
                        <span className="text-cyan-100 font-mono text-lg leading-none">{(expansion * 100).toFixed(0)}</span>
                        <span className="text-[10px] text-cyan-500">%</span>
                    </div>
                 </div>

                 {/* Slider Fallback - Made more Practical/Visible */}
                 {!isHandTracking && (
                    <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-56 bg-black/80 p-3 rounded border border-cyan-500/50 shadow-lg">
                        <div className="text-[9px] text-cyan-400 mb-1 text-center uppercase tracking-widest">{t.override}</div>
                        <input 
                            type="range" 
                            min="0" max="1" step="0.01" 
                            value={expansion}
                            onChange={(e) => setExpansion(parseFloat(e.target.value))}
                            className="w-full h-1 bg-cyan-900/50 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                        />
                    </div>
                 )}
             </div>

             {/* Right Decoration */}
             <div className="h-px w-12 md:w-32 bg-gradient-to-l from-transparent to-cyan-500/50 mb-4"></div>
        </div>
      </div>

      {/* --- MANUAL MODAL --- */}
      {showManual && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md pointer-events-auto p-4">
            <div className="relative w-full max-w-3xl bg-black/90 border border-cyan-500/40 rounded-sm shadow-[0_0_100px_rgba(0,204,255,0.15)] overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[600px]">
                
                {/* Visual Side (Left) */}
                <div className="w-full md:w-1/3 bg-cyan-950/20 border-b md:border-b-0 md:border-r border-cyan-500/20 relative p-6 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-20 pointer-events-none">
                        {Array.from({length:36}).map((_,i) => <div key={i} className="border border-cyan-500/10"></div>)}
                    </div>
                    <div className="relative z-10 text-center">
                        <div className="w-24 h-24 mx-auto rounded-full border-2 border-cyan-400 flex items-center justify-center animate-spin-slow mb-4">
                            <div className="w-16 h-16 border border-dashed border-cyan-500 rounded-full animate-spin-reverse"></div>
                        </div>
                        <h2 className="text-2xl font-bold text-cyan-400 tracking-[0.2em]">{t.manualTitle}</h2>
                        <div className="text-[10px] text-cyan-600 font-tech mt-2">{t.manualSubtitle}</div>
                    </div>
                </div>

                {/* Content Side (Right) */}
                <div className="flex-1 p-8 relative overflow-y-auto">
                     <button onClick={() => setShowManual(false)} className="absolute top-4 right-4 text-cyan-700 hover:text-cyan-400 transition-colors">
                        <X size={24} />
                    </button>

                    <div className="space-y-8">
                        {/* Section 1 */}
                        <div className="relative pl-6 border-l-2 border-cyan-500/30">
                            <div className="absolute -left-[5px] top-0 w-2 h-2 bg-cyan-400 rounded-full"></div>
                            <h3 className="text-cyan-100 font-bold uppercase tracking-widest flex items-center gap-2 mb-2">
                                <Hand size={16} className="text-cyan-400" /> {t.gestures}
                            </h3>
                            <p className="text-sm text-cyan-400/70 leading-relaxed">
                                {t.gesturesDesc}
                            </p>
                        </div>

                        {/* Section 2 */}
                        <div className="relative pl-6 border-l-2 border-cyan-500/30">
                            <div className="absolute -left-[5px] top-0 w-2 h-2 bg-cyan-400 rounded-full"></div>
                             <h3 className="text-cyan-100 font-bold uppercase tracking-widest flex items-center gap-2 mb-2">
                                <Mic size={16} className="text-cyan-400" /> {t.voice}
                            </h3>
                            <p className="text-sm text-cyan-400/70 leading-relaxed">
                                {t.voiceDesc}
                            </p>
                        </div>

                        {/* Section 3 */}
                        <div className="relative pl-6 border-l-2 border-cyan-500/30">
                            <div className="absolute -left-[5px] top-0 w-2 h-2 bg-cyan-400 rounded-full"></div>
                            <h3 className="text-cyan-100 font-bold uppercase tracking-widest flex items-center gap-2 mb-2">
                                <Settings size={16} className="text-cyan-400" /> {t.override}
                            </h3>
                            <p className="text-sm text-cyan-400/70 leading-relaxed">
                                {t.overrideDesc}
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-cyan-900/50 flex justify-end">
                        <button 
                            onClick={() => setShowManual(false)}
                            className="px-8 py-2 bg-cyan-500/10 hover:bg-cyan-400 hover:text-black border border-cyan-400 text-cyan-400 font-bold tracking-[0.2em] text-sm transition-all uppercase"
                        >
                            {t.acknowledge}
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