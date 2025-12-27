import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaRocket, FaEnvelope, FaLock, FaUser } from 'react-icons/fa';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate registration
        console.log('Registering:', { name, email, password });
        navigate('/dashboard');
    };

    return (
        <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center py-12 px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-veriscan-purple to-veriscan-teal rounded-2xl mb-4 shadow-lg">
                            <FaRocket className="text-white text-2xl" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create Your Account</h2>
                        <p className="text-slate-500 mt-2">Start detecting AI content for free.</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                            <div className="relative">
                                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-veriscan-purple/50 focus:border-veriscan-purple transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-veriscan-purple/50 focus:border-veriscan-purple transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-veriscan-purple/50 focus:border-veriscan-purple transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full py-4 bg-gradient-to-r from-veriscan-purple to-veriscan-teal text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 transition-all"
                        >
                            Create Account
                        </motion.button>
                    </form>

                    {/* Footer Link */}
                    <p className="text-center text-slate-500 text-sm mt-8">
                        Already have an account?{' '}
                        <Link to="/login" className="text-veriscan-purple font-bold hover:underline">
                            Log In
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
