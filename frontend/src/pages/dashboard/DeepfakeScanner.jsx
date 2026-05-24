import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  FaEye, FaUpload, FaCheckCircle, FaExclamationTriangle,
  FaRedo, FaDownload, FaImage, FaVideo, FaSearch, FaRobot, FaShieldAlt
} from 'react-icons/fa';
import ThreatBadge from '../../components/ThreatBadge';
import BlockchainBadge from '../../components/BlockchainBadge';
import { runScan } from '../../services/scanner';
import { useAuth } from '../../context/AuthContext';
import { generateReport } from '../../services/reportGenerator';

const CHECK_DESCRIPTIONS = {
  "Suspicious Smoothness": "Real photos always have natural grain and noise. AI images are suspiciously smooth because they're mathematically generated.",
  "Natural Noise": "The level of grain and noise looks like what a real camera produces.",
  "Color Balance": "AI tools often over-equalize colors, making R/G/B channels unnaturally balanced.",
  "No Camera Data": "Real cameras always write technical info (EXIF) to photos. AI image generators never do.",
  "Camera Data Present": "Real camera metadata was found inside the file.",
  "Image Dimensions": "Many AI image generators output at fixed canvas sizes (512x512, 1024x1024, etc).",
  "Resolution": "Dimensions don't match common AI generator output sizes.",
  "Perfect Resolution": "This is an exact AI canvas size — a strong indicator of generation.",
  "Pixel Complexity": "AI images have less random complexity than real-world photographs.",
  "AI Software Detected": "The file's metadata directly names an AI image generator tool.",
  "Video Container": "Checks if the video file format is valid and what type it is.",
  "File Size": "Deepfakes are often short clips. Very small video files are suspicious.",
  "Frame Analysis": "Full frame-by-frame deepfake detection requires deep learning models.",
  "Analysis Error": "Something went wrong while reading this file.",
};

