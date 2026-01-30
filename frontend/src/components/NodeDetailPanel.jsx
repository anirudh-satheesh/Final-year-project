import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

const NodeDetailPanel = ({ node, subject, onClose, onStartLesson }) => {
  const [isLoadingLesson, setIsLoadingLesson] = useState(false);
  const [isLoadingOverview, setIsLoadingOverview] = useState(true);
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    const fetchOverview = async () => {
      // Use preloaded overview if available
      if (node.data?.overview) {
        setOverview(node.data.overview);
        setIsLoadingOverview(false);
        return;
      }

      setIsLoadingOverview(true);
      try {
        const data = await apiService.getTopicOverview(node.data.label, subject);
        setOverview(data);
      } catch (error) {
        console.error('Error fetching topic overview:', error);
        setOverview({
          summary: node.data.description || "Learn the key concepts and practical applications of this topic.",
          whyItMatters: "Understanding this is crucial for mastering the broader field.",
          resources: [
            { title: "Official Documentation", type: "Docs", url: "#" },
            { title: "Interactive Tutorial", type: "Web", url: "#" },
            { title: "Community Forum", type: "Community", url: "#" }
          ]
        });
      } finally {
        setIsLoadingOverview(false);
      }
    };

    if (node) fetchOverview();
  }, [node, subject]);

  const handleStartLesson = async () => {
    setIsLoadingLesson(true);
    try {
      await onStartLesson(node.data.label, node.data.lesson);
    } catch (error) {
      console.error('Error starting lesson:', error);
    } finally {
      setIsLoadingLesson(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    const normalized = difficulty?.toLowerCase()?.trim();
    switch (normalized) {
      case 'beginner': return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
      case 'intermediate': return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
      case 'advanced': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
    }
  };

  return (
    <div className="fixed right-0 top-0 h-full w-[450px] bg-zinc-950/95 backdrop-blur-2xl shadow-[-20px_0_50px_rgba(0,0,0,0.5)] border-l border-zinc-800/50 z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50 p-6 z-10">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-2xl font-black text-white pr-8 leading-tight">{node.data.label}</h2>
          <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white bg-zinc-900 border border-zinc-800 rounded-lg transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getDifficultyColor(node.data.difficulty)}`}>
          {node.data.difficulty?.toUpperCase()}
        </span>
      </div>

      <div className="p-6 space-y-8">
        {/* Overview Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400">✨</div>
            <h3 className="font-bold text-white text-lg">AI Insight</h3>
          </div>
          {isLoadingOverview ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-4 bg-zinc-800 rounded w-full"></div>
              <div className="h-4 bg-zinc-800 rounded w-5/6"></div>
              <div className="h-4 bg-zinc-800 rounded w-4/6"></div>
            </div>
          ) : (
            <p className="text-zinc-400 leading-relaxed text-base">{overview?.summary}</p>
          )}
        </section>

        {/* Why it Matters Quote */}
        {!isLoadingOverview && overview?.whyItMatters && (
          <div className="relative p-6 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-500/20 rounded-2xl overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl font-serif">"</div>
            <p className="relative text-indigo-100 italic font-medium leading-relaxed">
              "{overview.whyItMatters}"
            </p>
          </div>
        )}

        {/* Resources Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400">📚</div>
            <h3 className="font-bold text-white text-lg">Recommended Reading</h3>
          </div>
          <div className="space-y-3">
            {isLoadingOverview ? [1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-zinc-900 border border-zinc-800 rounded-xl animate-pulse"></div>
            )) : overview?.resources?.map((res, i) => (
              <a key={i} href={res.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:bg-zinc-800 hover:border-zinc-700 transition-all group">
                <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                  {res.type === 'Video' ? '▶️' : '📄'}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors truncate">{res.title}</h4>
                  <p className="text-xs text-zinc-500">{res.type}</p>
                </div>
                <svg className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            ))}
          </div>
        </section>

        {/* Actions */}
        <div className="pt-6 border-t border-zinc-800/50">
          <button
            onClick={handleStartLesson}
            disabled={isLoadingLesson}
            className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-black text-lg shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transform hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {isLoadingLesson ? (
              <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Launch Lesson</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NodeDetailPanel;