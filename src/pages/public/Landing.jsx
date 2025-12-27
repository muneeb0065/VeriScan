import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaChartBar, FaBolt } from 'react-icons/fa';

const Landing = () => {
    return (
        <div className="flex flex-col items-center">
            {/* HERO SECTION */}
            <section className="w-full max-w-6xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2 text-center md:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[1.1] mb-6">
                            Detect AI Content <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-veriscan-purple to-veriscan-teal">In Seconds.</span>
                        </h1>
                        <p className="text-lg text-slate-500 mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed">
                            The advanced AI forensics platform trusted by institutions. Scan documents, verify authenticity, and ensure integrity with state-of-the-art detection models.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <Link to="/dashboard">
                                <button className="px-8 py-4 bg-slate-900 text-white font-bold rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all w-full sm:w-auto">
                                    Get Started
                                </button>
                            </Link>
                            <Link to="/#features">
                                <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 font-bold rounded-full hover:bg-slate-50 transition-all w-full sm:w-auto">
                                    Learn More
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                </div>

                <div className="md:w-1/2 relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative z-10"
                    >
                        {/* Abstract Hero Image Placeholder/Graphic */}
                        <div className="w-full aspect-square bg-gradient-to-tr from-purple-100 to-teal-50 rounded-[3rem] shadow-2xl border border-white/50 p-8 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-lg border border-white max-w-sm w-full">
                                <div className="flex items-center gap-4 mb-4 border-b border-slate-100 pb-4">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                        <FaShieldAlt />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800">Scan Complete</p>
                                        <p className="text-xs text-slate-400">Just now</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-2 w-full bg-slate-100 rounded-full"></div>
                                    <div className="h-2 w-3/4 bg-slate-100 rounded-full"></div>
                                    <div className="flex justify-between items-center mt-6">
                                        <span className="text-xs font-bold text-slate-400">Human Score</span>
                                        <span className="text-xl font-black text-veriscan-teal">98%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                        <div className="w-[98%] h-full bg-veriscan-teal rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-purple-200/20 blur-3xl rounded-full -z-10"></div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="w-full bg-white py-24 border-t border-slate-100">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-slate-900 mb-4">Why VeriScan?</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">Our multi-model analysis engine provides the most accurate results in the industry.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: <FaBolt />, title: "Real-time Analysis", desc: "Get detailed reports in seconds with our optimized processing engine." },
                            { icon: <FaShieldAlt />, title: "Bank-grade Security", desc: "Your data is encrypted and deleted immediately after processing." },
                            { icon: <FaChartBar />, title: "Detailed Analytics", desc: "Deep insights into sentence structure, perplexity, and burstiness." }
                        ].map((feature, idx) => (
                            <div key={idx} className="p-8 rounded-3xl bg-slate-50 hover:bg-slate-100 transition-colors group">
                                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl text-veriscan-purple mb-6 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
