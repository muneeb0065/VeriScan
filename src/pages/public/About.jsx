import React from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaRocket, FaGraduationCap, FaShieldAlt, FaLightbulb, FaHeart } from 'react-icons/fa';

const About = () => {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-veriscan-purple/10 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-veriscan-teal/10 rounded-full blur-[100px]"></div>
                </div>

                <div className="max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-veriscan-purple/10 text-veriscan-purple text-sm font-bold mb-6">
                            <FaUsers /> About Us
                        </div>
                        <h1 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6">
                            Building the Future of <br />
                            <span className="text-veriscan-purple">Academic Integrity</span>
                        </h1>
                        <p className="text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto">
                            VeriScan is a Final Year Project developed to help educators and institutions
                            maintain academic integrity using cutting-edge AI forensic analysis.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl font-black text-slate-900 mb-6">Our Mission</h2>
                            <p className="text-lg text-slate-500 leading-relaxed mb-6">
                                In an era where AI-generated content is becoming indistinguishable from human writing,
                                we believe educators deserve powerful tools to verify the authenticity of student submissions.
                            </p>
                            <p className="text-lg text-slate-500 leading-relaxed">
                                VeriScan combines <strong className="text-slate-700">AI detection</strong> and
                                <strong className="text-slate-700"> plagiarism checking</strong> into a single,
                                easy-to-use platform — something no other tool offers today.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="grid grid-cols-2 gap-4"
                        >
                            {[
                                { icon: <FaRocket />, title: 'Innovation', desc: 'Cutting-edge AI technology' },
                                { icon: <FaShieldAlt />, title: 'Integrity', desc: 'Upholding academic standards' },
                                { icon: <FaGraduationCap />, title: 'Education', desc: 'Built for educators' },
                                { icon: <FaLightbulb />, title: 'Simplicity', desc: 'Easy to use interface' },
                            ].map((item, idx) => (
                                <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:shadow-lg transition-all group">
                                    <div className="w-12 h-12 bg-veriscan-purple/10 rounded-xl flex items-center justify-center text-veriscan-purple text-xl mb-4 group-hover:scale-110 transition-transform">
                                        {item.icon}
                                    </div>
                                    <h3 className="font-bold text-slate-800 mb-1">{item.title}</h3>
                                    <p className="text-sm text-slate-500">{item.desc}</p>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Project Info */}
            <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="w-20 h-20 bg-gradient-to-br from-veriscan-purple to-veriscan-teal rounded-2xl flex items-center justify-center mx-auto mb-8">
                            <FaGraduationCap className="text-4xl" />
                        </div>
                        <h2 className="text-4xl font-black mb-6">Final Year Project</h2>
                        <p className="text-xl text-slate-300 leading-relaxed mb-8 max-w-2xl mx-auto">
                            VeriScan was developed as a Final Year Project, combining expertise in
                            machine learning, natural language processing, and modern web development
                            to create a comprehensive forensic analysis platform.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <div className="px-6 py-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                                <p className="text-sm text-slate-400">Built With</p>
                                <p className="font-bold">React + Vite</p>
                            </div>
                            <div className="px-6 py-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                                <p className="text-sm text-slate-400">AI Models</p>
                                <p className="font-bold">Multi-Model Analysis</p>
                            </div>
                            <div className="px-6 py-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                                <p className="text-sm text-slate-400">Year</p>
                                <p className="font-bold">2025-2026</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-slate-900 mb-4">Our Values</h2>
                        <p className="text-slate-500 text-lg">The principles that guide everything we build.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <FaShieldAlt />,
                                title: 'Privacy First',
                                desc: 'Your documents are processed securely and deleted immediately after analysis. We never store or share your content.',
                                color: 'from-green-500 to-emerald-600'
                            },
                            {
                                icon: <FaHeart />,
                                title: 'Free for Educators',
                                desc: 'We believe academic integrity tools should be accessible to all. VeriScan is completely free to use.',
                                color: 'from-veriscan-purple to-indigo-600'
                            },
                            {
                                icon: <FaLightbulb />,
                                title: 'Continuous Innovation',
                                desc: 'As AI evolves, so do we. Our detection models are constantly updated to catch the latest AI generators.',
                                color: 'from-orange-500 to-red-500'
                            },
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all text-center"
                            >
                                <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-6`}>
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
