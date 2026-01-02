import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import LoadingComponent from '../components/LoadingComponent';

const AssessmentPage = ({ currentSubject, onComplete }) => {
  const [step, setStep] = useState('intro'); // intro, assessment, loading
  const [answers, setAnswers] = useState(Array(5).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();

  const questions = [
    {
      question: "What does CPU stand for?",
      options: ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Computer Processing Unit"],
      correct: 0
    },
    {
      question: "What is the binary representation of the decimal number 10?",
      options: ["1010", "1001", "1100", "1110"],
      correct: 0
    },
    {
      question: "Which of the following is a programming paradigm that focuses on objects and classes?",
      options: ["Functional Programming", "Object-Oriented Programming", "Procedural Programming", "Logic Programming"],
      correct: 1
    },
    {
      question: "What does HTML stand for?",
      options: ["HyperText Markup Language", "HighText Machine Language", "HyperText Machine Learning", "HighText Markup Language"],
      correct: 0
    },
    {
      question: "In computer science, what does 'recursion' refer to?",
      options: ["A loop that runs forever", "A function that calls itself", "A type of data structure", "A sorting algorithm"],
      correct: 1
    }
  ];

  const handleStartAssessment = () => {
    setStep('assessment');
  };

  const handleAnswerChange = (questionIndex, optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
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

    // Calculate skill level based on score (0-100 scale)
    const skillValue = correctCount * 20; // 0-100 scale
    
    // Convert to 0-1 scale for NodeDetailPanel compatibility
    const normalizedSkillValue = skillValue / 100;

    // Create skills object with a default level for the subject
    const userSkills = {
      [currentSubject]: normalizedSkillValue
    };
    
    console.log('📋 [ASSESSMENT] User skills calculated:', userSkills);
    console.log('🔵 [ASSESSMENT] Step changing to loading...');

    // Generate personalized roadmap with user skills
    setStep('loading');
    try {
      console.log('🔵 [ASSESSMENT] Calling apiService.generateRoadmap...');
      const roadmapData = await apiService.generateRoadmap(currentSubject, userSkills);
      console.log('✅ [ASSESSMENT] generateRoadmap returned successfully');
      console.log('📊 [ASSESSMENT] Roadmap data received:', JSON.stringify(roadmapData, null, 2));
      
      onComplete(userSkills, roadmapData);
      navigate('/roadmap');
    } catch (err) {
      console.error('❌ [ASSESSMENT] generateRoadmap failed:', err.message);
      console.log('🔵 [ASSESSMENT] Trying fallback to generateGraph...');
      // Fallback to graph generation
      try {
        const graphData = await apiService.generateGraph(currentSubject);
        console.log('✅ [ASSESSMENT] generateGraph returned successfully');
        console.log('📊 [ASSESSMENT] Graph data received:', JSON.stringify(graphData, null, 2));
        
        onComplete(userSkills, graphData);
        navigate('/roadmap');
      } catch (fallbackErr) {
        console.error('❌ [ASSESSMENT] generateGraph also failed:', fallbackErr.message);
        navigate('/');
      }
    }
  };

  const handleSkip = async () => {
    // Skip assessment with default skills (50% - intermediate) converted to 0-1 scale
    const normalizedSkillValue = 0.5; // 0.5 = 50% = Intermediate
    
    const userSkills = {
      [currentSubject]: normalizedSkillValue
    };
    
    console.log('🔵 [ASSESSMENT] handleSkip called');
    console.log('📋 [ASSESSMENT] Using default skills:', userSkills);
    console.log('🔵 [ASSESSMENT] Step changing to loading...');

    setStep('loading');
    try {
      console.log('🔵 [ASSESSMENT] Calling apiService.generatePersonalizedGraph...');
      const graphData = await apiService.generatePersonalizedGraph(currentSubject, userSkills);
      console.log('✅ [ASSESSMENT] generatePersonalizedGraph returned successfully');
      console.log('📊 [ASSESSMENT] Graph data received:', JSON.stringify(graphData, null, 2));
      
      onComplete(userSkills, graphData);
      navigate('/roadmap');
    } catch (err) {
      console.error('❌ [ASSESSMENT] generatePersonalizedGraph failed:', err.message);
      console.log('🔵 [ASSESSMENT] Trying fallback to generateGraph...');
      // Fallback to basic graph generation
      try {
        const fallbackGraph = await apiService.generateGraph(currentSubject);
        console.log('✅ [ASSESSMENT] generateGraph returned successfully');
        console.log('📊 [ASSESSMENT] Fallback graph data:', JSON.stringify(fallbackGraph, null, 2));
        
        onComplete(userSkills, fallbackGraph);
        navigate('/roadmap');
      } catch (fallbackErr) {
        console.error('❌ [ASSESSMENT] generateGraph also failed:', fallbackErr.message);
        navigate('/');
      }
    }
  };

  const getLevel = (score) => {
    if (score <= 1) return "Beginner";
    if (score <= 3) return "Intermediate";
    return "Advanced";
  };

  const getLevelColor = (score) => {
    if (score <= 1) return "from-orange-400 to-red-500";
    if (score <= 3) return "from-blue-400 to-cyan-500";
    return "from-green-400 to-emerald-500";
  };

  if (step === 'loading') {
    return <LoadingComponent />;
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 bg-zinc-900 border border-zinc-800 rounded-2xl p-10 max-w-lg w-full text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl animate-bounce">
            ✓
          </div>

          <h2 className="text-3xl font-black text-white mb-4 tracking-tight">
            Assessment Complete!
          </h2>
          
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 mb-6">
            <div className="text-5xl font-black mb-2">
              <span className={`bg-gradient-to-r ${getLevelColor(score)} bg-clip-text text-transparent`}>
                {score}/5
              </span>
            </div>
            <div className="text-zinc-400 mb-4">Correct Answers</div>
            
            <div className={`inline-block px-6 py-2 bg-gradient-to-r ${getLevelColor(score)} rounded-full`}>
              <span className="text-white font-bold text-lg">{getLevel(score)}</span>
            </div>
          </div>

          <p className="text-zinc-400 mb-8 leading-relaxed">
            Generating your personalized <span className="text-white font-semibold">{currentSubject}</span> roadmap based on your skill level...
          </p>

          {/* Animated Loading Bars */}
          <div className="space-y-3">
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full animate-pulse" style={{ width: '100%' }} />
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full animate-pulse" style={{ width: '75%', animationDelay: '0.2s' }} />
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full animate-pulse" style={{ width: '50%', animationDelay: '0.4s' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'assessment') {
    const progress = (answers.filter(a => a !== null).length / questions.length) * 100;

    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
        
        <div className="relative z-10 bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-3xl w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Skill Assessment</h2>
            <p className="text-zinc-400">
              Testing your knowledge of <span className="text-cyan-400 font-semibold">{currentSubject}</span>
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-zinc-400 mb-2">
              <span>Progress</span>
              <span>{answers.filter(a => a !== null).length}/{questions.length} answered</span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-6 mb-8">
            {questions.map((q, qIndex) => (
              <div 
                key={qIndex} 
                className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all"
              >
                <h3 className="text-white font-bold mb-4 text-lg">
                  <span className="text-cyan-400 mr-2">{qIndex + 1}.</span>
                  {q.question}
                </h3>
                
                <div className="space-y-3">
                  {q.options.map((option, oIndex) => (
                    <label 
                      key={oIndex} 
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        answers[qIndex] === oIndex
                          ? 'border-cyan-500 bg-cyan-500/10'
                          : 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${qIndex}`}
                        value={oIndex}
                        checked={answers[qIndex] === oIndex}
                        onChange={() => handleAnswerChange(qIndex, oIndex)}
                        className="w-5 h-5 text-cyan-500 bg-zinc-950 border-zinc-700 focus:ring-cyan-500 focus:ring-offset-zinc-950"
                      />
                      <span className="ml-3 text-zinc-300">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleSubmit}
              disabled={answers.includes(null)}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl 
                       font-bold hover:shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 
                       disabled:cursor-not-allowed disabled:hover:shadow-none transition-all transform hover:scale-105 disabled:hover:scale-100"
            >
              Submit & Generate Roadmap →
            </button>
            <button
              onClick={handleSkip}
              className="px-6 py-4 border-2 border-zinc-700 text-zinc-300 rounded-xl font-bold 
                       hover:bg-zinc-800 hover:border-zinc-600 transition-all"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Intro step
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 bg-zinc-900 border border-zinc-800 rounded-2xl p-10 max-w-lg w-full text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-4xl">
          📝
        </div>

        <h2 className="text-3xl font-black text-white mb-4 tracking-tight">
          Skill Assessment
        </h2>
        <p className="text-zinc-400 mb-8 leading-relaxed">
          Let's assess your current knowledge of <span className="text-white font-semibold">{currentSubject}</span> to create a perfectly tailored learning roadmap for you.
        </p>

        {/* Features */}
        <div className="space-y-4 mb-8 text-left">
          <div className="flex items-start gap-4 bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold">
              1
            </div>
            <div>
              <h3 className="text-white font-bold mb-1">Answer 5 Questions</h3>
              <p className="text-zinc-400 text-sm">Quick multiple-choice questions about {currentSubject}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold">
              2
            </div>
            <div>
              <h3 className="text-white font-bold mb-1">Get Your Level</h3>
              <p className="text-zinc-400 text-sm">We'll determine if you're a beginner, intermediate, or advanced</p>
            </div>
          </div>

          <div className="flex items-start gap-4 bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold">
              3
            </div>
            <div>
              <h3 className="text-white font-bold mb-1">Personalized Roadmap</h3>
              <p className="text-zinc-400 text-sm">Receive a custom learning path matched to your skill level</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <button
          onClick={handleStartAssessment}
          className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl 
                   font-bold hover:shadow-lg hover:shadow-cyan-500/50 transition-all transform hover:scale-105 mb-3"
        >
          Start Assessment
        </button>
        <button
          onClick={handleSkip}
          className="w-full px-6 py-4 text-zinc-400 hover:text-white font-medium transition-colors"
        >
          Skip and use default level
        </button>
      </div>
    </div>
  );
};

export default AssessmentPage;