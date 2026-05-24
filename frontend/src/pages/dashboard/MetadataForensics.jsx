import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  FaFingerprint, FaUpload, FaCheckCircle, FaExclamationTriangle,
  FaRedo, FaDownload, FaFile, FaCamera, FaMapMarkerAlt, FaCalendarAlt,
  FaImage, FaFilePdf, FaVideo, FaMusic, FaSearch
} from 'react-icons/fa';
import ThreatBadge from '../../components/ThreatBadge';
import BlockchainBadge from '../../components/BlockchainBadge';
import { runScan } from '../../services/scanner';
import { useAuth } from '../../context/AuthContext';
import { generateReport } from '../../services/reportGenerator';

const CHECK_DESCRIPTIONS = {
  "Location Data": "Checks if the file contains GPS coordinates from the device that created it.",
  "Photo Editing": "Checks if the file was modified in editing software like Photoshop, GIMP, or Lightroom.",
  "File Structure": "Verifies the internal file structure matches its file extension.",
  "File Authenticity": "Compares the file's internal signature (magic bytes) against the expected format.",
  "Document Creator": "Checks who created this document and with what application.",
  "Date Check": "Compares dates inside the file to make sure they are logical and consistent.",
  "Fake Dates": "Makes sure the creation date and the last saved date actually make sense.",
  "Hidden Items": "Looks for hidden or embedded objects inside the file.",
  "EXIF Data": "Checks whether the file contains any camera or device metadata at all.",
  "Encryption": "Checks if the file is password-protected or encrypted.",
  "PDF Metadata": "Checks whether the PDF has any readable metadata tags.",
  "PDF Producer": "Checks the application that generated this PDF.",
  "File Size": "Checks whether the file size is reasonable for its type.",
  "Audio Tags": "Checks for embedded music tags like title, artist, and album.",
  "File Extension": "Verifies that the file has a proper extension.",
  "Image Reading": "Checks if the image file can be opened and read correctly.",
  "PDF Reading": "Checks if the PDF file can be opened and parsed correctly.",
  "General Scan": "Standard file integrity check.",
};

const FILE_ICONS = {
  'jpg': FaImage, 'jpeg': FaImage, 'png': FaImage, 'webp': FaImage, 'gif': FaImage, 'bmp': FaImage, 'tiff': FaImage,
  'pdf': FaFilePdf,
  'mp4': FaVideo, 'mov': FaVideo, 'avi': FaVideo, 'mkv': FaVideo, 'webm': FaVideo,
  'mp3': FaMusic, 'wav': FaMusic, 'ogg': FaMusic, 'flac': FaMusic, 'aac': FaMusic,
};

