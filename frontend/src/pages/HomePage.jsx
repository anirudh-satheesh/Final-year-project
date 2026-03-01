import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 overflow-x-hidden relative font-sans selection:bg-white/10">
      {/* Clean, human-centric background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-zinc-900/50 rounded-full blur-[120px]" />
      </div>

      <Navbar />

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-[calc(100vh-80px)] flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-8 py-12 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="space-y-12 max-w-4xl mx-auto">
              <div className="space-y-6">
                <h1 className="text-6xl md:text-7xl xl:text-8xl font-semibold leading-tight tracking-[0.02em] text-white">
                  Master any skill, <br />
                  <span className="text-zinc-500">The smart way.</span>
                </h1>
                <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-medium">
                  Tutorials alone aren't enough. We build you a clear, structured path to follow so you can focus on learning, not planning.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={() => navigate('/chat')}
                    className="px-12 py-4 bg-white text-black font-black uppercase tracking-[0.2em] text-xs rounded-full hover:bg-zinc-200 transition-all active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
                  >
                    Architect Your Path
                  </button>
                  <button
                    onClick={() => {
                      const element = document.getElementById('features');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-8 py-4 bg-zinc-900 border border-zinc-800 text-white font-black uppercase tracking-[0.2em] text-xs rounded-full hover:border-zinc-700 transition-all active:scale-95"
                  >
                    Learn More
                  </button>
                </div>

                <div className="space-y-4 pt-12">
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Popular Foundations</p>
                  <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto">
                    {subjects.map((subject) => (
                      <button
                        key={subject}
                        onClick={() => {
                          setCurrentSubject(subject);
                          navigate('/assessment');
                        }}
                        className="px-4 py-2 bg-zinc-900/50 border border-zinc-900 rounded-lg text-xs font-bold text-zinc-500 
                                    hover:border-zinc-700 hover:text-white transition-all active:scale-95 uppercase tracking-widest"
                      >
                        {subject}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Preview */}
        <section id="features" className="py-32 px-8 border-t border-zinc-900 bg-zinc-950">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-16">
              <div className="space-y-4">
                <div className="text-3xl mb-2">🌱</div>
                <h3 className="text-xl font-semibold text-white tracking-tight">Starting Point</h3>
                <p className="text-zinc-400 text-base leading-relaxed">Map what you already know so you don't waste time on the basics.</p>
              </div>

              <div className="space-y-4">
                <div className="text-3xl mb-2">🛤️</div>
                <h3 className="text-xl font-semibold text-white tracking-tight">Structured Paths</h3>
                <p className="text-zinc-400 text-base leading-relaxed">Connect topics logically, building a solid foundation step by step.</p>
              </div>

              <div className="space-y-4">
                <div className="text-3xl mb-2">📈</div>
                <h3 className="text-xl font-semibold text-white tracking-tight">Real Progress</h3>
                <p className="text-zinc-400 text-base leading-relaxed">Track every milestone as you master new concepts and skills.</p>
              </div>
            </div>
          </div>
        </section>

        {/* About the Project */}
        <section id="about" className="py-32 px-8 border-t border-zinc-900 bg-zinc-950">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <h2 className="text-4xl font-semibold tracking-tight text-white">Focus on the path, <br /><span className="text-zinc-500">not the noise.</span></h2>
            <div className="space-y-8 text-zinc-400 text-lg leading-relaxed max-w-2xl mx-auto font-medium">
              <p>
                Strive is a personalized learning architect designed to solve the "Paradox of Choice." In an era of infinite tutorials, we help you find the one sequence that actually works for your brain.
              </p>
              <p>
                By mapping your existing knowledge and connecting concepts logically, we turn overwhelming subjects into clear, manageable roadmaps. Honest, efficient, and built for people who just want to learn.
              </p>
            </div>
          </div>
        </section>

        {/* Ready to Start */}
        <section id="contact" className="py-32 px-8 border-t border-zinc-900 bg-zinc-950">
          <div className="max-w-3xl mx-auto text-center space-y-12">
            <h2 className="text-5xl md:text-6xl font-semibold tracking-tight text-white leading-tight">Start building <br /> your path.</h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => navigate('/chat')}
                className="px-12 py-5 bg-white text-black text-xs font-black uppercase tracking-[0.2em] rounded-full hover:bg-zinc-200 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.05)] active:scale-95"
              >
                Get Started
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 px-8 border-t border-zinc-900 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-zinc-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center">
              <span className="text-zinc-100 font-semibold text-lg italic">S</span>
            </div>
            <span className="text-base font-medium tracking-tight">Strive AI - Built to help you learn</span>
          </div>

          <div className="text-sm font-medium tracking-wider">
            Built as a Final Year Project - 2025-26
          </div>

          <div className="flex gap-8 text-sm font-medium">
            <a href="https://github.com/anirudh-satheesh/final-year-project" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300 transition-colors">GitHub</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Documentation</a>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default HomePage;