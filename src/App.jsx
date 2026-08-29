import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import PageContainer from './components/layout/PageContainer';
import GovernmentDashboard from './pages/GovernmentDashboard';
import CommunityDashboard from './pages/CommunityDashboard';

function App() {
  return (
    <Router>
      <PageContainer>
        {/* Navigation is persistent across views to allow easy switching during testing */}
        <Navbar />
        
        {/* Core Router for Government and Community modes */}
        <Routes>
          <Route path="/government" element={<GovernmentDashboard />} />
          <Route path="/community" element={<CommunityDashboard />} />
          {/* Default fallback redirects to Government view */}
          <Route path="*" element={<Navigate to="/government" replace />} />
        </Routes>
      </PageContainer>
    </Router>
  );
}

export default App;
