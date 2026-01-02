import { useState } from 'react';

const NodeDetailPanel = ({ node, onClose, onStartLesson }) => {
  const [isLoadingLesson, setIsLoadingLesson] = useState(false);

  const handleStartLesson = async () => {
    setIsLoadingLesson(true);
    try {
      await onStartLesson(node.id);
    } catch (error) {
      console.error('Error starting lesson:', error);
    } finally {
      setIsLoadingLesson(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    const normalized = difficulty?.toLowerCase()?.trim();
    switch (normalized) {
      case 'beginner': 
        return 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-purple-400 border border-purple-500/30';
      case 'intermediate': 
        return 'bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-400 border border-pink-500/30';
      case 'advanced': 
        return 'bg-gradient-to-r from-amber-500/20 to-red-500/20 text-orange-400 border border-orange-500/30';
      default: 
        return 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-cyan-400 border border-cyan-500/30';
    }
  };

  const getSkillLevelText = (skill) => {
    if (skill === undefined || skill === null) return 'Not assessed';
    if (skill === 0) return 'None';
    if (skill <= 0.2) return 'Beginner';
    if (skill <= 0.4) return 'Novice';
    if (skill <= 0.6) return 'Intermediate';
    if (skill <= 0.8) return 'Advanced';
    return 'Expert';
  };

  const getSkillBarColor = (skill) => {
    if (skill >= 0.8) return 'from-green-500 to-emerald-600';
    if (skill >= 0.6) return 'from-blue-500 to-cyan-600';
    if (skill >= 0.4) return 'from-purple-500 to-pink-600';
    if (skill >= 0.2) return 'from-orange-500 to-amber-600';
    return 'from-zinc-600 to-zinc-700';
  };

  return (
    <div className="fixed right-0 top-0 h-full w-[420px] bg-zinc-900 shadow-2xl border-l border-zinc-800 z-50 overflow-y-auto">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />
      
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 p-6">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-2xl font-black text-white pr-8 leading-tight tracking-tight">{node.data.label}</h2>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white 
                     bg-zinc-800/50 hover:bg-zinc-700 rounded-xl transition-all transform hover:scale-110"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className={`px-3 py-1.5 text-xs font-bold rounded-lg ${getDifficultyColor(node.data.difficulty)}`}>
            {node.data.difficulty?.toUpperCase() || 'UNKNOWN'}
          </span>
        </div>

        {/* Skill Level Progress */}
        {node.data.skills !== undefined && node.data.skills !== null && (
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-zinc-400">Your Skill Level</span>
              <span className="text-sm font-bold text-white">{getSkillLevelText(node.data.skills)}</span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${getSkillBarColor(node.data.skills)} transition-all duration-500`}
                style={{ width: `${(node.data.skills || 0) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Description */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">📖</span>
            <h3 className="font-bold text-white">Overview</h3>
          </div>
          <p className="text-zinc-400 leading-relaxed">
            {node.data.description || 'This topic is an essential part of your learning journey. Click "Start Learning" below to dive into the comprehensive lesson materials.'}
          </p>
        </div>

        {/* Estimated Time */}
        {node.data.estimatedTime && (
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">⏱️</span>
              <h3 className="font-bold text-white">Time Investment</h3>
            </div>
            <p className="text-zinc-400">{node.data.estimatedTime}</p>
          </div>
        )}

        {/* Learning Resources */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">📚</span>
            <h3 className="font-bold text-white">Learning Resources</h3>
          </div>
          
          <div className="space-y-3">
            <div className="group bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-purple-500/50 hover:bg-zinc-800/50 transition-all cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">Official Documentation</h4>
                  <p className="text-sm text-zinc-500">Comprehensive guides and tutorials</p>
                </div>
                <svg className="w-5 h-5 text-zinc-600 group-hover:text-purple-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            <div className="group bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-green-500/50 hover:bg-zinc-800/50 transition-all cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-white mb-1 group-hover:text-green-400 transition-colors">Interactive Course</h4>
                  <p className="text-sm text-zinc-500">Hands-on learning with exercises</p>
                </div>
                <svg className="w-5 h-5 text-zinc-600 group-hover:text-green-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            <div className="group bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-blue-500/50 hover:bg-zinc-800/50 transition-all cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">Practice Projects</h4>
                  <p className="text-sm text-zinc-500">Build real-world applications</p>
                </div>
                <svg className="w-5 h-5 text-zinc-600 group-hover:text-blue-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Why Important */}
        <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">💡</span>
            <h3 className="font-bold text-white">Why This Matters</h3>
          </div>
          <p className="text-zinc-300 leading-relaxed text-sm">
            This topic forms a crucial foundation for advanced concepts in your learning journey.
            Mastering these fundamentals will unlock more complex topics and give you the confidence
            to tackle real-world challenges.
          </p>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="bg-zinc-900 border-t border-zinc-800 p-6">
        <div className="space-y-3">
          <button
            onClick={handleStartLesson}
            disabled={isLoadingLesson}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl 
                     font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-105
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none
                     flex items-center justify-center gap-2"
          >
            {isLoadingLesson ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading Lesson...
              </>
            ) : (
              <>
                <span>Start Learning</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>

          <div className="flex gap-3">
            <button className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-xl 
                             hover:bg-zinc-700 hover:text-white transition-all font-medium text-sm flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Save
            </button>
            <button className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-xl 
                             hover:bg-zinc-700 hover:text-white transition-all font-medium text-sm flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Complete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodeDetailPanel;