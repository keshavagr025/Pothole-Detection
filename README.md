<img width="1916" height="911" alt="image" src="https://github.com/user-attachments/assets/60bb2693-28c5-4a67-8c6a-8c4d3c3ea072" />

# MĀRG-DRISHTI • National Road Distress Surveillance Portal (PotholeAI)

An end-to-end full-stack platform that detects potholes and road distress from dashcam footage, video clips, and mobile camera feeds using computer vision (YOLOv8). It automatically tags exact GPS coordinates with multi-factor severity estimates, maps the responsible civic authority (**NHAI**, **PWD Delhi**, **MCD South/Central/North**, **NDMC**, **MoRTH**), dispatches automated tickets with SLAs, and manages the entire resolution lifecycle through a modern role-based operational command portal.

---

## 🌟 Key Capabilities

1. **AI Pothole Detection & Severity Scoring**:
   - Ingests dashcam video frames, mobile camera captures, or direct photo uploads.
   - Utilizes YOLOv8 pothole segmentation/detection to extract bounding boxes `[x1, y1, x2, y2]`, confidence scores, and road surface damage area percentage.
   - Automatically computes multi-factor severity ratings:
     - **Critical / High**: Crater area > 6% of lane or multiple clustered potholes posing rollover/skid risk.
     - **Medium**: Moderate asphalt depression (2.5% – 6% lane coverage).
     - **Low**: Hairline surface fatigue (< 2.5% lane coverage).

2. **Role-Based Authentication & Operational Command**:
   - **Educational Landing Page**: Introduces the civic vision, 5-stage AI pipeline, tech stack, and municipal comparison matrix to guest visitors.
   - **Operational Command Dashboard**: Unlocks real-time hazard map, Detection Studio, dispatch audit feeds, and priority action lists upon sign-in.
   - **Citizen vs. Officer Portals**: Differentiated workflows for citizens (reporting & tracking) and departmental engineers (status dispatching, SLA tracking, and work order proof uploads).
   - **Citizen Reputation & Gamification**: Rewards active citizens with Karma points, civic tier badges, and leaderboard rankings for verified road reports.

3. **Automated Civic Authority Geo-Resolution Engine**:
   - Automatically maps latitude/longitude coordinates and road hierarchy to the responsible municipal or highway authority:
     - **NHAI** (National Highways Authority of India): National Expressways and Motorways (e.g. NH-48 corridor).
     - **PWD** (Public Works Department): Arterial corridors, ring roads, state highways, and roads > 60 ft wide (e.g. Mahatma Gandhi Ring Road).
     - **MCD** (Municipal Corporation of Delhi): Colony, residential, and inner-city streets segmented into South, Central, and North zones.
     - **NDMC** (New Delhi Municipal Council): Central Lutyens' Delhi governance zone (e.g. Connaught Place).
   - Integrates reverse geocoding (OpenStreetMap Nominatim) with local geographic coordinate boundaries.

4. **Automated Civic Dispatch & Lifecycle Management**:
   - Generates official tickets with unique tracking IDs (`POT-YYYY-XXXXXX`).
   - Dispatches automated incident notifications containing Google Maps navigation links, photo evidence, road coordinates, and estimated repair SLA.
   - Full status lifecycle workflow: `Reported` &rarr; `Acknowledged` &rarr; `In Progress` &rarr; `Resolved` with before/after repair proof photo validation.

5. **Cloud Database with Dual-Storage Resilience**:
   - **MongoDB Atlas** cloud storage with GeoJSON spatial indexing.
   - **Zero-Config Persistent JSON Fallback**: If MongoDB is unavailable, the system automatically falls back to persistent local storage without throwing unhandled exceptions or crashing.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 18, Vite, React-Leaflet, Leaflet, Lucide React, Canvas Confetti, Vanilla CSS Design System |
| **Backend** | Node.js, Express.js, JWT (`jsonwebtoken`), `bcryptjs`, Multer, Axios, Mongoose |
| **Database** | MongoDB Atlas (Mongoose) + Local Persistent JSON Store fallback |
| **AI / CV** | Open-source YOLOv8 inference microservice (Python FastAPI) + Built-in Node.js CV analyzer fallback |
| **Maps & Geo** | Leaflet, CartoDB Dark Tiles, OpenStreetMap Nominatim Reverse Geocoder |
| **Deployment** | Vercel (Frontend), Render (Backend API), MongoDB Atlas (Cloud Database) |

---

## 📂 Project Structure

