import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaGlobe, FaSearch, FaCheckCircle, FaTimesCircle,
  FaExclamationTriangle, FaRedo, FaDownload, FaLock, FaUnlock
} from 'react-icons/fa';
import ThreatBadge from '../../components/ThreatBadge';
import BlockchainBadge from '../../components/BlockchainBadge';
import { runScan } from '../../services/scanner';
import { useAuth } from '../../context/AuthContext';
import { generateReport } from '../../services/reportGenerator';

const CHECK_DESCRIPTIONS = {
  "Typosquatting": "Detects if a domain is a deceptive clone of a popular brand (e.g., g00gle.com instead of google.com).",
  "SSL Certificate": "Verifies if the connection is encrypted (HTTPS). Attackers often use unencrypted HTTP to intercept data.",
  "Redirect Chain": "Counts how many times the URL bounces before landing. Malicious sites often hide behind multiple redirects.",
  "Domain Age": "Young domains (less than a few months old) are mathematically more likely to be disposable scam sites.",
  "Reputation Score": "Overall heuristic security score combining all vulnerability factors."
};

const UrlScanner = () => {
  const { currentUser } = useAuth();
  const [status, setStatus] = useState('idle');
  const [url, setUrl] = useState('');
  const [results, setResults] = useState(null);
  const [block, setBlock] = useState(null);
  const [progress, setProgress] = useState({ step: 0, total: 5, label: '' });

  // Load state from session storage to persist when switching tabs
  useEffect(() => {
    const saved = sessionStorage.getItem('urlScannerCache');
    if (saved) {
      try {
        const { savedUrl, savedResults, savedStatus } = JSON.parse(saved);
        setUrl(savedUrl);
        setResults(savedResults);
        setStatus(savedStatus);
      } catch (e) {
        console.error("Failed to parse session storage", e);
      }
    }
  }, []);

  // Save state to session storage when scan finishes
  useEffect(() => {
    if (status === 'result' || status === 'cached') {
      sessionStorage.setItem('urlScannerCache', JSON.stringify({
        savedUrl: url,
        savedResults: results,
        savedStatus: status
      }));
    }
  }, [status, results, url]);

  const startScan = async () => {
    if (!url.trim()) return;

    setStatus('scanning');
    setResults(null);
    
    let token = null;
    if (currentUser) {
       try {
          token = await currentUser.getIdToken();
       } catch (e) {
          console.error("Token error:", e);
       }
    }

    try {
      await runScan({
        url: url,
        mode: 'general',
        scanType: 'url-scan',
        token: token,
        onCacheHit: (cached) => {
          setResults(cached.results);
          setBlock(cached);
          setStatus('cached');
        },
        onProgress: (p) => setProgress(p),
        onComplete: (res, blk) => {
          setResults(res);
          setBlock(blk);
          setStatus('result');
        },
      });
    } catch (e) {
      console.error(e);
      alert(e.message || "Failed to execute URL scan.");
      setStatus('idle');
    }
  };

  const reset = () => {
    setStatus('idle');
    setUrl('');
    setResults(null);
    setBlock(null);
    sessionStorage.removeItem('urlScannerCache');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') startScan();
  };

  // Status icon for each check
  const statusIcon = (s) => {
    if (s === 'pass') return <FaCheckCircle className="text-emerald-500" />;
    if (s === 'fail') return <FaTimesCircle className="text-red-500" />;
    return <FaExclamationTriangle className="text-amber-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">URL Scanner</h1>
        <p className="text-sm text-slate-500 mt-1">Check if a URL is safe, suspicious, or malicious</p>
      </div>

      {/* URL Input */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <FaGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter a URL to scan (e.g., https://example.com)"
              className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400"
              disabled={status === 'scanning'}
            />
          </div>
          <button
            onClick={startScan}
            disabled={!url.trim() || status === 'scanning'}
            className={`px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${
              url.trim() && status !== 'scanning'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <FaSearch /> Scan
          </button>
        </div>
      </div>

      {/* Scanning */}
      {status === 'scanning' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
            <div>
              <p className="text-sm font-bold text-slate-700">Scanning {url}...</p>
              <p className="text-xs text-slate-400">{progress.label}</p>
            </div>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${(progress.step / progress.total) * 100}%` }}
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
            />
          </div>
        </div>
      )}

      {/* Cache Hit */}
      {status === 'cached' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
          <FaCheckCircle className="text-emerald-500" />
          <div>
            <p className="text-sm font-bold text-emerald-800">Found on Blockchain!</p>
            <p className="text-xs text-emerald-600">This URL was previously scanned.</p>
          </div>
        </div>
      )}

      {/* Results */}
      {(status === 'result' || status === 'cached') && results && (
        <div className="space-y-4">
          {/* Verdict Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl border p-6 ${
              results.verdict === 'Safe' ? 'bg-emerald-50 border-emerald-200' :
              results.verdict === 'Suspicious' ? 'bg-amber-50 border-amber-200' :
              'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${
                  results.verdict === 'Safe' ? 'bg-emerald-100 text-emerald-600' :
                  results.verdict === 'Suspicious' ? 'bg-amber-100 text-amber-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  {results.verdict === 'Safe' ? <FaLock /> : <FaUnlock />}
                </div>
                <div>
                  <p className="text-xl font-black text-slate-800">{results.verdict}</p>
                  <p className="text-sm text-slate-500 font-mono">{results.url}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ThreatBadge level={results.verdict.toLowerCase()} />
                <BlockchainBadge block={block} size="small" />
              </div>
            </div>
          </motion.div>

          {/* Checks */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="text-sm font-bold text-slate-700 mb-4">Security Checks</h3>
            <div className="space-y-3">
              {results.checks.map((check, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0"
                >
                  <div className="flex gap-3">
                    <div className="mt-0.5">{statusIcon(check.status)}</div>
                    <div>
                      <span className="text-sm font-bold text-slate-700 block">{check.label}</span>
                      <span className="text-[11px] text-slate-400 max-w-sm block mt-0.5 leading-snug">
                        {CHECK_DESCRIPTIONS[check.label] || "Checking advanced vulnerability matrices."}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-slate-600 font-mono bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                    {check.value}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={reset} className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors">
              <FaRedo className="text-xs" /> Scan Another
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold transition-colors"
              onClick={() => generateReport({ scanType: 'url-scan', results, url, block })}>
              <FaDownload className="text-xs" /> Download Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UrlScanner;
