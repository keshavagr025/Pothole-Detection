/**
 * User Model
 * Supports MongoDB Mongoose authentication schemas,
 * plus persistent JSON store fallback when MongoDB is offline.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const USER_DATA_FILE = path.join(__dirname, '../data/users.json');

// Ensure data folder exists
if (!fs.existsSync(path.dirname(USER_DATA_FILE))) {
  fs.mkdirSync(path.dirname(USER_DATA_FILE), { recursive: true });
}

// 1. Mongoose Schema Definition
const UserSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['citizen', 'officer', 'admin'],
    default: 'citizen'
  },
  phone: {
    type: String,
    default: ''
  },
  department: {
    type: String,
    default: ''
  },
  badgeNumber: {
    type: String,
    default: ''
  },
  jurisdiction: {
    type: String,
    default: ''
  },
  reputationPoints: {
    type: Number,
    default: 25
  },
  avatar: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const MongooseUser = mongoose.model('User', UserSchema);

// 2. Persistent JSON Storage Fallback Layer
function readUsersJson() {
  try {
    if (fs.existsSync(USER_DATA_FILE)) {
      const data = fs.readFileSync(USER_DATA_FILE, 'utf8');
      return JSON.parse(data || '[]');
    }
  } catch (err) {
    console.error('[UserStore] Error reading users file:', err.message);
  }
  return [];
}

function writeUsersJson(users) {
  try {
    fs.writeFileSync(USER_DATA_FILE, JSON.stringify(users, null, 2), 'utf8');
  } catch (err) {
    console.error('[UserStore] Error writing users file:', err.message);
  }
}

// 3. User Repository Interface
class UserRepository {
  static isMongoActive() {
    return mongoose.connection && mongoose.connection.readyState === 1;
  }

  static async hashPassword(plainPassword) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(plainPassword, salt);
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static sanitize(user) {
    if (!user) return null;
    const { password, ...safeUser } = user._doc || user;
    return safeUser;
  }

  static async findByEmail(email) {
    const normalizedEmail = (email || '').toLowerCase().trim();
    if (this.isMongoActive()) {
      return await MongooseUser.findOne({ email: normalizedEmail }).lean();
    } else {
      const users = readUsersJson();
      return users.find(u => u.email.toLowerCase() === normalizedEmail) || null;
    }
  }

  static async findById(id) {
    if (this.isMongoActive()) {
      return await MongooseUser.findById(id).lean();
    } else {
      const users = readUsersJson();
      return users.find(u => String(u._id) === String(id)) || null;
    }
  }

  static async create(userData) {
    const email = userData.email.toLowerCase().trim();
    const existing = await this.findByEmail(email);
    if (existing) {
      throw new Error('An account with this email address already exists');
    }

    const hashedPassword = await this.hashPassword(userData.password);
    const userDoc = {
      _id: userData._id || new mongoose.Types.ObjectId().toString(),
      name: userData.name.trim(),
      email,
      password: hashedPassword,
      role: userData.role || 'citizen',
      phone: userData.phone || '',
      department: userData.department || '',
      badgeNumber: userData.badgeNumber || '',
      jurisdiction: userData.jurisdiction || '',
      reputationPoints: userData.reputationPoints !== undefined ? userData.reputationPoints : (userData.role === 'citizen' ? 25 : 100),
      avatar: userData.avatar || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (this.isMongoActive()) {
      const created = await MongooseUser.create(userDoc);
      return this.sanitize(created.toObject());
    } else {
      const users = readUsersJson();
      users.push(userDoc);
      writeUsersJson(users);
      return this.sanitize(userDoc);
    }
  }

  static async updateProfile(id, updateData) {
    const allowed = ['name', 'phone', 'department', 'badgeNumber', 'jurisdiction', 'avatar'];
    const fieldsToUpdate = {};
    for (const key of allowed) {
      if (updateData[key] !== undefined) {
        fieldsToUpdate[key] = updateData[key];
      }
    }
    fieldsToUpdate.updatedAt = new Date();

    if (this.isMongoActive()) {
      const updated = await MongooseUser.findByIdAndUpdate(id, { $set: fieldsToUpdate }, { new: true }).lean();
      return this.sanitize(updated);
    } else {
      const users = readUsersJson();
      const idx = users.findIndex(u => String(u._id) === String(id));
      if (idx === -1) return null;
      users[idx] = { ...users[idx], ...fieldsToUpdate };
      writeUsersJson(users);
      return this.sanitize(users[idx]);
    }
  }

  static async addReputation(id, points = 10) {
    if (this.isMongoActive()) {
      return await MongooseUser.findByIdAndUpdate(id, { $inc: { reputationPoints: points } }, { new: true }).lean();
    } else {
      const users = readUsersJson();
      const idx = users.findIndex(u => String(u._id) === String(id));
      if (idx !== -1) {
        users[idx].reputationPoints = (users[idx].reputationPoints || 0) + points;
        writeUsersJson(users);
        return users[idx];
      }
      return null;
    }
  }

  static async seedInitialUsers() {
    const seedUsers = [
      // 1. Citizen Sentinels
      {
        name: 'Keshav Agrawal (Citizen Sentinel)',
        email: 'citizen@example.com',
        password: 'password123',
        role: 'citizen',
        phone: '+91 98765 43210',
        reputationPoints: 125
      },
      {
        name: 'Priya Sharma (Daily Commuter)',
        email: 'priya.sharma@example.com',
        password: 'password123',
        role: 'citizen',
        phone: '+91 98112 34567',
        reputationPoints: 85
      },
      {
        name: 'Amit Patel (Road Safety Volunteer)',
        email: 'amit.patel@example.com',
        password: 'password123',
        role: 'citizen',
        phone: '+91 99201 88442',
        reputationPoints: 140
      },
      // 2. NHAI Officers
      {
        name: 'Er. Rajesh Verma (Chief Project Director)',
        email: 'officer@nhai.gov.in',
        password: 'password123',
        role: 'officer',
        phone: '+91 11 2507 4100',
        department: 'National Highways Authority of India (NHAI)',
        badgeNumber: 'NHAI-HQ-0842',
        jurisdiction: 'NH-48 Corridor, Delhi-Jaipur & Dwarka Expressway'
      },
      {
        name: 'Er. Alok Srivastava (Superintending Engineer)',
        email: 'alok.srivastava@nhai.gov.in',
        password: 'password123',
        role: 'officer',
        phone: '+91 11 2507 4250',
        department: 'National Highways Authority of India (NHAI)',
        badgeNumber: 'NHAI-EXP-3102',
        jurisdiction: 'Delhi-Meerut Expressway & Eastern Peripheral Expressway'
      },
      // 3. PWD Officers
      {
        name: 'Sunita Sharma (Executive Engineer)',
        email: 'officer@pwd.delhi.gov.in',
        password: 'password123',
        role: 'officer',
        phone: '+91 11 2349 2000',
        department: 'Public Works Department (Delhi PWD)',
        badgeNumber: 'PWD-DL-4190',
        jurisdiction: 'Mahatma Gandhi Ring Road, Outer Ring Road & Arterials'
      },
      {
        name: 'Er. Manoj Kulkarni (Assistant Engineer - Flyovers)',
        email: 'manoj.kulkarni@pwd.delhi.gov.in',
        password: 'password123',
        role: 'officer',
        phone: '+91 11 2349 2140',
        department: 'Public Works Department (Delhi PWD)',
        badgeNumber: 'PWD-DL-2081',
        jurisdiction: 'Barapullah Elevated Corridor & Ashram Underpass Zone'
      },
      // 4. MCD Inspectors
      {
        name: 'MCD Nodal Inspector (South Zone)',
        email: 'inspector@mcd.gov.in',
        password: 'password123',
        role: 'officer',
        phone: '+91 11 2652 0000',
        department: 'Municipal Corporation of Delhi (MCD)',
        badgeNumber: 'MCD-SZ-1029',
        jurisdiction: 'Hauz Khas, Saket, Green Park & Greater Kailash Wards'
      },
      {
        name: 'Dr. Sanjay Yadav (Zonal Engineer - North Zone)',
        email: 'sanjay.mcd@mcd.gov.in',
        password: 'password123',
        role: 'officer',
        phone: '+91 11 2391 4000',
        department: 'Municipal Corporation of Delhi (MCD)',
        badgeNumber: 'MCD-NZ-5521',
        jurisdiction: 'Civil Lines, Model Town & Rohini Sector Roads'
      },
      // 5. NDMC Officers
      {
        name: 'Er. Deepak Mehra (Chief Nodal Engineer)',
        email: 'deepak.mehra@ndmc.gov.in',
        password: 'password123',
        role: 'officer',
        phone: '+91 11 2336 0000',
        department: 'New Delhi Municipal Council (NDMC)',
        badgeNumber: 'NDMC-ENG-007',
        jurisdiction: 'Connaught Place Radial Roads, India Gate & Janpath'
      },
      // 6. MoRTH Admin
      {
        name: 'National Highway Safety Admin (MoRTH)',
        email: 'admin@morth.gov.in',
        password: 'adminpassword123',
        role: 'admin',
        phone: '+91 11 2371 0121',
        department: 'Ministry of Road Transport & Highways (MoRTH)',
        badgeNumber: 'MORTH-ADM-001',
        jurisdiction: 'All India Central Command & PM Gati Shakti Portal'
      }
    ];

    try {
      for (const user of seedUsers) {
        const existing = await this.findByEmail(user.email);
        if (!existing) {
          await this.create(user);
          console.log(`[UserSeed] Seeded account: ${user.email} (${user.role})`);
        }
      }
    } catch (err) {
      console.warn('[UserSeed] Note during user seeding:', err.message);
    }
  }
}

module.exports = {
  User: UserRepository,
  MongooseUser
};
