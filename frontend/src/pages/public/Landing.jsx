import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaRobot, FaCopy, FaShieldAlt, FaEye, FaEnvelopeOpenText,
  FaGlobe, FaFingerprint, FaCubes, FaArrowRight, FaCheck,
  FaBolt, FaLock, FaChartBar, FaGraduationCap, FaFileAlt
} from 'react-icons/fa';

const Landing = () => {
  return (
    <div className="overflow-hidden">

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[85vh] flex items-center py-20">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-purple-400/10 rounded-full blur-[120px]" />
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-teal-400/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-400/5 rounded-full blur-[150px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left — Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="flex items-center gap-2 mb-5">
                <span className="px-3 py-1.5 bg-purple-50 text-veriscan-purple rounded-full text-xs font-bold border border-purple-200">
                  🔗 Blockchain Verified
                </span>
                <span className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">
                  v1.0
                </span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-6">
                Verify Everything.{' '}
                <span className="bg-gradient-to-r from-veriscan-purple to-veriscan-teal bg-clip-text text-transparent">
                  Trust Nothing.
                </span>
              </h1>

              <p className="text-lg text-slate-500 leading-relaxed mb-8 max-w-lg">
                AI content detection, plagiarism checking, deepfake analysis, and cyber threat intelligence — all in one blockchain-verified platform.
              </p>

              {/* Mode Badges */}
              <div className="flex flex-wrap gap-3 mb-8">
                <span className="flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-xl text-sm font-semibold text-veriscan-purple">
                  <FaGraduationCap /> Academic Mode
                </span>
                <span className="flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 rounded-xl text-sm font-semibold text-orange-600">
                  <FaShieldAlt /> Cybersecurity Mode
                </span>
              </div>

              {/* CTA */}
              <div className="flex flex-wrap gap-4">
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-7 py-3.5 bg-gradient-to-r from-veriscan-purple to-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-purple-500/20 flex items-center gap-2"
                  >
                    Get Started Free <FaArrowRight className="text-xs" />
                  </motion.button>
                </Link>
                <Link to="/about">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    className="px-7 py-3.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:shadow-md transition-shadow"
                  >
                    Learn More
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* Right — Mock Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden">
                {/* Mock browser bar */}
                <div className="bg-slate-800 px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 bg-slate-700 rounded-lg px-3 py-1 ml-3">
                    <span className="text-xs text-slate-400">veriscan.app/dashboard</span>
                  </div>
                </div>

                {/* Mock dashboard content */}
                <div className="p-5 bg-slate-50 space-y-4">
                  {/* Stat cards */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white rounded-xl p-3 border border-slate-100">
                      <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center mb-2"><FaRobot className="text-veriscan-purple text-sm" /></div>
                      <p className="text-lg font-black text-slate-800">94.2%</p>
                      <p className="text-[10px] text-slate-400">AI Detected</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-slate-100">
                      <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center mb-2"><FaCopy className="text-veriscan-teal text-sm" /></div>
                      <p className="text-lg font-black text-slate-800">12.1%</p>
                      <p className="text-[10px] text-slate-400">Plagiarism</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-slate-100">
                      <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center mb-2"><FaCubes className="text-emerald-600 text-sm" /></div>
                      <p className="text-lg font-black text-slate-800">🔗</p>
                      <p className="text-[10px] text-slate-400">Verified</p>
                    </div>
                  </div>

                  {/* Progress bar animation */}
                  <div className="bg-white rounded-xl p-4 border border-slate-100">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-slate-500 font-medium">AI Content Analysis</span>
                      <span className="font-bold text-red-500">94.2%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '94.2%' }}
                        transition={{ duration: 2, delay: 1 }}
                        className="h-full bg-gradient-to-r from-veriscan-purple to-red-500 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                className="absolute -right-4 top-1/3 bg-white rounded-xl shadow-lg border border-slate-200 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <FaShieldAlt className="text-orange-500" />
                  <span className="text-xs font-bold text-slate-700">Deepfake: Clean ✓</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== TWO MODES SECTION ===== */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-black text-white mb-3">Two Modes, One Platform</h2>
            <p className="text-slate-400 max-w-lg mx-auto">Switch between Academic and Cybersecurity modes to tackle different verification challenges.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Academic Mode Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-purple-900/50 to-slate-800 rounded-2xl p-8 border border-purple-500/20"
            >
              <div className="w-14 h-14 bg-veriscan-purple/20 rounded-2xl flex items-center justify-center mb-5">
                <FaGraduationCap className="text-2xl text-veriscan-purple" />
              </div>
              <h3 className="text-xl font-black text-white mb-3">Academic Mode</h3>
              <p className="text-slate-400 text-sm mb-5 leading-relaxed">
                Combined AI content detection and plagiarism checking for academic integrity. Upload once — get both analyses simultaneously.
              </p>
              <ul className="space-y-2.5">
                {['AI Detection (GPT-4, Gemini, Claude)', 'Plagiarism against 90B+ web pages', '150M academic paper database', 'Sentence-level flagging', 'Blockchain-verified certificates'].map(item => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-slate-300">
                    <FaCheck className="text-veriscan-purple text-xs shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* General/Cybersecurity Mode Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-orange-900/30 to-slate-800 rounded-2xl p-8 border border-orange-500/20"
            >
              <div className="w-14 h-14 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-5">
                <FaShieldAlt className="text-2xl text-orange-400" />
              </div>
              <h3 className="text-xl font-black text-white mb-3">Cybersecurity Mode</h3>
              <p className="text-slate-400 text-sm mb-5 leading-relaxed">
                Digital forensics and threat intelligence tools for detecting deepfakes, phishing, and analyzing suspicious content.
              </p>
              <ul className="space-y-2.5">
                {['Deepfake image & video detection', 'Social engineering & phishing analysis', 'URL safety scanner', 'Metadata forensics & EXIF extraction', 'All results blockchain-verified'].map(item => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-slate-300">
                    <FaCheck className="text-orange-400 text-xs shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-black text-slate-800 mb-3">How It Works</h2>
            <p className="text-slate-500 max-w-lg mx-auto">Four simple steps — with blockchain at the core.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: 1, icon: <FaFileAlt />, title: 'Upload', desc: 'Drop your document, image, video, URL, or text' },
              { step: 2, icon: <FaCubes />, title: 'Blockchain Check', desc: 'We check if this content was previously scanned' },
              { step: 3, icon: <FaRobot />, title: 'AI Analyzes', desc: 'Multiple models analyze for AI content, plagiarism, or threats' },
              { step: 4, icon: <FaLock />, title: 'Store On-Chain', desc: 'Results are stored on blockchain for tamper-proof verification' },
            ].map((item, idx) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative bg-slate-50 rounded-2xl p-6 text-center border border-slate-100"
              >
                <div className="w-10 h-10 bg-veriscan-purple text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-black">
                  {item.step}
                </div>
                <div className="text-2xl text-slate-400 mb-3 flex justify-center">{item.icon}</div>
                <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES GRID ===== */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-black text-slate-800 mb-3">Why VeriScan?</h2>
            <p className="text-slate-500 max-w-lg mx-auto">Built for accuracy, privacy, and trust.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <FaBolt />, title: 'Lightning Fast', desc: 'Blockchain caching means instant results for previously scanned content', color: 'bg-amber-50 text-amber-500' },
              { icon: <FaLock />, title: 'Privacy First', desc: 'Your documents are never stored. Only verification hashes go on-chain', color: 'bg-emerald-50 text-emerald-500' },
              { icon: <FaChartBar />, title: 'Detailed Reports', desc: 'Sentence-level flagging, source matching, and threat breakdowns', color: 'bg-blue-50 text-blue-500' },
              { icon: <FaCubes />, title: 'Blockchain Verified', desc: 'Tamper-proof certificates that prove when and what was scanned', color: 'bg-purple-50 text-veriscan-purple' },
            ].map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center text-xl mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 text-center relative overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-veriscan-purple/20 rounded-full blur-[80px]" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-veriscan-teal/20 rounded-full blur-[80px]" />

            <div className="relative z-10">
              <h2 className="text-3xl font-black text-white mb-4">Ready to Verify?</h2>
              <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                Start detecting AI-generated content, plagiarism, and cyber threats — all backed by blockchain verification.
              </p>
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-veriscan-purple to-veriscan-teal text-white rounded-xl font-bold text-sm shadow-lg shadow-purple-500/30"
                >
                  Get Started Free →
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