```
Pothole-Detection/
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── LandingPage.jsx         # Educational portal for public understanding
│   │   │   ├── DashboardOverview.jsx   # Operational command center for logged-in users
│   │   │   ├── AuthModal.jsx           # Login/Signup modal with 1-Click Demo Accounts
│   │   │   ├── Navbar.jsx              # Role-aware navigation & user profile chip
│   │   │   ├── StatsBar.jsx            # Real-time KPI summary counters
│   │   │   ├── MapView.jsx             # Leaflet interactive map with pulsing hazard markers
│   │   │   ├── DetectionStudio.jsx     # Dashcam stream, webcam, and upload studio
│   │   │   ├── TicketList.jsx          # Searchable, filterable municipal ticket directory
│   │   │   ├── TicketDetailModal.jsx   # Side-by-side AI annotated viewer & status update
│   │   │   ├── CivicDirectoryModal.jsx # Nodal directory of NHAI, PWD, MCD, NDMC
│   │   │   └── AnalyticsView.jsx       # Severity distribution & live dispatch log
│   │   ├── context/
│   │   │   └── AuthContext.jsx         # Global session state & JWT management
│   │   ├── services/
│   │   │   └── api.js                  # Axios client with JWT interceptor & endpoints
│   │   ├── index.css                   # Modern dark-mode glassmorphism design system
│   │   ├── App.jsx                     # State orchestrator & route switcher
│   │   └── main.jsx
│   ├── .env.example
│   ├── vercel.json                     # SPA client rewrite rules for Vercel
│   └── vite.config.js                  # Dev proxy configuration
├── server/                     # Node.js + Express REST API
│   ├── data/
│   │   ├── potholes.json               # Seeded / persistent potholes store
│   │   └── users.json                  # Seeded / persistent users store
│   ├── middleware/
│   │   └── auth.js                     # JWT verification & role validation middleware
│   ├── models/
│   │   ├── Pothole.js                  # Pothole Mongoose schema & dual-storage adapter
│   │   └── User.js                     # User Mongoose schema & dual-storage adapter
│   ├── routes/
│   │   ├── auth.js                     # /api/auth (login, register, me, demo-accounts)
│   │   └── potholes.js                 # /api/potholes (detect, stats, status, dispatches)
│   ├── scripts/
│   │   ├── seedUsers.js                # Seeds demo official & citizen accounts
│   │   └── syncToMongo.js              # One-click cloud sync script for MongoDB Atlas
│   ├── services/
│   │   ├── aiDetectionService.js       # YOLOv8 client & built-in CV analyzer
│   │   ├── authorityMapper.js          # Geo-resolution & road classification engine
│   │   └── notificationService.js      # Automated civic ticket dispatch & audit logger
│   ├── uploads/                        # Uploaded and AI-annotated image storage
│   ├── .env.example
│   └── server.js                       # Express server entry point
├── ai_service/                 # Optional Python FastAPI Deep Learning Service
│   ├── app.py                          # FastAPI endpoint with YOLOv8 inference
│   └── requirements.txt
├── DEPLOYMENT_GUIDE.md         # Production deployment manual for Vercel + Render
└── README.md
```

---

## 🔑 Pre-Seeded Demo Accounts

All pre-seeded test accounts use the password: `password123`

| Role | Name | Email | Department / Zone |
|---|---|---|---|
| **Officer** | Er. Arun Sharma | `arun.sharma@nhai.gov.in` | NHAI (National Highways) |
| **Officer** | Rajesh Verma | `rajesh.verma@pwd.delhi.gov.in` | PWD Delhi (Ring Roads / Arterial) |
| **Officer** | Amit Kumar | `amit.kumar@mcd.gov.in` | MCD South Zone |
| **Officer** | Dr. Priya Nair | `priya.nair@ndmc.gov.in` | NDMC (Central / Lutyens' Delhi) |
| **Admin** | MoRTH Operations Director | `director.safety@morth.gov.in` | Ministry of Road Transport |
| **Citizen** | Keshav Agrawal (Champion) | `keshav@example.com` | Verified Citizen (1,250 Karma Pts) |
| **Citizen** | Ananya Iyer | `ananya.iyer@gmail.com` | Verified Citizen (850 Karma Pts) |

*(You can also use the **"1-Click Instant Demo Login"** in the Sign In modal to log in immediately without typing).*

---

## ⚙️ Environment Variables Configuration

### Backend (`server/.env`)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/potholedb?retryWrites=true&w=majority
JWT_SECRET=marg_drishti_super_secret_jwt_key_2025
AI_SERVICE_URL=http://127.0.0.1:8000/detect
```

### Frontend (`client/.env`)
```env
# Leave empty for local development (Vite proxies requests automatically)
VITE_API_URL=

# For Production (Vercel / Netlify):
# VITE_API_URL=https://your-backend-api.onrender.com
```

---

## 🚀 How to Run the Project Locally

### 1. Start Backend Server
```bash
cd server
npm install
npm run seed:users    # Seeds citizen & official accounts
npm run sync:db       # Syncs local seed data to MongoDB Atlas
npm start
```
*Backend runs on `http://localhost:5000`.*

### 2. Start Frontend Client
```bash
cd client
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000`.*

### 3. (Optional) Start Python YOLOv8 AI Service
```bash
cd ai_service
pip install -r requirements.txt
python app.py
```
*Microservice runs on `http://127.0.0.1:8000`. If omitted, the backend's built-in intelligent computer vision engine takes over seamlessly.*

---

## ☁️ Deployment Guide

For step-by-step instructions on deploying the full stack to the cloud for free:
- **Frontend**: [Vercel](https://vercel.com) (`client/` root, SPA rewrites configured in `client/vercel.json`)
- **Backend API**: [Render](https://render.com) (`server/` root, Node runtime)
- **Database**: [MongoDB Atlas](https://cloud.mongodb.com) (M0 Free Tier Cluster)

👉 Read the complete [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for full screenshots, environment variables setup, and troubleshooting tips.

---

## 📜 License

This project is licensed under the MIT License — open-sourced for public infrastructure enhancement and road safety initiatives.
