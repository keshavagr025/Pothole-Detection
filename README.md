# PotholeAI • Intelligent Road Safety & Automated Civic Reporting System

An end-to-end full-stack platform that detects potholes from dashcam footage, video clips, and mobile camera feeds using computer vision, tags exact GPS locations with severity estimates, automatically maps the responsible civic authority (e.g., **NHAI**, **PWD**, **MCD South/North/Central**, **NDMC**), dispatches automated reports/tickets, and manages the entire resolution lifecycle on an interactive dashboard.

---

## Key Capabilities

1. **AI Pothole Detection & Severity Scoring**:
   - Ingests dashcam video frames, mobile camera captures, or direct photo uploads.
   - Utilizes open-source YOLO / Hugging Face computer vision models (e.g. YOLOv8 pothole segmentation weights) to extract bounding boxes `[x1, y1, x2, y2]`, confidence scores, and road surface damage area percentage.
   - Automatically computes multi-factor severity ratings:
     - **Critical / High**: Crater area > 6% of lane or multiple clustered potholes posing rollover/skid risk.
     - **Medium**: Moderate asphalt depression (2.5% – 6% lane coverage).
     - **Low**: Hairline surface fatigue (< 2.5% lane coverage).

2. **Automated Civic Authority Geo-Resolution Engine**:
   - Automatically maps latitude/longitude coordinates and road hierarchy to the responsible municipal or highway authority:
     - **NHAI** (National Highways Authority of India): National Expressways and Motorways (e.g. NH-48 corridor).
     - **PWD** (Public Works Department): Arterial corridors, ring roads, state highways, and roads > 60 ft wide (e.g. Mahatma Gandhi Ring Road).
     - **MCD** (Municipal Corporation of Delhi): Colony, residential, and inner-city streets segmented into South, Central, and North zones.
     - **NDMC** (New Delhi Municipal Council): Central Lutyens' Delhi governance zone (e.g. Connaught Place).
   - Integrates reverse geocoding (OpenStreetMap Nominatim) with local geographic coordinate boundaries.

3. **Automated Civic Dispatch & Notification**:
   - Generates official tickets with unique tracking IDs (`POT-YYYY-XXXXXX`).
   - Dispatches automated incident notifications containing Google Maps navigation links, photo evidence, road coordinates, and estimated repair SLA.
   - Maintains an audit log for municipal accountability.

4. **Interactive Dashboard**:
   - **Interactive Map (Leaflet)**: Dark-mode basemap with pulsing hazard pins, category filters, zone boundary overlays, and heatmap density visualization.
   - **Detection Studio**: Live camera feed, dashcam stream analyzer, and drag-and-drop photo uploader with one-click civic corridor presets.
   - **Ticket Management**: Full status workflow (`Reported` &rarr; `Acknowledged` &rarr; `In Progress` &rarr; `Resolved`) with repair proof photo upload.
   - **Analytics & Authority Directory**: Real-time KPI summaries, severity distribution, and municipal response metrics.

---

## Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 18, Vite, React-Leaflet, Leaflet, Lucide React, Canvas Confetti, Vanilla CSS (Modern Dark Mode) |
| **Backend** | Node.js, Express.js, Multer, Axios, Mongoose |
| **Database** | MongoDB with GeoJSON `2dsphere` spatial indexing (includes zero-config persistent local fallback store) |
| **AI / CV** | Open-source YOLOv8 / Hugging Face model integration + Python FastAPI microservice (`ai_service/`) |
| **Maps & Geo** | Leaflet, CartoDB Dark Tiles, OpenStreetMap Nominatim Reverse Geocoder |

---

## Project Structure

