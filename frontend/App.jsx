import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import HomePage from './src/pages/HomePage';
import AssessmentPage from './src/pages/AssessmentPage';
import RoadmapPage from './src/pages/RoadmapPage';
import LessonPage from './src/pages/LessonPage';
import DashboardPage from './src/pages/DashboardPage';
import ChatPage from './src/pages/ChatPage';
import ExplorePage from './src/pages/ExplorePage';
import ProfilePage from './src/pages/ProfilePage';
import { AuthProvider } from './src/contexts/AuthContext';

function App() {
  const [currentSubject, setCurrentSubject] = useState('');
  const [userSkills, setUserSkills] = useState(() => {
    const saved = localStorage.getItem('strive_user_skills');
    return saved ? JSON.parse(saved) : {};
  });
  const [roadmapData, setRoadmapData] = useState(() => {
    const saved = localStorage.getItem('strive_current_roadmap');
    return saved ? JSON.parse(saved) : null;
  });

  const handleAssessmentComplete = (skills, data) => {
    const newSkills = { ...userSkills, ...skills };
    setUserSkills(newSkills);
    setRoadmapData(data);

    // Store in localStorage
    localStorage.setItem('strive_user_skills', JSON.stringify(newSkills));
    localStorage.setItem('strive_current_roadmap', JSON.stringify(data));
    localStorage.setItem('strive_current_subject', currentSubject);

    // Track journeys for the dashboard
    if (currentSubject) {
      const savedJourneys = localStorage.getItem('strive_journeys');
      const journeys = savedJourneys ? JSON.parse(savedJourneys) : [];
      const existingIdx = journeys.findIndex(j => j.title === currentSubject);

      const journey = {
        id: existingIdx >= 0 ? journeys[existingIdx].id : Date.now(),
        title: currentSubject,
        status: 'in-progress',
        lastUpdated: new Date().toISOString()
      };

      if (existingIdx >= 0) journeys[existingIdx] = journey;
      else journeys.push(journey);

      localStorage.setItem('strive_journeys', JSON.stringify(journeys));
    }
  };

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-zinc-950">
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  currentSubject={currentSubject}
                  setCurrentSubject={setCurrentSubject}
                />
              }
            />
            <Route
              path="/chat"
              element={
                <ChatPage
                  setCurrentSubject={setCurrentSubject}
                />
              }
            />
            <Route
              path="/explore"
              element={
                <ExplorePage
                  setCurrentSubject={setCurrentSubject}
                />
              }
            />
            <Route
              path="/assessment"
              element={
                <AssessmentPage
                  currentSubject={currentSubject}
                  onComplete={handleAssessmentComplete}
                />
              }
            />
            <Route
              path="/roadmap"
              element={
                <RoadmapPage
                  roadmapData={roadmapData}
                  userSkills={userSkills}
                  setUserSkills={setUserSkills}
                  currentSubject={currentSubject}
                />
              }
            />
            <Route path="/lesson/:topicId" element={<LessonPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
