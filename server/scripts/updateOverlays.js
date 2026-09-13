const fs = require('fs');
const path = require('path');
const uploadsDir = path.join(__dirname, '../uploads');

function makeSvgOverlay(boxes, severity, hazardScore) {
  const boxTags = boxes.map((b, i) => {
    return [
      '<g>',
      `  <rect x="${b.x}%" y="${b.y}%" width="${b.w}%" height="${b.h}%"`,
      '        fill="rgba(239, 68, 68, 0.20)" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="6 3" rx="4" />',
      `  <rect x="${b.x}%" y="calc(${b.y}% - 22px)" width="130" height="20" fill="#ef4444" rx="3" />`,
      `  <text x="calc(${b.x}% + 6px)" y="calc(${b.y}% - 8px)" fill="#ffffff" font-family="sans-serif" font-size="11" font-weight="bold">`,
      `    POTHOLE #${i + 1} ${b.conf}%`,
      '  </text>',
      '</g>'
    ].join('\n');
  }).join('\n');

  return [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 750" width="100%" height="100%">',
    boxTags,
    '  <rect x="16" y="16" width="260" height="34" rx="6" fill="rgba(15, 23, 42, 0.88)" stroke="#ef4444" stroke-width="1.5" />',
    '  <text x="26" y="38" fill="#f8fafc" font-family="sans-serif" font-size="12" font-weight="bold">',
    `    AI SEVERITY: ${severity.toUpperCase()} (${hazardScore}/100)`,
    '  </text>',
    '</svg>'
  ].join('\n');
}

const overlays = {
  'annotated-sample-nh48.jpg.svg': makeSvgOverlay([{ x: 30, y: 55, w: 42, h: 32, conf: 94 }], 'Critical', 88),
  'annotated-sample-ringroad.jpg.svg': makeSvgOverlay([{ x: 28, y: 52, w: 44, h: 34, conf: 95 }], 'Critical', 91),
  'annotated-sample-saket.jpg.svg': makeSvgOverlay([{ x: 26, y: 54, w: 48, h: 35, conf: 92 }], 'High', 84),
  'annotated-sample-cp.jpg.svg': makeSvgOverlay([{ x: 22, y: 56, w: 46, h: 36, conf: 96 }], 'Critical', 92),
  'annotated-sample-mallroad.jpg.svg': makeSvgOverlay([{ x: 25, y: 58, w: 40, h: 30, conf: 88 }], 'Medium', 52)
};

Object.entries(overlays).forEach(([fname, svg]) => {
  fs.writeFileSync(path.join(uploadsDir, fname), svg, 'utf8');
  console.log('Created overlay: ' + fname);
});
