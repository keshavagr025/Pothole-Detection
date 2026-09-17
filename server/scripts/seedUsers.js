/**
 * Standalone User Seeder Script for MĀRG-DRISHTI Portal
 * Populates citizens, NHAI, PWD, MCD, NDMC officers, and MoRTH administrators.
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const mongoose = require('mongoose');
const { User } = require('../models/User');

const SEED_USERS = [
  // 1. Citizen Sentinels
  {
    name: 'Keshav Agrawal (Citizen Sentinel)',
    email: 'citizen@example.com',
    password: 'password123',
    role: 'citizen',
    phone: '+91 98765 43210',
    reputationPoints: 125,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'
  },
  {
    name: 'Priya Sharma (Daily Commuter)',
    email: 'priya.sharma@example.com',
    password: 'password123',
    role: 'citizen',
    phone: '+91 98112 34567',
    reputationPoints: 85,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80'
  },
  {
    name: 'Amit Patel (Road Safety Volunteer)',
    email: 'amit.patel@example.com',
    password: 'password123',
    role: 'citizen',
    phone: '+91 99201 88442',
    reputationPoints: 140,
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80'
  },
  {
    name: 'Rohan Gupta (Two-Wheeler Commuter)',
    email: 'rohan.gupta@example.com',
    password: 'password123',
    role: 'citizen',
    phone: '+91 97110 54321',
    reputationPoints: 45,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
  },

  // 2. National Highways Authority of India (NHAI) Officers
  {
    name: 'Er. Rajesh Verma (Chief Project Director)',
    email: 'officer@nhai.gov.in',
    password: 'password123',
    role: 'officer',
    phone: '+91 11 2507 4100',
    department: 'National Highways Authority of India (NHAI)',
    badgeNumber: 'NHAI-HQ-0842',
    jurisdiction: 'NH-48 Corridor, Delhi-Jaipur & Dwarka Expressway',
    reputationPoints: 100,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80'
  },
  {
    name: 'Er. Alok Srivastava (Superintending Engineer)',
    email: 'alok.srivastava@nhai.gov.in',
    password: 'password123',
    role: 'officer',
    phone: '+91 11 2507 4250',
    department: 'National Highways Authority of India (NHAI)',
    badgeNumber: 'NHAI-EXP-3102',
    jurisdiction: 'Delhi-Meerut Expressway & Eastern Peripheral Expressway',
    reputationPoints: 100
  },

  // 3. Public Works Department (Delhi PWD) Officers
  {
    name: 'Sunita Sharma (Executive Engineer)',
    email: 'officer@pwd.delhi.gov.in',
    password: 'password123',
    role: 'officer',
    phone: '+91 11 2349 2000',
    department: 'Public Works Department (Delhi PWD)',
    badgeNumber: 'PWD-DL-4190',
    jurisdiction: 'Mahatma Gandhi Ring Road, Outer Ring Road & Arterials',
    reputationPoints: 100,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80'
  },
  {
    name: 'Er. Manoj Kulkarni (Assistant Engineer - Flyovers)',
    email: 'manoj.kulkarni@pwd.delhi.gov.in',
    password: 'password123',
    role: 'officer',
    phone: '+91 11 2349 2140',
    department: 'Public Works Department (Delhi PWD)',
    badgeNumber: 'PWD-DL-2081',
    jurisdiction: 'Barapullah Elevated Corridor & Ashram Underpass Zone',
    reputationPoints: 100
  },

  // 4. Municipal Corporation of Delhi (MCD) Inspectors
  {
    name: 'MCD Nodal Inspector (South Zone)',
    email: 'inspector@mcd.gov.in',
    password: 'password123',
    role: 'officer',
    phone: '+91 11 2652 0000',
    department: 'Municipal Corporation of Delhi (MCD)',
    badgeNumber: 'MCD-SZ-1029',
    jurisdiction: 'Hauz Khas, Saket, Green Park & Greater Kailash Wards',
    reputationPoints: 100,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80'
  },
  {
    name: 'Dr. Sanjay Yadav (Zonal Engineer - North Zone)',
    email: 'sanjay.mcd@mcd.gov.in',
    password: 'password123',
    role: 'officer',
    phone: '+91 11 2391 4000',
    department: 'Municipal Corporation of Delhi (MCD)',
    badgeNumber: 'MCD-NZ-5521',
    jurisdiction: 'Civil Lines, Model Town & Rohini Sector Roads',
    reputationPoints: 100
  },
  {
    name: 'Anil Kapoor (Zonal Inspector - Central Zone)',
    email: 'anil.mcd@mcd.gov.in',
    password: 'password123',
    role: 'officer',
    phone: '+91 11 2327 5000',
    department: 'Municipal Corporation of Delhi (MCD)',
    badgeNumber: 'MCD-CZ-7703',
    jurisdiction: 'Karol Bagh, Patel Nagar & Daryaganj Wards',
    reputationPoints: 100
  },

  // 5. New Delhi Municipal Council (NDMC) Officers
  {
    name: 'Er. Deepak Mehra (Chief Nodal Engineer)',
    email: 'deepak.mehra@ndmc.gov.in',
    password: 'password123',
    role: 'officer',
    phone: '+91 11 2336 0000',
    department: 'New Delhi Municipal Council (NDMC)',
    badgeNumber: 'NDMC-ENG-007',
    jurisdiction: 'Connaught Place Radial Roads, India Gate & Janpath',
    reputationPoints: 100,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80'
  },

  // 6. Ministry of Road Transport & Highways (MoRTH) Central Admin
  {
    name: 'National Highway Safety Admin (MoRTH)',
    email: 'admin@morth.gov.in',
    password: 'adminpassword123',
    role: 'admin',
    phone: '+91 11 2371 0121',
    department: 'Ministry of Road Transport & Highways (MoRTH)',
    badgeNumber: 'MORTH-ADM-001',
    jurisdiction: 'All India Central Command & PM Gati Shakti Portal',
    reputationPoints: 500,
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&auto=format&fit=crop&q=80'
  }
];

async function seedDatabase() {
  console.log('===========================================================');
  console.log('       MĀRG-DRISHTI • CITIZEN & OFFICER DATA SEEDER        ');
  console.log('===========================================================');

  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/potholedb';
  console.log('[Seeder] Attempting MongoDB connection...');

  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 2500 });
    console.log('[Seeder] Connected to MongoDB.');
  } catch (err) {
    console.log(`[Seeder] MongoDB not reachable (${err.message}). Seeding into Persistent JSON Store directly.`);
  }

  let createdCount = 0;
  let existingCount = 0;

  for (const user of SEED_USERS) {
    const existing = await User.findByEmail(user.email);
    if (!existing) {
      await User.create(user);
      console.log(`  [+] Created User: ${user.name.padEnd(42)} | ${user.role.toUpperCase()} | ${user.email}`);
      createdCount++;
    } else {
      console.log(`  [•] Account Exists: ${user.name.padEnd(40)} | ${user.email}`);
      existingCount++;
    }
  }

  console.log('-----------------------------------------------------------');
  console.log(`[Seeder Summary] Total Seed Profiles: ${SEED_USERS.length}`);
  console.log(`                 New Profiles Created: ${createdCount}`);
  console.log(`                 Existing Profiles:    ${existingCount}`);
  console.log('===========================================================');

  if (mongoose.connection && mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
    console.log('[Seeder] MongoDB disconnected cleanly.');
  }

  process.exit(0);
}

seedDatabase().catch(err => {
  console.error('[Seeder Error]:', err);
  process.exit(1);
});
