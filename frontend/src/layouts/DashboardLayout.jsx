/* ============================================
 * DashboardLayout.jsx — Dashboard Page Wrapper
 * 
 * This layout wraps ALL dashboard pages (both Academic & Security modes).
 * It provides:
 *   - Top header bar with logo, mode switcher, notifications, user menu
 *   - Tab navigation row (changes based on active mode)
 *   - Auto-redirect when switching modes
 *   - Footer with logout link
 * 
 * The <Outlet /> renders the actual page content (Overview, Scan, etc.)
 * ============================================ */

import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaChartPie, FaSearch, FaHistory, FaCog, FaSignOutAlt,
  FaBell, FaShieldAlt, FaEye, FaEnvelopeOpenText,
  FaFingerprint, FaGlobe, FaCubes, FaGraduationCap
} from 'react-icons/fa';
import { useMode } from '../context/ModeContext';
import { useAuth } from '../context/AuthContext';

// ============================================
// ROUTE DEFINITIONS — which pages belong to which mode
// Used by the auto-redirect logic below
// ============================================
const SECURITY_ONLY_PATHS = [
  '/dashboard/threats',
  '/dashboard/deepfake',
  '/dashboard/social-engineering',
  '/dashboard/url-scanner',
  '/dashboard/metadata',
];

const ACADEMIC_ONLY_PATHS = [
  '/dashboard',          // Overview (exact match)
  '/dashboard/scan'
];

