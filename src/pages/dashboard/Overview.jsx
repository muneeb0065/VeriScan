import React from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaRobot, FaFingerprint, FaCoins, FaFileAlt, FaCheck, FaExclamationTriangle, FaChartLine, FaCalendar } from 'react-icons/fa';

const Overview = () => {
    const stats = [
        { title: 'Total Scans', value: '24', icon: <FaSearch />, color: 'bg-gradient-to-br from-blue-500 to-blue-600', change: '+12%' },
        { title: 'AI Flags', value: '8', icon: <FaRobot />, color: 'bg-gradient-to-br from-veriscan-purple to-indigo-600', change: '+8%' },
        { title: 'Plagiarism Flags', value: '3', icon: <FaFingerprint />, color: 'bg-gradient-to-br from-orange-500 to-red-500', change: '-3%' },
        { title: 'Documents Processed', value: '31', icon: <FaFileAlt />, color: 'bg-gradient-to-br from-veriscan-teal to-cyan-500', change: '+24%' },
    ];

    const recentFiles = [
        { name: 'Research_Paper_Final.docx', date: 'Dec 27, 2025', status: 'AI Detected', score: 94, type: 'ai' },
        { name: 'Thesis_Chapter_3.pdf', date: 'Dec 26, 2025', status: 'Clean', score: 12, type: 'clean' },
        { name: 'Essay_Assignment.docx', date: 'Dec 25, 2025', status: 'Plagiarism', score: 67, type: 'plagiarism' },
        { name: 'Lab_Report_v2.pdf', date: 'Dec 24, 2025', status: 'Clean', score: 8, type: 'clean' },
    ];

    const getStatusBadge = (type) => {
        switch (type) {
            case 'clean':
                return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 border border-green-100 text-xs font-bold rounded-full"><FaCheck /> Clean</span>;
            case 'ai':
                return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-veriscan-purple border border-purple-100 text-xs font-bold rounded-full"><FaRobot /> AI Detected</span>;
            case 'plagiarism':
                return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-600 border border-orange-100 text-xs font-bold rounded-full"><FaExclamationTriangle /> Plagiarism</span>;
            default:
                return <span className="text-slate-500 text-xs">-</span>;
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard</h2>
                    <p className="text-slate-500 mt-1">Welcome back! Here's your activity summary.</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-4 py-2 rounded-xl border border-slate-200">
                    <FaCalendar className="text-veriscan-purple" />
                    <span>Last 30 days</span>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {stats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        whileHover={{ y: -4, scale: 1.02 }}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-110 transition-transform ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                                {stat.change}
                            </span>
                        </div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{stat.title}</p>
                        <p className="text-3xl font-black text-slate-800">{stat.value}</p>
                    </motion.div>
                ))}
            </motion.div>

            {/* Charts & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Weekly Activity Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100"
                >
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="font-bold text-slate-800 text-lg">Scan Activity</h3>
                            <p className="text-slate-400 text-sm">Documents analyzed over time</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-xs">
                                <div className="w-3 h-3 rounded-full bg-veriscan-purple"></div>
                                <span className="text-slate-500">AI Scans</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                <span className="text-slate-500">Plagiarism</span>
                            </div>
                        </div>
                    </div>

                    {/* Visual Bar Chart */}
                    <div className="h-64 w-full relative flex items-end justify-around px-2">
                        {/* Y-axis labels */}
                        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-slate-400 -ml-2">
                            <span>100</span>
                            <span>75</span>
                            <span>50</span>
                            <span>25</span>
                            <span>0</span>
                        </div>

                        {/* Bars */}
                        {[
                            { day: 'Mon', ai: 45, plag: 20 },
                            { day: 'Tue', ai: 72, plag: 35 },
                            { day: 'Wed', ai: 38, plag: 15 },
                            { day: 'Thu', ai: 65, plag: 28 },
                            { day: 'Fri', ai: 92, plag: 45 },
                            { day: 'Sat', ai: 55, plag: 22 },
                            { day: 'Sun', ai: 80, plag: 38 },
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center gap-1" style={{ width: '10%' }}>
                                <div className="flex gap-1 items-end h-52">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${item.ai}%` }}
                                        transition={{ duration: 0.6, delay: i * 0.1 }}
                                        className="w-5 bg-gradient-to-t from-veriscan-purple to-indigo-400 rounded-t-lg cursor-pointer hover:from-indigo-600 hover:to-purple-400 transition-colors"
                                        title={`AI: ${item.ai}`}
                                    />
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${item.plag}%` }}
                                        transition={{ duration: 0.6, delay: i * 0.1 + 0.05 }}
                                        className="w-5 bg-gradient-to-t from-orange-500 to-yellow-400 rounded-t-lg cursor-pointer hover:from-red-500 hover:to-orange-400 transition-colors"
                                        title={`Plagiarism: ${item.plag}`}
                                    />
                                </div>
                                <span className="text-xs text-slate-400 font-medium">{item.day}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Quick Stats Card */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-3xl shadow-xl text-white flex flex-col relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-veriscan-purple/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-veriscan-teal/20 rounded-full blur-2xl"></div>

                    <div className="relative z-10 flex-1">
                        <div className="flex items-center gap-3 mb-6">
                            <FaChartLine className="text-veriscan-teal text-xl" />
                            <h3 className="font-bold">Quick Stats</h3>
                        </div>

                        <div className="space-y-5">
                            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/5">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-white/70">AI Detection Rate</span>
                                    <span className="font-bold text-veriscan-teal">26.6%</span>
                                </div>
                                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                    <div className="bg-gradient-to-r from-veriscan-purple to-veriscan-teal h-full rounded-full" style={{ width: '26.6%' }}></div>
                                </div>
                            </div>

                            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/5">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-white/70">Plagiarism Rate</span>
                                    <span className="font-bold text-orange-400">3.6%</span>
                                </div>
                                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                    <div className="bg-gradient-to-r from-orange-500 to-red-500 h-full rounded-full" style={{ width: '3.6%' }}></div>
                                </div>
                            </div>

                            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/5">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-white/70">Clean Documents</span>
                                    <span className="font-bold text-green-400">69.8%</span>
                                </div>
                                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                    <div className="bg-gradient-to-r from-green-500 to-emerald-400 h-full rounded-full" style={{ width: '69.8%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Recent Files Table */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
            >
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 text-lg">Recent Scans</h3>
                    <button className="text-sm font-semibold text-veriscan-purple hover:underline">View All →</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Document</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="text-right px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {recentFiles.map((file, idx) => (
                                <motion.tr
                                    key={idx}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 + idx * 0.1 }}
                                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${file.type === 'clean' ? 'bg-green-100 text-green-500' :
                                                file.type === 'ai' ? 'bg-purple-100 text-veriscan-purple' :
                                                    'bg-orange-100 text-orange-500'
                                                }`}>
                                                <FaFileAlt />
                                            </div>
                                            <span className="font-semibold text-slate-800">{file.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{file.date}</td>
                                    <td className="px-6 py-4">{getStatusBadge(file.type)}</td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`text-lg font-black ${file.score > 70 ? 'text-red-500' :
                                            file.score > 30 ? 'text-orange-500' :
                                                'text-green-500'
                                            }`}>
                                            {file.score}%
                                        </span>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};

export default Overview;