const DeepfakeScanner = () => {
  const { currentUser } = useAuth();
  const [status, setStatus] = useState('idle');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [results, setResults] = useState(null);
  const [block, setBlock] = useState(null);
  const [progress, setProgress] = useState({ step: 0, total: 5, label: '' });

  // Load from session cache
  useEffect(() => {
    const saved = sessionStorage.getItem('aiMediaScannerCache');
    if (saved) {
      try {
        const { savedFile, savedResults, savedStatus, savedBlock, savedPreview } = JSON.parse(saved);
        if (savedFile) setFile(savedFile);
        if (savedPreview) setPreview(savedPreview);
        setResults(savedResults);
        setStatus(savedStatus);
        setBlock(savedBlock);
      } catch(e) {}
    }
  }, []);

  // Save to session cache
  useEffect(() => {
    if ((status === 'result' || status === 'cached') && results) {
      sessionStorage.setItem('aiMediaScannerCache', JSON.stringify({
        savedFile: file ? { name: file.name, size: file.size } : null,
        savedResults: results,
        savedStatus: status,
        savedBlock: block,
        savedPreview: preview
      }));
    }
  }, [status, results, file, block, preview]);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const f = acceptedFiles[0];
      setFile(f);
      setPreview(URL.createObjectURL(f));
      startScan(f);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif', '.bmp'],
      'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.webm'],
    },
    maxFiles: 1,
  });

  const startScan = async (f, force = false) => {
    setStatus('scanning');
    setResults(null);
    try {
      const token = await currentUser.getIdToken();
      await runScan({
        file: f,
        token,
        mode: 'general',
        scanType: 'deepfake',
        forceScan: true,  // ALWAYS fresh scan — AI detection must use live backend analysis
        onCacheHit: (cached) => { setResults(cached.results); setBlock(cached); setStatus('cached'); },
        onProgress: (p) => setProgress(p),
        onComplete: (res, blk) => { setResults(res); setBlock(blk); setStatus('result'); },
      });
    } catch (err) {
      console.error(err);
      setStatus('idle');
      alert('Scan failed: ' + err.message);
    }
  };

  const reset = () => {
    setStatus('idle');
    setFile(null);
    setPreview(null);
    setResults(null);
    setBlock(null);
    sessionStorage.removeItem('aiMediaScannerCache');
  };

  const verdictLevel = results?.verdict?.toLowerCase().includes('ai') || results?.verdict?.toLowerCase().includes('manipulated')
    ? 'malicious'
    : results?.verdict?.toLowerCase().includes('suspicious')
    ? 'suspicious'
    : 'safe';

  const isManipulated = results && (results.verdict?.toLowerCase().includes('ai') || results.verdict?.toLowerCase().includes('manipulated'));
  const isVideo = file?.name?.match(/\.(mp4|mov|avi|mkv|webm)$/i);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">AI Media & Deepfake Detector</h1>
        <p className="text-sm text-slate-500 mt-1">Upload an image or video to detect AI generation, deepfake manipulation, or tampering.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Upload + Preview */}
        <div className="space-y-4">
          {/* Upload Zone */}
          {status === 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-red-400 bg-red-50' : 'border-slate-300 hover:border-red-400 hover:bg-red-50/50'
              }`}
            >
              <input {...getInputProps()} />
              <FaRobot className="text-4xl text-slate-300 mx-auto mb-3" />
              <p className="font-bold text-slate-700">Drop an image or video</p>
              <p className="text-sm text-slate-400 mt-1">We'll check if it was made by AI or manipulated</p>
              <div className="flex items-center justify-center gap-2 mt-4">
                {['JPG','PNG','WEBP','MP4','MOV','AVI'].map(t => (
                  <span key={t} className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-400">{t}</span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Preview */}
          {preview && status !== 'idle' && !isVideo && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100"
            >
              <img src={preview} alt="Uploaded" className="w-full h-64 object-cover" />
              {isManipulated && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-[20%] left-[30%] w-[40%] h-[35%] bg-red-500/20 rounded-full blur-xl" />
                  <div className="absolute top-[15%] left-[25%] w-[45%] h-[40%] border-2 border-red-400/60 rounded-2xl flex items-end justify-center pb-2">
                    <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">⚠ Suspicious Region</span>
                  </div>
                </div>
              )}
              {results && !isManipulated && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="bg-emerald-500/80 backdrop-blur-sm text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2">
                    <FaShieldAlt /> Looks Authentic
                  </div>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <p className="text-white text-sm font-semibold truncate">{file?.name}</p>
                <p className="text-white/60 text-xs">{file?.size ? `${(file.size / 1024).toFixed(1)} KB` : ''}</p>
              </div>
            </motion.div>
          )}

          {isVideo && status !== 'idle' && (
            <div className="bg-slate-800 rounded-2xl p-6 flex items-center gap-4">
              <FaVideo className="text-3xl text-slate-400" />
              <div>
                <p className="text-white font-bold">{file?.name}</p>
                <p className="text-slate-400 text-xs">{file?.size ? `${(file.size / (1024*1024)).toFixed(2)} MB` : 'Video'}</p>
              </div>
            </div>
          )}

          {/* Scanning Progress */}
          {status === 'scanning' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full border-2 border-red-400 border-t-transparent animate-spin" />
                <div>
                  <p className="text-sm font-bold text-slate-700">Analyzing for AI signatures...</p>
                  <p className="text-xs text-slate-400">{progress.label}</p>
                </div>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div animate={{ width: `${(progress.step / progress.total) * 100}%` }}
                  className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full" transition={{ duration: 0.3 }} />
              </div>
            </div>
          )}

          {/* Cache Hit */}
          {status === 'cached' && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
              <FaCheckCircle className="text-emerald-500 text-xl" />
              <div>
                <p className="text-sm font-bold text-emerald-800">Found on Blockchain!</p>
                <p className="text-xs text-emerald-600">Previously scanned — results loaded instantly.</p>
              </div>
            </div>
          )}

          {/* Actions */}
          {(status === 'result' || status === 'cached') && (
            <div className="flex gap-3 flex-wrap">
              <button onClick={reset} className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors">
                <FaRedo className="text-xs" /> Scan Another
              </button>
              {status === 'cached' && (
                <button onClick={() => startScan(file, true)} className="flex items-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition-colors">
                  <FaSearch className="text-xs" /> Force Rescan
                </button>
              )}
              <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold transition-colors"
                onClick={() => generateReport({ scanType: 'deepfake', results, file, block })}>
                <FaDownload className="text-xs" /> Report
              </button>
            </div>
          )}
        </div>

        {/* Right: Results */}
        <div className="space-y-4">
          {(status === 'result' || status === 'cached') && results && (
            <>
              {/* Score Card */}
              <div className={`rounded-2xl border p-5 ${isManipulated ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isManipulated ? 'bg-red-100' : 'bg-emerald-100'}`}>
                      <FaEye className={isManipulated ? 'text-red-500' : 'text-emerald-500'} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800">{results.verdict}</p>
                      <p className="text-xs text-slate-500">AI/Deepfake Detection</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ThreatBadge level={verdictLevel} />
                    <BlockchainBadge block={block} size="small" />
                  </div>
                </div>
                {/* Risk gauge */}
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>AI Probability Score</span>
                    <span className="font-bold">{results.score}%</span>
                  </div>
                  <div className="h-2 bg-white/60 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${results.score}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className={`h-full rounded-full ${results.score >= 65 ? 'bg-red-500' : results.score >= 35 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    />
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{results.summary}</p>
              </div>

              {/* Detection Checks */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <FaRobot className="text-red-400" /> Detection Results
                </h3>
                <div className="space-y-3">
                  {results.checks?.map((check, idx) => (
                    <div key={idx}
                      className={`p-4 rounded-xl border flex items-center justify-between ${
                        check.status === 'fail' ? 'bg-red-50 border-red-200' :
                        check.status === 'warning' ? 'bg-amber-50 border-amber-200' :
                        'bg-emerald-50 border-emerald-200'
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="mt-0.5">
                          {check.status === 'pass'
                            ? <FaCheckCircle className="text-emerald-500" />
                            : <FaExclamationTriangle className={check.status === 'fail' ? 'text-red-500' : 'text-amber-500'} />}
                        </div>
                        <div>
                          <span className="text-sm font-bold text-slate-800 block mb-1">{check.label}</span>
                          <p className="text-[11px] text-slate-500 max-w-xs leading-relaxed mb-1">
                            {CHECK_DESCRIPTIONS[check.label] || 'AI analysis check.'}
                          </p>
                          <p className={`text-xs font-semibold ${check.status === 'fail' ? 'text-red-600' : check.status === 'warning' ? 'text-amber-600' : 'text-emerald-600'}`}>
                            ↳ {check.value}
                          </p>
                        </div>
                      </div>
                      <ThreatBadge level={check.status === 'fail' ? 'malicious' : check.status === 'warning' ? 'warning' : 'safe'} />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {status === 'idle' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center h-full flex flex-col items-center justify-center">
              <FaRobot className="text-4xl text-slate-200 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-500">Upload a file to detect AI generation</p>
              <p className="text-xs text-slate-400 mt-1">Supports images and videos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeepfakeScanner;
