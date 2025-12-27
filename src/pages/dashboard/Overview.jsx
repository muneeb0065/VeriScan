import React from 'react';
import { FaFingerprint, FaRobot, FaSearch, FaCoins } from 'react-icons/fa';

const Overview = () => {
    const stats = [
        { title: 'Total Scans', value: '1,284', icon: <FaSearch />, color: 'bg-blue-500' },
        { title: 'AI Detected', value: '342', icon: <FaRobot />, color: 'bg-red-500' },
        { title: 'Plagiarism Found', value: '12', icon: <FaFingerprint />, color: 'bg-orange-500' },
        { title: 'Credits Left', value: '850', icon: <FaCoins />, color: 'bg-yellow-500' },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-black text-slate-900">Dashboard Overview</h2>
                <p className="text-slate-500 mt-1">Welcome back, here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{stat.title}</p>
                            <p className="text-2xl font-black text-slate-800">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-96">
                {/* Weekly Activity Chart Placeholder */}
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800 text-lg">Weekly Activity</h3>
                        <select className="bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-lg p-2 font-medium focus:outline-none">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    {/* Visual Placeholder */}
                    <div className="flex-1 w-full bg-slate-50 rounded-2xl border border-dashed border-slate-200 relative overflow-hidden flex items-end justify-around px-8 pb-0">
                        {/* Fake Bars */}
                        {[40, 70, 35, 60, 90, 50, 80].map((h, i) => (
                            <div key={i} className="w-8 bg-veriscan-purple/20 rounded-t-lg hover:bg-veriscan-purple/40 transition-colors relative group" style={{ height: `${h}%` }}>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {h} Scans
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Plan Usage Card */}
                <div className="bg-gradient-to-br from-veriscan-purple to-veriscan-teal p-8 rounded-3xl shadow-xl text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>

                    <div>
                        <p className="text-white/80 font-medium mb-1">Current Plan</p>
                        <h3 className="text-3xl font-black mb-6">Professional</h3>

                        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10 mb-6">
                            <div className="flex justify-between text-sm font-bold mb-2">
                                <span>Usage</span>
                                <span>85%</span>
                            </div>
                            <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
                                <div className="bg-white h-full w-[85%] rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    <button className="w-full py-3 bg-white text-veriscan-purple font-bold rounded-xl shadow-lg hover:bg-slate-50 transition-colors">
                        Upgrade Plan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Overview;
