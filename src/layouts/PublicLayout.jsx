import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';

const PublicLayout = () => {
    const location = useLocation();

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'How it Works', path: '/#how-it-works', type: 'hash' },
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-veriscan-light font-sans text-gray-900 relative overflow-x-hidden selection:bg-veriscan-purple/30">
            {/* --- NAVBAR (Dark Background) --- */}
            <nav className="w-full z-30 border-b border-slate-800 bg-slate-900 sticky top-0 shadow-lg">
                <div className="w-full px-8 flex justify-between items-center h-20">

                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <Link to="/" className="text-3xl font-black tracking-tight text-white">
                            VeriScan
                        </Link>
                    </div>

                    {/* Center Links */}
                    <ul className="flex justify-center items-center gap-10 text-sm font-bold tracking-wide text-gray-400 hidden md:flex">
                        {navLinks.map((item) => (
                            <motion.li
                                key={item.name}
                                whileHover={{ y: -3, color: '#ffffff' }}
                                className={`cursor-pointer transition-all duration-300 relative group ${location.pathname === item.path ? 'text-white' : ''}`}
                            >
                                {item.type === 'hash' ? (
                                    <a href={item.path} className="hover:text-white transition-colors">
                                        {item.name}
                                    </a>
                                ) : (
                                    <Link to={item.path}>{item.name}</Link>
                                )}
                                {/* Active Indicator */}
                                {location.pathname === item.path && (
                                    <motion.div layoutId="navIndicator" className="absolute -bottom-5 left-0 w-full h-[3px] bg-veriscan-purple rounded-t-full" />
                                )}

                                {/* Hover Line */}
                                <div className="absolute -bottom-5 left-0 w-0 h-[3px] bg-white group-hover:w-full transition-all duration-300 rounded-t-full opacity-50" />
                            </motion.li>
                        ))}
                    </ul>

                    {/* Right: Auth Buttons */}
                    <div className="flex justify-end items-center gap-4">
                        <Link to="/login">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                className="px-6 py-2.5 rounded-full border border-slate-600 text-gray-300 hover:text-white hover:border-white hover:bg-white/5 font-semibold text-sm transition-all"
                            >
                                Log In
                            </motion.button>
                        </Link>
                        <Link to="/register">
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(124, 58, 237, 0.5)" }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-2.5 bg-gradient-to-r from-veriscan-purple to-veriscan-teal text-white text-sm font-bold rounded-full shadow-lg shadow-purple-900/30 transition-all border border-white/10 flex items-center gap-2"
                            >
                                <span>Try for Free</span>
                                <FaCheckCircle className="text-white/80" />
                            </motion.button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-grow w-full flex flex-col relative z-10">
                <Outlet />
            </main>

            {/* --- FOOTER --- */}
            <footer className="w-full py-12 mt-auto bg-slate-900 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <h3 className="text-2xl font-black text-white mb-4">VeriScan</h3>
                            <p className="text-slate-400 text-sm">The first platform to combine AI detection and plagiarism checking in one tool.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4">Product</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li><a href="/#how-it-works" className="hover:text-white transition-colors">How it Works</a></li>
                                <li><Link to="/register" className="hover:text-white transition-colors">Get Started</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4">Company</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4">Contact</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li>Email: contact@veriscan.io</li>
                                <li>Support: support@veriscan.io</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-800 pt-8 text-center">
                        <p className="text-gray-400 text-sm font-medium">© 2026 VeriScan Inc. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;
