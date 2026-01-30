import { useState, useRef, useEffect } from 'react';
import { apiService } from '../services/apiService';
import ReactMarkdown from 'react-markdown';

const TopicAssistant = ({ onTopicFinalized }) => {
    const [history, setHistory] = useState([
        { role: 'assistant', content: 'Hi! I\'m your Strive Learning Path Architect. What skill or topic do you want to master today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const historyContainerRef = useRef(null);

    const scrollToBottom = () => {
        if (historyContainerRef.current) {
            historyContainerRef.current.scrollTo({
                top: historyContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [history]);

    const submitInput = async () => {
        if (!input.trim() || isLoading) return;

        const userEntry = { role: 'user', content: input };
        const newHistory = [...history, userEntry];
        setHistory(newHistory);
        setInput('');
        setIsLoading(true);

        try {
            const response = await apiService.analyzeTopic(newHistory);
            const assistantMessageContent = response.message.content;

            // Robust JSON detection for the signal
            let cleanMessage = assistantMessageContent;
            let finalizedTopic = null;

            try {
                // Find anything that looks like a JSON object with finalized key
                const jsonMatch = assistantMessageContent.match(/\{.*"finalized":\s*(true|false).*\}/s);

                if (jsonMatch) {
                    const jsonStr = jsonMatch[0];
                    try {
                        const data = JSON.parse(jsonStr);
                        // Always remove JSON from clean message
                        cleanMessage = assistantMessageContent.replace(jsonStr, '').trim();

                        if (data.finalized === true && data.topic) {
                            finalizedTopic = data.topic;
                        }
                    } catch (parseError) {
                        // Fallback: manually strip if JSON.parse fails but regex found something
                        cleanMessage = assistantMessageContent.replace(jsonStr, '').trim();
                        console.warn('⚠️ [ASSISTANT] JSON detected but failed to parse:', parseError);
                    }
                }
            } catch (e) {
                console.warn('⚠️ [ASSISTANT] Error processing response signals:', e);
            }

            // Always update history with clean message
            if (cleanMessage) {
                setHistory(prev => [...prev, { role: 'assistant', content: cleanMessage }]);
            }

            // Trigger callback if finalized
            if (finalizedTopic) {
                setTimeout(() => {
                    onTopicFinalized(finalizedTopic);
                }, 1200);
            }
        } catch (error) {
            console.error('Topic analysis error:', error);
            setHistory(prev => [...prev, { role: 'assistant', content: 'Neural link interrupted. Please try re-defining your goal.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[550px] bg-zinc-900/40 backdrop-blur-xl rounded-3xl border border-zinc-800/50 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            {/* Header */}
            <div className="px-6 py-4 bg-zinc-900/50 border-b border-zinc-800/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-zinc-400 tracking-[0.2em] uppercase">Path Architect</span>
                </div>
                <div className="flex gap-1.5 font-mono text-[9px] text-zinc-600">
                    CORE_V1.4
                </div>
            </div>
            {/* Content Area */}
            <div
                ref={historyContainerRef}
                className="flex-1 overflow-y-auto p-6 space-y-4 scroll-area"
            >
                {history.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[85%] px-5 py-3.5 rounded-2xl text-[14px] font-medium leading-relaxed transition-all duration-300 ${msg.role === 'user'
                                ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-tr-none shadow-lg shadow-cyan-500/20'
                                : 'bg-zinc-800/80 text-zinc-200 border border-zinc-700/50 rounded-tl-none'
                                }`}
                        >
                            <ReactMarkdown
                                components={{
                                    p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                    ul: ({ node, ...props }) => <ul className="list-disc ml-4 mb-2" {...props} />,
                                    ol: ({ node, ...props }) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                                    code: ({ node, inline, ...props }) =>
                                        inline ?
                                            <code className="bg-black/30 px-1 rounded text-cyan-400" {...props} /> :
                                            <div className="bg-black/50 p-3 rounded-lg my-2 overflow-x-auto">
                                                <code className="text-sm font-mono text-cyan-300" {...props} />
                                            </div>
                                }}
                            >
                                {msg.content}
                            </ReactMarkdown>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-zinc-800/80 border border-zinc-700/50 px-5 py-3.5 rounded-2xl rounded-tl-none flex gap-1.5 items-center">
                            <div className="w-1.5 h-1.5 bg-cyan-500/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <div className="w-1.5 h-1.5 bg-cyan-500/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <div className="w-1.5 h-1.5 bg-cyan-500/60 rounded-full animate-bounce" />
                        </div>
                    </div>
                )}
            </div>

            {/* Control Area */}
            <div className="p-5 bg-zinc-900/80 border-t border-zinc-800/50">
                <div className="relative flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && submitInput()}
                        placeholder="Define your goal..."
                        className="flex-1 px-5 py-3.5 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500/30 transition-all text-sm"
                    />
                    <button
                        onClick={submitInput}
                        disabled={!input.trim() || isLoading}
                        className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-bold 
                     hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-30 disabled:hover:shadow-none 
                     transition-all active:scale-95 flex items-center justify-center min-w-[80px]"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            'Send'
                        )}
                    </button>
                </div>
            </div>

            <style>{`
        .scroll-area::-webkit-scrollbar {
          width: 6px;
        }
        .scroll-area::-webkit-scrollbar-track {
          background: transparent;
        }
        .scroll-area::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 10px;
        }
        .scroll-area::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
      `}</style>
        </div>
    );
};

export default TopicAssistant;
