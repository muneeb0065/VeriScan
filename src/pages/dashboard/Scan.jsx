import React, { useState } from 'react';
import FileUpload from '../../components/FileUpload';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaExclamationTriangle } from 'react-icons/fa';

const Scan = () => {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, scanning, result

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

    return (
        <div className="h-full flex flex-col">
            <div className="mb-8">
                <h2 className="text-3xl font-black text-slate-900">New Scan</h2>
                <p className="text-slate-500 mt-1">Upload documents to verify authenticity.</p>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100 shadow-sm p-12 relative overflow-hidden">
                <AnimatePresence mode="wait">
                    {status === 'idle' && (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="w-full max-w-xl"
                        >
                            <FileUpload onFileSelect={handleFileSelect} />
                        </motion.div>
                    )}

                    {status === 'scanning' && (
                        <motion.div
                            key="scanning"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center"
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
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center w-full max-w-2xl"
                        >
                            <div className="inline-flex items-center gap-2 px-6 py-2 bg-red-50 border border-red-100 rounded-full text-red-500 font-bold shadow-sm mb-8">
                                <FaExclamationTriangle /> High AI Probability
                            </div>

                            <div className="bg-slate-50 rounded-3xl p-10 border border-slate-100 mb-8">
                                <div className="flex justify-between items-end mb-4">
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Confidence Score</p>
                                    <span className="text-5xl font-black text-slate-900">94.2%</span>
                                </div>

                                <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "94.2%" }}
                                        transition={{ duration: 1 }}
                                        className="h-full bg-gradient-to-r from-veriscan-purple to-veriscan-teal rounded-full"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 justify-center">
                                <button onClick={resetScan} className="px-8 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-colors">
                                    Scan Another
                                </button>
                                <button className="px-8 py-3 bg-slate-900 hover:bg-black text-white font-bold rounded-xl shadow-lg transition-all">
                                    Download Report
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Scan;
