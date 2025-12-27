import React from 'react';
import { FaFileAlt, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const History = () => {
    const historyData = [
        { id: 1, name: 'Research_Paper_vfinal.pdf', date: 'Oct 24, 2025', result: '98% Human', status: 'pass' },
        { id: 2, name: 'Assignment_3_AI_Draft.txt', date: 'Oct 23, 2025', result: '82% AI', status: 'fail' },
        { id: 3, name: 'Cover_Letter.docx', date: 'Oct 22, 2025', result: '100% Human', status: 'pass' },
        { id: 4, name: 'Blog_Post_Gen.md', date: 'Oct 20, 2025', result: '65% AI', status: 'warning' },
        { id: 5, name: 'Thesis_Abstract.pdf', date: 'Oct 19, 2025', result: '99% Human', status: 'pass' },
    ];

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-black text-slate-900">Scan History</h2>
                <p className="text-slate-500 mt-1">Review your past analyses and reports.</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider font-bold">
                            <th className="p-6">Document Name</th>
                            <th className="p-6">Date Scanned</th>
                            <th className="p-6">Result</th>
                            <th className="p-6">Status</th>
                            <th className="p-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {historyData.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-6 font-bold text-slate-800 flex items-center gap-3">
                                    <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                                        <FaFileAlt />
                                    </div>
                                    {item.name}
                                </td>
                                <td className="p-6 text-slate-500 font-medium">{item.date}</td>
                                <td className="p-6 font-bold text-slate-700">{item.result}</td>
                                <td className="p-6">
                                    {item.status === 'pass' && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold border border-green-100">
                                            <FaCheckCircle /> Passed
                                        </span>
                                    )}
                                    {item.status === 'fail' && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold border border-red-100">
                                            <FaExclamationCircle /> Failed
                                        </span>
                                    )}
                                    {item.status === 'warning' && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-bold border border-orange-100">
                                            <FaExclamationCircle /> Warning
                                        </span>
                                    )}
                                </td>
                                <td className="p-6 text-right">
                                    <button className="text-sm font-bold text-veriscan-purple hover:underline">View Report</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default History;
