import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    FaRobot, FaFingerprint, FaFileUpload, FaBrain, FaFilePdf, FaCheck,
    FaArrowRight, FaShieldAlt, FaBolt, FaChartLine, FaGlobe, FaBook,
    FaCheckCircle, FaPlay, FaStar, FaQuoteLeft
} from 'react-icons/fa';

const Landing = () => {
    return (
        <div className="flex flex-col overflow-x-hidden">

            {/* ============ HERO SECTION ============ */}
            <section className="relative w-full min-h-[90vh] flex items-center overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 -z-10">
                    {/* Gradient Orbs */}
                    <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-veriscan-purple/20 to-transparent rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-veriscan-teal/20 to-transparent rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>
                    {/* Grid Pattern */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgMEgwdjYwaDYwVjB6TTU5IDFoLTU4djU4aDU4VjF6IiBmaWxsPSIjZTJlOGYwIiBmaWxsLW9wYWNpdHk9Ii41Ii8+PC9nPjwvc3ZnPg==')] opacity-40"></div>
                </div>

                <div className="w-full max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-8">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-veriscan-teal opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-veriscan-teal"></span>
                            </span>
                            <span className="text-sm font-bold text-slate-600">The Only All-in-One Forensic Platform</span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
                            Detect <span className="text-veriscan-purple" style={{ textShadow: '0 0 40px rgba(124, 58, 237, 0.3)' }}>AI Content</span>
                            <br />
                            <span className="text-orange-500">&</span> <span className="text-slate-800">Plagiarism</span>
                            <br />
                            <span className="text-slate-400 text-4xl lg:text-5xl">in Seconds.</span>
                        </h1>

                        {/* Subheadline */}
                        <p className="text-xl text-slate-500 leading-relaxed mb-8 max-w-lg">
                            VeriScan is the <strong className="text-slate-700">first platform</strong> to combine AI detection and plagiarism checking in one tool.
                            Trusted by educators to maintain academic integrity.
                        </p>

                        {/* Dual Feature Highlight */}
                        <div className="flex flex-wrap gap-4 mb-10">
                            <div className="flex items-center gap-3 px-5 py-3 bg-purple-50 border border-purple-100 rounded-2xl">
                                <FaRobot className="text-veriscan-purple text-xl" />
                                <div>
                                    <p className="font-bold text-slate-800 text-sm">AI Detection</p>
                                    <p className="text-xs text-slate-500">GPT-4, Gemini, Claude</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 px-5 py-3 bg-orange-50 border border-orange-100 rounded-2xl">
                                <FaFingerprint className="text-orange-500 text-xl" />
                                <div>
                                    <p className="font-bold text-slate-800 text-sm">Plagiarism Check</p>
                                    <p className="text-xs text-slate-500">90B+ Web Sources</p>
                                </div>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-4">
                            <Link to="/register">
                                <motion.button
                                    whileHover={{ scale: 1.03, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center gap-3 group"
                                >
                                    Start Free <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </Link>
                            <a href="#how-it-works">
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    className="px-8 py-4 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-3"
                                >
                                    <FaPlay className="text-veriscan-purple" /> See How It Works
                                </motion.button>
                            </a>
                        </div>
                    </motion.div>

                    {/* Right: Visual */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        {/* Main Visual Card */}
                        <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
                            {/* Header Bar */}
                            <div className="h-12 bg-slate-900 flex items-center px-4 gap-2">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                                <div className="flex-1 flex justify-center">
                                    <div className="px-4 py-1 bg-white/10 rounded-lg text-white/60 text-xs font-medium">veriscan.io/dashboard</div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8">
                                {/* Tabs */}
                                <div className="flex gap-2 mb-6">
                                    <div className="flex-1 py-3 bg-gradient-to-r from-veriscan-purple to-indigo-600 text-white text-center rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                                        <FaRobot /> AI Detection
                                    </div>
                                    <div className="flex-1 py-3 bg-slate-100 text-slate-500 text-center rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                                        <FaFingerprint /> Plagiarism
                                    </div>
                                </div>

                                {/* Upload Zone Preview */}
                                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center mb-6 relative overflow-hidden">
                                    <motion.div
                                        animate={{ y: [0, -5, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4"
                                    >
                                        <FaFileUpload className="text-2xl text-veriscan-purple" />
                                    </motion.div>
                                    <p className="font-bold text-slate-700">Drop your document here</p>
                                    <p className="text-sm text-slate-400">PDF, DOCX, TXT supported</p>
                                </div>

                                {/* Result Preview */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1 }}
                                    className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-5 border border-purple-100"
                                >
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-xs font-bold text-slate-500 uppercase">AI Probability</span>
                                        <span className="px-3 py-1 bg-purple-100 text-veriscan-purple text-xs font-bold rounded-full">AI Detected</span>
                                    </div>
                                    <div className="text-4xl font-black text-slate-900 mb-3">94.2%</div>
                                    <div className="h-2 bg-white rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '94%' }}
                                            transition={{ duration: 2, delay: 1.5 }}
                                            className="h-full bg-gradient-to-r from-veriscan-purple to-veriscan-teal"
                                        ></motion.div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Floating Badge - AI Models */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="absolute -left-8 top-1/4 bg-white rounded-2xl shadow-xl p-4 border border-slate-100"
                        >
                            <p className="text-xs font-bold text-slate-400 mb-2">Detects</p>
                            <div className="flex gap-2">
                                {['GPT-4', 'Gemini', 'Claude'].map((model) => (
                                    <span key={model} className="px-2 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600">{model}</span>
                                ))}
                            </div>
                        </motion.div>

                        {/* Floating Badge - Sources */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                            className="absolute -right-4 bottom-1/4 bg-white rounded-2xl shadow-xl p-4 border border-slate-100"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                                    <FaGlobe className="text-orange-500" />
                                </div>
                                <div>
                                    <p className="font-black text-slate-800">90B+</p>
                                    <p className="text-xs text-slate-400">Web Sources</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ============ UNIQUE VALUE PROPOSITION ============ */}
            <section className="py-20 bg-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgMEgwdjYwaDYwVjB6TTU5IDFoLTU4djU4aDU4VjF6IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-50"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-veriscan-teal font-bold uppercase tracking-widest text-sm mb-4"
                        >
                            Why VeriScan is Different
                        </motion.p>
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl lg:text-5xl font-black text-white tracking-tight"
                        >
                            Two Powerful Tools. <span className="text-transparent bg-clip-text bg-gradient-to-r from-veriscan-purple to-veriscan-teal">One Platform.</span>
                        </motion.h2>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* AI Detection Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-veriscan-purple/20 to-indigo-600/20 rounded-3xl p-8 border border-white/10 backdrop-blur-sm"
                        >
                            <div className="w-16 h-16 bg-veriscan-purple rounded-2xl flex items-center justify-center mb-6">
                                <FaRobot className="text-white text-2xl" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">AI Content Detection</h3>
                            <p className="text-slate-300 leading-relaxed mb-6">
                                Our multi-model engine analyzes perplexity, burstiness, and invisible watermarks to detect content from ChatGPT, Gemini, Claude, and more.
                            </p>
                            <ul className="space-y-3">
                                {['GPT-4 & GPT-4o Detection', 'Google Gemini Analysis', 'Claude & Llama Support', 'Deepfake Image Scanning'].map((item) => (
                                    <li key={item} className="flex items-center gap-3 text-white/80">
                                        <FaCheckCircle className="text-veriscan-teal" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Plagiarism Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-3xl p-8 border border-white/10 backdrop-blur-sm"
                        >
                            <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-6">
                                <FaFingerprint className="text-white text-2xl" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Plagiarism Detection</h3>
                            <p className="text-slate-300 leading-relaxed mb-6">
                                Cross-reference submissions against 90 billion+ web pages and 150 million academic papers to catch copied content instantly.
                            </p>
                            <ul className="space-y-3">
                                {['90B+ Web Pages Indexed', '150M Academic Papers', 'Real-time Source Matching', 'Bibliography Exclusion'].map((item) => (
                                    <li key={item} className="flex items-center gap-3 text-white/80">
                                        <FaCheckCircle className="text-orange-400" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ============ HOW IT WORKS ============ */}
            <section id="how-it-works" className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-block mb-4 px-4 py-1.5 bg-veriscan-purple/10 text-veriscan-purple rounded-full text-xs font-bold uppercase tracking-widest"
                        >
                            Simple Process
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4"
                        >
                            How VeriScan Works
                        </motion.h2>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                            Get forensic-level analysis in three simple steps. No complicated setup required.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-veriscan-purple via-slate-200 to-veriscan-teal"></div>

                        {[
                            {
                                step: '01',
                                icon: <FaFileUpload />,
                                title: 'Upload Document',
                                desc: 'Drag & drop your PDF, DOCX, or paste text directly into the scanner.',
                                color: 'from-veriscan-purple to-indigo-600'
                            },
                            {
                                step: '02',
                                icon: <FaBrain />,
                                title: 'AI Analyzes',
                                desc: 'Our multi-model engine scans for AI patterns and plagiarism matches.',
                                color: 'from-indigo-500 to-veriscan-teal'
                            },
                            {
                                step: '03',
                                icon: <FaFilePdf />,
                                title: 'Get Report',
                                desc: 'Receive a detailed forensic report with highlighted sections and sources.',
                                color: 'from-veriscan-teal to-cyan-500'
                            },
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.15 }}
                                className="relative bg-white rounded-3xl p-8 border border-slate-100 shadow-lg hover:shadow-2xl transition-all group text-center"
                            >
                                {/* Step Number */}
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-slate-900 text-white text-xs font-bold rounded-full">
                                    Step {item.step}
                                </div>

                                {/* Icon */}
                                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white text-3xl shadow-lg group-hover:scale-110 transition-transform`}>
                                    {item.icon}
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ FEATURES GRID ============ */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl font-black text-slate-900 tracking-tight mb-4"
                        >
                            Built for Academic Integrity
                        </motion.h2>
                        <p className="text-slate-500 text-lg">Enterprise-grade features, completely free for educators.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: <FaBolt />, title: 'Lightning Fast', desc: 'Results in under 10 seconds', color: 'text-yellow-500', bg: 'bg-yellow-50' },
                            { icon: <FaShieldAlt />, title: 'Privacy First', desc: 'Files deleted after analysis', color: 'text-green-500', bg: 'bg-green-50' },
                            { icon: <FaChartLine />, title: 'Detailed Reports', desc: 'Sentence-level breakdown', color: 'text-blue-500', bg: 'bg-blue-50' },
                            { icon: <FaBook />, title: 'Academic Focus', desc: 'Built for educators', color: 'text-veriscan-purple', bg: 'bg-purple-50' },
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-lg transition-all group"
                            >
                                <div className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center ${feature.color} text-xl mb-4 group-hover:scale-110 transition-transform`}>
                                    {feature.icon}
                                </div>
                                <h3 className="font-bold text-slate-800 mb-2">{feature.title}</h3>
                                <p className="text-sm text-slate-500">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ CTA SECTION ============ */}
            <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-veriscan-purple/20 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-veriscan-teal/20 rounded-full blur-[100px]"></div>
                </div>

                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-6">
                            Ready to Verify Your Content?
                        </h2>
                        <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                            Join educators worldwide who trust VeriScan for AI detection and plagiarism checking.
                            <strong className="text-white"> 100% Free.</strong>
                        </p>
                        <Link to="/register">
                            <motion.button
                                whileHover={{ scale: 1.05, y: -3 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-10 py-5 bg-white text-slate-900 font-bold text-lg rounded-2xl shadow-2xl hover:shadow-white/20 transition-all"
                            >
                                Get Started Free <FaArrowRight className="inline ml-2" />
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
