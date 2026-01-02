import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = ({ currentSubject, setCurrentSubject }) => {
  const navigate = useNavigate();

  const handleGenerateRoadmap = () => {
    if (!currentSubject.trim()) return;
    navigate('/assessment');
  };

  const subjects = [
    'Web Development',
    'Data Science',
    'Machine Learning',
    'Mobile Development',
    'DevOps',
    'Cybersecurity',
    'Blockchain',
    'AI Engineering'
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            STRIVE
          </div>
          <div className="flex items-center gap-8 text-sm font-medium">
            <button onClick={() => scrollToSection('features')} className="text-zinc-400 hover:text-white transition-colors">
              Features
            </button>
            <button onClick={() => scrollToSection('about')} className="text-zinc-400 hover:text-white transition-colors">
              About
            </button>
            <button onClick={() => scrollToSection('contact')} className="text-zinc-400 hover:text-white transition-colors">
              Contact
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Full Height */}
      <section className="h-screen flex items-center justify-center relative overflow-hidden border-b border-zinc-800">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]" />
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-full text-sm text-zinc-400 backdrop-blur-sm">
            ✨ AI-Powered Learning Platform
          </div>
          
          <h1 className="text-7xl md:text-8xl font-black tracking-tighter mb-6 leading-none">
            Learn Smarter,
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Not Harder
            </span>
          </h1>
          
          <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Get personalized learning roadmaps powered by AI. Master any skill with 
            structured paths designed around your goals and experience level.
          </p>

          {/* Input Area */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-300" />
              <div className="relative flex gap-3 bg-zinc-900 rounded-2xl p-2 border border-zinc-800">
                <input
                  type="text"
                  placeholder="What do you want to master? (e.g., React, Python, ML)"
                  value={currentSubject}
                  onChange={(e) => setCurrentSubject(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleGenerateRoadmap()}
                  className="flex-1 px-6 py-4 bg-transparent text-white placeholder-zinc-500 focus:outline-none text-lg"
                />
                <button
                  onClick={handleGenerateRoadmap}
                  disabled={!currentSubject.trim()}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold 
                           hover:shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed 
                           transition-all transform hover:scale-105"
                >
                  Generate →
                </button>
              </div>
            </div>
          </div>

          {/* Popular Subjects */}
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => setCurrentSubject(subject)}
                className="px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg text-sm text-zinc-300 
                         hover:bg-zinc-800 hover:border-zinc-700 hover:text-white transition-all backdrop-blur-sm"
              >
                {subject}
              </button>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-zinc-700 rounded-full flex justify-center p-2">
            <div className="w-1 h-3 bg-zinc-600 rounded-full" />
          </div>
        </div>
      </section>

      {/* Features Section - Full Height */}
      <section id="features" className="min-h-screen flex items-center border-b border-zinc-800 relative">
        <div className="max-w-7xl mx-auto px-6 py-20 w-full">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-zinc-400">Everything you need to master any skill</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-300" />
              <div className="relative h-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 text-2xl">
                  🎯
                </div>
                <h3 className="text-2xl font-bold mb-4">Smart Assessment</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Our AI analyzes your current skill level and creates a personalized learning path 
                  that starts exactly where you are.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-300" />
              <div className="relative h-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 text-2xl">
                  🗺️
                </div>
                <h3 className="text-2xl font-bold mb-4">Structured Roadmaps</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Follow step-by-step learning paths with clear milestones, curated resources, 
                  and realistic time estimates.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-300" />
              <div className="relative h-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 text-2xl">
                  📊
                </div>
                <h3 className="text-2xl font-bold mb-4">Progress Tracking</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Monitor your journey with detailed analytics, completion rates, and achievements 
                  as you advance through your roadmap.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-orange-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-300" />
              <div className="relative h-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 text-2xl">
                  📚
                </div>
                <h3 className="text-2xl font-bold mb-4">Curated Resources</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Access hand-picked tutorials, courses, articles, and projects from the best 
                  sources across the web.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-yellow-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-300" />
              <div className="relative h-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-xl flex items-center justify-center mb-6 text-2xl">
                  ⚡
                </div>
                <h3 className="text-2xl font-bold mb-4">Adaptive Learning</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Roadmaps evolve with you. As you progress, the AI adjusts recommendations 
                  based on your pace and preferences.
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-300" />
              <div className="relative h-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 text-2xl">
                  🤝
                </div>
                <h3 className="text-2xl font-bold mb-4">Community Support</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Connect with fellow learners, share progress, get help, and stay motivated 
                  on your learning journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Full Height */}
      <section id="about" className="min-h-screen flex items-center border-b border-zinc-800 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" />
        
        <div className="max-w-5xl mx-auto px-6 py-20 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-6">
                About Strive
              </h2>
              <div className="space-y-6 text-lg text-zinc-400 leading-relaxed">
                <p>
                  We believe learning should be personal, structured, and achievable. 
                  That's why we built Strive – an AI-powered platform that transforms 
                  the overwhelming world of online education into clear, actionable roadmaps.
                </p>
                <p>
                  Whether you're switching careers, upskilling for your current role, 
                  or exploring a passion project, Strive helps you learn with intention 
                  and purpose.
                </p>
                <p>
                  Our mission is to democratize expert-level learning paths and make 
                  skill acquisition accessible to everyone, regardless of background or 
                  starting point.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                <div className="text-4xl font-black text-cyan-400 mb-2">10,000+</div>
                <div className="text-zinc-400">Roadmaps Generated</div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                <div className="text-4xl font-black text-blue-400 mb-2">50+</div>
                <div className="text-zinc-400">Skills Covered</div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                <div className="text-4xl font-black text-purple-400 mb-2">95%</div>
                <div className="text-zinc-400">User Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - Full Height */}
      <section id="contact" className="min-h-screen flex items-center relative">
        <div className="max-w-4xl mx-auto px-6 py-20 w-full text-center">
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-6">
            Get In Touch
          </h2>
          <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto">
            Have questions? Want to partner with us? We'd love to hear from you.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-xl">
                📧
              </div>
              <h3 className="font-bold mb-2">Email Us</h3>
              <p className="text-zinc-400 text-sm">hello@strive.ai</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-xl">
                💬
              </div>
              <h3 className="font-bold mb-2">Live Chat</h3>
              <p className="text-zinc-400 text-sm">Available 24/7</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-xl">
                🐦
              </div>
              <h3 className="font-bold mb-2">Social Media</h3>
              <p className="text-zinc-400 text-sm">@strivelearn</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
              <div className="space-y-6">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-6 py-4 bg-zinc-950 border border-zinc-800 rounded-xl text-white 
                             placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-6 py-4 bg-zinc-950 border border-zinc-800 rounded-xl text-white 
                             placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Your Message"
                    rows="5"
                    className="w-full px-6 py-4 bg-zinc-950 border border-zinc-800 rounded-xl text-white 
                             placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors resize-none"
                  />
                </div>
                <button className="w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl 
                                 font-bold hover:shadow-lg hover:shadow-cyan-500/50 transition-all transform hover:scale-105">
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              STRIVE
            </div>
            <div className="text-zinc-500 text-sm">
              © 2024 Strive. Empowering learners worldwide.
            </div>
            <div className="flex gap-6 text-sm text-zinc-400">
              <a href="#privacy" className="hover:text-white transition-colors">Privacy</a>
              <a href="#terms" className="hover:text-white transition-colors">Terms</a>
              <a href="#cookies" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;