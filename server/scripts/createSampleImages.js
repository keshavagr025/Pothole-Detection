/**
 * Generates sample road and pothole imagery for uploads folder
 */
const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

function createRoadSvg(title, severityColor, hasPothole = true, isResolved = false) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#475569" />
        <stop offset="60%" stop-color="#94a3b8" />
        <stop offset="100%" stop-color="#cbd5e1" />
      </linearGradient>
      <linearGradient id="road" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#334155" />
        <stop offset="100%" stop-color="#1e293b" />
      </linearGradient>
      <radialGradient id="potholeDepth" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#090d16" />
        <stop offset="70%" stop-color="#1e293b" />
        <stop offset="100%" stop-color="#334155" />
      </radialGradient>
      <linearGradient id="repairedPatch" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#111827" />
        <stop offset="100%" stop-color="#1f2937" />
      </linearGradient>
    </defs>

    <!-- Sky & Horizon -->
    <rect width="800" height="200" fill="url(#sky)" />
    
    <!-- Tree Line & Barriers -->
    <rect y="180" width="800" height="20" fill="#15803d" opacity="0.8" />
    <polygon points="0,200 800,200 800,210 0,210" fill="#64748b" />

    <!-- Road Surface (Perspective) -->
    <polygon points="280,200 520,200 800,500 0,500" fill="url(#road)" />

    <!-- Left & Right Road Edges -->
    <line x1="280" y1="200" x2="0" y2="500" stroke="#facc15" stroke-width="6" />
    <line x1="520" y1="200" x2="800" y2="500" stroke="#ffffff" stroke-width="6" />

    <!-- Center Lane Markings (Dashed Perspective) -->
    <polygon points="398,210 402,210 403,240 397,240" fill="#f8fafc" opacity="0.9" />
    <polygon points="396,260 404,260 406,305 394,305" fill="#f8fafc" opacity="0.9" />
    <polygon points="393,330 407,330 411,390 389,390" fill="#f8fafc" opacity="0.9" />
    <polygon points="387,420 413,420 419,495 381,495" fill="#f8fafc" opacity="0.9" />

    ${hasPothole && !isResolved ? `
      <!-- Pothole Crater -->
      <ellipse cx="440" cy="370" rx="90" ry="42" fill="url(#potholeDepth)" stroke="#0f172a" stroke-width="4" />
      <path d="M 370,360 Q 420,340 490,355 Q 520,380 470,395 Q 400,400 370,360 Z" fill="#020617" opacity="0.7" />
      <!-- Cracks / Asphalt fissures -->
      <path d="M 360,370 L 330,380 M 345,360 L 320,350 M 510,380 L 545,395 M 480,405 L 500,430" stroke="#0f172a" stroke-width="2.5" />
    ` : ''}

    ${isResolved ? `
      <!-- Fresh Asphalt Patch -->
      <polygon points="360,340 520,340 500,400 340,400" fill="url(#repairedPatch)" stroke="#374151" stroke-width="3" />
      <rect x="375" y="360" width="110" height="20" rx="3" fill="#10b981" opacity="0.8" />
      <text x="430" y="374" fill="#ffffff" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">REPAIRED &amp; SEALED</text>
    ` : ''}

    <!-- HUD / Dashcam Overlay Bar -->
    <rect x="20" y="20" width="340" height="42" rx="6" fill="rgba(15, 23, 42, 0.85)" />
    <text x="32" y="44" fill="#f8fafc" font-family="monospace" font-size="13" font-weight="bold">
      CAM-01 • ${title}
    </text>

    <!-- Speed & Timestamp -->
    <rect x="620" y="20" width="160" height="42" rx="6" fill="rgba(15, 23, 42, 0.85)" />
    <text x="700" y="44" fill="#38bdf8" font-family="monospace" font-size="12" text-anchor="middle">
      GPS LOCK: ACTIVE
    </text>
  </svg>`;
}

function createAnnotatedRoadSvg(title, severity, severityColor, hazardScore, count = 1) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
    <!-- Base Road Image Included -->
    ${createRoadSvg(title, severityColor, true, false)}

    <!-- AI Bounding Box Overlay -->
    <rect x="340" y="325" width="200" height="95"
          fill="rgba(239, 68, 68, 0.15)" stroke="${severityColor}" stroke-width="3.5" rx="5" />
    
    <!-- Model Tag -->
    <rect x="340" y="298" width="170" height="26" fill="${severityColor}" rx="4" />
    <text x="348" y="316" fill="#ffffff" font-family="sans-serif" font-size="12" font-weight="bold">
      POTHOLE #1 (96% CONF)
    </text>

    <!-- AI Hazard Banner -->
    <rect x="20" y="435" width="460" height="45" rx="8" fill="rgba(15, 23, 42, 0.92)" stroke="${severityColor}" stroke-width="2" />
    <circle cx="45" cy="457" r="10" fill="${severityColor}" />
    <text x="68" y="455" fill="#f8fafc" font-family="sans-serif" font-size="13" font-weight="bold">
      AI ASSESSMENT: ${severity.toUpperCase()} SEVERITY
    </text>
    <text x="68" y="471" fill="#94a3b8" font-family="sans-serif" font-size="11">
      Hazard Score: ${hazardScore}/100 • Lane Coverage: 8.4% • Instant Alert Generated
    </text>
  </svg>`;
}

// Write sample files
const samples = [
  { key: 'nh48', title: 'NH-48 Corridor', severity: 'Critical', color: '#ef4444', score: 94 },
  { key: 'ringroad', title: 'Ring Road AIIMS', severity: 'High', color: '#f97316', score: 78 },
  { key: 'saket', title: 'Saket Press Enclave', severity: 'Medium', color: '#eab308', score: 48 },
  { key: 'cp', title: 'Connaught Place Barakhamba', severity: 'High', color: '#f97316', score: 68 },
  { key: 'mallroad', title: 'Mall Road Civil Lines', severity: 'Low', color: '#10b981', score: 28 }
];

samples.forEach(s => {
  const origPath = path.join(uploadsDir, `sample-${s.key}.jpg`);
  const annoPath = path.join(uploadsDir, `annotated-sample-${s.key}.jpg`);
  
  fs.writeFileSync(origPath, createRoadSvg(s.title, s.color, true, false));
  fs.writeFileSync(annoPath, createAnnotatedRoadSvg(s.title, s.severity, s.color, s.score));
});

// Write resolved proof for CP
fs.writeFileSync(
  path.join(uploadsDir, 'sample-cp-resolved.jpg'),
  createRoadSvg('Connaught Place Barakhamba (RESOLVED)', '#10b981', false, true)
);

console.log('[Script] Sample road imagery generated successfully in uploads/');
