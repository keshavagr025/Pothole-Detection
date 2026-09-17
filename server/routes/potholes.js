/**
 * Pothole API Routes
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Pothole } = require('../models/Pothole');
const { User } = require('../models/User');
const { optionalAuth } = require('../middleware/auth');
const { detectPotholes } = require('../services/aiDetectionService');
const { resolveAuthority, CIVIC_AUTHORITIES } = require('../services/authorityMapper');
const { dispatchCivicReport, getRecentDispatches } = require('../services/notificationService');

// Multer storage configuration for uploaded dashcam images and resolution proofs
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `pothole-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB max
});

/**
 * @route POST /api/potholes/detect
 * @desc Process dashcam/mobile image, detect potholes with AI, map authority, save & dispatch
 */
router.post('/detect', optionalAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const {
      latitude = 28.5355,
      longitude = 77.2100,
      source = 'dashcam',
      roadHint = '',
      landmark = '',
      vehicleSpeed = null,
      confidenceThreshold = 0.20,
      reporterName = '',
      reporterEmail = ''
    } = req.body;

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const confThreshold = parseFloat(confidenceThreshold) || 0.20;

    console.log(`[PotholeRoute] Processing image ${req.file.filename} at coords: [${lat}, ${lng}] (conf: ${confThreshold})`);

    // 1. Run AI Detection & Severity Scoring
    const aiResult = await detectPotholes(req.file.path, req.file.filename, {
      lat,
      lng,
      confidenceThreshold: confThreshold
    });

    // 2. Resolve Civic Authority (NHAI / PWD / MCD / NDMC)
    const { authority, geoData, jurisdictionReason } = await resolveAuthority(lat, lng, roadHint);

    // 3. Generate unique tracking ID
    const trackingId = `POT-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const originalUrl = `/uploads/${req.file.filename}`;
    const annotatedUrl = `/uploads/${aiResult.annotatedFilename}`;

    // Determine reporter identity (from JWT or form body or default citizen)
    const reportedBy = req.user ? {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    } : {
      id: reporterEmail || 'anonymous_citizen',
      name: reporterName || 'Civic Road Reporter',
      email: reporterEmail || 'citizen@anonymous.nic.in',
      role: 'citizen'
    };

    // 4. Construct Pothole Record
    const potholeDoc = {
      trackingId,
      title: `${aiResult.severity} Severity Pothole - ${geoData.road || 'Corridor'}`,
      location: {
        type: 'Point',
        coordinates: [lng, lat]
      },
      address: {
        displayName: geoData.displayName,
        road: geoData.road,
        suburb: geoData.suburb,
        city: geoData.city,
        state: geoData.state,
        postcode: geoData.postcode,
        roadType: geoData.type
      },
      landmark: landmark || '',
      images: {
        originalUrl,
        annotatedUrl,
        resolutionProofUrl: null
      },
      detections: aiResult.detections,
      severity: aiResult.severity,
      hazardScore: aiResult.hazardScore,
      severityDetails: aiResult.severityDetails,
      aiModel: aiResult.aiModel,
      assignedAuthority: {
        id: authority.id,
        name: authority.name,
        department: authority.department,
        email: authority.email,
        helpline: authority.helpline,
        escalationSLA: authority.escalationSLA,
        jurisdictionReason
      },
      reportedBy,
      status: 'Reported',
      source,
      reportedAt: new Date()
    };

    // 5. Persist Record
    const savedPothole = await Pothole.create(potholeDoc);

    // Reward citizen with civic reputation points if logged in
    if (req.user && req.user._id) {
      await User.addReputation(req.user._id, 15).catch(() => {});
    }

    // 6. Automatically dispatch notification to civic authority
    const dispatchNotice = await dispatchCivicReport(savedPothole);

    return res.status(201).json({
      success: true,
      message: 'Pothole detected and reported to civic authority successfully',
      pothole: savedPothole,
      dispatchNotice
    });

  } catch (error) {
    console.error('[PotholeRoute] Error during detection & reporting:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

/**
 * @route GET /api/potholes
 * @desc Get list of potholes with filters
 */
router.get('/', async (req, res) => {
  try {
    const { status, severity, authority, search, reportedBy } = req.query;
    const filter = {};

    if (status && status !== 'all') filter.status = status;
    if (severity && severity !== 'all') filter.severity = severity;
    if (authority && authority !== 'all') filter['assignedAuthority.id'] = authority;
    if (reportedBy && reportedBy !== 'all') filter['reportedBy.id'] = reportedBy;
    if (search) filter.search = search;

    const potholes = await Pothole.find(filter);
    return res.json(potholes);
  } catch (error) {
    console.error('[PotholeRoute] Error fetching potholes:', error);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * @route GET /api/potholes/stats
 * @desc Get summary analytics and metrics
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = await Pothole.getStats();
    return res.json(stats);
  } catch (error) {
    console.error('[PotholeRoute] Error fetching stats:', error);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * @route GET /api/potholes/dispatches
 * @desc Get recent automated civic department dispatch notices
 */
router.get('/dispatches', (req, res) => {
  return res.json(getRecentDispatches());
});

/**
 * @route GET /api/potholes/authorities
 * @desc Get list of configured civic authorities
 */
router.get('/authorities', (req, res) => {
  return res.json(CIVIC_AUTHORITIES);
});

/**
 * @route GET /api/potholes/:id
 * @desc Get details of a specific pothole
 */
router.get('/:id', async (req, res) => {
  try {
    const pothole = await Pothole.findById(req.params.id);
    if (!pothole) {
      return res.status(404).json({ error: 'Pothole incident not found' });
    }
    return res.json(pothole);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * @route PATCH /api/potholes/:id/status
 * @desc Update pothole resolution status (Reported -> Acknowledged -> In Progress -> Resolved)
 */
router.patch('/:id/status', optionalAuth, upload.single('proofImage'), async (req, res) => {
  try {
    const { status, notes, updatedBy } = req.body;
    let proofImageUrl = null;

    if (req.file) {
      proofImageUrl = `/uploads/${req.file.filename}`;
    }

    if (!['Reported', 'Acknowledged', 'In Progress', 'Resolved'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    let updaterName = updatedBy;
    if (req.user) {
      updaterName = req.user.department
        ? `${req.user.name} (${req.user.department}${req.user.badgeNumber ? ` #${req.user.badgeNumber}` : ''})`
        : `${req.user.name} (${req.user.role.toUpperCase()})`;
    } else if (!updaterName) {
      updaterName = 'Civic Authority Executive';
    }

    const updated = await Pothole.updateStatus(
      req.params.id,
      status,
      notes,
      updaterName,
      proofImageUrl
    );

    if (!updated) {
      return res.status(404).json({ error: 'Pothole incident not found' });
    }

    return res.json({
      success: true,
      message: `Status transitioned to ${status}`,
      pothole: updated
    });
  } catch (error) {
    console.error('[PotholeRoute] Error updating status:', error);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * @route PATCH /api/potholes/:id/location
 * @desc Update verified GPS location, landmark, and re-verify civic authority
 */
router.patch('/:id/location', async (req, res) => {
  try {
    const { latitude, longitude, locationName, landmark } = req.body;
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ error: 'Valid latitude and longitude required' });
    }

    const updated = await Pothole.updateLocation(req.params.id, {
      lat,
      lng,
      locationName,
      landmark
    });

    if (!updated) {
      return res.status(404).json({ error: 'Pothole incident not found' });
    }

    return res.json({
      success: true,
      message: 'Incident location updated & jurisdiction re-verified',
      pothole: updated
    });
  } catch (error) {
    console.error('[PotholeRoute] Error updating location:', error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
