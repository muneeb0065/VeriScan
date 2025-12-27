import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaBell, FaShieldAlt, FaToggleOn, FaToggleOff, FaSave, FaEnvelope, FaBuilding, FaKey, FaTrash } from 'react-icons/fa';

const Settings = () => {
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [scanAlerts, setScanAlerts] = useState(true);
    const [weeklyDigest, setWeeklyDigest] = useState(false);
    const [twoFactorAuth, setTwoFactorAuth] = useState(false);

    return (
        <div className="space-y-8 max-w-4xl">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Settings</h2>
                <p className="text-slate-500 mt-1">Manage your account preferences and security.</p>
            </motion.div>

            {/* Profile Settings */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
            >
                <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
                    <div className="w-10 h-10 bg-veriscan-purple/10 rounded-xl flex items-center justify-center">
                        <FaUser className="text-veriscan-purple" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">Profile Information</h3>
                        <p className="text-xs text-slate-500">Update your personal details</p>
                    </div>
                </div>
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                <FaUser className="text-slate-400" /> Full Name
                            </label>
                            <input
                                type="text"
                                defaultValue="Demo User"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-veriscan-purple/50 focus:border-veriscan-purple transition-all"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                <FaEnvelope className="text-slate-400" /> Email Address
                            </label>
                            <input
                                type="email"
                                defaultValue="demo@veriscan.io"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-veriscan-purple/50 focus:border-veriscan-purple transition-all"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            <FaBuilding className="text-slate-400" /> Organization
                        </label>
                        <input
                            type="text"
                            defaultValue="Example University"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-veriscan-purple/50 focus:border-veriscan-purple transition-all"
                        />
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-veriscan-purple text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-purple-500/20"
                    >
                        <FaSave /> Save Changes
                    </motion.button>
                </div>
            </motion.div>

            {/* Notification Settings */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
            >
                <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
                    <div className="w-10 h-10 bg-veriscan-teal/10 rounded-xl flex items-center justify-center">
                        <FaBell className="text-veriscan-teal" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">Notifications</h3>
                        <p className="text-xs text-slate-500">Control how we contact you</p>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <SettingToggle
                        label="Email Notifications"
                        description="Receive scan results via email after each analysis"
                        value={emailNotifications}
                        onChange={setEmailNotifications}
                    />
                    <SettingToggle
                        label="AI & Plagiarism Alerts"
                        description="Get instant alerts when content is flagged"
                        value={scanAlerts}
                        onChange={setScanAlerts}
                    />
                    <SettingToggle
                        label="Weekly Digest"
                        description="Summary of your scan activity every Monday"
                        value={weeklyDigest}
                        onChange={setWeeklyDigest}
                    />
                </div>
            </motion.div>

            {/* Security Settings */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
            >
                <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                        <FaShieldAlt className="text-amber-500" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">Security</h3>
                        <p className="text-xs text-slate-500">Protect your account</p>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <SettingToggle
                        label="Two-Factor Authentication"
                        description="Add an extra layer of security to your account"
                        value={twoFactorAuth}
                        onChange={setTwoFactorAuth}
                    />

                    <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-3">
                        <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition-colors">
                            <FaKey /> Change Password
                        </button>
                        <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-500 font-semibold rounded-xl hover:bg-red-100 transition-colors">
                            <FaTrash /> Delete Account
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* About Card */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-48 h-48 bg-veriscan-purple/20 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                    <h3 className="font-black text-2xl mb-2">VeriScan</h3>
                    <p className="text-slate-400 mb-4">Version 2.0.0 • Free Edition</p>
                    <p className="text-sm text-slate-300 leading-relaxed max-w-lg">
                        The first platform to combine AI detection and plagiarism checking in one tool.
                        Built for educators, trusted by institutions worldwide.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

// Reusable Setting Toggle
const SettingToggle = ({ label, description, value, onChange }) => (
    <div
        onClick={() => onChange(!value)}
        className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border ${value ? 'bg-veriscan-purple/5 border-veriscan-purple/20' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'
            }`}
    >
        <div>
            <p className={`font-semibold ${value ? 'text-slate-800' : 'text-slate-600'}`}>{label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{description}</p>
        </div>
        <div className={`text-3xl ${value ? 'text-veriscan-purple' : 'text-slate-300'}`}>
            {value ? <FaToggleOn /> : <FaToggleOff />}
        </div>
    </div>
);

export default Settings;
