import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  FaRobot, FaCopy, FaUpload, FaFileAlt, FaFilePdf,
  FaFileImage, FaRedo, FaDownload, FaCheckCircle, FaLink
} from 'react-icons/fa';
import ScanResultCard from '../../components/ScanResultCard';
import BlockchainBadge from '../../components/BlockchainBadge';
import { runScan } from '../../services/scanner';
import { useAuth } from '../../context/AuthContext';
import { generateReport } from '../../services/reportGenerator';

const Scan = () => {
  const [status, setStatus] = useState('idle');    // idle | scanning | result | cached
  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);
  const [block, setBlock] = useState(null);
  const [progress, setProgress] = useState({ step: 0, total: 5, label: '' });

  // File drop handler
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const f = acceptedFiles[0];
      setFile(f);
      startScan(f);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc', '.docx'],
      'image/*': ['.jpeg', '.jpg', '.png'],
    },
    maxFiles: 1,
  });

  const { currentUser } = useAuth();

  // Run combined scan (AI + Plagiarism)
  const startScan = async (f, force = false) => {
    setStatus('scanning');
    setResults(null);
    
    let token = null;
    if (currentUser) {
      try {
        token = await currentUser.getIdToken();
      } catch (e) {
        console.error('Failed to get token:', e);
      }
    }

    try {
      await runScan({
        file: f,
        mode: 'academic',
        scanType: 'combined',
        token: token,
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
    } catch (error) {
      console.error("Scan Failed:", error);
      alert(error.message || "An error occurred during scanning. Please try again.");
      setStatus('idle');
    }
  };

  // Reset
  const reset = () => {
    setStatus('idle');
    setFile(null);
    setResults(null);
    setBlock(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">Document Scanner</h1>
        <p className="text-sm text-slate-500 mt-1">Combined AI detection and plagiarism check — both run simultaneously</p>
      </div>

      {/* ===== IDLE: Upload Zone ===== */}
      {status === 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Upload Area (takes 2 columns) */}
          <div className="lg:col-span-2">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
                isDragActive
                  ? 'border-veriscan-purple bg-purple-50'
                  : 'border-slate-300 hover:border-veriscan-purple hover:bg-purple-50/30'
              }`}
            >
              <input {...getInputProps()} />
              <FaUpload className="text-4xl text-slate-300 mx-auto mb-4" />
              <p className="text-lg font-bold text-slate-700">Drag & drop your document here</p>
              <p className="text-sm text-slate-400 mt-2">or click to browse your files</p>
              <div className="flex items-center justify-center gap-3 mt-5">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg text-[11px] font-bold text-slate-500"><FaFilePdf className="text-red-400" /> PDF</span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg text-[11px] font-bold text-slate-500"><FaFileAlt className="text-blue-400" /> DOCX</span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg text-[11px] font-bold text-slate-500"><FaFileAlt className="text-green-400" /> TXT</span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg text-[11px] font-bold text-slate-500"><FaFileImage className="text-purple-400" /> Images</span>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">How It Works</h3>
            <div className="space-y-3">
              {[
                { step: 1, text: 'Upload any document or image' },
                { step: 2, text: 'We check blockchain for cached results' },
                { step: 3, text: 'AI detection + Plagiarism run simultaneously' },
                { step: 4, text: 'Results stored on blockchain for verification' },
              ].map(({ step, text }) => (
                <div key={step} className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-veriscan-purple/10 text-veriscan-purple rounded-full flex items-center justify-center text-[11px] font-black shrink-0">{step}</span>
                  <p className="text-xs text-slate-500 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100">
              <p className="text-[10px] text-slate-400">🔗 All results are blockchain-verified</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ===== SCANNING ===== */}
      {status === 'scanning' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-lg mx-auto"
        >
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            {/* Animated scanner */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-dashed border-purple-300"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute inset-2 rounded-full border-2 border-veriscan-teal"
                animate={{ rotate: -360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <FaRobot className="text-2xl text-veriscan-purple" />
                </motion.div>
              </div>
            </div>

            {/* File name */}
            <p className="font-bold text-slate-700 mb-1">Analyzing: {file?.name}</p>
            <p className="text-sm text-slate-400 mb-4">{progress.label}...</p>

            {/* Progress Bar */}
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
              <motion.div
                animate={{ width: `${(progress.step / progress.total) * 100}%` }}
                className="h-full bg-gradient-to-r from-veriscan-purple to-veriscan-teal rounded-full"
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-[11px] text-slate-400">Step {progress.step} of {progress.total}</p>

            {/* Running both checks indicator */}
            <div className="flex justify-center gap-4 mt-5">
              <span className="flex items-center gap-1.5 text-xs text-purple-500 font-semibold">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" /> AI Detection
              </span>
              <span className="flex items-center gap-1.5 text-xs text-teal-500 font-semibold">
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" /> Plagiarism Check
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* ===== CACHE HIT ===== */}
      {status === 'cached' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <FaCheckCircle className="text-emerald-500 text-xl" />
            <div>
              <p className="text-sm font-bold text-emerald-800">Found on Blockchain!</p>
              <p className="text-xs text-emerald-600">This document was previously scanned — results loaded from blockchain instantly.</p>
            </div>
          </div>
          <button 
             onClick={() => startScan(file, true)}
             className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
          >
             Scan Anyway
          </button>
        </motion.div>
      )}

      {/* ===== RESULTS ===== */}
      {(status === 'result' || status === 'cached') && results && (
        <div className="space-y-6">
          {/* File Info */}
          <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <FaFileAlt className="text-lg text-veriscan-purple" />
              <div>
                <p className="text-sm font-bold text-slate-700">{file?.name || 'Document'}</p>
                <p className="text-xs text-slate-400">{file ? `${(file.size / 1024).toFixed(1)} KB` : ''}</p>
              </div>
            </div>
            {block && <BlockchainBadge block={block} />}
          </div>

          {/* Side-by-side results */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Detection Results */}
            <ScanResultCard
              title="AI Content Detection"
              score={results.ai.score}
              verdict={results.ai.verdict}
              confidence={results.ai.confidence}
              icon={<FaRobot />}
              color="purple"
              breakdown={results.ai.breakdown}
              blockchainBlock={block}
            >
              <div className="mt-2">
                <p className="text-[11px] text-slate-400 mb-2">Models checked:</p>
                <div className="flex flex-wrap gap-1.5">
                  {results.ai.models.map((model) => (
                    <span key={model} className="px-2 py-0.5 bg-purple-50 text-veriscan-purple rounded text-[10px] font-bold">
                      {model}
                    </span>
                  ))}
                </div>
              </div>
            </ScanResultCard>

            {/* Plagiarism Results */}
            <ScanResultCard
              title="Plagiarism Detection"
              score={results.plagiarism.score}
              verdict={results.plagiarism.verdict}
              confidence={results.plagiarism.confidence}
              icon={<FaCopy />}
              color="teal"
              blockchainBlock={block}
            >
              <div className="mt-2">
                <p className="text-[11px] text-slate-400 mb-2">Sources checked: {results.plagiarism.sourcesChecked}</p>
                <div className="space-y-2">
                  {results.plagiarism.matchedSources.map((source, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 truncate">{source.source}</span>
                      <span className="text-xs font-bold text-teal-600 shrink-0">{source.similarity}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScanResultCard>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={reset} className="flex items-center gap-2 px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-colors">
              <FaRedo className="text-xs" /> Scan Another Document
            </button>
            <button className="flex items-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-bold transition-colors"
              onClick={() => generateReport({ scanType: 'combined', results, file, block })}>
              <FaDownload className="text-xs" /> Download Report
            </button>
            <button className="flex items-center gap-2 px-5 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-sm font-bold transition-colors">
              <FaLink className="text-xs" /> View Certificate
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scan;
