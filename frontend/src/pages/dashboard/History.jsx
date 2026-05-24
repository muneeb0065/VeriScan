import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHistory, FaFilter, FaRobot, FaCopy, FaLink, FaEye, FaFileAlt, FaSpinner, FaTrash, FaShieldAlt } from 'react-icons/fa';
import BlockchainBadge from '../../components/BlockchainBadge';
import { useAuth } from '../../context/AuthContext';
import { useMode } from '../../context/ModeContext';
import { fetchUserHistory, deleteUserScan } from '../../services/api';

const History = () => {
  const [filter, setFilter] = useState('all');
  const { currentUser } = useAuth();
  const { isAcademic } = useMode();
  const currentMode = isAcademic ? 'academic' : 'general';
  
  const [scanHistory, setScanHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);

  const toggleRow = (id) => {
    if (expandedRow === id) setExpandedRow(null);
    else setExpandedRow(id);
  };

  useEffect(() => {
    setScanHistory([]);
    setLoading(true);
    async function loadData() {
      if (currentUser) {
        try {
          const token = await currentUser.getIdToken();
          const historyData = await fetchUserHistory(token, currentMode);
          setScanHistory(historyData);
        } catch (e) {
          console.error("Failed to load history", e);
        }
      }
      setLoading(false);
    }
    loadData();
  }, [currentUser, currentMode]);

  const handleDelete = async (docId) => {
    if (!window.confirm("Are you sure you want to permanently delete this scan from history?")) return;
    
    if (currentUser) {
      try {
        const token = await currentUser.getIdToken();
        const success = await deleteUserScan(docId, token);
        if (success) {
           setScanHistory(prev => prev.filter(scan => scan.id !== docId));
        } else {
           alert("Failed to delete scan. Permission denied.");
        }
      } catch (e) {
        console.error("Delete failed:", e);
      }
    }
  };

  // Filter entries
  const filteredHistory = scanHistory.filter(scan => {
    if (filter === 'ai') return scan.aiScore > 70;
    if (filter === 'plagiarism') return scan.plagScore > 30;
    if (filter === 'clean') return scan.status === 'Clean';
    return true;
  });

  // Score color helper
  const scoreColor = (score, threshold) => {
    if (score > threshold) return 'text-red-500';
    if (score > threshold / 2) return 'text-amber-500';
    return 'text-emerald-500';
  };

  if (loading) {
    return <div className="flex justify-center p-10"><FaSpinner className="animate-spin text-3xl text-veriscan-purple" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isAcademic
            ? <FaHistory className="text-2xl text-veriscan-purple" />
            : <FaShieldAlt className="text-2xl text-orange-500" />
          }
          <div>
            <h1 className="text-2xl font-black text-slate-800">
              {isAcademic ? 'Academic Scan History' : 'Security Scan History'}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {isAcademic
                ? 'Document AI & plagiarism scans — live from your database'
                : 'URL, phishing & metadata scans — live from your database'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 items-center">
        <FaFilter className="text-slate-400 text-xs" />
        {[
          { key: 'all', label: 'All' },
          { key: 'ai', label: 'AI Flagged' },
          { key: 'plagiarism', label: 'Plagiarism' },
          { key: 'clean', label: 'Clean' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === f.key
                ? 'bg-slate-800 text-white'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-[11px] font-bold text-slate-400 uppercase px-5 py-3">Document</th>
              <th className="text-left text-[11px] font-bold text-slate-400 uppercase px-5 py-3 hidden md:table-cell">Date</th>
              <th className="text-center text-[11px] font-bold text-slate-400 uppercase px-5 py-3">AI Score</th>
              <th className="text-center text-[11px] font-bold text-slate-400 uppercase px-5 py-3">Plagiarism</th>
              <th className="text-center text-[11px] font-bold text-slate-400 uppercase px-5 py-3">Status</th>
              <th className="text-center text-[11px] font-bold text-slate-400 uppercase px-5 py-3 hidden lg:table-cell">Blockchain</th>
              <th className="text-right text-[11px] font-bold text-slate-400 uppercase px-5 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map((scan, idx) => (
              <React.Fragment key={scan.id}>
                <motion.tr
                  initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors"
              >
                {/* Document name */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <FaFileAlt className="text-veriscan-purple shrink-0" />
                    <p className="text-sm font-semibold text-slate-700 truncate">{scan.name}</p>
                  </div>
                </td>

                {/* Date */}
                <td className="px-5 py-4 hidden md:table-cell">
                  <p className="text-xs text-slate-400">{scan.date}</p>
                </td>

                {/* AI Score */}
                <td className="px-5 py-4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <FaRobot className="text-[10px] text-purple-300" />
                    <span className={`text-xs font-bold ${scoreColor(scan.aiScore, 70)}`}>
                      {scan.aiScore}%
                    </span>
                  </div>
                </td>

                {/* Plagiarism Score */}
                <td className="px-5 py-4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <FaCopy className="text-[10px] text-teal-300" />
                    <span className={`text-xs font-bold ${scoreColor(scan.plagScore, 40)}`}>
                      {scan.plagScore}%
                    </span>
                  </div>
                </td>

                {/* Status */}
                <td className="px-5 py-4 text-center">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    scan.status === 'Clean' ? 'bg-emerald-50 text-emerald-600' :
                    scan.status === 'Warning' ? 'bg-amber-50 text-amber-600' :
                    'bg-red-50 text-red-600'
                  }`}>
                    {scan.status}
                  </span>
                </td>

                {/* Blockchain */}
                <td className="px-5 py-4 text-center hidden lg:table-cell">
                  {scan.hasBlockchain ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                      <FaLink /> Verified
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-300">—</span>
                  )}
                </td>

                {/* Action */}
                <td className="px-5 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => toggleRow(scan.id)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 ${
                        expandedRow === scan.id 
                          ? 'bg-slate-800 text-white hover:bg-slate-700' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <FaEye className="text-[9px]" /> {expandedRow === scan.id ? 'Hide' : 'Details'}
                    </button>
                    <button 
                      onClick={() => handleDelete(scan.id)}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1"
                    >
                      <FaTrash className="text-[9px]" /> Delete
                    </button>
                  </div>
                </td>
              </motion.tr>
              
              {/* Expandable Details Row */}
              {expandedRow === scan.id && (
                <tr key={`${scan.id}-details`} className="bg-slate-50 border-b border-slate-100">
                  <td colSpan="7" className="p-6">
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
                      
                      {/* Academic Mode Details */}
                      {scan.mode === 'academic' && (
                        <>
                          {/* AI Breakdown */}
                          <div>
                            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                              <FaRobot className="text-veriscan-purple" /> AI Detection Breakdown
                            </h4>
                            {scan.ai_details?.breakdown ? (
                              <div className="space-y-3">
                                {scan.ai_details.breakdown.map((b, i) => (
                                  <div key={i} className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 last:border-0">
                                    <span className="text-slate-500">{b.label}</span>
                                    <span className={`font-bold ${b.score > 70 ? 'text-red-500' : 'text-slate-700'}`}>{b.score}/100</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-slate-400 italic">No AI breakdown available (Legacy scan)</p>
                            )}
                          </div>
                          
                          {/* Plagiarism Breakdown */}
                          <div>
                            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                              <FaCopy className="text-veriscan-teal" /> Matched Sources
                            </h4>
                            {scan.plag_details?.matchedSources ? (
                              <div className="space-y-3">
                                {scan.plag_details.matchedSources.length === 0 ? (
                                  <p className="text-xs text-slate-400">100% Original Content - No matches found.</p>
                                ) : (
                                  scan.plag_details.matchedSources.map((m, i) => (
                                    <div key={i} className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 last:border-0">
                                      <span className="text-slate-500 truncate mr-4 max-w-[200px]" title={m.source}>{m.source}</span>
                                      <span className="font-bold text-red-500">{m.similarity}%</span>
                                    </div>
                                  ))
                                )}
                              </div>
                            ) : (
                              <p className="text-xs text-slate-400 italic">No source breakdown available (Legacy scan)</p>
                            )}
                          </div>
                        </>
                      )}

                      {/* General / Security Mode Details */}
                      {scan.mode === 'general' && (
                        <div className="md:col-span-2">
                            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                              <FaLink className="text-blue-500" /> URL Security Checks
                            </h4>
                            {scan.ai_details?.checks ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {scan.ai_details.checks.map((c, i) => (
                                  <div key={i} className="flex items-center justify-between text-xs p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <span className="text-slate-500 font-medium">{c.label}</span>
                                    <span className={`font-bold ${c.status === 'pass' ? 'text-emerald-500' : c.status === 'warning' ? 'text-amber-500' : 'text-red-500'}`}>
                                      {c.value}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-slate-400 italic">No security checks available (Legacy URL scan)</p>
                            )}
                        </div>
                      )}
                      
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {filteredHistory.length === 0 && (
        <div className="text-center py-8 bg-white border border-slate-200 rounded-2xl">
          <p className="text-sm text-slate-400">Your scan history is empty. Start by scanning a document!</p>
        </div>
      )}
    </div>
  );
};

export default History;
