import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Filter, Eye, AlertTriangle, Shield, CheckCircle, Navigation, Layers, Search } from 'lucide-react';
import { searchAddress, getMediaUrl, FALLBACK_ROAD_IMAGE } from '../services/api';

// Fix default Leaflet icon paths in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Helper component to recenter map
function MapFlyTo({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center.length === 2 && !isNaN(center[0]) && !isNaN(center[1])) {
      map.flyTo(center, zoom || 13, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

// Custom Marker Generator with Pulsing Ring for High/Critical Hazards
function createCustomMarker(severity, status) {
  const isResolved = status === 'Resolved';

  let color = '#ef4444'; // Critical
  let pulseClass = 'pulse-critical';

  if (isResolved) {
    color = '#10b981';
    pulseClass = '';
  } else if (severity === 'High') {
    color = '#f97316';
    pulseClass = 'pulse-high';
  } else if (severity === 'Medium') {
    color = '#f59e0b';
    pulseClass = '';
  } else if (severity === 'Low') {
    color = '#10b981';
    pulseClass = '';
  }

  const html = `
    <div class="marker-pulse ${pulseClass}" style="
      width: 32px;
      height: 32px;
      background: #0f172a;
      border: 3px solid ${color};
      box-shadow: 0 0 14px ${color};
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    ">
      <div style="
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: ${color};
      "></div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: html,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18]
  });
}

const DEFAULT_CENTER = [24.6480, 77.3117]; // Guna, Madhya Pradesh

export default function MapView({
  potholes = [],
  selectedPothole,
  onSelectPothole,
  filterSeverity,
  setFilterSeverity,
  filterStatus,
  setFilterStatus,
  filterAuthority,
  setFilterAuthority,
  authorities = {}
}) {
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState(12);
  const [tileMode, setTileMode] = useState('dark'); // 'dark' | 'satellite' | 'streets'
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showHeatmap, setShowHeatmap] = useState(false);

  // If a pothole was selected or created, automatically fly map to it
  useEffect(() => {
    if (selectedPothole && selectedPothole.location?.coordinates) {
      const lat = selectedPothole.location.coordinates[1];
      const lng = selectedPothole.location.coordinates[0];
      setMapCenter([lat, lng]);
      setMapZoom(16);
    }
  }, [selectedPothole]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const results = await searchAddress(searchQuery);
    setSearchResults(results);
  };

  const handleSelectResult = (r) => {
    const lat = parseFloat(r.lat);
    const lon = parseFloat(r.lon);
    setMapCenter([lat, lon]);
    setMapZoom(14);
    setSearchResults([]);
    setSearchQuery('');
  };

  const getTileUrl = () => {
    if (tileMode === 'satellite') {
      return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    }
    if (tileMode === 'streets') {
      return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
    }
    // High-resolution OpenStreetMap Road Network (No API Key Required)
    return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  };

  const filteredPotholes = potholes.filter(p => {
    if (filterSeverity !== 'all' && p.severity !== filterSeverity) return false;
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    if (filterAuthority !== 'all' && p.assignedAuthority?.id !== filterAuthority) return false;
    return true;
  });

  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: 'clamp(480px, 75vh, 720px)', overflow: 'hidden' }}>
      {/* Top Map Control Bar */}
      <div style={{
        padding: '0.85rem 1.25rem',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        background: '#ffffff'
      }}>
        {/* Real Location Search Bar */}
        <div style={{ position: 'relative', width: '100%', maxWidth: 280 }}>
          <form onSubmit={handleSearch} style={{ display: 'flex' }}>
            <input
              type="text"
              placeholder="Search any road / city on map..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-control"
              style={{ fontSize: '0.8rem', padding: '0.45rem 0.75rem', paddingRight: '2rem' }}
            />
            <button
              type="submit"
              style={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <Search size={15} />
            </button>
          </form>

          {searchResults.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '110%',
              left: 0,
              right: 0,
              zIndex: 1000,
              background: '#ffffff',
              border: '1px solid var(--border-medium)',
              borderRadius: 8,
              boxShadow: 'var(--shadow-lg)',
              maxHeight: 180,
              overflowY: 'auto'
            }}>
              {searchResults.map((r, i) => (
                <div
                  key={i}
                  style={{
                    padding: '0.45rem 0.75rem',
                    fontSize: '0.75rem',
                    borderBottom: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    color: '#0f172a'
                  }}
                  onClick={() => handleSelectResult(r)}
                >
                  {r.display_name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="input-control"
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', width: 'auto' }}
          >
            <option value="all">All Severities</option>
            <option value="Critical">Critical Only</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-control"
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', width: 'auto' }}
          >
            <option value="all">All Statuses</option>
            <option value="Reported">Reported</option>
            <option value="Acknowledged">Acknowledged</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          {/* Map Layer Switcher (Dark vs Satellite vs Streets) */}
          <div style={{
            display: 'flex',
            background: '#f1f5f9',
            padding: '0.2rem',
            borderRadius: 6
          }}>
            <button
              className="btn btn-sm"
              style={{
                padding: '0.2rem 0.5rem',
                fontSize: '0.72rem',
                background: tileMode === 'dark' ? '#0284c7' : 'transparent',
                color: tileMode === 'dark' ? '#fff' : 'var(--text-secondary)'
              }}
              onClick={() => setTileMode('dark')}
            >
              Dark Roads
            </button>
            <button
              className="btn btn-sm"
              style={{
                padding: '0.2rem 0.5rem',
                fontSize: '0.72rem',
                background: tileMode === 'satellite' ? '#0284c7' : 'transparent',
                color: tileMode === 'satellite' ? '#fff' : 'var(--text-secondary)'
              }}
              onClick={() => setTileMode('satellite')}
            >
              Satellite
            </button>
            <button
              className="btn btn-sm"
              style={{
                padding: '0.2rem 0.5rem',
                fontSize: '0.72rem',
                background: tileMode === 'streets' ? '#0284c7' : 'transparent',
                color: tileMode === 'streets' ? '#fff' : 'var(--text-secondary)'
              }}
              onClick={() => setTileMode('streets')}
            >
              Street Map
            </button>
          </div>
        </div>
      </div>

      {/* Map Canvas */}
      <div style={{ flex: 1, position: 'relative' }}>
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={12}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <MapFlyTo center={mapCenter} zoom={mapZoom} />

          <TileLayer
            attribution='&copy; <a href="https://openstreetmap.org">OSM</a>'
            url={getTileUrl()}
          />

          {/* Pothole Markers */}
          {filteredPotholes.map((pothole) => {
            const lat = pothole.location.coordinates[1];
            const lng = pothole.location.coordinates[0];

            return (
              <Marker
                key={pothole._id || pothole.trackingId}
                position={[lat, lng]}
                icon={createCustomMarker(pothole.severity, pothole.status)}
                eventHandlers={{
                  click: () => {
                    if (onSelectPothole) onSelectPothole(pothole);
                  }
                }}
              >
                <Popup>
                  <div style={{ width: 280 }}>
                    {/* Thumbnail */}
                    <div style={{
                      height: 130,
                      borderRadius: 8,
                      overflow: 'hidden',
                      marginBottom: '0.6rem',
                      background: '#1e293b',
                      position: 'relative'
                    }}>
                      <img
                        src={getMediaUrl(pothole.images?.annotatedUrl || pothole.images?.originalUrl)}
                        alt="Pothole"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          if (e.target.src !== FALLBACK_ROAD_IMAGE && !e.target.src.endsWith(FALLBACK_ROAD_IMAGE)) {
                            e.target.src = FALLBACK_ROAD_IMAGE;
                          }
                        }}
                      />
                      <span className="badge badge-critical" style={{
                        position: 'absolute',
                        top: 6,
                        right: 6,
                        boxShadow: '0 2px 6px rgba(0,0,0,0.5)'
                      }}>
                        {pothole.severity} ({pothole.hazardScore || 50}/100)
                      </span>
                    </div>

                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.2rem' }}>
                      {pothole.address?.road || pothole.title}
                    </h4>

                    <p style={{ fontSize: '0.74rem', color: '#94a3b8', marginBottom: '0.4rem' }}>
                      {pothole.address?.displayName || `${lat}, ${lng}`}
                    </p>

                    <div style={{
                      padding: '0.4rem 0.6rem',
                      borderRadius: 6,
                      background: 'rgba(14, 165, 233, 0.1)',
                      border: '1px solid rgba(14, 165, 233, 0.25)',
                      marginBottom: '0.6rem',
                      fontSize: '0.74rem'
                    }}>
                      <span style={{ color: 'var(--text-muted)' }}>Assigned Authority:</span>
                      <div style={{ fontWeight: 700, color: '#38bdf8' }}>
                        {pothole.assignedAuthority?.name}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      style={{ width: '100%' }}
                      onClick={() => onSelectPothole(pothole)}
                    >
                      <Eye size={14} />
                      Inspect Official Grievance Ticket
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Legend */}
        <div style={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          zIndex: 500,
          background: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(10px)',
          padding: '0.75rem 1rem',
          borderRadius: 8,
          border: '1px solid var(--border-subtle)',
          fontSize: '0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem'
        }}>
          <div style={{ fontWeight: 700, color: '#f8fafc' }}>Road Defect Pins</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 6px #ef4444' }} />
            <span>Critical (Expressway / High Speed)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f97316' }} />
            <span>High Severity (City Arterial)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
            <span>Medium (Colony Street)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
            <span>Repaired &amp; Resolved</span>
          </div>
        </div>
      </div>
    </div>
  );
}
