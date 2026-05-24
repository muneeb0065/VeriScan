/*
 * CENTRALIZED SCANNER SERVICE
 * 
 * Coordinates the full scan flow for ALL scan types:
 * 1. Hash the uploaded content
 * 2. Check blockchain cache
 * 3. If cached → return instantly
 * 4. If not cached → simulate scanning → store on blockchain
 * 
 * All scan results are SIMULATED (hardcoded with random variation).
 */

import { hashFile, hashText, lookupByHash, storeVerification } from './blockchain';

// ============================================
// Delay helper (simulates processing time)
// ============================================
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================
// Random number between min and max
// ============================================
function randomBetween(min, max) {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
}

// ============================================
// ACADEMIC: Combined AI + Plagiarism scan
// Now handled by Python Backend
// ============================================
async function fetchAcademicScan(file, token) {
  const formData = new FormData();
  formData.append('file', file);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
    const response = await fetch('http://localhost:8000/api/v1/academic/scan-plagiarism', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error('Backend rejection: Failed to scan document. Check your Firebase Token or File Type.');
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Scan took too long. Please try again or check the backend connection.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  } // This returns the { ai: {...}, plagiarism: {...} } structure
}

// ============================================
// SECURITY: AI Media / Deepfake scan (real backend)
// ============================================
export async function fetchAIMediaScan(file, token) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch('http://localhost:8000/api/v1/security/scan-ai-media', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });
  if (!response.ok) throw new Error('AI media scan failed.');
  const data = await response.json();
  return data.result;
}

// ============================================
// GENERAL: Deepfake scan results (legacy mock — kept for fallback)
// ============================================
function generateDeepfakeResults() {
  const score = randomBetween(10, 96);
  return {
    score,
    verdict: score > 65 ? 'Manipulated' : 'Authentic',
    confidence: score > 65 ? 'High' : score > 40 ? 'Medium' : 'Low',
    breakdown: [
      { label: 'Face Consistency', score: randomBetween(10, 99), status: randomBetween(0, 100) > 50 ? 'pass' : 'fail' },
      { label: 'Lighting Analysis', score: randomBetween(10, 99), status: randomBetween(0, 100) > 50 ? 'pass' : 'fail' },
      { label: 'Compression Artifacts', score: randomBetween(10, 99), status: randomBetween(0, 100) > 60 ? 'pass' : 'fail' },
      { label: 'Metadata Integrity', score: randomBetween(10, 99), status: randomBetween(0, 100) > 50 ? 'pass' : 'fail' },
    ],
  };
}

// ============================================
// GENERAL: Social engineering scan results
// ============================================
function generateSocialEngineeringResults(text) {
  const score = randomBetween(15, 95);
  const tactics = [];

  // Simulate detecting tactics based on text length/content
  if (text && text.length > 20) {
    tactics.push({ type: 'Urgency', phrase: 'act now', explanation: 'Creates pressure to act without thinking', severity: 'high' });
    tactics.push({ type: 'Authority', phrase: 'official notice', explanation: 'Impersonates authority figures or organizations', severity: 'medium' });
  }
  if (text && text.length > 50) {
    tactics.push({ type: 'Emotional Manipulation', phrase: 'your account will be suspended', explanation: 'Uses fear to override rational decision-making', severity: 'high' });
    tactics.push({ type: 'Information Harvesting', phrase: 'verify your password', explanation: 'Attempts to extract sensitive personal data', severity: 'critical' });
  }
  if (text && text.length > 100) {
    tactics.push({ type: 'Suspicious Link', phrase: 'click here to verify', explanation: 'Contains links that may lead to phishing pages', severity: 'critical' });
  }

  return {
    score,
    verdict: score > 70 ? 'Critical' : score > 45 ? 'Warning' : 'Low Risk',
    tactics,
    summary: `Detected ${tactics.length} potential manipulation tactic${tactics.length !== 1 ? 's' : ''}.`,
  };
}

// ============================================
// GENERAL: URL scan results
// Now handled by Python Backend
// ============================================
async function fetchUrlScan(url, token) {
  const response = await fetch('http://localhost:8000/api/v1/security/scan-url', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ url })
  });

  if (!response.ok) {
    throw new Error('Backend rejection: Failed to scan URL.');
  }

  const data = await response.json();
  return data.result;
}

export async function fetchPhishingScan(text, token) {
  const response = await fetch('http://localhost:8000/api/v1/security/scan-phishing', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ text })
  });

  if (!response.ok) {
    throw new Error('Backend rejection: Failed to scan text.');
  }

  const data = await response.json();
  return data.result;
}

export async function fetchMetadataScan(file, token) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('http://localhost:8000/api/v1/security/scan-metadata', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error('Backend rejection: Failed to scan metadata.');
  }

  const data = await response.json();
  return data.result;
}

// ============================================
// MAIN: Run a scan (used by all scan pages)
// ============================================
export async function runScan({ file, text, url, mode, scanType, token, forceScan = false, onCacheHit, onScanStart, onProgress, onComplete }) {
  // Step 1: Hash the content
  let documentHash;
  let fileName = '';

  if (file) {
    documentHash = await hashFile(file);
    fileName = file.name;
  } else if (text) {
    documentHash = await hashText(text);
    fileName = 'Text Input';
  } else if (url) {
    documentHash = await hashText(url);
    fileName = url;
  } else {
    throw new Error('No content provided for scanning');
  }

  // Step 2: Check blockchain cache (skip if forceScan is true)
  if (!forceScan) {
    const cached = lookupByHash(documentHash);
    if (cached) {
      if (onCacheHit) onCacheHit(cached);
      return { ...cached.results, fromCache: true, blockchainBlock: cached };
    }
  }

  // Step 3: Not cached — run the scan
  if (onScanStart) onScanStart();

  // Simulate scanning with progress updates
  const steps = ['Hashing content', 'Querying blockchain', 'Analyzing patterns', 'Cross-referencing', 'Scoring results'];
  for (let i = 0; i < steps.length; i++) {
    if (onProgress) onProgress({ step: i + 1, total: steps.length, label: steps[i] });
    await delay(800);
  }

  // Step 4: Generate results based on scan type
  let results;
  switch (scanType) {
    case 'combined':
      if (!file || !token) throw new Error("File and valid Auth Token are required for Academic Scans.");
      results = await fetchAcademicScan(file, token);
      break;
    case 'deepfake':
      if (file && token) {
        results = await fetchAIMediaScan(file, token);
      } else {
        results = generateDeepfakeResults();
      }
      break;
    case 'social-engineering':
      if (!text || !token) throw new Error("Text and valid Auth Token are required for Phishing Scans.");
      results = await fetchPhishingScan(text, token);
      break;
    case 'url-scan':
      if (!url || !token) throw new Error("URL and valid Auth Token are required for URL Scans.");
      results = await fetchUrlScan(url, token);
      break;
    case 'metadata':
      if (!file || !token) throw new Error("File and valid Auth Token are required for Metadata Scans.");
      results = await fetchMetadataScan(file, token);
      break;
    default:
      if (file && token) {
         results = await fetchAcademicScan(file, token);
      } else {
         throw new Error("Invalid parameters for scan");
      }
  }

  // Step 5: Store on blockchain
  const block = await storeVerification({
    documentHash,
    fileName,
    mode,
    scanType,
    results,
  });

  if (onComplete) onComplete(results, block);
  return { ...results, fromCache: false, blockchainBlock: block };
}
