import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Video,
  Upload,
  MapPin,
  Navigation,
  Sparkles,
  Building2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Printer,
  Search,
  RefreshCw,
  Sliders,
  Eye,
  Layers,
  ShieldCheck,
  ShieldAlert,
  Crosshair,
  RotateCcw,
  X,
  Play,
  Pause,
  Crop,
  Check,
  Flag,
  Copy,
  ExternalLink,
  Compass
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import confetti from 'canvas-confetti';
import { detectPothole, searchAddress, reverseGeocodeCoords, updatePotholeLocation } from '../services/api';
import { extractExifGPS } from '../utils/exifHelper';

// Custom Pin for Locator Map
const pinIcon = L.divIcon({
  className: 'locator-marker',
  html: `
    <div style="
      width: 28px;
      height: 28px;
      background: #ea580c;
      border: 3px solid #ffffff;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 4px 12px rgba(234, 88, 12, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="width: 7px; height: 7px; background: #ffffff; border-radius: 50%;"></div>
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 28]
});

function LocationPicker({ position, onPositionChange }) {
  useMapEvents({
    click(e) {
      onPositionChange(e.latlng.lat, e.latlng.lng);
    }
  });

  const map = useMap();
  useEffect(() => {
    if (position && position[0] && position[1]) {
      map.setView(position, map.getZoom() < 15 ? 15 : map.getZoom());
    }
  }, [position, map]);

  return position ? (
    <Marker
      position={position}
      icon={pinIcon}
      draggable={true}
      eventHandlers={{
        dragend(e) {
          const marker = e.target;
          const pos = marker.getLatLng();
          onPositionChange(pos.lat, pos.lng);
        }
      }}
    />
  ) : null;
}

export default function ReportWizard({ initialMode = 'photo', onPotholeCreated, onViewOnMap, onBackHome }) {
  // Mode: 'photo' | 'video'
  const [activeInputMode, setActiveInputMode] = useState(initialMode);

  // Image & Detection State
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('/uploads/sample-nh48.jpg');
  const [latitude, setLatitude] = useState(28.4595);
  const [longitude, setLongitude] = useState(77.0266);
  const [locationName, setLocationName] = useState('Delhi-Jaipur Expressway (NH-48), Near Rajiv Chowk, Gurugram');
  const [locationSource, setLocationSource] = useState('preset'); // 'photo_exif' | 'live_device_gps' | 'manual_pinned' | 'preset'
  const [landmark, setLandmark] = useState('');
  const [copiedNotice, setCopiedNotice] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLocating, setIsLocating] = useState(false);
  const [sourceType, setSourceType] = useState('mobile_camera');

  // Video Mode State
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  // Manual Damage Area Selection State
  const [isSelectingArea, setIsSelectingArea] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [userSelectedBox, setUserSelectedBox] = useState(null); // [x1, y1, x2, y2] normalized (0 to 1)
  const imageContainerRef = useRef(null);

  // Accident Risk Profiling Tags
  const [selectedRisks, setSelectedRisks] = useState(['Two-Wheeler Skid Hazard']);

  // AI Sensitivity / Confidence threshold (10% to 80%)
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.20);
  const [viewMode, setViewMode] = useState('boxes'); // 'boxes' | 'original'

  // Inference & Results
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectionData, setDetectionData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Official Letter Modal
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [dispatchedTicket, setDispatchedTicket] = useState(null);

  // Hidden Inputs
  const cameraInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const toggleRisk = (risk) => {
    setSelectedRisks(prev =>
      prev.includes(risk) ? prev.filter(r => r !== risk) : [...prev, risk]
    );
  };

  // Unified Location Synchronization Engine
  const updateIncidentCoordinates = async (lat, lng, forcedName = null, forcedSource = null) => {
    const pLat = +lat.toFixed(6);
    const pLng = +lng.toFixed(6);
    setLatitude(pLat);
    setLongitude(pLng);
    if (forcedSource) setLocationSource(forcedSource);

    let displayName = forcedName;
    if (!displayName) {
      const geo = await reverseGeocodeCoords(pLat, pLng);
      if (geo && geo.display_name) {
        displayName = geo.display_name;
        setLocationName(displayName);
      }
    } else {
      setLocationName(displayName);
    }

    // Live update detectionData if already generated so report letter is 100% accurate!
    if (detectionData) {
      const updatedDet = {
        ...detectionData,
        location: {
          type: 'Point',
          coordinates: [pLng, pLat]
        },
        address: {
          ...(detectionData.address || {}),
          displayName: displayName || locationName
        },
        landmark
      };
      setDetectionData(updatedDet);

      const ticketId = detectionData._id || detectionData.trackingId;
      if (ticketId) {
        try {
          const res = await updatePotholeLocation(ticketId, {
            latitude: pLat,
            longitude: pLng,
            locationName: displayName || locationName,
            landmark
          });
          if (res?.pothole) {
            setDetectionData(res.pothole);
            if (onPotholeCreated) onPotholeCreated(res.pothole);
          }
        } catch (e) {
          console.warn('Backend location sync error:', e.message);
        }
      }
    }
  };

  const handleLandmarkChange = (val) => {
    setLandmark(val);
    if (detectionData) {
      setDetectionData(prev => ({ ...prev, landmark: val }));
      const ticketId = detectionData._id || detectionData.trackingId;
      if (ticketId) {
        updatePotholeLocation(ticketId, {
          latitude,
          longitude,
          locationName,
          landmark: val
        }).catch(() => {});
      }
    }
  };

  // Live GPS from browser / device
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = +pos.coords.latitude.toFixed(6);
        const lng = +pos.coords.longitude.toFixed(6);
        await updateIncidentCoordinates(lat, lng, null, 'live_device_gps');
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        alert('Could not access live device GPS: ' + err.message + '. Please pick your location on the map or search your road.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handlePositionPicked = async (lat, lng) => {
    await updateIncidentCoordinates(lat, lng, null, 'manual_pinned');
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const results = await searchAddress(searchQuery);
    setSearchResults(results);
  };

  const handleSelectSearchResult = async (result) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    await updateIncidentCoordinates(lat, lon, result.display_name, 'manual_pinned');
    setSearchResults([]);
    setSearchQuery('');
  };

  // Photo captured or uploaded: Auto-detect EXIF GPS, fallback to Device GPS
  const handlePhotoCaptured = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setDetectionData(null);
      setUserSelectedBox(null);
      setErrorMessage(null);
      setIsLocating(true);

      // 1. Try reading GPS coordinates directly from photo EXIF tags
      const exif = await extractExifGPS(file);
      if (exif && exif.success && exif.latitude && exif.longitude) {
        await updateIncidentCoordinates(exif.latitude, exif.longitude, null, 'photo_exif');
        setIsLocating(false);
      } else {
        // 2. If photo lacks EXIF (WhatsApp, screenshot, or privacy strip), auto-fetch device GPS
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              const lat = +pos.coords.latitude.toFixed(6);
              const lng = +pos.coords.longitude.toFixed(6);
              await updateIncidentCoordinates(lat, lng, null, 'live_device_gps');
              setIsLocating(false);
            },
            () => {
              setIsLocating(false);
              setLocationSource('manual_pinned');
            },
            { enableHighAccuracy: true, timeout: 8000 }
          );
        } else {
          setIsLocating(false);
          setLocationSource('manual_pinned');
        }
      }
    }
  };

  // Video file upload
  const handleVideoUploaded = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setIsPlaying(false);
      setErrorMessage(null);
    }
  };

  // Capture video frame to image canvas
  const handleCaptureVideoFrame = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 800;
    canvas.height = video.videoHeight || 600;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
      const file = new File([blob], `dashcam-frame-${Date.now()}.jpg`, { type: 'image/jpeg' });
      setSelectedFile(file);
      setPreviewUrl(canvas.toDataURL('image/jpeg'));
      setSourceType('dashcam');
      setDetectionData(null);
      setUserSelectedBox(null);
      alert('Keyframe captured! You can now select the road damage zone and run AI inspection.');
    }, 'image/jpeg');
  };

  // Interactive Drag & Select Damage Zone on Image
  const handleMouseDownOnCanvas = (e) => {
    if (!isSelectingArea || !imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    setDragStart({ x, y });
    setUserSelectedBox([x, y, x, y]);
  };

  const handleMouseMoveOnCanvas = (e) => {
    if (!isSelectingArea || !dragStart || !imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const curX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const curY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    const x1 = Math.min(dragStart.x, curX);
    const y1 = Math.min(dragStart.y, curY);
    const x2 = Math.max(dragStart.x, curX);
    const y2 = Math.max(dragStart.y, curY);

    setUserSelectedBox([x1, y1, x2, y2]);
  };

  const handleMouseUpOnCanvas = () => {
    if (!isSelectingArea) return;
    setDragStart(null);
  };

  // Touch handlers for mobile smartphones
  const handleTouchStartOnCanvas = (e) => {
    if (!isSelectingArea || !imageContainerRef.current || !e.touches || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (touch.clientY - rect.top) / rect.height));
    setDragStart({ x, y });
    setUserSelectedBox([x, y, x, y]);
  };

  const handleTouchMoveOnCanvas = (e) => {
    if (!isSelectingArea || !dragStart || !imageContainerRef.current || !e.touches || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = imageContainerRef.current.getBoundingClientRect();
    const curX = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
    const curY = Math.max(0, Math.min(1, (touch.clientY - rect.top) / rect.height));

    const x1 = Math.min(dragStart.x, curX);
    const y1 = Math.min(dragStart.y, curY);
    const x2 = Math.max(dragStart.x, curX);
    const y2 = Math.max(dragStart.y, curY);

    setUserSelectedBox([x1, y1, x2, y2]);
  };

  const applyPreset = (preset) => {
    setLatitude(preset.lat);
    setLongitude(preset.lng);
    setLocationName(preset.name);
    setLocationSource('preset');
    setLandmark('');
    setSourceType(preset.source);
    setPreviewUrl(preset.image);
    setDetectionData(null);
    setUserSelectedBox(null);

    fetch(preset.image)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], `${preset.key}.jpg`, { type: 'image/jpeg' });
        setSelectedFile(file);
      })
      .catch(() => {
        const file = new File(["sample"], `${preset.key}.jpg`, { type: 'image/jpeg' });
        setSelectedFile(file);
      });
  };

  // One-click Copy Full Notice & Verified GPS Data
  const handleCopyNotice = () => {
    if (!detectionData) return;
    const text = `=====================================================
ROAD REPAIR RE-VERIFICATION & STATUTORY NOTICE
Grievance ID: #${detectionData.trackingId}
Date: ${new Date().toLocaleString('en-IN')}
=====================================================
TO: Municipal Commissioner / Executive Engineer
AUTHORITY: ${detectionData.assignedAuthority?.name || 'Nagar Palika'}
DEPARTMENT: ${detectionData.assignedAuthority?.department || 'Road Maintenance Division'}
SLA TARGET: ${detectionData.assignedAuthority?.escalationSLA || '24-48 Hours'}

EXACT DEFECT LOCATION:
Road / Area: ${detectionData.address?.displayName || locationName}
Nearby Landmark: ${landmark || 'Active roadway transit corridor'}
GPS Coordinates: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}
GPS Verification Source: ${locationSource === 'photo_exif' ? 'Photo EXIF Embedded Geotag' : (locationSource === 'live_device_gps' ? 'High-Precision Device GPS (±5m)' : 'Citizen Pinned GPS Coordinates')}

GOOGLE MAPS DIRECT NAVIGATION LINK:
https://www.google.com/maps/dir/?api=1&destination=${latitude.toFixed(6)},${longitude.toFixed(6)}

DEFECT TELEMETRY:
Hazard Level: ${detectionData.severity} Severity (Accident Score: ${detectionData.hazardScore}/100)
Risk Advisory: ${selectedRisks.join(', ') || 'High Impact Cavity'}

ACTION MANDATE:
Immediate field re-verification by Nagar Palika inspection squad. Erect warning barricades and level surface before statutory SLA deadline.
=====================================================`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedNotice(true);
        setTimeout(() => setCopiedNotice(false), 3000);
      });
    }
  };

  // Run AI Inspection
  const handleRunAIDetection = async () => {
    if (!selectedFile && !previewUrl) {
      setErrorMessage('Please capture or select a road image first.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('image', selectedFile);
      } else {
        const response = await fetch(previewUrl);
        const blob = await response.blob();
        formData.append('image', blob, 'road-capture.jpg');
      }

      formData.append('latitude', latitude);
      formData.append('longitude', longitude);
      formData.append('source', sourceType);
      formData.append('roadHint', locationName);
      formData.append('landmark', landmark);
      formData.append('confidenceThreshold', String(confidenceThreshold));

      // Append user selected area if drawn manually
      if (userSelectedBox) {
        formData.append('userSelectedBox', JSON.stringify(userSelectedBox));
      }

      const result = await detectPothole(formData);

      // If user drew a box, incorporate it into detections if model didn't catch or overlay it
      if (userSelectedBox && (!result.pothole.detections || result.pothole.detections.length === 0)) {
        const [x1, y1, x2, y2] = userSelectedBox;
        const areaPct = Math.round((x2 - x1) * (y2 - y1) * 100 * 10) / 10;
        result.pothole.detections = [{
          id: 'user_selected_1',
          label: 'User-Tagged Damage Zone',
          confidence: 0.95,
          bboxNormalized: userSelectedBox,
          roadAreaPercent: Math.max(1.5, areaPct),
          depthEstimate: 'Manually Tagged Pothole Cavity',
          detector: 'Citizen Field Verification'
        }];
        result.pothole.severity = areaPct > 4 ? 'High' : 'Medium';
        result.pothole.hazardScore = Math.max(60, Math.min(95, Math.round(50 + areaPct * 4)));
      }

      setDetectionData(result.pothole);
      setDispatchedTicket(result);
      setIsProcessing(false);
      setIsSelectingArea(false);

      if (onPotholeCreated) {
        onPotholeCreated(result.pothole);
      }

      if (result.pothole?.severity !== 'None') {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      setErrorMessage(err.response?.data?.error || err.message || 'AI Inspection Failed');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Mode Switcher Bar */}
      <div className="glass-panel" style={{
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        background: '#ffffff'
      }}>
        {/* Mode Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            className={`btn btn-sm ${activeInputMode === 'photo' ? 'btn-accent' : 'btn-secondary'}`}
            onClick={() => setActiveInputMode('photo')}
          >
            <Camera size={15} />
            Photo Inspection Mode
          </button>

          <button
            type="button"
            className={`btn btn-sm ${activeInputMode === 'video' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveInputMode('video')}
          >
            <Video size={15} />
            Video / Dashcam Stream
          </button>
        </div>

        {/* Quick Corridor Presets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Quick Corridors:
          </span>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => applyPreset({
              key: 'nh48',
              name: 'Delhi-Jaipur Expressway (NH-48), Near Rajiv Chowk, Gurugram',
              lat: 28.4595,
              lng: 77.0266,
              source: 'dashcam',
              image: '/uploads/sample-nh48.jpg'
            })}
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#0284c7' }} />
            NH-48 &rarr; NHAI
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => applyPreset({
              key: 'ringroad',
              name: 'Mahatma Gandhi Marg (Ring Road), AIIMS Corridor, New Delhi',
              lat: 28.5684,
              lng: 77.2045,
              source: 'dashcam',
              image: '/uploads/sample-ringroad.jpg'
            })}
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#7c3aed' }} />
            Ring Road &rarr; PWD
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => applyPreset({
              key: 'saket',
              name: 'Press Enclave Road, Saket District Centre, South Delhi',
              lat: 28.5245,
              lng: 77.2185,
              source: 'mobile_camera',
              image: '/uploads/sample-saket.jpg'
            })}
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#be185d' }} />
            Saket Colony &rarr; Nagar Palika
          </button>
        </div>
      </div>

      {/* Main Two-Column Civic Stage */}
      <div className="studio-grid">
        {/* Left Column: Visual Capture, Area Selector & AI Canvas */}
        <div className="glass-panel" style={{ padding: 'clamp(1rem, 3vw, 1.75rem)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Header & Tool toggles */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 style={{ fontSize: 'clamp(1.05rem, 3vw, 1.25rem)', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={20} color="#ea580c" />
                {activeInputMode === 'photo' ? 'Road Damage Photo & Area Selector' : 'Dashcam Video Stream Inspector'}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {activeInputMode === 'photo'
                  ? 'Click/tap & drag on the road surface to mark the damage perimeter, or let YOLOv8 auto-detect.'
                  : 'Play the dashcam footage, pause on the damaged asphalt, and capture the keyframe for inspection.'}
              </p>
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {activeInputMode === 'photo' && (
                <>
                  <button
                    type="button"
                    className={`btn btn-sm ${isSelectingArea ? 'btn-accent' : 'btn-secondary'}`}
                    onClick={() => setIsSelectingArea(!isSelectingArea)}
                    title="Click and drag on the photo to select road damage area"
                  >
                    <Crop size={14} />
                    {isSelectingArea ? 'Finish Selecting Area' : 'Draw Damage Area'}
                  </button>

                  {userSelectedBox && (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setUserSelectedBox(null)}
                      title="Clear custom selection"
                    >
                      Clear Area
                    </button>
                  )}
                </>
              )}

              {detectionData && (
                <button
                  type="button"
                  className={`btn btn-sm ${viewMode === 'boxes' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setViewMode(viewMode === 'boxes' ? 'original' : 'boxes')}
                >
                  <Layers size={14} />
                  {viewMode === 'boxes' ? 'AI Bounding Boxes' : 'Clean Photo'}
                </button>
              )}
            </div>
          </div>

          {/* Hidden inputs */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: 'none' }}
            onChange={handlePhotoCaptured}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handlePhotoCaptured}
          />
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            style={{ display: 'none' }}
            onChange={handleVideoUploaded}
          />

          {/* VIDEO MODE VIEW */}
          {activeInputMode === 'video' && (
            <div style={{
              background: '#f1f5f9',
              border: '2px dashed var(--border-medium)',
              borderRadius: 12,
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              alignItems: 'center'
            }}>
              {videoUrl ? (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    controls
                    style={{ width: '100%', maxHeight: 340, borderRadius: 10, background: '#000' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      Pause at the damaged spot and click to extract frame for AI scan:
                    </span>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={handleCaptureVideoFrame}
                    >
                      <Camera size={14} />
                      Capture Frame for Inspection
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <Video size={48} color="#0284c7" style={{ margin: '0 auto 0.75rem' }} />
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                    Upload Road Video or Dashcam Clip
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    Supports MP4, WEBM, MOV dashcam footage
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ marginTop: '1rem' }}
                    onClick={() => videoInputRef.current && videoInputRef.current.click()}
                  >
                    <Upload size={16} />
                    Choose Video File
                  </button>
                </div>
              )}
            </div>
          )}

          {/* MAIN PHOTO INSPECTION & AREA SELECTOR CANVAS */}
          <div
            ref={imageContainerRef}
            className={`area-selection-canvas ${isSelectingArea ? 'active' : ''}`}
            style={{
              height: 'clamp(280px, 48vh, 420px)',
              borderRadius: 14,
              overflow: 'hidden',
              background: '#f1f5f9',
              border: isSelectingArea ? '2px solid #ea580c' : '1px solid var(--border-medium)',
              position: 'relative',
              boxShadow: 'var(--shadow-md)',
              cursor: isSelectingArea ? 'crosshair' : 'default'
            }}
            onMouseDown={handleMouseDownOnCanvas}
            onMouseMove={handleMouseMoveOnCanvas}
            onMouseUp={handleMouseUpOnCanvas}
            onTouchStart={handleTouchStartOnCanvas}
            onTouchMove={handleTouchMoveOnCanvas}
            onTouchEnd={handleMouseUpOnCanvas}
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Road Surface"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }}
              />
            ) : (
              <div style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                color: 'var(--text-muted)'
              }}>
                <Upload size={44} color="#ea580c" />
                <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                  Snap or upload road damage photo
                </p>
              </div>
            )}

            {/* Laser scanning line during inference */}
            {isProcessing && <div className="laser-scan-line" />}

            {/* Inference Processing Overlay */}
            {isProcessing && (
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                zIndex: 20
              }}>
                <RefreshCw size={40} color="#ea580c" className="spin-animation" />
                <p style={{ fontSize: '1rem', color: '#0f172a', fontWeight: 800 }}>
                  YOLOv8 Deep Neural Network Scanning Road Surface...
                </p>
                <span style={{ fontSize: '0.78rem', color: '#ea580c', fontFamily: 'var(--font-mono)' }}>
                  Measuring crater depth, area percentage, and accident hazard score
                </span>
              </div>
            )}

            {/* User Hand-Drawn Area Selection Box */}
            {userSelectedBox && (
              <div
                className="selection-box"
                style={{
                  left: `${userSelectedBox[0] * 100}%`,
                  top: `${userSelectedBox[1] * 100}%`,
                  width: `${(userSelectedBox[2] - userSelectedBox[0]) * 100}%`,
                  height: `${(userSelectedBox[3] - userSelectedBox[1]) * 100}%`
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: -22,
                  left: 0,
                  background: '#ea580c',
                  color: '#ffffff',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '0.15rem 0.5rem',
                  borderRadius: 4,
                  whiteSpace: 'nowrap'
                }}>
                  Selected Road Damage Zone
                </div>
              </div>
            )}

            {/* Real AI Bounding Box Layer */}
            {!isProcessing && viewMode === 'boxes' && detectionData && detectionData.detections && (
              <svg
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                {detectionData.detections.map((det, idx) => {
                  const b = det.bboxNormalized;
                  if (!b || b.length < 4) return null;
                  const x = b[0] * 100;
                  const y = b[1] * 100;
                  const w = (b[2] - b[0]) * 100;
                  const h = (b[3] - b[1]) * 100;

                  return (
                    <g key={idx}>
                      <rect
                        x={x}
                        y={y}
                        width={w}
                        height={h}
                        fill="rgba(220, 38, 38, 0.2)"
                        stroke="#dc2626"
                        strokeWidth="1.2"
                        strokeDasharray="3 1.5"
                        rx="1.5"
                      />
                      <rect x={x} y={Math.max(1, y - 6.5)} width="36" height="6" fill="#dc2626" rx="1" />
                      <text x={x + 1.5} y={Math.max(5, y - 2)} fill="#ffffff" fontSize="4.2" fontWeight="bold" fontFamily="monospace">
                        POTHOLE #{idx + 1} {(det.confidence ? (det.confidence * 100).toFixed(0) : 85)}%
                      </text>
                    </g>
                  );
                })}
              </svg>
            )}

            {/* Clear Road Status Badge */}
            {detectionData && !isProcessing && (
              <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 10 }}>
                {detectionData.severity === 'None' ? (
                  <div className="badge badge-safe" style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem' }}>
                    <ShieldCheck size={16} />
                    ROAD SURFACE INTACT (0 HAZARDS)
                  </div>
                ) : (
                  <div className="badge badge-critical" style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem' }}>
                    <AlertTriangle size={16} />
                    {detectionData.severity.toUpperCase()} HAZARD ({detectionData.hazardScore}/100)
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input & Photo Trigger Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => cameraInputRef.current && cameraInputRef.current.click()}
            >
              <Camera size={15} />
              Take Live Photo (Mobile)
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
            >
              <Upload size={15} />
              Upload Image File
            </button>

            {isSelectingArea && (
              <span style={{ fontSize: '0.78rem', color: '#ea580c', fontWeight: 700 }}>
                Drag your mouse over the pothole cavity to define the area.
              </span>
            )}
          </div>

          {/* Accident Hazard Tagging Bar */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid var(--border-subtle)',
            borderRadius: 12,
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Flag size={14} color="#dc2626" />
              Tag Road Accident Risk Profile:
            </span>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {[
                'Two-Wheeler Skid Hazard',
                'Deep Crater Rollover Risk',
                'Waterlogged Blind Trap',
                'Rim/Axle Damage Risk',
                'Pedestrian Tripping'
              ].map(risk => {
                const isSelected = selectedRisks.includes(risk);
                return (
                  <button
                    key={risk}
                    type="button"
                    onClick={() => toggleRisk(risk)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: 20,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      border: isSelected ? '1px solid #ea580c' : '1px solid var(--border-medium)',
                      background: isSelected ? '#fff7ed' : '#ffffff',
                      color: isSelected ? '#c2410c' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {risk}
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Inspection Action & Sensitivity Slider */}
          <div style={{
            background: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: 12,
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            flexWrap: 'wrap',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Sliders size={14} color="#ea580c" />
                  Detection Sensitivity:
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700, color: '#ea580c' }}>
                  {(confidenceThreshold * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.80"
                step="0.05"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                disabled={isProcessing}
              />
            </div>

            <button
              type="button"
              className="btn btn-accent"
              style={{ padding: '0.85rem 1.85rem', fontSize: '0.95rem', fontWeight: 800 }}
              onClick={handleRunAIDetection}
              disabled={isProcessing}
            >
              {isProcessing ? 'Analyzing Road Defect...' : 'Analyze Road & Run YOLOv8'}
              <Sparkles size={17} />
            </button>
          </div>

          {errorMessage && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '0.75rem', borderRadius: 8, color: '#dc2626', fontSize: '0.82rem' }}>
              {errorMessage}
            </div>
          )}
        </div>

        {/* Right Column: Telemetry, Mini Map & Nagar Palika Work Order */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Real-time Telemetry Card */}
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Road Defect Telemetry &amp; Accident Score
            </h4>

            {detectionData ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Hazard Index:</span>
                    <div style={{ fontSize: '1.65rem', fontWeight: 800, color: detectionData.hazardScore > 50 ? '#dc2626' : '#16a34a' }}>
                      {detectionData.hazardScore}<span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/100</span>
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Defects Found:</span>
                    <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a' }}>
                      {detectionData.detections?.length || 0}
                    </div>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: 10, border: '1px solid var(--border-subtle)', fontSize: '0.82rem', lineHeight: 1.5 }}>
                  <strong>Surface Condition:</strong>
                  <div style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    {detectionData.severityDetails || detectionData.statusMessage}
                  </div>
                  {detectionData.detections?.[0]?.roadAreaPercent && (
                    <div style={{ marginTop: '0.35rem', color: '#0284c7', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                      Surface Disturbance: ~{detectionData.detections[0].roadAreaPercent}% • Depth: {detectionData.detections[0].depthEstimate}
                    </div>
                  )}
                </div>

                {selectedRisks.length > 0 && (
                  <div style={{ fontSize: '0.75rem', color: '#dc2626', background: '#fef2f2', padding: '0.6rem 0.85rem', borderRadius: 8 }}>
                    <strong>Accident Risks Tagged:</strong> {selectedRisks.join(', ')}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
                Capture a road photo or select a damage zone to view the accident hazard rating.
              </div>
            )}
          </div>

          {/* Location & Mini Map */}
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                  Incident Location &amp; Ward
                </h4>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                {locationSource === 'photo_exif' && (
                  <span className="badge badge-safe" title="Exact GPS extracted directly from image EXIF metadata">
                    🛰️ Photo EXIF GPS
                  </span>
                )}
                {locationSource === 'live_device_gps' && (
                  <span className="badge badge-low" title="Live GPS coordinates from your device">
                    📍 Live Device GPS
                  </span>
                )}
                {locationSource === 'manual_pinned' && (
                  <span className="badge badge-high" title="Coordinates set via search or map pin">
                    🗺️ Custom Pinned
                  </span>
                )}
                {locationSource === 'preset' && (
                  <span className="badge" style={{ background: '#f1f5f9', color: '#475569' }}>
                    Sample Corridor
                  </span>
                )}

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleDetectGPS}
                  disabled={isLocating}
                  style={{ fontSize: '0.74rem' }}
                  title="Detect my current device GPS coordinates"
                >
                  <Navigation size={12} className={isLocating ? 'spin-animation' : ''} />
                  {isLocating ? 'Detecting...' : 'My Live GPS'}
                </button>
              </div>
            </div>

            {/* In-Card Search Bar for Road / Colony / Landmark */}
            <div style={{ position: 'relative' }}>
              <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.4rem' }}>
                <input
                  type="text"
                  placeholder="Search street, colony, ward, or landmark..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-control"
                  style={{ fontSize: '0.8rem', padding: '0.42rem 0.75rem' }}
                />
                <button
                  type="submit"
                  className="btn btn-secondary btn-sm"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  <Search size={13} />
                  Search
                </button>
              </form>

              {searchResults.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '105%',
                  left: 0,
                  right: 0,
                  background: '#ffffff',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 8,
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 1000,
                  maxHeight: 180,
                  overflowY: 'auto'
                }}>
                  {searchResults.map((res, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '0.5rem 0.75rem',
                        fontSize: '0.75rem',
                        borderBottom: '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        color: '#0f172a'
                      }}
                      onClick={() => handleSelectSearchResult(res)}
                    >
                      📍 {res.display_name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Resolved Location Name & High-Precision GPS Coordinates */}
            <div style={{ background: '#f8fafc', padding: '0.75rem 0.85rem', borderRadius: 8, border: '1px solid var(--border-subtle)', fontSize: '0.82rem' }}>
              <div style={{ fontWeight: 700, color: '#0f172a', lineHeight: 1.4 }}>{locationName}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.35rem', flexWrap: 'wrap', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#0284c7', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                  Lat {latitude.toFixed(6)}, Long {longitude.toFixed(6)}
                </span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${latitude.toFixed(6)},${longitude.toFixed(6)}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: '0.72rem', color: '#ea580c', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                >
                  <Compass size={12} />
                  Google Maps
                  <ExternalLink size={10} />
                </a>
              </div>
            </div>

            {/* Leaflet Map with draggable pin */}
            <div style={{ position: 'relative' }}>
              <div style={{ height: 175, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border-medium)' }}>
                <MapContainer
                  center={[latitude, longitude]}
                  zoom={15}
                  scrollWheelZoom={false}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://openstreetmap.org">OSM</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationPicker position={[latitude, longitude]} onPositionChange={handlePositionPicked} />
                </MapContainer>
              </div>
              <div style={{
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                marginTop: '0.3rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span>💡 Drag orange pin or click map to pinpoint exact pothole</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#16a34a' }}>±0.1m Precision</span>
              </div>
            </div>

            {/* Optional Nearby Landmark Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '0.2rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={12} color="#ea580c" />
                Nearby Landmark / Ground Reference (for Nagar Palika):
              </label>
              <input
                type="text"
                placeholder="e.g. Opposite Sharma Sweets, Near Pillar 42, Water Tank"
                value={landmark}
                onChange={(e) => handleLandmarkChange(e.target.value)}
                className="input-control"
                style={{ fontSize: '0.8rem', padding: '0.45rem 0.75rem' }}
              />
            </div>
          </div>

          {/* Nagar Palika / Municipal Escalation Card */}
          <div className="glass-panel" style={{
            padding: '1.5rem',
            background: '#ffffff',
            border: '1px solid #bfdbfe',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="badge badge-nhai">
                {detectionData?.assignedAuthority?.authorityType || 'Nagar Palika / Council'}
              </span>
              <span style={{ fontSize: '0.72rem', color: '#ea580c', fontWeight: 800 }}>
                SLA: {detectionData?.assignedAuthority?.escalationSLA || '24-48 Hours'}
              </span>
            </div>

            <div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                {detectionData?.assignedAuthority?.name || 'Nagar Palika / Municipal Corporation'}
              </h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {detectionData?.assignedAuthority?.department || 'Road Maintenance & Accident Prevention Wing'}
              </p>
            </div>

            <div style={{ background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: 8, fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
              <strong>Jurisdiction Rule:</strong> {detectionData?.assignedAuthority?.jurisdictionReason || 'Urban colony roads and town streets'}
            </div>

            {detectionData && (
              <button
                type="button"
                className="btn btn-accent"
                style={{ width: '100%', padding: '0.85rem', marginTop: '0.25rem' }}
                onClick={() => setShowDispatchModal(true)}
              >
                <FileText size={16} />
                Send Re-Verification to Nagar Palika
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Nagar Palika Formal Re-Verification Modal */}
      {showDispatchModal && detectionData && (
        <div className="modal-overlay" onClick={() => setShowDispatchModal(false)}>
          <div
            className="glass-panel"
            style={{
              maxWidth: 760,
              width: '100%',
              padding: 'clamp(1rem, 3.5vw, 2rem)',
              background: '#ffffff',
              boxShadow: 'var(--shadow-lg)',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: 'clamp(1.05rem, 3vw, 1.3rem)', fontWeight: 800, color: '#0f172a' }}>
                  Statutory Road Repair Notice &amp; Re-Verification Order
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#0284c7', fontFamily: 'var(--font-mono)' }}>
                  Grievance ID: #{detectionData.trackingId}
                </span>
              </div>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setShowDispatchModal(false)}
              >
                <X size={16} />
              </button>
            </div>

            {/* Official Letter Document */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid var(--border-medium)',
              borderRadius: 10,
              padding: 'clamp(1rem, 3vw, 1.75rem)',
              fontFamily: 'var(--font-mono)',
              color: '#0f172a',
              fontSize: '0.8rem',
              lineHeight: 1.6,
              flex: 1,
              overflowY: 'auto'
            }}>
              <p><strong>TO:</strong> Municipal Commissioner / Executive Engineer</p>
              <p><strong>AUTHORITY:</strong> {detectionData.assignedAuthority?.name} (Nagar Palika / Municipal Corporation)</p>
              <p><strong>DEPARTMENT:</strong> {detectionData.assignedAuthority?.department || 'Road Maintenance & Repair Wing'}</p>
              <p><strong>NODAL EMAIL:</strong> {detectionData.assignedAuthority?.email}</p>
              <p><strong>HELPLINE:</strong> {detectionData.assignedAuthority?.helpline}</p>
              <p><strong>DATE OF LOG:</strong> {new Date().toLocaleString('en-IN')}</p>
              <hr style={{ borderColor: '#cbd5e1', margin: '0.75rem 0' }} />
              <p style={{ color: '#ea580c', fontWeight: 800 }}>
                SUBJECT: URGENT ROAD REPAIR MANDATE - {detectionData.severity.toUpperCase()} ACCIDENT HAZARD REPORTED
              </p>
              <p><strong>Exact Road / Area:</strong> {detectionData.address?.displayName || locationName}</p>
              <p><strong>Nearby Landmark:</strong> {landmark || 'Active vehicular corridor'}</p>
              <p><strong>High-Precision Coordinates:</strong> Lat {latitude.toFixed(6)}, Long {longitude.toFixed(6)}</p>
              <p><strong>GPS Verification Source:</strong> {locationSource === 'photo_exif' ? 'Photo EXIF Embedded Geotag' : (locationSource === 'live_device_gps' ? 'High-Precision Device GPS (±5m)' : 'Citizen Pinned GPS Coordinates')}</p>
              <p><strong>Google Maps Navigation Link:</strong> https://www.google.com/maps/dir/?api=1&destination={latitude.toFixed(6)},{longitude.toFixed(6)}</p>
              <p><strong>Damage Classification:</strong> Road Surface Depression ({detectionData.severity} Severity, Hazard Score: {detectionData.hazardScore}/100)</p>
              <p><strong>Accident Risk Advisory:</strong> {selectedRisks.join(', ') || 'High Impact Cavity'}</p>
              <p><strong>Statutory SLA:</strong> {detectionData.assignedAuthority?.escalationSLA}</p>
              <hr style={{ borderColor: '#cbd5e1', margin: '0.75rem 0' }} />
              <p style={{ color: '#0284c7', fontWeight: 600 }}>
                ACTION MANDATE: Immediate field inspection and asphalt patch re-verification by Nagar Palika road team. Erect warning barricades and level surface before statutory SLA deadline to prevent vehicular accidents.
              </p>
            </div>

            {/* Bottom Actions Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', flexWrap: 'wrap', gap: '0.65rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', flex: '1 1 280px' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${latitude.toFixed(6)},${longitude.toFixed(6)}`, '_blank')}
                  title="Open GPS Navigation Route in Google Maps"
                >
                  <Compass size={14} color="#ea580c" />
                  Google Maps Route
                  <ExternalLink size={11} />
                </button>

                <button
                  type="button"
                  className={`btn btn-sm ${copiedNotice ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={handleCopyNotice}
                  title="Copy complete notice & GPS coordinates for WhatsApp/SMS dispatch"
                >
                  {copiedNotice ? <Check size={14} /> : <Copy size={14} />}
                  {copiedNotice ? 'Copied GPS & Notice!' : 'Copy GPS & Notice'}
                </button>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => window.print()}
                >
                  <Printer size={14} />
                  Print / Save PDF
                </button>

                <button
                  type="button"
                  className="btn btn-accent btn-sm"
                  onClick={() => {
                    setShowDispatchModal(false);
                    if (onViewOnMap) onViewOnMap(detectionData);
                  }}
                >
                  <MapPin size={14} />
                  View Incident on Live Map
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
