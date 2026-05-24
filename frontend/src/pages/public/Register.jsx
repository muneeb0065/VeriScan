import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaArrowRight, FaGraduationCap, FaShieldAlt, FaCubes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!name || !email || !password) {
      return setError('Please fill in all fields');
    }
    
    try {
      setLoading(true);
      await signup(email, password);
      navigate('/dashboard');
    } catch (err) {
      let friendlyError = "Failed to create account. Please try again.";
      if (err.code === 'auth/email-already-in-use') {
        friendlyError = "This email is already registered. Please sign in instead.";
      } else if (err.code === 'auth/invalid-email') {
        friendlyError = "Please enter a valid email address.";
      } else if (err.code === 'auth/weak-password') {
        friendlyError = "Your password must be at least 6 characters long.";
      } else if (err.code) {
        friendlyError = err.message; // fallback for other specific codes if needed, but formatted better
      }
      setError(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex">
      {/* Left: Visual Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-veriscan-purple/15 rounded-full blur-[120px]" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-md">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="w-14 h-14 bg-gradient-to-br from-veriscan-purple to-veriscan-teal rounded-2xl flex items-center justify-center mb-8">
              <span className="text-white font-black text-xl">V</span>
            </div>
            <h2 className="text-3xl font-black text-white mb-4 leading-tight">
              Join VeriScan<br />
              <span className="text-veriscan-teal">for Free.</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              Get immediate access to AI detection, plagiarism checking, and cybersecurity analysis tools — all backed by blockchain verification.
            </p>

            {/* Mode cards */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl">
                <div className="w-9 h-9 bg-veriscan-purple/20 rounded-lg flex items-center justify-center text-veriscan-purple">
                  <FaGraduationCap />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Academic Mode</p>
                  <p className="text-[11px] text-slate-400">AI + Plagiarism detection</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl">
                <div className="w-9 h-9 bg-orange-500/20 rounded-lg flex items-center justify-center text-orange-400">
                  <FaShieldAlt />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Cybersecurity Mode</p>
                  <p className="text-[11px] text-slate-400">Deepfake, phishing, URL, metadata</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right: Register Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <h1 className="text-2xl font-black text-slate-800 mb-2">Create Account</h1>
            <p className="text-sm text-slate-500">Start verifying content in seconds.</p>
          </div>

          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm mb-4 font-medium">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 block">Full Name</label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-sm" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-veriscan-purple/30 focus:border-veriscan-purple transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 block">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-sm" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-veriscan-purple/30 focus:border-veriscan-purple transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 block">Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-sm" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-veriscan-purple/30 focus:border-veriscan-purple transition-all"
                />
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Creating Account...' : 'Create Account'} <FaArrowRight className="text-xs" />
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Login Link */}
          <p className="text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-veriscan-purple font-bold hover:underline">
              Sign In →
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
