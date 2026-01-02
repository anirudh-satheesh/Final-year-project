import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';

const LessonPage = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completedSections, setCompletedSections] = useState(new Set());
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const data = await apiService.getLesson(topicId);
        setLesson(data);
      } catch (err) {
        setError('Failed to load lesson. Please try again.');
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
    try {
      console.log('Marking lesson as complete:', topicId);
      navigate('/roadmap');
    } catch (err) {
      console.error('Error marking lesson complete:', err);
    }
  };

  const handleCopyCode = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(index);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        
        <div className="relative z-10 text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-transparent border-t-purple-500 border-r-pink-500 rounded-full animate-spin mx-auto" />
          </div>
          <p className="text-zinc-400 text-lg font-medium">Loading lesson content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 bg-zinc-900 border border-zinc-800 rounded-2xl p-10 max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-4xl">
            ⚠️
          </div>
          <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Error Loading Lesson</h2>
          <p className="text-zinc-400 mb-8">{error}</p>
          <button
            onClick={() => navigate('/roadmap')}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl 
                     font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-105"
          >
            Back to Roadmap
          </button>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 bg-zinc-900 border border-zinc-800 rounded-2xl p-10 max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-4xl">
            🔍
          </div>
          <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Lesson Not Found</h2>
          <p className="text-zinc-400 mb-8">The requested lesson could not be found.</p>
          <button
            onClick={() => navigate('/roadmap')}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl 
                     font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-105"
          >
            Back to Roadmap
          </button>
        </div>
      </div>
    );
  }

  const progressPercentage = lesson.sections?.length 
    ? (completedSections.size / lesson.sections.length) * 100 
    : 0;

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-zinc-900/50 backdrop-blur-xl border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/roadmap')}
                className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white 
                         bg-zinc-800/50 hover:bg-zinc-700 rounded-xl transition-all transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-black text-white tracking-tight">{lesson.title}</h1>
                <p className="text-sm text-zinc-500">Interactive Learning Module</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Progress Indicator */}
              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-zinc-800/50 rounded-xl border border-zinc-700">
                <div className="w-32 h-2 bg-zinc-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-zinc-300">
                  {completedSections.size}/{lesson.sections?.length || 0}
                </span>
              </div>
              
              <button
                onClick={handleMarkComplete}
                disabled={completedSections.size !== lesson.sections?.length}
                className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl 
                         font-bold hover:shadow-lg hover:shadow-green-500/50 transition-all transform hover:scale-105
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none text-sm"
              >
                ✓ Complete
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Introduction Card */}
            <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8 
                          hover:border-zinc-700 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-xl">
                  📖
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">Introduction</h2>
              </div>
              
              <p className="text-zinc-400 leading-relaxed mb-6">
                {lesson.introduction || 'Welcome to this comprehensive lesson. Here you will learn the fundamental concepts and practical applications of this topic.'}
              </p>

              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-l-4 border-purple-500 rounded-r-xl p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <p className="text-sm text-purple-400 font-bold mb-1">Learning Objectives</p>
                    <p className="text-sm text-zinc-400">
                      By the end of this lesson, you will understand the core concepts and apply them in practical scenarios.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lesson Sections */}
            {lesson.sections?.map((section, index) => (
              <div 
                key={section.id} 
                id={`section-${section.id}`}
                className="group bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8 
                         hover:border-zinc-700 transition-all"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg 
                                  flex items-center justify-center text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-black text-white">{section.title}</h3>
                  </div>
                  
                  {completedSections.has(section.id) && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 border border-green-500/30 
                                  rounded-full text-green-400 text-sm font-bold">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Completed
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="text-zinc-400 leading-relaxed">
                    {section.content || 'This section covers important concepts and practical examples that will help you master this topic.'}
                  </div>

                  {/* Code Example */}
                  {section.codeExample && (
                    <div className="relative group/code">
                      <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/50 border-b border-zinc-800">
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1.5">
                              <div className="w-3 h-3 rounded-full bg-red-500/50" />
                              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                              <div className="w-3 h-3 rounded-full bg-green-500/50" />
                            </div>
                            <span className="text-sm text-zinc-500 ml-2">example.code</span>
                          </div>
                          <button 
                            onClick={() => handleCopyCode(section.codeExample, index)}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs text-zinc-400 hover:text-white 
                                     bg-zinc-800/50 hover:bg-zinc-700 rounded-lg transition-all"
                          >
                            {copiedCode === index ? (
                              <>
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Copied!
                              </>
                            ) : (
                              <>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Copy
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-4 overflow-x-auto">
                          <code className="text-sm text-green-400 font-mono">
                            {section.codeExample}
                          </code>
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Interactive Exercise */}
                  {section.exercise && (
                    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl">💪</span>
                        <h4 className="font-bold text-white">Practice Exercise</h4>
                      </div>
                      <p className="text-zinc-400 mb-4">{section.exercise.description}</p>

                      <div className="space-y-4">
                        <textarea
                          placeholder="Write your solution here..."
                          className="w-full h-32 p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white 
                                   placeholder-zinc-600 focus:outline-none focus:border-purple-500 focus:ring-2 
                                   focus:ring-purple-500/20 transition-all resize-none font-mono text-sm"
                        />
                        <div className="flex gap-3">
                          <button className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 text-white 
                                         rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all 
                                         transform hover:scale-105 text-sm">
                            Check Solution
                          </button>
                          <button className="px-6 py-2.5 bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-xl 
                                         hover:bg-zinc-700 hover:text-white transition-all font-medium text-sm">
                            💡 Hint
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {!completedSections.has(section.id) && (
                  <div className="mt-6 pt-6 border-t border-zinc-800">
                    <button
                      onClick={() => handleSectionComplete(section.id)}
                      className="px-6 py-2.5 bg-zinc-800 border border-zinc-700 text-white rounded-xl 
                               hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-600 hover:border-transparent
                               transition-all font-bold text-sm"
                    >
                      Mark as Complete →
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* Summary Card */}
            <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8 
                          hover:border-zinc-700 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-xl">
                  🎉
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">Summary</h2>
              </div>
              
              <p className="text-zinc-400 leading-relaxed mb-6">
                Congratulations on completing this lesson! You have learned the fundamental concepts and gained practical experience with the topic.
              </p>

              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-l-4 border-green-500 rounded-r-xl p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✨</span>
                  <div>
                    <p className="text-sm text-green-400 font-bold mb-1">Key Takeaways</p>
                    <p className="text-sm text-zinc-400">
                      Remember these important points as you continue your learning journey.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Table of Contents */}
              <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 
                            hover:border-zinc-700 transition-all">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-lg">📑</span>
                  Contents
                </h3>
                <nav className="space-y-2">
                  <a 
                    href="#introduction" 
                    className="block px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 
                             rounded-lg transition-all"
                  >
                    Introduction
                  </a>
                  {lesson.sections?.map((section, index) => (
                    <a
                      key={section.id}
                      href={`#section-${section.id}`}
                      className={`block px-3 py-2 text-sm rounded-lg transition-all ${
                        completedSections.has(section.id) 
                          ? 'text-green-400 hover:bg-zinc-800' 
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {completedSections.has(section.id) && (
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                        <span>{index + 1}. {section.title}</span>
                      </div>
                    </a>
                  ))}
                  <a 
                    href="#summary" 
                    className="block px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 
                             rounded-lg transition-all"
                  >
                    Summary
                  </a>
                </nav>
              </div>

              {/* Progress Card */}
              <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 
                            hover:border-zinc-700 transition-all">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-lg">📊</span>
                  Progress
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Completed</span>
                    <span className="text-white font-bold">
                      {completedSections.size} / {lesson.sections?.length || 0}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-zinc-500 text-center">
                    {progressPercentage === 100 ? '🎉 All sections complete!' : `${Math.round(progressPercentage)}% complete`}
                  </p>
                </div>
              </div>

              {/* Navigation Card */}
              <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 
                            hover:border-zinc-700 transition-all">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-lg">🧭</span>
                  Navigation
                </h3>
                <div className="space-y-3">
                  <button className="w-full px-4 py-2.5 text-left text-zinc-400 hover:text-white hover:bg-zinc-800 
                                   rounded-xl transition-all font-medium text-sm flex items-center justify-between group">
                    <span>← Previous Topic</span>
                    <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button className="w-full px-4 py-2.5 text-left text-zinc-400 hover:text-white hover:bg-zinc-800 
                                   rounded-xl transition-all font-medium text-sm flex items-center justify-between group">
                    <span>Next Topic →</span>
                    <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;