```
d:/Pothole-Detection/
├── client/                     # React + Vite Frontend Dashboard
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx              # Navigation, mode switcher, health indicator
│   │   │   ├── StatsBar.jsx            # Real-time KPI metric cards
│   │   │   ├── MapView.jsx             # Leaflet interactive map with custom pulsing pins
│   │   │   ├── DetectionStudio.jsx     # Dashcam stream, webcam, and upload studio
│   │   │   ├── TicketList.jsx          # Searchable, filterable ticket directory
│   │   │   ├── TicketDetailModal.jsx   # Side-by-side original vs AI annotated viewer & status update
│   │   │   ├── CivicDirectoryModal.jsx # Nodal directory of NHAI, PWD, MCD, NDMC
│   │   │   └── AnalyticsView.jsx       # Severity charts & live dispatch logs
│   │   ├── services/api.js             # REST API client
│   │   ├── index.css                   # Custom modern dark-mode design system
│   │   ├── App.jsx                     # Main application state orchestrator
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js                  # Includes API proxy to backend
├── server/                     # Node.js + Express REST API
│   ├── models/
│   │   └── Pothole.js                  # Mongoose GeoJSON Schema + persistent fallback store
│   ├── routes/
│   │   └── potholes.js                 # REST API endpoints (/detect, /stats, /status, etc.)
│   ├── services/
│   │   ├── aiDetectionService.js       # AI inference client & computer vision analyzer
│   │   ├── authorityMapper.js          # Geo-resolution & road classification engine
│   │   └── notificationService.js      # Automated civic ticket dispatch & webhook logger
│   ├── scripts/
│   │   └── createSampleImages.js       # Generates sample road & pothole images
│   ├── uploads/                        # Uploaded and AI-annotated image storage
│   ├── package.json
│   └── server.js                       # Express server entry point
├── ai_service/                 # Optional Python FastAPI Deep Learning Service
│   ├── app.py                          # FastAPI endpoint with YOLOv8 inference
│   └── requirements.txt
└── README.md
```

---

## How to Run the Project

### Prerequisites
- **Node.js** (v18 or higher; v24 recommended)
- **npm** (v9 or higher)
- **MongoDB** (optional; if MongoDB is not running locally, the server automatically activates persistent storage mode without crashing)
- **Python 3.10+** (optional; required only if running the standalone Python FastAPI AI service)

---

## Environment Variables (`server/.env`)

| Variable | Default Value | Description |
|---|---|---|
| `PORT` | `5000` | Port on which the Express REST API backend listens |
| `NODE_ENV` | `development` | Runtime environment (`development` or `production`) |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/potholedb` | MongoDB connection URI (local instance or MongoDB Atlas) |
| `AI_SERVICE_URL` | `http://127.0.0.1:8000/detect` | URL to the optional standalone Python FastAPI / YOLOv8 inference service |

> **Graceful Fallbacks Built-in**:
> - If `MONGODB_URI` cannot be reached or MongoDB is stopped, the server automatically activates its zero-configuration persistent JSON store in `server/data/potholes.json` without failing.
> - If `AI_SERVICE_URL` is offline, the backend automatically uses its integrated computer vision analyzer.

---

### Step 1: Start the Backend Server

1. Open a terminal in the project root:
   ```bash
   cd server
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Start the backend:
   ```bash
   npm start
   ```
   *The backend will start at `http://localhost:5000` and seed initial realistic pothole incidents across Delhi-NCR.*

---

### Step 2: Start the Frontend Application

1. Open a second terminal:
   ```bash
   cd client
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Launch the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

### Step 3 (Optional): Start the Python AI Microservice

If you wish to run the dedicated Python YOLO microservice:
```bash
cd ai_service
pip install -r requirements.txt
python app.py
```
*The FastAPI service runs on `http://127.0.0.1:8000`. The Node.js backend automatically detects it and delegates inference.*

---

<img width="1903" height="890" alt="image" src="https://github.com/user-attachments/assets/207959eb-6f5f-4c24-846b-f09c0cbfb6ed" />


<img width="1842" height="827" alt="image" src="https://github.com/user-attachments/assets/2db74a20-52d1-4d35-8ac1-440c4e48a31f" />



## End-to-End Workflow Demonstration

1. **Dashboard Map View**:
   - Inspect the interactive Leaflet map centered on Delhi NCR.
   - Glowing markers represent potholes color-coded by severity:
     - **Red**: Critical (Expressways / High Speed Hazards)
     - **Orange**: High Severity
     - **Yellow**: Medium Severity
     - **Green**: Resolved / Repaired
   - Click any marker to view the popup with the thumbnail, severity score, and assigned civic authority.
   - Click **Inspect Full Ticket** to view the original photo, AI bounding boxes, SLA target, and resolution audit log.

2. **Detection Studio & Auto-Dispatch**:
   - Switch to the **Detection Studio** tab in the top navigation.
   - Select **Image Upload**, **Dashcam Stream**, or **Live Camera**.
   - Click one of the quick test presets (e.g. **NH-48 Expressway &rarr; NHAI** or **AIIMS Ring Road &rarr; PWD** or **Saket &rarr; MCD South**).
   - Click **Run AI Detection & Auto-Report**.
   - The AI identifies the pothole, calculates the road area %, assigns the exact civic body based on road class, and dispatches an automated notice.

3. **Lifecycle Resolution Workflow**:
   - Open any ticket and transition the status from **Reported** &rarr; **Acknowledged** &rarr; **In Progress** &rarr; **Resolved**.
   - Upload an optional repair proof photo.
   - The status updates immediately across the database, map, and analytics.

---


