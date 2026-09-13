/**
 * Pothole Model
 * Supports MongoDB Mongoose with 2dsphere GeoJSON spatial indexing,
 * plus a zero-configuration persistent JSON store fallback when MongoDB is offline.
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/potholes.json');

// Ensure data folder exists
if (!fs.existsSync(path.dirname(DATA_FILE))) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}

// 1. Mongoose Schema Definition
const PotholeSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  trackingId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  title: {
    type: String,
    default: 'Detected Road Hazard'
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
      required: true
    },
    // GeoJSON coordinate order: [longitude, latitude]
    coordinates: {
      type: [Number],
      required: true
    }
  },
  address: {
    displayName: String,
    road: String,
    suburb: String,
    city: String,
    state: String,
    postcode: String,
    roadType: String
  },
  landmark: {
    type: String,
    default: ''
  },
  images: {
    originalUrl: { type: String, required: true },
    annotatedUrl: { type: String, required: true },
    resolutionProofUrl: { type: String, default: null }
  },
  detections: [
    {
      id: String,
      label: String,
      confidence: Number,
      bboxNormalized: [Number],
      bboxPixels: {
        x: Number,
        y: Number,
        width: Number,
        height: Number
      },
      roadAreaPercent: Number,
      depthEstimate: String
    }
  ],
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium',
    index: true
  },
  hazardScore: {
    type: Number,
    default: 50
  },
  severityDetails: String,
  aiModel: String,
  assignedAuthority: {
    id: String,
    name: String,
    department: String,
    email: String,
    helpline: String,
    escalationSLA: String,
    jurisdictionReason: String
  },
  status: {
    type: String,
    enum: ['Reported', 'Acknowledged', 'In Progress', 'Resolved'],
    default: 'Reported',
    index: true
  },
  statusHistory: [
    {
      status: String,
      timestamp: { type: Date, default: Date.now },
      updatedBy: { type: String, default: 'System' },
      notes: String,
      proofImage: String
    }
  ],
  source: {
    type: String,
    enum: ['dashcam', 'mobile_camera', 'citizen_upload', 'drone_survey'],
    default: 'dashcam'
  },
  reportedAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Spatial index for geolocation radius and bounding box searches
PotholeSchema.index({ location: '2dsphere' });

const MongooseModel = mongoose.model('Pothole', PotholeSchema);

// 2. Persistent JSON Storage Fallback Layer (Enables instant execution without requiring MongoDB daemon)
function readJsonStore() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data || '[]');
    }
  } catch (err) {
    console.error('[Store] Error reading JSON data file:', err.message);
  }
  return [];
}

function writeJsonStore(records) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(records, null, 2), 'utf8');
  } catch (err) {
    console.error('[Store] Error writing JSON data file:', err.message);
  }
}

// Unified DAO interface
class PotholeRepository {
  static isMongoActive() {
    return mongoose.connection && mongoose.connection.readyState === 1;
  }

  static async create(doc) {
    if (!doc._id) {
      doc._id = new mongoose.Types.ObjectId().toString();
    }
    if (!doc.reportedAt) {
      doc.reportedAt = new Date();
    }
    if (!doc.statusHistory) {
      doc.statusHistory = [{
        status: doc.status || 'Reported',
        timestamp: new Date(),
        updatedBy: 'Automated AI Detection Pipeline',
        notes: `Initial AI detection logged. Tagged with ${doc.severity} severity.`
      }];
    }

    if (this.isMongoActive()) {
      return await MongooseModel.create(doc);
    } else {
      const items = readJsonStore();
      items.unshift(doc);
      writeJsonStore(items);
      return doc;
    }
  }

  static async find(filter = {}) {
    if (this.isMongoActive()) {
      return await MongooseModel.find(filter).sort({ reportedAt: -1 }).lean();
    } else {
      let items = readJsonStore();

      // Basic filtering
      if (filter.status) {
        items = items.filter(item => item.status === filter.status);
      }
      if (filter.severity) {
        items = items.filter(item => item.severity === filter.severity);
      }
      if (filter['assignedAuthority.id']) {
        items = items.filter(item => item.assignedAuthority && item.assignedAuthority.id === filter['assignedAuthority.id']);
      }
      if (filter.$text || filter.search) {
        const query = (filter.search || '').toLowerCase();
        items = items.filter(item => 
          (item.trackingId && item.trackingId.toLowerCase().includes(query)) ||
          (item.address && item.address.displayName && item.address.displayName.toLowerCase().includes(query)) ||
          (item.address && item.address.road && item.address.road.toLowerCase().includes(query))
        );
      }

      return items.sort((a, b) => new Date(b.reportedAt) - new Date(a.reportedAt));
    }
  }

  static async findById(id) {
    if (this.isMongoActive()) {
      return await MongooseModel.findById(id).lean();
    } else {
      const items = readJsonStore();
      return items.find(i => String(i._id) === String(id) || i.trackingId === String(id)) || null;
    }
  }

  static async updateStatus(id, newStatus, notes = '', updatedBy = 'Civic Authority Officer', proofImage = null) {
    const historyEntry = {
      status: newStatus,
      timestamp: new Date(),
      updatedBy,
      notes: notes || `Status transitioned to ${newStatus}`,
      proofImage
    };

    if (this.isMongoActive()) {
      const updateData = {
        $set: { status: newStatus },
        $push: { statusHistory: historyEntry }
      };
      if (proofImage) {
        updateData.$set['images.resolutionProofUrl'] = proofImage;
      }
      return await MongooseModel.findByIdAndUpdate(id, updateData, { new: true });
    } else {
      const items = readJsonStore();
      const index = items.findIndex(i => String(i._id) === String(id) || i.trackingId === String(id));
      if (index === -1) return null;

      items[index].status = newStatus;
      if (proofImage) {
        items[index].images.resolutionProofUrl = proofImage;
      }
      if (!items[index].statusHistory) items[index].statusHistory = [];
      items[index].statusHistory.push(historyEntry);
      items[index].updatedAt = new Date();

      writeJsonStore(items);
      return items[index];
    }
  }

  static async updateLocation(id, { lat, lng, locationName, landmark }) {
    const { resolveAuthority } = require('../services/authorityMapper');
    const { authority, geoData, jurisdictionReason } = await resolveAuthority(lat, lng, locationName);

    const updateFields = {
      location: {
        type: 'Point',
        coordinates: [lng, lat]
      },
      address: {
        displayName: locationName || geoData.displayName,
        road: geoData.road,
        suburb: geoData.suburb,
        city: geoData.city,
        state: geoData.state,
        postcode: geoData.postcode,
        roadType: geoData.type
      },
      landmark: landmark || '',
      assignedAuthority: {
        id: authority.id,
        name: authority.name,
        department: authority.department,
        email: authority.email,
        helpline: authority.helpline,
        escalationSLA: authority.escalationSLA,
        jurisdictionReason
      },
      updatedAt: new Date()
    };

    if (this.isMongoActive()) {
      return await MongooseModel.findByIdAndUpdate(id, { $set: updateFields }, { new: true });
    } else {
      const items = readJsonStore();
      const index = items.findIndex(i => String(i._id) === String(id) || i.trackingId === String(id));
      if (index === -1) return null;

      items[index] = {
        ...items[index],
        ...updateFields
      };
      writeJsonStore(items);
      return items[index];
    }
  }

  static async getStats() {
    let items = [];
    if (this.isMongoActive()) {
      items = await MongooseModel.find().lean();
    } else {
      items = readJsonStore();
    }

    const total = items.length;
    const byStatus = {
      Reported: items.filter(i => i.status === 'Reported').length,
      Acknowledged: items.filter(i => i.status === 'Acknowledged').length,
      'In Progress': items.filter(i => i.status === 'In Progress').length,
      Resolved: items.filter(i => i.status === 'Resolved').length
    };

    const bySeverity = {
      Critical: items.filter(i => i.severity === 'Critical').length,
      High: items.filter(i => i.severity === 'High').length,
      Medium: items.filter(i => i.severity === 'Medium').length,
      Low: items.filter(i => i.severity === 'Low').length
    };

    const byAuthority = {};
    items.forEach(i => {
      const auth = (i.assignedAuthority && i.assignedAuthority.id) || 'Unassigned';
      byAuthority[auth] = (byAuthority[auth] || 0) + 1;
    });

    const highRiskActive = items.filter(i => 
      (i.severity === 'Critical' || i.severity === 'High') && i.status !== 'Resolved'
    ).length;

    return {
      total,
      byStatus,
      bySeverity,
      byAuthority,
      highRiskActive,
      resolutionRate: total > 0 ? Math.round((byStatus.Resolved / total) * 100) : 0
    };
  }

  static async seedInitialData(seedItems) {
    try {
      if (this.isMongoActive()) {
        const count = await MongooseModel.countDocuments();
        if (count === 0) {
          await MongooseModel.insertMany(seedItems);
          console.log(`[PotholeModel] Seeded ${seedItems.length} initial items into MongoDB.`);
        }
      } else {
        const current = readJsonStore();
        if (current.length === 0) {
          writeJsonStore(seedItems);
          console.log(`[PotholeModel] Seeded ${seedItems.length} initial items into JSON store.`);
        }
      }
    } catch (err) {
      console.error(`[PotholeModel] Seeding error:`, err.message);
    }
  }
}

module.exports = {
  Pothole: PotholeRepository,
  MongoosePothole: MongooseModel
};
