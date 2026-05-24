import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, Navigate } from 'react-router-dom';
import {
  FaShieldAlt, FaEye, FaEnvelopeOpenText, FaGlobe,
  FaFingerprint, FaExclamationTriangle, FaCheckCircle,
  FaArrowRight, FaCubes, FaSpinner
} from 'react-icons/fa';
import ThreatBadge from '../../components/ThreatBadge';
import { getBlockchainStats } from '../../services/blockchain';
import { useMode } from '../../context/ModeContext';
import { useAuth } from '../../context/AuthContext';
import { fetchUserAnalytics } from '../../services/api';

const ThreatDashboard = () => {
  const { isAcademic } = useMode();
  const { currentUser } = useAuth();
  const blockchainStats = getBlockchainStats();

  const [analytics, setAnalytics] = useState(null);
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (currentUser) {
        try {
          const token = await currentUser.getIdToken();
          const data = await fetchUserAnalytics(token, 'general');
          setAnalytics(data);
          if (data?.recentScans) setRecentScans(data.recentScans);
        } catch (e) {
          console.error("Failed to load threat analytics", e);
        }
      }
      setLoading(false);
    }
    loadData();
  }, [currentUser]);

  // If in Academic mode, redirect to Academic Overview
  if (isAcademic) {
    return <Navigate to="/dashboard" replace />;
  }

  // Live stats from DB
  const stats = [
    { label: 'Threats Analyzed', value: loading ? '...' : (analytics?.totalScans ?? 0), icon: <FaShieldAlt />, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Flagged Scans', value: loading ? '...' : (analytics?.aiFlags ?? 0), icon: <FaEye />, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Clean Scans', value: loading ? '...' : `${analytics?.cleanRate ?? 0}%`, icon: <FaCheckCircle />, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Avg Threat Score', value: loading ? '...' : (analytics?.avgAiScore ?? 0), icon: <FaExclamationTriangle />, color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  // Quick-action tools
  const tools = [
    { name: 'Deepfake Scanner', desc: 'Check images and videos for manipulation', icon: <FaEye />, path: '/dashboard/deepfake', color: 'from-red-500 to-orange-500' },
    { name: 'Social Engineering', desc: 'Analyze texts for phishing tactics', icon: <FaEnvelopeOpenText />, path: '/dashboard/social-engineering', color: 'from-amber-500 to-yellow-500' },
    { name: 'URL Scanner', desc: 'Verify link safety and reputation', icon: <FaGlobe />, path: '/dashboard/url-scanner', color: 'from-blue-500 to-cyan-500' },
    { name: 'Metadata Forensics', desc: 'Extract and analyze file metadata', icon: <FaFingerprint />, path: '/dashboard/metadata', color: 'from-purple-500 to-pink-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Threat Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Cybersecurity analysis overview — live from your database</p>
        </div>
        <div className="flex items-center gap-3">
          <ThreatBadge level="safe" />
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-xs font-medium text-slate-500">
            <FaCubes />
            {blockchainStats.totalBlocks} blocks
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white rounded-2xl border border-slate-200 p-5"
          >
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center ${stat.color} mb-3`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-black text-slate-800">{stat.value}</p>
            <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick-Action Tools */}
      <div>
        <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-3">Analysis Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tools.map((tool, idx) => (
            <Link key={tool.name} to={tool.path}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.05 }}
                whileHover={{ y: -2 }}
                className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white text-lg`}>
                  {tool.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 text-sm">{tool.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{tool.desc}</p>
                </div>
                <FaArrowRight className="text-slate-300 group-hover:text-slate-500 transition-colors" />
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity — live from DB */}
      <div>
        <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-3">Recent Security Scans</h2>
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="flex justify-center p-8">
              <FaSpinner className="animate-spin text-2xl text-orange-400" />
            </div>
          ) : recentScans.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <FaShieldAlt className="text-4xl text-slate-200 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-500">No Security Scans Yet</p>
              <p className="text-xs text-slate-400 mt-1">Run your first URL scan, phishing check, or metadata forensics above.</p>
            </div>
          ) : (
            recentScans.map((scan, idx) => {
              const verdict = scan.aiScore > 65 ? 'malicious' : scan.aiScore > 35 ? 'warning' : 'safe';
              return (
                <motion.div
                  key={scan.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + idx * 0.05 }}
                  className="flex items-center justify-between px-5 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 truncate">{scan.name}</p>
                    <span className="px-2 py-0.5 bg-orange-50 text-orange-500 rounded text-[10px] font-bold shrink-0">Security</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-slate-400">{scan.date}</span>
                    <ThreatBadge level={verdict} />
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ThreatDashboard;
