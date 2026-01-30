import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { apiService } from '../services/apiService';

const LessonPage = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completedSections, setCompletedSections] = useState(new Set());
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    const fetchLesson = async () => {
      // Check for preloaded lesson first
      if (location.state?.preloadedLesson) {
        console.log('🚀 [LESSON] Using preloaded lesson data');
        setLesson(location.state.preloadedLesson);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await apiService.getLesson(topicId);
        setLesson(data);
      } catch (err) {
        setError('Failed to load lesson content. Please check your connection.');
        console.error('Error fetching lesson:', err);
      } finally {
        setLoading(false);
      }
    };

    if (topicId) {
      fetchLesson();
    }
  }, [topicId]);

  const handleSectionComplete = (sectionId) => {
    setCompletedSections(prev => new Set([...prev, sectionId]));
  };

  const handleMarkComplete = async () => {
    navigate('/roadmap');
    // Here we could also update the user's progress in the backend
  };

  const handleCopyCode = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(index);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-50" />
        <div className="w-24 h-24 mb-6 relative">
          <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin" />
          <div className="absolute inset-2 border-4 border-transparent border-t-purple-500 rounded-full animate-spin [animation-duration:1.5s]" />
          <div className="absolute inset-4 border-4 border-transparent border-t-pink-500 rounded-full animate-spin [animation-duration:2s]" />
        </div>
        <h2 className="text-2xl font-black text-white mb-2 animate-pulse">Crafting your lesson...</h2>
        <p className="text-zinc-500 max-w-xs">Our AI is gathering the best examples and explanations for this topic.</p>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full glass-card p-10 text-center border-red-500/30">
          <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-4">Lesson Unavailable</h2>
          <p className="text-zinc-400 mb-8">{error || "We couldn't find the content for this topic."}</p>
          <button onClick={() => navigate('/roadmap')} className="w-full py-4 bg-zinc-900 border border-zinc-800 text-white rounded-xl hover:bg-zinc-800 transition-all font-bold">Return to Roadmap</button>
        </div>
      </div>
    );
  }

  const progressPercentage = lesson.sections?.length
    ? (completedSections.size / lesson.sections.length) * 100
    : 0;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300">
      {/* Dynamic Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:6rem_6rem] opacity-20 pointer-events-none" />
      <div className="fixed -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-2xl border-b border-zinc-800/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/roadmap')}
              className="p-2.5 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white rounded-xl hover:scale-110 active:scale-95 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight line-clamp-1">{lesson.title}</h1>
              <div className="flex items-center gap-3 mt-1">
                <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 transition-all duration-700 ease-out" style={{ width: `${progressPercentage}%` }} />
                </div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{Math.round(progressPercentage)}% Complete</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleMarkComplete}
            disabled={completedSections.size < lesson.sections?.length}
            className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-indigo-500 text-white rounded-full font-black text-sm shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale disabled:hover:scale-100"
          >
            <span>Finish Path</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
          </button>
        </div>
      </header>

      <div className="relative max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-16">

            {/* Introduction Card */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold rounded-full mb-6 tracking-widest uppercase">
                Introduction
              </div>
              <h2 className="text-4xl font-black text-white mb-6 tracking-tight leading-tight">Setting the Stage</h2>
              <div className="prose prose-invert prose-indigo max-w-none text-lg text-zinc-400 leading-relaxed italic">
                <ReactMarkdown>{lesson.introduction}</ReactMarkdown>
              </div>
            </div>

            {/* Lesson Sections */}
            {lesson.sections?.map((section, index) => (
              <section
                key={section.id}
                id={`section-${section.id}`}
                className={`scroll-mt-28 relative group transition-all duration-700 ease-in-out ${completedSections.has(section.id) ? 'opacity-80' : ''}`}
              >
                <div className="flex items-start gap-6">
                  <div className="hidden md:flex flex-col items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-all border-2 ${completedSections.has(section.id) ? 'bg-indigo-500 border-indigo-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>
                      {completedSections.has(section.id) ? '✓' : index + 1}
                    </div>
                    <div className="w-0.5 h-full bg-zinc-800 group-last:bg-transparent" />
                  </div>

                  <div className="flex-1 space-y-8 glass-card p-10 bg-zinc-900/40 hover:bg-zinc-900/60 transition-all border-zinc-800/50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <h3 className="text-2xl font-black text-white">{section.title}</h3>
                      {completedSections.has(section.id) && (
                        <div className="self-start px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-500/30">
                          Section Mastered
                        </div>
                      )}
                    </div>

                    <div className="prose prose-invert prose-indigo max-w-none text-zinc-400 leading-relaxed">
                      <ReactMarkdown>{section.content}</ReactMarkdown>
                    </div>

                    {/* Bullets */}
                    {section.bullets?.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {section.bullets.map((bullet, k) => (
                          <div key={k} className="flex gap-3 items-start p-4 bg-zinc-950/50 border border-zinc-800/50 rounded-xl">
                            <span className="mt-1 text-indigo-500 flex-shrink-0">✦</span>
                            <span className="text-sm text-zinc-300">{bullet}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Code Example */}
                    {section.codeExample && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between px-4 py-2 bg-zinc-950 border-t border-x border-zinc-800 rounded-t-xl">
                          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Live Implementation</span>
                          <button
                            onClick={() => handleCopyCode(section.codeExample, index)}
                            className="text-[10px] font-bold text-indigo-400 hover:text-white transition-colors"
                          >
                            {copiedCode === index ? 'Copied!' : 'Copy Snippet'}
                          </button>
                        </div>
                        <pre className="p-6 bg-zinc-950 border border-zinc-800 rounded-b-xl overflow-x-auto">
                          <code className="text-sm font-mono leading-relaxed text-indigo-100">
                            {section.codeExample}
                          </code>
                        </pre>
                      </div>
                    )}

                    {!completedSections.has(section.id) && (
                      <button
                        onClick={() => handleSectionComplete(section.id)}
                        className="w-full md:w-auto px-8 py-3 bg-zinc-800 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm transition-all active:scale-95"
                      >
                        Complete Section
                      </button>
                    )}
                  </div>
                </div>
              </section>
            ))}

            {/* Pitfalls & Examples */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {lesson.pitfalls?.length > 0 && (
                <div className="glass-card p-8 border-orange-500/20 bg-orange-500/5">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-xl">⚠️</span>
                    <h3 className="text-xl font-black text-white">Common Pitfalls</h3>
                  </div>
                  <ul className="space-y-4">
                    {lesson.pitfalls.map((p, i) => (
                      <li key={i} className="text-sm text-orange-200/70 border-l border-orange-500/20 pl-4">{p}</li>
                    ))}
                  </ul>
                </div>
              )}
              {lesson.realWorldExamples && (
                <div className="glass-card p-8 border-indigo-500/20 bg-indigo-500/5">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-xl">💼</span>
                    <h3 className="text-xl font-black text-white">Real-world Context</h3>
                  </div>
                  <p className="text-sm text-indigo-200/70 leading-relaxed italic">
                    {lesson.realWorldExamples}
                  </p>
                </div>
              )}
            </div>

            {/* Practice Exercise */}
            {lesson.practiceExercise && (
              <div className="glass-card p-10 border-indigo-500/30 bg-[linear-gradient(135deg,rgba(79,70,229,0.1)_0%,transparent_100%)]">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">⚡</span>
                  <h2 className="text-2xl font-black text-white">Practice Quest</h2>
                </div>
                <div className="prose prose-invert prose-indigo mb-8">
                  {typeof lesson.practiceExercise === 'string' ? lesson.practiceExercise : lesson.practiceExercise.description}
                </div>
                <div className="relative bg-zinc-950 p-1 border border-zinc-800 rounded-2xl">
                  <textarea
                    className="w-full bg-transparent p-6 text-indigo-100 font-mono text-sm min-h-[150px] focus:outline-none placeholder-zinc-700"
                    placeholder="// Write your solution here..."
                  />
                  <div className="p-4 border-t border-zinc-800 flex justify-end">
                    <button className="px-6 py-2 bg-indigo-500 text-white text-xs font-black uppercase tracking-widest rounded-lg hover:scale-105 transition-all">
                      Validate Work
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Summary / Next Steps */}
            <div className="text-center pt-20 pb-12">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-2xl font-black text-white mb-2">Mastery Gained</h3>
              <p className="text-zinc-500 max-w-lg mx-auto mb-8">
                {lesson.nextSteps || "You've finished this topic. Ready to tackle the next branch?"}
              </p>
              <button
                onClick={handleMarkComplete}
                className="px-12 py-4 bg-white text-black font-black text-lg rounded-full hover:scale-105 active:scale-95 transition-all"
              >
                Mark Path as Complete
              </button>
            </div>

          </main>

          {/* Sticky Sidebar */}
          <aside className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-28 space-y-8">

              <div className="glass-card p-6 bg-zinc-900/60 border-zinc-800/50">
                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-6 border-b border-zinc-800 pb-2">Topic Flow</h4>
                <nav className="space-y-4">
                  {lesson.sections?.map((section, idx) => (
                    <a
                      key={section.id}
                      href={`#section-${section.id}`}
                      className="flex items-center gap-3 group"
                    >
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all ${completedSections.has(section.id) ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-500'}`}>
                        {idx + 1}
                      </div>
                      <span className={`text-sm truncate transition-all ${completedSections.has(section.id) ? 'text-zinc-500 line-through' : 'text-zinc-400 group-hover:text-white'}`}>
                        {section.title}
                      </span>
                    </a>
                  ))}
                </nav>
              </div>

              <div className="glass-card p-6 border-indigo-500/10 bg-indigo-500/5">
                <div className="text-center">
                  <div className="text-xs font-bold text-indigo-400 mb-2 font-mono">NEURAL SYNC</div>
                  <div className="text-2xl font-black text-white">{Math.round(progressPercentage)}%</div>
                  <div className="mt-2 text-[10px] text-zinc-500 leading-tight">Mastery levels are being calibrated across your mental node graph.</div>
                </div>
              </div>

            </div>
          </aside>

        </div>
      </div>

      <style>{`
        .glass-card {
           background: rgba(18, 18, 20, 0.4);
           backdrop-filter: blur(20px);
           border: 1px solid rgba(255, 255, 255, 0.05);
           border-radius: 2rem;
        }
      `}</style>
    </div>
  );
};

export default LessonPage;