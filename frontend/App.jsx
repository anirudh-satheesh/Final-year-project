import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import HomePage from './src/pages/HomePage';
import AssessmentPage from './src/pages/AssessmentPage';
import RoadmapPage from './src/pages/RoadmapPage';
import LessonPage from './src/pages/LessonPage';
import DashboardPage from './src/pages/DashboardPage';
import ChatPage from './src/pages/ChatPage';
import { AuthProvider } from './src/contexts/AuthContext';

function App() {
  const [currentSubject, setCurrentSubject] = useState('');
  const [userSkills, setUserSkills] = useState({});
  const [roadmapData, setRoadmapData] = useState(null);

  const handleAssessmentComplete = (skills, data) => {
    setUserSkills(skills);
    setRoadmapData(data);
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
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
