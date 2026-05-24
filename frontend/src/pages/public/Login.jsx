import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaArrowRight, FaShieldAlt, FaCubes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      return setError('Please fill in all fields');
    }
    
    try {
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error("Firebase Auth Error:", err);
      let friendlyError = "Failed to sign in. Please try again.";
      if (err.code) {
        switch (err.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            friendlyError = "Incorrect email or password.";
            break;
          case 'auth/invalid-email':
            friendlyError = "Please enter a valid email address.";
            break;
          case 'auth/too-many-requests':
            friendlyError = "Too many failed attempts. Please try again later.";
            break;
          case 'auth/operation-not-allowed':
            friendlyError = "Firebase Error: You haven't enabled Email/Password sign-on in your Firebase Console. See instructions!";
            break;
          default:
            friendlyError = `Firebase Error (${err.code}): ${err.message}`;
        }
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
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-veriscan-purple/15 rounded-full blur-[120px]" />
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-veriscan-teal/15 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-md">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="w-14 h-14 bg-gradient-to-br from-veriscan-purple to-veriscan-teal rounded-2xl flex items-center justify-center mb-8">
              <span className="text-white font-black text-xl">V</span>
            </div>
            <h2 className="text-3xl font-black text-white mb-4 leading-tight">
              Verify Everything.<br />
              <span className="text-veriscan-teal">Trust Nothing.</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              Blockchain-integrated AI detection, plagiarism checking, deepfake analysis, and cyber threat intelligence — all in one platform.
            </p>

            {/* Feature badges */}
            <div className="space-y-3">
              {[
                { icon: <FaShieldAlt />, text: 'Dual-mode: Academic + Cybersecurity' },
                { icon: <FaCubes />, text: 'All results blockchain-verified' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="w-8 h-8 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-veriscan-teal">
                    {item.icon}
                  </div>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <h1 className="text-2xl font-black text-slate-800 mb-2">Welcome Back</h1>
            <p className="text-sm text-slate-500">Enter your credentials to continue.</p>
          </div>

          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm mb-4 font-medium">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
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
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Password</label>
                <a href="#" className="text-xs text-veriscan-purple font-semibold hover:underline">Forgot?</a>
              </div>
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
              {loading ? 'Signing In...' : 'Sign In'} <FaArrowRight className="text-xs" />
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Register Link */}
          <p className="text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-veriscan-purple font-bold hover:underline">
              Create one free →
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
