import React from 'react';
import { FaLink, FaCopy } from 'react-icons/fa';

// BlockchainBadge — shows "Blockchain Verified" with a truncated transaction hash
const BlockchainBadge = ({ block, size = 'normal' }) => {
  if (!block) return null;

  const truncatedHash = block.blockHash
    ? `${block.blockHash.slice(0, 6)}...${block.blockHash.slice(-4)}`
    : 'N/A';

  const copyHash = () => {
    if (block.blockHash) {
      navigator.clipboard.writeText(block.blockHash);
    }
  };

  if (size === 'small') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold">
        <FaLink className="text-emerald-500" />
        Verified
      </span>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl">
      <FaLink className="text-emerald-600" />
      <div>
        <p className="text-xs font-bold text-emerald-800">Blockchain Verified</p>
        <p className="text-xs text-emerald-600 font-mono">{truncatedHash}</p>
      </div>
      <button
        onClick={copyHash}
        className="p-1.5 hover:bg-emerald-100 rounded-lg transition-colors text-emerald-500"
        title="Copy full hash"
      >
        <FaCopy className="text-xs" />
      </button>
    </div>
  );
};

export default BlockchainBadge;
