import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import LoadingComponent from '../components/LoadingComponent';

const AssessmentPage = ({ currentSubject, onComplete }) => {
  const [step, setStep] = useState('intro'); // intro, assessment, loading
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
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
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('❌ [ASSESSMENT] Failed to fetch questions:', err);
        }
        // Fallback or error handling
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
  };

  const handleAnswerChange = (optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
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

    // We don't set step to 'loading' here because 'submitted' state handles the UI
    // setStep('loading');

    console.log('🔵 [ASSESSMENT] preparing to call generateRoadmap');
    console.log('🔵 [ASSESSMENT] Subject:', currentSubject);
    console.log('🔵 [ASSESSMENT] Skills:', JSON.stringify(userSkills));

    try {
      console.log('🚀 [ASSESSMENT] Invoking apiService.generateRoadmap...');
      const roadmapData = await apiService.generateRoadmap(currentSubject, userSkills);
      console.log('✅ [ASSESSMENT] generateRoadmap completed successfully');

      onComplete(userSkills, roadmapData);
      navigate('/roadmap');
    } catch (err) {
      console.error('❌ [ASSESSMENT] generateRoadmap failed:', err.message);
      try {
        console.log('⚠️ [ASSESSMENT] Attempting fallback to generateGraph...');
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
    if (ratio <= 0.3) return "Beginner";
    if (ratio <= 0.7) return "Intermediate";
    return "Advanced";
  };

  const getLevelColor = (score) => {
    const ratio = score / questions.length;
    if (ratio <= 0.3) return "from-orange-400 to-red-500";
    if (ratio <= 0.7) return "from-blue-400 to-cyan-500";
    return "from-green-400 to-emerald-500";
  };

  if (step === 'loading') {
    return <LoadingComponent />;
  }

  // Common background components
  const Background = () => (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] brightness-50 contrast-150 mix-blend-overlay" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:32px_32px]" />
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
              <span className="text-5xl animate-in zoom-in duration-700">✓</span>
            </div>
            <div className="absolute -inset-4 border border-emerald-500/10 rounded-full animate-spin-slow" />
          </div>

          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/20 mb-8">
            <span className="text-[10px] font-black text-emerald-400 tracking-[0.2em] uppercase leading-none mt-0.5">Assessment Complete</span>
          </div>

          <h2 className="text-[48px] font-black leading-tight tracking-tight text-white uppercase mb-4">
            Your <span className="italic font-serif normal-case font-normal text-cyan-400">Level</span> is set.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 text-left">
            <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-sm">
              <div className="text-4xl font-black text-white mb-2 tracking-tight">
                <span className={`bg-gradient-to-r ${getLevelColor(score)} bg-clip-text text-transparent`}>
                  {score}/{questions.length}
                </span>
              </div>
              <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-tight">Correct <br />Architectural Responses</div>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-sm flex flex-col justify-center">
              <div className="text-2xl font-black text-white mb-1 tracking-tight uppercase">
                {getLevel(score)}
              </div>
              <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-tight">Calculated Expertise <br />Tier</div>
            </div>
          </div>

          <p className="text-lg text-zinc-500 font-medium mb-12 max-w-lg mx-auto leading-relaxed">
            Our Path Architect is now weaving a custom learning journey for <span className="text-white">{currentSubject}</span> based on your specific baseline.
          </p>

          <div className="space-y-4">
            <div className="h-1 bg-zinc-900 rounded-full overflow-hidden w-full max-w-md mx-auto relative border border-zinc-800/50">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full animate-shimmer" style={{ width: '100%' }} />
            </div>
            <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-[0.3em] animate-pulse">Initializing Knowledge Manifest</p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'assessment') {
    const q = questions[currentQuestionIndex];
    if (!q) return <LoadingComponent />;
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-[#030303] text-zinc-100 flex flex-col relative font-sans selection:bg-cyan-500/30 overflow-hidden">
        <Background />

        <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-5 border-b border-zinc-800/50 backdrop-blur-xl bg-black/40">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-xl italic tracking-tighter">S</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-white uppercase">Strive</span>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-[10px] font-black text-zinc-600 tracking-[0.2em] uppercase">Step {currentQuestionIndex + 1} of {questions.length}</div>
              <div className="w-32 h-1 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/50">
                <div className="h-full bg-cyan-500 transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-1 flex items-center justify-center p-6 relative z-10 pt-24">
          <div className="w-full max-w-4xl grid lg:grid-cols-[1fr_auto] gap-16 items-start">

            <div className="space-y-12 animate-in fade-in slide-in-from-left-8 duration-700">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-3 px-3 py-1 rounded-lg bg-cyan-500/5 border border-cyan-500/10">
                  <span className="text-[10px] font-black text-cyan-500 tracking-widest uppercase">Probe {currentQuestionIndex + 1}</span>
                </div>
                <h2 className="text-3xl lg:text-5xl font-black leading-tight tracking-tight text-white uppercase">
                  {q.question}
                </h2>
              </div>

              <div className="grid gap-3">
                {q.options.map((option, oIndex) => (
                  <button
                    key={oIndex}
                    onClick={() => handleAnswerChange(oIndex)}
                    className={`group flex items-center justify-between p-5 rounded-2xl transition-all duration-300 border text-left
                                    ${answers[currentQuestionIndex] === oIndex
                        ? 'bg-cyan-500/10 border-cyan-500 text-white'
                        : 'bg-zinc-900/40 border-zinc-800/60 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900/60'
                      }`}
                  >
                    <span className="font-semibold text-sm lg:text-base">{option}</span>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
                                    ${answers[currentQuestionIndex] === oIndex
                        ? 'border-cyan-500 bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                        : 'border-zinc-700 group-hover:border-zinc-500'
                      }`}
                    >
                      {answers[currentQuestionIndex] === oIndex && <span className="text-[10px] text-black font-black">✓</span>}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="flex gap-3">
                  {currentQuestionIndex > 0 && (
                    <button
                      onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                      className="px-6 py-3 bg-zinc-900 text-zinc-400 font-bold border border-zinc-800 rounded-xl hover:text-white hover:border-zinc-700 transition-all uppercase text-[10px] tracking-widest"
                    >
                      Previous
                    </button>
                  )}
                </div>

                <div className="flex gap-3">
                  {currentQuestionIndex < questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                      disabled={answers[currentQuestionIndex] === null}
                      className="px-8 py-3 bg-zinc-100 text-black font-black rounded-xl hover:bg-cyan-400 transition-all shadow-lg uppercase text-[10px] tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next Question →
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={answers[currentQuestionIndex] === null}
                      className="px-8 py-3 bg-zinc-100 text-black font-black rounded-xl hover:bg-cyan-400 transition-all shadow-lg uppercase text-[10px] tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Submit Final
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="hidden lg:block w-72 space-y-8 sticky top-32">
              <div className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-sm space-y-4">
                <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400">🧠</div>
                <div>
                  <p className="text-[10px] font-black text-white uppercase tracking-wider mb-1">Baseline Analysis</p>
                  <p className="text-xs text-zinc-500 leading-relaxed">Each response refines the neural weights of your learning graph.</p>
                </div>
              </div>

              <div className="px-6 space-y-2">
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em]">Current Subject</p>
                <p className="text-xl font-black text-white italic font-serif ">{currentSubject}</p>
              </div>
            </div>

          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 flex items-center justify-center p-6 relative font-sans selection:bg-cyan-500/30 overflow-hidden">
      <Background />

      <div className="relative z-10 w-full max-w-5xl grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">

        <div className="space-y-12 animate-in fade-in slide-in-from-left-8 duration-1000">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-cyan-500/5 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-[10px] font-black text-cyan-400 tracking-[0.2em] uppercase leading-none mt-0.5">Objective Validation</span>
          </div>

          <div className="space-y-6">
            <h1 className="text-[56px] xl:text-[76px] font-black leading-[0.95] tracking-tight text-white uppercase">
              Quantify <br />
              <span className="italic font-serif normal-case font-normal text-cyan-400">Baseline</span>
            </h1>
            <p className="text-lg text-zinc-400 max-w-lg leading-relaxed font-medium">
              To build the perfect path, we must understand your current coordinates. A brief assessment ensures you don't waste time on mastered concepts.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleStartAssessment}
              disabled={isFetchingQuestions || questions.length === 0}
              className="px-12 py-5 bg-zinc-100 text-black font-black rounded-2xl hover:bg-cyan-400 transition-all active:scale-95 shadow-xl shadow-cyan-500/10 uppercase tracking-widest text-xs disabled:opacity-50"
            >
              {isFetchingQuestions ? 'Preparing Assessment...' : 'Begin Assessment'}
            </button>
          </div>
        </div>

        <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
          <div className="absolute -inset-10 bg-gradient-to-tr from-cyan-500/10 via-transparent to-blue-500/10 rounded-[60px] blur-3xl" />

          <div className="relative grid grid-cols-1 gap-4">
            {[
              { title: "Precision Mapping", desc: "Determines starting point in the knowledge graph.", icon: "🎯" },
              { title: "Efficiency Loop", desc: "Bypasses existing expertise to accelerate mastery.", icon: "⚡" },
              { title: "Tier Calibration", desc: "Selects appropriate depth based on your persona.", icon: "📉" }
            ].map((feature, i) => (
              <div key={i} className="group p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-sm hover:border-cyan-500/30 transition-all">
                <div className="flex gap-6 items-center">
                  <div className="w-14 h-14 bg-zinc-950 rounded-2xl flex items-center justify-center text-2xl border border-zinc-800 transition-colors group-hover:border-cyan-500/20">
                    {feature.icon}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">{feature.title}</h3>
                    <p className="text-xs text-zinc-500 font-medium leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentPage;