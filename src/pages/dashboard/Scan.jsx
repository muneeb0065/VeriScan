import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaRobot, FaFingerprint, FaCloudUploadAlt, FaToggleOn, FaToggleOff,
    FaExclamationTriangle, FaFileAlt, FaBrain, FaBook, FaSearch,
    FaFilePdf, FaCheckCircle, FaMagic, FaEye, FaLayerGroup, FaCrosshairs,
    FaChevronRight, FaSpinner
} from 'react-icons/fa';

const Scan = () => {
    const [activeTab, setActiveTab] = useState('ai');
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle');

    // AI Options
    const [deepAnalysis, setDeepAnalysis] = useState(true);
    const [ocrExtraction, setOcrExtraction] = useState(true);

    // Plagiarism Options
    const [excludeBibliography, setExcludeBibliography] = useState(true);
    const [strictMatching, setStrictMatching] = useState(false);

    const handleFileSelect = (uploadedFile) => {
        setFile(uploadedFile);
        setStatus('scanning');
        setTimeout(() => {
            setStatus('result');
        }, 4000);
    };

    const resetScan = () => {
        setFile(null);
        setStatus('idle');
    };

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles?.length > 0) {
            handleFileSelect(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.png', '.jpg'],
            'text/plain': ['.txt'],
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        },
        maxFiles: 1
    });

    const isAI = activeTab === 'ai';

    return (
        <div className="min-h-[calc(100vh-12rem)]">
            {/* Page Header with Gradient Accent */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className={`w-2 h-8 rounded-full ${isAI ? 'bg-gradient-to-b from-veriscan-purple to-veriscan-teal' : 'bg-gradient-to-b from-orange-500 to-red-500'}`}></div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>Content Scanner</h2>
                </div>
                <p className="text-slate-500 ml-5 text-lg">Analyze documents for AI-generated content or plagiarism with forensic precision.</p>
            </motion.div>

            {/* Premium Tab Switcher */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="relative mb-8"
            >
                <div className="flex bg-slate-100 p-1.5 rounded-2xl relative">
                    {/* Sliding Background */}
                    <motion.div
                        layout
                        className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-xl shadow-lg ${isAI
                            ? 'bg-gradient-to-r from-veriscan-purple to-indigo-600 left-1.5'
                            : 'bg-gradient-to-r from-orange-500 to-red-500 left-[calc(50%+3px)]'}`}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />

                    {/* AI Tab */}
                    <button
                        onClick={() => { setActiveTab('ai'); resetScan(); }}
                        className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold transition-all duration-300 relative z-10 ${isAI ? 'text-white' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <FaRobot className={`text-xl ${isAI ? 'text-teal-300' : ''}`} />
                        <span>AI Detection</span>
                        {isAI && <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">GPT-4 • Gemini • Claude</span>}
                    </button>

                    {/* Plagiarism Tab */}
                    <button
                        onClick={() => { setActiveTab('plagiarism'); resetScan(); }}
                        className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold transition-all duration-300 relative z-10 ${!isAI ? 'text-white' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <FaFingerprint className={`text-xl ${!isAI ? 'text-yellow-300' : ''}`} />
                        <span>Plagiarism Check</span>
                        {!isAI && <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">90B+ Sources</span>}
                    </button>
                </div>
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* Upload / Scan Area - Takes 3 columns */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-3"
                >
                    <div className={`relative rounded-3xl border-2 overflow-hidden transition-all duration-500 ${isDragActive
                        ? (isAI ? 'border-veriscan-purple bg-purple-50' : 'border-orange-500 bg-orange-50')
                        : 'border-slate-200 bg-white'
                        } shadow-sm hover:shadow-xl`}>

                        {/* Decorative Header Bar */}
                        <div className={`h-1.5 w-full ${isAI ? 'bg-gradient-to-r from-veriscan-purple via-indigo-500 to-veriscan-teal' : 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500'}`}></div>

                        <AnimatePresence mode="wait">
                            {/* IDLE STATE */}
                            {status === 'idle' && (
                                <motion.div
                                    key="idle"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    {...getRootProps()}
                                    className="p-12 cursor-pointer"
                                >
                                    <input {...getInputProps()} />

                                    <div className="flex flex-col items-center text-center">
                                        {/* Animated Icon Container */}
                                        <motion.div
                                            animate={{ y: isDragActive ? -10 : 0 }}
                                            className={`relative w-32 h-32 mb-8 rounded-3xl flex items-center justify-center ${isDragActive
                                                ? (isAI ? 'bg-veriscan-purple' : 'bg-orange-500')
                                                : 'bg-slate-100'
                                                } transition-colors duration-300`}
                                        >
                                            {/* Pulse Effect */}
                                            <div className={`absolute inset-0 rounded-3xl ${isAI ? 'bg-veriscan-purple' : 'bg-orange-500'} animate-ping opacity-20`}></div>

                                            <FaCloudUploadAlt className={`text-5xl relative z-10 ${isDragActive ? 'text-white' : 'text-slate-400'
                                                } transition-colors`} />
                                        </motion.div>

                                        <h3 className="text-2xl font-bold text-slate-800 mb-2">
                                            {isDragActive ? 'Release to Analyze' : 'Drop Your Document Here'}
                                        </h3>
                                        <p className="text-slate-500 mb-6 max-w-md">
                                            Drag and drop your file, or <span className={`font-semibold ${isAI ? 'text-veriscan-purple' : 'text-orange-500'}`}>click to browse</span>.
                                            We support PDF, DOCX, TXT, and images.
                                        </p>

                                        {/* File Type Badges */}
                                        <div className="flex flex-wrap justify-center gap-3">
                                            {[
                                                { icon: <FaFilePdf />, label: 'PDF', color: 'text-red-500' },
                                                { icon: <FaFileAlt />, label: 'DOCX', color: 'text-blue-500' },
                                                { icon: <FaLayerGroup />, label: 'TXT', color: 'text-slate-500' },
                                                { icon: <FaEye />, label: 'Images', color: 'text-green-500' },
                                            ].map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-slate-600">
                                                    <span className={item.color}>{item.icon}</span>
                                                    {item.label}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* SCANNING STATE */}
                            {status === 'scanning' && (
                                <motion.div
                                    key="scanning"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="p-16 flex flex-col items-center justify-center"
                                >
                                    {/* Animated Scanner Visual */}
                                    <div className="relative w-48 h-48 mb-10">
                                        {/* Outer Ring */}
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                            className={`absolute inset-0 rounded-full border-4 border-dashed ${isAI ? 'border-purple-200' : 'border-orange-200'}`}
                                        />
                                        {/* Inner Ring */}
                                        <motion.div
                                            animate={{ rotate: -360 }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                            className={`absolute inset-4 rounded-full border-4 border-t-transparent ${isAI ? 'border-veriscan-purple' : 'border-orange-500'}`}
                                        />
                                        {/* Center Icon */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <motion.div
                                                animate={{ scale: [1, 1.1, 1] }}
                                                transition={{ duration: 1.5, repeat: Infinity }}
                                                className={`w-20 h-20 rounded-2xl flex items-center justify-center ${isAI ? 'bg-veriscan-purple' : 'bg-orange-500'}`}
                                            >
                                                {isAI ? (
                                                    <FaBrain className="text-3xl text-white" />
                                                ) : (
                                                    <FaSearch className="text-3xl text-white" />
                                                )}
                                            </motion.div>
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Analyzing Document...</h3>
                                    <p className="text-slate-500 mb-6">Processing: <span className="font-semibold text-slate-700">{file?.name}</span></p>

                                    {/* Progress Steps */}
                                    <div className="flex items-center gap-4 text-sm">
                                        {['Parsing', 'Tokenizing', 'Matching', 'Scoring'].map((step, idx) => (
                                            <motion.div
                                                key={step}
                                                initial={{ opacity: 0.3 }}
                                                animate={{ opacity: [0.3, 1, 0.3] }}
                                                transition={{ duration: 1.5, repeat: Infinity, delay: idx * 0.3 }}
                                                className={`flex items-center gap-2 ${isAI ? 'text-veriscan-purple' : 'text-orange-500'}`}
                                            >
                                                <FaSpinner className="animate-spin" />
                                                {step}
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* RESULT STATE */}
                            {status === 'result' && (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-10"
                                >
                                    {/* Result Header */}
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isAI ? 'bg-purple-100 text-veriscan-purple' : 'bg-orange-100 text-orange-500'}`}>
                                                {isAI ? <FaRobot className="text-2xl" /> : <FaFingerprint className="text-2xl" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Analysis Complete</p>
                                                <h3 className="text-xl font-bold text-slate-900">{file?.name}</h3>
                                            </div>
                                        </div>
                                        <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm ${isAI ? 'bg-purple-100 text-veriscan-purple border border-purple-200' : 'bg-orange-100 text-orange-600 border border-orange-200'
                                            }`}>
                                            <FaExclamationTriangle />
                                            {isAI ? 'AI Content Detected' : 'Matches Found'}
                                        </div>
                                    </div>

                                    {/* Score Display */}
                                    <div className={`rounded-2xl p-8 mb-8 relative overflow-hidden ${isAI ? 'bg-gradient-to-br from-purple-50 to-indigo-50' : 'bg-gradient-to-br from-orange-50 to-red-50'}`}>
                                        <div className="flex items-end justify-between mb-6">
                                            <div>
                                                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">{isAI ? 'AI Probability' : 'Similarity Index'}</p>
                                                <p className="text-6xl font-black text-slate-900">{isAI ? '94.2' : '67.8'}<span className="text-3xl">%</span></p>
                                            </div>
                                            <div className={`text-right ${isAI ? 'text-veriscan-purple' : 'text-orange-500'}`}>
                                                <p className="text-sm font-bold">Confidence: High</p>
                                                <p className="text-xs text-slate-400">Based on {isAI ? '4 AI models' : '90B sources'}</p>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="h-4 bg-white rounded-full overflow-hidden shadow-inner">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: isAI ? '94.2%' : '67.8%' }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                className={`h-full rounded-full ${isAI ? 'bg-gradient-to-r from-veriscan-purple to-veriscan-teal' : 'bg-gradient-to-r from-orange-500 to-red-500'}`}
                                            />
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-4">
                                        <button
                                            onClick={resetScan}
                                            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                                        >
                                            <FaChevronRight className="rotate-180" /> Scan Another
                                        </button>
                                        <button className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-white font-bold rounded-xl shadow-lg transition-all hover:shadow-xl ${isAI ? 'bg-gradient-to-r from-veriscan-purple to-indigo-600' : 'bg-gradient-to-r from-orange-500 to-red-500'
                                            }`}>
                                            <FaFilePdf /> Download Report
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Options Sidebar - 1 column */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-1 space-y-6"
                >
                    {/* Scan Mode Info Card */}
                    <div className={`rounded-2xl p-6 text-white relative overflow-hidden ${isAI ? 'bg-gradient-to-br from-veriscan-purple to-indigo-700' : 'bg-gradient-to-br from-orange-500 to-red-600'
                        }`}>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                                {isAI ? <FaMagic className="text-xl" /> : <FaCrosshairs className="text-xl" />}
                            </div>
                            <h4 className="font-bold text-lg mb-2">{isAI ? 'AI Forensics' : 'Plagiarism Scan'}</h4>
                            <p className="text-sm text-white/80 leading-relaxed">
                                {isAI
                                    ? 'Detects GPT-4, Gemini, Claude & Llama using perplexity and burstiness analysis.'
                                    : 'Cross-references 90B+ web pages and 150M academic papers.'}
                            </p>
                        </div>
                    </div>

                    {/* Options Card */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-100 bg-slate-50">
                            <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Scan Options</h4>
                        </div>
                        <div className="p-4 space-y-3">
                            {isAI ? (
                                <>
                                    <OptionToggle
                                        icon={<FaBrain />}
                                        label="Deep Analysis"
                                        desc="Multi-model cross-check"
                                        value={deepAnalysis}
                                        onChange={setDeepAnalysis}
                                        activeColor="purple"
                                    />
                                    <OptionToggle
                                        icon={<FaEye />}
                                        label="OCR Extraction"
                                        desc="Read text from images"
                                        value={ocrExtraction}
                                        onChange={setOcrExtraction}
                                        activeColor="teal"
                                    />
                                </>
                            ) : (
                                <>
                                    <OptionToggle
                                        icon={<FaBook />}
                                        label="Exclude Bibliography"
                                        desc="Skip reference sections"
                                        value={excludeBibliography}
                                        onChange={setExcludeBibliography}
                                        activeColor="orange"
                                    />
                                    <OptionToggle
                                        icon={<FaCrosshairs />}
                                        label="Strict Matching"
                                        desc="Exact phrase only"
                                        value={strictMatching}
                                        onChange={setStrictMatching}
                                        activeColor="red"
                                    />
                                </>
                            )}
                        </div>
                    </div>

                    {/* Stats Card */}
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Session Stats</p>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Scans Today</span>
                                <span className="font-bold text-slate-700">3</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Total Scans</span>
                                <span className="font-bold text-slate-700">24</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

// Premium Toggle Component
const OptionToggle = ({ icon, label, desc, value, onChange, activeColor }) => {
    const colors = {
        purple: { bg: 'bg-purple-100', text: 'text-veriscan-purple', toggle: 'text-veriscan-purple' },
        teal: { bg: 'bg-teal-100', text: 'text-veriscan-teal', toggle: 'text-veriscan-teal' },
        orange: { bg: 'bg-orange-100', text: 'text-orange-500', toggle: 'text-orange-500' },
        red: { bg: 'bg-red-100', text: 'text-red-500', toggle: 'text-red-500' },
    }[activeColor];

    return (
        <div
            onClick={() => onChange(!value)}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${value ? `${colors.bg} border-transparent` : 'bg-slate-50 border-slate-100 hover:bg-slate-100'
                }`}
        >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${value ? colors.bg : 'bg-white'} ${colors.text}`}>
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm ${value ? 'text-slate-800' : 'text-slate-600'}`}>{label}</p>
                <p className="text-xs text-slate-400 truncate">{desc}</p>
            </div>
            <div className={`text-2xl ${value ? colors.toggle : 'text-slate-300'}`}>
                {value ? <FaToggleOn /> : <FaToggleOff />}
            </div>
        </div>
    );
};

export default Scan;
