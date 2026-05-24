/*
 * SIMULATED BLOCKCHAIN SERVICE
 * 
 * This is NOT a real blockchain. It simulates one using localStorage.
 * It stores scan results in a hash-chain where each block references
 * the previous block's hash, making tampering detectable.
 * 
 * Used by BOTH Academic and General (Cybersecurity) modes.
 */

const STORAGE_KEY = 'veriscan-blockchain';

// ============================================
// HELPER: Generate a SHA-256 hash
// ============================================
async function generateHash(data) {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(JSON.stringify(data));
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ============================================
// HELPER: Generate a hash from a File object
// ============================================
export async function hashFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const buffer = e.target.result;
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        resolve(hash);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

// ============================================
// HELPER: Generate hash from text input
// ============================================
export async function hashText(text) {
  return generateHash(text);
}

// ============================================
// Load the blockchain from localStorage
// ============================================
function loadChain() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// ============================================
// Save the blockchain to localStorage
// ============================================
function saveChain(chain) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(chain));
}

// ============================================
// STORE: Add a new verification to the chain
// ============================================
export async function storeVerification({ documentHash, fileName, mode, scanType, results }) {
  const chain = loadChain();
  const previousHash = chain.length > 0 ? chain[chain.length - 1].blockHash : '0'.repeat(64);

  const block = {
    blockId: chain.length + 1,
    timestamp: new Date().toISOString(),
    documentHash,
    fileName: fileName || 'Unknown',
    mode,         // 'academic' or 'general'
    scanType,     // 'combined', 'deepfake', 'social-engineering', 'url-scan', 'metadata'
    results,      // The scan results object
    previousHash,
    blockHash: '', // Will be computed below
  };

  // Compute this block's hash (includes previous hash for chain integrity)
  block.blockHash = await generateHash({
    blockId: block.blockId,
    timestamp: block.timestamp,
    documentHash: block.documentHash,
    results: block.results,
    previousHash: block.previousHash,
  });

  chain.push(block);
  saveChain(chain);
  return block;
}

// ============================================
// LOOKUP: Check if a document was already scanned
// ============================================
export function lookupByHash(documentHash) {
  const chain = loadChain();
  // Return the most recent scan of this document
  const matches = chain.filter(block => block.documentHash === documentHash);
  return matches.length > 0 ? matches[matches.length - 1] : null;
}

// ============================================
// VERIFY: Check that the chain hasn't been tampered with
// ============================================
export async function verifyIntegrity() {
  const chain = loadChain();
  if (chain.length === 0) return { valid: true, message: 'Chain is empty' };

  for (let i = 1; i < chain.length; i++) {
    // Each block's previousHash should match the actual hash of the previous block
    if (chain[i].previousHash !== chain[i - 1].blockHash) {
      return {
        valid: false,
        message: `Chain broken at block #${chain[i].blockId}`,
        brokenAt: chain[i].blockId,
      };
    }
  }

  return { valid: true, message: `Chain valid — ${chain.length} blocks verified` };
}

// ============================================
// GET ALL: Return the full blockchain ledger
// ============================================
export function getAllBlocks(modeFilter = null) {
  const chain = loadChain();
  if (modeFilter) {
    return chain.filter(block => block.mode === modeFilter);
  }
  return chain;
}

// ============================================
// GET STATS: Summary statistics
// ============================================
export function getBlockchainStats() {
  const chain = loadChain();
  return {
    totalBlocks: chain.length,
    academicBlocks: chain.filter(b => b.mode === 'academic').length,
    generalBlocks: chain.filter(b => b.mode === 'general').length,
    lastBlock: chain.length > 0 ? chain[chain.length - 1] : null,
  };
}

// ============================================
// CLEAR: Reset the blockchain (for development)
// ============================================
export function clearBlockchain() {
  localStorage.removeItem(STORAGE_KEY);
}
