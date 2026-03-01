import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopicAssistant from '../components/TopicAssistant';
import Navbar from '../components/Navbar';

const ChatPage = ({ setCurrentSubject }) => {
    const navigate = useNavigate();

    const quotes = [
        "The beautiful thing about learning is that no one can take it away from you. — B.B. King",
        "Education is the passport to the future, for tomorrow belongs to those who prepare for it today. — Malcolm X",
        "The aim of education is the knowledge, not of facts, but of values. — William Ralph Inge",
        "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice. — Brian Herbert"
    ];

    const topics = [
        'Web Development',
        'Data Science',
        'Mobile Development',
        'Machine Learning',
        'Cloud Computing',
        'Cybersecurity'
    ];

    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    const handleTopicFinalized = (topic) => {
        setCurrentSubject(topic);
        navigate('/assessment');
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-white/10 overflow-hidden relative font-sans">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[120px]" />
            </div>

            <Navbar />

            <main className="relative z-10 pt-12 max-w-7xl mx-auto px-6 sm:px-8 grid md:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 items-center overflow-hidden h-[calc(100vh-80px)]">
                {/* Left Side: Context & Info */}
                <div className="space-y-12 animate-in fade-in slide-in-from-left-8 duration-1000">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
                            Path Architect
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                            Define your <br />
                            <span className="text-zinc-500">learning objective.</span>
                        </h1>
                        <p className="text-zinc-400 text-base max-w-md leading-relaxed">
                            Tell the assistant what you want to master. It will analyze your goal and architect a personalized path just for you.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Suggested Directions</p>
                        <div className="flex flex-wrap gap-2">
                            {topics.map((topic) => (
                                <button
                                    key={topic}
                                    onClick={() => handleTopicFinalized(topic)}
                                    className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-400 
                                                hover:border-zinc-700 hover:text-white transition-all active:scale-95 uppercase tracking-widest"
                                >
                                    {topic}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-8 bg-zinc-900/40 backdrop-blur-md border border-zinc-800/60 rounded-[2rem] relative overflow-hidden group">
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700" />
                        <p className="text-sm font-medium text-zinc-300 italic leading-relaxed animate-in fade-in duration-1000" key={currentQuoteIndex}>
                            "{quotes[currentQuoteIndex]}"
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/')}
                        className="text-[10px] font-black text-zinc-600 hover:text-white uppercase tracking-[0.3em] transition-colors flex items-center gap-2 group"
                    >
                        <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to overview
                    </button>
                </div>

                {/* Right Side: Chatbox Integration */}
                <div className="relative h-full py-12 flex flex-col justify-center animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
                    <div className="relative h-full flex flex-col">
                        {/* Shadow/Glow effect behind chatbox */}
                        <div className="absolute -inset-10 bg-gradient-to-tr from-cyan-500/10 via-transparent to-blue-500/10 rounded-[60px] blur-3xl" />

                        <div className="flex-grow flex flex-col min-h-0 relative">
                            <TopicAssistant onTopicFinalized={handleTopicFinalized} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ChatPage;
