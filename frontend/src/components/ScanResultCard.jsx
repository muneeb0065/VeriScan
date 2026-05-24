/* ============================================
 * ScanResultCard.jsx — Reusable Scan Result Display
 * 
 * Used by ALL scan types (Academic & Security) to show:
 *   - Score percentage with animated progress bar
 *   - Verdict badge (Detected / Warning / Clean)
 *   - Breakdown items with mini progress bars
 *   - Blockchain verification badge
 * 
 * Props:
 *   title       — Card heading (e.g., "AI Detection" or "Deepfake Analysis")
 *   score       — Number 0-100
 *   verdict     — Text like "AI Detected", "Original", "Manipulated"
 *   confidence  — "High", "Medium", "Low"
 *   icon        — React icon component
 *   color       — Theme: "purple" | "orange" | "teal" | "red" | "green"
 *   breakdown   — Array of { label, score } items
 *   blockchainBlock — Blockchain block data (optional)
 *   children    — Extra content below the score
 * ============================================ */

import React from 'react';
import { motion } from 'framer-motion';
import BlockchainBadge from './BlockchainBadge';

const ScanResultCard = ({ title, score, verdict, confidence, icon, color, breakdown, blockchainBlock, children }) => {

  // Score text color — red for high risk, green for low risk
  const getScoreColor = (val) => {
    if (val > 70) return 'text-red-500';
    if (val > 40) return 'text-orange-500';
    return 'text-emerald-500';
  };

  // Progress bar gradient — matches the card's color theme
  const gradients = {
    purple: 'from-purple-600 to-indigo-500',
    orange: 'from-orange-500 to-red-500',
    teal: 'from-teal-600 to-cyan-500',
    red: 'from-red-500 to-rose-600',
    green: 'from-emerald-500 to-green-500',
  };
  const barGradient = gradients[color] || gradients.purple;

  // Icon background color mapping
  const iconBgMap = {
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-500',
    teal: 'bg-teal-100 text-teal-600',
    red: 'bg-red-100 text-red-500',
    green: 'bg-emerald-100 text-emerald-600',
  };
  const iconStyle = iconBgMap[color] || iconBgMap.purple;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
    >
      {/* Header — Icon + Title + Verdict Badge */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon && (
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconStyle}`}>
                {icon}
              </div>
            )}
            <div>
              <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
              {confidence && <p className="text-xs text-slate-400">Confidence: {confidence}</p>}
            </div>
          </div>
          {/* Verdict badge — colored based on severity */}
          {verdict && (
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
              verdict.includes('Detected') || verdict.includes('Found') || verdict.includes('Manipulated') || verdict.includes('Critical') || verdict.includes('Malicious')
                ? 'bg-red-50 text-red-600 border border-red-200'
                : verdict.includes('Warning') || verdict.includes('Mixed') || verdict.includes('Suspicious') || verdict.includes('Some')
                ? 'bg-amber-50 text-amber-600 border border-amber-200'
                : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
            }`}>
              {verdict}
            </span>
          )}
        </div>
      </div>

      {/* Score — Big number + animated progress bar */}
      {score !== undefined && (
        <div className="px-6 py-5">
          <div className="flex items-end justify-between mb-3">
            <span className={`text-4xl font-black ${getScoreColor(score)}`}>
              {score}<span className="text-xl">%</span>
            </span>
          </div>
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(score, 100)}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className={`h-full rounded-full bg-gradient-to-r ${barGradient}`}
            />
          </div>
        </div>
      )}

      {/* Breakdown items — mini progress bars for each check */}
      {breakdown && breakdown.length > 0 && (
        <div className="px-6 pb-4 space-y-2.5">
          {breakdown.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <span className="text-slate-500">{item.label}</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${barGradient}`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-600 w-10 text-right">{item.score}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Custom children content (e.g., extra description text) */}
      {children && <div className="px-6 pb-4">{children}</div>}

      {/* Blockchain Badge — shows hash + block number */}
      {blockchainBlock && (
        <div className="px-6 pb-5 pt-2 border-t border-slate-100">
          <BlockchainBadge block={blockchainBlock} />
        </div>
      )}
    </motion.div>
  );
};

export default ScanResultCard;
