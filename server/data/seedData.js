/**
 * Pre-configured realistic seed records for Delhi NCR corridor
 * Demonstrates multiple civic authorities (NHAI, PWD, MCD South, MCD North, NDMC),
 * varying severities (Critical, High, Medium, Low) and resolution statuses.
 */

const SEED_POTHOLES = [
  {
    _id: 'seed-pothole-guna-01',
    trackingId: 'POT-2026-473001',
    title: 'Severe Road Hazard - AB Road, Near Cantt Circle, Guna',
    location: {
      type: 'Point',
      coordinates: [77.3117, 24.6480]
    },
    address: {
      displayName: 'AB Road, Near Cantt Circle, Guna, Madhya Pradesh, 473001',
      road: 'Agra-Bombay Road (AB Road)',
      suburb: 'Cantt Area',
      city: 'Guna',
      state: 'Madhya Pradesh',
      postcode: '473001',
      roadType: 'secondary'
    },
    images: {
      originalUrl: '/uploads/sample-ringroad.jpg',
      annotatedUrl: '/uploads/annotated-sample-ringroad.jpg',
      resolutionProofUrl: null
    },
    detections: [
      {
        id: 'det_1',
        label: 'pothole',
        confidence: 0.94,
        bboxNormalized: [0.30, 0.58, 0.62, 0.80],
        bboxPixels: { x: 240, y: 348, width: 256, height: 132 },
        roadAreaPercent: 7.2,
        depthEstimate: 'Severe Asphalt Cavity (~10cm depth)'
      }
    ],
    severity: 'Critical',
    hazardScore: 88,
    severityDetails: 'Hazardous crater near busy commercial junction in Guna. Extreme hazard to 2-wheelers and night traffic.',
    aiModel: 'YOLOv8-Pothole-Segmenter (HuggingFace)',
    assignedAuthority: {
      id: 'GUNA',
      name: 'Guna Municipal Council (Nagar Palika Parishad Guna)',
      department: 'Civil Road Maintenance & Sanitation Wing',
      email: 'cmoguna@mpurban.gov.in',
      helpline: '1800-233-0014 (MP e-NagarPalika 24x7 Helpline)',
      escalationSLA: '48 Hours',
      jurisdictionReason: 'Residential and commercial ward corridor within limits of Nagar Palika Parishad Guna.'
    },
    status: 'Reported',
    statusHistory: [
      {
        status: 'Reported',
        timestamp: new Date(Date.now() - 3 * 3600000),
        updatedBy: 'Citizen Mobile Camera Sentinel',
        notes: 'Citizen snapped road photo with live GPS in Guna. Automated alert generated and queued for Chief Municipal Officer (CMO).'
      }
    ],
    source: 'mobile_camera',
    reportedAt: new Date(Date.now() - 3 * 3600000)
  },
  {
    _id: 'seed-pothole-guna-02',
    trackingId: 'POT-2026-473002',
    title: 'High Speed Arterial Pothole - NH-46 Guna Bypass',
    location: {
      type: 'Point',
      coordinates: [77.3340, 24.6720]
    },
    address: {
      displayName: 'NH-46 Guna Bypass (Gwalior-Bhopal Highway), Guna, Madhya Pradesh',
      road: 'NH-46 Guna Bypass',
      suburb: 'Bypass Corridor',
      city: 'Guna',
      state: 'Madhya Pradesh',
      postcode: '473001',
      roadType: 'motorway'
    },
    images: {
      originalUrl: '/uploads/sample-nh48.jpg',
      annotatedUrl: '/uploads/annotated-sample-nh48.jpg',
      resolutionProofUrl: null
    },
    detections: [
      {
        id: 'det_1',
        label: 'pothole',
        confidence: 0.95,
        bboxNormalized: [0.35, 0.60, 0.65, 0.82],
        bboxPixels: { x: 280, y: 360, width: 240, height: 132 },
        roadAreaPercent: 8.1,
        depthEstimate: 'Deep Highway Pothole (~12cm depth)'
      }
    ],
    severity: 'High',
    hazardScore: 82,
    severityDetails: 'High-speed lane cavity near Guna flyover ramp.',
    aiModel: 'YOLOv8-Pothole-Segmenter (HuggingFace)',
    assignedAuthority: {
      id: 'NHAI',
      name: 'National Highways Authority of India (NHAI)',
      department: 'Project Implementation Unit (PIU Gwalior/Guna)',
      email: 'complaints@nhai.gov.in',
      helpline: '1033',
      escalationSLA: '24 Hours (High Speed Corridor Hazard)',
      jurisdictionReason: 'Classified as National Highway (NH-46) corridor under direct jurisdiction of NHAI.'
    },
    status: 'In Progress',
    statusHistory: [
      {
        status: 'Reported',
        timestamp: new Date(Date.now() - 18 * 3600000),
        updatedBy: 'Automated Vehicle Dashcam',
        notes: 'Logged via dashcam stream on NH-46 Guna Bypass.'
      },
      {
        status: 'In Progress',
        timestamp: new Date(Date.now() - 6 * 3600000),
        updatedBy: 'NHAI Highway Patrol Squad',
        notes: 'Warning markers placed. Cold asphalt patch squad dispatched.'
      }
    ],
    source: 'dashcam',
    reportedAt: new Date(Date.now() - 18 * 3600000)
  },
  {
    _id: 'seed-pothole-001',
    trackingId: 'POT-2026-104921',
    title: 'Critical Crater - NH-48 Delhi-Gurugram Expressway',
    location: {
      type: 'Point',
      coordinates: [77.0864, 28.4982]
    },
    address: {
      displayName: 'Delhi-Gurugram Expressway (NH-48), Near Ambience Mall, Gurugram',
      road: 'Delhi-Gurugram Expressway (NH-48)',
      suburb: 'Udyog Vihar',
      city: 'Gurugram',
      state: 'Haryana',
      postcode: '122002',
      roadType: 'motorway'
    },
    images: {
      originalUrl: '/uploads/sample-nh48.jpg',
      annotatedUrl: '/uploads/annotated-sample-nh48.jpg',
      resolutionProofUrl: null
    },
    detections: [
      {
        id: 'det_1',
        label: 'pothole',
        confidence: 0.96,
        bboxNormalized: [0.32, 0.60, 0.68, 0.84],
        bboxPixels: { x: 256, y: 360, width: 288, height: 144 },
        roadAreaPercent: 9.4,
        depthEstimate: 'Severe Asphalt Cavity (~12cm depth)'
      }
    ],
    severity: 'Critical',
    hazardScore: 94,
    severityDetails: 'Critical hazard on high-speed expressway lane. Extreme rollover / collision risk for high-speed traffic.',
    aiModel: 'YOLOv8-Pothole-Segmenter (HuggingFace)',
    assignedAuthority: {
      id: 'NHAI',
      name: 'National Highways Authority of India',
      department: 'Ministry of Road Transport and Highways',
      email: 'complaints@nhai.gov.in',
      helpline: '1033',
      escalationSLA: '24 Hours (High Speed Corridor Hazard)',
      jurisdictionReason: 'Classified as National Highway (NH-48) arterial expressway.'
    },
    status: 'Reported',
    statusHistory: [
      {
        status: 'Reported',
        timestamp: new Date(Date.now() - 2 * 3600000),
        updatedBy: 'Automated AI Dashcam Mobile Stream',
        notes: 'AI model flagged 9.4% road coverage crater. Dispatched automated alert to NHAI Project Director.'
      }
    ],
    source: 'dashcam',
    reportedAt: new Date(Date.now() - 2 * 3600000)
  },
  {
    _id: 'seed-pothole-002',
    trackingId: 'POT-2026-382901',
    title: 'High Hazard Pothole - Ring Road (Mahatma Gandhi Marg)',
    location: {
      type: 'Point',
      coordinates: [77.2045, 28.5684]
    },
    address: {
      displayName: 'Ring Road near AIIMS Flyover, Kidwai Nagar, New Delhi',
      road: 'Mahatma Gandhi Marg (Ring Road)',
      suburb: 'Kidwai Nagar',
      city: 'New Delhi',
      state: 'Delhi',
      postcode: '110029',
      roadType: 'primary'
    },
    images: {
      originalUrl: '/uploads/sample-ringroad.jpg',
      annotatedUrl: '/uploads/annotated-sample-ringroad.jpg',
      resolutionProofUrl: null
    },
    detections: [
      {
        id: 'det_1',
        label: 'pothole',
        confidence: 0.92,
        bboxNormalized: [0.25, 0.55, 0.52, 0.76],
        bboxPixels: { x: 200, y: 330, width: 216, height: 126 },
        roadAreaPercent: 5.8,
        depthEstimate: 'Heavy Edge Fatigue (~8cm depth)'
      }
    ],
    severity: 'High',
    hazardScore: 78,
    severityDetails: 'Deep pothole adjacent to flyover expansion joint causing sudden vehicle braking on main carriageway.',
    aiModel: 'YOLOv8-Pothole-Segmenter (HuggingFace)',
    assignedAuthority: {
      id: 'PWD',
      name: 'Public Works Department (State/City Arterial)',
      department: 'Delhi PWD Road Maintenance Wing',
      email: 'delhi.pwd.roads@nic.in',
      helpline: '1800-11-0093',
      escalationSLA: '48 Hours (Major Traffic Corridor)',
      jurisdictionReason: 'Classified as primary city arterial corridor (Ring Road > 60 ft width).'
    },
    status: 'In Progress',
    statusHistory: [
      {
        status: 'Reported',
        timestamp: new Date(Date.now() - 28 * 3600000),
        updatedBy: 'Automated AI Dashcam',
        notes: 'AI detection logged and sent to PWD South Division.'
      },
      {
        status: 'Acknowledged',
        timestamp: new Date(Date.now() - 20 * 3600000),
        updatedBy: 'Er. Rajesh Kumar (PWD Assistant Engineer)',
        notes: 'Site inspected. Cold-mix asphalt patching squad scheduled for night shift.'
      },
      {
        status: 'In Progress',
        timestamp: new Date(Date.now() - 6 * 3600000),
        updatedBy: 'PWD South Road Team',
        notes: 'Barricading deployed. Patching work underway.'
      }
    ],
    source: 'dashcam',
    reportedAt: new Date(Date.now() - 28 * 3600000)
  },
  {
    _id: 'seed-pothole-003',
    trackingId: 'POT-2026-491024',
    title: 'Medium Severity Pothole - Press Enclave Road, Saket',
    location: {
      type: 'Point',
      coordinates: [77.2185, 28.5284]
    },
    address: {
      displayName: 'Press Enclave Marg, Opposite Select Citywalk, Saket, New Delhi',
      road: 'Press Enclave Marg',
      suburb: 'Saket',
      city: 'New Delhi',
      state: 'Delhi',
      postcode: '110017',
      roadType: 'secondary'
    },
    images: {
      originalUrl: '/uploads/sample-saket.jpg',
      annotatedUrl: '/uploads/annotated-sample-saket.jpg',
      resolutionProofUrl: null
    },
    detections: [
      {
        id: 'det_1',
        label: 'pothole',
        confidence: 0.88,
        bboxNormalized: [0.40, 0.65, 0.65, 0.82],
        bboxPixels: { x: 320, y: 390, width: 200, height: 102 },
        roadAreaPercent: 3.4,
        depthEstimate: 'Moderate Surface Depression'
      }
    ],
    severity: 'Medium',
    hazardScore: 48,
    severityDetails: 'Surface erosion leading to water accumulation and tire deflection.',
    aiModel: 'YOLOv8-Pothole-Segmenter (HuggingFace)',
    assignedAuthority: {
      id: 'MCD_SOUTH',
      name: 'MCD - South Zone',
      department: 'Municipal Corporation of Delhi, Engineering Dept',
      email: 'ee-maint-south@mcd.gov.in',
      helpline: '155305',
      escalationSLA: '72 Hours (Colony & Inner Streets)',
      jurisdictionReason: 'Colony / sector connecting road within MCD South Zone jurisdiction.'
    },
    status: 'Acknowledged',
    statusHistory: [
      {
        status: 'Reported',
        timestamp: new Date(Date.now() - 14 * 3600000),
        updatedBy: 'Citizen Mobile Camera App',
        notes: 'Pothole detected with GPS stamp.'
      },
      {
        status: 'Acknowledged',
        timestamp: new Date(Date.now() - 8 * 3600000),
        updatedBy: 'MCD Control Room Officer',
        notes: 'Ticket assigned to Saket Ward Junior Engineer.'
      }
    ],
    source: 'mobile_camera',
    reportedAt: new Date(Date.now() - 14 * 3600000)
  },
  {
    _id: 'seed-pothole-004',
    trackingId: 'POT-2026-582019',
    title: 'Resolved Pothole - Barakhamba Road, Connaught Place',
    location: {
      type: 'Point',
      coordinates: [77.2280, 28.6315]
    },
    address: {
      displayName: 'Barakhamba Road, Near Metro Gate 3, Connaught Place, New Delhi',
      road: 'Barakhamba Road',
      suburb: 'Connaught Place',
      city: 'New Delhi',
      state: 'Delhi',
      postcode: '110001',
      roadType: 'secondary'
    },
    images: {
      originalUrl: '/uploads/sample-cp.jpg',
      annotatedUrl: '/uploads/annotated-sample-cp.jpg',
      resolutionProofUrl: '/uploads/sample-cp-resolved.jpg'
    },
    detections: [
      {
        id: 'det_1',
        label: 'pothole',
        confidence: 0.91,
        bboxNormalized: [0.35, 0.58, 0.58, 0.78],
        bboxPixels: { x: 280, y: 348, width: 184, height: 120 },
        roadAreaPercent: 4.1,
        depthEstimate: 'Bitumen Spall & Aggregate Cavity'
      }
    ],
    severity: 'High',
    hazardScore: 68,
    severityDetails: 'Distressed road surface near pedestrian crossing.',
    aiModel: 'YOLOv8-Pothole-Segmenter (HuggingFace)',
    assignedAuthority: {
      id: 'NDMC',
      name: 'New Delhi Municipal Council (NDMC)',
      department: 'Civil Engineering Road Division',
      email: 'controlroom@ndmc.gov.in',
      helpline: '1533',
      escalationSLA: '36 Hours',
      jurisdictionReason: 'Located within New Delhi Municipal Council (NDMC) central governance zone.'
    },
    status: 'Resolved',
    statusHistory: [
      {
        status: 'Reported',
        timestamp: new Date(Date.now() - 48 * 3600000),
        updatedBy: 'Civic Patrol Dashcam',
        notes: 'Pothole automatically tagged and logged.'
      },
      {
        status: 'Acknowledged',
        timestamp: new Date(Date.now() - 40 * 3600000),
        updatedBy: 'NDMC Civil Wing',
        notes: 'Work order #NDMC-2026-88 issued.'
      },
      {
        status: 'In Progress',
        timestamp: new Date(Date.now() - 24 * 3600000),
        updatedBy: 'NDMC Quick Response Unit',
        notes: 'Hot-mix asphalt patch rolled and sealed.'
      },
      {
        status: 'Resolved',
        timestamp: new Date(Date.now() - 5 * 3600000),
        updatedBy: 'NDMC Quality Inspector',
        notes: 'Work completed and verified. Road surface restored to smooth finish.',
        proofImage: '/uploads/sample-cp-resolved.jpg'
      }
    ],
    source: 'dashcam',
    reportedAt: new Date(Date.now() - 48 * 3600000)
  },
  {
    _id: 'seed-pothole-005',
    trackingId: 'POT-2026-691230',
    title: 'Low Severity Wear - Mall Road, Civil Lines',
    location: {
      type: 'Point',
      coordinates: [77.2140, 28.6872]
    },
    address: {
      displayName: 'Mall Road, Near Delhi University North Campus, Civil Lines, Delhi',
      road: 'Mall Road',
      suburb: 'Civil Lines',
      city: 'Delhi',
      state: 'Delhi',
      postcode: '110054',
      roadType: 'residential'
    },
    images: {
      originalUrl: '/uploads/sample-mallroad.jpg',
      annotatedUrl: '/uploads/annotated-sample-mallroad.jpg',
      resolutionProofUrl: null
    },
    detections: [
      {
        id: 'det_1',
        label: 'pothole',
        confidence: 0.85,
        bboxNormalized: [0.38, 0.62, 0.55, 0.75],
        bboxPixels: { x: 304, y: 372, width: 136, height: 78 },
        roadAreaPercent: 1.8,
        depthEstimate: 'Shallow Surface Depression'
      }
    ],
    severity: 'Low',
    hazardScore: 28,
    severityDetails: 'Minor surface fatigue and gravel wear. No immediate structural danger.',
    aiModel: 'YOLOv8-Pothole-Segmenter (HuggingFace)',
    assignedAuthority: {
      id: 'MCD_NORTH',
      name: 'MCD - North Zone',
      department: 'Municipal Corporation of Delhi, Engineering Dept',
      email: 'ee-maint-north@mcd.gov.in',
      helpline: '155305',
      escalationSLA: '72 Hours',
      jurisdictionReason: 'Colony / residential street within MCD North Zone jurisdiction.'
    },
    status: 'Reported',
    statusHistory: [
      {
        status: 'Reported',
        timestamp: new Date(Date.now() - 1 * 3600000),
        updatedBy: 'Dashcam Road Survey',
        notes: 'Automated survey entry.'
      }
    ],
    source: 'dashcam',
    reportedAt: new Date(Date.now() - 1 * 3600000)
  }
];

module.exports = {
  SEED_POTHOLES
};
