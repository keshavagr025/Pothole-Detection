# 🚀 MĀRG-DRISHTI • Complete Production Deployment Guide

This guide walks you through deploying the entire **MĀRG-DRISHTI** platform (Frontend + Express Backend API + MongoDB Atlas + Python YOLOv8 Service) to free or production cloud providers.

---

## 🏗️ Architecture Overview

```
[ Citizen & Officer Browser ]
           │
           ▼
[ Frontend Dashboard ] (Vercel / Netlify / Render)
           │
           ▼ (HTTPS REST API / JWT)
[ Backend Express Gateway ] (Render / Railway)
      ├── [ MongoDB Atlas ] (Live Cloud Database)
      └── [ Python AI Microservice ] (Render / Railway / Fallback CV)
```

---

## ⚡ STEP 1: Deploy Backend API (Render / Railway)

### Option A: Deploy on Render.com (Recommended Free Hosting)
1. Go to [Render.com](https://render.com) and create an account (Sign in with GitHub).
2. Click **"New +"** &rarr; **"Web Service"**.
3. Select your GitHub repository (`keshavagr025/Pothole-Detection`).
4. Configure the Web Service settings:
   - **Name**: `pothole-detection-server`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Under **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (or leave default)
   - `MONGODB_URI`: `mongodb+srv://keshavagr204_db_user:Z5oNsvEwIvkcWe1A@cluster0.piwsmug.mongodb.net/potholedb?retryWrites=true&w=majority`
   - `JWT_SECRET`: `your_super_secret_production_key_2026`
   - `AI_SERVICE_URL`: URL of your Python AI service (or leave blank to use the built-in CV engine)
6. Click **"Create Web Service"**.
7. Once deployed, copy your backend URL (e.g., `https://pothole-detection-server.onrender.com`).

---

## 🌐 STEP 2: Deploy Frontend Dashboard (Vercel)

### Option A: Deploy on Vercel (Fastest & Free)
1. Go to [Vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **"Add New..."** &rarr; **"Project"**.
3. Import `keshavagr025/Pothole-Detection`.
4. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click `Edit` and select **`client`**
5. Expand **Environment Variables**:
   - `VITE_API_URL`: Paste your deployed Backend URL (e.g. `https://pothole-detection-server.onrender.com` without trailing slash).
6. Click **"Deploy"**.
7. In ~60 seconds, your site will be live at `https://pothole-detection-client.vercel.app`!

---

## 🧠 STEP 3: Deploy Python AI Service (Optional)

> **Note**: If you do not deploy the Python service, the backend Node.js server automatically runs its built-in computer vision analyzer to detect road distress and calculate severity.

If you wish to host the dedicated YOLOv8 inference engine:
1. On **Render.com**, click **"New +"** &rarr; **"Web Service"**.
2. Select your repository.
3. Configure:
   - **Root Directory**: `ai_service`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`
4. Copy the service URL (e.g. `https://pothole-ai-service.onrender.com/detect`) and set it as `AI_SERVICE_URL` in your backend environment variables.

---

## 🗄️ STEP 4: MongoDB Atlas Verification

Your MongoDB Atlas database is already connected and synced:
- **Cluster**: `Cluster0`
- **Database**: `potholedb`
- **Collections**: `users` (16 profiles) and `potholes` (29 incident records).
- **Network Access**: Ensure `0.0.0.0/0` (Allow from anywhere) is active in MongoDB Atlas **Network Access** tab so cloud servers can query the database.

---

## ✅ Deployment Checklist

- [x] Database synced to MongoDB Atlas (`npm run sync:db` passed)
- [x] `vercel.json` configured for single-page application routing
- [x] `client/src/services/api.js` configured with `VITE_API_URL`
- [x] Backend CORS configured to accept incoming cloud domain requests
- [x] Production build passes cleanly with 0 errors (`npm run build`)
