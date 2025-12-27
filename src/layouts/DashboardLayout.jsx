import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChartPie, FaPlus, FaHistory, FaCog, FaUserCircle, FaBell, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';

const DashboardLayout = () => {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const sidebarLinks = [
        { name: 'Overview', path: '/dashboard', icon: <FaChartPie /> },
        { name: 'New Scan', path: '/dashboard/scan', icon: <FaPlus /> },
        { name: 'History', path: '/dashboard/history', icon: <FaHistory /> },
        { name: 'Settings', path: '/dashboard/settings', icon: <FaCog /> },
    ];

    const getCurrentPageName = () => {
        const currentLink = sidebarLinks.find(link => link.path === location.pathname);
        return currentLink ? currentLink.name : 'Dashboard';
    };

    return (
        <div className="min-h-screen bg-slate-100 flex">
            {/* --- SIDEBAR --- */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.aside
                        initial={{ x: -280, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -280, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="w-72 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 fixed inset-y-0 left-0 z-30 flex flex-col"
                    >
                        {/* Logo & Close Button */}
                        <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
                            <Link to="/" className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-veriscan-purple to-veriscan-teal rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                                    <span className="text-white font-black text-lg">V</span>
                                </div>
                                <span className="text-2xl font-black tracking-tight text-white">
                                    VeriScan
                                </span>
                            </Link>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {/* Navigation Links */}
                        <nav className="flex-1 py-8 px-4 space-y-2">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest px-4 mb-4">Menu</p>
                            {sidebarLinks.map((link) => (
                                <NavLink
                                    key={link.name}
                                    to={link.path}
                                    end={link.path === '/dashboard'}
                                    className={({ isActive }) =>
                                        `flex items-center gap-4 px-4 py-3.5 rounded-xl font-semibold transition-all duration-300 group relative overflow-hidden ${isActive
                                            ? 'bg-white/10 text-white'
                                            : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                        }`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            {/* Active Indicator Bar */}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeIndicator"
                                                    className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-veriscan-purple to-veriscan-teal rounded-r-full"
                                                />
                                            )}
                                            <span className={`text-xl transition-all ${isActive ? 'text-veriscan-teal' : 'text-slate-500 group-hover:text-veriscan-teal'}`}>
                                                {link.icon}
                                            </span>
                                            <span className="flex-1">{link.name}</span>
                                            {isActive && (
                                                <div className="w-2 h-2 rounded-full bg-veriscan-teal animate-pulse"></div>
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            ))}
                        </nav>

                        {/* User Info & Logout */}
                        <div className="p-4 border-t border-white/5 space-y-3">
                            {/* User Card */}
                            <div className="flex items-center gap-3 px-4 py-4 rounded-xl bg-white/5 border border-white/5">
                                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-veriscan-purple to-veriscan-teal flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-500/20">
                                    DU
                                </div>
                                <div className="overflow-hidden flex-1">
                                    <p className="text-sm font-bold text-white truncate">Demo User</p>
                                    <p className="text-xs text-slate-400 truncate">Free Account</p>
                                </div>
                            </div>

                            {/* Logout Button */}
                            <Link to="/login" className="block">
                                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 font-semibold transition-all border border-transparent hover:border-red-500/20">
                                    <FaSignOutAlt />
                                    <span>Logout</span>
                                </button>
                            </Link>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* --- MAIN CONTENT WRAPPER --- */}
            <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
                {/* --- TOPBAR --- */}
                <header className="h-20 bg-white border-b border-slate-200 sticky top-0 z-20 px-6 flex justify-between items-center shadow-sm">
                    <div className="flex items-center gap-4">
                        {/* Hamburger Menu */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2.5 text-slate-500 hover:text-veriscan-purple hover:bg-purple-50 rounded-xl transition-colors"
                        >
                            <FaBars className="text-lg" />
                        </motion.button>

                        {/* Breadcrumbs */}
                        <div className="flex items-center text-sm">
                            <span className="font-medium text-slate-400">Dashboard</span>
                            <span className="mx-3 text-slate-300">/</span>
                            <span className="font-bold text-slate-800">{getCurrentPageName()}</span>
                        </div>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            className="p-2.5 text-slate-400 hover:text-veriscan-purple hover:bg-purple-50 rounded-xl transition-colors relative"
                        >
                            <FaBell className="text-lg" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </motion.button>
                        <div className="h-8 w-px bg-slate-200"></div>
                        <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                            <FaUserCircle className="text-3xl text-slate-300" />
                            <div className="hidden md:block">
                                <p className="text-sm font-bold text-slate-800">Demo User</p>
                                <p className="text-xs text-slate-400">view profile</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* --- PAGE CONTENT --- */}
                <main className="flex-1 p-6 lg:p-8">
                    <Outlet />
                </main>

                {/* --- FOOTER --- */}
                <footer className="py-6 px-8 border-t border-slate-200 bg-white">
                    <p className="text-center text-slate-400 text-sm">© 2026 VeriScan Inc. All rights reserved.</p>
                </footer>
            </div>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default DashboardLayout;
