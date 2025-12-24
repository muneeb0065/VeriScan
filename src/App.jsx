import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShieldAlt, FaRobot, FaExclamationTriangle, FaBars, FaHistory, FaTimes, FaCheckCircle, FaSpinner } from 'react-icons/fa';

function App() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, scanning, result
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleFileSelect = (uploadedFile) => {
    setFile(uploadedFile);
    setStatus('scanning');

    // Simulate a 3-second scan
    setTimeout(() => {
      setStatus('result');
    }, 3000);
  };

  const resetScan = () => {
    setFile(null);
    setStatus('idle');
  };

  const toggleHistory = () => {
    setIsHistoryOpen(!isHistoryOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-veriscan-light font-sans text-gray-900 relative overflow-x-hidden selection:bg-veriscan-purple/30">

      {/* --- BACKGROUND ANIMATION LAYER --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Animated blobs */}
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-gradient-to-br from-purple-200/40 to-blue-200/40 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -80, 0], y: [0, 60, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-teal-200/40 to-green-100/40 rounded-full blur-[80px]"
        />
      </div>

      {/* --- SIDEBAR: HISTORY --- */}
      <AnimatePresence>
        {isHistoryOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleHistory}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-80 bg-white/95 backdrop-blur-xl border-r border-gray-200 z-50 shadow-2xl p-6 flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-800">
                  <span className="p-2 bg-purple-100 rounded-lg"><FaHistory className="text-veriscan-purple" /></span> History
                </h2>
                <button onClick={toggleHistory} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                  <FaTimes />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto space-y-4">
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                    <FaHistory className="text-2xl" />
                  </div>
                  <p className="text-gray-400 font-medium">No recent activity</p>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <button className="w-full py-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-sm font-semibold transition-colors text-gray-600 flex justify-center items-center gap-2">
                  Clear History
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- ROW 1: HEADER (Large Name Left, Logo Right) --- */}
      <header className="w-full px-8 py-8 flex justify-between items-center border-b border-white/40 bg-white/60 backdrop-blur-md z-40 relative">

        {/* Top Left: Name */}
        <div>
          <h1 className="text-6xl font-black tracking-tighter text-gray-900 drop-shadow-sm">
            VeriScan
          </h1>
          <p className="text-sm text-gray-500 tracking-[0.3em] uppercase mt-1 font-bold">AI Content Forensics</p>
        </div>

        {/* Top Right: Logo */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-800">Secure System</p>
            <p className="text-xs text-veriscan-purple font-semibold bg-purple-100 px-2 py-0.5 rounded-full inline-block">v1.2.0</p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20 ring-4 ring-white overflow-hidden"
          >
            <img src="/logo.png" alt="VeriScan Logo" className="w-full h-full object-cover" />
          </motion.div>
        </div>
      </header>

      {/* --- ROW 2: NAVBAR (Dark Background, Register Tab) --- */}
      <nav className="w-full z-30 border-b border-slate-800 bg-slate-900 sticky top-0 shadow-lg">
        <div className="w-full px-8 flex justify-between items-center h-20">

          {/* Invisible Spacer to balance center alignment */}
          <div className="flex-1 hidden md:block" />

          {/* Center Links */}
          <ul className="flex justify-center items-center gap-10 text-sm font-bold tracking-wide text-gray-400">
            {['Home', 'About Us', 'Contact'].map((item) => (
              <motion.li
                key={item}
                whileHover={{ y: -3, color: '#ffffff' }}
                className={`cursor-pointer transition-all duration-300 relative group ${item === 'Home' ? 'text-white' : ''}`}
              >
                {item}
                {/* Active Indicator */}
                {item === 'Home' && <motion.div layoutId="navIndicator" className="absolute -bottom-5 left-0 w-full h-[3px] bg-veriscan-purple rounded-t-full" />}

                {/* Hover Line */}
                <div className="absolute -bottom-5 left-0 w-0 h-[3px] bg-white group-hover:w-full transition-all duration-300 rounded-t-full opacity-50" />
              </motion.li>
            ))}
          </ul>

          {/* Right: Auth Buttons */}
          <div className="flex-1 flex justify-end items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-6 py-2.5 rounded-full border border-slate-600 text-gray-300 hover:text-white hover:border-white hover:bg-white/5 font-semibold text-sm transition-all"
            >
              Log In
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(124, 58, 237, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-2.5 bg-gradient-to-r from-veriscan-purple to-veriscan-teal text-white text-sm font-bold rounded-full shadow-lg shadow-purple-900/30 transition-all border border-white/10 flex items-center gap-2"
            >
              <span>Register</span>
              <FaCheckCircle className="text-white/80" />
            </motion.button>
          </div>
        </div>
      </nav>

      {/* --- ROW 3: MAIN CONTENT + HAMBURGER --- */}
      <div className="flex-grow w-full max-w-[1400px] mx-auto px-6 relative z-10 flex flex-col md:flex-row mt-8">

        {/* HAMBURGER (Left Side of Main Section) */}
        <aside className="w-full md:w-24 flex-shrink-0 flex flex-col items-center pt-8 sticky top-24 h-fit z-20">
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: '#f3e8ff' }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleHistory}
            className="flex flex-col items-center gap-2 p-4 bg-white border border-gray-200 rounded-2xl shadow-lg transition-all group"
            title="View History"
          >
            <FaBars className="text-2xl text-gray-500 group-hover:text-veriscan-purple transition-colors" />
            <span className="text-[10px] font-bold text-gray-400 group-hover:text-veriscan-purple uppercase tracking-wider">Menu</span>
          </motion.button>
        </aside>

        {/* CENTER CONTENT */}
        <main className="flex-grow flex flex-col items-center justify-start pt-4 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl"
          >
            <div className="bg-white/60 backdrop-blur-2xl border border-white/60 p-12 rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden ring-1 ring-white">

              {/* Decorative Gradient Line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-veriscan-purple to-transparent opacity-30" />

              <AnimatePresence mode="wait">
                {status === 'idle' && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center"
                  >
                    <h2 className="text-5xl font-black mb-6 text-gray-900 tracking-tight">
                      Analysis Dashboard
                    </h2>
                    <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto">
                      Upload documents to scan for AI-generated patterns. Supports academic and professional formats.
                    </p>
                    <FileUpload onFileSelect={handleFileSelect} />
                  </motion.div>
                )}

                {status === 'scanning' && (
                  <motion.div
                    key="scanning"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-16"
                  >
                    <div className="relative w-40 h-40 mb-8">
                      {/* Spinning Rings */}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-4 border-dashed border-gray-200 rounded-full"
                      />
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-2 border-t-4 border-veriscan-purple rounded-full"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FaRobot className="text-5xl text-gray-300 animate-pulse" />
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">Scanning...</h3>
                    <p className="text-veriscan-teal font-medium mt-2">Processing: {file?.name}</p>
                  </motion.div>
                )}

                {status === 'result' && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                  >
                    <div className="flex justify-center mb-6">
                      <div className="inline-flex items-center gap-2 px-6 py-2 bg-red-50 border border-red-100 rounded-full text-red-500 font-bold shadow-sm">
                        <FaExclamationTriangle /> High AI Probability
                      </div>
                    </div>

                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-8 max-w-lg mx-auto">
                      <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Confidence Score</p>
                      <div className="text-7xl font-black text-gray-900 mb-4 tracking-tighter">
                        94.2<span className="text-3xl text-gray-400">%</span>
                      </div>
                      <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "94.2%" }}
                          transition={{ duration: 1 }}
                          className="h-full bg-gradient-to-r from-veriscan-purple to-veriscan-teal rounded-full"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 justify-center">
                      <button onClick={resetScan} className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">
                        Download
                      </button>
                      <button onClick={resetScan} className="px-8 py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all">
                        Scan Agent
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </main>

        {/* Spacer for Right Side balance (optional) */}
        <aside className="hidden md:block w-24"></aside>

      </div>

      {/* --- FOOTER (Darker) --- */}
      <footer className="w-full py-8 mt-auto bg-slate-900 border-t border-slate-800 text-center">
        <p className="text-gray-400 text-sm font-medium">© 2026 VeriScan Inc.</p>
      </footer>
    </div>
  );
}

export default App;