import React, { useState, useEffect } from 'react';

const LoadingComponent = ({ onCancel }) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [dots, setDots] = useState('');

  const messages = [
    { text: "Architecting progression sequence", icon: "📐" },
    { text: "Aligning technical foundations", icon: "🏗️" },
    { text: "Curating expert-led modules", icon: "📚" },
    { text: "Finalizing your learning trajectory", icon: "🚀" }
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6 relative font-sans selection:bg-white/10 overflow-hidden">
      {/* Premium Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-lg w-full text-center">
        {/* Architectural Visual */}
        <div className="mb-16 relative flex items-center justify-center">
          <div className="absolute w-40 h-40 border border-white/5 rounded-full animate-[spin_10s_linear_infinite]" />
          <div className="absolute w-56 h-56 border border-white/5 rounded-full animate-[spin_15s_linear_infinite_reverse]" />

          <div className="relative w-20 h-20 bg-zinc-900 border border-white/10 rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-xl group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-50" />
            <span className="text-3xl relative z-10 animate-pulse">
              {messages[messageIndex].icon}
            </span>
          </div>

          {/* Drifting Nodes - more organic, less technical */}
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full blur-[1px]"
              style={{
                top: `${50 + 40 * Math.sin((i * 120 * Math.PI) / 180)}%`,
                left: `${50 + 40 * Math.cos((i * 120 * Math.PI) / 180)}%`,
                animation: `pulse-soft ${3 + i}s infinite ease-in-out`
              }}
            />
          ))}
        </div>

        {/* Messaging Area */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-black uppercase tracking-[0.3em] mx-auto">
            System Synchronization
          </div>

          <div className="h-12 flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold tracking-tight text-white transition-all duration-700">
              {messages[messageIndex].text}
              <span className="text-zinc-500">{dots}</span>
            </h2>
          </div>

          <div className="max-w-[280px] mx-auto space-y-4 pt-4">
            <div className="h-0.5 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-white/40 w-1/3 rounded-full animate-[shimmer_2s_infinite]" />
            </div>
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">
              Striving for excellence
            </p>
          </div>
        </div>

        {/* Global Footer Identifier */}
        <div className="mt-24 opacity-30">
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em]">STRIVE CORE</span>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes pulse-soft {
            0%, 100% { transform: scale(1); opacity: 0.2; }
            50% { transform: scale(1.5); opacity: 0.5; }
        }
        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(300%); }
        }
      `}} />
    </div>
  );
};

export default LoadingComponent;
