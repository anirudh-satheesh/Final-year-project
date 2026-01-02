import { useState, useEffect } from 'react';

const LoadingComponent = ({ onCancel }) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [dots, setDots] = useState('');

  const messages = [
    { text: "Analyzing your learning goals", icon: "🎯" },
    { text: "Mapping skill dependencies", icon: "🔗" },
    { text: "Customizing your journey", icon: "✨" },
    { text: "Finding the best resources", icon: "📚" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Grid with Fade */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]" />
      
      {/* Ambient Glows - Multiple Layers */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="absolute w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '3s', animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 max-w-xl w-full">
        {/* Main Card */}
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-3xl p-12 shadow-2xl">
          
          {/* Logo/Brand Area */}
          <div className="text-center mb-8">
            <div className="inline-block px-4 py-1.5 bg-zinc-800/50 border border-zinc-700/50 rounded-full text-xs font-medium text-zinc-400 uppercase tracking-wider mb-6">
              Generating Roadmap
            </div>
          </div>

          {/* Main Visual - Sophisticated Rings */}
          <div className="mb-10 relative h-48 flex items-center justify-center">
            {/* Outer Ring - Slowest */}
            <div className="absolute w-40 h-40">
              <div className="w-full h-full border border-cyan-500/20 rounded-full animate-ping" 
                   style={{ animationDuration: '3s' }} />
            </div>
            
            {/* Middle Ring */}
            <div className="absolute w-28 h-28">
              <div className="w-full h-full border border-cyan-500/30 rounded-full animate-ping" 
                   style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
            </div>
            
            {/* Inner Ring - Fastest */}
            <div className="absolute w-16 h-16">
              <div className="w-full h-full border-2 border-cyan-500/50 rounded-full animate-ping" 
                   style={{ animationDuration: '1.5s', animationDelay: '1s' }} />
            </div>
            
            {/* Rotating Gradient Ring */}
            <div className="absolute w-44 h-44">
              <div className="w-full h-full rounded-full animate-spin-slow" 
                   style={{ 
                     background: 'conic-gradient(from 0deg, transparent 0%, rgba(6, 182, 212, 0.4) 50%, transparent 100%)',
                     animationDuration: '4s'
                   }} />
            </div>

            {/* Center Core with Icon */}
            <div className="relative">
              <div className="absolute inset-0 w-20 h-20 -m-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full blur-xl opacity-60 animate-pulse" />
              <div className="relative w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full shadow-2xl flex items-center justify-center">
                <span className="text-3xl filter drop-shadow-lg transition-all duration-500">
                  {messages[messageIndex].icon}
                </span>
              </div>
            </div>
          </div>

          {/* Dynamic Message with Smooth Transition */}
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-3 tracking-tight transition-all duration-500 ease-in-out">
              {messages[messageIndex].text}
            </h2>
            <p className="text-zinc-500 text-sm font-medium">
              This may take a moment{dots}
            </p>
          </div>

          {/* Progress Indicator - Infinite Shimmer Bar */}
          <div className="mb-8">
            <div className="w-full h-1 bg-zinc-800/50 rounded-full overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent animate-shimmer" />
            </div>
          </div>

          {/* Status Pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-500 ${
                  idx === messageIndex
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : idx < messageIndex
                    ? 'bg-zinc-800/50 text-zinc-600 border border-zinc-700/30'
                    : 'bg-zinc-800/30 text-zinc-600 border border-zinc-800/30'
                }`}
              >
                <span className="mr-1">{msg.icon}</span>
                {msg.text.split(' ')[0]}
              </div>
            ))}
          </div>

          {/* Cancel Button */}
          {onCancel && (
            <div className="text-center pt-4 border-t border-zinc-800/50">
              <button
                onClick={onCancel}
                className="mt-4 px-6 py-2.5 text-sm text-zinc-400 border border-zinc-800 rounded-xl 
                         hover:bg-zinc-800/50 hover:text-zinc-300 hover:border-zinc-700 
                         transition-all duration-200 font-medium"
              >
                Cancel Generation
              </button>
            </div>
          )}
        </div>

        {/* Bottom Tip */}
        <div className="mt-6 text-center">
          <p className="text-xs text-zinc-600 font-medium">
            AI is analyzing thousands of learning paths to create yours
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingComponent;
