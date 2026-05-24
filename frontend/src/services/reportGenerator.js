/**
 * Universal Report Generator for VeriScan
 * Generates a professional PDF-style HTML print report for any scan type.
 */

export function generateReport({ scanType, results, file, text, url, block }) {
  const timestamp = new Date().toLocaleString();
  const fileName = file?.name || url || (text ? `Text: "${text.slice(0, 40)}..."` : 'Unknown');
  const blockchainHash = block?.hash || block?.documentHash || 'Not recorded';
  const blockchainTime = block?.timestamp ? new Date(block.timestamp).toLocaleString() : 'N/A';

  const verdictColor = (() => {
    const v = (results?.verdict || '').toLowerCase();
    if (v.includes('ai') || v.includes('manipulated') || v.includes('critical') || v.includes('tampered') || v.includes('plagiarism')) return '#dc2626';
    if (v.includes('suspicious') || v.includes('risk')) return '#d97706';
    return '#16a34a';
  })();

  const scanTitles = {
    'deepfake':           'AI Media & Deepfake Detection Report',
    'metadata':           'Metadata Forensics Report',
    'social-engineering': 'Social Engineering / Phishing Analysis Report',
    'url-scan':           'URL Threat Intelligence Report',
    'combined':           'Academic Integrity & AI Detection Report',
  };

  const title = scanTitles[scanType] || 'VeriScan Analysis Report';

  // Build checks HTML
  const checksHTML = (results?.checks || []).map(check => {
    const bg = check.status === 'fail' ? '#fef2f2' : check.status === 'warning' ? '#fffbeb' : '#f0fdf4';
    const border = check.status === 'fail' ? '#fca5a5' : check.status === 'warning' ? '#fcd34d' : '#86efac';
    const icon = check.status === 'fail' ? '✗' : check.status === 'warning' ? '⚠' : '✓';
    const iconColor = check.status === 'fail' ? '#dc2626' : check.status === 'warning' ? '#d97706' : '#16a34a';
    return `
      <div style="background:${bg};border:1px solid ${border};border-radius:8px;padding:12px 16px;margin-bottom:8px;">
        <div style="display:flex;align-items:flex-start;gap:12px;">
          <span style="color:${iconColor};font-weight:bold;font-size:16px;margin-top:1px;">${icon}</span>
          <div style="flex:1;">
            <div style="font-weight:700;font-size:13px;color:#1e293b;margin-bottom:4px;">${check.label}</div>
            <div style="font-size:12px;color:#475569;">${check.value}</div>
          </div>
        </div>
      </div>`;
  }).join('');

  // Extra section for academic results
  let extraHTML = '';
  if (scanType === 'combined' && results) {
    if (results.ai) {
      extraHTML += `
        <div style="page-break-inside:avoid;margin-bottom:24px;">
          <h3 style="font-size:14px;font-weight:700;color:#1e293b;margin-bottom:12px;">AI Detection Breakdown</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
            ${Object.entries(results.ai.details || {}).map(([k,v]) =>
              `<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px;font-size:12px;">
                <span style="color:#64748b;">${k}:</span>
                <span style="font-weight:600;color:#1e293b;margin-left:4px;">${typeof v === 'number' ? (v*100).toFixed(1)+'%' : v}</span>
              </div>`
            ).join('')}
          </div>
        </div>`;
    }
    if (results.plagiarism) {
      extraHTML += `
        <div style="page-break-inside:avoid;margin-bottom:24px;">
          <h3 style="font-size:14px;font-weight:700;color:#1e293b;margin-bottom:12px;">Plagiarism Sources Found</h3>
          ${(results.plagiarism.sources || []).map(s =>
            `<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px;font-size:12px;margin-bottom:6px;">
              <div style="font-weight:600;color:#1e293b;">${s.source || s.title || 'Unknown Source'}</div>
              <div style="color:#64748b;">Similarity: ${s.similarity || s.score || 0}% match</div>
            </div>`
          ).join('')}
        </div>`;
    }
  }

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; color: #1e293b; }
    @media print {
      .no-print { display: none !important; }
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div style="max-width:800px;margin:0 auto;padding:40px 32px;">

    <!-- Header -->
    <div style="display:flex;align-items:center;justify-content:space-between;padding-bottom:20px;border-bottom:2px solid #e2e8f0;margin-bottom:28px;">
      <div>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px;">
          <div style="width:36px;height:36px;background:linear-gradient(135deg,#7c3aed,#0d9488);border-radius:10px;display:flex;align-items:center;justify-content:center;color:white;font-weight:900;font-size:18px;">V</div>
          <span style="font-size:22px;font-weight:900;color:#1e293b;">VeriScan</span>
        </div>
        <p style="font-size:11px;color:#64748b;">Blockchain-Verified Intelligence Platform</p>
      </div>
      <div style="text-align:right;">
        <div style="font-size:11px;color:#64748b;">Generated:</div>
        <div style="font-size:12px;font-weight:600;color:#1e293b;">${timestamp}</div>
      </div>
    </div>

    <!-- Report Title -->
    <h1 style="font-size:20px;font-weight:900;color:#1e293b;margin-bottom:6px;">${title}</h1>
    <p style="font-size:13px;color:#64748b;margin-bottom:24px;">Confidential analysis report — do not distribute without authorization.</p>

    <!-- File Info -->
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin-bottom:24px;">
      <h3 style="font-size:13px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:12px;">Scan Subject</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div>
          <div style="font-size:11px;color:#94a3b8;">File / Input</div>
          <div style="font-size:13px;font-weight:600;color:#1e293b;word-break:break-all;">${fileName}</div>
        </div>
        <div>
          <div style="font-size:11px;color:#94a3b8;">Scan Type</div>
          <div style="font-size:13px;font-weight:600;color:#1e293b;">${title.split(' Report')[0]}</div>
        </div>
      </div>
    </div>

    <!-- Verdict -->
    <div style="background:${verdictColor}10;border:2px solid ${verdictColor}40;border-radius:12px;padding:20px;margin-bottom:24px;">
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <div>
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;color:${verdictColor};letter-spacing:0.1em;margin-bottom:6px;">Final Verdict</div>
          <div style="font-size:28px;font-weight:900;color:${verdictColor};">${results?.verdict || 'Unknown'}</div>
          <div style="font-size:13px;color:#475569;margin-top:6px;">${results?.summary || ''}</div>
        </div>
        <div style="text-align:center;">
          <div style="width:72px;height:72px;border-radius:50%;background:white;border:3px solid ${verdictColor};display:flex;flex-direction:column;align-items:center;justify-content:center;">
            <div style="font-size:22px;font-weight:900;color:${verdictColor};">${results?.score ?? 0}%</div>
          </div>
          <div style="font-size:10px;color:#64748b;margin-top:4px;">Risk Score</div>
        </div>
      </div>
    </div>

    <!-- Checks -->
    <div style="margin-bottom:24px;">
      <h3 style="font-size:14px;font-weight:700;color:#1e293b;margin-bottom:12px;">Detailed Analysis Checks</h3>
      ${checksHTML || '<p style="color:#64748b;font-size:13px;">No detailed checks available.</p>'}
    </div>

    ${extraHTML}

    <!-- Blockchain -->
    <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:12px;padding:16px;margin-bottom:32px;">
      <h3 style="font-size:13px;font-weight:700;color:#16a34a;margin-bottom:10px;">⛓ Blockchain Verification</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px;">
        <div><span style="color:#64748b;">Hash:</span><br/><span style="font-family:monospace;font-size:10px;word-break:break-all;color:#1e293b;">${blockchainHash}</span></div>
        <div><span style="color:#64748b;">Timestamp:</span><br/><span style="color:#1e293b;">${blockchainTime}</span></div>
      </div>
    </div>

    <!-- Footer -->
    <div style="border-top:1px solid #e2e8f0;padding-top:16px;text-align:center;">
      <p style="font-size:11px;color:#94a3b8;">This report was generated by VeriScan — a blockchain-integrated AI verification platform.</p>
      <p style="font-size:11px;color:#94a3b8;">Results are based on automated analysis and should be reviewed by a qualified professional.</p>
    </div>

    <!-- Print Button (hidden in print) -->
    <div class="no-print" style="position:fixed;bottom:24px;right:24px;">
      <button onclick="window.print()" style="background:linear-gradient(135deg,#7c3aed,#0d9488);color:white;border:none;border-radius:12px;padding:12px 24px;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,0.2);">
        🖨 Print / Save as PDF
      </button>
    </div>

  </div>
</body>
</html>`;

  // Open in new window and trigger print
  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
  win.focus();
}
