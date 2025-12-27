import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import Landing from './pages/public/Landing';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import About from './pages/public/About';
import Contact from './pages/public/Contact';

// Dashboard Pages
import Overview from './pages/dashboard/Overview';
import Scan from './pages/dashboard/Scan';
import History from './pages/dashboard/History';
import Settings from './pages/dashboard/Settings';

const App = () => {
  return (
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

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="scan" element={<Scan />} />
          <Route path="history" element={<History />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Catch-all - Redirect to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;