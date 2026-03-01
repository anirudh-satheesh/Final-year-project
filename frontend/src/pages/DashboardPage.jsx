import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, loginWithGoogle } = useAuth();

  // Simulated data - in a real app, these would come from a backend based on the user
  const [userProgress] = useState({
    totalTopics: 24,
    completedTopics: 8,
    currentStreak: 5,
    totalHours: 42,
    overallProgress: 33
  });

  const [learningPaths] = useState([
    {
      id: 1,
      title: 'Data Science Essentials',
      progress: 75,
      completedTopics: 12,
      totalTopics: 16,
      status: 'in-progress',
      category: 'Data Science'
    },
    {
      id: 2,
      title: 'Web Design Systems',
      progress: 100,
      completedTopics: 8,
      totalTopics: 8,
      status: 'completed',
      category: 'Design'
    }
  ]);

  const [skills] = useState([
    { name: 'Python', level: 0.8, label: 'Expert' },
    { name: 'Machine Learning', level: 0.6, label: 'Advanced' },
    { name: 'Data Analysis', level: 0.7, label: 'Advanced' },
    { name: 'Statistics', level: 0.5, label: 'Intermediate' },
    { name: 'SQL', level: 0.9, label: 'Expert' }
  ]);

  const getSkillColor = (level) => {
    if (level >= 0.8) return 'bg-emerald-500';
    if (level >= 0.6) return 'bg-blue-500';
    if (level >= 0.4) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  // State to simulate a "truly new" user vs one with data
  const hasData = learningPaths.length > 0 && user?.metadata?.creationTime !== user?.metadata?.lastSignInTime;

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-white/10 overflow-x-hidden relative flex flex-col">
        <div className="fixed inset-0 z-0">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px]" />
        </div>
        <Navbar />
        <main className="relative z-10 flex-grow flex items-center justify-center px-6">
          <div className="max-w-md w-full bg-zinc-900/40 backdrop-blur-2xl border border-zinc-800/60 p-10 rounded-[2.5rem] text-center space-y-8 shadow-2xl">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center font-black text-black text-4xl mx-auto shadow-[0_0_50px_rgba(255,255,255,0.1)]">
              s.
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-bold tracking-tight text-white">Your journey awaits.</h1>
              <p className="text-zinc-500 text-lg leading-relaxed">Sign in to access your personalized learning dashboard and track your progress.</p>
            </div>
            <button
              onClick={loginWithGoogle}
              className="w-full py-4 bg-white text-black font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-zinc-200 transition-all active:scale-95 flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(255,255,255,0.05)]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-white/10 overflow-x-hidden relative">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[120px]" />
      </div>

      <Navbar />

      <main className="relative z-10 pt-12 pb-20 max-w-7xl mx-auto px-6 sm:px-8">
        {/* Welcome Section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
              {hasData ? 'Overview' : 'Getting Started'}
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-white">
              {hasData ? `Welcome back, ${user.displayName?.split(' ')[0]}.` : `Hello, ${user.displayName?.split(' ')[0]}.`}
            </h1>
            <p className="text-zinc-500 text-lg">
              {hasData ? 'Your progress is the only metric that matters.' : 'Your journey starts with a single step.'}
            </p>
          </div>
          {hasData && (
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-white text-black text-sm font-bold rounded-full hover:bg-zinc-200 transition-all shadow-lg shadow-white/5 active:scale-95"
            >
              Start New Journey
            </button>
          )}
        </div>

        {!hasData ? (
          /* New User Onboarding Section */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="md:col-span-2 group cursor-pointer bg-zinc-900/40 backdrop-blur-md border border-zinc-800/60 p-10 rounded-[2.5rem] hover:border-blue-500/40 transition-all duration-500 shadow-2xl"
              onClick={() => navigate('/')}>
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform">🧭</div>
              <h2 className="text-2xl font-bold text-white mb-4">Choose your first path</h2>
              <p className="text-zinc-400 text-lg leading-relaxed mb-8">Not sure where to start? Browse our curated subjects or take a quick assessment to generate a custom roadmap tailored to your goals.</p>
              <div className="inline-flex items-center gap-2 text-blue-400 font-bold uppercase tracking-[0.15em] text-xs">
                Explore Subjects
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </div>

            <div className="space-y-6">
              <div
                onClick={() => navigate('/chat')}
                className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/60 p-8 rounded-[2.5rem] hover:border-indigo-500/40 transition-all duration-500 shadow-xl group cursor-pointer"
              >
                <div className="text-3xl mb-6">🤖</div>
                <h3 className="text-xl font-bold text-white mb-3">Expert System</h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-6">Chat with our AI architecture to define your learning objectives and find the perfect starting point.</p>
                <button
                  className="text-[10px] font-black uppercase tracking-widest text-indigo-400 group-hover:text-indigo-300 transition-colors"
                >
                  Launch Assistant
                </button>
              </div>

              <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/60 p-8 rounded-[2.5rem] hover:border-emerald-500/40 transition-all duration-500 shadow-xl group cursor-pointer">
                <div className="text-3xl mb-6">🎓</div>
                <h3 className="text-xl font-bold text-white mb-3">Quick Tour</h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-6">A 2-minute walkthrough of how Strive maps your knowledge to save you hundreds of study hours.</p>
                <button className="text-[10px] font-black uppercase tracking-widest text-emerald-400 group-hover:text-emerald-300 transition-colors">Start Tour</button>
              </div>
            </div>
          </div>
        ) : (
          /* Existing User Dashboard Content */
          <>
            {/* Core Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {[
                { label: 'Completed Topics', value: userProgress.completedTopics, icon: '🎯', color: 'blue' },
                { label: 'Current Streak', value: `${userProgress.currentStreak} Days`, icon: '🔥', color: 'orange' },
                { label: 'Time Invested', value: `${userProgress.totalHours}h`, icon: '⏳', color: 'emerald' },
                { label: 'Overall Mastery', value: `${userProgress.overallProgress}%`, icon: '📈', color: 'indigo' }
              ].map((stat, i) => (
                <div key={i} className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/60 p-6 rounded-3xl hover:border-zinc-700 transition-all group">
                  <div className="text-3xl mb-4 grayscale group-hover:grayscale-0 transition-all duration-500">{stat.icon}</div>
                  <p className="text-sm font-semibold text-zinc-500 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-white tracking-tight">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-8">
              {/* Active Journeys */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white tracking-tight">Active Journeys</h2>
                  <button className="text-sm font-semibold text-zinc-500 hover:text-white transition-colors">View All</button>
                </div>

                <div className="grid gap-4">
                  {learningPaths.map((path) => (
                    <div key={path.id} className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/60 p-6 rounded-3xl group hover:border-blue-500/30 transition-all duration-500">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div className="space-y-1">
                          <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">{path.category}</div>
                          <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">{path.title}</h3>
                        </div>
                        <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${path.status === 'completed'
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                          : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                          }`}>
                          {path.status === 'completed' ? 'Mastered' : 'Progressing'}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-500 font-medium">{path.completedTopics} of {path.totalTopics} modules</span>
                          <span className="text-white font-bold">{path.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-zinc-800/50 rounded-full overflow-hidden border border-zinc-800/50">
                          <div
                            className="h-full bg-blue-500 transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(59,130,246,0.5)]"
                            style={{ width: `${path.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 mt-8">
                        <button className="px-5 py-2.5 bg-zinc-100 text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-white transition-all active:scale-95">
                          Resume Journey
                        </button>
                        <button className="px-5 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-black uppercase tracking-widest rounded-xl hover:border-zinc-700 hover:text-white transition-all">
                          Analysis
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar Section */}
              <div className="space-y-8">
                {/* Skill Blueprint */}
                <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/60 p-8 rounded-3xl">
                  <h2 className="text-xl font-bold text-white tracking-tight mb-8">Skill Blueprint</h2>
                  <div className="space-y-6">
                    {skills.map((skill) => (
                      <div key={skill.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-zinc-300">{skill.name}</span>
                          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{skill.label}</span>
                        </div>
                        <div className="h-1 bg-zinc-800/50 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-1000 ease-out ${getSkillColor(skill.level)}`}
                            style={{ width: `${skill.level * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/60 p-8 rounded-3xl">
                  <h2 className="text-xl font-bold text-white tracking-tight mb-8">Recent Activity</h2>
                  <div className="space-y-8 relative">
                    <div className="absolute left-1 top-2 bottom-2 w-px bg-zinc-800" />
                    {[
                      { event: 'Completed "Neural Networks"', time: '2 hours ago', type: 'emerald' },
                      { event: 'Started "Data Preprocessing"', time: '1 day ago', type: 'blue' },
                      { event: 'Earned "Novice" badge', time: '3 days ago', type: 'indigo' }
                    ].map((item, i) => (
                      <div key={i} className="relative pl-6">
                        <div className={`absolute left-0 top-1.5 w-2 h-2 rounded-full border-2 border-zinc-950 bg-${item.type}-500`} />
                        <p className="text-sm font-bold text-zinc-200">{item.event}</p>
                        <p className="text-xs font-medium text-zinc-500 mt-1 uppercase tracking-widest">{item.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer Branding */}
      <footer className="py-12 border-t border-zinc-900 relative z-10 text-center">
        <p className="text-xs font-black text-zinc-800 uppercase tracking-[0.4em]">Strive Learning Management System</p>
      </footer>
    </div>
  );
};

export default DashboardPage;
