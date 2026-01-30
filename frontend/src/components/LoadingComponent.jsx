import { useState, useEffect } from 'react';

const LoadingComponent = ({ onCancel }) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [dots, setDots] = useState('');

  const messages = [
    { text: "Initializing Path Architect", icon: "🧠" },
    { text: "Analyzing Skill Baseline", icon: "📊" },
    { text: "Mapping Neural Dependencies", icon: "🔗" },
    { text: "Synthesizing Knowledge Graph", icon: "✨" },
    { text: "Optimizing Learning Velocity", icon: "⚡" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 flex items-center justify-center p-6 relative font-sans selection:bg-cyan-500/30 overflow-hidden">
      {/* Background Grid with Fade */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.1] brightness-50 contrast-150 mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      <div className="relative z-10 max-w-2xl w-full">
        <div className="bg-zinc-900/40 backdrop-blur-3xl border border-zinc-800/60 rounded-[40px] p-16 shadow-2xl relative overflow-hidden group">

          {/* Animated background lines subtle */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent -translate-y-1/2 animate-pulse" />
            <div className="absolute top-0 left-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-blue-500 to-transparent -translate-x-1/2 animate-pulse [animation-delay:1s]" />
          </div>

          {/* Main Visual - Neural Core */}
          <div className="mb-16 relative h-64 flex items-center justify-center">
            {/* Outer Decorative Ring */}
            <div className="absolute w-64 h-64 rounded-full border border-cyan-500/5 animate-spin-slow" />

            {/* Pulsing Hexagons (Architectural) */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 border border-cyan-500/20 rounded-[30%] animate-pulse rotate-45" />
              <div className="absolute w-40 h-40 border border-blue-500/15 rounded-[30%] animate-pulse -rotate-12 [animation-delay:0.5s]" />
            </div>

            {/* Neural Nodes Simulation */}
            <div className="absolute w-full h-full">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-cyan-400 rounded-full blur-[1px]"
                  style={{
                    top: `${50 + 35 * Math.sin((i * 60 * Math.PI) / 180)}%`,
                    left: `${50 + 35 * Math.cos((i * 60 * Math.PI) / 180)}%`,
                    boxShadow: '0 0 15px rgba(34, 211, 238, 0.6)',
                    animation: `pulse-soft ${2 + i * 0.5}s infinite ease-in-out`
                  }}
                />
              ))}
            </div>

            {/* Center Core */}
            <div className="relative z-10">
              <div className="absolute inset-0 w-24 h-24 -m-4 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full blur-2xl opacity-40 animate-pulse" />
              <div className="relative w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-2xl backdrop-blur-xl shadow-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-700">
                <span className="text-4xl filter drop-shadow-lg animate-float">
                  {messages[messageIndex].icon}
                </span>
              </div>
            </div>

            {/* Scanning Line */}
            <div className="absolute top-0 left-0 w-full h-1/2 border-b border-cyan-500/20 bg-gradient-to-b from-transparent to-cyan-500/5 animate-[scan_3s_ease-in-out_infinite]" />
          </div>

          {/* Text Content */}
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-950 border border-zinc-800 rounded-full">
              <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Strive System Engine</span>
            </div>

            <h2 className="text-3xl font-black text-white tracking-tight transition-all duration-700 h-10">
              {messages[messageIndex].text}
              <span className="text-cyan-500">{dots}</span>
            </h2>

            <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em] opacity-60">
              Constructing Multi-Dimensional Roadmap
            </p>
          </div>

          {/* Progress bar */}
          <div className="relative h-1 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800/50">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent w-1/3 animate-[shimmer_2s_infinite]" />
          </div>

          {/* Cancel Area */}
          {onCancel && (
            <div className="mt-12 text-center">
              <button
                onClick={onCancel}
                className="text-[10px] font-black text-zinc-600 hover:text-white transition-colors uppercase tracking-[0.3em]"
              >
                Interrupt Sequence
              </button>
            </div>
          )}
        </div>

        {/* Technical Footer */}
        <div className="mt-8 grid grid-cols-2 gap-8 px-12 opacity-40">
          <div className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest leading-relaxed">
            Status: ACTIVE <br />
            Protocol: PERSONALIZED_PATH_GEN
          </div>
          <div className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest leading-relaxed text-right">
            Node Count: 14 <br />
            Accuracy: 99.8%
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes scan {
            0% { transform: translateY(-100%); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(200%); opacity: 0; }
        }
      `}} />
    </div>
  );
};

export default LoadingComponent;
