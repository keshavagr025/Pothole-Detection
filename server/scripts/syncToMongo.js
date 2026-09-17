/**
 * Sync Local Persistent Data into MongoDB Atlas
 * Reads server/data/users.json and server/data/potholes.json and inserts them into MongoDB.
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { MongooseUser } = require('../models/User');
const { MongoosePothole } = require('../models/Pothole');

const USERS_FILE = path.join(__dirname, '../data/users.json');
const POTHOLES_FILE = path.join(__dirname, '../data/potholes.json');

async function sync() {
  console.log('===========================================================');
  console.log('    MĀRG-DRISHTI • SYNC LOCAL DATA TO MONGODB ATLAS        ');
  console.log('===========================================================');

  const MONGODB_URI = process.env.MONGODB_URI;
  console.log('[Sync] Connecting to MongoDB Atlas:', MONGODB_URI.replace(/:([^:@]+)@/, ':****@'));

  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('[Sync] Connected to MongoDB Atlas successfully!\n');
  } catch (err) {
    console.error('\n[Error] Could not connect to MongoDB Atlas:');
    console.error('  Reason:', err.message);
    console.error('\n--> HOW TO FIX:');
    console.error('  1. Open MongoDB Atlas (https://cloud.mongodb.com)');
    console.error('  2. Click "Network Access" in the left sidebar');
    console.error('  3. Click "Add IP Address" and select "ALLOW ACCESS FROM ANYWHERE" (0.0.0.0/0)');
    console.error('  4. Re-run: npm run sync:db\n');
    process.exit(1);
  }

  // 1. Sync Users
  if (fs.existsSync(USERS_FILE)) {
    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8') || '[]');
    console.log(`[Sync] Found ${users.length} user records in local JSON store.`);
    let userUpserts = 0;
    for (const u of users) {
      await MongooseUser.findByIdAndUpdate(u._id, u, { upsert: true, new: true });
      userUpserts++;
    }
    console.log(`[Sync] Successfully synced ${userUpserts} users into Atlas collection "users".`);
  }

  // 2. Sync Potholes
  if (fs.existsSync(POTHOLES_FILE)) {
    const potholes = JSON.parse(fs.readFileSync(POTHOLES_FILE, 'utf8') || '[]');
    console.log(`[Sync] Found ${potholes.length} pothole records in local JSON store.`);
    let potholeUpserts = 0;
    for (const p of potholes) {
      await MongoosePothole.findByIdAndUpdate(p._id, p, { upsert: true, new: true });
      potholeUpserts++;
    }
    console.log(`[Sync] Successfully synced ${potholeUpserts} potholes into Atlas collection "potholes".`);
  }

  console.log('\n===========================================================');
  console.log('  ALL DATA HAS BEEN SYNCED TO MONGODB ATLAS SUCCESSFULLY!  ');
  console.log('===========================================================');

  await mongoose.disconnect();
  process.exit(0);
}

sync().catch(err => {
  console.error('[Sync Error]:', err);
  process.exit(1);
});
