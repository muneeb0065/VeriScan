import React from 'react';
import { motion } from 'framer-motion';
import {
  FaLightbulb, FaShieldAlt, FaGraduationCap, FaCubes,
  FaHeart, FaLock, FaRocket, FaUsers, FaCode
} from 'react-icons/fa';

const About = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative py-20 bg-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[400px] h-[400px] bg-purple-400/10 rounded-full blur-[120px]" />
          <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-teal-400/10 rounded-full blur-[120px]" />
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="px-3 py-1.5 bg-purple-50 text-veriscan-purple rounded-full text-xs font-bold border border-purple-200 mb-5 inline-block">
              About VeriScan
            </span>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-5">
              Building the Future of{' '}
              <span className="text-veriscan-purple">
                Digital Forensics
              </span>
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              VeriScan combines academic integrity tools with cybersecurity forensics, all backed by blockchain verification — designed to address the growing challenges of AI-generated content and digital threats.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-black text-slate-800 mb-4">Our Mission</h2>
              <p className="text-slate-500 leading-relaxed mb-4">
                In a world where AI can generate essays, create deepfake images, and craft convincing phishing emails, the line between authentic and fabricated content is blurring. VeriScan exists to restore trust in digital content.
              </p>
              <p className="text-slate-500 leading-relaxed mb-6">
                We bring together two powerful capabilities — <strong className="text-slate-700">academic integrity verification</strong> and <strong className="text-slate-700">cybersecurity threat detection</strong> — in a single platform. Every scan result is stored on a tamper-proof blockchain, creating verifiable proof of analysis.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: <FaLightbulb />, title: 'Innovation', desc: 'Multi-model AI analysis', color: 'bg-amber-50 text-amber-500' },
                { icon: <FaShieldAlt />, title: 'Security', desc: 'Cyber threat detection', color: 'bg-orange-50 text-orange-500' },
                { icon: <FaGraduationCap />, title: 'Education', desc: 'Academic integrity', color: 'bg-purple-50 text-veriscan-purple' },
                { icon: <FaCubes />, title: 'Blockchain', desc: 'Tamper-proof verification', color: 'bg-emerald-50 text-emerald-500' },
              ].map((item, idx) => (
                <motion.div
                  key={item.title}
                  whileHover={{ y: -3 }}
                  className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-shadow"
                >
                  <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center mb-3`}>
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm">{item.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Project Info */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-black text-white mb-4">Final Year Project</h2>
            <p className="text-slate-400 leading-relaxed mb-8 max-w-2xl mx-auto">
              VeriScan is developed as a Final Year Project, combining web development, artificial intelligence, cybersecurity, and blockchain technology to create a comprehensive digital forensics platform.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {['React + Vite', 'TailwindCSS', 'Blockchain', 'AI/ML Models', 'Digital Forensics', 'Cybersecurity'].map(tag => (
                <span key={tag} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white font-medium">
                  {tag}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
              {[
                { value: '2', label: 'Modes' },
                { value: '7+', label: 'Analysis Tools' },
                { value: '🔗', label: 'Blockchain Verified' },
                { value: '2025-26', label: 'Academic Year' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                  <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl font-black text-slate-800 text-center mb-10"
          >
            Our Values
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <FaLock />, title: 'Privacy First', desc: 'Documents are never stored. Only verification hashes are recorded on-chain.', color: 'bg-emerald-50 text-emerald-500' },
              { icon: <FaUsers />, title: 'Free for Educators', desc: 'Academic integrity tools should be accessible to every educator.', color: 'bg-blue-50 text-blue-500' },
              { icon: <FaRocket />, title: 'Continuous Innovation', desc: 'Constantly evolving to detect the latest AI models and cyber threats.', color: 'bg-purple-50 text-veriscan-purple' },
            ].map((value, idx) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 ${value.color} rounded-xl flex items-center justify-center text-xl mb-4`}>
                  {value.icon}
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{value.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
