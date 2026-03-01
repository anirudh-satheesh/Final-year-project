import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import LoadingComponent from '../components/LoadingComponent';
import Navbar from '../components/Navbar';

const AssessmentPage = ({ currentSubject, onComplete }) => {
  const [step, setStep] = useState('intro'); // intro, assessment, loading
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [markedForReview, setMarkedForReview] = useState([]);
  const [isFetchingQuestions, setIsFetchingQuestions] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    let isCancelled = false;

    const fetchQuestions = async () => {
      if (!currentSubject) return;

      setIsFetchingQuestions(true);
      try {
        const data = await apiService.getAssessment(currentSubject);
        if (!isCancelled && data && data.questions) {
          setQuestions(data.questions);
          setAnswers(Array(data.questions.length).fill(null));
          setMarkedForReview(Array(data.questions.length).fill(false));
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('❌ [ASSESSMENT] Failed to fetch questions:', err);
        }
      } finally {
        if (!isCancelled) {
          setIsFetchingQuestions(false);
        }
      }
    };

    fetchQuestions();

    return () => {
      isCancelled = true;
    };
  }, [currentSubject]);

  const handleStartAssessment = () => {
    setStep('assessment');
    setCurrentQuestionIndex(0);
    setMarkedForReview(Array(questions.length).fill(false));
  };

  const handleAnswerChange = (qIndex, optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const toggleMarkForReview = (qIndex) => {
    const newMarked = [...markedForReview];
    newMarked[qIndex] = !newMarked[qIndex];
    setMarkedForReview(newMarked);
  };

  const scrollToQuestion = (qIndex) => {
    const element = document.getElementById(`q-${qIndex}`);
    if (element) {
      const offset = 100; // Account for navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };
  const handleSubmit = async () => {
    // Check if all questions are answered
    if (answers.some(a => a === null)) {
      alert("Please answer all questions before submitting.");
      return;
    }

    console.log('🔵 [ASSESSMENT] handleSubmit called');

    let correctCount = 0;
    answers.forEach((answer, index) => {
      if (answer === questions[index].correct) correctCount++;
    });
    setScore(correctCount);
    setSubmitted(true);

    const normalizedSkillValue = correctCount / questions.length;
    const userSkills = {
      [currentSubject]: normalizedSkillValue
    };

    try {
      console.log('🚀 [ASSESSMENT] Invoking apiService.generateRoadmap...');
      const roadmapData = await apiService.generateRoadmap(currentSubject, userSkills);
      onComplete(userSkills, roadmapData);
      navigate('/roadmap');
    } catch (err) {
      console.error('❌ [ASSESSMENT] generateRoadmap failed:', err.message);
      try {
        const graphData = await apiService.generateGraph(currentSubject);
        onComplete(userSkills, graphData);
        navigate('/roadmap');
      } catch (fallbackErr) {
        console.error('❌ [ASSESSMENT] generateGraph also failed:', fallbackErr.message);
        navigate('/');
      }
    }
  };

  const handleSkip = async () => {
    if (!currentSubject) return;
    const normalizedSkillValue = 0.5;
    const userSkills = {
      [currentSubject]: normalizedSkillValue
    };

    setStep('loading');
    try {
      const graphData = await apiService.generatePersonalizedGraph(currentSubject, userSkills);
      onComplete(userSkills, graphData);
      navigate('/roadmap');
    } catch (err) {
      console.error('❌ [ASSESSMENT] generatePersonalizedGraph failed:', err.message);
      try {
        const fallbackGraph = await apiService.generateGraph(currentSubject);
        onComplete(userSkills, fallbackGraph);
        navigate('/roadmap');
      } catch (fallbackErr) {
        console.error('❌ [ASSESSMENT] generateGraph also failed:', fallbackErr.message);
        navigate('/');
      }
    }
  };

  const getLevel = (score) => {
    const ratio = score / questions.length;
    if (ratio <= 0.3) return "Eager Learner";
    if (ratio <= 0.7) return "Focused Scholar";
    return "Expert Virtuoso";
  };

  const getLevelColor = (score) => {
    const ratio = score / questions.length;
    if (ratio <= 0.3) return "from-indigo-400 to-violet-500";
    if (ratio <= 0.7) return "from-cyan-400 to-blue-500";
    return "from-emerald-400 to-teal-500";
  };

  if (step === 'loading') {
    return <LoadingComponent />;
  }

  // Common background components
  const Background = () => (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-zinc-950">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-zinc-900/50 rounded-full blur-[100px]" />
    </div>
  );

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#030303] text-zinc-100 flex items-center justify-center p-6 relative font-sans selection:bg-cyan-500/30 overflow-hidden">
        <Background />

        <div className="relative z-10 w-full max-w-2xl text-center">
          {/* Success Ring Animation */}
          <div className="relative w-32 h-32 mx-auto mb-10">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full blur-2xl opacity-40 animate-pulse" />
            <div className="relative w-full h-full border-2 border-emerald-500/30 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.2)]">
              <span className="text-5xl animate-in zoom-in duration-700 font-black">✓</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/20 mb-8">
            <span className="text-sm font-semibold text-emerald-400 tracking-widest uppercase mt-0.5">Discovery Complete</span>
          </div>

          <h2 className="text-4xl font-semibold tracking-tight text-white mb-6 leading-tight">
            Analysis finalized. <br />
            <span className="text-zinc-500 font-medium">Your customized path is ready.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 text-left">
            <div className="p-8 rounded-[2rem] bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-sm">
              <div className="text-4xl font-black text-white mb-2 tracking-tight">
                <span className={`bg-gradient-to-r ${getLevelColor(score)} bg-clip-text text-transparent underline decoration-white/10 decoration-2 underline-offset-8`}>
                  {score}/{questions.length}
                </span>
              </div>
              <div className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] leading-tight pt-4 border-t border-white/5 mt-4">Precision Score</div>
            </div>

            <div className="p-8 rounded-[2rem] bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-sm flex flex-col justify-center">
              <div className="text-xl font-black text-white mb-1 tracking-tight uppercase">
                {getLevel(score)}
              </div>
              <div className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] leading-tight pt-4 border-t border-white/5 mt-4">Knowledge Tier</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="h-1 bg-zinc-900 rounded-full overflow-hidden w-full max-w-sm mx-auto relative border border-zinc-800/50">
              <div className="h-full bg-cyan-500 rounded-full animate-shimmer" style={{ width: '100%' }} />
            </div>
            <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em] animate-pulse">Building Dynamic Architecture</p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'assessment') {
    const answeredCount = answers.filter(a => a !== null).length;
    const progress = (answeredCount / questions.length) * 100;

    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col relative font-sans selection:bg-white/10 overflow-x-hidden">
        <Background />

        <Navbar
          rightContent={
            <div className="flex items-center gap-6">
              <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.25em]">{answeredCount} of {questions.length} Resolved</div>
              <div className="w-32 h-1 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/50">
                <div
                  className="h-full bg-blue-500 transition-all duration-700 ease-out shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          }
        />

        <div className="flex-1 flex flex-col lg:flex-row w-full relative z-10">
          {/* Left Sidebar Panel - Stationary & Fixed */}
          <aside className="lg:w-80 w-full lg:fixed lg:left-0 lg:top-0 lg:h-screen p-8 lg:pt-32 border-r border-white/5 bg-zinc-950/20 backdrop-blur-xl overflow-y-auto shrink-0 z-40 order-2 lg:order-1 transition-all duration-300">
            <div className="space-y-8">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Assessment Navigator</p>
                <h3 className="text-xl font-bold text-white tracking-tight">Question Status</h3>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {questions.map((_, idx) => {
                  let statusColor = "bg-zinc-800 text-zinc-500 border-zinc-700/50";
                  if (markedForReview[idx]) {
                    statusColor = "bg-yellow-500/20 text-yellow-500 border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.1)]";
                  } else if (answers[idx] !== null) {
                    statusColor = "bg-emerald-500/20 text-emerald-500 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => scrollToQuestion(idx)}
                      className={`w-full aspect-square rounded-xl border flex items-center justify-center text-[10px] font-black transition-all hover:scale-110 active:scale-90 ${statusColor}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-3 pt-6 border-t border-white/5">
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                  <div className="w-3 h-3 rounded-md bg-emerald-500/20 border border-emerald-500/30" />
                  <span className="text-zinc-400">Answered</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                  <div className="w-3 h-3 rounded-md bg-yellow-500/20 border border-yellow-500/30" />
                  <span className="text-zinc-400">Marked for Review</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                  <div className="w-3 h-3 rounded-md bg-zinc-800 border border-zinc-700/50" />
                  <span className="text-zinc-400">Not Answered</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Assessment Area - Full Width Scrolling Column */}
          <main className="flex-1 lg:ml-80 px-24 py-24 md:py-20 order-1 lg:order-2 w-full">
            <div className="max-w-[1200px] mx-auto w-full">
              <div className="mb-16 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  Technical Assessment
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-white leading-tight">Expert Diagnostic</h1>
                <p className="text-zinc-500 text-lg leading-relaxed">Map your technical nodes. Once calibrated, we'll architect your progression path.</p>
              </div>

              <div className="space-y-6 mb-20">
                {questions.map((q, qIndex) => (
                  <div
                    key={qIndex}
                    id={`q-${qIndex}`}
                    className={`space-y-5 p-6 md:p-6 rounded-2xl bg-zinc-950/40 border transition-all duration-500 scroll-mt-32 ${markedForReview[qIndex]
                        ? 'border-yellow-500/30 bg-yellow-500/5'
                        : answers[qIndex] !== null ? 'border-zinc-800' : 'border-white/5'
                      }`}
                  >
                    <div className="flex justify-between items-start gap-6">
                      <div className="flex items-center gap-6 flex-grow">
                        <div className="w-7 h-7 shrink-0 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] font-black text-zinc-500">
                          {qIndex + 1}
                        </div>
                        <h2 className="text-lg font-bold text-white tracking-tight leading-snug">
                          {q.question}
                        </h2>
                      </div>

                      <button
                        onClick={() => toggleMarkForReview(qIndex)}
                        className={`p-2 rounded-lg border transition-all duration-300 group
                          ${markedForReview[qIndex]
                            ? 'bg-yellow-500 text-black border-yellow-500'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-600 hover:border-yellow-500/50 hover:text-yellow-500'}`}
                        title="Mark for Review"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill={markedForReview[qIndex] ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                          <line x1="4" y1="22" x2="4" y2="15"></line>
                        </svg>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {q.options.map((option, oIndex) => (
                        <button
                          key={oIndex}
                          onClick={() => handleAnswerChange(qIndex, oIndex)}
                          className={`group flex items-center justify-between p-4 rounded-xl transition-all duration-300 border text-left
                                    ${answers[qIndex] === oIndex
                              ? 'bg-zinc-100 border-zinc-100 text-black shadow-lg shadow-white/5'
                              : 'bg-zinc-900/40 border-white/5 text-zinc-500 hover:border-zinc-700 hover:bg-zinc-900'
                            }`}
                        >
                          <span className="font-semibold text-xs uppercase tracking-wide">{option}</span>
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300
                                    ${answers[qIndex] === oIndex
                              ? 'border-black bg-black'
                              : 'border-zinc-800 group-hover:border-zinc-600'
                            }`}
                          >
                            {answers[qIndex] === oIndex && <span className="text-[10px] text-white font-black">✓</span>}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="max-w-md mx-auto relative pt-4 pb-24 group text-center">
                <div className="absolute inset-0 bg-blue-500/10 blur-[100px] group-hover:bg-blue-500/20 transition-all duration-700" />
                <button
                  onClick={handleSubmit}
                  disabled={answers.some(a => a === null)}
                  className="w-full relative z-10 py-5 bg-white text-black text-xs font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-zinc-200 transition-all active:scale-[0.98] shadow-2xl disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-center gap-4">
                    Finalize Assessment
                    <svg className="group-hover:translate-x-1 transition-transform" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </div>
                </button>
                {answers.some(a => a === null) && (
                  <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest mt-6 animate-pulse">
                    Resolve {questions.length - answeredCount} pending nodes
                  </p>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Final fallback: Initial Intro State
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 relative font-sans selection:bg-white/10 overflow-x-hidden flex flex-col">
      <Background />
      <Navbar />

      <main className="flex-grow flex items-center justify-center p-6 relative z-10 w-full overflow-y-auto">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">

          <div className="space-y-12 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-cyan-500/5 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="text-sm font-semibold text-cyan-400 tracking-widest uppercase mt-0.5">Growth Alignment</span>
            </div>

            <div className="space-y-6">
              <h1 className="text-3xl xl:text-4l font-semibold leading-tight tracking-tight text-white">
                Let's find the <br />
                <span className="text-zinc-400">right path for you.</span>
              </h1>
              <p className="text-lg text-zinc-400 max-w-lg leading-relaxed">
                To build a roadmap that respects your time, we'll start with a short assessment to see what you already know.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-cyan-500/5 border border-cyan-500/10 backdrop-blur-sm space-y-3 max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                  💡
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Compass Calibration</h3>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Think of this as a friendly design session with your AI roadmap architect. We use this data to weave a <span className="text-cyan-400 font-bold">personalized learning journey</span> that respects your existing expertise.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleStartAssessment}
                disabled={isFetchingQuestions || questions.length === 0}
                className="px-10 py-4 bg-zinc-100 text-black font-semibold rounded-2xl hover:bg-white transition-all active:scale-95 shadow-sm uppercase tracking-widest text-sm disabled:opacity-50"
              >
                {isFetchingQuestions ? 'Preparing...' : 'Begin Assessment'}
              </button>
              <button
                onClick={handleSkip}
                disabled={!currentSubject}
                className="px-10 py-4 bg-zinc-900 text-white font-semibold border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all active:scale-95 uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Skip & Start Learning
              </button>
            </div>
          </div>

          <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
            <div className="absolute -inset-10 bg-gradient-to-tr from-cyan-500/10 via-transparent to-blue-500/10 rounded-[60px] blur-3xl" />
            <div className="relative grid grid-cols-1 gap-4">
              {[
                { title: "Knowledge Mapping", desc: "Finds where you should start based on what you already know.", icon: "🎯" },
                { title: "Structured Growth", desc: "Connects concepts in a logical order to save you time.", icon: "🌱" },
                { title: "Personalized Paths", desc: "Adjusts the learning difficulty based on your goals.", icon: "📉" }
              ].map((feature, i) => (
                <div key={i} className="group p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-sm hover:border-cyan-500/30 transition-all">
                  <div className="flex gap-6 items-center">
                    <div className="w-14 h-14 bg-zinc-950 rounded-2xl flex items-center justify-center text-2xl border border-zinc-800 transition-colors group-hover:border-cyan-500/20">
                      {feature.icon}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-semibold text-white tracking-wide">{feature.title}</h3>
                      <p className="text-sm text-zinc-500 font-medium leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AssessmentPage;