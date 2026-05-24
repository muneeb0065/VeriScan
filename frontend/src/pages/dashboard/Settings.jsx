/* ============================================
 * Settings.jsx — User Account Settings Page
 * 
 * Three sections:
 *   1. Profile — Name, email, organization (pre-filled with demo data)
 *   2. Notifications — Toggle switches for email alerts, scan alerts, weekly digest
 *   3. Security — Two-factor auth toggle, change password, delete account
 * 
 * NOTE: Nothing actually saves to a server. This is frontend-only.
 *       The "Save Changes" shows a success toast, "Change Password" 
 *       shows a fake email message, "Delete Account" shows a confirm dialog.
 * ============================================ */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaUser, FaBell, FaShieldAlt, FaToggleOn, FaToggleOff,
  FaSave, FaEnvelope, FaBuilding, FaKey, FaTrash, FaCheckCircle
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
    const { currentUser, resetPassword } = useAuth();
    
    // Derived user details
    const userEmail = currentUser?.email || 'demo@veriscan.io';
    const userName = userEmail.split('@')[0];
    const displayName = userName.charAt(0).toUpperCase() + userName.slice(1);

    // Toggle states for notification preferences
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [scanAlerts, setScanAlerts] = useState(true);
    const [weeklyDigest, setWeeklyDigest] = useState(false);
    const [twoFactorAuth, setTwoFactorAuth] = useState(false);

    // Feedback messages
    const [saveMsg, setSaveMsg] = useState('');
    const [pwMsg, setPwMsg] = useState({ text: '', isError: false });

    // "Save Changes" — shows success toast for 3 seconds
    const handleSave = () => {
        setSaveMsg('Profile saved successfully!');
        setTimeout(() => setSaveMsg(''), 3000);
    };

    // "Change Password" — triggers Firebase password reset
    const handleChangePassword = async () => {
        if (!userEmail || userEmail === 'demo@veriscan.io') {
            setPwMsg({ text: 'Cannot reset password for demo user.', isError: true });
            setTimeout(() => setPwMsg({ text: '', isError: false }), 4000);
            return;
        }

        try {
            await resetPassword(userEmail);
            setPwMsg({ text: 'Password reset link sent to your email!', isError: false });
        } catch (error) {
            console.error('Password reset failed', error);
            setPwMsg({ text: 'Failed to send reset link. Please try again.', isError: true });
        }
        setTimeout(() => setPwMsg({ text: '', isError: false }), 4000);
    };

    // "Delete Account" — shows confirmation dialog
    const handleDeleteAccount = () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            alert('Account deletion request submitted. You will receive a confirmation email.');
        }
    };

    return (
        <div className="space-y-8 max-w-4xl">
            {/* Page Header */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Settings</h2>
                <p className="text-slate-500 mt-1">Manage your account preferences and security.</p>
            </motion.div>

            {/* Success Toast — appears after saving */}
            {saveMsg && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-sm font-semibold text-emerald-700"
                >
                    <FaCheckCircle /> {saveMsg}
                </motion.div>
            )}

            {/* ===== SECTION 1: Profile Information ===== */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
            >
                {/* Section header with icon */}
                <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
                    <div className="w-10 h-10 bg-veriscan-purple/10 rounded-xl flex items-center justify-center">
                        <FaUser className="text-veriscan-purple" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">Profile Information</h3>
                        <p className="text-xs text-slate-500">Update your personal details</p>
                    </div>
                </div>

                {/* Form fields */}
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                <FaUser className="text-slate-400" /> Full Name
                            </label>
                            <input
                                type="text"
                                defaultValue={displayName}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-veriscan-purple/50 focus:border-veriscan-purple transition-all"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                <FaEnvelope className="text-slate-400" /> Email Address
                            </label>
                            <input
                                type="email"
                                defaultValue={userEmail}
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
                    {/* Save button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSave}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-veriscan-purple text-white font-bold rounded-xl hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/20"
                    >
                        <FaSave /> Save Changes
                    </motion.button>
                </div>
            </motion.div>

            {/* ===== SECTION 2: Notification Preferences ===== */}
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

            {/* ===== SECTION 3: Security ===== */}
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

                    {/* Password reset feedback */}
                    {pwMsg.text && (
                        <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex items-center gap-2 p-3 border rounded-xl text-xs font-semibold ${
                                pwMsg.isError 
                                    ? 'bg-red-50 border-red-200 text-red-700' 
                                    : 'bg-blue-50 border-blue-200 text-blue-700'
                            }`}
                        >
                            <FaCheckCircle className={pwMsg.isError ? 'hidden' : 'block'} />
                            {pwMsg.text}
                        </motion.div>
                    )}

                    {/* Action buttons */}
                    <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-3">
                        <button
                            onClick={handleChangePassword}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                        >
                            <FaKey /> Change Password
                        </button>
                        <button
                            onClick={handleDeleteAccount}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-500 font-semibold rounded-xl hover:bg-red-100 transition-colors"
                        >
                            <FaTrash /> Delete Account
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* ===== ABOUT CARD — Dark gradient card with version info ===== */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white relative overflow-hidden"
            >
                {/* Decorative purple glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-veriscan-purple/20 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                    <h3 className="font-black text-2xl mb-2">VeriScan</h3>
                    <p className="text-slate-400 mb-4">Version 1.0.0 • Free Edition</p>
                    <p className="text-sm text-slate-300 leading-relaxed max-w-lg">
                        A dual-mode platform combining AI detection, plagiarism checking, and cybersecurity forensics — all blockchain-verified.
                        Built as a Final Year Project.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

/* ============================================
 * SettingToggle — Reusable ON/OFF Toggle Row
 * 
 * Used for notification and security settings.
 * Clicking anywhere on the row flips the toggle.
 * The purple highlight appears when the toggle is ON.
 * ============================================ */
const SettingToggle = ({ label, description, value, onChange }) => (
    <div
        onClick={() => onChange(!value)}
        className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border ${
            value ? 'bg-veriscan-purple/5 border-veriscan-purple/20' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'
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