const DashboardLayout = () => {
  const { mode, toggleMode, isAcademic } = useMode();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const userEmail = currentUser?.email || 'demo@veriscan.io';
  const userName = userEmail.split('@')[0];
  const displayName = userName.charAt(0).toUpperCase() + userName.slice(1);
  const initials = displayName.substring(0, 2).toUpperCase();

  // Dropdown toggle states
  const [showNotif, setShowNotif] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // ============================================
  // AUTO-REDIRECT when mode changes
  // If user switches to Academic while on a Security page → go to /dashboard
  // If user switches to Security while on an Academic page → go to /dashboard/threats
  // Shared pages (blockchain, settings) don't redirect
  // ============================================
  useEffect(() => {
    const path = location.pathname;

    if (isAcademic && SECURITY_ONLY_PATHS.includes(path)) {
      navigate('/dashboard', { replace: true });
    }

    if (!isAcademic) {
      const isOnAcademicPage = path === '/dashboard' || ACADEMIC_ONLY_PATHS.slice(1).includes(path);
      if (isOnAcademicPage) {
        navigate('/dashboard/threats', { replace: true });
      }
    }
  }, [isAcademic, location.pathname, navigate]);

  // ============================================
  // NAVIGATION ITEMS — each mode has its own tabs
  // ============================================
  const academicNav = [
    { name: 'Overview', path: '/dashboard', icon: <FaChartPie />, end: true },
    { name: 'Scan', path: '/dashboard/scan', icon: <FaSearch /> },
    { name: 'History', path: '/dashboard/history', icon: <FaHistory /> },
    { name: 'Blockchain', path: '/dashboard/blockchain', icon: <FaCubes /> },
  ];

  const generalNav = [
    { name: 'Threats', path: '/dashboard/threats', icon: <FaShieldAlt /> },
    { name: 'AI Media', path: '/dashboard/deepfake', icon: <FaEye /> },
    { name: 'Phishing', path: '/dashboard/social-engineering', icon: <FaEnvelopeOpenText /> },
    { name: 'URL Scan', path: '/dashboard/url-scanner', icon: <FaGlobe /> },
    { name: 'Metadata', path: '/dashboard/metadata', icon: <FaFingerprint /> },
    { name: 'History', path: '/dashboard/history', icon: <FaHistory /> },
    { name: 'Blockchain', path: '/dashboard/blockchain', icon: <FaCubes /> },
  ];

  const currentNav = isAcademic ? academicNav : generalNav;

  // Active color classes based on current mode
  const activeColor = isAcademic ? 'text-veriscan-purple' : 'text-orange-500';
  const activeBg = isAcademic ? 'bg-veriscan-purple' : 'bg-orange-500';

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* ===== TOP HEADER BAR ===== */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">

        {/* Row 1: Logo + Mode Switcher + User Actions */}
        <div className="px-6 h-14 flex items-center justify-between">

          {/* Left side: Logo + Mode Toggle */}
          <div className="flex items-center gap-4">
            {/* Logo — links back to landing page */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 bg-gradient-to-br from-veriscan-purple to-veriscan-teal rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-xs">V</span>
              </div>
              <span className="text-base font-black text-slate-800 tracking-tight">VeriScan</span>
            </Link>

            <div className="h-5 w-px bg-slate-200" />

            {/* Mode Switcher — Academic / Security pill toggle */}
            <div className="relative flex items-center bg-slate-200/70 rounded-full p-[3px]">
              {/* Sliding colored pill background */}
              <motion.div
                layout
                className={`absolute top-[3px] bottom-[3px] rounded-full shadow-sm ${activeBg} ${
                  isAcademic ? 'left-[3px] w-[calc(50%-3px)]' : 'left-[calc(50%)] w-[calc(50%-3px)]'
                }`}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
              {/* Academic button */}
              <button
                onClick={() => !isAcademic && toggleMode()}
                className={`relative z-10 flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-full transition-colors ${
                  isAcademic ? 'text-white' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <FaGraduationCap className="text-xs" /> Academic
              </button>
              {/* Security button */}
              <button
                onClick={() => isAcademic && toggleMode()}
                className={`relative z-10 flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-full transition-colors ${
                  !isAcademic ? 'text-white' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <FaShieldAlt className="text-xs" /> Security
              </button>
            </div>
          </div>

          {/* Right side: Settings + Notifications + User */}
          <div className="flex items-center gap-2 relative">
            {/* Settings gear icon */}
            <NavLink to="/dashboard/settings" className={({ isActive }) => `p-2 rounded-lg transition-colors ${isActive ? 'bg-slate-100 text-slate-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}>
              <FaCog className="text-sm" />
            </NavLink>

            {/* Bell — Notification Dropdown */}
            <div className="relative">
              <button
                onClick={() => { setShowNotif(!showNotif); setShowUserMenu(false); }}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors relative"
              >
                <FaBell className="text-sm" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </button>
              {showNotif && (
                <>
                  {/* Invisible overlay to close dropdown when clicking outside */}
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotif(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute right-0 top-10 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-700">Notifications</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-red-50 text-red-500 rounded-full">3 new</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {[
                        { msg: 'AI content detected in Research_Paper.pdf', time: '2 min ago', type: 'warning' },
                        { msg: 'Scan complete: Essay_Review.docx — Clean', time: '1 hour ago', type: 'success' },
                        { msg: 'New blockchain block verified #24', time: '3 hours ago', type: 'info' },
                      ].map((n, i) => (
                        <div key={i} className="px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 cursor-pointer">
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                              n.type === 'warning' ? 'bg-amber-400' : n.type === 'success' ? 'bg-emerald-400' : 'bg-blue-400'
                            }`} />
                            <div>
                              <p className="text-xs text-slate-700 font-medium">{n.msg}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">{n.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2.5 border-t border-slate-100 text-center">
                      <button className="text-xs font-semibold text-veriscan-purple hover:underline">View all notifications</button>
                    </div>
                  </motion.div>
                </>
              )}
            </div>

            <div className="h-5 w-px bg-slate-200 mx-1" />

            {/* User Avatar — Dropdown Menu */}
            <div className="relative">
              <div
                onClick={() => { setShowUserMenu(!showUserMenu); setShowNotif(false); }}
                className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-veriscan-purple to-veriscan-teal flex items-center justify-center text-white font-bold text-[10px]">
                  {initials}
                </div>
                <span className="text-xs font-semibold text-slate-600 hidden md:block">{displayName}</span>
              </div>
              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute right-0 top-10 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-700">{displayName}</p>
                      <p className="text-xs text-slate-400">{userEmail}</p>
                    </div>
                    <div className="py-1">
                      <NavLink
                        to="/dashboard/settings"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        <FaCog className="text-slate-400 text-xs" /> Settings
                      </NavLink>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <FaSignOutAlt className="text-xs" /> Logout
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Row 2: Page Navigation Tabs */}
        <div className="px-6 flex items-center gap-1 overflow-x-auto scrollbar-hide border-t border-slate-100">
          {currentNav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `relative flex items-center gap-2 px-4 py-3 text-[13px] font-bold whitespace-nowrap transition-colors ${
                  isActive ? activeColor : 'text-slate-400 hover:text-slate-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="text-sm">{item.icon}</span>
                  <span>{item.name}</span>
                  {/* Active tab underline — slides between tabs */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className={`absolute bottom-0 left-2 right-2 h-[3px] rounded-full ${activeBg}`}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </header>

      {/* ===== PAGE CONTENT ===== */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-6">
        <Outlet />
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="py-4 px-6 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <p className="text-slate-400 text-xs">
            © 2026 VeriScan — Blockchain-Integrated Digital Forensics Platform
          </p>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-500 transition-colors font-medium">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;
