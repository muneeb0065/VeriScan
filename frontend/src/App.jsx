import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ModeProvider } from './context/ModeContext';
import { AuthProvider } from './context/AuthContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import Landing from './pages/public/Landing';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import About from './pages/public/About';
import Contact from './pages/public/Contact';

// Dashboard Pages — Academic Mode
import Overview from './pages/dashboard/Overview';
import Scan from './pages/dashboard/Scan';
import History from './pages/dashboard/History';
import Settings from './pages/dashboard/Settings';

// Dashboard Pages — General (Cybersecurity) Mode
import ThreatDashboard from './pages/dashboard/ThreatDashboard';
import DeepfakeScanner from './pages/dashboard/DeepfakeScanner';
import SocialEngineering from './pages/dashboard/SocialEngineering';
import MetadataForensics from './pages/dashboard/MetadataForensics';
import UrlScanner from './pages/dashboard/UrlScanner';

// Shared Dashboard Pages
import BlockchainLog from './pages/dashboard/BlockchainLog';

const App = () => {
  return (
    <AuthProvider>
      <ModeProvider>
        <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Landing />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
          </Route>

          {/* Dashboard Routes (both modes share the same layout) */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            {/* Academic Mode Pages */}
            <Route index element={<Overview />} />
            <Route path="scan" element={<Scan />} />
            <Route path="history" element={<History />} />

            {/* General (Cybersecurity) Mode Pages */}
            <Route path="threats" element={<ThreatDashboard />} />
            <Route path="deepfake" element={<DeepfakeScanner />} />
            <Route path="social-engineering" element={<SocialEngineering />} />
            <Route path="metadata" element={<MetadataForensics />} />
            <Route path="url-scanner" element={<UrlScanner />} />

            {/* Shared Pages (both modes) */}
            <Route path="blockchain" element={<BlockchainLog />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Catch-all — Redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ModeProvider>
    </AuthProvider>
  );
};

export default App;