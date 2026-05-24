import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaEnvelopeOpenText, FaExclamationTriangle, FaCheckCircle,
  FaRedo, FaDownload, FaPaste, FaSearch
} from 'react-icons/fa';
import ScanResultCard from '../../components/ScanResultCard';
import ThreatBadge from '../../components/ThreatBadge';
import BlockchainBadge from '../../components/BlockchainBadge';
import { runScan } from '../../services/scanner';
import { useAuth } from '../../context/AuthContext';
import { generateReport } from '../../services/reportGenerator';

const CHECK_DESCRIPTIONS = {
  "Urgent Language": "Scammers try to panic you so you act without thinking.",
  "Dangerous Links": "Links that trick you into going to fake or stolen websites.",
  "Asking for Secrets": "Requests for passwords, credit cards, or banking information.",
  "Bad Grammar": "Phishing emails often have weird spelling or grammar mistakes.",
  "Fake Greetings": "Real companies know your name. Scammers use generic greetings."
};

const SocialEngineering = () => {
  const { currentUser } = useAuth();
  const [status, setStatus] = useState('idle');
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState(null);
  const [block, setBlock] = useState(null);
  const [progress, setProgress] = useState({ step: 0, total: 5, label: '' });

  // Load from session storage
  useEffect(() => {
    const saved = sessionStorage.getItem('phishingScannerCache');
    if (saved) {
      try {
        const { savedText, savedResults, savedStatus, savedBlock } = JSON.parse(saved);
        setInputText(savedText);
        setResults(savedResults);
        setStatus(savedStatus);
        setBlock(savedBlock);
      } catch(e) {}
    }
  }, []);

  // Save to session storage
  useEffect(() => {
    if (status === 'result' || status === 'cached') {
      sessionStorage.setItem('phishingScannerCache', JSON.stringify({
        savedText: inputText,
        savedResults: results,
        savedStatus: status,
        savedBlock: block
      }));
    }
  }, [status, results, inputText, block]);

  // Example phishing text user can paste
  const exampleText = `URGENT: Your account has been compromised!

Dear Customer,

We have detected unauthorized access to your account. Your account will be suspended within 24 hours unless you verify your identity immediately.

Click here to verify your password: http://secure-bankk.com/verify

You must act now to prevent permanent account lockout. Provide your Social Security Number and banking details for verification.

This is an official notice from your bank's security department.

Best regards,
Security Team`;

  const startScan = async (force = false) => {
    if (!inputText.trim()) return;

    setStatus('scanning');
    setResults(null);
    
    const token = await currentUser.getIdToken();

    await runScan({
      text: inputText,
      token: token,
      mode: 'general',
      scanType: 'social-engineering',
      forceScan: force,
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
  };

  const reset = () => {
    setStatus('idle');
    setInputText('');
    setResults(null);
    setBlock(null);
    sessionStorage.removeItem('phishingScannerCache');
  };

  // Severity style mapping
  const severityStyles = {
    critical: 'bg-red-50 border-red-200 text-red-700',
    high: 'bg-orange-50 border-orange-200 text-orange-700',
    medium: 'bg-amber-50 border-amber-200 text-amber-700',
    low: 'bg-blue-50 border-blue-200 text-blue-700',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">Social Engineering Detector</h1>
        <p className="text-sm text-slate-500 mt-1">Analyze text for phishing, scams, and manipulation tactics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input Area */}
        <div className="space-y-4">
          {/* Text Input */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-700">Paste suspicious text</h3>
              <button
                onClick={() => setInputText(exampleText)}
                className="text-xs text-veriscan-purple font-semibold hover:underline flex items-center gap-1"
              >
                <FaPaste /> Load Example
              </button>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste an email, message, or social media post here to analyze for manipulation tactics..."
              className="w-full h-52 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
              disabled={status === 'scanning'}
            />
            <p className="text-[11px] text-slate-400 mt-1">{inputText.length} characters</p>
          </div>

          {/* Analyze Button */}
          {status === 'idle' && (
            <button
              onClick={startScan}
              disabled={!inputText.trim()}
              className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                inputText.trim()
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg hover:shadow-amber-500/20'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <FaSearch /> Analyze Text
            </button>
          )}

          {/* Scanning */}
          {status === 'scanning' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-6 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                <p className="text-sm font-bold text-slate-700">{progress.label}...</p>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${(progress.step / progress.total) * 100}%` }}
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
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
                <p className="text-xs text-emerald-600">Previously analyzed — instant results.</p>
              </div>
            </div>
          )}

          {/* Actions */}
          {(status === 'result' || status === 'cached') && (
            <div className="flex gap-3">
              <button onClick={reset} className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors">
                <FaRedo className="text-xs" /> Analyze Another
              </button>
              {status === 'cached' && (
                 <button onClick={() => startScan(true)} className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-semibold transition-colors">
                   <FaSearch className="text-xs" /> Force Rescan
                 </button>
              )}
              <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
                onClick={() => generateReport({ scanType: 'social-engineering', results, text: inputText, block })}>
                <FaDownload className="text-xs" /> Report
              </button>
            </div>
          )}
        </div>

        {/* Right: Results */}
        <div className="space-y-4">
          {(status === 'result' || status === 'cached') && results && (
            <>
              {/* Risk Score */}
              <ScanResultCard
                title="Social Engineering Analysis"
                score={results.score}
                verdict={results.verdict}
                icon={<FaEnvelopeOpenText />}
                color="orange"
                blockchainBlock={block}
              >
                <p className="text-xs text-slate-500">{results.summary}</p>
              </ScanResultCard>

              {/* Detected Tactics / Checks */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                <h3 className="text-sm font-bold text-slate-700">Heuristic Security Checks</h3>
                {(!results.checks || results.checks.length === 0) ? (
                  <p className="text-xs text-slate-400">No manipulation checks available.</p>
                ) : (
                  results.checks.map((check, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`p-4 rounded-xl border flex items-center justify-between ${
                        check.status === 'fail' ? severityStyles.critical :
                        check.status === 'warning' ? severityStyles.medium :
                        'bg-emerald-50 border-emerald-200 text-emerald-700'
                      }`}
                    >
                      <div className="flex gap-4">
                        <div className="mt-0.5">
                          {check.status === 'pass' ? <FaCheckCircle className="text-emerald-500" /> : <FaExclamationTriangle className={check.status === 'fail' ? 'text-red-500' : 'text-amber-500'} />}
                        </div>
                        <div>
                          <span className="text-sm font-bold block mb-1 text-slate-800">{check.label}</span>
                          <p className="text-[11px] text-slate-500 max-w-md leading-relaxed mb-1">
                            {CHECK_DESCRIPTIONS[check.label] || "Checking advanced social engineering patterns."}
                          </p>
                          <p className={`text-xs font-semibold ${check.status === 'fail' ? 'text-red-600' : check.status === 'warning' ? 'text-amber-600' : 'text-emerald-600'}`}>
                            ↳ {check.value}
                          </p>
                        </div>
                      </div>
                      <ThreatBadge level={check.status === 'fail' ? 'malicious' : check.status === 'warning' ? 'warning' : 'safe'} />
                    </motion.div>
                  ))
                )}
              </div>
            </>
          )}

          {status === 'idle' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
              <FaEnvelopeOpenText className="text-4xl text-slate-200 mx-auto mb-3" />
              <p className="text-sm text-slate-400">Paste text and click Analyze to detect manipulation tactics</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialEngineering;
