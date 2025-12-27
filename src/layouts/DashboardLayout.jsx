import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaChartPie, FaSearch, FaHistory, FaCog, FaUserCircle, FaBell } from 'react-icons/fa';

const DashboardLayout = () => {
    const location = useLocation();

    const sidebarLinks = [
        { name: 'Overview', path: '/dashboard', icon: <FaChartPie /> },
        { name: 'Scan', path: '/dashboard/scan', icon: <FaSearch /> },
        { name: 'History', path: '/dashboard/history', icon: <FaHistory /> },
        { name: 'Settings', path: '/dashboard/settings', icon: <FaCog /> },
    ];

    // Helper to get current page title for Breadcrumbs
    const getCurrentPageName = () => {
        const currentLink = sidebarLinks.find(link => link.path === location.pathname);
        return currentLink ? currentLink.name : 'Dashboard';
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* --- SIDEBAR --- */}
            <aside className="w-64 bg-white border-r border-slate-200 fixed inset-y-0 left-0 z-30 flex flex-col">
                <div className="h-20 flex items-center px-8 border-b border-slate-100">
                    <h1 className="text-2xl font-black tracking-tighter text-gray-900">
                        VeriScan
                    </h1>
                </div>

                <nav className="flex-1 py-6 px-4 space-y-2">
                    {sidebarLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            end={link.path === '/dashboard'} // Exact match for root dashboard path if needed, but usually valid
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${isActive
                                    ? 'bg-purple-50 text-veriscan-purple'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                }`
                            }
                        >
                            <span className="text-xl">{link.icon}</span>
                            <span>{link.name}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="w-8 h-8 rounded-full bg-veriscan-purple/10 flex items-center justify-center text-veriscan-purple font-bold text-xs">
                            VS
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-slate-700 truncate">Demo User</p>
                            <p className="text-xs text-slate-500 truncate">Free Plan</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* --- MAIN CONTENT WRAPPER --- */}
            <div className="ml-64 flex-1 flex flex-col min-h-screen">
                {/* --- TOPBAR --- */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20 px-8 flex justify-between items-center">
                    {/* Breadcrumbs */}
                    <div className="flex items-center text-sm text-slate-500">
                        <span className="font-medium text-slate-400">Dashboard</span>
                        <span className="mx-2">/</span>
                        <span className="font-bold text-slate-800">{getCurrentPageName()}</span>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-slate-400 hover:text-veriscan-purple transition-colors relative">
                            <FaBell className="text-lg" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>
                        <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
                        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                            <FaUserCircle className="text-3xl text-slate-300" />
                        </div>
                    </div>
                </header>

                {/* --- PAGE CONTENT --- */}
                <main className="flex-1 p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
