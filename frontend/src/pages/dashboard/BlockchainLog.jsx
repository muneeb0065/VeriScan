import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaCubes, FaCheckCircle, FaTimesCircle, FaSearch,
  FaFilter, FaShieldAlt, FaGraduationCap, FaSync
} from 'react-icons/fa';
import BlockchainBadge from '../../components/BlockchainBadge';
import { getAllBlocks, verifyIntegrity } from '../../services/blockchain';

const BlockchainLog = () => {
  const [filter, setFilter] = useState('all'); // all | academic | general
  const [verificationResult, setVerificationResult] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Get blocks from blockchain
  const allBlocks = getAllBlocks();
  const filteredBlocks = allBlocks
    .filter(block => {
      if (filter !== 'all' && block.mode !== filter) return false;
      if (searchQuery && !block.fileName.toLowerCase().includes(searchQuery.toLowerCase()) && !block.documentHash.includes(searchQuery)) return false;
      return true;
    })
    .reverse(); // Show newest first

  // Verify chain integrity
  const handleVerify = async () => {
    setVerifying(true);
    const result = await verifyIntegrity();
    setVerificationResult(result);
    setVerifying(false);
    // Reset verification message after 5 seconds
    setTimeout(() => setVerificationResult(null), 5000);
  };

  // Scan type labels
  const scanTypeLabels = {
    combined: 'AI + Plagiarism',
    deepfake: 'Deepfake',
    'social-engineering': 'Social Eng.',
    'url-scan': 'URL Scan',
    metadata: 'Metadata',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Blockchain Log</h1>
          <p className="text-sm text-slate-500 mt-1">All verification certificates stored on-chain</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400">{allBlocks.length} blocks</span>
          <button
            onClick={handleVerify}
            disabled={verifying}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-200 transition-colors"
          >
            {verifying ? <FaSync className="animate-spin" /> : <FaCheckCircle />}
            Verify Integrity
          </button>
        </div>
      </div>

      {/* Verification Result Banner */}
      {verificationResult && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl border p-4 flex items-center gap-3 ${
            verificationResult.valid
              ? 'bg-emerald-50 border-emerald-200'
              : 'bg-red-50 border-red-200'
          }`}
        >
          {verificationResult.valid ? (
            <FaCheckCircle className="text-emerald-500 text-xl" />
          ) : (
            <FaTimesCircle className="text-red-500 text-xl" />
          )}
          <p className={`text-sm font-bold ${verificationResult.valid ? 'text-emerald-800' : 'text-red-800'}`}>
            {verificationResult.message}
          </p>
        </motion.div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Filter Buttons */}
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'All', icon: <FaCubes /> },
            { key: 'academic', label: 'Academic', icon: <FaGraduationCap /> },
            { key: 'general', label: 'General', icon: <FaShieldAlt /> },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === f.key
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {f.icon} {f.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-xs" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by file name or hash..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-veriscan-purple/30"
          />
        </div>
      </div>

      {/* Blocks List */}
      {filteredBlocks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <FaCubes className="text-4xl text-slate-200 mx-auto mb-3" />
          <p className="text-sm text-slate-400">No blockchain entries yet. Run a scan to create the first block.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBlocks.map((block, idx) => (
            <motion.div
              key={block.blockId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.03 }}
              className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Block Number */}
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-xs font-black text-slate-500">#{block.blockId}</span>
                  </div>

                  {/* Info */}
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-700 truncate">{block.fileName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        block.mode === 'academic' ? 'bg-purple-50 text-veriscan-purple' : 'bg-orange-50 text-orange-600'
                      }`}>
                        {block.mode === 'academic' ? '🎓 Academic' : '🛡️ Security'}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-400">
                        {scanTypeLabels[block.scanType] || block.scanType}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(block.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <BlockchainBadge block={block} size="small" />
              </div>

              {/* Hash Info */}
              <div className="mt-3 pt-3 border-t border-slate-50 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Document Hash</p>
                  <p className="text-xs text-slate-500 font-mono truncate">{block.documentHash}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Previous Block Hash</p>
                  <p className="text-xs text-slate-500 font-mono truncate">{block.previousHash}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlockchainLog;
