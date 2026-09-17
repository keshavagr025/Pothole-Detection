import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Calendar,
  AlertTriangle,
  Building2,
  ExternalLink,
  CheckCircle2,
  Clock,
  Send,
  FileText,
  Shield,
  Upload,
  Layers,
  Printer,
  User,
  LogIn
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { updatePotholeStatus } from '../services/api';
import OfficialFormVIIModal from './OfficialFormVIIModal';
import { useAuth } from '../context/AuthContext';

export default function TicketDetailModal({ pothole, onClose, onUpdated }) {
  if (!pothole) return null;

  const { user, isAuthenticated, isOfficer, openAuthModal } = useAuth();

  const [showFormVII, setShowFormVII] = useState(false);
  const [activeImageTab, setActiveImageTab] = useState('annotated'); // 'annotated' | 'original' | 'resolved'
  const [newStatus, setNewStatus] = useState(pothole.status);
  const [officerNotes, setOfficerNotes] = useState('');
  const [officerName, setOfficerName] = useState(() => {
    if (user) {
      return user.department
        ? `${user.name} (${user.department})`
        : `${user.name} (${user.role.toUpperCase()})`;
    }
    return 'Assistant Engineer (Road Maintenance)';
  });
  const [proofFile, setProofFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    if (user) {
      setOfficerName(
        user.department
          ? `${user.name} (${user.department}${user.badgeNumber ? ` #${user.badgeNumber}` : ''})`
          : `${user.name} (${user.role.toUpperCase()})`
      );
    }
  }, [user]);

  const lat = pothole.location?.coordinates?.[1];
  const lng = pothole.location?.coordinates?.[0];
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  const getSeverityBadgeClass = (sev) => {
    if (sev === 'Critical') return 'badge-critical';
    if (sev === 'High') return 'badge-high';
    if (sev === 'Medium') return 'badge-medium';
    return 'badge-low';
  };

  const getStatusBadgeClass = (status) => {
    if (status === 'Resolved') return 'badge-status-resolved';
    if (status === 'In Progress') return 'badge-status-in-progress';
    if (status === 'Acknowledged') return 'badge-status-acknowledged';
    return 'badge-status-reported';
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const formData = new FormData();
      formData.append('status', newStatus);
      formData.append('notes', officerNotes);
      formData.append('updatedBy', officerName);
      if (proofFile) {
        formData.append('proofImage', proofFile);
      }

      const res = await updatePotholeStatus(pothole._id || pothole.trackingId, formData);
      setIsSubmitting(false);
      setStatusMessage(`Status transitioned to ${newStatus} successfully.`);

      if (newStatus === 'Resolved') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      if (onUpdated) {
        onUpdated(res.pothole);
      }
    } catch (err) {
      setIsSubmitting(false);
      setStatusMessage(`Error: ${err.response?.data?.error || err.message}`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: 960,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: '#ffffff',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-lg)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{
          padding: '1rem 1.25rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#f8fafc',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '1.15rem', color: 'var(--accent-cyan)' }}>
              #{pothole.trackingId}
            </span>
            <span className={`badge ${getSeverityBadgeClass(pothole.severity)}`}>
              {pothole.severity} ({pothole.hazardScore || 50}/100)
            </span>
            <span className={`badge ${getStatusBadgeClass(pothole.status)}`}>
              {pothole.status}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-sm"
              style={{
                background: '#002147',
                color: '#ffffff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontWeight: 800,
                padding: '0.35rem 0.75rem'
              }}
              onClick={() => setShowFormVII(true)}
              title="Generate Official Form-VII Road Distress Repair Mandate"
            >
              <FileText size={14} color="#fde047" />
              प्रपत्र-VII Work Order
            </button>

            <button className="btn btn-secondary btn-sm" onClick={handlePrint} title="Print Civic Notice">
              <Printer size={14} />
              Print
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '0.25rem',
                borderRadius: 6
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Statutory Citizen Charter SLA Strip */}
        <div style={{
          background: '#eff6ff',
          borderBottom: '1px solid #bfdbfe',
          padding: '0.45rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.78rem',
          color: '#1e3a8a',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Shield size={14} color="#0284c7" />
            <span><strong>नागरिक अधिकार पत्र • Statutory SLA:</strong> {pothole.assignedAuthority?.id === 'NHAI' ? '24 Hours (National Highway Mandate)' : (pothole.assignedAuthority?.id === 'PWD' ? '48 Hours (State Arterial Mandate)' : '72 Hours (Municipal Ward Mandate)')}</span>
          </div>
          <span style={{ fontWeight: 800, color: '#002147', fontSize: '0.72rem', letterSpacing: '0.04em' }}>
            PUBLIC GRIEVANCE REDRESSAL ACT COMPLIANT
          </span>
        </div>

        {/* Modal Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 'clamp(1rem, 3vw, 1.5rem)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Top Row: Visual Evidence vs Civic Authority Resolution */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.25rem' }}>
            {/* Visual Evidence Viewer */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Visual Incident Evidence
                </h4>

                {/* Tab Switcher */}
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <button
                    className="btn btn-sm"
                    style={{
                      padding: '0.2rem 0.55rem',
                      fontSize: '0.75rem',
                      background: activeImageTab === 'annotated' ? 'var(--accent-cyan)' : 'var(--bg-surface)',
                      color: activeImageTab === 'annotated' ? '#fff' : 'var(--text-secondary)'
                    }}
                    onClick={() => setActiveImageTab('annotated')}
                  >
                    AI Bounding Box
                  </button>
                  <button
                    className="btn btn-sm"
                    style={{
                      padding: '0.2rem 0.55rem',
                      fontSize: '0.75rem',
                      background: activeImageTab === 'original' ? 'var(--accent-cyan)' : 'var(--bg-surface)',
                      color: activeImageTab === 'original' ? '#fff' : 'var(--text-secondary)'
                    }}
                    onClick={() => setActiveImageTab('original')}
                  >
                    Original Photo
                  </button>
                  {pothole.images?.resolutionProofUrl && (
                    <button
                      className="btn btn-sm"
                      style={{
                        padding: '0.2rem 0.55rem',
                        fontSize: '0.75rem',
                        background: activeImageTab === 'resolved' ? 'var(--accent-green)' : 'var(--bg-surface)',
                        color: activeImageTab === 'resolved' ? '#fff' : 'var(--text-secondary)'
                      }}
                      onClick={() => setActiveImageTab('resolved')}
                    >
                      Repaired Proof
                    </button>
                  )}
                </div>
              </div>

              {/* Image Container */}
              <div style={{
                height: 260,
                borderRadius: 10,
                overflow: 'hidden',
                background: '#0b1329',
                border: '1px solid var(--border-medium)',
                position: 'relative'
              }}>
                <img
                  src={
                    activeImageTab === 'resolved' && pothole.images?.resolutionProofUrl
                      ? pothole.images.resolutionProofUrl
                      : activeImageTab === 'annotated'
                      ? pothole.images?.annotatedUrl || pothole.images?.originalUrl
                      : pothole.images?.originalUrl
                  }
                  alt="Incident Visual Evidence"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  onError={(e) => {
                    if (pothole.images?.originalUrl && e.target.src !== pothole.images.originalUrl) {
                      e.target.src = pothole.images.originalUrl;
                    }
                  }}
                />

                {/* Direct SVG Bounding Box Layer when AI Bounding Box tab is active */}
                {activeImageTab === 'annotated' && pothole.detections && pothole.detections.length > 0 && (
                  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 100 100" preserveAspectRatio="none">
                    {pothole.detections.map((det, idx) => {
                      const b = det.bboxNormalized;
                      if (!b || b.length < 4) return null;
                      const x = b[0] * 100;
                      const y = b[1] * 100;
                      const w = (b[2] - b[0]) * 100;
                      const h = (b[3] - b[1]) * 100;
                      const boxColor = pothole.severity === 'Critical' ? '#ef4444' : '#ff6b35';

                      return (
                        <g key={idx}>
                          <rect
                            x={x}
                            y={y}
                            width={w}
                            height={h}
                            fill="rgba(239, 68, 68, 0.22)"
                            stroke={boxColor}
                            strokeWidth="1.2"
                            strokeDasharray="3 1"
                            rx="1"
                          />
                          <rect x={x} y={Math.max(1, y - 7)} width="34" height="6.5" fill={boxColor} rx="1" />
                          <text x={x + 1.5} y={Math.max(5.5, y - 2)} fill="#ffffff" fontSize="4.5" fontWeight="bold" fontFamily="monospace">
                            POTHOLE #{idx + 1} {(det.confidence ? (det.confidence * 100).toFixed(0) : 85)}%
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                )}

                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'rgba(15, 23, 42, 0.85)',
                  padding: '0.4rem 0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.75rem',
                  fontFamily: 'monospace'
                }}>
                  <span>AI MODEL: {pothole.aiModel || 'YOLOv8'}</span>
                  <span style={{ color: 'var(--accent-cyan)' }}>
                    {pothole.detections?.length || 1} Pothole(s) Identified
                  </span>
                </div>
              </div>

              {/* AI Detection Metrics */}
              <div style={{
                marginTop: '0.65rem',
                padding: '0.75rem',
                borderRadius: 8,
                background: 'rgba(255, 255, 255, 0.03)',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.4
              }}>
                {pothole.severityDetails || 'Pothole identified on roadway surface with high hazard probability.'}
              </div>
            </div>

            {/* Civic Authority Card */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Designated Civic Body &amp; Jurisdiction
              </h4>

              <div style={{
                padding: '1rem',
                borderRadius: 10,
                background: 'rgba(14, 165, 233, 0.08)',
                border: '1px solid rgba(14, 165, 233, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Building2 size={20} color="var(--accent-cyan)" />
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc' }}>
                      {pothole.assignedAuthority?.name || 'Municipal Road Wing'}
                    </h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {pothole.assignedAuthority?.department || 'Department of Urban Roads'}
                    </p>
                  </div>
                </div>

                <div style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: 6,
                  background: 'rgba(0,0,0,0.25)',
                  fontSize: '0.76rem',
                  color: '#cbd5e1',
                  marginTop: '0.25rem'
                }}>
                  <strong>Jurisdiction Reason:</strong> {pothole.assignedAuthority?.jurisdictionReason || 'Assigned based on road classification hierarchy and GPS boundaries.'}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.25rem', fontSize: '0.76rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Official Grievance Email:</span>
                    <br />
                    <strong style={{ color: 'var(--accent-cyan)' }}>{pothole.assignedAuthority?.email || 'roads@municipal.gov.in'}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Emergency Helpline:</span>
                    <br />
                    <strong style={{ color: '#f8fafc' }}>{pothole.assignedAuthority?.helpline || '1916'}</strong>
                  </div>
                </div>

                <div style={{ marginTop: '0.25rem', fontSize: '0.76rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Escalation SLA Target:</span>
                  <br />
                  <span style={{ color: '#fde047', fontWeight: 600 }}>{pothole.assignedAuthority?.escalationSLA || '48 Hours'}</span>
                </div>
              </div>

              {/* Location Details & Navigation */}
              <div style={{
                padding: '1rem',
                borderRadius: 10,
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.8rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <MapPin size={15} color="var(--accent-orange)" />
                    {pothole.address?.road || 'Roadway Corridor'}
                  </span>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
                  >
                    Google Maps
                    <ExternalLink size={12} />
                  </a>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', lineHeight: 1.3 }}>
                  {pothole.address?.displayName || `${lat?.toFixed(5)}, ${lng?.toFixed(5)}`}
                </p>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>Coordinates: {lat?.toFixed(5)}, {lng?.toFixed(5)}</span>
                  <span>Source: {pothole.source || 'dashcam'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Status Transition Management & Audit Timeline */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
            {/* Status Transition Action Panel */}
            <div style={{
              padding: '1.25rem',
              borderRadius: 10,
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid var(--border-medium)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem'
            }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} color="var(--accent-yellow)" />
                Update Ticket Lifecycle Status
              </h4>

              <form onSubmit={handleStatusSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                    Target Resolution Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="input-control"
                  >
                    <option value="Reported">Reported (Pending Nodal Review)</option>
                    <option value="Acknowledged">Acknowledged (Work Order Assigned)</option>
                    <option value="In Progress">In Progress (Squad Deployed On-Site)</option>
                    <option value="Resolved">Resolved (Repair Verified &amp; Sealed)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                    Officer / Executive Name
                  </label>
                  <input
                    type="text"
                    value={officerName}
                    onChange={(e) => setOfficerName(e.target.value)}
                    className="input-control"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                    Resolution Remarks / Work Order Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Patching crew deployed; cold-mix asphalt rolled and leveled."
                    value={officerNotes}
                    onChange={(e) => setOfficerNotes(e.target.value)}
                    className="input-control"
                    style={{ resize: 'vertical' }}
                  />
                </div>

                {newStatus === 'Resolved' && (
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                      Upload Repaired Proof Photo (Optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProofFile(e.target.files[0])}
                      className="input-control"
                    />
                  </div>
                )}

                {statusMessage && (
                  <div style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: 6,
                    background: statusMessage.includes('Error') ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                    fontSize: '0.75rem',
                    color: statusMessage.includes('Error') ? '#fca5a5' : '#6ee7b7'
                  }}>
                    {statusMessage}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '0.25rem' }}
                  disabled={isSubmitting}
                >
                  <Send size={15} />
                  {isSubmitting ? 'Recording Resolution...' : 'Commit Status Transition'}
                </button>
              </form>
            </div>

            {/* Audit History Timeline */}
            <div style={{
              padding: '1.25rem',
              borderRadius: 10,
              background: 'rgba(15, 23, 42, 0.5)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={16} color="var(--accent-cyan)" />
                Audit Trail &amp; Dispatch Timeline
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: 240, overflowY: 'auto', paddingRight: '0.3rem' }}>
                {(pothole.statusHistory || []).map((h, idx) => (
                  <div key={idx} style={{
                    padding: '0.6rem 0.85rem',
                    borderRadius: 8,
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderLeft: `3px solid ${h.status === 'Resolved' ? '#10b981' : (h.status === 'In Progress' ? '#f59e0b' : '#38bdf8')}`,
                    fontSize: '0.78rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f8fafc', fontWeight: 600 }}>
                      <span>{h.status}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                        {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(h.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem', fontSize: '0.75rem' }}>
                      {h.notes}
                    </p>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                      By: {h.updatedBy}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showFormVII && (
        <OfficialFormVIIModal
          pothole={pothole}
          onClose={() => setShowFormVII(false)}
        />
      )}
    </div>
  );
}
