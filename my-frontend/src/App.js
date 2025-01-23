import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import JournalEntryPage from './pages/JournalEntryPage';
import InsightsPage from './pages/InsightsPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage'; // Add LandingPage component
import { UserProvider } from './UserContext';

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            {/* Landing Page route */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Main App Pages */}
            <Route path="/journal" element={<JournalEntryPage />} />
            <Route path="/authpage" element={<AuthPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
