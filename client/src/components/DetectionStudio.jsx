import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Camera,
  Video,
  Navigation,
  CheckCircle,
  AlertTriangle,
  Send,
  Sparkles,
  RefreshCw,
  Cpu,
  MapPin,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { detectPothole } from '../services/api';

export default function DetectionStudio({ onPotholeCreated, onViewTicket }) {
  const [activeMode, setActiveMode] = useState('upload'); // 'upload' | 'dashcam' | 'webcam'
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [latitude, setLatitude] = useState(28.5355);
  const [longitude, setLongitude] = useState(77.2100);
  const [roadHint, setRoadHint] = useState('');
  const [sourceType, setSourceType] = useState('dashcam');

  const [isProcessing, setIsProcessing] = useState(false);
  const [detectionResult, setDetectionResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Webcam stream state
  const videoRef = useRef(null);
  const [webcamActive, setWebcamActive] = useState(false);

  // Dashcam Video Simulation state
  const [dashcamPlaying, setDashcamPlaying] = useState(true);
  const [dashcamSpeed, setDashcamSpeed] = useState(48);
  const [simulatedScannerX, setSimulatedScannerX] = useState(50);

  // Auto-scanning loop for dashcam mode
  useEffect(() => {
    let interval;
    if (activeMode === 'dashcam' && dashcamPlaying) {
      interval = setInterval(() => {
        setDashcamSpeed(prev => Math.max(35, Math.min(65, prev + (Math.random() * 4 - 2))));
        setSimulatedScannerX(prev => (prev > 80 ? 20 : prev + 1.5));
      }, 200);
    }
    return () => clearInterval(interval);
  }, [activeMode, dashcamPlaying]);

  // Handle Webcam start/stop
  const startWebcam = async () => {
    try {
      setErrorMsg(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setWebcamActive(true);
      }
    } catch (err) {
      setErrorMsg(`Camera access error: ${err.message}. Please check browser permissions.`);
    }
  };

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setWebcamActive(false);
    }
  };

  useEffect(() => {
    if (activeMode === 'webcam') {
      startWebcam();
    } else {
      stopWebcam();
    }
    return () => stopWebcam();
  }, [activeMode]);

  // Capture frame from webcam
  const captureWebcamFrame = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
      const file = new File([blob], `mobile-capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
      setSelectedFile(file);
      setPreviewUrl(canvas.toDataURL('image/jpeg'));
      setSourceType('mobile_camera');
    }, 'image/jpeg');
  };

  // Get current device GPS
  const fetchCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setLatitude(+pos.coords.latitude.toFixed(5));
          setLongitude(+pos.coords.longitude.toFixed(5));
        },
        err => {
          alert(`Geolocation note: ${err.message}. Using high-precision corridor preset.`);
        }
      );
    }
  };

  // Preset scenarios to let user or reviewer test immediately
  const applyPreset = (preset) => {
    setLatitude(preset.lat);
    setLongitude(preset.lng);
    setRoadHint(preset.hint);
    setSourceType(preset.source);
    setPreviewUrl(preset.image);

    // Create a mock File object from the sample path so it can be uploaded
    fetch(preset.image)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], `${preset.key}.jpg`, { type: 'image/jpeg' });
        setSelectedFile(file);
      })
      .catch(() => {
        // Fallback: create an empty dummy file with correct name
        const file = new File(["sample"], `${preset.key}.jpg`, { type: 'image/jpeg' });
        setSelectedFile(file);
      });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrorMsg(null);
    }
  };

  const handleSubmitDetection = async () => {
    if (!selectedFile && !previewUrl) {
      setErrorMsg('Please select or capture a road image first.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);
    setDetectionResult(null);

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('image', selectedFile);
      } else {
        // Fallback if preset only
        const response = await fetch(previewUrl);
        const blob = await response.blob();
        formData.append('image', blob, 'preset-pothole.jpg');
      }

      formData.append('latitude', latitude);
      formData.append('longitude', longitude);
      formData.append('source', sourceType);
      formData.append('roadHint', roadHint);

      const res = await detectPothole(formData);

      setDetectionResult(res);
      setIsProcessing(false);

      // Trigger celebratory confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });

      if (onPotholeCreated) {
        onPotholeCreated(res.pothole);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.error || err.message || 'Detection failed');
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Studio Banner */}
      <div className="glass-panel" style={{
        padding: '1.25rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.8) 100%)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'rgba(234, 88, 12, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles size={20} color="var(--accent-orange)" />
            </span>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc' }}>
              AI Pothole Detection &amp; Civic Auto-Dispatch Studio
            </h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
            Ingest dashcam recordings, mobile camera snapshots, or live video. The AI classifies pothole dimensions,
            computes road hazard severity, and instantly dispatches an automated incident ticket to the designated civic authority (NHAI, PWD, MCD, or NDMC).
          </p>
        </div>

        {/* Ingestion Mode Switcher */}
        <div style={{
          display: 'flex',
          gap: '0.35rem',
          background: 'rgba(15, 23, 42, 0.8)',
          padding: '0.3rem',
          borderRadius: 10,
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            onClick={() => setActiveMode('upload')}
            className="btn btn-sm"
            style={{
              background: activeMode === 'upload' ? 'var(--accent-cyan)' : 'transparent',
              color: activeMode === 'upload' ? '#fff' : 'var(--text-secondary)'
            }}
          >
            <Upload size={14} />
            Image Upload
          </button>
          <button
            onClick={() => setActiveMode('dashcam')}
            className="btn btn-sm"
            style={{
              background: activeMode === 'dashcam' ? 'var(--accent-orange)' : 'transparent',
              color: activeMode === 'dashcam' ? '#fff' : 'var(--text-secondary)'
            }}
          >
            <Video size={14} />
            Dashcam Stream
          </button>
          <button
            onClick={() => setActiveMode('webcam')}
            className="btn btn-sm"
            style={{
              background: activeMode === 'webcam' ? 'var(--accent-green)' : 'transparent',
              color: activeMode === 'webcam' ? '#fff' : 'var(--text-secondary)'
            }}
          >
            <Camera size={14} />
            Live Camera
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid-dashboard">
        {/* Left Column: Media Ingestion & Viewport */}
        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Cpu size={18} color="var(--accent-cyan)" />
            Vision Input Stream
          </h3>

          {/* Mode 1: File Upload & Drag-and-Drop */}
          {activeMode === 'upload' && (
            <div>
              <div
                style={{
                  border: '2px dashed var(--border-medium)',
                  borderRadius: 12,
                  padding: '2rem 1.5rem',
                  textAlign: 'center',
                  background: 'rgba(15, 23, 42, 0.4)',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                  position: 'relative'
                }}
                onClick={() => document.getElementById('file-upload-input').click()}
              >
                <input
                  id="file-upload-input"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <Upload size={40} color="var(--accent-cyan)" style={{ margin: '0 auto 0.75rem' }} />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                  Click to Browse or Drag &amp; Drop Road Photo
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                  Supports High-Resolution JPEG, PNG, or Dashcam Keyframe (up to 25MB)
                </p>
              </div>

              {/* Quick Presets */}
              <div style={{ marginTop: '1rem' }}>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.5rem' }}>
                  OR TEST WITH ONE-CLICK CIVIC CORRIDOR PRESETS:
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ justifyContent: 'flex-start', fontSize: '0.76rem' }}
                    onClick={() => applyPreset({
                      key: 'nh48',
                      hint: 'NH-48 Expressway',
                      lat: 28.4982,
                      lng: 77.0864,
                      source: 'dashcam',
                      image: '/uploads/sample-nh48.jpg'
                    })}
                  >
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#38bdf8' }} />
                    NH-48 Expressway &rarr; NHAI
                  </button>

                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ justifyContent: 'flex-start', fontSize: '0.76rem' }}
                    onClick={() => applyPreset({
                      key: 'ringroad',
                      hint: 'Ring Road AIIMS Flyover',
                      lat: 28.5684,
                      lng: 77.2045,
                      source: 'dashcam',
                      image: '/uploads/sample-ringroad.jpg'
                    })}
                  >
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#a78bfa' }} />
                    AIIMS Ring Road &rarr; PWD
                  </button>

                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ justifyContent: 'flex-start', fontSize: '0.76rem' }}
                    onClick={() => applyPreset({
                      key: 'saket',
                      hint: 'Saket Press Enclave Colony Road',
                      lat: 28.5284,
                      lng: 77.2185,
                      source: 'mobile_camera',
                      image: '/uploads/sample-saket.jpg'
                    })}
                  >
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f472b6' }} />
                    Saket Colony &rarr; MCD South
                  </button>

                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ justifyContent: 'flex-start', fontSize: '0.76rem' }}
                    onClick={() => applyPreset({
                      key: 'cp',
                      hint: 'Barakhamba Road CP',
                      lat: 28.6315,
                      lng: 77.2280,
                      source: 'dashcam',
                      image: '/uploads/sample-cp.jpg'
                    })}
                  >
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2dd4bf' }} />
                    Connaught Place &rarr; NDMC
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: Dashcam Video Stream Simulator */}
          {activeMode === 'dashcam' && (
            <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', background: '#0b1329' }}>
              <div style={{ height: 320, position: 'relative' }}>
                <img
                  src="/uploads/sample-nh48.jpg"
                  alt="Dashcam video simulation"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Simulated AI Scanning Overlay */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: `${simulatedScannerX}%`,
                  width: '3px',
                  background: 'rgba(56, 189, 248, 0.8)',
                  boxShadow: '0 0 14px #38bdf8'
                }} />

                {/* HUD Overlay */}
                <div style={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  background: 'rgba(15, 23, 42, 0.85)',
                  padding: '0.4rem 0.8rem',
                  borderRadius: 6,
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                  color: '#38bdf8'
                }}>
                  REC [●] 1080P 60FPS • SPEED: {dashcamSpeed.toFixed(0)} KM/H • GPS: ACTIVE
                </div>

                <div style={{
                  position: 'absolute',
                  bottom: 12,
                  right: 12,
                  background: 'rgba(15, 23, 42, 0.85)',
                  padding: '0.4rem 0.8rem',
                  borderRadius: 6,
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                  color: '#f8fafc'
                }}>
                  ROAD DISTRESS SCAN: LIVE
                </div>
              </div>

              <div style={{
                padding: '0.85rem',
                background: 'rgba(15, 23, 42, 0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Dashcam live buffer processing road surface.
                </span>
                <button
                  className="btn btn-accent btn-sm"
                  onClick={() => {
                    applyPreset({
                      key: 'nh48',
                      hint: 'NH-48 Corridor Dashcam Feed',
                      lat: 28.4982,
                      lng: 77.0864,
                      source: 'dashcam',
                      image: '/uploads/sample-nh48.jpg'
                    });
                  }}
                >
                  <Sparkles size={14} />
                  Freeze Frame &amp; Auto-Detect
                </button>
              </div>
            </div>
          )}

          {/* Mode 3: Live Mobile / Web Camera */}
          {activeMode === 'webcam' && (
            <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', background: '#0b1329' }}>
              <div style={{ height: 320, position: 'relative', background: '#000' }}>
                <video
                  ref={videoRef}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  playsInline
                  muted
                />
                {!webcamActive && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}>
                    <Camera size={36} color="var(--text-muted)" />
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Camera stream is initializing...</p>
                    <button className="btn btn-primary btn-sm" onClick={startWebcam}>
                      Grant Camera Access
                    </button>
                  </div>
                )}
              </div>

              <div style={{
                padding: '0.85rem',
                background: 'rgba(15, 23, 42, 0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Align road surface inside camera viewfinder
                </span>
                <button className="btn btn-accent btn-sm" onClick={captureWebcamFrame} disabled={!webcamActive}>
                  <Camera size={14} />
                  Snap Frame
                </button>
              </div>
            </div>
          )}

          {/* Preview of Selected Image */}
          {previewUrl && (
            <div style={{
              borderRadius: 10,
              overflow: 'hidden',
              border: '1px solid var(--border-medium)',
              position: 'relative'
            }}>
              <img
                src={previewUrl}
                alt="Selected road sample"
                style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block' }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(transparent, rgba(15, 23, 42, 0.95))',
                padding: '0.5rem 0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.75rem'
              }}>
                <span style={{ color: '#38bdf8' }}>Image Loaded &amp; Queued for AI Inference</span>
                <button
                  className="btn btn-sm"
                  style={{ padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.1)', color: '#fff' }}
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Telemetry, Geocoding & Dispatch Controls */}
        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={18} color="var(--accent-orange)" />
            Location &amp; Incident Telemetry
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                Latitude
              </label>
              <input
                type="number"
                step="0.0001"
                value={latitude}
                onChange={(e) => setLatitude(parseFloat(e.target.value))}
                className="input-control"
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                Longitude
              </label>
              <input
                type="number"
                step="0.0001"
                value={longitude}
                onChange={(e) => setLongitude(parseFloat(e.target.value))}
                className="input-control"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={fetchCurrentLocation}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%' }}
          >
            <Navigation size={14} />
            Acquire Current Device GPS Coordinates
          </button>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
              Road / Corridor Hint (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. NH-48 Expressway, Inner Ring Road, Vasant Kunj Colony"
              value={roadHint}
              onChange={(e) => setRoadHint(e.target.value)}
              className="input-control"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
              Capture Stream Source
            </label>
            <select
              value={sourceType}
              onChange={(e) => setSourceType(e.target.value)}
              className="input-control"
            >
              <option value="dashcam">Automated Vehicle Dashcam (Front Camera)</option>
              <option value="mobile_camera">Citizen Mobile Camera / Pothole Reporter</option>
              <option value="drone_survey">Municipal Drone Inspection Feed</option>
            </select>
          </div>

          {errorMsg && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 8,
              padding: '0.75rem',
              color: '#fca5a5',
              fontSize: '0.8rem'
            }}>
              {errorMsg}
            </div>
          )}

          {/* Run Inference Action Button */}
          <button
            className="btn btn-accent"
            style={{ padding: '0.85rem', fontSize: '0.95rem', width: '100%', marginTop: 'auto' }}
            onClick={handleSubmitDetection}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <RefreshCw size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                Running YOLO Inference &amp; Resolving Civic Body...
              </>
            ) : (
              <>
                <Send size={18} />
                Run AI Detection &amp; Auto-Report
              </>
            )}
          </button>

          {/* Success Banner */}
          {detectionResult && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 10,
              padding: '1rem',
              marginTop: '0.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <CheckCircle size={18} color="var(--accent-green)" />
                <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#f8fafc' }}>
                  Pothole Successfully Detected &amp; Dispatched!
                </h4>
              </div>

              <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.4 }}>
                <strong>Ticket:</strong> #{detectionResult.pothole?.trackingId}
                <br />
                <strong>Assigned Civic Authority:</strong> {detectionResult.pothole?.assignedAuthority?.name} ({detectionResult.pothole?.assignedAuthority?.id})
                <br />
                <strong>Estimated Severity:</strong> {detectionResult.pothole?.severity} (Score: {detectionResult.pothole?.hazardScore}/100)
                <br />
                <strong>Auto-Dispatch SLA:</strong> {detectionResult.pothole?.assignedAuthority?.escalationSLA}
              </p>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => onViewTicket && onViewTicket(detectionResult.pothole)}
                >
                  Inspect Incident Details
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
