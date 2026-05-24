import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, Navigate } from 'react-router-dom';
import {
  FaChartBar, FaRobot, FaCopy, FaFileAlt, FaSearch,
  FaArrowUp, FaArrowDown, FaLink, FaArrowRight, FaSpinner
} from 'react-icons/fa';
import { useMode } from '../../context/ModeContext';
import { useAuth } from '../../context/AuthContext';
import { getBlockchainStats } from '../../services/blockchain';
import { fetchUserAnalytics } from '../../services/api';

const Overview = () => {
  const { isAcademic, isGeneral } = useMode();
  const { currentUser } = useAuth();
  const blockchainStats = getBlockchainStats();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (currentUser) {
        try {
          const token = await currentUser.getIdToken();
          const data = await fetchUserAnalytics(token, 'academic');
          setAnalytics(data);
        } catch (e) {
          console.error("Failed to load analytics", e);
        }
      }
      setLoading(false);
    }
    loadData();
  }, [currentUser]);

  // If in Security mode, redirect to Threat Dashboard
  if (isGeneral) {
    return <Navigate to="/dashboard/threats" replace />;
  }

  if (loading) {
     return <div className="flex justify-center p-10"><FaSpinner className="animate-spin text-3xl text-veriscan-purple" /></div>;
  }

  // Fallback defaults if no database entries yet
  const stats = analytics || {
     totalScans: 0, aiFlags: 0, plagFlags: 0,
     avgAiScore: 0, avgPlagScore: 0, cleanRate: 0,
     recentScans: []
  };

  // Academic mode stats mapped from DB
  const academicStats = [
    { label: 'Total Scans', value: stats.totalScans, icon: <FaSearch />, bg: 'bg-purple-50', color: 'text-veriscan-purple', change: '', up: true },
    { label: 'AI Flags', value: stats.aiFlags, icon: <FaRobot />, bg: 'bg-red-50', color: 'text-red-500', change: '', up: true },
    { label: 'Plagiarism Flags', value: stats.plagFlags, icon: <FaCopy />, bg: 'bg-amber-50', color: 'text-amber-500', change: '', up: false },
    { label: 'Documents', value: stats.totalScans, icon: <FaFileAlt />, bg: 'bg-blue-50', color: 'text-blue-500', change: '', up: true },
  ];

  const recentScans = stats.recentScans;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Academic Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Live database scanning summary</p>
        </div>
        <Link to="/dashboard/scan">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-bold transition-colors">
            <FaSearch className="text-xs" /> Quick Scan
          </button>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {academicStats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white rounded-2xl border border-slate-200 p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-2xl font-black text-slate-800">{stat.value}</p>
            <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Chart + Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Real Dynamic Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Weekly Average Activity</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '180px' }}>
            {stats.chartData && stats.chartData.map((day) => {
              const maxChart = Math.max(1, ...stats.chartData.map(d => Math.max(d.ai, d.plag)));
              const aiH = Math.max(Math.round((day.ai / maxChart) * 140), 5); // min height 5px
              const plagH = Math.max(Math.round((day.plag / maxChart) * 140), 5);
              return (
                <div key={day.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', marginBottom: '8px' }}>
                    <div style={{ width: '20px', height: `${aiH}px`, backgroundColor: '#7c3aed', borderRadius: '4px 4px 0 0' }} />
                    <div style={{ width: '20px', height: `${plagH}px`, backgroundColor: '#0d9488', borderRadius: '4px 4px 0 0' }} />
                  </div>
                  <span className="text-[11px] text-slate-400 font-semibold">{day.day}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-5 mt-4 justify-center">
            <span className="flex items-center gap-2 text-[11px] text-slate-500 font-medium"><span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#7c3aed', borderRadius: '2px' }} /> Avg AI Score</span>
            <span className="flex items-center gap-2 text-[11px] text-slate-500 font-medium"><span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#0d9488', borderRadius: '2px' }} /> Avg Plagiarism Score</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-slate-800 rounded-2xl p-5 text-white space-y-4">
          <h3 className="text-sm font-bold text-white">Average Analytics</h3>
          {[
            { label: 'Avg AI Score', value: stats.avgAiScore, color: 'from-purple-500 to-indigo-500' },
            { label: 'Avg Plagiarism Score', value: stats.avgPlagScore, color: 'from-teal-500 to-cyan-500' },
            { label: 'Clean Detect Rate', value: stats.cleanRate, color: 'from-emerald-500 to-green-500' },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300">{item.label}</span>
                <span className="font-bold">{item.value}%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                />
              </div>
            </div>
          ))}
          <div className="pt-3 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <FaLink className="text-emerald-400" />
              <span>{blockchainStats.totalBlocks} blockchain records</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Scans Table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider">Recently Scanned</h3>
          <Link to="/dashboard/history" className="text-xs text-veriscan-purple font-semibold hover:underline flex items-center gap-1">
            View All <FaArrowRight className="text-[8px]" />
          </Link>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-[11px] font-bold text-slate-400 uppercase px-5 py-3">Document</th>
                <th className="text-left text-[11px] font-bold text-slate-400 uppercase px-5 py-3 hidden md:table-cell">Date</th>
                <th className="text-center text-[11px] font-bold text-slate-400 uppercase px-5 py-3">AI Score</th>
                <th className="text-center text-[11px] font-bold text-slate-400 uppercase px-5 py-3">Plagiarism</th>
                <th className="text-center text-[11px] font-bold text-slate-400 uppercase px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentScans.length === 0 && (
                 <tr><td colSpan="5" className="px-5 py-8 text-center text-slate-400 text-sm">No scans in database yet.</td></tr>
              )}
              {recentScans.map((scan, idx) => (
                <motion.tr
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + idx * 0.05 }}
                  className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors"
                >
                  <td className="px-5 py-3">
                    <p className="text-sm font-semibold text-slate-700">{scan.name}</p>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <p className="text-xs text-slate-400">{scan.date}</p>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={`text-xs font-bold ${scan.aiScore > 70 ? 'text-red-500' : scan.aiScore > 40 ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {scan.aiScore}%
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={`text-xs font-bold ${scan.plagScore > 40 ? 'text-red-500' : scan.plagScore > 20 ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {scan.plagScore}%
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      scan.status === 'Clean' ? 'bg-emerald-50 text-emerald-600' :
                      scan.status === 'Warning' ? 'bg-amber-50 text-amber-600' :
                      'bg-red-50 text-red-600'
                    }`}>
                      {scan.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Overview;
