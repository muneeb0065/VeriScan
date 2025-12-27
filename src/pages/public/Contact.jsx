import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaCheck, FaUser, FaComment } from 'react-icons/fa';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate form submission
        console.log('Form submitted:', formData);
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setFormData({ name: '', email: '', message: '' });
        }, 3000);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-veriscan-teal/10 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-veriscan-purple/10 rounded-full blur-[100px]"></div>
                </div>

                <div className="max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-veriscan-teal/10 text-veriscan-teal text-sm font-bold mb-6">
                            <FaEnvelope /> Contact Us
                        </div>
                        <h1 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6">
                            Get in <span className="text-veriscan-teal">Touch</span>
                        </h1>
                        <p className="text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto">
                            Have questions, feedback, or need support? We'd love to hear from you.
                            Send us a message and we'll respond as soon as possible.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Form & Info */}
            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16">
                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                                <div className="p-8 bg-gradient-to-r from-veriscan-purple to-indigo-600">
                                    <h2 className="text-2xl font-bold text-white mb-2">Send us a Message</h2>
                                    <p className="text-white/80">Fill out the form below and we'll get back to you.</p>
                                </div>

                                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                    {/* Name Field */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-bold text-slate-600 mb-2">
                                            <FaUser className="text-slate-400" /> Your Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            required
                                            className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-veriscan-purple/50 focus:border-veriscan-purple transition-all"
                                        />
                                    </div>

                                    {/* Email Field */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-bold text-slate-600 mb-2">
                                            <FaEnvelope className="text-slate-400" /> Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="you@example.com"
                                            required
                                            className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-veriscan-purple/50 focus:border-veriscan-purple transition-all"
                                        />
                                    </div>

                                    {/* Message Field */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-bold text-slate-600 mb-2">
                                            <FaComment className="text-slate-400" /> Your Message
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="How can we help you?"
                                            required
                                            rows={5}
                                            className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-veriscan-purple/50 focus:border-veriscan-purple transition-all resize-none"
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={submitted}
                                        className={`w-full py-4 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 ${submitted
                                                ? 'bg-green-500 text-white'
                                                : 'bg-gradient-to-r from-veriscan-purple to-indigo-600 text-white hover:shadow-xl hover:shadow-purple-500/20'
                                            }`}
                                    >
                                        {submitted ? (
                                            <>
                                                <FaCheck /> Message Sent Successfully!
                                            </>
                                        ) : (
                                            <>
                                                <FaPaperPlane /> Send Message
                                            </>
                                        )}
                                    </motion.button>
                                </form>
                            </div>
                        </motion.div>

                        {/* Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 mb-4">Contact Information</h2>
                                <p className="text-slate-500 text-lg leading-relaxed">
                                    Reach out to us through any of the following channels.
                                    We typically respond within 24-48 hours.
                                </p>
                            </div>

                            {/* Contact Cards */}
                            <div className="space-y-4">
                                <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-colors">
                                    <div className="w-12 h-12 bg-veriscan-purple/10 rounded-xl flex items-center justify-center text-veriscan-purple flex-shrink-0">
                                        <FaEnvelope className="text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 mb-1">Email Us</h3>
                                        <p className="text-slate-500">contact@veriscan.io</p>
                                        <p className="text-slate-500">support@veriscan.io</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-colors">
                                    <div className="w-12 h-12 bg-veriscan-teal/10 rounded-xl flex items-center justify-center text-veriscan-teal flex-shrink-0">
                                        <FaMapMarkerAlt className="text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 mb-1">Location</h3>
                                        <p className="text-slate-500">University Campus</p>
                                        <p className="text-slate-500">Department of Computer Science</p>
                                    </div>
                                </div>
                            </div>

                            {/* FAQ Teaser */}
                            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white">
                                <h3 className="text-xl font-bold mb-3">Frequently Asked Questions</h3>
                                <p className="text-slate-300 mb-6">
                                    Before reaching out, you might find your answer in our FAQ section.
                                </p>
                                <div className="space-y-3">
                                    <div className="p-4 bg-white/10 rounded-xl border border-white/10">
                                        <p className="font-semibold text-sm">Is VeriScan really free?</p>
                                        <p className="text-sm text-slate-400 mt-1">Yes! VeriScan is completely free for all users.</p>
                                    </div>
                                    <div className="p-4 bg-white/10 rounded-xl border border-white/10">
                                        <p className="font-semibold text-sm">What file formats are supported?</p>
                                        <p className="text-sm text-slate-400 mt-1">PDF, DOCX, TXT, and image files (JPG, PNG).</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