const MetadataForensics = () => {
  const { currentUser } = useAuth();
  const [status, setStatus] = useState('idle');
  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);
  const [block, setBlock] = useState(null);
  const [progress, setProgress] = useState({ step: 0, total: 5, label: '' });

  useEffect(() => {
    const saved = sessionStorage.getItem('metadataScannerCache');
    if (saved) {
      try {
        const { savedFileObj, savedResults, savedStatus, savedBlock } = JSON.parse(saved);
        if (savedFileObj) setFile(savedFileObj);
        setResults(savedResults);
        setStatus(savedStatus);
        setBlock(savedBlock);
      } catch(e) {}
    }
  }, []);

  useEffect(() => {
    if (status === 'result' || status === 'cached') {
      sessionStorage.setItem('metadataScannerCache', JSON.stringify({
        savedFileObj: file ? { name: file.name, size: file.size } : null,
        savedResults: results,
        savedStatus: status,
        savedBlock: block
      }));
    }
  }, [status, results, file, block]);

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
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif', '.bmp', '.tiff'],
      'application/pdf': ['.pdf'],
      'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.webm'],
      'audio/*': ['.mp3', '.wav', '.ogg', '.flac', '.aac'],
    },
    maxFiles: 1,
  });

  const startScan = async (f, force = false) => {
    setStatus('scanning');
    setResults(null);

    try {
      const token = await currentUser.getIdToken();

      await runScan({
        fileName: f.name,
        file: f,
        token: token,
        mode: 'general',
        scanType: 'metadata',
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
    } catch (err) {
      console.error("Metadata scan failed:", err);
      setStatus('idle');
      alert("Scan failed: " + err.message);
    }
  };

  const reset = () => {
    setStatus('idle');
    setFile(null);
    setResults(null);
    setBlock(null);
    sessionStorage.removeItem('metadataScannerCache');
  };

  const getFileIcon = () => {
    if (!file && !results) return FaFile;
    const name = file?.name || results?.file_name || '';
    const ext = name.split('.').pop()?.toLowerCase();
    return FILE_ICONS[ext] || FaFile;
  };

  const FileIcon = getFileIcon();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">Metadata Forensics</h1>
        <p className="text-sm text-slate-500 mt-1">Upload any file to extract and analyze its hidden metadata — images, videos, audio, and documents.</p>
      </div>

      {/* Upload Zone */}
      {status === 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-purple-400 bg-purple-50'
              : 'border-slate-300 hover:border-purple-400 hover:bg-purple-50/50'
          }`}
        >
          <input {...getInputProps()} />
          <FaUpload className="text-3xl text-slate-300 mx-auto mb-3" />
          <p className="font-bold text-slate-700">Drop any file to analyze its metadata</p>
          <p className="text-sm text-slate-400 mt-1">Images, videos, audio, PDFs — we'll extract everything we can find</p>
          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
            {['JPG','PNG','PDF','MP4','MOV','MP3','WAV','AVI','GIF','WEBP'].map(t => (
              <span key={t} className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-400">{t}</span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Scanning */}
      {status === 'scanning' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full border-2 border-purple-400 border-t-transparent animate-spin" />
            <div>
              <p className="text-sm font-bold text-slate-700">Extracting metadata from {file?.name}...</p>
              <p className="text-xs text-slate-400">{progress.label}</p>
            </div>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${(progress.step / progress.total) * 100}%` }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
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

      {/* Results */}
      {(status === 'result' || status === 'cached') && results && (
        <div className="space-y-4">
          {/* File Info & Verdict */}
          <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <FileIcon className="text-purple-500 text-xl" />
              </div>
              <div>
                <p className="font-bold text-slate-800">{file?.name || results.file_name}</p>
                <p className="text-xs text-slate-400">
                  {results.file_info?.file_size || (file ? `${(file.size / 1024).toFixed(1)} KB` : '')}
                  {results.file_info?.file_type ? ` · ${results.file_info.file_type}` : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThreatBadge level={results.verdict === 'Tampered' ? 'malicious' : results.verdict === 'Suspicious' ? 'suspicious' : 'safe'} />
              <BlockchainBadge block={block} size="small" />
            </div>
          </div>

          {/* Extracted Metadata Table */}
          {results.extracted_metadata && results.extracted_metadata.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                <FaFingerprint className="text-purple-500" /> Extracted Metadata
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5">
                {results.extracted_metadata.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm py-1.5 border-b border-slate-50">
                    <span className="text-slate-400 flex items-center gap-2">
                      {item.label.includes('Camera') || item.label.includes('Lens') ? <FaCamera className="text-xs text-slate-300" /> :
                       item.label.includes('GPS') || item.label.includes('Location') ? <FaMapMarkerAlt className="text-xs text-slate-300" /> :
                       item.label.includes('Date') || item.label.includes('Modified') ? <FaCalendarAlt className="text-xs text-slate-300" /> :
                       null}
                      {item.label}
                    </span>
                    <span className="font-medium text-slate-700 text-right max-w-[200px] truncate">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GPS Map Link (if GPS data exists) */}
          {results.gps && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-5">
              <h3 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-500" /> GPS Location Found
              </h3>
              <p className="text-xs text-blue-600 mb-3">
                Coordinates: {results.gps.lat}, {results.gps.lon}
              </p>
              <a
                href={`https://www.google.com/maps?q=${results.gps.lat},${results.gps.lon}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                <FaMapMarkerAlt className="text-xs" /> Open in Google Maps
              </a>
            </div>
          )}

          {/* Security Checks */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="text-sm font-bold text-slate-700 mb-3">Security & Tampering Checks</h3>
            <div className="space-y-3">
              {results.checks.map((check, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border flex items-center justify-between ${
                    check.status === 'fail' ? 'bg-red-50 border-red-200' :
                    check.status === 'warning' ? 'bg-amber-50 border-amber-200' :
                    'bg-emerald-50 border-emerald-200'
                  }`}
                >
                  <div className="flex gap-4">
                     <div className="mt-0.5">
                       {check.status === 'pass' ? <FaCheckCircle className="text-emerald-500" /> : <FaExclamationTriangle className={check.status === 'fail' ? 'text-red-500' : 'text-amber-500'} />}
                     </div>
                     <div>
                        <span className="text-sm font-bold text-slate-800 block mb-1">{check.label}</span>
                        <p className="text-[11px] text-slate-500 max-w-md leading-relaxed mb-1">
                          {CHECK_DESCRIPTIONS[check.label] || "Advanced file forensics check."}
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

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={reset} className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors">
              <FaRedo className="text-xs" /> Analyze Another
            </button>
            {status === 'cached' && (
               <button onClick={() => startScan(file, true)} className="flex items-center gap-2 px-4 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-xl text-sm font-semibold transition-colors">
                 <FaSearch className="text-xs" /> Force Rescan
               </button>
            )}
            <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
              onClick={() => generateReport({ scanType: 'metadata', results, file, block })}>
              <FaDownload className="text-xs" /> Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetadataForensics;
