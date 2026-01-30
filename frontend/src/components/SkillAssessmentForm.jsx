import { useState } from 'react';

const SkillAssessmentForm = ({ topics, onComplete, onSkip }) => {
  const [answers, setAnswers] = useState(Array(5).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

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

  const handleAnswerChange = (questionIndex, optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    let correctCount = 0;
    answers.forEach((answer, index) => {
      if (answer === questions[index].correct) correctCount++;
    });
    setScore(correctCount);
    setSubmitted(true);

    // Calculate skill level based on score (normalized to 0-1)
    const skillValue = correctCount / questions.length;

    // Create skills object for all topics
    const skills = {};
    topics.forEach(topic => {
      skills[topic.id] = skillValue;
    });

    onComplete(skills);
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

  const getLevelEmoji = (score) => {
    if (score <= 1) return "🌱";
    if (score <= 3) return "🚀";
    return "⭐";
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 bg-zinc-900 border border-zinc-800 rounded-2xl p-10 max-w-lg w-full text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl animate-bounce">
            {getLevelEmoji(score)}
          </div>

          <h2 className="text-3xl font-black text-white mb-4 tracking-tight">
            Assessment Complete!
          </h2>

          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 mb-6">
            <div className="text-6xl font-black mb-2">
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
            Great job! Your skill level has been assessed. Ready to continue with your personalized roadmap?
          </p>

          <button
            onClick={() => setSubmitted(false)}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl 
                     font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-105"
          >
            Retake Assessment
          </button>
        </div>
      </div>
    );
  }

  const progress = (answers.filter(a => a !== null).length / questions.length) * 100;

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

      <div className="relative z-10 bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-3xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-full text-sm text-zinc-400 uppercase tracking-wider">
            📝 Skill Assessment
          </div>
          <h2 className="text-3xl font-black text-white mb-3 tracking-tight">Test Your Knowledge</h2>
          <p className="text-zinc-400">
            Answer these questions to help us personalize your learning path
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
              className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full transition-all duration-300"
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
                <span className="text-purple-400 mr-2">{qIndex + 1}.</span>
                {q.question}
              </h3>

              <div className="space-y-3">
                {q.options.map((option, oIndex) => (
                  <label
                    key={oIndex}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${answers[qIndex] === oIndex
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900'
                      }`}
                  >
                    <input
                      type="radio"
                      name={`question-${qIndex}`}
                      value={oIndex}
                      checked={answers[qIndex] === oIndex}
                      onChange={() => handleAnswerChange(qIndex, oIndex)}
                      className="w-5 h-5 text-purple-500 bg-zinc-950 border-zinc-700 focus:ring-purple-500 focus:ring-offset-zinc-950"
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
            className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl 
                     font-bold hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 
                     disabled:cursor-not-allowed disabled:hover:shadow-none transition-all transform hover:scale-105 disabled:hover:scale-100"
          >
            Submit Assessment →
          </button>
          <button
            onClick={onSkip}
            className="px-6 py-4 border-2 border-zinc-700 text-zinc-300 rounded-xl font-bold 
                     hover:bg-zinc-800 hover:border-zinc-600 transition-all"
          >
            Skip
          </button>
        </div>

        {/* Help Text */}
        <p className="text-center text-zinc-500 text-sm mt-6">
          💡 Don't worry if you don't know all the answers - we'll customize your path accordingly
        </p>
      </div>
    </div>
  );
};

export default SkillAssessmentForm;