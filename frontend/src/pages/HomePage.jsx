import { useNavigate } from 'react-router-dom';
import TopicAssistant from '../components/TopicAssistant';

const HomePage = ({ currentSubject, setCurrentSubject }) => {
  const navigate = useNavigate();

  const subjects = [
    'Web Development',
    'Data Science',
    'Machine Learning',
    'Mobile Development',
    'DevOps',
    'Cybersecurity',
    'Blockchain',
    'AI Engineering'
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 overflow-x-hidden relative font-sans selection:bg-cyan-500/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] brightness-50 contrast-150 mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-5 border-b border-zinc-800/50 backdrop-blur-xl bg-black/40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2.5 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-black text-xl italic tracking-tighter">S</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white uppercase letter-spacing-[0.1em]">Strive</span>
          </div>

          <div className="hidden md:flex gap-10 text-[13px] font-semibold text-zinc-500 tracking-wider">
            <button onClick={() => scrollToSection('features')} className="hover:text-cyan-400 transition-colors uppercase">Features</button>
            <button onClick={() => scrollToSection('about')} className="hover:text-cyan-400 transition-colors uppercase">About</button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-cyan-400 transition-colors uppercase">Contact</button>
          </div>

          <div className="flex items-center gap-4">
            <button className="px-5 py-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors">LOGIN</button>
            <button className="px-5 py-2.5 bg-zinc-100 text-black text-[11px] font-black rounded-lg hover:bg-cyan-400 transition-all active:scale-95 shadow-lg shadow-white/5 uppercase">Get Started</button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-20">
        {/* Hero Section */}
        <section className="min-h-[calc(100vh-80px)] flex items-center">
          <div className="max-w-7xl mx-auto px-8 py-12 grid lg:grid-cols-[1.1fr_0.9fr] gap-16 xl:gap-24 items-center">

            <div className="space-y-12 animate-in fade-in slide-in-from-left-8 duration-1000">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-cyan-500/5 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <span className="text-[10px] font-black text-cyan-400 tracking-[0.2em] uppercase leading-none mt-0.5">Evolution of Learning</span>
              </div>

              <div className="space-y-6">
                <h1 className="text-[56px] xl:text-[76px] font-black leading-[0.95] tracking-tight text-white uppercase">
                  Achieve <br />
                  <span className="italic font-serif normal-case font-normal text-cyan-400">Mastery</span>
                  <br /> Faster.
                </h1>
                <p className="text-lg text-zinc-400 max-w-lg leading-relaxed font-medium">
                  Stop wandering through endless tutorials. Our Path Architect analyzes your specific goals to build a precision learning roadmap.
                </p>
              </div>

              <div className="space-y-6">
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em]">Trending Pathways</p>
                <div className="flex flex-wrap gap-2.5">
                  {subjects.map((subject) => (
                    <button
                      key={subject}
                      onClick={() => {
                        setCurrentSubject(subject);
                        navigate('/assessment');
                      }}
                      className="px-4 py-2.5 bg-zinc-900/40 border border-zinc-800/60 rounded-xl text-xs font-semibold text-zinc-400 
                               hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:text-cyan-400 transition-all backdrop-blur-sm active:scale-95"
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
              {/* Decorative context under the assistant */}
              <div className="absolute -inset-10 bg-gradient-to-tr from-cyan-500/10 via-transparent to-blue-500/10 rounded-[60px] blur-3xl" />
              <div className="relative">
                <TopicAssistant
                  onTopicFinalized={(topic) => {
                    setCurrentSubject(topic);
                    navigate('/assessment');
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Preview - Modernized */}
        <section id="features" className="py-32 px-8 border-t border-zinc-900 bg-black/20">
          <div className="max-w-7xl mx-auto space-y-24">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-black tracking-tight text-white uppercase mb-4">Precision Engineering</h2>
              <p className="text-zinc-500 font-medium">Our platform is built on three core pillars that ensure your learning journey is effective, measurable, and tailored to you.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-16">
              <div className="group space-y-6">
                <div className="w-14 min-h-14 bg-zinc-900/50 rounded-2xl flex items-center justify-center border border-zinc-800/50 group-hover:border-cyan-500/30 transition-colors overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-2xl text-cyan-400 relative z-10">⚡</span>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider">Dynamic Assessment</h3>
                  <p className="text-zinc-500 text-[14px] leading-relaxed font-medium transition-colors group-hover:text-zinc-400">Validate your current skills before we map your future. Start exactly where you need to.</p>
                </div>
              </div>

              <div className="group space-y-6">
                <div className="w-14 min-h-14 bg-zinc-900/50 rounded-2xl flex items-center justify-center border border-zinc-800/50 group-hover:border-blue-500/30 transition-colors overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-2xl text-blue-400 relative z-10">🧠</span>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider">Neural Mapping</h3>
                  <p className="text-zinc-500 text-[14px] leading-relaxed font-medium transition-colors group-hover:text-zinc-400">Our AI architect connects complex topics logically, ensuring you build a solid foundation first.</p>
                </div>
              </div>

              <div className="group space-y-6">
                <div className="w-14 min-h-14 bg-zinc-900/50 rounded-2xl flex items-center justify-center border border-zinc-800/50 group-hover:border-purple-500/30 transition-colors overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-2xl text-purple-400 relative z-10">🎯</span>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider">Progress Analytics</h3>
                  <p className="text-zinc-500 text-[14px] leading-relaxed font-medium transition-colors group-hover:text-zinc-400">Track every node you master. Visualize your growth through our interactive skill graph.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About / Stats */}
        <section id="about" className="py-32 px-8 border-t border-zinc-900">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-black tracking-tight text-white uppercase">The Strive Mission</h2>
              <div className="space-y-6 text-zinc-400 font-medium leading-[1.8]">
                <p>In a world drowning in content, we provide clarity. Strive was born from the realization that the hardest part of learning isn't the content, but the sequence.</p>
                <p>We've helped over 10,000 learners navigate complex transitions into high-tech roles by providing the structure they were missing.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-sm">
                <div className="text-3xl font-black text-white mb-1 tracking-tight">10K+</div>
                <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-tight">Career Paths <br />Generated</div>
              </div>
              <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-sm">
                <div className="text-3xl font-black text-white mb-1 tracking-tight">50+</div>
                <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-tight">Disciplines <br />Optimized</div>
              </div>
              <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-sm">
                <div className="text-3xl font-black text-white mb-1 tracking-tight">95%</div>
                <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-tight">Retention <br />Satisfaction</div>
              </div>
              <div className="p-8 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-sm">
                <div className="text-3xl font-black text-cyan-400 mb-1 tracking-tight">AI</div>
                <div className="text-[10px] font-bold text-cyan-500/50 uppercase tracking-widest leading-tight">Proprietary <br />Models</div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-32 px-8 border-t border-zinc-900 overflow-hidden relative">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <h2 className="text-5xl font-black tracking-tight text-white uppercase">Ready to Start?</h2>
            <p className="text-xl text-zinc-500 font-medium">Join thousands of high-performers who use Strive to master new skills.</p>

            <div className="flex justify-center gap-6">
              <button className="px-10 py-4 bg-zinc-100 text-black font-black rounded-2xl hover:bg-cyan-400 transition-all active:scale-95 shadow-xl shadow-cyan-500/10 uppercase tracking-widest text-xs">Start Your Journey</button>
              <button className="px-10 py-4 bg-zinc-900 text-white font-bold border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all active:scale-95 uppercase tracking-widest text-xs">Contact Sales</button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-20 px-8 border-t border-zinc-900 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center">
              <span className="text-zinc-100 font-black text-sm italic">S</span>
            </div>
            <span className="text-sm font-bold tracking-widest text-zinc-500 uppercase">Strive System</span>
          </div>

          <div className="flex gap-10 text-[10px] font-bold text-zinc-600 tracking-[0.2em] uppercase">
            <a href="#" className="hover:text-zinc-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Discord</a>
          </div>

          <div className="text-[10px] font-bold text-zinc-800 uppercase tracking-widest">
            © 2026 STRIVE LABS. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;