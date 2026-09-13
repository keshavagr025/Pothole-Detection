require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');

const potholeRoutes = require('./routes/potholes');
const { Pothole } = require('./models/Pothole');
const { SEED_POTHOLES } = require('./data/seedData');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/potholedb';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded original & annotated images with accurate MIME types
app.use('/uploads', express.static(uploadsDir, {
  setHeaders: (res, filePath) => {
    try {
      const buf = Buffer.alloc(16);
      const fd = fs.openSync(filePath, 'r');
      fs.readSync(fd, buf, 0, 16, 0);
      fs.closeSync(fd);
      const str = buf.toString('utf8');

      if (str.includes('<svg') || filePath.endsWith('.svg')) {
        res.setHeader('Content-Type', 'image/svg+xml');
      } else if (buf[0] === 0xFF && buf[1] === 0xD8) {
        res.setHeader('Content-Type', 'image/jpeg');
      } else if (buf[0] === 0x89 && buf[1] === 0x50) {
        res.setHeader('Content-Type', 'image/png');
      }
    } catch (e) {
      // Fall back to default
    }
  }
}));

// API Routes
app.use('/api/potholes', potholeRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'MongoDB (Connected)' : 'Persistent Local Storage (Active)',
    aiEngine: 'YOLOv8 + Integrated Computer Vision Analyzer',
    civicAuthoritiesLoaded: ['NHAI', 'PWD', 'MCD (South/Central/North)', 'NDMC']
  });
});

// Seed data function
async function initializeData() {
  try {
    await Pothole.seedInitialData(SEED_POTHOLES);
  } catch (err) {
    console.error('[Database] Failed to seed initial data:', err.message);
  }
}

// Attempt MongoDB connection with 2.5s timeout; fall back to local store without blocking
async function startServer() {
  console.log('[Server] Attempting connection to MongoDB...');
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 2500
    });
    console.log('[Server] Connected to MongoDB successfully.');
  } catch (err) {
    console.log(`[Server] MongoDB not available locally (${err.message}). Seamlessly activated persistent JSON storage mode.`);
  }

  // Initialize seed data
  await initializeData();

  const server = app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`  POTHOLE DETECTION & CIVIC REPORTING SYSTEM BACKEND  `);
    console.log(`  Port: http://localhost:${PORT}                      `);
    console.log(`  Health: http://localhost:${PORT}/api/health        `);
    console.log(`  API: http://localhost:${PORT}/api/potholes         `);
    console.log(`=======================================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n[Server Error] Port ${PORT} is already in use by another running Node process.`);
      console.error(`To free port ${PORT}, run:`);
      console.error(`  Get-NetTCPConnection -LocalPort ${PORT} | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }\n`);
    } else {
      console.error('[Server Error]', err.message);
    }
  });
}

startServer();
